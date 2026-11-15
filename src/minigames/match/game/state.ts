import glossaryData from '../../../data/glossary.json';
import type { Localized } from '../../../game/types';

export const MATCH_ROUNDS = 3;
export const MATCH_PAIRS_PER_ROUND = 5;
export const MATCH_TOTAL_CARDS = MATCH_ROUNDS * MATCH_PAIRS_PER_ROUND;

export interface GlossaryCard {
  id: string;
  term: Localized;
  short: Localized;
}

const GLOSSARY = glossaryData as unknown as Record<string, GlossaryCard>;

/**
 * The three review themes. Keep the ids in sync with the 20 backpack cards;
 * the state test fails if any glossary card is missing.
 */
export const MATCH_GROUPS = [
  {
    theme: 'themeSpace',
    ids: [
      'solarStorm',
      'solarFlare',
      'cme',
      'radiation',
      'geomagneticStorm',
      'solarWind',
    ],
  },
  {
    theme: 'themeMars',
    ids: [
      'atmosphere',
      'subsurfaceIce',
      'dustStorm',
      'dustDevil',
      'micrometeorite',
      'gravity',
      'pressure',
      'sol',
    ],
  },
  {
    theme: 'themeBase',
    ids: [
      'waterRecycling',
      'oxygenRecovery',
      'greenhouse',
      'solarPower',
      'radiationShielding',
      'commsDelay',
    ],
  },
] as const;

export const MATCH_THEME_KEYS = MATCH_GROUPS.map((group) => group.theme);

const ALL_IDS = MATCH_GROUPS.flatMap((group) => group.ids);

export type MatchKind = 'term' | 'meaning';
export type MatchFeedback = 'sameKind' | 'matched' | null;

export interface MatchCard {
  id: string;
  termId: string;
  kind: MatchKind;
}

export interface MatchGame {
  round: number;
  cardsByRound: MatchCard[][];
  roundTerms: string[][];
  cards: MatchCard[];
  selected: number | null;
  wrongPair: [number, number] | null;
  matched: string[];
  wrong: number;
  feedback: MatchFeedback;
  resolving: boolean;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], rand: () => number): T[] {
  const out = [...items];
  for (let index = out.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rand() * (index + 1));
    [out[index], out[swap]] = [out[swap], out[index]];
  }
  return out;
}

function pickRoundTerms(
  preferred: readonly string[],
  used: Set<string>,
  rand: () => number,
): string[] {
  const picked = shuffle(
    preferred.filter((id) => !used.has(id)),
    rand,
  ).slice(0, MATCH_PAIRS_PER_ROUND);

  if (picked.length < MATCH_PAIRS_PER_ROUND) {
    const fill = shuffle(
      ALL_IDS.filter((id) => !used.has(id) && !picked.includes(id)),
      rand,
    );
    picked.push(...fill.slice(0, MATCH_PAIRS_PER_ROUND - picked.length));
  }

  for (const id of picked) used.add(id);
  return picked;
}

function buildBoard(terms: string[], round: number, rand: () => number): MatchCard[] {
  const cards: MatchCard[] = [];
  for (const termId of terms) {
    cards.push({
      id: `${round}-${termId}-term`,
      termId,
      kind: 'term',
    });
    cards.push({
      id: `${round}-${termId}-meaning`,
      termId,
      kind: 'meaning',
    });
  }
  return shuffle(cards, rand);
}

export function createGame(seed?: number): MatchGame {
  const rand = seed === undefined ? Math.random : mulberry32(seed);
  const used = new Set<string>();
  const roundTerms = MATCH_GROUPS.map((group) =>
    pickRoundTerms(group.ids, used, rand),
  );
  const cardsByRound = roundTerms.map((terms, index) =>
    buildBoard(terms, index + 1, rand),
  );
  return {
    round: 1,
    cardsByRound,
    roundTerms,
    cards: cardsByRound[0],
    selected: null,
    wrongPair: null,
    matched: [],
    wrong: 0,
    feedback: null,
    resolving: false,
  };
}

export function glossaryCard(termId: string): GlossaryCard | undefined {
  return GLOSSARY[termId];
}

export function themeKeyForRound(round: number) {
  return MATCH_THEME_KEYS[Math.min(Math.max(round, 1), MATCH_ROUNDS) - 1];
}

export function isRoundComplete(game: MatchGame): boolean {
  return game.matched.length === MATCH_PAIRS_PER_ROUND;
}

export function isGameComplete(game: MatchGame): boolean {
  return game.round === MATCH_ROUNDS && isRoundComplete(game);
}

/**
 * Tap a card. A term + its meaning locks in; two cards of the same kind keep
 * the first selection and show a hint; any other pair becomes a wrong attempt
 * that the caller clears after the red flash.
 */
export function selectCard(game: MatchGame, index: number): MatchGame {
  if (game.resolving || isRoundComplete(game)) return game;
  const card = game.cards[index];
  if (!card || game.matched.includes(card.termId)) return game;

  if (game.selected === index) {
    return { ...game, selected: null, feedback: null };
  }

  if (game.selected === null) {
    return { ...game, selected: index, feedback: null };
  }

  const first = game.cards[game.selected];
  if (!first) return { ...game, selected: index, feedback: null };

  if (first.kind === card.kind) {
    return { ...game, feedback: 'sameKind' };
  }

  if (first.termId === card.termId) {
    const matched = [...game.matched, first.termId];
    return {
      ...game,
      selected: null,
      matched,
      feedback: 'matched',
    };
  }

  return {
    ...game,
    selected: null,
    wrongPair: [game.selected, index],
    wrong: game.wrong + 1,
    feedback: null,
    resolving: true,
  };
}

/** Clear the red flash and let the player try again. */
export function resolveWrong(game: MatchGame): MatchGame {
  if (!game.resolving) return game;
  return {
    ...game,
    selected: null,
    wrongPair: null,
    resolving: false,
  };
}

/** Move to the next round after all five pairs on this board are matched. */
export function advanceRound(game: MatchGame): MatchGame {
  if (!isRoundComplete(game) || game.round >= MATCH_ROUNDS) return game;
  const round = game.round + 1;
  return {
    ...game,
    round,
    cards: game.cardsByRound[round - 1],
    selected: null,
    wrongPair: null,
    matched: [],
    feedback: null,
    resolving: false,
  };
}
