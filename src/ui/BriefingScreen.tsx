import { briefForSol } from '../game/daily';
import { getKnowledgeCard } from '../game/knowledge';
import type { EventCard, GameState } from '../game/types';
import { t } from '../i18n';
import baseExterior from '../assets/generated/scenes/07-base-exterior.webp';
import coldPatrol from '../assets/generated/scenes/11-cold-patrol.webp';
import { RichText } from './RichText';

interface BriefingScreenProps {
  state: GameState;
  event: EventCard;
  onBegin: (eventId: string) => void;
  onTerm: (cardId: string) => void;
}

export function BriefingScreen({ state, event, onBegin, onTerm }: BriefingScreenProps) {
  const lang = state.lang;
  const brief = briefForSol(state.sol);
  const isCold = state.weather.tags.includes('cold_snap') || state.weather.tags.includes('severe_cold');

  return (
    <main className="briefing-shell">
      <section className="briefing-card">
        <div className="card-banner card-banner-briefing">
          <img
            src={isCold ? coldPatrol : baseExterior}
            alt={
              isCold
                ? 'A rover crosses a frost-dusted Martian plain with Shadow and Ginger inside.'
                : 'Exterior view of the Hope-1 Mars outpost with its dome, solar farm and rover.'
            }
            onError={(imageEvent) => {
              imageEvent.currentTarget.style.display = 'none';
            }}
          />
        </div>
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
                📖 {card.term[lang]}
              </button>
            );
          })}
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
        </div>
      </section>
    </main>
  );
}
