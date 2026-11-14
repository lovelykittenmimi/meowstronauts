# 11/13 賽前檢查（Pre-event check-in）

> 時間：2026-11-13 下午（12:51 更新）。**還有一整個下午＋晚上可以做賽前準備**，不是直接進 11/14。
> 範圍：2026-11-14 09:00 前的前置工作。
> 這份是內部紀錄，不是遊戲內容，也不是 submission；**11/14 09:00 前不 commit、不 push**。
>
> **名詞定義：** 本文把「push 到 GitHub」和「NASA project 頁面 submission」分開寫。11/14 上午所說的「初版」是 A 在 09:00 把第一版程式碼 **commit＋push 到 GitHub**，讓 B／C 可以 clone；**不是 NASA submission**。NASA project 頁面的 final submit 在 11/15。

> **11/15 送出前 TODO（最容易忘記，先記在這裡）：**
> - [ ] 把 GitHub repo `https://github.com/lovelykittenmimi/meowstronauts` 從 **private 轉 public**，用無痕視窗確認開得到，再把 repo 連結貼進 NASA project 頁面。

## 1. 結論

**已完成的前置工作 PASS，沒有阻擋項；可以先睡，醒來再繼續 11/13 的賽前準備（見 §7）。**

目前已具備：計畫與分工、資料快照與稽核、品牌資產、文件與文案規格、測試規格、影片管線與 10 秒測試片、CI skeleton。  
刻意還沒有：遊戲 `package.json`、Vite 專案、遊戲程式、測試檔、最終遊戲圖與遊戲內文案。這是賽前界線，不是缺漏。

工作區目前**尚未 commit**；`.dev.vars` 沒有被 git 追蹤；CI 在沒有 `package.json` 時會乾淨跳過。11/14 09:00 再做賽前唯一一次 commit。

---

## 2. 已完成、可直接交棒

| 項目 | 狀態 | 證據／位置 |
|---|---|---|
| 計畫、角色、分工、推送協定 | 完成 | `PLAN.md`、`CLAUDE.md`、`docs/pre-event/multi-machine-plan.md` |
| 三台機器的安裝與 Claude Code 指令 | 完成 | `docs/pre-event/b-c-setup-and-prompts.md` |
| NASA 快照 | 完成，JSON 全部可解析 | `src/data/*.json` |
| 火星照片 | 7 張，檔案與 metadata 位元組數一致 | `src/data/mars-photos/` |
| 品牌資產 | 頭像、全身圖、favicon、logo、OG 1200×630 | `brand/` |
| 設計與文案規格 | 完成 | `docs/event-cards.md`、`docs/glossary.md`、`docs/character-voices.md`、`docs/wireframes.md` |
| 測試規格 | 完成（spec only） | `docs/test-plan.md`、`docs/video-path.md` |
| 影片管線 | 10 秒測試片與 26.472 秒旁白可用 | `tools/video/`、`output/test-10s.mp4`（git-ignored） |
| CI | skeleton 可乾淨跳過 | `.github/workflows/ci.yml` |
| Repo 衛生 | `.dev.vars` 被忽略、沒有追蹤 output／node_modules | `.gitignore`、`git check-ignore` |

### 2.1 已驗證的具體數字

- 太空天氣：20 CME、4 FLR、1 GST；`maxFlareClass = "X2.7"`、`maxKp = 6.33`。
- 火星天氣：14 sols；核心 7 sols；平均高溫 −29.7 °C、平均低溫 −79.7 °C；缺 2025-05-18。
- 照片：7 張，合計 **1,450,279 B**（約 1.45 MB）。
- PIA25077：1280×956、**350,608 B**、credit `NASA/JPL-Caltech/MSSS`；NASA `dateCreated` 2022-03-01，實際拍攝 2022-02-24（sol 3396）。
- 影片測試片：10.000 秒、1920×1080、30 fps、H.264＋AAC、731,233 B。
- 旁白：`tools/video/narration-ana-45.mp3`，26.472 秒、158,832 B；字幕 8 cues。

