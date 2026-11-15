import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import tomatoCss from './styles.css?inline';
import TomatoHarvestGame from './TomatoHarvestGame';
import type { Lang } from '../../game/types';

interface TomatoHarvestOverlayProps {
  initialLang: Lang;
  sol: number;
  onDone: (completed: boolean) => void;
}

/**
 * Mounts the tomato harvest in its own shadow root, matching the other
 * mini-games so no greenhouse styles leak into the event card.
 */
export default function TomatoHarvestOverlay({
  initialLang,
  sol,
  onDone,
}: TomatoHarvestOverlayProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef({ initialLang, sol, onDone });
  optionsRef.current = { initialLang, sol, onDone };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    shadow.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = tomatoCss;
    const mount = document.createElement('div');
    mount.className = 'tomato-shadow-mount';
    shadow.append(style, mount);

    const root = createRoot(mount);
    root.render(
      <TomatoHarvestGame
        initialLang={optionsRef.current.initialLang}
        sol={optionsRef.current.sol}
        onDone={(completed) => optionsRef.current.onDone(completed)}
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
      className="tomato-overlay-host"
      data-testid="tomato-overlay"
    />
  );
}
