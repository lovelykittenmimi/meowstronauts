import { expect, test } from '@playwright/test';

test.describe('P1 §5.4 — language', () => {
  test('starts in English and keeps Traditional Chinese for the tab only', async ({ page, context }) => {
    await page.goto('/?reset=1');
    await expect(page.locator('h1')).toHaveText('Meowstronauts: Mars Outpost');

    await page.getByRole('button', { name: '中文', exact: true }).click();
    await expect(page.locator('h1')).toHaveText('喵航員：火星基地');
    await expect(page.getByRole('button', { name: 'English', exact: true })).toBeVisible();

    // The choice lives in sessionStorage, so it survives a reload of this tab.
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('喵航員：火星基地');
    await expect(page.getByRole('button', { name: 'English', exact: true })).toBeVisible();

    // A new tab is a new visit and must open in English again.
    const fresh = await context.newPage();
    await fresh.goto('/');
    await expect(fresh.locator('h1')).toHaveText('Meowstronauts: Mars Outpost');
    await fresh.close();
  });
});
