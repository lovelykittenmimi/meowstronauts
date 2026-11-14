import type {
  LandingEvaluation,
  Point,
  WeatherPhase,
  WeatherZone,
  ZoneType,
} from './types';

export const MAP_WIDTH = 1600;
export const MAP_HEIGHT = 900;

/** Start on the left edge of the Gale Crater map. */
export const START: Point = { x: 140, y: 500 };

/** Central crater on the Mars Trek Gale-wide still. */
export const TARGET: Point = { x: 808, y: 527 };

/** The game map is roughly a 1,600 km-wide regional view; 1 px ≈ 1 km. */
export const KM_PER_PX = 1;

/** Landing tolerances in game pixels (≈ km). */
export const PERFECT_RADIUS = 18;
export const CLOSE_RADIUS = 60;

export const SHIP_SPEED = 235; // px / second
export const WIND_PX_PER_MS = 10; // 5 m/s of wind → 50 px/s of drift
export const MAX_DT = 0.05;
export const PHASE_SECONDS = 16;

const ZONE_IMPULSE = {
  dust: 280,
  gust: 340,
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampShip(point: Point): Point {
  const margin = 26;
  return {
    x: clamp(point.x, margin, MAP_WIDTH - margin),
    y: clamp(point.y, margin, MAP_HEIGHT - margin),
  };
}

export function distancePx(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * MEDA reports meteorological wind direction: the azimuth the wind comes FROM,
 * clockwise from north. The ship is pushed toward the opposite direction.
 */
export function windPushVector(phase: Pick<WeatherPhase, 'windSpeedMs' | 'windDirectionDeg'>): Point {
  const radians = (phase.windDirectionDeg * Math.PI) / 180;
  const magnitude = phase.windSpeedMs * WIND_PX_PER_MS;
  return {
    x: -Math.sin(radians) * magnitude,
    y: Math.cos(radians) * magnitude,
  };
}

export function pushAngleDeg(vector: Point): number {
  return (Math.atan2(vector.y, vector.x) * 180) / Math.PI;
}

export function evaluateLanding(point: Point): LandingEvaluation {
  const distance = distancePx(point, TARGET);
  const distanceKm = Math.round(distance * KM_PER_PX);
  if (distance <= PERFECT_RADIUS) {
    return { result: 'perfect', distanceKm };
  }
  if (distance <= CLOSE_RADIUS) {
    return { result: 'close', distanceKm };
  }
  return { result: 'far', distanceKm };
}

export function formatKm(km: number): string {
  return km < 1 ? '<1' : Math.round(km).toLocaleString('en-US');
}

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function zoneTypesFor(phase: WeatherPhase): ZoneType[] {
  const types: ZoneType[] = [];
  if (phase.windSpeedMs >= 4.2) types.push('dust');
  if (phase.airTempC <= -55) types.push('cold');
  types.push('gust');
  return types;
}

/**
 * Deterministic per sol/phase so a retry of the same sol is fair, while a new
 * sol or phase gives a fresh map. Zones are gameplay hazards derived from the
 * day's MEDA conditions, not official NASA weather alerts.
 */
export function makeZones(sol: number, phaseIndex: number, phase: WeatherPhase): WeatherZone[] {
  const random = mulberry32(sol * 7919 + phaseIndex * 104729 + 17);
  const types = zoneTypesFor(phase);
  const zones: WeatherZone[] = [];
  const placed: Point[] = [];

  for (let i = 0; i < 2; i += 1) {
    let x = 0;
    let y = 0;
    let attempts = 0;
    do {
      x = 190 + random() * (MAP_WIDTH - 380);
      y = 150 + random() * (MAP_HEIGHT - 300);
      attempts += 1;
    } while (
      attempts < 40 &&
      (distancePx({ x, y }, START) < 170 ||
        distancePx({ x, y }, TARGET) < 150 ||
        placed.some((point) => distancePx(point, { x, y }) < 150))
    );
    placed.push({ x, y });
    zones.push({
      id: `${sol}-${phaseIndex}-${i}`,
      x,
      y,
      r: 58 + random() * 27,
      type: types[i % types.length],
    });
  }

  return zones;
}

export function zoneImpulse(zone: WeatherZone, phase: WeatherPhase): Point {
  if (zone.type === 'cold') {
    return { x: 0, y: 0 };
  }
  const push = windPushVector(phase);
  const wind = Math.hypot(push.x, push.y) || 1;
  const ux = push.x / wind;
  const uy = push.y / wind;

  if (zone.type === 'gust') {
    return { x: ux * ZONE_IMPULSE.gust, y: uy * ZONE_IMPULSE.gust };
  }

  // Dust devil: a strong sideways shove plus a little outward lift.
  const side = Math.sign(ux * uy || 1);
  return {
    x: (-uy * ZONE_IMPULSE.dust) * side * 0.85 + ux * 70,
    y: (ux * ZONE_IMPULSE.dust) * side * 0.85 + uy * 70,
  };
}
