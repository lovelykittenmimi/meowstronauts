import type { Lang, Localized } from '../../../game/types';

/**
 * Local copy for the signal-delay overlay. The result panel reads the
 * commsDelay glossary card directly, so the 3–22.4 minute fact and the NASA
 * source live in exactly one place.
 */
export const SIGNAL_COPY = {
  eyebrow: { en: 'Deep space comms', 'zh-TW': '深空通訊' },
  title: { en: 'Signal delay', 'zh-TW': '訊號延遲' },
  introKicker: { en: 'A message home', 'zh-TW': '傳訊息回地球' },
  introBody: {
    en: 'Radio travels at the speed of light, but Earth and Mars are far apart. Send a message, pick how long it takes one way, then watch the reply cross space.',
    'zh-TW': '無線電以光速前進，但地球和火星相距很遠。送出訊息、選出單程要多久，再看回覆穿越太空回來。',
  },
  introRule: {
    en: 'A wrong answer gives a hint. Nothing is lost.',
    'zh-TW': '答錯會出現提示，不會失去任何東西。',
  },
  introFact: {
    en: 'Earth and Mars orbit the Sun at different speeds, so the distance between them keeps changing.',
    'zh-TW': '地球和火星以不同速度繞太陽，所以兩者距離一直在變。',
  },
  introRange: {
    en: 'One-way message: about 3 to 22.4 minutes; about 12.5 minutes on average.',
    'zh-TW': '訊息單程：大約 3 到 22.4 分鐘，平均約 12.5 分鐘。',
  },
  start: { en: 'Send a message', 'zh-TW': '送出訊息' },
  back: { en: 'Back', 'zh-TW': '返回' },
  close: { en: 'Close', 'zh-TW': '關閉' },
  roundLabel: { en: 'Round {round}/{total}', 'zh-TW': '第 {round}/{total} 回合' },
  distanceLabel: { en: '{minutes} light-minutes', 'zh-TW': '{minutes} 光分' },
  question: {
    en: 'Earth is about {minutes} light-minutes away. How long does your message take one way?',
    'zh-TW': '地球大約在 {minutes} 光分外。你的訊息單程要多久？',
  },
  optionSeconds: { en: 'About {minutes} seconds', 'zh-TW': '大約 {minutes} 秒' },
  optionMinutes: { en: 'About {minutes} minutes', 'zh-TW': '大約 {minutes} 分鐘' },
  optionRoundTrip: {
    en: 'About {minutes} minutes',
    'zh-TW': '大約 {minutes} 分鐘',
  },
  hintSeconds: {
    en: 'Radio waves cross space in minutes, not seconds. A light-minute is one minute of travel.',
    'zh-TW': '無線電波穿越太空要幾分鐘，不是幾秒。一光分就是光走一分鐘的距離。',
  },
  hintRoundTrip: {
    en: 'That is the round trip. The question asks for one way.',
    'zh-TW': '那是來回的時間；題目問的是單程。',
  },
  correct: {
    en: 'Correct — about {minutes} minutes one way.',
    'zh-TW': '答對了：單程大約 {minutes} 分鐘。',
  },
  mars: { en: 'Mars', 'zh-TW': '火星' },
  earth: { en: 'Earth', 'zh-TW': '地球' },
  sent: { en: 'Message sent…', 'zh-TW': '訊息送出中……' },
  replyOnWay: { en: 'Reply on the way…', 'zh-TW': '回覆傳送中……' },
  replyReceived: { en: 'Reply received.', 'zh-TW': '收到回覆。' },
  crossing: {
    en: 'The signal is crossing space.',
    'zh-TW': '訊號正在穿越太空。',
  },
  spedUp: {
    en: 'Animation is sped up.',
    'zh-TW': '動畫有加速。',
  },
  next: { en: 'Next distance', 'zh-TW': '下一段距離' },
  seeResult: { en: 'See the result', 'zh-TW': '看結果' },
  resultTitle: { en: 'The signal made it!', 'zh-TW': '訊號送達！' },
  resultBody: {
    en: 'Every message between Earth and Mars takes the one-way delay. The crew cannot wait for Earth to steer the base in real time.',
    'zh-TW': '地球和火星之間的每一則訊息都要花上單程延遲。船員不能等地球即時操控基地。',
  },
  resultWrong: { en: 'Wrong answers: {count}', 'zh-TW': '答錯次數：{count}' },
  distanceTitle: { en: 'Why the delay changes', 'zh-TW': '為什麼延遲會變' },
  distanceBody: {
    en: 'Earth and Mars move around the Sun at different speeds. When they are on the same side of the Sun, the distance is shortest — about 3 minutes one way. When the Sun is between them, it is longest — about 22 minutes. The average is about 12.5 minutes.',
    'zh-TW': '地球和火星以不同速度繞太陽移動。兩者在太陽同一側時距離最短，單程大約 3 分鐘；太陽在兩者之間時距離最遠，大約 22 分鐘。平均約 12.5 分鐘。',
  },
  factTitle: { en: 'What the delay means', 'zh-TW': '延遲代表什麼' },
  sources: { en: 'Source', 'zh-TW': '資料來源' },
  sourceAverage: {
    en: 'NASA/JPL — average Earth–Mars distance',
    'zh-TW': 'NASA/JPL — 地球到火星的平均距離',
  },
  replay: { en: 'Try again', 'zh-TW': '再試一次' },
  landscapeNote: { en: 'Best in landscape.', 'zh-TW': '橫向遊玩效果最好。' },
} satisfies Record<string, Localized>;

export type SignalCopyKey = keyof typeof SIGNAL_COPY;

export function signalT(
  lang: Lang,
  key: SignalCopyKey,
  vars?: Record<string, string | number>,
): string {
  const template = SIGNAL_COPY[key][lang];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
