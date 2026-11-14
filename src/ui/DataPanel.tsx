import spaceWeather from '../data/spaceweather.snapshot.json';
import marsWeather from '../data/mars-weather.snapshot.json';
import type { Lang } from '../game/types';
import { t } from '../i18n';
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

function flareY(classType: string): number {
  const ratio = Math.min(1, Math.max(0, (flareValue(classType) - 1) / 4.3));
  return pad.top + (1 - ratio) * plotHeight;
}

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

export function DataPanel({ lang, onClose }: { lang: Lang; onClose: () => void }) {
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
          {flares.map((flare) => {
            const x = flareX(flare.peakTime);
            const y = flareY(flare.classType);
            const isKey = flare.classType === 'X2.7';
            return (
              <g key={`${flare.peakTime}-${flare.classType}`}>
                <line x1={x} x2={x} y1={y} y2={chartHeight - pad.bottom} stroke={isKey ? '#E07A5F' : '#4E8C8A'} strokeDasharray="3 3" />
                <circle cx={x} cy={y} r={isKey ? 8 : 6} fill={isKey ? '#E07A5F' : '#4E8C8A'} />
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight={isKey ? 800 : 600}
                  fill="#172033"
                >
                  {flare.classType}
                </text>
              </g>
            );
          })}
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
