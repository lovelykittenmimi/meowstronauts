import type { Lang, PhaseKey } from './types';

const EN = {
  eyebrow: 'Meowstronauts · training sim',
  title: 'Mars Weather Lander',
  subtitle: 'Gale Crater · Curiosity landing site',
  dataCredits: 'Data & credits',
  backToStory: 'Back to story',
  language: '中文',
  sol: 'Sol',
  phase: 'Phase',
  wind: 'Wind',
  from: 'from',
  temp: 'Air temp',
  pressure: 'Pressure',
  distance: 'To target',
  land: 'LAND',
  reset: 'Reset',
  newSol: 'New sol',
  tryThisSol: 'Try this sol again',
  nextSol: 'Next sol',
  close: 'Close',
  keyboardHint: 'Arrow keys / WASD to fly · Enter or Space to land',
  touchHint: 'Hold the arrows to fly · tap LAND when you arrive',
  windLegend: 'Arrows show where the wind pushes the ship',
  mapLabel: 'Gale Crater · Mars Trek',
  weatherLabel: 'MEDA sample · Jezero Crater',
  targetLabel: 'Curiosity landing site',
  startLabel: 'START',
  dustDevil: 'Dust devil',
  gustZone: 'Gust zone',
  coldPocket: 'Cold pocket',
  conditions: 'Conditions',
  calm: 'Calm',
  windy: 'Windy',
  gusty: 'Gusty',
  shifting: 'Shifting wind',
  cold: 'Cold',
  pressureDrop: 'Pressure drop',
  guideStart: 'You are at the left edge. Fly east to the central crater.',
  guideClose: 'You are close! Press LAND.',
  guidePerfect: 'Purr-fect landing!',
  guideFar: 'Not there yet — adjust and try again.',
  guideDust: 'Dust devil! It spun the ship off course.',
  guideGust: 'Gust! The wind shoved the ship.',
  guideCold: 'Cold pocket! The thrusters are sluggish.',
  perfectTitle: 'Perfect landing!',
  perfectBody: 'You hit the Curiosity landing site right in the middle. Silver is impressed.',
  closeTitle: 'Landing complete',
  closeBody: 'Landing complete, but you were a little off target.',
  farTitle: 'Keep flying',
  distanceResult: 'Final distance',
  resultSol: 'Sol',
  resultWind: 'Wind at landing',
  infoTitle: 'Data & credits',
  infoWeather:
    'Weather: NASA Perseverance MEDA (Mars 2020), sols 300–306 at Jezero Crater. Wind from DER_WS, pressure from DER_PS, air temperature from calibrated ATS.',
  infoWind:
    'MEDA wind direction is the azimuth the wind comes from. The arrows on the map show where the wind pushes your ship.',
  infoMap:
    'Map: NASA Mars Trek, Gale Crater (NASA/JPL-Caltech). The target is the Curiosity landing site in Gale Crater.',
  infoNote:
    'This is a training simulation: real Mars weather from Jezero Crater is applied to a Gale Crater map. It is not a forecast and does not imply NASA endorsement.',
  infoLinks: 'Sources',
  medaLink: 'NASA PDS: Mars 2020 MEDA',
  mapLink: 'NASA Mars Trek',
  bestLandscape: 'Best in landscape',
  rotateHint: 'Rotate your device to landscape for the best view.',
  mps: 'm/s',
  pa: 'Pa',
  km: 'km',
  compassNote: 'Wind from',
} as const;

type CopyKey = keyof typeof EN;

