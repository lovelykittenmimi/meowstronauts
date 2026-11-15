import { FACTORY_COPY, factoryT } from './i18n';
import { FACTORY_MOXIE, FACTORY_STATIONS, FACTORY_WHY } from './state';

const KEYS = Object.keys(FACTORY_COPY) as (keyof typeof FACTORY_COPY)[];

function allCopy(): string {
  const stationCopy = FACTORY_STATIONS.flatMap((station) => [
    station.title.en,
    station.title['zh-TW'],
    station.goal.en,
    station.goal['zh-TW'],
    ...station.facts.flatMap((fact) => [fact.en, fact['zh-TW']]),
  ]);
  return [
    ...KEYS.flatMap((key) => [
      FACTORY_COPY[key].en,
      FACTORY_COPY[key]['zh-TW'],
    ]),
    ...stationCopy,
    FACTORY_WHY.en,
    FACTORY_WHY['zh-TW'],
    FACTORY_MOXIE.en,
    FACTORY_MOXIE['zh-TW'],
  ].join('\n');
}

describe('water & fuel factory copy', () => {
  it('is complete in English and Traditional Chinese', () => {
    for (const key of KEYS) {
      expect(FACTORY_COPY[key].en.trim().length).toBeGreaterThan(0);
      expect(FACTORY_COPY[key]['zh-TW'].trim().length).toBeGreaterThan(0);
    }
    for (const station of FACTORY_STATIONS) {
      expect(station.facts.length).toBeGreaterThan(0);
      for (const fact of station.facts) {
        expect(fact.en.trim().length).toBeGreaterThan(0);
        expect(fact['zh-TW'].trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps banned claims and missions out of the copy', () => {
    const copy = allCopy().toLowerCase();
    expect(copy).not.toContain('strong geomagnetic storm');
    expect(copy).not.toContain('starship');
    expect(copy).not.toContain('spacex');
    expect(copy).not.toContain('toxic');
    expect(copy).not.toContain('poison');
  });

  it('does not give a perchlorate concentration number', () => {
    const copy = allCopy();
    expect(copy.toLowerCase()).not.toMatch(/perchlorate[^.]{0,80}%/);
    expect(copy).not.toMatch(/過氯酸鹽[^。]{0,40}%/);
    expect(copy).not.toContain('0.5%');
  });

  it('fills station progress, counts, and the reward gain', () => {
    expect(factoryT('en', 'progress', { done: 2, total: 4 })).toBe(
      'Station 2/4',
    );
    expect(factoryT('zh-TW', 'progress', { done: 2, total: 4 })).toBe(
      '第 2/4 站',
    );
    expect(factoryT('en', 'caught', { count: 3, total: 4 })).toBe(
      'CO₂ caught 3/4',
    );
    expect(factoryT('en', 'rewardEarned', { gain: 5 })).toBe(
      '+5 life support — the crew has more water and oxygen.',
    );
    expect(factoryT('zh-TW', 'rewardEarned', { gain: 3 })).toBe(
      '生命維持 +3，船員的水和氧氣更充足了。',
    );
  });
});
