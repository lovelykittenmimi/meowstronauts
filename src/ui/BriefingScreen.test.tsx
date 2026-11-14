import { cleanup, render, screen } from '@testing-library/react';
import { EVENT_BY_ID } from '../game/events';
import { createInitialState } from '../game/reducer';
import { BriefingScreen } from './BriefingScreen';

function briefingState(sol: number) {
  return { ...createInitialState('officer', 'en'), sol };
}

function renderBriefing(eventId: string, sol = 4) {
  const event = EVENT_BY_ID.get(eventId);
  if (!event) throw new Error(`unknown event ${eventId}`);
  return render(
    <BriefingScreen
      state={briefingState(sol)}
      event={event}
      onBegin={() => {}}
      onTerm={() => {}}
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
