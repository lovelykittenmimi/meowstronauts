import { useCallback, useEffect, useRef, useState } from 'react';
import glossaryData from '../../data/glossary.json';
import type { Lang, Localized } from '../../game/types';
import { dodgeT } from './game/i18n';
import {
  FIELD_HEIGHT,
  FIELD_WIDTH,
  READINGS_TO_COLLECT,
  ROVER_Y,
  createRun,
  tick,
  type DodgeRun,
} from './game/state';
import './styles.css';

interface GlossaryCard {
  id: string;
  term: Localized;
  short: Localized;
  why: Localized;
  sources: Array<{ id: string; label: string; url: string }>;
}

const GLOSSARY = glossaryData as unknown as Record<string, GlossaryCard>;
const KNOWLEDGE_IDS = ['dustDevil', 'dustStorm'] as const;
const ROCKS = [
  { x: 12, y: 72, size: 22 },
  { x: 78, y: 66, size: 18 },
  { x: 34, y: 84, size: 14 },
  { x: 63, y: 88, size: 24 },
  { x: 90, y: 38, size: 16 },
];

export interface DustDevilDodgeProps {
  lang: Lang;
  onExit: () => void;
  /** Test seam for deterministic component checks; the app does not pass it. */
  initialRun?: DodgeRun;
}

type DodgeStage = 'intro' | 'playing' | 'result';

const FRAME_MS = 16;

