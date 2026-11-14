import type { Lang } from '../game/types';
import { t } from '../i18n';

export function GameOver({ lang, onRestart }: { lang: Lang; onRestart: () => void }) {
  return (
    <main className="briefing-shell">
      <section className="briefing-card gameover-card">
        <p className="eyebrow">{t(lang, 'gameover.title')}</p>
        <h1>{t(lang, 'gameover.title')}</h1>
        <p>{t(lang, 'gameover.text')}</p>
        <button type="button" className="primary-button" onClick={onRestart}>
          {t(lang, 'gameover.restart')}
        </button>
      </section>
    </main>
  );
}
