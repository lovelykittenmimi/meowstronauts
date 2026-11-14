import type { ReactNode } from 'react';
import type { CatId, Lang } from '../../../game/types';
import { MATERIALS } from '../game/materials';
import { MATERIAL_COPY, t } from '../game/i18n';
import type { PlacedMaterials, SlotId } from '../game/types';
import { CAT_AVATAR, CAT_HELMET } from './avatars';

interface ShelterDiagramProps {
  lang: Lang;
  placed: PlacedMaterials;
  selectedSlot?: SlotId | null;
  onSelectSlot?: (slot: SlotId) => void;
  moving?: boolean;
  storm?: boolean;
  insideIds?: CatId[];
  lateIds?: CatId[];
  reducedMotion?: boolean;
  /** During preparation the crew is still outside, so the shelter is empty. */
  showCrew?: boolean;
}

interface SlotContentProps {
  lang: Lang;
  slot: SlotId;
  id: PlacedMaterials[SlotId];
}

function SlotContent({ lang, slot, id }: SlotContentProps) {
  return (
    <>
      <span className="shelter-slot-label">{t(lang, slot === 'roof' ? 'slotRoof' : 'slotWall')}</span>
      {id ? (
        <>
          <span className="shelter-slot-icon" aria-hidden="true">
            {MATERIALS[id].icon}
          </span>
          <span className="shelter-slot-name">{MATERIAL_COPY[lang][id].name}</span>
        </>
      ) : (
        <span className="shelter-slot-empty">+ {t(lang, 'slotEmpty')}</span>
      )}
    </>
  );
}

function Slot({
  lang,
  slot,
  id,
  selected,
  onSelect,
}: SlotContentProps & {
  selected: boolean;
  onSelect?: (slot: SlotId) => void;
}) {
  const className = `shelter-slot shelter-slot-${slot} ${
    selected ? 'is-selected' : ''
  } ${id ? 'is-filled' : ''}`;

  if (!onSelect) {
    return (
      <div className={className} data-testid={`shelter-slot-${slot}`}>
        <SlotContent lang={lang} slot={slot} id={id} />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={className}
      data-testid={`shelter-slot-${slot}`}
      aria-pressed={selected}
      aria-label={`${t(lang, slot === 'roof' ? 'slotRoof' : 'slotWall')}: ${
        id ? MATERIAL_COPY[lang][id].name : t(lang, 'slotEmpty')
      }`}
      onClick={() => onSelect(slot)}
    >
      <SlotContent lang={lang} slot={slot} id={id} />
    </button>
  );
}

function ShelterInterior({
  lang,
  insideIds,
  lateIds,
  showCrew,
}: {
  lang: Lang;
  insideIds: CatId[];
  lateIds: CatId[];
  showCrew: boolean;
}) {
  return (
    <div className="shelter-body">
      <div className="shelter-interior">
        {showCrew ? (
          insideIds.length > 0 ? (
            <div className="shelter-cats">
              {insideIds.map((id) => (
                <img key={id} src={CAT_AVATAR[id]} alt="" />
              ))}
            </div>
          ) : (
            <span className="shelter-empty">…</span>
          )
        ) : (
          <span className="shelter-crew-out">{t(lang, 'crewOutside')}</span>
        )}
        <span className="shelter-label">{t(lang, 'shelter')}</span>
      </div>
      <div className="shelter-door" aria-hidden="true">
        <span />
      </div>
      {lateIds.length > 0 && (
        <div className="shelter-late">
          {lateIds.map((id) => (
            <img key={id} src={CAT_HELMET[id]} alt="" />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The cutaway is a diagram, not a physical cross-section: the roof band faces
 * the Sun, the wall band is the side layer. The player can click either band
 * to choose which layer the material palette will fill.
 */
export function ShelterDiagram({
  lang,
  placed,
  selectedSlot = null,
  onSelectSlot,
  moving = false,
  storm = false,
  insideIds,
  lateIds = [],
  reducedMotion = false,
  showCrew = true,
}: ShelterDiagramProps) {
  const allCats: CatId[] = ['shadow', 'silver', 'ginger'];
  const inside = insideIds ?? allCats;
  const particles = Array.from({ length: 16 }, (_, index) => ({
    left: `${8 + ((index * 37) % 82)}%`,
    delay: `${(index % 6) * 0.09}s`,
    duration: `${0.65 + (index % 4) * 0.16}s`,
  }));

  let stormLayer: ReactNode = null;
  if (storm && !reducedMotion) {
    stormLayer = (
      <div className="storm-layer" aria-hidden="true">
        {particles.map((particle, index) => (
          <span
            key={`sep-${index}`}
            className="sep-particle"
            style={{
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
        {Array.from({ length: 7 }, (_, index) => (
          <span
            key={`gcr-${index}`}
            className="gcr-line"
            style={{
              left: `${6 + index * 13}%`,
              transform: `rotate(${-32 + index * 11}deg)`,
              animationDelay: `${index * 0.12}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`shelter-stage ${moving ? 'is-moving' : ''} ${
        storm ? 'is-storm' : ''
      } ${reducedMotion ? 'is-reduced' : ''}`}
      data-testid="shelter-stage"
      data-storm={storm ? 'yes' : 'no'}
    >
      <div className="stage-sky" aria-hidden="true" />
      <div className="stage-sun" aria-hidden="true" />
      <div className="stage-ground" aria-hidden="true" />
      <div className="stage-habitat" aria-hidden="true">
        <span>HOPE-1</span>
      </div>
      <div className="stage-path" aria-hidden="true" />
      <div className="stage-player" aria-hidden="true">
        🧑‍🚀
      </div>

      <div className="stage-shelter">
        <Slot
          lang={lang}
          slot="roof"
          id={placed.roof}
          selected={selectedSlot === 'roof'}
          onSelect={onSelectSlot}
        />
        <ShelterInterior
          lang={lang}
          insideIds={inside}
          lateIds={lateIds}
          showCrew={showCrew}
        />
        <Slot
          lang={lang}
          slot="wall"
          id={placed.wall}
          selected={selectedSlot === 'wall'}
          onSelect={onSelectSlot}
        />
      </div>

      {stormLayer}
    </div>
  );
}
