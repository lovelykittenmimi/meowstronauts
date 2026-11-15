import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { DustMinigame } from './DustMinigame';

function renderGame(onDone = () => {}, onExit = () => {}) {
  return render(
    <DustMinigame
      src="/art/solar-panels.png"
      alt="Solar panels"
      lang="en"
      onDone={onDone}
      onExit={onExit}
    />,
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('DustMinigame', () => {
  it('shows one tap target per dust patch', () => {
    renderGame();
    expect(screen.getAllByTestId('dust-spot')).toHaveLength(6);
    expect(screen.getByTestId('dust-hint').textContent).toContain('6 left');
  });

  it('backs out without finishing the sweep', () => {
    let done = 0;
    let exits = 0;
    renderGame(
      () => {
        done += 1;
      },
      () => {
        exits += 1;
      },
    );

    fireEvent.click(screen.getByTestId('dust-back'));

    expect(exits).toBe(1);
    expect(done).toBe(0);
    expect(screen.getAllByTestId('dust-spot')).toHaveLength(6);
  });

  it('finishes once every patch is cleared', () => {
    vi.useFakeTimers();
    let done = 0;
    renderGame(() => {
      done += 1;
    });

    let spots = screen.queryAllByTestId('dust-spot');
    while (spots.length > 0) {
      fireEvent.click(spots[0]);
      spots = screen.queryAllByTestId('dust-spot');
    }

    expect(done).toBe(0);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(done).toBe(1);
  });
});