---

## 3. 刻意尚未建立

- 根目錄 `package.json`、`package-lock.json`、Vite／Vitest／Playwright 設定。
- `src/` 的遊戲程式與元件；目前只有 `src/data/` 快照。
- 任何 `.test.ts`／`.spec.ts`。
- 最終遊戲圖、遊戲內文案、部署版本。
- submission 的實測數字與影片連結。

**影響：** 11/14 09:00 的 scaffold 是關鍵路徑，**第一次 push 必須包含可 build 的 `package.json`／lock**，B／C 09:05 clone 後才能直接 `npm ci`。若 09:00 來不及，A 先 push 最小可 clone 版，並在群組說「scaffold ready」再讓 B／C 跑 `npm ci`；不要提前建立或修改套件檔。

---

## 4. 資料稽核

### 4.1 太空天氣（DONKI）

- `cme` 20 筆、`flr` 4 筆、`gst` 1 筆。
- `strongFlare = true`、`strongStormConfirmed = true`、`strongGeomagneticStorm = false`。
- **注意命名：** `strongStormConfirmed` 的定義是 `strongFlare || strongGeomagneticStorm`；這次為 true 是因為 X2.7 閃焰，不是因為地磁風暴。
- 文案只能寫「強烈的太陽閃焰／strong solar flare」；**不可**寫「強烈的地磁風暴／strong geomagnetic storm」。Kp 6.33 是地球的地磁指數，不是火星量測。
- `docs/test-plan.md` 已加入 `strongFlare`／`strongStormConfirmed`／`strongGeomagneticStorm` 三個欄位的驗證，避免實作時只讀到 `strongStormConfirmed` 就誤寫。

### 4.2 火星天氣（REMS）

- 14 sols；`meta.selection.core.sols = 7`。
- 平均高溫 −29.7 °C、平均低溫 −79.7 °C；缺 2025-05-18。
- 遊戲只寫「很冷」，不寫百分位排名；`topPercent` 只留在研究與資料面板，不當兒童文案。

### 4.3 火星照片

- 7 筆 metadata；7 個 JPEG 的實際 `bytes` 與 metadata 完全一致。
- PIA25077 是**花狀岩石**，不是植物、不是化石；caption 必須寫明。它是 F1 故事客串與資料面板小圖，不進 30 秒影片。
- 使用限制仍有效：PIA26632 是灰階、PIA24264 是 1280×339 全景條、PIA24173 是直式 1075×1280；不要硬塞成 16:9 主圖。
- 每張照片都要顯示 NASA ID、拍攝日與 credit；資料面板要有 `snapshot, not live`。

### 4.4 快照檔案

- 四個 JSON 全部可解析，UTF-8 正常。
- `snapshots.manifest.json`：`api_key_included: false`；`counts` 與實際陣列／檔案一致。

---

## 5. 分工與時間一致性

> **2026-11-13 已決定：** 成品 URL 使用 `https://mars.flymymind.com`；`meowstronauts` 只是 Cloudflare Worker 名稱，不另綁網域。submission 的 Live demo 欄位填這個 URL。

| 機器 | 11/14 主要工作 | 夜間 |
|---|---|---|
| **A** | core、state、事件卡、unit／integration、部署、final submit | 22:30 起跑測試／修復 runner；不 deploy |
| **B** | 小孩遊玩、重現問題、開 issue、只修 `fix-ok` 的小項 | 關機 |
| **C** | 10:30–12:00 圖片去背／壓縮；13:00–21:00 E2E；22:00 接手影片 | 22:30 起做 30 秒影片；不跑測試迴圈 |

- **21:00 build freeze＋A deploy**；C 只錄部署 URL，不錄 localhost。
- **22:00 `tools/video/**` 交接給 C**；**22:30 A 啟動 runner、C 開始錄影**。
- 影片路徑的 HUD 數值（62／58／55／5／82／3 → 42／58／80／5／82／3）是 freeze lock；修正不得改測試或 fixture 來配合。
- 11/15 **16:00 code freeze**；之後只修 critical bug，C 不重錄，除非 A 明確指定。

