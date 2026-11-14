import { EVENT_CARDS } from './events';
import { drawEventFor } from './deck';
import { makeContext } from './conditions';
import { createInitialState } from './reducer';
import type { GameState, HistoryEntry, Resources, WeatherDay } from './types';

const COLD: WeatherDay = {
  sol: 3,
  terrestrialDate: '2025-05-10',
  maxTempC: -70,
  minTempC: -95,
  tags: ['cold_snap'],
};

const WARM: WeatherDay = {
  sol: 3,
  terrestrialDate: '2025-05-10',
  maxTempC: -10,
  minTempC: -80,
  tags: ['warm_day'],
};

const HEALTHY: Resources = {
  power: 90,
  lifeSupport: 90,
  shield: 90,
  food: 9,
  health: 90,
  science: 10,
};

function stateAt(
  sol: number,
  overrides: Partial<GameState> = {},
  historyIds: string[] = [],
): GameState {
  const base = createInitialState('officer', 'en');
  const history: HistoryEntry[] = historyIds.map((eventId, index) => ({
    sol: Math.min(index + 1, sol),
    eventId,
    choiceId: 'x',
    effects: {},
    success: true,
  }));
  return {
    ...base,
    sol,
    resources: { ...base.resources },
    weather: COLD,
    history,
    ...overrides,
  };
}

function drawAcrossSeeds(state: GameState, count = 80): string[] {
  return Array.from({ length: count }, (_, index) =>
    drawEventFor({ ...state, seed: `deck-test-${index}` }).id,
  );
}

describe('tutorial and fixed cards', () => {
  it('opens with the scripted Sol 1 tutorial exactly once', () => {
    expect(drawEventFor(stateAt(1)).id).toBe('T1');
    expect(drawEventFor(stateAt(1, {}, ['T1'])).id).not.toBe('T1');
  });

  it('fixes S1 to Sol 4 regardless of conditions', () => {
    expect(drawEventFor(stateAt(4)).id).toBe('S1');
    expect(drawEventFor(stateAt(4, { resources: { ...HEALTHY } })).id).toBe('S1');
  });

  it('never draws S1 outside Sol 4 or after it resolved', () => {
    const low: Resources = {
      power: 20,
      lifeSupport: 20,
      shield: 20,
      food: 1,
      health: 40,
      science: 0,
    };
    for (const sol of [2, 3, 5, 6, 7]) {
      const ids = drawAcrossSeeds(stateAt(sol, { resources: low, weather: COLD }));
      expect(ids).not.toContain('S1');
    }
    const after = stateAt(4, { flags: { ...stateAt(4).flags, s1Resolved: true } });
    expect(drawAcrossSeeds(after)).not.toContain('S1');
  });
});

describe('condition filters', () => {
  it('keeps P1 out while power is comfortable', () => {
    const ids = drawAcrossSeeds(
      stateAt(5, { resources: { ...HEALTHY, power: 90 } }),
    );
    expect(ids).not.toContain('P1');
  });

  it('lets P1 appear when power is low', () => {
    const ids = drawAcrossSeeds(
      stateAt(5, { resources: { ...HEALTHY, power: 50 } }),
    );
    expect(ids).toContain('P1');
  });

  it('only draws P4 on a cold sol', () => {
    const warm = drawAcrossSeeds(stateAt(3, { weather: WARM }));
    expect(warm).not.toContain('P4');
    const cold = drawAcrossSeeds(stateAt(3, { weather: COLD }));
    expect(cold).toContain('P4');
  });

  it('skips life-support cards while life support holds', () => {
    const ids = drawAcrossSeeds(stateAt(5, { resources: { ...HEALTHY, lifeSupport: 90 } }));
    expect(ids).not.toContain('L1');
    expect(ids).not.toContain('L2');
    expect(ids).not.toContain('L3');
    const mid = drawAcrossSeeds(stateAt(5, { resources: { ...HEALTHY, lifeSupport: 70 } }));
    expect(mid).not.toContain('L3');
  });

  it('skips S2 while shielding holds and allows it when thin', () => {
    // A plausible hand so the category quotas do not force a survival card.
    const played = ['T1', 'P1', 'L1', 'F3', 'C1'];
    const healthy = drawAcrossSeeds(
      stateAt(6, { resources: { ...HEALTHY, shield: 90 } }, played),
    );
    expect(healthy).not.toContain('S2');
    const thin = drawAcrossSeeds(
      stateAt(6, { resources: { ...HEALTHY, shield: 40 } }, played),
    );
    expect(thin).toContain('S2');
  });

  it('draws S3 only on Sol 3-5 with a forecast and thin shielding', () => {
    expect(drawAcrossSeeds(stateAt(2, { resources: { ...HEALTHY, shield: 50 } }))).not.toContain('S3');
    expect(drawAcrossSeeds(stateAt(6, { resources: { ...HEALTHY, shield: 50 } }))).not.toContain('S3');
    expect(drawAcrossSeeds(stateAt(3, { resources: { ...HEALTHY, shield: 50 } }))).toContain('S3');
    expect(drawAcrossSeeds(stateAt(3, { resources: { ...HEALTHY, shield: 90 } }))).not.toContain('S3');
  });

  it('gates C1 behind the comms window and SC2 behind low science', () => {
    expect(drawAcrossSeeds(stateAt(2))).not.toContain('C1');
    expect(drawAcrossSeeds(stateAt(3))).toContain('C1');
    const science = drawAcrossSeeds(stateAt(3, { resources: { ...HEALTHY, science: 10 } }));
    expect(science).not.toContain('SC2');
  });

  it('skips F1 and F3 while food stocks are healthy', () => {
    const ids = drawAcrossSeeds(stateAt(5, { resources: { ...HEALTHY, food: 5 } }));
    expect(ids).not.toContain('F1');
    expect(ids).not.toContain('F3');
  });
});

