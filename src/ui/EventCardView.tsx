import { useEffect, useRef, useState } from 'react';
import { EVENT_BY_ID } from '../game/events';
import { artForEvent } from '../game/eventArt';
import type { CatId, Choice, EffectMap, GameState, ResourceKey } from '../game/types';
import { RESOURCE_LABEL_KEY, CAT_NAMES, t } from '../i18n';
import { faceFor } from './catFaces';
import { DustMinigame } from './DustMinigame';
import HullRepairOverlay from '../minigames/HullRepairOverlay';
import RadiationOverlay from '../minigames/RadiationOverlay';
import SpaceFoodFlip from '../minigames/food/SpaceFoodFlip';
import TomatoHarvestOverlay from '../minigames/tomato/TomatoHarvestOverlay';
import { ICONS } from './ResourceHud';
import { RestPhotos } from './RestPhotos';
import { RichText } from './RichText';
import { SceneStage } from './SceneStage';

/**
 * Choices that get a short hands-on beat before they resolve. Only the ones
 * where the crew actually goes out to the panels — "leave it for now" must
 * not open a sweeping game. T1 is the first card of every run, so the player
 * meets the sweeping game on Sol 1, not only when P1 happens to be drawn.
 */
const DUST_CHOICES: Record<string, string[]> = {
  T1: ['sweep'],
  P1: ['clean', 'shake'],
};

/**
 * S2's first choice is the physical hull patch. It gets the repair-drone
 * mini-game before the card resolves; the other two choices resolve at once.
 */
const HULL_CHOICES: Record<string, string[]> = {
  S2: ['patch'],
};

/**
 * Sol 4's flare warning and S3's shelter inspection. The options that send the
 * crew into the shelter open the drill first; the card resolves only after the
 * player returns from it. S3's "skip it" resolves at once.
 */
const SHELTER_CHOICES: Record<string, string[]> = {
  S1: ['shield-up', 'shelter'],
  S3: ['full-check', 'key-points'],
};

/**
 * Cards whose story is the same water and oxygen chemistry as the factory get
 * the practice entry while the choice is open: L3's saturated scrubber, L1's
 * oxygen unit, L2's recycling loop and SC2's subsurface ice.
 */
const FACTORY_EVENTS = ['L1', 'L2', 'L3', 'SC2'];

/**
 * F3's crate is late: rationing and opening the emergency stores both mean
 * handling the crate by hand, so the space-food flip opens before the choice
 * resolves. "Send the rover" is the crew's other way out and resolves at once.
 * Design: docs/space-food-flip.md §1.
 */
const FOOD_CHOICES: Record<string, string[]> = {
  F3: ['ration', 'stores'],
};

/**
 * F1's first option is the actual harvest. Clicking it opens the tomato
 * picking game; the card resolves only after the harvest is finished.
 */
const TOMATO_CHOICES: Record<string, string[]> = {
  F1: ['harvest-all'],
};

interface PendingInteraction {
  kind: 'dust' | 'hull' | 'shelter' | 'food' | 'tomato';
  choiceId: string;
}

const CATEGORY_LABEL: Record<string, { en: string; 'zh-TW': string }> = {
  power: { en: 'Power', 'zh-TW': '電力' },
  lifeSupport: { en: 'Life support', 'zh-TW': '生命維持' },
  shield: { en: 'Shielding', 'zh-TW': '輻射遮蔽' },
  food: { en: 'Food', 'zh-TW': '食物' },
  comms: { en: 'Communications', 'zh-TW': '通訊' },
  science: { en: 'Science', 'zh-TW': '科學' },
  morale: { en: 'Morale', 'zh-TW': '士氣' },
};

function signed(value: number): string {
  return value > 0 ? `+${value}` : `−${Math.abs(value)}`;
}

