export const FIELD_WIDTH = 1000;
export const FIELD_HEIGHT = 600;
export const ROVER_Y = 520;
export const ROVER_RADIUS = 24;
export const DEVIL_RADIUS = 26;
export const READING_RADIUS = 18;
export const READINGS_TO_COLLECT = 8;
export const MAX_DEVILS = 3;
export const MAX_READINGS = 3;
export const ROVER_SPEED = 330;
export const DEVIL_SPEED = 92;
export const SLOW_FACTOR = 0.5;
export const SLOW_SECONDS = 1.5;
export const BUMP_COOLDOWN = 0.8;
export const READING_RESPAWN_SECONDS = 0.6;

export interface DodgeInput {
  left: boolean;
  right: boolean;
}

export interface Devil {
  id: number;
  x: number;
  y: number;
  baseX: number;
  phase: number;
}

export interface Reading {
  id: number;
  x: number;
  y: number;
}

export interface DodgeRun {
  time: number;
  roverX: number;
  readings: Reading[];
  devils: Devil[];
  collected: number;
  bumps: number;
  slowUntil: number;
  bumpCooldownUntil: number;
  spawnedReadings: number;
  nextReadingAt: number;
  nextDevilAt: number;
  nextId: number;
  rngState: number;
  complete: boolean;
}

interface RngState {
  state: number;
}

function random(rng: RngState): number {
  let t = rng.state;
  t += 0x6d2b79f5;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
  rng.state = t;
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
}

function makeReading(id: number, rng: RngState, roverX: number): Reading {
  let x = 80 + random(rng) * (FIELD_WIDTH - 160);
  // A fresh reading should not land inside the rover and disappear on the
  // same tick it spawns.
  if (Math.abs(x - roverX) < 60) {
    x = roverX > FIELD_WIDTH / 2 ? roverX - 100 : roverX + 100;
  }
  return {
    id,
    x: Math.max(40, Math.min(FIELD_WIDTH - 40, x)),
    y: ROVER_Y - 24 + random(rng) * 48,
  };
}

function makeDevil(id: number, rng: RngState): Devil {
  const baseX = 50 + random(rng) * (FIELD_WIDTH - 100);
  return {
    id,
    x: baseX,
    y: -30,
    baseX,
    phase: random(rng) * Math.PI * 2,
  };
}

export function createRun(seed?: number): DodgeRun {
  const rng: RngState = {
    state: seed === undefined ? Math.floor(Math.random() * 0xffffffff) : seed,
  };
  const run: DodgeRun = {
    time: 0,
    roverX: FIELD_WIDTH / 2,
    readings: [],
    devils: [],
    collected: 0,
    bumps: 0,
    slowUntil: 0,
    bumpCooldownUntil: 0,
    spawnedReadings: 0,
    nextReadingAt: 0,
    nextDevilAt: 0.5,
    nextId: 1,
    rngState: rng.state,
    complete: false,
  };

  for (let index = 0; index < MAX_READINGS; index += 1) {
    run.readings.push(makeReading(run.nextId, rng, run.roverX));
    run.nextId += 1;
    run.spawnedReadings += 1;
  }
  run.rngState = rng.state;
  return run;
}

function distanceSquared(a: { x: number; y: number }, b: { x: number; y: number }) {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

/**
 * Advance the run by `dt` seconds. The rover only moves left/right along the
 * bottom lane; readings spawn in that lane and driftless dust devils cross the
 * plain from the top.
 */
export function tick(
  state: DodgeRun,
  dt: number,
  input: DodgeInput,
): DodgeRun {
  if (state.complete) return state;

  const rng: RngState = { state: state.rngState };
  let nextId = state.nextId;
  const time = state.time + Math.max(0, dt);
  const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const speed =
    time < state.slowUntil ? ROVER_SPEED * SLOW_FACTOR : ROVER_SPEED;
  const roverX = Math.max(
    ROVER_RADIUS,
    Math.min(FIELD_WIDTH - ROVER_RADIUS, state.roverX + direction * speed * dt),
  );

  let devils = state.devils
    .map((devil) => ({
      ...devil,
      x: Math.max(
        DEVIL_RADIUS,
        Math.min(
          FIELD_WIDTH - DEVIL_RADIUS,
          devil.baseX + Math.sin(time * 1.8 + devil.phase) * 70,
        ),
      ),
      y: devil.y + DEVIL_SPEED * dt,
    }))
    .filter((devil) => devil.y < FIELD_HEIGHT + 60);

  let nextDevilAt = state.nextDevilAt;
  if (time >= nextDevilAt) {
    if (devils.length < MAX_DEVILS) {
      devils = [...devils, makeDevil(nextId, rng)];
      nextId += 1;
      nextDevilAt = time + 1.8 + random(rng) * 1.2;
    } else {
      nextDevilAt = time + 0.8;
    }
  }

  let readings = [...state.readings];
  let spawnedReadings = state.spawnedReadings;
  let nextReadingAt = state.nextReadingAt;
  if (
    time >= nextReadingAt &&
    readings.length < MAX_READINGS &&
    spawnedReadings < READINGS_TO_COLLECT
  ) {
    readings.push(makeReading(nextId, rng, roverX));
    nextId += 1;
    spawnedReadings += 1;
    nextReadingAt = 0;
  }

  let collected = state.collected;
  let complete = false;
  const rover = { x: roverX, y: ROVER_Y };
  const hitReading = readings.find(
    (reading) => distanceSquared(reading, rover) <= (ROVER_RADIUS + READING_RADIUS) ** 2,
  );
  if (hitReading) {
    readings = readings.filter((reading) => reading.id !== hitReading.id);
    collected += 1;
    if (collected >= READINGS_TO_COLLECT) {
      complete = true;
    } else {
      nextReadingAt = time + READING_RESPAWN_SECONDS;
    }
  }

  let bumps = state.bumps;
  let slowUntil = state.slowUntil;
  let bumpCooldownUntil = state.bumpCooldownUntil;
  if (!complete) {
    const hitDevil = devils.find(
      (devil) =>
        distanceSquared(devil, rover) <= (ROVER_RADIUS + DEVIL_RADIUS) ** 2,
    );
    if (hitDevil && time >= bumpCooldownUntil) {
      bumps += 1;
      slowUntil = time + SLOW_SECONDS;
      bumpCooldownUntil = time + BUMP_COOLDOWN;
    }
  }

  return {
    ...state,
    time,
    roverX,
    readings,
    devils,
    collected,
    bumps,
    slowUntil,
    bumpCooldownUntil,
    spawnedReadings,
    nextReadingAt,
    nextDevilAt,
    nextId,
    rngState: rng.state,
    complete,
  };
}

export function isComplete(state: DodgeRun): boolean {
  return state.complete || state.collected >= READINGS_TO_COLLECT;
}
