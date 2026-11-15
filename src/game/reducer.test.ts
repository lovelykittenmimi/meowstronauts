import glossary from '../data/glossary.json';
import { scoreStars } from './balance';
import { drawEventFor } from './deck';
import { createInitialState, enterSol, gameReducer, starsFor } from './reducer';
import { EVENT_BY_ID } from './events';

function started() {
  return gameReducer(createInitialState('officer', 'en'), {
    type: 'START_GAME',
    difficulty: 'officer',
  });
}

describe('daily resolution', () => {
  it('applies the first daily drain when the mission starts', () => {
    const state = started();
    expect(state.phase).toBe('briefing');
    expect(state.resources).toEqual({
      power: 62,
      lifeSupport: 64,
      shield: 55,
      food: 5,
      health: 100,
      science: 0,
    });
  });

  it('applies zero penalties after the drain and only once', () => {
    const state = {
      ...started(),
      resources: {
        power: 5,
        lifeSupport: 5,
        shield: 5,
        food: 1,
        health: 100,
        science: 0,
      },
    };
    const next = enterSol(state);
    expect(next.resources.power).toBe(0);
    expect(next.resources.lifeSupport).toBe(0);
    expect(next.resources.shield).toBe(0);
    expect(next.resources.food).toBe(0);
    expect(next.resources.health).toBe(30);
  });

  it('keeps duration effects running for later sols', () => {
    let state = started();
    state = gameReducer(state, { type: 'OPEN_EVENT', eventId: 'P1' });
    state = { ...state, resources: { ...state.resources, power: 50 } };
    state = gameReducer(state, { type: 'CHOOSE', choiceId: 'leave' });
    expect(state.resources.power).toBe(46);
    expect(state.statuses).toHaveLength(1);

    const next = gameReducer(state, { type: 'CONTINUE' });
    expect(next.sol).toBe(2);
    // 46 − 8 daily − 4 status = 34.
    expect(next.resources.power).toBe(34);
    expect(next.statuses).toHaveLength(0);
  });

  it('uses risk effects instead of success effects on a failed roll', () => {
    let state = started();
    state = gameReducer(state, { type: 'OPEN_EVENT', eventId: 'P1' });
    state = {
      ...state,
      resources: { ...state.resources, power: 50, health: 100 },
    };
    state = gameReducer(state, { type: 'CHOOSE', choiceId: 'shake', roll: 0 });
    expect(state.resources.power).toBe(45);
    expect(state.resources.health).toBe(97);
    expect(state.lastSuccess).toBe(false);
    expect(state.history.at(-1)?.effects).toEqual({ power: -5, health: -3 });
  });

  it('clamps every resource and pauses on zero health', () => {
    let state = started();
    state = gameReducer(state, { type: 'OPEN_EVENT', eventId: 'S1' });
    state = { ...state, resources: { ...state.resources, power: 5 } };
    state = gameReducer(state, { type: 'CHOOSE', choiceId: 'shield-up' });
    expect(state.resources.power).toBe(0);

    const over = { ...state, phase: 'result' as const, resources: { ...state.resources, health: 0 } };
    const next = gameReducer(over, { type: 'CONTINUE' });
    expect(next.phase).toBe('gameover');
  });
});

describe('deck', () => {
  it('fixes S1 at Sol 4 and only there', () => {
    const base = started();
    expect(drawEventFor({ ...base, sol: 4 }).id).toBe('S1');
    expect(drawEventFor({ ...base, sol: 3 }).id).not.toBe('S1');
    expect(drawEventFor({ ...base, sol: 5 }).id).not.toBe('S1');
  });

  it('is deterministic for the same state', () => {
    const base = started();
    expect(drawEventFor(base).id).toBe(drawEventFor(base).id);
  });

  it('gates F1 on food of four or less', () => {
    const card = EVENT_BY_ID.get('F1')!;
    const context = {
      sol: 3,
      resources: { power: 70, lifeSupport: 70, shield: 60, food: 5, health: 100, science: 0 },
      flags: { crashDust: false, flareForecast: true, commsWindow: true, s1Resolved: false },
      weather: { sol: 3, terrestrialDate: '2025-05-17', maxTempC: -31, minTempC: -80, tags: ['cold_snap'] },
    };
    expect(card.when!(context)).toBe(false);
    expect(card.when!({ ...context, resources: { ...context.resources, food: 4 } })).toBe(true);
  });
});

