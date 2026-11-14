import type { Localized } from './types';

export interface DailyBrief {
  sol: number;
  line: Localized;
  terms: string[];
}

export const DAILY_BRIEFS: DailyBrief[] = [
  {
    sol: 1,
    line: {
      en: 'Sol 1. Mars gravity is 38% of Earth’s. Your body is still adapting, so move slowly.',
      'zh-TW': '第 1 個 {{sol}}。火星{{gravity}}是地球的 38%。身體還在適應，動作慢一點。',
    },
    terms: ['sol', 'gravity'],
  },
  {
    sol: 2,
    line: {
      en: 'Dust devils are small whirlwinds. They are not the same as a large dust storm.',
      'zh-TW': '{{dustDevil}}是小型的旋風，和大範圍{{dustStorm}}不是同一種。',
    },
    terms: ['dustDevil', 'dustStorm'],
  },
  {
    sol: 3,
    line: {
      en: 'A flare forecast is open, and the comms window is open. Earth is about 14 light-minutes away.',
      'zh-TW': '閃焰預報開啟，通訊窗口也開了。地球大約在 14 光分之外。',
    },
    terms: ['solarStorm', 'solarWind', 'commsDelay'],
  },
  {
    sol: 4,
    line: {
      en: 'The shelter is the safest place in a solar particle event. Check the shielding before you need it.',
      'zh-TW': '太陽粒子事件時，避難艙是最安全的地方。需要之前先檢查{{radiationShielding}}。',
    },
    terms: ['solarFlare', 'radiation'],
  },
  {
    sol: 5,
    line: {
      en: 'Water is heavy, so the outpost cleans and reuses almost every drop.',
      'zh-TW': '水很重，所以基地幾乎每一滴都淨化再利用。',
    },
    terms: ['waterRecycling', 'oxygenRecovery'],
  },
  {
    sol: 6,
    line: {
      en: 'A radio reply from Earth can take 3 to 22 minutes one way. The crew has to decide on its own.',
      'zh-TW': '地球的無線電回覆單向要 3 到 22 分鐘。船員必須自己決定。',
    },
    terms: ['commsDelay', 'pressure'],
  },
  {
    sol: 7,
    line: {
      en: 'The greenhouse is small, but fresh food helps both health and morale.',
      'zh-TW': '{{greenhouse}}很小，但新鮮食物對健康和士氣都有幫助。',
    },
    terms: ['greenhouse', 'subsurfaceIce'],
  },
];

export function briefForSol(sol: number): DailyBrief {
  return DAILY_BRIEFS[Math.min(Math.max(sol - 1, 0), DAILY_BRIEFS.length - 1)];
}
