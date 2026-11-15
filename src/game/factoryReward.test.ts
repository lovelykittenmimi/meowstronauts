import {
  FACTORY_REWARD_LIFE_SUPPORT,
  FACTORY_STATION_TOTAL,
  LIFE_SUPPORT_CAP,
} from './balance';
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

describe('water & fuel factory reward', () => {
  it('pays life support the first time all four stations are done', () => {
    const before = started();
    const after = gameReducer(before, {
      type: 'COMPLETE_FACTORY',
      stations: FACTORY_STATION_TOTAL,
    });

    expect(after.resources.lifeSupport).toBe(
      before.resources.lifeSupport + FACTORY_REWARD_LIFE_SUPPORT,
    );
    expect(after.factoryRewarded).toBe(true);
  });

  it('does not pay twice in the same mission', () => {
    const first = gameReducer(started(), {
      type: 'COMPLETE_FACTORY',
      stations: FACTORY_STATION_TOTAL,
    });
    const second = gameReducer(first, {
      type: 'COMPLETE_FACTORY',
      stations: FACTORY_STATION_TOTAL,
    });

    expect(second).toBe(first);
    expect(second.resources.lifeSupport).toBe(first.resources.lifeSupport);
    expect(second.factoryRewarded).toBe(true);
  });

  it('pays nothing for a partial run', () => {
    const before = started();
    const after = gameReducer(before, {
      type: 'COMPLETE_FACTORY',
      stations: FACTORY_STATION_TOTAL - 1,
    });

    expect(after.resources.lifeSupport).toBe(before.resources.lifeSupport);
    expect(after.factoryRewarded).toBe(false);
  });

  it('ignores the practice run in video fixtures', () => {
    const video = { ...started(), videoMode: 's1' as const };
    const after = gameReducer(video, {
      type: 'COMPLETE_FACTORY',
      stations: FACTORY_STATION_TOTAL,
    });

    expect(after).toBe(video);
  });

  it('resets the reward on a new mission or a restart', () => {
    const rewarded = gameReducer(started(), {
      type: 'COMPLETE_FACTORY',
      stations: FACTORY_STATION_TOTAL,
    });

    const restarted = gameReducer(rewarded, {
      type: 'START_GAME',
      difficulty: 'officer',
    });
    expect(restarted.factoryRewarded).toBe(false);

    const replay = gameReducer(rewarded, { type: 'RESTART' });
    expect(replay.factoryRewarded).toBe(false);
  });

  it('leaves the reward unclaimed while life support is full', () => {
    const full = {
      ...started(),
      resources: { ...started().resources, lifeSupport: LIFE_SUPPORT_CAP },
    };
    const after = gameReducer(full, {
      type: 'COMPLETE_FACTORY',
      stations: FACTORY_STATION_TOTAL,
    });

    expect(after.resources.lifeSupport).toBe(LIFE_SUPPORT_CAP);
    expect(after.factoryRewarded).toBe(false);

    // Once the crew uses some life support there is room, so it still pays.
    const room = {
      ...after,
      resources: { ...after.resources, lifeSupport: 94 },
    };
    const paid = gameReducer(room, {
      type: 'COMPLETE_FACTORY',
      stations: FACTORY_STATION_TOTAL,
    });
    expect(paid.resources.lifeSupport).toBe(
      94 + FACTORY_REWARD_LIFE_SUPPORT,
    );
    expect(paid.factoryRewarded).toBe(true);
  });

  it('keeps the latest report point in sync after a result-screen run', () => {
    const result = inResult();
    expect(result.phase).toBe('result');
    expect(result.resourceHistory.length).toBeGreaterThan(0);
    const lastBefore = result.resourceHistory[result.resourceHistory.length - 1];

    const after = gameReducer(result, {
      type: 'COMPLETE_FACTORY',
      stations: FACTORY_STATION_TOTAL,
    });
    const lastAfter = after.resourceHistory[after.resourceHistory.length - 1];

    expect(after.resourceHistory).toHaveLength(result.resourceHistory.length);
    expect(lastAfter.lifeSupport).toBe(
      lastBefore.lifeSupport + FACTORY_REWARD_LIFE_SUPPORT,
    );
    expect(lastAfter.lifeSupport).toBe(after.resources.lifeSupport);
  });
});
