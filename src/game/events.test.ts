import glossary from '../data/glossary.json';
import { EVENT_CARDS, MVP_EVENT_COUNT } from './events';

const ids = new Set(EVENT_CARDS.map((card) => card.id));

describe('MVP event cards', () => {
  it('has the twelve design-library cards with unique ids', () => {
    expect(MVP_EVENT_COUNT).toBe(12);
    expect(ids.size).toBe(12);
  });

  it('keeps S1 at Sol 4 and calls it a solar flare warning', () => {
    const s1 = EVENT_CARDS.find((card) => card.id === 'S1')!;
    expect(s1.minSol).toBe(4);
    expect(s1.maxSol).toBe(4);
    expect(s1.title.en).toBe('Solar Flare Warning');
    expect(s1.title.en).not.toMatch(/geomagnetic/i);
  });

  it('gives every card three localized choices and a source', () => {
    for (const card of EVENT_CARDS) {
      expect(card.choices).toHaveLength(3);
      expect(card.source?.url).toMatch(/^https:\/\//);
      expect(card.title['zh-TW']).toBeTruthy();
      expect(card.brief['zh-TW']).toBeTruthy();
      const choiceIds = new Set(card.choices.map((choice) => choice.id));
      expect(choiceIds.size).toBe(3);
      for (const choice of card.choices) {
        expect(choice.label.en).toBeTruthy();
        expect(choice.label['zh-TW']).toBeTruthy();
        expect(choice.outcome.en).toBeTruthy();
        expect(choice.outcome['zh-TW']).toBeTruthy();
      }
    }
  });

  it('gives every choice a real cost, except assists paid with a charge', () => {
    for (const card of EVENT_CARDS) {
      for (const choice of card.choices) {
        const values = Object.values(choice.effects);
        if (choice.requires) {
          expect(values.length).toBeGreaterThan(0);
        } else {
          expect(values.some((value) => (value ?? 0) < 0)).toBe(true);
        }
      }
    }
  });

  it('uses only glossary terms', () => {
    const terms = new Set(Object.keys(glossary));
    for (const card of EVENT_CARDS) {
      for (const term of card.terms ?? []) {
        expect(terms.has(term)).toBe(true);
      }
    }
  });

  it('has no unresolved placeholders or forbidden storm wording', () => {
    const text = JSON.stringify(EVENT_CARDS);
    const terms = new Set(Object.keys(glossary));
    for (const match of text.matchAll(/\{\{([a-zA-Z]+)\}\}/g)) {
      expect(terms.has(match[1]), match[1]).toBe(true);
    }
    expect(text.toLowerCase()).not.toContain('strong geomagnetic storm');
  });
});
