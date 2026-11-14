# Mars Trek stills — Gale Crater approach

Source: NASA Mars Trek, ArcGIS `ImageServer/exportImage`, downloaded 2026-11-14.
Service: `Mars_Viking_MDIM21_ClrMosaic_global_232m` (true colour, 232 m/px).
Credit: **NASA/JPL-Caltech** (Mars Trek). Do not imply NASA endorsement.

These are **video-only** assets, not game art. They are a map, not a photograph taken from the crashing ship.

## Files

| File | Bbox (lon/lat, EPSG:4326) | Size | Use |
|---|---|---:|---|
| `gale-wide.jpg` | 130, −12, 146, 4 | 1920×1080 | 2.5–3.6 s: Gale small in frame, start of push-in |
| `gale-mid.jpg` | 135, −7, 141, −2 | 1920×1080 | 3.6–4.6 s: crater rim and Aeolis Mons fill the frame |
| `gale-close.jpg` | 136.4, −6.6, 139.2, −3.8 | 1920×1080 | optional 4.6–5.0 s; soft when enlarged, use only as a quick beat |

All three share the same centre and projection, so a scale-up + crossfade reads as one continuous zoom.
Do **not** screen-record the Mars Trek website: the UI, labels and network latency would be baked in, and the zoom would not be repeatable.

## Suggested edit

```text
2.5–3.6  gale-wide   scale 1.00 → 1.15
3.6–4.6  gale-mid    scale 1.10 → 1.25, crossfade 0.25 s
4.6–5.5  SDO flare   white flash (assets/apod/sun-flare-sdo-2017-09-14.jpg)
5.5–8.5  game crash  opening2 animation
```

- Keep the push-in slow; a fast zoom reads as a slideshow.
- Add a small lower-third: `GALE CRATER · HOPE-1` (the outpost is fictional; Gale is real).
- Small credit lower-right for the first 1.5 s: `NASA/JPL-Caltech · Mars Trek`.
- Do not print coordinates or a scale bar; the video is not a navigation display.

## Why not the website's own zoom

- The interactive client streams tiles; recording it adds loading pauses and the basemap label can pop in mid-move.
- At high zoom the client may switch to a different layer (HiRISE is grayscale), so the colour would jump.
- The exported stills above can be re-rendered identically after the 21:00 build freeze.
