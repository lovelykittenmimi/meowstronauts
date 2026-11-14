import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

function open(path: string) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.history.pushState({}, '', '/');
});

describe('video paths', () => {
  it('shows the frozen S1 fixture and updates after the choice', () => {
    open('/?video=s1&lang=en');

    expect(screen.getByTestId('resource-power').textContent).toBe('62');
    expect(screen.getByTestId('resource-life-support').textContent).toBe('58');
    expect(screen.getByTestId('resource-shield').textContent).toBe('55');
    expect(screen.getByTestId('resource-food').textContent).toBe('5');
    expect(screen.getByTestId('resource-health').textContent).toBe('82');
    expect(screen.getByTestId('resource-science').textContent).toBe('3');
    expect(screen.getByTestId('backpack-count').textContent).toContain('8 / 20');
    expect(screen.getByTestId('event-card-S1')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Solar Flare Warning');

    fireEvent.click(screen.getByTestId('choice-shield-up'));

    expect(screen.getByTestId('resource-power').textContent).toBe('42');
    expect(screen.getByTestId('resource-shield').textContent).toBe('80');
    expect(screen.getByTestId('result-panel')).toBeTruthy();
    expect(screen.getByTestId('result-panel').textContent).toContain('Power');
    expect(screen.getByTestId('result-panel').textContent).toContain('−20');
    expect(screen.getByTestId('result-panel').textContent).toContain('+25');

    fireEvent.click(screen.getByTestId('term-solar-flare'));
    expect(screen.getByTestId('knowledge-card')).toBeTruthy();
    expect(screen.getByTestId('knowledge-card-solar-flare')).toBeTruthy();
    fireEvent.click(screen.getByTestId('knowledge-collect'));
    expect(screen.getByTestId('backpack-count').textContent).toContain('9 / 20');

    // Video mode must never write the player's local save.
    expect(window.localStorage.length).toBe(0);
  });

  it('shows the three-star report and seven-point curve', () => {
    open('/?video=report&lang=en');

    expect(screen.getByTestId('mission-report')).toBeTruthy();
    expect(screen.getByTestId('mission-report-stars').textContent).toBe('★★★');
    expect(screen.getByTestId('report-resource-health').textContent).toBe('78');
    expect(screen.getByTestId('report-resource-science').textContent).toBe('8');
    expect(screen.getByTestId('report-backpack-count').textContent).toContain('9 / 20');
    expect(screen.getByTestId('report-curve')).toBeTruthy();
  });
});

describe('normal game', () => {
  it('starts from the title, plays the opening, and reaches the first event', () => {
    open('/?reset=1');

    expect(screen.getByTestId('title-screen')).toBeTruthy();
    fireEvent.click(screen.getByTestId('difficulty-cadet'));
    fireEvent.click(screen.getByTestId('start-game'));

    expect(screen.getByTestId('opening-story')).toBeTruthy();
    fireEvent.click(screen.getByTestId('opening-skip'));

    expect(screen.getByTestId('resource-power').textContent).toBe('72');
    expect(screen.getByTestId('begin-sol')).toBeTruthy();
    fireEvent.click(screen.getByTestId('begin-sol'));

    expect(screen.queryByTestId('result-panel')).toBeNull();
    expect(screen.queryByTestId('continue-button')).toBeNull();
  });

  it('shows the seven sols and lets the crew look back at a finished one', () => {
    open('/?reset=1');
    fireEvent.click(screen.getByTestId('difficulty-cadet'));
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('opening-skip'));

    // Sol 1 is live; later sols stay locked until the crew gets there.
    expect(screen.getByTestId('sol-nav-1').getAttribute('aria-current')).toBe('step');
    expect((screen.getByTestId('sol-nav-2') as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByTestId('sol-nav-7') as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(screen.getByTestId('begin-sol'));
    fireEvent.click(screen.getByTestId('choice-rest'));
    fireEvent.click(screen.getByTestId('continue-button'));

    // Sol 2 is live; Sol 1 is now open for a look back, Sol 3 still locked.
    expect(screen.getByTestId('sol-nav-2').getAttribute('aria-current')).toBe('step');
    expect((screen.getByTestId('sol-nav-1') as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByTestId('sol-nav-3') as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(screen.getByTestId('sol-nav-1'));
    const review = screen.getByTestId('sol-review');
    expect(review.textContent).toContain('First Order at Hope-1');
    expect(review.textContent).toContain('Let the crew rest');
    expect(screen.queryByTestId('begin-sol')).toBeNull();
    expect(screen.getByTestId('sol-nav-1').getAttribute('aria-current')).toBe('step');

    fireEvent.click(screen.getByTestId('sol-review-back'));
    expect(screen.getByTestId('begin-sol')).toBeTruthy();
    expect(screen.queryByTestId('sol-review')).toBeNull();
  });

  it('opens the landing practice from the sol row', () => {
    open('/?reset=1');
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('opening-skip'));

    expect(screen.queryByTestId('lander-overlay')).toBeNull();
    fireEvent.click(screen.getByTestId('lander-open'));
    expect(screen.getByTestId('lander-overlay')).toBeTruthy();
  });

  it('walks the opening reply and tap scenes', () => {
    open('/?reset=1');
    fireEvent.click(screen.getByTestId('start-game'));

    // Scene 1's narration comes in two parts; the second Next leaves it.
    fireEvent.click(screen.getByTestId('opening-next'));
    expect(screen.getByTestId('opening-story')).toBeTruthy();
    fireEvent.click(screen.getByTestId('opening-next'));
    expect(screen.getByTestId('opening-scene2-story')).toBeTruthy();

    // The story can be skipped from any scene and lands on Sol 1.
    fireEvent.click(screen.getByTestId('opening-skip'));
    expect(screen.getByTestId('begin-sol')).toBeTruthy();
  });

  it('steps through the crash radio one line at a time', () => {
    open('/?reset=1');
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('opening-next'));
    fireEvent.click(screen.getByTestId('opening-next'));

    const video = screen.getByTestId('opening-scene2-video') as HTMLVideoElement;
    expect(video.tagName).toBe('VIDEO');
    expect(video.muted).toBe(true);
    expect(video.getAttribute('poster')).toBeTruthy();

    // The NASA montage plays first; the clip waits for the montage and for
    // the "Then they hit us." line, then starts from 0 s.
    expect(screen.getByTestId('opening-scene2-intro')).toBeTruthy();
    expect(screen.getByTestId('nasa-shot-flare').className).toContain('is-current');
    expect(screen.getByText('NASA / SDO')).toBeTruthy();
    expect(screen.queryByTestId('opening-scene2-video-toggle')).toBeNull();

    const current = () => screen.getByTestId('dialogue-current').textContent ?? '';
    expect(current()).toContain('Stardust calling Mars Base');
    expect(current()).not.toContain('My tail is on fire too');
    expect(screen.queryByTestId('opening-next')).toBeNull();

    fireEvent.click(screen.getByTestId('dialogue-next'));
    expect(current()).toContain('My tail is on fire too');
    expect(current()).not.toContain('Stardust calling Mars Base');
    expect(screen.queryByTestId('story-narration')).toBeNull();

    // Six lines in total: one advance is already done. The last two are
    // narration: "Then they hit us." lands over the clip, then the antenna
    // line stacks under it instead of replacing it. The empty radio panel
    // fills with the three listening faces.
    expect(screen.queryByTestId('story-crew-reaction')).toBeNull();
    for (let index = 0; index < 3; index += 1) {
      fireEvent.click(screen.getByTestId('dialogue-next'));
    }
    const narration = () => screen.getByTestId('story-narration').textContent ?? '';
    expect(narration()).toContain('Then they hit us.');
    expect(narration()).not.toContain('twelve minutes');
    expect(
      screen.getByTestId('story-crew-reaction').querySelectorAll('img'),
    ).toHaveLength(3);

    fireEvent.click(screen.getByTestId('dialogue-next'));
    expect(narration()).toContain('Then they hit us.');
    expect(narration()).toContain('twelve minutes');
    expect(screen.queryByTestId('dialogue-next')).toBeNull();

    // The clip has not ended, so Continue is inert. When it ends, the landing
    // invitation opens by itself; answering it unlocks Continue.
    expect((screen.getByTestId('opening-next') as HTMLButtonElement).disabled).toBe(true);
    fireEvent.ended(video);
    expect(screen.getByTestId('landing-practice-prompt')).toBeTruthy();
    expect((screen.getByTestId('opening-next') as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByTestId('landing-practice-later'));
    expect(screen.queryByTestId('landing-practice-prompt')).toBeNull();
    expect((screen.getByTestId('opening-next') as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(screen.getByTestId('opening-next'));
    expect(screen.queryByTestId('opening-scene2-story')).toBeNull();
    expect(screen.getByTestId('opening-reply-command')).toBeTruthy();
  });

  it('steps back to the previous line instead of stacking old lines', () => {
    open('/?reset=1');
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('opening-next'));
    fireEvent.click(screen.getByTestId('opening-next'));

    const current = () => screen.getByTestId('dialogue-current').textContent ?? '';
    const back = () => screen.getByTestId('dialogue-prev') as HTMLButtonElement;

    expect(back().disabled).toBe(true);
    expect(document.querySelectorAll('.story-past')).toHaveLength(0);

    fireEvent.click(screen.getByTestId('dialogue-next'));
    expect(current()).toContain('My tail is on fire too');
    expect(back().disabled).toBe(false);

    fireEvent.click(back());
    expect(current()).toContain('Stardust calling Mars Base');
    expect(document.querySelectorAll('.story-past')).toHaveLength(0);

    fireEvent.click(screen.getByTestId('dialogue-next'));
    fireEvent.click(screen.getByTestId('dialogue-next'));
    expect(current()).toContain('That is the tail');
  });

  it('puts the opening narration over the picture in two parts, not in the caption card', () => {
    open('/?reset=1');
    fireEvent.click(screen.getByTestId('start-game'));

    const narration = () => screen.getByTestId('story-narration');
    expect(narration().textContent).toContain('This is Mars');
    expect(narration().textContent).not.toContain('Hope-1');
    expect(narration().closest('.story-caption')).toBeNull();

    // The first Next turns the card to the second half; it stays on scene 1.
    fireEvent.click(screen.getByTestId('opening-next'));
    expect(narration().textContent).toContain('Hope-1');
    expect(narration().textContent).not.toContain('220 million');
    expect(screen.getByTestId('opening-story')).toBeTruthy();
    expect(screen.queryByTestId('opening-scene2-story')).toBeNull();
  });

  it('waits on scene 1 until someone presses Next', () => {
    vi.useFakeTimers();
    try {
      open('/?reset=1');
      fireEvent.click(screen.getByTestId('start-game'));

      act(() => {
        vi.advanceTimersByTime(20000);
      });

      expect(screen.getByTestId('opening-story')).toBeTruthy();
      expect(screen.queryByTestId('opening-scene2-story')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('shows the scene 3 narration over the cats', () => {
    open('/?reset=1');
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('opening-next'));
    fireEvent.click(screen.getByTestId('opening-next'));

    // Read the crash radio to its last line, answer the landing invitation,
    // then continue to scene 3.
    for (let index = 0; index < 5; index += 1) {
      fireEvent.click(screen.getByTestId('dialogue-next'));
    }
    fireEvent.ended(screen.getByTestId('opening-scene2-video'));
    fireEvent.click(screen.getByTestId('landing-practice-later'));
    fireEvent.click(screen.getByTestId('opening-next'));
    fireEvent.click(screen.getByTestId('opening-reply-cadet'));

    // [question, reply, ...INTRO_REST]; "Mars has no fridge." is the 9th
    // line of INTRO_REST, so it is step 10 of the sequence.
    for (let index = 0; index < 9; index += 1) {
      fireEvent.click(screen.getByTestId('dialogue-next'));
    }

    expect(screen.getByTestId('story-narration').textContent).toContain(
      'Mars has no fridge.',
    );
    expect(screen.getByTestId('dialogue-current').textContent).not.toContain(
      'Mars has no fridge.',
    );
    expect(
      screen.getByTestId('story-crew-reaction').querySelectorAll('img'),
    ).toHaveLength(3);
  });

  it('opens the data panel with both snapshot charts', () => {
    open('/?reset=1');
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('opening-skip'));
    fireEvent.click(screen.getByTestId('data-panel-button'));

    expect(screen.getByTestId('data-panel')).toBeTruthy();
    expect(screen.getByTestId('donki-chart')).toBeTruthy();
    expect(screen.getByTestId('rems-chart')).toBeTruthy();
    expect(screen.getByTestId('data-panel').textContent).toContain('Snapshot, not live.');
  });
});
