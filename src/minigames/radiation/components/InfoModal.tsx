import { useEffect } from 'react';
import type { Lang } from '../../../game/types';
import {
  NASA_DONKI_TOOL,
  NASA_RADIATION_ARTICLE,
  SOLAR_EVENT,
} from '../data/event';
import { t } from '../game/i18n';

interface InfoModalProps {
  lang: Lang;
  onClose: () => void;
}

export function InfoModal({ lang, onClose }: InfoModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const event = SOLAR_EVENT.event;

  return (
    <div
      className="shelter-modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="shelter-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t(lang, 'infoTitle')}
        data-testid="shelter-info"
        onMouseDown={(click) => click.stopPropagation()}
      >
        <div className="shelter-modal-head">
          <h2>{t(lang, 'infoTitle')}</h2>
          <button
            type="button"
            className="shelter-icon-button"
            onClick={onClose}
            aria-label={t(lang, 'close')}
          >
            ×
          </button>
        </div>

        <p className="shelter-modal-note">{t(lang, 'infoNote')}</p>

        <dl className="shelter-modal-list">
          <dt>{t(lang, 'infoEvent')}</dt>
          <dd>{event.id}</dd>
          <dt>{t(lang, 'eventSep')}</dt>
          <dd>{event.eventTime.replace('T', ' ')}</dd>
          <dt>{t(lang, 'infoAlert')}</dt>
          <dd>{event.alertTime}</dd>
          <dt>{t(lang, 'infoInstrument')}</dt>
          <dd>{event.instruments.join(' · ')}</dd>
          <dt>{t(lang, 'infoCompressed')}</dt>
          <dd>{t(lang, 'infoCompressedValue')}</dd>
        </dl>

        <div className="shelter-modal-links">
          <a href={NASA_RADIATION_ARTICLE} target="_blank" rel="noreferrer">
            {t(lang, 'infoArticle')}
          </a>
          <a href={NASA_DONKI_TOOL} target="_blank" rel="noreferrer">
            {t(lang, 'infoDonki')}
          </a>
        </div>

        <p className="shelter-modal-fine">{SOLAR_EVENT.meta.note}</p>
      </div>
    </div>
  );
}
