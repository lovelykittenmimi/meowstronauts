import type { CatId } from '../game/types';
import silverDetermined from '../assets/avatars/silver/avatar-silver-determined-400.webp';
import silverHappy from '../assets/avatars/silver/avatar-silver-happy-400.webp';
import silverNeutral from '../assets/avatars/silver/avatar-silver-neutral-400.webp';
import silverSleepy from '../assets/avatars/silver/avatar-silver-sleepy-400.webp';
import silverSurprised from '../assets/avatars/silver/avatar-silver-surprised-400.webp';
import silverWorried from '../assets/avatars/silver/avatar-silver-worried-400.webp';
import shadowDetermined from '../assets/avatars/shadow/avatar-shadow-determined-400.webp';
import shadowHappy from '../assets/avatars/shadow/avatar-shadow-happy-400.webp';
import shadowNeutral from '../assets/avatars/shadow/avatar-shadow-neutral-400.webp';
import shadowSleepy from '../assets/avatars/shadow/avatar-shadow-sleepy-400.webp';
import shadowSurprised from '../assets/avatars/shadow/avatar-shadow-surprised-400.webp';
import shadowWorried from '../assets/avatars/shadow/avatar-shadow-worried-400.webp';
import gingerDetermined from '../assets/avatars/ginger/avatar-ginger-determined-400.webp';
import gingerHappy from '../assets/avatars/ginger/avatar-ginger-happy-400.webp';
import gingerNeutral from '../assets/avatars/ginger/avatar-ginger-neutral-400.webp';
import gingerSleepy from '../assets/avatars/ginger/avatar-ginger-sleepy-400.webp';
import gingerSurprised from '../assets/avatars/ginger/avatar-ginger-surprised-400.webp';
import gingerWorried from '../assets/avatars/ginger/avatar-ginger-worried-400.webp';

export type FacePhase = 'choice' | 'success' | 'fail';

/** The six expressions the avatar sheets provide for every cat. */
export type FaceMood =
  | 'neutral'
  | 'happy'
  | 'worried'
  | 'determined'
  | 'sleepy'
  | 'surprised';

const FACES: Record<CatId, Record<FacePhase, string>> = {
  silver: { choice: silverDetermined, success: silverHappy, fail: silverWorried },
  shadow: { choice: shadowDetermined, success: shadowHappy, fail: shadowWorried },
  ginger: { choice: gingerDetermined, success: gingerHappy, fail: gingerWorried },
};

const MOODS: Record<CatId, Record<FaceMood, string>> = {
  silver: {
    neutral: silverNeutral,
    happy: silverHappy,
    worried: silverWorried,
    determined: silverDetermined,
    sleepy: silverSleepy,
    surprised: silverSurprised,
  },
  shadow: {
    neutral: shadowNeutral,
    happy: shadowHappy,
    worried: shadowWorried,
    determined: shadowDetermined,
    sleepy: shadowSleepy,
    surprised: shadowSurprised,
  },
  ginger: {
    neutral: gingerNeutral,
    happy: gingerHappy,
    worried: gingerWorried,
    determined: gingerDetermined,
    sleepy: gingerSleepy,
    surprised: gingerSurprised,
  },
};

export function faceFor(cat: CatId, phase: FacePhase): string {
  return FACES[cat][phase];
}

/** Face for a spoken line, chosen from the tone of that line. */
export function moodFace(cat: CatId, mood: FaceMood = 'neutral'): string {
  return MOODS[cat][mood];
}
