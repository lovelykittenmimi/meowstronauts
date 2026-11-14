# tools/video

Standalone 30-second video pipeline. It has its own `package.json` and is not
part of the game build.

## What is here

| File | Purpose |
|---|---|
| `title-card.html` | 10-second 1920×1080 title-card animation used to prove capture, subtitles, and audio muxing; placeholder for the final title card |
| `capture-test.mjs` | Playwright capture using the installed Chrome (`channel: "chrome"`, no browser download) |
| `test.srt` | English subtitles burned into the test video |
| `narration-ana-45.srt` | 8 English subtitle cues timed to the chosen Ana +45% narration (26.5 s) |
| `narration-ana-45.mp3` | The exact chosen Ana +45% narration (158,832 bytes, 26.5 s). Committed so C can assemble v1 without network TTS; regenerate only if the script changes. |
| `make-test-voice.ps1` | Windows SAPI scratch voice (Zira) for the 10-second test |
| `make-narration-test.ps1` | 57-word scratch narration (Zira, rate 3); measured 23.8 s |
| `assemble-test.mjs` | ffmpeg assembly: scale/pad to 1920×1080, burn SRT, AAC audio, 30fps H.264 |
| `assets/apod/` | NASA stills for the opening shots; video-only, not game assets. Credits and crop rules in `assets/apod/CREDITS.md` |
| `assets/mars-trek/` | Gale Crater wide/mid/close stills for the approach zoom; exported from Mars Trek, not screen-recorded. Credits in `assets/mars-trek/CREDITS.md` |
| `output/` | Git-ignored; all raw and final media goes here |

## edge-tts (installed 2026-11-12; chosen voice: Ana +45%)

`edge-tts` 7.3.1 is installed for Python 3.14. The console script directory is
not on PATH, so call it as a module:

```bash
python -m edge_tts -f narration.txt -v en-US-AnaNeural --rate=+45% \
  --write-media output/edge-narration-ana-45.mp3
```

Measured for the 57-word narration:

| Voice | Rate | Duration |
|---|---|---:|
| `en-US-AnaNeural` | +45% | **26.5 s — chosen (child voice)** |
| `en-US-AriaNeural` | +45% | 24.0 s (adult backup) |
| `en-US-AriaNeural` | +40% | 24.8 s |
| `en-US-GuyNeural` | +45% | 23.4 s |
| `en-US-AriaNeural` | +0% | 34.7 s (too slow) |

The chosen Ana +45% track leaves 3.5 s in the 30-second cut. Convert it to
48 kHz mono WAV before assembly. `narration-ana-45.srt` is timed from
`silencedetect`; re-check it if the voice or rate changes:

```bash
ffmpeg -y -i output/edge-narration-ana-45.mp3 -ar 48000 -ac 1 \
  output/edge-narration-ana-45.wav
```

Chinese voices (`zh-TW-HsiaoChenNeural`, `zh-TW-YunJheNeural`,
`zh-TW-HsiaoYuNeural`) also work for samples, but the game does not use in-game
voice. If a Chinese line returns `NoAudioReceived`, remove a trailing `……` or
retry; the service is occasionally flaky.

### Child voices (availability)

- English has **two** child voices: `en-US-AnaNeural` (US girl) and
  `en-GB-MaisieNeural` (UK girl). There is no third child voice.
- Chinese has **one** clear child voice in the edge-tts list:
  `zh-CN-YunxiaNeural` (Mainland boy, about 10). `zh-CN-XiaoyiNeural` is a
  young-adult cartoon female, not a child. There is no zh-TW child voice.
- `zh-CN-XiaoshuangNeural` (girl child in Azure docs) is not available through
  edge-tts; it returns `NoAudioReceived`.
- Consequence: do not plan three child voices for the three cats. The game
  stays text-only; the 30-second video uses one narrator (Ana).

## Run

```bash
cd tools/video
npm install
powershell -NoProfile -ExecutionPolicy Bypass -File make-test-voice.ps1
npm run test
```

Then inspect `output/test-10s.mp4`:

```bash
ffprobe -v error -show_entries format=duration -show_entries stream=codec_type,width,height,r_frame_rate -of default=noprint_wrappers=1 output/test-10s.mp4
```

## Notes

- `ffmpeg` is installed through winget; `assemble-test.mjs` resolves the winget
  shim (`%LOCALAPPDATA%\Microsoft\WinGet\Links\ffmpeg.exe`) itself, so a shell
  restart is not required.
- Playwright records through the installed Chrome. If video recording needs
  Playwright's ffmpeg helper, run `npx playwright install ffmpeg` once.
- The test page is deliberately not game art. Real game footage is recorded from
  the frozen 11/14 build; see `docs/video-script.md`.
