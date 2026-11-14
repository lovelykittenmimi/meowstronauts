import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import LowGravityHop from './LowGravityHop';

function renderHop(onExit = () => {}) {
  return render(
    <LowGravityHop
      lang="en"
      rewarded={false}
      onComplete={() => {}}
      onExit={onExit}
    />,
  );
}

afterEach(cleanup);

describe('LowGravityHop', () => {
  it('opens on the 0.38 g intro and starts the run', () => {
    renderHop();
    expect(screen.getByTestId('hop-intro')).toBeTruthy();
    expect(screen.getByTestId('hop-game-world')).toBeTruthy();

    fireEvent.click(screen.getByTestId('hop-start'));

    expect(screen.queryByTestId('hop-intro')).toBeNull();
    expect(screen.getByTestId('hop-hud-samples').textContent).toBe('0/3');
    expect(screen.getByTestId('hop-jump')).toBeTruthy();
  });

  it('leaves from the intro without starting a run', () => {
    let exits = 0;
    renderHop(() => {
      exits += 1;
    });

    fireEvent.click(screen.getByTestId('hop-back'));

    expect(exits).toBe(1);
  });

  it('offers a close button while playing', () => {
    let exits = 0;
    renderHop(() => {
      exits += 1;
    });
    fireEvent.click(screen.getByTestId('hop-start'));
    fireEvent.click(screen.getByTestId('hop-close'));

    expect(exits).toBe(1);
  });
});
