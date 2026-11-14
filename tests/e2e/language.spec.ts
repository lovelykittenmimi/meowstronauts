import { expect, test } from '@playwright/test';

test.describe('P1 §5.4 — language', () => {
  test('starts in English and keeps Traditional Chinese after reload', async ({ page }) => {
    await page.goto('/?reset=1');
    await expect(page.locator('h1')).toHaveText('Meowstronauts: Mars Outpost');

    await page.getByRole('button', { name: '中文', exact: true }).click();
    await expect(page.locator('h1')).toHaveText('喵航員：火星基地');
    await expect(page.getByRole('button', { name: 'English', exact: true })).toBeVisible();

    // `?reset=1` clears localStorage on every load, so reload without it.
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('喵航員：火星基地');
    await expect(page.getByRole('button', { name: 'English', exact: true })).toBeVisible();
  });
});
