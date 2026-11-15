import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { buildVideoState } from '../game/video';
import { EventCardView } from './EventCardView';

function renderCard(videoMode: boolean, onChoose = vi.fn()) {
  const state = buildVideoState('s1');
  return render(
    <EventCardView
      state={videoMode ? state : { ...state, videoMode: undefined }}
      onChoose={onChoose}
      onAssist={() => {}}
      onTerm={() => {}}
      onContinue={() => {}}
      onOpenCard={() => {}}
      onCollectCard={() => {}}
    />,
  );
}

afterEach(cleanup);

describe('S1 shelter drill integration', () => {
  it.each(['shield-up', 'shelter'])(
    'opens the shelter drill for the %s choice',
    (choiceId) => {
      const onChoose = vi.fn();
      renderCard(false, onChoose);

      fireEvent.click(screen.getByTestId(`choice-${choiceId}`));

      expect(screen.getByTestId('shelter-overlay')).toBeTruthy();
      expect(onChoose).not.toHaveBeenCalled();
    },
  );

  it('returns to the choices without resolving if the drill is left early', async () => {
    const onChoose = vi.fn();
    renderCard(false, onChoose);
    fireEvent.click(screen.getByTestId('choice-shield-up'));

    const host = screen.getByTestId('shelter-overlay');
    await waitFor(() => {
      expect(
        host.shadowRoot?.querySelector('[data-testid="shelter-exit"]'),
      ).toBeTruthy();
    });

    const exit = host.shadowRoot?.querySelector(
      '[data-testid="shelter-exit"]',
    ) as HTMLElement;
    fireEvent.click(exit);

    await waitFor(() => {
      expect(screen.getByTestId('choice-shield-up')).toBeTruthy();
    });
    expect(onChoose).not.toHaveBeenCalled();
  });

  it('keeps video mode on the instant-resolution path', () => {
    const onChoose = vi.fn();
    renderCard(true, onChoose);

    fireEvent.click(screen.getByTestId('choice-shield-up'));

    expect(onChoose).toHaveBeenCalledWith('shield-up');
    expect(screen.queryByTestId('shelter-overlay')).toBeNull();
  });
});
