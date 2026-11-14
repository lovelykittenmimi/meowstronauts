import type { Lang } from '../../../game/types';
import { computeShield } from '../game/dose';
import { MATERIAL_COPY, t } from '../game/i18n';
import {
  MASS_BUDGET,
  MATERIALS,
  MATERIAL_ORDER,
  WATER_BUDGET,
  canPlaceMaterial,
  isComplete,
  materialCost,
} from '../game/materials';
import type { MaterialId, PlacedMaterials, SlotId } from '../game/types';

interface PrepPanelProps {
  lang: Lang;
  placed: PlacedMaterials;
  selectedSlot: SlotId;
  onSelectSlot: (slot: SlotId) => void;
  onPlace: (id: MaterialId) => void;
  onClear: (slot: SlotId) => void;
  moving: boolean;
  onMove: () => void;
}

function PercentBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="prep-meter">
      <span>{label}</span>
      <div className="prep-meter-track" aria-hidden="true">
        <span style={{ width: `${Math.round(value * 100)}%` }} />
      </div>
      <strong>{Math.round(value * 100)}%</strong>
    </div>
  );
}

export function PrepPanel({
  lang,
  placed,
  selectedSlot,
  onSelectSlot,
  onPlace,
  onClear,
  moving,
  onMove,
}: PrepPanelProps) {
  const cost = materialCost(placed);
  const shield = computeShield(placed);
  const complete = isComplete(placed);
  const selectedMaterial = placed[selectedSlot];
  const slots: SlotId[] = ['roof', 'wall'];

  return (
    <section className="prep-panel" data-testid="shelter-prep-panel">
      <div className="prep-panel-head">
        <div>
          <p className="eyebrow">{t(lang, 'selectSlot')}</p>
          <h2>{t(lang, 'prepTitle')}</h2>
        </div>
        {selectedMaterial && (
          <button
            type="button"
            className="prep-clear"
            data-testid="shelter-clear-slot"
            onClick={() => onClear(selectedSlot)}
          >
            {t(lang, 'slotClear')}
          </button>
        )}
      </div>

      <div className="prep-slot-tabs" role="group" aria-label={t(lang, 'selectSlot')}>
        {slots.map((slot) => {
          const id = placed[slot];
          return (
            <button
              key={slot}
              type="button"
              className={`prep-slot-tab ${selectedSlot === slot ? 'is-selected' : ''}`}
              data-testid={`shelter-select-${slot}`}
              aria-pressed={selectedSlot === slot}
              onClick={() => onSelectSlot(slot)}
            >
              <span className="prep-slot-tab-label">
                {t(lang, slot === 'roof' ? 'slotRoof' : 'slotWall')}
              </span>
              <span className="prep-slot-tab-value">
                {id ? `${MATERIALS[id].icon} ${MATERIAL_COPY[lang][id].name}` : t(lang, 'slotEmpty')}
              </span>
            </button>
          );
        })}
      </div>

      <div className="prep-budgets">
        <div className="prep-budget">
          <div className="prep-budget-top">
            <span>{t(lang, 'budgetMass', { used: cost.mass, max: MASS_BUDGET })}</span>
            <strong>{Math.round((cost.mass / MASS_BUDGET) * 100)}%</strong>
          </div>
          <div className="prep-budget-track" aria-hidden="true">
            <span
              className={cost.mass > MASS_BUDGET ? 'is-over' : ''}
              style={{ width: `${Math.min(100, (cost.mass / MASS_BUDGET) * 100)}%` }}
            />
          </div>
        </div>
        <div className="prep-budget">
          <div className="prep-budget-top">
            <span>{t(lang, 'budgetWater', { used: cost.water, max: WATER_BUDGET })}</span>
            <strong>{Math.round((cost.water / WATER_BUDGET) * 100)}%</strong>
          </div>
          <div className="prep-budget-track" aria-hidden="true">
            <span
              className={cost.water > WATER_BUDGET ? 'is-over' : ''}
              style={{ width: `${Math.min(100, (cost.water / WATER_BUDGET) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="prep-shield">
        <p className="prep-section-label">{t(lang, 'shieldPreview')}</p>
        <PercentBar label={t(lang, 'shieldSep')} value={shield.sep} />
        <PercentBar label={t(lang, 'shieldGcr')} value={shield.gcr} />
        <p className="prep-shield-note">{t(lang, 'shieldBaseline')}</p>
      </div>

      <p className="prep-section-label">{t(lang, 'materials')}</p>
      <div className="material-list">
        {MATERIAL_ORDER.map((id) => {
          const material = MATERIALS[id];
          const copy = MATERIAL_COPY[lang][id];
          const current = selectedMaterial === id;
          const fits = canPlaceMaterial(id, selectedSlot, placed);
          const disabled = moving || (!fits && !current);

          return (
            <button
              key={id}
              type="button"
              className={`material-card ${current ? 'is-placed' : ''}`}
              data-testid={`material-${id}`}
              disabled={disabled}
              aria-pressed={current}
              onClick={() => onPlace(id)}
            >
              <span className="material-icon" aria-hidden="true">
                {material.icon}
              </span>
              <span className="material-copy">
                <span className="material-name">
                  {copy.name}
                  {!fits && !current && (
                    <small className="material-over">{t(lang, 'overBudget')}</small>
                  )}
                </span>
                <span className="material-note">{copy.note}</span>
                <span className="material-stats">
                  <span>{t(lang, 'shieldSep')} {Math.round(material.sep * 100)}%</span>
                  <span>{t(lang, 'shieldGcr')} {Math.round(material.gcr * 100)}%</span>
                  <span>
                    {t(lang, 'materialCost', {
                      mass: material.mass,
                      water: material.water,
                      seconds: material.seconds,
                    })}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="prep-move">
        <button
          type="button"
          className="primary-button prep-move-button"
          data-testid="shelter-move"
          disabled={!complete || moving}
          onClick={onMove}
        >
          {moving ? t(lang, 'movingToShelter') : t(lang, 'moveToShelter')}
        </button>
        <p className="prep-hint">
          {complete ? t(lang, 'prepHint') : t(lang, 'moveHint')}
        </p>
      </div>
    </section>
  );
}
