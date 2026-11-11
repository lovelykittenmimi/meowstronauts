#!/usr/bin/env node
/**
 * Pre-hackathon NASA data snapshot fetcher.
 *
 * This script only prepares offline data (allowed before the hackathon):
 *   - DONKI CME / FLR / GST events (default: last 30 days; custom window supported)
 *   - Curiosity REMS weather (default: the recent 2025-05-08..05-22 cold
 *     window, core 7 sols rank 52/4,547; --weather-mode=latest for the newest
 *     sols; 2019-08-15..08-29 is kept as a historical comparison)
 *   - 6 real Mars surface photos from NASA Image Library
 *
 * It does NOT contain any game logic and is not part of the game bundle.
 *
 * Usage:
 *   node scripts/fetch-snapshots.mjs
 *   NASA_API_KEY=xxxx node scripts/fetch-snapshots.mjs
 *   node scripts/fetch-snapshots.mjs --out=src/data --photos=6 --days=30
 *   node scripts/fetch-snapshots.mjs --cme-file=raw/donki-cme.json --days=10 --end-date=2026-11-11
 *   node scripts/fetch-snapshots.mjs --start-date=2024-05-08 --end-date=2024-05-14
 *   node scripts/fetch-snapshots.mjs --weather-file=scripts/raw/msl-weather-2026-11-11.json
 *   node scripts/fetch-snapshots.mjs --weather-mode=latest
 *   node scripts/fetch-snapshots.mjs --weather-start=2025-05-08 --weather-end=2025-05-22
 *   node scripts/fetch-snapshots.mjs --weather-only --weather-file=scripts/raw/msl-weather-2026-11-11.json
 *   node scripts/fetch-snapshots.mjs --spaceweather-only \
 *     --start-date=2025-05-13 --end-date=2025-05-17 \
 *     --cme-file=scripts/raw/donki-cme-2025-05.json \
 *     --flr-file=scripts/raw/donki-flr-2025-05.json \
 *     --gst-file=scripts/raw/donki-gst-2025-05.json
 *
 * If api.nasa.gov rate-limits DEMO_KEY, apply for a free key at
 * https://api.nasa.gov and set NASA_API_KEY, or pass a previously saved
 * DONKI array with --cme-file / --flr-file / --gst-file.
 *
 * Output (default src/data/):
 *   spaceweather.snapshot.json
 *   mars-weather.snapshot.json
 *   mars-photos/metadata.json
 *   mars-photos/<NASA_ID>.jpg
 *   snapshots.manifest.json
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const args = new Map();
for (let i = 2; i < process.argv.length; i++) {
  const token = process.argv[i];
  if (!token.startsWith('--')) continue;
  const [key, inlineValue] = token.slice(2).split('=');
  if (inlineValue !== undefined) {
    args.set(key, inlineValue);
  } else if (process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) {
    args.set(key, process.argv[++i]);
  } else {
    // Boolean flag; do not swallow the next option.
    args.set(key, true);
  }
}

const OUT_DIR = resolve(args.get('out') ?? 'src/data');
const API_KEY = args.get('api-key') ?? process.env.NASA_API_KEY ?? 'DEMO_KEY';
const PHOTO_LIMIT = Math.max(1, Number(args.get('photos') ?? 6));
const FETCHED_AT = new Date().toISOString();
const DAY_MS = 86_400_000;
const DONKI_DAYS = Math.max(1, Number(args.get('days') ?? 30));
const DONKI_START = args.get('start-date') ?? null;
const WEATHER_SOLS = 14;
// Default: a recent, credible cold spell in the Curiosity archive. The core
// 7 sols (2025-05-15..05-22; 2025-05-18 missing) average -29.7 C daytime high,
// rank 52/4,547 (top 1.1%). The 2019-08-22..29 window is colder (rank 4/4,547)
// and remains documented as a historical comparison, but it is seven years old.
const DEFAULT_WEATHER_WINDOW = { start: '2025-05-08', end: '2025-05-22' };
const WEATHER_CORE_SOLS = 7;
const WEATHER_FILE = args.get('weather-file') ?? null;
const WEATHER_START = args.get('weather-start') ?? null;
const WEATHER_END = args.get('weather-end') ?? null;
const WEATHER_MODE =
  args.get('weather-mode') ?? (WEATHER_START || WEATHER_END ? 'custom' : 'cold-week');
const WEATHER_ONLY = args.has('weather-only');
const SPACEWEATHER_ONLY = args.has('spaceweather-only');
const USER_AGENT = 'meowstronauts-mars-outpost/0.1 (NASA Space Apps data prep)';
const DONKI_FILES = {
  cme: args.get('cme-file') ?? null,
  flr: args.get('flr-file') ?? null,
  gst: args.get('gst-file') ?? null,
};

const errors = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function num(value) {
  if (value === null || value === undefined || value === '--') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function percentile(values, p) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * p)));
  return sorted[index];
}

function average(values) {
  const usable = values.filter(Number.isFinite);
  return usable.length ? usable.reduce((sum, value) => sum + value, 0) / usable.length : null;
}

const round1 = (value) => (Number.isFinite(value) ? Math.round(value * 10) / 10 : null);
const round2 = (value) => (Number.isFinite(value) ? Math.round(value * 100) / 100 : null);

function missingDatesBetween(sols, start, end) {
  if (!start || !end) return [];
  const present = new Set(sols.map((s) => s.terrestrialDate));
  const missing = [];
  for (
    let time = Date.parse(`${start}T00:00:00Z`);
    time <= Date.parse(`${end}T00:00:00Z`);
    time += DAY_MS
  ) {
    const date = new Date(time).toISOString().slice(0, 10);
    if (!present.has(date)) missing.push(date);
  }
  return missing;
}

async function fetchJson(url, { tries = 3 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': USER_AGENT, accept: 'application/json' },
      });
      if (res.status === 429) {
        throw new Error(
          'HTTP 429 rate limit (DEMO_KEY is shared and exhausted; set NASA_API_KEY or use --cme-file/--flr-file/--gst-file)',
        );
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const text = await res.text();
      if (!text.trim()) return null;
      return JSON.parse(text);
    } catch (error) {
      lastError = error;
      if (attempt < tries) await sleep(600 * attempt);
    }
  }
  throw new Error(`${url} -> ${lastError?.message ?? 'unknown error'}`);
}

async function downloadImage(url, filePath) {
  const res = await fetch(url, { headers: { 'user-agent': USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`not an image (${contentType || 'unknown content-type'})`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 1024) throw new Error(`image too small (${buffer.length} bytes)`);
  await writeFile(filePath, buffer);
  return { bytes: buffer.length, contentType };
}

const isoDay = (date) => date.toISOString().slice(0, 10);

/* ------------------------------------------------------------------ */
/* DONKI                                                               */
/* ------------------------------------------------------------------ */

