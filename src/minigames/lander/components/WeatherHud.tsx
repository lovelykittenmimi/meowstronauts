import { compassLabel, phaseName, t } from '../game/i18n';
import { PHASE_SECONDS, formatKm, pushAngleDeg, windPushVector } from '../game/physics';
import type { ConditionKey } from '../game/weather';
import type { Lang, WeatherPhase, WeatherSol } from '../game/types';

interface WeatherHudProps {
  lang: Lang;
  sol: WeatherSol;
  phase: WeatherPhase;
  phaseIndex: number;
  distanceKm: number;
  conditions: ConditionKey[];
  paused?: boolean;
}

export default function WeatherHud({
  lang,
  sol,
  phase,
  phaseIndex,
  distanceKm,
  conditions,
  paused = false,
}: WeatherHudProps) {
  const push = windPushVector(phase);
  const angle = pushAngleDeg(push);
  const compass = compassLabel(lang, phase.windDirectionDeg);

  return (
    <aside className="weather-hud" aria-label={t(lang, 'conditions')}>
      <div className="hud-head">
        <div className="sol-line">
          <span className="sol-badge">
            {t(lang, 'sol')} {sol.sol}
          </span>
          <span className="earth-date">{sol.earthDate}</span>
        </div>
        <span className="phase-badge">{phaseName(lang, phase.key)}</span>
      </div>

      <div className="wind-readout">
        <div className="wind-icon" style={{ transform: `rotate(${angle}deg)` }} aria-hidden="true">
          <svg viewBox="0 0 48 32">
            <path d="M4 16h34m-9-8 9 8-9 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="wind-value">
            {phase.windSpeedMs.toFixed(1)} <span>{t(lang, 'mps')}</span>
          </p>
          <p className="wind-from">
            {t(lang, 'from')} {compass} · {Math.round(phase.windDirectionDeg)}°
          </p>
        </div>
      </div>

      <div className="hud-numbers">
        <div>
          <span>{t(lang, 'temp')}</span>
          <strong>{Math.round(phase.airTempC)}°C</strong>
        </div>
        <div>
          <span>{t(lang, 'pressure')}</span>
          <strong>{Math.round(phase.pressurePa)} {t(lang, 'pa')}</strong>
        </div>
        <div className="distance-block">
          <span>{t(lang, 'distance')}</span>
          <strong>
            {formatKm(distanceKm)} {t(lang, 'km')}
          </strong>
        </div>
      </div>

      <div className="condition-row">
        <span className="conditions-label">{t(lang, 'conditions')}</span>
        {conditions.length > 0 ? (
          conditions.map((condition) => (
            <span key={condition} className={`condition-chip ${condition}`}>
              {t(lang, condition)}
            </span>
          ))
        ) : (
          <span className="condition-chip calm">{t(lang, 'calm')}</span>
        )}
      </div>

      <div
        className={`phase-track${paused ? ' is-paused' : ''}`}
        key={`${sol.sol}-${phaseIndex}`}
        aria-hidden="true"
      >
        <div className="phase-track-fill" style={{ animationDuration: `${PHASE_SECONDS}s` }} />
      </div>
      <p className="weather-source-pill">{t(lang, 'weatherLabel')}</p>
    </aside>
  );
}
