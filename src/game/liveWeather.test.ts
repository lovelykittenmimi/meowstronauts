import fallbackWeather from '../data/msl-latest.json';
import { fetchLatestSols, parseLatestSols } from './liveWeather';

function raw(
  sol: string,
  date: string,
  max = '-5',
  min = '-71',
  pressure = '777',
) {
  return {
    sol,
    terrestrial_date: date,
    max_temp: max,
    min_temp: min,
    pressure,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('parseLatestSols', () => {
  it('keeps the newest seven usable sols', () => {
    const payload = {
      soles: [
        raw('9', '2026-01-09'),
        raw('8', '2026-01-08', '--', '--'),
        raw('7', '2026-01-07'),
        raw('6', '2026-01-06'),
        raw('5', '2026-01-05'),
        raw('4', '2026-01-04'),
        raw('3', '2026-01-03'),
        raw('2', '2026-01-02'),
        raw('1', '2026-01-01'),
      ],
    };

    const sols = parseLatestSols(payload);

    expect(sols).toHaveLength(7);
    expect(sols.map((sol) => sol.sol)).toEqual([9, 7, 6, 5, 4, 3, 2]);
    expect(sols[0]).toMatchObject({
      terrestrialDate: '2026-01-09',
      maxTempC: -5,
      minTempC: -71,
      pressurePa: 777,
    });
  });

  it('sorts by sol even if the feed order changes', () => {
    const payload = {
      soles: [
        raw('2', '2026-01-02'),
        raw('9', '2026-01-09'),
        raw('7', '2026-01-07'),
      ],
    };

    expect(parseLatestSols(payload).map((sol) => sol.sol)).toEqual([9, 7, 2]);
  });

  it('keeps a missing pressure as null', () => {
    const [sol] = parseLatestSols({
      soles: [raw('9', '2026-01-09', '-5', '-71', '--')],
    });

    expect(sol.pressurePa).toBeNull();
  });

  it('rejects a payload without usable sols', () => {
    expect(() => parseLatestSols({})).toThrow('Unexpected NASA weather payload');
    expect(() => parseLatestSols({ soles: [raw('9', '2026-01-09', '--', '--')] })).toThrow(
      'No usable sols',
    );
  });

  it('parses the committed fallback copy', () => {
    const sols = parseLatestSols(fallbackWeather);

    expect(sols).toHaveLength(7);
    expect(sols[0]).toMatchObject({ sol: 4995, terrestrialDate: '2026-08-25' });
    expect(sols[6]).toMatchObject({ sol: 4989, terrestrialDate: '2026-08-19' });
  });
});

describe('fetchLatestSols', () => {
  it('fetches the public feed without an API key', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ soles: [raw('9', '2026-01-09')] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const sols = await fetchLatestSols();

    expect(sols).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('mars.nasa.gov'),
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    );
  });

  it('rejects a non-OK response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({}) }),
    );

    await expect(fetchLatestSols()).rejects.toThrow('HTTP 503');
  });
});
