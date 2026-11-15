# 小遊戲設計規格：知識卡配對、塵捲風閃避

> 2026-11-15 撰寫，供其他電腦直接照做。
> 兩個都是**可選練習**，不進 7 sol 主線、不改牌庫與平衡表、不給資源。
> 第三個練習「訊號延遲」由 A 機（mars-fd）實作，入口是 Sol 6 艦長日誌，不在本文件範圍。
> 目前練習入口：Sol 1 低重力跳躍、Sol 4 避難艙演練、Sol 5 水與燃料工廠、Sol 7 太空食物翻卡；
> **Sol 2、Sol 3、Sol 6 還是空的**，本文件的塵捲風閃避放 Sol 2，訊號延遲放 Sol 6，知識卡配對放標題畫面。

## 0. 共同規則（兩個遊戲都適用）

- **單一難度**：不讀 `state.difficulty`、不隨 sol 或資源調整速度／數量。使用者已明確要求小遊戲不跟主線難度連動。
- **不給資源**：完成後不 dispatch 任何資源或收藏動作；沒有 `rewarded` prop。純練習，像太空食物翻卡。
- **不動主線**：不加事件、不改 `events.ts`／`deck.ts`／`balance.ts`／`docs/balance-sheet.csv`／`src/data/glossary.json`；不新增知識卡（背包維持 20 張）。
- **不加圖檔**：只用 CSS、emoji、inline SVG；不要新增 `src/assets/**`，不要碰 `docs/licenses.md`。
- **雙語**：英文預設、繁中齊備；所有文案寫在遊戲自己的 `game/i18n.ts`（照 `src/minigames/food/game/i18n.ts` 的 `foodT` 模式），入口按鈕的字加在 `src/i18n/index.ts`。
- **`?video=` 一律沒有入口**：由 `App.tsx` 傳 `undefined` 的 prop 控制，新遊戲自己不用判斷。
- **無障礙**：全部互動是 `<button>`；`role="dialog"`、`aria-modal="true"`、`Escape` 關閉、關閉鈕有 `aria-label`；狀態用 `aria-live="polite"`，不要每個動畫格都公告；`prefers-reduced-motion` 關閉旋轉／震動／視差。
- **短螢幕 568×320**：可捲動、無水平滾動、按鈕 ≥44px；用 Chrome device toolbar 實測。
- **測試**：每個遊戲至少 `game/state.test.ts`（純邏輯）、`game/i18n.test.ts`（雙語與禁用詞）、元件 smoke test；`npm run lint`、`npm test`、`npm run build` 全綠才 commit。
- **共用檔先 LOCK**：動 `App.tsx`、`BriefingScreen.tsx`、`i18n/index.ts`、`styles.css` 前先在群組宣告，A 機目前在用；一次只讓一台改。
- **Commit**：`feat: add the knowledge card match practice [visual]`、`feat: add the dust devil dodge practice [visual]`，文件另開 `docs:`；一次 commit 一件事。
- **不要碰**：`tests/e2e/**`（既有 spec，另有 owner）、`package.json`／lock、`tools/video/**`、`.dev.vars`、其他 session 的未提交檔。

---

## 1. 知識卡配對（Knowledge Card Match）

### 1.1 目的

讓 7–12 歲玩家用**已經在背包裡的 20 張知識卡**複習術語與一句話定義。重點是「看懂並配對」，不是記憶翻牌，所以**牌面正面朝上**，不要做成太空食物翻卡的隱藏翻牌版。

### 1.2 入口

- **標題畫面**：`TitleScreen` 的「開始遊戲」下方加一顆 ghost button：
  - testid：`match-practice`
  - 文案：`Knowledge card match`／`知識卡配對`
  - 點擊呼叫新 prop `onMatchPractice?: () => void`；`?video=` 時不傳，按鈕不出現。
- 不在 Sol 列加入口（那一排已經 4 個練習鈕，568×320 會換行）。

