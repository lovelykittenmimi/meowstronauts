# Submission 文案（官方 project page 欄位對照）

> 最後更新：2026-11-13（依官方欄位重排）
> **英文是送出語言**；`【 】` 是 11/15 前要補的實測數據，不要提前填。
> 11/14 只做乾跑檢查，**不按 final submit**；送出由 A 在 11/15 確認 repo 已 public、demo／影片可開之後執行。
>
> 官方欄位順序：Project Title → High-Level Summary → Project "Demo" → Final Project → Project Details → Use of Artificial Intelligence → Space Agency Data → Hackathon Journey → References → Tags。

---

## 1. Project Title

```
Meowstronauts: Mars Outpost
```

中文副名（頁面有第二標題欄位時才放）：`喵航員：火星基地`

## 2. High-Level Summary

> 官方要求：簡潔、言之有物、切合作品重點。控制在 200 字元內，不要用「educational game」開頭。

```
Three cat astronauts. Seven sols. One Mars outpost. A 10-minute browser game where kids 7–12 keep a base alive by making real trade-offs with NASA data.
```

字元數約 150（含空格）。備用更短版：

```
A 10-minute Mars base game where kids keep three cat astronauts alive for seven sols.
```

## 3. Project "Demo"

> 官方要求：30 秒影片**或**至多 7 張投影片，上傳外部雲端後貼連結。
> 我們用 30 秒影片（`docs/video-script.md`）；11/14 21:00 build freeze 後由 C 錄製，只錄部署版。

```
【Demo link — 30-second video, YouTube (public or unlisted), added 14 Nov after the 21:00 build freeze】
```

備援（影片來不及時）：7 張投影片放 Google Slides／OneDrive，內容順序＝問題 → 遊戲畫面 → 取捨 → 資料 → 成果。

- 影片 ≤ 30 秒（含結尾停留），不加速。
- 畫面只出現遊戲與部署網址，**不出現小孩、姓名、學校**。
- 連結用手機與無痕視窗各開一次。

## 4. Final Project

> 官方要求：完整作品上傳外部雲端，貼連結。對瀏覽器遊戲而言就是 live demo；原始碼另放 Project Details。

```
Live game: https://mars.flymymind.com
Source code: https://github.com/lovelykittenmimi/meowstronauts
```

- Live demo 自 11/14 上線；`main` 每次 push 由 Cloudflare Workers Builds 自動建置部署（測試紅不部署）。11/15 再確認 HTTPS、無 console error。
- GitHub repo **11/15 才轉 public**；轉完用無痕視窗開得到，再貼。

## 5. Project Details

> 官方要求：功能、運作方式、優點、目的、工具／程式語言／硬體／軟體、程式原碼。

```
What it does

Meowstronauts: Mars Outpost is a browser game for children ages 7–12. Three cat astronauts crash-land beside a fictional Mars outpost and must keep it — and themselves — alive for seven sols, until a supply ship arrives.

Each sol, the player reads one event card and chooses one of three actions. Every action helps one system and costs another: clearing dust off the solar panels restores power but exposes the crew to radiation; switching to the backup battery saves the night but drains life support. Resources drain every sol, and a resource that hits zero hurts the crew's health. After seven sols, the mission report shows a star rating, the resource curve, and what the cats thought of your command.

How it works

Real NASA data drives the situation, not just the decoration: the opening solar event is the 14 May 2025 X2.7 flare from NASA's DONKI archive, and the cold week is measured by Curiosity's REMS weather station. Terms in the text are tappable: a short definition opens in a side panel and can be saved to a backpack, so curious kids can go deeper without slowing the game down. Nothing is forced — the game is fully playable without opening a single knowledge card.

The game is a static React build served by Cloudflare Workers. The NASA API key stays in a Cloudflare secret — it never reaches the browser or the repository — and snapshots are refreshed by a local script before the event. All mission data is committed as offline JSON, so the demo still works if the venue Wi-Fi does not. There are no accounts, no uploads, and no runtime AI.

Why it matters

Mission teams divide scarce electricity among crew systems, communications and research, and balance radiation risk against mission goals. Most youth-facing space content either simplifies those trade-offs away or assumes too much technical knowledge. The rules here carry the lesson: every choice shows its cost on the button, and the player learns a real deep-space constraint by feeling it.

Tools, languages and hardware

- React + TypeScript + Vite, static build; CSS (no UI framework)
- Cloudflare Workers static assets (Wrangler), deployed from GitHub by Workers Builds
- Case: NASA DONKI and Curiosity REMS snapshots committed as JSON; NASA Image Library photographs with IDs and credits
- Icons: Lucide (ISC). Fonts: Noto Sans TC, Nunito (SIL OFL 1.1)
- Tests: 59 Vitest unit tests run in GitHub Actions on every push; Playwright end-to-end runs locally at the event 【confirm final counts on 11/15】
- Landscape-first layout, 48px touch targets, verified at 568×320, 844×390, 1024×768 and 1440×900
- No special hardware: any modern browser on a phone, tablet or laptop

Source code

https://github.com/lovelykittenmimi/meowstronauts
```

