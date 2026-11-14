import type { CatDef, CatId } from './types';

/** Travel times are gameplay pacing, not a physical simulation. */
export const CATS: Record<CatId, CatDef> = {
  shadow: {
    id: 'shadow',
    packSeconds: 1.5,
    travelSeconds: 4,
    station: 'solar',
  },
  silver: {
    id: 'silver',
    packSeconds: 2,
    travelSeconds: 6,
    station: 'comms',
  },
  ginger: {
    id: 'ginger',
    packSeconds: 2.5,
    travelSeconds: 9,
    station: 'greenhouse',
  },
};

export const CAT_ORDER: CatId[] = ['shadow', 'silver', 'ginger'];

export function arrivalSeconds(id: CatId): number {
  return CATS[id].packSeconds + CATS[id].travelSeconds;
}

export type CatProgressState = 'outside' | 'packing' | 'returning' | 'inside';

export interface CatProgress {
  state: CatProgressState;
  remainingSeconds: number;
}

export function catProgress(
  id: CatId,
  clickedAt: number | null,
  elapsed: number,
): CatProgress {
  const cat = CATS[id];
  const total = cat.packSeconds + cat.travelSeconds;

  if (clickedAt === null) {
    return { state: 'outside', remainingSeconds: total };
  }

  const since = Math.max(0, elapsed - clickedAt);
  if (since < cat.packSeconds) {
    return { state: 'packing', remainingSeconds: cat.packSeconds - since };
  }
  if (since < total) {
    return { state: 'returning', remainingSeconds: total - since };
  }
  return { state: 'inside', remainingSeconds: 0 };
}

export function catIsLate(
  id: CatId,
  clickedAt: number | null,
  frontSeconds: number,
): boolean {
  if (clickedAt === null) return true;
  return clickedAt + arrivalSeconds(id) > frontSeconds;
}
