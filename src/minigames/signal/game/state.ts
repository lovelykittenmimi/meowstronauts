/**
 * Pure state for the signal-delay practice.
 *
 * Earth and Mars are 3 to 22 light-minutes apart. Each round asks for the
 * one-way travel time; the animation is compressed so the wait stays short.
 * Facts come from the commsDelay glossary card (NASA Mars Relay Network).
 */

export interface SignalRound {
  id: string;
  /** One-way distance in light-minutes, rounded for a 7–12 audience. */
  lightMinutes: number;
}

export const SIGNAL_ROUNDS: readonly SignalRound[] = [
  { id: 'near', lightMinutes: 3 },
  { id: 'mid', lightMinutes: 14 },
  { id: 'far', lightMinutes: 22 },
];

export type SignalAnswerId = 'seconds' | 'oneWay' | 'roundTrip';
export type SignalHintKey = 'hintSeconds' | 'hintRoundTrip';

export interface SignalOption {
  id: SignalAnswerId;
  /** The number shown in the option label. */
  minutes: number;
}

/**
 * Three answers per round: the right unit, the wrong unit, and the round trip.
 * The order rotates by round so the correct answer is not always in the same
 * place, without needing a random source.
 */
export function optionsFor(lightMinutes: number, roundIndex = 0): SignalOption[] {
  const base: SignalOption[] = [
    { id: 'seconds', minutes: lightMinutes },
    { id: 'oneWay', minutes: lightMinutes },
    { id: 'roundTrip', minutes: lightMinutes * 2 },
  ];
  const shift = ((roundIndex % base.length) + base.length) % base.length;
  return [...base.slice(shift), ...base.slice(0, shift)];
}

export function isCorrect(id: SignalAnswerId): boolean {
  return id === 'oneWay';
}

export function hintFor(id: SignalAnswerId): SignalHintKey | null {
  if (id === 'seconds') return 'hintSeconds';
  if (id === 'roundTrip') return 'hintRoundTrip';
  return null;
}

/** Compressed travel time for one leg; real minutes would be far too slow. */
export function travelMs(lightMinutes: number): number {
  return Math.min(2400, 600 + Math.round(lightMinutes * 60));
}

export interface SignalGame {
  round: number;
  wrong: number;
}

export function createGame(): SignalGame {
  return { round: 0, wrong: 0 };
}

export function currentRound(game: SignalGame): SignalRound | undefined {
  return SIGNAL_ROUNDS[game.round];
}

export function recordAnswer(game: SignalGame, id: SignalAnswerId): SignalGame {
  if (isCorrect(id)) return game;
  return { ...game, wrong: game.wrong + 1 };
}

export function advance(game: SignalGame): SignalGame {
  return { ...game, round: Math.min(SIGNAL_ROUNDS.length, game.round + 1) };
}

export function isComplete(game: SignalGame): boolean {
  return game.round >= SIGNAL_ROUNDS.length;
}
