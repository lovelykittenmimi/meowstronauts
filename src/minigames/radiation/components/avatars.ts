import type { CatId } from '../../../game/types';
import silver from '../../../assets/avatars/silver/avatar-silver-determined-400.webp';
import shadow from '../../../assets/avatars/shadow/avatar-shadow-worried-400.webp';
import ginger from '../../../assets/avatars/ginger/avatar-ginger-surprised-400.webp';
import silverHelmet from '../../../assets/avatars/silver/avatar-silver-determined-helmet-400.webp';
import shadowHelmet from '../../../assets/avatars/shadow/avatar-shadow-worried-helmet-400.webp';
import gingerHelmet from '../../../assets/avatars/ginger/avatar-ginger-surprised-helmet-400.webp';

export const CAT_AVATAR: Record<CatId, string> = { silver, shadow, ginger };
export const CAT_HELMET: Record<CatId, string> = {
  silver: silverHelmet,
  shadow: shadowHelmet,
  ginger: gingerHelmet,
};
