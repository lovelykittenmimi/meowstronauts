import type { EventCard, Localized } from './types';
import { isCold } from './conditions';
import { STAR_3_SCIENCE } from './balance';

const l = (en: string, zh: string): Localized => ({ en, 'zh-TW': zh });

const MSL_SOURCE = {
  name: 'NASA Curiosity REMS weather',
  url: 'https://mars.nasa.gov/msl/weather/',
  snapshot: 'src/data/mars-weather.snapshot.json',
  date: '2025-05-15',
};

const DONKI_SOURCE = {
  name: 'NASA DONKI',
  url: 'https://api.nasa.gov/DONKI/',
  snapshot: 'src/data/spaceweather.snapshot.json',
  date: '2025-05-14',
};

/**
 * The scripted Sol 1 tutorial card (docs/event-cards.md §1). It is not part
 * of the 12-card MVP deck and never appears in a normal draw.
 */
export const TUTORIAL_CARD: EventCard = {
  id: 'T1',
  category: 'power',
  cat: 'shadow',
  minSol: 1,
  maxSol: 1,
  title: l('First Order at Hope-1', '希望一號的第一道命令'),
  brief: l(
    'Sunrise. Crash dust covers part of the {{solarPower}} array. Shadow is outside with a brush, waiting for your call.',
    '太陽升起，迫降揚起的沙塵蓋住一部分{{solarPower}}陣列。暗影拿著刷子在外面等你的決定。',
  ),
  terms: ['solarPower'],
  choices: [
    {
      id: 'sweep',
      label: l('Sweep the panels', '清掃太陽能板'),
      effects: { power: 6, lifeSupport: -3, health: -5 },
      knowledgeCard: 'solarPower',
      outcome: l(
        'The panels clear and power ticks up. Dust gets into the airlock, and the crew is worn out.',
        '太陽能板清乾淨了，電力回升。沙塵跑進氣閘艙，大家也累了。',
      ),
    },
    {
      id: 'rest',
      label: l('Let the crew rest', '讓大家先休息'),
      effects: { health: 6, power: -7 },
      outcome: l(
        'The crew warms up and sleeps another hour. The batteries pay for it.',
        '大家暖和起來，又多睡了一小時。代價是消耗電池電力。',
      ),
    },
  ],
};

/**
 * The 12 MVP cards from docs/event-cards.md §3.2.
 * Values match docs/balance-sheet.csv; copy is written during the event.
 */
