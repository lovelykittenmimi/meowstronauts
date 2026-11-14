import type { CatId, Lang } from '../../../game/types';
import { CAT_ORDER, arrivalSeconds, catIsLate, catProgress } from '../game/cats';
import { CAT_COPY, t } from '../game/i18n';
import { CAT_HELMET } from './avatars';

interface AlertBoardProps {
  lang: Lang;
  elapsed: number;
  recall: Record<CatId, number | null>;
  frontSeconds: number;
  sepConfirmedAt: number;
  onRecall: (id: CatId) => void;
  onCloseHatch: () => void;
}

export function AlertBoard({
  lang,
  elapsed,
  recall,
  frontSeconds,
  sepConfirmedAt,
  onRecall,
  onCloseHatch,
}: AlertBoardProps) {
  const remaining = Math.max(0, Math.ceil(frontSeconds - elapsed));
  const progressPercent = Math.min(100, Math.max(0, (elapsed / frontSeconds) * 100));
  const sepConfirmed = elapsed >= sepConfirmedAt;

  const states = CAT_ORDER.map((id) => {
    const clickedAt = recall[id];
    const progress = catProgress(id, clickedAt, elapsed);
    const late = catIsLate(id, clickedAt, frontSeconds);
    return { id, clickedAt, progress, late };
  });
  const insideCount = states.filter((state) => state.progress.state === 'inside').length;
  const allInside = insideCount === CAT_ORDER.length;

  return (
    <section className="alert-board" data-testid="shelter-alert-board">
      <div className="alert-heading">
        <div>
          <p className="eyebrow">{t(lang, 'alertTitle')}</p>
          <h2>{t(lang, 'alertBody')}</h2>
        </div>
        <div className="alert-remaining" data-testid="shelter-countdown">
          <span>{t(lang, 'particleFront')}</span>
          <strong>{t(lang, 'secondsLeft', { seconds: remaining })}</strong>
        </div>
      </div>

      <div className="alert-timer" aria-hidden="true">
        <span
          className={remaining <= 5 ? 'is-danger' : ''}
          style={{ width: `${100 - progressPercent}%` }}
        />
      </div>

      {sepConfirmed && (
        <p className="alert-banner" data-testid="shelter-sep-confirmed" role="status">
          {t(lang, 'sepConfirmed')}
        </p>
      )}

      <div className="alert-grid">
        {states.map(({ id, clickedAt, progress, late }) => {
          const copy = CAT_COPY[lang][id];
          const total = arrivalSeconds(id);
          const done = progress.state === 'inside';
          const since = clickedAt === null ? 0 : Math.max(0, elapsed - clickedAt);
          const percent = done ? 100 : Math.min(100, (since / total) * 100);
          const status =
            progress.state === 'inside'
              ? t(lang, 'inside')
              : progress.state === 'packing'
                ? t(lang, 'packing', {
                    seconds: Math.max(1, Math.ceil(progress.remainingSeconds)),
                  })
                : progress.state === 'returning'
                  ? t(lang, 'returning', {
                      seconds: Math.max(1, Math.ceil(progress.remainingSeconds)),
                    })
                  : t(lang, 'recall');

          return (
            <button
              key={id}
              type="button"
              className={`alert-cat alert-cat-${id} ${
                clickedAt !== null ? 'is-returning' : ''
              } ${done ? 'is-inside' : ''} ${late && clickedAt !== null && !done ? 'is-late' : ''}`}
              data-testid={`shelter-cat-${id}`}
              disabled={clickedAt !== null}
              aria-label={`${copy.name}, ${copy.role}, ${copy.station}: ${status}`}
              onClick={() => onRecall(id)}
            >
              <span className="alert-cat-top">
                <img src={CAT_HELMET[id]} alt="" />
                <span>
                  <strong>{copy.name}</strong>
                  <small>{copy.role}</small>
                </span>
                <span className="alert-cat-station">{copy.station}</span>
              </span>
              <span className="alert-cat-status">{status}</span>
              <span className="alert-cat-track" aria-hidden="true">
                <span style={{ width: `${percent}%` }} />
              </span>
              {late && clickedAt !== null && !done && (
                <span className="alert-cat-late">{t(lang, 'willBeLate')}</span>
              )}
              <span className="alert-cat-meta">
                {clickedAt === null
                  ? t(lang, 'etaHint', { seconds: Math.ceil(arrivalSeconds(id)) })
                  : ''}
              </span>
            </button>
          );
        })}

        <div className="alert-shelter" data-testid="shelter-status" aria-live="polite">
          <div className="alert-shelter-door" aria-hidden="true">
            <span />
          </div>
          <div>
            <strong>{t(lang, 'shelter')}</strong>
            <p>{t(lang, 'catsInside', { count: insideCount })}</p>
            <p className="alert-hatch">
              {t(lang, 'hatch')}:{' '}
              <strong>{allInside ? t(lang, 'hatchClosed') : t(lang, 'hatchOpen')}</strong>
            </p>
          </div>
          {allInside && (
            <button
              type="button"
              className="primary-button alert-close-hatch"
              data-testid="shelter-close-hatch"
              onClick={onCloseHatch}
            >
              {t(lang, 'closeHatch')}
            </button>
          )}
        </div>
      </div>

      <p className="alert-hint">{t(lang, 'alertHint')}</p>
    </section>
  );
}
