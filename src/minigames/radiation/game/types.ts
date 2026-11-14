import type { CatId, Lang } from '../../../game/types';

export type { CatId, Lang };

export type MaterialId = 'regolith' | 'water' | 'polyethylene' | 'trash' | 'bnnt';
export type SlotId = 'roof' | 'wall';
export type DrillPhase = 'prep' | 'moving' | 'alert' | 'storm' | 'result';
export type DrillOutcome = 'perfect' | 'close' | 'rough';

/** The two places a layer can go. The roof faces the Sun; the wall is the side. */
export type PlacedMaterials = Record<SlotId, MaterialId | null>;

export interface Material {
  id: MaterialId;
  icon: string;
  /** Fraction of the incoming solar-particle dose this layer stops (game value). */
  sep: number;
  /** Fraction of the cosmic-ray dose this layer stops (game value). */
  gcr: number;
  /** Budget units. */
  mass: number;
  /** Drinking-water units; water is heavy and useful for the crew. */
  water: number;
  /** Flavour: how long the layer takes to fit. */
  seconds: number;
}

export interface ShieldResult {
  sep: number;
  gcr: number;
  mass: number;
  water: number;
  seconds: number;
}

export interface CatDose {
  id: CatId;
  late: boolean;
  dose: number;
}

export interface DrillResult {
  cats: CatDose[];
  shield: ShieldResult;
  stars: 1 | 2 | 3;
  outcome: DrillOutcome;
  maxDose: number;
}

export interface CatDef {
  id: CatId;
  /** Time spent packing up the workstation before running. */
  packSeconds: number;
  /** Time to run back to the shelter. */
  travelSeconds: number;
  station: 'solar' | 'greenhouse' | 'comms';
}
