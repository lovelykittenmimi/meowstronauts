import { HOP_SAMPLE_TOTAL } from '../../../game/balance';
import type {
  HopDevil,
  HopDevilPatrol,
  HopEvent,
  HopInput,
  HopSample,
  HopWorld,
} from './types';

/** Logical scene size; the SVG viewBox matches this. */
export const VIEW_W = 960;
export const VIEW_H = 540;

/** The walkable strip is wider than the view; the camera follows the player. */
export const WORLD_W = 2880;

/** Mars gravity is 3.71 m/s^2; 80 px per metre keeps the hop readable for kids. */
export const PX_PER_M = 80;
export const MARS_G = 3.71 * PX_PER_M;
export const EARTH_G = 9.81 * PX_PER_M;

/** Same push on Mars and Earth: apex and braking distance both scale by 1/0.38. */
export const GRAVITY_RATIO = EARTH_G / MARS_G;

export const JUMP_SPEED = 300;
export const JUMP_CUT = 120;
export const WALK_MAX = 200;
export const GROUND_ACCEL = 900;
export const AIR_ACCEL = 320;

/** Ground friction is low enough that braking visibly slides. */
export const MU = 0.85;
export const MARS_FRICTION = MU * MARS_G;
export const EARTH_FRICTION = MU * EARTH_G;

export const START_X = 80;
export const FINISH_X = 2790;
export const CAMERA_LEAD = 340;
export const EDGE_MARGIN = 24;

/** Sample hit tests use the cat's chest, a little above its feet. */
export const PLAYER_CENTER_OFFSET = 40;
export const SAMPLE_PICKUP_RADIUS = 55;
export const SAMPLE_LIFT = 115;

export const DEVIL_RADIUS = 55;
export const DEVIL_HEIGHT = 60;
export const DEVIL_COOLDOWN = 1.2;
export const DEVIL_PUSH_X = 220;
export const DEVIL_PUSH_Y = 200;

/** Largest simulation slice; keeps a dropped frame from teleporting the cat. */
export const MAX_DT = 0.05;

export interface TerrainPoint {
  x: number;
  y: number;
}

/**
 * Hand-authored ridge line: three craters and two basalt rises, no bottomless
 * pits. y grows downward, so a crater is a larger y.
 */
export const TERRAIN: ReadonlyArray<TerrainPoint> = [
  { x: 0, y: 440 },
  { x: 230, y: 440 },
  { x: 330, y: 486 },
  { x: 470, y: 486 },
  { x: 560, y: 430 },
  { x: 760, y: 430 },
  { x: 860, y: 452 },
  { x: 1010, y: 452 },
  { x: 1100, y: 400 },
  { x: 1240, y: 400 },
  { x: 1350, y: 486 },
  { x: 1580, y: 486 },
  { x: 1680, y: 424 },
  { x: 1910, y: 424 },
  { x: 2010, y: 470 },
  { x: 2180, y: 470 },
  { x: 2280, y: 414 },
  { x: 2500, y: 414 },
  { x: 2600, y: 468 },
  { x: 2740, y: 468 },
  { x: WORLD_W, y: 452 },
];

export const SAMPLE_XS: ReadonlyArray<number> = [890, 1470, 2010];

const DEVIL_PATROLS: ReadonlyArray<HopDevilPatrol> = [
  { minX: 1150, maxX: 1350, speed: 0.9, phase: 0 },
  { minX: 2050, maxX: 2250, speed: 0.7, phase: Math.PI },
];

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Piecewise-linear ground height at a world x. */
export function groundY(x: number): number {
  const px = clamp(x, 0, WORLD_W);
  for (let i = 1; i < TERRAIN.length; i += 1) {
    const a = TERRAIN[i - 1];
    const b = TERRAIN[i];
    if (px <= b.x) {
      const span = b.x - a.x;
      if (span <= 0) return b.y;
      const t = (px - a.x) / span;
      return a.y + (b.y - a.y) * t;
    }
  }
  return TERRAIN[TERRAIN.length - 1].y;
}

export function sampleY(x: number): number {
  return groundY(x) - SAMPLE_LIFT;
}

export function devilX(patrol: HopDevilPatrol, elapsed: number): number {
  const mid = (patrol.minX + patrol.maxX) / 2;
  const amplitude = (patrol.maxX - patrol.minX) / 2;
  return mid + amplitude * Math.sin(elapsed * patrol.speed + patrol.phase);
}

/** Apex of a vertical throw; used by the intro comparison and tests. */
export function apexHeight(speed: number, gravity: number = MARS_G): number {
  return (speed * speed) / (2 * gravity);
}

