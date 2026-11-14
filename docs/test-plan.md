# 測試計畫（2026-11-12 起草）

> **這是測試規格，不是測試程式。** `.test.ts`、Playwright spec、fixture 程式碼一律 11/14 09:00 後才寫。
> 關聯：`PLAN.md` §10.1、`docs/event-cards.md` §3–§4、`docs/video-path.md`、`docs/qa-checklist.md`、`docs/playtest.md`、`docs/pre-event/multi-machine-plan.md`。

## 0. 原則

1. **測行為，不測實作細節。** 測「資源不會變負數」，不測 reducer 的內部欄位名稱。
2. **P0 先做，不追求覆蓋率。** MVP 時間有限；寧可 20 個關鍵測試全綠，不要 80 個半壞。
3. **決定性。** 抽卡與 `?video=s1` 重放必須用固定 seed；測試不得打 NASA API、不得需要 `.dev.vars`。
4. **一個 bug 一個回歸測試。** 修 issue 時先寫會失敗的測試（可行時），再修到綠燈。
5. **測試程式也是比賽期間的產出。** 11/14 09:00 後的 commit 才算。

## 1. 層級、擁有者與時間

| 層級 | 工具 | 擁有者 | 目標時間 |
|---|---|---|---|
| 單元（邏輯） | Vitest | A 建 harness＋核心測試；B 補 regression | 12:00 前核心綠 |
| 整合（元件＋state） | Vitest＋Testing Library | A | 15:00 前 |
| E2E（真實瀏覽器） | Playwright | A 建 config；C 寫 `tests/e2e/**`；B 跑回歸 | 16:30 前影片路徑綠 |
| 手動 QA | 瀏覽器＋`docs/qa-checklist.md` | B／C | 持續 |
| Playtest | 真人 | B（小孩）＋家長 | 17:30 |
| 資料／文案 | Node 腳本或 Vitest | A | 12:00 前 |
| 夜間自動修復 | A 機 runner＋Claude headless | A（C 早上審影片） | 22:30–07:30 |

> B 的 `tests/regression/**` 權限在 A 建好 harness 之後才生效；在那之前 B 只開 issue。

## 2. 執行方式與檔案配置（11/14 才建立）

- 單元／整合：`src/**/*.test.ts`（與被測模組同層；A 寫）。
- E2E：`tests/e2e/*.spec.ts`（C 寫）；截圖與 trace 放 `output/`（gitignored）。
- 已知 bug 的 E2E：`tests/e2e/known/*.spec.ts`，標題加 `@known-bug`；`test:e2e` 用 `--grep-invert @known-bug` 排除，`test:e2e:known` 只跑這批。修好後由 runner 移除 `@known-bug` 標記（只改 tag，不改 assertion），一般 suite 下次就會納入。
- 回歸：`tests/regression/*.test.ts`（B 寫），檔名帶 issue 編號。
- 共用 helper：`tests/support/**`（A 建）；E2E 專用 helper 放 `tests/e2e/_helpers.ts`（C 管）。
- Config：`vitest.config.*`（include `src/**/*.test.ts`、`tests/regression/**/*.test.ts`）、`playwright.config.*`（testDir `tests/e2e`，baseURL 指向 local preview）。
- E2E 一律先 `npm run build`，再對 `npm run preview` 跑；不測 dev server，避免 hot reload 造成不穩。
- Fixture：`src/data/video-fixtures.json`（A 建）；測試讀 `src/data/*.json` 快照，不連網。
- npm scripts（A 在 scaffold 定義）：`test`、`test:e2e`、`test:e2e:known`、`lint`、`build`。
- 夜間 runner：`tests/e2e/overnight.mjs`（A 管；用 `node` 直接跑，不另加 npm script）。
- CI 每次 push 跑 `lint`＋`test`＋`build`；**E2E 只在 local 跑**，不進 CI（時間與穩定度）。

> **測試檔是規格。** 修 bug 的人不得改 `tests/**` 或 `*.test.ts` 來讓測試變綠；只有測試作者能改，且要在 issue 說明原本的期待為何錯。

### 2.1 給 A 的介面需求（測試的前提）

- 抽卡 RNG 接受 seed：`newDeck(seed)` 或 `?seed=`；`?video=s1` 與 E2E 都用固定 seed。
- `?debug=deck` 顯示當日候選池與被排除原因；一般模式與錄影畫面不得出現。
- `?video=s1`／`?video=report` 用正式 reducer 重放 fixture，不寫死 HUD。
- 所有互動元素有 `data-testid`（契約見 `docs/video-path.md`）；值放 `textContent`，不要畫在 canvas。

## 3. P0 單元測試（核心邏輯）

### 3.1 資源與結算