describe('full mission', () => {
  it('plays all seven sols through to the mission report', () => {
    let state = started();
    const events: string[] = [];

    for (let sol = 1; sol <= 7; sol += 1) {
      expect(state.phase).toBe('briefing');
      expect(state.sol).toBe(sol);

      const event = drawEventFor(state);
      events.push(event.id);
      state = gameReducer(state, { type: 'OPEN_EVENT', eventId: event.id });
      expect(state.phase).toBe('choice');

      const choice = event.choices.find(
        (item) => !item.requires || state.catCharges[item.requires] > 0,
      );
      expect(choice).toBeTruthy();
      state = gameReducer(state, { type: 'CHOOSE', choiceId: choice!.id, roll: 1 });
      expect(state.phase).toBe('result');
      expect(state.resourceHistory).toHaveLength(sol);

      state = gameReducer(state, { type: 'CONTINUE' });
    }

    expect(events[0]).toBe('T1');
    expect(events.filter((id) => id === 'S1')).toHaveLength(1);
    expect(events[3]).toBe('S1');
    events.forEach((id, index) => {
      if (index > 0) expect(id).not.toBe(events[index - 1]);
    });

    // docs/event-cards.md §3.1: one of each survival category, at most two
    // per category (S1 is the fixed flare card and does not count).
    const counts = new Map<string, number>();
    for (const id of events.filter((eventId) => eventId !== 'S1')) {
      const category = EVENT_BY_ID.get(id)!.category;
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
    for (const category of ['power', 'lifeSupport', 'food']) {
      expect(counts.get(category) ?? 0, `missing ${category}`).toBeGreaterThan(0);
    }
    for (const [category, count] of counts) {
      expect(count, `${category} appeared ${count} times`).toBeLessThanOrEqual(2);
    }

    expect(['report', 'gameover']).toContain(state.phase);
    expect(state.sol).toBe(7);
  });

  it('keeps the chosen difficulty on restart', () => {
    let state = gameReducer(createInitialState('ace', 'en'), {
      type: 'START_GAME',
      difficulty: 'ace',
    });
    state = gameReducer(state, { type: 'RESTART' });
    expect(state.difficulty).toBe('ace');
    expect(state.resources.power).toBe(60);
  });
});

describe('backpack, assists, and scoring', () => {
  it('adds a card once and turns eight into nine', () => {
    let state = started();
    state = {
      ...state,
      collectedCards: Object.keys(glossary)
        .filter((id) => id !== 'solarFlare')
        .slice(0, 8),
    };
    state = gameReducer(state, { type: 'COLLECT_CARD', cardId: 'solarFlare' });
    expect(state.collectedCards).toHaveLength(9);
    state = gameReducer(state, { type: 'COLLECT_CARD', cardId: 'solarFlare' });
    expect(state.collectedCards).toHaveLength(9);
  });

  it('spends one assist charge and applies one effect', () => {
    let state = started();
    state = gameReducer(state, { type: 'OPEN_EVENT', eventId: 'S1' });
    state = { ...state, resources: { ...state.resources, power: 10 } };
    state = gameReducer(state, { type: 'USE_ASSIST', cat: 'shadow' });
    expect(state.resources.power).toBe(22);
    expect(state.catCharges.shadow).toBe(1);

    state = gameReducer(state, { type: 'USE_ASSIST', cat: 'shadow' });
    state = gameReducer(state, { type: 'USE_ASSIST', cat: 'shadow' });
    expect(state.resources.power).toBe(34);
    expect(state.catCharges.shadow).toBe(0);
  });

  it('scores three stars only for health and science above the line', () => {
    expect(scoreStars(70, 6, false)).toBe(3);
    expect(scoreStars(70, 5, false)).toBe(2);
    expect(scoreStars(69, 6, false)).toBe(2);
    expect(scoreStars(70, 6, true)).toBe(2);
    expect(scoreStars(49, 4, false)).toBe(1);
  });

  it('reads stars from the state', () => {
    const state = started();
    expect(starsFor({ ...state, resources: { ...state.resources, health: 78, science: 6 } })).toBe(3);
  });
});