export function EffectChips({
  effects,
  lang,
}: {
  effects: EffectMap;
  lang: GameState['lang'];
}) {
  const entries = Object.entries(effects) as [ResourceKey, number][];
  if (entries.length === 0) return <span className="muted">—</span>;
  return (
    <span className="effect-chips">
      {entries.map(([key, value]) => (
        <span className={value < 0 ? 'effect-chip effect-negative' : 'effect-chip'} key={key}>
          <span aria-hidden="true">{ICONS[key]}</span> {t(lang, RESOURCE_LABEL_KEY[key])}{' '}
          {signed(value)}
        </span>
      ))}
    </span>
  );
}

interface EventCardViewProps {
  state: GameState;
  onChoose: (choiceId: string) => void;
  onAssist: (cat: CatId, variant?: 'power' | 'food' | 'lifeSupport') => void;
  onTerm: (cardId: string) => void;
  onContinue: () => void;
  onOpenCard: (cardId: string) => void;
  /** Adds a mini-game reward to the backpack without opening the sheet. */
  onCollectCard?: (cardId: string) => void;
  /**
   * The water & fuel factory practice entry. The cards whose story is the
   * same water and oxygen chemistry — L3's scrubber, L1's oxygen unit, L2's
   * recycling loop, SC2's subsurface ice — show it while a choice is open.
   * Video mode withholds the prop, like the other practice entries.
   */
  onFactoryPractice?: () => void;
}

