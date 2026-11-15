# tools/video

Standalone 30-second video pipeline. It has its own `package.json` and is not
part of the game build.

## What is here

| File | Purpose |
|---|---|
| `make-narration.mjs` | Generates `narration-ana-45-v3.mp3/.srt` from the `CUES` table (edge-tts Ana +45%, per-cue start times; fails if a cue overruns the next) |
| `capture-demo.mjs` | Records the demo clips from the deployed build with Playwright and a fake cursor; writes `output/demo/<clip>.webm` and `capture.json` marks |
| `assemble-demo.mjs` | Cuts the 11 shots exactly on the §0.4 timeline and muxes narration, music and burned subtitles into `output/meowstronauts-demo-30s.mp4` |
| `DEMO-TIMELINE.md` | The frame-by-frame manifest: every shot's output in/out, its source file and source time, the fades, the two opening stills, and the narration/SRT cue table. `assemble-demo.mjs` is built from this table — change the table first, then the code |
| `verify-timeline.mjs` | Grabs the output frame at 14 probe times, grabs the frame the timeline names from the source file, and prints an SSIM per probe. Exits 1 on any FAIL, so a timing slip cannot ship silently |
| `capture-cards.mjs` | Renders the intro/title/end cards to `output/demo/cards/*.png` from `demo-cards.html` |
| `demo-cards.html` | The three full-screen cards (intro, title, end) used by `capture-cards.mjs` |
| `title-card.html` | Early 10-second title-card animation used to prove capture, subtitles, and audio muxing; not used by the final cut |
| `narration-ana-45-v3.srt` | English subtitle cues for the v3 narration (9 lines, timed by `make-narration.mjs`) |
| `narration-ana-45-v3.mp3` | The current Ana +45% narration take. The shot list and cue table are in `docs/video-script.md` §0.4–§0.6. |
| `assets/apod/` | NASA stills for the opening shots; video-only, not game assets. Credits and crop rules in `assets/apod/CREDITS.md` |
| `assets/opening/` | The two team-generated stills that replaced the in-game crash clip in the demo (`ship-in-space.png` 4.0–6.2, `crash-on-mars.png` 6.2–9.0). Not NASA imagery; credits in `assets/opening/CREDITS.md` |
| `assets/mars-trek/` | Gale Crater wide/mid/close stills exported from Mars Trek. **Not used by the final cut since the 11/15 opening revision** (the intro is the SDO flare, then the two crash stills); kept for reference. Credits in `assets/mars-trek/CREDITS.md` |
| `output/` | Git-ignored; all raw and final media goes here |

## edge-tts (installed 2026-11-12; chosen voice: Ana +45%)

`edge-tts` 7.3.1 is installed for Python 3.14. The current take is generated
from the cue table in `docs/video-script.md` §0.6 with `en-US-AnaNeural` at
`--rate=+45%`.

Measured for the earlier 57-word narration (kept for reference):

| Voice | Rate | Duration |
|---|---|---:|
| `en-US-AnaNeural` | +45% | **26.5 s — chosen (child voice)** |
| `en-US-AriaNeural` | +45% | 24.0 s (adult backup) |
| `en-US-AriaNeural` | +40% | 24.8 s |
| `en-US-GuyNeural` | +45% | 23.4 s |
| `en-US-AriaNeural` | +0% | 34.7 s (too slow) |

The current v3 script is 9 cues / 59 words; the take ends at 27.17 s and
leaves about 1.8 s before the end card. The MP3 and SRT are written together
by `make-narration.mjs`, so the subtitles stay on the same clock as the cuts:
change the text in `CUES`, run it again, and copy the measured end times back
into `docs/video-script.md` §0.6.

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
ffmpeg from this folder.

```bash
npm ci                 # Playwright (Chrome must be installed)
node make-narration.mjs   # narration-ana-45-v3.mp3/.srt (needs edge-tts + ffmpeg)
node capture-cards.mjs    # output/demo/cards/*.png
node capture-demo.mjs     # all five clips; add a clip name, e.g. hopIntro, to redo one
node assemble-demo.mjs    # output/meowstronauts-demo-30s.mp4
node verify-timeline.mjs  # 14 SSIM probes; must print "14/14 probes passed"
```

The five clips are `s1`, `lander`, `report`, `hopIntro`, `tomatoIntro`.
`hopIntro` and `tomatoIntro` go through the normal flow (title → Officer →
skip opening → SolNav) because `?video=` hides the practice icons, and they
stop on the opening screen — no gameplay in shot 8.

The music MP3s under `assets/music/` are git-ignored on purpose (licenses and
Pixabay links are in `assets/music/CREDITS.md`); copy them onto the recording
machine before running `assemble-demo.mjs`.

## Notes

- `ffmpeg` is installed through winget; the assembly script resolves the winget
  shim (`%LOCALAPPDATA%\Microsoft\WinGet\Links\ffmpeg.exe`) itself, so a shell
  restart is not required.
- Playwright records through the installed Chrome. If video recording needs
  Playwright's ffmpeg helper, run `npx playwright install ffmpeg` once.
- The test page is deliberately not game art. Real game footage is recorded from
  the deployed build at `https://mars.flymymind.com`; see `docs/video-script.md`.
