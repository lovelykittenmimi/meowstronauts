import { expect, test } from '@playwright/test';
import { noHorizontalScroll } from './_helpers';

test.describe('P1 §5.5 — responsive layout', () => {
  test('landscape layouts do not scroll sideways; portrait shows the rotate hint', async ({ page }) => {
    for (const viewport of [
      { width: 844, height: 390 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/?reset=1');
      await expect(page.getByTestId('title-screen')).toBeVisible();
      expect(await noHorizontalScroll(page)).toBeLessThanOrEqual(1);
      await expect(page.locator('.rotate-hint')).toBeHidden();
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?reset=1');
    await expect(page.locator('.rotate-hint')).toBeVisible();
    await expect(page.locator('.rotate-hint')).toContainText('Rotate your device to landscape');
  });
});
