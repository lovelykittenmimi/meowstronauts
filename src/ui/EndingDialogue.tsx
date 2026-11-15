import { useState } from 'react';
import type { Lang } from '../game/types';
import { CAT_NAMES } from '../i18n';
import { moodFace } from './catFaces';
import type { EndingLine } from './endingDialogues';
import { SceneStage } from './SceneStage';

interface EndingDialogueProps {
  lines: EndingLine[];
  lang: Lang;
  sceneSrc: string;
  sceneAlt: string;
  finishLabel: string;
  onDone: () => void;
  testId?: string;
}

/**
 * Epilogue presented like the opening: one line at a time, narration over the
 * picture, cat lines in the paper caption card, Skip always available.
 */
export function EndingDialogue({
  lines,
  lang,
  sceneSrc,
  sceneAlt,
  finishLabel,
  onDone,
  testId = 'ending-sequence',
}: EndingDialogueProps) {
  const [step, setStep] = useState(0);
  const line = lines[step];
  if (!line) return null;

  const isLast = step === lines.length - 1;
  const speaker =
    line.cat === 'narrator'
      ? lang === 'en' ? 'Narrator' : '旁白'
      : CAT_NAMES[line.cat][lang];

  const back = () => setStep((value) => Math.max(0, value - 1));
  const next = () => {
    if (isLast) onDone();
    else setStep((value) => value + 1);
  };

  return (
    <main className="ending-sequence" data-testid={testId}>
      <SceneStage src={sceneSrc} alt={sceneAlt} />

      <button
        type="button"
        className="ghost-button ending-skip"
        data-testid="ending-skip"
        onClick={onDone}
      >
        {lang === 'en' ? 'Skip' : '跳過'}
      </button>

      <div className="ending-progress" aria-hidden="true">
        {lines.map((_, index) => (
          <span key={index} className={index <= step ? 'is-on' : ''} />
        ))}
      </div>

      {line.cat === 'narrator' && (
        <div className="ending-narration" key={step} data-testid="ending-current">
          <p>{line.text[lang]}</p>
        </div>
      )}

      <section className="ending-caption" key={`card-${step}`}>
        {line.cat !== 'narrator' && (
          <div className="ending-cat-line" data-testid="ending-current">
            <img src={moodFace(line.cat, line.mood)} alt="" aria-hidden="true" />
            <div>
              <strong>{speaker}</strong>
              <p>{line.text[lang]}</p>
            </div>
          </div>
        )}

        <div className="ending-nav">
          <button
            type="button"
            className="ghost-button"
            data-testid="ending-back"
            onClick={back}
            disabled={step === 0}
          >
            {lang === 'en' ? 'Back' : '上一句'}
          </button>
          {isLast ? (
            <button
              type="button"
              className="primary-button"
              data-testid="ending-finish"
              onClick={onDone}
            >
              {finishLabel}
            </button>
          ) : (
            <button
              type="button"
              className="primary-button"
              data-testid="ending-next"
              onClick={next}
            >
              {lang === 'en' ? 'Next' : '下一句'}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
