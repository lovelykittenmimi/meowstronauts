import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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

  it('walks the opening reply and tap scenes', () => {
    open('/?reset=1');
    fireEvent.click(screen.getByTestId('start-game'));

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

    // Six lines in total: one advance is already done.
    for (let index = 0; index < 4; index += 1) {
      fireEvent.click(screen.getByTestId('dialogue-next'));
    }
    expect(current()).toContain('twelve minutes');
    expect(screen.queryByTestId('dialogue-next')).toBeNull();

    fireEvent.click(screen.getByTestId('opening-next'));
    expect(screen.queryByTestId('opening-scene2-story')).toBeNull();
    expect(screen.getByTestId('opening-reply-command')).toBeTruthy();
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
