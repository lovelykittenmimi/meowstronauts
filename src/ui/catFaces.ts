import type { CatId } from '../game/types';
import silverDetermined from '../assets/avatars/silver/avatar-silver-determined-400.webp';
import silverHappy from '../assets/avatars/silver/avatar-silver-happy-400.webp';
import silverWorried from '../assets/avatars/silver/avatar-silver-worried-400.webp';
import shadowDetermined from '../assets/avatars/shadow/avatar-shadow-determined-400.webp';
import shadowHappy from '../assets/avatars/shadow/avatar-shadow-happy-400.webp';
import shadowWorried from '../assets/avatars/shadow/avatar-shadow-worried-400.webp';
import gingerDetermined from '../assets/avatars/ginger/avatar-ginger-determined-400.webp';
import gingerHappy from '../assets/avatars/ginger/avatar-ginger-happy-400.webp';
import gingerWorried from '../assets/avatars/ginger/avatar-ginger-worried-400.webp';

export type FacePhase = 'choice' | 'success' | 'fail';

const FACES: Record<CatId, Record<FacePhase, string>> = {
  silver: { choice: silverDetermined, success: silverHappy, fail: silverWorried },
  shadow: { choice: shadowDetermined, success: shadowHappy, fail: shadowWorried },
  ginger: { choice: gingerDetermined, success: gingerHappy, fail: gingerWorried },
};

export function faceFor(cat: CatId, phase: FacePhase): string {
  return FACES[cat][phase];
}