> 11/15 補上實際 Lighthouse 分數與首次載入秒數，例如「first load 【2.1】s on 4G」。沒有量測就不要寫。

## 6. Use of Artificial Intelligence

> 官方要求：說明是否／如何使用 AI。直接對應 `docs/ai-disclosure.md`；送出前把版本號填好。

```
We used AI assistants for research summarization, documentation, code scaffolding, and image generation. All NASA facts were checked against NASA pages, all game design decisions and final assets were made by the team, and no AI runs inside the game at runtime.

Tools:
- Claude Code (Anthropic), version 【__________】 — research summaries, documentation, data snapshot scripts, code scaffolding, test drafts, first-pass copy. Every output was read, edited or rejected by the team.
- Google Gemini + Nano Banana, model 【__________】 — character and scene art, OG card assets. Human selection, cropping, background removal and re-generation.
- AI-assisted translation — Chinese/English copy pairing. English is the default language; the team proofread every line.

Facts and images:
- NASA facts come only from NASA domains (science.nasa.gov, nasa.gov, techport.nasa.gov); the source list is in References.
- Data values come directly from DONKI and REMS API responses and were not rewritten by AI.
- Mars photographs are NASA/JPL-Caltech public imagery, labelled separately from AI-generated art; each keeps its NASA ID and credit.
- No NASA logo, mission badge, readable text or watermark appears in generated images.

Runtime:
- The game does not call any LLM or generative API at runtime.
- All text, knowledge cards and event cards are static at build time; NASA data is a pre-event snapshot labelled "snapshot, not live".
- No user accounts, no uploads, no child data sent to any server.

Full disclosure: docs/ai-disclosure.md in the repository.
```

## 7. Space Agency Data

> 官方要求：哪個／些數據、如何使用、如何被啟發。