### 5.1 本次 review 修正的文件

- `docs/pre-event/README.md`：加入這份 review；文件計數改為七個紀錄檔＋README。
- `docs/test-plan.md`：freeze 措辭改為「21:00 已凍結、22:00 全套綠」；補上太空天氣三個 assessment 欄位的斷言。
- `PLAN.md`：6 張照片的總大小改為約 1.1 MB；補上 7 張合計 1,450,279 B。
- `docs/pre-event/b-c-setup-and-prompts.md`：補 ffmpeg／ffprobe 的 PATH 排錯；影片交接改為 22:00 接手、22:30 開錄；B／C 的 11/13 設定改到晚上其他人回家後。
- `PLAN.md`、`docs/pre-event/multi-machine-plan.md`、本文件：把 11/14 上午的「submission」正名為 **A 09:00 commit＋push 第一版程式碼到 GitHub**，B／C 09:05 clone；NASA final submit 仍在 11/15。

以上修改都只在工作區，**沒有 commit、沒有 push、沒有 deploy**。

### 5.2 連結與檔案

- 相對 Markdown 連結抽查：0 個壞連結。
- 文件中的反引號路徑多數是**11/14 才建立的預定檔案**（例如 `src/App.tsx`、`tests/e2e/**`、`package.json`），現在不存在是預期狀態。
- `docs/gem-instructions.md`、`docs/assets/characters/`、`brand/` 的既有資產都存在。

---

## 6. 仍要注意的風險

