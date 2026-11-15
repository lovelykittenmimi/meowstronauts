import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang } from '../../game/types';
import {
  FACTORY_REWARD_LIFE_SUPPORT,
  FACTORY_STATION_TOTAL,
  LIFE_SUPPORT_CAP,
} from '../../game/balance';
import {
  AIR_MOLECULES,
  CO2_MOLECULE_IDS,
  DIG_SPOTS,
  FACTORY_MOXIE,
  FACTORY_STATIONS,
  FACTORY_WHY,
  ICE_SPOT,
  applyFactoryAction,
  completedStationCount,
  createFactoryGame,
  isFactoryComplete,
  type DigSpotId,
  type FactoryAction,
  type FactoryGame,
  type FactoryStationId,
  type OvenChoice,
} from './game/state';
import { factoryT, type FactoryCopyKey } from './game/i18n';
import './styles.css';

export interface WaterFuelFactoryProps {
  lang: Lang;
  /** Whether this mission already paid the factory bonus. */
  rewarded: boolean;
  /** Current life support; the bonus is capped at 100. */
  lifeSupport: number;
  onComplete: (stations: number) => void;
  onExit: () => void;
}

type FactoryStage = 'intro' | 'playing' | 'result';

interface FactoryResult {
  earned: boolean;
  already: boolean;
  full: boolean;
  gain: number;
}

const FINISH_DELAY_MS = 700;
const TOAST_MS = 3200;
const WRONG_MOLECULE_MS = 500;

/** Short, playful prompts for the cat guide; hints replace these on a miss. */
const GUIDE_BY_STATION: Record<FactoryStationId, FactoryCopyKey> = {
  mine: 'guideMine',
  electrolysis: 'guideElectrolysis',
  scrubber: 'guideScrubber',
  reactor: 'guideReactor',
};

const CONFETTI_COLORS = ['#e8a33d', '#6fc3ff', '#4fd1c5', '#e07a5f', '#c9d2dc'];

/** Deterministic confetti so a re-render never reshuffles mid-fall. */
const CONFETTI = Array.from({ length: 24 }, (_, index) => ({
  left: (index * 53 + 9) % 100,
  delay: (index % 8) * 55,
  tilt: (index % 2 === 0 ? 1 : -1) * (10 + (index % 4) * 7),
  color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
}));

const SOURCES = [
  {
    key: 'sourceMarsFacts',
    href: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html',
  },
  {
    key: 'sourceLifeSupport',
    href: 'https://www.nasa.gov/centers-and-facilities/marshall/the-bare-necessities-surviving-the-rigors-of-space-travel/',
  },
  {
    key: 'sourceSabatier',
    href: 'https://www3.nasa.gov/home/hqnews/2010/oct/HQ_10-275_Sabatier.html',
  },
  {
    key: 'sourceCdra',
    href: 'https://ntrs.nasa.gov/citations/20160005077',
  },
  {
    key: 'sourcePhoenix',
    href: 'https://www.jpl.nasa.gov/news/nasa-phoenix-results-point-to-martian-climate-cycles/',
  },
  {
    key: 'sourceSwim',
    href: 'https://science.nasa.gov/resource/swim-map-shows-subsurface-water-ice-on-mars/',
  },
  {
    key: 'sourceMoxie',
    href: 'https://www.nasa.gov/news-release/nasas-perseverance-mars-rover-extracts-first-oxygen-from-red-planet/',
  },
] as const;

function doneById(game: FactoryGame): Record<FactoryStationId, boolean> {
  return {
    mine: game.mine.done,
    electrolysis: game.electrolysis.done,
    scrubber: game.scrubber.done,
    reactor: game.reactor.done,
  };
}