### 1.3 流程

`intro → playing（3 回合）→ result`。

| 回合 | 主題 | 配對數 |
|---|---|---:|
| 1 | 太空天氣 Space weather | 5 |
| 2 | 火星環境 Mars environment | 5 |
| 3 | 基地系統 Outpost systems | 5 |

- 每次新遊戲從 20 個術語中**每回合抽 5 個**（同回合不重複），三回合共 15 個；重玩會抽到不同的組合。
- 回合內術語卡與定義卡各自洗牌，交錯排在 10 格盤面上。
- 點一張卡 → 選取（外框高亮）；再點另一張：
  - 一術語＋一定義且 `id` 相同 → 配對成功，兩張卡鎖定、變綠、顯示 ✓，計數 +1。
  - 其他情況 → 兩張卡短暫變紅（250ms）後取消選取，`wrong` +1；**不扣分、不失敗、可無限重試**。
  - 同類型兩張（術語＋術語或定義＋定義）→ 直接提示「一張術語、一張解釋」，不算 wrong。
- 5 對都配完 → 0.8 秒後自動進下一回合；第 3 回合完成 → 結果畫面。
- 中途可按右上角 ✕／`Escape` 離開，不記錄任何東西。

### 1.4 資料

- 來源：`src/data/glossary.json` 的 20 張卡，用 `term[lang]`（術語）與 `short[lang]`（一句話定義）。
- 分組（寫死在 `game/state.ts`，只列 id）：

```ts
太空天氣：solarStorm, solarFlare, cme, radiation, geomagneticStorm, solarWind
火星環境：atmosphere, subsurfaceIce, dustStorm, dustDevil, micrometeorite, gravity, pressure, sol
基地系統：waterRecycling, oxygenRecovery, greenhouse, solarPower, radiationShielding, commsDelay
```

- 每回合從該組抽 5 個；若該組不足 5 個（未來刪卡）就從其他組補，總數固定 5。
- 只讀 `glossary.json`，**不得改寫定義、不得新增數字或 NASA 事實**。

### 1.5 介面

- Overlay：`.match-overlay` 全螢幕，背景 `--navy` 半透明，內容卡 `--paper`；沿用食物翻卡的視覺語言。
- 標題列：eyebrow「Knowledge review／知識複習」、標題「Knowledge card match／知識卡配對」、HUD「回合 1/3」「配對 3/5」、右上 ✕。
- 盤面：10 張卡，寬螢幕 5 欄 × 2 列；≤680px 改成 2 欄 × 5 列可捲動。
  - 術語卡：小標籤「術語」＋術語粗體（例：通訊延遲）。
  - 定義卡：小標籤「解釋」＋`short` 一句話。
  - 已配對：綠色邊框、✓、降低飽和度；`aria-disabled="true"`。
- 回合切換：短暫顯示「第 2 回合：火星環境」即可，不另開畫面。
- 結果畫面：
  - 標題「15 張卡都配對了！／All 15 cards matched!」
  - 顯示三回合主題與失誤次數（只是紀錄，不是分數壓力）。
  - 一句「每一張卡都在背包裡，附 NASA 來源。」（不新增事實）
  - 按鈕：再玩一次（`match-replay`）、返回（`match-exit`）。

### 1.6 文案（`game/i18n.ts`）