function donkiUrl(path, startDate, endDate) {
  const url = new URL(`https://api.nasa.gov/DONKI/${path}`);
  url.searchParams.set('startDate', startDate);
  url.searchParams.set('endDate', endDate);
  url.searchParams.set('api_key', API_KEY);
  return url.toString();
}

function normalizeCme(event) {
  const analyses = Array.isArray(event.cmeAnalyses) ? event.cmeAnalyses : [];
  const best = analyses.find((a) => a.isMostAccurate) ?? analyses[0];
  return {
    id: event.activityID ?? null,
    startTime: event.startTime ?? null,
    sourceLocation: event.sourceLocation ?? null,
    activeRegionNum: event.activeRegionNum ?? null,
    instruments: (event.instruments ?? []).map((i) => i.displayName).filter(Boolean),
    speedKms: num(best?.speed),
    halfAngleDeg: num(best?.halfAngle),
    type: best?.type ?? null,
    note: (event.note ?? '').replace(/\s+/g, ' ').slice(0, 400) || null,
    linkedEvents: (event.linkedEvents ?? []).map((l) => l.activityID).filter(Boolean),
  };
}

function normalizeFlr(event) {
  return {
    id: event.flrID ?? null,
    beginTime: event.beginTime ?? null,
    peakTime: event.peakTime ?? null,
    endTime: event.endTime ?? null,
    classType: event.classType ?? null,
    sourceLocation: event.sourceLocation ?? null,
    activeRegionNum: event.activeRegionNum ?? null,
    linkedEvents: (event.linkedEvents ?? []).map((l) => l.activityID).filter(Boolean),
  };
}

function normalizeGst(event) {
  const kpIndex = (event.allKpIndex ?? [])
    .map((k) => ({ time: k.observedTime ?? null, kp: num(k.kpIndex), source: k.source ?? null }))
    .filter((k) => k.kp !== null);
  const maxKp = kpIndex.length ? Math.max(...kpIndex.map((k) => k.kp)) : null;
  return {
    id: event.gstID ?? null,
    startTime: event.startTime ?? null,
    maxKp,
    kpIndex,
    linkedEvents: (event.linkedEvents ?? []).map((l) => l.activityID).filter(Boolean),
  };
}

const FLARE_LETTERS = { A: 1, B: 2, C: 3, M: 4, X: 5 };

function flareRank(classType) {
  const match = /^([ABCMX])\s*([0-9]+(?:\.[0-9]+)?)/i.exec(classType ?? '');
  if (!match) return null;
  return FLARE_LETTERS[match[1].toUpperCase()] * 100 + Number(match[2]);
}

