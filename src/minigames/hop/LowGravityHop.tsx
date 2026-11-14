import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { Lang } from '../../game/types';
import HopScene from './components/HopScene';
import { hopT } from './game/i18n';
import {
  cameraXFor,
  createWorld,
  stepWorld,
} from './game/physics';
import type { HopEvent, HopInput, HopWorld } from './game/types';
import './styles.css';

export interface LowGravityHopProps {
  lang: Lang;
  /** Whether this mission already paid the hop bonus. */
  rewarded: boolean;
  onComplete: (samples: number) => void;
  onExit: () => void;
}

type HopStage = 'intro' | 'playing' | 'result';

interface HopResult {
  samples: number;
  total: number;
  hits: number;
  earned: boolean;
  already: boolean;
}

const EMPTY_INPUT: HopInput = { left: false, right: false, jump: false };
const FIXED_STEP = 1 / 120;
const RENDER_INTERVAL_MS = 33;
const TOAST_MS = 3200;

const SOURCES = [
  {
    key: 'sourceGravity',
    href: 'https://spaceplace.nasa.gov/what-is-gravity/en/',
  },
  {
    key: 'sourceHematite',
    href: 'https://science.nasa.gov/resource/martian-blueberries-2/',
  },
  {
    key: 'sourceDust',
    href: 'https://science.nasa.gov/resource/dust-devils-on-mars/',
  },
] as const;

function mapKey(key: string): keyof HopInput | null {
  switch (key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return 'left';
    case 'ArrowRight':
    case 'd':
    case 'D':
      return 'right';
    case ' ':
    case 'Spacebar':
    case 'ArrowUp':
    case 'w':
    case 'W':
      return 'jump';
    default:
      return null;
  }
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest('button, a, input, select, textarea'));
}

function JumpArcChart({ lang }: { lang: Lang }) {
  return (
    <div className="hop-arc-wrap">
      <svg
        className="hop-arc"
        viewBox="0 0 320 168"
        role="img"
        aria-label={hopT(lang, 'jumpCompare')}
      >
        <line
          x1={16}
          y1={140}
          x2={304}
          y2={140}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeDasharray="5 7"
        />
        <path
          d="M20 140 Q85 66 150 140"
          fill="none"
          stroke="#cfd8e2"
          strokeWidth={3}
          strokeDasharray="7 6"
        />
        <circle cx={85} cy={103} r={4} fill="#cfd8e2" />
        <text x={85} y={156} textAnchor="middle" fill="currentColor" fontSize={11}>
          {hopT(lang, 'earthLabel')}
        </text>
        <path
          d="M170 140 Q235 4 300 140"
          fill="none"
          stroke="#e8a33d"
          strokeWidth={3}
          strokeDasharray="7 6"
        />
        <circle cx={235} cy={72} r={4.5} fill="#e8a33d" />
        <text x={235} y={156} textAnchor="middle" fill="currentColor" fontSize={11}>
          {hopT(lang, 'marsLabel')}
        </text>
      </svg>
      <p className="hop-arc-caption">{hopT(lang, 'jumpCompare')}</p>
    </div>
  );
}

