import { SIGNAL_COPY, signalT } from './i18n';

describe('signal delay copy', () => {
  it('has both languages for every key', () => {
    for (const [key, value] of Object.entries(SIGNAL_COPY)) {
      expect(value.en.trim(), `${key} en`).not.toBe('');
      expect(value['zh-TW'].trim(), `${key} zh-TW`).not.toBe('');
    }
  });

  it('keeps banned claims out of the copy', () => {
    const all = Object.values(SIGNAL_COPY)
      .map((value) => `${value.en} ${value['zh-TW']}`)
      .join(' ')
      .toLowerCase();
    for (const banned of [
      'strong geomagnetic storm',
      'starship',
      'spacex',
      'toxic',
    ]) {
      expect(all).not.toContain(banned);
    }
  });

  it('fills the round and distance placeholders', () => {
    expect(signalT('en', 'question', { minutes: 14 })).toContain('14');
    expect(signalT('zh-TW', 'roundLabel', { round: 2, total: 3 })).toContain(
      '2/3',
    );
    expect(signalT('en', 'resultWrong', { count: 4 })).toContain('4');
  });

  it('leaves unknown placeholders alone', () => {
    expect(signalT('en', 'question', {})).toContain('{minutes}');
  });
});
