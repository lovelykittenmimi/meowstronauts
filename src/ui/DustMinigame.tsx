import { useState } from 'react';
import type { Lang } from '../game/types';
import { t } from '../i18n';
import { SceneStage } from './SceneStage';

/**
 * Dust patches over the solar array, in percent of the stage box. The panels
 * fill the lower half of the plate, so every patch sits between 55% and 80%
 * vertically — never in the sky.
 */
const SPOTS = [
  { x: 26, y: 72 },
  { x: 36, y: 60 },
  { x: 47, y: 70 },
  { x: 57, y: 57 },
  { x: 66, y: 66 },
  { x: 74, y: 78 },
];

interface DustMinigameProps {
  src: string;
  alt: string;
  /** The same place swept clean, shown once every patch is gone. */
  clearedSrc?: string;
  clearedAlt?: string;
  lang: Lang;
  onDone: () => void;
}

/**
 * A five-second beat before the dust card resolves: the player taps each dust
 * patch on the panels. Purely presentational — it never touches game state,
 * so the reducer, the balance sheet and the video contract are unchanged.
 */
export function DustMinigame({
  src,
  alt,
  clearedSrc,
  clearedAlt,
  lang,
  onDone,
}: DustMinigameProps) {
  const [cleared, setCleared] = useState<number[]>([]);
  const left = SPOTS.length - cleared.length;
  const sweptClean = left === 0 && Boolean(clearedSrc);

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
      <div className="dust-stage" data-testid="dust-stage" data-plate={sweptClean ? 'clean' : 'dusty'}>
        <SceneStage
          src={sweptClean && clearedSrc ? clearedSrc : src}
          alt={sweptClean && clearedAlt ? clearedAlt : alt}
        />
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
