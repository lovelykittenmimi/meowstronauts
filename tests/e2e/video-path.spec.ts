import { expect, test } from '@playwright/test';
import { expectHud, watchConsoleErrors } from './_helpers';

const S1_HUD = {
  power: 62,
  lifeSupport: 58,
  shield: 55,
  food: 5,
  health: 82,
  science: 3,
} as const;

test.describe('P0 §3.4 / §5.2 — video path (?video=s1)', () => {
  test('replays the fixture, applies shield-up, and collects solarFlare', async ({ page }) => {
    const errors = watchConsoleErrors(page);

    await page.goto('/?video=s1&lang=en');
    await expect(page.getByTestId('event-card-S1')).toBeVisible();
    await expect(page.getByTestId('event-card-S1')).toContainText('Solar Flare Warning');
    await expectHud(page, S1_HUD);
    await expect(page.getByTestId('backpack-count')).toHaveText('8 / 20');
    expect(await page.evaluate(() => window.localStorage.length)).toBe(0);

    await page.getByTestId('choice-shield-up').click();
    await expect(page.getByTestId('result-panel')).toBeVisible();
    await expectHud(page, { ...S1_HUD, power: 42, shield: 80 });

    // The result must not auto-advance to Sol 5.
    await expect(page.getByTestId('event-card-S1')).toBeVisible();
    await expect(page.getByTestId('begin-sol')).toHaveCount(0);

    await page.getByTestId('term-solar-flare').click();
    await expect(page.getByTestId('knowledge-card')).toBeVisible();
    await expect(page.getByTestId('knowledge-card-solar-flare')).toBeVisible();
    await page.getByTestId('knowledge-collect').click();
    await expect(page.getByTestId('knowledge-collect')).toBeDisabled();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('knowledge-card')).toHaveCount(0);
    await expect(page.getByTestId('backpack-count')).toHaveText('9 / 20');

    await page.getByTestId('backpack-button').click();
    await expect(page.getByTestId('backpack-panel')).toBeVisible();
    await expect(page.getByTestId('backpack-panel')).toContainText('9 / 20');
    await page.keyboard.press('Escape');

    await page.getByTestId('data-panel-button').click();
    await expect(page.getByTestId('data-panel')).toBeVisible();
    await expect(page.getByTestId('donki-chart')).toBeVisible();
    await expect(page.getByTestId('rems-chart')).toBeVisible();
    await expect(page.getByTestId('data-panel')).toContainText('Snapshot, not live.');
    await expect(page.getByTestId('data-panel')).not.toContainText('strong geomagnetic storm');
    await page.keyboard.press('Escape');

    expect(errors).toEqual([]);
  });

  test('stays deterministic across 10 reloads and never writes localStorage', async ({ page }) => {
    test.slow();

    for (let reload = 0; reload < 10; reload += 1) {
      await page.goto('/?video=s1&lang=en');
      await expect(page.getByTestId('event-card-S1')).toBeVisible();
      await expectHud(page, S1_HUD);
      await expect(page.getByTestId('backpack-count')).toHaveText('8 / 20');
      expect(await page.evaluate(() => window.localStorage.length)).toBe(0);
    }
  });
});