- [ ] 六個資源（power、lifeSupport、shield、food、health、science）永遠 clamp 在 0–100，不會負數。
- [ ] 每日消耗順序：消耗 → 歸零懲罰 → 事件卡 → 選項 → 風險 → 效果×duration → clamp（`docs/event-cards.md` §4）。
- [ ] 歸零懲罰只套一次：power 0 → health −20；lifeSupport 0 → −25；shield 0 → −15；food 0 → −10。
- [ ] `health ≤ 0` → 任務暫停，不再進下一個 sol。
- [ ] 選項效果套用 `duration`；`duration > 1` 時後續 sol 仍生效，到期後停止。
- [ ] 風險選項失敗時用 `risk.effects`，不是成功 effects 疊加。

### 3.2 牌庫與條件

- [ ] Sol 4 固定出 S1；其他 sol 不出 S1；一局只出一次。
- [ ] 12 張卡的 `when` 邊界：每張至少測「符合／不符合」各一個代表值。
- [ ] 資源良好時排除生存卡：`power ≥ 80` 不抽 P1；`lifeSupport ≥ 80` 不抽 L1／L2、`≥ 75` 不抽 L3；`shield ≥ 80` 不抽 S2；`food ≥ 5` 不抽 F1／F3。
- [ ] P4 只在 `cold_snap`／`severe_cold` 出現；晴天暖週不出。
- [ ] S3 只在 Sol 3–5、`flareForecast` 已開、`shield < 75` 出現。
- [ ] C1 只在 `commsWindow` 開啟後出現；SC2 只在 `science < 4` 出現。
- [ ] 候選不足 6 張：先放寬資源門檻 10；仍不足可重複合格卡，**不得**塞入不符合 `when` 的卡。
- [ ] 同一局不重複同一張卡（除非 §3.3 的候選不足規則）。

### 3.3 貓咪專長、分數、背包

- [ ] 每隻貓專長 2 次；用完不可再用；使用時機在選擇後、結算前。
- [ ] 專長效果只套一次，不因重繪重複。
- [ ] 1 星與 3 星路徑都能走到任務報告；星數與資源／科學門檻一致。
- [ ] 報告資源曲線 7 個點，最後一點等於報告上的資源值。
- [ ] 背包：收藏一次只加 1；`8 → 9`；重複收藏不增加。
- [ ] 新遊戲重置進度，**不重置**背包；重新整理後背包仍在（localStorage）。
- [ ] 20 個術語都有對應知識卡；沒有 `{{termId}}` 原始 token 漏出。

### 3.4 影片路徑（最高優先）

- [ ] `?video=s1` 用正式 reducer 重放後，HUD 必須是 **62／58／55／5／82／3**、背包 **8/20**。
- [ ] 點 `choice-shield-up` 後：**42／58／80／5／82／3**、背包 **9/20**。
- [ ] 同一個 URL 重載 10 次，數值與卡片完全相同（固定 seed，無 `Math.random()`）。
- [ ] `?video=report`：3 星、9/20、7 點曲線；曲線最後一點等於報告數字。
- [ ] `?video=s1` 不寫 localStorage；一般模式不被 fixture 覆蓋。

## 4. P0 整合測試（元件＋state）

- [ ] 事件卡顯示 3 個選項，每個都看得到代價；點一次後鎖住，不能連點。
- [ ] Sol 4 的 S1 卡：標題是「太陽閃焰警報／Solar Flare Warning」，不是「太陽風暴」。
- [ ] 點「加厚遮蔽」→ 結果面板顯示 `Power −20`、`Shield +25`；按繼續才進 Sol 5。
- [ ] F1 在 `food ≤ 4` 出現、`food ≥ 5` 不出現。
- [ ] 點術語 → 知識卡 drawer → ［收入背包］→ 按鈕變「已在背包 ✓」、背包數字 +1。
- [ ] 關閉 drawer 後焦點回到原本的術語；`Esc` 可關。
- [ ] 開場可跳過；跳過後直接進 Sol 1，HUD 完整；三個 tap 都會更新 HUD。
- [ ] 語言切換不重載、版面不破；英文預設。
- [ ] 任務報告的貓咪評論與結果一致（失敗不責備）。

## 5. P0 E2E（Playwright）

1. **完整一局**：首頁 → 開場（跳過）→ 選難度 → 7 sol → 任務報告；console 沒有 error；固定 seed。
2. **影片路徑**：`/?video=s1&lang=en` → HUD 62／58／55／5／82／3、S1 卡 → 點 `choice-shield-up` → 42／58／80／5／82／3 → 開背包 → 8→9；不重載。
3. **報告路徑**：`/?video=report&lang=en` → 3 星、9/20、7 點曲線；截圖給 submission。
4. **語言**：無痕視窗首次為英文；切繁中後重新整理仍為繁中。
5. **版面**：844×390 橫放與 1440×900 不破版、無水平捲動；直向顯示旋轉提示。

