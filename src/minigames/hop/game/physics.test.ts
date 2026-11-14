import { HOP_SAMPLE_TOTAL } from '../../../game/balance';
import type { HopInput, HopWorld } from './types';
import {
  EARTH_FRICTION,
  EARTH_G,
  FINISH_X,
  JUMP_SPEED,
  MARS_FRICTION,
  MARS_G,
  MU,
  TERRAIN,
  VIEW_H,
  WALK_MAX,
  WORLD_W,
  apexHeight,
  brakingDistance,
  createWorld,
  groundY,
  stepWorld,
} from './physics';

const IDLE: HopInput = { left: false, right: false, jump: false };
const STEP = 1 / 120;

function holdJumpWorld(sampleId: number): HopWorld {
  const world = createWorld();
  const sample = world.samples[sampleId];
  const startX = sample.x - 40;
  return {
    ...world,
    player: {
      ...world.player,
      x: startX,
      y: groundY(startX),
      vx: WALK_MAX,
      vy: 0,
      grounded: true,
      facing: 1,
    },
    prevJump: false,
  };
}

function placeOnDevil(world: HopWorld): HopWorld {
  const devil = world.devils[0];
  return {
    ...world,
    player: {
      ...world.player,
      x: devil.x,
      y: groundY(devil.x),
      vx: 0,
      vy: 0,
      grounded: true,
    },
  };
}

describe('low-gravity physics', () => {
  it('lifts the same jump about 2.6x higher than on Earth', () => {
    const marsApex = apexHeight(JUMP_SPEED, MARS_G);
    const earthApex = apexHeight(JUMP_SPEED, EARTH_G);
    expect(marsApex / earthApex).toBeCloseTo(2.64, 1);
    expect(marsApex).toBeGreaterThan(150);
  });

  it('slides the same speed about 2.6x farther before stopping', () => {
    const marsBrake = brakingDistance(WALK_MAX, MU, MARS_G);
    const earthBrake = brakingDistance(WALK_MAX, MU, EARTH_G);
    const apexRatio = apexHeight(JUMP_SPEED, MARS_G) / apexHeight(JUMP_SPEED, EARTH_G);
    expect(marsBrake / earthBrake).toBeCloseTo(apexRatio, 6);
    expect(MARS_FRICTION).toBeLessThan(EARTH_FRICTION);
  });

  it('never opens a bottomless pit', () => {
    let previous = groundY(0);
    for (let x = 1; x <= WORLD_W; x += 1) {
      const y = groundY(x);
      expect(Math.abs(y - previous)).toBeLessThan(2);
      expect(y).toBeGreaterThan(300);
      expect(y).toBeLessThan(VIEW_H);
      previous = y;
    }
    for (const point of TERRAIN) {
      expect(groundY(point.x)).toBeCloseTo(point.y, 6);
    }
    expect(groundY(0)).toBe(groundY(0));
  });

  it('creates exactly the three reachable hematite samples', () => {
    const world = createWorld();
    expect(world.samples).toHaveLength(HOP_SAMPLE_TOTAL);

    for (const sample of world.samples) {
      let run = holdJumpWorld(sample.id);
      for (let i = 0; i < 60 && !run.samples[sample.id].taken; i += 1) {
        run = stepWorld(run, { left: false, right: true, jump: true }, STEP);
      }
      expect(run.samples[sample.id].taken).toBe(true);
      expect(run.collected).toBe(1);
    }
  });

  it('does not hand a sample to a cat that just walks under it', () => {
    const world = createWorld();
    let run: HopWorld = {
      ...world,
      player: {
        ...world.player,
        x: world.samples[0].x - 200,
        y: groundY(world.samples[0].x - 200),
        vx: 0,
        vy: 0,
        grounded: true,
      },
      prevJump: false,
    };
    for (let i = 0; i < 240; i += 1) {
      run = stepWorld(run, { left: false, right: true, jump: false }, STEP);
    }
    expect(run.collected).toBe(0);
    expect(run.samples.every((sample) => !sample.taken)).toBe(true);
  });

  it('shoves the player away from a dust devil and counts the hit', () => {
    const world = createWorld();
    const devil = world.devils[0];
    const setup: HopWorld = {
      ...world,
      player: {
        ...world.player,
        x: devil.x - 30,
        y: groundY(devil.x - 30),
        vx: 0,
        vy: 0,
        grounded: true,
      },
    };
    const hit = stepWorld(setup, IDLE, STEP);
    expect(hit.hits).toBe(1);
    expect(hit.player.vx).toBeLessThan(0);
    expect(hit.player.vy).toBeLessThan(0);
    expect(hit.events.some((event) => event.type === 'devil')).toBe(true);
  });

  it('waits out the dust devil cooldown before a second shove', () => {
    let run = placeOnDevil(createWorld());
    run = stepWorld(run, IDLE, STEP);
    expect(run.hits).toBe(1);

    for (let i = 0; i < 100; i += 1) {
      run = placeOnDevil(run);
      run = stepWorld(run, IDLE, STEP);
    }
    expect(run.hits).toBe(1);

    for (let i = 0; i < 60; i += 1) {
      run = placeOnDevil(run);
      run = stepWorld(run, IDLE, STEP);
    }
    expect(run.hits).toBe(2);
  });

  it('finishes at the airlock even with no samples', () => {
    const world = createWorld();
    const nearFinish: HopWorld = {
      ...world,
      player: {
        ...world.player,
        x: FINISH_X - 1,
        y: groundY(FINISH_X - 1),
        vx: WALK_MAX,
        grounded: true,
      },
    };
    const done = stepWorld(nearFinish, { left: false, right: true, jump: false }, 1 / 60);
    expect(done.finished).toBe(true);
    expect(done.collected).toBe(0);
    const finish = done.events.find((event) => event.type === 'finish');
    expect(finish).toBeDefined();
  });
});
