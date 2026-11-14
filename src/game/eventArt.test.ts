import { EVENT_ART, artForEvent, briefingArtFor } from './eventArt';
import { EVENT_CARDS, TUTORIAL_CARD } from './events';

const allCards = [TUTORIAL_CARD, ...EVENT_CARDS];

describe('event art', () => {
  it('maps every event card to a scene image', () => {
    for (const card of allCards) {
      const art = artForEvent(card.id);
      expect(art, `missing art for ${card.id}`).toBeTruthy();
      expect(art!.src).toMatch(/\.webp$/);
    }
  });

  it('gives every scene bilingual alt text', () => {
    for (const [id, art] of Object.entries(EVENT_ART)) {
      expect(art.alt.en.trim(), `${id} en alt`).not.toBe('');
      expect(art.alt['zh-TW'].trim(), `${id} zh-TW alt`).not.toBe('');
    }
  });

  it('has no art entry for an event that does not exist', () => {
    const ids = new Set(allCards.map((card) => card.id));
    for (const id of Object.keys(EVENT_ART)) {
      expect(ids.has(id), `orphan art entry ${id}`).toBe(true);
    }
  });

  it('gives every briefing a scene and bilingual alt text', () => {
    for (const card of allCards) {
      const art = briefingArtFor(card.id);
      expect(art, `missing briefing art for ${card.id}`).toBeTruthy();
      expect(art!.src).toMatch(/\.webp$/);
      expect(art!.alt.en.trim(), `${card.id} briefing en alt`).not.toBe('');
      expect(art!.alt['zh-TW'].trim(), `${card.id} briefing zh-TW alt`).not.toBe('');
      expect(art!.alt.en, `${card.id} briefing alt`).not.toBe('undefined');
    }
  });

  it('describes the cat-free plate whenever an event has one', () => {
    for (const [id, art] of Object.entries(EVENT_ART)) {
      if (!art.briefingSrc) continue;
      expect(art.briefingAlt, `${id} missing briefingAlt`).toBeTruthy();
      // The plate has no crew, so it cannot reuse the card's description.
      expect(art.briefingAlt!.en, `${id} reuses the card alt`).not.toBe(art.alt.en);
    }
  });

  it('prefers the cat-free plate and falls back to the card picture', () => {
    const flare = briefingArtFor('S1')!;
    expect(flare.src).toContain('08-control-room-nocat');
    expect(flare.alt.en).toContain('empty');

    // L1 has no plate: the briefing shows the card art and its alt.
    const oxygen = briefingArtFor('L1')!;
    expect(oxygen.src).toContain('32-oxygen-unit');
    expect(oxygen.alt).toEqual(artForEvent('L1')!.alt);
  });
});
