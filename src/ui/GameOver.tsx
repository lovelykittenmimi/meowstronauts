import type { Lang } from '../game/types';
import { t } from '../i18n';
import debrief from '../assets/generated/scenes/12-debrief.webp';

export function GameOver({ lang, onRestart }: { lang: Lang; onRestart: () => void }) {
  return (
    <main className="briefing-shell">
      <section className="briefing-card gameover-card">
        <div className="card-banner card-banner-gameover">
          <img
            src={debrief}
            alt="The three cats gather around a holographic report in a warm debrief room."
            onError={(imageEvent) => {
              imageEvent.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div className="briefing-body">
          <p className="eyebrow">{t(lang, 'gameover.title')}</p>
          <h1>{t(lang, 'gameover.title')}</h1>
          <p>{t(lang, 'gameover.text')}</p>
          <button type="button" className="primary-button" onClick={onRestart}>
            {t(lang, 'gameover.restart')}
          </button>
        </div>
      </section>
    </main>
  );
}
