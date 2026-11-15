// Builds the demo narration from one edge-tts clip per cue.
// Each cue has a fixed start time on the 30 s timeline, so the burned
// subtitles and the picture cuts are scheduled from the same numbers.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cueDir = path.join(__dirname, 'output', 'narration');
const voice = 'en-US-AnaNeural';
const rate = '+45%';
const totalSeconds = 30;
const MIN_GAP = 0.18; // keep at least this much air between cues

// start = when the cue must begin so it lands on its shot.
const CUES = [
  { start: 2.5, text: 'A Mars mission trainer for kids seven to twelve.' },
  { start: 5.6, text: 'Three cats. One crash.' },
  { start: 7.8, text: 'Meowstronauts: Mars Outpost.' },
  { start: 9.9, text: 'Seven sols. Every choice costs something.' },
  { start: 13.5, text: 'Save the shield, or save the crew.' },
  { start: 15.6, text: 'Then practice with mini-games: land the ship, hop the ridge, pick tomatoes.' },
  { start: 19.8, text: 'Tap a word. Learn the science.' },
  { start: 22.2, text: 'Real NASA data: the May 2025 X2.7 flare.' },
  { start: 26.1, text: "One choice they'll remember." },
];

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
const ffprobe = resolveTool('ffprobe');

function run(bin, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { cwd: __dirname, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    child.stdout.on('data', (chunk) => { out += chunk.toString(); });
    child.stderr.on('data', (chunk) => { err += chunk.toString(); });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve(out);
      else reject(new Error(`${path.basename(bin)} failed (${code})\n${err.slice(-2000)}`));
    });
  });
}

async function durationOf(file) {
  const out = await run(ffprobe, [
    '-v', 'error', '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1', file,
  ]);
  return Number.parseFloat(out.trim());
}

function stamp(seconds) {
  const ms = Math.round(seconds * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const rest = ms % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(rest).padStart(3, '0')}`;
}

await mkdir(cueDir, { recursive: true });

const made = [];
for (const [index, cue] of CUES.entries()) {
  const raw = path.join(cueDir, `cue-${String(index + 1).padStart(2, '0')}.mp3`);
  const file = path.join(cueDir, `cue-${String(index + 1).padStart(2, '0')}.wav`);
  await rm(raw, { force: true });
  await rm(file, { force: true });
  await run('python', [
    '-m', 'edge_tts',
    '--voice', voice,
    '--rate', rate,
    '--text', cue.text,
    '--write-media', raw,
  ]);
  // edge-tts pads every clip with silence; trim both ends so the cue starts on
  // its subtitle time and the gap before the next cue is real air.
  await run(ffmpeg, [
    '-y', '-i', raw,
    '-af', [
      'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02',
      'areverse',
      'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02',
      'areverse',
    ].join(','),
    '-c:a', 'pcm_s16le', '-ar', '24000', '-ac', '1',
    file,
  ]);
  const duration = await durationOf(file);
  made.push({ ...cue, index, file, duration, end: cue.start + duration });
  console.log(
    `cue ${index + 1}: start ${cue.start.toFixed(2)}s  dur ${duration.toFixed(2)}s  end ${(cue.start + duration).toFixed(2)}s`,
  );
}

let failed = false;
for (const [i, cue] of made.entries()) {
  const next = made[i + 1];
  const room = (next ? next.start : totalSeconds) - cue.end;
  if (room < MIN_GAP) {
    failed = true;
    console.error(
      `cue ${i + 1} overruns: ends ${cue.end.toFixed(2)}s, next starts ${(next ? next.start : totalSeconds).toFixed(2)}s (room ${room.toFixed(2)}s)`,
    );
  }
}
if (failed) {
  console.error('narration does not fit the timeline — shorten a cue or move its start');
  process.exit(1);
}

// One silent bed with every cue delayed onto its start time.
const inputs = ['-f', 'lavfi', '-t', String(totalSeconds), '-i', 'anullsrc=r=24000:cl=mono'];
for (const cue of made) inputs.push('-i', cue.file);
const delays = made.map(
  (cue, i) => `[${i + 1}:a]adelay=${Math.round(cue.start * 1000)}:all=1[c${i + 1}]`,
);
const mixIn = ['[0:a]', ...made.map((_, i) => `[c${i + 1}]`)].join('');
const filter = [
  ...delays,
  `${mixIn}amix=inputs=${made.length + 1}:duration=first:normalize=0[a]`,
].join(';');

const audioOut = path.join(__dirname, 'narration-ana-45-v3.mp3');
await rm(audioOut, { force: true });
await run(ffmpeg, [
  '-y', ...inputs,
  '-filter_complex', filter,
  '-map', '[a]', '-c:a', 'libmp3lame', '-b:a', '192k', '-ar', '24000', '-ac', '1',
  '-t', String(totalSeconds),
  audioOut,
]);

const srtOut = path.join(__dirname, 'narration-ana-45-v3.srt');
const srt = made
  .map((cue, i) => `${i + 1}\n${stamp(cue.start)} --> ${stamp(cue.end)}\n${cue.text}\n`)
  .join('\n');
await writeFile(srtOut, `${srt}\n`, 'utf8');

const words = made.reduce((sum, cue) => sum + cue.text.split(/\s+/).filter(Boolean).length, 0);
const last = made[made.length - 1];
console.log(`\n${made.length} cues, ${words} words, speech ends ${last.end.toFixed(2)}s`);
console.log('wrote', audioOut);
console.log('wrote', srtOut);
