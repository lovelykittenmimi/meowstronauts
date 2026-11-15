import type { Lang } from '../../../game/types';

const EN = {
  eyebrow: 'Sol {sol} · Greenhouse',
  title: 'Harvest the tomatoes',
  instruction:
    'Tap the glowing ripe tomatoes. Leave the green ones to ripen.',
  crate: 'Crate {picked}/{total}',
  skip: 'Skip harvest',
  ripeLabel: 'Ripe tomato',
  greenLabel: 'Unripe tomato — leave it to ripen',
  notYet: 'Not yet — leave it to ripen.',
  resultEyebrow: 'Harvest complete',
  resultTitle: 'Six ripe tomatoes',
  resultBody: 'Three green ones stay on the vine to ripen.',
  continue: 'Continue',
  languageButton: '中文',
  credit: 'Greenhouse art · Meowstronauts',
} as const;

type CopyKey = keyof typeof EN;

const ZH: Record<CopyKey, string> = {
  eyebrow: '第 {sol} 個火星日 · 溫室',
  title: '採收番茄',
  instruction: '點會發光的成熟紅番茄；綠的留著繼續熟。',
  crate: '籃子 {picked}/{total}',
  skip: '跳過採收',
  ripeLabel: '成熟的番茄',
  greenLabel: '未成熟的番茄——留著繼續熟',
  notYet: '還沒熟——留著繼續熟。',
  resultEyebrow: '採收完成',
  resultTitle: '六顆成熟番茄',
  resultBody: '三顆綠的留在藤上繼續熟。',
  continue: '繼續',
  languageButton: 'EN',
  credit: '溫室圖 · 喵航員',
};

const COPY: Record<Lang, Record<CopyKey, string>> = { en: EN, 'zh-TW': ZH };

export function t(
  lang: Lang,
  key: CopyKey,
  vars?: Record<string, string | number>,
): string {
  let text = COPY[lang][key];
  if (!vars) return text;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}
