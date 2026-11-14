import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LiveWeather } from './LiveWeather';

const payload = {
  soles: [
    {
      sol: '4995',
      terrestrial_date: '2026-08-25',
      max_temp: '-5',
      min_temp: '-71',
      pressure: '777',
    },
    {
      sol: '4994',
      terrestrial_date: '2026-08-24',
      max_temp: '-7',
      min_temp: '-70',
      pressure: '777',
    },
    {
      sol: '4993',
      terrestrial_date: '2026-08-23',
      max_temp: '-6',
      min_temp: '-70',
      pressure: '780',
    },
    {
      sol: '4992',
      terrestrial_date: '2026-08-22',
      max_temp: '-6',
      min_temp: '-69',
      pressure: '780',
    },
    {
      sol: '4991',
      terrestrial_date: '2026-08-21',
      max_temp: '-11',
      min_temp: '-69',
      pressure: '779',
    },
    {
      sol: '4990',
      terrestrial_date: '2026-08-20',
      max_temp: '-8',
      min_temp: '-72',
      pressure: '779',
    },
    {
      sol: '4989',
      terrestrial_date: '2026-08-19',
      max_temp: '-6',
      min_temp: '-72',
      pressure: '778',
    },
    {
      sol: '4988',
      terrestrial_date: '2026-08-18',
      max_temp: '-10',
      min_temp: '-70',
      pressure: '780',
    },
  ],
};

function mockFetch(ok = true, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => payload,
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('LiveWeather', () => {
  it('starts closed and does not fetch', () => {
    const fetchMock = mockFetch();
    render(<LiveWeather lang="en" />);

    const toggle = screen.getByTestId('live-weather-toggle');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByTestId('live-weather-table')).toBeNull();
  });

  it('loads the newest seven sols after the button is pressed', async () => {
    const fetchMock = mockFetch();
    render(<LiveWeather lang="en" />);

    fireEvent.click(screen.getByTestId('live-weather-toggle'));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const table = await screen.findByTestId('live-weather-table');
    expect(table.textContent).toContain('4995');
    expect(screen.getAllByTestId('live-weather-row')).toHaveLength(7);
    expect(screen.getByTestId('live-weather-note').textContent).toContain('not real-time');
    expect(screen.getByTestId('live-weather-toggle').getAttribute('aria-expanded')).toBe(
      'true',
    );
  });

  it('falls back to the archived copy when the feed rejects the request', async () => {
    const fetchMock = mockFetch(false, 503);
    render(<LiveWeather lang="en" />);

    fireEvent.click(screen.getByTestId('live-weather-toggle'));
    await screen.findByTestId('live-weather-fallback');
    expect(screen.queryByTestId('live-weather-error')).toBeNull();
    expect(screen.getAllByTestId('live-weather-row')).toHaveLength(7);
    const note = screen.getByTestId('live-weather-note').textContent;
    expect(note).toContain('archived');
    expect(note).toContain('not the mission');

    fireEvent.click(screen.getByTestId('live-weather-retry'));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('falls back to the archived copy when the browser blocks the feed', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);
    render(<LiveWeather lang="en" />);

    fireEvent.click(screen.getByTestId('live-weather-toggle'));

    await screen.findByTestId('live-weather-fallback');
    expect(screen.getAllByTestId('live-weather-row')).toHaveLength(7);
    expect(screen.getByTestId('live-weather-table').textContent).toContain('4995');
  });

  it('hides the table when toggled closed', async () => {
    mockFetch();
    render(<LiveWeather lang="en" />);

    fireEvent.click(screen.getByTestId('live-weather-toggle'));
    await screen.findByTestId('live-weather-table');

    fireEvent.click(screen.getByTestId('live-weather-toggle'));
    expect(screen.queryByTestId('live-weather-table')).toBeNull();
  });
});
