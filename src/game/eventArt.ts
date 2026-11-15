import type { Localized } from './types';
import keyArt from '../assets/generated/scenes/01-keyart.webp';
import controlRoom from '../assets/generated/scenes/08-control-room.webp';
import controlRoomEmpty from '../assets/generated/scenes/08-control-room-nocat.webp';
import greenhouseEmpty from '../assets/generated/scenes/09-greenhouse-nocat.webp';
import coldPatrolEmpty from '../assets/generated/scenes/11-cold-patrol-nocar.webp';
import shadowHero from '../assets/generated/scenes/21-shadow-hero.webp';
import shadowHeroEmpty from '../assets/generated/scenes/21-shadow-hero-nocat.webp';
import shadowHeroSwept from '../assets/generated/scenes/21-shadow-hero-nocat-clean.webp';
import meteoriteBreach from '../assets/generated/scenes/31-meteorite-breach.webp';
import oxygenUnit from '../assets/generated/scenes/32-oxygen-unit.webp';
import shelterDoor from '../assets/generated/scenes/33-shelter-door.webp';
import waterLine from '../assets/generated/scenes/34-water-line.webp';
import supplyCrate from '../assets/generated/scenes/35-supply-crate.webp';
import co2Scrubber from '../assets/generated/scenes/36-co2-scrubber.webp';
import co2ScrubberEmpty from '../assets/generated/scenes/36-co2-scrubber-nocat.webp';
import nightDust from '../assets/generated/scenes/37-night-dust.webp';
import nightDustEmpty from '../assets/generated/scenes/37-night-dust-nocat.webp';
import coldWeek from '../assets/generated/scenes/38-cold-week.webp';
import coldWeekEmpty from '../assets/generated/scenes/38-cold-week-nocat.webp';
import earthCall from '../assets/generated/scenes/39-earth-call.webp';
import earthCallEmpty from '../assets/generated/scenes/39-earth-call-nocat.webp';
import iceSurvey from '../assets/generated/scenes/40-ice-survey.webp';
import iceSurveyEmpty from '../assets/generated/scenes/40-ice-survey-nocat.webp';
import waterRecycling from '../assets/generated/scenes/41-water-recycling.webp';
import dishForecast from '../assets/generated/scenes/42-dish-forecast.webp';
import tomatoHarvest from '../assets/generated/scenes/43-tomato-harvest.webp';

export interface EventArt {
  src: string;
  /**
   * Cat-free plate of the same place, used by the daily briefing. The card
   * itself shows `src` with the crew in frame; the briefing sets the scene
   * before the crew steps in.
   */
  briefingSrc?: string;
  /** Alt text for `briefingSrc`; `alt` describes the card picture instead. */
  briefingAlt?: Localized;
  /**
   * Dust-sweeping beat. Starts on the cat-free dusty plate; once every patch
   * is cleared it swaps to the same place swept clean.
   */
  sweep?: {
    src: string;
    alt: Localized;
    clearedSrc: string;
    clearedAlt: Localized;
  };
  alt: Localized;
}

/**
 * Single swap point for event art. When cat-free backgrounds arrive, change
 * the `src` here only; no other file needs to know which image an event uses.
 * Alt text must describe the picture that is actually imported above.
 *
 * Rule: the picture has to show what the card is about. The captain's log has
 * its own fixed picture per sol (`SOL_BRIEF_ART`), so the briefing matches the
 * brief text even when the day's event is about something else. `briefingSrc`
 * stays as the event's crew-free plate for that fallback path. The 06 crash
 * art belongs to the opening, never to a later sol.
 */
