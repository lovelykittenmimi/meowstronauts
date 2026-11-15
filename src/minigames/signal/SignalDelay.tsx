import { useCallback, useEffect, useRef, useState } from 'react';
import { getKnowledgeCard } from '../../game/knowledge';
import type { Lang } from '../../game/types';
import {
  SIGNAL_ROUNDS,
  advance,
  createGame,
  currentRound,
  hintFor,
  isComplete,
  isCorrect,
  optionsFor,
  recordAnswer,
  travelMs,
  type SignalAnswerId,
  type SignalGame,
  type SignalHintKey,
  type SignalOption,
} from './game/state';
import { signalT } from './game/i18n';
import './styles.css';

export interface SignalDelayProps {
  lang: Lang;
  onExit: () => void;
}

type SignalStage = 'intro' | 'playing' | 'result';
type RoundPhase = 'ask' | 'fly' | 'reply' | 'ready';

const TOTAL = SIGNAL_ROUNDS.length;

function optionLabel(lang: Lang, option: SignalOption): string {
  if (option.id === 'seconds') {
    return signalT(lang, 'optionSeconds', { minutes: option.minutes });
  }
  if (option.id === 'roundTrip') {
    return signalT(lang, 'optionRoundTrip', { minutes: option.minutes });
  }
  return signalT(lang, 'optionMinutes', { minutes: option.minutes });
}