// A deliberately conservative, transparent label. The game must not call an
// event a "strong solar storm" unless the data supports it.
function assessStorm({ cme, flr, gst }) {
  const rankedFlares = flr
    .filter((f) => flareRank(f.classType) !== null)
    .sort((a, b) => flareRank(b.classType) - flareRank(a.classType));
  const maxFlare = rankedFlares[0] ?? null;
  const flareValue = maxFlare ? Number(/^[ABCMX]\s*([0-9.]+)/i.exec(maxFlare.classType)?.[1] ?? 0) : null;
  const strongFlare = Boolean(
    maxFlare &&
      (maxFlare.classType.toUpperCase().startsWith('X') ||
        (maxFlare.classType.toUpperCase().startsWith('M') && flareValue >= 5)),
  );

  const kpValues = gst.map((g) => g.maxKp).filter(Number.isFinite);
  const maxKp = kpValues.length ? Math.max(...kpValues) : null;
  const strongGeomagneticStorm = maxKp !== null && maxKp >= 7;

  const speeds = cme.map((c) => c.speedKms).filter(Number.isFinite);
  const fastestCmeKms = speeds.length ? Math.max(...speeds) : null;
  const halfAngles = cme.map((c) => c.halfAngleDeg).filter(Number.isFinite);
  const widestCmeHalfAngleDeg = halfAngles.length ? Math.max(...halfAngles) : null;
  const missingFlrGst = flr.length === 0 || gst.length === 0;
  const strongStormConfirmed = strongFlare || strongGeomagneticStorm;

  const cmeShape =
    widestCmeHalfAngleDeg === null
      ? ''
      : widestCmeHalfAngleDeg < 90
        ? ` (widest half-angle ${widestCmeHalfAngleDeg}°; no halo CME)`
        : ` (widest half-angle ${widestCmeHalfAngleDeg}°)`;

  let summary;
  if (strongStormConfirmed) {
    summary = strongGeomagneticStorm
      ? `Confirmed strong event: flare ${maxFlare?.classType ?? 'n/a'}, max Kp ${maxKp ?? 'n/a'}.`
      : `Confirmed strong flare (${maxFlare?.classType ?? 'n/a'}); geomagnetic response max Kp ${maxKp ?? 'n/a'} ` +
        'is below the Kp >= 7 threshold. Call it a strong solar flare, not a strong geomagnetic storm.';
  } else if (missingFlrGst) {
    summary =
      `Not confirmed: FLR/GST data is missing. Fastest CME ${fastestCmeKms ?? 'n/a'} km/s${cmeShape}. ` +
      'A fast CME is not by itself a strong storm.';
  } else {
    summary =
      `Not a strong storm by these thresholds: flare ${maxFlare?.classType ?? 'none'}, ` +
      `max Kp ${maxKp ?? 'n/a'}.`;
  }

  return {
    strongStormConfirmed,
    strongFlare,
    strongGeomagneticStorm,
    maxFlareClass: maxFlare?.classType ?? null,
    maxKp,
    fastestCmeKms,
    widestCmeHalfAngleDeg,
    missingFlrGst,
    thresholds: 'strong flare = X-class or M5+; strong geomagnetic storm = Kp >= 7',
    summary,
  };
}

async function fetchDonki(startDate, endDate, files) {
  const endpoints = [
    ['cme', 'CME', normalizeCme, (e) => e.startTime],
    ['flr', 'FLR', normalizeFlr, (e) => e.beginTime],
    ['gst', 'GST', normalizeGst, (e) => e.startTime],
  ];
  const result = { cme: [], flr: [], gst: [], cachedFiles: [] };
  for (const [key, path, normalize, timeOf] of endpoints) {
    try {
      let raw;
      const cached = files[key];
      if (cached) {
        raw = JSON.parse(await readFile(resolve(cached), 'utf8'));
        result.cachedFiles.push(cached);
      } else {
        raw = await fetchJson(donkiUrl(path, startDate, endDate));
      }
      const events = Array.isArray(raw) ? raw : [];
      result[key] = events
        .filter((e) => e && timeOf(e))
        .sort((a, b) => String(timeOf(b)).localeCompare(String(timeOf(a))))
        .slice(0, 20)
        .map(normalize);
      console.log(
        `  DONKI ${path}: ${events.length} event(s)${cached ? ` from ${cached}` : ''}, kept ${result[key].length}`,
      );
    } catch (error) {
      result[key] = [];
      errors.push(`DONKI ${path}: ${error.message}`);
      console.warn(`  DONKI ${path}: failed (${error.message})`);
    }
    if (!files[key]) await sleep(400);
  }
  return result;
}

/* ------------------------------------------------------------------ */
/* Mars weather (Curiosity / MSL REMS outreach feed)                   */
/* ------------------------------------------------------------------ */

