import type { Lang } from '../../../game/types';
import { SOLAR_EVENT } from '../data/event';
import { t } from '../game/i18n';

interface EventCardProps {
  lang: Lang;
  onInfo?: () => void;
}

/** Compact rendering of the real DONKI record that seeds the drill. */
export function EventCard({ lang, onInfo }: EventCardProps) {
  const event = SOLAR_EVENT.event;

  return (
    <aside className="event-card" data-testid="solar-event-card">
      <div className="event-card-head">
        <span className="event-tag">{t(lang, 'eventLabel')}</span>
        {onInfo && (
          <button
            type="button"
            className="event-info-button"
            data-testid="shelter-event-info-open"
            onClick={onInfo}
          >
            {t(lang, 'dataCredits')}
          </button>
        )}
      </div>
      <strong className="event-time" data-testid="event-time">
        {event.eventTime.replace('T', ' ')}
      </strong>
      <div className="event-timeline" aria-label={`${t(lang, 'eventFlare')} → ${t(lang, 'eventSep')} → ${t(lang, 'eventAlert')}`}>
        <span>{t(lang, 'eventFlare')}</span>
        <span aria-hidden="true">→</span>
        <span>{t(lang, 'eventSep')}</span>
        <span aria-hidden="true">→</span>
        <span>{t(lang, 'eventAlert')}</span>
      </div>
      <p className="event-instrument">{t(lang, 'eventInstrument')}</p>
      <p className="event-note">
        {t(lang, 'eventCompressed')} {t(lang, 'eventSimulation')}
      </p>
    </aside>
  );
}
