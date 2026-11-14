import { gameReducer, starsFor } from './reducer';
import { buildVideoState } from './video';

describe('video fixtures', () => {
  it('replays ?video=s1 to the frozen HUD values', () => {
    const state = buildVideoState('s1');
    expect(state.phase).toBe('choice');
    expect(state.sol).toBe(4);
    expect(state.currentEventId).toBe('S1');
    expect(state.resources).toEqual({
      power: 62,
      lifeSupport: 58,
      shield: 55,
      food: 5,
      health: 82,
      science: 3,
    });
    expect(state.collectedCards).toHaveLength(8);

    const after = gameReducer(state, { type: 'CHOOSE', choiceId: 'shield-up' });
    expect(after.resources).toEqual({
      power: 42,
      lifeSupport: 58,
      shield: 80,
      food: 5,
      health: 82,
      science: 3,
    });

    const collected = gameReducer(after, {
      type: 'COLLECT_CARD',
      cardId: 'solarFlare',
    });
    expect(collected.collectedCards).toHaveLength(9);
  });

  it('replays ?video=report to a three-star report with seven curve points', () => {
    const state = buildVideoState('report');
    expect(state.phase).toBe('report');
    expect(state.sol).toBe(7);
    expect(starsFor(state)).toBe(3);
    expect(state.resources.health).toBeGreaterThanOrEqual(70);
    expect(state.resources.science).toBeGreaterThanOrEqual(8);
    expect(state.resourceHistory).toHaveLength(7);
    expect(state.resourceHistory.at(-1)).toEqual(state.resources);
    expect(state.collectedCards).toHaveLength(9);
    expect(state.emergencyUsed).toBe(false);
  });

  it('is deterministic across reloads', () => {
    expect(buildVideoState('s1')).toEqual(buildVideoState('s1'));
    expect(buildVideoState('report')).toEqual(buildVideoState('report'));
  });
});
