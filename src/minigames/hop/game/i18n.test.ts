import { HOP_COPY, hopT } from './i18n';

const KEYS = Object.keys(HOP_COPY) as (keyof typeof HOP_COPY)[];

describe('hop copy', () => {
  it('is complete in English and Traditional Chinese', () => {
    for (const key of KEYS) {
      expect(HOP_COPY[key].en.trim().length).toBeGreaterThan(0);
      expect(HOP_COPY[key]['zh-TW'].trim().length).toBeGreaterThan(0);
    }
  });

  it('never claims a strong geomagnetic storm', () => {
    for (const key of KEYS) {
      expect(HOP_COPY[key].en.toLowerCase()).not.toContain(
        'strong geomagnetic storm',
      );
    }
  });

  it('fills sample counts into both languages', () => {
    expect(hopT('en', 'sampleFound', { count: 2, total: 3 })).toBe(
      'Hematite sample! 2/3',
    );
    expect(hopT('zh-TW', 'sampleFound', { count: 2, total: 3 })).toBe(
      '赤鐵礦樣本！2/3',
    );
  });

  it('keeps the 0.38 g and mass facts in the result copy', () => {
    expect(HOP_COPY.factMass.en).toContain('38%');
    expect(HOP_COPY.factMass.en.toLowerCase()).toContain('mass');
    expect(HOP_COPY.factMass['zh-TW']).toContain('38%');
    expect(HOP_COPY.factMass['zh-TW']).toContain('慣性');
    expect(HOP_COPY.gravityBadge['zh-TW']).toContain('0.38 g');
  });
});
