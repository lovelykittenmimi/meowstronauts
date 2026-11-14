import {
  DAILY_DRAIN,
  FOOD_CAP,
  FOOD_GAME_REWARD_FOOD,
  FOOD_PAIR_TOTAL,
  HOP_REWARD_SCIENCE,
  HOP_SAMPLE_TOTAL,
  INITIAL_RESOURCES,
  MAX_SOL,
  addEffects,
  clampResources,
  scoreStars,
  zeroPenaltyFor,
} from './balance';
import { flagsForSol } from './conditions';
import { getWeather } from './weather';
import { EVENT_BY_ID } from './events';
import { getKnowledgeCard, KNOWLEDGE_IDS, termSlug } from './knowledge';
import { createRng } from './rng';
import type {
  CatId,
  Choice,
  Difficulty,
  EffectMap,
  GameAction,
  GameState,
  Lang,
  Resources,
  StatusEffect,
} from './types';

export const DEFAULT_SEED = 'meowstronauts-2025-05-14';

const DEFAULT_CHARGES: Record<CatId, number> = {
  silver: 2,
  shadow: 2,
  ginger: 2,
};

function baseResources(difficulty: Difficulty): Resources {
  return { ...INITIAL_RESOURCES[difficulty] };
}

export function createInitialState(
  difficulty: Difficulty = 'officer',
  lang: Lang = 'en',
  resources?: Resources,
  collectedCards: string[] = [],
): GameState {
  return {
    sol: 1,
    phase: 'title',
    resources: resources ? clampResources(resources) : baseResources(difficulty),
    catCharges: { ...DEFAULT_CHARGES },
    collectedCards: [...collectedCards],
    newCards: [],
    history: [],
    statuses: [],
    flags: flagsForSol(1),
    weather: getWeather(1),
    lang,
    difficulty,
    seed: DEFAULT_SEED,
    resourceHistory: [],
    emergencyUsed: false,
    hopRewarded: false,
    foodGameRewarded: false,
  };
}

/**
 * Start a sol: daily drain, then any running status effects, then zero
 * penalties. The order is the contract in docs/event-cards.md §4.
 */
export function enterSol(state: GameState): GameState {
  const drained = addEffects(state.resources, DAILY_DRAIN);

  let withStatuses = drained;
  const survivingStatuses: StatusEffect[] = [];
  for (const status of state.statuses) {
    withStatuses = addEffects(withStatuses, status.effects);
    if (status.remaining > 1) {
      survivingStatuses.push({ ...status, remaining: status.remaining - 1 });
    }
  }

  const penalty = zeroPenaltyFor(withStatuses);
  const resources = addEffects(withStatuses, penalty);

  return {
    ...state,
    resources,
    statuses: survivingStatuses,
    flags: flagsForSol(state.sol, state.flags.s1Resolved),
    weather: getWeather(state.sol),
    phase: 'briefing',
    currentEventId: undefined,
    lastChoiceId: undefined,
    lastSuccess: undefined,
    lastEffects: undefined,
    lastOutcome: undefined,
  };
}

function deterministicRoll(state: GameState, choiceId: string): number {
  const rng = createRng(
    `${state.seed}:${state.sol}:${state.currentEventId}:${choiceId}:${state.history.length}`,
  );
  return rng.next();
}

function choiceCost(choice: Choice, failed: boolean): EffectMap {
  return failed && choice.risk ? choice.risk.effects : choice.effects;
}

function addKnowledgeToState(
  state: GameState,
  cardId: string,
): Pick<GameState, 'collectedCards' | 'newCards'> {
  if (!getKnowledgeCard(cardId) || state.collectedCards.includes(cardId)) {
    return {
      collectedCards: state.collectedCards,
      newCards: state.newCards.filter((id) => id !== cardId),
    };
  }
  return {
    collectedCards: [...state.collectedCards, cardId],
    newCards: state.newCards.filter((id) => id !== cardId),
  };
}

