import { chromium } from 'playwright';
import { mkdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const rawDir = path.join(root, 'output', 'raw');
const dest = path.join(root, 'output', 'test-capture.webm');

await mkdir(rawDir, { recursive: true });
await rm(dest, { force: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
});

const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  recordVideo: {
    dir: rawDir,
    size: { width: 1920, height: 1080 },
  },
});

const page = await context.newPage();
const url = 'file:///' + path.join(__dirname, 'title-card.html').replace(/\\/g, '/');
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(10200);

const video = page.video();
await context.close();
await browser.close();

if (!video) {
  throw new Error('No video was recorded.');
}

const src = await video.path();
await rename(src, dest);
console.log('captured:', dest);
