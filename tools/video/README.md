# tools/video

Standalone 30-second video pipeline. It has its own `package.json` and is not
part of the game build.

## What is here

| File | Purpose |
|---|---|
| `title-card.html` | 10-second 1920×1080 title-card animation used to prove capture, subtitles, and audio muxing; placeholder for the final title card |
| `narration-ana-45-v3.srt` | English subtitle cues for the v3 narration (9 lines, timed by `make-narration.mjs`) |
| `narration-ana-45-v3.mp3` | The current Ana +45% narration take. The shot list and cue table are in `docs/video-script.md` §0.4–§0.6. |
| `assets/apod/` | NASA stills for the opening shots; video-only, not game assets. Credits and crop rules in `assets/apod/CREDITS.md` |
| `assets/mars-trek/` | Gale Crater wide/mid/close stills for the approach zoom; exported from Mars Trek, not screen-recorded. Credits in `assets/mars-trek/CREDITS.md` |
| `output/` | Git-ignored; all raw and final media goes here |

## edge-tts (installed 2026-11-12; chosen voice: Ana +45%)

`edge-tts` 7.3.1 is installed for Python 3.14. The current take is generated
from the cue table in `docs/video-script.md` §0.6 with `en-US-AnaNeural` at
`--rate=+45%`.

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

The 30-second cut is built from the shot list and cue table in
`docs/video-script.md` §0.4–§0.6. Capture and assembly use Playwright and
ffmpeg from this folder. The original 10-second test scaffolding is kept on
the recording machine only and is not part of the repository.

## Notes

- `ffmpeg` is installed through winget; the assembly script resolves the winget
  shim (`%LOCALAPPDATA%\Microsoft\WinGet\Links\ffmpeg.exe`) itself, so a shell
  restart is not required.
- Playwright records through the installed Chrome. If video recording needs
  Playwright's ffmpeg helper, run `npx playwright install ffmpeg` once.
- The test page is deliberately not game art. Real game footage is recorded from
  the frozen 11/14 build; see `docs/video-script.md`.
