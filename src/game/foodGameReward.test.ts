import { FOOD_CAP, FOOD_GAME_REWARD_FOOD, FOOD_PAIR_TOTAL } from './balance';
import { createInitialState, gameReducer } from './reducer';
import type { GameState } from './types';

function started(): GameState {
  return gameReducer(createInitialState('officer', 'en'), {
    type: 'START_GAME',
    difficulty: 'officer',
  });
}

function inResult(): GameState {
  const opened = gameReducer(started(), { type: 'OPEN_EVENT', eventId: 'T1' });
  return gameReducer(opened, { type: 'CHOOSE', choiceId: 'rest' });
}

describe('space food flip reward', () => {
  it('pays one food the first time all six pairs are matched', () => {
    const before = started();
    const after = gameReducer(before, {
      type: 'COMPLETE_FOOD_GAME',
      pairs: FOOD_PAIR_TOTAL,
    });

    expect(after.resources.food).toBe(before.resources.food + FOOD_GAME_REWARD_FOOD);
    expect(after.foodGameRewarded).toBe(true);
  });

  it('does not pay twice in the same mission', () => {
    const first = gameReducer(started(), {
      type: 'COMPLETE_FOOD_GAME',
      pairs: FOOD_PAIR_TOTAL,
    });
    const second = gameReducer(first, {
      type: 'COMPLETE_FOOD_GAME',
      pairs: FOOD_PAIR_TOTAL,
    });

    expect(second.resources.food).toBe(first.resources.food);
    expect(second.foodGameRewarded).toBe(true);
  });

  it('pays nothing for a partial run', () => {
    const before = started();
    const after = gameReducer(before, {
      type: 'COMPLETE_FOOD_GAME',
      pairs: FOOD_PAIR_TOTAL - 1,
    });

    expect(after.resources.food).toBe(before.resources.food);
    expect(after.foodGameRewarded).toBe(false);
  });

  it('ignores the practice run in video fixtures', () => {
    const video = { ...started(), videoMode: 's1' as const };
    const after = gameReducer(video, {
      type: 'COMPLETE_FOOD_GAME',
      pairs: FOOD_PAIR_TOTAL,
    });

    expect(after).toBe(video);
  });

  it('resets the reward on a new mission or a restart', () => {
    const rewarded = gameReducer(started(), {
      type: 'COMPLETE_FOOD_GAME',
      pairs: FOOD_PAIR_TOTAL,
    });

    const restarted = gameReducer(rewarded, {
      type: 'START_GAME',
      difficulty: 'officer',
    });
    expect(restarted.foodGameRewarded).toBe(false);

    const replay = gameReducer(rewarded, { type: 'RESTART' });
    expect(replay.foodGameRewarded).toBe(false);
  });

  it('leaves the reward unclaimed while the pantry is full', () => {
    const full = {
      ...started(),
      resources: { ...started().resources, food: FOOD_CAP },
    };
    const after = gameReducer(full, {
      type: 'COMPLETE_FOOD_GAME',
      pairs: FOOD_PAIR_TOTAL,
    });

    expect(after.resources.food).toBe(FOOD_CAP);
    expect(after.foodGameRewarded).toBe(false);

    // Once a sol drains the pantry there is room, so the bonus still pays.
    const room = { ...after, resources: { ...after.resources, food: 9 } };
    const paid = gameReducer(room, {
      type: 'COMPLETE_FOOD_GAME',
      pairs: FOOD_PAIR_TOTAL,
    });
    expect(paid.resources.food).toBe(10);
    expect(paid.foodGameRewarded).toBe(true);
  });

  it('keeps the latest report point in sync after a result-screen run', () => {
    const result = inResult();
    expect(result.phase).toBe('result');
    expect(result.resourceHistory.length).toBeGreaterThan(0);
    const lastBefore = result.resourceHistory[result.resourceHistory.length - 1];

    const after = gameReducer(result, {
      type: 'COMPLETE_FOOD_GAME',
      pairs: FOOD_PAIR_TOTAL,
    });
    const lastAfter = after.resourceHistory[after.resourceHistory.length - 1];

    expect(after.resourceHistory).toHaveLength(result.resourceHistory.length);
    expect(lastAfter.food).toBe(lastBefore.food + FOOD_GAME_REWARD_FOOD);
    expect(lastAfter.food).toBe(after.resources.food);
  });
});
