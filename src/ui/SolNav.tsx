import { MAX_SOL } from '../game/balance';
import type { Lang } from '../game/types';
import { t } from '../i18n';
import { MINIGAMES, minigameClass, type MinigameId } from './minigameMeta';

interface SolNavProps {
  /** The sol the crew is on; anything later is still locked. */
  currentSol: number;
  /** The sol on screen right now — the current one or a finished one. */
  selectedSol: number;
  lang: Lang;
  onSelect: (sol: number) => void;
  /**
   * Opens any mini-game as practice. Omitted in video mode, which hides the
   * game buttons so a recording never wanders into one.
   */
  onMinigame?: (id: MinigameId) => void;
}

const SOLS = Array.from({ length: MAX_SOL }, (_, index) => index + 1);

/**
 * A row of Sol 1–7 buttons so the crew can look back at a finished day.
 * Sols the crew has not reached yet are disabled; switching back is a review
 * only, so it never changes the mission. Every mini-game also lives at the end
 * of the row. They are icon-only so all nine fit; the name appears on hover
 * and on keyboard focus, and screen readers get it from `aria-label`.
 */
export function SolNav({
  currentSol,
  selectedSol,
  lang,
  onSelect,
  onMinigame,
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
      {onMinigame &&
        MINIGAMES.map((game, index) => {
          const name = t(lang, game.labelKey);
          return (
            <button
              key={game.id}
              type="button"
              className={`sol-nav-game ${minigameClass(game.id)}${
                index === 0 ? ' sol-nav-games-start' : ''
              }`}
              data-testid={`${game.id}-open`}
              data-name={name}
              aria-label={name}
              onClick={() => onMinigame(game.id)}
            >
              <span aria-hidden="true">{game.icon}</span>
            </button>
          );
        })}
    </nav>
  );
}
