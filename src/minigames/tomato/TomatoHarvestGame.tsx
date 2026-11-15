import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../../game/types';
import type { TomatoDef } from './game/types';
import { GREEN_COUNT, RIPE_COUNT, TOMATOES } from './game/tomatoes';
import { t } from './game/i18n';
import background from './assets/greenhouse-harvest.webp';
import redTomato from './assets/tomato-red.webp';
import greenTomato from './assets/tomato-green.webp';

interface TomatoHarvestGameProps {
  initialLang?: Lang;
  sol?: number;
  onDone?: (completed: boolean) => void;
}

type HarvestStage = 'harvest' | 'result';

export default function TomatoHarvestGame({
  initialLang,
  sol = 7,
  onDone,
}: TomatoHarvestGameProps = {}) {
  const [lang, setLang] = useState<Lang>(() => initialLang ?? 'en');
  const [picked, setPicked] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [stage, setStage] = useState<HarvestStage>('harvest');

  const pickedRef = useRef<string[]>([]);
  const toastTimerRef = useRef<number | null>(null);
  const wrongTimerRef = useRef<number | null>(null);
  const resultTimerRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  useEffect(
    () => () => {
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
      if (wrongTimerRef.current !== null) window.clearTimeout(wrongTimerRef.current);
      if (resultTimerRef.current !== null) {
        window.clearTimeout(resultTimerRef.current);
      }
    },
    [],
  );

  const toggleLang = () => {
    setLang((value) => (value === 'en' ? 'zh-TW' : 'en'));
  };

  const pick = (tomato: TomatoDef) => {
    if (stage !== 'harvest' || pickedRef.current.includes(tomato.id)) return;

    if (!tomato.ripe) {
      setWrongId(tomato.id);
      setToast(t(lang, 'notYet'));
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
      if (wrongTimerRef.current !== null) window.clearTimeout(wrongTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => {
        toastTimerRef.current = null;
        setToast(null);
      }, 1400);
      wrongTimerRef.current = window.setTimeout(() => {
        wrongTimerRef.current = null;
        setWrongId(null);
      }, 520);
      return;
    }

    const next = [...pickedRef.current, tomato.id];
    pickedRef.current = next;
    setPicked(next);
    if (next.length === RIPE_COUNT) {
      resultTimerRef.current = window.setTimeout(() => {
        resultTimerRef.current = null;
        setStage('result');
      }, 650);
    }
  };

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone?.(true);
  };

  const skip = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone?.(false);
  };

  return (
    <div className="tomato-app" data-testid="tomato-game">
      <header className="tomato-header">
        <div className="tomato-heading">
          <p className="tomato-eyebrow">{t(lang, 'eyebrow', { sol })}</p>
          <h1>{t(lang, 'title')}</h1>
          <p className="tomato-instruction">{t(lang, 'instruction')}</p>
        </div>
        <div className="tomato-header-side">
          <p className="tomato-counter" aria-live="polite" data-testid="tomato-counter">
            {t(lang, 'crate', { picked: picked.length, total: RIPE_COUNT })}
          </p>
          <button
            type="button"
            className="tomato-text-button"
            data-testid="tomato-lang"
            onClick={toggleLang}
          >
            {t(lang, 'languageButton')}
          </button>
          <button
            type="button"
            className="tomato-skip"
            data-testid="tomato-skip"
            onClick={skip}
          >
            {t(lang, 'skip')}
          </button>
        </div>
      </header>

      <main
        className="tomato-stage"
        data-testid="tomato-stage"
        style={{ backgroundImage: `url(${background})` }}
      >
        {TOMATOES.map((tomato) => {
          if (picked.includes(tomato.id)) return null;
          return (
            <button
              key={tomato.id}
              type="button"
              className={`tomato ${tomato.ripe ? 'is-ripe' : 'is-green'} ${
                wrongId === tomato.id ? 'is-wrong' : ''
              }`}
              style={{
                left: `${tomato.x}%`,
                top: `${tomato.y}%`,
                width: `max(44px, ${tomato.size}%)`,
                transform: `translate(-50%, -50%) rotate(${tomato.rotation}deg)`,
              }}
              data-testid={`tomato-${tomato.id}`}
              aria-label={t(lang, tomato.ripe ? 'ripeLabel' : 'greenLabel')}
              onClick={() => pick(tomato)}
            >
              <img
                src={tomato.ripe ? redTomato : greenTomato}
                alt=""
                draggable={false}
              />
            </button>
          );
        })}

        {toast && (
          <p className="tomato-toast" role="status" data-testid="tomato-toast">
            {toast}
          </p>
        )}
      </main>

      <p className="tomato-credit">{t(lang, 'credit')}</p>

      {stage === 'result' && (
        <div className="tomato-result-backdrop" role="presentation">
          <section
            className="tomato-result"
            role="dialog"
            aria-modal="true"
            aria-label={t(lang, 'resultEyebrow')}
            data-testid="tomato-result"
          >
            <img className="result-tomato" src={redTomato} alt="" />
            <p className="tomato-eyebrow">{t(lang, 'resultEyebrow')}</p>
            <h2>{t(lang, 'resultTitle')}</h2>
            <p className="tomato-result-body">{t(lang, 'resultBody')}</p>
            <div className="tomato-result-stats" aria-hidden="true">
              <span>🍅 {RIPE_COUNT}</span>
              <span>🌱 {GREEN_COUNT}</span>
            </div>
            <button
              type="button"
              className="tomato-continue"
              data-testid="tomato-continue"
              onClick={finish}
            >
              {t(lang, 'continue')}
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
