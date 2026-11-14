import { useCallback, useEffect, useRef, useState } from 'react';
import type { CatId, Lang } from '../../game/types';
import { AlertBoard } from './components/AlertBoard';
import { EventCard } from './components/EventCard';
import { InfoModal } from './components/InfoModal';
import { PrepPanel } from './components/PrepPanel';
import { ResultPanel } from './components/ResultPanel';
import { ShelterDiagram } from './components/ShelterDiagram';
import { PARTICLE_FRONT_SECONDS, SEP_CONFIRMED_AT_SECONDS } from './data/event';
import { CAT_ORDER, catIsLate } from './game/cats';
import { computeShield, evaluateDrill } from './game/dose';
import { t } from './game/i18n';
import {
  EMPTY_MATERIALS,
  canPlaceMaterial,
  isComplete,
} from './game/materials';
import type {
  DrillPhase,
  DrillResult,
  MaterialId,
  PlacedMaterials,
  SlotId,
} from './game/types';

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return reduced;
}

interface ShelterDrillProps {
  initialLang?: Lang;
  onExit?: () => void;
  onComplete?: (cardId: string) => void;
}

export default function ShelterDrill({
  initialLang,
  onExit,
  onComplete,
}: ShelterDrillProps = {}) {
  const [lang, setLang] = useState<Lang>(() => initialLang ?? 'en');
  const [phase, setPhase] = useState<DrillPhase>('prep');
  const [placed, setPlaced] = useState<PlacedMaterials>(EMPTY_MATERIALS);
  const [selectedSlot, setSelectedSlot] = useState<SlotId>('roof');
  const [elapsed, setElapsed] = useState(0);
  const [recall, setRecall] = useState<Record<CatId, number | null>>({
    shadow: null,
    silver: null,
    ginger: null,
  });
  const [result, setResult] = useState<DrillResult | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  const phaseRef = useRef<DrillPhase>(phase);
  phaseRef.current = phase;
  const recallRef = useRef(recall);
  recallRef.current = recall;
  const moveTimerRef = useRef<number | null>(null);
  const stormTimerRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(
    () => () => {
      if (moveTimerRef.current !== null) window.clearTimeout(moveTimerRef.current);
      if (stormTimerRef.current !== null) window.clearTimeout(stormTimerRef.current);
    },
    [],
  );

  // The particle-front clock. Capped deltas mean a background tab pauses the
  // drill instead of skipping the whole countdown when the player returns.
  useEffect(() => {
    if (phase !== 'alert') return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min(0.2, (now - last) / 1000);
      last = now;
      setElapsed((value) => Math.min(PARTICLE_FRONT_SECONDS, value + delta));
    }, 100);
    return () => window.clearInterval(timer);
  }, [phase]);

  const finishAlert = useCallback(() => {
    if (phaseRef.current !== 'alert') return;
    phaseRef.current = 'storm';
    const lateIds = CAT_ORDER.filter((id) =>
      catIsLate(id, recallRef.current[id], PARTICLE_FRONT_SECONDS),
    );
    const shield = computeShield(placed);
    const drill = evaluateDrill(lateIds, shield);
    setResult(drill);
    setPhase('storm');
    if (reduceMotion) {
      setPhase('result');
      return;
    }
    stormTimerRef.current = window.setTimeout(() => {
      stormTimerRef.current = null;
      setPhase('result');
    }, 2200);
  }, [placed, reduceMotion]);

  useEffect(() => {
    if (phase === 'alert' && elapsed >= PARTICLE_FRONT_SECONDS) finishAlert();
  }, [phase, elapsed, finishAlert]);

  useEffect(() => {
    if (phase !== 'result' || completedRef.current) return;
    completedRef.current = true;
    onComplete?.('radiationShielding');
  }, [phase, onComplete]);

  const toggleLang = useCallback(() => {
    setLang((value) => (value === 'en' ? 'zh-TW' : 'en'));
  }, []);

  const selectSlot = useCallback((slot: SlotId) => {
    setSelectedSlot(slot);
  }, []);

  const placeMaterial = useCallback(
    (id: MaterialId) => {
      setPlaced((current) =>
        canPlaceMaterial(id, selectedSlot, current)
          ? { ...current, [selectedSlot]: id }
          : current,
      );
    },
    [selectedSlot],
  );

  const clearSlot = useCallback((slot: SlotId) => {
    setPlaced((current) => ({ ...current, [slot]: null }));
  }, []);

  const moveToShelter = useCallback(() => {
    if (!isComplete(placed) || phaseRef.current !== 'prep') return;
    setPhase('moving');
    const delay = reduceMotion ? 180 : 900;
    moveTimerRef.current = window.setTimeout(() => {
      moveTimerRef.current = null;
      setElapsed(0);
      setPhase('alert');
    }, delay);
  }, [placed, reduceMotion]);

  const recallCat = useCallback(
    (id: CatId) => {
      if (phaseRef.current !== 'alert') return;
      setRecall((current) =>
        current[id] !== null ? current : { ...current, [id]: elapsed },
      );
    },
    [elapsed],
  );

  const closeHatch = useCallback(() => {
    const allInside = CAT_ORDER.every(
      (id) => !catIsLate(id, recallRef.current[id], PARTICLE_FRONT_SECONDS),
    );
    if (allInside) finishAlert();
  }, [finishAlert]);

  const retry = useCallback(() => {
    if (stormTimerRef.current !== null) {
      window.clearTimeout(stormTimerRef.current);
      stormTimerRef.current = null;
    }
    setPhase('prep');
    setElapsed(0);
    setRecall({ shadow: null, silver: null, ginger: null });
    setResult(null);
  }, []);

  const insideIds = result
    ? result.cats.filter((cat) => !cat.late).map((cat) => cat.id)
    : undefined;
  const lateIds = result
    ? result.cats.filter((cat) => cat.late).map((cat) => cat.id)
    : [];

  return (
    <div className="shelter-app" data-testid="shelter-game">
      <header className="shelter-header">
        <div className="shelter-brand">
          <span className="shelter-mark" aria-hidden="true">
            ☢️
          </span>
          <div>
            <p className="eyebrow">{t(lang, 'eyebrow')}</p>
            <h1>{t(lang, 'title')}</h1>
            <p className="shelter-subtitle">{t(lang, 'subtitle')}</p>
          </div>
        </div>
        <div className="shelter-header-actions">
          {phase !== 'alert' && phase !== 'storm' && (
            <button
              type="button"
              className="ghost-button shelter-header-button"
              data-testid="shelter-info-open"
              onClick={() => setInfoOpen(true)}
            >
              {t(lang, 'dataCredits')}
            </button>
          )}
          <button
            type="button"
            className="ghost-button shelter-header-button"
            data-testid="shelter-lang"
            onClick={toggleLang}
          >
            {t(lang, 'languageButton')}
          </button>
          <button
            type="button"
            className="ghost-button shelter-header-button"
            data-testid="shelter-exit"
            onClick={() => onExit?.()}
          >
            {t(lang, 'backToBase')}
          </button>
        </div>
      </header>

      {phase === 'prep' || phase === 'moving' ? (
        <main className="shelter-main prep-layout">
          <div className="prep-stage-column">
            <ShelterDiagram
              lang={lang}
              placed={placed}
              selectedSlot={selectedSlot}
              onSelectSlot={selectSlot}
              moving={phase === 'moving'}
              reducedMotion={reduceMotion}
              showCrew={false}
            />
            <EventCard lang={lang} onInfo={() => setInfoOpen(true)} />
          </div>
          <PrepPanel
            lang={lang}
            placed={placed}
            selectedSlot={selectedSlot}
            onSelectSlot={selectSlot}
            onPlace={placeMaterial}
            onClear={clearSlot}
            moving={phase === 'moving'}
            onMove={moveToShelter}
          />
        </main>
      ) : null}

      {phase === 'alert' ? (
        <main className="shelter-main alert-layout">
          <AlertBoard
            lang={lang}
            elapsed={elapsed}
            recall={recall}
            frontSeconds={PARTICLE_FRONT_SECONDS}
            sepConfirmedAt={SEP_CONFIRMED_AT_SECONDS}
            onRecall={recallCat}
            onCloseHatch={closeHatch}
          />
          <EventCard lang={lang} />
        </main>
      ) : null}

      {phase === 'storm' && !reduceMotion ? (
        <main className="shelter-main storm-layout">
          <ShelterDiagram
            lang={lang}
            placed={placed}
            storm
            insideIds={insideIds}
            lateIds={lateIds}
            reducedMotion={false}
          />
          <div className="storm-caption">
            <p className="eyebrow">{t(lang, 'eventLabel')}</p>
            <h2>{t(lang, 'stormTitle')}</h2>
            <p>{t(lang, 'stormBody')}</p>
          </div>
        </main>
      ) : null}

      {phase === 'result' && result ? (
        <main className="shelter-main result-layout">
          <div className="result-stage">
            <ShelterDiagram
              lang={lang}
              placed={placed}
              storm
              insideIds={insideIds}
              lateIds={lateIds}
              reducedMotion={reduceMotion}
            />
          </div>
          <ResultPanel
            lang={lang}
            result={result}
            placed={placed}
            onRetry={retry}
            onExit={() => onExit?.()}
          />
        </main>
      ) : null}

      {infoOpen && <InfoModal lang={lang} onClose={() => setInfoOpen(false)} />}
    </div>
  );
}
