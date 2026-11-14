import { briefForSol } from '../game/daily';
import { artForEvent } from '../game/eventArt';
import { EVENT_BY_ID } from '../game/events';
import { getWeather } from '../game/weather';
import type { Choice, GameState } from '../game/types';
import { CAT_NAMES, t } from '../i18n';
import { faceFor } from './catFaces';
import { EffectChips } from './EventCardView';
import { RichText } from './RichText';
import { SceneStage } from './SceneStage';

interface SolReviewProps {
  state: GameState;
  /** A finished sol to look back at (never the live one). */
  sol: number;
  onBack: () => void;
  onTerm: (cardId: string) => void;
}

/**
 * What a finished sol looked like: the briefing line, the event that was
 * drawn, the choice the crew made and how it turned out. Read-only — it never
 * touches game state, so looking back cannot reroll or replay a sol.
 */
export function SolReview({ state, sol, onBack, onTerm }: SolReviewProps) {
  const lang = state.lang;
  const entry = state.history.find((item) => item.sol === sol);
  const event = entry ? EVENT_BY_ID.get(entry.eventId) : undefined;
  const choice: Choice | undefined = event?.choices.find(
    (item) => item.id === entry?.choiceId,
  );
  const brief = briefForSol(sol);
  const weather = getWeather(sol);
  const isCold =
    weather.tags.includes('cold_snap') || weather.tags.includes('severe_cold');
  const art = event ? artForEvent(event.id) : undefined;

  return (
    <main className="event-shell sol-review" data-testid="sol-review">
      {art && <SceneStage src={art.src} alt={art.alt[lang]} />}
      <article className="event-card sol-review-card">
        <div className="event-body">
          {event ? (
            <header className="event-head">
              <img
                className="cat-avatar"
                src={faceFor(event.cat, entry?.success ? 'success' : 'fail')}
                alt={CAT_NAMES[event.cat][lang]}
              />
              <div>
                <p className="eyebrow">
                  {t(lang, 'review.eyebrow')} · {t(lang, 'briefing.sol', { sol })}
                </p>
                <h1>{event.title[lang]}</h1>
              </div>
            </header>
          ) : (
            <p className="eyebrow">
              {t(lang, 'review.eyebrow')} · {t(lang, 'briefing.sol', { sol })}
            </p>
          )}

          <div className="weather-strip">
            <div>
              <p className="eyebrow">{t(lang, 'briefing.weather')}</p>
              <strong>
                {t(lang, 'briefing.temp', {
                  max: weather.maxTempC,
                  min: weather.minTempC,
                })}
              </strong>
              {isCold && <span className="weather-tag">{t(lang, 'briefing.cold')}</span>}
            </div>
            <span className="weather-date">{weather.terrestrialDate}</span>
          </div>

          <p className="briefing-line">
            <RichText text={brief.line[lang]} lang={lang} onTerm={onTerm} />
          </p>

          {choice && (
            <section className="result-panel" data-testid="sol-review-result">
              <p className={`result-status ${entry?.success ? 'result-ok' : 'result-bad'}`}>
                {entry?.success ? t(lang, 'event.success') : t(lang, 'event.failed')}
              </p>
              <p className="review-chose">
                {t(lang, 'review.chose')}: <strong>{choice.label[lang]}</strong>
              </p>
              <p className="result-outcome">
                <RichText text={choice.outcome[lang]} lang={lang} onTerm={onTerm} />
              </p>
              <div className="result-effects">
                <EffectChips effects={entry?.effects ?? {}} lang={lang} />
              </div>
            </section>
          )}
        </div>

        <div className="briefing-next">
          <span className="muted">
            {event ? `${event.category.toUpperCase()} · ${event.title[lang]}` : ''}
          </span>
          <button
            type="button"
            className="primary-button"
            data-testid="sol-review-back"
            onClick={onBack}
          >
            {t(lang, 'review.back', { sol: state.sol })}
          </button>
        </div>
      </article>
    </main>
  );
}
