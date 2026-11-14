import type { CatId, Lang } from '../../../game/types';
import type { DrillOutcome, MaterialId } from './types';

const EN = {
  eyebrow: 'Meowstronauts · training sim',
  title: 'Shelter Drill',
  subtitle: 'Solar particle event · DONKI 2025-05-13',
  dataCredits: 'Data & credits',
  backToBase: 'Back to base',
  languageButton: '中文',
  close: 'Close',

  prepTitle: 'Prepare the shelter',
  prepBody:
    'Choose one layer for the roof and one for the wall. The storm is coming; you cannot take everything.',
  prepHint: 'Regolith on the roof, water on the wall: that is the best fit.',
  selectSlot: 'Choose a slot',
  slotRoof: 'Roof',
  slotWall: 'Wall',
  slotEmpty: 'Choose a layer',
  slotClear: 'Clear',
  materials: 'Materials',
  budgetMass: 'Mass {used}/{max}',
  budgetWater: 'Water {used}/{max}',
  budgetTime: 'Install {seconds}s',
  shieldPreview: 'Shield preview',
  shieldSep: 'Solar particles',
  shieldGcr: 'Cosmic rays',
  shieldBaseline: 'Hull shell',
  moveToShelter: 'Move to the shelter',
  movingToShelter: 'Moving to the shelter…',
  moveHint: 'Fill both slots to start the drill.',
  overBudget: 'Over budget',
  materialCost: 'Mass {mass} · Water {water} · {seconds}s',

  eventLabel: 'DONKI solar particle event',
  eventFlare: 'Flare 15:25Z',
  eventSep: 'SEP 18:14Z',
  eventAlert: 'Alert 18:33Z',
  eventInstrument: 'SOHO COSTEP · 15.8–39.8 MeV',
  eventCompressed: 'Real event, compressed to 20 seconds.',
  eventSimulation: 'Dose is a training value, not a Mars measurement.',

  alertTitle: 'Particle front incoming',
  alertBody: 'Tap each cat to call them back. Packing and running take time.',
  particleFront: 'Particle front',
  secondsLeft: '{seconds}s',
  sepConfirmed: 'SEP confirmed. Do not wait for the alert.',
  recall: 'Recall',
  packing: 'Packing {seconds}s',
  returning: 'Returning · {seconds}s',
  inside: 'Inside',
  outside: 'Outside',
  late: 'Too late',
  willBeLate: 'Will be late',
  shelter: 'Storm shelter',
  crewOutside: 'Crew still outside',
  catsInside: '{count}/3 inside',
  hatch: 'Hatch',
  hatchOpen: 'Open',
  hatchClosed: 'Closed',
  closeHatch: 'Close the hatch',
  alertHint: 'Click the cats. Ginger is farthest and needs the most time.',
  etaHint: '{seconds}s to reach the shelter',

  stormTitle: 'The storm hits',
  stormBody: 'The shell stops most solar particles. Cosmic rays still get through.',

  resultPerfectTitle: 'Everyone inside. Great drill.',
  resultPerfectBody:
    'You moved early, and the layers did their job. Silver almost looks impressed.',
  resultCloseTitle: 'Everyone is safe, but the dose is a little high.',
  resultCloseBody: 'Next time, start the recall sooner or add more mass.',
  resultRoughTitle: 'Drill complete. A cat was late.',
  resultRoughBody:
    'The shelter works, but time is part of the shield. Call the farthest cat first.',
  resultDose: 'Dose',
  resultSafe: 'Below the line',
  resultHigh: 'Above the line',
  resultMaxDose: 'Highest dose {dose}',
  resultStars: '{count}/3 stars',
  shieldReport: 'Shield report',
  sepBlocked: 'Solar particles blocked {percent}%',
  gcrBlocked: 'Cosmic rays blocked {percent}%',
  massUsed: 'Mass used {mass}',
  waterUsed: 'Water used {water}',
  installTime: 'Install time {seconds}s',
  knowledgeTitle: 'Knowledge card unlocked',
  knowledgeAdded: 'Added to your backpack.',
  retry: 'Run the drill again',
  backToBaseAction: 'Back to base',
  tipGcr: 'Cosmic rays are a background dose. No shelter blocks all of it.',

  infoTitle: 'Data & credits',
  infoNote:
    'This is a training simulation. Event times and instrument are from NASA DONKI; the dose bar is a relative game value, not a Mars surface measurement. No NASA endorsement.',
  infoArticle:
    'NASA — Real Martians: How to Protect Astronauts from Space Radiation on Mars',
  infoDonki: 'NASA DONKI — space weather event catalog',
  infoEvent: 'Event',
  infoAlert: 'Alert',
  infoInstrument: 'Instrument',
  infoCompressed: 'Game timing',
  infoCompressedValue:
    '20 seconds (real event: about 2 h 49 min from the linked flare to SEP)',
  bestLandscape: 'Best in landscape',
  rotateHint: 'Rotate your device for a wider view.',
} as const;

