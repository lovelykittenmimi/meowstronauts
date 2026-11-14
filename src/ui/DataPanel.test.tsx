import { render, screen } from '@testing-library/react';
import { DataPanel } from './DataPanel';

interface Box {
  text: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

// Mirrors the approximate label box in DataPanel; guards the 14 May
// X2.7/M7.7 collision that used to hide the "M" under the X2.7 dot.
function labelBoxes(chart: Element): Box[] {
  return ['X1.2', 'M5.3', 'X2.7', 'M7.7'].map((text) => {
    const node = Array.from(chart.querySelectorAll('text')).find(
      (element) => element.textContent === text,
    );
    expect(node, `${text} label missing`).toBeTruthy();
    const x = Number(node!.getAttribute('x'));
    const y = Number(node!.getAttribute('y'));
    const anchor = node!.getAttribute('text-anchor');
    const width = text.length * 7 + 2;
    const left = anchor === 'middle' ? x - width / 2 : anchor === 'start' ? x : x - width;
    return { text, left, right: left + width, top: y - 16, bottom: y };
  });
}

describe('DataPanel', () => {
  it('keeps the four flare labels readable and separate', () => {
    render(<DataPanel lang="en" onClose={() => {}} />);
    const boxes = labelBoxes(screen.getByTestId('donki-chart'));

    for (let i = 0; i < boxes.length; i += 1) {
      for (let j = i + 1; j < boxes.length; j += 1) {
        const a = boxes[i];
        const b = boxes[j];
        const overlap =
          a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        expect(overlap, `${a.text} overlaps ${b.text}`).toBe(false);
      }
    }
  });

  it('labels the X2.7 flare as the recorded event', () => {
    render(<DataPanel lang="en" onClose={() => {}} />);
    const text = screen.getByTestId('donki-chart').textContent ?? '';
    expect(text).toContain('X2.7');
    expect(text).toContain('M7.7');
  });

  it('hides the optional live section in video mode', () => {
    render(<DataPanel lang="en" onClose={() => {}} showLive={false} />);
    expect(screen.queryByTestId('live-weather-toggle')).toBeNull();
  });

  it('puts the optional live section above the snapshot charts', () => {
    render(<DataPanel lang="en" onClose={() => {}} />);
    const toggle = screen.getByTestId('live-weather-toggle');
    const chart = screen.getByTestId('donki-chart');
    expect(
      toggle.compareDocumentPosition(chart) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
