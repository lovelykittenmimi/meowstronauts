import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { FOOD_PAIRS } from './game/state';
import SpaceFoodFlip from './SpaceFoodFlip';

function renderGame(onExit = () => {}) {
  return render(<SpaceFoodFlip lang="en" onExit={onExit} />);
}

function card(pairId: string, kind: 'food' | 'fact'): HTMLElement {
  const found = screen
    .getAllByTestId('food-card')
    .find(
      (element) =>
        element.dataset.pair === pairId && element.dataset.kind === kind,
    );
  if (!found) throw new Error(`card ${pairId}-${kind} not found`);
  return found;
}

function matchPair(pairId: string) {
  fireEvent.click(card(pairId, 'food'));
  fireEvent.click(card(pairId, 'fact'));
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('SpaceFoodFlip', () => {
  it('opens on the crate intro and deals twelve cards', () => {
    renderGame();
    expect(screen.getByTestId('food-intro')).toBeTruthy();

    fireEvent.click(screen.getByTestId('food-start'));

    expect(screen.queryByTestId('food-intro')).toBeNull();
    expect(screen.getByTestId('food-hud-pairs').textContent).toBe('0/6');
    expect(screen.getAllByTestId('food-card')).toHaveLength(12);
  });

  it('backs out from the intro and closes while playing', () => {
    let exits = 0;
    renderGame(() => {
      exits += 1;
    });

    fireEvent.click(screen.getByTestId('food-back'));
    expect(exits).toBe(1);

    fireEvent.click(screen.getByTestId('food-start'));
    fireEvent.click(screen.getByTestId('food-close'));
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

  it('locks a matched pair and flips a mismatch back', () => {
    renderGame();
    fireEvent.click(screen.getByTestId('food-start'));

    matchPair('strawberries');
    expect(screen.getByTestId('food-hud-pairs').textContent).toBe('1/6');
    expect(card('strawberries', 'food').dataset.state).toBe('matched');

    fireEvent.click(card('lettuce', 'food'));
    fireEvent.click(card('peppers', 'fact'));
    expect(card('lettuce', 'food').dataset.state).toBe('up');

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(card('lettuce', 'food').dataset.state).toBe('down');
    expect(screen.getByTestId('food-hud-pairs').textContent).toBe('1/6');
  });

  it('finishes at 6/6 with the flipped-card count and the full crate list', () => {
    renderGame();
    fireEvent.click(screen.getByTestId('food-start'));

    for (const pair of FOOD_PAIRS) {
      matchPair(pair.id);
    }
    expect(screen.getByTestId('food-hud-pairs').textContent).toBe('6/6');

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByTestId('food-result')).toBeTruthy();
    expect(screen.getByTestId('food-result-moves').textContent).toBe('6');
    expect(screen.queryByTestId('food-result-reward')).toBeNull();
    expect(screen.getAllByTestId('food-fact-item')).toHaveLength(6);
  });
});