```
NASA DONKI — space weather records for 13–17 May 2025
- Used for: the opening solar event and the fixed Sol 4 flare-alert card.
- The archive shows an X2.7 flare on 14 May 2025 (plus X1.2, M5.3 and M7.7 in the same window), and a geomagnetic response peaking at Kp 6.33 — below the Kp 7 threshold.
- How it inspired the design: a real flare sequence immediately before a real cold week gave us one coherent training scenario — crash during a flare, then survive the cold.
- Wording rule: the game may say "strong solar flare"; it does not say "strong geomagnetic storm". Kp is an Earth index and Mars has no global magnetic field, so the game presents it as a simplified proxy and says so in the data panel.
- Source: https://ccmc.gsfc.nasa.gov/tools/DONKI/ (records retrieved via api.nasa.gov/DONKI)

Curiosity REMS weather station (MSL) — 8–22 May 2025
- Used for: daily temperature and pressure, and the cold week of 15–22 May that drives heating power costs.
- The feed has no usable wind-speed column, so the game does not invent wind.
- Source: https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json

NASA Image Library — seven Mars surface photographs
- Used for: the patrol report screen and the data panel.
- IDs: PIA24487, PIA24542, PIA26344, PIA24173, PIA26632, PIA24264, PIA25077.
- PIA25077 ("Curiosity Finds a Martian Flower") is a rock cemented by water-carried minerals, not a plant or fossil; the caption says so.
- Source: https://images.nasa.gov/

NASA APOD still — 30-second video only, not in the game
- An SDO solar flare still (NASA/SDO, APOD 2017-09-14) is the only NASA still in the demo opening. It is followed by the game's own crash animation, which is AI-generated and disclosed in `docs/ai-disclosure.md`.
- The SDO image is illustrative B-roll. The game's X2.7 claim comes only from the DONKI data panel, never from this still.
- The crash shot is the game's opening animation, not NASA footage.

NASA Science and NASA learning pages — knowledge cards
- Used for: the 20 knowledge-card definitions, each linked to its source page. The `gravity` card also explains how weightlessness affects the body (fluid shift and bone loss).
- Pages are listed in References (S1–S22; S8 is reserved and unused).
- Every card shows its source; nothing is presented as live data.

Snapshots
- Collected on 11 November 2026 and committed as JSON.
- The interface labels them "snapshot, not live"; the demo works without network access.

Explored but not used in the game
- NASA OSDR and Mars Trek were reviewed during the event. The OSDR studies we found on lunar-regolith plant growth had no published results in the repository metadata, so we did not turn them into claims. We also reviewed OSDR's human-health records; most are animal, cell, or ground-analog studies, and several list results as pending, so the game says "NASA is studying" rather than presenting findings. Mars Trek was not needed for a card-based game; the demo opening uses the SDO still and the game's own crash animation instead.
```

> 「Explored but not used」這段落是加分項：顯示我們看過官方 resources、也守住了「結果未公布就不寫」的紅線。若評審沒問，也不會扣分。

## 8. Hackathon Journey

> 官方要求：參賽經驗、學到什麼、動機、策略、如何解決困難、感謝的人與原因。
> **這段 11/15 才能寫死**；現在只放骨架與已發生的事實，`【 】` 留給 11/14–15 的實際經歷。

```
Why this challenge

【1–2 sentences: why the Junior Astronaut Mission Trainer, and why a game rather than a dashboard. Use the team's own reason, not a generic statement.】

Our strategy

We started from the constraint, not the art. The first decisions were landscape-only layout, three always-visible choices, and a knowledge panel that never blocks the event card. We tuned a 24-card design library with simulated runs, then shipped the 12 cards that carry the story and the survival curve.

The hardest part was honesty. NASA's data is easy to overstate: a flare is not a geomagnetic storm, Kp is an Earth index, and Mars has no global magnetic field. We built a small data layer that stores what the archive actually says — the 14 May 2025 flare is X2.7, and the geomagnetic response peaked at Kp 6.33, below the Kp 7 threshold — and the game only uses the stronger claim when the number supports it.

Obstacles and how we handled them

- Data honesty vs. drama: 【what we cut or reworded when the data did not support the stronger claim】
- Scope: a seven-sol run has to fit in ten minutes for a child, so every card had to earn its place. We cut cards that were interesting to adults but did not change a decision.
- Build freeze: the demo was frozen at 21:00 on 14 November so the video and the playtest used the same build.
- 【one more real obstacle from 14–15 November】

What we learned

DRAFT — replace with the actual playtest observation on 15 November:
A first-time player did not need the simulation simplified — they needed the cost made visible. In early layouts, the player picked the option with the friendliest cat. Once each button showed its trade-off (power −20, shield +25), the same player started weighing which cost they could afford.

Playtest: one child, age 12 (team member's child), 20 minutes, parent present. 【N】 issues found; 【N】 fixed before submission.

Thanks

【Thanks to the teammates, the local event organizers, the NASA Space Apps team, and the families who tested the build. Say why, briefly.】
```

> 沒有發生的不要寫；playtest 只有 1 位、且是團隊成員的小孩，就照實寫，不要寫成「tested with 20 kids」。

## 9. References

> 官方要求：表列所有使用到的數據、工具、資源（開源程式碼、文字、影像、授權資源）。

**NASA data**

