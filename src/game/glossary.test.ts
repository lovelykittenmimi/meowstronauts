import glossary from '../data/glossary.json';
import { KNOWLEDGE_IDS, termSlug } from './knowledge';

const cards = Object.values(glossary) as Array<{
  id: string;
  term: Record<string, string>;
  short: Record<string, string>;
  example: Record<string, string>;
  why: Record<string, string>;
  sources: Array<{ id: string; label: string; url: string }>;
}>;

describe('knowledge cards', () => {
  it('contains all twenty terms with both languages', () => {
    expect(KNOWLEDGE_IDS).toHaveLength(20);
    for (const card of cards) {
      expect(card.term.en).toBeTruthy();
      expect(card.term['zh-TW']).toBeTruthy();
      expect(card.short.en).toBeTruthy();
      expect(card.short['zh-TW']).toBeTruthy();
      expect(card.example.en).toBeTruthy();
      expect(card.why['zh-TW']).toBeTruthy();
      expect(card.sources.length).toBeGreaterThan(0);
      for (const source of card.sources) {
        expect(source.url).toMatch(/^https:\/\//);
      }
    }
  });

  it('keeps the gravity card factual and non-alarming', () => {
    const gravity = (glossary as Record<string, (typeof cards)[number]>).gravity;
    expect(gravity.example.en).toContain('0.38 g');
    expect(gravity.example.en).toContain('1–1.5%');
    expect(gravity.why.en).toContain('move slowly');
    expect(gravity.example['zh-TW']).toContain('0.38g');
  });

  it('does not call a flare a strong geomagnetic storm', () => {
    const text = JSON.stringify(glossary).toLowerCase();
    expect(text).not.toContain('strong geomagnetic storm');
  });

  it('creates stable test ids from card ids', () => {
    expect(termSlug('solarFlare')).toBe('solar-flare');
    expect(termSlug('lifeSupport')).toBe('life-support');
  });
});
