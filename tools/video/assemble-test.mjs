import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

function resolveTool(name) {
  const exe = process.platform === 'win32' ? `${name}.exe` : name;
  const candidates = [
    process.env[name.toUpperCase()],
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Links', exe),
    path.join('C:', 'ProgramData', 'chocolatey', 'bin', exe),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return name;
}

const ffmpeg = resolveTool('ffmpeg');

const filter = [
  'scale=1920:1080:force_original_aspect_ratio=decrease',
  'pad=1920:1080:(ow-iw)/2:(oh-ih)/2',
  'setsar=1',
  "subtitles=tools/video/test.srt:force_style='FontName=Arial,FontSize=14,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BackColour=&H80000000,BorderStyle=3,Outline=1,Shadow=0,MarginV=28'",
].join(',');

const args = [
  '-y',
  '-ss', '0.3',
  '-i', 'output/test-capture.webm',
  '-i', 'output/test-voice.wav',
  '-vf', filter,
  '-r', '30',
  '-c:v', 'libx264',
  '-preset', 'medium',
  '-crf', '18',
  '-pix_fmt', 'yuv420p',
  '-c:a', 'aac',
  '-b:a', '192k',
  '-ar', '48000',
  '-t', '10',
  'output/test-10s.mp4',
];

const child = spawn(ffmpeg, args, { cwd: root, stdio: 'inherit' });
child.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
child.on('exit', (code) => process.exit(code ?? 1));