| key | EN | zh-TW |
|---|---|---|
| eyebrow | `Knowledge review` | `知識複習` |
| title | `Knowledge card match` | `知識卡配對` |
| introKicker | `From your backpack` | `從背包出發` |
| introBody | `Match each term with its one-line meaning. The cards stay face up — read them, then tap a pair.` | `把術語和它的一句話解釋配在一起。卡片都正面朝上，先讀，再點一對。` |
| introRule | `A wrong pair just clears. You can try again.` | `配錯只會取消選取，可以再試。` |
| start | `Start matching` | `開始配對` |
| back / close | `Back` / `Close` | `返回` / `關閉` |
| roundLabel | `Round {round}/{total}` | `第 {round}/{total} 回合` |
| pairsLabel | `Pairs {done}/{total}` | `配對 {done}/{total}` |
| termTag | `Term` | `術語` |
| meaningTag | `Meaning` | `解釋` |
| sameKind | `Pick one term and one meaning.` | `請各選一張術語和一張解釋。` |
| matched | `Matched!` | `配對成功！` |
| roundClear | `Round {round} clear!` | `第 {round} 回合完成！` |
| resultTitle | `All 15 cards matched!` | `15 張卡都配對了！` |
| resultBody | `Every card lives in your backpack with its NASA source.` | `每一張卡都在背包裡，附 NASA 來源。` |
| resultWrong | `Wrong pairs: {count}` | `配錯次數：{count}` |
| themeSpace | `Space weather` | `太空天氣` |
| themeMars | `Mars environment` | `火星環境` |
| themeBase | `Outpost systems` | `基地系統` |
| replay | `Play again` | `再玩一次` |

- 禁用詞：`strong geomagnetic storm`、`toxic`、`Starship`、`SpaceX`，以及任何百分位排名。
- 術語與定義直接來自 `glossary.json`，不要在 i18n 檔重抄一份。

### 1.7 檔案

```text
src/minigames/match/KnowledgeMatch.tsx
src/minigames/match/game/state.ts        # 分組、抽卡、洗牌、配對判定
src/minigames/match/game/i18n.ts
src/minigames/match/styles.css           # .match-* 前綴
src/minigames/match/game/state.test.ts
src/minigames/match/game/i18n.test.ts
src/minigames/match/KnowledgeMatch.test.tsx
```

修改（先 LOCK）：`src/App.tsx`、`src/ui/TitleScreen.tsx`、`src/i18n/index.ts`、`src/styles.css`（若入口按鈕需要新 class；可直接重用 `.ghost-button`）。

### 1.8 測試

- state：20 個 id 都有分組；每回合 5 對且不重複；三回合共 15 個不同術語；配對判定（正確／同類／不同 id）；`wrong` 只在真正配錯時增加；重玩重抽。
- i18n：EN／zh-TW 每個 key 非空；沒有禁用詞；`{round}`／`{count}` 代換。
- component：intro 顯示；開始後看到 10 張卡與回合 HUD；用 testid 點完 5 對 → 進第 2 回合；三回合後結果顯示 15 與失誤數；再玩一次回到第 1 回合；✕／Escape 呼叫 `onExit`；按鈕都有可讀名稱。
- `TitleScreen`：傳 `onMatchPractice` 時按鈕存在且可點；不傳時不存在。

### 1.9 驗收

- 1280×800 與 568×320 都可完整配完三回合；568×320 無水平滾動、可捲動。
- 中英切換正常；`prefers-reduced-motion` 下沒有多餘動畫。
- `?video=` 模式標題畫面沒有按鈕。
- 不影響任何既有測試；`npm run lint`／`test`／`build` 綠。

---

## 2. 塵捲風閃避（Dust Devil Dodge）

### 2.1 目的

用 Sol 2 的日誌主題（塵捲風不是沙塵暴）做一個 30–60 秒的動作練習：開探測車在平原上躲塵捲風、收集 8 個感測讀數。**沒有失敗**：撞到只會慢下來，讀數不會掉，遊戲也不會結束。

### 2.2 入口

- **Sol 2 艦長日誌**：`BriefingScreen` 的練習按鈕區（和 Sol 1／4／5／7 同一排位置）。
  - testid：`dodge-practice`
  - 文案：`Try the dust devil dodge`／`試試塵捲風閃避`
  - 圖示：`🌪️`
  - 新 prop `onDodgePractice?: () => void`；只顯示在 `state.sol === 2`；`?video=` 不傳。
