import { useEffect, useRef } from 'react';
import { t } from '../game/i18n';
import { SAMPLE } from '../game/weather';
import type { Lang } from '../game/types';

interface InfoModalProps {
  lang: Lang;
  onClose: () => void;
}

export default function InfoModal({ lang, onClose }: InfoModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="info-card" role="dialog" aria-modal="true" aria-labelledby="info-title">
        <div className="info-head">
          <div>
            <p className="result-eyebrow">
              {SAMPLE.meta.instrument} · {SAMPLE.meta.location}
            </p>
            <h2 id="info-title">{t(lang, 'infoTitle')}</h2>
          </div>
          <button ref={closeRef} type="button" className="icon-button" onClick={onClose} aria-label={t(lang, 'close')}>
            ×
          </button>
        </div>

        <div className="info-block">
          <h3>{t(lang, 'infoWeather')}</h3>
          <p>
            Sol {SAMPLE.meta.solRange?.[0]}–{SAMPLE.meta.solRange?.[1]} · {SAMPLE.meta.earthDates}
          </p>
          <p>{SAMPLE.meta.productLevels}</p>
        </div>

        <div className="info-block">
          <h3>{t(lang, 'infoWind')}</h3>
          <p>{SAMPLE.meta.windConvention}</p>
        </div>

        <div className="info-block">
          <h3>{t(lang, 'infoMap')}</h3>
          <p>{SAMPLE.meta.note}</p>
        </div>

        <div className="info-note">{t(lang, 'infoNote')}</div>

        <div className="info-links">
          <span>{t(lang, 'infoLinks')}</span>
          <a href={SAMPLE.meta.sourceUrl} target="_blank" rel="noreferrer">
            {t(lang, 'medaLink')}
          </a>
          <a href="https://trek.nasa.gov/mars/" target="_blank" rel="noreferrer">
            {t(lang, 'mapLink')}
          </a>
        </div>

        <p className="info-credit">{SAMPLE.meta.credit}</p>
      </div>
    </div>
  );
}
