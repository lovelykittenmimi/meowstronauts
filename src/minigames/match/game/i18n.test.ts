import { MATCH_COPY, matchT } from './i18n';

const BANNED = [
  'strong geomagnetic storm',
  'toxic',
  'starship',
  'spacex',
  'percentile',
];

describe('knowledge match copy', () => {
  it('has non-empty English and Chinese strings', () => {
    for (const [key, value] of Object.entries(MATCH_COPY)) {
      expect(value.en.trim(), key).not.toBe('');
      expect(value['zh-TW'].trim(), key).not.toBe('');
    }
  });

  it('avoids banned wording', () => {
    for (const value of Object.values(MATCH_COPY)) {
      const text = `${value.en} ${value['zh-TW']}`.toLowerCase();
      for (const word of BANNED) expect(text).not.toContain(word);
    }
  });

  it('substitutes round and count placeholders', () => {
    expect(matchT('en', 'roundLabel', { round: 2, total: 3 })).toContain('2/3');
    expect(matchT('en', 'pairsLabel', { done: 3, total: 5 })).toContain('3/5');
    expect(matchT('zh-TW', 'resultWrong', { count: 4 })).toContain('4');
  });
});
