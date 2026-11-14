import { mkdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const SIZES = [
  { width: 844, height: 390 },
  { width: 568, height: 320 },
  { width: 1440, height: 900 },
];

test.describe('Scene 5 — outpost assembly layout', () => {
  for (const size of SIZES) {
    test(`fits ${size.width}x${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto('/?scene=opening5&lang=en');

      await expect(page.getByTestId('story-puzzle-board')).toBeVisible();
      await expect(page.getByTestId('story-puzzle-tray')).toBeVisible();
      await expect(page.getByTestId('opening-next')).toBeVisible();

      const overflow = await page.evaluate(() => ({
        x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        y: document.documentElement.scrollHeight - document.documentElement.clientHeight,
      }));
      expect(overflow.x).toBeLessThanOrEqual(1);
      expect(overflow.y).toBeLessThanOrEqual(1);

      for (const testId of [
        'story-puzzle-board',
        'story-puzzle-tray',
        'opening-next',
      ]) {
        const box = await page.getByTestId(testId).boundingBox();
        expect(box).not.toBeNull();
        expect(box!.y + box!.height).toBeLessThanOrEqual(size.height + 1);
        expect(box!.x + box!.width).toBeLessThanOrEqual(size.width + 1);
      }

      mkdirSync('output/e2e', { recursive: true });
      await page.screenshot({
        path: `output/e2e/scene5-${size.width}x${size.height}.png`,
        fullPage: true,
      });
    });
  }

  test('completes the assembly and enables Continue', async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto('/?scene=opening5&lang=en');

    for (const id of ['power', 'lifeSupport', 'shield']) {
      await page.getByTestId(`story-puzzle-piece-${id}`).click();
      await page.getByTestId(`story-puzzle-slot-${id}`).click();
    }

    await expect(page.getByTestId('opening-next')).toBeEnabled();
    await page.screenshot({
      path: 'output/e2e/scene5-844x390-complete.png',
      fullPage: true,
    });
  });
});
