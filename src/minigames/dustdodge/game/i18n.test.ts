import { DODGE_COPY, dodgeT } from './i18n';

const BANNED = [
  'strong geomagnetic storm',
  'toxic',
  'starship',
  'spacex',
  'percentile',
];

describe('dust devil dodge copy', () => {
  it('has non-empty English and Chinese strings', () => {
    for (const [key, value] of Object.entries(DODGE_COPY)) {
      expect(value.en.trim(), key).not.toBe('');
      expect(value['zh-TW'].trim(), key).not.toBe('');
    }
  });

  it('avoids banned wording', () => {
    for (const value of Object.values(DODGE_COPY)) {
      const text = `${value.en} ${value['zh-TW']}`.toLowerCase();
      for (const word of BANNED) expect(text).not.toContain(word);
    }
  });

  it('substitutes the bump count', () => {
    expect(dodgeT('en', 'resultBumps', { count: 3 })).toContain('3');
    expect(dodgeT('zh-TW', 'resultBumps', { count: 2 })).toContain('2');
  });
});
