import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { FOOD_PAIRS } from './game/state';
import SpaceFoodFlip from './SpaceFoodFlip';

function renderGame(
  onExit = () => {},
  onComplete: (pairs: number) => void = () => {},
  rewarded = false,
  foodFull = false,
) {
  return render(
    <SpaceFoodFlip
      lang="en"
      rewarded={rewarded}
      foodFull={foodFull}
      onComplete={onComplete}
      onExit={onExit}
    />,
  );
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

  it('finishes at 6/6 and reports the pairs once', () => {
    const completions: number[] = [];
    renderGame(
      () => {},
      (pairs) => {
        completions.push(pairs);
      },
    );
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
    expect(screen.getByTestId('food-result-reward').textContent).toContain(
      '+1 food',
    );
    expect(screen.getAllByTestId('food-fact-item')).toHaveLength(6);
    expect(completions).toEqual([6]);
  });

  it('shows the already-earned line on a later run', () => {
    renderGame(() => {}, () => {}, true);
    fireEvent.click(screen.getByTestId('food-start'));

    for (const pair of FOOD_PAIRS) {
      matchPair(pair.id);
    }
    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByTestId('food-result-reward').textContent).toContain(
      'already earned',
    );
  });

  it('does not claim a bonus when the pantry is full', () => {
    const completions: number[] = [];
    renderGame(
      () => {},
      (pairs) => {
        completions.push(pairs);
      },
      false,
      true,
    );
    fireEvent.click(screen.getByTestId('food-start'));

    for (const pair of FOOD_PAIRS) {
      matchPair(pair.id);
    }
    act(() => {
      vi.advanceTimersByTime(800);
    });

    const line = screen.getByTestId('food-result-reward').textContent ?? '';
    expect(line).toContain('pantry is already full');
    expect(line).not.toContain('+1 food');
    expect(completions).toEqual([6]);
  });
});