const ZH: Record<CopyKey, string> = {
  eyebrow: '喵航員 · 訓練模擬',
  title: '火星氣象著陸訓練',
  subtitle: '蓋爾隕石坑 · 好奇號著陸點',
  dataCredits: '資料與來源',
  backToStory: '返回對話',
  language: 'EN',
  sol: '火星日',
  phase: '時段',
  wind: '風速',
  from: '來自',
  temp: '氣溫',
  pressure: '氣壓',
  distance: '距目標',
  land: '著陸',
  reset: '重新開始',
  newSol: '換一天',
  tryThisSol: '再試同一天',
  nextSol: '換下一天',
  close: '關閉',
  keyboardHint: '方向鍵／WASD 移動 · Enter 或空白鍵著陸',
  touchHint: '按住方向鍵移動 · 到目標附近按「著陸」',
  windLegend: '箭頭表示風會把飛船推往的方向',
  mapLabel: '蓋爾隕石坑 · Mars Trek',
  weatherLabel: 'MEDA 樣本 · 耶澤羅隕石坑',
  targetLabel: '好奇號著陸點',
  startLabel: '起點',
  dustDevil: '沙塵旋風',
  gustZone: '陣風區',
  coldPocket: '寒冷區',
  conditions: '天氣狀況',
  calm: '平靜',
  windy: '風大',
  gusty: '強陣風',
  shifting: '風向多變',
  cold: '寒冷',
  pressureDrop: '氣壓下降',
  guideStart: '你在畫面左側。往東飛向中央的隕石坑。',
  guideClose: '很接近了！按「著陸」。',
  guidePerfect: '完美著陸！',
  guideFar: '還沒到，調整一下再試。',
  guideDust: '沙塵旋風！飛船被吹偏了。',
  guideGust: '強陣風！飛船被推開。',
  guideCold: '寒冷區！推進器變得不靈敏。',
  perfectTitle: '精準著陸！',
  perfectBody: '你正中 Curiosity 的著陸點，銀白非常佩服。',
  closeTitle: '著陸任務完成',
  closeBody: '著陸任務完成，但差了一點點距離。',
  farTitle: '繼續飛',
  distanceResult: '最後距離',
  resultSol: '火星日',
  resultWind: '著陸時風況',
  infoTitle: '資料與來源',
  infoWeather:
    '天氣：NASA Perseverance MEDA（Mars 2020），Jezero 隕石坑 sol 300–306。風速／風向來自 DER_WS，氣壓來自 DER_PS，氣溫來自校正後 ATS。',
  infoWind:
    'MEDA 風向是「風來自的方位角」。地圖箭頭顯示風會把飛船推往的方向。',
  infoMap:
    '地圖：NASA Mars Trek 蓋爾隕石坑（NASA/JPL-Caltech）。目標是好奇號在蓋爾隕石坑的著陸點。',
  infoNote:
    '這是訓練模擬：把 Jezero 隕石坑的真實火星天氣套用在蓋爾隕石坑地圖上，不是預報，也不代表 NASA 背書。',
  infoLinks: '資料連結',
  medaLink: 'NASA PDS：Mars 2020 MEDA',
  mapLink: 'NASA Mars Trek',
  bestLandscape: '建議橫向遊玩',
  rotateHint: '請將裝置橫放，以獲得最佳遊戲視野。',
  mps: 'm/s',
  pa: 'Pa',
  km: 'km',
  compassNote: '風來自',
};

const COPY: Record<Lang, Record<CopyKey, string>> = { en: EN, 'zh-TW': ZH };

export function t(lang: Lang, key: CopyKey): string {
  return COPY[lang][key];
}

export const PHASE_ORDER: PhaseKey[] = ['night', 'morning', 'afternoon', 'evening'];

const PHASE_NAMES: Record<Lang, Record<PhaseKey, string>> = {
  en: { night: 'Night', morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' },
  'zh-TW': { night: '夜間', morning: '上午', afternoon: '午後', evening: '傍晚' },
};

export function phaseName(lang: Lang, key: PhaseKey): string {
  return PHASE_NAMES[lang][key];
}

const COMPASS_EN = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
];

const COMPASS_ZH = [
  '北',
  '北北東',
  '東北',
  '東北東',
  '東',
  '東南東',
  '東南',
  '南南東',
  '南',
  '南南西',
  '西南',
  '西南西',
  '西',
  '西北西',
  '西北',
  '北北西',
];

export function compassLabel(lang: Lang, degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return (lang === 'en' ? COMPASS_EN : COMPASS_ZH)[index];
}

export function guideWind(lang: Lang, compass: string, speed: number): string {
  if (lang === 'zh-TW') {
    return `風來自${compass}，風速 ${speed.toFixed(1)} m/s。用方向鍵調整。`;
  }
  return `Wind from ${compass} at ${speed.toFixed(1)} m/s. Use the arrows.`;
}

export function farBody(lang: Lang, km: number): string {
  if (lang === 'zh-TW') {
    return `距離著陸點還有 ${km.toLocaleString('en-US')} 公里。`;
  }
  return `You are still ${km.toLocaleString('en-US')} km from the landing site.`;
}

export function conditionLabel(lang: Lang, key: 'windy' | 'gusty' | 'shifting' | 'cold' | 'pressureDrop'): string {
  return t(lang, key);
}
