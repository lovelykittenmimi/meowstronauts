import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import TomatoHarvestGame from './TomatoHarvestGame';

const RIPE_IDS = ['vine-1', 'vine-3', 'vine-4', 'vine-6', 'vine-7', 'vine-9'];

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('TomatoHarvestGame', () => {
  it('does not harvest a green tomato', () => {
    render(<TomatoHarvestGame initialLang="en" sol={7} />);

    fireEvent.click(screen.getByTestId('tomato-vine-2'));

    expect(screen.getByTestId('tomato-toast').textContent).toContain('Not yet');
    expect(screen.getByTestId('tomato-counter').textContent).toContain('0/6');
  });

  it('harvests six ripe tomatoes and confirms the result', () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<TomatoHarvestGame initialLang="en" sol={7} onDone={onDone} />);

    for (const id of RIPE_IDS) {
      fireEvent.click(screen.getByTestId(`tomato-${id}`));
    }

    expect(screen.getByTestId('tomato-counter').textContent).toContain('6/6');
    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByTestId('tomato-result')).toBeTruthy();
    fireEvent.click(screen.getByTestId('tomato-continue'));

    expect(onDone).toHaveBeenCalledWith(true);
  });

  it('can skip the harvest', () => {
    const onDone = vi.fn();
    render(<TomatoHarvestGame initialLang="en" sol={7} onDone={onDone} />);

    fireEvent.click(screen.getByTestId('tomato-skip'));

    expect(onDone).toHaveBeenCalledWith(false);
  });
});