function handleChoose(
  state: GameState,
  choiceId: string,
  rollOverride?: number,
): GameState {
  if (state.phase !== 'choice' || !state.currentEventId) return state;
  const event = EVENT_BY_ID.get(state.currentEventId);
  if (!event) return state;

  const choice = event.choices.find((item) => item.id === choiceId);
  if (!choice) return state;

  if (choice.requires && state.catCharges[choice.requires] <= 0) return state;

  const roll = rollOverride ?? deterministicRoll(state, choice.id);
  const failed = Boolean(choice.risk && roll < choice.risk.chance);
  const effects = choiceCost(choice, failed);

  const catCharges = { ...state.catCharges };
  if (choice.requires) catCharges[choice.requires] -= 1;

  let resources = addEffects(state.resources, effects);
  const nextStatuses = state.statuses.filter(
    (status) => status.id !== `${event.id}:${choice.id}`,
  );
  if (choice.duration && choice.duration > 1 && Object.keys(effects).length > 0) {
    nextStatuses.push({
      id: `${event.id}:${choice.id}`,
      label: choice.label,
      effects,
      remaining: choice.duration - 1,
    });
  }

  const newCards = [...state.newCards];
  if (choice.knowledgeCard && !state.collectedCards.includes(choice.knowledgeCard)) {
    if (!newCards.includes(choice.knowledgeCard)) newCards.push(choice.knowledgeCard);
  }

  resources = clampResources(resources);

  return {
    ...state,
    phase: 'result',
    resources,
    catCharges,
    statuses: nextStatuses,
    newCards,
    history: [
      ...state.history,
      {
        sol: state.sol,
        eventId: event.id,
        choiceId: choice.id,
        effects,
        success: !failed,
      },
    ],
    flags: {
      ...state.flags,
      s1Resolved: state.flags.s1Resolved || event.id === 'S1',
    },
    resourceHistory: [...state.resourceHistory, resources],
    lastChoiceId: choice.id,
    lastSuccess: !failed,
    lastEffects: effects,
    lastOutcome: choice.outcome,
  };
}

function handleAssist(
  state: GameState,
  cat: CatId,
  variant?: 'power' | 'food' | 'lifeSupport',
): GameState {
  if (state.phase !== 'choice' || state.catCharges[cat] <= 0) return state;

  const catCharges = { ...state.catCharges, [cat]: state.catCharges[cat] - 1 };
  let resources = state.resources;
  let cards = state.collectedCards;
  let newCards = state.newCards;

  if (cat === 'shadow') {
    resources = addEffects(resources, { power: 12 });
  } else if (cat === 'ginger') {
    resources = addEffects(
      resources,
      variant === 'lifeSupport' ? { lifeSupport: 10 } : { food: 1 },
    );
  } else {
    const event = state.currentEventId
      ? EVENT_BY_ID.get(state.currentEventId)
      : undefined;
    const candidate = event?.terms?.find(
      (term) => getKnowledgeCard(term) && !state.collectedCards.includes(term),
    );
    if (candidate) {
      const added = addKnowledgeToState(state, candidate);
      cards = added.collectedCards;
      newCards = added.newCards;
    }
  }

  return { ...state, catCharges, resources, collectedCards: cards, newCards };
}

/**
 * The Sol 1 hop is optional practice: all three samples pay a small science
 * bonus once per mission. It is allowed between sols and after a choice, but
 * never in the deterministic `?video=` fixtures.
 */
