import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import DustDevilDodge from './DustDevilDodge';
import {
  READINGS_TO_COLLECT,
  ROVER_Y,
  createRun,
  type DodgeRun,
} from './game/state';

function nearFinish(): DodgeRun {
  const base = createRun(5);
  return {
    ...base,
    time: 1,
    collected: READINGS_TO_COLLECT - 1,
    spawnedReadings: READINGS_TO_COLLECT,
    readings: [{ id: 999, x: base.roverX, y: ROVER_Y }],
    devils: [],
    nextReadingAt: 999,
    nextDevilAt: 999,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('DustDevilDodge', () => {
  it('opens on the intro and starts the driving field', () => {
    render(<DustDevilDodge lang="en" onExit={() => {}} />);
    expect(screen.getByTestId('dodge-intro')).toBeTruthy();

    fireEvent.click(screen.getByTestId('dodge-start'));

    expect(screen.queryByTestId('dodge-intro')).toBeNull();
    expect(screen.getByTestId('dodge-field')).toBeTruthy();
    expect(screen.getByTestId('dodge-readings').textContent).toBe('0/8');
    expect(screen.getByLabelText('Move left')).toBeTruthy();
    expect(screen.getByLabelText('Move right')).toBeTruthy();
  });

  it('finishes when the last reading is collected and can replay', () => {
    render(
      <DustDevilDodge
        lang="en"
        onExit={() => {}}
        initialRun={nearFinish()}
      />,
    );
    fireEvent.click(screen.getByTestId('dodge-start'));

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByTestId('dodge-result')).toBeTruthy();
    expect(screen.getByText('All 8 readings collected!')).toBeTruthy();
    expect(screen.getByTestId('dodge-result-readings').textContent).toContain(
      '8/8',
    );
    expect(screen.getByTestId('dodge-result-bumps').textContent).toContain('0');
    expect(screen.getAllByTestId('dodge-fact')).toHaveLength(2);

    fireEvent.click(screen.getByTestId('dodge-replay'));
    expect(screen.getByTestId('dodge-field')).toBeTruthy();
    expect(screen.getByTestId('dodge-readings').textContent).toBe('0/8');
  });

  it('exits from the close button and Escape', () => {
    let exits = 0;
    render(
      <DustDevilDodge
        lang="en"
        onExit={() => {
          exits += 1;
        }}
      />,
    );

    fireEvent.click(screen.getByTestId('dodge-close'));
    expect(exits).toBe(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(exits).toBe(2);
  });
});