| 風險 | 影響 | 處置 |
|---|---|---|
| NASA project 頁面不是 GitHub，final submit 在 11/15 | 11/14 太早按 submit 可能送出缺影片／缺連結的版本 | 11/14 只準備文案、截圖與草稿；**不按 final submit**；11/15 由 A 確認 repo 已 public、成品 URL 可開、影片可看後再送 |
| B 的舊電腦可能不是 64-bit 或跑不動 Node 24 | 無法本機 build／push | 先跑 `echo $PROCESSOR_ARCHITECTURE`；不是 `AMD64` 就只測部署版、開 issue |
| C 同時做圖片、E2E、影片，容易過載 | 影片或測試延遲 | 優先序：影片 > 影片路徑 E2E > 其他 E2E > 圖片壓縮 > P1／P2 |
| 21:00 freeze 後 A 若 deploy 或改畫面 | C 錄到不同 build | A 夜間不 deploy；C 錄前對 build 標籤，數字不一致就停 |
| `strongStormConfirmed` 被誤讀成地磁風暴 | 文案事實錯誤 | 只使用 `strongFlare`／`strongGeomagneticStorm` 決定用字；測試檔已加斷言 |
| ffmpeg 已安裝但 Git Bash PATH 沒更新 | C 的煙霧測試誤判失敗 | 重開終端；winget 執行檔在 `%LOCALAPPDATA%\Microsoft\WinGet\Links\`，把該資料夾加進 PATH |
| 目前所有變更都還沒 commit | 09:00 前若機器故障會遺失 | 11/14 09:00 一次 commit；在那之前不要 force push、不要 reset |

---

## 7. 11/13 白天到晚上

> 現在是 11/13 下午 12:51。A 機可先做的檢查已先跑（見 §7.1）；**B／C 的安裝與環境驗收照指示留到晚上其他人回家後**。11/13 全天仍然不 commit、不 push、不 deploy。

| 時間 | 動作 | 負責 | 完成標準 |
|---|---|---|---|
| 下午 | 照 `docs/pre-event/preflight.md` §1–§9 跑 A 機可做的項目；已知問題記錄在 §7.1 | A | 沒有未記錄的阻擋項；B／C 項目除外 |
| 晚上（其他人回家後） | B／C 貼 `b-c-setup-and-prompts.md` §4.1／§4.2，做環境驗收；C 跑三個煙霧測試 | B／C | 回報版本與 OK／FAIL |
| 下午 | 確認 MVP 8 張 prompt（`docs/image-prompts.md` §0.5）與 3 張角色參考圖；缺的工具補裝；**不新增參考圖、不生成最終圖、不 clone 遊戲、不 commit** | 全員 | 8 張 prompt、3 張參考圖與工具就緒 |
| 17:00 | 官方 Resources 若已釋出，把 challenge 資源補進 `docs/data-sources.md` | A／使用者 | 資源連結已記錄；未驗證的不貼 |
| 18:30 | 第二次賽前整理（`docs/pre-event/README.md` §4）；A 已先做一次初檢，晚上再快掃 | A | 沒有暫存產物、重複檔 |
| 19:00 | 印出 `docs/video-script.md` §7 交接清單與 `docs/video-path.md` §8 驗收清單；確認 playtest；檢查 submission 文案與連結清單（不按 submit） | A／使用者 | 清單印好、playtest 確認 |
| 20:00 或 B／C 設定完成後 | 三台線上 sync 15 分鐘：確認 11/14 09:00 開工、分工、C 影片、A runner | 全員 | 三台都回報 ready |
| 21:30 | 手機／平板／筆電充電；插電不休眠；鬧鐘 08:00 | 全員 | 電源與鬧鐘完成 |
| 22:00 | **賽前 freeze**：不再改文件、文案、生成圖；睡覺 | 全員 | 11/14 09:00 前不再動 repo |

### 7.1 11/13 執行紀錄（A 機，12:51 起）

**已通過**

- 網域：`https://mars.flymymind.com` 回 `200`、`server: cloudflare`；`http://` 回 `301` 到 HTTPS；NS 為 Cloudflare，A 記錄存在；TLS 憑證由 Google Trust Services 簽發，有效到 2027-02-09。
- Cloudflare：沿用 11/12 使用者目視確認 `NASA_API_KEY` 型別為 Secret、值隱藏；今天沒有改 Worker、DNS 或 SSL/TLS。
- Repo／金鑰衛生：`.dev.vars` 命中 `.gitignore`；40 字元候選 key 掃描 0 個檔案；repo 仍 private；沒有 root `package.json`、Vite／Vitest／Playwright 設定。
- 資產：`brand/og-1200x630.jpg` 為 1200×630，實際看過標題、副標與 `Fly My Mind` 都在安全區；3 張角色參考圖存在（2750×1536）；7 張火星照片 metadata 與實際 bytes 一致，合計 1,450,279 B。
- 快照：DONKI 20 CME／4 FLR／1 GST；REMS 14 sols；`api_key_included: false`；四個 JSON 都可解析。
- 文件：必備文件齊全；`docs/submission.md` 只剩預定的 `【 】`；`docs/ai-disclosure.md` 的模型版本欄位刻意留待 11/15。
- 環境：Node 24.19、npm 11.17、git 2.55、GitHub CLI 已登入、wrangler 4.161.0、Playwright 1.65.0、edge-tts 7.3.1、Pillow 12.3.0、rembg 可用。
- 影片：10 秒測試片 10.000 秒、1920×1080、30fps、H.264＋AAC、731,233 B；旁白 26.472 秒、158,832 B。
- 圖像 prompt：§0.5 的 8 張清單與 23–25、01、05、06、07、08 的 prompt 都在；沒有新增參考圖、沒有生成最終圖。
- 18:30 整理初檢：`docs/pre-event/` 為 README＋7 個紀錄檔；沒有重複檔、`.tmp`／`.bak`；`git status` 沒有 `.dev.vars`、`output/`、`node_modules/`、`dist/`。
- 內容抽檢：`strong geomagnetic storm` 只出現在規則、資料註記與負向測試中，目前沒有遊戲 UI；火星天氣排名只留在研究文件，沒有兒童文案。

**已知問題／待辦**

