// Records the gameplay footage for the 30-second demo from the deployed build.
// Playwright's recordVideo does not capture the real pointer, so a fake cursor
// is injected into the page for the recording only. The game code is untouched.
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const outDir = path.join(__dirname, 'output', 'demo');
const rawDir = path.join(outDir, 'raw');
const stillDir = path.join(outDir, 'stills');
const base = 'https://mars.flymymind.com';

await mkdir(rawDir, { recursive: true });
await mkdir(stillDir, { recursive: true });

// Optional clip filter, e.g. `node capture-demo.mjs hop` re-records only that clip
// and merges the marks into the existing capture.json.
const capturePath = path.join(outDir, 'capture.json');
const only = process.argv[2];
const previous = existsSync(capturePath) ? JSON.parse(await readFile(capturePath, 'utf8')) : { clips: {} };
const want = (name) => !only || only === name;

const cursorScript = () => {
  const install = () => {
    if (document.getElementById('__demo-cursor')) return;
    const wrap = document.createElement('div');
    wrap.id = '__demo-cursor';
    wrap.style.cssText = [
      'position:fixed',
      'left:-100px',
      'top:-100px',
      'width:30px',
      'height:30px',
      'z-index:2147483647',
      'pointer-events:none',
      'opacity:0',
      'transition:left .55s cubic-bezier(.2,.8,.2,1),top .55s cubic-bezier(.2,.8,.2,1),opacity .2s',
      'filter:drop-shadow(0 2px 4px rgba(0,0,0,.45))',
    ].join(';');
    wrap.innerHTML =
      '<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M4 2 L20 12 L12.5 13.6 L16.2 21.2 L13.2 22.4 L9.6 14.8 L4 20 Z" ' +
      'fill="#ffffff" stroke="#0b1020" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    const ring = document.createElement('div');
    ring.style.cssText = [
      'position:fixed',
      'width:46px',
      'height:46px',
      'margin:-23px 0 0 -23px',
      'border-radius:999px',
      'border:2px solid rgba(255,255,255,.9)',
      'opacity:0',
      'z-index:2147483646',
      'pointer-events:none',
    ].join(';');
    ring.id = '__demo-ring';
    document.documentElement.append(wrap, ring);
    let x = -100;
    let y = -100;
    window.__demoCursor = (nextX, nextY) => {
      x = nextX;
      y = nextY;
      wrap.style.left = `${x - 5}px`;
      wrap.style.top = `${y - 2}px`;
      wrap.style.opacity = '1';
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
    };
    window.__demoCursorHide = () => {
      wrap.style.opacity = '0';
      ring.style.opacity = '0';
    };
    window.__demoClick = () => {
      wrap.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(.82)' }, { transform: 'scale(1)' }],
        { duration: 180, easing: 'ease-out' },
      );
      ring.animate(
        [
          { opacity: 0.9, transform: 'scale(.35)' },
          { opacity: 0, transform: 'scale(1.6)' },
        ],
        { duration: 420, easing: 'ease-out' },
      );
    };
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
};

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const clips = {};

async function newSession(name) {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: rawDir, size: { width: 1920, height: 1080 } },
  });
  const page = await context.newPage();
  await page.addInitScript(cursorScript);
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  // Magenta calibration frame: the assembler can find where navigation starts.
  await page.goto('data:text/html,<body style="margin:0;background:%23ff00ff"></body>');
  await page.waitForTimeout(600);
  const created = Date.now();
  const marks = [];
  const mark = (label) => marks.push({ name: label, t: (Date.now() - created) / 1000 });
  return { name, context, page, errors, marks, mark, created };
}

async function finish(session) {
  const video = session.page.video();
  await session.context.close();
  if (video) {
    const src = await video.path();
    const dest = path.join(outDir, `${session.name}.webm`);
    await rm(dest, { force: true });
    await rename(src, dest);
  }
  clips[session.name] = {
    file: `output/demo/${session.name}.webm`,
    marks: session.marks,
    errors: session.errors,
  };
  console.log(session.name, JSON.stringify(session.marks));
}

async function moveCursor(page, locator) {
  const box = await locator.boundingBox();
  if (!box) return;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.evaluate(([px, py]) => window.__demoCursor?.(px, py), [x, y]);
  await page.waitForTimeout(680);
}

async function clickWithCursor(page, locator) {
  await moveCursor(page, locator);
  await page.evaluate(() => window.__demoClick?.());
  await locator.click();
}

async function readDistance(page) {
  const text = await page.locator('.distance-block strong').textContent();
  return Number.parseFloat(String(text).replace(/[^0-9.]/g, '')) || 0;
}

