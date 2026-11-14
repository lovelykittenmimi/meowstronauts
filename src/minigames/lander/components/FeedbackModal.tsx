import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import happyFace from '../../../assets/avatars/silver/avatar-silver-happy-400.webp';
import determinedFace from '../../../assets/avatars/silver/avatar-silver-determined-400.webp';
import { compassLabel, phaseName, t } from '../game/i18n';
import { formatKm } from '../game/physics';
import type { Feedback, Lang, WeatherPhase } from '../game/types';

interface FeedbackModalProps {
  lang: Lang;
  feedback: Feedback;
  phase: WeatherPhase;
  onRetry: () => void;
  onNextSol: () => void;
}

export default function FeedbackModal({ lang, feedback, phase, onRetry, onNextSol }: FeedbackModalProps) {
  const primaryRef = useRef<HTMLButtonElement>(null);
  const perfect = feedback.result === 'perfect';
  const title = perfect ? t(lang, 'perfectTitle') : t(lang, 'closeTitle');
  const body = perfect ? t(lang, 'perfectBody') : t(lang, 'closeBody');
  const face = perfect ? happyFace : determinedFace;

  useEffect(() => {
    primaryRef.current?.focus();
  }, []);

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="feedback-card" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
        {perfect && (
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 16 }, (_, index) => (
              <span
                key={index}
                style={
                  {
                    left: `${(index * 37) % 100}%`,
                    animationDelay: `${(index % 6) * 0.09}s`,
                    '--confetti-hue': `${(index * 47) % 360}`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        )}

        <div className={`result-face${perfect ? ' is-happy' : ''}`}>
          <img src={face} alt="" />
        </div>

        <p className="result-eyebrow">
          {t(lang, 'sol')} {feedback.sol} · {phaseName(lang, feedback.phase)}
        </p>
        <h2 id="feedback-title">{title}</h2>
        <p className="result-body">{body}</p>

        <dl className="result-stats">
          <div>
            <dt>{t(lang, 'distanceResult')}</dt>
            <dd>
              {formatKm(feedback.distanceKm)} {t(lang, 'km')}
            </dd>
          </div>
          <div>
            <dt>{t(lang, 'resultWind')}</dt>
            <dd>
              {feedback.windSpeedMs.toFixed(1)} {t(lang, 'mps')} · {compassLabel(lang, phase.windDirectionDeg)}
            </dd>
          </div>
        </dl>

        <div className="modal-actions">
          <button ref={primaryRef} type="button" className="primary-button" onClick={onRetry}>
            {t(lang, 'tryThisSol')}
          </button>
          <button type="button" className="ghost-button" onClick={onNextSol}>
            {t(lang, 'nextSol')}
          </button>
        </div>
      </div>
    </div>
  );
}
