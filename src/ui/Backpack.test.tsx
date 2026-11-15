import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Backpack } from './Backpack';

function renderBackpack(onMatchPractice?: () => void) {
  return render(
    <Backpack
      lang="en"
      collected={['solarPower']}
      onClose={() => {}}
      onOpenCard={() => {}}
      onMatchPractice={onMatchPractice}
    />,
  );
}

afterEach(cleanup);

describe('knowledge card match entry', () => {
  it('sits in the backpack header and calls back', () => {
    let opened = 0;
    renderBackpack(() => {
      opened += 1;
    });

    const button = screen.getByTestId('match-practice');
    expect(button.textContent).toContain('Knowledge Card Match');
    fireEvent.click(button);
    expect(opened).toBe(1);
  });

  it('stays hidden when video mode withholds the callback', () => {
    renderBackpack();
    expect(screen.queryByTestId('match-practice')).toBeNull();
  });
});
