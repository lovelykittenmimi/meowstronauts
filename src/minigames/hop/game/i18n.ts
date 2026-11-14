import type { Lang, Localized } from '../../../game/types';

/**
 * Local copy for the hop overlay. Kept inside src/minigames/hop so the shared
 * src/i18n/index.ts only needs the two entry labels.
 */
export const HOP_COPY = {
  eyebrow: {
    en: 'Low-gravity training',
    'zh-TW': '低重力訓練',
  },
  title: { en: 'Low-gravity hop', 'zh-TW': '低重力跳躍' },
  introKicker: { en: '0.38 g practice', 'zh-TW': '0.38 g 練習' },
  introBody: {
    en: 'Mars pulls with about one third of Earth’s gravity. The same jump lifts you higher, and you slide farther before stopping. Hop the ridge, collect 3 hematite samples, and reach the airlock.',
    'zh-TW': '火星重力大約是地球的三分之一。同樣的力氣會跳得更高，停下來時也會滑得更遠。沿著岩脊跳，收集 3 個赤鐵礦樣本，抵達氣閘艙。',
  },
  jumpFact: {
    en: 'Same push, 2.6× higher than on Earth.',
    'zh-TW': '同樣的力氣，比在地球跳高大約 2.6 倍。',
  },
  frictionFact: {
    en: 'Low friction means a longer braking distance. Slow down early.',
    'zh-TW': '摩擦力小，煞車距離更長。早一點減速。',
  },
  controlsKeyboard: {
    en: '← → or A / D to move · Space to jump · hold for a higher hop',
    'zh-TW': '← → 或 A／D 移動 · 空白鍵跳 · 按住跳更高',
  },
  controlsTouch: {
    en: 'Hold the arrows to move · tap JUMP to hop',
    'zh-TW': '按住方向鍵移動 · 按「跳」跳躍',
  },
  rewardNote: {
    en: 'Collect all 3 samples to earn +1 science (once per mission).',
    'zh-TW': '收集全部 3 個樣本可獲得科學 +1（每次任務一次）。',
  },
  start: { en: 'Start hopping', 'zh-TW': '開始跳' },
  back: { en: 'Back', 'zh-TW': '返回' },
  close: { en: 'Close', 'zh-TW': '關閉' },
  samples: { en: 'Samples', 'zh-TW': '樣本' },
  gravityBadge: { en: 'Mars gravity 0.38 g', 'zh-TW': '火星重力 0.38 g' },
  hintJump: {
    en: '0.38 g: the same push lifts you about 2.6× higher.',
    'zh-TW': '0.38 g：同樣的力氣會跳高約 2.6 倍。',
  },
  hintSlide: {
    en: 'Low friction: you slide farther before stopping.',
    'zh-TW': '摩擦力小：停下來前會滑得更遠。',
  },
  hintDevil: {
    en: 'Dust devil! It shoved you — dust devils are small whirlwinds, not dust storms.',
    'zh-TW': '塵捲風！把你推開了。塵捲風是小旋風，不是沙塵暴。',
  },
  sampleFound: {
    en: 'Hematite sample! {count}/{total}',
    'zh-TW': '赤鐵礦樣本！{count}/{total}',
  },
  sampleAll: {
    en: 'All three samples! Head for the airlock.',
    'zh-TW': '三個樣本都拿到了！前往氣閘艙。',
  },
  airlockAhead: {
    en: 'Airlock ahead — keep going!',
    'zh-TW': '前方是氣閘艙，繼續前進！',
  },
  resultPerfect: { en: 'Perfect hop!', 'zh-TW': '完美的跳躍！' },
  resultMadeIt: { en: 'You made it!', 'zh-TW': '你抵達了！' },
  resultSamples: { en: 'Hematite samples', 'zh-TW': '赤鐵礦樣本' },
  resultHits: { en: 'Dust devil nudges', 'zh-TW': '被塵捲風推開' },
  rewardEarned: { en: '+1 science — nice work!', 'zh-TW': '科學 +1，做得好！' },
  rewardAlready: {
    en: 'The science bonus was already earned this mission.',
    'zh-TW': '這次任務的科學獎勵已領取。',
  },
  rewardHint: {
    en: 'Collect all 3 samples to earn +1 science.',
    'zh-TW': '收集全部 3 個樣本可獲得科學 +1。',
  },
  factMass: {
    en: 'On Mars you weigh 38% as much, but your mass and inertia stay the same.',
    'zh-TW': '在火星，你的重量是地球的 38%，但質量和慣性不變。',
  },
  factHematite: {
    en: 'Hematite is an iron-rich mineral. NASA’s Opportunity rover found hematite-rich spheres nicknamed “blueberries” on Mars.',
    'zh-TW': '赤鐵礦是含鐵礦物。NASA 的機會號在火星發現富含赤鐵礦、暱稱「藍莓」的小球。',
  },
  factDust: {
    en: 'Dust devils are small whirlwinds. They can shove you, but they pass quickly.',
    'zh-TW': '塵捲風是小旋風，會把你推開，但很快就會過去。',
  },
  replay: { en: 'Hop again', 'zh-TW': '再跳一次' },
  earthLabel: { en: 'Earth · 1 g', 'zh-TW': '地球 · 1 g' },
  marsLabel: { en: 'Mars · 0.38 g', 'zh-TW': '火星 · 0.38 g' },
  jumpCompare: {
    en: 'Same push, 2.6× higher',
    'zh-TW': '同樣力氣，跳高 2.6 倍',
  },
  finishLabel: { en: 'Airlock', 'zh-TW': '氣閘艙' },
  baseName: { en: 'HOPE-1', 'zh-TW': '希望一號' },
  sources: { en: 'Sources', 'zh-TW': '資料來源' },
  sourceGravity: {
    en: 'NASA Space Place — What Is Gravity?',
    'zh-TW': 'NASA Space Place — 什麼是重力？',
  },
  sourceHematite: {
    en: 'NASA Science — Martian “Blueberries”',
    'zh-TW': 'NASA Science — 火星「藍莓」',
  },
  sourceDust: {
    en: 'NASA Science — Dust Devils on Mars',
    'zh-TW': 'NASA Science — 火星塵捲風',
  },
  ariaLeft: { en: 'Move left', 'zh-TW': '向左移動' },
  ariaRight: { en: 'Move right', 'zh-TW': '向右移動' },
  ariaJump: { en: 'Jump', 'zh-TW': '跳躍' },
  heroLabel: {
    en: 'Low-gravity hop practice course',
    'zh-TW': '低重力跳躍練習場',
  },
  landscapeNote: { en: 'Best in landscape.', 'zh-TW': '橫向遊玩效果最好。' },
} satisfies Record<string, Localized>;

export type HopCopyKey = keyof typeof HOP_COPY;

export function hopT(
  lang: Lang,
  key: HopCopyKey,
  vars?: Record<string, string | number>,
): string {
  const template = HOP_COPY[key][lang];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
