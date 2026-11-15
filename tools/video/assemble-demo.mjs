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

async function encodeVideo({ input, start, seconds, out, vf, post = '' }) {
  // Seek before -i: output seeking leaves the source PTS offset in place, and a
  // time-based fade then thinks it is already past its end (a black segment).
  // `post` runs after fps=30 so fades step on every output frame.
  const filter = [vf, `fps=${fps}`, post, 'format=yuv420p'].filter(Boolean).join(',');
  await run([
    '-y',
    '-ss', start.toFixed(3),
    '-i', input,
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

// 1. Intro text card (0.0-2.5). Fade out at the end so the cut to the sun is a
// dip, not a hard brightness jump.
await encodeStill({
  image: path.join(cards, 'intro.png'),
  out: seg('s01'),
  seconds: 2.5,
  zoom: 0.02,
  extra: 'fade=t=in:st=0:d=0.25,fade=t=out:st=2.25:d=0.25',
});

// 2. SDO flare (2.5-4.0). No Gale stills: the intro is the flare and then the
// crash, nothing else. A 0.25 s fade in/out keeps the white sun from becoming a
// one-frame flash between the dark card and the crash.
const creditFont = 'C\\:/Windows/Fonts/arialbd.ttf';
await encodeStill({
  image: path.join(assets, 'apod', 'sun-flare-sdo-2017-09-14.jpg'),
  out: seg('s02'),
  seconds: 1.5,
  zoom: 0.04,
  pre: 'scale=-1:1080,pad=1920:1080:(ow-iw)/2:0:black',
  extra: [
    `drawtext=fontfile='${creditFont}':text='NASA/SDO':fontcolor=white@0.9:fontsize=22:x=w-tw-56:y=h-54:box=1:boxcolor=0x00000066:boxborderw=10`,
    'fade=t=in:st=0:d=0.25',
    'fade=t=out:st=1.25:d=0.25',
  ].join(','),
});

// 3. In-game crash clip (4.0-9.0). The 10.00 s clip is three shots: orbital hit
// (0-3.5), fireball descent (3.5-5.0), then the ground shot (5.0-10.0). The ship
// enters at 5.0 and hits at ~5.2; the cats emerge around 6.5. Take 5.000-7.500
// at 0.5x (setpts 2.0): fall, impact, explosion, then two seconds of the three
// cats standing in the settling dust. No title card after this any more; the
// crash runs straight into the first sol.
await encodeVideo({
  input: path.join(root, 'src/assets/video/scene2-crash.mp4'),
  start: 5.00,
  seconds: 5.0,
  out: seg('s03'),
  vf: 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setpts=(PTS-STARTPTS)*2.0',
  post: 'fade=t=in:st=0:d=0.15,fade=t=out:st=4.80:d=0.20',
});

// 4. S1 card -> shield up -> result (9.0-13.3). Starts 0.7 s earlier in the clip
// (the alert card is up before the click) so the shot ends on the same frame as
// before and every later cut keeps its time.
await encodeVideo({
  input: clip('s1'),
  start: F.s1 + 0.8,
  seconds: 4.3,
  out: seg('s05'),
  // Rebasing PTS makes the fade start on frame 0; the webm's first frame is a
  // few hundredths late, which otherwise steps straight to ~27% brightness.
  vf: 'scale=1920:1080,setpts=PTS-STARTPTS',
  post: 'fade=t=in:st=0:d=0.15',
});

// 5. HUD/result close-up (13.3-15.4)
await encodeVideo({
  input: clip('s1'),
  start: F.s1 + 5.1,
  seconds: 2.1,
  out: seg('s06'),
  vf: 'crop=1680:945:150:0,scale=1920:1080:flags=lanczos',
});

// 6. Mars Weather Lander (15.4-17.6)
await encodeVideo({
  input: clip('lander'),
  start: F.lander + mark('lander', 'landed') - 1.30,
  seconds: 2.2,
  out: seg('s07'),
  vf: 'crop=1725:970:110:0,scale=1920:1080:flags=lanczos',
});

// 7. Two practice opening screens (17.6-19.7): Low-gravity hop intro for 1.0 s,
// then the Harvest the tomatoes first screen for 1.1 s. No gameplay in this shot.
await encodeVideo({
  input: clip('hopIntro'),
  start: F.hopIntro + mark('hopIntro', 'hopIntro'),
  seconds: 1.0,
  out: path.join(segDir, 's08a.mp4'),
  vf: 'scale=1920:1080',
});
await encodeVideo({
  input: clip('tomatoIntro'),
  start: F.tomatoIntro + mark('tomatoIntro', 'tomatoIntro'),
  seconds: 1.1,
  out: path.join(segDir, 's08b.mp4'),
  vf: 'scale=1920:1080',
});
await concatFiles([path.join(segDir, 's08a.mp4'), path.join(segDir, 's08b.mp4')], seg('s08'));

// 8. Knowledge card -> backpack (19.7-22.1)
await encodeVideo({
  input: clip('s1'),
  start: F.s1 + 8.4,
  seconds: 1.2,
  out: path.join(segDir, 's09a.mp4'),
  vf: 'scale=1920:1080',
});
await encodeVideo({
  input: clip('s1'),
  start: F.s1 + 11.8,
  seconds: 1.2,
  out: path.join(segDir, 's09b.mp4'),
  vf: 'scale=1920:1080',
});
await concatFiles([path.join(segDir, 's09a.mp4'), path.join(segDir, 's09b.mp4')], seg('s09'));

// 9. NASA data panel (22.1-26.0)
await encodeVideo({
  input: clip('s1'),
  start: F.s1 + 15.2,
  seconds: 3.9,
  out: seg('s10'),
  vf: 'scale=1920:1080',
});

// 10. Mission report -> end card (26.0-30.0). The end card only holds for the
// last second: players freeze on the final frame, so it does not need more.
const reportFrames = 96; // 3.2 s
const endFrames = 30; // 1.0 s
const tailFade = 6; // 0.2 s
await encodeVideo({
  input: clip('report'),
  start: F.report + 1.6,
  seconds: reportFrames / fps,
  out: path.join(segDir, 's11a.mp4'),
  vf: 'scale=1920:1080',
});
await encodeStill({
  image: path.join(cards, 'end.png'),
  out: path.join(segDir, 's11b.mp4'),
  seconds: endFrames / fps,
  zoom: 0.01,
});
await run([
  '-y',
  '-i', path.join(segDir, 's11a.mp4'),
  '-i', path.join(segDir, 's11b.mp4'),
  '-filter_complex',
  `[0:v][1:v]xfade=transition=fade:duration=${(tailFade / fps).toFixed(4)}:offset=${((reportFrames - tailFade) / fps).toFixed(4)},format=yuv420p[v]`,
  '-map', '[v]', '-frames:v', String(reportFrames + endFrames - tailFade),
  ...base, seg('s11'),
], 's11');

const parts = [
  's01', 's02', 's03', 's05', 's06',
  's07', 's08', 's09', 's10', 's11',
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
