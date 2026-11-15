import {
  FIELD_WIDTH,
  READINGS_TO_COLLECT,
  ROVER_RADIUS,
  ROVER_Y,
  SLOW_FACTOR,
  createRun,
  tick,
  type DodgeRun,
} from './state';

const STILL = { left: false, right: false };

function quietRun(seed = 3): DodgeRun {
  return {
    ...createRun(seed),
    readings: [],
    devils: [],
    spawnedReadings: 0,
    nextReadingAt: 999,
    nextDevilAt: 999,
    time: 1,
  };
}

describe('dust devil dodge state', () => {
  it('starts with three readings, no bumps, and no completed run', () => {
    const run = createRun(3);
    expect(run.collected).toBe(0);
    expect(run.bumps).toBe(0);
    expect(run.complete).toBe(false);
    expect(run.readings).toHaveLength(3);
    expect(run.devils).toHaveLength(0);
  });

  it('moves the rover with input and clamps it to the field', () => {
    const run = quietRun();
    const right = tick(run, 0.1, { left: false, right: true });
    expect(right.roverX).toBeGreaterThan(run.roverX);

    const edge = tick({ ...run, roverX: FIELD_WIDTH - 5 }, 1, {
      left: false,
      right: true,
    });
    expect(edge.roverX).toBe(FIELD_WIDTH - ROVER_RADIUS);

    const leftEdge = tick({ ...run, roverX: 5 }, 1, { left: true, right: false });
    expect(leftEdge.roverX).toBe(ROVER_RADIUS);
  });

  it('collects one reading, counts it, and does not reuse the same id', () => {
    const run = quietRun();
    const reading = { id: 99, x: run.roverX, y: ROVER_Y };
    const next = tick({ ...run, readings: [reading] }, 0.016, STILL);

    expect(next.collected).toBe(1);
    expect(next.readings).toHaveLength(0);
    expect(next.readings.some((item) => item.id === 99)).toBe(false);
    expect(next.nextReadingAt).toBeGreaterThan(next.time);
  });

  it('respawns a reading after its delay until eight are collected', () => {
    const run = quietRun();
    const waiting = {
      ...run,
      collected: 1,
      readings: [],
      spawnedReadings: 1,
      nextReadingAt: run.time + 0.3,
    };
    const early = tick(waiting, 0.1, STILL);
    expect(early.readings).toHaveLength(0);

    const later = tick(waiting, 0.4, STILL);
    expect(later.readings).toHaveLength(1);
    expect(later.spawnedReadings).toBe(2);
  });

  it('bumps once, slows the rover, and keeps every reading', () => {
    const run = quietRun();
    const withDevil = {
      ...run,
      devils: [
        {
          id: 50,
          x: run.roverX,
          y: ROVER_Y,
          baseX: run.roverX,
          phase: -1.8 * (run.time + 0.016),
        },
      ],
      readings: [{ id: 51, x: 100, y: ROVER_Y }],
    };
    const bumped = tick(withDevil, 0.016, STILL);

    expect(bumped.bumps).toBe(1);
    expect(bumped.collected).toBe(0);
    expect(bumped.slowUntil).toBeGreaterThan(bumped.time);
    expect(bumped.readings).toHaveLength(1);

    const again = tick(bumped, 0.016, STILL);
    expect(again.bumps).toBe(1);
  });

  it('uses half speed while slowed', () => {
    const run = quietRun();
    const normal = tick(run, 0.1, { left: false, right: true });
    const slow = tick(
      { ...run, slowUntil: run.time + 1.5 },
      0.1,
      { left: false, right: true },
    );
    const normalDelta = normal.roverX - run.roverX;
    const slowDelta = slow.roverX - run.roverX;
    expect(slowDelta).toBeCloseTo(normalDelta * SLOW_FACTOR, 5);
  });

  it('completes at eight readings', () => {
    const run = quietRun();
    const final = tick(
      {
        ...run,
        collected: READINGS_TO_COLLECT - 1,
        spawnedReadings: READINGS_TO_COLLECT,
        readings: [{ id: 77, x: run.roverX, y: ROVER_Y }],
      },
      0.016,
      STILL,
    );
    expect(final.collected).toBe(8);
    expect(final.complete).toBe(true);
  });

  it('stops updating once complete', () => {
    const run = { ...quietRun(), complete: true };
    expect(tick(run, 1, { left: true, right: false })).toBe(run);
  });
});
