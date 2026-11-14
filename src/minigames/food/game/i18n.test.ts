import { FOOD_COPY, foodT } from './i18n';

const KEYS = Object.keys(FOOD_COPY) as (keyof typeof FOOD_COPY)[];

describe('space food copy', () => {
  it('is complete in English and Traditional Chinese', () => {
    for (const key of KEYS) {
      expect(FOOD_COPY[key].en.trim().length).toBeGreaterThan(0);
      expect(FOOD_COPY[key]['zh-TW'].trim().length).toBeGreaterThan(0);
    }
  });

  it('never claims a strong geomagnetic storm', () => {
    for (const key of KEYS) {
      expect(FOOD_COPY[key].en.toLowerCase()).not.toContain(
        'strong geomagnetic storm',
      );
    }
  });

  it('avoids unverified supplement numbers and claims', () => {
    for (const key of KEYS) {
      const copy = `${FOOD_COPY[key].en} ${FOOD_COPY[key]['zh-TW']}`.toLowerCase();
      expect(copy).not.toContain('iu');
      expect(copy).not.toContain('omega');
      expect(copy).not.toContain('anti-inflammatory');
      expect(copy).not.toContain('radiation');
      expect(copy).not.toMatch(/\d+\s*mg/);
    }
  });

  it('fills pair progress and card labels into both languages', () => {
    expect(foodT('en', 'progress', { done: 2, total: 6 })).toBe('Pairs 2/6');
    expect(foodT('zh-TW', 'progress', { done: 2, total: 6 })).toBe(
      '配對 2/6',
    );
    expect(foodT('en', 'cardFoodAria', { name: 'Vitamin D' })).toBe(
      'Food card: Vitamin D',
    );
    expect(foodT('zh-TW', 'cardFactAria', { fact: '測試' })).toBe(
      'NASA 事實：測試',
    );
  });
});
