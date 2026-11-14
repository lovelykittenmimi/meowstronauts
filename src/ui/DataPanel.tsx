import spaceWeather from '../data/spaceweather.snapshot.json';
import marsWeather from '../data/mars-weather.snapshot.json';
import type { Lang } from '../game/types';
import { t } from '../i18n';
import { LiveWeather } from './LiveWeather';
import { Modal } from './Modal';

interface Flare {
  peakTime: string;
  classType: string;
}

interface WeatherSol {
  sol: number;
  terrestrialDate: string;
  maxTempC: number;
  minTempC: number;
}

const flares = (spaceWeather as { flr: Flare[] }).flr;
const sols = (marsWeather as { sols: WeatherSol[] }).sols;
const coldWeek = sols.slice(-7);

function flareValue(classType: string): number {
  const scale: Record<string, number> = { A: 1, B: 2, C: 3, M: 4, X: 5 };
  const letter = classType.charAt(0);
  const number = Number(classType.slice(1)) || 1;
  return (scale[letter] ?? 1) + Math.min(number, 9) / 10;
}

const chartWidth = 640;
const chartHeight = 200;
const pad = { top: 22, right: 22, bottom: 30, left: 44 };
const plotWidth = chartWidth - pad.left - pad.right;
const plotHeight = chartHeight - pad.top - pad.bottom;

const startTime = Date.parse('2025-05-13T00:00:00Z');
const endTime = Date.parse('2025-05-18T00:00:00Z');

function flareX(peakTime: string): number {
  const ratio = (Date.parse(peakTime) - startTime) / (endTime - startTime);
  return pad.left + ratio * plotWidth;
}

// 5.0 leaves headroom above X-class flares so the X2.7 and M7.7 labels on
// 14 May do not overlap at 1920x1080 (the video recording size).
function flareY(classType: string): number {
  const ratio = Math.min(1, Math.max(0, (flareValue(classType) - 1) / 5));
  return pad.top + (1 - ratio) * plotHeight;
}

interface FlarePoint {
  key: string;
  classType: string;
  x: number;
  y: number;
  isKey: boolean;
}

const flarePoints: FlarePoint[] = flares.map((flare) => ({
  key: `${flare.peakTime}-${flare.classType}`,
  classType: flare.classType,
  x: flareX(flare.peakTime),
  y: flareY(flare.classType),
  isKey: flare.classType === 'X2.7',
}));

interface LabelBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const LABEL_HEIGHT = 16;

function labelBox(x: number, y: number, anchor: 'start' | 'middle' | 'end', text: string): LabelBox {
  // Approximate width at fontSize 14; only used to avoid overlaps.
  const width = text.length * 7 + 2;
  const left = anchor === 'middle' ? x - width / 2 : anchor === 'start' ? x : x - width;
  return { left, right: left + width, top: y - LABEL_HEIGHT, bottom: y };
}

function boxHits(a: LabelBox, b: LabelBox): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

/**
 * Place each flare label above its dot. When that box would cover a
 * neighbouring dot or label (X2.7 and M7.7 peak three hours apart on
 * 14 May), try the right of the dot, then the left, then below. Labels are
 * drawn after every dot so no circle can paint over a label.
 */
function placeFlareLabels(): Array<FlarePoint & { labelX: number; labelY: number; anchor: 'start' | 'middle' | 'end' }> {
  const dotBoxes = flarePoints.map((point) => ({
    left: point.x - (point.isKey ? 8 : 6),
    right: point.x + (point.isKey ? 8 : 6),
    top: point.y - (point.isKey ? 8 : 6),
    bottom: point.y + (point.isKey ? 8 : 6),
  }));
  const placed: LabelBox[] = [];

  return [...flarePoints]
    .sort((a, b) => a.x - b.x)
    .map((point) => {
      const candidates = [
        { labelX: point.x, labelY: point.y - 12, anchor: 'middle' as const },
        { labelX: point.x + 12, labelY: point.y + 5, anchor: 'start' as const },
        { labelX: point.x - 12, labelY: point.y + 5, anchor: 'end' as const },
        { labelX: point.x, labelY: point.y + 26, anchor: 'middle' as const },
      ];
      const choice =
        candidates.find((candidate) => {
          const box = labelBox(candidate.labelX, candidate.labelY, candidate.anchor, point.classType);
          return !dotBoxes.some((dot) => boxHits(box, dot)) && !placed.some((label) => boxHits(box, label));
        }) ?? candidates[0];
      placed.push(labelBox(choice.labelX, choice.labelY, choice.anchor, point.classType));
      return { ...point, ...choice };
    });
}

const flareLabels = placeFlareLabels();

const tempMin = -85;
const tempMax = -15;

function tempX(index: number): number {
  return pad.left + (index / Math.max(1, sols.length - 1)) * plotWidth;
}

function tempY(value: number): number {
  return pad.top + ((tempMax - value) / (tempMax - tempMin)) * plotHeight;
}

function pathFor(values: number[]): string {
  return values
    .map((value, index) => `${index === 0 ? 'M' : 'L'} ${tempX(index)} ${tempY(value)}`)
    .join(' ');
}

