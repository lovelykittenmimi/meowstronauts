import type { Material, MaterialId, PlacedMaterials, SlotId } from './types';

/**
 * Game values, not a NASA efficiency ranking. NASA's article supports the
 * qualitative ideas here: mass matters, hydrogen-rich materials (water,
 * polyethylene, plastic from crew trash) are efficient, and BNNTs are still
 * experimental. The numbers only exist to make the trade-offs playable.
 */
export const MATERIALS: Record<MaterialId, Material> = {
  regolith: {
    id: 'regolith',
    icon: '🪨',
    sep: 0.22,
    gcr: 0.2,
    mass: 38,
    water: 0,
    seconds: 8,
  },
  water: {
    id: 'water',
    icon: '💧',
    sep: 0.2,
    gcr: 0.16,
    mass: 26,
    water: 2,
    seconds: 4,
  },
  polyethylene: {
    id: 'polyethylene',
    icon: '🧱',
    sep: 0.12,
    gcr: 0.1,
    mass: 14,
    water: 0,
    seconds: 3,
  },
  trash: {
    id: 'trash',
    icon: '🗑️',
    sep: 0.09,
    gcr: 0.07,
    mass: 8,
    water: 0,
    seconds: 2,
  },
  bnnt: {
    id: 'bnnt',
    icon: '🧵',
    sep: 0.08,
    gcr: 0.22,
    mass: 6,
    water: 0,
    seconds: 5,
  },
};

export const MATERIAL_ORDER: MaterialId[] = [
  'regolith',
  'water',
  'polyethylene',
  'trash',
  'bnnt',
];

export const MASS_BUDGET = 60;
export const WATER_BUDGET = 3;

/** The aluminium hull already stops a useful share of solar protons. */
export const BASELINE_SEP = 0.35;
export const BASELINE_GCR = 0.05;

/** Regolith is most useful on the roof; water is most useful on the wall. */
export const ROOF_BONUS: Record<MaterialId, number> = {
  regolith: 1.2,
  water: 1,
  polyethylene: 1,
  trash: 1,
  bnnt: 1,
};

export const WALL_BONUS: Record<MaterialId, number> = {
  regolith: 1,
  water: 1.2,
  polyethylene: 1,
  trash: 1,
  bnnt: 1,
};

export const EMPTY_MATERIALS: PlacedMaterials = { roof: null, wall: null };

export interface MaterialCost {
  mass: number;
  water: number;
  seconds: number;
}

export function materialCost(placed: PlacedMaterials): MaterialCost {
  let mass = 0;
  let water = 0;
  let seconds = 0;

  for (const slot of ['roof', 'wall'] as SlotId[]) {
    const id = placed[slot];
    if (!id) continue;
    const material = MATERIALS[id];
    mass += material.mass;
    water += material.water;
    seconds += material.seconds;
  }

  return { mass, water, seconds };
}

/** True when the candidate layer fits both budgets, replacing that slot's old layer. */
export function canPlaceMaterial(
  id: MaterialId,
  slot: SlotId,
  placed: PlacedMaterials,
): boolean {
  const next: PlacedMaterials = { ...placed, [slot]: id };
  const cost = materialCost(next);
  return cost.mass <= MASS_BUDGET && cost.water <= WATER_BUDGET;
}

export function isComplete(placed: PlacedMaterials): boolean {
  return placed.roof !== null && placed.wall !== null;
}
