import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import KnowledgeMatch from './KnowledgeMatch';

function renderGame(onExit = () => {}) {
  return render(<KnowledgeMatch lang="en" onExit={onExit} />);
}

function findCard(termId: string, kind: 'term' | 'meaning'): HTMLElement {
  const element = document.querySelector<HTMLElement>(
    `[data-testid="match-card"][data-term="${termId}"][data-kind="${kind}"]`,
  );
  if (!element) throw new Error(`missing ${termId}-${kind}`);
  return element;
}

function roundTerms(): string[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-testid="match-card"][data-kind="term"]',
    ),
  ).map((element) => element.dataset.term ?? '');
}

function matchRound(): void {
  for (const term of roundTerms()) {
    fireEvent.click(findCard(term, 'term'));
    fireEvent.click(findCard(term, 'meaning'));
  }
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('KnowledgeMatch', () => {
  it('opens on the intro and deals ten cards after starting', () => {
    renderGame();
    expect(screen.getByTestId('match-intro')).toBeTruthy();

    fireEvent.click(screen.getByTestId('match-start'));

    expect(screen.queryByTestId('match-intro')).toBeNull();
    expect(screen.getAllByTestId('match-card')).toHaveLength(10);
    expect(screen.getByTestId('match-hud-round').textContent).toContain('1/3');
    expect(screen.getByTestId('match-hud-pairs').textContent).toContain('0/5');
  });

  it('goes through three rounds and shows the result', () => {
    renderGame();
    fireEvent.click(screen.getByTestId('match-start'));

    for (let round = 1; round <= 3; round += 1) {
      expect(screen.getByTestId('match-hud-round').textContent).toContain(
        `${round}/3`,
      );
      matchRound();
      act(() => {
        vi.advanceTimersByTime(850);
      });
    }

    expect(screen.getByTestId('match-result')).toBeTruthy();
    expect(screen.getByText('All 15 cards matched!')).toBeTruthy();
    expect(screen.getByTestId('match-result-wrong').textContent).toContain('0');
  });

  it('shows the same-kind hint without counting a wrong pair', () => {
    renderGame();
    fireEvent.click(screen.getByTestId('match-start'));
    const [first, second] = roundTerms();

    fireEvent.click(findCard(first, 'term'));
    fireEvent.click(findCard(second, 'term'));

    expect(screen.getByTestId('match-hud-pairs').textContent).toContain('0/5');
    expect(screen.getByTestId('match-hint').textContent).toContain(
      'Pick one term and one meaning.',
    );
  });

  it('replays from the first round and exits from the close button and Escape', () => {
    let exits = 0;
    renderGame(() => {
      exits += 1;
    });
    fireEvent.click(screen.getByTestId('match-start'));
    matchRound();
    act(() => {
      vi.advanceTimersByTime(850);
    });
    matchRound();
    act(() => {
      vi.advanceTimersByTime(850);
    });
    matchRound();
    act(() => {
      vi.advanceTimersByTime(850);
    });

    fireEvent.click(screen.getByTestId('match-replay'));
    expect(screen.getByTestId('match-hud-round').textContent).toContain('1/3');

    fireEvent.click(screen.getByTestId('match-close'));
    expect(exits).toBe(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(exits).toBe(2);
  });
});