- 不在 Sol 列加入口。

### 2.3 流程與規則

`intro → playing → result`，單一難度、無關卡。

- 開場：說明「塵捲風是小型的旋風，不是大範圍沙塵暴。開車穿過平原，收集 8 個感測讀數，避開塵捲風。」
- 場地：俯視平原（純 CSS 漸層＋幾顆石頭），探測車固定在畫面下方左右移動。
- 操作：
  - 鍵盤：`←`／`→` 或 `A`／`D`，按住持續移動。
  - 觸控：畫面下方兩顆大按鈕「◀」「▶」（≥56px），按住移動。
- 目標：收集 **8 個讀數**（📡 小圓點），碰到即收集，HUD 顯示 `3/8`。
- 塵捲風：同時最多 3 個，從上方往下移動並左右搖擺；撞到探測車時：
  - 畫面輕微震動 200ms（reduced-motion 時改為閃一下外框）、
  - 探測車速度降為一半 **1.5 秒**，
  - `bumps` +1，**不扣讀數、不結束**。
- 收集完 8 個 → 立即進結果（不需要倒數計時）。
- 沒有時間限制；玩家想離開隨時按 ✕／`Escape`。
- 讀數與塵捲風都不會傷害角色；沒有火焰、受傷或恐怖表現。

### 2.4 資料與事實

- 只用 glossary 的 `dustDevil`（塵捲風：小型的旋風）與 `dustStorm`（沙塵暴：大範圍、可持續數週）兩張卡。
- 結果畫面顯示這兩張卡的 `short` 與 `why`，並列來源（`glossary.json` 的 `sources`）。
- **不可新增**：風速、直徑、高度、持續時間等數字；不寫「火星沙塵暴會遮蔽太陽數週」以外的推測。
- 火星天氣只寫「很冷」，不寫百分位。

### 2.5 介面

- Overlay `.dodge-overlay` 全螢幕；標題列：eyebrow「Mars driving practice／火星駕駛練習」、標題「Dust devil dodge／塵捲風閃避」、HUD「讀數 3/8」「碰撞 1」、右上 ✕。
- 場地高度自適應：短螢幕（高度 < 520px）壓縮標題列，操作鈕固定在底部 64px。
- 探測車：inline SVG 六輪小車（沿用 `11-cold-patrol` 的造型語彙即可，不必畫新圖）。
- 塵捲風：CSS 錐形漸層＋`🌪️`，旋轉動畫；`prefers-reduced-motion` 時停止旋轉只保留位移。
- 讀數：小圓點＋`📡`，脈動光圈（reduced-motion 時靜態）。
- 結果：讀數 8/8、碰撞次數、兩張知識卡的一句話＋來源；按鈕「再玩一次」「返回」。

### 2.6 文案（`game/i18n.ts`）

| key | EN | zh-TW |
|---|---|---|
| eyebrow | `Mars driving practice` | `火星駕駛練習` |
| title | `Dust devil dodge` | `塵捲風閃避` |
| introKicker | `Small whirlwinds` | `小型的旋風` |
| introBody | `Dust devils are small whirlwinds, not the huge dust storms that can cover the whole planet. Drive across the plain and collect 8 sensor readings.` | `塵捲風是小型的旋風，不是會蓋住整顆星球的大沙塵暴。開車穿過平原，收集 8 個感測讀數。` |
| introRule | `A bump slows the rover for a moment. Nothing is lost.` | `撞到只會讓探測車慢一下，不會失去任何東西。` |
| start | `Start driving` | `開始駕駛` |
| back / close | `Back` / `Close` | `返回` / `關閉` |
| readingsLabel | `Readings` | `讀數` |
| bumpsLabel | `Bumps` | `碰撞` |
| moveLeft | `Move left` | `向左移動` |
| moveRight | `Move right` | `向右移動` |
| collected | `Reading collected` | `收集到讀數` |
| bump | `Dust devil! Slowing down.` | `遇到塵捲風！速度變慢。` |
| resultTitle | `All 8 readings collected!` | `8 個讀數都收集到了！` |
| resultBody | `Dust devils are small whirlwinds. They are not the same as a large dust storm.` | `塵捲風是小型的旋風，和大範圍的沙塵暴不一樣。` |
| resultBumps | `Bumps: {count}` | `碰撞次數：{count}` |
| replay | `Drive again` | `再玩一次` |
| source | `Source` | `資料來源` |

