# Meowstronauts: Mars Outpost

https://mars.flymymind.com/

A child-friendly Mars base survival game for the **NASA Space Apps Challenge 2026**.

Three cat astronauts crash near the fictional Hope-1 outpost and must keep the
base — and themselves — alive for seven sols, until the supply ship arrives.
Players manage power, life support, radiation shielding, food, health, and
science while learning how real Mars data is read.

## Status

**Event build, 2026-11-14.** The playable loop is in place: title screen →
skippable six-scene opening → seven sols of event cards → mission report, in
English and Traditional Chinese. The build ships 12 event cards (including a
scripted Sol 1 tutorial) and 20 knowledge cards, all backed by the committed
offline NASA snapshots. The 30-second demo video and final submission copy are
produced during the event.

## What is real and what is fiction

- **Real:** the 2025-05-14 X2.7 solar flare (NASA DONKI), the 2025-05-15 → 05-22
  cold week in Curiosity REMS weather data, and the Mars surface photographs
  from the NASA Image Library.
- **Fiction:** the Hope-1 base, the crash, the cat crew, and the seven-sol
  survival mission. The crash is framed in-game as a training simulation.
- The game may say **"strong solar flare"**. It must not say "strong
  geomagnetic storm": the 2025-05-17 response peaked at Kp 6.33, below the
  Kp ≥ 7 threshold.

Offline snapshots are committed so the demo works without network access. They
are never presented as live data.

## Repository layout

| Path | Contents |
|---|---|
| `docs/data-sources.md` | NASA APIs, verified values, honesty rules |
| `docs/playtest.md` | Child playtest protocol, observation sheet, fix log |
| `docs/glossary.md` | 20 candidate terms with verified NASA sources |
| `docs/event-cards.md` | Event-card schema, deck rules, resolution order |
| `docs/balance-sheet.csv` | 24-card design library × 3 choices; MVP ships 12 |
| `docs/wireframes.md` | Layout specs from 568×320 to 1440×900, panels and backpack |
| `docs/iconography.md` | Icon strategy: Lucide for UI, paw/logo as team marks |
| `docs/character-voices.md` | Voice rules for the three cats, calibration lines |
| `docs/ai-disclosure.md` | AI tools, scope, fact-checking, runtime statement |
| `docs/video-script.md` | 30-second demo video shot list and narration |
| `docs/video-path.md` | Deterministic demo URLs, test IDs, recording route and handoff checks |
| `docs/pitch.md` | 30-second judge pitch, demo route, Q&A |
| `docs/qa-checklist.md` | 11/14–15 manual QA: responsive, a11y, i18n, data honesty |
| `docs/licenses.md` | Fonts, icons, NASA media, dependencies, credits |
| `docs/assets/characters/` | Three character reference images |
| `brand/` | Pre-event brand kit: avatars, full-body cutouts, favicons, OG card |
| `.github/workflows/ci.yml` | CI skeleton; runs lint/test/build once `package.json` exists |
| `src/data/` | Trimmed offline snapshots and Mars photos |
| `scripts/` | Snapshot fetch script and raw download inputs |
| `output/` | Local video output (git-ignored) |

## Language

The final submission defaults to **English**, with a Traditional Chinese toggle.
Development notes and planning documents are written in Traditional Chinese.

## License

Apache License 2.0. See [LICENSE](LICENSE).

Mars photographs are courtesy NASA/JPL-Caltech and remain subject to NASA's
media usage guidelines.
