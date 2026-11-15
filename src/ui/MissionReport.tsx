import { useState } from 'react';
import { BACKPACK_SIZE } from '../game/balance';
import { starsFor } from '../game/reducer';
import type { GameState } from '../game/types';
import { t } from '../i18n';
import ending from '../assets/generated/scenes/13-ending.webp';
import { EndingDialogue } from './EndingDialogue';
import { ENDING_DIALOGUES } from './endingDialogues';
import { SceneStage } from './SceneStage';

const width = 640;
const height = 240;
const pad = 36;

function xAt(index: number, count: number): number {
  return pad + (index / Math.max(1, count - 1)) * (width - pad * 2);
}

function yAt(value: number): number {
  return pad + (1 - Math.min(100, Math.max(0, value)) / 100) * (height - pad * 2);
}

function linePath(values: number[]): string {
  return values
    .map((value, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index, values.length)} ${yAt(value)}`)
    .join(' ');
}

interface MissionReportProps {
  state: GameState;
  onRestart: () => void;
}

export function MissionReport({ state, onRestart }: MissionReportProps) {
  const lang = state.lang;
  const stars = starsFor(state);
  const history = state.resourceHistory.length > 0 ? state.resourceHistory : [state.resources];
  const health = history.map((entry) => entry.health);
  const science = history.map((entry) => Math.min(100, entry.science));
  const endingKey = stars === 3 ? 'three' : stars === 2 ? 'two' : 'one';
  const sceneAlt =
    lang === 'en'
      ? 'A supply ship descends toward the landing pad as the three cats watch at sunrise.'
      : '補給船在日出時降落在停機坪，三隻貓在一旁觀看。';
  const [epilogueDone, setEpilogueDone] = useState(Boolean(state.videoMode));

  if (!epilogueDone) {
    return (
      <EndingDialogue
        lines={ENDING_DIALOGUES[endingKey]}
        lang={lang}
        sceneSrc={ending}
        sceneAlt={sceneAlt}
        finishLabel={t(lang, 'report.epilogueFinish')}
        onDone={() => setEpilogueDone(true)}
      />
    );
  }

  return (
    <main className="report-shell" data-testid="mission-report">
      <SceneStage src={ending} alt={sceneAlt} />
      <section className="report-card">
        <div className="report-body">
        <p className="eyebrow">{t(lang, 'report.title')}</p>
        <h1>{t(lang, 'report.survived')}</h1>

        <div className="report-stars" data-testid="mission-report-stars" aria-label={`${stars} / 3`}>
          {[0, 1, 2].map((index) => (
            <span key={index} className={index < stars ? 'star-filled' : 'star-empty'} aria-hidden="true">
              {index < stars ? '★' : '☆'}
            </span>
          ))}
        </div>
        <div className="report-stats">
          <div>
            <span className="eyebrow">{t(lang, 'report.health')}</span>
            <strong data-testid="report-resource-health">{state.resources.health}</strong>
          </div>
          <div>
            <span className="eyebrow">{t(lang, 'report.science')}</span>
            <strong data-testid="report-resource-science">{state.resources.science}</strong>
          </div>
          <div>
            <span className="eyebrow">{t(lang, 'report.backpack')}</span>
            <strong data-testid="report-backpack-count">
              {state.collectedCards.length} / {BACKPACK_SIZE}
            </strong>
          </div>
          <div>
            <span className="eyebrow">{t(lang, 'report.emergency')}</span>
            <strong data-testid="report-emergency-unused">
              {state.emergencyUsed
                ? t(lang, 'report.emergency.used')
                : t(lang, 'report.emergency.unused')}
            </strong>
          </div>
        </div>

        <section>
          <h2>{t(lang, 'report.curve')}</h2>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="report-curve"
            role="img"
            aria-label={t(lang, 'report.curve')}
            data-testid="report-curve"
          >
            <rect width={width} height={height} fill="#F7F3EA" />
            {[0, 25, 50, 75, 100].map((value) => (
              <g key={value}>
                <line x1={pad} x2={width - pad} y1={yAt(value)} y2={yAt(value)} stroke="#D8D2C4" />
                <text x={pad - 8} y={yAt(value) + 4} textAnchor="end" fontSize="12" fill="#172033">
                  {value}
                </text>
              </g>
            ))}
            <path d={linePath(health)} fill="none" stroke="#E07A5F" strokeWidth="3" />
            <path d={linePath(science)} fill="none" stroke="#4E8C8A" strokeWidth="3" />
            {history.map((entry, index) => (
              <g key={index}>
                <circle cx={xAt(index, history.length)} cy={yAt(entry.health)} r="4" fill="#E07A5F" />
                <circle cx={xAt(index, history.length)} cy={yAt(Math.min(100, entry.science))} r="4" fill="#4E8C8A" />
                <text
                  x={xAt(index, history.length)}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#172033"
                >
                  S{index + 1}
                </text>
              </g>
            ))}
          </svg>
          <p className="chart-key">
            <span className="swatch swatch-coral" aria-hidden="true" /> {t(lang, 'report.health')} ·{' '}
            <span className="swatch swatch-teal" aria-hidden="true" /> {t(lang, 'report.science')}
          </p>
        </section>
        </div>

        <div className="report-actions">
          <button type="button" className="primary-button" onClick={onRestart}>
            {t(lang, 'report.again')}
          </button>
        </div>
      </section>
    </main>
  );
}
