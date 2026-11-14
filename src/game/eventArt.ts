import type { Localized } from './types';
import baseExterior from '../assets/generated/scenes/07-base-exterior.webp';
import controlRoom from '../assets/generated/scenes/08-control-room.webp';
import controlRoomEmpty from '../assets/generated/scenes/08-control-room-nocat.webp';
import greenhouse from '../assets/generated/scenes/09-greenhouse.webp';
import greenhouseEmpty from '../assets/generated/scenes/09-greenhouse-nocat.webp';
import nightRepair from '../assets/generated/scenes/10-night-repair.webp';
import nightRepairEmpty from '../assets/generated/scenes/10-night-repair-nocat.webp';
import coldPatrol from '../assets/generated/scenes/11-cold-patrol.webp';
import coldPatrolEmpty from '../assets/generated/scenes/11-cold-patrol-nocar.webp';
import debrief from '../assets/generated/scenes/12-debrief.webp';
import debriefEmpty from '../assets/generated/scenes/12-debrief-nocat.webp';
import shadowHero from '../assets/generated/scenes/21-shadow-hero.webp';
import shadowHeroEmpty from '../assets/generated/scenes/21-shadow-hero-nocat.webp';
import shadowHeroSwept from '../assets/generated/scenes/21-shadow-hero-nocat-clean.webp';
import silverWide from '../assets/generated/scenes/26-silver-wide.webp';
import meteoriteBreach from '../assets/generated/scenes/31-meteorite-breach.webp';
import oxygenUnit from '../assets/generated/scenes/32-oxygen-unit.webp';
import shelterDoor from '../assets/generated/scenes/33-shelter-door.webp';
import waterLine from '../assets/generated/scenes/34-water-line.webp';
import supplyCrate from '../assets/generated/scenes/35-supply-crate.webp';

export interface EventArt {
  src: string;
  /**
   * Cat-free plate of the same place. Kept for per-event briefing art; the
   * daily briefing currently shows the key art instead.
   */
  briefingSrc?: string;
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
 * Rule: the picture has to show what the card is about. The daily briefing
 * reuses this map, so the player sees the same scene on the briefing and on
 * the card that follows it. The 06 crash art belongs to the opening, never to
 * a later sol.
 */
export const EVENT_ART: Record<string, EventArt> = {
  // T1 — "crash dust covers part of the array; Shadow is outside with a brush."
  // The dust minigame draws its patches on this same picture.
  T1: {
    src: shadowHero,
    briefingSrc: shadowHeroEmpty,
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
  // P1 — the dust settles again later in the week. The card uses the night
  // repair scene so it cannot be mistaken for the Sol 1 tutorial, but the
  // sweeping beat still reuses the Sol 1 array plates: same array, same job.
  P1: {
    src: nightRepair,
    briefingSrc: nightRepairEmpty,
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
      en: 'Shadow repairs a solar panel at night while Silver watches and Ginger waits in the rover.',
      'zh-TW': '暗影在夜間維修太陽能板，銀白在下方守候，金桔在探測車內等待。',
    },
  },
  // P4 — the cold week; a rover out on the frost with a dust devil spinning.
  P4: {
    src: coldPatrol,
    briefingSrc: coldPatrolEmpty,
    alt: {
      en: 'Shadow drives a rover across a frost-dusted plain with Ginger beside him, a dust devil spinning in the distance.',
      'zh-TW': '暗影開著探測車載著金桔駛過結霜的平原，遠處有塵捲風。',
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
  // L3 — CO₂ climbing; the crew reads the levels off the display.
  L3: {
    src: debrief,
    briefingSrc: debriefEmpty,
    alt: {
      en: 'The three cats gathered around a glowing holographic display in the habitat.',
      'zh-TW': '三隻貓圍在基地裡發光的全像顯示器前。',
    },
  },
  // S1 — flare warning; the wall display is the story here.
  S1: {
    src: controlRoom,
    briefingSrc: controlRoomEmpty,
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
  // F1 — the tomato harvest.
  F1: {
    src: greenhouse,
    briefingSrc: greenhouseEmpty,
    alt: {
      en: 'Ginger beside a tomato plant and a watering arm in the greenhouse under pink grow lights.',
      'zh-TW': '金桔在溫室裡守著番茄植株與澆水機械臂，頭頂是粉紫色植物燈。',
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
  // C1 — the call from Earth; the outpost's dish is on the base.
  C1: {
    src: baseExterior,
    alt: {
      en: 'Exterior view of the Hope-1 Mars outpost with its dome, dish, solar farm and rover.',
      'zh-TW': '希望一號火星基地外觀，含圓頂、碟型天線、太陽能陣列與探測車。',
    },
  },
  // SC2 — the ice survey; Silver reads the plain.
  SC2: {
    src: silverWide,
    alt: {
      en: 'Wide shot of Silver walking a frost-dusted plain with the outpost on the horizon.',
      'zh-TW': '遠景：銀白走在結霜的平原上，基地出現在地平線。',
    },
  },
};

export function artForEvent(eventId: string): EventArt | undefined {
  return EVENT_ART[eventId];
}
