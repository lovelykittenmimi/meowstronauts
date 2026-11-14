import type { Lang, Localized } from '../game/types';

export const STRINGS = {
  'app.title': {
    en: 'Meowstronauts: Mars Outpost',
    'zh-TW': '喵航員：火星基地',
  },
  'app.subtitle': {
    en: 'Three cat astronauts. Seven sols. One outpost.',
    'zh-TW': '三隻貓太空人、七個火星日、一座基地。',
  },
  'title.tagline': {
    en: 'A crash landing near Hope-1. Keep the outpost alive until the rescue window opens.',
    'zh-TW': '迫降在希望一號附近。撐到救援窗口開啟。',
  },
  'title.start': { en: 'Start the mission', 'zh-TW': '開始任務' },
  'title.difficulty': { en: 'Choose a difficulty', 'zh-TW': '選擇難度' },
  'difficulty.cadet': { en: 'Cadet', 'zh-TW': '見習生' },
  'difficulty.cadet.desc': {
    en: 'More supplies. A gentler first mission.',
    'zh-TW': '補給較多，第一次任務比較溫和。',
  },
  'difficulty.officer': { en: 'Officer', 'zh-TW': '軍官' },
  'difficulty.officer.desc': {
    en: 'The intended balance. Think before you spend.',
    'zh-TW': '標準平衡。花資源前先想一下。',
  },
  'difficulty.ace': { en: 'Ace', 'zh-TW': '王牌' },
  'difficulty.ace.desc': {
    en: 'Less of everything. For a hard mission.',
    'zh-TW': '什麼都比較少，給硬派任務。',
  },
  'title.language': { en: 'Language', 'zh-TW': '語言' },
  'briefing.title': { en: 'Daily briefing', 'zh-TW': '每日簡報' },
  'briefing.sol': { en: 'Sol {sol} of 7', 'zh-TW': '第 {sol} 個火星日／共 7 日' },
  'briefing.weather': { en: 'Curiosity weather snapshot', 'zh-TW': '好奇號天氣快照' },
  'briefing.temp': {
    en: 'High {max}°C · Low {min}°C',
    'zh-TW': '最高 {max}°C · 最低 {min}°C',
  },
  'briefing.cold': { en: 'Very cold', 'zh-TW': '非常冷' },
  'briefing.begin': { en: 'Begin this sol', 'zh-TW': '開始這一天' },
  'briefing.snapshot': {
    en: 'Historical snapshot, not live data or a forecast.',
    'zh-TW': '歷史快照，不是即時資料，也不是預報。',
  },
  'hud.power': { en: 'Power', 'zh-TW': '電力' },
  'hud.lifeSupport': { en: 'Life support', 'zh-TW': '生命維持' },
  'hud.shield': { en: 'Shielding', 'zh-TW': '輻射遮蔽' },
  'hud.food': { en: 'Food', 'zh-TW': '食物' },
  'hud.health': { en: 'Health', 'zh-TW': '健康' },
  'hud.science': { en: 'Science', 'zh-TW': '科學' },
  'hud.backpack': { en: 'Backpack', 'zh-TW': '背包' },
  'event.choose': { en: 'Choose one', 'zh-TW': '選一個' },
  'event.cost': { en: 'Costs', 'zh-TW': '代價' },
  'event.risk': { en: '{percent}% risk', 'zh-TW': '{percent}% 風險' },
  'event.requires': { en: 'Uses one {cat} assist', 'zh-TW': '用掉一次{cat}專長' },
  'event.result': { en: 'Result', 'zh-TW': '結果' },
  'event.success': { en: 'It worked.', 'zh-TW': '成功了。' },
  'event.failed': { en: 'It went wrong.', 'zh-TW': '出錯了。' },
  'event.continue': { en: 'Continue', 'zh-TW': '繼續' },
  'event.newCard': { en: 'New knowledge card', 'zh-TW': '獲得新的知識卡' },
  'assist.title': { en: 'Cat assist', 'zh-TW': '貓咪專長' },
  'assist.silver': { en: 'Silver: find a knowledge card', 'zh-TW': '銀白：找到一張知識卡' },
  'assist.shadow': { en: 'Shadow: +12 power', 'zh-TW': '暗影：電力 +12' },
  'assist.gingerFood': { en: 'Ginger: +1 food', 'zh-TW': '金桔：食物 +1' },
  'assist.gingerLife': { en: 'Ginger: +10 life support', 'zh-TW': '金桔：生命維持 +10' },
  'assist.left': { en: '{count} left', 'zh-TW': '剩 {count} 次' },
  'assist.used': { en: 'Assist used', 'zh-TW': '專長已使用' },
  'knowledge.title': { en: 'Knowledge card', 'zh-TW': '知識卡' },
  'knowledge.short': { en: 'What it means', 'zh-TW': '這是什麼' },
  'knowledge.example': { en: 'Example', 'zh-TW': '例子' },
  'knowledge.why': { en: 'Why it matters', 'zh-TW': '為什麼重要' },
  'knowledge.sources': { en: 'Source', 'zh-TW': '資料來源' },
  'knowledge.collect': { en: 'Add to backpack', 'zh-TW': '收入背包' },
  'knowledge.collected': { en: 'In backpack', 'zh-TW': '已在背包' },
  'knowledge.close': { en: 'Close', 'zh-TW': '關閉' },
  'backpack.title': { en: 'Knowledge backpack', 'zh-TW': '知識背包' },
  'backpack.count': { en: '{count} / {total}', 'zh-TW': '{count} / {total}' },
  'backpack.empty': { en: 'Not collected yet', 'zh-TW': '尚未收藏' },
  'backpack.close': { en: 'Close', 'zh-TW': '關閉' },
  'data.button': { en: 'View data', 'zh-TW': '看資料' },
  'data.title': { en: 'NASA data behind this sol', 'zh-TW': '這一天背後的 NASA 資料' },
  'data.note': { en: 'Snapshot, not live.', 'zh-TW': '快照，不是即時資料。' },
  'data.donki': {
    en: 'DONKI solar flares, 13–17 May 2025',
    'zh-TW': 'DONKI 太陽閃焰，2025 年 5 月 13–17 日',
  },
  'data.rems': {
    en: 'Curiosity REMS air temperature, 8–22 May 2025',
    'zh-TW': '好奇號 REMS 氣溫，2025 年 5 月 8–22 日',
  },
  'data.flare': { en: 'X2.7 flare, 14 May', 'zh-TW': '5 月 14 日 X2.7 閃焰' },
  'data.cold': { en: 'Cold week', 'zh-TW': '冷週' },
  'data.close': { en: 'Close', 'zh-TW': '關閉' },
  'report.title': { en: 'Mission report', 'zh-TW': '任務報告' },
  'report.survived': { en: 'Seven sols at Hope-1', 'zh-TW': '在希望一號撐過七個火星日' },
  'report.stars': { en: 'Mission rating', 'zh-TW': '任務評價' },
  'report.resources': { en: 'Final resources', 'zh-TW': '最後資源' },
  'report.backpack': { en: 'Backpack', 'zh-TW': '背包' },
  'report.curve': { en: 'Resource trend', 'zh-TW': '資源變化' },
  'report.health': { en: 'Health', 'zh-TW': '健康' },
  'report.science': { en: 'Science', 'zh-TW': '科學' },
  'report.again': { en: 'Play again', 'zh-TW': '再玩一次' },
  'report.comment3': {
    en: 'The crew is healthy, curious, and talking about tomorrow.',
    'zh-TW': '船員健康、好奇，而且正在聊明天。',
  },
  'report.comment2': {
    en: 'The outpost held. There is still work to do.',
    'zh-TW': '基地撐住了，但還有工作要做。',
  },
  'report.comment1': {
    en: 'Everyone made it home. Next time, check the supplies sooner.',
    'zh-TW': '大家都回來了。下次早一點檢查補給。',
  },
  'report.emergency': { en: 'Emergency supply', 'zh-TW': '緊急補給' },
  'report.emergency.used': { en: 'Used', 'zh-TW': '已使用' },
  'report.emergency.unused': { en: 'Unused', 'zh-TW': '未使用' },
  'title.snapshotNote': {
    en: 'NASA data snapshots · Historical weather and space-weather records, not live.',
    'zh-TW': 'NASA 資料快照 · 歷史天氣與太空天氣紀錄，非即時資料。',
  },
  'gameover.title': { en: 'Mission paused', 'zh-TW': '任務暫停' },
  'gameover.text': {
    en: 'The crew needs rest and repair. Try the sol again.',
    'zh-TW': '船員需要休息與維修。再試一次這一天。',
  },
  'gameover.restart': { en: 'Back to title', 'zh-TW': '回到標題' },
  'common.lang': { en: '中文', 'zh-TW': 'English' },
} satisfies Record<string, Localized>;

export type StringKey = keyof typeof STRINGS;

export function t(
  lang: Lang,
  key: StringKey,
  vars?: Record<string, string | number>,
): string {
  let text = STRINGS[key][lang];
  if (!vars) return text;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}

export const CAT_NAMES: Record<'silver' | 'shadow' | 'ginger', Localized> = {
  silver: { en: 'Silver', 'zh-TW': '銀白' },
  shadow: { en: 'Shadow', 'zh-TW': '暗影' },
  ginger: { en: 'Ginger', 'zh-TW': '金桔' },
};

export const RESOURCE_LABEL_KEY = {
  power: 'hud.power',
  lifeSupport: 'hud.lifeSupport',
  shield: 'hud.shield',
  food: 'hud.food',
  health: 'hud.health',
  science: 'hud.science',
} as const satisfies Record<string, StringKey>;
