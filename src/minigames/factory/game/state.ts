import type { Localized } from '../../../game/types';

export type FactoryStationId = 'mine' | 'electrolysis' | 'scrubber' | 'reactor';

export interface FactoryStation {
  id: FactoryStationId;
  icon: string;
  title: Localized;
  goal: Localized;
  /** One or two short, source-backed facts. */
  facts: Localized[];
}

/**
 * Four stations, each built around a NASA fact. Sources live in
 * docs/data-sources.md §3.7; do not add a claim without a NASA page.
 */
export const FACTORY_STATIONS: ReadonlyArray<FactoryStation> = [
  {
    id: 'mine',
    icon: '⛏️',
    title: { en: 'Ice mine', 'zh-TW': '冰礦場' },
    goal: {
      en: 'Find the ice, then bake it in a sealed oven.',
      'zh-TW': '找到冰，放進密封烤箱加熱。',
    },
    facts: [
      {
        en: "NASA's Phoenix lander found water ice just below the surface. Mars air is very thin — less than 1% of Earth's pressure — so the oven is sealed.",
        'zh-TW':
          'NASA 的鳳凰號著陸器在火星表面下找到水冰。火星空氣非常稀薄，氣壓不到地球的 1%，所以烤箱要密封。',
      },
      {
        en: 'Phoenix also found a salt called perchlorate in the soil. The factory filters it out before the water goes to the crew.',
        'zh-TW':
          '鳳凰號也在土壤裡找到一種叫過氯酸鹽的鹽。工廠先把鹽濾掉，水才會送到船員那裡。',
      },
    ],
  },
  {
    id: 'electrolysis',
    icon: '⚡',
    title: { en: 'Electrolysis', 'zh-TW': '電解水' },
    goal: {
      en: 'Split the water, then send each gas to the right tank.',
      'zh-TW': '分解水，把兩種氣體送到正確的槽。',
    },
    facts: [
      {
        en: 'The ISS makes breathing oxygen by running electricity through water. The oxygen goes to the crew; the hydrogen is kept for the next step.',
        'zh-TW':
          '太空站用電流分解水，製造呼吸用的氧氣。氧氣給船員，氫氣留給下一步。',
      },
    ],
  },
  {
    id: 'scrubber',
    icon: '🫧',
    title: { en: 'CO₂ scrubber', 'zh-TW': '二氧化碳捕集器' },
    goal: {
      en: 'Tap the CO₂ molecules, then heat the zeolite filter.',
      'zh-TW': '點選二氧化碳分子，再加熱沸石濾材。',
    },
    facts: [
      {
        en: 'Mars air is about 95% carbon dioxide. The ISS uses reusable zeolite beds to catch CO₂, then heats them to release it.',
        'zh-TW':
          '火星空氣大約 95% 是二氧化碳。太空站用可重複使用的沸石床抓住二氧化碳，再加熱把它放出來。',
      },
    ],
  },
  {
    id: 'reactor',
    icon: '🔥',
    title: { en: 'Sabatier reactor', 'zh-TW': '薩巴提爾反應器' },
    goal: {
      en: 'React the gases, then collect both outputs.',
      'zh-TW': '讓氣體反應，收集兩種產物。',
    },
    facts: [
      {
        en: 'The ISS Sabatier reactor combines CO₂ with hydrogen to make methane and water. The ISS vents the methane; this factory saves it as fuel.',
        'zh-TW':
          '太空站的薩巴提爾反應器把二氧化碳和氫氣結合成甲烷和水。太空站把甲烷排掉；這座工廠把它存成燃料。',
      },
    ],
  },
];

export const FACTORY_WHY: Localized = {
  en: "NASA's SWIM map shows where subsurface water ice is buried. Future crews could use that ice for drinking water and rocket fuel.",
  'zh-TW':
    'NASA 的 SWIM 地圖顯示地下冰埋在哪裡。未來的船員可以用這些冰取得飲用水和火箭燃料。',
};

