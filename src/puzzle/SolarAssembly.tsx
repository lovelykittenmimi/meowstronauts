import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import baseImage from '../assets/puzzle/base.webp';
import greenhouseImage from '../assets/puzzle/greenhouse.webp';
import outerWallImage from '../assets/puzzle/outer-wall.webp';
import solarImage from '../assets/puzzle/solar-array.webp';
import type { Lang } from '../game/types';
import './SolarAssembly.css';

export type AssemblyId = 'power' | 'lifeSupport' | 'shield';

interface ModuleDef {
  id: AssemblyId;
  icon: string;
  label: Record<Lang, string>;
}

const MODULES: ModuleDef[] = [
  {
    id: 'power',
    icon: '⚡',
    label: { en: 'Solar array', 'zh-TW': '太陽能陣列' },
  },
  {
    id: 'lifeSupport',
    icon: '💧',
    label: { en: 'Greenhouse', 'zh-TW': '溫室' },
  },
  {
    id: 'shield',
    icon: '🛡️',
    label: { en: 'Outer wall', 'zh-TW': '外牆' },
  },
];

const IMAGES: Record<AssemblyId, string> = {
  power: solarImage,
  lifeSupport: greenhouseImage,
  shield: outerWallImage,
};

interface DragState {
  id: AssemblyId;
  startX: number;
  startY: number;
  moved: boolean;
}

interface SolarAssemblyProps {
  placed: AssemblyId[];
  lang: Lang;
  onPlace: (id: AssemblyId) => void;
  onHint: (message: string | null) => void;
  message: ReactNode;
  dialogueAction?: ReactNode;
}

