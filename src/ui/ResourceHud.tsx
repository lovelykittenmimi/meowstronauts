import { RESOURCE_ORDER, BACKPACK_SIZE } from '../game/balance';
import type { GameState, ResourceKey } from '../game/types';
import { RESOURCE_LABEL_KEY, t } from '../i18n';

const ICONS: Record<ResourceKey, string> = {
  power: '⚡',
  lifeSupport: '💧',
  shield: '🛡️',
  food: '🥕',
  health: '❤️',
  science: '🔬',
};

function testIdFor(key: ResourceKey): string {
  return `resource-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
}

interface ResourceHudProps {
  state: GameState;
  onBackpack: () => void;
  onData: () => void;
  onToggleLang?: () => void;
}

export function ResourceHud({ state, onBackpack, onData, onToggleLang }: ResourceHudProps) {
  const { lang, resources } = state;

  return (
    <header className="hud">
      <div className="hud-brand">
        <img src="/brand/logo-three-cats-512.png" alt="" width="40" height="40" />
        <div>
          <strong>{t(lang, 'app.title')}</strong>
          <span className="hud-sol">
            {t(lang, 'briefing.sol', { sol: state.sol })}
          </span>
        </div>
      </div>

      <div className="hud-resources" aria-label="Resources">
        {RESOURCE_ORDER.map((key) => (
          <div className="resource" key={key}>
            <span aria-hidden="true">{ICONS[key]}</span>
            <span className="resource-label">{t(lang, RESOURCE_LABEL_KEY[key])}</span>
            <strong data-testid={testIdFor(key)}>{resources[key]}</strong>
            {key === 'food' && <small aria-hidden="true">/12</small>}
          </div>
        ))}
      </div>

      <div className="hud-actions">
        <button type="button" className="ghost-button" onClick={onData} data-testid="data-panel-button">
          {t(lang, 'data.button')}
        </button>
        <button
          type="button"
          className="backpack-button"
          onClick={onBackpack}
          data-testid="backpack-button"
          aria-label={t(lang, 'hud.backpack')}
        >
          <span aria-hidden="true">🎒</span>
          <span data-testid="backpack-count">
            {state.collectedCards.length} / {BACKPACK_SIZE}
          </span>
        </button>
        {onToggleLang && (
          <button type="button" className="ghost-button" onClick={onToggleLang}>
            {t(lang, 'common.lang')}
          </button>
        )}
      </div>
    </header>
  );
}
