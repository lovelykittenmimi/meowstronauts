import { STAR_3_SCIENCE } from './balance';
import { EVENT_CARDS, EVENT_BY_ID, TUTORIAL_CARD } from './events';
import { makeContext } from './conditions';
import { createRng } from './rng';
import type { CardCategory, EventCard, GameState, Resources } from './types';

export const FIXED_S1_SOL = 4;

/** docs/event-cards.md §3.1 rule 3: at most two cards per category (S1 aside). */
const CATEGORY_CAP = 2;
/** §3.1 rule 4: the cap bends to three before a draw would be left empty. */
const CATEGORY_HARD_CAP = 3;
/** §3.3: when candidates run short, resource thresholds relax by ten points. */
const RELAX_STEP = 10;
/** §3.1 rule 2: every run shows at least one of each. */
const REQUIRED_CATEGORIES: CardCategory[] = ['power', 'lifeSupport', 'food'];

/**
 * Ten points more desperate. Every `when` in the MVP checks a resource
 * threshold from below (or a weather/story flag), so lowering the numbers is
 * exactly "relax the threshold by ten"; flags and weather are untouched.
 */
function relaxed(resources: Resources): Resources {
  return {
    power: resources.power - RELAX_STEP,
    lifeSupport: resources.lifeSupport - RELAX_STEP,
    shield: resources.shield - RELAX_STEP,
    food: resources.food - RELAX_STEP,
    health: resources.health - RELAX_STEP,
    science: resources.science - RELAX_STEP,
  };
}

/** The last sol on which this category can still appear in its window. */
function lastSolFor(category: CardCategory): number {
  return EVENT_CARDS.reduce(
    (last, card) =>
      card.category === category && card.id !== 'S1'
        ? Math.max(last, card.maxSol)
        : last,
    0,
  );
}

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

  // SC2 is the only science card, and its own `when` gate used to hide it from
  // runs that were doing well. On Sol 5, if the three-star science line is
  // still out of reach and the survey has not appeared, serve it: the player
  // still has to spend power and choose the science option. Sol 5 is before
  // the Sol 6 last-chance draws for power and life support, so this cannot
  // crowd out a required category.
  if (
    state.sol === 5 &&
    state.resources.science < STAR_3_SCIENCE &&
    !state.history.some((entry) => entry.eventId === 'SC2')
  ) {
    return EVENT_BY_ID.get('SC2')!;
  }

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

  // §3.3: resource thresholds may relax ten points when few cards fit; the
  // weather tag and story flags still gate every card.
  const relaxedEligible = EVENT_CARDS.filter(
    (card) =>
      card.id !== 'S1' &&
      (!card.when ||
        card.when(
          makeContext(
            state.sol,
            relaxed(state.resources),
            state.weather,
            state.flags.s1Resolved,
          ),
        )),
  );
  const relaxedIds = new Set(relaxedEligible.map((card) => card.id));

  const lastEventId = state.history[state.history.length - 1]?.eventId;

  // Prefer unseen cards whose conditions hold.
  let pool = inRange.filter((card) => !seen.has(card.id) && eligibleIds.has(card.id));

  // Nothing fits strictly: relax the thresholds before giving up on the sol.
  if (pool.length === 0) {
    pool = inRange.filter((card) => !seen.has(card.id) && relaxedIds.has(card.id));
  }

  // Still nothing: look outside the sol window for an unseen card. Sol 7 has
  // only F1 in range, so the window alone repeats an earlier sol even though
  // plenty of unseen cards still qualify. `when` still applies.
  if (pool.length === 0) {
    pool = eligible.filter((card) => !seen.has(card.id));
  }
  if (pool.length === 0) {
    pool = relaxedEligible.filter((card) => !seen.has(card.id));
  }

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
  if (pool.length === 0) {
    pool = relaxedEligible.filter((card) => card.id !== lastEventId);
  }
  // Only one eligible card exists: repeating it is better than an ineligible one.
  if (pool.length === 0) {
    pool = inRange.filter((card) => eligibleIds.has(card.id));
  }
  if (pool.length === 0) pool = eligible;
  // Last resort: any non-S1 card, still avoiding S1 outside Sol 4.
  if (pool.length === 0) pool = inRange;
  if (pool.length === 0) pool = EVENT_CARDS.filter((card) => card.id !== 'S1');

  // §3.1: every run shows power, life support and food at least once, and no
  // category more than twice. A missing category is forced on its last sol in
  // range; the cap stretches to three rather than leaving the pool empty.
  const counts = new Map<CardCategory, number>();
  for (const entry of state.history) {
    const card = EVENT_BY_ID.get(entry.eventId);
    if (!card || card.id === 'S1') continue;
    counts.set(card.category, (counts.get(card.category) ?? 0) + 1);
  }
  const lastChance = REQUIRED_CATEGORIES.filter(
    (category) => !counts.get(category) && state.sol >= lastSolFor(category),
  );

  if (lastChance.length > 0) {
    const forced = pool.filter((card) => lastChance.includes(card.category));
    if (forced.length > 0) pool = forced;
  }
  const insideCap = pool.filter(
    (card) => (counts.get(card.category) ?? 0) < CATEGORY_CAP,
  );
  if (insideCap.length > 0) {
    pool = insideCap;
  } else {
    const stretched = pool.filter(
      (card) => (counts.get(card.category) ?? 0) < CATEGORY_HARD_CAP,
    );
    if (stretched.length > 0) pool = stretched;
  }

  const rng = createRng(`${state.seed}:${state.sol}:${state.history.length}:deck`);
  return rng.pick(pool);
}
