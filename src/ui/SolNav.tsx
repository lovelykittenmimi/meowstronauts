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
}

const SOLS = Array.from({ length: MAX_SOL }, (_, index) => index + 1);

/**
 * A row of Sol 1–7 buttons so the crew can look back at a finished day.
 * Sols the crew has not reached yet are disabled; switching back is a review
 * only, so it never changes the mission.
 */
export function SolNav({ currentSol, selectedSol, lang, onSelect }: SolNavProps) {
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
    </nav>
  );
}
