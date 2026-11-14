import { EVENT_CARDS, EVENT_BY_ID, TUTORIAL_CARD } from './events';
import { makeContext } from './conditions';
import { createRng } from './rng';
import type { EventCard, GameState } from './types';

export const FIXED_S1_SOL = 4;

/** S1 is fixed at Sol 4; other sols draw from the cards whose conditions hold. */
export function drawEventFor(state: GameState): EventCard {
  if (state.sol === 1 && !state.history.some((entry) => entry.eventId === 'T1')) {
    return TUTORIAL_CARD;
  }

  const s1Pending =
    state.sol === FIXED_S1_SOL &&
    !state.flags.s1Resolved &&
    !state.history.some((entry) => entry.eventId === 'S1');

  if (s1Pending) return EVENT_BY_ID.get('S1')!;

  const context = makeContext(
    state.sol,
    state.resources,
    state.weather,
    state.flags.s1Resolved,
  );
  const seen = new Set(state.history.map((entry) => entry.eventId));
  const inRange = EVENT_CARDS.filter(
    (card) =>
      card.id !== 'S1' && state.sol >= card.minSol && state.sol <= card.maxSol,
  );

  const eligible = EVENT_CARDS.filter(
    (card) => card.id !== 'S1' && (!card.when || card.when(context)),
  );
  const eligibleIds = new Set(eligible.map((card) => card.id));

  const lastEventId = state.history[state.history.length - 1]?.eventId;

  // Prefer unseen cards whose conditions hold.
  let pool = inRange.filter((card) => !seen.has(card.id) && eligibleIds.has(card.id));

  // One run must not repeat a card while an unseen eligible one exists
  // (docs/test-plan.md). Check outside the sol window too: Sol 7 has only F1
  // in range, so looking at the window alone repeats an earlier sol (often the
  // Sol 2 card) even though plenty of unseen cards still qualify. Card copy
  // must match the current sol's conditions, so `when` still applies.
  if (pool.length === 0) pool = eligible.filter((card) => !seen.has(card.id));

  // Every eligible card was already played: a repeat cannot be avoided.
  // Prefer a card whose sol window fits; never repeat yesterday's event.
  if (pool.length === 0) {
    pool = inRange.filter(
      (card) =>
        seen.has(card.id) && eligibleIds.has(card.id) && card.id !== lastEventId,
    );
  }
  if (pool.length === 0) {
    pool = eligible.filter((card) => card.id !== lastEventId);
  }
  // Only one eligible card exists: repeating it is better than an ineligible one.
  if (pool.length === 0) {
    pool = inRange.filter((card) => eligibleIds.has(card.id));
  }
  if (pool.length === 0) pool = eligible;
  // Last resort: any non-S1 card, still avoiding S1 outside Sol 4.
  if (pool.length === 0) pool = inRange;
  if (pool.length === 0) pool = EVENT_CARDS.filter((card) => card.id !== 'S1');

  const rng = createRng(`${state.seed}:${state.sol}:${state.history.length}:deck`);
  return rng.pick(pool);
}
