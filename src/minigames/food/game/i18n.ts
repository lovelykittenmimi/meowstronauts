import type { Lang, Localized } from '../../../game/types';

/**
 * Local copy for the space-food overlay. Kept inside src/minigames/food so the
 * shared src/i18n/index.ts only needs the two entry labels.
 * Claims must stay traceable to docs/data-sources.md §3.5.
 */
export const FOOD_COPY = {
  eyebrow: { en: 'Space food lab', 'zh-TW': '太空食品實驗室' },
  title: { en: 'Space food flip', 'zh-TW': '太空食物翻卡' },
  introKicker: { en: 'Supply crate check', 'zh-TW': '補給艙單核對' },
  introBody: {
    en: 'A supply crate just arrived. Flip two cards at a time and pair each space food with its NASA fact. Six pairs, twelve cards, no timer.',
    'zh-TW': '補給箱剛到。一次翻兩張卡，把每種太空食物和它的 NASA 事實配成一對。六組、十二張卡，沒有倒數。',
  },
  introRuleMatch: {
    en: 'A correct pair stays face up and locks in.',
    'zh-TW': '配對成功，兩張卡會保持翻開並鎖定。',
  },
  introRuleMiss: {
    en: 'A miss flips back after a moment — try to remember where it was.',
    'zh-TW': '配對失敗，卡片會翻回去；記住它原來的位置。',
  },
  rewardNote: {
    en: 'Match all 6 pairs to earn +1 food (once per mission).',
    'zh-TW': '完成全部 6 組可獲得食物 +1（每次任務一次）。',
  },
  start: { en: 'Open the crate', 'zh-TW': '打開補給箱' },
  back: { en: 'Back', 'zh-TW': '返回' },
  close: { en: 'Close', 'zh-TW': '關閉' },
  pairsLabel: { en: 'Pairs', 'zh-TW': '配對' },
  movesLabel: { en: 'Flips', 'zh-TW': '翻牌' },
  progress: { en: 'Pairs {done}/{total}', 'zh-TW': '配對 {done}/{total}' },
  cardHidden: { en: 'Face-down card', 'zh-TW': '未翻開的卡片' },
  cardFoodAria: { en: 'Food card: {name}', 'zh-TW': '食物卡：{name}' },
  cardFactAria: { en: 'NASA fact: {fact}', 'zh-TW': 'NASA 事實：{fact}' },
  cardFoodTag: { en: 'Food', 'zh-TW': '食物' },
  cardFactTag: { en: 'NASA fact', 'zh-TW': 'NASA 事實' },
  matchToast: {
    en: 'Matched! {fact}',
    'zh-TW': '配對成功！{fact}',
  },
  mismatchToast: {
    en: 'Not a pair — flip them back and try again.',
    'zh-TW': '不是一對，翻回去再試一次。',
  },
  allMatched: {
    en: 'All six pairs matched! Crate checked.',
    'zh-TW': '六組全部配對完成！艙單核對完畢。',
  },
  resultTitle: { en: 'Crate checked!', 'zh-TW': '艙單核對完成！' },
  resultBody: {
    en: 'Every space food found its NASA fact. Here is the whole crate list.',
    'zh-TW': '每種太空食物都找到它的 NASA 事實了。這是整份艙單。',
  },
  resultMoves: { en: 'Flips used', 'zh-TW': '翻牌次數' },
  rewardEarned: { en: '+1 food — the pantry is stocked!', 'zh-TW': '食物 +1，儲糧更充足了！' },
  rewardAlready: {
    en: 'The food bonus was already earned this mission.',
    'zh-TW': '這次任務的食物獎勵已領取。',
  },
  rewardFull: {
    en: 'The pantry is already full — no food was added this time.',
    'zh-TW': '儲糧已經滿了，這次不加食物。',
  },
  rewardHint: {
    en: 'Match all 6 pairs to earn +1 food.',
    'zh-TW': '完成全部 6 組可獲得食物 +1。',
  },
  factSectionTitle: { en: 'What the crate taught us', 'zh-TW': '艙單上的 NASA 事實' },
  sources: { en: 'Sources', 'zh-TW': '資料來源' },
  sourceFoodSystems: {
    en: 'NASA — Space Food Systems',
    'zh-TW': 'NASA — 太空食品系統',
  },
  sourceNutrition: {
    en: 'NASA JSC — Food & Nutrition',
    'zh-TW': 'NASA 詹森太空中心 — 食物與營養',
  },
  sourceVeggie: {
    en: 'NASA — Space Station blog, 10 Aug 2015',
    'zh-TW': 'NASA — 太空站部落格，2015 年 8 月 10 日',
  },
  sourceGrowing: {
    en: 'NASA Science — Growing Plants in Space',
    'zh-TW': 'NASA Science — 太空種植植物',
  },
  replay: { en: 'Flip again', 'zh-TW': '再翻一次' },
  flipHint: { en: 'Tap a card to flip it.', 'zh-TW': '點一張卡翻開。' },
  landscapeNote: { en: 'Best in landscape.', 'zh-TW': '橫向遊玩效果最好。' },
} satisfies Record<string, Localized>;

export type FoodCopyKey = keyof typeof FOOD_COPY;

export function foodT(
  lang: Lang,
  key: FoodCopyKey,
  vars?: Record<string, string | number>,
): string {
  const template = FOOD_COPY[key][lang];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
