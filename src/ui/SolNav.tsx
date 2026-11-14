import { MAX_SOL } from '../game/balance';
import type { Lang } from '../game/types';
import { t } from '../i18n';

interface SolNavProps {
  /** The sol the crew is on; anything later is still locked. */
  currentSol: number;
  /** The sol on screen right now — the current one or a finished one. */
  selectedSol: number;
  lang: Lang;
  onSelect: (sol: number) => void;
  /** Opens the landing mini-game; optional so a bare nav still works. */
  onLander?: () => void;
  /** Opens the Sol 1 low-gravity practice; omitted in video mode. */
  onHop?: () => void;
  /** Opens the Sol 7 space-food practice; omitted in video mode. */
  onFood?: () => void;
  /** Opens the radiation shelter drill; optional for the same reason. */
  onShelter?: () => void;
}

const SOLS = Array.from({ length: MAX_SOL }, (_, index) => index + 1);

/**
 * A row of Sol 1–7 buttons so the crew can look back at a finished day.
 * Sols the crew has not reached yet are disabled; switching back is a review
 * only, so it never changes the mission. The training games live at the end of
 * the same row, so practice is one tap away between sols.
 */
export function SolNav({
  currentSol,
  selectedSol,
  lang,
  onSelect,
  onLander,
  onHop,
  onFood,
  onShelter,
}: SolNavProps) {
  return (
    <nav className="sol-nav" aria-label={t(lang, 'solnav.aria')} data-testid="sol-nav">
      {SOLS.map((sol) => {
        const locked = sol > currentSol;
        return (
          <button
            key={sol}
            type="button"
            className="sol-nav-button"
            data-testid={`sol-nav-${sol}`}
            disabled={locked}
            aria-current={sol === selectedSol ? 'step' : undefined}
            title={locked ? t(lang, 'solnav.locked') : undefined}
            onClick={() => onSelect(sol)}
          >
            {t(lang, 'solnav.sol', { sol })}
          </button>
        );
      })}
      {onLander && (
        <button
          type="button"
          className="sol-nav-button sol-nav-lander"
          data-testid="lander-open"
          aria-label={t(lang, 'solnav.lander')}
          title={t(lang, 'solnav.lander')}
          onClick={onLander}
        >
          <span aria-hidden="true">🚀</span>
          <span className="sol-nav-label">{t(lang, 'solnav.lander')}</span>
        </button>
      )}
      {onHop && (
        <button
          type="button"
          className="sol-nav-button sol-nav-hop"
          data-testid="hop-open"
          aria-label={t(lang, 'solnav.hop')}
          title={t(lang, 'solnav.hop')}
          onClick={onHop}
        >
          <span aria-hidden="true">🦘</span>
          <span className="sol-nav-label">{t(lang, 'solnav.hop')}</span>
        </button>
      )}
      {onFood && (
        <button
          type="button"
          className="sol-nav-button sol-nav-food"
          data-testid="food-open"
          aria-label={t(lang, 'solnav.food')}
          title={t(lang, 'solnav.food')}
          onClick={onFood}
        >
          <span aria-hidden="true">🍽️</span>
          <span className="sol-nav-label">{t(lang, 'solnav.food')}</span>
        </button>
      )}
      {onShelter && (
        <button
          type="button"
          className="sol-nav-button sol-nav-shelter"
          data-testid="shelter-open"
          aria-label={t(lang, 'solnav.shelter')}
          title={t(lang, 'solnav.shelter')}
          onClick={onShelter}
        >
          <span aria-hidden="true">☢️</span>
          <span className="sol-nav-label">{t(lang, 'solnav.shelter')}</span>
        </button>
      )}
    </nav>
  );
}