- 禁用詞同上；不要寫任何溫度以外的火星天氣數字。

### 2.7 技術建議

- 用 `requestAnimationFrame` 或 `setInterval(16)` 更新位置；實體座標存在 `useRef`，每幀用 `transform` 更新 DOM，避免每幀 React re-render。
- 純邏輯抽到 `game/state.ts`：`createRun()`、`tick(state, dt, input)`、`collect`、`collide`、`spawn`；元件只負責畫。
- 碰撞用圓形距離判定（半徑：探測車 24px、塵捲風 26px、讀數 18px 的設計座標，再依場地寬高縮放）。
- 生成規則：場上最多 3 個塵捲風、3 個讀數；讀數被收集後 0.6 秒再生成下一個，直到 8 個都收集完。
- 暫停：`P` 或視窗失焦時暫停，回來後 resume（可選但建議）。
- 不引入任何套件。

### 2.8 檔案

```text
src/minigames/dustdodge/DustDevilDodge.tsx
src/minigames/dustdodge/game/state.ts
src/minigames/dustdodge/game/i18n.ts
src/minigames/dustdodge/styles.css      # .dodge-* 前綴
src/minigames/dustdodge/game/state.test.ts
src/minigames/dustdodge/game/i18n.test.ts
src/minigames/dustdodge/DustDevilDodge.test.tsx
```

修改（先 LOCK）：`src/App.tsx`、`src/ui/BriefingScreen.tsx`、`src/i18n/index.ts`、`src/styles.css`（入口按鈕 class 併入既有練習鈕樣式）。

### 2.9 測試

- state：初始 0 讀數；tick 後探測車依輸入移動且不超出邊界；收集讀數計數 +1 且不再生成同一個；碰撞只增 `bumps` 並設 1.5 秒減速、不扣讀數；收滿 8 個 `isComplete`；關閉／重玩重置。
- i18n：雙語非空、禁用詞、`{count}` 代換。
- component：intro 顯示；開始後場地與 HUD 出現；用假計時器模擬 tick，收滿 8 個進結果；結果有兩張知識卡與來源；再玩一次重置；✕／`Escape` 呼叫 `onExit`；左右按鈕有 `aria-label`。
- `BriefingScreen`：Sol 2 顯示 `dodge-practice` 並回呼；其他 sol 不顯示；沒有 prop 時不顯示。

### 2.10 驗收

- 1280×800：可只用鍵盤完成一局。
- 568×320：左右按鈕不遮住 HUD、場地可玩、無水平滾動；`prefers-reduced-motion` 下可玩。
- `?video=` 沒有入口；不影響任何既有測試與平衡。
- `npm run lint`／`test`／`build` 綠。

---

## 3. 交接清單

1. 開工前 `git pull --rebase origin main`，確認 A 機（mars-fd）已釋放共用檔 LOCK。
2. 兩個遊戲可以分開認領；**不要同時改同一份共用檔**。
3. 完成後在群組回報：commit SHA、入口 testid、實測尺寸、截圖路徑（放 `C:\tmp`，不進 repo）。
4. 文件更新：`docs/qa-checklist.md` 加對應入口與 568×320 檢查；`docs/content-inventory.md` 由 B 機（mars-b1）維護，先跟他們說。
5. 不 push 未經使用者確認；`main` 每次 push 會自動部署。