> 1–3 是 P0；4–5 若 16:30 前來不及，列 P1，但 11/15 14:00 前要補。

## 6. P1 測試（有時間才做）

- [ ] 全流程鍵盤操作；focus-visible 清楚；drawer 焦點鎖定。
- [ ] `prefers-reduced-motion` 關閉視差與進場動畫。
- [ ] 200% 縮放不重疊、不截字。
- [ ] 404 頁、OG 卡、favicon。
- [ ] Lighthouse ≥ 90（手動，C 跑）。

## 7. 資料與文案自動檢查

用 Vitest 或 `scripts/check-data.mjs` 讀 JSON／字串：

- [ ] `spaceweather.snapshot.json`：`cme.length = 20`、`flr.length = 4`、`gst.length = 1`；`meta.assessment.maxFlareClass = "X2.7"`、`maxKp = 6.33`、`strongFlare = true`、`strongStormConfirmed = true`、`strongGeomagneticStorm = false`。`strongStormConfirmed` 是因為 X2.7 閃焰，不是地磁風暴；UI 不得只憑這個欄位寫「strong geomagnetic storm」。
- [ ] `mars-weather.snapshot.json`：`sols.length = 14`；`meta.selection.core` 的 `sols = 7`、`avgMaxTempC = -29.7`、`avgMinTempC = -79.7`，`missingDates` 含 `2025-05-18`。
- [ ] `mars-photos/metadata.json`：7 筆；`PIA25077` 存在、credit `NASA/JPL-Caltech/MSSS`、bytes 350,608。
- [ ] `snapshots.manifest.json`：`counts.photos = 7`。
- [ ] UI 字串沒有 `strong geomagnetic storm`；沒有把 Kp 說成火星量測。
- [ ] 每張照片都有 NASA ID 與 credit；資料面板有 `snapshot, not live`。
- [ ] PIA25077 的 caption 寫「岩石」，不是植物或化石。

> 只掃 UI 文案與資料檔，不掃 `docs/` 的研究說明；研究文件可以討論「不可寫什麼」。

## 8. 手動測試（B／C）

- `docs/qa-checklist.md` 第 2–9 節：響應式、核心流程、知識卡、雙語、無障礙、資料誠實、效能。
- `docs/playtest.md` §6：11/14 17:30，一位 12 歲兒童，家長在場；不錄影錄音。
- B 回報格式與嚴重度見 `docs/pre-event/multi-machine-plan.md` §5。
- C 用無痕視窗截圖：1440×900、844×390；每次 UI 大改重截。

## 9. 修 bug 的定義（完成的條件）

1. 重現步驟寫進 issue。
2. 邏輯 bug：先加一個會失敗的測試（`tests/regression/issue-<n>.test.ts`）；純版面／文案 bug 用截圖前後對照。
3. 修到測試綠燈；跑 `npm run build`。
4. 推 `main`，在 issue 貼 commit SHA。
5. B 重測；A 確認沒有新紅燈；關 issue。

## 10. 不要測

- 像素級視覺一致、AI 生成圖的內容、動畫每幀時間。
- 即時 NASA API（測試一律用快照；API 失敗是 runtime 的另一條路）。
- 第三方字體載入、CDN 行為。
- 內部實作細節（除非 `docs/video-path.md` 已列為契約）。

## 11. 時程與完成門檻

| 時間 | 門檻 |
|---|---|
| 10:30 | harness 可跑；第一個 smoke test 綠 |
| 12:00 | §3.1–§3.2 核心單元綠；資料檢查綠 |
| 16:30 | §3.4＋§5.1–§5.3 綠（11/15 submission 前） |
| 21:00 | 所有 P0 綠；P1 清單已知；CI 綠 |
| 22:00 | freeze build（21:00 已凍結）全套綠；baseline 留存 |
| 22:30–07:30 | A 機夜間迴圈；C 機做影片；07:30 產出報告 |
| 11/15 09:00 | A 驗收夜間報告與 commit；C 審影片 v1 |
| 11/15 14:00 | P1 補完；Lighthouse ≥ 90；跨瀏覽器抽查；16:00 code freeze |

**Exit criteria：** P0 全綠、`?video=s1` 重載 10 次一致、playtest 的 P0 已修、main 綠燈。

## 12. 常數速查（測資不要寫錯）

