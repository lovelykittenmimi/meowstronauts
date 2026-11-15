import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import MapStage from './components/MapStage';
import WeatherHud from './components/WeatherHud';
import Controls from './components/Controls';
import FeedbackModal from './components/FeedbackModal';
import InfoModal from './components/InfoModal';
import Ship from './components/Ship';
import silverGuide from '../../assets/avatars/silver/avatar-silver-determined-400.webp';
import {
  CLOSE_RADIUS,
  MAX_DT,
  PHASE_SECONDS,
  SHIP_SPEED,
  START,
  clampShip,
  distancePx,
  evaluateLanding,
  makeZones,
  windPushVector,
  zoneImpulse,
} from './game/physics';
import {
  compassLabel,
  farBody,
  guideWind,
  phaseName,
  t,
} from './game/i18n';
import { conditionsFor, pickSolIndex, solAt } from './game/weather';
import type {
  Direction,
  Feedback,
  Lang,
  Point,
  WeatherPhase,
} from './game/types';

type Status = 'playing' | 'landed';

function readLanguage(): Lang {
  try {
    const stored = window.sessionStorage.getItem('mars-weather-lander-lang');
    if (stored === 'en' || stored === 'zh-TW') return stored;
  } catch {
    // sessionStorage can be unavailable in private modes; default to English.
  }
  return 'en';
}

function inputVector(keys: Set<Direction>): Point {
  const x = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
  const y = (keys.has('down') ? 1 : 0) - (keys.has('up') ? 1 : 0);
  if (x !== 0 && y !== 0) {
    return { x: x * Math.SQRT1_2, y: y * Math.SQRT1_2 };
  }
  return { x, y };
}

function keyDirection(key: string): Direction | null {
  switch (key.toLowerCase()) {
    case 'arrowup':
    case 'w':
      return 'up';
    case 'arrowdown':
    case 's':
      return 'down';
    case 'arrowleft':
    case 'a':
      return 'left';
    case 'arrowright':
    case 'd':
      return 'right';
    default:
      return null;
  }
}

interface GuideBubbleProps {
  lang: Lang;
  text: string;
}

function GuideBubble({ lang, text }: GuideBubbleProps) {
  return (
    <aside className="guide-bubble" aria-live="polite">
      <img src={silverGuide} alt="" />
      <div>
        <span className="guide-name">{lang === 'zh-TW' ? '銀白' : 'Silver'}</span>
        <p>{text}</p>
      </div>
    </aside>
  );
}

interface WeatherLanderGameProps {
  initialLang?: Lang;
  onExit?: () => void;
}

