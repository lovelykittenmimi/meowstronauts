import { expect, test, type Page } from '@playwright/test';
import { HUD_TEST_IDS, expectHud, watchConsoleErrors, type HudKey } from './_helpers';

async function readHud(page: Page): Promise<Record<HudKey, number>> {
  const values = {} as Record<HudKey, number>;
  for (const [key, testId] of Object.entries(HUD_TEST_IDS) as [HudKey, string][]) {
    values[key] = Number((await page.getByTestId(testId).textContent())?.trim());
  }
  return values;
}

/**
 * T1 is the fixed Sol 1 tutorial and its "Sweep the panels" choice is the
 * dust beat, so the shortest route is also deterministic.
 */
async function reachTutorialCard(page: Page): Promise<void> {
  await page.goto('/?reset=1');
  await expect(page.getByTestId('title-screen')).toBeVisible();
  await page.getByTestId('start-game').click();
  await expect(page.getByTestId('opening-story')).toBeVisible();
  await page.getByTestId('opening-skip').click();
  await page.getByTestId('begin-sol').click();
  await expect(page.getByTestId('event-card-T1')).toBeVisible();
}

test.describe('solar-panel dust minigame', () => {
  test('clears all six dust patches before the first card resolves', async ({ page }) => {
    const errors = watchConsoleErrors(page);
    await reachTutorialCard(page);

    const before = await readHud(page);
    await page.getByTestId('choice-sweep').click();

    // "Sweep the panels" opens the dust beat instead of resolving the card.
    await expect(page.getByTestId('dust-game')).toBeVisible();
    await expect(page.getByTestId('result-panel')).toHaveCount(0);
    await expect(page.getByTestId('dust-stage')).toHaveAttribute('data-plate', 'dusty');
    await expect(page.getByTestId('dust-hint')).toContainText('Tap every dust patch');
    await expect(page.getByTestId('dust-spot')).toHaveCount(6);

    // One tap per patch. The HUD must not move while the array is still dirty:
    // the beat is presentational and the choice resolves only at the end.
    for (let left = 5; left >= 1; left -= 1) {
      await page.getByTestId('dust-spot').first().click();
      await expect(page.getByTestId('dust-spot')).toHaveCount(left);
      await expect(page.getByTestId('dust-hint')).toContainText(`${left} left`);
      await expectHud(page, before);
    }

    await page.getByTestId('dust-spot').first().click();

    // All six gone: the plate swaps to the swept-clean art for the 600 ms
    // hand-off before the result panel replaces the game.
    await expect(page.getByTestId('dust-spot')).toHaveCount(0);
    await expect(page.getByTestId('dust-stage')).toHaveAttribute('data-plate', 'clean');
    await expect(page.getByTestId('dust-hint')).toContainText('Panels clear');

    await expect(page.getByTestId('result-panel')).toBeVisible();
    await expect(page.getByTestId('dust-game')).toHaveCount(0);
    await expectHud(page, {
      power: before.power + 6,
      lifeSupport: before.lifeSupport - 3,
      health: before.health - 5,
    });
    expect(errors).toEqual([]);
  });

  test('resolves at once when the crew rests instead of sweeping', async ({ page }) => {
    await reachTutorialCard(page);

    await page.getByTestId('choice-rest').click();
    await expect(page.getByTestId('result-panel')).toBeVisible();
    await expect(page.getByTestId('dust-game')).toHaveCount(0);
  });
});
