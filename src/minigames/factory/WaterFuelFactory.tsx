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
import { factoryT } from './game/i18n';
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
  const [result, setResult] = useState<FactoryResult | null>(null);

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

  const showHint = useCallback(
    (message: string) => {
      setAnnouncement(message);
      showToast(message);
    },
    [showToast],
  );

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
  const act = (action: FactoryAction, hint?: string): FactoryGame | null => {
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
      showToast(factoryT(lang, 'stationDone'));
      if (isFactoryComplete(next)) {
        setAnnouncement(factoryT(lang, 'allDone'));
      } else {
        const station = FACTORY_STATIONS[next.stationIndex];
        if (station) {
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
    const next = act({ type: 'DIG', spot }, factoryT(lang, 'digHint'));
    if (next) setAnnouncement(factoryT(lang, 'iceFound'));
  };

  const handleOven = (oven: OvenChoice) => {
    if (stage !== 'playing') return;
    const next = applyFactoryAction(game, { type: 'CHOOSE_OVEN', oven });
    setGame(next);
    if (oven === 'open') {
      showHint(factoryT(lang, 'ovenHint'));
    } else {
      setAnnouncement(factoryT(lang, 'sealedReady'));
    }
  };

  const handleBake = () => {
    if (game.mine.oven !== 'sealed') {
      showHint(factoryT(lang, 'ovenHint'));
      return;
    }
    act({ type: 'BAKE' }, factoryT(lang, 'ovenHint'));
  };

  const handleSplit = () => {
    const next = act({ type: 'SPLIT' });
    if (next) setAnnouncement(factoryT(lang, 'routeHint'));
  };

  const handleRoute = (gas: 'o2' | 'h2' | null, to: 'crew' | 'fuel') => {
    if (!gas) return;
    const next = act(
      { type: 'ROUTE_GAS', gas, to },
      factoryT(lang, 'gasHint'),
    );
    if (!next) return;
    setSelectedGas(null);
    if (!next.electrolysis.done) {
      setAnnouncement(factoryT(lang, 'gasRouted'));
    }
  };

  const handleCapture = (molecule: string) => {
    const next = act(
      { type: 'CAPTURE', molecule },
      factoryT(lang, 'moleculeHint'),
    );
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
    setAnnouncement(
      factoryT(lang, 'caught', {
        count: next.scrubber.caught.length,
        total: CO2_MOLECULE_IDS.length,
      }),
    );
  };

  const handleHeat = () => {
    act({ type: 'HEAT_FILTER' });
  };

  const handleReact = () => {
    const next = act({ type: 'REACT' });
    if (next) setAnnouncement(factoryT(lang, 'collectHint'));
  };

  const handleCollect = (
    output: 'methane' | 'water' | null,
    to: 'fuel' | 'water',
  ) => {
    if (!output) return;
    const next = act(
      { type: 'COLLECT_OUTPUT', output, to },
      factoryT(lang, 'collectHint'),
    );
    if (!next) return;
    setSelectedOutput(null);
    if (!next.reactor.done) {
      setAnnouncement(factoryT(lang, 'outputCollected'));
    }
  };

  const current =
    FACTORY_STATIONS[
      Math.min(game.stationIndex, FACTORY_STATIONS.length - 1)
    ] ?? FACTORY_STATIONS[0];
  const done = doneById(game);
  const completed = completedStationCount(game);

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
      <div className="factory-app">
        <header className="factory-header">
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
                      <span
                        className="factory-progress-icon"
                        aria-hidden="true"
                      >
                        {station.icon}
                      </span>
                      <span className="factory-progress-label">
                        {station.title[lang]}
                      </span>
                      {isDone ? (
                        <span
                          className="factory-progress-check"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      ) : null}
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

                  {current.id === 'mine' ? (
                    <div className="factory-machine">
                      <div
                        className="factory-radar"
                        role="group"
                        aria-label={factoryT(lang, 'station1Goal')}
                      >
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

                      <div className="factory-flow" aria-hidden="true">
                        <span>💧</span>
                        <span className="factory-flow-arrow">→</span>
                        <span className="factory-flow-label">
                          {factoryT(lang, 'saltFilter')}
                        </span>
                        <span className="factory-flow-arrow">→</span>
                        <span>🛢️</span>
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
                      {!game.electrolysis.split ? (
                        <button
                          type="button"
                          className="factory-button factory-primary"
                          data-testid="factory-power"
                          onClick={handleSplit}
                        >
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
                                  className={`factory-gas${
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
                              {factoryT(lang, 'crewAir')}
                            </button>
                            <button
                              type="button"
                              className="factory-tank"
                              data-testid="factory-tank-fuel"
                              disabled={!selectedGas}
                              onClick={() => handleRoute(selectedGas, 'fuel')}
                            >
                              <span aria-hidden="true">⛽</span>
                              {factoryT(lang, 'fuelTank')}
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
                              className={`factory-molecule${
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
                      <p className="factory-note">
                        {factoryT(lang, 'sampleNote')}
                      </p>
                      <p className="factory-count" data-testid="factory-caught-count">
                        {factoryT(lang, 'caught', {
                          count: game.scrubber.caught.length,
                          total: CO2_MOLECULE_IDS.length,
                        })}
                      </p>
                      {game.scrubber.caught.length >=
                      CO2_MOLECULE_IDS.length ? (
                        <button
                          type="button"
                          className="factory-button factory-primary"
                          data-testid="factory-heat"
                          onClick={handleHeat}
                        >
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
                      {!game.reactor.reacted ? (
                        <button
                          type="button"
                          className="factory-button factory-primary"
                          data-testid="factory-react"
                          onClick={handleReact}
                        >
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
                                  className={`factory-gas${
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
                              {factoryT(lang, 'fuelTank')}
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
                              {factoryT(lang, 'waterTank')}
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
                {FACTORY_STATIONS.map((station) => (
                  <span key={station.id} className="factory-intro-tile">
                    {station.icon}
                  </span>
                ))}
              </div>
              <div className="factory-panel-actions">
                <button
                  type="button"
                  className="factory-button factory-primary"
                  onClick={startGame}
                  data-testid="factory-start"
                >
                  {factoryT(lang, 'start')}
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
              <div className="factory-result-body">
                <p className="factory-kicker">
                  {factoryT(lang, 'eyebrow')}
                </p>
                <h3 className="factory-panel-title">
                  {factoryT(lang, 'resultTitle')}
                </h3>
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