export const EVENT_CARDS: EventCard[] = [
  {
    id: 'P1',
    category: 'power',
    cat: 'shadow',
    minSol: 2,
    maxSol: 6,
    title: l('Dust on the Solar Panels', '太陽能板積塵'),
    brief: l(
      'Dust from the {{dustStorm}} has settled on the {{solarPower}} panels. Output is falling.',
      '{{dustStorm}} 的沙塵蓋住 {{solarPower}} 板，發電量正在下降。',
    ),
    terms: ['dustStorm', 'solarPower'],
    source: MSL_SOURCE,
    when: (ctx) =>
      (ctx.resources.power < 65 || ctx.flags.crashDust) && ctx.resources.power < 80,
    choices: [
      {
        id: 'clean',
        label: l('Send Shadow to clean', '派暗影清潔'),
        effects: { power: 10, health: -2 },
        knowledgeCard: 'solarPower',
        outcome: l(
          'Shadow clears the panels. Power recovers, but the work is tiring.',
          '暗影把板子清乾淨了。電力回升，但這趟工作很累。',
        ),
      },
      {
        id: 'shake',
        label: l('Shake off the dust', '震動除塵'),
        effects: { power: 8, health: -1 },
        risk: { chance: 0.2, effects: { power: -5, health: -3 } },
        outcome: l(
          'The panels shake. Most dust falls off — if the mechanism holds.',
          '太陽能板開始震動，震落了大部分沙塵——前提是機械結構撐得住。',
        ),
      },
      {
        id: 'leave',
        label: l('Leave it for now', '先不理它'),
        effects: { power: -4, health: 2 },
        duration: 2,
        outcome: l(
          'The dust stays. Power keeps dropping for two sols, but the crew rests.',
          '沙塵沒清。接下來兩個火星日電力會持續下降，但大家能好好休息。',
        ),
      },
    ],
  },
  {
    id: 'P4',
    category: 'power',
    cat: 'ginger',
    minSol: 2,
    maxSol: 6,
    title: l('The Cold Week Drains Power', '寒流來襲，暖氣耗電'),
    brief: l(
      'The thin {{atmosphere}} cannot hold much heat. Keeping the outpost warm is eating power.',
      '稀薄的 {{atmosphere}} 留不住熱，保持基地溫暖正在吃掉電力。',
    ),
    terms: ['atmosphere'],
    source: MSL_SOURCE,
    when: isCold,
    choices: [
      {
        id: 'insulate',
        label: l('Add insulation', '加強保溫'),
        effects: { power: -8, lifeSupport: 6, health: 2 },
        knowledgeCard: 'atmosphere',
        outcome: l(
          'The crew seals the warm rooms. Power drops, but everyone stays comfortable.',
          '大家把有暖氣的艙房封嚴實。雖然耗了一點電，但大家都待得很舒服。',
        ),
      },
      {
        id: 'lower-heat',
        label: l('Lower the heat', '調低暖氣'),
        effects: { power: 6, lifeSupport: -3, health: -5 },
        outcome: l(
          'Power recovers. The cold makes everyone sluggish.',
          '電力回升，但寒冷讓大家動作變慢。',
        ),
      },
      {
        id: 'burn-fuel',
        label: l('Burn reserve fuel', '燒備用燃料'),
        effects: { power: -12, lifeSupport: 4, health: 10 },
        outcome: l(
          'A warm night lifts everyone’s spirits. The reserve tank is lighter.',
          '溫暖的一夜讓大家精神變好，但備用燃料變少了。',
        ),
      },
    ],
  },
  {
    id: 'L1',
    category: 'lifeSupport',
    cat: 'shadow',
    minSol: 2,
    maxSol: 6,
    title: l('Oxygen Recovery Failure', '氧氣回收機故障'),
    brief: l(
      'The {{oxygenRecovery}} unit is failing. Oxygen levels are slipping.',
      '{{oxygenRecovery}}機故障，氧氣濃度正在下滑。',
    ),
    terms: ['oxygenRecovery'],
    source: {
      name: 'NASA — MOXIE completes its mission',
      url: 'https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/',
    },
    when: (ctx) => ctx.resources.lifeSupport < 65 && ctx.resources.lifeSupport < 80,
    choices: [
      {
        id: 'repair',
        label: l('Repair it now', '立即維修'),
        effects: { power: -15, lifeSupport: 18 },
        knowledgeCard: 'oxygenRecovery',
        outcome: l(
          'Shadow reroutes power and restarts the unit. Oxygen stabilizes.',
          '暗影改接電力、重啟機器，氧氣穩住了。',
        ),
      },
      {
        id: 'bypass',
        label: l('Run it in bypass', '旁通運轉'),
        effects: { power: 5, lifeSupport: -10 },
        outcome: l(
          'The unit keeps running, but less efficiently. Power is saved for now.',
          '機器繼續運轉，但效率變差。電力暫時省下來了。',
        ),
      },
      {
        id: 'shadow',
        label: l('Ask Shadow to fix it', '請暗影處理'),
        effects: { lifeSupport: 15 },
        requires: 'shadow',
        outcome: l(
          'Shadow fixes it with a spare part. One assist is used.',
          '暗影用備用零件修好了。用掉一次專長。',
        ),
      },
    ],
  },
  {
    id: 'L2',
    category: 'lifeSupport',
    cat: 'ginger',
    minSol: 2,
    maxSol: 6,
    title: l('Water Recycling Clog', '水循環堵塞'),
    brief: l(
      'The {{waterRecycling}} system is clogged. Less water is coming back.',
      '{{waterRecycling}} 系統堵塞，回收的水變少了。',
    ),
    terms: ['waterRecycling'],
    source: {
      name: 'NASA TechPort — Brine Processor Assembly',
      url: 'https://techport.nasa.gov/projects/184899',
    },
    when: (ctx) => ctx.resources.lifeSupport < 70 && ctx.resources.lifeSupport < 80,
    choices: [
      {
        id: 'clean',
        label: l('Open and clean the pipes', '拆管清洗'),
        effects: { power: -6, lifeSupport: 12, health: -2 },
        knowledgeCard: 'waterRecycling',
        outcome: l(
          'Ginger clears the clog. The water tastes metallic, but it flows.',
          '金桔清通了管線。水喝起來有股金屬味，但至少流得出來了。',
        ),
      },
      {
        id: 'flush',
        label: l('Chemical flush', '化學沖洗'),
        effects: { lifeSupport: 8, food: -1 },
        outcome: l(
          'The flush works. One food pack is used to clean the line.',
          '沖洗見效了，但消耗了一包口糧來清潔管線。',
        ),
      },
      {
        id: 'ration',
        label: l('Ration water', '限水'),
        effects: { power: 6, lifeSupport: -6, health: -2 },
        outcome: l(
          'Everyone uses less water. Power is saved, but the crew is thirsty.',
          '大家少用一點水。電力省了，但船員口渴。',
        ),
      },
    ],
  },
  {
    id: 'L3',
    category: 'lifeSupport',
    cat: 'silver',
    minSol: 3,
    maxSol: 6,
    title: l('Carbon Dioxide Rising', '二氧化碳超標'),
    brief: l(
      'The scrubber is saturated. Mars {{pressure}} is under 1% of Earth’s, so the outpost must clean its own air.',
      '洗滌器飽和了。火星 {{pressure}} 不到地球的 1%，基地必須自己淨化空氣。',
    ),
    terms: ['atmosphere', 'pressure'],
    source: {
      name: 'NASA — Mars Facts',
      url: 'https://science.nasa.gov/mars/facts/',
    },
    when: (ctx) => ctx.resources.lifeSupport < 60 && ctx.resources.lifeSupport < 75,
    choices: [
      {
        id: 'scrubber',
        label: l('Start the backup scrubber', '啟動備用洗滌器'),
        effects: { power: -10, lifeSupport: 12 },
        knowledgeCard: 'pressure',
        outcome: l(
          'The backup scrubber hums to life. CO₂ levels fall.',
          '備用洗滌器啟動，二氧化碳濃度下降。',
        ),
      },
      {
        id: 'reduce',
        label: l('Reduce activity', '全員減少活動'),
        effects: { lifeSupport: 6, health: -2 },
        outcome: l(
          'The crew rests. Less activity means less CO₂, but everyone feels slow.',
          '大家減少活動。動得少、二氧化碳就少，但每個人都變得昏沉遲鈍。',
        ),
      },
      {
        id: 'filter',
        label: l('Change the filter by hand', '手動更換濾芯'),
        effects: { lifeSupport: 10, health: -6 },
        risk: { chance: 0.2, effects: { lifeSupport: -6, health: -6 } },
        outcome: l(
          'Silver opens the filter housing. It is a dusty, risky job.',
          '銀白打開濾芯外殼。這是個有粉塵、有風險的工作。',
        ),
      },
    ],
  },
  {
    id: 'S1',
    category: 'shield',
    cat: 'silver',
    minSol: 4,
    maxSol: 4,
    title: l('Solar Flare Warning', '太陽閃焰警報'),
    brief: l(
      'A strong {{solarFlare}} was detected on 14 May 2025. The light is already here; the particle cloud may follow.',
      '2025 年 5 月 14 日偵測到強烈 {{solarFlare}}。光已經到了，粒子雲可能隨後而來。',
    ),
    terms: ['solarFlare', 'radiationShielding'],
    source: DONKI_SOURCE,
    choices: [
      {
        id: 'shield-up',
        label: l('Thicken the shield', '替防護外牆加厚'),
        effects: { power: -20, shield: 25 },
        knowledgeCard: 'solarFlare',
        outcome: l(
          'The crew adds mass to the shelter wall. Power drops; shielding rises.',
          '大家替避難艙外牆加厚。電力下降，但防護力提升了。',
        ),
      },
      {
        id: 'shelter',
        label: l('Shelter the crew', '全員進避難艙'),
        effects: { food: -1, health: 5 },
        outcome: l(
          'Everyone waits in the shelter. A meal is skipped, but no one is exposed.',
          '大家躲進避難艙。少吃一餐，但沒有人暴露在外。',
        ),
      },
      {
        id: 'keep-generating',
        label: l('Keep generating', '硬撐繼續發電'),
        effects: { power: 18, shield: -14, health: -6 },
        outcome: l(
          'The panels keep charging. The crew stays out longer than it should.',
          '太陽能板繼續充電，但大家在外暴露的時間超過了安全時限。',
        ),
      },
    ],
  },
  {
    id: 'S2',
    category: 'shield',
    cat: 'shadow',
    minSol: 2,
    maxSol: 6,
    title: l('Micrometeorite Breach', '微隕石擊穿外牆'),
    brief: l(
      'A {{micrometeorite}} punched through the outer shielding. The {{radiationShielding}} layer is thinner now.',
      '{{micrometeorite}} 打穿外層遮蔽，{{radiationShielding}} 變薄了。',
    ),
    terms: ['micrometeorite', 'radiationShielding'],
    source: {
      name: 'NASA — Impact Protection',
      url: 'https://www.nasa.gov/impact-protection-2/',
    },
    when: (ctx) =>
      (ctx.resources.shield < 60 || ctx.flags.s1Resolved) && ctx.resources.shield < 80,
    choices: [
      {
        id: 'patch',
        label: l('Patch the hull', '修補外殼'),
        effects: { power: -6, shield: 10 },
        knowledgeCard: 'micrometeorite',
        outcome: l(
          'Shadow patches the hole. The shield is intact again.',
          '暗影補好破洞，遮蔽層恢復完整。',
        ),
      },
      {
        id: 'seal',
        label: l('Seal and depressurize', '封艙減壓'),
        effects: { lifeSupport: -6, shield: 6 },
        outcome: l(
          'The damaged section is sealed off. Air is lost, but the crew is safe.',
          '受損艙段被封住。空氣流失，但船員安全。',
        ),
      },
      {
        id: 'monitor',
        label: l('Monitor first', '先監測'),
        effects: { power: -2, science: 2 },
        risk: { chance: 0.25, effects: { power: -2, shield: -15, science: 2 } },
        outcome: l(
          'The crew watches the breach. Maybe it will hold.',
          '船員先觀察破洞。也許它撐得住。',
        ),
      },
    ],
  },
  {
    id: 'S3',
    category: 'shield',
    cat: 'silver',
    minSol: 3,
    maxSol: 5,
    title: l('Shelter Inspection', '避難艙檢查'),
    brief: l(
      '{{radiation}} levels are up. Check the shelter before the next flare.',
      '{{radiation}}升高了，在下次閃焰來襲前先檢查避難艙。',
    ),
    terms: ['radiation', 'radiationShielding'],
    source: {
      name: 'NASA — Real Martians: How to Protect Astronauts from Space Radiation on Mars',
      url: 'https://science.nasa.gov/resource/real-martians-how-to-protect-astronauts-from-space-radiation-on-mars/',
    },
    when: (ctx) =>
      ctx.flags.flareForecast && ctx.resources.shield < 75,
    choices: [
      {
        id: 'full-check',
        label: l('Full inspection', '完整檢查'),
        effects: { power: -8, shield: 12, health: 2 },
        knowledgeCard: 'radiation',
        outcome: l(
          'Silver checks every seam. The shelter is ready.',
          '銀白檢查每一道接縫，避難艙準備好了。',
        ),
      },
      {
        id: 'key-points',
        label: l('Check key points', '只查重點'),
        effects: { power: -2, shield: 6 },
        risk: { chance: 0.2, effects: { power: -2, shield: -6 } },
        outcome: l(
          'Silver checks the main seals. The rest will have to wait.',
          '銀白檢查主要接縫，其餘的只能再等。',
        ),
      },
      {
        id: 'skip',
        label: l('Skip it', '跳過'),
        effects: { power: 6, shield: -10 },
        outcome: l(
          'The crew saves power and skips the check. The shelter stays as it is.',
          '船員省下電力、跳過檢查。避難艙維持原樣。',
        ),
      },
    ],
  },
  {
    id: 'F1',
    category: 'food',
    cat: 'ginger',
    minSol: 3,
    maxSol: 7,
    title: l('Greenhouse Tomato Harvest', '溫室番茄豐收'),
    brief: l(
      'The first tomatoes are ripe. Ginger has been waiting all week.',
      '第一批番茄紅了。金桔等了一整個星期。',
    ),
    terms: ['greenhouse'],
    source: {
      name: 'NASA — Growing Plants in Space',
      url: 'https://science.nasa.gov/biological-physical/the-challenges-of-growing-plants-in-space/',
    },
    when: (ctx) => ctx.resources.food <= 4,
    choices: [
      {
        id: 'harvest-all',
        label: l('Harvest everything', '全部收成'),
        effects: { power: -2, food: 3 },
        knowledgeCard: 'greenhouse',
        outcome: l(
          'Ginger fills the crates. NASA once found a “Martian flower” — it was a rock, not a plant. “These tomatoes will be real flowers.”',
          '金桔裝滿箱子。NASA 曾在火星找到一朵「花」——那是岩石，不是植物。「我們的番茄會是真的花。」',
        ),
      },
      {
        id: 'save-seeds',
        label: l('Save some seeds', '留種'),
        effects: { power: -2, food: 2, science: 1 },
        outcome: l(
          'A smaller harvest now, more tomatoes later. Ginger keeps the best seeds.',
          '這次收得少，之後會有更多番茄。金桔留下最好的種子。',
        ),
      },
      {
        id: 'party',
        label: l('Throw a party', '開派對'),
        effects: { food: -1, health: 10 },
        outcome: l(
          'The crew shares a fresh meal. Morale and health rise.',
          '船員一起吃了新鮮的一餐，健康和士氣都上升。',
        ),
      },
    ],
  },
  {
    id: 'F3',
    category: 'food',
    cat: 'ginger',
    minSol: 2,
    maxSol: 6,
    title: l('Supply Crate Delayed', '補給箱延誤'),
    brief: l(
      'The supply crate is late. {{commsDelay}} means Earth cannot fix it in real time.',
      '補給箱延誤了。{{commsDelay}} 讓地球無法即時處理。',
    ),
    terms: ['commsDelay'],
    source: {
      name: 'NASA — Mars Relay Network',
      url: 'https://science.nasa.gov/mars/mars-relay-network/',
    },
    when: (ctx) =>
      (ctx.resources.food <= 4 || ctx.flags.commsWindow) && ctx.resources.food < 5,
    choices: [
      {
        id: 'ration',
        label: l('Ration the food', '配給'),
        effects: { food: 1, health: -3 },
        knowledgeCard: 'commsDelay',
        outcome: l(
          'Everyone gets a smaller portion. The crate may arrive tomorrow.',
          '定量配給 — 大家的份量都縮水了。補給箱也許明天就會到。',
        ),
      },
      {
        id: 'stores',
        label: l('Open the emergency stores', '吃庫存'),
        effects: { power: -4, food: 2, health: 1 },
        outcome: l(
          'The crew opens the emergency stores. It costs power to move the crates.',
          '船員打開緊急庫存。搬箱子花掉一些電力。',
        ),
      },
      {
        id: 'rover',
        label: l('Send the rover', '派探測車取貨'),
        effects: { power: -12, food: 4, health: -4 },
        outcome: l(
          'The rover brings the crate back. The trip is long and tiring.',
          '探測車把補給箱載回來。這趟路又長又累。',
        ),
      },
    ],
  },
  {
    id: 'C1',
    category: 'comms',
    cat: 'shadow',
    minSol: 3,
    maxSol: 5,
    title: l('Call from Earth', '地球來電'),
    brief: l(
      '{{commsDelay}} is 14 minutes today. Earth’s reply will take a while.',
      '今天的 {{commsDelay}} 是 14 分鐘，地球的回覆還得等上一陣子。',
    ),
    terms: ['commsDelay'],
    source: {
      name: 'NASA — Mars Relay Network',
      url: 'https://science.nasa.gov/mars/mars-relay-network/',
    },
    when: (ctx) => ctx.flags.commsWindow,
    choices: [
      {
        id: 'wait',
        label: l('Wait for Earth', '等地球回覆'),
        effects: { food: -1, science: 1 },
        outcome: l(
          'The crew waits. Earth’s answer arrives, but a meal is missed.',
          '船員等待。地球的回覆到了，但少吃一餐。',
        ),
      },
      {
        id: 'relay',
        label: l('Relay through the rover', '派探測車中繼'),
        effects: { power: -6, science: 3 },
        knowledgeCard: 'commsDelay',
        outcome: l(
          'The rover relays the signal. The link is faster, but it costs power.',
          '探測車轉傳訊號。連線變快，但花掉電力。',
        ),
      },
      {
        id: 'decide',
        label: l('Decide ourselves', '自己決定'),
        effects: { health: -2, science: 1 },
        risk: { chance: 0.3, effects: { health: -6, science: 1 } },
        outcome: l(
          'The crew acts without waiting. Sometimes that is the right call.',
          '大家不等了，直接行動。有時候當機立斷才是對的。',
        ),
      },
    ],
  },
  {
    id: 'SC2',
    category: 'science',
    cat: 'silver',
    minSol: 2,
    maxSol: 6,
    title: l('Subsurface Ice Survey', '地下冰探測'),
    brief: l(
      'The rover found a signal. Could it be {{subsurfaceIce}}?',
      '探測車找到訊號。會是 {{subsurfaceIce}} 嗎？',
    ),
    terms: ['subsurfaceIce'],
    source: {
      name: 'NASA — Mars Odyssey Science Highlights',
      url: 'https://science.nasa.gov/mission/odyssey/science-highlights/',
    },
    // Keep the survey visible until the three-star line is already in hand.
    // With the old < 4 gate the biggest science card vanished exactly when a
    // strong run needed it least, making 3 stars a draw lottery.
    when: (ctx) => ctx.resources.science < STAR_3_SCIENCE,
    choices: [
      {
        id: 'drill',
        label: l('Drill a sample', '鑽探'),
        effects: { power: -10, lifeSupport: 2, science: 4 },
        knowledgeCard: 'subsurfaceIce',
        outcome: l(
          'The drill brings up icy soil. The science team is thrilled.',
          '鑽頭帶回含冰的土壤。科學團隊很興奮。',
        ),
      },
      {
        id: 'radar',
        label: l('Scan with radar', '雷達掃描'),
        effects: { power: -6, science: 2 },
        outcome: l(
          'The radar maps a bright layer below the surface. No drilling needed.',
          '雷達探測到地表下有明顯的反射層，不需要鑽探了。',
        ),
      },
      {
        id: 'mark',
        label: l('Mark the site', '標記位置'),
        effects: { power: 2, health: -2, science: 1 },
        outcome: l(
          'The crew marks the site for later. The walk is tiring.',
          '船員標記位置，留待之後再來。這趟路很累。',
        ),
      },
    ],
  },
];

export const EVENT_BY_ID = new Map(
  [TUTORIAL_CARD, ...EVENT_CARDS].map((card) => [card.id, card]),
);

export const MVP_EVENT_COUNT = EVENT_CARDS.length;