export const EVENT_ART: Record<string, EventArt> = {
  // T1 — "crash dust covers part of the array; Shadow is outside with a brush."
  // The dust minigame draws its patches on this same picture.
  T1: {
    src: shadowHero,
    briefingSrc: shadowHeroEmpty,
    briefingAlt: {
      en: 'The solar panel array at dusk with dust on the panels and the outpost dome behind, no crew in frame.',
      'zh-TW': '黃昏的太陽能陣列，板面覆著沙塵，背後是基地圓頂，畫面中沒有貓。',
    },
    sweep: {
      src: shadowHeroEmpty,
      alt: {
        en: 'Dust on the solar panels with the outpost dome behind, no crew in frame.',
        'zh-TW': '太陽能板積著沙塵，背後是基地圓頂，畫面中沒有貓。',
      },
      clearedSrc: shadowHeroSwept,
      clearedAlt: {
        en: 'The solar panels swept clean at dusk with the outpost dome behind, no crew in frame.',
        'zh-TW': '黃昏時清理乾淨的太陽能板，背後是基地圓頂，畫面中沒有貓。',
      },
    },
    alt: {
      en: 'Shadow in a dark suit standing on dusty solar panels at dusk, the outpost dome behind him.',
      'zh-TW': '暗影穿著深色太空衣站在積塵的太陽能板上，背後是基地圓頂。',
    },
  },
  // P1 — the dust settles again later in the week. This night shot of the
  // same array keeps it distinct from the Sol 1 tutorial; the sweeping beat
  // still reuses the Sol 1 array plates: same array, same job.
  P1: {
    src: nightDust,
    briefingSrc: nightDustEmpty,
    briefingAlt: {
      en: 'A dust-covered solar panel array under the night sky, lit by a portable lamp, the outpost dome glowing in the distance and an empty rover parked nearby; no crew.',
      'zh-TW': '星空下積滿沙塵的太陽能陣列，行動燈具照亮板面，遠處基地圓頂亮著，旁邊停著一輛空著的探測車；畫面中沒有貓。',
    },
    sweep: {
      src: shadowHeroEmpty,
      alt: {
        en: 'Dust on the solar panels with the outpost dome behind, no crew in frame.',
        'zh-TW': '太陽能板積著沙塵，背後是基地圓頂，畫面中沒有貓。',
      },
      clearedSrc: shadowHeroSwept,
      clearedAlt: {
        en: 'The solar panels swept clean at dusk with the outpost dome behind, no crew in frame.',
        'zh-TW': '黃昏時清理乾淨的太陽能板，背後是基地圓頂，畫面中沒有貓。',
      },
    },
    alt: {
      en: 'Shadow stands on a dust-covered solar panel at night, visor scanning the glass, while Silver watches from the ground and Ginger waits inside the rover.',
      'zh-TW': '夜裡，暗影站在積滿沙塵的太陽能板上，護目鏡掃描著板面；銀白在下方地面守候，金桔坐在探測車裡等待。',
    },
  },
  // P4 — the cold week; the habitat wrapped up warm while frost covers the ground.
  P4: {
    src: coldWeek,
    briefingSrc: coldWeekEmpty,
    briefingAlt: {
      en: 'The habitat module at dusk with frost on the ground and its quilted insulation panel, warm light and an orange heater vent glowing; no crew in frame.',
      'zh-TW': '黃昏的基地艙體，地面結霜，外牆貼著菱格保溫板，窗內暖光與橙色暖氣口亮著，畫面中沒有貓。',
    },
    alt: {
      en: 'Ginger lies inside the habitat window beside a glowing heater, while frost covers the ground and the insulated outer wall at dusk.',
      'zh-TW': '金桔趴在艙窗內的暖氣旁，窗外地面與保溫外牆結著霜，天色是黃昏。',
    },
  },
  // L1 — the oxygen unit fails at night; Shadow watches the drone repair it.
  L1: {
    src: oxygenUnit,
    alt: {
      en: 'At night the opened oxygen unit glows cyan while a small repair robot works on its pipes, amber status lights above, Shadow sitting beside it.',
      'zh-TW': '夜裡的基地內部，氧氣回收機的艙門打開、內部透著青光，小型維修機器人伸著工具手臂檢修管線，上方亮著橙色狀態燈，暗影坐在一旁看著。',
    },
  },
  // L2 — the water line clogs; Ginger works on it among the seedlings.
  L2: {
    src: waterLine,
    alt: {
      en: 'Ginger crouches by a dripping, corroded pipe joint in the greenhouse corridor while a robotic arm tightens the fitting and water falls into a metal bowl, pink grow lights and seedlings behind.',
      'zh-TW': '金桔蹲在溫室走道漏水、生鏽的水管接頭旁，機械臂正轉緊接頭，水滴落進下方的金屬盆，背後是粉紫植物燈與幼苗。',
    },
  },
  // L3 — CO₂ climbing; Silver at the open scrubber housing.
  L3: {
    src: co2Scrubber,
    briefingSrc: co2ScrubberEmpty,
    briefingAlt: {
      en: 'An empty life-support bay with a carbon-dioxide scrubber, its round filter housing open and a spare cartridge on the floor, bars and molecule symbols on the screen; no crew.',
      'zh-TW': '空無一貓的生命維持艙，二氧化碳洗滌器的圓形濾芯艙門敞開，地上放著備用濾芯，螢幕顯示濃度條與分子符號。',
    },
    alt: {
      en: 'Silver sits before an open carbon-dioxide scrubber with one front paw on a low control panel, a spare filter cartridge on the floor, its screen showing bars and molecule symbols.',
      'zh-TW': '銀白坐在敞開濾芯艙門的二氧化碳洗滌器前，前掌按著低矮的控制面板，地上放著備用濾芯，螢幕顯示濃度條與分子符號。',
    },
  },
  // S1 — flare warning; the wall display is the story here.
  S1: {
    src: controlRoom,
    briefingSrc: controlRoomEmpty,
    briefingAlt: {
      en: 'An empty habitat control room with a curved holographic display and a tomato crate.',
      'zh-TW': '空無一貓的基地控制室，有弧形全像顯示器與一箱番茄。',
    },
    alt: {
      en: 'The three cats in the control room beneath a wall display showing Mars weather and solar alert icons.',
      'zh-TW': '三隻貓在控制室裡，牆上大螢幕顯示火星天氣與太陽警示圖示。',
    },
  },
  // S2 — the breach is found while Shadow is outside at night.
  S2: {
    src: meteoriteBreach,
    alt: {
      en: 'At night Shadow in a dark suit inspects a fresh puncture in the habitat module, dust drifting from the hole while a small repair drone hovers and the base windows glow behind.',
      'zh-TW': '夜裡暗影穿著深色太空衣，檢查基地艙壁上新被擊穿的破洞，粉塵從洞口飄出，維修無人機浮在旁邊，背後的艙窗亮著燈。',
    },
  },
  // S3 — Silver checks the shelter before the next flare.
  S3: {
    src: shelterDoor,
    alt: {
      en: 'Silver in a white suit tests the green-lit control panel beside the shelter’s heavy round hatch, folded blankets and storage crates on the shelves around.',
      'zh-TW': '銀白穿著白色太空衣，用前掌按下避難艙厚重圓門旁亮著綠燈的控制面板，兩側架上放著毯子與收納箱。',
    },
  },
  // F1 — the tomato harvest. The card shows the payoff (vines heavy with
  // ripe tomatoes, crates overflowing); 09 stays the week's seedling corner
  // and remains Sol 7's captain's-log picture.
  F1: {
    src: tomatoHarvest,
    briefingSrc: greenhouseEmpty,
    briefingAlt: {
      en: 'An empty greenhouse with tomato seedlings, a robotic watering arm and a ripe tomato on the counter.',
      'zh-TW': '空無一貓的溫室，番茄幼苗、自動澆水臂與檯面上的一顆熟番茄。',
    },
    alt: {
      en: 'Ginger in a clear helmet stands beside wooden crates overflowing with ripe tomatoes, under vines heavy with red tomatoes and a few green ones, while a round window shows red Mars outside.',
      'zh-TW': '金桔戴著透明頭盔站在堆滿熟番茄的木箱旁，溫室藤架上掛滿紅番茄與幾顆綠番茄，圓窗外是紅色火星。',
    },
  },
  // F3 — the delayed crate; Ginger checks the cargo console by the empty cradle.
  F3: {
    src: supplyCrate,
    alt: {
      en: 'At golden hour Ginger taps the cargo console beside an empty supply cradle, stacked crates by the open hatch and a rover out on the plain behind.',
      'zh-TW': '黃昏時金桔按著貨運控制台，旁邊是空著的補給托架，敞開的艙口旁堆著補給箱，遠處平原上有一台探測車。',
    },
  },
  // C1 — the call from Earth; Shadow works the radio console in the comms bay.
  C1: {
    src: earthCall,
    briefingSrc: earthCallEmpty,
    briefingAlt: {
      en: 'The empty comms bay with a curved radio console and headphones, a screen linking Earth and Mars with a dashed signal arc, and the dish antenna through the round window; no crew.',
      'zh-TW': '空無一貓的通訊艙，弧形無線電台與耳機，螢幕上地球與火星由虛線訊號弧連著，圓窗外是碟型天線。',
    },
    alt: {
      en: 'Shadow in a black suit and blue visor reaches for a radio console in the comms bay, a screen showing Earth and Mars joined by a dashed signal arc, the dish antenna visible through the porthole.',
      'zh-TW': '暗影穿著黑色太空衣、戴著藍色護目鏡，伸手操作通訊艙的無線電台；螢幕上地球與火星之間有一條虛線訊號弧，圓窗外是碟型天線。',
    },
  },
  // SC2 — the ice survey; Silver reads the drill's scan at the borehole.
  SC2: {
    src: iceSurvey,
    briefingSrc: iceSurveyEmpty,
    briefingAlt: {
      en: "The rover's drill rests in a small borehole ringed with ice crystals on a frost-dusted plain, a scanner on the ground and fresh tracks curving back; no crew.",
      'zh-TW': '探測車的鑽頭停在小鑽孔裡，孔口周圍是冰晶，結霜平原上留著車轍，地上放著掃描器，畫面中沒有貓。',
    },
    alt: {
      en: "Silver crouches beside a rover's lowered drill at a small borehole ringed with ice crystals, one paw on a scanner, the rover screen showing a bright layer below the ground.",
      'zh-TW': '銀白蹲在探測車降下的鑽頭旁，小鑽孔周圍散著冰晶，前掌按著掃描器，車上螢幕顯示地表下的亮層。',
    },
  },
};

