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

  // Prefer unseen cards whose conditions hold.
  let pool = inRange.filter(
    (card) => !seen.has(card.id) && (!card.when || card.when(context)),
  );

  // Fewer than six candidates: allow a repeat rather than break the conditions.
  // Never repeat the event played on the previous sol.
  const lastEventId = state.history[state.history.length - 1]?.eventId;
  if (pool.length < 6) {
    pool = [
      ...pool,
      ...inRange.filter(
        (card) =>
          seen.has(card.id) &&
          card.id !== lastEventId &&
          (!card.when || card.when(context)),
      ),
    ];
  }

  // Last resort: draw an unseen card rather than repeat yesterday's event.
  if (pool.length === 0) {
    pool = EVENT_CARDS.filter((card) => card.id !== 'S1' && !seen.has(card.id));
  }
  if (pool.length === 0) pool = inRange;
  if (pool.length === 0) pool = EVENT_CARDS.filter((card) => card.id !== 'S1');

  const rng = createRng(`${state.seed}:${state.sol}:${state.history.length}:deck`);
  return rng.pick(pool);
}
