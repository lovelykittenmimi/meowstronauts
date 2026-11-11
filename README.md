# Meowstronauts: Mars Outpost

A child-friendly Mars base survival game for the **NASA Space Apps Challenge 2026**.

Three cat astronauts crash near the fictional Hope-1 outpost and must keep the
base — and themselves — alive for seven sols, until the supply ship arrives.
Players manage power, life support, food, health, morale, and science while
learning how real Mars data is read.

## Status

**Pre-event research only.** No game code or game content is written before
**2026-11-14 09:00** (event start). This repository currently contains the plan,
data-source research, offline API snapshots, and image-generation prompts.

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
| `PLAN.md` | Full project plan: scope, game design, responsive rules, runbook |
| `docs/data-sources.md` | NASA APIs, verified values, honesty rules |
| `docs/image-prompts.md` | 29 image-generation prompts and output specs |
| `docs/gem-instructions.md` | Instructions for the Gemini GEM image workflow |
| `docs/assets/characters/` | Three character reference images |
| `src/data/` | Trimmed offline snapshots and Mars photos |
| `scripts/` | Snapshot fetch script and raw download inputs |

## Language

The final submission defaults to **English**, with a Traditional Chinese toggle.
Development notes and planning documents are written in Traditional Chinese.

## License

Apache License 2.0. See [LICENSE](LICENSE).

Mars photographs are courtesy NASA/JPL-Caltech and remain subject to NASA's
media usage guidelines.