export function artForEvent(eventId: string): EventArt | undefined {
  return EVENT_ART[eventId];
}

export interface SolBriefArt {
  src: string;
  alt: Localized;
}

/**
 * The captain's log text is fixed per sol, so its picture is fixed too. Before
 * this map the briefing borrowed the day's event art, which meant Sol 2's dust
 * devil text could sit on a scrubber photo. Event art stays event-only; the
 * log gets one scene per sol that matches what the log actually says.
 */
export const SOL_BRIEF_ART: Record<number, SolBriefArt> = {
  1: {
    src: keyArt,
    alt: {
      en: 'Three cat astronauts on a rocky Mars ridge at dawn, the lander and the Hope-1 outpost behind them.',
      'zh-TW': '三隻貓太空人黎明時站在火星岩脊上，背後是登陸艇與希望一號基地。',
    },
  },
  2: {
    src: coldPatrolEmpty,
    alt: {
      en: 'A frost-dusted Martian plain with fresh rover tracks and a thin dust devil at dawn; no rover in frame.',
      'zh-TW': '覆霜的火星平原，有新的探測車車轍與遠方細長塵捲風；畫面中沒有探測車。',
    },
  },
  3: {
    src: dishForecast,
    alt: {
      en: 'A dust-streaked dish antenna angled toward a low sun with a bright ring of light around it, solar panels and the outpost dome behind.',
      'zh-TW': '佈滿沙塵的碟型天線朝向低垂的太陽，太陽外有一圈亮光，背後是太陽能板與基地圓頂。',
    },
  },
  4: {
    src: controlRoomEmpty,
    alt: {
      en: 'An empty habitat control room with a curved holographic display and a tomato crate.',
      'zh-TW': '空無一貓的基地控制室，有弧形全像顯示器與一箱番茄。',
    },
  },
  5: {
    src: waterRecycling,
    alt: {
      en: 'Shadow, Silver and Ginger in the water recycling bay, watching water run through pipes and tanks while a closed-loop droplet diagram glows on the wall.',
      'zh-TW': '暗影、銀白與金桔在水回收艙裡，看著水在管路與儲水槽間流動，牆上的閉環水滴圖示亮著。',
    },
  },
  6: {
    src: earthCallEmpty,
    alt: {
      en: 'The empty comms bay with a curved radio console and headphones, a screen linking Earth and Mars with a dashed signal arc, and the dish antenna through the round window; no crew.',
      'zh-TW': '空無一貓的通訊艙，弧形無線電台與耳機，螢幕上地球與火星由虛線訊號弧連著，圓窗外是碟型天線。',
    },
  },
  7: {
    src: greenhouseEmpty,
    alt: {
      en: 'An empty greenhouse with tomato seedlings, a robotic watering arm and a ripe tomato on the counter.',
      'zh-TW': '空無一貓的溫室，番茄幼苗、自動澆水臂與檯面上的一顆熟番茄。',
    },
  },
};

export function briefArtForSol(sol: number): SolBriefArt | undefined {
  return SOL_BRIEF_ART[sol];
}

/**
 * The daily briefing previews the day's event: use the cat-free plate when
 * one exists, otherwise the card picture itself.
 */
export function briefingArtFor(
  eventId: string,
): { src: string; alt: Localized } | undefined {
  const art = EVENT_ART[eventId];
  if (!art) return undefined;
  return {
    src: art.briefingSrc ?? art.src,
    alt: art.briefingSrc ? art.briefingAlt ?? art.alt : art.alt,
  };
}
