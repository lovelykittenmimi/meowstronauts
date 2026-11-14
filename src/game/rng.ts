export interface Rng {
  next: () => number;
  int: (maxExclusive: number) => number;
  pick: <T>(items: readonly T[]) => T;
  shuffle: <T>(items: readonly T[]) => T[];
}

function hashSeed(input: string | number): number {
  if (typeof input === 'number') return input >>> 0;
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Small deterministic PRNG. Same seed always produces the same sequence. */
export function createRng(seed: string | number): Rng {
  let state = hashSeed(seed) || 0x9e3779b9;

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const int = (maxExclusive: number): number =>
    Math.floor(next() * Math.max(1, maxExclusive));

  const pick = <T,>(items: readonly T[]): T => {
    if (items.length === 0) throw new Error('Cannot pick from an empty list');
    return items[int(items.length)];
  };

  const shuffle = <T,>(items: readonly T[]): T[] => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = int(i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  return { next, int, pick, shuffle };
}