async function readShip(page) {
  // The lander renders inside a shadow root, so ask a Playwright locator
  // (which pierces open shadow roots) for the inline position.
  try {
    const style = await page.locator('.ship-wrap').evaluate((el) => ({
      left: el.style.left,
      top: el.style.top,
    }));
    return {
      x: (Number.parseFloat(style.left) / 100) * 1600,
      y: (Number.parseFloat(style.top) / 100) * 900,
    };
  } catch {
    return null;
  }
}

// --- Clip 1: S1 card -> shield up -> knowledge card -> backpack -> data panel
if (want('s1')) {
  const s = await newSession('s1');
  const { page } = s;
  await page.goto(`${base}/?reset=1&video=s1&lang=en`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByTestId('event-card-S1').waitFor({ timeout: 60000 });
  await page.waitForTimeout(1400);
  s.mark('card');
  await page.screenshot({ path: path.join(stillDir, 's1-card.png') });

  const shield = page.getByTestId('choice-shield-up');
  await clickWithCursor(page, shield);
  await page.getByTestId('result-panel').waitFor({ timeout: 15000 });
  await page.waitForTimeout(1500);
  s.mark('hud');
  await page.screenshot({ path: path.join(stillDir, 'hud.png') });
  console.log('HUD', await page.getByTestId('resource-power').textContent(), await page.getByTestId('resource-shield').textContent());
  await page.waitForTimeout(2200);

  const term = page.getByTestId('term-solar-flare');
  await clickWithCursor(page, term);
  await page.getByTestId('knowledge-card').waitFor({ timeout: 15000 });
  await page.waitForTimeout(1400);
  s.mark('knowledge');
  await page.screenshot({ path: path.join(stillDir, 'knowledge.png') });

  await clickWithCursor(page, page.getByTestId('knowledge-collect'));
  await page.waitForTimeout(600);
  s.mark('collect');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  await clickWithCursor(page, page.getByTestId('backpack-button'));
  await page.waitForTimeout(1500);
  s.mark('backpack');
  await page.screenshot({ path: path.join(stillDir, 'backpack.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  await clickWithCursor(page, page.getByTestId('data-panel-button'));
  await page.waitForTimeout(1600);
  s.mark('data');
  await page.screenshot({ path: path.join(stillDir, 'data.png') });
  console.log('backpack count', await page.getByTestId('backpack-count').textContent().catch(() => '?'));
  await page.waitForTimeout(3600);
  await finish(s);
}

// The practice games and the top bar carry 中文 toggles; drop them for the
// English-only cut. Recording script only — the game code is untouched.
async function hideLangToggles(page) {
  await page.getByRole('button', { name: '中文', exact: true })
    .evaluateAll((els) => els.forEach((el) => el.remove()));
}

// --- Clip 2: Mars Weather Lander, fly to the target and land. The practice
// button now lives in SolNav, which `?video=` hides, so take the normal flow.
if (want('lander')) {
  const s = await newSession('lander');
  const { page } = s;
  await page.goto(`${base}/?reset=1&lang=en`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByTestId('title-screen').waitFor({ timeout: 60000 });
  await page.waitForTimeout(800);
  await page.getByTestId('difficulty-officer').click();
  await page.getByTestId('start-game').click();
  await page.getByTestId('opening-skip').waitFor({ timeout: 30000 });
  await page.waitForTimeout(300);
  await page.getByTestId('opening-skip').click();
  await page.getByTestId('sol-nav').waitFor({ timeout: 30000 });
  await page.waitForTimeout(700);
  await page.getByTestId('lander-open').click();
  await page.getByTestId('lander-game').waitFor({ timeout: 20000 });
  await hideLangToggles(page);
  await page.locator('.ship-wrap').waitFor({ timeout: 15000 });
  await page.waitForTimeout(1200);
  s.mark('landerOpen');
  await page.screenshot({ path: path.join(stillDir, 'lander-open.png') });

  let ship = await readShip(page);
  console.log('start ship', ship, 'distance', await readDistance(page));

  // Phase 1: thrust right until x is close to the target.
  await page.keyboard.down('ArrowRight');
  for (let i = 0; i < 120; i += 1) {
    await page.waitForTimeout(60);
    ship = await readShip(page);
    if (ship && ship.x > 770) break;
  }
  await page.keyboard.up('ArrowRight');

  // Phase 2: closed-loop pulses on both axes using the real ship position.
  // The feedback distance is ~1.8 km per pixel, so aim for a ~2 px deadband
  // (the shot wants a Perfect landing, not a 10 km one).
  for (let i = 0; i < 400; i += 1) {
    ship = await readShip(page);
    if (!ship) break;
    const dx = 808 - ship.x;
    const dy = 527 - ship.y;
    if (Math.hypot(dx, dy) < 2) break;
    const keys = [];
    if (dx > 1.5) keys.push('ArrowRight');
    else if (dx < -1.5) keys.push('ArrowLeft');
    if (dy > 1.5) keys.push('ArrowDown');
    else if (dy < -1.5) keys.push('ArrowUp');
    if (keys.length === 0) break;
    for (const key of keys) await page.keyboard.down(key);
    await page.waitForTimeout(40);
    for (const key of keys) await page.keyboard.up(key);
    await page.waitForTimeout(60);
  }

  ship = await readShip(page);
  const distance = await readDistance(page);
  console.log('before landing ship', ship, 'distance', distance);
  s.mark('beforeLand');
  const landButton = page.locator('.land-button');
  await clickWithCursor(page, landButton);
  await page.locator('.feedback-card').waitFor({ timeout: 8000 }).catch(() => {});
  s.mark('landed');
  await page.waitForTimeout(1600);
  await page.screenshot({ path: path.join(stillDir, 'lander-landed.png') });
  await page.waitForTimeout(200);
  await finish(s);
}

// --- Clip 3: mission report
if (want('report')) {
  const s = await newSession('report');
  const { page } = s;
  await page.goto(`${base}/?reset=1&video=report&lang=en`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByTestId('mission-report').waitFor({ timeout: 60000 });
  await page.waitForTimeout(1400);
  s.mark('report');
  await page.screenshot({ path: path.join(stillDir, 'report.png') });
  await page.waitForTimeout(2600);
  await finish(s);
}

// --- Clip 4: Low-gravity hop opening screen only. `?video=` mode hides the
// practice buttons, so this goes through the real flow: title -> Officer -> skip
// the opening -> SolNav. Stop on `hop-intro`; never press Start hopping or JUMP.
if (want('hopIntro')) {
  const s = await newSession('hopIntro');
  const { page } = s;
  await page.goto(`${base}/?reset=1&lang=en`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByTestId('title-screen').waitFor({ timeout: 60000 });
  await page.waitForTimeout(800);
  await page.getByTestId('difficulty-officer').click();
  await page.getByTestId('start-game').click();
  await page.getByTestId('opening-skip').waitFor({ timeout: 30000 });
  await page.waitForTimeout(300);
  await page.getByTestId('opening-skip').click();
  await page.getByTestId('sol-nav').waitFor({ timeout: 30000 });
  await page.waitForTimeout(700);
  s.mark('nav');
  await page.getByTestId('hop-open').click();
  await page.getByTestId('hop-intro').waitFor({ timeout: 15000 });
  await page.waitForTimeout(900);
  s.mark('hopIntro');
  await page.screenshot({ path: path.join(stillDir, 'hop-intro.png') });
  await page.waitForTimeout(2600);
  await finish(s);
}

// --- Clip 5: Harvest the tomatoes first screen only. Same normal flow; stop on
// the first screen and never tap a tomato.
if (want('tomatoIntro')) {
  const s = await newSession('tomatoIntro');
  const { page } = s;
  await page.goto(`${base}/?reset=1&lang=en`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByTestId('title-screen').waitFor({ timeout: 60000 });
  await page.waitForTimeout(800);
  await page.getByTestId('difficulty-officer').click();
  await page.getByTestId('start-game').click();
  await page.getByTestId('opening-skip').waitFor({ timeout: 30000 });
  await page.waitForTimeout(300);
  await page.getByTestId('opening-skip').click();
  await page.getByTestId('sol-nav').waitFor({ timeout: 30000 });
  await page.waitForTimeout(700);
  s.mark('nav');
  await page.getByTestId('tomato-open').click();
  await page.getByTestId('tomato-game').waitFor({ timeout: 15000 });
  await hideLangToggles(page);
  await page.waitForTimeout(1100);
  s.mark('tomatoIntro');
  await page.screenshot({ path: path.join(stillDir, 'tomato-intro.png') });
  await page.waitForTimeout(2600);
  await finish(s);
}

await browser.close();
await writeFile(
  capturePath,
  `${JSON.stringify(
    { base, recordedAt: new Date().toISOString(), clips: { ...previous.clips, ...clips } },
    null,
    2,
  )}\n`,
  'utf8',
);
console.log('done', path.join(outDir, 'capture.json'));
