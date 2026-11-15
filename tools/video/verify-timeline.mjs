// Checks the finished demo against DEMO-TIMELINE.md: for each probe time it
// pulls the output frame and the frame the timeline says should be there, then
// compares them with SSIM. Video probes also scan +/-0.12 s to report the best
// matching source offset, so a one-frame timing slip is visible in the result.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const demoDir = path.join(__dirname, 'output', 'demo');
const verifyDir = path.join(__dirname, 'output', 'verify');
const demo = path.join(__dirname, 'output', 'meowstronauts-demo-30s.mp4');
const cards = path.join(demoDir, 'cards');
const assets = path.join(__dirname, 'assets');

function resolveTool(name) {
  const exe = process.platform === 'win32' ? `${name}.exe` : name;
  const candidates = [
    process.env[name.toUpperCase()],
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Links', exe),
    path.join('C:', 'ProgramData', 'chocolatey', 'bin', exe),
  ].filter(Boolean);
  for (const candidate of candidates) if (existsSync(candidate)) return candidate;
  return name;
}

const ffmpeg = resolveTool('ffmpeg');

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpeg, args, { cwd: root, stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    child.stderr.on('data', (chunk) => { err += chunk.toString(); });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve(err);
      else reject(new Error(`ffmpeg failed (${code})\n${err.slice(-1200)}`));
    });
  });
}

// The burned subtitle sits in the bottom ~120 px; crop it off so it cannot lower
// the SSIM of an otherwise correct frame.
const compareFilter = 'crop=1920:960:0:0,scale=480:270';
const vfVideo = 'scale=1920:1080';

async function grab(input, seek, vf, out) {
  const filter = [vf, compareFilter].filter(Boolean).join(',');
  const seekArgs = seek === null ? [] : ['-ss', seek.toFixed(6)];
  await run(['-y', '-v', 'error', ...seekArgs, '-i', input, '-frames:v', '1', '-vf', filter, out]);
}

async function ssim(a, b) {
  const log = await run(['-v', 'info', '-i', a, '-i', b, '-lavfi', 'ssim', '-f', 'null', '-']);
  const match = log.match(/All:([0-9.]+)/);
  if (!match) throw new Error(`no SSIM value in output:\n${log.slice(-800)}`);
  return Number(match[1]);
}

const clip = (name) => path.join(demoDir, `${name}.webm`);
const opening = (name) => path.join(assets, 'opening', name);
const stills = (name) => path.join(cards, name);
const prepped = (name) => path.join(assets, 'screens', name);

const SCALE = 'scale=1920:1080';
const CROP_HUD = 'crop=1680:945:150:0,scale=1920:1080:flags=lanczos';
const CROP_LANDER = 'crop=1725:970:110:0,scale=1920:1080:flags=lanczos';
const SDO = 'scale=-1:1080,pad=1920:1080:(ow-iw)/2:0:black';

const probes = [
  { seg: 's01', t: 1.20, kind: 'still', file: stills('intro.png'), start: 0.0, frames: 75, zoom: 0.02, pre: '', min: 0.90 },
  { seg: 's02', t: 3.20, kind: 'still', file: path.join(assets, 'apod', 'sun-flare-sdo-2017-09-14.jpg'), start: 2.5, frames: 45, zoom: 0.04, pre: SDO, min: 0.84 },
  { seg: 's03a', t: 5.00, kind: 'still', file: opening('ship-in-space.png'), start: 4.0, frames: 66, zoom: 0.02, pre: '', min: 0.90 },
  { seg: 's03b', t: 7.60, kind: 'still', file: opening('crash-on-mars.png'), start: 6.2, frames: 84, zoom: 0.02, pre: '', min: 0.90 },
  { seg: 's05', t: 10.50, kind: 'still', file: prepped('s1-card.png'), start: 9.0, frames: 129, zoom: 0.02, pre: '', min: 0.90 },
  { seg: 's06', t: 14.00, kind: 'still', file: prepped('hud.png'), start: 13.3, frames: 63, zoom: 0.02, pre: '', min: 0.90 },
  { seg: 's07', t: 16.00, kind: 'video', file: clip('lander'), src: 9.194, vf: CROP_LANDER, min: 0.82 },
  { seg: 's08a', t: 18.00, kind: 'video', file: clip('hopIntro'), src: 4.285, vf: SCALE, min: 0.82 },
  { seg: 's08b', t: 19.00, kind: 'video', file: clip('tomatoIntro'), src: 4.537, vf: SCALE, min: 0.82 },
  { seg: 's09a', t: 20.00, kind: 'still', file: prepped('knowledge.png'), start: 19.7, frames: 36, zoom: 0.01, pre: '', min: 0.90 },
  { seg: 's09b', t: 21.50, kind: 'still', file: prepped('backpack.png'), start: 20.9, frames: 36, zoom: 0.01, pre: '', min: 0.90 },
  { seg: 's10', t: 23.00, kind: 'still', file: prepped('data.png'), start: 22.1, frames: 117, zoom: 0.02, pre: '', min: 0.90 },
  { seg: 's11a', t: 27.00, kind: 'video', file: clip('report'), src: 3.240, vf: SCALE, min: 0.82 },
  { seg: 's11b', t: 29.50, kind: 'still', file: stills('end.png'), start: 29.0, frames: 30, zoom: 0.01, pre: '', min: 0.90 },
];

