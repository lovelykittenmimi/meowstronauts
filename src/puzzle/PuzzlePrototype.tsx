import { useEffect, useState } from 'react';

type ModuleId = 'solar' | 'greenhouse' | 'wall';

interface ModuleDef {
  id: ModuleId;
  label: string;
  icon: string;
  short: string;
  success: string;
}

const MODULES: ModuleDef[] = [
  {
    id: 'solar',
    label: 'Solar array',
    icon: '⚡',
    short: 'Power for the outpost',
    success: 'Solar array online. Power is flowing.',
  },
  {
    id: 'greenhouse',
    label: 'Greenhouse',
    icon: '💧',
    short: 'Food, water, and oxygen',
    success: 'Greenhouse online. The seedlings are safe.',
  },
  {
    id: 'wall',
    label: 'Outer wall',
    icon: '🛡️',
    short: 'Radiation shielding',
    success: 'Outer wall sealed. The crew is shielded.',
  },
];

const INITIAL_MESSAGE = 'Tap a module, then tap its pad on the base.';
const DONE_MESSAGE = 'Outpost online. All three systems are connected.';

const EMPTY_PLACED: Record<ModuleId, boolean> = {
  solar: false,
  greenhouse: false,
  wall: false,
};

function labelFor(id: ModuleId): string {
  return MODULES.find((module) => module.id === id)?.label ?? id;
}

export function PuzzlePrototype() {
  const [selected, setSelected] = useState<ModuleId | null>(null);
  const [placed, setPlaced] = useState<Record<ModuleId, boolean>>(EMPTY_PLACED);
  const [message, setMessage] = useState(INITIAL_MESSAGE);
  const [completed, setCompleted] = useState(false);
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  useEffect(() => {
    const onResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const placedCount = MODULES.filter((module) => placed[module.id]).length;
  const allPlaced = placedCount === MODULES.length;

  const reset = () => {
    setSelected(null);
    setPlaced(EMPTY_PLACED);
    setMessage(INITIAL_MESSAGE);
    setCompleted(false);
  };

  const selectModule = (id: ModuleId) => {
    if (placed[id]) return;
    setSelected(id);
    setCompleted(false);
    setMessage(`${labelFor(id)} selected. Tap its pad on the base.`);
  };

  const placeModule = (id: ModuleId) => {
    if (placed[id]) {
      setMessage(`${labelFor(id)} is already online.`);
      return;
    }
    if (!selected) {
      setMessage('Pick a module from the tray first.');
      return;
    }
    if (selected !== id) {
      setMessage(`That pad is for the ${labelFor(id)}.`);
      return;
    }

    const next = { ...placed, [id]: true };
    const complete = Object.values(next).every(Boolean);
    setPlaced(next);
    setSelected(null);
    setCompleted(complete);
    setMessage(
      complete
        ? DONE_MESSAGE
        : MODULES.find((module) => module.id === id)?.success ?? DONE_MESSAGE,
    );
  };

  return (
    <main className={`puzzle-screen ${completed ? 'is-complete' : ''}`} data-testid="puzzle-screen">
      <header className="puzzle-top">
        <div className="puzzle-title">
          <div>
            <p className="eyebrow">Scene 5 · Three systems</p>
            <h1>Build the outpost</h1>
          </div>
          <p className="puzzle-sub">Tap a module, then tap its pad.</p>
        </div>

        <div className="puzzle-dots" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} className={`puzzle-dot ${index < 5 ? 'is-on' : ''}`} />
          ))}
        </div>

        <div className="puzzle-meta">
          <span className="puzzle-badge" data-testid="puzzle-viewport">
            {viewport.width} × {viewport.height}
          </span>
          <button type="button" className="puzzle-reset" onClick={reset}>
            Reset
          </button>
        </div>
      </header>

      <div className="puzzle-main">
        <div className="board-column">
          <div className="board-wrap">
            <div className="puzzle-board" data-testid="puzzle-board">
              <div className="board-sky" />
              <div className="board-ground" />
              <div className="board-dome" />
              <div className="board-dish" />
              <div className="board-rover" />
              <div className="board-rocks" />

              {placed.wall && (
                <>
                  <div className="board-wall-ring" data-testid="puzzle-wall-placed" />
                  <div className="board-wall-gate" />
                </>
              )}

              <button
                type="button"
                className={`puzzle-slot slot-solar ${selected === 'solar' ? 'is-target' : ''} ${placed.solar ? 'is-placed' : ''}`}
                data-testid="puzzle-slot-solar"
                onClick={() => placeModule('solar')}
                aria-label="Solar array pad"
              >
                {placed.solar ? 'Solar online' : 'Solar pad'}
              </button>

              <button
                type="button"
                className={`puzzle-slot slot-greenhouse ${selected === 'greenhouse' ? 'is-target' : ''} ${placed.greenhouse ? 'is-placed' : ''}`}
                data-testid="puzzle-slot-greenhouse"
                onClick={() => placeModule('greenhouse')}
                aria-label="Greenhouse pad"
              >
                {placed.greenhouse ? 'Greenhouse online' : 'Greenhouse pad'}
              </button>

              <button
                type="button"
                className={`puzzle-slot slot-wall ${selected === 'wall' ? 'is-target' : ''} ${placed.wall ? 'is-placed' : ''}`}
                data-testid="puzzle-slot-wall"
                onClick={() => placeModule('wall')}
                aria-label="Outer wall footing"
              >
                {placed.wall ? 'Wall sealed' : 'Outer wall footing'}
              </button>
            </div>
          </div>

          <div className="puzzle-toast" data-testid="puzzle-toast">
            <img src="/brand/avatar-shadow-512.webp" alt="" />
            <p>{message}</p>
          </div>
        </div>

        <aside className="puzzle-tray" data-testid="puzzle-tray">
          <div className="tray-head">
            <span>Modules</span>
            <span>{placedCount} / 3</span>
          </div>

          <div className="tray-cards">
            {MODULES.map((module) => (
              <button
                type="button"
                key={module.id}
                className={`tray-card ${selected === module.id ? 'is-selected' : ''}`}
                data-testid={`puzzle-piece-${module.id}`}
                onClick={() => selectModule(module.id)}
                disabled={placed[module.id]}
                aria-pressed={selected === module.id}
              >
                <span className="tray-icon" aria-hidden="true">{module.icon}</span>
                <span className="tray-copy">
                  <strong>{module.label}</strong>
                  <small>{module.short}</small>
                </span>
                <span className="tray-state">
                  {placed[module.id] ? '✓' : selected === module.id ? 'Selected' : ''}
                </span>
              </button>
            ))}
          </div>

          <div className="puzzle-progress" data-testid="puzzle-progress" aria-label="Systems online">
            {MODULES.map((module) => (
              <span
                key={module.id}
                className={placed[module.id] ? 'is-on' : ''}
                aria-label={`${module.label}: ${placed[module.id] ? 'online' : 'offline'}`}
                title={`${module.label}: ${placed[module.id] ? 'online' : 'offline'}`}
              >
                {module.icon}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="puzzle-continue"
            data-testid="puzzle-continue"
            disabled={!allPlaced}
            onClick={() => {
              if (allPlaced) setMessage('Prototype complete — this is where Sol 1 would begin.');
            }}
          >
            {allPlaced ? 'Continue' : `Place ${3 - placedCount} more`}
          </button>
        </aside>
      </div>

      <div className="puzzle-rotate" role="status">
        <span aria-hidden="true">⟳</span>
        <p>Rotate your device to landscape to keep playing.</p>
      </div>
    </main>
  );
}