export default function LowGravityHop({
  lang,
  rewarded,
  onComplete,
  onExit,
}: LowGravityHopProps) {
  const [stage, setStage] = useState<HopStage>('intro');
  const [world, setWorld] = useState<HopWorld>(() => createWorld());
  const [toast, setToast] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [result, setResult] = useState<HopResult | null>(null);

  const worldRef = useRef(world);
  const keysRef = useRef<HopInput>({ ...EMPTY_INPUT });
  const stageRef = useRef<HopStage>('intro');
  const gameRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<number | null>(null);
  const jumpTipRef = useRef(false);
  const slideTipRef = useRef(false);
  const earnedRef = useRef(false);
  const propsRef = useRef({ lang, rewarded, onComplete, onExit });

  useEffect(() => {
    propsRef.current = { lang, rewarded, onComplete, onExit };
  }, [lang, rewarded, onComplete, onExit]);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

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

  useEffect(
    () => () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    },
    [],
  );

  const close = useCallback(() => {
    keysRef.current = { ...EMPTY_INPUT };
    propsRef.current.onExit();
  }, []);

  // Keyboard: arrows / A-D to move, Space / W / up to hop, Escape to leave.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (stageRef.current !== 'playing') return;
      if (event.key === ' ' && isInteractiveTarget(event.target)) return;
      const key = mapKey(event.key);
      if (!key) return;
      event.preventDefault();
      keysRef.current = { ...keysRef.current, [key]: true };
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (stageRef.current !== 'playing') return;
      const key = mapKey(event.key);
      if (!key) return;
      keysRef.current = { ...keysRef.current, [key]: false };
    };
    const releaseAll = () => {
      keysRef.current = { ...EMPTY_INPUT };
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', releaseAll);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', releaseAll);
    };
  }, [close]);

  const startRun = useCallback(() => {
    const fresh = createWorld();
    worldRef.current = fresh;
    setWorld(fresh);
    setResult(null);
    setToast(null);
    setAnnouncement(hopT(propsRef.current.lang, 'introKicker'));
    jumpTipRef.current = false;
    slideTipRef.current = false;
    setStage('playing');
  }, []);

  useEffect(() => {
    if (stage === 'playing') {
      gameRef.current?.focus({ preventScroll: true });
    }
  }, [stage]);

  // Main loop: fixed physics steps, render at ~30 fps.
  useEffect(() => {
    if (stage !== 'playing') return;
    let frame = 0;
    let cancelled = false;
    let last = performance.now();
    let accumulator = 0;
    let lastRender = 0;
    const copyLang = propsRef.current.lang;

    const finishRun = (finalWorld: HopWorld) => {
      const perfect = finalWorld.collected >= finalWorld.samples.length;
      const already = propsRef.current.rewarded || earnedRef.current;
      const earned = perfect && !already;
      if (earned) earnedRef.current = true;
      setResult({
        samples: finalWorld.collected,
        total: finalWorld.samples.length,
        hits: finalWorld.hits,
        earned,
        already: perfect && !earned,
      });
      setStage('result');
      setToast(null);
      setAnnouncement(
        hopT(copyLang, perfect ? 'resultPerfect' : 'resultMadeIt'),
      );
      propsRef.current.onComplete(finalWorld.collected);
    };

    const drain = (events: HopEvent[]) => {
      for (const event of events) {
        if (event.type === 'sample') {
          const message =
            event.collected >= event.total
              ? hopT(copyLang, 'sampleAll')
              : hopT(copyLang, 'sampleFound', {
                  count: event.collected,
                  total: event.total,
                });
          showToast(message);
          setAnnouncement(message);
        } else if (event.type === 'devil') {
          const message = hopT(copyLang, 'hintDevil');
          showToast(message);
          setAnnouncement(message);
        }
      }
    };

    const tick = (now: number) => {
      if (cancelled) return;
      const delta = Math.min((now - last) / 1000, 0.25);
      last = now;
      accumulator = Math.min(accumulator + delta, 0.25);

      let next = worldRef.current;
      while (accumulator >= FIXED_STEP) {
        next = stepWorld(next, keysRef.current, FIXED_STEP);
        accumulator -= FIXED_STEP;
      }
      if (next.events.length > 0) {
        const events = next.events;
        next = { ...next, events: [] };
        drain(events);
      }
      worldRef.current = next;

      if (next.finished) {
        setWorld(next);
        finishRun(next);
        return;
      }

      if (!jumpTipRef.current && !next.player.grounded && next.player.vy < 0) {
        jumpTipRef.current = true;
        showToast(hopT(copyLang, 'hintJump'));
      }
      if (
        !slideTipRef.current &&
        next.player.grounded &&
        Math.abs(next.player.vx) > 80 &&
        !keysRef.current.left &&
        !keysRef.current.right
      ) {
        slideTipRef.current = true;
        showToast(hopT(copyLang, 'hintSlide'));
      }

      if (now - lastRender >= RENDER_INTERVAL_MS) {
        lastRender = now;
        setWorld(next);
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [stage, showToast]);

  const hold = (key: keyof HopInput) => ({
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      keysRef.current = { ...keysRef.current, [key]: true };
    },
    onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      keysRef.current = { ...keysRef.current, [key]: false };
    },
    onPointerCancel: () => {
      keysRef.current = { ...keysRef.current, [key]: false };
    },
    onLostPointerCapture: () => {
      keysRef.current = { ...keysRef.current, [key]: false };
    },
    onContextMenu: (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
  });

  const rewardLine = result
    ? result.earned
      ? hopT(lang, 'rewardEarned')
      : result.already || rewarded
        ? hopT(lang, 'rewardAlready')
        : hopT(lang, 'rewardHint')
    : '';

  return (
    <div
      className="hop-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={hopT(lang, 'title')}
      data-testid="hop-game"
    >
      <div className="hop-app">
        <header className="hop-header">
          <div className="hop-heading">
            <span className="hop-eyebrow">{hopT(lang, 'eyebrow')}</span>
            <h2 className="hop-title">{hopT(lang, 'title')}</h2>
          </div>
          <span className="hop-gravity-badge">{hopT(lang, 'gravityBadge')}</span>
          <button
            type="button"
            className="hop-close"
            onClick={close}
            aria-label={hopT(lang, stage === 'intro' ? 'back' : 'close')}
            data-testid="hop-close"
          >
            ✕
          </button>
        </header>

        <div className="hop-stage" ref={gameRef} tabIndex={-1}>
          <HopScene
            player={world.player}
            samples={world.samples}
            devils={world.devils}
            cameraX={cameraXFor(world.player.x)}
            lang={lang}
          />

          {stage === 'playing' ? (
            <>
              <div className="hop-hud">
                <span className="hop-hud-label">{hopT(lang, 'samples')}</span>
                <span className="hop-hud-count" data-testid="hop-hud-samples">
                  {world.collected}/{world.samples.length}
                </span>
                <span className="hop-dots" aria-hidden="true">
                  {world.samples.map((sample) => (
                    <span
                      key={sample.id}
                      className={sample.taken ? 'hop-dot hop-dot-on' : 'hop-dot'}
                    />
                  ))}
                </span>
              </div>
              <div className="hop-controls">
                <div className="hop-control-pair">
                  <button
                    type="button"
                    className="hop-control"
                    aria-label={hopT(lang, 'ariaLeft')}
                    data-testid="hop-left"
                    {...hold('left')}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="hop-control"
                    aria-label={hopT(lang, 'ariaRight')}
                    data-testid="hop-right"
                    {...hold('right')}
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  className="hop-control hop-jump"
                  aria-label={hopT(lang, 'ariaJump')}
                  data-testid="hop-jump"
                  {...hold('jump')}
                >
                  {hopT(lang, 'ariaJump')}
                </button>
              </div>
            </>
          ) : null}

          {stage === 'intro' ? (
            <div className="hop-panel hop-intro" data-testid="hop-intro">
              <div className="hop-intro-copy">
                <p className="hop-kicker">{hopT(lang, 'introKicker')}</p>
                <h3 className="hop-panel-title">{hopT(lang, 'title')}</h3>
                <p className="hop-body">{hopT(lang, 'introBody')}</p>
                <ul className="hop-facts">
                  <li>{hopT(lang, 'jumpFact')}</li>
                  <li>{hopT(lang, 'frictionFact')}</li>
                </ul>
                <p className="hop-body hop-controls-copy">
                  {hopT(lang, 'controlsKeyboard')}
                </p>
                <p className="hop-body hop-touch-copy">
                  {hopT(lang, 'controlsTouch')}
                </p>
                <p className="hop-reward">{hopT(lang, 'rewardNote')}</p>
              </div>
              <div className="hop-intro-art">
                <JumpArcChart lang={lang} />
              </div>
              <div className="hop-panel-actions">
                <button
                  type="button"
                  className="hop-button hop-primary"
                  onClick={startRun}
                  data-testid="hop-start"
                >
                  {hopT(lang, 'start')}
                </button>
                <button
                  type="button"
                  className="hop-button"
                  onClick={close}
                  data-testid="hop-back"
                >
                  {hopT(lang, 'back')}
                </button>
              </div>
            </div>
          ) : null}

          {stage === 'result' && result ? (
            <div className="hop-panel hop-result" data-testid="hop-result">
              <div className="hop-result-body">
                <h3 className="hop-panel-title">
                  {hopT(
                    lang,
                    result.samples >= result.total
                      ? 'resultPerfect'
                      : 'resultMadeIt',
                  )}
                </h3>
                <div className="hop-result-stats">
                  <div className="hop-stat">
                    <span className="hop-stat-value">
                      {result.samples}/{result.total}
                    </span>
                    <span className="hop-stat-label">
                      {hopT(lang, 'resultSamples')}
                    </span>
                  </div>
                  <div className="hop-stat">
                    <span className="hop-stat-value">{result.hits}</span>
                    <span className="hop-stat-label">
                      {hopT(lang, 'resultHits')}
                    </span>
                  </div>
                </div>
                <p
                  className={
                    result.earned
                      ? 'hop-reward hop-reward-won'
                      : 'hop-reward'
                  }
                  data-testid="hop-result-reward"
                >
                  {rewardLine}
                </p>
                <ul className="hop-facts hop-result-facts">
                  <li>{hopT(lang, 'factMass')}</li>
                  <li>{hopT(lang, 'factHematite')}</li>
                  <li>{hopT(lang, 'factDust')}</li>
                </ul>
                <div className="hop-sources">
                  <span className="hop-sources-label">
                    {hopT(lang, 'sources')}
                  </span>
                  <ul>
                    {SOURCES.map((source) => (
                      <li key={source.key}>
                        <a href={source.href} target="_blank" rel="noreferrer">
                          {hopT(lang, source.key)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="hop-panel-actions">
                <button
                  type="button"
                  className="hop-button hop-primary"
                  onClick={startRun}
                  data-testid="hop-replay"
                >
                  {hopT(lang, 'replay')}
                </button>
                <button
                  type="button"
                  className="hop-button"
                  onClick={close}
                  data-testid="hop-exit"
                >
                  {hopT(lang, 'back')}
                </button>
              </div>
            </div>
          ) : null}

          {toast ? (
            <p className="hop-toast" aria-hidden="true">
              {toast}
            </p>
          ) : null}
          <p className="hop-sr-only" aria-live="polite">
            {announcement}
          </p>
        </div>
      </div>
    </div>
  );
}