export const FACTORY_MOXIE: Localized = {
  en: "NASA's MOXIE also made oxygen from Mars air on Perseverance.",
  'zh-TW': 'NASA 的 MOXIE 也在毅力號上從火星空氣製造氧氣。',
};

export const DIG_SPOTS = [
  { id: 'alpha', label: 'A' },
  { id: 'beta', label: 'B' },
  { id: 'gamma', label: 'C' },
] as const;

export type DigSpotId = (typeof DIG_SPOTS)[number]['id'];

/** The only radar spot with the blue ice signal. */
export const ICE_SPOT: DigSpotId = 'beta';

export type OvenChoice = 'sealed' | 'open';

export interface AirMolecule {
  id: string;
  label: string;
}

/** Four CO₂ molecules plus two lookalikes; sample is not to scale. */
export const AIR_MOLECULES: ReadonlyArray<AirMolecule> = [
  { id: 'co2-1', label: 'CO₂' },
  { id: 'n2', label: 'N₂' },
  { id: 'co2-2', label: 'CO₂' },
  { id: 'ar', label: 'Ar' },
  { id: 'co2-3', label: 'CO₂' },
  { id: 'co2-4', label: 'CO₂' },
];

export const CO2_MOLECULE_IDS = [
  'co2-1',
  'co2-2',
  'co2-3',
  'co2-4',
] as const;

export function isCo2Molecule(id: string): boolean {
  return (CO2_MOLECULE_IDS as ReadonlyArray<string>).includes(id);
}

export interface MineStation {
  done: boolean;
  spot: DigSpotId | null;
  oven: OvenChoice | null;
}

export interface ElectrolysisStation {
  done: boolean;
  split: boolean;
  o2: boolean;
  h2: boolean;
}

export interface ScrubberStation {
  done: boolean;
  caught: string[];
  released: boolean;
}

export interface ReactorStation {
  done: boolean;
  reacted: boolean;
  methane: boolean;
  water: boolean;
}

export interface FactoryGame {
  started: boolean;
  stationIndex: number;
  completed: boolean;
  mine: MineStation;
  electrolysis: ElectrolysisStation;
  scrubber: ScrubberStation;
  reactor: ReactorStation;
}

export type FactoryAction =
  | { type: 'START' }
  | { type: 'DIG'; spot: DigSpotId }
  | { type: 'CHOOSE_OVEN'; oven: OvenChoice }
  | { type: 'BAKE' }
  | { type: 'SPLIT' }
  | { type: 'ROUTE_GAS'; gas: 'o2' | 'h2'; to: 'crew' | 'fuel' }
  | { type: 'CAPTURE'; molecule: string }
  | { type: 'HEAT_FILTER' }
  | { type: 'REACT' }
  | {
      type: 'COLLECT_OUTPUT';
      output: 'methane' | 'water';
      to: 'fuel' | 'water';
    }
  | { type: 'RESET' };

export function createFactoryGame(): FactoryGame {
  return {
    started: false,
    stationIndex: 0,
    completed: false,
    mine: { done: false, spot: null, oven: null },
    electrolysis: { done: false, split: false, o2: false, h2: false },
    scrubber: { done: false, caught: [], released: false },
    reactor: { done: false, reacted: false, methane: false, water: false },
  };
}

export function isFactoryComplete(game: FactoryGame): boolean {
  return (
    game.mine.done &&
    game.electrolysis.done &&
    game.scrubber.done &&
    game.reactor.done
  );
}

export function completedStationCount(game: FactoryGame): number {
  return [
    game.mine.done,
    game.electrolysis.done,
    game.scrubber.done,
    game.reactor.done,
  ].filter(Boolean).length;
}

function withCompletion(game: FactoryGame): FactoryGame {
  return { ...game, completed: isFactoryComplete(game) };
}

/**
 * Pure state transitions. Wrong taps return the same state: the UI uses that
 * to show a hint without ever blocking the player.
 */
