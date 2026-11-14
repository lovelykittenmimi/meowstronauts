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
| `avatar-front-{cat}-512.webp` | Front-facing circular avatars (2026-11-14), built from the `neutral` headshots in `src/assets/avatars/`; same tinted disc and 10 px navy ring as the three-quarter set |
| `favicon-front-{cat}-180.png` / `-32.png` | Front-facing cat favicons derived from the same front-facing discs |
| `logo-three-cats-512.png` / `.webp` | Team mark: watercolour three-cat logo, true-alpha master (WebP 37 KB for web) |
| `logo-three-cats-256.png` | Smaller team mark for loading screens and footers |
| `paw-ink-256.png` / `paw-pink-256.png` | Paw marks for favicon, stamps, decoration |
| `favicon-paw-32.png` / `favicon-paw-180.png` | Paw favicon (cream rounded tile, ink paw) |
| `og-1200x630.jpg` | Final social sharing card (2026-11-14), generated with prompt 30 from the GEM references. The render was scaled into the 1200×630 safe area and its dark background extended from the base pixels; the title block and the `Fly My Mind` team credit are overlaid in code. `public/brand/og-1200x630.jpg` is a byte-identical copy. |

The three source reference images live in `docs/assets/characters/` and were
generated with Gemini's image model. The derivatives here were produced with
`rembg` and Pillow.

The watercolour three-cat logo and the two paw marks were supplied by the team
on 2026-11-12 as the project's existing identity marks.

The first logo file was a JPEG with a checkerboard pattern baked into the
pixels, not real transparency; `source/logo-three-cats-rembg.png` is that
version after a `rembg` cutout, kept only for comparison. The team then supplied
a true alpha PNG (`source/logo-three-cats-original.png`, copied to
`source/logo-three-cats-transparent.png`), which is now the master. It has clean
edges on both paper and navy backgrounds.

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
