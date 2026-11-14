import rawSample from '../data/meda-sample.json';
import type { MedaSample, WeatherPhase, WeatherSol } from './types';

export const SAMPLE = rawSample as MedaSample;

export type ConditionKey = 'windy' | 'gusty' | 'shifting' | 'cold' | 'pressureDrop';

export function pickSolIndex(previous?: number): number {
  const count = SAMPLE.sols.length;
  if (count <= 1) return 0;
  let index = Math.floor(Math.random() * count);
  if (previous !== undefined && index === previous) {
    index = (index + 1) % count;
  }
  return index;
}

export function solAt(index: number): WeatherSol {
  return SAMPLE.sols[index % SAMPLE.sols.length];
}

export function conditionsFor(phase: WeatherPhase, previous?: WeatherPhase): ConditionKey[] {
  const tags: ConditionKey[] = [];
  if (phase.windSpeedMs >= 4.2) tags.push('windy');
  if (phase.windSpeedMs >= 6) tags.push('gusty');
  if (phase.windDirectionSpread >= 0.45) tags.push('shifting');
  if (phase.airTempC <= -55) tags.push('cold');
  if (previous && previous.pressurePa - phase.pressurePa >= 3) tags.push('pressureDrop');
  return tags;
}