// Reproduce the card's zoompan crop at a given output time, so the still probes
// compare like with like instead of comparing a 1-4% zoom against the flat card.
function stillFilter(probe) {
  const n = Math.round((probe.t - probe.start) * 30);
  const zoom = 1 + probe.zoom * n / Math.max(1, probe.frames - 1);
  const w = Math.round(3840 / zoom);
  const h = Math.round(2160 / zoom);
  const x = Math.round((3840 - w) / 2);
  const y = Math.round((2160 - h) / 2);
  return [probe.pre, 'scale=3840:2160', `crop=${w}:${h}:${x}:${y}`, 'scale=1920:1080'].filter(Boolean).join(',');
}

await rm(verifyDir, { recursive: true, force: true });
await mkdir(verifyDir, { recursive: true });

const offsets = [-0.12, -0.06, 0, 0.06, 0.12];
const rows = [];

for (const [index, probe] of probes.entries()) {
  const outFrame = path.join(verifyDir, `out-${String(index).padStart(2, '0')}.png`);
  await grab(demo, probe.t, vfVideo, outFrame);

  if (probe.kind === 'still') {
    const expFrame = path.join(verifyDir, `src-${String(index).padStart(2, '0')}.png`);
    await grab(probe.file, null, stillFilter(probe), expFrame);
    const score = await ssim(outFrame, expFrame);
    rows.push({ ...probe, score, offset: 0, pass: score >= probe.min });
    continue;
  }

  let best = { score: -1, offset: 0 };
  for (const offset of offsets) {
    const expFrame = path.join(verifyDir, `src-${String(index).padStart(2, '0')}-${offset.toFixed(2)}.png`);
    await grab(probe.file, probe.src + offset, probe.vf, expFrame);
    const score = await ssim(outFrame, expFrame);
    await rm(expFrame, { force: true });
    if (score > best.score) best = { score, offset };
  }
  rows.push({ ...probe, score: best.score, offset: best.offset, pass: best.score >= probe.min });
}

const fmt = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}s`;
console.log('probe  out time   segment   expected source                         best offset   SSIM    result');
console.log('-----  ---------  --------  --------------------------------------  -----------  ------  ------');
for (const row of rows) {
  const name = row.kind === 'still'
    ? path.basename(row.file)
    : `${path.basename(row.file)} @ ${row.src.toFixed(3)}s`;
  console.log(
    `${String(rows.indexOf(row) + 1).padStart(5)}  ${row.t.toFixed(2).padStart(8)}  ${row.seg.padEnd(8)}  ${name.padEnd(38)}  ${fmt(row.offset).padStart(10)}  ${row.score.toFixed(3)}  ${row.pass ? 'PASS' : 'FAIL'}`,
  );
}

const failed = rows.filter((row) => !row.pass);
console.log(`\n${rows.length - failed.length}/${rows.length} probes passed`);
if (failed.length > 0) process.exitCode = 1;
