import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { EVENT_BY_ID } from '../game/events';
import { createInitialState } from '../game/reducer';
import { BriefingScreen } from './BriefingScreen';

function briefingState(sol: number) {
  return { ...createInitialState('officer', 'en'), sol };
}

function renderBriefing(
  eventId: string,
  sol = 4,
  onHopPractice?: () => void,
  onFoodPractice?: () => void,
  onFactoryPractice?: () => void,
) {
  const event = EVENT_BY_ID.get(eventId);
  if (!event) throw new Error(`unknown event ${eventId}`);
  return render(
    <BriefingScreen
      state={briefingState(sol)}
      event={event}
      onBegin={() => {}}
      onTerm={() => {}}
      onHopPractice={onHopPractice}
      onFoodPractice={onFoodPractice}
      onFactoryPractice={onFactoryPractice}
    />,
  );
}

afterEach(cleanup);

describe('daily briefing art', () => {
  it('shows the cat-free plate of the day’s event', () => {
    renderBriefing('S1');

    const image = screen.getByAltText(
      /empty habitat control room/i,
    ) as HTMLImageElement;
    expect(image.src).toContain('08-control-room-nocat');
  });

  it('falls back to the card picture when the event has no plate', () => {
    renderBriefing('L1');

    const image = screen.getByAltText(
      /opened oxygen unit glows cyan/i,
    ) as HTMLImageElement;
    expect(image.src).toContain('32-oxygen-unit');
  });

  it('shows the Sol 1 dust briefing on the array, not the crew key art', () => {
    renderBriefing('T1', 1);

    const image = screen.getByAltText(
      /solar panel array at dusk with dust/i,
    ) as HTMLImageElement;
    expect(image.src).toContain('21-shadow-hero-nocat');
  });
});

describe('low-gravity hop entry', () => {
  it('offers the hop on Sol 1 and calls back', () => {
    let opened = 0;
    renderBriefing('T1', 1, () => {
      opened += 1;
    });

    const button = screen.getByTestId('hop-practice');
    expect(button.textContent).toContain('low-gravity hop');
    fireEvent.click(button);
    expect(opened).toBe(1);
  });

  it('keeps the hop out of later sol briefings', () => {
    renderBriefing('T1', 2, () => {});

    expect(screen.queryByTestId('hop-practice')).toBeNull();
  });
});

describe('space food flip entry', () => {
  it('offers the food flip on Sol 7 and calls back', () => {
    let opened = 0;
    renderBriefing('T1', 7, undefined, () => {
      opened += 1;
    });

    const button = screen.getByTestId('food-practice');
    expect(button.textContent).toContain('space food flip');
    fireEvent.click(button);
    expect(opened).toBe(1);
  });

  it('keeps the food flip out of earlier sol briefings', () => {
    renderBriefing('T1', 1, undefined, () => {});
    expect(screen.queryByTestId('food-practice')).toBeNull();

    renderBriefing('T1', 6, undefined, () => {});
    expect(screen.queryByTestId('food-practice')).toBeNull();
  });
});

describe('water & fuel factory entry', () => {
  it('offers the factory on a middle sol and calls back', () => {
    let opened = 0;
    renderBriefing('T1', 4, undefined, undefined, () => {
      opened += 1;
    });

    const button = screen.getByTestId('factory-practice');
    expect(button.textContent).toContain('water & fuel factory');
    fireEvent.click(button);
    expect(opened).toBe(1);
  });

  it('shows the factory on Sol 1 and Sol 7 too', () => {
    renderBriefing('T1', 1, undefined, undefined, () => {});
    expect(screen.getByTestId('factory-practice')).toBeTruthy();
    cleanup();

    renderBriefing('T1', 7, undefined, undefined, () => {});
    expect(screen.getByTestId('factory-practice')).toBeTruthy();
  });

  it('stays out of the briefing when video mode withholds the prop', () => {
    renderBriefing('T1', 4);
    expect(screen.queryByTestId('factory-practice')).toBeNull();
  });
});
