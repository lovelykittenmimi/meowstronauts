# Tomato Harvest（番茄採收）

A short, untimed harvest game for the first F1 **Greenhouse Tomato Harvest**
choice. The F1 card appears normally; clicking **Harvest everything** opens the
harvest, and the card resolves only after the harvest is finished.

## Flow

1. **F1 card** — the three choices are shown as usual. `Save some seeds` and
   `Throw a party` resolve immediately.
2. **Harvest** — clicking `Harvest everything` opens the greenhouse. Tap the
   six glowing ripe tomatoes; green tomatoes wobble and show “Not yet” and stay
   on the vine to ripen. There is no timer and no failure state.
3. **Result** — the crate shows six ripe tomatoes and three left to ripen.
   `Continue` applies the original `harvest-all` effects and shows the normal
   event result. `Skip harvest` returns to the F1 choices without resolving.
4. **Video mode** — `?video=s1` and `?video=report` bypass the harvest and
   resolve the choice immediately.

The game does not change the F1 effects, add resources, or alter the three
choices.

## Files

- `TomatoHarvestOverlay.tsx` — shadow-root wrapper, matching the other games.
- `TomatoHarvestGame.tsx` — harvest, toast, and result state.
- `game/tomatoes.ts` — nine tomato positions, six ripe and three green.
- `game/i18n.ts` — EN / zh-TW copy.
- `styles.css` — game-only CSS injected into the shadow root.
- `assets/greenhouse-harvest.webp` — the greenhouse background.
- `assets/tomato-red.webp`, `assets/tomato-green.webp` — transparent sprites.

## Image provenance

- **Background:** `pic/tomato_game.webp`, provided for the project's F1 tomato
  harvest. It is project art (the same AI-generated project image pipeline as
  the other `pic/` scenes; see `docs/ai-disclosure.md`). It is copied into the
  mini-game assets; the original is untouched.
- **Tomato sprites:** cut from the project greenhouse scene
  `src/assets/generated/scenes/09-greenhouse.webp` with rembg; the green sprite
  is a hue-shifted version of the same cutout.
- The background is not a NASA photograph; no external photo credit is needed.
  The game footer reads `Greenhouse art · Meowstronauts`.

The F1 science source remains
[NASA — Growing Plants in Space](https://science.nasa.gov/biological-physical/the-challenges-of-growing-plants-in-space/).
The mini-game uses the harvest itself and adds no new NASA claim (in particular,
it does not assert a pollination method).

## Tests

```bash
npx vitest run src/minigames/tomato src/ui/EventCardView.test.tsx
```

Covered: green tomatoes do not count, six ripe tomatoes show the result,
Continue returns `true`, skip returns `false`, F1 shows its choices first, only
the harvest choice opens the game, the seed choice resolves directly, and video
mode keeps the instant path.

## Accessibility and small screens

- Every tomato is a real button with an aria-label; ripe and green are
  distinguished by color, glow, and label.
- The result is a dialog with a single Continue action.
- `prefers-reduced-motion` removes the bob/shake animations.
- The 16:9 stage scales to the available viewport; 844×390 landscape was
  checked, with 44 px minimum tomato targets.
