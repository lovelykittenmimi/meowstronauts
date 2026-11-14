import fixturesJson from '../data/video-fixtures.json';
import { createInitialState, enterSol, gameReducer } from './reducer';
import type { Difficulty, GameState, Resources } from './types';

export type VideoMode = 's1' | 'report';

interface FixtureStep {
  sol: number;
  eventId: string;
  choiceId: string;
}

interface VideoFixture {
  difficulty: Difficulty;
  startResources?: Resources;
  steps: FixtureStep[];
  collectedCards: string[];
}

const FIXTURES = fixturesJson as unknown as Record<VideoMode, VideoFixture>;

/**
 * Replay a fixture through the real reducer with fixed rolls. No Math.random,
 * no localStorage; every reload produces the same state.
 */
export function buildVideoState(mode: VideoMode): GameState {
  const fixture = FIXTURES[mode];

  let state = createInitialState(
    fixture.difficulty,
    'en',
    fixture.startResources,
    fixture.collectedCards,
  );
  state = enterSol(state);

  for (const step of fixture.steps) {
    state = gameReducer(state, { type: 'OPEN_EVENT', eventId: step.eventId });
    state = gameReducer(state, { type: 'CHOOSE', choiceId: step.choiceId, roll: 1 });
    state = gameReducer(state, { type: 'CONTINUE' });
  }

  if (mode === 's1') {
    state = gameReducer(state, { type: 'OPEN_EVENT', eventId: 'S1' });
    return { ...state, phase: 'choice', videoMode: mode, lang: 'en' };
  }

  return {
    ...state,
    phase: 'report',
    currentEventId: undefined,
    videoMode: mode,
    lang: 'en',
    newCards: [],
  };
}
