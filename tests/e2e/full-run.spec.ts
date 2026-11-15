import { expect, test, type Page } from '@playwright/test';
import { watchConsoleErrors } from './_helpers';

/**
 * P0 §5.1: title -> skip opening -> seven sols -> mission report.
 * The default seed is fixed, so the deck is deterministic. These choices
 * prioritise survival rather than a three-star score.
 */
const SAFE_CHOICE: Record<string, string> = {
  T1: 'sweep',
  P1: 'clean',
  P4: 'insulate',
  L1: 'repair',
  L2: 'clean',
  L3: 'scrubber',
  S1: 'keep-generating',
  S2: 'patch',
  S3: 'key-points',
  F1: 'harvest-all',
  F3: 'stores',
  C1: 'relay',
  SC2: 'radar',
};

/**
 * T1's sweep (and P1's clean) open the dust minigame first: the card stays in
 * the choice phase until every patch is tapped. S2's patch opens the
 * hull-repair minigame, and F3's ration/stores open the space-food flip; Back
 * resolves the food choice without playing it. Other choices resolve at once,
 * so wait for whichever comes first.
 */
async function resolveChoice(page: Page): Promise<void> {
  const result = page.getByTestId('result-panel');
  const dust = page.getByTestId('dust-game');
  const hull = page.getByTestId('hull-game');
  const food = page.getByTestId('food-game');
  const tomato = page.getByTestId('tomato-game');
  await expect(result.or(dust).or(hull).or(food).or(tomato)).toBeVisible();

  if (await dust.isVisible()) {
    const spots = page.getByTestId('dust-spot');
    while ((await spots.count()) > 0) {
      await spots.first().click();
    }
  }

  if (await hull.isVisible()) {
    const leaks = page.locator('.leak-slot:not(.sealed) .leak');
    while ((await leaks.count()) > 0) {
      const before = await leaks.count();
      await leaks.first().click();
      await expect(leaks).toHaveCount(before - 1);
    }
  }

  if (await food.isVisible()) {
    await page.getByTestId('food-back').click();
  }

  if (await tomato.isVisible()) {
    const ripe = page.locator('.tomato.is-ripe');
    while ((await ripe.count()) > 0) {
      await ripe.first().click();
    }
    await expect(page.getByTestId('tomato-result')).toBeVisible();
    await page.getByTestId('tomato-continue').click();
  }

  await expect(result).toBeVisible();
}

test.describe('P0 §5.1 — full run', () => {
  test('plays from the title screen to the mission report', async ({ page }) => {
    test.slow();
    const errors = watchConsoleErrors(page);

    await page.goto('/?reset=1&seed=meowstronauts-2025-05-14');
    await expect(page.getByTestId('title-screen')).toBeVisible();

    await page.getByTestId('start-game').click();
    await expect(page.getByTestId('opening-story')).toBeVisible();
    await page.getByTestId('opening-skip').click();
    await expect(page.getByTestId('begin-sol')).toBeVisible();

    for (let sol = 1; sol <= 7; sol += 1) {
      await page.getByTestId('begin-sol').click();

      const card = page.locator('[data-testid^="event-card-"]');
      await expect(card).toBeVisible();
      const cardTestId = await card.getAttribute('data-testid');
      const eventId = cardTestId?.replace('event-card-', '') ?? '';
      const preferred = SAFE_CHOICE[eventId];
      const choice = preferred
        ? page.getByTestId(`choice-${preferred}`)
        : page.locator('[data-testid^="choice-"]:not([disabled])').first();

      await expect(choice).toBeEnabled();
      await choice.click();
      await resolveChoice(page);

      const continueButton = page.getByTestId('continue-button');
      await expect(continueButton).toBeVisible();
      await continueButton.click();

      if (sol < 7) {
        await expect(page.getByTestId('begin-sol')).toBeVisible();
      }
    }

    const skipEnding = page.getByTestId('ending-skip');
    if (await skipEnding.isVisible().catch(() => false)) {
      await skipEnding.click();
    }
    await expect(page.getByTestId('mission-report')).toBeVisible();
    await expect(page.getByTestId('mission-report-stars')).toHaveText(/^[★☆]{3}$/);
    expect(errors).toEqual([]);
  });
});
