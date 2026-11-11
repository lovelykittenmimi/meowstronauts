# Brand assets — provenance

These files are **pre-event brand and reference assets**, created on 2026-11-11
before the NASA Space Apps Challenge started. They are not presented as
in-game artwork produced during the hackathon.

| Path | What it is |
|---|---|
| `source/{cat}-transparent.png` | Background-removed master cutouts of the three character references |
| `avatar-{cat}-512.webp` | Circular HUD/dialogue avatars |
| `full-{cat}-800.webp` | Full-body cutouts for cards and reports |
| `favicon-*.png` | Site icons derived from the Silver avatar |
| `og-1200x630.jpg` | Social sharing card (interim; may be rebuilt from the event key art) |

The three source reference images live in `docs/assets/characters/` and were
generated with Gemini's image model. The derivatives here were produced with
`rembg` and Pillow.

## Competition use

- NASA Space Apps FAQ: teams may not begin working on the challenge before the
  hackathon. This repository keeps the pre-event work to research, data
  snapshots, planning, and **brand/reference art only**.
- No game code, game content, or playable build exists in this repository
  before 2026-11-14 09:00.
- Final in-game art will be generated during the event from the same character
  references and saved under `src/assets/`; this folder stays as the brand kit.
- Any use of Gemini/Nano Banana must be described in the submission's
  Super Intelligence (SI) disclosure, including this pre-event reference work.

Do not treat these files as evidence that the game itself was built before the
event.