async function fetchMarsWeather() {
  if (!['latest', 'cold-week', 'custom'].includes(WEATHER_MODE)) {
    throw new Error(`invalid --weather-mode=${WEATHER_MODE}; use latest, cold-week, or custom`);
  }
  const sourceUrl = 'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json';
  const raw = WEATHER_FILE
    ? JSON.parse(await readFile(resolve(WEATHER_FILE), 'utf8'))
    : await fetchJson(sourceUrl);
  const soles = Array.isArray(raw?.soles) ? raw.soles : [];
  if (!soles.length) throw new Error('weather feed returned no soles');

  const valid = soles
    .filter((s) => s && s.terrestrial_date && num(s.min_temp) !== null && num(s.max_temp) !== null)
    .map((s) => ({
      sol: num(s.sol),
      terrestrialDate: s.terrestrial_date,
      season: s.season ?? null,
      minTempC: num(s.min_temp),
      maxTempC: num(s.max_temp),
      minGroundTempC: num(s.min_gts_temp),
      maxGroundTempC: num(s.max_gts_temp),
      pressurePa: num(s.pressure),
      pressureTrend: s.pressure_string ?? null,
      opacity: s.atmo_opacity ?? null,
      sunrise: s.sunrise ?? null,
      sunset: s.sunset ?? null,
      windSpeedMs: num(s.wind_speed),
    }))
    .sort((a, b) => a.terrestrialDate.localeCompare(b.terrestrialDate));

  if (valid.length < WEATHER_SOLS) {
    throw new Error(`weather feed returned only ${valid.length} valid sols`);
  }

  // Archive-wide thresholds, so a genuinely cold week is labelled cold even
  // when every day in the chosen window is cold. These are not NASA classes.
  const maxTemps = valid.map((s) => s.maxTempC);
  const pressures = valid.map((s) => s.pressurePa);
  const thresholds = {
    maxTempC: {
      p1: percentile(maxTemps, 0.01),
      p10: percentile(maxTemps, 0.1),
      p90: percentile(maxTemps, 0.9),
    },
    pressurePa: { p10: percentile(pressures, 0.1) },
  };

  let sols;
  let selection;
  if (WEATHER_MODE === 'latest') {
    sols = valid.slice(-WEATHER_SOLS).map((s) => ({ ...s }));
    selection = {
      mode: 'latest',
      requestedWindow: null,
      description: `Latest ${WEATHER_SOLS} valid sols in the feed.`,
    };
  } else {
    const start = WEATHER_START ?? DEFAULT_WEATHER_WINDOW.start;
    const end = WEATHER_END ?? DEFAULT_WEATHER_WINDOW.end;
    sols = valid
      .filter((s) => s.terrestrialDate >= start && s.terrestrialDate <= end)
      .map((s) => ({ ...s }));
    if (!sols.length) throw new Error(`no valid sols between ${start} and ${end}`);
    selection = {
      mode: WEATHER_MODE,
      requestedWindow: { start, end },
      description:
        WEATHER_MODE === 'custom'
          ? `Custom historical window ${start}..${end}. Real Curiosity observations, not the latest weather and not a forecast.`
          : 'Historical cold window chosen for the game opening. Real Curiosity observations, not the latest weather and not a forecast.',
      ...(start === DEFAULT_WEATHER_WINDOW.start && end === DEFAULT_WEATHER_WINDOW.end
        ? {
            whyThisWindow:
              'The last 7 sols (2025-05-15..2025-05-22; 2025-05-18 is missing) average -29.7 C daytime high, in the coldest 1.1% of 4,547 7-sol windows. ' +
              'The coldest day in that window, 2025-05-16, reached -33 C (rank 17/4,717, top 0.3%). ' +
              'This is a recent, sustained cold spell: 2025-05-13..05-20 daytime highs were -24, -27, -29, -33, -31, -31, -28 C. ' +
              'The 2019-08-22..29 window is colder (4th of 4,547) and is kept as a historical comparison. ' +
              'Do not use the isolated 2026-01-10 -59 C reading: neighbouring days were +7/+1 C and it is treated as a sensor/archive artifact.',
          }
        : {}),
    };
  }

  for (const s of sols) {
    const tags = [];
    if (thresholds.maxTempC.p10 !== null && s.maxTempC !== null && s.maxTempC <= thresholds.maxTempC.p10) {
      tags.push('cold_snap');
    }
    if (thresholds.maxTempC.p1 !== null && s.maxTempC !== null && s.maxTempC <= thresholds.maxTempC.p1) {
      tags.push('severe_cold');
    }
    if (thresholds.maxTempC.p90 !== null && s.maxTempC !== null && s.maxTempC >= thresholds.maxTempC.p90) {
      tags.push('warm_day');
    }
    if (thresholds.pressurePa.p10 !== null && s.pressurePa !== null && s.pressurePa <= thresholds.pressurePa.p10) {
      tags.push('pressure_drop');
    }
    s.gameplayTags = tags;
    s.maxTempPercentile = round1(
      (maxTemps.filter((value) => value < s.maxTempC).length / maxTemps.length) * 100,
    );
  }

  // Rank the final 7 sols (the game's run length) against every 7-sol window
  // in the archive. Allow one missing terrestrial date inside a window.
  const core = sols.slice(-WEATHER_CORE_SOLS);
  const windows = [];
  for (let i = 0; i + WEATHER_CORE_SOLS <= valid.length; i++) {
    const window = valid.slice(i, i + WEATHER_CORE_SOLS);
    if (window[window.length - 1].sol - window[0].sol > WEATHER_CORE_SOLS + 1) continue;
    windows.push({
      start: window[0].terrestrialDate,
      end: window[window.length - 1].terrestrialDate,
      avgMaxTempC: average(window.map((s) => s.maxTempC)),
      avgMinTempC: average(window.map((s) => s.minTempC)),
    });
  }
  windows.sort((a, b) => a.avgMaxTempC - b.avgMaxTempC);
  const coreStart = core[0]?.terrestrialDate ?? null;
  const coreEnd = core[core.length - 1]?.terrestrialDate ?? null;
  const coreAvgMax = average(core.map((s) => s.maxTempC));
  // Tie-aware competition rank: every window at the same temperature shares
  // the rank, so the result does not depend on archive order. The 2025 window
  // has 14 tied windows; a positional rank would misleadingly say 64th.
  const colderWindows =
    coreAvgMax === null
      ? null
      : windows.filter((w) => w.avgMaxTempC < coreAvgMax - 1e-9).length;
  const tiedWindows =
    coreAvgMax === null
      ? null
      : windows.filter((w) => Math.abs(w.avgMaxTempC - coreAvgMax) <= 1e-9).length;
  const rank = colderWindows === null ? null : colderWindows + 1;
  const coreStats = {
    start: coreStart,
    end: coreEnd,
    sols: core.length,
    missingDates: missingDatesBetween(core, coreStart, coreEnd),
    avgMaxTempC: round1(coreAvgMax),
    avgMinTempC: round1(average(core.map((s) => s.minTempC))),
    rank,
    tiedWindows,
    totalWindows: windows.length,
    topPercent: rank === null ? null : round2((rank / windows.length) * 100),
  };

  return {
    meta: {
      fetched_at: FETCHED_AT,
      source_url: sourceUrl,
      cached_file: WEATHER_FILE ?? null,
      license: 'NASA/JPL-Caltech — Mars Science Laboratory (Curiosity) REMS outreach feed',
      mission: 'Mars Science Laboratory (Curiosity)',
      observation: {
        start: sols[0]?.terrestrialDate ?? null,
        end: sols[sols.length - 1]?.terrestrialDate ?? null,
        startSol: sols[0]?.sol ?? null,
        endSol: sols[sols.length - 1]?.sol ?? null,
        missingDates: missingDatesBetween(
          sols,
          sols[0]?.terrestrialDate,
          sols[sols.length - 1]?.terrestrialDate,
        ),
      },
      selection: { ...selection, core: coreStats },
      climatePercentiles: thresholds,
      note:
        'Real Curiosity REMS observations, not real-time and not a forecast. Always display the observation date. ' +
        'This feed does not publish wind speed (always "--"), so gameplay modifiers must use air temperature, ground temperature and pressure; do not invent wind speed from this feed. ' +
        'gameplayTags are heuristic labels from archive-wide percentiles (cold_snap = maxTempC <= p10; severe_cold = maxTempC <= p1; warm_day = maxTempC >= p90; pressure_drop = pressurePa <= p10), not NASA classifications. ' +
        'maxTempPercentile is the share of all valid archive sols with a lower daytime high; 0 means coldest. ' +
        'Rank and percentile are provided for provenance and judge Q&A; in-game copy may simply say "a very cold day" and does not need to display a rank, as long as it does not claim "the coldest day". ' +
        'The default 2025 window is recent; 2019-08-22..29 remains a colder historical comparison (rank 4/4,547).',
    },
    sols,
  };
}

