import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang } from '../../game/types';
import { matchT } from './game/i18n';
import {
  MATCH_ROUNDS,
  MATCH_THEME_KEYS,
  advanceRound,
  createGame,
  glossaryCard,
  isGameComplete,
  isRoundComplete,
  resolveWrong,
  selectCard,
  themeKeyForRound,
  type MatchGame,
} from './game/state';
import './styles.css';

export interface KnowledgeMatchProps {
  lang: Lang;
  onExit: () => void;
}

type MatchStage = 'intro' | 'playing' | 'result';

const WRONG_MS = 250;
const ROUND_DELAY_MS = 800;
const ROUND_NOTICE_MS = 1600;

export default function KnowledgeMatch({
  lang,
  onExit,
}: KnowledgeMatchProps) {
  const [stage, setStage] = useState<MatchStage>('intro');
  const [game, setGame] = useState<MatchGame>(() => createGame());
  const [announcement, setAnnouncement] = useState('');
  const [roundNotice, setRoundNotice] = useState<string | null>(null);

  const propsRef = useRef({ lang, onExit });
  const wrongTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const noticeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    propsRef.current = { lang, onExit };
  }, [lang, onExit]);

  const clearTimers = useCallback(() => {
    if (wrongTimerRef.current !== null) {
      window.clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = null;
    }
    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
    if (noticeTimerRef.current !== null) {
      window.clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const close = useCallback(() => {
    propsRef.current.onExit();
  }, []);

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

  const showRoundNotice = useCallback((round: number) => {
    setRoundNotice(
      `${matchT(propsRef.current.lang, 'roundLabel', {
        round,
        total: MATCH_ROUNDS,
      })} · ${matchT(propsRef.current.lang, themeKeyForRound(round))}`,
    );
    if (noticeTimerRef.current !== null) {
      window.clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = window.setTimeout(() => {
      noticeTimerRef.current = null;
      setRoundNotice(null);
    }, ROUND_NOTICE_MS);
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    setGame(createGame());
    setStage('playing');
    setAnnouncement(matchT(propsRef.current.lang, 'introRule'));
    showRoundNotice(1);
  }, [clearTimers, showRoundNotice]);

  const handleCard = (index: number) => {
    if (stage !== 'playing') return;
    const next = selectCard(game, index);
    if (next === game) return;
    setGame(next);

    if (next.feedback === 'sameKind') {
      setAnnouncement(matchT(lang, 'sameKind'));
      return;
    }

    if (next.feedback === 'matched') {
      setAnnouncement(matchT(lang, 'matched'));
      if (isRoundComplete(next)) {
        setAnnouncement(
          matchT(lang, 'roundClear', { round: next.round }),
        );
        finishTimerRef.current = window.setTimeout(() => {
          finishTimerRef.current = null;
          if (isGameComplete(next)) {
            setStage('result');
            setRoundNotice(null);
            return;
          }
          const advanced = advanceRound(next);
          setGame(advanced);
          showRoundNotice(advanced.round);
        }, ROUND_DELAY_MS);
      }
      return;
    }

    if (next.resolving) {
      wrongTimerRef.current = window.setTimeout(() => {
        wrongTimerRef.current = null;
        setGame((current) => resolveWrong(current));
      }, WRONG_MS);
    }
  };

  const cardLabel = (termId: string, kind: 'term' | 'meaning') => {
    const card = glossaryCard(termId);
    if (!card) return '';
    return kind === 'term'
      ? `${matchT(lang, 'termTag')}: ${card.term[lang]}`
      : `${matchT(lang, 'meaningTag')}: ${card.short[lang]}`;
  };

  return (
    <div
      className="match-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={matchT(lang, 'title')}
      data-testid="match-game"
    >
      <div className="match-app">
        <header className="match-header">
          <div className="match-heading">
            <span className="match-eyebrow">{matchT(lang, 'eyebrow')}</span>
            <h2 className="match-title">{matchT(lang, 'title')}</h2>
          </div>
          {stage === 'playing' && (
            <div className="match-hud">
              <span data-testid="match-hud-round">
                {matchT(lang, 'roundLabel', {
                  round: game.round,
                  total: MATCH_ROUNDS,
                })}
              </span>
              <span aria-hidden="true">·</span>
              <span data-testid="match-hud-pairs">
                {matchT(lang, 'pairsLabel', {
                  done: game.matched.length,
                  total: 5,
                })}
              </span>
            </div>
          )}
          <button
            type="button"
            className="match-close"
            onClick={close}
            aria-label={matchT(lang, stage === 'intro' ? 'back' : 'close')}
            data-testid="match-close"
          >
            ✕
          </button>
        </header>

        {stage === 'intro' && (
          <div className="match-panel match-intro" data-testid="match-intro">
            <p className="match-kicker">{matchT(lang, 'introKicker')}</p>
            <h3 className="match-panel-title">{matchT(lang, 'title')}</h3>
            <p className="match-body">{matchT(lang, 'introBody')}</p>
            <p className="match-rule">{matchT(lang, 'introRule')}</p>
            <div className="match-actions">
              <button
                type="button"
                className="match-button match-primary"
                onClick={startGame}
                data-testid="match-start"
              >
                {matchT(lang, 'start')}
              </button>
              <button
                type="button"
                className="match-button"
                onClick={close}
                data-testid="match-back"
              >
                {matchT(lang, 'back')}
              </button>
            </div>
          </div>
        )}

        {stage === 'playing' && (
          <>
            <div
              className="match-board"
              role="group"
              aria-label={matchT(lang, 'title')}
              data-testid="match-board"
            >
              {game.cards.map((card, index) => {
                const cardData = glossaryCard(card.termId);
                if (!cardData) return null;
                const matched = game.matched.includes(card.termId);
                const selected = game.selected === index;
                const wrong = Boolean(game.wrongPair?.includes(index));
                const classes = ['match-card', `match-card-${card.kind}`];
                if (matched) classes.push('is-matched');
                if (selected) classes.push('is-selected');
                if (wrong) classes.push('is-wrong');
                return (
                  <button
                    type="button"
                    key={card.id}
                    className={classes.join(' ')}
                    aria-label={cardLabel(card.termId, card.kind)}
                    aria-disabled={matched}
                    onClick={() => handleCard(index)}
                    data-testid="match-card"
                    data-term={card.termId}
                    data-kind={card.kind}
                    data-state={matched ? 'matched' : 'open'}
                  >
                    <span className="match-card-tag">
                      {matchT(
                        lang,
                        card.kind === 'term' ? 'termTag' : 'meaningTag',
                      )}
                    </span>
                    <span className="match-card-copy">
                      {card.kind === 'term'
                        ? cardData.term[lang]
                        : cardData.short[lang]}
                    </span>
                    {matched && (
                      <span className="match-card-check" aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {game.feedback === 'sameKind' && (
              <p className="match-hint" data-testid="match-hint">
                {matchT(lang, 'sameKind')}
              </p>
            )}
            {roundNotice && (
              <p className="match-round-notice" aria-hidden="true">
                {roundNotice}
              </p>
            )}
            <p className="match-sr-only" aria-live="polite">
              {announcement}
            </p>
          </>
        )}

        {stage === 'result' && (
          <div className="match-panel match-result" data-testid="match-result">
            <h3 className="match-panel-title">
              {matchT(lang, 'resultTitle')}
            </h3>
            <p className="match-body">{matchT(lang, 'resultBody')}</p>
            <p className="match-wrong" data-testid="match-result-wrong">
              {matchT(lang, 'resultWrong', { count: game.wrong })}
            </p>
            <ul className="match-themes">
              {MATCH_THEME_KEYS.map((theme) => (
                <li key={theme}>{matchT(lang, theme)}</li>
              ))}
            </ul>
            <div className="match-actions">
              <button
                type="button"
                className="match-button match-primary"
                onClick={startGame}
                data-testid="match-replay"
              >
                {matchT(lang, 'replay')}
              </button>
              <button
                type="button"
                className="match-button"
                onClick={close}
                data-testid="match-exit"
              >
                {matchT(lang, 'back')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
