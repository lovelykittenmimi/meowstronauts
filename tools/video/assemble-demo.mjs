// Assembles the 30-second demo from the captured clips, stills and cards.
// Every segment is exactly 30 fps / 1920x1080 / H.264; the final pass adds
// narration, the music bed and burned English subtitles.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const outDir = path.join(__dirname, 'output', 'demo');
const segDir = path.join(outDir, 'segments');

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
const fps = 30;

function run(args, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpeg, args, { cwd: root, stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    child.stderr.on('data', (chunk) => {
      err += chunk.toString();
      if (err.length > 8000) err = err.slice(-8000);
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${label || 'ffmpeg'} failed (${code})\n${err}`));
    });
  });
}

async function flashEnd(file) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpeg, [
      '-v', 'error',
      '-i', file,
      '-vf', 'fps=25,scale=2:2',
      '-f', 'rawvideo',
      '-pix_fmt', 'rgb24',
      '-',
    ], { stdio: ['ignore', 'pipe', 'pipe'] });
    const chunks = [];
    let err = '';
    child.stdout.on('data', (chunk) => chunks.push(chunk));
    child.stderr.on('data', (chunk) => { err += chunk.toString(); });
    child.on('error', reject);
    child.on('close', () => {
      const buf = Buffer.concat(chunks);
      const frameSize = 12;
      const count = Math.floor(buf.length / frameSize);
      let last = -1;
      for (let i = 0; i < count; i += 1) {
        const o = i * frameSize;
        if (buf[o] > 160 && buf[o + 2] > 160 && buf[o + 1] < 110) last = i;
      }
      if (last < 0) reject(new Error(`no magenta flash in ${file}\n${err}`));
      else resolve((last + 1) / 25);
    });
  });
}

const base = [
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
  '-pix_fmt', 'yuv420p', '-r', String(fps), '-an',
];

async function encodeStill({ image, out, seconds, zoom = 0.02, pre = '', extra = '' }) {
  const frames = Math.round(seconds * fps);
  const z = `1+${zoom}*on/${Math.max(1, frames - 1)}`;
  const filter = [
    pre,
    'scale=3840:2160:flags=lanczos',
    `zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=${fps}`,
    extra,
    'format=yuv420p',
  ].filter(Boolean).join(',');
  await run(['-y', '-i', image, '-vf', filter, '-frames:v', String(frames), ...base, out], path.basename(out));
}

async function encodeVideo({ input, start, seconds, out, vf }) {
  const filter = [vf, `fps=${fps}`, 'format=yuv420p'].filter(Boolean).join(',');
  await run([
    '-y',
    '-i', input,
    '-ss', start.toFixed(3),
    '-t', (seconds + 0.6).toFixed(3),
    '-vf', filter,
    '-frames:v', String(Math.round(seconds * fps)),
    ...base,
    out,
  ], path.basename(out));
}

async function concatFiles(parts, out) {
  const list = path.join(segDir, 'list.txt');
  await writeFile(list, parts.map((part) => `file '${part.replace(/\\/g, '/')}'`).join('\n') + '\n', 'utf8');
  await run(['-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', out], path.basename(out));
}

async function xfade(a, b, out, transitionFrames) {
  const offset = (39 - transitionFrames) / fps; // only used for equal-length pairs
  await run([
    '-y', '-i', a, '-i', b,
    '-filter_complex',
    `[0:v][1:v]xfade=transition=fade:duration=${(transitionFrames / fps).toFixed(4)}:offset=${offset.toFixed(4)},format=yuv420p[v]`,
    '-map', '[v]',
    '-frames:v', '69',
    ...base,
    out,
  ], path.basename(out));
}

await mkdir(segDir, { recursive: true });
const capture = JSON.parse(await readFile(path.join(outDir, 'capture.json'), 'utf8'));
const clip = (name) => path.join(outDir, `${name}.webm`);
const F = {
  s1: await flashEnd(clip('s1')),
  lander: await flashEnd(clip('lander')),
  hopIntro: await flashEnd(clip('hopIntro')),
  tomatoIntro: await flashEnd(clip('tomatoIntro')),
  report: await flashEnd(clip('report')),
};
const mark = (name, label) => {
  const found = capture.clips[name].marks.find((m) => m.name === label);
  if (!found) throw new Error(`capture.json has no mark "${label}" in clip "${name}"`);
  return found.t;
};
console.log('flash ends', F);

const cards = path.join(outDir, 'cards');
const stills = path.join(outDir, 'stills');
const assets = path.join(__dirname, 'assets');
const seg = (name) => path.join(segDir, `${name}.mp4`);

// 1. Intro text card (0.0-2.5)
await encodeStill({
  image: path.join(cards, 'intro.png'),
  out: seg('s01'),
  seconds: 2.5,
  zoom: 0.02,
  extra: 'fade=t=in:st=0:d=0.25',
});

// 2. Gale approach, wide -> mid with a 0.27 s crossfade (2.5-4.8)
await encodeStill({
  image: path.join(assets, 'mars-trek', 'gale-wide.jpg'),
  out: path.join(segDir, 'gale-wide.mp4'),
  seconds: 39 / fps,
  zoom: 0.06,
});
await encodeStill({
  image: path.join(assets, 'mars-trek', 'gale-mid.jpg'),
  out: path.join(segDir, 'gale-mid.mp4'),
  seconds: 38 / fps,
  zoom: 0.06,
});
const creditFont = 'C\\:/Windows/Fonts/arialbd.ttf';
// The title card carries the audience line, so the Gale shot only needs the credit.
const galeLower = [
  `drawtext=fontfile='${creditFont}':text='NASA/JPL-Caltech · Mars Trek':fontcolor=white@0.9:fontsize=22:x=w-tw-56:y=h-54:box=1:boxcolor=0x00000066:boxborderw=10`,
].join(',');
await run([
  '-y',
  '-i', path.join(segDir, 'gale-wide.mp4'),
  '-i', path.join(segDir, 'gale-mid.mp4'),
  '-filter_complex',
  `[0:v][1:v]xfade=transition=fade:duration=${(8 / fps).toFixed(4)}:offset=${(31 / fps).toFixed(4)},${galeLower},format=yuv420p[v]`,
  '-map', '[v]', '-frames:v', '69',
  ...base, seg('s02'),
], 'gale');

// 3. SDO still with a short white-in (4.8-5.5)
await encodeStill({
  image: path.join(assets, 'apod', 'sun-flare-sdo-2017-09-14.jpg'),
  out: seg('s03'),
  seconds: 0.7,
  zoom: 0.04,
  pre: 'scale=-1:1080,pad=1920:1080:(ow-iw)/2:0:black',
  extra: [
    'fade=t=in:st=0:d=0.12:color=white',
    `drawtext=fontfile='${creditFont}':text='NASA/SDO':fontcolor=white@0.9:fontsize=22:x=w-tw-56:y=h-54:box=1:boxcolor=0x00000066:boxborderw=10`,
  ].join(','),
});

// 4. In-game crash clip (5.5-7.6)
await encodeVideo({
  input: path.join(root, 'src/assets/video/scene2-crash.mp4'),
  start: 7.90,
  seconds: 2.1,
  out: seg('s04'),
  vf: 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080',
});

// 5. Title card (7.6-9.7)
await encodeStill({ image: path.join(cards, 'title.png'), out: seg('s05'), seconds: 2.1, zoom: 0.02 });

// 6. S1 card -> shield up -> result (9.7-13.3)
await encodeVideo({
  input: clip('s1'),
  start: F.s1 + 1.5,
  seconds: 3.6,
  out: seg('s06'),
  vf: 'scale=1920:1080',
});

// 7. HUD/result close-up (13.3-15.4)
await encodeVideo({
  input: clip('s1'),
  start: F.s1 + 5.1,
  seconds: 2.1,
  out: seg('s07'),
  vf: 'crop=1680:945:150:0,scale=1920:1080:flags=lanczos',
});

// 8. Mars Weather Lander (15.4-18.2)
await encodeVideo({
  input: clip('lander'),
  start: F.lander + mark('lander', 'landed') - 1.30,
  seconds: 2.2,
  out: seg('s08'),
  vf: 'crop=1725:970:110:0,scale=1920:1080:flags=lanczos',
});

// 9. Two practice opening screens (17.6-19.7): Low-gravity hop intro for 1.0 s,
// then the Harvest the tomatoes first screen for 1.1 s. No gameplay in this shot.
await encodeVideo({
  input: clip('hopIntro'),
  start: F.hopIntro + mark('hopIntro', 'hopIntro'),
  seconds: 1.0,
  out: path.join(segDir, 's09a.mp4'),
  vf: 'scale=1920:1080',
});
await encodeVideo({
  input: clip('tomatoIntro'),
  start: F.tomatoIntro + mark('tomatoIntro', 'tomatoIntro'),
  seconds: 1.1,
  out: path.join(segDir, 's09b.mp4'),
  vf: 'scale=1920:1080',
});
await concatFiles([path.join(segDir, 's09a.mp4'), path.join(segDir, 's09b.mp4')], seg('s09'));

// 10. Knowledge card -> backpack (19.7-22.1)
await encodeVideo({
  input: clip('s1'),
  start: F.s1 + 8.4,
  seconds: 1.2,
  out: path.join(segDir, 's10a.mp4'),
  vf: 'scale=1920:1080',
});
await encodeVideo({
  input: clip('s1'),
  start: F.s1 + 11.8,
  seconds: 1.2,
  out: path.join(segDir, 's10b.mp4'),
  vf: 'scale=1920:1080',
});
await concatFiles([path.join(segDir, 's10a.mp4'), path.join(segDir, 's10b.mp4')], seg('s10'));

// 11. NASA data panel (22.1-26.0)
await encodeVideo({
  input: clip('s1'),
  start: F.s1 + 15.2,
  seconds: 3.9,
  out: seg('s11'),
  vf: 'scale=1920:1080',
});

// 12. Mission report -> end card (26.0-30.0). The end card only holds for the
// last second: players freeze on the final frame, so it does not need more.
const reportFrames = 96; // 3.2 s
const endFrames = 30; // 1.0 s
const tailFade = 6; // 0.2 s
await encodeVideo({
  input: clip('report'),
  start: F.report + 1.6,
  seconds: reportFrames / fps,
  out: path.join(segDir, 's12a.mp4'),
  vf: 'scale=1920:1080',
});
await encodeStill({
  image: path.join(cards, 'end.png'),
  out: path.join(segDir, 's12b.mp4'),
  seconds: endFrames / fps,
  zoom: 0.01,
});
await run([
  '-y',
  '-i', path.join(segDir, 's12a.mp4'),
  '-i', path.join(segDir, 's12b.mp4'),
  '-filter_complex',
  `[0:v][1:v]xfade=transition=fade:duration=${(tailFade / fps).toFixed(4)}:offset=${((reportFrames - tailFade) / fps).toFixed(4)},format=yuv420p[v]`,
  '-map', '[v]', '-frames:v', String(reportFrames + endFrames - tailFade),
  ...base, seg('s12'),
], 's12');

const parts = [
  's01', 's02', 's03', 's04', 's05', 's06',
  's07', 's08', 's09', 's10', 's11', 's12',
].map(seg);
await concatFiles(parts, path.join(outDir, 'picture.mp4'));

const srt = 'tools/video/narration-ana-45-v3.srt';
const narration = 'tools/video/narration-ana-45-v3.mp3';
const music = 'tools/video/assets/music/paulyudin-space-space-music-607605.mp3';
const finalOut = path.join(__dirname, 'output', 'meowstronauts-demo-30s.mp4');
await rm(finalOut, { force: true });

const subtitleStyle = [
  'FontName=Arial',
  'FontSize=15',
  'PrimaryColour=&H00FFFFFF',
  'OutlineColour=&H00000000',
  'BackColour=&H80000000',
  'BorderStyle=3',
  'Outline=1',
  'Shadow=0',
  'MarginV=30',
].join(',');
await run([
  '-y',
  '-i', path.join(outDir, 'picture.mp4'),
  '-i', narration,
  '-i', music,
  '-filter_complex', [
    `[0:v]subtitles=${srt}:force_style='${subtitleStyle}'[v]`,
    '[1:a]volume=1.0[a1]',
    '[2:a]volume=0.10,afade=t=in:st=0:d=1.0,afade=t=out:st=28.0:d=2.0[a2]',
    '[a1][a2]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]',
  ].join(';'),
  '-map', '[v]', '-map', '[a]',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(fps),
  '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
  '-t', '29.960',
  '-movflags', '+faststart',
  finalOut,
], 'final');

console.log('wrote', finalOut);
