import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import radiationCss from './radiation/styles.css?inline';
import ShelterDrill from './radiation/ShelterDrill';
import type { Lang } from '../game/types';

interface RadiationOverlayProps {
  initialLang: Lang;
  onClose: () => void;
  onComplete?: (cardId: string) => void;
}

/**
 * Mounts the shelter drill in a shadow root, matching the lander overlay:
 * its CSS cannot leak into the main game, and the game can be opened from the
 * story or the sol row without touching the reducer.
 */
export default function RadiationOverlay({
  initialLang,
  onClose,
  onComplete,
}: RadiationOverlayProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef({ initialLang, onClose, onComplete });
  optionsRef.current = { initialLang, onClose, onComplete };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    shadow.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = radiationCss;
    const mount = document.createElement('div');
    mount.className = 'shelter-shadow-mount';
    shadow.append(style, mount);

    const root = createRoot(mount);
    root.render(
      <ShelterDrill
        initialLang={optionsRef.current.initialLang}
        onExit={() => optionsRef.current.onClose()}
        onComplete={(cardId) => optionsRef.current.onComplete?.(cardId)}
      />,
    );

    return () => {
      root.unmount();
      shadow.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="shelter-overlay-host"
      data-testid="shelter-overlay"
    />
  );
}