| 資源 | 連結 | 用途 |
|---|---|---|
| NASA DONKI | https://ccmc.gsfc.nasa.gov/tools/DONKI/ | 2025-05-13～17 CME／FLR／GST 快照 |
| Curiosity REMS weather (MSL) | https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json | 2025-05-08～22 氣溫／氣壓快照 |
| NASA Image Library | https://images.nasa.gov/ | 7 張火星照片（PIA24487、PIA24542、PIA26344、PIA24173、PIA26632、PIA24264、PIA25077） |
| NASA APOD — SDO solar flare | https://science.nasa.gov/image-article/apod-2017-september-14-flare-well-ar2673/ | 影片開場閃焰示意（NASA/SDO；非 2025-05-14 事件） |

**NASA pages used for knowledge cards**

| # | 頁面 | 連結 |
|---|---|---|
| S1 | Space Weather — NASA Science | https://science.nasa.gov/heliophysics/focus-areas/space-weather/ |
| S2 | Solar Storms and Flares — NASA Science | https://science.nasa.gov/sun/solar-storms-and-flares/ |
| S3 | Real Martians: How to Protect Astronauts from Space Radiation on Mars | https://science.nasa.gov/resource/real-martians-how-to-protect-astronauts-from-space-radiation-on-mars/ |
| S4 | Mars Facts — NASA Science | https://science.nasa.gov/mars/facts/ |
| S5 | What Is Mars? (Grades 5–8) — NASA | https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-mars-grades-5-8/ |
| S6 | Terraforming the Martian Atmosphere — NASA Science | https://science.nasa.gov/resource/terraforming-the-martian-atmosphere/ |
| S7 | Mars Odyssey Science Highlights — NASA Science | https://science.nasa.gov/mission/odyssey/science-highlights/ |
| S9 | NASA's MOXIE Completes Mars Mission — NASA | https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/ |
| S10 | Brine Processor Assembly — NASA TechPort | https://techport.nasa.gov/projects/184899 |
| S11 | Growing Plants in Space — NASA Science | https://science.nasa.gov/biological-physical/the-challenges-of-growing-plants-in-space/ |
| S12 | Mars Exploration Rovers: Spirit and Opportunity — NASA Science | https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/ |
| S13 | Mars Relay Network — NASA Science | https://science.nasa.gov/mars/mars-relay-network/ |
| S14 | Impact Protection — NASA | https://www.nasa.gov/impact-protection-2/ |
| S15 | Dust Devils on Mars — NASA Science | https://science.nasa.gov/resource/dust-devils-on-mars/ |
| S16 | Earth's Atmosphere — NASA Space Place | https://spaceplace.nasa.gov/atmosphere/en/ |
| S17 | Neither Perpendicular nor Parallel — NASA | https://www.nasa.gov/image-article/neither-perpendicular-nor-parallel/ |
| S18 | What Is Gravity? — NASA Space Place | https://spaceplace.nasa.gov/what-is-gravity/en/ |
| S19 | What's in the Atmosphere? — NASA Space Place | https://spaceplace.nasa.gov/whats-in-the-atmosphere/ |
| S20 | Risk of Spaceflight-Induced Bone Changes — NASA | https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/ |
| S21 | Reduced Gravity Q&A — NASA GRC K-12 | https://www.grc.nasa.gov/WWW/K-12/RG_html/documents/AnswerPreCA.htm |
| S22 | Muscle and Exercise Studies to Maintain Crew Health in Space — NASA | https://www.nasa.gov/blogs/spacestation/2025/07/16/muscle-and-exercise-studies-to-maintain-crew-health-in-space/ |

**Software and assets**

