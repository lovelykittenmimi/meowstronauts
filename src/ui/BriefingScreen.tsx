import { briefForSol } from '../game/daily';
import { artForEvent } from '../game/eventArt';
import { getKnowledgeCard } from '../game/knowledge';
import type { EventCard, GameState } from '../game/types';
import { t } from '../i18n';
import baseExterior from '../assets/generated/scenes/07-base-exterior.webp';
import { RichText } from './RichText';
import { SceneStage } from './SceneStage';

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

  // The same place as the sol's event card — the cat-free plate when one
  // exists, so the briefing and the card are the same scene, not the same
  // picture twice. The briefing footer already names that event.
  const art = artForEvent(event.id);

  return (
    <main className="briefing-shell">
      <SceneStage
        src={art?.briefingSrc ?? art?.src ?? baseExterior}
        alt={
          art
            ? art.alt[lang]
            : lang === 'en'
              ? 'Exterior view of the Hope-1 Mars outpost with its dome, dish, solar farm and rover.'
              : '希望一號火星基地外觀，含圓頂、碟型天線、太陽能陣列與探測車。'
        }
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