describe('fallback rules', () => {
  it('never inserts a card whose condition is false, even on Sol 7', () => {
    // Sol 7 has only F1 in range, and food 10 makes F1 ineligible.
    const seen = EVENT_CARDS.map((card) => card.id).filter(
      (id) => id !== 'P1' && id !== 'T1',
    );
    seen.push('T1');
    const state = stateAt(
      7,
      { resources: { ...HEALTHY, power: 50, food: 10 }, weather: WARM },
      seen,
    );
    const context = makeContext(7, state.resources, state.weather, state.flags.s1Resolved);
    const drawn = drawEventFor(state);
    expect(drawn.id).not.toBe('S1');
    expect(drawn.when?.(context) ?? true).toBe(true);
  });

  it('repeats an eligible card rather than drawing an ineligible one', () => {
    const allIds = EVENT_CARDS.map((card) => card.id);
    // Every card seen; only L1 (life support < 65) qualifies on Sol 5.
    const resources: Resources = {
      power: 90,
      lifeSupport: 60,
      shield: 90,
      food: 9,
      health: 90,
      science: 10,
    };
    const state = stateAt(5, { resources, weather: WARM }, allIds);
    const context = makeContext(5, resources, WARM, false);
    const drawn = drawEventFor(state);
    expect(drawn.when?.(context)).toBe(true);
  });

  it('does not repeat an earlier sol card while unseen cards qualify on Sol 7', () => {
    // Sol 7 has only F1 in range; the old draw put the already-played F1 back
    // in the pool and replayed it even though other cards had never appeared.
    const low: Resources = {
      power: 50,
      lifeSupport: 50,
      shield: 50,
      food: 2,
      health: 60,
      science: 0,
    };
    const seen = ['P1', 'F1', 'L2', 'C1', 'S1'];
    const ids = drawAcrossSeeds(stateAt(7, { resources: low, weather: COLD }, seen), 40);
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      expect(seen, `drew seen card ${id} on Sol 7`).not.toContain(id);
      expect(id).not.toBe('S1');
    }
  });

  it('prefers another eligible card over repeating yesterday on Sol 7', () => {
    const low: Resources = {
      power: 50,
      lifeSupport: 50,
      shield: 50,
      food: 2,
      health: 60,
      science: 0,
    };
    const seen = EVENT_CARDS.map((card) => card.id).filter((id) => id !== 'T1');
    const ids = drawAcrossSeeds(
      stateAt(7, { resources: low, weather: COLD }, [...seen, 'F1']),
      40,
    );
    expect(ids.length).toBeGreaterThan(0);
    expect(ids).not.toContain('F1');
    expect(ids).not.toContain('S1');
  });

  it('does not repeat the previous sol event when alternatives qualify', () => {
    const low: Resources = {
      power: 50,
      lifeSupport: 50,
      shield: 50,
      food: 2,
      health: 60,
      science: 0,
    };
    const seen = EVENT_CARDS.map((card) => card.id).filter((id) => id !== 'T1');
    const ids = drawAcrossSeeds(
      stateAt(6, { resources: low, weather: COLD }, [...seen, 'P4']),
      40,
    );
    expect(ids.length).toBeGreaterThan(0);
    expect(ids).not.toContain('P4');
    expect(ids).not.toContain('S1');
  });
});
