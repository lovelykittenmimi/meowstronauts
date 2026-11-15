import type { Difficulty, Lang } from '../game/types';
import { t, type StringKey } from '../i18n';

interface TitleScreenProps {
  lang: Lang;
  difficulty: Difficulty;
  onDifficulty: (difficulty: Difficulty) => void;
  onStart: () => void;
  onToggleLang: () => void;
}

const DIFFICULTIES: Difficulty[] = ['cadet', 'officer', 'ace'];

export function TitleScreen({
  lang,
  difficulty,
  onDifficulty,
  onStart,
  onToggleLang,
}: TitleScreenProps) {
  return (
    <main className="title-shell" data-testid="title-screen">
      <section className="title-card">
        {/* The OG key art already carries the title, so the two lines sit
            under the picture instead of repeating it as a heading. */}
        <div className="title-art">
          <div className="title-art-frame">
            <img className="title-keyart" src="/brand/og-1200x630.jpg" alt="" />
          </div>
          <div className="title-art-caption">
            <p className="tagline">{t(lang, 'app.subtitle')}</p>
            <p className="title-pitch">{t(lang, 'title.tagline')}</p>
          </div>
        </div>
        <div className="title-copy">
          <div className="title-topline">
            <img src="/brand/logo-three-cats-512.png" alt="" width="56" height="56" />
            <button type="button" className="ghost-button" onClick={onToggleLang}>
              {t(lang, 'common.lang')}
            </button>
          </div>
          <h1 className="visually-hidden">{t(lang, 'app.title')}</h1>

          <fieldset className="difficulty-picker">
            <legend>{t(lang, 'title.difficulty')}</legend>
            {DIFFICULTIES.map((item) => (
              <button
                key={item}
                type="button"
                className={item === difficulty ? 'difficulty-option is-selected' : 'difficulty-option'}
                data-testid={`difficulty-${item}`}
                aria-pressed={item === difficulty}
                onClick={() => onDifficulty(item)}
              >
                <strong>{t(lang, `difficulty.${item}` as StringKey)}</strong>
                <span>{t(lang, `difficulty.${item}.desc` as StringKey)}</span>
              </button>
            ))}
          </fieldset>

          <button type="button" className="primary-button start-button" data-testid="start-game" onClick={onStart}>
            {t(lang, 'title.start')}
          </button>
          <p className="snapshot-note">{t(lang, 'title.snapshotNote')}</p>
        </div>
      </section>
    </main>
  );
}
