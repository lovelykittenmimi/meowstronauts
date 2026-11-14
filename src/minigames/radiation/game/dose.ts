import type { CatId } from '../../../game/types';
import { CAT_ORDER } from './cats';
import {
  BASELINE_GCR,
  BASELINE_SEP,
  MATERIALS,
  ROOF_BONUS,
  WALL_BONUS,
  materialCost,
} from './materials';
import type { DrillResult, PlacedMaterials, ShieldResult } from './types';

/** Relative training units. These are not mSv or a Mars surface measurement. */
export const OUTSIDE_SEP_DOSE = 100;
export const OUTSIDE_GCR_DOSE = 40;

/** A crew member inside the shelter still gets a fraction of the outside dose. */
export const INSIDE_SEP_FACTOR = 0.15;
export const INSIDE_GCR_FACTOR = 0.25;

/** A cat still outside when the front arrives gets a much larger exposure. */
export const LATE_SEP_FACTOR = 0.55;
export const LATE_GCR_FACTOR = 0.45;

export const SAFE_DOSE = 30;
export const PERFECT_DOSE = 12;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * The hull is the baseline. Layers add their SEP/GCR share, with a small
 * positional bonus where the material is most useful.
 */
export function computeShield(placed: PlacedMaterials): ShieldResult {
  let sep = BASELINE_SEP;
  let gcr = BASELINE_GCR;

  const add = (slot: 'roof' | 'wall') => {
    const id = placed[slot];
    if (!id) return;
    const material = MATERIALS[id];
    const bonus = slot === 'roof' ? ROOF_BONUS[id] : WALL_BONUS[id];
    sep += material.sep * bonus;
    gcr += material.gcr * bonus;
  };

  add('roof');
  add('wall');

  const cost = materialCost(placed);
  return {
    sep: clamp01(sep),
    gcr: clamp01(gcr),
    mass: cost.mass,
    water: cost.water,
    seconds: cost.seconds,
  };
}

/**
 * Dose for one cat. A late cat is exposed for more of the storm, but better
 * shielding still helps: mass buys time as well as protection.
 */
export function doseFor(shield: ShieldResult, late: boolean): number {
  const sepFactor = late ? LATE_SEP_FACTOR : INSIDE_SEP_FACTOR;
  const gcrFactor = late ? LATE_GCR_FACTOR : INSIDE_GCR_FACTOR;
  const raw =
    OUTSIDE_SEP_DOSE * (1 - shield.sep) * sepFactor +
    OUTSIDE_GCR_DOSE * (1 - shield.gcr) * gcrFactor;
  return Math.round(raw);
}

export function evaluateDrill(lateIds: CatId[], shield: ShieldResult): DrillResult {
  const lateSet = new Set(lateIds);
  const cats = CAT_ORDER.map((id) => ({
    id,
    late: lateSet.has(id),
    dose: doseFor(shield, lateSet.has(id)),
  }));
  const maxDose = Math.max(...cats.map((cat) => cat.dose));
  const allInside = cats.every((cat) => !cat.late);

  const stars: 1 | 2 | 3 =
    allInside && maxDose <= PERFECT_DOSE
      ? 3
      : allInside && maxDose <= SAFE_DOSE
        ? 2
        : 1;

  return {
    cats,
    shield,
    stars,
    outcome: stars === 3 ? 'perfect' : stars === 2 ? 'close' : 'rough',
    maxDose,
  };
}
