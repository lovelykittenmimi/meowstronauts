import { SOLAR_EVENT } from '../data/event';
import { catIsLate, catProgress } from './cats';
import { computeShield, doseFor, evaluateDrill } from './dose';
import {
  EMPTY_MATERIALS,
  canPlaceMaterial,
  materialCost,
} from './materials';

describe('shelter materials', () => {
  it('starts with the hull shell and no added layers', () => {
    const shield = computeShield(EMPTY_MATERIALS);
    expect(shield.sep).toBeCloseTo(0.35);
    expect(shield.gcr).toBeCloseTo(0.05);
    expect(shield.mass).toBe(0);
    expect(shield.water).toBe(0);
  });

  it('rejects regolith plus water because it exceeds the mass budget', () => {
    const placed = { roof: 'regolith' as const, wall: null };
    expect(canPlaceMaterial('water', 'wall', placed)).toBe(false);
    expect(canPlaceMaterial('polyethylene', 'wall', placed)).toBe(true);
  });

  it('reports mass, water and installation time for a valid pair', () => {
    const cost = materialCost({ roof: 'regolith', wall: 'polyethylene' });
    expect(cost).toEqual({ mass: 52, water: 0, seconds: 11 });
  });

  it('gives the roof regolith a positional bonus and the wall water one', () => {
    const regolithRoof = computeShield({ roof: 'regolith', wall: 'polyethylene' });
    const regolithWall = computeShield({ roof: 'polyethylene', wall: 'regolith' });
    expect(regolithRoof.sep).toBeGreaterThan(regolithWall.sep);
  });
});

describe('dose model', () => {
  const empty = computeShield(EMPTY_MATERIALS);
  const good = computeShield({ roof: 'regolith', wall: 'polyethylene' });

  it('lowers the dose when mass is added', () => {
    expect(doseFor(good, false)).toBeLessThan(doseFor(empty, false));
  });

  it('never blocks all cosmic rays', () => {
    expect(good.gcr).toBeLessThan(1);
    expect(doseFor(good, false)).toBeGreaterThan(0);
  });

  it('makes a late cat absorb more than one inside the shelter', () => {
    expect(doseFor(good, true)).toBeGreaterThan(doseFor(good, false));
  });

  it('awards three stars only when everyone is inside and the dose is low', () => {
    const perfect = evaluateDrill([], good);
    expect(perfect.stars).toBe(3);
    expect(perfect.outcome).toBe('perfect');
    expect(perfect.maxDose).toBeLessThanOrEqual(12);

    const safeButNotPerfect = evaluateDrill([], empty);
    expect(safeButNotPerfect.stars).toBe(2);
    expect(safeButNotPerfect.outcome).toBe('close');

    const late = evaluateDrill(['ginger'], good);
    expect(late.stars).toBe(1);
    expect(late.outcome).toBe('rough');
    expect(late.cats.find((cat) => cat.id === 'ginger')?.late).toBe(true);
  });
});

describe('cat recall timing', () => {
  it('moves from packing to returning to inside', () => {
    expect(catProgress('shadow', 0, 0.5).state).toBe('packing');
    expect(catProgress('shadow', 0, 2).state).toBe('returning');
    expect(catProgress('shadow', 0, 6).state).toBe('inside');
  });

  it('marks a cat late when the run would finish after the front', () => {
    expect(catIsLate('ginger', 0, 20)).toBe(false);
    expect(catIsLate('ginger', 10, 20)).toBe(true);
    expect(catIsLate('shadow', null, 20)).toBe(true);
  });
});

describe('DONKI event snapshot', () => {
  it('keeps the real SEP time, instrument and alert time', () => {
    expect(SOLAR_EVENT.event.eventTime).toBe('2025-05-13T18:14Z');
    expect(SOLAR_EVENT.event.linkedFlareTime).toBe('2025-05-13T15:25Z');
    expect(SOLAR_EVENT.event.alertTime).toBe('2025-05-13T18:33Z');
    expect(SOLAR_EVENT.event.instruments.join(' ')).toContain('SOHO COSTEP');
    expect(SOLAR_EVENT.scenario.timeCompressed).toBe(true);
  });

  it('does not smuggle a fake dose unit into the snapshot', () => {
    expect(JSON.stringify(SOLAR_EVENT)).not.toMatch(/mSv|mGy/);
  });
});