/** Braking distance under dry friction; used by the intro and tests. */
export function brakingDistance(
  speed: number,
  mu: number = MU,
  gravity: number = MARS_G,
): number {
  return (speed * speed) / (2 * mu * gravity);
}

/** Keeps the player near the left third of the viewport while it scrolls. */
export function cameraXFor(playerX: number): number {
  return clamp(playerX - CAMERA_LEAD, 0, WORLD_W - VIEW_W);
}

function makeDevils(elapsed: number): HopDevil[] {
  return DEVIL_PATROLS.map((patrol, id) => {
    const x = devilX(patrol, elapsed);
    return {
      ...patrol,
      id,
      x,
      y: groundY(x) - DEVIL_HEIGHT,
      cooldownUntil: 0,
    };
  });
}

export function createWorld(): HopWorld {
  const samples: HopSample[] = SAMPLE_XS.slice(0, HOP_SAMPLE_TOTAL).map(
    (x, id) => ({ id, x, y: sampleY(x), taken: false }),
  );
  return {
    elapsed: 0,
    player: {
      x: START_X,
      y: groundY(START_X),
      vx: 0,
      vy: 0,
      grounded: true,
      facing: 1,
    },
    samples,
    devils: makeDevils(0),
    collected: 0,
    hits: 0,
    finished: false,
    prevJump: false,
    events: [],
  };
}

/**
 * Advances the world by one fixed slice. Pure: the component replaces its
 * world with the return value and drains `events` for toasts.
 */
export function stepWorld(
  world: HopWorld,
  input: HopInput,
  dt: number,
): HopWorld {
  const step = clamp(dt, 0, MAX_DT);
  const events: HopEvent[] = [];
  const player = { ...world.player };
  const elapsed = world.elapsed + step;
  let collected = world.collected;
  let hits = world.hits;
  const finished = world.finished;

  const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (direction !== 0) player.facing = direction > 0 ? 1 : -1;

  if (player.grounded) {
    if (direction !== 0) {
      player.vx = clamp(
        player.vx + direction * GROUND_ACCEL * step,
        -WALK_MAX,
        WALK_MAX,
      );
    } else {
      const drop = MARS_FRICTION * step;
      if (Math.abs(player.vx) <= drop) player.vx = 0;
      else player.vx -= Math.sign(player.vx) * drop;
    }
  } else if (direction !== 0) {
    player.vx = clamp(
      player.vx + direction * AIR_ACCEL * step,
      -WALK_MAX,
      WALK_MAX,
    );
  }

  const jumpPressed = input.jump && !world.prevJump;
  if (jumpPressed && player.grounded) {
    player.vy = -JUMP_SPEED;
    player.grounded = false;
  }
  // Releasing early trims the arc: short tap = small hop, hold = full hop.
  if (!input.jump && player.vy < -JUMP_CUT) player.vy = -JUMP_CUT;

  player.vy += MARS_G * step;
  player.x = clamp(
    player.x + player.vx * step,
    EDGE_MARGIN,
    WORLD_W - EDGE_MARGIN,
  );
  player.y += player.vy * step;

  const surface = groundY(player.x);
  if (player.y >= surface) {
    player.y = surface;
    player.vy = 0;
    player.grounded = true;
  } else {
    player.grounded = false;
  }

  const chestX = player.x;
  const chestY = player.y - PLAYER_CENTER_OFFSET;
  const samples = world.samples.map((sample) => {
    if (sample.taken || finished) return sample;
    if (Math.hypot(sample.x - chestX, sample.y - chestY) > SAMPLE_PICKUP_RADIUS) {
      return sample;
    }
    collected += 1;
    events.push({
      type: 'sample',
      id: sample.id,
      collected,
      total: world.samples.length,
    });
    return { ...sample, taken: true };
  });

  const devils = world.devils.map((devil) => {
    const x = devilX(devil, elapsed);
    const y = groundY(x) - DEVIL_HEIGHT;
    const next = { ...devil, x, y };
    if (
      !finished &&
      elapsed >= devil.cooldownUntil &&
      Math.hypot(x - chestX, y - chestY) <= DEVIL_RADIUS
    ) {
      const away = player.x >= x ? 1 : -1;
      player.vx = away * DEVIL_PUSH_X;
      player.vy = -DEVIL_PUSH_Y;
      player.grounded = false;
      hits += 1;
      next.cooldownUntil = elapsed + DEVIL_COOLDOWN;
      events.push({ type: 'devil', id: devil.id, hits });
    }
    return next;
  });

  let done = finished;
  if (!done && player.x >= FINISH_X) {
    done = true;
    events.push({ type: 'finish', samples: collected, hits });
  }

  return {
    elapsed,
    player,
    samples,
    devils,
    collected,
    hits,
    finished: done,
    prevJump: input.jump,
    events,
  };
}