type CopyKey = keyof typeof EN;

const ZH: Record<CopyKey, string> = {
  eyebrow: '喵航員 · 訓練模擬',
  title: '避難艙演練',
  subtitle: '太陽高能粒子事件 · DONKI 2025-05-13',
  dataCredits: '資料與來源',
  backToBase: '回到基地',
  languageButton: 'EN',
  close: '關閉',

  prepTitle: '準備避難艙',
  prepBody: '艙頂、艙壁各選一層。風暴要來了，你不可能什麼都帶。',
  prepHint: '土袋放艙頂、水牆放艙壁，效果最好。',
  selectSlot: '選擇位置',
  slotRoof: '艙頂',
  slotWall: '艙壁',
  slotEmpty: '選擇一層材料',
  slotClear: '清除',
  materials: '材料',
  budgetMass: '質量 {used}/{max}',
  budgetWater: '用水 {used}/{max}',
  budgetTime: '安裝 {seconds} 秒',
  shieldPreview: '遮蔽預覽',
  shieldSep: '太陽粒子',
  shieldGcr: '宇宙射線',
  shieldBaseline: '艙體外殼',
  moveToShelter: '移動到避難艙',
  movingToShelter: '正在前往避難艙……',
  moveHint: '艙頂和艙壁都選好，才能開始演練。',
  overBudget: '超出預算',
  materialCost: '質量 {mass} · 水 {water} · {seconds} 秒',

  eventLabel: 'DONKI 太陽高能粒子事件',
  eventFlare: '閃焰 15:25Z',
  eventSep: 'SEP 18:14Z',
  eventAlert: '警報 18:33Z',
  eventInstrument: 'SOHO COSTEP · 15.8–39.8 MeV',
  eventCompressed: '真實事件，壓縮成 20 秒。',
  eventSimulation: '劑量是訓練數值，不是火星實測。',

  alertTitle: '粒子前緣接近',
  alertBody: '點每一隻貓，叫牠們回來。打包和跑回來都需要時間。',
  particleFront: '粒子前緣',
  secondsLeft: '{seconds} 秒',
  sepConfirmed: 'SEP 已確認。不要等警報才動作。',
  recall: '召回',
  packing: '打包 {seconds} 秒',
  returning: '返回中 · {seconds} 秒',
  inside: '已進艙',
  outside: '還在外面',
  late: '來不及',
  willBeLate: '會來不及',
  shelter: '避難艙',
  crewOutside: '貓咪還在外面',
  catsInside: '{count}/3 已進艙',
  hatch: '艙門',
  hatchOpen: '開啟',
  hatchClosed: '關閉',
  closeHatch: '關上艙門',
  alertHint: '點貓咪召回。最遠的金桔需要最久。',
  etaHint: '約 {seconds} 秒回到避難艙',

  stormTitle: '風暴抵達',
  stormBody: '艙體擋下大部分太陽粒子，宇宙射線還是會穿過。',

  resultPerfectTitle: '全員進艙，演練漂亮。',
  resultPerfectBody: '你提早動作，遮蔽層也發揮作用。銀白幾乎看起來很佩服。',
  resultCloseTitle: '大家都安全，但劑量高了一點。',
  resultCloseBody: '下次早一點召回，或再加一點質量。',
  resultRoughTitle: '演練完成，有貓晚了一步。',
  resultRoughBody: '避難艙有用，但時間也是遮蔽的一部分。先叫最遠的貓。',
  resultDose: '劑量',
  resultSafe: '低於安全線',
  resultHigh: '高於安全線',
  resultMaxDose: '最高劑量 {dose}',
  resultStars: '{count}/3 顆星',
  shieldReport: '遮蔽報告',
  sepBlocked: '太陽粒子擋下 {percent}%',
  gcrBlocked: '宇宙射線擋下 {percent}%',
  massUsed: '使用質量 {mass}',
  waterUsed: '使用水 {water}',
  installTime: '安裝時間 {seconds} 秒',
  knowledgeTitle: '解鎖知識卡',
  knowledgeAdded: '已收入背包。',
  retry: '再演練一次',
  backToBaseAction: '回到基地',
  tipGcr: 'GCR 是背景劑量，沒有避難艙能完全擋住。',

  infoTitle: '資料與來源',
  infoNote:
    '這是訓練模擬。事件時間與儀器來自 NASA DONKI；劑量條是相對的遊戲數值，不是火星表面實測。不代表 NASA 背書。',
  infoArticle: 'NASA — Real Martians：如何保護太空人免於火星太空輻射',
  infoDonki: 'NASA DONKI — 太空天氣事件目錄',
  infoEvent: '事件',
  infoAlert: '警報',
  infoInstrument: '儀器',
  infoCompressed: '遊戲時間',
  infoCompressedValue: '20 秒（真實事件：閃焰到 SEP 約 2 小時 49 分）',
  bestLandscape: '建議橫向遊玩',
  rotateHint: '把裝置橫放，視野更寬。',
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

export const CAT_COPY: Record<
  Lang,
  Record<CatId, { name: string; role: string; station: string }>
> = {
  en: {
    silver: { name: 'Silver', role: 'Captain', station: 'Comms dish' },
    shadow: { name: 'Shadow', role: 'Engineer', station: 'Solar array' },
    ginger: { name: 'Ginger', role: 'Cook', station: 'Greenhouse' },
  },
  'zh-TW': {
    silver: { name: '銀白', role: '艦長', station: '通訊碟' },
    shadow: { name: '暗影', role: '工程師', station: '太陽能陣列' },
    ginger: { name: '金桔', role: '廚師', station: '溫室' },
  },
};

export const MATERIAL_COPY: Record<
  Lang,
  Record<MaterialId, { name: string; note: string }>
> = {
  en: {
    regolith: {
      name: 'Regolith bags',
      note: 'Heavy, free, and best on the roof.',
    },
    water: {
      name: 'Water wall',
      note: 'Hydrogen-rich. It uses drinking water.',
    },
    polyethylene: {
      name: 'Polyethylene panel',
      note: 'Light, hydrogen-rich, easy to fit.',
    },
    trash: {
      name: 'Trash brick',
      note: "Ginger's plastic waste, pressed into a tile.",
    },
    bnnt: {
      name: 'BNNT blanket',
      note: 'Experimental. Boron helps with secondary neutrons.',
    },
  },
  'zh-TW': {
    regolith: {
      name: '風化層土袋',
      note: '很重、免費，放艙頂最好。',
    },
    water: {
      name: '水牆',
      note: '含氫，效率高；會用掉飲用水。',
    },
    polyethylene: {
      name: '聚乙烯板',
      note: '輕、含氫，容易安裝。',
    },
    trash: {
      name: '垃圾塑膠磚',
      note: '金桔的塑膠廢料壓成，免費但只有一塊。',
    },
    bnnt: {
      name: 'BNNT 毯',
      note: '實驗材料；硼有助吸收二次中子。',
    },
  },
};

export const QUOTES: Record<
  Lang,
  Record<DrillOutcome, { cat: CatId; text: string }[]>
> = {
  en: {
    perfect: [
      { cat: 'silver', text: 'Shelter first, then reinforce. The order was right.' },
      { cat: 'shadow', text: 'Water and plastic are hydrogen-rich. They stop protons.' },
      { cat: 'ginger', text: 'The trash brick was my idea. Do not ask about the smell.' },
    ],
    close: [
      { cat: 'silver', text: 'Everyone is safe. The dose is a little high.' },
      { cat: 'shadow', text: 'Cosmic rays do not stop completely. We just lower them.' },
      { cat: 'ginger', text: 'Next time, call the farthest cat first.' },
    ],
    rough: [
      { cat: 'silver', text: 'Time is part of the shield.' },
      { cat: 'shadow', text: 'Farthest cat first. Then close the hatch.' },
      { cat: 'ginger', text: 'A drill is where we are allowed to get it wrong.' },
    ],
  },
  'zh-TW': {
    perfect: [
      { cat: 'silver', text: '先進艙，再加固。順序對了。' },
      { cat: 'shadow', text: '水跟塑膠含氫。擋質子有效。' },
      { cat: 'ginger', text: '垃圾磚是我做的。不要問味道。' },
    ],
    close: [
      { cat: 'silver', text: '大家都安全。劑量高了一點。' },
      { cat: 'shadow', text: '宇宙射線擋不完。只能少一點。' },
      { cat: 'ginger', text: '下次先叫最遠的那隻。' },
    ],
    rough: [
      { cat: 'silver', text: '時間也是遮蔽的一部分。' },
      { cat: 'shadow', text: '先叫最遠的。再關門。' },
      { cat: 'ginger', text: '演練就是拿來失誤的。' },
    ],
  },
};
