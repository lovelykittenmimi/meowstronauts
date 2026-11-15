import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import SignalDelay from './SignalDelay';
import { SIGNAL_ROUNDS, travelMs } from './game/state';

function renderGame(lang: 'en' | 'zh-TW' = 'en', onExit = () => {}) {
  return render(<SignalDelay lang={lang} onExit={onExit} />);
}

function option(id: string): HTMLElement {
  const found = screen
    .getAllByTestId('signal-option')
    .find((element) => element.dataset.answer === id);
  if (!found) throw new Error(`option ${id} not found`);
  return found;
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function playRound(lightMinutes: number) {
  fireEvent.click(option('oneWay'));
  const leg = travelMs(lightMinutes);
  advance(leg);
  expect(screen.getByTestId('signal-console').dataset.phase).toBe('reply');
  advance(leg);
  expect(screen.getByTestId('signal-console').dataset.phase).toBe('ready');
  fireEvent.click(screen.getByTestId('signal-next'));
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('SignalDelay', () => {
  it('opens on the intro and starts round 1', () => {
    renderGame();
    expect(screen.getByTestId('signal-intro')).toBeTruthy();

    fireEvent.click(screen.getByTestId('signal-start'));

    expect(screen.queryByTestId('signal-intro')).toBeNull();
    expect(screen.getByTestId('signal-hud-round').textContent).toContain('1/3');
    expect(screen.getByTestId('signal-question').textContent).toContain('3');
    expect(screen.getAllByTestId('signal-option')).toHaveLength(3);
  });

  it('hints on a wrong unit and lets the player retry', () => {
    renderGame();
    fireEvent.click(screen.getByTestId('signal-start'));

    fireEvent.click(option('seconds'));

    expect(screen.getByTestId('signal-hint').textContent).toContain('minutes');
    expect(screen.getByTestId('signal-hud-round').textContent).toContain('1/3');
    expect((option('seconds') as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(option('oneWay'));
    expect(screen.getByTestId('signal-console').dataset.phase).toBe('fly');
    expect(screen.queryByTestId('signal-hint')).toBeNull();
    expect((option('seconds') as HTMLButtonElement).disabled).toBe(true);
  });

  it('flies the message and the reply, then moves to the next distance', () => {
    renderGame();
    fireEvent.click(screen.getByTestId('signal-start'));

    fireEvent.click(option('oneWay'));
    const leg = travelMs(SIGNAL_ROUNDS[0].lightMinutes);
    advance(leg - 1);
    expect(screen.getByTestId('signal-console').dataset.phase).toBe('fly');
    advance(1);
    expect(screen.getByTestId('signal-console').dataset.phase).toBe('reply');
    advance(leg);
    expect(screen.getByTestId('signal-console').dataset.phase).toBe('ready');

    fireEvent.click(screen.getByTestId('signal-next'));
    expect(screen.getByTestId('signal-hud-round').textContent).toContain('2/3');
    expect(screen.getByTestId('signal-question').textContent).toContain('14');
  });

  it('finishes all three rounds and shows the glossary fact and source', () => {
    renderGame();
    fireEvent.click(screen.getByTestId('signal-start'));

    for (let index = 0; index < SIGNAL_ROUNDS.length; index += 1) {
      expect(screen.getByTestId('signal-hud-round').textContent).toContain(
        `${index + 1}/3`,
      );
      playRound(SIGNAL_ROUNDS[index].lightMinutes);
    }

    expect(screen.getByTestId('signal-result')).toBeTruthy();
    expect(screen.getByTestId('signal-result-wrong').textContent).toContain('0');
    expect(screen.getByText(/3 to 22.4 minutes/)).toBeTruthy();
    const source = screen.getByRole('link', {
      name: /Mars Relay Network/,
    }) as HTMLAnchorElement;
    expect(source.href).toContain('science.nasa.gov');
  });

  it('counts wrong answers in the result', () => {
    renderGame();
    fireEvent.click(screen.getByTestId('signal-start'));

    fireEvent.click(option('roundTrip'));
    fireEvent.click(option('oneWay'));
    const leg = travelMs(SIGNAL_ROUNDS[0].lightMinutes);
    advance(leg * 2);
    fireEvent.click(screen.getByTestId('signal-next'));

    for (let index = 1; index < SIGNAL_ROUNDS.length; index += 1) {
      playRound(SIGNAL_ROUNDS[index].lightMinutes);
    }

    expect(screen.getByTestId('signal-result-wrong').textContent).toContain('1');
  });

  it('backs out from the intro and closes while playing', () => {
    let exits = 0;
    renderGame('en', () => {
      exits += 1;
    });

    fireEvent.click(screen.getByTestId('signal-exit'));
    expect(exits).toBe(1);

    fireEvent.click(screen.getByTestId('signal-start'));
    fireEvent.click(screen.getByTestId('signal-close'));
    expect(exits).toBe(2);
  });

  it('closes on Escape', () => {
    let exits = 0;
    renderGame('en', () => {
      exits += 1;
    });

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(exits).toBe(1);
  });

  it('speaks Traditional Chinese', () => {
    renderGame('zh-TW');
    expect(screen.getAllByText('訊號延遲').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByTestId('signal-start'));
    expect(screen.getByTestId('signal-question').textContent).toContain('3 光分');
    expect(option('oneWay').textContent).toContain('分鐘');
  });
});
