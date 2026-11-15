import { useEffect, useReducer, useState } from 'react';
import { drawEventFor } from './game/deck';
import { KNOWLEDGE_IDS } from './game/knowledge';
import { DEFAULT_SEED, createInitialState, gameReducer, silverCardFor } from './game/reducer';
import { randomSeed } from './game/seed';
import type { CatId, Difficulty, Lang } from './game/types';
import { buildVideoState, type VideoMode } from './game/video';
import LanderOverlay from './minigames/LanderOverlay';
import RadiationOverlay from './minigames/RadiationOverlay';
import WaterFuelFactory from './minigames/factory/WaterFuelFactory';
import SpaceFoodFlip from './minigames/food/SpaceFoodFlip';
import LowGravityHop from './minigames/hop/LowGravityHop';
import { Backpack } from './ui/Backpack';
import { BriefingScreen } from './ui/BriefingScreen';
import { DataPanel } from './ui/DataPanel';
import { EventCardView } from './ui/EventCardView';
import { GameOver } from './ui/GameOver';
import { KnowledgeSheet } from './ui/KnowledgeSheet';
import { MissionReport } from './ui/MissionReport';
import { OpeningScene } from './ui/OpeningScene';
import { ResourceHud } from './ui/ResourceHud';
import { RotateHint } from './ui/RotateHint';
import { SolNav } from './ui/SolNav';
import { SolReview } from './ui/SolReview';
import { StoryOpening } from './ui/StoryOpening';
import { TitleScreen } from './ui/TitleScreen';

const LANG_KEY = 'meowstronauts.lang';
const BACKPACK_KEY = 'meowstronauts.backpack';

function readLang(): Lang {
  try {
    return window.localStorage.getItem(LANG_KEY) === 'zh-TW' ? 'zh-TW' : 'en';
  } catch {
    return 'en';
  }
}

