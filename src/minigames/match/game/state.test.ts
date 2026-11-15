import glossary from '../../../data/glossary.json';
import {
  MATCH_GROUPS,
  MATCH_PAIRS_PER_ROUND,
  MATCH_ROUNDS,
  advanceRound,
  createGame,
  isGameComplete,
  isRoundComplete,
  resolveWrong,
  selectCard,
  type MatchGame,
  type MatchKind,
} from './state';

function cardIndex(game: MatchGame, termId: string, kind: MatchKind): number {
  const index = game.cards.findIndex(
    (card) => card.termId === termId && card.kind === kind,
  );
  if (index < 0) throw new Error(`missing ${termId}-${kind}`);
  return index;
}

function matchGame(game: MatchGame, termId: string): MatchGame {
  const first = selectCard(game, cardIndex(game, termId, 'term'));
  return selectCard(first, cardIndex(first, termId, 'meaning'));
}

describe('knowledge match data', () => {
  it('covers every glossary card exactly once across the three themes', () => {
    const ids = MATCH_GROUPS.flatMap((group) => group.ids);
    expect(ids).toHaveLength(20);
    expect(new Set(ids).size).toBe(20);
    expect(new Set(ids)).toEqual(new Set(Object.keys(glossary)));
  });

  it('deals five unique terms per round and fifteen unique terms overall', () => {
    const game = createGame(7);
    const all = game.roundTerms.flat();
    expect(all).toHaveLength(MATCH_ROUNDS * MATCH_PAIRS_PER_ROUND);
    expect(new Set(all).size).toBe(15);
    game.roundTerms.forEach((terms, index) => {
      expect(terms).toHaveLength(MATCH_PAIRS_PER_ROUND);
      expect(new Set(terms).size).toBe(MATCH_PAIRS_PER_ROUND);
      const groupIds = new Set<string>(MATCH_GROUPS[index].ids);
      for (const id of terms) expect(groupIds.has(id)).toBe(true);
    });
    for (const board of game.cardsByRound) {
      expect(board).toHaveLength(10);
      expect(board.filter((card) => card.kind === 'term')).toHaveLength(5);
      expect(board.filter((card) => card.kind === 'meaning')).toHaveLength(5);
    }
  });

  it('is deterministic for the same seed and redraws for a new game', () => {
    expect(createGame(7).roundTerms).toEqual(createGame(7).roundTerms);
    expect(createGame(7).roundTerms).not.toEqual(createGame(8).roundTerms);
  });
});

describe('knowledge match play', () => {
  it('matches a term with its meaning and locks the pair', () => {
    let game = createGame(7);
    const term = game.roundTerms[0][0];
    game = matchGame(game, term);

    expect(game.matched).toEqual([term]);
    expect(game.feedback).toBe('matched');
    expect(game.wrong).toBe(0);
  });

  it('keeps the first selection and hints when two cards have the same kind', () => {
    let game = createGame(7);
    const [first, second] = game.roundTerms[0];
    game = selectCard(game, cardIndex(game, first, 'term'));
    game = selectCard(game, cardIndex(game, second, 'term'));

    expect(game.feedback).toBe('sameKind');
    expect(game.selected).toBe(cardIndex(game, first, 'term'));
    expect(game.wrong).toBe(0);
  });

  it('counts only a real mismatch as wrong and clears it on resolve', () => {
    let game = createGame(7);
    const [first, second] = game.roundTerms[0];
    game = selectCard(game, cardIndex(game, first, 'term'));
    game = selectCard(game, cardIndex(game, second, 'meaning'));

    expect(game.resolving).toBe(true);
    expect(game.wrong).toBe(1);
    expect(game.wrongPair).not.toBeNull();

    game = resolveWrong(game);
    expect(game.resolving).toBe(false);
    expect(game.wrongPair).toBeNull();
    expect(game.wrong).toBe(1);
  });

  it('advances through three rounds and finishes after the last pair', () => {
    let game = createGame(7);
    for (const term of game.roundTerms[0]) game = matchGame(game, term);
    expect(isRoundComplete(game)).toBe(true);
    expect(isGameComplete(game)).toBe(false);

    game = advanceRound(game);
    expect(game.round).toBe(2);
    expect(game.matched).toHaveLength(0);
    for (const term of game.roundTerms[1]) game = matchGame(game, term);
    game = advanceRound(game);
    expect(game.round).toBe(3);
    for (const term of game.roundTerms[2]) game = matchGame(game, term);

    expect(isGameComplete(game)).toBe(true);
    expect(game.matched).toHaveLength(5);
    expect(game.wrong).toBe(0);
  });

  it('ignores cards after a round is complete until the caller advances', () => {
    let game = createGame(7);
    for (const term of game.roundTerms[0]) game = matchGame(game, term);
    const index = cardIndex(game, game.roundTerms[0][0], 'term');
    expect(selectCard(game, index)).toBe(game);
  });
});
