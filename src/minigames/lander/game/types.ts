export type Lang = 'en' | 'zh-TW';

export type PhaseKey = 'night' | 'morning' | 'afternoon' | 'evening';

export interface WeatherPhase {
  key: PhaseKey;
  lmstWindow: string;
  windSpeedMs: number;
  windDirectionDeg: number;
  windDirectionSpread: number;
  windSamples: number;
  pressurePa: number;
  airTempC: number;
  fallback: boolean;
}

export interface WeatherDayStats {
  windSpeedMeanMs: number;
  windSpeedMedianMs: number;
  windSpeedP90Ms: number;
  windSpeedMaxMs: number;
  windSamples: number;
  windDirectionMeanDeg: number;
  windDirectionSpread: number;
  windDirectionSamples: number;
  pressureMeanPa: number;
  pressureMinPa: number;
  pressureMaxPa: number;
  airTempMeanC: number;
  airTempMinC: number;
  airTempMaxC: number;
}

export interface WeatherSol {
  sol: number;
  earthDate: string;
  phases: WeatherPhase[];
  daily: WeatherDayStats;
  sourceFiles?: Record<string, string>;
  rowCounts?: Record<string, number>;
  provenance?: {
    midpointUtc?: string;
    startUtc?: string;
    stopUtc?: string;
    ls?: number | null;
    marsYear?: number | null;
  };
}

export interface MedaMeta {
  mission: string;
  instrument: string;
  location: string;
  solRange?: number[];
  earthDates: string;
  source: string;
  sourceUrl: string;
  productLevels: string;
  credit: string;
  windConvention?: string;
  note: string;
}

export interface MedaSample {
  meta: MedaMeta;
  sols: WeatherSol[];
}

export interface Point {
  x: number;
  y: number;
}

export type ZoneType = 'dust' | 'gust' | 'cold';

export interface WeatherZone {
  id: string;
  x: number;
  y: number;
  r: number;
  type: ZoneType;
}

export type LandingResult = 'perfect' | 'close' | 'far';

export interface LandingEvaluation {
  result: LandingResult;
  distanceKm: number;
}

export interface Feedback extends LandingEvaluation {
  sol: number;
  phase: PhaseKey;
  windSpeedMs: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';
