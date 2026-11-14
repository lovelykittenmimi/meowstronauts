# Mars Weather Lander (embedded)

This folder is the landing mini-game copied from the standalone
`mars-weather-lander` build in the Meow workspace. It is rendered through
`src/minigames/LanderOverlay.tsx` in a shadow root, and opened from
`src/ui/StoryOpening.tsx` after the scene-2 crash video.

## Data

- Perseverance MEDA sols 300–306 (2021-12-23 to 2021-12-30), Jezero Crater.
- `DER_WS` wind speed/direction, `DER_PS` pressure, and calibrated `CAL_ATS`
  air temperature, summarised into four LMST phases per sol.
- Source: NASA PDS Planetary Atmospheres Node, Mars 2020 MEDA bundle.
- `data/meda-sample.json` keeps the source filenames, row counts, mission
  timestamps, Ls, Mars Year, credit, and the wind-direction convention.
- MEDA wind direction is the azimuth the wind comes **from**. Map arrows show
  the opposite direction, where the wind pushes the ship.
- The map is Gale Crater (NASA Mars Trek) and the target is the Curiosity
  landing site. The weather is from Jezero Crater: this is a training sample,
  not a forecast, and does not imply NASA endorsement.

## Structure

- `WeatherLanderGame.tsx` — game shell; props `initialLang` and `onExit`.
- `components/` — map stage, weather HUD, controls, ship, feedback and data modals.
- `game/` — deterministic zone generation, wind physics, i18n, and types.
- `data/meda-sample.json` — static weather sample for the front end.
- `styles.css` — injected into the shadow root with `?inline`; its generic
  selectors cannot leak into the main game's global stylesheet.
- Map image: `src/assets/nasa/gale-wide.webp`. Avatars:
  `src/assets/avatars/silver/`.

## Integration

- `StoryOpening.tsx` shows a `Modal` after the crash video ends. “Start
  practice” opens `LanderOverlay`; “Not now” returns to the radio dialogue.
- After the video ends, a small “Practice landing” button stays in the radio
  panel, so the optional game can be reopened.
- The game’s back button returns to the dialogue.
- The standalone source in `C:\Projects\Meow\mars-weather-lander` is not part
  of the repository; this folder is the integrated copy.

## Controls

- Arrow keys or WASD to fly; Enter or Space to land.
- On-screen D-pad and LAND button for touch.
