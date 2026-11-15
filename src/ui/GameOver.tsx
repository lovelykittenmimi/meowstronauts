import { useState } from 'react';
import type { Lang } from '../game/types';
import { t } from '../i18n';
import debrief from '../assets/generated/scenes/12-debrief.webp';
import { EndingDialogue } from './EndingDialogue';
import { ENDING_DIALOGUES } from './endingDialogues';
import { SceneStage } from './SceneStage';

export function GameOver({ lang, onRestart }: { lang: Lang; onRestart: () => void }) {
  const [epilogueDone, setEpilogueDone] = useState(false);
  const sceneAlt =
    lang === 'en'
      ? 'The three cats gather around a holographic report in a warm debrief room.'
      : '三隻貓在溫暖的任務覆盤室裡圍著全像報告。';

  if (!epilogueDone) {
    return (
      <EndingDialogue
        lines={ENDING_DIALOGUES.lose}
        lang={lang}
        sceneSrc={debrief}
        sceneAlt={sceneAlt}
        finishLabel={t(lang, 'gameover.debrief')}
        onDone={() => setEpilogueDone(true)}
        testId="lose-sequence"
      />
    );
  }

  return (
    <main className="briefing-shell">
      <SceneStage src={debrief} alt={sceneAlt} />
      <section className="briefing-card gameover-card">
        <div className="briefing-body">
          <p className="eyebrow">{t(lang, 'gameover.title')}</p>
          <h1>{t(lang, 'gameover.title')}</h1>
          <p>{t(lang, 'gameover.text')}</p>
        </div>
        <div className="report-actions">
          <button type="button" className="primary-button" onClick={onRestart}>
            {t(lang, 'gameover.restart')}
          </button>
        </div>
      </section>
    </main>
  );
}
