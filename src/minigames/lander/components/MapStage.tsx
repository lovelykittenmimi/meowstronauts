import type { CSSProperties } from 'react';
import mapImage from '../../../assets/nasa/gale-wide.webp';
import {
  CLOSE_RADIUS,
  MAP_HEIGHT,
  MAP_WIDTH,
  PERFECT_RADIUS,
  START,
  TARGET,
  pushAngleDeg,
  windPushVector,
} from '../game/physics';
import { t } from '../game/i18n';
import type { Lang, Point, WeatherPhase, WeatherZone, ZoneType } from '../game/types';
import Ship from './Ship';

interface MapStageProps {
  lang: Lang;
  phase: WeatherPhase;
  zones: WeatherZone[];
  ship: Point;
  heading: number;
  trail: Point[];
  thrusting: boolean;
}

const ARROW_SPOTS: Array<[number, number]> = [
  [0.2, 0.24],
  [0.43, 0.18],
  [0.66, 0.2],
  [0.84, 0.3],
  [0.14, 0.56],
  [0.35, 0.63],
  [0.63, 0.7],
  [0.85, 0.62],
  [0.24, 0.84],
  [0.52, 0.86],
  [0.76, 0.82],
];

function zoneLabel(lang: Lang, type: ZoneType): string {
  if (type === 'dust') return t(lang, 'dustDevil');
  if (type === 'cold') return t(lang, 'coldPocket');
  return t(lang, 'gustZone');
}

function ZoneIcon({ type }: { type: ZoneType }) {
  if (type === 'dust') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3c5 0 8 3.6 8 8.2 0 4.6-3.3 8.2-7.8 8.2-3.4 0-6.2-2.2-6.2-5.2 0-2.5 1.9-4.4 4.4-4.4 2.1 0 3.7 1.4 3.7 3.2 0 1.6-1.2 2.8-2.8 2.8-1.2 0-2.1-.8-2.1-1.9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (type === 'cold') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
          <path d="M9.5 5l2.5 2 2.5-2M9.5 19l2.5-2 2.5 2" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 8h11.5a3 3 0 1 0-3-3" />
        <path d="M3 12h16a3 3 0 1 1-3 3" />
        <path d="M3 16h8.5" />
      </g>
    </svg>
  );
}

export default function MapStage({ lang, phase, zones, ship, heading, trail, thrusting }: MapStageProps) {
  const push = windPushVector(phase);
  const angle = pushAngleDeg(push);
  const arrowLength = 28 + Math.min(32, phase.windSpeedMs * 4.5);
  const arrowOpacity = Math.min(0.95, 0.52 + phase.windSpeedMs / 10);
  const targetX = `${(TARGET.x / MAP_WIDTH) * 100}%`;
  const targetY = `${(TARGET.y / MAP_HEIGHT) * 100}%`;

  const dustStyle = {
    '--dust-x': `${push.x * 2.8}px`,
    '--dust-y': `${push.y * 1.4}px`,
  } as CSSProperties;

  return (
    <div className="map-stage" style={{ backgroundImage: `url(${mapImage})` }}>
      <div className="map-vignette" aria-hidden="true" />

      <svg className="map-svg" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
        <line
          x1={START.x}
          y1={START.y}
          x2={TARGET.x}
          y2={TARGET.y}
          className="route-line"
        />
        {trail.length > 1 && (
          <polyline
            points={trail.map((point) => `${point.x},${point.y}`).join(' ')}
            className="ship-trail"
          />
        )}
        <g className="wind-arrows" opacity={arrowOpacity}>
          {ARROW_SPOTS.map(([nx, ny], index) => {
            const x = nx * MAP_WIDTH;
            const y = ny * MAP_HEIGHT;
            return (
              <g key={index} transform={`translate(${x} ${y}) rotate(${angle})`}>
                <path
                  d={`M ${-arrowLength} 0 H ${arrowLength} m -9 -6 l 9 6 l -9 6`}
                  className="wind-arrow"
                  style={{ animationDelay: `${index * 0.12}s` }}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {zones.map((zone) => (
        <div
          key={zone.id}
          className={`zone-marker zone-${zone.type}`}
          style={{
            left: `${(zone.x / MAP_WIDTH) * 100}%`,
            top: `${(zone.y / MAP_HEIGHT) * 100}%`,
            width: `${((zone.r * 2) / MAP_WIDTH) * 100}%`,
          }}
          role="img"
          aria-label={zoneLabel(lang, zone.type)}
        >
          <div className="zone-disc">
            <ZoneIcon type={zone.type} />
          </div>
          <span className="zone-label">{zoneLabel(lang, zone.type)}</span>
        </div>
      ))}

      <span
        className="target-ring target-outer"
        style={{
          left: targetX,
          top: targetY,
          width: `${((CLOSE_RADIUS * 2) / MAP_WIDTH) * 100}%`,
        }}
      />
      <span
        className="target-ring target-inner"
        style={{
          left: targetX,
          top: targetY,
          width: `${((PERFECT_RADIUS * 2) / MAP_WIDTH) * 100}%`,
        }}
      />
      <span className="target-dot" style={{ left: targetX, top: targetY }} />
      <span className="target-label" style={{ left: targetX, top: targetY }}>
        {t(lang, 'targetLabel')}
      </span>

      <div
        className="start-marker"
        style={{ left: `${(START.x / MAP_WIDTH) * 100}%`, top: `${(START.y / MAP_HEIGHT) * 100}%` }}
      >
        {t(lang, 'startLabel')}
      </div>

      {phase.windSpeedMs >= 3.2 && (
        <div className="dust-layer" style={dustStyle} aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <span
              key={index}
              style={{
                left: `${(index * 83) % 100}%`,
                top: `${(index * 47) % 100}%`,
                animationDelay: `${index * 0.27}s`,
                animationDuration: `${3.4 + (index % 4) * 0.6}s`,
              }}
            />
          ))}
        </div>
      )}

      <div
        className={`ship-wrap${thrusting ? ' is-thrusting' : ''}`}
        style={{
          left: `${(ship.x / MAP_WIDTH) * 100}%`,
          top: `${(ship.y / MAP_HEIGHT) * 100}%`,
          transform: `translate(-50%, -50%) rotate(${heading}deg)`,
        }}
      >
        <Ship thrusting={thrusting} size={64} />
      </div>

      <p className="wind-legend">{t(lang, 'windLegend')}</p>
      <p className="map-credit">{t(lang, 'mapLabel')}</p>
    </div>
  );
}
