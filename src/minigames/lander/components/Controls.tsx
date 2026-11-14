import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { t } from '../game/i18n';
import type { Direction, Lang } from '../game/types';

interface ControlsProps {
  lang: Lang;
  disabled: boolean;
  onPress: (direction: Direction) => void;
  onRelease: (direction: Direction) => void;
  onLand: () => void;
  onReset: () => void;
  onNewSol: () => void;
  guide: ReactNode;
}

const ARROWS: Record<Direction, string> = {
  up: '▲',
  down: '▼',
  left: '◀',
  right: '▶',
};

const ARIA: Record<Direction, string> = {
  up: 'Move up',
  down: 'Move down',
  left: 'Move left',
  right: 'Move right',
};

export default function Controls({
  lang,
  disabled,
  onPress,
  onRelease,
  onLand,
  onReset,
  onNewSol,
  guide,
}: ControlsProps) {
  const press = (direction: Direction) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    onPress(direction);
  };

  const release = (direction: Direction) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onRelease(direction);
  };

  return (
    <section className="control-deck" aria-label={t(lang, 'title')}>
      <div className="dpad" aria-label="Direction controls">
        <span />
        <button
          type="button"
          className="dpad-button"
          aria-label={ARIA.up}
          disabled={disabled}
          onPointerDown={press('up')}
          onPointerUp={release('up')}
          onPointerLeave={release('up')}
          onPointerCancel={release('up')}
          onContextMenu={(event) => event.preventDefault()}
        >
          {ARROWS.up}
        </button>
        <span />
        <button
          type="button"
          className="dpad-button"
          aria-label={ARIA.left}
          disabled={disabled}
          onPointerDown={press('left')}
          onPointerUp={release('left')}
          onPointerLeave={release('left')}
          onPointerCancel={release('left')}
          onContextMenu={(event) => event.preventDefault()}
        >
          {ARROWS.left}
        </button>
        <span className="dpad-center" aria-hidden="true" />
        <button
          type="button"
          className="dpad-button"
          aria-label={ARIA.right}
          disabled={disabled}
          onPointerDown={press('right')}
          onPointerUp={release('right')}
          onPointerLeave={release('right')}
          onPointerCancel={release('right')}
          onContextMenu={(event) => event.preventDefault()}
        >
          {ARROWS.right}
        </button>
        <span />
        <button
          type="button"
          className="dpad-button"
          aria-label={ARIA.down}
          disabled={disabled}
          onPointerDown={press('down')}
          onPointerUp={release('down')}
          onPointerLeave={release('down')}
          onPointerCancel={release('down')}
          onContextMenu={(event) => event.preventDefault()}
        >
          {ARROWS.down}
        </button>
        <span />
      </div>

      <div className="guide-slot">{guide}</div>

      <div className="control-actions">
        <button type="button" className="land-button" disabled={disabled} onClick={onLand}>
          {t(lang, 'land')}
        </button>
        <div className="secondary-actions">
          <button type="button" className="ghost-button" disabled={disabled} onClick={onReset}>
            {t(lang, 'reset')}
          </button>
          <button type="button" className="ghost-button" disabled={disabled} onClick={onNewSol}>
            {t(lang, 'newSol')}
          </button>
        </div>
        <p className="control-hint hint-keyboard">{t(lang, 'keyboardHint')}</p>
        <p className="control-hint hint-touch">{t(lang, 'touchHint')}</p>
      </div>
    </section>
  );
}