export default function WeatherLanderGame({ initialLang, onExit }: WeatherLanderGameProps = {}) {
  const [lang, setLang] = useState<Lang>(() => initialLang ?? readLanguage());
  const [solIndex, setSolIndex] = useState(() => pickSolIndex());
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [ship, setShip] = useState<Point>(START);
  const [heading, setHeading] = useState(0);
  const [thrusting, setThrusting] = useState(false);
  const [trail, setTrail] = useState<Point[]>([]);
  const [distanceKm, setDistanceKm] = useState(() => evaluateLanding(START).distanceKm);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const sol = solAt(solIndex);
  const phase = sol.phases[phaseIndex % sol.phases.length];
  const previousPhase = phaseIndex > 0 ? sol.phases[phaseIndex - 1] : undefined;
  const conditions = useMemo(() => conditionsFor(phase, previousPhase), [phase, previousPhase]);
  const zones = useMemo(() => makeZones(sol.sol, phaseIndex, phase), [sol.sol, phaseIndex, phase]);

  const shipRef = useRef({ ...START, vx: 0, vy: 0 });
  const keysRef = useRef<Set<Direction>>(new Set());
  const statusRef = useRef<Status>('playing');
  const pausedRef = useRef(false);
  const phaseRef = useRef<WeatherPhase>(phase);
  const zonesRef = useRef(zones);
  const phaseElapsedRef = useRef(0);
  const trailAccumRef = useRef(0);
  const lastRenderRef = useRef(0);
  const headingRef = useRef(0);
  const coldUntilRef = useRef(0);
  const cooldownRef = useRef(new Map<string, number>());
  const toastTimerRef = useRef<number | null>(null);
  const langRef = useRef(lang);
  const handleLandRef = useRef<() => void>(() => {});
  const infoButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    langRef.current = lang;
    try {
      window.sessionStorage.setItem('mars-weather-lander-lang', lang);
    } catch {
      // Ignore storage failures.
    }
  }, [lang]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    zonesRef.current = zones;
  }, [zones]);

  useEffect(() => {
    pausedRef.current = infoOpen || feedback !== null;
    if (pausedRef.current) {
      keysRef.current.clear();
      setThrusting(false);
    }
  }, [infoOpen, feedback]);

  useEffect(() => {
    setAnnouncement(
      `${phaseName(lang, phase.key)}. ${t(lang, 'wind')} ${phase.windSpeedMs.toFixed(1)} ${t(
        lang,
        'mps',
      )}, ${t(lang, 'from')} ${compassLabel(lang, phase.windDirectionDeg)}.`,
    );
  }, [phase, lang]);

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3400);
  }, []);

  useEffect(
    () => () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    },
    [],
  );

  const resetShip = useCallback(() => {
    shipRef.current = { ...START, vx: 0, vy: 0 };
    keysRef.current.clear();
    statusRef.current = 'playing';
    phaseElapsedRef.current = 0;
    trailAccumRef.current = 0;
    lastRenderRef.current = 0;
    headingRef.current = 0;
    coldUntilRef.current = 0;
    cooldownRef.current.clear();
    setShip(START);
    setHeading(0);
    setThrusting(false);
    setTrail([]);
    setDistanceKm(evaluateLanding(START).distanceKm);
    setToast(null);
    setFeedback(null);
    setPhaseIndex(0);
  }, []);

  const handleLand = useCallback(() => {
    if (statusRef.current !== 'playing' || pausedRef.current) return;
    const evaluation = evaluateLanding(shipRef.current);
    if (evaluation.result === 'far') {
      showToast(farBody(langRef.current, evaluation.distanceKm));
      return;
    }
    statusRef.current = 'landed';
    keysRef.current.clear();
    setThrusting(false);
    setFeedback({
      ...evaluation,
      sol: sol.sol,
      phase: phase.key,
      windSpeedMs: phase.windSpeedMs,
    });
    setAnnouncement(
      `${evaluation.result === 'perfect' ? t(langRef.current, 'perfectTitle') : t(langRef.current, 'closeTitle')} ${t(
        langRef.current,
        'distanceResult',
      )}: ${evaluation.distanceKm} ${t(langRef.current, 'km')}.`,
    );
  }, [phase.key, phase.windSpeedMs, showToast, sol.sol]);

  useEffect(() => {
    handleLandRef.current = handleLand;
  }, [handleLand]);

  const startSol = useCallback((nextIndex: number) => {
    setSolIndex(nextIndex);
    resetShip();
    setAnnouncement(t(langRef.current, 'guideStart'));
  }, [resetShip]);

  const newSol = useCallback(() => {
    startSol(pickSolIndex(solIndex));
  }, [solIndex, startSol]);

  const retry = useCallback(() => {
    startSol(solIndex);
  }, [solIndex, startSol]);

  const closeInfo = useCallback(() => {
    setInfoOpen(false);
    window.requestAnimationFrame(() => infoButtonRef.current?.focus());
  }, []);

  // Keyboard controls.
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const direction = keyDirection(event.key);
      if (direction) {
        event.preventDefault();
        keysRef.current.add(direction);
        return;
      }
      if (event.key === ' ' || event.key === 'Enter') {
        if (event.repeat) return;
        event.preventDefault();
        handleLandRef.current();
      }
    };
    const up = (event: KeyboardEvent) => {
      const direction = keyDirection(event.key);
      if (direction) {
        event.preventDefault();
        keysRef.current.delete(direction);
      }
    };
    const clear = () => keysRef.current.clear();
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
    };
  }, []);

  // Main game loop.
  useEffect(() => {
    let frame = 0;
    let last = performance.now();

    const step = (now: number, dt: number) => {
      const state = shipRef.current;
      const activePhase = phaseRef.current;
      const input = inputVector(keysRef.current);
      const wind = windPushVector(activePhase);
      const cold = now < coldUntilRef.current;
      const speed = SHIP_SPEED * (cold ? 0.58 : 1);
      const targetVx = input.x * speed + wind.x;
      const targetVy = input.y * speed + wind.y;
      const ease = 1 - Math.exp(-dt * 6);

      state.vx += (targetVx - state.vx) * ease;
      state.vy += (targetVy - state.vy) * ease;
      state.x += state.vx * dt;
      state.y += state.vy * dt;

      const clamped = clampShip(state);
      if (clamped.x !== state.x) state.vx = 0;
      if (clamped.y !== state.y) state.vy = 0;
      state.x = clamped.x;
      state.y = clamped.y;

      for (const zone of zonesRef.current) {
        const cooldown = cooldownRef.current.get(zone.id) ?? 0;
        if (now < cooldown) continue;
        if (distancePx(state, zone) >= zone.r) continue;
        cooldownRef.current.set(zone.id, now + 5000);
        if (zone.type === 'cold') {
          coldUntilRef.current = now + 2600;
          showToast(t(langRef.current, 'guideCold'));
        } else {
          const impulse = zoneImpulse(zone, activePhase);
          state.vx += impulse.x;
          state.vy += impulse.y;
          showToast(t(langRef.current, zone.type === 'dust' ? 'guideDust' : 'guideGust'));
        }
      }

      const velocity = Math.hypot(state.vx, state.vy);
      if (velocity > 14) {
        headingRef.current = (Math.atan2(state.vy, state.vx) * 180) / Math.PI + 90;
      }

      trailAccumRef.current += dt;
      if (trailAccumRef.current >= 0.09 && velocity > 5) {
        trailAccumRef.current = 0;
        setTrail((current) => [...current.slice(-24), { x: state.x, y: state.y }]);
      }

      if (now - lastRenderRef.current >= 32) {
        lastRenderRef.current = now;
        setShip({ x: state.x, y: state.y });
        setHeading(headingRef.current);
        setThrusting(input.x !== 0 || input.y !== 0);
        setDistanceKm(evaluateLanding(state).distanceKm);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, MAX_DT);
      last = now;
      if (statusRef.current === 'playing' && !pausedRef.current) {
        phaseElapsedRef.current += dt;
        if (phaseElapsedRef.current >= PHASE_SECONDS) {
          phaseElapsedRef.current = 0;
          setPhaseIndex((current) => (current + 1) % 4);
        }
        step(now, dt);
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [showToast]);

  const press = useCallback((direction: Direction) => {
    if (statusRef.current !== 'playing' || pausedRef.current) return;
    keysRef.current.add(direction);
  }, []);

  const release = useCallback((direction: Direction) => {
    keysRef.current.delete(direction);
  }, []);

  const compass = compassLabel(lang, phase.windDirectionDeg);
  const guide =
    toast ??
    (feedback
      ? feedback.result === 'perfect'
        ? t(lang, 'guidePerfect')
        : t(lang, 'guideClose')
      : distanceKm <= CLOSE_RADIUS
        ? t(lang, 'guideClose')
        : trail.length < 2
          ? t(lang, 'guideStart')
          : guideWind(lang, compass, phase.windSpeedMs));

  const guideNode: ReactNode = <GuideBubble lang={lang} text={guide} />;

  return (
    <div className="lander-app" data-testid="lander-game">
      <header className="lander-header">
        <div className="brand">
          <div className="brand-badge" aria-hidden="true">
            <Ship size={40} />
          </div>
          <div>
            <p className="eyebrow">{t(lang, 'eyebrow')}</p>
            <h1>{t(lang, 'title')}</h1>
            <p className="subtitle">{t(lang, 'subtitle')}</p>
          </div>
        </div>
        <div className="header-actions">
          {onExit && (
            <button
              type="button"
              className="chip-button"
              data-testid="lander-exit"
              onClick={onExit}
            >
              ← {t(lang, 'backToStory')}
            </button>
          )}
          <button
            ref={infoButtonRef}
            type="button"
            className="chip-button"
            aria-haspopup="dialog"
            onClick={() => setInfoOpen(true)}
          >
            {t(lang, 'dataCredits')}
          </button>
          <button
            type="button"
            className="chip-button"
            onClick={() => setLang((current) => (current === 'en' ? 'zh-TW' : 'en'))}
          >
            {t(lang, 'language')}
          </button>
        </div>
      </header>

      <main className="lander-main">
        <div className="stage-frame">
          <MapStage
            lang={lang}
            phase={phase}
            zones={zones}
            ship={ship}
            heading={heading}
            trail={trail}
            thrusting={thrusting}
          />
          <WeatherHud
            lang={lang}
            sol={sol}
            phase={phase}
            phaseIndex={phaseIndex}
            distanceKm={distanceKm}
            conditions={conditions}
            paused={infoOpen || feedback !== null}
          />
          <div className="portrait-hint" role="note">
            <span aria-hidden="true">↻</span>
            <p>{t(lang, 'rotateHint')}</p>
          </div>
        </div>

        <Controls
          lang={lang}
          disabled={feedback !== null}
          onPress={press}
          onRelease={release}
          onLand={handleLand}
          onReset={retry}
          onNewSol={newSol}
          guide={guideNode}
        />
      </main>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {feedback && (
        <FeedbackModal
          lang={lang}
          feedback={feedback}
          phase={phase}
          onRetry={retry}
          onNextSol={newSol}
        />
      )}
      {infoOpen && <InfoModal lang={lang} onClose={closeInfo} />}
    </div>
  );
}
