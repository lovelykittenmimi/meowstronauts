import type { StringKey } from '../i18n';

/**
 * Every playable mini-game in one list. The Sol row, the captain's log and the
 * event cards all take their label, icon and colour class from here, so one
 * game always looks the same wherever its button appears. Colours live in
 * `styles.css` as `--mg-*` custom properties on `.minigame-<id>`.
 */
export type MinigameId =
  | 'lander'
  | 'hop'
  | 'dust'
  | 'dustdodge'
  | 'shelter'
  | 'hull'
  | 'factory'
  | 'signal'
  | 'food'
  | 'tomato'
  | 'match';

export interface MinigameMeta {
  id: MinigameId;
  /** Emoji on the button; the only label on the compact Sol row. */
  icon: string;
  /** i18n key of the name shown on the tooltip and to screen readers. */
  labelKey: StringKey;
}

/** Ordered the way the crew meets the games during the week. */
export const MINIGAMES: MinigameMeta[] = [
  { id: 'lander', icon: '🚀', labelKey: 'solnav.lander' },
  { id: 'hop', icon: '🦘', labelKey: 'solnav.hop' },
  { id: 'dust', icon: '🧹', labelKey: 'solnav.dust' },
  { id: 'dustdodge', icon: '🌪️', labelKey: 'solnav.dustdodge' },
  { id: 'shelter', icon: '☢️', labelKey: 'solnav.shelter' },
  { id: 'hull', icon: '🔧', labelKey: 'solnav.hull' },
  { id: 'factory', icon: '🏭', labelKey: 'solnav.factory' },
  { id: 'signal', icon: '📡', labelKey: 'solnav.signal' },
  { id: 'food', icon: '🍽️', labelKey: 'solnav.food' },
  { id: 'tomato', icon: '🍅', labelKey: 'solnav.tomato' },
  { id: 'match', icon: '🃏', labelKey: 'solnav.match' },
];

export const MINIGAME_BY_ID = Object.fromEntries(
  MINIGAMES.map((game) => [game.id, game]),
) as Record<MinigameId, MinigameMeta>;

/** Shared button classes: the colour is keyed to the game, not the place. */
export function minigameClass(id: MinigameId): string {
  return `minigame-button minigame-${id}`;
}
