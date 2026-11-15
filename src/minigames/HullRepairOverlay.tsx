import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import hullCss from './hull/hull.css?inline';
import { HullRepairGame } from './hull/HullRepairGame';
import type { Lang } from '../game/types';

interface HullRepairOverlayProps {
  initialLang: Lang;
  sol: number;
  onDone: () => void;
}

/**
 * Mounts the hull-repair mini-game in a shadow root. Its CSS is injected into
 * the shadow tree so the game's global styles cannot leak in, and the
 * mini-game's `.stage`, `.dock` and `.leak` classes cannot leak out.
 */
export default function HullRepairOverlay({
  initialLang,
  sol,
  onDone,
}: HullRepairOverlayProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef({ initialLang, sol, onDone });
  optionsRef.current = { initialLang, sol, onDone };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    shadow.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = hullCss;
    const mount = document.createElement('div');
    mount.className = 'hull-shadow-mount';
    shadow.append(style, mount);

    const root = createRoot(mount);
    root.render(
      <HullRepairGame
        initialLang={optionsRef.current.initialLang}
        sol={optionsRef.current.sol}
        onDone={() => optionsRef.current.onDone()}
      />,
    );

    return () => {
      // The mini-game's onDone dispatch can unmount this overlay while React
      // is already rendering. Unmounting the nested root synchronously here
      // triggers React's "unmount during render" warning, so defer one tick.
      // Remove only this mount, never the whole shadow root: in StrictMode a
      // second effect run may already have mounted the next root.
      const currentRoot = root;
      const currentMount = mount;
      window.setTimeout(() => {
        currentRoot.unmount();
        if (currentMount.parentNode === shadow) {
          currentMount.remove();
        }
      }, 0);
    };
  }, []);

  return <div ref={hostRef} className="hull-overlay-host" data-testid="hull-overlay" />;
}
