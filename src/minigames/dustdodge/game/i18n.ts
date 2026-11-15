import type { Lang, Localized } from '../../../game/types';

/** Local copy for the dust-devil dodge practice. */
export const DODGE_COPY = {
  eyebrow: { en: 'Mars driving practice', 'zh-TW': '火星駕駛練習' },
  title: { en: 'Dust devil dodge', 'zh-TW': '塵捲風閃避' },
  introKicker: { en: 'Small whirlwinds', 'zh-TW': '小型的旋風' },
  introBody: {
    en: 'Dust devils are small whirlwinds, not the huge dust storms that can cover the whole planet. Drive across the plain and collect 8 sensor readings.',
    'zh-TW': '塵捲風是小型的旋風，不是會蓋住整顆星球的大沙塵暴。開車穿過平原，收集 8 個感測讀數。',
  },
  introRule: {
    en: 'A bump slows the rover for a moment. Nothing is lost.',
    'zh-TW': '撞到只會讓探測車慢一下，不會失去任何東西。',
  },
  start: { en: 'Start driving', 'zh-TW': '開始駕駛' },
  back: { en: 'Back', 'zh-TW': '返回' },
  close: { en: 'Close', 'zh-TW': '關閉' },
  readingsLabel: { en: 'Readings', 'zh-TW': '讀數' },
  bumpsLabel: { en: 'Bumps', 'zh-TW': '碰撞' },
  moveLeft: { en: 'Move left', 'zh-TW': '向左移動' },
  moveRight: { en: 'Move right', 'zh-TW': '向右移動' },
  collected: { en: 'Reading collected', 'zh-TW': '收集到讀數' },
  bump: {
    en: 'Dust devil! Slowing down.',
    'zh-TW': '遇到塵捲風！速度變慢。',
  },
  resultTitle: {
    en: 'All 8 readings collected!',
    'zh-TW': '8 個讀數都收集到了！',
  },
  resultBody: {
    en: 'Dust devils are small whirlwinds. They are not the same as a large dust storm.',
    'zh-TW': '塵捲風是小型的旋風，和大範圍的沙塵暴不一樣。',
  },
  resultBumps: { en: 'Bumps: {count}', 'zh-TW': '碰撞次數：{count}' },
  replay: { en: 'Drive again', 'zh-TW': '再玩一次' },
  source: { en: 'Source', 'zh-TW': '資料來源' },
  knowledgeTitle: {
    en: 'What the drive showed',
    'zh-TW': '這趟駕駛學到什麼',
  },
} satisfies Record<string, Localized>;

export type DodgeCopyKey = keyof typeof DODGE_COPY;

export function dodgeT(
  lang: Lang,
  key: DodgeCopyKey,
  vars?: Record<string, string | number>,
): string {
  const template = DODGE_COPY[key][lang];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
