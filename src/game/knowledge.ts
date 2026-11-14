import glossaryJson from '../data/glossary.json';
import type { KnowledgeCard } from './types';

export const KNOWLEDGE_CARDS = glossaryJson as Record<string, KnowledgeCard>;
export const KNOWLEDGE_IDS = Object.keys(KNOWLEDGE_CARDS);

export function getKnowledgeCard(id: string): KnowledgeCard | undefined {
  return KNOWLEDGE_CARDS[id];
}

/** `solarFlare` → `solar-flare`, for stable data-testid values. */
export function termSlug(id: string): string {
  return id.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