function Confetti({ count = 18 }: { count?: number }) {
  return (
    <div className="factory-confetti" aria-hidden="true">
      {CONFETTI.slice(0, count).map((piece, index) => (
        <i
          key={`${index}-${piece.left}`}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}ms`,
            background: piece.color,
            rotate: `${piece.tilt}deg`,
          }}
        />
      ))}
    </div>
  );
}

function Guide({ message }: { message: string }) {
  return (
    <div className="factory-guide">
      <span className="factory-guide-face" aria-hidden="true">
        <img src="/brand/avatar-silver-512.webp" alt="" />
        <span className="factory-guide-spark">✦</span>
      </span>
      <p className="factory-guide-bubble" data-testid="factory-guide">
        {message}
      </p>
    </div>
  );
}

function TankGauge({ filled }: { filled: boolean }) {
  return (
    <span className="factory-tank-gauge" aria-hidden="true">
      <i className={filled ? 'is-filled' : ''} />
    </span>
  );
}

export default function WaterFuelFactory({
  lang,
  rewarded,
  lifeSupport,
  onComplete,
  onExit,
}: WaterFuelFactoryProps) {
  const [stage, setStage] = useState<FactoryStage>('intro');
  const [game, setGame] = useState<FactoryGame>(() => createFactoryGame());
  const [selectedGas, setSelectedGas] = useState<'o2' | 'h2' | null>(null);
  const [selectedOutput, setSelectedOutput] = useState<
    'methane' | 'water' | null
  >(null);
  const [wrongMolecule, setWrongMolecule] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [guideKey, setGuideKey] = useState<FactoryCopyKey>('guideIntro');
  const [guideVars, setGuideVars] = useState<
    Record<string, string | number> | undefined
  >(undefined);
  const [result, setResult] = useState<FactoryResult | null>(null);
  const [burst, setBurst] = useState(0);

  const stationRef = useRef<HTMLElement>(null);
  const propsRef = useRef({
    lang,
    rewarded,
    lifeSupport,
    onComplete,
    onExit,
  });
  const earnedRef = useRef(false);
  const finishedRef = useRef(false);
  const finishTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const wrongTimerRef = useRef<number | null>(null);

  useEffect(() => {
    propsRef.current = { lang, rewarded, lifeSupport, onComplete, onExit };
  }, [lang, rewarded, lifeSupport, onComplete, onExit]);

  const clearTimers = useCallback(() => {
    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    if (wrongTimerRef.current !== null) {
      window.clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const close = useCallback(() => {
    propsRef.current.onExit();
  }, []);

  // Escape leaves the overlay, same as the other minigames.
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

  /**
   * A miss shows the same line in the toast, the live region, and the cat's
   * speech bubble. The keys keep the guide in the current language.
   */
  const showHint = useCallback(
    (key: FactoryCopyKey) => {
      const message = factoryT(propsRef.current.lang, key);
      setAnnouncement(message);
      setGuideKey(key);
      setGuideVars(undefined);
      showToast(message);
    },
    [showToast],
  );

  const guide = factoryT(lang, guideKey, guideVars);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const { lang: currentLang, rewarded: wasRewarded, lifeSupport: current } =
      propsRef.current;
    const already = wasRewarded || earnedRef.current;
    const full = !already && current >= LIFE_SUPPORT_CAP;
    const gain = full
      ? 0
      : Math.min(
          LIFE_SUPPORT_CAP,
          current + FACTORY_REWARD_LIFE_SUPPORT,
        ) - current;
    const earned = !already && !full && gain > 0;
    if (earned) earnedRef.current = true;

    setResult({ earned, already, full, gain });
    setStage('result');
    setToast(null);
    setAnnouncement(factoryT(currentLang, 'allDone'));
    setGuideKey('guideResult');
    setGuideVars(undefined);
    setBurst((count) => count + 1);
    propsRef.current.onComplete(FACTORY_STATION_TOTAL);
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    finishedRef.current = false;
    earnedRef.current = false;
    setGame(applyFactoryAction(createFactoryGame(), { type: 'START' }));
    setStage('playing');
    setResult(null);
    setToast(null);
    setSelectedGas(null);
    setSelectedOutput(null);
    setWrongMolecule(null);
    setGuideKey('guideMine');
    setGuideVars(undefined);
    const first = FACTORY_STATIONS[0];
    setAnnouncement(
      first
        ? factoryT(propsRef.current.lang, 'stationAnnounce', {
            done: 1,
            total: FACTORY_STATION_TOTAL,
            station: first.title[propsRef.current.lang],
          })
        : '',
    );
  }, [clearTimers]);

  useEffect(() => {
    if (stage === 'playing') {
      stationRef.current?.focus({ preventScroll: true });
    }
  }, [stage, game.stationIndex]);

  const complete = isFactoryComplete(game);

  useEffect(() => {
    if (stage !== 'playing' || !complete) return;
    if (finishTimerRef.current !== null) return;
    finishTimerRef.current = window.setTimeout(() => {
      finishTimerRef.current = null;
      finish();
    }, FINISH_DELAY_MS);
  }, [stage, complete, finish]);

  /**
   * Apply an action and return the next state. A rejected action shows the
   * supplied hint and leaves the station exactly as it was.
   */
  const act = (action: FactoryAction, hint?: FactoryCopyKey): FactoryGame | null => {
    if (stage !== 'playing') return null;
    const next = applyFactoryAction(game, action);
    if (next === game) {
      if (hint) showHint(hint);
      return null;
    }

    const before = completedStationCount(game);
    const after = completedStationCount(next);
    setGame(next);

    if (after > before) {
      setBurst((count) => count + 1);
      showToast(factoryT(lang, 'stationDone'));
      if (isFactoryComplete(next)) {
        setAnnouncement(factoryT(lang, 'allDone'));
        setGuideKey('guideStationDone');
        setGuideVars(undefined);
      } else {
        const station = FACTORY_STATIONS[next.stationIndex];
        if (station) {
          setGuideKey(GUIDE_BY_STATION[station.id]);
          setGuideVars(undefined);
          setAnnouncement(
            factoryT(lang, 'stationAnnounce', {
              done: next.stationIndex + 1,
              total: FACTORY_STATION_TOTAL,
              station: station.title[lang],
            }),
          );
        }
      }
    }
    return next;
  };

  const handleDig = (spot: DigSpotId) => {
    const next = act({ type: 'DIG', spot }, 'digHint');
    if (next) {
      setAnnouncement(factoryT(lang, 'iceFound'));
      setGuideKey('iceFound');
      setGuideVars(undefined);
    }
  };

  const handleOven = (oven: OvenChoice) => {
    if (stage !== 'playing') return;
    const next = applyFactoryAction(game, { type: 'CHOOSE_OVEN', oven });
    setGame(next);
    if (oven === 'open') {
      showHint('ovenHint');
    } else {
      setAnnouncement(factoryT(lang, 'sealedReady'));
      setGuideKey('sealedReady');
      setGuideVars(undefined);
    }
  };

  const handleBake = () => {
    if (game.mine.oven !== 'sealed') {
      showHint('ovenHint');
      return;
    }
    act({ type: 'BAKE' }, 'ovenHint');
  };

  const handleSplit = () => {
    const next = act({ type: 'SPLIT' });
    if (next) {
      setAnnouncement(factoryT(lang, 'routeHint'));
      setGuideKey('routeHint');
      setGuideVars(undefined);
    }
  };

  const handleRoute = (gas: 'o2' | 'h2' | null, to: 'crew' | 'fuel') => {
    if (!gas) return;
    const next = act({ type: 'ROUTE_GAS', gas, to }, 'gasHint');
    if (!next) return;
    setSelectedGas(null);
    if (!next.electrolysis.done) {
      setAnnouncement(factoryT(lang, 'gasRouted'));
      setGuideKey('gasRouted');
      setGuideVars(undefined);
    }
  };

  const handleCapture = (molecule: string) => {
    const next = act({ type: 'CAPTURE', molecule }, 'moleculeHint');
    if (!next) {
      setWrongMolecule(molecule);
      if (wrongTimerRef.current !== null) {
        window.clearTimeout(wrongTimerRef.current);
      }
      wrongTimerRef.current = window.setTimeout(() => {
        wrongTimerRef.current = null;
        setWrongMolecule(null);
      }, WRONG_MOLECULE_MS);
      return;
    }
    const count = next.scrubber.caught.length;
    setAnnouncement(
      factoryT(lang, 'caught', {
        count,
        total: CO2_MOLECULE_IDS.length,
      }),
    );
    setGuideKey('caught');
    setGuideVars({ count, total: CO2_MOLECULE_IDS.length });
  };

  const handleHeat = () => {
    act({ type: 'HEAT_FILTER' });
  };

  const handleReact = () => {
    const next = act({ type: 'REACT' });
    if (next) {
      setAnnouncement(factoryT(lang, 'collectHint'));
      setGuideKey('collectHint');
      setGuideVars(undefined);
    }
  };

  const handleCollect = (
    output: 'methane' | 'water' | null,
    to: 'fuel' | 'water',
  ) => {
    if (!output) return;
    const next = act({ type: 'COLLECT_OUTPUT', output, to }, 'collectHint');
    if (!next) return;
    setSelectedOutput(null);
    if (!next.reactor.done) {
      setAnnouncement(factoryT(lang, 'outputCollected'));
      setGuideKey('outputCollected');
      setGuideVars(undefined);
    }
  };

  const current =
    FACTORY_STATIONS[
      Math.min(game.stationIndex, FACTORY_STATIONS.length - 1)
    ] ?? FACTORY_STATIONS[0];
  const done = doneById(game);
  const completed = completedStationCount(game);
  const caughtCount = game.scrubber.caught.length;
  const filterFull = caughtCount >= CO2_MOLECULE_IDS.length;

  const badge =
    stage === 'playing'
      ? factoryT(lang, 'progress', {
          done: game.stationIndex + 1,
          total: FACTORY_STATION_TOTAL,
        })
      : stage === 'result'
        ? factoryT(lang, 'progress', {
            done: FACTORY_STATION_TOTAL,
            total: FACTORY_STATION_TOTAL,
          })
        : factoryT(lang, 'badge');

  const rewardLine = result
    ? result.earned
      ? factoryT(lang, 'rewardEarned', { gain: result.gain })
      : result.full
        ? factoryT(lang, 'rewardFull')
        : factoryT(lang, 'rewardAlready')
    : '';

  return (
    <div
      className="factory-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={factoryT(lang, 'title')}
      data-testid="factory-game"
    >
      <div className="factory-world" aria-hidden="true">
        <span className="factory-world-dust" />
      </div>

      <div className="factory-app">
        <header className="factory-header">
          <span className="factory-logo" aria-hidden="true">
            🏭
          </span>
          <div className="factory-heading">
            <span className="factory-eyebrow">
              {factoryT(lang, 'eyebrow')}
            </span>
            <h2 className="factory-title">{factoryT(lang, 'title')}</h2>
          </div>
          <span className="factory-badge">{badge}</span>
          <button
            type="button"
            className="factory-close"
            onClick={close}
            aria-label={factoryT(lang, stage === 'intro' ? 'back' : 'close')}
            data-testid="factory-close"
          >
            ✕
          </button>
        </header>

        <div className="factory-stage">
          {stage === 'playing' ? (
            <>
              <ol
                className="factory-progress"
                aria-label={factoryT(lang, 'progress', {
                  done: completed,
                  total: FACTORY_STATION_TOTAL,
                })}
                data-testid="factory-progress"
              >
                {FACTORY_STATIONS.map((station, index) => {
                  const isDone = done[station.id];
                  const isCurrent =
                    index === game.stationIndex && !game.completed;
                  return (
                    <li
                      key={station.id}
                      className={`factory-progress-step${
                        isDone ? ' is-done' : ''
                      }${isCurrent ? ' is-current' : ''}`}
                      data-state={
                        isDone ? 'done' : isCurrent ? 'current' : 'todo'
                      }
                      aria-current={isCurrent ? 'step' : undefined}
                      aria-label={station.title[lang]}
                      data-testid={`factory-progress-${station.id}`}
                    >
                      <span className="factory-progress-node" aria-hidden="true">
                        <span className="factory-progress-icon">
                          {station.icon}
                        </span>
                        {isDone ? (
                          <span className="factory-progress-check">✓</span>
                        ) : null}
                      </span>
                      <span className="factory-progress-label">
                        {station.title[lang]}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {current ? (
                <section
                  className="factory-station"
                  ref={stationRef}
                  tabIndex={-1}
                  aria-labelledby="factory-station-title"
                  data-testid="factory-station"
                  data-station={current.id}
                >
                  <header className="factory-station-head">
                    <span
                      className="factory-station-icon"
                      aria-hidden="true"
                    >
                      {current.icon}
                    </span>
                    <div className="factory-station-copy">
                      <p className="factory-station-number">
                        {factoryT(lang, 'progress', {
                          done: game.stationIndex + 1,
                          total: FACTORY_STATION_TOTAL,
                        })}
                      </p>
                      <h3
                        className="factory-station-title"
                        id="factory-station-title"
                        data-testid="factory-station-title"
                      >
                        {current.title[lang]}
                      </h3>
                      <p className="factory-goal">{current.goal[lang]}</p>
                    </div>
                  </header>

                  <Guide message={guide} />

                  {current.id === 'mine' ? (
                    <div className="factory-machine">
                      <div className="factory-mine-scene">
                        <span className="factory-mine-moon" aria-hidden="true" />
                        <span className="factory-mine-rock r1" aria-hidden="true" />
                        <span className="factory-mine-rock r2" aria-hidden="true" />
                        <span className="factory-mine-rock r3" aria-hidden="true" />
                        <div
                          className="factory-radar"
                          role="group"
                          aria-label={factoryT(lang, 'station1Goal')}
                        >
                          <span
                            className="factory-radar-sweep"
                            aria-hidden="true"
                          />
                          {DIG_SPOTS.map((spot) => {
                            const found = game.mine.spot === spot.id;
                            const correct = spot.id === ICE_SPOT;
                            return (
                              <button
                                key={spot.id}
                                type="button"
                                className={`factory-spot${
                                  found ? ' is-found' : ''
                                }`}
                                data-correct={correct ? 'true' : undefined}
                                data-testid={`factory-dig-${spot.id}`}
                                aria-label={factoryT(lang, 'digSpot', {
                                  spot: spot.label,
                                })}
                                disabled={Boolean(game.mine.spot)}
                                onClick={() => handleDig(spot.id)}
                              >
                                <span
                                  className="factory-spot-ping"
                                  aria-hidden="true"
                                />
                                <span
                                  className="factory-spot-label"
                                  aria-hidden="true"
                                >
                                  {spot.label}
                                </span>
                                {found ? (
                                  <span
                                    className="factory-spot-ice"
                                    aria-hidden="true"
                                  >
                                    🧊
                                  </span>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                        {game.mine.spot ? (
                          <span className="factory-ice-pop" aria-hidden="true">
                            🧊
                          </span>
                        ) : null}
                      </div>

                      <div
                        className={`factory-flow${
                          game.mine.done ? ' is-live' : ''
                        }`}
                        aria-hidden="true"
                      >
                        <span className="factory-flow-node">🧊</span>
                        <span className="factory-flow-pipe">
                          <i />
                          <i />
                          <i />
                        </span>
                        <span className="factory-flow-label">
                          {factoryT(lang, 'saltFilter')}
                        </span>
                        <span className="factory-flow-pipe">
                          <i />
                          <i />
                        </span>
                        <span className="factory-flow-node">🛢️</span>
                      </div>

                      {game.mine.spot ? (
                        <div className="factory-oven">
                          <p className="factory-prompt">
                            {factoryT(lang, 'ovenPrompt')}
                          </p>
                          <div className="factory-choice-row">
                            <button
                              type="button"
                              className={`factory-choice${
                                game.mine.oven === 'sealed'
                                  ? ' is-selected'
                                  : ''
                              }`}
                              data-testid="factory-oven-sealed"
                              aria-pressed={game.mine.oven === 'sealed'}
                              onClick={() => handleOven('sealed')}
                            >
                              <span aria-hidden="true">🔒</span>
                              {factoryT(lang, 'ovenSealed')}
                            </button>
                            <button
                              type="button"
                              className={`factory-choice${
                                game.mine.oven === 'open'
                                  ? ' is-selected'
                                  : ''
                              }`}
                              data-testid="factory-oven-open"
                              aria-pressed={game.mine.oven === 'open'}
                              onClick={() => handleOven('open')}
                            >
                              <span aria-hidden="true">🥘</span>
                              {factoryT(lang, 'ovenOpen')}
                            </button>
                          </div>
                          {game.mine.oven === 'sealed' ? (
                            <button
                              type="button"
                              className="factory-button factory-primary"
                              data-testid="factory-bake"
                              onClick={handleBake}
                            >
                              <span aria-hidden="true">🔥</span>{' '}
                              {factoryT(lang, 'bake')}
                            </button>
                          ) : null}
                          {game.mine.oven === 'open' ? (
                            <p
                              className="factory-hint-text"
                              data-testid="factory-oven-hint"
                            >
                              {factoryT(lang, 'ovenHint')}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {current.id === 'electrolysis' ? (
                    <div className="factory-machine">
                      <div
                        className={`factory-electro-scene${
                          game.electrolysis.split ? ' is-splitting' : ''
                        }`}
                        aria-hidden="true"
                      >
                        <div className="factory-water-tank">
                          <span className="factory-water-fill" />
                          <span className="factory-water-bubble wb1" />
                          <span className="factory-water-bubble wb2" />
                          <span className="factory-water-bubble wb3" />
                        </div>
                        <span className="factory-electro-bolt">⚡</span>
                        <span className="factory-gas-puff gp1">O₂</span>
                        <span className="factory-gas-puff gp2">H₂</span>
                      </div>

                      {!game.electrolysis.split ? (
                        <button
                          type="button"
                          className="factory-button factory-primary"
                          data-testid="factory-power"
                          onClick={handleSplit}
                        >
                          <span aria-hidden="true">⚡</span>{' '}
                          {factoryT(lang, 'power')}
                        </button>
                      ) : (
                        <>
                          <p className="factory-prompt">
                            {factoryT(lang, 'routeHint')}
                          </p>
                          <div className="factory-gas-row">
                            {(['o2', 'h2'] as const).map((gas) => {
                              const gasDone = game.electrolysis[gas];
                              return (
                                <button
                                  key={gas}
                                  type="button"
                                  className={`factory-gas factory-gas-${gas}${
                                    selectedGas === gas ? ' is-selected' : ''
                                  }${gasDone ? ' is-done' : ''}`}
                                  data-testid={`factory-gas-${gas}`}
                                  aria-pressed={selectedGas === gas}
                                  disabled={gasDone}
                                  onClick={() => setSelectedGas(gas)}
                                >
                                  <span aria-hidden="true">
                                    {gas === 'o2' ? '🫧' : '💨'}
                                  </span>
                                  <span>{factoryT(lang, gas)}</span>
                                  {gasDone ? <span aria-hidden="true">✓</span> : null}
                                </button>
                              );
                            })}
                          </div>
                          <p className="factory-prompt">
                            {factoryT(lang, 'destinationPrompt')}
                          </p>
                          <div className="factory-tank-row">
                            <button
                              type="button"
                              className="factory-tank"
                              data-testid="factory-tank-crew"
                              disabled={!selectedGas}
                              onClick={() => handleRoute(selectedGas, 'crew')}
                            >
                              <span aria-hidden="true">🧑‍🚀</span>
                              <span className="factory-tank-name">
                                {factoryT(lang, 'crewAir')}
                              </span>
                              <TankGauge filled={game.electrolysis.o2} />
                            </button>
                            <button
                              type="button"
                              className="factory-tank"
                              data-testid="factory-tank-fuel"
                              disabled={!selectedGas}
                              onClick={() => handleRoute(selectedGas, 'fuel')}
                            >
                              <span aria-hidden="true">⛽</span>
                              <span className="factory-tank-name">
                                {factoryT(lang, 'fuelTank')}
                              </span>
                              <TankGauge filled={game.electrolysis.h2} />
                            </button>
                          </div>
                          <p className="factory-hint-text">
                            {factoryT(lang, 'gasHint')}
                          </p>
                        </>
                      )}
                    </div>
                  ) : null}

                  {current.id === 'scrubber' ? (
                    <div className="factory-machine">
                      <div className="factory-scrubber-scene">
                        <div
                          className={`factory-filter${
                            filterFull ? ' is-full' : ''
                          }${game.scrubber.released ? ' is-released' : ''}`}
                          aria-hidden="true"
                        >
                          <span className="factory-filter-drum">🫧</span>
                          <span className="factory-filter-slots">
                            {CO2_MOLECULE_IDS.map((id, index) => (
                              <i
                                key={id}
                                className={
                                  index < caughtCount ? 'is-lit' : ''
                                }
                              />
                            ))}
                          </span>
                          <span className="factory-filter-puff">CO₂</span>
                        </div>
                        <div
                          className="factory-air"
                          role="group"
                          aria-label={factoryT(lang, 'station3Goal')}
                        >
                          {AIR_MOLECULES.map((molecule) => {
                            const caught = game.scrubber.caught.includes(
                              molecule.id,
                            );
                            return (
                              <button
                                key={molecule.id}
                                type="button"
                                className={`factory-molecule factory-molecule-${molecule.id}${
                                  caught ? ' is-caught' : ''
                                }${
                                  wrongMolecule === molecule.id
                                    ? ' is-wrong'
                                    : ''
                                }`}
                                data-testid={`factory-molecule-${molecule.id}`}
                                disabled={caught || game.scrubber.released}
                                onClick={() => handleCapture(molecule.id)}
                              >
                                <span className="factory-molecule-label">
                                  {molecule.label}
                                </span>
                                {caught ? (
                                  <span
                                    className="factory-molecule-check"
                                    aria-hidden="true"
                                  >
                                    ✓
                                  </span>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <p className="factory-note">
                        {factoryT(lang, 'sampleNote')}
                      </p>
                      <p className="factory-count" data-testid="factory-caught-count">
                        {factoryT(lang, 'caught', {
                          count: caughtCount,
                          total: CO2_MOLECULE_IDS.length,
                        })}
                      </p>
                      {filterFull ? (
                        <button
                          type="button"
                          className="factory-button factory-primary"
                          data-testid="factory-heat"
                          onClick={handleHeat}
                        >
                          <span aria-hidden="true">🔥</span>{' '}
                          {factoryT(lang, 'heat')}
                        </button>
                      ) : null}
                      <p className="factory-hint-text">
                        {factoryT(lang, 'moleculeHint')}
                      </p>
                    </div>
                  ) : null}

                  {current.id === 'reactor' ? (
                    <div className="factory-machine">
                      <div
                        className={`factory-reactor-scene${
                          game.reactor.reacted ? ' is-hot' : ''
                        }`}
                        aria-hidden="true"
                      >
                        <span className="factory-reactor-ring" />
                        <span className="factory-reactor-core">🔥</span>
                        <span className="factory-reactor-out o1">CH₄</span>
                        <span className="factory-reactor-out o2">H₂O</span>
                      </div>

                      {!game.reactor.reacted ? (
                        <button
                          type="button"
                          className="factory-button factory-primary"
                          data-testid="factory-react"
                          onClick={handleReact}
                        >
                          <span aria-hidden="true">⚙️</span>{' '}
                          {factoryT(lang, 'react')}
                        </button>
                      ) : (
                        <>
                          <p className="factory-prompt">
                            {factoryT(lang, 'collectHint')}
                          </p>
                          <div className="factory-gas-row">
                            {(['methane', 'water'] as const).map((output) => {
                              const outputDone = game.reactor[output];
                              return (
                                <button
                                  key={output}
                                  type="button"
                                  className={`factory-gas factory-gas-${output}${
                                    selectedOutput === output
                                      ? ' is-selected'
                                      : ''
                                  }${outputDone ? ' is-done' : ''}`}
                                  data-testid={`factory-output-${output}`}
                                  aria-pressed={selectedOutput === output}
                                  disabled={outputDone}
                                  onClick={() => setSelectedOutput(output)}
                                >
                                  <span aria-hidden="true">
                                    {output === 'methane' ? '🔥' : '💧'}
                                  </span>
                                  <span>{factoryT(lang, output)}</span>
                                  {outputDone ? <span aria-hidden="true">✓</span> : null}
                                </button>
                              );
                            })}
                          </div>
                          <p className="factory-prompt">
                            {factoryT(lang, 'destinationPrompt')}
                          </p>
                          <div className="factory-tank-row">
                            <button
                              type="button"
                              className="factory-tank"
                              data-testid="factory-collect-fuel"
                              disabled={!selectedOutput}
                              onClick={() =>
                                handleCollect(selectedOutput, 'fuel')
                              }
                            >
                              <span aria-hidden="true">⛽</span>
                              <span className="factory-tank-name">
                                {factoryT(lang, 'fuelTank')}
                              </span>
                              <TankGauge filled={game.reactor.methane} />
                            </button>
                            <button
                              type="button"
                              className="factory-tank"
                              data-testid="factory-collect-water"
                              disabled={!selectedOutput}
                              onClick={() =>
                                handleCollect(selectedOutput, 'water')
                              }
                            >
                              <span aria-hidden="true">💧</span>
                              <span className="factory-tank-name">
                                {factoryT(lang, 'waterTank')}
                              </span>
                              <TankGauge filled={game.reactor.water} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : null}

                  <div className="factory-fact" data-testid="factory-station-fact">
                    <span className="factory-fact-tag">
                      {factoryT(lang, 'factTag')}
                    </span>
                    <ul>
                      {current.facts.map((fact, index) => (
                        <li key={`${current.id}-${index}`}>{fact[lang]}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              ) : null}
            </>
          ) : null}

          {stage === 'intro' ? (
            <div className="factory-panel factory-intro" data-testid="factory-intro">
              <div className="factory-intro-copy">
                <p className="factory-kicker">
                  {factoryT(lang, 'introKicker')}
                </p>
                <h3 className="factory-panel-title">
                  {factoryT(lang, 'title')}
                </h3>
                <p className="factory-body">{factoryT(lang, 'introBody')}</p>
                <ul className="factory-facts">
                  <li>{factoryT(lang, 'introRule')}</li>
                </ul>
                <p className="factory-reward">
                  {factoryT(lang, 'rewardNote')}
                </p>
                <p className="factory-landscape">
                  {factoryT(lang, 'landscapeNote')}
                </p>
              </div>
              <div className="factory-intro-art" aria-hidden="true">
                <div className="factory-hero">
                  <span className="factory-hero-moon" />
                  <span className="factory-hero-hill h1" />
                  <span className="factory-hero-hill h2" />
                  <span className="factory-hero-machine m1">⛏️</span>
                  <span className="factory-hero-pipe p1" />
                  <span className="factory-hero-machine m2">⚡</span>
                  <span className="factory-hero-pipe p2" />
                  <span className="factory-hero-machine m3">🫧</span>
                  <span className="factory-hero-pipe p3" />
                  <span className="factory-hero-machine m4">🔥</span>
                  <span className="factory-hero-smoke s1" />
                  <span className="factory-hero-smoke s2" />
                  <span className="factory-hero-cat">
                    <img src="/brand/avatar-silver-512.webp" alt="" />
                  </span>
                </div>
              </div>
              <div className="factory-panel-actions">
                <button
                  type="button"
                  className="factory-button factory-primary"
                  onClick={startGame}
                  data-testid="factory-start"
                >
                  <span aria-hidden="true">▶</span> {factoryT(lang, 'start')}
                </button>
                <button
                  type="button"
                  className="factory-button"
                  onClick={close}
                  data-testid="factory-back"
                >
                  {factoryT(lang, 'back')}
                </button>
              </div>
            </div>
          ) : null}

          {stage === 'result' && result ? (
            <div className="factory-panel factory-result" data-testid="factory-result">
              <Confetti count={24} />
              <div className="factory-result-body">
                <div className="factory-result-hero">
                  <span className="factory-result-trophy" aria-hidden="true">
                    🏆
                  </span>
                  <div>
                    <p className="factory-kicker">
                      {factoryT(lang, 'eyebrow')}
                    </p>
                    <h3 className="factory-panel-title">
                      {factoryT(lang, 'resultTitle')}
                    </h3>
                  </div>
                </div>
                <p className="factory-body">{factoryT(lang, 'resultBody')}</p>
                <div className="factory-result-stats">
                  <div className="factory-stat">
                    <span
                      className="factory-stat-value"
                      data-testid="factory-result-stations"
                    >
                      {FACTORY_STATION_TOTAL}/{FACTORY_STATION_TOTAL}
                    </span>
                    <span className="factory-stat-label">
                      {factoryT(lang, 'stationsLabel')}
                    </span>
                  </div>
                  <div className="factory-stat factory-stat-cheer">
                    <span className="factory-stat-value">★★★</span>
                    <span className="factory-stat-label">
                      {factoryT(lang, 'guideResult')}
                    </span>
                  </div>
                </div>
                <p
                  className={
                    result.earned
                      ? 'factory-reward factory-reward-won'
                      : 'factory-reward'
                  }
                  data-testid="factory-result-reward"
                >
                  {rewardLine}
                </p>
                <h4 className="factory-fact-title">
                  {factoryT(lang, 'factSectionTitle')}
                </h4>
                <ul className="factory-fact-list">
                  {FACTORY_STATIONS.map((station) => (
                    <li
                      key={station.id}
                      className="factory-fact-item"
                      data-testid="factory-fact-item"
                    >
                      <span
                        className="factory-fact-icon"
                        aria-hidden="true"
                      >
                        {station.icon}
                      </span>
                      <div>
                        <strong>{station.title[lang]}</strong>
                        {station.facts.map((fact, index) => (
                          <p key={`${station.id}-fact-${index}`}>
                            {fact[lang]}
                          </p>
                        ))}
                      </div>
                    </li>
                  ))}
                  <li
                    className="factory-fact-item factory-fact-extra"
                    data-testid="factory-why"
                  >
                    <span className="factory-fact-icon" aria-hidden="true">
                      🗺️
                    </span>
                    <div>
                      <strong>{factoryT(lang, 'whyTitle')}</strong>
                      <p>{FACTORY_WHY[lang]}</p>
                    </div>
                  </li>
                  <li
                    className="factory-fact-item factory-fact-extra"
                    data-testid="factory-moxie"
                  >
                    <span className="factory-fact-icon" aria-hidden="true">
                      🫁
                    </span>
                    <div>
                      <strong>{factoryT(lang, 'moxieTitle')}</strong>
                      <p>{FACTORY_MOXIE[lang]}</p>
                    </div>
                  </li>
                </ul>
                <div className="factory-sources">
                  <span className="factory-sources-label">
                    {factoryT(lang, 'sources')}
                  </span>
                  <ul>
                    {SOURCES.map((source) => (
                      <li key={source.key}>
                        <a href={source.href} target="_blank" rel="noreferrer">
                          {factoryT(lang, source.key)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="factory-panel-actions">
                <button
                  type="button"
                  className="factory-button factory-primary"
                  onClick={startGame}
                  data-testid="factory-replay"
                >
                  {factoryT(lang, 'replay')}
                </button>
                <button
                  type="button"
                  className="factory-button"
                  onClick={close}
                  data-testid="factory-exit"
                >
                  {factoryT(lang, 'back')}
                </button>
              </div>
            </div>
          ) : null}

          {burst > 0 && stage !== 'result' ? (
            <Confetti key={`burst-${burst}`} count={16} />
          ) : null}

          {toast ? (
            <p className="factory-toast" aria-hidden="true">
              {toast}
            </p>
          ) : null}
          <p className="factory-sr-only" aria-live="polite">
            {announcement}
          </p>
        </div>
      </div>
    </div>
  );
}
