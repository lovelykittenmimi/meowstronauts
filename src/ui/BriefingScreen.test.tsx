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

describe('captain’s log naming', () => {
  it('labels the briefing as the captain’s log', () => {
    renderBriefing('T1', 1);

    expect(screen.getByText("Captain's log")).toBeTruthy();
  });

  it('previews the day’s event as today’s incident', () => {
    renderBriefing('T1', 1);

    expect(screen.getByText(/Today's incident · First Order/)).toBeTruthy();
  });
});

describe('captain’s log art', () => {
  const cases = [
    { sol: 1, eventId: 'T1', alt: /three cat astronauts on a rocky Mars ridge/i, file: '01-keyart' },
    { sol: 2, eventId: 'T1', alt: /dust devil at dawn/i, file: '11-cold-patrol-nocar' },
    { sol: 3, eventId: 'L1', alt: /dish antenna angled toward a low sun/i, file: '42-dish-forecast' },
    { sol: 4, eventId: 'S1', alt: /empty habitat control room/i, file: '08-control-room-nocat' },
    { sol: 5, eventId: 'T1', alt: /water recycling bay/i, file: '41-water-recycling' },
    { sol: 6, eventId: 'T1', alt: /empty comms bay/i, file: '39-earth-call-nocat' },
    { sol: 7, eventId: 'T1', alt: /empty greenhouse/i, file: '09-greenhouse-nocat' },
  ];

  it.each(cases)(
    'shows the Sol $sol scene, not the event photo',
    ({ sol, eventId, alt, file }) => {
      renderBriefing(eventId, sol);

      const image = screen.getByAltText(alt) as HTMLImageElement;
      expect(image.src).toContain(file);
    },
  );
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
  it('offers the factory on Sol 5 and calls back', () => {
    let opened = 0;
    renderBriefing('T1', 5, undefined, undefined, () => {
      opened += 1;
    });

    const button = screen.getByTestId('factory-practice');
    expect(button.textContent).toContain('water & fuel factory');
    fireEvent.click(button);
    expect(opened).toBe(1);
  });

  it('keeps the factory out of the other sol briefings', () => {
    for (const sol of [1, 4, 6, 7]) {
      renderBriefing('T1', sol, undefined, undefined, () => {});
      expect(screen.queryByTestId('factory-practice')).toBeNull();
      cleanup();
    }
  });

  it('stays out of the briefing when video mode withholds the prop', () => {
    renderBriefing('T1', 5);
    expect(screen.queryByTestId('factory-practice')).toBeNull();
  });
});
