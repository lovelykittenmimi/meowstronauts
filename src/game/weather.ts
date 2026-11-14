import weatherJson from '../data/mars-weather.snapshot.json';
import type { WeatherDay } from './types';

interface RawWeatherDay {
  sol: number;
  terrestrialDate: string;
  maxTempC: number;
  minTempC: number;
  gameplayTags?: string[];
}

const rawSols = (weatherJson as { sols: RawWeatherDay[] }).sols;

/** The seven core sols are the last seven entries of the cold-week window. */
const coreSols = rawSols.slice(-7);

export const WEATHER_BY_SOL: WeatherDay[] = coreSols.map((day) => ({
  sol: day.sol,
  terrestrialDate: day.terrestrialDate,
  maxTempC: day.maxTempC,
  minTempC: day.minTempC,
  tags: day.gameplayTags ?? [],
}));

export function getWeather(sol: number): WeatherDay {
  return WEATHER_BY_SOL[Math.min(Math.max(sol - 1, 0), WEATHER_BY_SOL.length - 1)];
}

export function hasWeatherTag(sol: number, tag: string): boolean {
  return getWeather(sol).tags.includes(tag);
}
