import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang } from '../../game/types';
import {
  FOOD_PAIRS,
  createGame,
  flipCard,
  isComplete,
  pairFor,
  resolveMismatch,
  type FoodGame,
} from './game/state';
import { foodT } from './game/i18n';
import './styles.css';

export interface SpaceFoodFlipProps {
  lang: Lang;
  onExit: () => void;
}

type FoodStage = 'intro' | 'playing' | 'result';

interface FoodResult {
  moves: number;
}

const MISMATCH_MS = 900;
const FINISH_DELAY_MS = 700;
const TOAST_MS = 3200;

const SOURCES = [
  {
    key: 'sourceFoodSystems',
    href: 'https://www.nasa.gov/directorates/esdmd/hhp/space-food-systems/',
  },
  {
    key: 'sourceNutrition',
    href: 'https://www.nasa.gov/reference/jsc-food-nutrition/',
  },
  {
    key: 'sourceVeggie',
    href: 'https://www.nasa.gov/blogs/spacestation/2015/08/10/cosmonauts-complete-russian-spacewalk/',
  },
  {
    key: 'sourceGrowing',
    href: 'https://science.nasa.gov/biological-physical/the-challenges-of-growing-plants-in-space/',
  },
] as const;

export default function SpaceFoodFlip({
  lang,
  onExit,
}: SpaceFoodFlipProps) {
  const [stage, setStage] = useState<FoodStage>('intro');
  const [game, setGame] = useState<FoodGame>(() => createGame());
  const [toast, setToast] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [result, setResult] = useState<FoodResult | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef({ lang, onExit });
  const mismatchTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    propsRef.current = { lang, onExit };
  }, [lang, onExit]);

  const clearTimers = useCallback(() => {
    if (mismatchTimerRef.current !== null) {
      window.clearTimeout(mismatchTimerRef.current);
      mismatchTimerRef.current = null;
    }
    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const close = useCallback(() => {
    propsRef.current.onExit();
  }, []);

  // Escape leaves the overlay, same as the hop minigame.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      toastTimerRef.current = null;
      setToast(null);
    }, TOAST_MS);
  }, []);

  const finish = useCallback((moves: number) => {
    setResult({ moves });
    setStage('result');
    setToast(null);
    setAnnouncement(foodT(propsRef.current.lang, 'allMatched'));
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    setGame(createGame());
    setResult(null);
    setToast(null);
    setStage('playing');
    setAnnouncement(foodT(propsRef.current.lang, 'flipHint'));
  }, [clearTimers]);

  useEffect(() => {
    if (stage === 'playing') {
      boardRef.current?.focus({ preventScroll: true });
    }
  }, [stage]);

  const handleCard = (index: number) => {
    if (stage !== 'playing') return;
    const next = flipCard(game, index);
    if (next === game) return;
    setGame(next);

    if (next.matched.length > game.matched.length) {
      const pair = pairFor(game.cards[index].pairId);
      const message = foodT(lang, 'matchToast', {
        fact: pair ? pair.fact[lang] : '',
      });
      showToast(message);
      setAnnouncement(message);

      if (isComplete(next)) {
        const moves = next.moves;
        finishTimerRef.current = window.setTimeout(() => {
          finishTimerRef.current = null;
          finish(moves);
        }, FINISH_DELAY_MS);
      }
      return;
    }

    if (next.resolving) {
      const message = foodT(lang, 'mismatchToast');
      showToast(message);
      setAnnouncement(message);
      if (mismatchTimerRef.current !== null) {
        window.clearTimeout(mismatchTimerRef.current);
      }
      mismatchTimerRef.current = window.setTimeout(() => {
        mismatchTimerRef.current = null;
        setGame((current) => resolveMismatch(current));
      }, MISMATCH_MS);
    }
  };

  return (
    <div
      className="food-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={foodT(lang, 'title')}
      data-testid="food-game"
    >
      <div className="food-app">
        <header className="food-header">
          <div className="food-heading">
            <span className="food-eyebrow">{foodT(lang, 'eyebrow')}</span>
            <h2 className="food-title">{foodT(lang, 'title')}</h2>
          </div>
          {stage === 'playing' && (
            <button
              type="button"
              className="food-back-top"
              data-testid="food-back"
              onClick={close}
            >
              {foodT(lang, 'back')}
            </button>
          )}
          <span className="food-badge">{`${FOOD_PAIRS.length} × 2`}</span>
          <button
            type="button"
            className="food-close"
            onClick={close}
            aria-label={foodT(lang, stage === 'intro' ? 'back' : 'close')}
            data-testid="food-close"
          >
            ✕
          </button>
        </header>

        <div className="food-stage">
          {stage === 'playing' ? (
            <>
              <div className="food-hud">
                <span className="food-hud-label">{foodT(lang, 'pairsLabel')}</span>
                <span className="food-hud-count" data-testid="food-hud-pairs">
                  {game.matched.length}/{FOOD_PAIRS.length}
                </span>
                <span className="food-hud-divider" aria-hidden="true">
                  ·
                </span>
                <span className="food-hud-label">{foodT(lang, 'movesLabel')}</span>
                <span className="food-hud-count" data-testid="food-hud-moves">
                  {game.moves}
                </span>
              </div>
              <div
                className="food-board"
                ref={boardRef}
                tabIndex={-1}
                role="group"
                aria-label={foodT(lang, 'title')}
                data-testid="food-board"
              >
                {game.cards.map((card, index) => {
                  const pair = pairFor(card.pairId);
                  if (!pair) return null;
                  const matched = game.matched.includes(card.pairId);
                  const faceUp = matched || game.flipped.includes(index);
                  const label = faceUp
                    ? card.kind === 'food'
                      ? foodT(lang, 'cardFoodAria', { name: pair.food[lang] })
                      : foodT(lang, 'cardFactAria', { fact: pair.fact[lang] })
                    : foodT(lang, 'cardHidden');
                  const classes = ['food-card'];
                  classes.push(
                    card.kind === 'food' ? 'food-card-food' : 'food-card-fact',
                  );
                  if (faceUp) classes.push('food-card-up');
                  if (matched) classes.push('food-card-matched');
                  return (
                    <button
                      key={card.id}
                      type="button"
                      className={classes.join(' ')}
                      aria-label={label}
                      aria-disabled={matched || game.resolving}
                      onClick={() => handleCard(index)}
                      data-testid="food-card"
                      data-pair={card.pairId}
                      data-kind={card.kind}
                      data-state={
                        matched ? 'matched' : faceUp ? 'up' : 'down'
                      }
                    >
                      {faceUp ? (
                        card.kind === 'food' ? (
                          <>
                            <span className="food-card-tag">
                              {foodT(lang, 'cardFoodTag')}
                            </span>
                            <span className="food-card-emoji" aria-hidden="true">
                              {pair.emoji}
                            </span>
                            <span className="food-card-name">
                              {pair.food[lang]}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="food-card-tag">
                              {foodT(lang, 'cardFactTag')}
                            </span>
                            <span className="food-card-fact">
                              {pair.fact[lang]}
                            </span>
                          </>
                        )
                      ) : (
                        <span className="food-card-back" aria-hidden="true">
                          📦
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="food-hint">{foodT(lang, 'flipHint')}</p>
            </>
          ) : null}

          {stage === 'intro' ? (
            <div className="food-panel food-intro" data-testid="food-intro">
              <div className="food-intro-copy">
                <p className="food-kicker">{foodT(lang, 'introKicker')}</p>
                <h3 className="food-panel-title">{foodT(lang, 'title')}</h3>
                <p className="food-body">{foodT(lang, 'introBody')}</p>
                <ul className="food-facts">
                  <li>{foodT(lang, 'introRuleMatch')}</li>
                  <li>{foodT(lang, 'introRuleMiss')}</li>
                </ul>
              </div>
              <div className="food-intro-art" aria-hidden="true">
                {FOOD_PAIRS.map((pair) => (
                  <span key={pair.id} className="food-intro-tile">
                    {pair.emoji}
                  </span>
                ))}
              </div>
              <div className="food-panel-actions">
                <button
                  type="button"
                  className="food-button food-primary"
                  onClick={startGame}
                  data-testid="food-start"
                >
                  {foodT(lang, 'start')}
                </button>
                <button
                  type="button"
                  className="food-button"
                  onClick={close}
                  data-testid="food-back"
                >
                  {foodT(lang, 'back')}
                </button>
              </div>
            </div>
          ) : null}

          {stage === 'result' && result ? (
            <div className="food-panel food-result" data-testid="food-result">
              <div className="food-result-body">
                <h3 className="food-panel-title">{foodT(lang, 'resultTitle')}</h3>
                <p className="food-body">{foodT(lang, 'resultBody')}</p>
                <div className="food-result-stats">
                  <div className="food-stat">
                    <span className="food-stat-value" data-testid="food-result-moves">
                      {result.moves}
                    </span>
                    <span className="food-stat-label">
                      {foodT(lang, 'resultMoves')}
                    </span>
                  </div>
                </div>
                <h4 className="food-fact-title">
                  {foodT(lang, 'factSectionTitle')}
                </h4>
                <ul className="food-facts food-result-facts">
                  {FOOD_PAIRS.map((pair) => (
                    <li key={pair.id} data-testid="food-fact-item">
                      <span aria-hidden="true">{pair.emoji}</span>{' '}
                      <strong>{pair.food[lang]}</strong> — {pair.fact[lang]}
                    </li>
                  ))}
                </ul>
                <div className="food-sources">
                  <span className="food-sources-label">
                    {foodT(lang, 'sources')}
                  </span>
                  <ul>
                    {SOURCES.map((source) => (
                      <li key={source.key}>
                        <a href={source.href} target="_blank" rel="noreferrer">
                          {foodT(lang, source.key)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="food-panel-actions">
                <button
                  type="button"
                  className="food-button food-primary"
                  onClick={startGame}
                  data-testid="food-replay"
                >
                  {foodT(lang, 'replay')}
                </button>
                <button
                  type="button"
                  className="food-button"
                  onClick={close}
                  data-testid="food-exit"
                >
                  {foodT(lang, 'back')}
                </button>
              </div>
            </div>
          ) : null}

          {toast ? (
            <p className="food-toast" aria-hidden="true">
              {toast}
            </p>
          ) : null}
          <p className="food-sr-only" aria-live="polite">
            {announcement}
          </p>
        </div>
      </div>
    </div>
  );
}
