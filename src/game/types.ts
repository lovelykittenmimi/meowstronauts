export type Lang = 'en' | 'zh-TW';

export type Localized = Record<Lang, string>;

export type ResourceKey =
  | 'power'
  | 'lifeSupport'
  | 'shield'
  | 'food'
  | 'health'
  | 'science';

export type Resources = Record<ResourceKey, number>;

export type CatId = 'silver' | 'shadow' | 'ginger';

export type CardCategory =
  | 'power'
  | 'lifeSupport'
  | 'shield'
  | 'food'
  | 'comms'
  | 'science'
  | 'morale';

export type Difficulty = 'cadet' | 'officer' | 'ace';

export type Phase =
  | 'title'
  | 'briefing'
  | 'choice'
  | 'result'
  | 'report'
  | 'gameover';

export type EffectMap = Partial<Record<ResourceKey, number>>;

export interface Risk {
  chance: number;
  effects: EffectMap;
  /** Shown when the roll fails; the success text is `Choice.outcome`. */
  outcome: Localized;
}

export interface Choice {
  id: string;
  label: Localized;
  effects: EffectMap;
  duration?: number;
  risk?: Risk;
  requires?: CatId;
  knowledgeCard?: string;
  outcome: Localized;
}

export interface DataSource {
  name: string;
  url: string;
  snapshot?: string;
  date?: string;
}

export interface WeatherDay {
  sol: number;
  terrestrialDate: string;
  maxTempC: number;
  minTempC: number;
  tags: string[];
}

export interface StoryFlags {
  crashDust: boolean;
  flareForecast: boolean;
  commsWindow: boolean;
  s1Resolved: boolean;
}

export interface ConditionContext {
  sol: number;
  resources: Resources;
  flags: StoryFlags;
  weather: WeatherDay;
}

export interface EventCard {
  id: string;
  category: CardCategory;
  cat: CatId;
  title: Localized;
  brief: Localized;
  terms?: string[];
  source?: DataSource;
  choices: Choice[];
  minSol: number;
  maxSol: number;
  when?: (ctx: ConditionContext) => boolean;
}

export interface StatusEffect {
  id: string;
  label: Localized;
  effects: EffectMap;
  remaining: number;
}

export interface HistoryEntry {
  sol: number;
  eventId: string;
  choiceId: string;
  effects: EffectMap;
  success: boolean;
}

export interface KnowledgeSource {
  id: string;
  label: string;
  url: string;
}

export interface KnowledgeCard {
  id: string;
  term: Localized;
  short: Localized;
  example: Localized;
  why: Localized;
  sources: KnowledgeSource[];
}

export interface GameState {
  sol: number;
  phase: Phase;
  resources: Resources;
  currentEventId?: string;
  catCharges: Record<CatId, number>;
  collectedCards: string[];
  newCards: string[];
  history: HistoryEntry[];
  statuses: StatusEffect[];
  flags: StoryFlags;
  weather: WeatherDay;
  lang: Lang;
  difficulty: Difficulty;
  seed: string;
  resourceHistory: Resources[];
  lastChoiceId?: string;
  lastSuccess?: boolean;
  lastEffects?: EffectMap;
  lastOutcome?: Localized;
  videoMode?: 's1' | 'report';
  emergencyUsed: boolean;
  /** True once the Sol 1 hop minigame has paid its once-per-mission bonus. */
  hopRewarded: boolean;
  /** True once the water & fuel factory has paid its once-per-mission bonus. */
  factoryRewarded: boolean;
}

export type GameAction =
  | { type: 'START_GAME'; difficulty: Difficulty; seed?: string }
  | { type: 'OPEN_EVENT'; eventId: string }
  | { type: 'CHOOSE'; choiceId: string; roll?: number }
  | { type: 'COLLECT_CARD'; cardId: string }
  | { type: 'USE_ASSIST'; cat: CatId; variant?: 'power' | 'food' | 'lifeSupport' }
  | { type: 'CONTINUE' }
  | { type: 'RESTART' }
  | { type: 'SET_LANG'; lang: Lang }
  | { type: 'COMPLETE_HOP'; samples: number }
  | { type: 'COMPLETE_FACTORY'; stations: number };
