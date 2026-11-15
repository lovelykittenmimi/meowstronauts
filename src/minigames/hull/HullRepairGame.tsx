import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import type { Lang } from '../../game/types';
import { t } from '../../i18n';
import baseSide from './assets/base-side.webp';
import damage1 from './assets/damage-1.png';
import damage2 from './assets/damage-2.png';
import damage3 from './assets/damage-3.png';
import damage4 from './assets/damage-4.png';
import droneSprite from './assets/drone.png';

const DOCK = { x: 12.5, y: 84.2593 };
const HOVER = { x: 8, y: 15 };

interface Leak {
  id: number;
  x: number;
  y: number;
  rot: number;
  damage: string;
}

const LEAKS: Leak[] = [
  { id: 1, x: 42.7083, y: 70.3704, rot: -7, damage: damage1 },
  { id: 2, x: 56.25, y: 60.1852, rot: 5, damage: damage2 },
  { id: 3, x: 69.7917, y: 66.6667, rot: -4, damage: damage3 },
  { id: 4, x: 83.3333, y: 59.2593, rot: 6, damage: damage4 },
];

const TOTAL = LEAKS.length;

interface Beam {
  on: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const EMPTY_BEAM: Beam = { on: false, x1: 0, y1: 0, x2: 0, y2: 0 };

interface HullRepairGameProps {
  initialLang: Lang;
  sol: number;
  onDone: () => void;
  /** Leaving early resolves the event choice, same as the other practice games. */
  onExit?: () => void;
}

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function HullRepairGame({
  initialLang,
  sol,
  onDone,
  onExit,
}: HullRepairGameProps) {
  const lang = initialLang;
  const [sealed, setSealed] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [repairingId, setRepairingId] = useState<number | null>(null);
  const [sparkingId, setSparkingId] = useState<number | null>(null);
  const [drone, setDrone] = useState(DOCK);
  const [droneOut, setDroneOut] = useState(false);
  const [flyMs, setFlyMs] = useState(0);
  const [beam, setBeam] = useState<Beam>(EMPTY_BEAM);
  const [done, setDone] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const mountedRef = useRef(true);
  const busyRef = useRef(false);
  const droneOutRef = useRef(false);
  const sealedRef = useRef<Set<number>>(new Set());
  const runRef = useRef(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  const onExitRef = useRef(onExit);
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  onDoneRef.current = onDone;
  onExitRef.current = onExit;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      runRef.current += 1;
    };
  }, []);

  useEffect(() => {
    if (!onExit) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onExitRef.current?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onExit]);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    query.addEventListener?.('change', onChange);
    return () => query.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    buttonRefs.current[LEAKS[0].id]?.focus({ preventScroll: true });
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDoneRef.current();
  }, []);

  const repair = useCallback(
    async (leak: Leak) => {
      if (busyRef.current || sealedRef.current.has(leak.id)) return;

      const run = ++runRef.current;
      busyRef.current = true;
      setBusy(true);
      setRepairingId(leak.id);

      const fromDock = !droneOutRef.current;
      const flight = reduceMotion ? 0 : fromDock ? 950 : 650;
      const hoverX = clamp(leak.x + HOVER.x, 4, 94);
      const hoverY = clamp(leak.y + HOVER.y, 4, 90);

      setFlyMs(flight);
      setDrone({ x: hoverX, y: hoverY });
      setDroneOut(true);
      droneOutRef.current = true;
      await sleep(flight + (reduceMotion ? 0 : 60));
      if (!mountedRef.current || run !== runRef.current) return;

      // Fire from the drone's front/eye, not its centre, so the beam is visible.
      setBeam({
        on: true,
        x1: hoverX - 3,
        y1: (hoverY - 0.5) * 0.5625,
        x2: leak.x,
        y2: leak.y * 0.5625,
      });
      await sleep(reduceMotion ? 30 : 340);
      if (!mountedRef.current || run !== runRef.current) return;

      setSparkingId(leak.id);
      await sleep(reduceMotion ? 0 : 110);
      if (!mountedRef.current || run !== runRef.current) return;

      sealedRef.current.add(leak.id);
      setSealed([...sealedRef.current]);
      await sleep(reduceMotion ? 20 : 500);
      if (!mountedRef.current || run !== runRef.current) return;

      setBeam((current) => ({ ...current, on: false }));
      setRepairingId(null);

      if (sealedRef.current.size === TOTAL) {
        busyRef.current = false;
        setBusy(false);
        setDone(true);

        const back = reduceMotion ? 0 : 850;
        setFlyMs(back);
        setDrone(DOCK);
        setDroneOut(false);
        droneOutRef.current = false;
        await sleep(back + (reduceMotion ? 0 : 400));
        if (!mountedRef.current) return;
        finish();
        return;
      }

      busyRef.current = false;
      setBusy(false);
      const next = LEAKS.find((item) => !sealedRef.current.has(item.id));
      if (next) {
        buttonRefs.current[next.id]?.focus({ preventScroll: true });
      }
    },
    [finish, reduceMotion],
  );

  const remaining = TOTAL - sealed.length;
  const countLabel =
    remaining === 0
      ? t(lang, 'hull.sealedCount')
      : remaining === 1
        ? t(lang, 'hull.leakOne')
        : t(lang, 'hull.leaks', { count: remaining });
  const hintText = done
    ? t(lang, 'hull.hintDone')
    : busy
      ? t(lang, 'hull.hintBusy')
      : sealed.length === 0
        ? t(lang, 'hull.hintStart')
        : remaining === 1
          ? t(lang, 'hull.leftOne')
          : t(lang, 'hull.left', { count: remaining });
  const hintIcon = done ? '✅' : busy ? '🛰️' : '🛠️';

  const droneStyle = {
    left: `${drone.x}%`,
    top: `${drone.y}%`,
    '--fly-ms': `${flyMs}ms`,
  } as CSSProperties;

  return (
    <div
      className="hull-app"
      role="dialog"
      aria-modal="true"
      aria-label={t(lang, 'hull.title')}
    >
      <div className="stage-wrap">
        <div className="stage" data-testid="hull-game">
          <img className="base-art" src={baseSide} alt="" aria-hidden="true" draggable={false} />
          <div className="vignette" aria-hidden="true" />

          <div className="dock" aria-hidden="true">
            <span className="dock-ring" />
            <span className="dock-label">{t(lang, 'hull.dock')}</span>
          </div>

          {LEAKS.map((leak) => {
            const isSealed = sealed.includes(leak.id);
            const slotStyle = {
              '--x': `${leak.x}%`,
              '--y': `${leak.y}%`,
              '--patch-rot': `${leak.rot}deg`,
            } as CSSProperties;
            return (
              <div
                key={leak.id}
                className={`leak-slot${isSealed ? ' sealed' : ''}${
                  repairingId === leak.id ? ' repairing' : ''
                }${sparkingId === leak.id ? ' sparking' : ''}`}
                style={slotStyle}
              >
                <img
                  className="damage"
                  src={leak.damage}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                />
                <button
                  ref={(node) => {
                    buttonRefs.current[leak.id] = node;
                  }}
                  className="leak"
                  type="button"
                  data-id={leak.id}
                  aria-label={t(lang, 'hull.repairAria', { i: leak.id, total: TOTAL })}
                  disabled={busy || isSealed}
                  onClick={() => {
                    void repair(leak);
                  }}
                >
                  <span className="leak-ring" aria-hidden="true" />
                  <span className="leak-badge" aria-hidden="true">
                    !
                  </span>
                  <span className="leak-vapor" aria-hidden="true" />
                </button>
                <span className="spark" aria-hidden="true" />
                <div className="patch" aria-hidden="true">
                  <span className="patch-brace" aria-hidden="true" />
                  <span className="bolt b1" aria-hidden="true" />
                  <span className="bolt b2" aria-hidden="true" />
                  <span className="bolt b3" aria-hidden="true" />
                  <span className="bolt b4" aria-hidden="true" />
                </div>
              </div>
            );
          })}

          <div
            className={`drone${droneOut ? ' flying' : ' docked'}${beam.on ? ' firing' : ''}`}
            style={droneStyle}
            aria-hidden="true"
          >
            <div className="drone-inner">
              <img src={droneSprite} alt="" draggable={false} />
            </div>
            <span className="drone-thruster" aria-hidden="true" />
          </div>

          <svg
            className={`beam-layer${beam.on ? ' on' : ''}`}
            viewBox="0 0 100 56.25"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <filter id="hull-beam-blur" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="0.8" />
              </filter>
              <radialGradient id="hull-impact-grad">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.35" stopColor="#a8fff0" />
                <stop offset="1" stopColor="#4fd1c5" stopOpacity="0" />
              </radialGradient>
            </defs>
            <line
              className="beam-glow-line"
              x1={beam.x1}
              y1={beam.y1}
              x2={beam.x2}
              y2={beam.y2}
            />
            <line
              className="beam-core-line"
              x1={beam.x1}
              y1={beam.y1}
              x2={beam.x2}
              y2={beam.y2}
            />
            <circle
              className="beam-impact"
              cx={beam.x2}
              cy={beam.y2}
              r={beam.on ? 1.7 : 0}
              fill="url(#hull-impact-grad)"
            />
          </svg>

          <header className="hud">
            <div className="hud-title">
              <p className="eyebrow">{t(lang, 'hull.eyebrow', { sol })}</p>
              <h1>{t(lang, 'hull.title')}</h1>
            </div>
            <div className="hud-actions">
              <div className="hull-panel">
                <span className="hull-label">{t(lang, 'hull.hull')}</span>
                <div
                  className="segs"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={TOTAL}
                  aria-valuenow={sealed.length}
                  aria-label={t(lang, 'hull.progressAria')}
                >
                  {LEAKS.map((leak, index) => (
                    <span
                      key={leak.id}
                      className={`seg${index < sealed.length ? ' filled' : ''}`}
                    />
                  ))}
                </div>
                <span className="leak-count" aria-live="polite">
                  {countLabel}
                </span>
              </div>
              {onExit && (
                <button
                  type="button"
                  className="hull-exit"
                  data-testid="hull-exit"
                  onClick={onExit}
                >
                  {t(lang, 'hull.exit')}
                </button>
              )}
            </div>
          </header>

          <div className={`hint${done ? ' done' : ''}`} aria-live="polite">
            <span className="hint-icon" aria-hidden="true">
              {hintIcon}
            </span>
            <span>{hintText}</span>
          </div>

          <div className={`sealed-banner${done ? ' show' : ''}`} role="status">
            <span className="check" aria-hidden="true">
              ✓
            </span>
            <span className="banner-copy">
              <strong>{t(lang, 'hull.sealed')}</strong>
              <small>{t(lang, 'hull.sealedSub')}</small>
            </span>
          </div>

          <div className="rotate-hint">
            <span>↻</span>
            <p>{t(lang, 'hull.rotate')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
