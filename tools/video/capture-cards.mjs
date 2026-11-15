// Renders the three full-screen cards (intro, title, end) to PNG stills.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'output', 'demo', 'cards');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });

for (const card of ['intro', 'title', 'end']) {
  const url = `file:///${path.join(__dirname, 'demo-cards.html').replace(/\\/g, '/')}?card=${card}`;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__fontsReady === true, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(400);
  const out = path.join(outDir, `${card}.png`);
  await page.screenshot({ path: out });
  console.log('card', out);
}

await browser.close();