| 項目 | 值 |
|---|---|
| 閃焰 | 2025-05-14 08:25Z，X2.7，AR 14087 |
| 地磁 | 最大 Kp 6.33（地球指數，不是火星量測） |
| 冷週 | 2025-05-15 → 2025-05-22；核心七日平均 −29.7／−79.7 °C |
| 快照筆數 | CME 20、FLR 4、GST 1、REMS 14 sols |
| 照片 | 7 張；PIA25077 1280×956、350,608 B、NASA/JPL-Caltech/MSSS |
| 影片 fixture | HUD 62／58／55／5／82／3；背包 8/20 → 9/20 |

## 13. 邊界

- 這份文件是**規格**；11/14 09:00 前不產生任何 `.test.ts`、`.spec.ts`、測試 fixture 或夜間 runner 程式。
- 測試檔屬於比賽期間的產出，09:00 後照 `CLAUDE.md` 的直接推送協定 commit。
- 若時間不足，砍 §6 P1，不砍 §3.4 與 §5.1–§5.3。

## 14. 11/14 下午與夜間自動修復

### 14.1 下午：誰寫哪一層

- **A**：harness＋單元／整合（`src/**/*.test.ts`）；09:00–10:30 建 config 與 npm scripts。
- **C**：上午先做圖片去背／壓縮（10:30–12:00）；**13:00** preview 與 `data-testid` 就緒後開始 E2E，先寫完整一局與影片路徑。
- **B**：手動 playtest 為主；17:30 後可為自己開的 issue 補 `tests/regression/**`，15 分鐘寫不出就跳過。
- 推測試前先 `pull --rebase`、跑 `npm test`＋`npm run build`；一般 suite 必須綠。已知 bug 放 `tests/e2e/known/**` 並標 `@known-bug`，由 `test:e2e` 排除，不要讓 `main` 長時間紅燈。
- 下午找到、當天來不及修的 **P1／P2**，由 C 寫成 `tests/e2e/known/issue-<n>.spec.ts` 並標 `@known-bug`，這就是夜間佇列；**P0 不進佇列**，當天由 A 修完。

### 14.2 夜間：runner 管迴圈，Claude 只修一次

- **只在 A 機**；22:30 開始，02:00 停止修復，07:30 更新報告。B 機關機，C 機做 30 秒影片（不跑測試迴圈）。
- 步驟：先跑一般 suite（`npm run lint`（若有）、`npm test`、`npm run build`、`npm run test:e2e`）→ 綠了再跑 `npm run test:e2e:known` 佇列 → 一次只把**一個** failing test 交給 `claude -p` → 修完重新 `npm run build`，重跑該測試＋一般 suite → 綠才 commit（留在本機，**不 push**，push 即上線）→ 最多 6 次、3 個未解、02:00 停止。
- 綠的定義：lint＋一般 suite 全綠＋這次修的 known test 綠；其他 known test 可以仍紅。
- known test 變綠後，**runner** 移除 `@known-bug` 標記並一併 commit（只改 tag，不改 assertion）。
- 護欄：測試檔 hash 不變（runner 的 tag 移除除外）、`package.json`／lock／test config 不變、不 deploy、不碰 secret、不 force、不改測試內容、不把 failing test 改成 skip／fixme、不放寬 assertion。
- **影片 freeze lock：** §3.4／§5.2 的 HUD 數值與 `?video=report` 必須保持綠；若修正會改變影片數值，runner 不得改測試／fixture，記報告，早上 A 決定重錄或 revert。
- 失敗不 commit；夜間不 push，所以不會觸發 Workers Builds 部署。runner 停下來後報告寫 `output/overnight/report.md`，同時用 `gh issue comment` 貼到 `overnight` issue，C／B 從 GitHub 讀。
- 22:30 前由 A 選模式：`logic-only`（預設，只修 logic／state／data／i18n key／a11y，不改字串值；視覺問題只寫報告）或 `allow-visual`（可改 UI／文案，commit 加 `[visual]`，早上 C 重錄或 A revert）。
- C 的影片從 A 21:00 部署的 freeze build 錄；A 夜間**不 deploy**，也不改 `tools/video/**`（22:00 已交接給 C）。
- 完整時間表與風險見 `docs/pre-event/multi-machine-plan.md` §7.1、§11。

### 14.3 早上驗收

- **A：** 讀報告、`git log`、GitHub Actions；跑一次全套。壞的 commit `git revert`；有 `[visual]` 就交給 C 重錄或 revert。驗收綠才 push（push 即由 Workers Builds 部署），部署完成後才讓 C 錄最終影片。
- **C：** 看影片 v1 的長度、旁白、字幕、畫面數字；若 A 夜間有 `[visual]` 或早上 deploy 了新 build，重錄受影響鏡頭。
- **B：** 09:00 後測新 build；不改夜間 commit。
