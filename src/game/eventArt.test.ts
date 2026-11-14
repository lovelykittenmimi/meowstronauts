import { EVENT_ART, artForEvent } from './eventArt';
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
});
