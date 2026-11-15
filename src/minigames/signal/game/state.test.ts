import {
  SIGNAL_ROUNDS,
  advance,
  createGame,
  currentRound,
  hintFor,
  isComplete,
  isCorrect,
  optionsFor,
  recordAnswer,
  travelMs,
} from './state';

describe('signal delay state', () => {
  it('asks about 3, 14 and 22 light-minutes', () => {
    expect(SIGNAL_ROUNDS.map((round) => round.lightMinutes)).toEqual([3, 14, 22]);
  });

  it('offers three answers with exactly one one-way time', () => {
    for (const round of SIGNAL_ROUNDS) {
      const options = optionsFor(round.lightMinutes, 0);
      expect(options).toHaveLength(3);
      expect(new Set(options.map((option) => option.id)).size).toBe(3);
      expect(options.filter((option) => isCorrect(option.id))).toHaveLength(1);
      const roundTrip = options.find((option) => option.id === 'roundTrip');
      expect(roundTrip?.minutes).toBe(round.lightMinutes * 2);
    }
  });

  it('rotates the answer order by round', () => {
    const orders = [0, 1, 2].map((round) =>
      optionsFor(14, round).map((option) => option.id).join(','),
    );
    expect(orders).toEqual([
      'seconds,oneWay,roundTrip',
      'oneWay,roundTrip,seconds',
      'roundTrip,seconds,oneWay',
    ]);
  });

  it('gives hints for the two wrong kinds only', () => {
    expect(hintFor('seconds')).toBe('hintSeconds');
    expect(hintFor('roundTrip')).toBe('hintRoundTrip');
    expect(hintFor('oneWay')).toBeNull();
  });

  it('counts wrong answers but never removes progress', () => {
    const game = createGame();
    expect(recordAnswer(game, 'seconds').wrong).toBe(1);
    expect(recordAnswer(game, 'roundTrip').wrong).toBe(1);
    expect(recordAnswer(game, 'oneWay')).toBe(game);
  });

  it('advances one round at a time and stops complete', () => {
    let game = createGame();
    expect(currentRound(game)?.lightMinutes).toBe(3);
    game = advance(game);
    expect(currentRound(game)?.lightMinutes).toBe(14);
    game = advance(game);
    expect(currentRound(game)?.lightMinutes).toBe(22);
    expect(isComplete(game)).toBe(false);
    game = advance(game);
    expect(isComplete(game)).toBe(true);
    expect(currentRound(game)).toBeUndefined();
    expect(advance(game).round).toBe(SIGNAL_ROUNDS.length);
  });

  it('compresses travel time but keeps farther distances slower', () => {
    const near = travelMs(3);
    const mid = travelMs(14);
    const far = travelMs(22);
    expect(near).toBeGreaterThan(0);
    expect(near).toBeLessThan(mid);
    expect(mid).toBeLessThan(far);
    expect(far).toBeLessThanOrEqual(2400);
  });
});