- `ffmpeg`／`ffprobe` 不在**目前這個 Git Bash process** 的 PATH；使用者 PATH 已包含 `%LOCALAPPDATA%\Microsoft\WinGet\Links`，新開終端會生效。本次用完整路徑驗證，`assemble-test.mjs` 也會自己解析；不列為阻擋項。
- GitHub Actions 尚無 run：因 11/13 不 push；CI skeleton 存在，11/14 09:10 再看。（preflight 7.2 本來就註明 11/13 不列阻擋。）
- B／C 安裝、`npm ci`、C 的三個煙霧測試與 preflight §8.7–§8.9：留到晚上其他人回家後。
- 17:00 官方 Resources **已於 20:00 補查**：官方頁面已可讀，7 個 resources（5 NASA、2 CSA）逐一實測，結果寫入 `docs/data-sources.md` §3.2–§3.3。可用的是 OSDR 與 Mars Trek；RadLab 目前 500、APOD 對舊日期回樣板、DONKI 用 `DEMO_KEY` 429（需真實 key）。離線快取在 `scripts/raw/official-resources-2026-11-13/`，沒有新增賽前文件。
- 19:00 列印、20:00 sync、21:30 充電、22:00 freeze：待晚上執行。

---

## 8. 11/14 早上清單

| 時間 | 動作 | 負責 |
|---|---|---|
| 08:00 | 鬧鐘；確認電源、網路、螢幕 | 全員 |
| 08:30 | 開機、開 repo／Cloudflare／GEM；確認三台 Claude Code 可登入 | 全員 |
| 09:00 | **賽前唯一一次 commit＋push**：賽前文件＋可 build 的 scaffold；確認沒有 `.dev.vars`／`output/`／`node_modules/`；**這就是「上傳第一版程式碼」** | A |
| 09:05 | B／C clone 第一版；等 A 說 scaffold ready 再做 `npm ci` | B／C |
| 09:10 | 看 GitHub Actions；CI 應開始跑 lint／test／build | A |
| 09:00–10:30 | A 建 scaffold、core、state、事件卡；生成 8 張原圖到 `output/raw/` | A |
| 10:30–12:00 | C 圖片去背／壓縮到 `src/assets/generated/` | C |
| 11:00 | 確認 B／C 已拿到同一版、`npm ci` 與 CI 狀態；**不按 NASA final submit** | A |
| 13:00–21:00 | C 寫 E2E；B 與人測部署版；A 繼續 core／修 P0 | A／B／C |
| 17:30 | 1 位兒童＋家長 playtest（只截遊戲畫面、不錄影錄音） | B／使用者 |
| 21:00 | build freeze＋A deploy；C 只錄這個版本 | A／C |
| 22:00 | `tools/video/**` 交接給 C | A→C |
| 22:30 | A 啟動 runner；C 開始錄影片 | A／C |

---

## 9. 晚間收尾

- 現在是 **11/13 下午**；A 機可做的檢查已完成並記錄在 §7.1。
- 11/13 全天不 commit、不 push、不 deploy；唯一一次賽前 commit 是 **11/14 09:00**。
- 不建立遊戲 `package.json`、不寫遊戲程式、不生成最終遊戲圖。
- 不讀、不印 `.dev.vars`；不把任何 key 貼進聊天或 issue。
- 晚上依序完成：B／C 環境驗收（其他人回家後）→ 17:00 Resources 檢查 → 18:30 快掃 → 19:00 列印／playtest 確認 → 20:00 sync → 21:30 充電 → 22:00 freeze。

---

## 10. 相關文件

- 賽前檢查：`docs/pre-event/preflight.md`
- 三台分工與夜間 runner：`docs/pre-event/multi-machine-plan.md`
- B／C 安裝與指令：`docs/pre-event/b-c-setup-and-prompts.md`
- 測試規格：`docs/test-plan.md`
- 影片腳本與路徑：`docs/video-script.md`、`docs/video-path.md`
- 資料來源與紅線：`docs/data-sources.md`
- 手動 QA：`docs/qa-checklist.md`
