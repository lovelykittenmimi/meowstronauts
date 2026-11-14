import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import landerCss from './lander/styles.css?inline';
import WeatherLanderGame from './lander/WeatherLanderGame';
import type { Lang } from '../game/types';

interface LanderOverlayProps {
  initialLang: Lang;
  onClose: () => void;
}

/**
 * Mounts the landing mini-game in a shadow root. The game's CSS is injected
 * into the shadow tree, so its generic class names cannot leak into the main
 * game's global stylesheet.
 */
export default function LanderOverlay({ initialLang, onClose }: LanderOverlayProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef({ initialLang, onClose });
  optionsRef.current = { initialLang, onClose };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    shadow.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = landerCss;
    const mount = document.createElement('div');
    mount.className = 'lander-shadow-mount';
    shadow.append(style, mount);

    const root = createRoot(mount);
    root.render(
      <WeatherLanderGame
        initialLang={optionsRef.current.initialLang}
        onExit={() => optionsRef.current.onClose()}
      />,
    );

    return () => {
      root.unmount();
      shadow.innerHTML = '';
    };
  }, []);

  return <div ref={hostRef} className="lander-overlay-host" data-testid="lander-overlay" />;
}
