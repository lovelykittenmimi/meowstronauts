import type { Lang } from '../game/types';

/** Shown by CSS only on narrow portrait screens; landscape play is the target. */
export function RotateHint({ lang }: { lang: Lang }) {
  return (
    <div className="rotate-hint" role="status">
      <span className="rotate-hint-icon" aria-hidden="true">
        ⟳
      </span>
      <p>
        {lang === 'en'
          ? 'Rotate your device to landscape to keep playing.'
          : '請把裝置橫放，繼續任務。'}
      </p>
    </div>
  );
}