export function SolarAssembly({
  placed,
  lang,
  onPlace,
  onHint,
  message,
  dialogueAction,
}: SolarAssemblyProps) {
  const [selected, setSelected] = useState<AssemblyId | null>(null);
  const [dragging, setDragging] = useState<AssemblyId | null>(null);
  const [dragMoved, setDragMoved] = useState(false);
  const [dragPoint, setDragPoint] = useState({ x: 0, y: 0 });
  const dragRef = useRef<DragState | null>(null);
  const suppressClickUntil = useRef(0);

  const isPlaced = (id: AssemblyId) => placed.includes(id);
  const labelFor = (id: AssemblyId) =>
    MODULES.find((module) => module.id === id)?.label[lang] ?? id;

  const select = (id: AssemblyId) => {
    if (isPlaced(id)) return;
    setSelected(id);
    onHint(
      lang === 'en'
        ? `Drag ${labelFor(id)} onto its pad.`
        : `把${labelFor(id)}拖到它的位置。`,
    );
  };

  const placeOnTarget = (id: AssemblyId, target: AssemblyId | null) => {
    if (isPlaced(id)) {
      onHint(
        lang === 'en'
          ? `${labelFor(id)} is already online.`
          : `${labelFor(id)} 已經上線了。`,
      );
      return;
    }
    if (!target) {
      onHint(
        lang === 'en'
          ? 'Drop the module on its dashed pad.'
          : '把模組放到虛線位置。',
      );
      return;
    }
    if (target !== id) {
      onHint(
        lang === 'en'
          ? `That pad is for the ${labelFor(target)}.`
          : `那個位置是給${labelFor(target)}的。`,
      );
      return;
    }

    setSelected(null);
    onHint(null);
    onPlace(id);
  };

  const place = (id: AssemblyId) => {
    if (!selected) {
      onHint(
        lang === 'en'
          ? 'Pick a module from the tray first.'
          : '先從右邊選一個模組。',
      );
      return;
    }
    placeOnTarget(selected, id);
  };

  const startDrag = (
    event: ReactPointerEvent<HTMLButtonElement>,
    id: AssemblyId,
  ) => {
    if (isPlaced(id)) return;
    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
    setDragging(id);
    setDragMoved(false);
    setDragPoint({ x: event.clientX, y: event.clientY });
    setSelected(id);
    onHint(
      lang === 'en'
        ? `Drag ${labelFor(id)} onto its pad.`
        : `把${labelFor(id)}拖到它的位置。`,
    );
  };

  const moveDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (
      !drag.moved &&
      Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6
    ) {
      drag.moved = true;
      setDragMoved(true);
    }
    setDragPoint({ x: event.clientX, y: event.clientY });
  };

  const endDrag = (
    event: ReactPointerEvent<HTMLButtonElement>,
    id: AssemblyId,
  ) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    setDragging(null);
    setDragMoved(false);
    suppressClickUntil.current = Date.now() + 300;

    if (!drag.moved) {
      select(id);
      return;
    }

    const point = document.elementFromPoint(event.clientX, event.clientY);

    if (id === 'shield') {
      if (point?.closest('.assembly-board')) {
        placeOnTarget('shield', 'shield');
      } else {
        onHint(
          lang === 'en'
            ? 'Drop the wall on the base.'
            : '把外牆放到基地上。',
        );
      }
      return;
    }

    const target = point?.closest<HTMLElement>('[data-drop-id]');
    const raw = target?.dataset.dropId;
    const dropId =
      raw === 'power' || raw === 'lifeSupport' || raw === 'shield'
        ? raw
        : null;
    placeOnTarget(id, dropId);
  };

  const cancelDrag = () => {
    dragRef.current = null;
    setDragging(null);
    setDragMoved(false);
  };

  const handleClick = (id: AssemblyId) => {
    if (Date.now() < suppressClickUntil.current) return;
    select(id);
  };

  return (
    <div className="solar-assembly" data-testid="story-puzzle">
      <div className="assembly-main">
        <div className="assembly-board-column">
          <div className="assembly-board-wrap">
            <div
              className="assembly-board"
              data-testid="story-puzzle-board"
              onClick={(event) => {
                if (
                  event.target === event.currentTarget &&
                  selected === 'shield' &&
                  !isPlaced('shield')
                ) {
                  place('shield');
                }
              }}
            >
              <img className="assembly-base" src={baseImage} alt="" draggable={false} />

              <img
                className={`assembly-cutout assembly-cutout-wall ${selected === 'shield' ? 'is-ghost' : ''} ${isPlaced('shield') ? 'is-placed' : ''}`}
                src={outerWallImage}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
              <img
                className={`assembly-cutout assembly-cutout-solar ${selected === 'power' ? 'is-ghost' : ''} ${isPlaced('power') ? 'is-placed' : ''}`}
                src={solarImage}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
              <img
                className={`assembly-cutout assembly-cutout-greenhouse ${selected === 'lifeSupport' ? 'is-ghost' : ''} ${isPlaced('lifeSupport') ? 'is-placed' : ''}`}
                src={greenhouseImage}
                alt=""
                aria-hidden="true"
                draggable={false}
              />

              <button
                type="button"
                className={`assembly-slot assembly-slot-power ${selected === 'power' ? 'is-target' : ''} ${isPlaced('power') ? 'is-placed' : ''}`}
                data-drop-id="power"
                data-testid="story-puzzle-slot-power"
                onClick={() => place('power')}
                aria-label={labelFor('power')}
              />

              <button
                type="button"
                className={`assembly-slot assembly-slot-lifeSupport ${selected === 'lifeSupport' ? 'is-target' : ''} ${isPlaced('lifeSupport') ? 'is-placed' : ''}`}
                data-drop-id="lifeSupport"
                data-testid="story-puzzle-slot-lifeSupport"
                onClick={() => place('lifeSupport')}
                aria-label={labelFor('lifeSupport')}
              />

              <button
                type="button"
                className={`assembly-slot assembly-slot-shield ${selected === 'shield' ? 'is-target' : ''} ${isPlaced('shield') ? 'is-placed' : ''}`}
                data-drop-id="shield"
                data-testid="story-puzzle-slot-shield"
                onClick={() => place('shield')}
                aria-label={labelFor('shield')}
              />
            </div>
          </div>
        </div>

        <aside className="assembly-tray" data-testid="story-puzzle-tray">
          <div className="assembly-cards">
            {MODULES.map((module) => (
              <button
                type="button"
                key={module.id}
                className={`assembly-card ${selected === module.id ? 'is-selected' : ''} ${dragging === module.id && dragMoved ? 'is-dragging' : ''}`}
                data-testid={`story-puzzle-piece-${module.id}`}
                onClick={() => handleClick(module.id)}
                onPointerDown={(event) => startDrag(event, module.id)}
                onPointerMove={moveDrag}
                onPointerUp={(event) => endDrag(event, module.id)}
                onPointerCancel={cancelDrag}
                onDragStart={(event) => event.preventDefault()}
                disabled={isPlaced(module.id)}
                aria-pressed={selected === module.id}
                aria-label={module.label[lang]}
              >
                <img
                  className="assembly-card-image"
                  src={IMAGES[module.id]}
                  alt=""
                  draggable={false}
                />
              </button>
            ))}
          </div>

          <div className="assembly-progress" aria-label={lang === 'en' ? 'Systems online' : '系統上線進度'}>
            {MODULES.map((module) => (
              <span
                key={module.id}
                className={isPlaced(module.id) ? 'is-on' : ''}
                aria-label={`${module.label[lang]}: ${isPlaced(module.id) ? 'online' : 'offline'}`}
                title={`${module.label[lang]}: ${isPlaced(module.id) ? 'online' : 'offline'}`}
              >
                {module.icon}
              </span>
            ))}
          </div>
        </aside>
      </div>

      <div className="assembly-dialogue" data-testid="story-puzzle-dialogue">
        <div className="assembly-dialogue-copy">{message}</div>
        {dialogueAction}
      </div>

      {dragging &&
        dragMoved &&
        createPortal(
          <img
            className="assembly-drag-ghost"
            src={IMAGES[dragging]}
            alt=""
            aria-hidden="true"
            draggable={false}
            style={{ left: dragPoint.x, top: dragPoint.y }}
          />,
          document.body,
        )}
    </div>
  );
}
