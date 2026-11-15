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
  'briefing.title': { en: "Captain's log", 'zh-TW': '艦長日誌' },
  'briefing.sol': { en: 'Sol {sol} of 7', 'zh-TW': '第 {sol} 個火星日／共 7 日' },
  'briefing.weather': { en: 'Curiosity weather snapshot', 'zh-TW': '好奇號天氣快照' },
  'briefing.temp': {
    en: 'High {max}°C · Low {min}°C',
    'zh-TW': '最高 {max}°C · 最低 {min}°C',
  },
  'briefing.cold': { en: 'Very cold', 'zh-TW': '非常冷' },
  'briefing.begin': { en: 'Begin this sol', 'zh-TW': '開始這一天' },
  'briefing.hop': {
    en: 'Try the low-gravity hop',
    'zh-TW': '試試低重力跳躍',
  },
  'briefing.foodGame': {
    en: 'Try the space food flip',
    'zh-TW': '試試太空食物翻卡',
  },
  'briefing.factoryGame': {
    en: 'Try the water & fuel factory',
    'zh-TW': '試試水與燃料工廠',
  },
  'briefing.shelterGame': {
    en: 'Try the shelter drill',
    'zh-TW': '試試避難艙演練',
  },
  'briefing.dodgeGame': {
    en: 'Try the dust devil dodge',
    'zh-TW': '試試塵捲風閃避',
  },
  'briefing.signalGame': {
    en: 'Try the signal delay',
    'zh-TW': '試試訊號延遲',
  },
  'briefing.snapshot': {
    en: 'Historical snapshot, not live data or a forecast.',
    'zh-TW': '歷史快照，不是即時資料，也不是預報。',
  },
  'solnav.aria': {
    en: 'Sol switcher and practice games',
    'zh-TW': '火星日切換與練習遊戲',
  },
  'solnav.sol': { en: 'Sol {sol}', 'zh-TW': '第 {sol} 日' },
  'solnav.locked': { en: 'Not reached yet', 'zh-TW': '還沒進行到這一天' },
  'solnav.lander': { en: 'Landing practice', 'zh-TW': '著陸練習' },
  'solnav.hop': { en: 'Low-gravity hop', 'zh-TW': '低重力跳躍' },
  'solnav.food': { en: 'Space food flip', 'zh-TW': '太空食物翻卡' },
  'solnav.shelter': { en: 'Shelter drill', 'zh-TW': '避難演練' },
  'solnav.dust': { en: 'Sweep the panels', 'zh-TW': '清掃太陽能板' },
  'solnav.dustdodge': { en: 'Dust devil dodge', 'zh-TW': '塵捲風閃避' },
  'solnav.hull': { en: 'Patch the hull', 'zh-TW': '補好破洞' },
  'solnav.factory': { en: 'Water & fuel factory', 'zh-TW': '水與燃料工廠' },
  'solnav.signal': { en: 'Signal delay', 'zh-TW': '訊號延遲' },
  'solnav.tomato': { en: 'Harvest the tomatoes', 'zh-TW': '採收番茄' },
  'solnav.match': { en: 'Knowledge card match', 'zh-TW': '知識卡配對' },
  'review.eyebrow': { en: 'Sol review', 'zh-TW': '火星日回顧' },
  'review.chose': { en: 'Your crew chose', 'zh-TW': '你們選了' },
  'review.back': { en: 'Back to Sol {sol}', 'zh-TW': '回到第 {sol} 日' },
  'hud.power': { en: 'Power', 'zh-TW': '電力' },
  'hud.lifeSupport': { en: 'Life support', 'zh-TW': '生命維持' },
  'hud.shield': { en: 'Shielding', 'zh-TW': '輻射遮蔽' },
  'hud.food': { en: 'Food', 'zh-TW': '食物' },
  'hud.health': { en: 'Health', 'zh-TW': '健康' },
  'hud.science': { en: 'Science', 'zh-TW': '科學' },
  'hud.backpack': { en: 'Backpack', 'zh-TW': '背包' },
  'event.incident': { en: "Today's incident", 'zh-TW': '今日突發事件' },
  'event.choose': { en: 'Choose one', 'zh-TW': '選一個' },
  'event.cost': { en: 'Costs', 'zh-TW': '代價' },
  'event.risk': { en: '{percent}% risk', 'zh-TW': '{percent}% 風險' },
  'event.requires': { en: 'Uses one {cat} assist', 'zh-TW': '用掉一次{cat}專長' },
  'event.result': { en: 'Result', 'zh-TW': '結果' },
  'event.success': { en: 'It worked.', 'zh-TW': '成功了。' },
  'event.failed': { en: 'It went wrong.', 'zh-TW': '出錯了。' },
  'event.continue': { en: 'Continue', 'zh-TW': '繼續' },
  'event.newCard': { en: 'New knowledge card', 'zh-TW': '獲得新的知識卡' },
  'event.riskRoll': { en: 'Risk roll', 'zh-TW': '風險骰子' },
  'event.riskSuccess': { en: 'Success', 'zh-TW': '成功' },
  'event.riskFailure': { en: 'Failure', 'zh-TW': '失敗' },
  'event.riskHit': { en: 'the risk happened', 'zh-TW': '風險發生了' },
  'event.riskMiss': { en: 'the risk did not happen', 'zh-TW': '風險沒有發生' },
  'rest.photos.title': { en: 'Crew photo album', 'zh-TW': '船員相簿' },
  'rest.photo.landscape': {
    en: 'Gale Crater, Mars',
    'zh-TW': '火星蓋爾撞擊坑',
  },
  'rest.photo.photographer': {
    en: 'A rare photo of the photographer',
    'zh-TW': '攝影師難得入鏡',
  },
  'rest.photo.rock': {
    en: 'A rock shaped like a flower',
    'zh-TW': '像花的岩石',
  },
  'rest.photos.credit': {
    en: "Actually photographed by NASA's Curiosity rover. NASA/JPL-Caltech · NASA/JPL-Caltech/MSSS.",
    'zh-TW': '其實是 NASA 好奇號探測車拍的。NASA/JPL-Caltech、NASA/JPL-Caltech/MSSS。',
  },
  'rest.photos.open': {
    en: 'View the crew photo album',
    'zh-TW': '查看船員相簿',
  },
  'rest.photos.next': {
    en: 'Take picture',
    'zh-TW': '拍照',
  },
  'rest.photos.close': {
    en: 'Back to the result',
    'zh-TW': '回到結果',
  },
  'dust.title': { en: 'Sweep the panels', 'zh-TW': '清掃太陽能板' },
  'dust.hint': { en: 'Tap every dust patch', 'zh-TW': '點掉每一團沙塵' },
  'dust.left': { en: '{count} left', 'zh-TW': '剩 {count} 團' },
  'dust.done': { en: 'Panels clear', 'zh-TW': '清乾淨了' },
  'dust.back': { en: 'Back', 'zh-TW': '返回' },
  'hull.eyebrow': {
    en: 'MICROMETEORITE BREACH · SOL {sol}',
    'zh-TW': '微隕石擊穿 · 第 {sol} 火星日',
  },
  'hull.title': { en: 'Patch the hull', 'zh-TW': '補好破洞' },
  'hull.hull': { en: 'HULL', 'zh-TW': '外殼' },
  'hull.leaks': { en: '{count} leaks', 'zh-TW': '{count} 個漏氣點' },
  'hull.leakOne': { en: '1 leak', 'zh-TW': '1 個漏氣點' },
  'hull.left': { en: '{count} leaks left', 'zh-TW': '剩 {count} 個漏氣點' },
  'hull.leftOne': { en: '1 leak left', 'zh-TW': '剩 1 個漏氣點' },
  'hull.sealedCount': { en: 'SEALED', 'zh-TW': '已密封' },
  'hull.hintStart': {
    en: 'Tap a flashing leak. The repair drone will do the rest.',
    'zh-TW': '點一個閃動的漏氣點，維修無人機會出動。',
  },
  'hull.hintBusy': {
    en: 'Repair drone working…',
    'zh-TW': '維修無人機作業中……',
  },
  'hull.hintDone': {
    en: 'Hull sealed. Pressure holding.',
    'zh-TW': '外殼密封，艙壓穩定。',
  },
  'hull.sealed': { en: 'HULL SEALED', 'zh-TW': '外殼密封' },
  'hull.sealedSub': { en: 'Pressure holding', 'zh-TW': '艙壓穩定' },
  'hull.dock': { en: 'REPAIR BAY', 'zh-TW': '維修基地' },
  'hull.exit': { en: 'Skip repair', 'zh-TW': '跳過維修' },
  'hull.repairAria': {
    en: 'Repair leak {i} of {total}',
    'zh-TW': '修補第 {i} 個漏氣點，共 {total} 個',
  },
  'hull.progressAria': { en: 'Hull integrity', 'zh-TW': '外殼完整度' },
  'hull.rotate': {
    en: 'Rotate your phone to landscape',
    'zh-TW': '請把手機橫放',
  },
  'assist.title': { en: 'Cat assist', 'zh-TW': '貓咪專長' },
  'assist.silver': { en: 'Silver: +1 science + card', 'zh-TW': '銀白：科學 +1＋知識卡' },
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
  'backpack.matchPractice': {
    en: 'Knowledge Card Match',
    'zh-TW': '知識卡配對',
  },
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
  'data.liveTitle': { en: 'Latest 7 sols from NASA', 'zh-TW': 'NASA 最新 7 個 sol' },
  'data.liveShow': { en: 'Load latest 7 sols', 'zh-TW': '載入最新 7 個 sol' },
  'data.liveHide': { en: 'Hide latest sols', 'zh-TW': '收起最新 sol' },
  'data.liveLoading': { en: 'Contacting NASA…', 'zh-TW': '正在連線 NASA…' },
  'data.liveError': {
    en: 'Could not reach NASA. The 2025 snapshot above still works.',
    'zh-TW': '連不到 NASA；上方 2025 年快照仍可使用。',
  },
  'data.liveRetry': { en: 'Try again', 'zh-TW': '再試一次' },
  'data.liveNote': {
    en: "Latest observations in NASA's Curiosity feed, not real-time. These are NASA sol numbers, not the mission's Sol 1–7; the mission still uses the 2025 snapshot.",
    'zh-TW':
      '這是 NASA 好奇號 feed 的最新觀測，不是即時天氣。這裡是 NASA 的 sol 編號，不是任務的 Sol 1–7；任務仍使用 2025 年快照。',
  },
  'data.liveCaption': {
    en: 'Latest {count} sols with temperature data, newest first',
    'zh-TW': '最新 {count} 個有氣溫資料的 sol（新到舊）',
  },
  'data.liveSol': { en: 'NASA sol', 'zh-TW': 'NASA sol' },
  'data.liveDate': { en: 'Earth date', 'zh-TW': '地球日期' },
  'data.liveHigh': { en: 'High °C', 'zh-TW': '高溫 °C' },
  'data.liveLow': { en: 'Low °C', 'zh-TW': '低溫 °C' },
  'data.livePressure': { en: 'Pressure (Pa)', 'zh-TW': '氣壓（Pa）' },
  'data.liveRetrieved': { en: 'Retrieved', 'zh-TW': '擷取於' },
  'data.liveLatest': { en: 'Feed latest', 'zh-TW': 'feed 最新' },
  'data.liveLoaded': { en: 'Loaded {count} sols.', 'zh-TW': '已載入 {count} 個 sol。' },
  'data.liveFallbackStatus': {
    en: 'NASA feed blocked; showing the archived copy.',
    'zh-TW': '連不到 NASA feed；顯示封存副本。',
  },
  'data.liveFallbackNote': {
    en: "NASA's feed could not be reached from this browser. Showing the latest 7 sols archived on {date}; these are NASA sol numbers, not the mission's Sol 1–7, and the mission still uses the 2025 snapshot.",
    'zh-TW':
      '這個瀏覽器連不到 NASA feed；顯示 {date} 封存的最近 7 個 sol。這裡是 NASA 的 sol 編號，不是任務的 Sol 1–7；任務仍使用 2025 年快照。',
  },
  'data.liveArchived': { en: 'Archived', 'zh-TW': '封存於' },
  'data.liveRetryLive': { en: 'Try live again', 'zh-TW': '再試連線' },
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
  'report.epilogueFinish': { en: 'Mission report', 'zh-TW': '任務報告' },
  'report.comment3': {
    en: 'The crew is healthy, curious, and talking about tomorrow.',
    'zh-TW': '隊員們健康又有活力，正滿懷好奇地聊著明天的計畫。',
  },
  'report.comment2': {
    en: 'The outpost held. There is still work to do.',
    'zh-TW': '基地撐住了，但還有工作要做。',
  },
  'report.comment1': {
    en: 'Everyone made it home. Next time, check the supplies sooner.',
    'zh-TW': '大家都平安到家了。下次記得早點檢查補給。',
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
  'gameover.debrief': { en: 'Debrief', 'zh-TW': '任務覆盤' },
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
