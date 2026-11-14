import { useState } from 'react';
import type { Lang } from '../game/types';
import { t } from '../i18n';
import { SceneStage } from './SceneStage';

/** Dust patches over the solar array, in percent of the stage box. */
const SPOTS = [
  { x: 22, y: 34 },
  { x: 38, y: 58 },
  { x: 50, y: 30 },
  { x: 62, y: 60 },
  { x: 30, y: 70 },
  { x: 70, y: 38 },
];

interface DustMinigameProps {
  src: string;
  alt: string;
  lang: Lang;
  onDone: () => void;
}

/**
 * A five-second beat before the dust card resolves: the player taps each dust
 * patch on the panels. Purely presentational — it never touches game state,
 * so the reducer, the balance sheet and the video contract are unchanged.
 */
export function DustMinigame({ src, alt, lang, onDone }: DustMinigameProps) {
  const [cleared, setCleared] = useState<number[]>([]);
  const left = SPOTS.length - cleared.length;

  const clear = (index: number) => {
    if (cleared.includes(index)) return;
    const next = [...cleared, index];
    setCleared(next);
    if (next.length === SPOTS.length) {
      window.setTimeout(onDone, 600);
    }
  };

  return (
    <div className="dust-game" data-testid="dust-game">
      <div className="dust-stage">
        <SceneStage src={src} alt={alt} />
        {SPOTS.map((spot, index) =>
          cleared.includes(index) ? null : (
            <button
              key={index}
              type="button"
              className="dust-spot"
              data-testid="dust-spot"
              aria-label={t(lang, 'dust.hint')}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              onClick={() => clear(index)}
            />
          ),
        )}
      </div>
      <p className="dust-hint" data-testid="dust-hint">
        <strong>{t(lang, 'dust.title')}</strong>
        <span>{left > 0 ? t(lang, 'dust.hint') : t(lang, 'dust.done')}</span>
        {left > 0 && <span className="dust-left">{t(lang, 'dust.left', { count: left })}</span>}
      </p>
    </div>
  );
}