export function applyFactoryAction(
  game: FactoryGame,
  action: FactoryAction,
): FactoryGame {
  if (action.type === 'RESET') return createFactoryGame();
  if (action.type === 'START') {
    return game.started ? game : { ...createFactoryGame(), started: true };
  }
  if (!game.started || game.completed) return game;

  switch (action.type) {
    case 'DIG': {
      if (game.stationIndex !== 0 || game.mine.done || game.mine.spot) {
        return game;
      }
      if (action.spot !== ICE_SPOT) return game;
      return { ...game, mine: { ...game.mine, spot: action.spot } };
    }

    case 'CHOOSE_OVEN': {
      if (
        game.stationIndex !== 0 ||
        game.mine.done ||
        game.mine.spot !== ICE_SPOT
      ) {
        return game;
      }
      return { ...game, mine: { ...game.mine, oven: action.oven } };
    }

    case 'BAKE': {
      if (
        game.stationIndex !== 0 ||
        game.mine.done ||
        game.mine.spot !== ICE_SPOT ||
        game.mine.oven !== 'sealed'
      ) {
        return game;
      }
      return withCompletion({
        ...game,
        stationIndex: 1,
        mine: { ...game.mine, done: true },
      });
    }

    case 'SPLIT': {
      if (
        game.stationIndex !== 1 ||
        game.electrolysis.done ||
        game.electrolysis.split
      ) {
        return game;
      }
      return {
        ...game,
        electrolysis: { ...game.electrolysis, split: true },
      };
    }

    case 'ROUTE_GAS': {
      if (
        game.stationIndex !== 1 ||
        game.electrolysis.done ||
        !game.electrolysis.split
      ) {
        return game;
      }
      const correct =
        (action.gas === 'o2' && action.to === 'crew') ||
        (action.gas === 'h2' && action.to === 'fuel');
      if (!correct) return game;

      const electrolysis = {
        ...game.electrolysis,
        [action.gas]: true,
      };
      if (electrolysis.o2 && electrolysis.h2) {
        return withCompletion({
          ...game,
          stationIndex: 2,
          electrolysis: { ...electrolysis, done: true },
        });
      }
      return { ...game, electrolysis };
    }

    case 'CAPTURE': {
      if (
        game.stationIndex !== 2 ||
        game.scrubber.done ||
        game.scrubber.released
      ) {
        return game;
      }
      if (!isCo2Molecule(action.molecule)) return game;
      if (game.scrubber.caught.includes(action.molecule)) return game;
      return {
        ...game,
        scrubber: {
          ...game.scrubber,
          caught: [...game.scrubber.caught, action.molecule],
        },
      };
    }

    case 'HEAT_FILTER': {
      if (
        game.stationIndex !== 2 ||
        game.scrubber.done ||
        game.scrubber.caught.length < CO2_MOLECULE_IDS.length
      ) {
        return game;
      }
      return withCompletion({
        ...game,
        stationIndex: 3,
        scrubber: { ...game.scrubber, released: true, done: true },
      });
    }

    case 'REACT': {
      if (
        game.stationIndex !== 3 ||
        game.reactor.done ||
        game.reactor.reacted
      ) {
        return game;
      }
      return { ...game, reactor: { ...game.reactor, reacted: true } };
    }

    case 'COLLECT_OUTPUT': {
      if (
        game.stationIndex !== 3 ||
        game.reactor.done ||
        !game.reactor.reacted
      ) {
        return game;
      }
      const correct =
        (action.output === 'methane' && action.to === 'fuel') ||
        (action.output === 'water' && action.to === 'water');
      if (!correct) return game;

      const reactor = {
        ...game.reactor,
        [action.output]: true,
      };
      if (reactor.methane && reactor.water) {
        // Keep the last station on screen; the component waits a moment,
        // then shows the result.
        return withCompletion({
          ...game,
          reactor: { ...reactor, done: true },
        });
      }
      return { ...game, reactor };
    }

    default:
      return game;
  }
}
