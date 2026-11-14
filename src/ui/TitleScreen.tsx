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
        <div className="title-art" aria-hidden="true">
          <span className="title-ground" />
          <img className="title-cat title-cat-silver" src="/brand/full-silver-800.webp" alt="" />
          <img className="title-cat title-cat-ginger" src="/brand/full-ginger-800.webp" alt="" />
          <img className="title-cat title-cat-shadow" src="/brand/full-shadow-800.webp" alt="" />
        </div>
        <div className="title-copy">
          <div className="title-topline">
            <img src="/brand/logo-three-cats-512.png" alt="" width="56" height="56" />
            <button type="button" className="ghost-button" onClick={onToggleLang}>
              {t(lang, 'common.lang')}
            </button>
          </div>
          <h1>{t(lang, 'app.title')}</h1>
          <p className="tagline">{t(lang, 'app.subtitle')}</p>
          <p className="title-pitch">{t(lang, 'title.tagline')}</p>

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
          <p className="snapshot-note">
            NASA data snapshots · Historical weather and space-weather records, not live.
          </p>
        </div>
      </section>
    </main>
  );
}