| 項目 | 授權 | 用途 |
|---|---|---|
| React、Vite、Vitest | MIT | UI、建置、單元測試 |
| TypeScript | Apache-2.0 | 型別 |
| Playwright | Apache-2.0 | E2E 測試 |
| Cloudflare Workers／Wrangler | Apache-2.0／MIT | 靜態託管與 `/api` proxy |
| Lucide | ISC | UI 圖示 |
| Noto Sans TC、Nunito | SIL OFL 1.1 | 字體 |
| Pillow | HPND | OG 卡與品牌合成 |
| rembg（U2-Net） | MIT（模型權重依來源） | 品牌圖去背 |
| FFmpeg | LGPL／GPL（依建置） | 影片組裝 |
| Microsoft Edge TTS | Microsoft 服務條款 | 影片旁白草稿（送出前確認條款） |
| Pixabay music — “Space”（PaulYudin） | Pixabay Content License | 30 秒 demo 背景音樂（非遊戲內；Content ID Registered） |

**Images and AI**

- 火星照片：NASA/JPL-Caltech（逐張 credit 見 `src/data/mars-photos/metadata.json`）。
- 角色與場景圖：AI 生成，prompt 與產出紀錄見 `docs/image-prompts.md`、`brand/README.md`。
- AI 工具：Claude Code（Anthropic）、Google Gemini + Nano Banana；完整揭露見 `docs/ai-disclosure.md`。
- 本專案與 NASA 無隸屬或背書關係。

## 10. Tags (optional)

> 官方用標籤分類作品。建議這組，送出前再看頁面提供的選項：

```
#web #game #mars #education #kids #react #javascript
```

## 11. Project images（頁面若提供 gallery）

> 官方欄位表沒列，但 project page 通常可上傳 3–5 張圖。格式與說明沿用原稿。

| # | 畫面 | 說明（英文，≤ 90 字元） |
|---:|---|---|
| 1 | 事件卡＋三個選項（844×390） | Every choice shows its cost: power, shielding, food. |
| 2 | 知識卡 drawer 打開 | Terms open in a side panel; nothing interrupts the game. |
| 3 | 背包 8/20 | Collected cards live in a backpack kids can revisit. |
| 4 | 任務報告 | Seven sols end with a star rating and the resource curve. |
| 5 | 桌機版 1440×900 | The same build runs on a classroom projector. |

拍攝要求：真實遊戲畫面，不用合成圖；文字在 1280 寬下可讀；不要出現網址列或桌面。

> **拍攝時間：11/15 上午**（11/14 17:45 決定延後）。一律從 11/14 21:00 freeze build 拍，畫面才與送出的 build 一致。

## 12. 送出前檢查（11/15）

- [ ] **GitHub repo 已由 private 轉 public**（`lovelykittenmimi/meowstronauts`），用無痕視窗開得到。
- [ ] High-Level Summary ≤ 200 字元（含空格）。
- [ ] 每個 `【 】` 都已填入或刪除（AI 版本號、Demo 連結、playtest 數字、Lighthouse、Journey 段落）。
- [ ] 沒有任何未經證實的數字（遊玩人數、測試人數、效能）。
- [ ] 健康台詞只寫 NASA 已能支撐的部分（骨質 1–1.5%／月、體液上移）；OSDR 未公布結果沒有寫成結論；7 個 sol 沒有演成骨質快速流失。
- [ ] 「strong solar flare」有出現；沒有任何句子把「strong geomagnetic storm」當成事實陳述（負向說明可以）。
- [ ] 照片寫 **seven**（不是 six）；PIA25077 的 caption 寫「rock, not a plant」。
- [ ] DONKI 連結是 `ccmc.gsfc.nasa.gov/tools/DONKI/`（不是已連不上的 `kauai.ccmc...`）。
- [ ] Demo、GitHub、Live game 三個連結都用手機與無痕視窗開過一次。
- [ ] 影片長度 ≤ 30 秒（含結尾停留）；超過就砍字，不加速。
- [ ] 影片開場實照已 credit（`NASA/JPL-Caltech · Mars Trek`、`NASA/SDO`；若有火星全景再加 `NASA/USGS/Viking`），且沒有把 SDO 閃焰說成 2025-05-14 的 X2.7。
- [ ] AI 揭露連結指向 `docs/ai-disclosure.md`，且版本號已填。
- [ ] Playtest 誠實寫「1 child, age 12, team member's child」，不寫成外部隨機樣本。
- [ ] 團隊成員都已註冊並選擇 Taipei local event。
