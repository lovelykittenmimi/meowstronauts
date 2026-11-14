import type {
  Difficulty,
  EffectMap,
  ResourceKey,
  Resources,
} from './types';

export const MAX_SOL = 7;
export const BACKPACK_SIZE = 20;

/** Optional Sol 1 practice: collect all three samples for a one-time bonus. */
export const HOP_SAMPLE_TOTAL = 3;
export const HOP_REWARD_SCIENCE = 1;

export const INITIAL_RESOURCES: Record<Difficulty, Resources> = {
  cadet: {
    power: 80,
    lifeSupport: 80,
    shield: 70,
    food: 8,
    health: 100,
    science: 0,
  },
  officer: {
    power: 70,
    lifeSupport: 70,
    shield: 60,
    food: 6,
    health: 100,
    science: 0,
  },
  ace: {
    power: 60,
    lifeSupport: 60,
    shield: 50,
    food: 5,
    health: 100,
    science: 0,
  },
};

export const DAILY_DRAIN: EffectMap = {
  power: -8,
  lifeSupport: -6,
  shield: -5,
  food: -1,
};

export const ZERO_PENALTY: EffectMap = {
  power: -20,
  lifeSupport: -25,
  shield: -15,
  food: -10,
};

const CAPS: Record<ResourceKey, number> = {
  power: 100,
  lifeSupport: 100,
  shield: 100,
  food: 12,
  health: 100,
  science: Number.POSITIVE_INFINITY,
};

export function clampResource(key: ResourceKey, value: number): number {
  return Math.max(0, Math.min(CAPS[key], value));
}

export function clampResources(resources: Resources): Resources {
  return {
    power: clampResource('power', resources.power),
    lifeSupport: clampResource('lifeSupport', resources.lifeSupport),
    shield: clampResource('shield', resources.shield),
    food: clampResource('food', resources.food),
    health: clampResource('health', resources.health),
    science: clampResource('science', resources.science),
  };
}

export function addEffects(
  resources: Resources,
  effects: EffectMap,
): Resources {
  const next = { ...resources };
  for (const key of Object.keys(effects) as ResourceKey[]) {
    next[key] += effects[key] ?? 0;
  }
  return clampResources(next);
}

export function hasNegativeDelta(effects: EffectMap): boolean {
  return Object.values(effects).some((value) => (value ?? 0) < 0);
}

export function scoreStars(
  health: number,
  science: number,
  emergencyUsed: boolean,
): 1 | 2 | 3 {
  if (!emergencyUsed && health >= 70 && science >= 8) return 3;
  if (health >= 50 && science >= 5) return 2;
  return 1;
}

export const RESOURCE_ORDER: ResourceKey[] = [
  'power',
  'lifeSupport',
  'shield',
  'food',
  'health',
  'science',
];

export function zeroPenaltyFor(resources: Resources): EffectMap {
  const penalty: EffectMap = {};
  if (resources.power <= 0) penalty.health = (penalty.health ?? 0) + ZERO_PENALTY.power!;
  if (resources.lifeSupport <= 0)
    penalty.health = (penalty.health ?? 0) + ZERO_PENALTY.lifeSupport!;
  if (resources.shield <= 0)
    penalty.health = (penalty.health ?? 0) + ZERO_PENALTY.shield!;
  if (resources.food <= 0)
    penalty.health = (penalty.health ?? 0) + ZERO_PENALTY.food!;
  return penalty;
}
