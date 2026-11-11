# Raw snapshot inputs

These files are **inputs for `scripts/fetch-snapshots.mjs`**, not game assets.
Do not import them from the app; the trimmed snapshots live in `src/data/`.

| File | Fetched | Source | Contents |
|---|---|---|---|
| `donki-cme-2025-05.json` | 2026-11-11 | `https://api.nasa.gov/DONKI/CME?startDate=2025-05-13&endDate=2025-05-17` | 25 raw CME events; the snapshot keeps the latest 20 |
| `donki-gst-2025-05.json` | 2026-11-11 | `https://api.nasa.gov/DONKI/GST?startDate=2025-05-13&endDate=2025-05-17` | 1 geomagnetic storm event, max Kp 6.33 |
| `donki-flr-notifications-2025-05.json` | 2026-11-11 | `https://api.nasa.gov/DONKI/notifications?startDate=2025-05-13&endDate=2025-05-17&type=FLR` | 8 raw flare notifications |
| `donki-flr-2025-05.json` | 2026-11-11 | Derived from the notifications file | 4 structured flares: X1.2, M5.3, X2.7, M7.7 |
| `donki-cme-2026-11-11.json` | 2026-11-11 | `https://api.nasa.gov/DONKI/CME?startDate=2026-11-01&endDate=2026-11-11` | 26 raw CME events; kept as a contrast dataset, no longer used by the snapshot |
| `msl-weather-2026-11-11.json` | 2026-11-11 | `https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json` | 4,745 raw sols (4,717 valid); archive covers 2012-08-07 → 2026-08-25 |

## Why the weather snapshot uses 2025

The latest 14 sols (2026-08-12 → 08-25) are relatively warm: daytime highs sit
around the 51st–74th percentile of the archive. The game needs a recent,
genuinely cold week, so `mars-weather.snapshot.json` selects
**2025-05-08 → 2025-05-22**:

- Core 7 sols (2025-05-15 → 05-22; 2025-05-18 is missing from the feed)
- Average daytime high: **-29.7 °C**
- Top **1.1%** of 4,547 comparable 7-sol windows (14 windows tie at the same
  average; tie-aware rank 52)
- Coldest day in this window: **2025-05-16**, daytime high **-33 °C**,
  nighttime -79 °C (17th-coldest of 4,717 single sols; do not call it the
  coldest day on record)
- This is not the aphelion: the 2025-04-17 aphelion window averaged -26.0 °C
  (top 11%). The cold peak came about a month later, near the southern winter
  solstice (Ls 90).

The 2019-08-15 → 08-29 window remains the stronger historical comparison
(core 2019-08-22 → 08-29, average -31.9 °C, rank 4/4,547), but it is seven
years old.

Do not use the isolated readings 2026-01-10 (-59 °C), 2024-04-14 (-49 °C),
2024-04-12 (-38 °C), or 2024-05-28 (-38 °C): neighbouring days are 40–60 °C
warmer and they are treated as sensor/archive artifacts.

No temperature values were modified. The selection, missing date and tie-aware
rank are recorded in `src/data/mars-weather.snapshot.json` under
`meta.selection` and `meta.observation.missingDates`.

## Why the storm snapshot uses 2025-05-13 → 05-17

The game opens with a crash during a solar event, and the survival week is
2025-05-15 → 05-22. DONKI shows a strong flare sequence immediately before it:

- 2025-05-13 15:38Z — **X1.2** (AR 14086)
- 2025-05-14 03:25Z — **M5.3** (AR 14087)
- 2025-05-14 08:25Z — **X2.7** (AR 14087), the strongest flare of 2025 at the time
- 2025-05-14 11:19Z — **M7.7** (AR 14087)
- 2025-05-17 03:00Z — geomagnetic storm max **Kp 6.33** (G2), below Kp ≥ 7

The X2.7 flare makes `strongFlare` and `strongStormConfirmed` true. The
geomagnetic response is below the threshold, so `strongGeomagneticStorm` is
false: the game may say **"strong solar flare"**, but not **"strong
geomagnetic storm"**. The CME DONKI links to the X2.7 flare is the 2025-05-14
08:48Z event (1036 km/s, half-angle 40°); it is not a halo CME, and do not
claim it hit Mars. The fastest CME in the window (1755 km/s, half-angle 16°,
08:00Z) is linked to a separate M1.2 flare — do not present it as the X2.7 CME.

`/DONKI/FLR` returned HTTP 404 on 2026-11-11 even with a real key, so the four
flares were parsed from `/DONKI/notifications?type=FLR`. The notifications do
not include an end time, so `endTime` is `null` in the snapshot.

The 2026-11 CME file is kept as a contrast dataset: its fastest CME (974 km/s)
had a half-angle of only 11°, and the window had no X/M5+ flare or Kp ≥ 7. It
is no longer used by the committed snapshot.
