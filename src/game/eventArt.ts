import type { Localized } from './types';
import crash from '../assets/generated/scenes/06-crash.webp';
import baseExterior from '../assets/generated/scenes/07-base-exterior.webp';
import controlRoom from '../assets/generated/scenes/08-control-room.webp';
import greenhouse from '../assets/generated/scenes/09-greenhouse.webp';
import nightRepair from '../assets/generated/scenes/10-night-repair.webp';
import coldPatrol from '../assets/generated/scenes/11-cold-patrol.webp';
import silverHero from '../assets/generated/scenes/20-silver-hero.webp';
import shadowHero from '../assets/generated/scenes/21-shadow-hero.webp';
import gingerHero from '../assets/generated/scenes/22-ginger-hero.webp';
import silverWide from '../assets/generated/scenes/26-silver-wide.webp';
import shadowWide from '../assets/generated/scenes/27-shadow-wide.webp';
import gingerWide from '../assets/generated/scenes/28-ginger-wide.webp';

export interface EventArt {
  src: string;
  alt: Localized;
}

/**
 * Single swap point for event art. When cat-free backgrounds arrive, change
 * the `src` here only; no other file needs to know which image an event uses.
 * Alt text mirrors `src/assets/generated/manifest.json`.
 */
export const EVENT_ART: Record<string, EventArt> = {
  T1: {
    src: baseExterior,
    alt: {
      en: 'Exterior view of the Hope-1 Mars outpost with its dome, solar farm and rover.',
      'zh-TW': '希望一號火星基地外觀，含圓頂、太陽能陣列與探測車。',
    },
  },
  P1: {
    src: shadowWide,
    alt: {
      en: 'High-angle night shot of Shadow crossing a dark Martian plain.',
      'zh-TW': '高角度夜景：暗影穿越黑暗的火星平原。',
    },
  },
  P4: {
    src: coldPatrol,
    alt: {
      en: 'A rover crosses a frost-dusted Martian plain with Shadow and Ginger inside.',
      'zh-TW': '探測車駛過結霜的火星平原，暗影與金桔坐在車內。',
    },
  },
  L1: {
    src: nightRepair,
    alt: {
      en: 'Shadow repairs a solar panel at night while Silver watches and Ginger waits in the rover.',
      'zh-TW': '暗影在夜間維修太陽能板，銀白在下方守候，金桔在探測車內等待。',
    },
  },
  L2: {
    src: greenhouse,
    alt: {
      en: 'Ginger the orange cat among tomato seedlings in the greenhouse under pink grow lights.',
      'zh-TW': '橘貓金桔坐在溫室番茄幼苗間，頭頂是粉紫色植物燈。',
    },
  },
  L3: {
    src: controlRoom,
    alt: {
      en: 'The three cats inside a cozy Mars habitat control room with a holographic display.',
      'zh-TW': '三隻貓在溫暖的火星基地控制室裡，前方有全像顯示器。',
    },
  },
  S1: {
    src: silverHero,
    alt: {
      en: 'Low-angle hero shot of Silver standing on a rocky ledge at dawn.',
      'zh-TW': '銀白在黎明岩脊上的低角度英雄鏡。',
    },
  },
  S2: {
    src: crash,
    alt: {
      en: "The crew's spacecraft crashed nose-down across solar panels while the three cats climb out.",
      'zh-TW': '太空船機鼻朝下撞上太陽能板，三隻貓正從艙口爬出。',
    },
  },
  S3: {
    src: baseExterior,
    alt: {
      en: 'Exterior view of the Hope-1 Mars outpost with its dome, solar farm and rover.',
      'zh-TW': '希望一號火星基地外觀，含圓頂、太陽能陣列與探測車。',
    },
  },
  F1: {
    src: gingerWide,
    alt: {
      en: 'High-angle shot of Ginger among seedling trays in the greenhouse.',
      'zh-TW': '高角度俯視：金桔坐在溫室的幼苗盤之間。',
    },
  },
  F3: {
    src: gingerHero,
    alt: {
      en: 'Low-angle hero shot of Ginger on a rock at dawn beside a crate of tomatoes.',
      'zh-TW': '金桔在黎明岩石上與一箱番茄的低角度英雄鏡。',
    },
  },
  C1: {
    src: shadowHero,
    alt: {
      en: 'Low-angle hero shot of Shadow on a solar panel array at dusk.',
      'zh-TW': '暗影在黃昏太陽能陣列上的低角度英雄鏡。',
    },
  },
  SC2: {
    src: silverWide,
    alt: {
      en: 'High-angle wide shot of Silver alone on a frost-dusted Martian plain.',
      'zh-TW': '高角度遠景：銀白獨自站在結霜的火星平原。',
    },
  },
};

export function artForEvent(eventId: string): EventArt | undefined {
  return EVENT_ART[eventId];
}
