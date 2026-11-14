import raw from './solar-event.json';

export interface SolarEventData {
  meta: {
    source: string;
    sourceUrl: string;
    fetchedAt: string;
    license: string;
    note: string;
  };
  event: {
    id: string;
    eventTime: string;
    instruments: string[];
    linkedFlareTime: string;
    linkedCmeTime: string;
    alertTime: string;
    sourceRegion: string | null;
  };
  scenario: {
    particleFrontSeconds: number;
    sepConfirmedAtSeconds: number;
    timeCompressed: boolean;
  };
}

export const SOLAR_EVENT = raw as SolarEventData;
export const PARTICLE_FRONT_SECONDS = SOLAR_EVENT.scenario.particleFrontSeconds;
export const SEP_CONFIRMED_AT_SECONDS = SOLAR_EVENT.scenario.sepConfirmedAtSeconds;

export const NASA_RADIATION_ARTICLE =
  'https://science.nasa.gov/resource/real-martians-how-to-protect-astronauts-from-space-radiation-on-mars/';
export const NASA_DONKI_TOOL = 'https://ccmc.gsfc.nasa.gov/tools/DONKI/';