/* ------------------------------------------------------------------ */
/* Mars photos (NASA Image Library)                                    */
/* ------------------------------------------------------------------ */

const CURATED_PHOTOS = [
  { id: 'PIA24487', rover: 'Perseverance', location: 'Jezero Crater' },
  { id: 'PIA24542', rover: 'Perseverance', location: 'Jezero Crater' },
  { id: 'PIA26344', rover: 'Perseverance', location: 'Jezero Crater' },
  { id: 'PIA24173', rover: 'Curiosity', location: 'Gale Crater' },
  { id: 'PIA26632', rover: 'Curiosity', location: 'Gale Crater' },
  { id: 'PIA24264', rover: 'Perseverance', location: 'Jezero Crater' },
  { id: 'PIA24921', rover: 'Perseverance', location: 'Jezero Crater' },
];
const CURATED_PHOTO_BY_ID = new Map(CURATED_PHOTOS.map((photo) => [photo.id, photo]));

function isUsablePhoto(item) {
  const title = String(item?.data?.[0]?.title ?? '').toLowerCase();
  const blocked = [
    'artist', 'concept', 'animation', 'illustration', 'poster', 'diagram',
    'map', 'stereo', '3-d', 'earth', 'briefing', 'logo', 'model',
  ];
  return title.length > 0 && !blocked.some((word) => title.includes(word));
}

// Best-effort metadata for fallback images. Curated entries override this.
function inferPhotoContext(title) {
  const text = String(title ?? '').toLowerCase();
  if (
    text.includes('perseverance') ||
    text.includes('ingenuity') ||
    text.includes('mastcam-z') ||
    text.includes('jezero')
  ) {
    return { rover: 'Perseverance', location: 'Jezero Crater' };
  }
  if (text.includes('curiosity') || text.includes('gale')) {
    return { rover: 'Curiosity', location: 'Gale Crater' };
  }
  return { rover: null, location: null };
}

async function findFallbackPhotoIds(limit) {
  const query = encodeURIComponent('mars surface rover');
  const url = `https://images-api.nasa.gov/search?q=${query}&media_type=image&page_size=40`;
  const raw = await fetchJson(url);
  const items = raw?.collection?.items ?? [];
  return items
    .filter(isUsablePhoto)
    .map((item) => item.data[0].nasa_id)
    .filter(Boolean)
    .slice(0, limit * 2);
}

