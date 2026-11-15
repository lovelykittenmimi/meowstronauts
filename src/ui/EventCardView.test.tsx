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

function renderChoiceCard(
  eventId: string,
  onChoose: (choiceId: string) => void,
  onFactoryPractice?: () => void,
) {
  return render(
    <EventCardView
      state={choiceState(eventId)}
      onChoose={onChoose}
      onAssist={() => {}}
      onTerm={() => {}}
      onContinue={() => {}}
      onOpenCard={() => {}}
      onCollectCard={() => {}}
      onFactoryPractice={onFactoryPractice}
    />,
  );
}

function renderF1(videoMode: boolean, onChoose = vi.fn()) {
  const state = buildVideoState('s1');
  return render(
    <EventCardView
      state={{
        ...state,
        currentEventId: 'F1',
        sol: 7,
        videoMode: videoMode ? 's1' : undefined,
      }}
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

  it('shows F1 choices without opening the harvest automatically', () => {
    renderF1(false);

    expect(screen.getByTestId('choice-harvest-all')).toBeTruthy();
    expect(screen.queryByTestId('tomato-overlay')).toBeNull();
  });

  it('opens the tomato harvest only from the harvest choice', () => {
    const onChoose = vi.fn();
    renderF1(false, onChoose);

    fireEvent.click(screen.getByTestId('choice-harvest-all'));

    expect(screen.getByTestId('tomato-overlay')).toBeTruthy();
    expect(screen.queryByTestId('choice-harvest-all')).toBeNull();
    expect(onChoose).not.toHaveBeenCalled();
  });

  it('resolves the seed-saving choice without the harvest game', () => {
    const onChoose = vi.fn();
    renderF1(false, onChoose);

    fireEvent.click(screen.getByTestId('choice-save-seeds'));

    expect(onChoose).toHaveBeenCalledWith('save-seeds');
    expect(screen.queryByTestId('tomato-overlay')).toBeNull();
  });

  it('keeps F1 instant in video mode', () => {
    const onChoose = vi.fn();
    renderF1(true, onChoose);

    fireEvent.click(screen.getByTestId('choice-harvest-all'));

    expect(onChoose).toHaveBeenCalledWith('harvest-all');
    expect(screen.queryByTestId('tomato-overlay')).toBeNull();
  });

  it('returns from a skipped F1 harvest to the choices', async () => {
    const onChoose = vi.fn();
    renderF1(false, onChoose);
    fireEvent.click(screen.getByTestId('choice-harvest-all'));

    const host = screen.getByTestId('tomato-overlay');
    await waitFor(() => {
      expect(
        host.shadowRoot?.querySelector('[data-testid="tomato-skip"]'),
      ).toBeTruthy();
    });
    const skip = host.shadowRoot?.querySelector(
      '[data-testid="tomato-skip"]',
    ) as HTMLElement;
    fireEvent.click(skip);

    await waitFor(() => {
      expect(screen.getByTestId('choice-harvest-all')).toBeTruthy();
    });
    expect(onChoose).not.toHaveBeenCalled();
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
  it('shows the crew dialogue, then takes the first Curiosity photo', () => {
    renderResult('T1', 'rest');

    const album = screen.getByTestId('rest-photos');
    expect(album.querySelectorAll('.rest-photo-frame')).toHaveLength(0);
    expect(screen.getByText(/Listen up/)).toBeTruthy();

    fireEvent.click(screen.getByTestId('rest-photo-next'));
    expect(album.querySelectorAll('.rest-photo-frame')).toHaveLength(1);
    expect(
      screen.getByAltText("Mars landscape photographed by NASA's Curiosity rover"),
    ).toBeTruthy();
    expect(screen.getByText('Gale Crater, Mars')).toBeTruthy();
    expect(screen.getByTestId('rest-photos-credit').textContent).toContain(
      "Actually photographed by NASA's Curiosity rover",
    );
  });

  it('steps through one photo at a time and closes on the last', () => {
    renderResult('T1', 'rest');

    fireEvent.click(screen.getByTestId('rest-photo-next'));
    expect(
      screen.getByAltText("Mars landscape photographed by NASA's Curiosity rover"),
    ).toBeTruthy();

    fireEvent.click(screen.getByTestId('rest-photo-next'));
    expect(
      screen.getByAltText('Curiosity rover at the Mary Anning location on Mars'),
    ).toBeTruthy();
    expect(screen.getByText('A rare photo of the photographer')).toBeTruthy();

    fireEvent.click(screen.getByTestId('rest-photo-next'));
    expect(
      screen.getByAltText('Close-up of a flower-shaped rock photographed by Curiosity'),
    ).toBeTruthy();
    expect(screen.getByText('A rock shaped like a flower')).toBeTruthy();

    fireEvent.click(screen.getByTestId('rest-photo-next'));
    expect(screen.queryByTestId('rest-photos')).toBeNull();
    expect(screen.getByTestId('rest-photos-open')).toBeTruthy();
  });

  it('closes the album popup and can reopen it', () => {
    renderResult('T1', 'rest');

    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByTestId('rest-photos')).toBeNull();

    fireEvent.click(screen.getByTestId('rest-photos-open'));
    expect(screen.getByTestId('rest-photos')).toBeTruthy();
    expect(
      screen.getByAltText("Mars landscape photographed by NASA's Curiosity rover"),
    ).toBeTruthy();
  });

  it('does not show the album for the sweep choice', () => {
    renderResult('T1', 'sweep');
    expect(screen.queryByTestId('rest-photos')).toBeNull();
  });
});

describe('incident labelling', () => {
  it("marks the day's event apart from the captain's log", () => {
    renderChoiceCard('T1', vi.fn());

    expect(screen.getByText("Today's incident").className).toBe('incident-tag');
  });
});

describe('L3 saturated scrubber factory entry', () => {
  it('offers the water & fuel factory while the card waits for a choice', () => {
    const open = vi.fn();
    renderChoiceCard('L3', vi.fn(), open);

    const button = screen.getByTestId('event-factory-practice');
    expect(button.textContent).toContain('water & fuel factory');
    fireEvent.click(button);
    expect(open).toHaveBeenCalledTimes(1);
  });

  it('keeps the entry on L3 only', () => {
    renderChoiceCard('L2', vi.fn(), () => {});
    expect(screen.queryByTestId('event-factory-practice')).toBeNull();
  });

  it('stays out when video mode withholds the prop', () => {
    renderChoiceCard('L3', vi.fn());
    expect(screen.queryByTestId('event-factory-practice')).toBeNull();
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
