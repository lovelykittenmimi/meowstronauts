/**
 * Optional on-demand reader for the public Curiosity REMS weather feed.
 * This is display-only: the mission, event conditions, and balance stay on
 * the committed 2025 snapshot.
 */
export const MSL_WEATHER_URL =
  'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json';

export interface LiveSol {
  sol: number;
  terrestrialDate: string;
  maxTempC: number;
  minTempC: number;
  pressurePa: number | null;
}

interface RawSol {
  sol?: unknown;
  terrestrial_date?: unknown;
  max_temp?: unknown;
  min_temp?: unknown;
  pressure?: unknown;
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === '--') return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * The feed is newest-first, but sort by sol anyway so a reordered response
 * cannot silently show an older week.
 */
export function parseLatestSols(payload: unknown, count = 7): LiveSol[] {
  const soles = (payload as { soles?: unknown } | null)?.soles;
  if (!Array.isArray(soles)) {
    throw new Error('Unexpected NASA weather payload');
  }

  const parsed: LiveSol[] = [];
  for (const entry of soles as RawSol[]) {
    const sol = toFiniteNumber(entry.sol);
    const maxTempC = toFiniteNumber(entry.max_temp);
    const minTempC = toFiniteNumber(entry.min_temp);
    const date = entry.terrestrial_date;
    if (
      sol === null ||
      maxTempC === null ||
      minTempC === null ||
      typeof date !== 'string' ||
      date.length === 0
    ) {
      continue;
    }
    parsed.push({
      sol,
      terrestrialDate: date,
      maxTempC,
      minTempC,
      pressurePa: toFiniteNumber(entry.pressure),
    });
  }

  parsed.sort((a, b) => b.sol - a.sol);
  const latest = parsed.slice(0, Math.max(1, count));
  if (latest.length === 0) {
    throw new Error('No usable sols in the NASA weather feed');
  }
  return latest;
}

export async function fetchLatestSols(signal?: AbortSignal): Promise<LiveSol[]> {
  const response = await fetch(MSL_WEATHER_URL, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`NASA weather feed returned HTTP ${response.status}`);
  }
  return parseLatestSols(await response.json());
}