function readBackpack(): string[] {
  try {
    const raw = window.localStorage.getItem(BACKPACK_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === 'string')
      .filter((item) => KNOWLEDGE_IDS.includes(item))
      .slice(0, 20);
  } catch {
    return [];
  }
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const rawVideo = params.get('video');
  const videoMode: VideoMode | undefined =
    rawVideo === 's1' || rawVideo === 'report' ? rawVideo : undefined;
  const scene = params.get('scene');
  const storyScene = scene?.match(/^opening([1-6])$/)?.[1];
  const storySceneNumber = storyScene && storyScene !== '2' ? Number(storyScene) : undefined;
  const langParam = params.get('lang');
  const reset = params.get('reset') === '1';
  const seedParam = params.get('seed')?.trim();

  const [seed, setSeed] = useState(() => seedParam ?? '');
  const [opening, setOpening] = useState(scene === 'opening2');
  const [storyOpen, setStoryOpen] = useState(Boolean(storySceneNumber));
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('officer');
  const [knowledgeId, setKnowledgeId] = useState<string | null>(null);
  const [backpackOpen, setBackpackOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  /** A finished sol the crew is looking back at; null keeps the live screens. */
  const [viewSol, setViewSol] = useState<number | null>(null);
  const [landerOpen, setLanderOpen] = useState(false);
  const [hopOpen, setHopOpen] = useState(false);
  const [foodOpen, setFoodOpen] = useState(false);
  const [factoryOpen, setFactoryOpen] = useState(false);
  const [radiationOpen, setRadiationOpen] = useState(false);

  const [state, dispatch] = useReducer(gameReducer, undefined, () => {
    if (videoMode) return buildVideoState(videoMode);

    if (reset) {
      try {
        window.localStorage.removeItem(LANG_KEY);
        window.localStorage.removeItem(BACKPACK_KEY);
      } catch {
        // localStorage may be unavailable; the game still runs in memory.
      }
    }

    const lang: Lang =
      langParam === 'en' || langParam === 'zh-TW' ? langParam : readLang();
    const initial = createInitialState(
      'officer',
      lang,
      undefined,
      reset ? [] : readBackpack(),
      seed || DEFAULT_SEED,
    );
    if (storySceneNumber) {
      return gameReducer(initial, {
        type: 'START_GAME',
        difficulty: 'officer',
        seed: seed || randomSeed(),
      });
    }
    return initial;
  });

  useEffect(() => {
    if (videoMode) return;
    try {
      window.localStorage.setItem(LANG_KEY, state.lang);
      window.localStorage.setItem(BACKPACK_KEY, JSON.stringify(state.collectedCards));
    } catch {
      // Ignore storage failures; nothing about the mission depends on it.
    }
  }, [state.lang, state.collectedCards, videoMode]);

  useEffect(() => {
    if (videoMode) return;
    if (window.scrollY > 0) window.scrollTo(0, 0);
  }, [state.phase, videoMode]);

  // A new sol always opens live; a review never carries over to tomorrow.
  useEffect(() => {
    setViewSol(null);
  }, [state.sol]);

  const toggleLang = () => {
    dispatch({ type: 'SET_LANG', lang: state.lang === 'en' ? 'zh-TW' : 'en' });
  };

  const openCard = (cardId: string) => {
    setBackpackOpen(false);
    setKnowledgeId(cardId);
  };

  const collectCard = (cardId: string) => {
    dispatch({ type: 'COLLECT_CARD', cardId });
  };

  const openLander = () => {
    setLanderOpen(true);
    setRadiationOpen(false);
    setHopOpen(false);
    setFoodOpen(false);
    setFactoryOpen(false);
  };

  const openShelter = () => {
    setRadiationOpen(true);
    setLanderOpen(false);
    setHopOpen(false);
    setFoodOpen(false);
    setFactoryOpen(false);
  };

  const openFactory = () => {
    setFactoryOpen(true);
    setLanderOpen(false);
    setHopOpen(false);
    setFoodOpen(false);
    setRadiationOpen(false);
  };

  const startGame = () => {
    const finalSeed = seed.trim() || randomSeed();
    if (seed.trim() && finalSeed !== seed) setSeed(finalSeed);
    dispatch({ type: 'START_GAME', difficulty: selectedDifficulty, seed: finalSeed });
    setStoryOpen(true);
  };

  if (opening) {
    return (
      <>
        <OpeningScene lang={state.lang} onDone={() => setOpening(false)} />
        <RotateHint lang={state.lang} />
      </>
    );
  }

  if (state.phase === 'report') {
    return (
      <>
        <RotateHint lang={state.lang} />
        <div className="app-shell">
          <MissionReport state={state} onRestart={() => dispatch({ type: 'RESTART' })} />
        </div>
        {knowledgeId && (
          <KnowledgeSheet
            cardId={knowledgeId}
            lang={state.lang}
            collected={state.collectedCards.includes(knowledgeId)}
            onClose={() => setKnowledgeId(null)}
            onCollect={(id) => dispatch({ type: 'COLLECT_CARD', cardId: id })}
          />
        )}
      </>
    );
  }

  if (state.phase === 'gameover') {
    return (
      <>
        <div className="app-shell">
          <GameOver lang={state.lang} onRestart={() => dispatch({ type: 'RESTART' })} />
        </div>
        <RotateHint lang={state.lang} />
      </>
    );
  }

  if (state.phase === 'title') {
    return (
      <>
        <RotateHint lang={state.lang} />
        <TitleScreen
          lang={state.lang}
          difficulty={selectedDifficulty}
          seed={seed}
          onDifficulty={setSelectedDifficulty}
          onSeedChange={setSeed}
          onRandomSeed={() => setSeed(randomSeed())}
          onStart={startGame}
          onToggleLang={toggleLang}
        />
        {knowledgeId && (
          <KnowledgeSheet
            cardId={knowledgeId}
            lang={state.lang}
            collected={state.collectedCards.includes(knowledgeId)}
            onClose={() => setKnowledgeId(null)}
            onCollect={(id) => dispatch({ type: 'COLLECT_CARD', cardId: id })}
          />
        )}
      </>
    );
  }

  if (storyOpen && state.phase === 'briefing') {
    return (
      <>
        <RotateHint lang={state.lang} />
        <StoryOpening
          lang={state.lang}
          initialScene={storySceneNumber ?? 1}
          paused={Boolean(knowledgeId)}
          onDone={() => setStoryOpen(false)}
          onTerm={openCard}
          onCollectCard={collectCard}
        />
        {knowledgeId && (
          <KnowledgeSheet
            cardId={knowledgeId}
            lang={state.lang}
            collected={state.collectedCards.includes(knowledgeId)}
            onClose={() => setKnowledgeId(null)}
            onCollect={(id) => dispatch({ type: 'COLLECT_CARD', cardId: id })}
          />
        )}
      </>
    );
  }

  const briefingEvent = state.phase === 'briefing' ? drawEventFor(state) : undefined;
  const missionPhase =
    state.phase === 'briefing' || state.phase === 'choice' || state.phase === 'result';
  const reviewSol = missionPhase && viewSol !== null && viewSol < state.sol ? viewSol : null;

  return (
    <div className="app-shell">
      <RotateHint lang={state.lang} />
      <ResourceHud
        state={state}
        onBackpack={() => setBackpackOpen(true)}
        onData={() => setDataOpen(true)}
        onToggleLang={videoMode ? undefined : toggleLang}
      />

      {missionPhase && (
        <SolNav
          lang={state.lang}
          currentSol={state.sol}
          selectedSol={reviewSol ?? state.sol}
          onSelect={(sol) => setViewSol(sol < state.sol ? sol : null)}
          onLander={openLander}
          onHop={videoMode ? undefined : () => setHopOpen(true)}
          onFood={videoMode ? undefined : () => setFoodOpen(true)}
          onShelter={videoMode ? undefined : openShelter}
        />
      )}

      {reviewSol !== null ? (
        <SolReview
          state={state}
          sol={reviewSol}
          onBack={() => setViewSol(null)}
          onTerm={openCard}
        />
      ) : (
        <>
          {state.phase === 'briefing' && briefingEvent && (
            <BriefingScreen
              state={state}
              event={briefingEvent}
              onBegin={(eventId) => dispatch({ type: 'OPEN_EVENT', eventId })}
              onTerm={openCard}
              onHopPractice={videoMode ? undefined : () => setHopOpen(true)}
              onFoodPractice={videoMode ? undefined : () => setFoodOpen(true)}
              onFactoryPractice={videoMode ? undefined : openFactory}
            />
          )}

          {(state.phase === 'choice' || state.phase === 'result') && (
            <EventCardView
              state={state}
              onChoose={(choiceId) => dispatch({ type: 'CHOOSE', choiceId })}
              onAssist={(cat: CatId, variant?: 'power' | 'food' | 'lifeSupport') => {
                if (cat === 'silver') {
                  const card = silverCardFor(state);
                  if (card) setKnowledgeId(card);
                }
                dispatch({ type: 'USE_ASSIST', cat, variant });
              }}
              onTerm={openCard}
              onContinue={() => dispatch({ type: 'CONTINUE' })}
              onOpenCard={openCard}
              onCollectCard={collectCard}
              onFactoryPractice={videoMode ? undefined : openFactory}
            />
          )}
        </>
      )}

      {knowledgeId && (
        <KnowledgeSheet
          cardId={knowledgeId}
          lang={state.lang}
          collected={state.collectedCards.includes(knowledgeId)}
          onClose={() => setKnowledgeId(null)}
          onCollect={(id) => dispatch({ type: 'COLLECT_CARD', cardId: id })}
        />
      )}

      {backpackOpen && (
        <Backpack
          lang={state.lang}
          collected={state.collectedCards}
          onClose={() => setBackpackOpen(false)}
          onOpenCard={openCard}
        />
      )}

      {dataOpen && (
        <DataPanel
          lang={state.lang}
          onClose={() => setDataOpen(false)}
          showLive={!videoMode}
        />
      )}

      {landerOpen && (
        <LanderOverlay initialLang={state.lang} onClose={() => setLanderOpen(false)} />
      )}

      {hopOpen && (
        <LowGravityHop
          lang={state.lang}
          rewarded={state.hopRewarded}
          onComplete={(samples) => dispatch({ type: 'COMPLETE_HOP', samples })}
          onExit={() => setHopOpen(false)}
        />
      )}

      {foodOpen && (
        <SpaceFoodFlip
          lang={state.lang}
          onExit={() => setFoodOpen(false)}
        />
      )}

      {factoryOpen && (
        <WaterFuelFactory
          lang={state.lang}
          rewarded={state.factoryRewarded}
          lifeSupport={state.resources.lifeSupport}
          onComplete={(stations) =>
            dispatch({ type: 'COMPLETE_FACTORY', stations })
          }
          onExit={() => setFactoryOpen(false)}
        />
      )}

      {radiationOpen && (
        <RadiationOverlay
          initialLang={state.lang}
          onClose={() => setRadiationOpen(false)}
          onComplete={collectCard}
        />
      )}
    </div>
  );
}