export function EventCardView({
  state,
  onChoose,
  onAssist,
  onTerm,
  onContinue,
  onOpenCard,
  onCollectCard,
  onFactoryPractice,
}: EventCardViewProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState<PendingInteraction | null>(null);
  const shelterDoneRef = useRef(false);

  useEffect(() => {
    const body = bodyRef.current;
    if (state.phase === 'result' && body && body.scrollHeight > body.clientHeight) {
      body.scrollTop = body.scrollHeight;
    }
  }, [state.phase]);

  const event = state.currentEventId ? EVENT_BY_ID.get(state.currentEventId) : undefined;
  if (!event) return null;

  const lang = state.lang;
  const chosen: Choice | undefined = event.choices.find(
    (choice) => choice.id === state.lastChoiceId,
  );
  const isChoice = state.phase === 'choice';
  const isResult = state.phase === 'result';
  const category = CATEGORY_LABEL[event.category] ?? CATEGORY_LABEL.power;
  const art = artForEvent(event.id);
  const facePhase = isResult ? (state.lastSuccess ? 'success' : 'fail') : 'choice';
  const dustChoices = DUST_CHOICES[event.id];
  const hullChoices = HULL_CHOICES[event.id];
  const shelterChoices = SHELTER_CHOICES[event.id];
  const foodChoices = FOOD_CHOICES[event.id];
  const tomatoChoices = TOMATO_CHOICES[event.id];
  const showDustGame = isChoice && pending?.kind === 'dust' && Boolean(art);
  const showHullGame = isChoice && pending?.kind === 'hull';
  const showShelterGame = isChoice && pending?.kind === 'shelter';
  const showFoodGame = isChoice && pending?.kind === 'food';
  const showTomatoGame = isChoice && pending?.kind === 'tomato';

  const handleChoose = (choiceId: string) => {
    if (dustChoices?.includes(choiceId)) {
      setPending({ kind: 'dust', choiceId });
      return;
    }
    if (hullChoices?.includes(choiceId)) {
      setPending({ kind: 'hull', choiceId });
      return;
    }
    if (shelterChoices?.includes(choiceId) && !state.videoMode) {
      shelterDoneRef.current = false;
      setPending({ kind: 'shelter', choiceId });
      return;
    }
    if (foodChoices?.includes(choiceId) && !state.videoMode) {
      setPending({ kind: 'food', choiceId });
      return;
    }
    if (tomatoChoices?.includes(choiceId) && !state.videoMode) {
      setPending({ kind: 'tomato', choiceId });
      return;
    }
    onChoose(choiceId);
  };

  const closeShelter = () => {
    if (!pending || pending.kind !== 'shelter') return;
    const choiceId = pending.choiceId;
    setPending(null);
    if (shelterDoneRef.current) {
      onChoose(choiceId);
    }
  };

  return (
    <main className={`event-shell ${isResult ? 'is-result' : ''}`}>
      {art && <SceneStage src={art.src} alt={art.alt[lang]} />}
      <article className="event-card" data-testid={`event-card-${event.id}`}>
        <div className="event-body" ref={bodyRef}>
        <header className="event-head">
          <img
            className="cat-avatar"
            data-testid="event-avatar"
            key={facePhase}
            src={faceFor(event.cat, facePhase)}
            alt={CAT_NAMES[event.cat][lang]}
          />
          <div>
            <p className="eyebrow">
              <span className="incident-tag">{t(lang, 'event.incident')}</span>
              {category[lang]} · {t(lang, 'briefing.sol', { sol: state.sol })}
            </p>
            <h1>{event.title[lang]}</h1>
          </div>
        </header>

        <p className="event-brief">
          <RichText text={event.brief[lang]} lang={lang} onTerm={onTerm} />
        </p>

        {isChoice && onFactoryPractice && FACTORY_EVENTS.includes(event.id) && (
          <button
            type="button"
            className="factory-practice-button"
            data-testid="event-factory-practice"
            onClick={onFactoryPractice}
          >
            <span aria-hidden="true">🏭</span>
            {t(lang, 'briefing.factoryGame')}
          </button>
        )}

        {isChoice &&
          !showDustGame &&
          !showHullGame &&
          !showShelterGame &&
          !showFoodGame &&
          !showTomatoGame && (
          <>
            <h2 className="section-label">{t(lang, 'event.choose')}</h2>
            <div className="choices">
              {event.choices.map((choice) => {
                const charges = choice.requires ? state.catCharges[choice.requires] : 1;
                const disabled = Boolean(choice.requires && charges <= 0);
                return (
                  <button
                    type="button"
                    className="choice-button"
                    key={choice.id}
                    data-testid={`choice-${choice.id}`}
                    disabled={disabled}
                    onClick={() => handleChoose(choice.id)}
                  >
                    <span className="choice-label">{choice.label[lang]}</span>
                    <EffectChips effects={choice.effects} lang={lang} />
                    <span className="choice-meta">
                      {choice.risk && (
                        <span className="risk-label">
                          {t(lang, 'event.risk', {
                            percent: Math.round(choice.risk.chance * 100),
                          })}
                        </span>
                      )}
                      {choice.requires && (
                        <span>
                          {t(lang, 'event.requires', {
                            cat: CAT_NAMES[choice.requires][lang],
                          })}{' '}
                          · {t(lang, 'assist.left', { count: charges })}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <section className="assists">
              <h2 className="section-label">{t(lang, 'assist.title')}</h2>
              <div className="assist-row">
                <button
                  type="button"
                  className="assist-button"
                  disabled={state.catCharges.silver <= 0}
                  onClick={() => onAssist('silver')}
                >
                  <img className="assist-avatar" src="/brand/avatar-silver-512.webp" alt="" /> {t(lang, 'assist.silver')}
                  <small>{t(lang, 'assist.left', { count: state.catCharges.silver })}</small>
                </button>
                <button
                  type="button"
                  className="assist-button"
                  disabled={state.catCharges.shadow <= 0}
                  onClick={() => onAssist('shadow')}
                >
                  <img className="assist-avatar" src="/brand/avatar-shadow-512.webp" alt="" /> {t(lang, 'assist.shadow')}
                  <small>{t(lang, 'assist.left', { count: state.catCharges.shadow })}</small>
                </button>
                <button
                  type="button"
                  className="assist-button"
                  disabled={state.catCharges.ginger <= 0}
                  onClick={() => onAssist('ginger', 'food')}
                >
                  <img className="assist-avatar" src="/brand/avatar-ginger-512.webp" alt="" /> {t(lang, 'assist.gingerFood')}
                  <small>{t(lang, 'assist.left', { count: state.catCharges.ginger })}</small>
                </button>
                <button
                  type="button"
                  className="assist-button"
                  disabled={state.catCharges.ginger <= 0}
                  onClick={() => onAssist('ginger', 'lifeSupport')}
                >
                  <img className="assist-avatar" src="/brand/avatar-ginger-512.webp" alt="" /> {t(lang, 'assist.gingerLife')}
                  <small>{t(lang, 'assist.left', { count: state.catCharges.ginger })}</small>
                </button>
              </div>
            </section>
          </>
        )}

        {isResult && (
          <section className="result-panel" data-testid="result-panel">
            <p className={`result-status ${state.lastSuccess ? 'result-ok' : 'result-bad'}`}>
              {state.lastSuccess ? t(lang, 'event.success') : t(lang, 'event.failed')}
            </p>
            {chosen?.risk && (
              <p
                className={`risk-roll ${state.lastSuccess ? 'risk-held' : 'risk-hit'}`}
                data-testid="risk-roll"
              >
                <span className="risk-die" aria-hidden="true" />
                <span className="risk-roll-label">{t(lang, 'event.riskRoll')}</span>
                <span className="risk-roll-odds">
                  {Math.round(chosen.risk.chance * 100)}%
                </span>
                <span className="risk-roll-outcome">
                  {state.lastSuccess ? t(lang, 'event.riskMiss') : t(lang, 'event.riskHit')}
                </span>
              </p>
            )}
            <h2>{t(lang, 'event.result')}</h2>
            <p className="result-outcome">
              <RichText text={state.lastOutcome?.[lang] ?? ''} lang={lang} onTerm={onTerm} />
            </p>
            {event.id === 'T1' && state.lastChoiceId === 'rest' && (
              <RestPhotos lang={lang} />
            )}
            <div className="result-effects">
              <EffectChips effects={state.lastEffects ?? {}} lang={lang} />
            </div>
            {chosen?.knowledgeCard && (
              <button
                type="button"
                className="knowledge-link"
                onClick={() => onOpenCard(chosen.knowledgeCard!)}
              >
                ＋ {t(lang, 'event.newCard')}
              </button>
            )}
            <button
              type="button"
              className="primary-button continue-button"
              data-testid="continue-button"
              onClick={onContinue}
            >
              {t(lang, 'event.continue')}
            </button>
          </section>
        )}
        </div>
      </article>

      {showDustGame && art && pending && (
        <DustMinigame
          src={art.sweep?.src ?? art.src}
          alt={(art.sweep?.alt ?? art.alt)[lang]}
          clearedSrc={art.sweep?.clearedSrc}
          clearedAlt={art.sweep?.clearedAlt[lang]}
          lang={lang}
          onDone={() => onChoose(pending.choiceId)}
          onExit={() => onChoose(pending.choiceId)}
        />
      )}

      {showHullGame && pending && (
        <HullRepairOverlay
          initialLang={lang}
          sol={state.sol}
          onDone={() => onChoose(pending.choiceId)}
        />
      )}

      {showShelterGame && pending && (
        <RadiationOverlay
          initialLang={lang}
          onClose={closeShelter}
          onComplete={(cardId) => {
            shelterDoneRef.current = true;
            onCollectCard?.(cardId);
          }}
        />
      )}

      {showFoodGame && pending && (
        <SpaceFoodFlip
          lang={lang}
          onExit={() => onChoose(pending.choiceId)}
        />
      )}

      {showTomatoGame && pending && (
        <TomatoHarvestOverlay
          initialLang={lang}
          sol={state.sol}
          onDone={(completed) => {
            const choiceId = pending.choiceId;
            setPending(null);
            if (completed) onChoose(choiceId);
          }}
        />
      )}
    </main>
  );
}
