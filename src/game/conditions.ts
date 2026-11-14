import type { ConditionContext, Resources, StoryFlags, WeatherDay } from './types';

export function flagsForSol(sol: number, s1Resolved = false): StoryFlags {
  return {
    crashDust: sol >= 2 && sol <= 3,
    flareForecast: sol >= 3,
    commsWindow: sol >= 3,
    s1Resolved,
  };
}

export function makeContext(
  sol: number,
  resources: Resources,
  weather: WeatherDay,
  s1Resolved = false,
): ConditionContext {
  return {
    sol,
    resources,
    weather,
    flags: flagsForSol(sol, s1Resolved),
  };
}

export function isCold(ctx: ConditionContext): boolean {
  return (
    ctx.weather.tags.includes('cold_snap') ||
    ctx.weather.tags.includes('severe_cold')
  );
}
