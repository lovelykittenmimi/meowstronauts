import { briefForSol } from '../game/daily';
import { briefingArtFor } from '../game/eventArt';
import { getKnowledgeCard } from '../game/knowledge';
import type { EventCard, GameState, Localized } from '../game/types';
import { t } from '../i18n';
import keyArt from '../assets/generated/scenes/01-keyart.webp';
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
  /** Optional water & fuel factory; shown on every sol when provided. */
  onFactoryPractice?: () => void;
}

export function BriefingScreen({
  state,
  event,
  onBegin,
  onTerm,
  onHopPractice,
  onFoodPractice,
  onFactoryPractice,
}: BriefingScreenProps) {
  const lang = state.lang;
  const brief = briefForSol(state.sol);
  const isCold = state.weather.tags.includes('cold_snap') || state.weather.tags.includes('severe_cold');

  // The briefing previews the day's event: the same place the card will show,
  // with the cat-free plate when the event has one.
  const art = briefingArtFor(event.id);

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

        {onFactoryPractice && (
          <button
            type="button"
            className="factory-practice-button"
            data-testid="factory-practice"
            onClick={onFactoryPractice}
          >
            <span aria-hidden="true">🏭</span>
            {t(lang, 'briefing.factoryGame')}
          </button>
        )}

        {state.sol === 1 && onHopPractice && (
          <button
            type="button"
            className="hop-practice-button"
            data-testid="hop-practice"
            onClick={onHopPractice}
          >
            <span aria-hidden="true">🦘</span>
            {t(lang, 'briefing.hop')}
          </button>
        )}

        {state.sol === 7 && onFoodPractice && (
          <button
            type="button"
            className="food-practice-button"
            data-testid="food-practice"
            onClick={onFoodPractice}
          >
            <span aria-hidden="true">🍽️</span>
            {t(lang, 'briefing.foodGame')}
          </button>
        )}
        </div>

        <div className="briefing-next">
          <span className="muted">
            {event.category.toUpperCase()} · {event.title[lang]}
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
