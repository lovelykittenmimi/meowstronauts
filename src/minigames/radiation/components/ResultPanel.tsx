import type { Lang } from '../../../game/types';
import { KNOWLEDGE_CARDS } from '../../../game/knowledge';
import { SAFE_DOSE } from '../game/dose';
import { CAT_COPY, MATERIAL_COPY, QUOTES, t } from '../game/i18n';
import { MATERIALS } from '../game/materials';
import type { DrillResult, MaterialId, PlacedMaterials } from '../game/types';
import { CAT_AVATAR } from './avatars';

interface ResultPanelProps {
  lang: Lang;
  result: DrillResult;
  placed: PlacedMaterials;
  onRetry: () => void;
  onExit: () => void;
}

export function ResultPanel({
  lang,
  result,
  placed,
  onRetry,
  onExit,
}: ResultPanelProps) {
  const titleKey =
    result.outcome === 'perfect'
      ? 'resultPerfectTitle'
      : result.outcome === 'close'
        ? 'resultCloseTitle'
        : 'resultRoughTitle';
  const bodyKey =
    result.outcome === 'perfect'
      ? 'resultPerfectBody'
      : result.outcome === 'close'
        ? 'resultCloseBody'
        : 'resultRoughBody';
  const card = KNOWLEDGE_CARDS.radiationShielding;
  const quotes = QUOTES[lang][result.outcome];
  const layers = (['roof', 'wall'] as const)
    .map((slot) => ({ slot, id: placed[slot] }))
    .filter((layer) => layer.id !== null) as {
    slot: 'roof' | 'wall';
    id: MaterialId;
  }[];

  return (
    <section className="result-panel" data-testid="shelter-result">
      <div className="result-head">
        <div>
          <p className="eyebrow">{t(lang, 'shieldReport')}</p>
          <h2>{t(lang, titleKey)}</h2>
          <p className="result-body">{t(lang, bodyKey)}</p>
        </div>
        <div
          className="result-stars"
          data-testid="shelter-stars"
          aria-label={t(lang, 'resultStars', { count: result.stars })}
        >
          {[1, 2, 3].map((star) => (
            <span key={star} className={star <= result.stars ? 'is-on' : ''} aria-hidden="true">
              ★
            </span>
          ))}
          <small>{t(lang, 'resultStars', { count: result.stars })}</small>
        </div>
      </div>

      <div className="result-grid">
        <div className="result-doses">
          <p className="result-section-label">
            {t(lang, 'resultMaxDose', { dose: result.maxDose })}
          </p>
          {result.cats.map((cat) => {
            const high = cat.dose > SAFE_DOSE;
            const width = Math.min(100, (cat.dose / 60) * 100);
            return (
              <div className="result-cat" key={cat.id} data-testid={`shelter-dose-${cat.id}`}>
                <img src={CAT_AVATAR[cat.id]} alt="" />
                <div className="result-cat-main">
                  <div className="result-cat-top">
                    <strong>{CAT_COPY[lang][cat.id].name}</strong>
                    <span className={high ? 'is-high' : ''}>
                      {t(lang, 'resultDose')} {cat.dose}
                    </span>
                  </div>
                  <div className="result-dose-track" aria-hidden="true">
                    <span className={high ? 'is-high' : ''} style={{ width: `${width}%` }} />
                    <i style={{ left: `${(SAFE_DOSE / 60) * 100}%` }} />
                  </div>
                  <small className={high ? 'is-high' : ''}>
                    {cat.late
                      ? t(lang, 'late')
                      : high
                        ? t(lang, 'resultHigh')
                        : t(lang, 'resultSafe')}
                  </small>
                </div>
              </div>
            );
          })}
          <p className="result-tip">{t(lang, 'tipGcr')}</p>
        </div>

        <div className="result-shield">
          <p className="result-section-label">{t(lang, 'shieldReport')}</p>
          <div
            className="result-meter"
            aria-label={t(lang, 'sepBlocked', { percent: Math.round(result.shield.sep * 100) })}
          >
            <span>{t(lang, 'shieldSep')}</span>
            <div aria-hidden="true">
              <span style={{ width: `${Math.round(result.shield.sep * 100)}%` }} />
            </div>
            <strong>{Math.round(result.shield.sep * 100)}%</strong>
          </div>
          <div
            className="result-meter"
            aria-label={t(lang, 'gcrBlocked', { percent: Math.round(result.shield.gcr * 100) })}
          >
            <span>{t(lang, 'shieldGcr')}</span>
            <div aria-hidden="true">
              <span style={{ width: `${Math.round(result.shield.gcr * 100)}%` }} />
            </div>
            <strong>{Math.round(result.shield.gcr * 100)}%</strong>
          </div>
          <ul className="result-layers">
            {layers.map((layer) => (
              <li key={layer.slot}>
                <span aria-hidden="true">{MATERIALS[layer.id].icon}</span>
                {MATERIAL_COPY[lang][layer.id].name}
              </li>
            ))}
          </ul>
          <p className="result-stats">
            {t(lang, 'massUsed', { mass: result.shield.mass })} ·{' '}
            {t(lang, 'waterUsed', { water: result.shield.water })} ·{' '}
            {t(lang, 'installTime', { seconds: result.shield.seconds })}
          </p>
        </div>
      </div>

      <p className="result-sim-note">{t(lang, 'eventSimulation')}</p>

      <div className="result-quotes">
        {quotes.map((quote) => (
          <div className="result-quote" key={quote.cat}>
            <img src={CAT_AVATAR[quote.cat]} alt="" />
            <p>
              <strong>{CAT_COPY[lang][quote.cat].name}</strong>
              {quote.text}
            </p>
          </div>
        ))}
      </div>

      {card && (
        <div className="result-knowledge" data-testid="shelter-knowledge">
          <div>
            <p className="eyebrow">{t(lang, 'knowledgeTitle')}</p>
            <h3>{card.term[lang]}</h3>
            <p>{card.short[lang]}</p>
            <p className="result-knowledge-why">{card.why[lang]}</p>
            <span className="result-knowledge-badge">{t(lang, 'knowledgeAdded')}</span>
          </div>
        </div>
      )}

      <div className="result-actions">
        <button
          type="button"
          className="primary-button"
          data-testid="shelter-retry"
          onClick={onRetry}
        >
          {t(lang, 'retry')}
        </button>
        <button
          type="button"
          className="ghost-button"
          data-testid="shelter-result-exit"
          onClick={onExit}
        >
          {t(lang, 'backToBaseAction')}
        </button>
      </div>
    </section>
  );
}
