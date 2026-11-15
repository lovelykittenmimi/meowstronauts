import type { Lang, Localized } from '../../../game/types';

/**
 * Local copy for the water & fuel factory overlay. Kept inside
 * src/minigames/factory so the shared i18n only needs the entry label.
 * Claims must stay traceable to docs/data-sources.md §3.7.
 */
export const FACTORY_COPY = {
  eyebrow: { en: 'Mars outpost utility', 'zh-TW': '火星基地工廠' },
  title: { en: 'Water & fuel factory', 'zh-TW': '水與燃料工廠' },
  introKicker: { en: 'Ice to fuel', 'zh-TW': '從冰到燃料' },
  introBody: {
    en: 'Wake up the factory! Dig up ice, split water into air, catch CO₂, and make fuel. Four machines, one big job — and no timer.',
    'zh-TW':
      '叫醒工廠！挖冰、把水分解成空氣、抓住二氧化碳，再做燃料。四台機器，一個大任務——沒有倒數。',
  },
  introRule: {
    en: 'Wrong tap? Silver gives a hint. You can try again as many times as you like.',
    'zh-TW': '點錯了？銀白會給提示，想試幾次都可以。',
  },
  rewardNote: {
    en: 'Finish all four stations to earn +5 life support (once per mission).',
    'zh-TW': '完成四個站可獲得生命維持 +5（每次任務一次）。',
  },
  start: { en: 'Start the factory', 'zh-TW': '啟動工廠' },
  back: { en: 'Back', 'zh-TW': '返回' },
  close: { en: 'Close', 'zh-TW': '關閉' },
  badge: { en: '4 stations', 'zh-TW': '4 個站' },
  progress: { en: 'Station {done}/{total}', 'zh-TW': '第 {done}/{total} 站' },
  stationAnnounce: {
    en: 'Station {done} of {total}: {station}',
    'zh-TW': '第 {done}/{total} 站：{station}',
  },
  stationDone: { en: 'Station online!', 'zh-TW': '這一站啟動了！' },

  guideIntro: {
    en: "Hi! I'm Silver. Let's turn Mars ice into water, air, and fuel!",
    'zh-TW': '嗨！我是銀白。一起把火星的冰變成水、空氣和燃料！',
  },
  guideMine: {
    en: 'The radar is pinging! Tap the spot with the blue signal.',
    'zh-TW': '雷達在響！點有藍色訊號的地方。',
  },
  guideElectrolysis: {
    en: 'The ice is melted! Split the water and sort the two gases.',
    'zh-TW': '冰融化了！把水分解，再把兩種氣體分好。',
  },
  guideScrubber: {
    en: 'Only CO₂ goes in the filter. N₂ and Ar are impostors!',
    'zh-TW': '只有二氧化碳要進濾芯；N₂ 和 Ar 是冒牌貨！',
  },
  guideReactor: {
    en: "Last machine! Let's turn the gases into fuel and water.",
    'zh-TW': '最後一台！把氣體變成燃料和水。',
  },
  guideStationDone: {
    en: 'Click! Another machine is online.',
    'zh-TW': '喀啦！又一台機器上線了。',
  },
  guideResult: {
    en: 'High paws! The whole factory is humming.',
    'zh-TW': '擊掌！整座工廠都在運轉了。',
  },

  station1Title: { en: 'Ice mine', 'zh-TW': '冰礦場' },
  station1Goal: {
    en: 'Find the ice, then bake it in a sealed oven.',
    'zh-TW': '找到冰，放進密封烤箱加熱。',
  },
  digHint: {
    en: 'Dry soil. Look for the blue radar signal.',
    'zh-TW': '這裡沒有冰。找藍色雷達訊號。',
  },
  digSpot: { en: 'Radar spot {spot}', 'zh-TW': '雷達點 {spot}' },
  iceFound: {
    en: 'Water ice found! Now choose an oven.',
    'zh-TW': '找到水冰了！選一個烤箱。',
  },
  ovenPrompt: {
    en: 'How should we heat the soil?',
    'zh-TW': '要怎麼加熱土壤？',
  },
  ovenSealed: { en: 'Sealed oven', 'zh-TW': '密封烤箱' },
  ovenOpen: { en: 'Open tray', 'zh-TW': '開放托盤' },
  ovenHint: {
    en: 'Mars air is very thin. An open tray would lose the water.',
    'zh-TW': '火星空氣非常稀薄，開放托盤會讓水跑掉。',
  },
  bake: { en: 'Bake the soil', 'zh-TW': '加熱土壤' },
  sealedReady: {
    en: 'Sealed oven ready. Bake the soil.',
    'zh-TW': '密封烤箱準備好了，加熱土壤。',
  },
  saltFilter: { en: 'Salt filter', 'zh-TW': '鹽分濾網' },

  station2Title: { en: 'Electrolysis', 'zh-TW': '電解水' },
  station2Goal: {
    en: 'Split the water, then send each gas to the right tank.',
    'zh-TW': '分解水，把兩種氣體送到正確的槽。',
  },
  power: { en: 'Power the electrolyzer', 'zh-TW': '啟動電解器' },
  o2: { en: 'Oxygen (O₂)', 'zh-TW': '氧氣（O₂）' },
  h2: { en: 'Hydrogen (H₂)', 'zh-TW': '氫氣（H₂）' },
  crewAir: { en: 'Crew air', 'zh-TW': '船員空氣' },
  fuelTank: { en: 'Fuel tank', 'zh-TW': '燃料槽' },
  gasHint: {
    en: 'Crews breathe oxygen. Hydrogen goes to the fuel tank.',
    'zh-TW': '船員呼吸氧氣；氫氣要送到燃料槽。',
  },
  routeHint: {
    en: 'Tap a gas, then tap its tank.',
    'zh-TW': '先點氣體，再點要去的槽。',
  },
  destinationPrompt: { en: 'Where does it go?', 'zh-TW': '要送到哪裡？' },
  gasRouted: {
    en: 'Gas sent. Now route the other one.',
    'zh-TW': '氣體送出了，換另一個。',
  },

  station3Title: { en: 'CO₂ scrubber', 'zh-TW': '二氧化碳捕集器' },
  station3Goal: {
    en: 'Tap the CO₂ molecules, then heat the zeolite filter.',
    'zh-TW': '點選二氧化碳分子，再加熱沸石濾材。',
  },
  moleculeHint: {
    en: 'That is not CO₂. Look for the carbon dioxide labels.',
    'zh-TW': '那不是二氧化碳。找標著 CO₂ 的氣泡。',
  },
  heat: { en: 'Heat the filter', 'zh-TW': '加熱濾材' },
  sampleNote: {
    en: 'Air sample — not to scale.',
    'zh-TW': '空氣樣本，不是按比例。',
  },
  caught: {
    en: 'CO₂ caught {count}/{total}',
    'zh-TW': '已抓到 CO₂ {count}/{total}',
  },

  station4Title: { en: 'Sabatier reactor', 'zh-TW': '薩巴提爾反應器' },
  station4Goal: {
    en: 'React the gases, then collect both outputs.',
    'zh-TW': '讓氣體反應，收集兩種產物。',
  },
  react: { en: 'Run the reactor', 'zh-TW': '啟動反應器' },
  methane: { en: 'Methane (CH₄)', 'zh-TW': '甲烷（CH₄）' },
  water: { en: 'Water (H₂O)', 'zh-TW': '水（H₂O）' },
  waterTank: { en: 'Water tank', 'zh-TW': '水槽' },
  collectHint: {
    en: 'Methane goes to the fuel tank. Water goes back to the water tank.',
    'zh-TW': '甲烷進燃料槽，水回到水槽。',
  },
  outputCollected: {
    en: 'Output collected. Now collect the other one.',
    'zh-TW': '產物收好了，換另一個。',
  },

  allDone: {
    en: 'All four stations are online!',
    'zh-TW': '四個站都啟動了！',
  },
  resultTitle: { en: 'Factory online!', 'zh-TW': '工廠上線！' },
  resultBody: {
    en: 'The outpost has water, oxygen, and fuel. Here are the NASA facts behind each station.',
    'zh-TW':
      '基地有了水、氧氣和燃料。這是每一站的 NASA 事實。',
  },
  rewardEarned: {
    en: '+{gain} life support — the crew has more water and oxygen.',
    'zh-TW': '生命維持 +{gain}，船員的水和氧氣更充足了。',
  },
  rewardAlready: {
    en: 'The factory bonus was already earned this mission.',
    'zh-TW': '這次任務的工廠獎勵已領取。',
  },
  rewardFull: {
    en: 'Life support is already full — no bonus was added this time.',
    'zh-TW': '生命維持已經滿了，這次不加獎勵。',
  },
  factSectionTitle: {
    en: 'What each station taught us',
    'zh-TW': '每一站學到的 NASA 事實',
  },
  factTag: { en: 'NASA fact', 'zh-TW': 'NASA 事實' },
  stationsLabel: { en: 'Stations online', 'zh-TW': '已啟動的站' },
  whyTitle: { en: 'Why it matters', 'zh-TW': '為什麼重要' },
  moxieTitle: { en: 'Another way', 'zh-TW': '另一種方法' },
  sources: { en: 'Sources', 'zh-TW': '資料來源' },
  sourceMarsFacts: {
    en: 'NASA — Mars Fact Sheet',
    'zh-TW': 'NASA — 火星事實表',
  },
  sourceLifeSupport: {
    en: 'NASA Marshall — The Bare Necessities',
    'zh-TW': 'NASA 馬歇爾中心 — 太空生活的必需品',
  },
  sourceSabatier: {
    en: 'NASA — ISS Sabatier system',
    'zh-TW': 'NASA — 太空站薩巴提爾系統',
  },
  sourceCdra: {
    en: 'NASA NTRS — CO₂ operations on the ISS',
    'zh-TW': 'NASA NTRS — 太空站二氧化碳處理',
  },
  sourcePhoenix: {
    en: 'NASA/JPL — Phoenix results',
    'zh-TW': 'NASA/JPL — 鳳凰號探測結果',
  },
  sourceSwim: {
    en: 'NASA Science — SWIM subsurface ice map',
    'zh-TW': 'NASA Science — SWIM 地下冰地圖',
  },
  sourceMoxie: {
    en: 'NASA — MOXIE makes oxygen on Mars',
    'zh-TW': 'NASA — MOXIE 在火星製造氧氣',
  },
  replay: { en: 'Run the factory again', 'zh-TW': '再跑一次工廠' },
  landscapeNote: {
    en: 'Best in landscape.',
    'zh-TW': '橫向遊玩效果最好。',
  },
} satisfies Record<string, Localized>;

export type FactoryCopyKey = keyof typeof FACTORY_COPY;

export function factoryT(
  lang: Lang,
  key: FactoryCopyKey,
  vars?: Record<string, string | number>,
): string {
  const template = FACTORY_COPY[key][lang];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
