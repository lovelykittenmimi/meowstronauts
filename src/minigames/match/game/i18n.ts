import type { Lang, Localized } from '../../../game/types';

/** Local copy for the knowledge-card match practice. */
export const MATCH_COPY = {
  eyebrow: { en: 'Knowledge review', 'zh-TW': '知識複習' },
  title: { en: 'Knowledge card match', 'zh-TW': '知識卡配對' },
  introKicker: { en: 'From your backpack', 'zh-TW': '從背包出發' },
  introBody: {
    en: 'Match each term with its one-line meaning. The cards stay face up — read them, then tap a pair.',
    'zh-TW': '把術語和它的一句話解釋配在一起。卡片都正面朝上，先讀，再點一對。',
  },
  introRule: {
    en: 'A wrong pair just clears. You can try again.',
    'zh-TW': '配錯只會取消選取，可以再試。',
  },
  start: { en: 'Start matching', 'zh-TW': '開始配對' },
  back: { en: 'Back', 'zh-TW': '返回' },
  close: { en: 'Close', 'zh-TW': '關閉' },
  roundLabel: { en: 'Round {round}/{total}', 'zh-TW': '第 {round}/{total} 回合' },
  pairsLabel: { en: 'Pairs {done}/{total}', 'zh-TW': '配對 {done}/{total}' },
  termTag: { en: 'Term', 'zh-TW': '術語' },
  meaningTag: { en: 'Meaning', 'zh-TW': '解釋' },
  sameKind: {
    en: 'Pick one term and one meaning.',
    'zh-TW': '請各選一張術語和一張解釋。',
  },
  matched: { en: 'Matched!', 'zh-TW': '配對成功！' },
  roundClear: { en: 'Round {round} clear!', 'zh-TW': '第 {round} 回合完成！' },
  resultTitle: { en: 'All 15 cards matched!', 'zh-TW': '15 張卡都配對了！' },
  resultBody: {
    en: 'Every card lives in your backpack with its NASA source.',
    'zh-TW': '每一張卡都在背包裡，附 NASA 來源。',
  },
  resultWrong: { en: 'Wrong pairs: {count}', 'zh-TW': '配錯次數：{count}' },
  themeSpace: { en: 'Space weather', 'zh-TW': '太空天氣' },
  themeMars: { en: 'Mars environment', 'zh-TW': '火星環境' },
  themeBase: { en: 'Outpost systems', 'zh-TW': '基地系統' },
  replay: { en: 'Play again', 'zh-TW': '再玩一次' },
} satisfies Record<string, Localized>;

export type MatchCopyKey = keyof typeof MATCH_COPY;

export function matchT(
  lang: Lang,
  key: MatchCopyKey,
  vars?: Record<string, string | number>,
): string {
  const template = MATCH_COPY[key][lang];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
