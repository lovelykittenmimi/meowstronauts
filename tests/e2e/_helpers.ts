import { expect, type Page } from '@playwright/test';

export const HUD_TEST_IDS = {
  power: 'resource-power',
  lifeSupport: 'resource-life-support',
  shield: 'resource-shield',
  food: 'resource-food',
  health: 'resource-health',
  science: 'resource-science',
} as const;

export type HudKey = keyof typeof HUD_TEST_IDS;

export async function expectHud(
  page: Page,
  expected: Partial<Record<HudKey, number>>,
): Promise<void> {
  for (const [key, value] of Object.entries(expected) as [HudKey, number][]) {
    await expect(page.getByTestId(HUD_TEST_IDS[key])).toHaveText(String(value));
  }
}

/** Collect browser errors for the "console has no errors" P0 requirement. */
export function watchConsoleErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });

  return errors;
}

export async function noHorizontalScroll(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}
