import { STRINGS, t } from './index';

describe('interface strings', () => {
  it('has an English and a Chinese string for every key', () => {
    for (const [key, value] of Object.entries(STRINGS)) {
      expect(value.en, key).toBeTruthy();
      expect(value['zh-TW'], key).toBeTruthy();
    }
  });

  it('fills numbered placeholders', () => {
    expect(t('en', 'briefing.sol', { sol: 4 })).toContain('4');
    expect(t('zh-TW', 'briefing.sol', { sol: 4 })).toContain('4');
    expect(t('en', 'hud.backpack')).toBe('Backpack');
  });

  it('never leaks the forbidden storm phrase', () => {
    expect(JSON.stringify(STRINGS).toLowerCase()).not.toContain('strong geomagnetic storm');
  });
});