export default function SignalDelay({ lang, onExit }: SignalDelayProps) {
  const [stage, setStage] = useState<SignalStage>('intro');
  const [game, setGame] = useState<SignalGame>(() => createGame());
  const [phase, setPhase] = useState<RoundPhase>('ask');
  const [picked, setPicked] = useState<SignalAnswerId | null>(null);
  const [hint, setHint] = useState<SignalHintKey | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const propsRef = useRef({ lang, onExit });
  const flyTimerRef = useRef<number | null>(null);
  const replyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    propsRef.current = { lang, onExit };
  }, [lang, onExit]);

  const clearTimers = useCallback(() => {
    if (flyTimerRef.current !== null) {
      window.clearTimeout(flyTimerRef.current);
      flyTimerRef.current = null;
    }
    if (replyTimerRef.current !== null) {
      window.clearTimeout(replyTimerRef.current);
      replyTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const close = useCallback(() => {
    clearTimers();
    propsRef.current.onExit();
  }, [clearTimers]);

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

  const start = useCallback(() => {
    clearTimers();
    setGame(createGame());
    setStage('playing');
    setPhase('ask');
    setPicked(null);
    setHint(null);
    setAnnouncement(
      signalT(propsRef.current.lang, 'question', {
        minutes: SIGNAL_ROUNDS[0].lightMinutes,
      }),
    );
  }, [clearTimers]);

  const answer = (id: SignalAnswerId) => {
    if (stage !== 'playing' || phase !== 'ask') return;
    const round = currentRound(game);
    if (!round) return;

    if (!isCorrect(id)) {
      setGame(recordAnswer(game, id));
      setPicked(id);
      const nextHint = hintFor(id);
      setHint(nextHint);
      if (nextHint) {
        setAnnouncement(signalT(propsRef.current.lang, nextHint));
      }
      return;
    }

    setPicked(id);
    setHint(null);
    setPhase('fly');
    setAnnouncement(signalT(propsRef.current.lang, 'sent'));

    const leg = travelMs(round.lightMinutes);
    flyTimerRef.current = window.setTimeout(() => {
      flyTimerRef.current = null;
      setPhase('reply');
      setAnnouncement(signalT(propsRef.current.lang, 'replyOnWay'));
      replyTimerRef.current = window.setTimeout(() => {
        replyTimerRef.current = null;
        setPhase('ready');
        setAnnouncement(signalT(propsRef.current.lang, 'replyReceived'));
      }, leg);
    }, leg);
  };

  const next = () => {
    if (phase !== 'ready') return;
    const advanced = advance(game);
    if (isComplete(advanced)) {
      setGame(advanced);
      setStage('result');
      setAnnouncement(signalT(propsRef.current.lang, 'resultTitle'));
      return;
    }
    setGame(advanced);
    setPhase('ask');
    setPicked(null);
    setHint(null);
    const round = currentRound(advanced);
    if (round) {
      setAnnouncement(
        signalT(propsRef.current.lang, 'question', {
          minutes: round.lightMinutes,
        }),
      );
    }
  };

  const round = stage === 'playing' ? currentRound(game) : undefined;
  const phaseText =
    phase === 'fly'
      ? signalT(lang, 'sent')
      : phase === 'reply'
        ? signalT(lang, 'replyOnWay')
        : phase === 'ready'
          ? signalT(lang, 'replyReceived')
          : null;

  return (
    <div
      className="signal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={signalT(lang, 'title')}
      data-testid="signal-game"
    >
      <div className="signal-app">
        <header className="signal-header">
          <div className="signal-heading">
            <span className="signal-eyebrow">{signalT(lang, 'eyebrow')}</span>
            <h2 className="signal-title">{signalT(lang, 'title')}</h2>
          </div>
          {stage === 'playing' && (
            <button
              type="button"
              className="signal-back-top"
              data-testid="signal-back"
              onClick={close}
            >
              {signalT(lang, 'back')}
            </button>
          )}
          <span className="signal-badge" data-testid="signal-hud-round">
            {stage === 'playing'
              ? signalT(lang, 'roundLabel', { round: game.round + 1, total: TOTAL })
              : `${TOTAL} ×`}
          </span>
          <button
            type="button"
            className="signal-close"
            onClick={close}
            aria-label={signalT(lang, stage === 'intro' ? 'back' : 'close')}
            data-testid="signal-close"
          >
            ✕
          </button>
        </header>

        <div className="signal-stage">
          {stage === 'playing' && round ? (
            <div className="signal-panel signal-play" data-testid="signal-play">
              <p className="signal-question" data-testid="signal-question">
                {signalT(lang, 'question', { minutes: round.lightMinutes })}
              </p>

              <div
                className="signal-console"
                data-testid="signal-console"
                data-phase={phase}
              >
                <span className="signal-planet">
                  <span aria-hidden="true">🔴</span>
                  <span>{signalT(lang, 'mars')}</span>
                </span>
                <div className="signal-path">
                  <span className="signal-path-line" aria-hidden="true" />
                  <span
                    className={`signal-dot signal-dot-${phase}`}
                    style={{ animationDuration: `${travelMs(round.lightMinutes)}ms` }}
                    aria-hidden="true"
                  />
                  {phaseText && (
                    <span className="signal-path-caption">{phaseText}</span>
                  )}
                </div>
                <span className="signal-planet">
                  <span aria-hidden="true">🌍</span>
                  <span>{signalT(lang, 'earth')}</span>
                </span>
              </div>
              <p className="signal-note">{signalT(lang, 'spedUp')}</p>

              <div className="signal-options">
                {optionsFor(round.lightMinutes, game.round).map((option) => {
                  const wrong = picked === option.id && !isCorrect(option.id);
                  const right = phase !== 'ask' && isCorrect(option.id);
                  const classes = ['signal-option'];
                  if (wrong) classes.push('signal-option-wrong');
                  if (right) classes.push('signal-option-correct');
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={classes.join(' ')}
                      data-testid="signal-option"
                      data-answer={option.id}
                      disabled={phase !== 'ask' || wrong}
                      onClick={() => answer(option.id)}
                    >
                      {optionLabel(lang, option)}
                    </button>
                  );
                })}
              </div>

              {hint && (
                <p className="signal-hint" data-testid="signal-hint">
                  {signalT(lang, hint)}
                </p>
              )}

              {phase === 'ready' && (
                <button
                  type="button"
                  className="signal-button signal-primary signal-next"
                  data-testid="signal-next"
                  onClick={next}
                >
                  {game.round === TOTAL - 1
                    ? signalT(lang, 'seeResult')
                    : signalT(lang, 'next')}
                </button>
              )}
            </div>
          ) : null}

          {stage === 'intro' ? (
            <div className="signal-panel signal-intro" data-testid="signal-intro">
              <div className="signal-intro-copy">
                <p className="signal-kicker">{signalT(lang, 'introKicker')}</p>
                <h3 className="signal-panel-title">{signalT(lang, 'title')}</h3>
                <p className="signal-body">{signalT(lang, 'introBody')}</p>
                <ul className="signal-facts">
                  <li>{signalT(lang, 'introRule')}</li>
                  <li>{signalT(lang, 'introFact')}</li>
                </ul>
              </div>
              <div className="signal-intro-art" aria-hidden="true">
                <span className="signal-intro-planet">🔴</span>
                <span className="signal-intro-line">📡 ··· ··· ···</span>
                <span className="signal-intro-planet">🌍</span>
              </div>
              <div className="signal-panel-actions">
                <button
                  type="button"
                  className="signal-button signal-primary"
                  onClick={start}
                  data-testid="signal-start"
                >
                  {signalT(lang, 'start')}
                </button>
                <button
                  type="button"
                  className="signal-button"
                  onClick={close}
                  data-testid="signal-exit"
                >
                  {signalT(lang, 'back')}
                </button>
              </div>
            </div>
          ) : null}

          {stage === 'result' ? (
            <div className="signal-panel signal-result" data-testid="signal-result">
              <div className="signal-result-body">
                <h3 className="signal-panel-title">
                  {signalT(lang, 'resultTitle')}
                </h3>
                <p className="signal-body">{signalT(lang, 'resultBody')}</p>
                <p className="signal-result-wrong" data-testid="signal-result-wrong">
                  {signalT(lang, 'resultWrong', { count: game.wrong })}
                </p>
                <h4 className="signal-fact-title">{signalT(lang, 'factTitle')}</h4>
                {(() => {
                  const card = getKnowledgeCard('commsDelay');
                  if (!card) return null;
                  return (
                    <>
                      <ul className="signal-facts signal-result-facts">
                        <li>
                          <strong>{card.term[lang]}</strong> — {card.short[lang]}
                        </li>
                        <li>{card.example[lang]}</li>
                        <li>{card.why[lang]}</li>
                      </ul>
                      <div className="signal-sources">
                        <span className="signal-sources-label">
                          {signalT(lang, 'sources')}
                        </span>
                        <ul>
                          {card.sources.map((source) => (
                            <li key={source.id}>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {source.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="signal-panel-actions">
                <button
                  type="button"
                  className="signal-button signal-primary"
                  onClick={start}
                  data-testid="signal-replay"
                >
                  {signalT(lang, 'replay')}
                </button>
                <button
                  type="button"
                  className="signal-button"
                  onClick={close}
                  data-testid="signal-exit"
                >
                  {signalT(lang, 'back')}
                </button>
              </div>
            </div>
          ) : null}

          <p className="signal-sr-only" aria-live="polite">
            {announcement}
          </p>
        </div>
      </div>
    </div>
  );
}
