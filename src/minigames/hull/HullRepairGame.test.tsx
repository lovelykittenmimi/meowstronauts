import { act, fireEvent, render, screen } from '@testing-library/react';
import { HullRepairGame } from './HullRepairGame';

describe('HullRepairGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('seals all four leaks and calls onDone once', async () => {
    const onDone = vi.fn();
    render(<HullRepairGame initialLang="en" sol={2} onDone={onDone} />);

    for (let id = 1; id <= 4; id += 1) {
      const leak = screen.getByRole('button', {
        name: `Repair leak ${id} of 4`,
      });
      await act(async () => {
        fireEvent.click(leak);
        await vi.advanceTimersByTimeAsync(3000);
      });
    }

    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
