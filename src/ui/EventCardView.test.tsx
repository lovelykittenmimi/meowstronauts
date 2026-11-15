import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createInitialState } from '../game/reducer';
import type { GameState } from '../game/types';
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

function choiceState(eventId: string): GameState {
  return {
    ...createInitialState('officer', 'en'),
    phase: 'choice',
    currentEventId: eventId,
    sol: 3,
  };
}

function renderChoiceCard(eventId: string, onChoose: (choiceId: string) => void) {
  return render(
    <EventCardView
      state={choiceState(eventId)}
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

function renderResult(eventId: string, choiceId: string) {
  const state: GameState = {
    ...createInitialState('officer', 'en'),
    phase: 'result',
    currentEventId: eventId,
    lastChoiceId: choiceId,
    lastSuccess: true,
    lastEffects: { health: 6, power: -7 },
    sol: 1,
  };
  return render(
    <EventCardView
      state={state}
      onChoose={() => {}}
      onAssist={() => {}}
      onTerm={() => {}}
      onContinue={() => {}}
      onOpenCard={() => {}}
      onCollectCard={() => {}}
    />,
  );
}

describe('T1 photo album', () => {
  it('shows three Curiosity photos with a rover credit after the crew rests', () => {
    renderResult('T1', 'rest');

    const album = screen.getByTestId('rest-photos');
    expect(album.querySelectorAll('img')).toHaveLength(3);
    expect(screen.getByText('A rock shaped like a flower')).toBeTruthy();
    expect(screen.getByTestId('rest-photos-credit').textContent).toContain(
      "Actually photographed by NASA's Curiosity rover",
    );
  });

  it('does not show the album for the sweep choice', () => {
    renderResult('T1', 'sweep');
    expect(screen.queryByTestId('rest-photos')).toBeNull();
  });
});

describe('F3 Supply Crate Delayed', () => {
  it('opens the space-food flip for "ration" and resolves when it closes', () => {
    const onChoose = vi.fn();
    renderChoiceCard('F3', onChoose);

    fireEvent.click(screen.getByTestId('choice-ration'));

    expect(screen.getByTestId('food-game')).toBeTruthy();
    expect(onChoose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('food-back'));

    expect(onChoose).toHaveBeenCalledWith('ration');
  });

  it('opens the space-food flip for "stores" as well', () => {
    const onChoose = vi.fn();
    renderChoiceCard('F3', onChoose);

    fireEvent.click(screen.getByTestId('choice-stores'));

    expect(screen.getByTestId('food-game')).toBeTruthy();
    expect(onChoose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('food-back'));

    expect(onChoose).toHaveBeenCalledWith('stores');
  });

  it('resolves "send the rover" at once, without the minigame', () => {
    const onChoose = vi.fn();
    renderChoiceCard('F3', onChoose);

    fireEvent.click(screen.getByTestId('choice-rover'));

    expect(onChoose).toHaveBeenCalledWith('rover');
    expect(screen.queryByTestId('food-game')).toBeNull();
  });
});
