import type { Localized } from '../../../game/types';

export type FoodSourceKey = 'foodSystems' | 'nutrition' | 'veggie';

export interface FoodPair {
  /** Stable pair id; the two cards of a pair share it. */
  id: string;
  emoji: string;
  food: Localized;
  /** Short NASA fact, kept readable for 7–12 year olds. */
  fact: Localized;
  source: FoodSourceKey;
}

/**
 * Six verifiable NASA space-food facts. Sources live in
 * docs/data-sources.md §3.5; do not add a claim without a NASA page.
 */
export const FOOD_PAIRS: ReadonlyArray<FoodPair> = [
  {
    id: 'strawberries',
    emoji: '🍓',
    food: { en: 'Freeze-dried strawberries', 'zh-TW': '冷凍乾燥草莓' },
    fact: {
      en: 'Freeze-dried: water removed, light to carry, no fridge.',
      'zh-TW': '冷凍乾燥：去掉水，變輕、不用冰箱。',
    },
    source: 'foodSystems',
  },
  {
    id: 'pouch',
    emoji: '🥫',
    food: { en: 'Heat-stabilized pouch', 'zh-TW': '熱殺菌軟袋' },
    fact: {
      en: 'Heat-stabilized: sealed pouch, keeps at room temperature.',
      'zh-TW': '熱殺菌：密封軟袋，常溫保存。',
    },
    source: 'foodSystems',
  },
  {
    id: 'drink',
    emoji: '🥤',
    food: { en: 'Drink pouch', 'zh-TW': '飲料軟袋' },
    fact: {
      en: 'Drink pouch: water goes in through a one-way valve.',
      'zh-TW': '飲料袋：水從單向閥加進去。',
    },
    source: 'foodSystems',
  },
  {
    id: 'lettuce',
    emoji: '🥬',
    food: { en: 'Veggie lettuce', 'zh-TW': '太空生菜' },
    fact: {
      en: 'Veggie: grown on the ISS and eaten by astronauts in 2015.',
      'zh-TW': 'Veggie：種在太空站，2015 年太空人吃過。',
    },
    source: 'veggie',
  },
  {
    id: 'peppers',
    emoji: '🌶️',
    food: { en: 'Station chili peppers', 'zh-TW': '太空辣椒' },
    fact: {
      en: 'Station peppers: grown on the ISS; taste changes in space.',
      'zh-TW': '太空辣椒：種在太空站；太空中的味覺會改變。',
    },
    source: 'veggie',
  },
  {
    id: 'vitamin-d',
    emoji: '☀️',
    food: { en: 'Vitamin D', 'zh-TW': '維生素 D' },
    fact: {
      en: 'Vitamin D: a nutrient NASA watches because bones need calcium.',
      'zh-TW': '維生素 D：NASA 特別關注，因為骨骼需要鈣。',
    },
    source: 'nutrition',
  },
];

export type FoodCardKind = 'food' | 'fact';

export interface FoodCard {
  /** Unique card id, e.g. `strawberries-food`. */
  id: string;
  pairId: string;
  kind: FoodCardKind;
}

export interface FoodGame {
  cards: FoodCard[];
  /** Indices of face-up cards (0–2). */
  flipped: number[];
  /** Pair ids that are already matched. */
  matched: string[];
  /** Completed pair attempts; each attempt flips two cards. */
  moves: number;
  /** True while a wrong pair waits for `resolveMismatch`. */
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

function shuffle<T>(items: T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pairFor(id: string): FoodPair | undefined {
  return FOOD_PAIRS.find((pair) => pair.id === id);
}

/** Build and shuffle the 12 cards. Testing passes a seed for a stable order. */
export function createGame(seed?: number): FoodGame {
  const rand = seed === undefined ? Math.random : mulberry32(seed);
  const cards: FoodCard[] = [];
  for (const pair of FOOD_PAIRS) {
    cards.push({ id: `${pair.id}-food`, pairId: pair.id, kind: 'food' });
    cards.push({ id: `${pair.id}-fact`, pairId: pair.id, kind: 'fact' });
  }
  return {
    cards: shuffle(cards, rand),
    flipped: [],
    matched: [],
    moves: 0,
    resolving: false,
  };
}

/**
 * Flip one card. The second card resolves the attempt immediately: a match
 * locks both cards, a miss sets `resolving` until the caller flips them back.
 */
export function flipCard(game: FoodGame, index: number): FoodGame {
  if (game.resolving) return game;
  const card = game.cards[index];
  if (!card) return game;
  if (game.matched.includes(card.pairId)) return game;
  if (game.flipped.includes(index)) return game;
  if (game.flipped.length >= 2) return game;

  const flipped = [...game.flipped, index];
  if (flipped.length < 2) {
    return { ...game, flipped };
  }

  const [firstIndex, secondIndex] = flipped;
  const first = game.cards[firstIndex];
  const second = game.cards[secondIndex];
  if (first.pairId === second.pairId) {
    return {
      ...game,
      flipped: [],
      matched: [...game.matched, first.pairId],
      moves: game.moves + 1,
    };
  }
  return { ...game, flipped, moves: game.moves + 1, resolving: true };
}

/** Flip the mismatched pair face down and let the player try again. */
export function resolveMismatch(game: FoodGame): FoodGame {
  if (!game.resolving) return game;
  return { ...game, flipped: [], resolving: false };
}

export function isComplete(game: FoodGame): boolean {
  return game.matched.length === FOOD_PAIRS.length;
}