export default function DustDevilDodge({
  lang,
  onExit,
  initialRun,
}: DustDevilDodgeProps) {
  const [stage, setStage] = useState<DodgeStage>('intro');
  const [run, setRun] = useState<DodgeRun>(() => initialRun ?? createRun());
  const [announcement, setAnnouncement] = useState('');
  const [bumpFlash, setBumpFlash] = useState(false);

  const inputRef = useRef({ left: false, right: false });
  const propsRef = useRef({ lang, onExit });
  const previousCollected = useRef(run.collected);
  const previousBumps = useRef(run.bumps);
  const flashBumps = useRef(run.bumps);
  const bumpTimerRef = useRef<number | null>(null);

  useEffect(() => {
    propsRef.current = { lang, onExit };
  }, [lang, onExit]);

  const close = useCallback(() => {
    propsRef.current.onExit();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      const key = event.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') {
        inputRef.current.left = true;
        event.preventDefault();
      } else if (key === 'arrowright' || key === 'd') {
        inputRef.current.right = true;
        event.preventDefault();
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') inputRef.current.left = false;
      if (key === 'arrowright' || key === 'd') inputRef.current.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [close]);

  useEffect(() => {
    if (stage !== 'playing') return;
    const interval = window.setInterval(() => {
      setRun((current) => tick(current, FRAME_MS / 1000, inputRef.current));
    }, FRAME_MS);
    return () => window.clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (stage === 'playing' && run.complete) setStage('result');
  }, [run.complete, stage]);

  useEffect(() => {
    let message = '';
    if (run.bumps > previousBumps.current) {
      message = dodgeT(lang, 'bump');
    } else if (run.collected > previousCollected.current) {
      message = dodgeT(lang, 'collected');
    }
    previousBumps.current = run.bumps;
    previousCollected.current = run.collected;
    if (message && stage === 'playing') setAnnouncement(message);
  }, [run.bumps, run.collected, lang, stage]);

  useEffect(() => {
    if (run.bumps > flashBumps.current) {
      flashBumps.current = run.bumps;
      setBumpFlash(true);
      if (bumpTimerRef.current !== null) window.clearTimeout(bumpTimerRef.current);
      bumpTimerRef.current = window.setTimeout(() => {
        bumpTimerRef.current = null;
        setBumpFlash(false);
      }, 200);
    }
    return () => {
      if (bumpTimerRef.current !== null) {
        window.clearTimeout(bumpTimerRef.current);
        bumpTimerRef.current = null;
      }
    };
  }, [run.bumps]);

  const resetInput = () => {
    inputRef.current = { left: false, right: false };
  };

  const startGame = useCallback(() => {
    const next = initialRun ?? createRun();
    setRun(next);
    previousCollected.current = next.collected;
    previousBumps.current = next.bumps;
    flashBumps.current = next.bumps;
    setAnnouncement('');
    setBumpFlash(false);
    resetInput();
    setStage('playing');
  }, [initialRun]);

  const replay = useCallback(() => {
    const next = createRun();
    setRun(next);
    previousCollected.current = 0;
    previousBumps.current = 0;
    flashBumps.current = 0;
    setAnnouncement('');
    setBumpFlash(false);
    resetInput();
    setStage('playing');
  }, []);

  const setDirection = (direction: 'left' | 'right', pressed: boolean) => {
    inputRef.current = { ...inputRef.current, [direction]: pressed };
  };

  return (
    <div
      className="dodge-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={dodgeT(lang, 'title')}
      data-testid="dodge-game"
    >
      <div className="dodge-app">
        <header className="dodge-header">
          <div className="dodge-heading">
            <span className="dodge-eyebrow">{dodgeT(lang, 'eyebrow')}</span>
            <h2 className="dodge-title">{dodgeT(lang, 'title')}</h2>
          </div>
          {stage === 'playing' && (
            <div className="dodge-hud">
              <span>
                {dodgeT(lang, 'readingsLabel')}{' '}
                <strong data-testid="dodge-readings">
                  {run.collected}/{READINGS_TO_COLLECT}
                </strong>
              </span>
              <span>
                {dodgeT(lang, 'bumpsLabel')}{' '}
                <strong data-testid="dodge-bumps">{run.bumps}</strong>
              </span>
            </div>
          )}
          <button
            type="button"
            className="dodge-close"
            onClick={close}
            aria-label={dodgeT(lang, stage === 'intro' ? 'back' : 'close')}
            data-testid="dodge-close"
          >
            ✕
          </button>
        </header>

        {stage === 'intro' && (
          <div className="dodge-panel dodge-intro" data-testid="dodge-intro">
            <p className="dodge-kicker">{dodgeT(lang, 'introKicker')}</p>
            <h3 className="dodge-panel-title">{dodgeT(lang, 'title')}</h3>
            <p className="dodge-body">{dodgeT(lang, 'introBody')}</p>
            <p className="dodge-rule">{dodgeT(lang, 'introRule')}</p>
            <div className="dodge-actions">
              <button
                type="button"
                className="dodge-button dodge-primary"
                onClick={startGame}
                data-testid="dodge-start"
              >
                {dodgeT(lang, 'start')}
              </button>
              <button
                type="button"
                className="dodge-button"
                onClick={close}
                data-testid="dodge-back"
              >
                {dodgeT(lang, 'back')}
              </button>
            </div>
          </div>
        )}

        {stage === 'playing' && (
          <div className="dodge-stage">
            <div
              className={`dodge-field${bumpFlash ? ' is-bump' : ''}`}
              data-testid="dodge-field"
            >
              <div className="dodge-ground" aria-hidden="true" />
              {ROCKS.map((rock, index) => (
                <span
                  key={index}
                  className="dodge-rock"
                  aria-hidden="true"
                  style={{
                    left: `${rock.x}%`,
                    top: `${rock.y}%`,
                    width: `${rock.size}px`,
                    height: `${rock.size * 0.65}px`,
                  }}
                />
              ))}
              {run.readings.map((reading) => (
                <span
                  key={reading.id}
                  className="dodge-reading"
                  data-testid="dodge-reading"
                  aria-hidden="true"
                  style={{
                    left: `${(reading.x / FIELD_WIDTH) * 100}%`,
                    top: `${(reading.y / FIELD_HEIGHT) * 100}%`,
                  }}
                >
                  📡
                </span>
              ))}
              {run.devils.map((devil) => (
                <span
                  key={devil.id}
                  className="dodge-devil"
                  data-testid="dodge-devil"
                  aria-hidden="true"
                  style={{
                    left: `${(devil.x / FIELD_WIDTH) * 100}%`,
                    top: `${(devil.y / FIELD_HEIGHT) * 100}%`,
                  }}
                >
                  <span className="dodge-devil-icon">🌪️</span>
                </span>
              ))}
              <span
                className="dodge-rover"
                aria-hidden="true"
                style={{
                  left: `${(run.roverX / FIELD_WIDTH) * 100}%`,
                  top: `${(ROVER_Y / FIELD_HEIGHT) * 100}%`,
                }}
              >
                <svg viewBox="0 0 100 60" role="presentation">
                  <line x1="68" y1="18" x2="76" y2="5" stroke="#f7f3ea" strokeWidth="3" />
                  <circle cx="76" cy="5" r="3" fill="#e8a33d" />
                  <rect x="18" y="18" width="62" height="22" rx="8" fill="#dcece9" stroke="#172033" strokeWidth="3" />
                  <rect x="28" y="10" width="24" height="12" rx="4" fill="#4e8c8a" stroke="#172033" strokeWidth="2" />
                  <circle cx="20" cy="45" r="7" fill="#172033" />
                  <circle cx="32" cy="45" r="7" fill="#172033" />
                  <circle cx="44" cy="45" r="7" fill="#172033" />
                  <circle cx="56" cy="45" r="7" fill="#172033" />
                  <circle cx="68" cy="45" r="7" fill="#172033" />
                  <circle cx="80" cy="45" r="7" fill="#172033" />
                </svg>
              </span>
            </div>

            <div className="dodge-controls" aria-label={dodgeT(lang, 'title')}>
              <button
                type="button"
                className="dodge-control"
                aria-label={dodgeT(lang, 'moveLeft')}
                data-testid="dodge-left"
                onPointerDown={(event) => {
                  event.preventDefault();
                  setDirection('left', true);
                }}
                onPointerUp={() => setDirection('left', false)}
                onPointerLeave={() => setDirection('left', false)}
                onPointerCancel={() => setDirection('left', false)}
              >
                ◀
              </button>
              <button
                type="button"
                className="dodge-control"
                aria-label={dodgeT(lang, 'moveRight')}
                data-testid="dodge-right"
                onPointerDown={(event) => {
                  event.preventDefault();
                  setDirection('right', true);
                }}
                onPointerUp={() => setDirection('right', false)}
                onPointerLeave={() => setDirection('right', false)}
                onPointerCancel={() => setDirection('right', false)}
              >
                ▶
              </button>
            </div>
            <p className="dodge-sr-only" aria-live="polite">
              {announcement}
            </p>
          </div>
        )}

        {stage === 'result' && (
          <div className="dodge-panel dodge-result" data-testid="dodge-result">
            <h3 className="dodge-panel-title">{dodgeT(lang, 'resultTitle')}</h3>
            <p className="dodge-body">{dodgeT(lang, 'resultBody')}</p>
            <div className="dodge-result-stats">
              <p data-testid="dodge-result-readings">
                {dodgeT(lang, 'readingsLabel')} {run.collected}/
                {READINGS_TO_COLLECT}
              </p>
              <p className="dodge-bumps" data-testid="dodge-result-bumps">
                {dodgeT(lang, 'resultBumps', { count: run.bumps })}
              </p>
            </div>
            <h4 className="dodge-fact-title">{dodgeT(lang, 'knowledgeTitle')}</h4>
            <div className="dodge-facts">
              {KNOWLEDGE_IDS.map((id) => {
                const card = GLOSSARY[id];
                if (!card) return null;
                return (
                  <article className="dodge-fact" key={id} data-testid="dodge-fact">
                    <h5>{card.term[lang]}</h5>
                    <p>{card.short[lang]}</p>
                    <p>{card.why[lang]}</p>
                    <span className="dodge-source-label">
                      {dodgeT(lang, 'source')}
                    </span>
                    <ul>
                      {card.sources.map((source) => (
                        <li key={source.id}>
                          <a href={source.url} target="_blank" rel="noreferrer">
                            {source.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
            <div className="dodge-actions">
              <button
                type="button"
                className="dodge-button dodge-primary"
                onClick={replay}
                data-testid="dodge-replay"
              >
                {dodgeT(lang, 'replay')}
              </button>
              <button
                type="button"
                className="dodge-button"
                onClick={close}
                data-testid="dodge-exit"
              >
                {dodgeT(lang, 'back')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
