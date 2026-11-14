import spaceWeather from '../data/spaceweather.snapshot.json';
import marsWeather from '../data/mars-weather.snapshot.json';
import photos from '../data/mars-photos/metadata.json';

describe('NASA snapshots', () => {
  it('keeps the DONKI counts and the strong-flare wording', () => {
    expect(spaceWeather.cme).toHaveLength(20);
    expect(spaceWeather.flr).toHaveLength(4);
    expect(spaceWeather.gst).toHaveLength(1);
    expect(spaceWeather.meta.assessment.maxFlareClass).toBe('X2.7');
    expect(spaceWeather.meta.assessment.maxKp).toBe(6.33);
    expect(spaceWeather.meta.assessment.strongFlare).toBe(true);
    expect(spaceWeather.meta.assessment.strongGeomagneticStorm).toBe(false);
  });

  it('keeps fourteen REMS sols and the cold-week selection', () => {
    expect(marsWeather.sols).toHaveLength(14);
    expect(marsWeather.meta.selection.core.sols).toBe(7);
    expect(marsWeather.meta.selection.core.avgMaxTempC).toBe(-29.7);
    expect(marsWeather.meta.selection.core.missingDates).toContain('2025-05-18');
  });

  it('keeps seven photos with credits and the PIA25077 rock', () => {
    expect(photos.photos).toHaveLength(7);
    const rock = photos.photos.find((photo) => photo.nasaId === 'PIA25077');
    expect(rock).toBeTruthy();
    expect(rock?.credit).toBe('NASA/JPL-Caltech/MSSS');
    expect(rock?.bytes).toBe(350608);
    expect(rock?.description).toContain('rock');
  });
});
