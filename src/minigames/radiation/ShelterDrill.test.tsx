import { act, fireEvent, render, screen } from '@testing-library/react';
import ShelterDrill from './ShelterDrill';

describe('ShelterDrill', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('disables a layer that would exceed the mass budget', () => {
    render(<ShelterDrill initialLang="en" />);

    fireEvent.click(screen.getByTestId('material-regolith'));
    fireEvent.click(screen.getByTestId('shelter-select-wall'));

    expect((screen.getByTestId('material-water') as HTMLButtonElement).disabled).toBe(true);
    expect(
      (screen.getByTestId('material-polyethylene') as HTMLButtonElement).disabled,
    ).toBe(false);
  });

  it('runs prep, recall and storm, then unlocks the knowledge card', () => {
    const onComplete = vi.fn();
    render(
      <ShelterDrill
        initialLang="en"
        onExit={vi.fn()}
        onComplete={onComplete}
      />,
    );

    fireEvent.click(screen.getByTestId('material-regolith'));
    fireEvent.click(screen.getByTestId('shelter-select-wall'));
    fireEvent.click(screen.getByTestId('material-polyethylene'));

    const move = screen.getByTestId('shelter-move') as HTMLButtonElement;
    expect(move.disabled).toBe(false);
    fireEvent.click(move);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('shelter-alert-board')).toBeTruthy();

    fireEvent.click(screen.getByTestId('shelter-cat-shadow'));
    fireEvent.click(screen.getByTestId('shelter-cat-silver'));
    fireEvent.click(screen.getByTestId('shelter-cat-ginger'));

    act(() => {
      vi.advanceTimersByTime(24000);
    });
    // The storm animation runs after the front; let its timer fire.
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByTestId('shelter-result')).toBeTruthy();
    expect(screen.getByTestId('shelter-knowledge')).toBeTruthy();
    expect(onComplete).toHaveBeenCalledWith('radiationShielding');
    expect(screen.getByTestId('shelter-stars').textContent).toContain('3/3');
  });
});