export function DataPanel({
  lang,
  onClose,
  showLive = true,
}: {
  lang: Lang;
  onClose: () => void;
  showLive?: boolean;
}) {
  const coldStartX = tempX(sols.length - coldWeek.length);

  return (
    <Modal title={t(lang, 'data.title')} onClose={onClose} testId="data-panel" wide>
      <p className="snapshot-note">
        <strong>{t(lang, 'data.note')}</strong> NASA/JPL-Caltech · DONKI · Curiosity REMS.
      </p>

      <section className="chart-block">
        <h3>{t(lang, 'data.donki')}</h3>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="data-chart"
          role="img"
          aria-label={t(lang, 'data.donki')}
          data-testid="donki-chart"
        >
          <rect x={0} y={0} width={chartWidth} height={chartHeight} fill="#F7F3EA" />
          {['A', 'C', 'M', 'X'].map((letter) => {
            const y = flareY(`${letter}1`);
            return (
              <g key={letter}>
                <line x1={pad.left} x2={chartWidth - pad.right} y1={y} y2={y} stroke="#D8D2C4" />
                <text x={pad.left - 10} y={y + 4} textAnchor="end" fontSize="14" fill="#172033">
                  {letter}
                </text>
              </g>
            );
          })}
          <line
            x1={pad.left}
            x2={chartWidth - pad.right}
            y1={chartHeight - pad.bottom}
            y2={chartHeight - pad.bottom}
            stroke="#1B2A5B"
          />
          <text x={pad.left} y={chartHeight - 8} fontSize="14" fill="#172033">
            13 May
          </text>
          <text x={chartWidth - pad.right} y={chartHeight - 8} textAnchor="end" fontSize="14" fill="#172033">
            17 May
          </text>
          {flarePoints.map((point) => (
            <g key={point.key}>
              <line
                x1={point.x}
                x2={point.x}
                y1={point.y}
                y2={chartHeight - pad.bottom}
                stroke={point.isKey ? '#E07A5F' : '#4E8C8A'}
                strokeDasharray="3 3"
              />
              <circle cx={point.x} cy={point.y} r={point.isKey ? 8 : 6} fill={point.isKey ? '#E07A5F' : '#4E8C8A'} />
            </g>
          ))}
          {flareLabels.map((label) => (
            <text
              key={`label-${label.key}`}
              x={label.labelX}
              y={label.labelY}
              textAnchor={label.anchor}
              fontSize="14"
              fontWeight={label.isKey ? 800 : 600}
              fill="#172033"
            >
              {label.classType}
            </text>
          ))}
        </svg>
        <p className="chart-key">{t(lang, 'data.flare')}</p>
      </section>

      <section className="chart-block">
        <h3>{t(lang, 'data.rems')}</h3>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="data-chart"
          role="img"
          aria-label={t(lang, 'data.rems')}
          data-testid="rems-chart"
        >
          <rect x={0} y={0} width={chartWidth} height={chartHeight} fill="#F7F3EA" />
          <rect
            x={coldStartX}
            y={pad.top}
            width={chartWidth - pad.right - coldStartX}
            height={plotHeight}
            fill="#E8A33D"
            opacity="0.16"
          />
          <text x={coldStartX + 8} y={pad.top + 18} fontSize="14" fill="#172033">
            {t(lang, 'data.cold')}
          </text>
          {[-80, -60, -40, -20].map((value) => (
            <g key={value}>
              <line
                x1={pad.left}
                x2={chartWidth - pad.right}
                y1={tempY(value)}
                y2={tempY(value)}
                stroke="#D8D2C4"
              />
              <text x={pad.left - 10} y={tempY(value) + 4} textAnchor="end" fontSize="14" fill="#172033">
                {value}°
              </text>
            </g>
          ))}
          <path d={pathFor(sols.map((sol) => sol.maxTempC))} fill="none" stroke="#B85C38" strokeWidth="3" />
          <path d={pathFor(sols.map((sol) => sol.minTempC))} fill="none" stroke="#4E8C8A" strokeWidth="3" />
          <text x={pad.left} y={chartHeight - 8} fontSize="14" fill="#172033">
            8 May
          </text>
          <text x={chartWidth - pad.right} y={chartHeight - 8} textAnchor="end" fontSize="14" fill="#172033">
            22 May
          </text>
        </svg>
        <p className="chart-key">
          <span className="swatch swatch-rust" aria-hidden="true" /> High ·{' '}
          <span className="swatch swatch-teal" aria-hidden="true" /> Low · °C
        </p>
      </section>

      {showLive && <LiveWeather lang={lang} />}

      <div className="source-links">
        <a href="https://api.nasa.gov/DONKI/" target="_blank" rel="noreferrer">
          NASA DONKI
        </a>
        <a href="https://mars.nasa.gov/msl/weather/" target="_blank" rel="noreferrer">
          Curiosity REMS weather
        </a>
        <a href="https://science.nasa.gov/mars/facts/" target="_blank" rel="noreferrer">
          NASA Mars Facts
        </a>
      </div>
    </Modal>
  );
}
