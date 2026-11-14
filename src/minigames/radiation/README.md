# Shelter Drill（避難艙演練）

A 60–90 second optional training game for the radiation beat in the story. The
crew prepares a buried storm shelter, moves inside, recalls three cats before a
solar-particle front arrives, and tests the chosen shielding layers.

## Flow

1. **Prepare** — choose one layer for the roof and one for the wall within a
   mass and water budget. Regolith is strongest on the roof; water is strongest
   on the wall.
2. **Move to the shelter** — the commander walks to the buried shelter.
3. **Recall** — tap Shadow, Silver and Ginger before the particle front hits.
   Packing and running take time; Ginger is farthest.
4. **Storm and debrief** — the layers block part of the solar particles; cosmic
   rays still get through. The result shows a relative dose for each cat, a
   shield report, and the `radiationShielding` knowledge card.

The drill is optional. It never changes the seven-sol resource balance.

## Where it opens

- **Story scene 5** — after the player places the outer-wall module, a
  `Shelter drill` button appears at the top left.
- **Sol row** — the `☢️ Shelter drill` button sits beside `🚀 Landing practice`.

Both mount `RadiationOverlay` in a shadow root, so the game CSS cannot leak into
the app. The overlay calls `onComplete('radiationShielding')` once when the
result screen appears; the parent dispatches `COLLECT_CARD`.

## Data provenance

The scenario is seeded from a real NASA DONKI SEP record:

| Field | Value |
|---|---|
| Event | `2025-05-13T18:14:00-SEP-001` |
| SEP time | `2025-05-13T18:14Z` |
| Instrument | SOHO COSTEP, 15.8–39.8 MeV |
| Linked flare | `2025-05-13T15:25Z` |
| Linked CME | `2025-05-13T16:15Z` |
| Alert | `2025-05-13T18:33Z` |

Source snapshot: [`data/solar-event.json`](data/solar-event.json), fetched from
`https://api.nasa.gov/DONKI/SEP`. The snapshot is checked in; the game never
calls NASA at runtime. The numbers are shown in UTC with a
“training simulation / time compressed” label.

The shielding concepts come from NASA Science:
[Real Martians: How to Protect Astronauts from Space Radiation on Mars](https://science.nasa.gov/resource/real-martians-how-to-protect-astronauts-from-space-radiation-on-mars/).
NASA describes mass, hydrogen-rich materials (water, polyethylene, plastic made
from crew trash), experimental BNNTs, storm shelters, and the fact that galactic
cosmic rays (GCRs) are much harder to stop than solar protons.

### What is real and what is game

- **Real:** the DONKI event times, instrument and alert time; the qualitative
  shielding ideas; the fact that Mars has no global magnetic field and a thin
  atmosphere.
- **Game values:** the SEP/GCR percentages on the material cards, the mass and
  water budgets, the cat travel times, the 20-second compressed countdown, and
  the relative dose bars. These are not NASA efficiency rankings, not mSv, and
  not a Mars surface measurement.

Do not add a dose unit or a “NASA says this material blocks X%” claim without a
new source and a data note. The event card and result screen must keep the
training-simulation label.

## Files

- `ShelterDrill.tsx` — phase state machine (prep → moving → alert → storm → result).
- `components/` — shelter diagram, prep panel, alert board, result panel, event
  card, data modal.
- `game/materials.ts` — material stats, budgets, placement rules.
- `game/dose.ts` — relative dose model and star rating.
- `game/cats.ts` — recall timings and progress helpers.
- `game/i18n.ts` — EN / zh-TW copy, material and cat names, debrief quotes.
- `data/event.ts` — typed access to the DONKI snapshot and source links.
- `styles.css` — shadow-root styles; imported with `?inline` by
  `RadiationOverlay`.

## Tests

```bash
npx vitest run src/minigames/radiation
```

Covered: budget rejection, material costs, positional bonuses, the GCR
residual, late-cat doses, star thresholds, DONKI event fields, the no-fake-dose
rule, the prep → recall → result flow, and both entry points in `App.test.tsx`.

## Accessibility and small screens

- All actions are buttons; keyboard focus and Enter/Space work.
- Tap targets are at least 44 px in the main actions; the compact landscape
  layout keeps the LAND-equivalent buttons readable.
- `prefers-reduced-motion` skips the storm animation and shows the result
  directly.
- The game uses relative dose bars plus text (`Below the line` / `Above the
  line`), not colour alone.
