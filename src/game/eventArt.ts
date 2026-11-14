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
import silverHero from '../assets/generated/scenes/20-silver-hero.webp';
import shadowHero from '../assets/generated/scenes/21-shadow-hero.webp';
import shadowHeroEmpty from '../assets/generated/scenes/21-shadow-hero-nocat.webp';
import gingerHero from '../assets/generated/scenes/22-ginger-hero.webp';
import silverWide from '../assets/generated/scenes/26-silver-wide.webp';
import shadowWide from '../assets/generated/scenes/27-shadow-wide.webp';
import gingerWide from '../assets/generated/scenes/28-ginger-wide.webp';

export interface EventArt {
  src: string;
  /** Cat-free plate of the same place, shown on the daily briefing. */
  briefingSrc?: string;
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
    alt: {
      en: 'Shadow in a dark suit standing on dusty solar panels at dusk, the outpost dome behind him.',
      'zh-TW': '暗影穿著深色太空衣站在積塵的太陽能板上，背後是基地圓頂。',
    },
  },
  // P1 — dust on the panels again; same array, same cat as T1.
  P1: {
    src: shadowHero,
    briefingSrc: shadowHeroEmpty,
    alt: {
      en: 'Shadow in a dark suit standing on dusty solar panels at dusk, the outpost dome behind him.',
      'zh-TW': '暗影穿著深色太空衣站在積塵的太陽能板上，背後是基地圓頂。',
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
  // L1 — the oxygen unit fails at night; Shadow does the repair.
  L1: {
    src: nightRepair,
    briefingSrc: nightRepairEmpty,
    alt: {
      en: 'At night Shadow works on the solar array while Silver waits below and Ginger sits in the rover, repair drones hovering.',
      'zh-TW': '夜裡暗影在太陽能陣列上維修，銀白在下方等待，金桔坐在探測車裡，維修無人機盤旋。',
    },
  },
  // L2 — the water line clogs; Ginger works on it among the seedlings.
  L2: {
    src: gingerWide,
    alt: {
      en: 'Ginger among seedling trays in the greenhouse under pink grow lights.',
      'zh-TW': '金桔坐在溫室的幼苗盤之間，頭頂是粉紫色植物燈。',
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
    src: shadowWide,
    alt: {
      en: 'Night shot of Shadow crossing the dark plain toward the lit outpost.',
      'zh-TW': '夜景：暗影穿越黑暗的火星平原，朝亮著燈的基地走去。',
    },
  },
  // S3 — Silver walks the outside of the shelter before the next flare.
  S3: {
    src: silverHero,
    alt: {
      en: 'Silver in a white suit walking a rocky ledge at dawn.',
      'zh-TW': '銀白穿著白色太空衣走在黎明的岩脊上。',
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
  // F3 — the delayed crate; Ginger is outside when the lander comes in.
  F3: {
    src: gingerHero,
    alt: {
      en: 'Ginger on a rock at dawn with a lander exhaust plume rising in the distance.',
      'zh-TW': '金桔站在黎明的岩石上，遠處升起著陸器的排氣煙柱。',
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
