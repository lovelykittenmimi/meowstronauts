import { mkdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { watchConsoleErrors } from './_helpers';

test.describe('P0 §5.3 — report path (?video=report)', () => {
  test('shows the three-star report with a seven-point curve', async ({ page }) => {
    const errors = watchConsoleErrors(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?video=report&lang=en');

    await expect(page.getByTestId('mission-report')).toBeVisible();
    await expect(page.getByTestId('mission-report-stars')).toHaveText('★★★');
    await expect(page.getByTestId('report-backpack-count')).toHaveText('9 / 20');
    await expect(page.getByTestId('report-emergency-unused')).toHaveText('Unused');

    const health = Number((await page.getByTestId('report-resource-health').textContent())?.trim());
    const science = Number((await page.getByTestId('report-resource-science').textContent())?.trim());
    expect(health).toBeGreaterThanOrEqual(70);
    expect(science).toBeGreaterThanOrEqual(8);

    const curve = page.getByTestId('report-curve');
    const labels = await curve.evaluate((svg) =>
      Array.from(svg.querySelectorAll('text')).map((node) => node.textContent ?? ''),
    );
    expect(labels.filter((label) => /^S[1-7]$/.test(label.trim()))).toHaveLength(7);

    const lastPoint = await curve.locator('circle').evaluateAll((circles) => {
      const healthCircle = circles.at(-2);
      const scienceCircle = circles.at(-1);
      return {
        healthY: Number(healthCircle?.getAttribute('cy') ?? Number.NaN),
        scienceY: Number(scienceCircle?.getAttribute('cy') ?? Number.NaN),
      };
    });
    const toValue = (y: number) => Math.round((1 - (y - 36) / 168) * 100);
    expect(Math.abs(toValue(lastPoint.healthY) - health)).toBeLessThanOrEqual(1);
    expect(Math.abs(toValue(lastPoint.scienceY) - science)).toBeLessThanOrEqual(1);

    expect(await page.evaluate(() => window.localStorage.length)).toBe(0);

    mkdirSync('output/e2e', { recursive: true });
    await page.screenshot({ path: 'output/e2e/report-1440x900.png', fullPage: true });

    expect(errors).toEqual([]);
  });
});
