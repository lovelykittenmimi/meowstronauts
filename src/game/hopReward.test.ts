import { HOP_REWARD_SCIENCE } from './balance';
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

describe('low-gravity hop reward', () => {
  it('pays one science the first time all three samples arrive', () => {
    const before = started();
    const after = gameReducer(before, { type: 'COMPLETE_HOP', samples: 3 });

    expect(after.resources.science).toBe(
      before.resources.science + HOP_REWARD_SCIENCE,
    );
    expect(after.hopRewarded).toBe(true);
  });

  it('does not pay twice in the same mission', () => {
    const first = gameReducer(started(), { type: 'COMPLETE_HOP', samples: 3 });
    const second = gameReducer(first, { type: 'COMPLETE_HOP', samples: 3 });

    expect(second.resources.science).toBe(first.resources.science);
    expect(second.hopRewarded).toBe(true);
  });

  it('pays nothing for a partial sample run', () => {
    const before = started();
    const after = gameReducer(before, { type: 'COMPLETE_HOP', samples: 2 });

    expect(after.resources.science).toBe(before.resources.science);
    expect(after.hopRewarded).toBe(false);
  });

  it('ignores the practice run in video fixtures', () => {
    const video = { ...started(), videoMode: 's1' as const };
    const after = gameReducer(video, { type: 'COMPLETE_HOP', samples: 3 });

    expect(after).toBe(video);
  });

  it('resets the reward on a new mission or a restart', () => {
    const rewarded = gameReducer(started(), { type: 'COMPLETE_HOP', samples: 3 });

    const restarted = gameReducer(rewarded, {
      type: 'START_GAME',
      difficulty: 'officer',
    });
    expect(restarted.hopRewarded).toBe(false);

    const replay = gameReducer(rewarded, { type: 'RESTART' });
    expect(replay.hopRewarded).toBe(false);
  });

  it('keeps the latest report point in sync after a result-screen hop', () => {
    const result = inResult();
    expect(result.phase).toBe('result');
    expect(result.resourceHistory.length).toBeGreaterThan(0);
    const lastBefore = result.resourceHistory[result.resourceHistory.length - 1];

    const after = gameReducer(result, { type: 'COMPLETE_HOP', samples: 3 });
    const lastAfter = after.resourceHistory[after.resourceHistory.length - 1];

    expect(after.resourceHistory).toHaveLength(result.resourceHistory.length);
    expect(lastAfter.science).toBe(lastBefore.science + HOP_REWARD_SCIENCE);
    expect(lastAfter.science).toBe(after.resources.science);
  });
});
