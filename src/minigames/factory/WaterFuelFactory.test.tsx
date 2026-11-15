import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CO2_MOLECULE_IDS } from './game/state';
import WaterFuelFactory from './WaterFuelFactory';

function renderGame(
  onExit: () => void = () => {},
  onComplete: (stations: number) => void = () => {},
  rewarded = false,
  lifeSupport = 72,
) {
  return render(
    <WaterFuelFactory
      lang="en"
      rewarded={rewarded}
      lifeSupport={lifeSupport}
      onComplete={onComplete}
      onExit={onExit}
    />,
  );
}

function playThrough() {
  fireEvent.click(screen.getByTestId('factory-dig-beta'));
  fireEvent.click(screen.getByTestId('factory-oven-sealed'));
  fireEvent.click(screen.getByTestId('factory-bake'));

  fireEvent.click(screen.getByTestId('factory-power'));
  fireEvent.click(screen.getByTestId('factory-gas-o2'));
  fireEvent.click(screen.getByTestId('factory-tank-crew'));
  fireEvent.click(screen.getByTestId('factory-gas-h2'));
  fireEvent.click(screen.getByTestId('factory-tank-fuel'));

  for (const id of CO2_MOLECULE_IDS) {
    fireEvent.click(screen.getByTestId(`factory-molecule-${id}`));
  }
  fireEvent.click(screen.getByTestId('factory-heat'));

  fireEvent.click(screen.getByTestId('factory-react'));
  fireEvent.click(screen.getByTestId('factory-output-methane'));
  fireEvent.click(screen.getByTestId('factory-collect-fuel'));
  fireEvent.click(screen.getByTestId('factory-output-water'));
  fireEvent.click(screen.getByTestId('factory-collect-water'));
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('WaterFuelFactory', () => {
  it('opens on the intro and starts at the ice mine', () => {
    renderGame();
    expect(screen.getByTestId('factory-intro')).toBeTruthy();

    fireEvent.click(screen.getByTestId('factory-start'));

    expect(screen.queryByTestId('factory-intro')).toBeNull();
    expect(screen.getByTestId('factory-station-title').textContent).toBe(
      'Ice mine',
    );
    expect(screen.getByTestId('factory-progress-mine').dataset.state).toBe(
      'current',
    );
  });

  it('backs out from the intro and closes while playing', () => {
    let exits = 0;
    renderGame(() => {
      exits += 1;
    });

    fireEvent.click(screen.getByTestId('factory-back'));
    expect(exits).toBe(1);

    fireEvent.click(screen.getByTestId('factory-start'));
    fireEvent.click(screen.getByTestId('factory-close'));
    expect(exits).toBe(2);
  });

  it('leaves on Escape', () => {
    let exits = 0;
    renderGame(() => {
      exits += 1;
    });

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(exits).toBe(1);
  });

  it('hints after a dry radar spot and advances after the sealed bake', () => {
    renderGame();
    fireEvent.click(screen.getByTestId('factory-start'));

    fireEvent.click(screen.getByTestId('factory-dig-alpha'));
    expect(screen.getAllByText(/Dry soil/).length).toBeGreaterThan(0);
    expect(screen.getByTestId('factory-station-title').textContent).toBe(
      'Ice mine',
    );

    fireEvent.click(screen.getByTestId('factory-dig-beta'));
    fireEvent.click(screen.getByTestId('factory-oven-open'));
    expect(screen.getByTestId('factory-oven-hint').textContent).toContain(
      'very thin',
    );

    fireEvent.click(screen.getByTestId('factory-oven-sealed'));
    fireEvent.click(screen.getByTestId('factory-bake'));

    expect(screen.getByTestId('factory-station-title').textContent).toBe(
      'Electrolysis',
    );
    expect(screen.getByTestId('factory-progress-mine').dataset.state).toBe(
      'done',
    );
  });

  it('only advances after both gases reach the right tanks', () => {
    renderGame();
    fireEvent.click(screen.getByTestId('factory-start'));
    fireEvent.click(screen.getByTestId('factory-dig-beta'));
    fireEvent.click(screen.getByTestId('factory-oven-sealed'));
    fireEvent.click(screen.getByTestId('factory-bake'));

    fireEvent.click(screen.getByTestId('factory-power'));
    fireEvent.click(screen.getByTestId('factory-gas-o2'));
    fireEvent.click(screen.getByTestId('factory-tank-fuel'));
    expect(
      screen.getAllByText(/Crews breathe oxygen/).length,
    ).toBeGreaterThan(0);
    expect(screen.getByTestId('factory-station-title').textContent).toBe(
      'Electrolysis',
    );

    fireEvent.click(screen.getByTestId('factory-gas-o2'));
    fireEvent.click(screen.getByTestId('factory-tank-crew'));
    fireEvent.click(screen.getByTestId('factory-gas-h2'));
    fireEvent.click(screen.getByTestId('factory-tank-fuel'));

    expect(screen.getByTestId('factory-station-title').textContent).toBe(
      'CO₂ scrubber',
    );
  });

  it('finishes 4/4, reports once, and shows the four facts', () => {
    const completions: number[] = [];
    renderGame(
      () => {},
      (stations) => {
        completions.push(stations);
      },
    );
    fireEvent.click(screen.getByTestId('factory-start'));

    playThrough();
    expect(screen.getByTestId('factory-station-title').textContent).toBe(
      'Sabatier reactor',
    );

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByTestId('factory-result')).toBeTruthy();
    expect(screen.getByTestId('factory-result-stations').textContent).toBe(
      '4/4',
    );
    expect(screen.getByTestId('factory-result-reward').textContent).toContain(
      '+5 life support',
    );
    expect(screen.getAllByTestId('factory-fact-item')).toHaveLength(4);
    expect(screen.getByTestId('factory-why')).toBeTruthy();
    expect(screen.getByTestId('factory-moxie')).toBeTruthy();
    expect(completions).toEqual([4]);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(completions).toEqual([4]);
  });

  it('shows the already-earned line on a later run', () => {
    renderGame(() => {}, () => {}, true);
    fireEvent.click(screen.getByTestId('factory-start'));
    playThrough();
    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByTestId('factory-result-reward').textContent).toContain(
      'already earned',
    );
  });

  it('shows the actual gain when life support is near the cap', () => {
    renderGame(() => {}, () => {}, false, 98);
    fireEvent.click(screen.getByTestId('factory-start'));
    playThrough();
    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByTestId('factory-result-reward').textContent).toContain(
      '+2 life support',
    );
  });

  it('does not claim a bonus when life support is full', () => {
    const completions: number[] = [];
    renderGame(
      () => {},
      (stations) => {
        completions.push(stations);
      },
      false,
      100,
    );
    fireEvent.click(screen.getByTestId('factory-start'));
    playThrough();
    act(() => {
      vi.advanceTimersByTime(800);
    });

    const line = screen.getByTestId('factory-result-reward').textContent ?? '';
    expect(line).toContain('already full');
    expect(line).not.toContain('+5 life support');
    expect(completions).toEqual([4]);
  });

  it('replays from the first station', () => {
    renderGame();
    fireEvent.click(screen.getByTestId('factory-start'));
    playThrough();
    act(() => {
      vi.advanceTimersByTime(800);
    });

    fireEvent.click(screen.getByTestId('factory-replay'));
    expect(screen.getByTestId('factory-station-title').textContent).toBe(
      'Ice mine',
    );
    expect(screen.getByTestId('factory-dig-beta')).toBeTruthy();
  });
});
