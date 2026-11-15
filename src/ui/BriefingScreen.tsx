import { briefForSol } from '../game/daily';
import { briefArtForSol, briefingArtFor } from '../game/eventArt';
import { getKnowledgeCard } from '../game/knowledge';
import type { EventCard, GameState, Localized } from '../game/types';
import { t } from '../i18n';
import keyArt from '../assets/generated/scenes/01-keyart.webp';
import { MINIGAME_BY_ID, minigameClass } from './minigameMeta';
import { RichText } from './RichText';
import { SceneStage } from './SceneStage';

/** Only shown if a future event has no art entry yet. */
const KEY_ART_ALT: Localized = {
  en: 'Three cat astronauts on a rocky Mars ridge at dawn, looking toward the Hope-1 outpost.',
  'zh-TW': '三隻貓太空人黎明時站在火星岩脊上，望向希望一號基地。',
};

interface BriefingScreenProps {
  state: GameState;
  event: EventCard;
  onBegin: (eventId: string) => void;
  onTerm: (cardId: string) => void;
  /** Optional Sol 1 practice run; other sols do not show the button. */
  onHopPractice?: () => void;
  /** Optional Sol 7 practice run; other sols do not show the button. */
  onFoodPractice?: () => void;
  /** Optional Sol 5 practice: the day's brief is about reusing water. */
  onFactoryPractice?: () => void;
  /** Optional Sol 4 practice: the day's brief is about the shelter. */
  onShelterPractice?: () => void;
  /** Optional Sol 2 practice: dust devils are not dust storms. */
  onDodgePractice?: () => void;
  /** Optional Sol 6 practice: the day's brief is about the comms delay. */
  onSignalPractice?: () => void;
}

export function BriefingScreen({
  state,
  event,
  onBegin,
  onTerm,
  onHopPractice,
  onFoodPractice,
  onFactoryPractice,
  onShelterPractice,
  onDodgePractice,
  onSignalPractice,
}: BriefingScreenProps) {
  const lang = state.lang;
  const brief = briefForSol(state.sol);
  const isCold = state.weather.tags.includes('cold_snap') || state.weather.tags.includes('severe_cold');

  // The log text is fixed per sol, so the scene is fixed per sol too. The
  // event art is only a fallback if a sol ever falls outside the map.
  const art = briefArtForSol(state.sol) ?? briefingArtFor(event.id);

  return (
    <main className="briefing-shell">
      <SceneStage
        src={art?.src ?? keyArt}
        alt={(art?.alt ?? KEY_ART_ALT)[lang]}
      />
      <section className="briefing-card">
        <div className="briefing-body">
        <p className="eyebrow">{t(lang, 'briefing.title')}</p>
        <h1>{t(lang, 'briefing.sol', { sol: state.sol })}</h1>

        <div className="weather-strip">
          <div>
            <p className="eyebrow">{t(lang, 'briefing.weather')}</p>
            <strong>
              {t(lang, 'briefing.temp', {
                max: state.weather.maxTempC,
                min: state.weather.minTempC,
              })}
            </strong>
            {isCold && <span className="weather-tag">{t(lang, 'briefing.cold')}</span>}
          </div>
          <span className="weather-date">{state.weather.terrestrialDate}</span>
        </div>
        <p className="snapshot-note">{t(lang, 'briefing.snapshot')}</p>

        <p className="briefing-line">
          <RichText text={brief.line[lang]} lang={lang} onTerm={onTerm} />
        </p>

        <div className="term-chips">
          {brief.terms.map((term) => {
            const card = getKnowledgeCard(term);
            if (!card) return null;
            return (
              <button
                key={term}
                type="button"
                className="term-chip"
                onClick={() => onTerm(term)}
              >
                {card.term[lang]}
              </button>
            );
          })}
        </div>

        {state.sol === 5 && onFactoryPractice && (
          <button
            type="button"
            className={`${minigameClass('factory')} briefing-game-button`}
            data-testid="factory-practice"
            onClick={onFactoryPractice}
          >
            <span aria-hidden="true">{MINIGAME_BY_ID.factory.icon}</span>
            {t(lang, 'briefing.factoryGame')}
          </button>
        )}

        {state.sol === 4 && onShelterPractice && (
          <button
            type="button"
            className={`${minigameClass('shelter')} briefing-game-button`}
            data-testid="shelter-practice"
            onClick={onShelterPractice}
          >
            <span aria-hidden="true">{MINIGAME_BY_ID.shelter.icon}</span>
            {t(lang, 'briefing.shelterGame')}
          </button>
        )}

        {state.sol === 1 && onHopPractice && (
          <button
            type="button"
            className={`${minigameClass('hop')} briefing-game-button`}
            data-testid="hop-practice"
            onClick={onHopPractice}
          >
            <span aria-hidden="true">{MINIGAME_BY_ID.hop.icon}</span>
            {t(lang, 'briefing.hop')}
          </button>
        )}

        {state.sol === 2 && onDodgePractice && (
          <button
            type="button"
            className={`${minigameClass('dustdodge')} briefing-game-button`}
            data-testid="dodge-practice"
            onClick={onDodgePractice}
          >
            <span aria-hidden="true">{MINIGAME_BY_ID.dustdodge.icon}</span>
            {t(lang, 'briefing.dodgeGame')}
          </button>
        )}

        {state.sol === 7 && onFoodPractice && (
          <button
            type="button"
            className={`${minigameClass('food')} briefing-game-button`}
            data-testid="food-practice"
            onClick={onFoodPractice}
          >
            <span aria-hidden="true">{MINIGAME_BY_ID.food.icon}</span>
            {t(lang, 'briefing.foodGame')}
          </button>
        )}

        {state.sol === 6 && onSignalPractice && (
          <button
            type="button"
            className={`${minigameClass('signal')} briefing-game-button`}
            data-testid="signal-practice"
            onClick={onSignalPractice}
          >
            <span aria-hidden="true">{MINIGAME_BY_ID.signal.icon}</span>
            {t(lang, 'briefing.signalGame')}
          </button>
        )}
        </div>

        <div className="briefing-next">
          <span className="muted">
            {t(lang, 'event.incident')} · {event.title[lang]}
          </span>
          <button
            type="button"
            className="primary-button"
            data-testid="begin-sol"
            onClick={() => onBegin(event.id)}
          >
            {t(lang, 'briefing.begin')}
          </button>
        </div>
      </section>
    </main>
  );
}
