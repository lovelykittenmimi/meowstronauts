import { FOOD_PAIR_TOTAL } from '../../../game/balance';
import {
  FOOD_PAIRS,
  createGame,
  flipCard,
  isComplete,
  resolveMismatch,
  type FoodGame,
} from './state';

function indexOf(game: FoodGame, pairId: string, kind: 'food' | 'fact'): number {
  return game.cards.findIndex(
    (card) => card.pairId === pairId && card.kind === kind,
  );
}

function matchAll(game: FoodGame): FoodGame {
  let next = game;
  for (const pair of FOOD_PAIRS) {
    next = flipCard(next, indexOf(next, pair.id, 'food'));
    next = flipCard(next, indexOf(next, pair.id, 'fact'));
  }
  return next;
}

describe('space food flip state', () => {
  it('builds twelve cards, one food and one fact per pair', () => {
    const game = createGame(1);

    expect(game.cards).toHaveLength(12);
    expect(FOOD_PAIRS).toHaveLength(FOOD_PAIR_TOTAL);
    for (const pair of FOOD_PAIRS) {
      const cards = game.cards.filter((card) => card.pairId === pair.id);
      expect(cards).toHaveLength(2);
      expect(cards.filter((card) => card.kind === 'food')).toHaveLength(1);
      expect(cards.filter((card) => card.kind === 'fact')).toHaveLength(1);
    }
  });

  it('shuffles deterministically for a fixed seed', () => {
    const a = createGame(7).cards.map((card) => card.id);
    const b = createGame(7).cards.map((card) => card.id);
    const c = createGame(8).cards.map((card) => card.id);

    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
    expect(new Set(a).size).toBe(12);
  });

  it('locks a matching pair and clears the turn', () => {
    const game = createGame(1);
    const first = flipCard(game, indexOf(game, 'strawberries', 'food'));
    expect(first.flipped).toHaveLength(1);
    expect(first.moves).toBe(0);

    const second = flipCard(first, indexOf(first, 'strawberries', 'fact'));
    expect(second.matched).toEqual(['strawberries']);
    expect(second.flipped).toEqual([]);
    expect(second.moves).toBe(1);
    expect(second.resolving).toBe(false);
  });

  it('waits for resolveMismatch after a wrong pair', () => {
    const game = createGame(1);
    const first = flipCard(game, indexOf(game, 'strawberries', 'food'));
    const second = flipCard(first, indexOf(first, 'lettuce', 'fact'));

    expect(second.resolving).toBe(true);
    expect(second.flipped).toHaveLength(2);
    expect(second.matched).toEqual([]);
    expect(second.moves).toBe(1);

    const resolved = resolveMismatch(second);
    expect(resolved.flipped).toEqual([]);
    expect(resolved.resolving).toBe(false);
    expect(resolved.moves).toBe(1);
  });

  it('ignores taps on a face-up card, a matched card, or while resolving', () => {
    const game = createGame(1);
    const foodIndex = indexOf(game, 'strawberries', 'food');
    const flipped = flipCard(game, foodIndex);

    expect(flipCard(flipped, foodIndex)).toBe(flipped);

    const matched = flipCard(flipped, indexOf(flipped, 'strawberries', 'fact'));
    expect(flipCard(matched, foodIndex)).toBe(matched);

    const mismatch = flipCard(
      flipCard(game, foodIndex),
      indexOf(game, 'lettuce', 'fact'),
    );
    const third = indexOf(game, 'peppers', 'food');
    expect(flipCard(mismatch, third)).toBe(mismatch);
  });

  it('is complete only after all six pairs are matched', () => {
    const game = createGame(1);
    expect(isComplete(game)).toBe(false);

    let partial = game;
    for (const pair of FOOD_PAIRS.slice(0, 5)) {
      partial = flipCard(partial, indexOf(partial, pair.id, 'food'));
      partial = flipCard(partial, indexOf(partial, pair.id, 'fact'));
    }
    expect(isComplete(partial)).toBe(false);
    expect(partial.matched).toHaveLength(5);

    const complete = matchAll(game);
    expect(isComplete(complete)).toBe(true);
    expect(complete.matched).toHaveLength(FOOD_PAIR_TOTAL);
    expect(complete.moves).toBe(6);
  });
});