function dateOnly(value) {
  if (!value) return null;
  const text = String(value).trim();
  const colonDate = text.match(/^(\d{4}):(\d{2}):(\d{2})/);
  if (colonDate) return `${colonDate[1]}-${colonDate[2]}-${colonDate[3]}`;
  const date = new Date(text);
  if (Number.isNaN(date.valueOf())) return text;
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

async function fetchPhoto(nasaId, usedIds, context = {}) {
  if (usedIds.has(nasaId)) return null;
  const base = `https://images-assets.nasa.gov/image/${nasaId}`;
  const [meta, collection] = await Promise.all([
    fetchJson(`${base}/metadata.json`),
    fetchJson(`${base}/collection.json`),
  ]);
  if (!meta || !Array.isArray(collection)) throw new Error('missing metadata or asset list');

  const assets = collection.map((u) => String(u).replace(/^http:/, 'https:'));
  const assetUrl =
    assets.find((u) => /~medium\.(jpe?g|png)$/i.test(u)) ??
    assets.find((u) => /~large\.(jpe?g|png)$/i.test(u)) ??
    assets.find((u) => /~orig\.(jpe?g|png)$/i.test(u));
  if (!assetUrl) throw new Error('no downloadable image asset');

  const extension = /\.png$/i.test(assetUrl) ? '.png' : '.jpg';
  const fileName = `${nasaId}${extension}`;
  const { bytes } = await downloadImage(assetUrl, join(OUT_DIR, 'mars-photos', fileName));

  const title = meta['AVAIL:Title'] ?? nasaId;
  const inferred = inferPhotoContext(title);

  usedIds.add(nasaId);
  return {
    nasaId,
    title,
    rover: context.rover ?? inferred.rover ?? null,
    location: context.location ?? inferred.location ?? null,
    dateCreated: dateOnly(meta['AVAIL:DateCreated']),
    center: meta['AVAIL:Center'] ?? null,
    credit:
      meta['AVAIL:SecondaryCreator'] ??
      meta['AVAIL:Photographer'] ??
      'NASA/JPL-Caltech',
    description: String(meta['AVAIL:Description'] ?? '').replace(/\s+/g, ' ').slice(0, 400) || null,
    file: `mars-photos/${fileName}`,
    bytes,
    assetUrl,
    sourceUrl: `https://images.nasa.gov/details/${nasaId}`,
  };
}

async function fetchMarsPhotos() {
  const usedIds = new Set();
  const photos = [];
  const candidates = CURATED_PHOTOS.map((photo) => photo.id);

  // Add fallback candidates if curated IDs fail or the limit is higher.
  try {
    candidates.push(...(await findFallbackPhotoIds(PHOTO_LIMIT)));
  } catch (error) {
    errors.push(`Mars photo search: ${error.message}`);
  }

  for (const id of candidates) {
    if (photos.length >= PHOTO_LIMIT) break;
    try {
      const photo = await fetchPhoto(id, usedIds, CURATED_PHOTO_BY_ID.get(id) ?? {});
      if (photo) {
        photos.push(photo);
        console.log(`  photo ${photo.nasaId}: ${photo.title} (${photo.bytes} bytes)`);
      }
    } catch (error) {
      errors.push(`Mars photo ${id}: ${error.message}`);
      console.warn(`  photo ${id}: skipped (${error.message})`);
    }
    await sleep(200);
  }

  return {
    meta: {
      fetched_at: FETCHED_AT,
      source_url: 'https://images-api.nasa.gov/',
      license: 'NASA Media Usage Guidelines',
      usage_url: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
      note:
        'NASA images are generally not copyrighted, but credit must be shown. ' +
        'Each photo includes nasaId, rover, location, dateCreated and credit; display them in the UI. ' +
        'These are real archive images from different missions and landing sites (Curiosity at Gale Crater, Perseverance at Jezero Crater), not photographs of the fictional Hope-1 base. ' +
        'Label rover and location on every photo, and do not caption a Perseverance/Jezero image as a local patrol photo of a Gale Crater base. ' +
        'The mars-photos API (api.nasa.gov/mars-photos) returned HTTP 404 on 2026-11-11 and is not used.',
    },
    photos,
  };
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

function resolveDonkiWindow() {
  const endDate = args.get('end-date')
    ? new Date(`${args.get('end-date')}T00:00:00Z`)
    : new Date();
  if (Number.isNaN(endDate.valueOf())) throw new Error('invalid --end-date; expected YYYY-MM-DD');
  const startDate = DONKI_START
    ? new Date(`${DONKI_START}T00:00:00Z`)
    : new Date(endDate.getTime() - DONKI_DAYS * DAY_MS);
  if (Number.isNaN(startDate.valueOf())) throw new Error('invalid --start-date; expected YYYY-MM-DD');
  if (startDate > endDate) throw new Error('--start-date must be on or before --end-date');
  return { startDate: isoDay(startDate), endDate: isoDay(endDate) };
}

function buildSpaceweatherSnapshot(donki, window) {
  return {
    meta: {
      fetched_at: FETCHED_AT,
      source_url: 'https://api.nasa.gov/DONKI/',
      license: 'NASA Open Data',
      window,
      mode: donki.cachedFiles.length
        ? donki.cachedFiles.length === 3
          ? 'cached'
          : 'mixed'
        : 'live',
      cached_files: donki.cachedFiles,
      assessment: assessStorm(donki),
      note:
        'Real NASA DONKI events. Show the event date and a DONKI link in-game; ' +
        'do not present snapshots as live data. ' +
        'strongFlare means an X-class or M5+ flare; strongGeomagneticStorm means Kp >= 7. ' +
        'A strong flare alone does not prove a strong geomagnetic storm, and Kp is Earth\'s ' +
        'geomagnetic index, not a Mars measurement. Use meta.assessment to choose wording.',
    },
    cme: donki.cme,
    flr: donki.flr,
    gst: donki.gst,
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(join(OUT_DIR, 'mars-photos'), { recursive: true });

  console.log(`Output: ${OUT_DIR}`);
  console.log(`NASA API key: ${API_KEY === 'DEMO_KEY' ? 'DEMO_KEY (rate-limited; use NASA_API_KEY for real runs)' : 'from environment'}`);
  if (!['latest', 'cold-week', 'custom'].includes(WEATHER_MODE)) {
    throw new Error(`invalid --weather-mode=${WEATHER_MODE}; use latest, cold-week, or custom`);
  }

  if (WEATHER_ONLY) {
    console.log('\n[weather-only] Mars weather (Curiosity REMS)');
    let weather;
    try {
      weather = await fetchMarsWeather();
      const observation = weather.meta.observation;
      const core = weather.meta.selection?.core;
      console.log(
        `  ${weather.sols.length} sols, ${observation.start} -> ${observation.end} ` +
          `(sol ${observation.startSol} -> ${observation.endSol})`,
      );
      if (core?.rank) {
        console.log(
          `  core ${core.start} -> ${core.end}: rank ${core.rank}/${core.totalWindows} ` +
            `(top ${core.topPercent}%), avg max ${core.avgMaxTempC} C`,
        );
      }
      console.log('  windSpeedMs is null throughout: this feed does not publish wind');
    } catch (error) {
      weather = { meta: { fetched_at: FETCHED_AT, error: error.message }, sols: [] };
      errors.push(`Mars weather: ${error.message}`);
      console.warn(`  weather failed: ${error.message}`);
    }
    await writeFile(
      join(OUT_DIR, 'mars-weather.snapshot.json'),
      JSON.stringify(weather, null, 2) + '\n',
    );

    // Update only the weather fields in the existing manifest. DONKI and
    // photo snapshots are intentionally left untouched.
    const manifestPath = join(OUT_DIR, 'snapshots.manifest.json');
    let manifest = {};
    try {
      manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    } catch {
      manifest = { files: {}, counts: {}, selection: {} };
    }
    manifest.fetched_at = FETCHED_AT;
    manifest.weather_updated_at = FETCHED_AT;
    manifest.last_run = { mode: 'weather-only', at: FETCHED_AT, errors: [...errors] };
    if (!errors.length) manifest.errors = [];
    manifest.counts = { ...(manifest.counts ?? {}), weatherSols: weather.sols?.length ?? 0 };
    manifest.selection = {
      ...(manifest.selection ?? {}),
      weatherMode: WEATHER_MODE,
      weatherObservation: weather.meta.observation ?? null,
      weatherCore: weather.meta.selection?.core ?? null,
    };
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

    console.log('\nDone (weather only; DONKI and photos untouched).');
    if (errors.length) {
      console.log(`\n${errors.length} warning(s):`);
      for (const error of errors) console.log(`  - ${error}`);
      process.exitCode = 1;
    }
    return;
  }

  if (SPACEWEATHER_ONLY) {
    console.log('\n[spaceweather-only] DONKI');
    const window = resolveDonkiWindow();
    let donki = { cme: [], flr: [], gst: [], cachedFiles: [] };
    try {
      donki = await fetchDonki(window.startDate, window.endDate, DONKI_FILES);
    } catch (error) {
      errors.push(`DONKI: ${error.message}`);
      console.warn(`  DONKI failed: ${error.message}`);
    }
    const spaceweather = buildSpaceweatherSnapshot(donki, window);
    await writeFile(
      join(OUT_DIR, 'spaceweather.snapshot.json'),
      JSON.stringify(spaceweather, null, 2) + '\n',
    );

    // Update only the space-weather fields in the existing manifest. Weather
    // and photo snapshots are intentionally left untouched.
    const manifestPath = join(OUT_DIR, 'snapshots.manifest.json');
    let manifest = {};
    try {
      manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    } catch {
      manifest = { files: {}, counts: {}, selection: {} };
    }
    manifest.fetched_at = FETCHED_AT;
    manifest.spaceweather_updated_at = FETCHED_AT;
    manifest.last_run = { mode: 'spaceweather-only', at: FETCHED_AT, errors: [...errors] };
    if (!errors.length) manifest.errors = [];
    manifest.api_key = API_KEY === 'DEMO_KEY' ? 'DEMO_KEY' : 'NASA_API_KEY';
    manifest.counts = {
      ...(manifest.counts ?? {}),
      cme: spaceweather.cme.length,
      flr: spaceweather.flr.length,
      gst: spaceweather.gst.length,
    };
    manifest.selection = {
      ...(manifest.selection ?? {}),
      donkiWindow: window,
      strongStormConfirmed: spaceweather.meta.assessment?.strongStormConfirmed ?? false,
      strongFlare: spaceweather.meta.assessment?.strongFlare ?? false,
      strongGeomagneticStorm: spaceweather.meta.assessment?.strongGeomagneticStorm ?? false,
      maxFlareClass: spaceweather.meta.assessment?.maxFlareClass ?? null,
      maxKp: spaceweather.meta.assessment?.maxKp ?? null,
    };
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

    console.log('\nDone (space weather only; weather and photos untouched).');
    if (errors.length) {
      console.log(`\n${errors.length} warning(s):`);
      for (const error of errors) console.log(`  - ${error}`);
      process.exitCode = 1;
    }
    return;
  }

  const window = resolveDonkiWindow();

  console.log('\n[1/3] DONKI');
  let donki;
  try {
    donki = await fetchDonki(window.startDate, window.endDate, DONKI_FILES);
  } catch (error) {
    donki = { cme: [], flr: [], gst: [], cachedFiles: [] };
    errors.push(`DONKI: ${error.message}`);
    console.warn(`  DONKI failed: ${error.message}`);
  }
  const spaceweather = buildSpaceweatherSnapshot(donki, window);
  await writeFile(
    join(OUT_DIR, 'spaceweather.snapshot.json'),
    JSON.stringify(spaceweather, null, 2) + '\n',
  );

  console.log('\n[2/3] Mars weather (Curiosity REMS)');
  let weather;
  try {
    weather = await fetchMarsWeather();
    const observation = weather.meta.observation;
    const core = weather.meta.selection?.core;
    console.log(
      `  ${weather.sols.length} sols, ${observation.start} -> ${observation.end} ` +
        `(sol ${observation.startSol} -> ${observation.endSol})`,
    );
    if (core?.rank) {
      console.log(
        `  core ${core.start} -> ${core.end}: rank ${core.rank}/${core.totalWindows} ` +
          `(top ${core.topPercent}%), avg max ${core.avgMaxTempC} C`,
      );
    }
    console.log('  windSpeedMs is null throughout: this feed does not publish wind');
  } catch (error) {
    weather = { meta: { fetched_at: FETCHED_AT, error: error.message }, sols: [] };
    errors.push(`Mars weather: ${error.message}`);
    console.warn(`  weather failed: ${error.message}`);
  }
  await writeFile(
    join(OUT_DIR, 'mars-weather.snapshot.json'),
    JSON.stringify(weather, null, 2) + '\n',
  );

  console.log('\n[3/3] Mars photos (NASA Image Library)');
  let photoData;
  try {
    photoData = await fetchMarsPhotos();
    if (!photoData.photos.length) throw new Error('no photos downloaded');
    console.log(`  ${photoData.photos.length} photo(s) saved to mars-photos/`);
  } catch (error) {
    photoData = { meta: { fetched_at: FETCHED_AT, error: error.message }, photos: [] };
    errors.push(`Mars photos: ${error.message}`);
    console.warn(`  photos failed: ${error.message}`);
  }
  await writeFile(
    join(OUT_DIR, 'mars-photos', 'metadata.json'),
    JSON.stringify(photoData, null, 2) + '\n',
  );

  const manifest = {
    fetched_at: FETCHED_AT,
    generator: 'scripts/fetch-snapshots.mjs',
    api_key: API_KEY === 'DEMO_KEY' ? 'DEMO_KEY' : 'NASA_API_KEY',
    files: {
      spaceweather: 'spaceweather.snapshot.json',
      marsWeather: 'mars-weather.snapshot.json',
      marsPhotos: 'mars-photos/metadata.json',
    },
    counts: {
      cme: spaceweather.cme.length,
      flr: spaceweather.flr.length,
      gst: spaceweather.gst.length,
      weatherSols: weather.sols?.length ?? 0,
      photos: photoData.photos.length,
    },
    selection: {
      donkiWindow: window,
      weatherMode: WEATHER_MODE,
      weatherObservation: weather.meta.observation ?? null,
      weatherCore: weather.meta.selection?.core ?? null,
      strongStormConfirmed: spaceweather.meta.assessment?.strongStormConfirmed ?? false,
    },
    errors,
  };
  await writeFile(
    join(OUT_DIR, 'snapshots.manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );

  console.log('\nDone.');
  console.log(JSON.stringify(manifest.counts));
  if (errors.length) {
    console.log(`\n${errors.length} warning(s):`);
    for (const error of errors) console.log(`  - ${error}`);
  }

  const produced =
    spaceweather.cme.length +
    spaceweather.flr.length +
    spaceweather.gst.length +
    (weather.sols?.length ?? 0) +
    photoData.photos.length;
  if (produced === 0) {
    console.error('\nNo data produced. Check API access or cached input files.');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