function handleCompleteHop(state: GameState, samples: number): GameState {
  if (
    state.videoMode ||
    state.hopRewarded ||
    samples < HOP_SAMPLE_TOTAL ||
    (state.phase !== 'briefing' &&
      state.phase !== 'choice' &&
      state.phase !== 'result')
  ) {
    return state;
  }

  const resources = addEffects(state.resources, {
    science: HOP_REWARD_SCIENCE,
  });

  // During the result screen the latest history point is already on screen;
  // keep it in sync so the report curve matches the final resources.
  let resourceHistory = state.resourceHistory;
  if (state.phase === 'result' && resourceHistory.length > 0) {
    const last = resourceHistory[resourceHistory.length - 1];
    resourceHistory = [
      ...resourceHistory.slice(0, -1),
      { ...last, science: resources.science },
    ];
  }

  return { ...state, resources, resourceHistory, hopRewarded: true };
}

/**
 * The Sol 7 food flip is optional practice: matching all six pairs pays a
 * small food bonus once per mission. Same guard rails as the hop.
 */
function handleCompleteFoodGame(state: GameState, pairs: number): GameState {
  if (
    state.videoMode ||
    state.foodGameRewarded ||
    // A full pantry means no bonus now; leave the reward unclaimed so the
    // crew can still earn it later in the same mission.
    state.resources.food >= FOOD_CAP ||
    pairs < FOOD_PAIR_TOTAL ||
    (state.phase !== 'briefing' &&
      state.phase !== 'choice' &&
      state.phase !== 'result')
  ) {
    return state;
  }

  const resources = addEffects(state.resources, {
    food: FOOD_GAME_REWARD_FOOD,
  });

  // During the result screen the latest history point is already on screen;
  // keep it in sync so the report curve matches the final resources.
  let resourceHistory = state.resourceHistory;
  if (state.phase === 'result' && resourceHistory.length > 0) {
    const last = resourceHistory[resourceHistory.length - 1];
    resourceHistory = [
      ...resourceHistory.slice(0, -1),
      { ...last, food: resources.food },
    ];
  }

  return { ...state, resources, resourceHistory, foodGameRewarded: true };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const fresh = createInitialState(
        action.difficulty,
        state.lang,
        undefined,
        state.collectedCards,
      );
      return enterSol({ ...fresh, seed: state.seed });
    }

    case 'OPEN_EVENT': {
      if (state.phase !== 'briefing') return state;
      const event = EVENT_BY_ID.get(action.eventId);
      if (!event) return state;
      return {
        ...state,
        phase: 'choice',
        currentEventId: action.eventId,
        lastChoiceId: undefined,
        lastSuccess: undefined,
        lastEffects: undefined,
        lastOutcome: undefined,
      };
    }

    case 'CHOOSE':
      return handleChoose(state, action.choiceId, action.roll);

    case 'USE_ASSIST':
      return handleAssist(state, action.cat, action.variant);

    case 'COLLECT_CARD': {
      if (!getKnowledgeCard(action.cardId)) return state;
      const added = addKnowledgeToState(state, action.cardId);
      return { ...state, collectedCards: added.collectedCards, newCards: added.newCards };
    }

    case 'CONTINUE': {
      if (state.phase !== 'result') return state;
      if (state.resources.health <= 0) {
        return { ...state, phase: 'gameover' };
      }
      if (state.sol >= MAX_SOL) {
        return { ...state, phase: 'report' };
      }

      const nextSol = state.sol + 1;
      const advanced = enterSol({ ...state, sol: nextSol });
      if (advanced.resources.health <= 0) {
        return { ...advanced, phase: 'gameover' };
      }
      return advanced;
    }

    case 'SET_LANG':
      return { ...state, lang: action.lang };

    case 'COMPLETE_HOP':
      return handleCompleteHop(state, action.samples);

    case 'COMPLETE_FOOD_GAME':
      return handleCompleteFoodGame(state, action.pairs);

    case 'RESTART':
      return {
        ...createInitialState(state.difficulty, state.lang, undefined, state.collectedCards),
        seed: state.seed,
      };

    default:
      return state;
  }
}

export function starsFor(state: GameState): 1 | 2 | 3 {
  return scoreStars(state.resources.health, state.resources.science, state.emergencyUsed);
}

export { KNOWLEDGE_IDS, termSlug };
