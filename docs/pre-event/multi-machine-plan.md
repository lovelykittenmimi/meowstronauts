# 三台電腦分工計畫（11/14–11/15）

> 2026-11-12 起草；11/13 20:00 團隊 sync 前定稿。
> 前提：repo **11/14 09:00 才第一次 push**；B／C 明天只裝環境，不 clone 遊戲、不生成最終圖。
> 關聯：`PLAN.md` §10、`docs/test-plan.md`、`docs/pre-event/preflight.md`、`docs/playtest.md`。

## 0. 一句話

**A 寫核心、部署，晚上跑自動測試／修復；B 只當玩家與回報者（其 Claude 只修被指派的小 bug）；C 做圖片去背／壓縮、submission、文件、截圖、雙語／無障礙 QA、自動 E2E，晚上做 30 秒影片。三台都直接 push `main`，沒有 PR；不共編同一個檔案。**

## 1. 角色

| 代號 | 機器 | 誰 | 主要工作 | 絕對不做 |
|---|---|---|---|---|
| **A 主機** | 你現在這台 | 你＋Claude | 核心程式、狀態機、事件卡、單元／整合測試 harness、部署、**夜間測試／修復迴圈**、最終收尾 | 跳過 build／test 直接 push、夜間 deploy |
| **B 測試機** | 小孩的電腦 | 12 歲團隊成員＋Claude | 遊玩測試、開 issue、回報、修被指派的小 bug、補回歸測試 | 部署、跳過 §4 協定直接推 main、碰金鑰、錄小孩的影音、夜間留守、重圖片／影片處理 |
| **C 協作機** | 第三台 | 成人＋Claude | **圖片去背／壓縮**、submission 頁面草稿、README／licenses、截圖、無障礙與雙語 QA、**自動 E2E 測試**、**30 秒影片** | 部署、改核心狀態機、碰金鑰、改 `package.json` |

**只有你（A 機）按 submit、按 deploy、開 Cloudflare Dashboard。** C 只準備草稿、圖片、測試與影片，送出前由你確認。

> 若當天只有兩台電腦：C 的工作包併回 A（含影片）；**夜間測試迴圈取消**，只保留早上 09:00 的全套測試。B 的角色不變。

## 2. 三個 Claude 的權限邊界

| 權限 | A | B | C |
|---|---|---|---|
| 直接推 `main` | ✅ | ✅（照 §4 協定） | ✅（照 §4 協定） |
| 開 GitHub issue | ✅ | ✅ | ✅ |
| `wrangler deploy`／secret | ✅ | ❌ | ❌ |
| 讀 `.dev.vars` | 僅必要時 | ❌ | ❌ |
| 改 `src/` 核心 | ✅ | 只改 issue 指名的檔 | 只改被指派的獨立檔 |
| 寫自動測試 | ✅ unit／integration＋harness | ✅ `tests/regression/**`（A 建好後） | ✅ `tests/e2e/**` |
| 夜間測試／修復迴圈 | ✅（照 §7.1；不 deploy） | ❌（小孩機關機） | ❌（做影片） |
| 圖片去背／壓縮 | 可 | ❌（機器較舊） | ✅ |
| 錄遊戲畫面／剪 30 秒影片 | 可（驗收、必要時補錄） | ✅（只截遊戲，不錄小孩） | ✅（主要負責） |
| 最終 submit | ✅ | ❌ | ❌ |

**沒有 PR、沒有分支、沒有人工合併。** 三台都直接 push `main`；防止衝突靠檔案所有權、`pull --rebase`、小 commit 與 lock 公告（§4）。

> 若三個 session 共用同一個 Claude 訂閱，用量會一起扣。**A 用最強模型，B／C 白天用較輕的模型**（`/model` 切換）；**A 夜間修復迴圈切回 Sonnet 等級以上**，不要用 Haiku 修 P0／P1；**C 夜間影片以腳本／ffmpeg 為主，Claude 只做檢查與例外處理**，不要讓影片 session 和 A 的修復搶額度。B／C 被額度擋住時，改用口頭／issue 回報，讓 A 修。

## 3. 檔案所有權

| 擁有者 | 路徑 | 備註 |
|---|---|---|
| **A** | `src/**`（除下列）、`index.html`、`package.json`、`package-lock.json`、`vite.config.*`、`vitest.config.*`、`playwright.config.*`、`tsconfig*`、`wrangler.jsonc`、`worker/**`、`scripts/**`、`tests/support/**`、`tests/e2e/overnight.mjs`、`tools/video/**`（22:00 前；之後交接給 C）、`.github/workflows/**`、`PLAN.md` | 核心、依賴、測試 harness、夜間 runner 與部署 |
| **B** | `docs/playtest/**`、`tests/regression/**`（A 建好測試框架後；規格見 `docs/test-plan.md`） | 修正只能碰 issue 指名的檔 |
| **C** | `docs/submission.md`、`docs/licenses.md`、`docs/qa-checklist.md`、`README.md`、`screenshots/**`、`public/**`（A 建目錄後）、`src/i18n/**`（A 建好空檔後；不改英文影片用字串）、`src/components/aux/**`（獨立元件）、`src/assets/generated/**`（A 建目錄後；只放處理過的圖）、`tests/e2e/**`、`tools/video/**`（22:00 交接後）、`output/`（本機，不進 git） | 不動 core state、不裝新套件、不改套件檔 |
| **唯讀** | `docs/event-cards.md`、`docs/glossary.md`、`docs/data-sources.md`、`docs/wireframes.md`、`docs/video-script.md`、`docs/video-path.md` | 要改先開 issue，由 A 改 |

> **圖片所有權：** A 09:00–10:30 產生原圖並建 `src/assets/generated/`；C 10:30 後只寫這個資料夾與 `public/`，不碰 `src/components/**` 的引用。A 負責把圖片接進畫面；若 C 需要改引用，先開 issue 或 LOCK。

> `package.json`／`package-lock.json` 只有 A 能改。B／C 需要新套件時開 issue，不要自己 `npm install <新套件>` 後 push。

**鐵律：一個檔案，同一時間只有一台機器在改。** 跨區修改先開 issue，不要順手改。

**22:00 影片交接：** A 把 `tools/video/**` 的 ownership 交給 C（群組貼 `LOCK: tools/video/**` 由 C 接手），A 之後不再改；C 只改影片管線與 `output/`，不改遊戲 `src/`。若 C 發現管線 bug，優先跑現有腳本；真的需要改，只改 `tools/video/**` 並在 commit 說明，不動遊戲程式。

**測試檔是規格，不是修復者的產物。** 「讓測試變綠」不等於「修好 bug」；夜間修復者不得改寫 `tests/**` 或 `*.test.ts`（runner 在 known test 變綠後移除 `@known-bug` 標記是唯一例外）。只有測試作者能改測試，且要在 issue 說明為什麼原本的期待是錯的。

## 4. 直接推送 `main`（trunk-based）

**三台都直接 push `main`。沒有 PR、沒有長期分支、沒有人工合併。**

### 4.1 每次推送的固定動作

```bash
git pull --rebase origin main      # 開工前
# 小段落修改（30–45 分鐘內）
git add <只加自己的檔>
git commit -m "fix: ..."
git pull --rebase origin main      # 推送前再拉一次
npm run build                      # 有 code 就一定要跑；有 test 就跑
git push origin main
```

- **小 commit、常推送**：至少每 30–45 分鐘推一次；不要累積半天才推。
- **`pull --rebase` 前先 commit 或 `git stash`**；不要帶著未 commit 的變更 rebase。
- **推送前一定要 `pull --rebase`**；push 被拒就是再做一次 `pull --rebase` 再推。
- Commit 前綴：`feat:`、`fix:`、`docs:`、`qa:`、`chore:`。一次 commit 一件事。
- **禁止** `git push --force`、`git reset --hard origin/main`（會吃掉別人的 commit）。
- 弄壞 `main`：立刻修，或 `git revert <sha>` 後推回去；**不要用 reset 蓋掉歷史**。
- CI 紅燈：最後一個推的人負責在 15 分鐘內修好或 revert，不要放著。

### 4.2 防止衝突：所有權＋lock

- 檔案所有權（§3）是主要防線：**不要改不是你的檔**。
- 動 `src/App.tsx`、`src/state/**`、`src/i18n/index.ts`、`package.json`、共用資料檔前，先在群組貼：
  - `LOCK: src/App.tsx`
  - 推完後貼 `UNLOCK: src/App.tsx`
- 看到別人 lock 的檔，先做別的；不要「順手一起改」。
- Rebase 衝突時：
  - 衝突檔是你的 → 解衝突、`git rebase --continue`、build、push。
  - 衝突檔不是你的 → `git rebase --abort`，在群組問 owner；**不要幫別人解**。
- 同一台機器也一樣：一次只改一個工作包，不要同時開三個 Claude session 改同一份 repo。

## 5. B 的問題回報與修正流程

### 5.1 Issue 格式（小孩用嘴巴說，Claude 整理）

```text
[P1] Sol 4 出現兩張事件卡，按鈕被遮住
Build: v0.1（10:30）
Steps: 重新整理 → 選普通 → 玩到 Sol 4
Expected: 一次只出現一張卡
Actual: 兩張疊在一起，下面那張不能按
Screenshot: 附檔
```

嚴重度：

| 級別 | 定義 | 處理 |
|---|---|---|
| **P0** | 玩不下去、白屏、資料錯到會誤導 | A 立刻修 |
| **P1** | 主要流程卡住但有 workaround | 當天修 |
| **P2** | 版面、文案、動線不順 | 下一個同步點前修 |
| **P3** | 潤飾 | 有時間才修 |

### 5.2 流程

1. 小孩玩 **A 部署的 URL**，把看到的問題告訴 B 的 Claude。
2. B 的 Claude 先重現；重現不了就補問步驟，不要猜。
3. `gh issue create --label bug,p1 --title "..." --body "..."`，附截圖。
4. A 判斷：自己修，或標 `fix-ok` 交給 B。
5. 只有拿到 `fix-ok` 的 issue，B 的 Claude 才能動手；**只改 issue 指名的檔**。
6. B 在 `main` 上修：`pull --rebase` → 改 → `npm run build` → commit → 再 `pull --rebase` → **直接 push `main`**。
7. B 在 issue 貼 commit SHA；A 事後看 diff。若改壞，A `git revert` 並重開 issue；B 先 `pull --rebase` 再重做。
8. 若修正超過 **30 分鐘**、要動核心狀態機或要加新套件，停止，交回 A。
9. **B 機器較舊：** 若 `npm run build` 超過 10 分鐘、記憶體不足或 Node 24 無法安裝（32-bit Windows），B 不做本機 build／push，只把重現步驟與截圖開成 issue，由 A 或 C 修。不要為了讓 B 能跑而改 `package.json` 或降 Node 版本。

### 5.3 正式 playtest（11/14 17:30）

- 照 `docs/playtest.md` 第 6 節；家長在場。
- **不錄影、不錄音、不拍小孩**；只截遊戲畫面。
- Issue 記錄不寫小孩姓名、學校；用「P1 tester」。
- B 機的 Claude 可以協助整理記錄，但不要打斷小孩操作。

### 5.4 B 補回歸測試（可選）

- playtest 後，若 A 的 harness 已就緒，B 的 Claude 可以為自己開的 issue 補一個 `tests/regression/issue-<n>.test.ts`。
- 只寫重現步驟，不改 `src/`；測試應該在修正前 red、修正後 green。
- 若寫不出來或超過 15 分鐘，跳過，把步驟留在 issue；**不要硬寫，也不要改測試來讓它通過**。

## 6. 11/13 預裝清單

> 逐項工具、安裝指令與可直接貼給 Claude Code 的台詞，整理在 `docs/pre-event/b-c-setup-and-prompts.md`；本節保留分工與驗收原則。

### 6.1 三台共同

| 軟體 | 用途 | 驗證 |
|---|---|---|
| Git for Windows | clone、pull --rebase、push | `git --version` |
| Node.js 24 LTS＋npm | 跑 Vite／build／測試 | `node -v`、`npm -v` |
| GitHub CLI | issue、repo、push | `gh auth status` |
| Claude Code | 三個 session | `claude --version` |
| Chrome／Edge 最新 | 測試與截圖 | 開一個空白頁 |

PowerShell（系統管理員）：

```powershell
winget install --id Git.Git -e --source winget
winget install --id OpenJS.NodeJS.LTS -e --source winget
winget install --id GitHub.cli -e --source winget
npm install -g @anthropic-ai/claude-code
```

登入：

```powershell
gh auth login          # GitHub.com → HTTPS → 瀏覽器授權
claude                 # 首次開 → /login
```

### 6.2 A 主機（你）

已有：Node 24.19、npm 11.17、git 2.55、gh、Playwright 1.65、ffmpeg 9.0.2、edge-tts 7.3.1、`npx wrangler` 4.161.0。**不用再裝。**

- 11/14 09:00–10:30 產生 MVP 8 張原圖，建 `src/assets/generated/`；10:30 後把去背／壓縮交給 C。
- 21:00 部署 freeze build；22:00 把 `tools/video/**` 交接給 C；22:30 啟動夜間 runner。
- 若要用 Pillow 處理圖：`python -m pip install pillow`（目前這個 shell 的 Python 沒有 PIL）。
- 11/14 09:00 前不建遊戲 `package.json`、不生成最終圖。

### 6.3 B 測試機（小孩，機器較舊）

| 裝 | 不裝 |
|---|---|
| Git、Node 24、npm、GitHub CLI、Claude Code、Chrome／Edge | Python、Pillow、rembg、ffmpeg、edge-tts、wrangler、Playwright（regression 用 Vitest，不需要瀏覽器）、影像處理軟體 |

- 先確認是 **64-bit Windows**（`echo $PROCESSOR_ARCHITECTURE` 應為 `AMD64`）；Node 24 沒有 32-bit 版。若機器是 32-bit 或記憶體不足，B 只測部署版與開 issue，不在本機 build／push。
- 不需要 TTS、不需要影像處理軟體、不需要 NASA key。
- 測試以**部署後的 URL** 為主；本機 clone 只用來重現與修 issue。
- **B 不留守、不跑夜間迴圈、不做圖片去背／影片**；晚上關機。

### 6.4 C 協作機（第三台；開發／影像／測試／影片）

**原則是「跟 A 一樣的開發與影片工具，但沒有部署權與金鑰」。**

| 裝 | 用途 |
|---|---|
| Git、Node 24、npm、GitHub CLI、Claude Code、Chrome／Edge | 同共同項 |
| Python 3.12＋Pillow | 圖片裁切、resize、WebP、OG 尺寸檢查 |
| rembg＋onnxruntime（建議） | 角色頭像去背；第一次跑會下載模型（約 170 MB） |
| ffmpeg | 影片剪輯、字幕、音軌、ffprobe 驗長度 |
| edge-tts | 30 秒影片旁白（Ana +45%，26.5 秒） |
| Playwright（11/14 下午起） | 寫與跑 E2E；由 repo 的 devDependencies 提供，用系統 Chrome／Edge |
| （可選）`sharp-cli` | 大量 WebP 壓縮；Pillow 已足夠 |

```powershell
winget install --id Python.Python.3.12 -e --source winget
py -m pip install --upgrade pillow rembg onnxruntime edge-tts
winget install --id Gyan.FFmpeg -e --source winget
```

- **C 不先自己裝 Playwright。** A 在 11/14 scaffold 把 `@playwright/test` 放進 `package.json`；C 09:05 clone 後跑 `npm ci` 就有。瀏覽器用系統 Chrome／Edge（`channel: 'chrome'`），不另外下載 chromium。
- **C 需要能跑 1080p 影片：** 至少 8 GB RAM、10 GB 可用磁碟；插電、關休眠、關 Windows 自動重開機、網路穩定（TTS 需要網路）。
- **TTS 優先用 repo 內的 `tools/video/narration-ana-45.mp3`**（158,832 B，26.5 秒，已選 Ana +45%）；需要 WAV 時用 ffmpeg 轉 48 kHz mono。若腳本有改才重跑：`python -m edge_tts -v en-US-AnaNeural --rate=+45%`；不要改 voice／rate。
- **去背只在 C：** B 機器較舊，不做；A 若已在 09:00–10:30 完成部分去背，C 只補剩下的與壓縮。
- C 不裝 wrangler、不登入 Cloudflare、不碰 `.dev.vars`、不拿 `NASA_API_KEY`。

### 6.5 GitHub 存取（重要）

- repo 目前 private，只有 `lovelykittenmimi/meowstronauts`。
- **GitHub 帳號最低年齡是 13 歲**，12 歲的小孩不能有自己的帳號。B 機請用**家長（你）的 GitHub 帳號**登入 `gh`；因為三台都直接推 `main`，B 的約束靠**檔案所有權、lock 公告、`fix-ok` 標籤與大人在場**，不靠帳號隔離。
- C 若是成人，可以邀請為 collaborator；否則也用你的帳號。
- 不要在 B／C 的瀏覽器存 GitHub 密碼；`gh` 用 device flow 授權即可。
- **任何一台都不放 `NASA_API_KEY`**；本機跑遊戲用快照，線上打 Worker。

### 6.6 Claude Code 權限設定（B／C 本機）

在 B／C 的 repo 根目錄建 `.claude/settings.local.json`（此檔已 gitignore，不會進 repo）：

```json
{
  "permissions": {
    "deny": [
      "Read(./.dev.vars)",
      "Bash(cat .dev.vars:*)",
      "Bash(git push -f:*)",
      "Bash(git push --force:*)",
      "Bash(git reset --hard:*)",
      "Bash(wrangler:*)",
      "Bash(npx wrangler:*)",
      "Bash(gh secret:*)",
      "Bash(rm -rf:*)"
    ]
  }
}
```

> 這是安全網，不是牢籠；真正的規則在 `CLAUDE.md` 與大人監督。

### 6.7 預裝驗收（11/13 下午）

每台在**空資料夾**跑一次，不要碰真 repo：

```powershell
node -v
npm -v
git --version
git config user.name
git config user.email
gh auth status
claude --version
```

C 另外跑：

```powershell
ffmpeg -version
py --version
py -c "from PIL import Image; print('Pillow', Image.__version__)"
py -m edge_tts --version
py -c "import rembg; print('rembg ok')"
npx -y playwright@latest --version
```

預期：Node v24.x、npm 11.x、git 2.5x、git 身分已設定（A／C 要 commit）、gh 已登入、claude 有版本號；C 的 ffmpeg／Pillow／edge-tts／rembg 都有輸出。再開一個空資料夾讓 Claude 做一件小事（例如「列出這個資料夾的檔案」），確認中文輸入與回覆正常。

C 的煙霧測試（11/13，不碰遊戲）：
1. 用 Pillow 產一張 512×512 測試圖，跑一次 rembg 去背，確認輸出有 alpha。
2. 用 edge-tts 產 1 句 `en-US-AnaNeural --rate=+45%`，用 ffprobe 確認有音軌。
3. 用 ffmpeg 產 3 秒 1920×1080 30fps 測試片，確認可播放。
4. 以上任何一項失敗，11/13 當晚修好；不要留到 11/14 晚上才發現。

### 6.8 不要裝、不要帶

- `.dev.vars`、任何 API key、Cloudflare token。
- A 的 `output/`、`node_modules/`、`dist/`（用 clone＋`npm install` 重建）。
- 27 張圖、未定稿的生成圖（11/14 才生成 MVP 8 張）。
- 小孩的個人資料、學校、照片。

## 7. 11/14 時間表（三機）

| 時間 | A 主機（你） | B 測試機（小孩） | C 協作機 | 同步點 |
|---|---|---|---|---|
| 08:30 | 開機、開 repo／Cloudflare／GEM | 開機、開 Claude | 開機、開 Claude | 群組說「ready」 |
| 09:00 | **commit＋push 第一版程式碼**；09:10 看 Actions | **09:05 後** clone | **09:05 後** clone | repo 有 `chore: start hackathon` |
| 09:00–10:30 | **生成 MVP 8 張原圖**、scaffold（含 Vitest／Playwright harness、seed、test IDs）、核心狀態機起步 | 熟悉 repo、跑一次空白頁 | 讀 submission 欄位、列缺件；讀 `docs/test-plan.md` §14；確認 Pillow／rembg／ffmpeg／TTS 可用 | 10:30 第一個 build |
| 10:30–12:00 | 核心狀態機、12 張事件卡；**部署 internal preview**；開始 unit tests；**11:00 確認 B／C 已 clone 同一版、CI 綠燈** | 玩得到什麼就測什麼，開 issue | **圖片去背、resize、WebP 壓縮**，輸出 `src/assets/generated/**`＋manifest；README／licenses 草稿 | **12:00 同步點：main 綠燈；8 張圖可用** |
| 12:00–13:00 | 午餐＋自己玩一次 | 午餐 | 午餐 | — |
| 13:00–15:00 | UI、對話、知識卡、雙語；unit／integration tests | 測開場與第一局 | **建 E2E：完整一局、影片路徑、語言**；截圖、無障礙清單 | **15:00 同步點：main 綠燈** |
| 15:00–16:00 | 開場 6 幕＋3 個 tap；修 E2E 抓到的 P0 | 試看開場一次（90 秒內） | **跑 E2E、開 issue**；submission 文字定稿 | 16:00 開場節奏確認 |
| 16:00–16:30 | 修開場、**部署 v0.1** | 重測部署版 | **E2E 綠燈**；檢查連結、圖片、欄位 | **16:30 檢查 submission 草稿（不按 final submit）** |
| 16:30–17:30 | 部署後 smoke test、修 P0 | 部署版 smoke test | 整理 submission 截圖與文案草稿 | URL 可開 |
| 17:30–19:00 | 修 playtest P0 | **正式 playtest（家長在場）**；之後補 regression（可選） | 整理 playtest 紀錄與截圖；更新 submission | **18:30 同步點：main 綠燈** |
| 19:00–21:00 | 影片路徑、S1、知識卡、資料面板；**21:00 部署 freeze build** | 回歸測試已修項目 | **全套 unit＋build＋E2E 綠燈；留 baseline**；最終 submission 草稿 | **21:00 build freeze＋A deploy** |
| 21:00–22:00 | 跑一次影片路徑、填交接清單；**不改遊戲** | 休息 | **對部署 freeze build 跑最後一次 E2E**；整理影片素材與夜間清單 | 不動遊戲 |
| 22:00–22:30 | **把 `tools/video/**` 交接給 C**；確認夜間 runner 設定 | 確認隔天時間 | **接手影片管線；確認 TTS／ffmpeg／部署 URL** | 交接完成 |
| 22:30–23:00 | **啟動夜間測試／修復迴圈（§7.1）**；團隊睡覺 | 睡覺、關機 | **開始錄影片、TTS、剪輯**；人睡覺、機器留守 | 兩台都只跑自己的事 |
| 23:00–隔日 | Claude 夜間測試＋定點修復；07:30 寫報告 | 關機 | Claude 夜間產出 v1 影片；早上 09:00 審閱 | 早上看報告與 v1 |

> B 的測試從 **10:30 第一個 build** 開始，不必等 16:30。16:30 是 submission 草稿檢查，不是第一次部署，也不是 final submit；final submit 在 11/15。
> B／C 在 09:05 clone 後先跑 `npm ci`；若 `package.json` 還沒進 repo，等 A 說「scaffold ready」再跑。
> 21:00 若仍有 P0，freeze 順延，先修完再啟動夜間迴圈；不要讓夜間迴圈去修 freeze 前的已知問題。
> **11/14 上午的「初版」= A 09:00 commit＋push 第一版程式碼到 GitHub，讓 B／C 09:05 clone；不是 NASA submission。** NASA Space Apps 的 project 頁面才是 submission 平台；11/14 只準備文案、截圖與草稿，**不按 final submit**。11/15 由 A 確認 repo 已轉 public、成品 URL 可開、影片可看後，才把 GitHub repo 連結與成品 URL 上傳到 project 頁面並送出。11/14 不要為了卡位送出缺影片／缺連結的版本。

### 7.1 夜間自動測試與修復（A 機，22:30–02:00；07:30 更新報告）

**目標：** 把下午寫好的測試當守門員；晚上只修測試抓到的 P1／P2（P0 當天由 A 修完），不讓 Claude 自由重構。**不是**讓 Claude 自己無限迴圈、自己決定要不要 push。**同時 C 機在做 30 秒影片，兩台不共用同一個 repo 工作區。**

**流程（runner 腳本管迴圈，Claude 只做單次修復）：**

- Runner 放 `tests/e2e/overnight.mjs`（A 管）；A 在 `package.json` 加 `test:e2e:known`，runner 用 `node` 直接跑。
- 夜間修復用 Sonnet 等級以上的模型；不要用 Haiku 修 P0／P1。
- 22:30 前關掉 A 的互動 Claude session 與編輯器自動儲存；夜間只有 runner 這一個 process 會寫 repo。
- **C 機不跑測試迴圈**；22:00 接手 `tools/video/**` 後只寫 `output/` 與影片管線，不改遊戲 `src/`。C 的影片從 **A 21:00 部署的 freeze build** 錄，所以 A 夜間 commit 不會改變錄影內容；A 夜間**不 deploy**。

1. 22:30 `git pull --rebase origin main`；確認 working tree 乾淨、`npm ci` 已完成；開一個 `overnight` issue（`gh issue create --label overnight --title "Overnight QA 11/14" --body "..."`，非互動）。
2. 若 pull 後 `package.json`／lock 有變，先 `npm ci`；跑 `npm run lint`（若有）、`npm test`、`npm run build`、`npm run test:e2e`（一般 suite，排除 `@known-bug`；對 local `npm run preview`，不是部署版）。
3. 一般 suite 綠 → 跑 `npm run test:e2e:known`；每個失敗是一個待修 bug。一般 suite 有紅就先修 regression，不要碰 known 佇列。
   - 佇列來源：下午 C／B 找到、當天來不及修的 **P1／P2**；**P0 不進佇列**，當天由 A 修完。
4. 一次只把**一個 failing test** 的錯誤訊息與相關檔交給 `claude -p`（headless）修一次。
5. 修完先 `npm run build`（E2E 對 `dist/`），再重跑同一測試＋一般 suite；綠才 commit；不綠就丟棄該次修改，重試一次。第二次仍失敗 → 停止這個 bug，記進報告。
6. 綠的定義：lint＋一般 suite 全綠＋這次修的 known test 綠；其他 known test 可以仍紅。該 known test 變綠後，**runner** 移除 `@known-bug` 標記並一併 commit（只改 tag，不改 assertion）。
7. 綠色 commit：`fix: issue-<n> ...`（`[visual]` 另加）；`git pull --rebase origin main` → `git push origin main`；push 被拒就再 pull 一次，仍失敗就停止，**不 force**。
8. 最多 6 次修復、3 個未解 bug、或 02:00（以先到者為準）停止，避免燒光額度。
9. push 後看 GitHub Actions 一次；CI 紅就嘗試 `git revert <剛推的 SHA>` 並 push，然後停止迴圈；revert 失敗就停止並在報告標記，不要無人時一直重試。
10. 迴圈結束（02:00 或全綠）先寫 `output/overnight/report.md`；07:30 再跑一次全套，更新報告：測試結果、commit SHA、未解問題、需要的早晨動作。用 `gh issue comment <n> --body-file output/overnight/report.md` 貼回 issue；A 早上直接讀本機報告，C／B 從 GitHub issue 讀。

**護欄（runner 強制，不靠 Claude 自律）：**

- **測試檔不可改：** `tests/**`、`src/**/*.test.ts` 修復前後 hash 必須相同；改了就直接丟棄該次修改。唯一例外：runner 在 known test 變綠後移除 `@known-bug` 標記。
- 修復只能改 `src/**`（`logic-only` 再排除 components／styles）；diff 出現其他檔就丟棄。**`tools/video/**`、`output/**` 不在修復範圍**；22:00 後那是 C 的工作區。
- `package.json`、`package-lock.json`、`vitest.config.*`、`playwright.config.*`、`wrangler.jsonc`、`.github/**` 不可改。
- 不 deploy、不碰 `.dev.vars`、不跑 `wrangler`、不 force push、不 `reset --hard`。
- 不改測試來讓它變綠；不刪測試、不把 failing test 改成 skip／fixme、不放寬 assertion（`@known-bug` 佇列是刻意隔離，不算 skip）。
- **影片路徑是 freeze lock：** §3.4 與 §5.2 的 HUD 數值（62／58／55／5／82／3 → 42／58／80／5／82／3）與 `?video=report` 必須保持綠。若某個邏輯修正會改變這些值，測試會紅，runner 不得改測試或 fixture 來配合；記進報告，早上由 A 判斷是否重錄影片。
- 一次只修一個 failing test；不改文案風格、不重構、不加功能。
- 網路／額度／登入錯誤 → 立即停止，不要重試到天亮。**C 的影片 session 也在用同一個訂閱**；A 的迴圈上限 6 次，遇到 429 就停，不要和影片搶資源。
- rebase 衝突 → `git rebase --abort`，停止該次修復，記報告；不要幫別人解衝突。
- `claude -p` 用專案 allow rules 執行：只能 Read／Edit `src/**`、跑 `npm test`／`npm run build`／`npm run test:e2e`／唯讀 `git status|diff|log|show`；**commit／pull／push 由 runner 做**；不要用 `--dangerously-skip-permissions`。

**影片 freeze 的例外：**

- 22:30 前由 A 選模式：**`logic-only`（預設）** 只修 `src/game/**`、`src/state/**`、`src/data/**`、i18n key（不改字串值）、a11y 屬性；視覺／文案問題只寫進報告，早上再修。
- **`allow-visual`** 才可改 `src/components/**`、樣式、文案或圖片；這類 commit 訊息加 `[visual]`，早上 **C 重錄受影響鏡頭**或 A revert。不能假設 21:00 錄的影片還對得上。

**早上驗收（A，09:00–09:30）：**

- 先 `git pull --rebase origin main`，再看本機 `output/overnight/report.md`、GitHub 上的 `overnight` issue 與 `git log --oneline`。
- 跑一次全套測試；看 GitHub Actions。
- 壞的 commit `git revert`；有 `[visual]` 就由 C 重錄或 A revert。
- 決定是否重新 deploy；deploy 後 C 才錄影片的最終版。

## 8. 11/15 時間表（三機）

| 時間 | A 主機 | B 測試機 | C 協作機 |
|---|---|---|---|
| 09:00–09:30 | 讀夜間報告、跑全套、revert 壞 commit；整理 P0 | 開機、等新 build | 看影片 v1、檢查 submission 連結 |
| 09:30–10:30 | 修夜間報告的 P0；必要時 deploy v0.2 | 測新 build | 影片 v2／補錄；更新 submission 文字與截圖 |
| 10:30–11:30 | 切英文預設、deploy | 回歸測試 | 影片 QA、專案頁欄位 |
| 11:30–13:00 | 修最痛的 5 個問題 | 重測修正 | 連結、licenses、credits 總檢查 |
| 13:00–14:00 | 午餐 | 午餐 | 午餐＋最終連結檢查 |
| 14:00–16:00 | 無障礙、效能、跨瀏覽器；**16:00 code freeze** | 最後一次兒童視角試玩 | E2E 全套、Lighthouse、404／OG 檢查 |
| 16:00–18:00 | 最終 QA、deploy final | 乾淨瀏覽器驗證 | 最終截圖、影片上傳素材、更新 README |
| 18:00–20:00 | **你按 submit** | 驗證連結 | 在旁核對欄位 |
| 20:00–23:59 | 只修 critical bug | 休息 | 監看 project page 是否正常 |

> **11/15 code freeze 16:00。** 16:00 後 A 只修 critical bug；C 不再重錄影片，除非 A 明確說某個 critical fix 不影響畫面。影片要在 16:00 前定稿，避免最後一刻重錄。 

## 9. 部署、測試 URL 與截圖

- **只有 A 部署。** 每次部署後在群組貼：build 標籤、URL、這次改了什麼。
- B 測**部署版**；若網路斷，A 用 `npm run dev -- --host` 開 LAN，B 連 `http://<A-IP>:5173`（防火牆要放行）。
- C 截圖用**無痕視窗**，固定 1440×900；手機版用 844×390 橫放。每次 UI 大改就重截，不要用舊圖交 submission。
- 截圖只截遊戲，不截桌面、不截聊天、不截帳號資訊。
- **影片一律從 A 的 21:00 部署 freeze build 錄**（`https://mars.flymymind.com`），不要錄 localhost、不要錄 `npm run dev`。C 在錄影前先確認 build 標籤與 A 貼的一致；A 夜間不 deploy。

## 10. 金鑰、隱私、提交

- `.dev.vars` 只存在 A 機；B／C 的 clone 不會有（gitignored）。
- 線上遊戲打 Worker，key 在 Cloudflare Secret；客戶端不需要 key。
- 不在 issue、聊天、截圖、commit 訊息出現任何 key 或 token。
- 不錄小孩的影像與聲音；playtest 記錄用代號。
- repo 11/15 才轉 public；B／C 不要改 visibility。
- submission 由你按；C 只準備草稿。送出前檢查：影片 URL、repo URL、demo URL、credits（含 NASA/JPL-Caltech/MSSS）、沒有小孩個資。

## 11. 風險與備案

| 風險 | 徵兆 | 備案 |
|---|---|---|
| B／C 的 Claude 額度用完 | 一直 429／被限制 | B 口頭回報、你修；C 優先保影片，文件與 P1 測試往後排 |
| push 被拒 | non-fast-forward | `git pull --rebase origin main` 後再推；不 force |
| rebase 衝突 | 同一檔被兩台改 | 檔主解；不是你的檔就 `git rebase --abort` 並問 owner |
| 直接推送弄壞 `main` | build／CI 紅燈、白屏 | 最後推的人 15 分鐘內修好或 `git revert`；不要 reset |
| 小孩機不穩／當機 | 無法開 issue | 用平板直接玩，你代開 issue；B 機重開 |
| 網路斷 | 部署版打不開 | 快照可離線；A 開 LAN；手機熱點 |
| C 不能登入 submission 平台 | 沒有帳號 | C 產草稿，你在 A 機貼上並送出 |
| 小孩累了 | 注意力下降 | 停止測試，不勉強；正式場只有 20 分鐘 |
| 三台同時改同一檔 | 衝突 | 檔案所有權＋LOCK 公告；先做別的 |
| **C 工作量過載（圖片＋測試＋影片）** | 下午 E2E 還沒綠、晚上才開始摸影片 | 優先序：影片 > 影片路徑 E2E > 其他 E2E > 圖片壓縮 > P1/P2；圖片先去背，壓縮可 11/15 補；E2E 只保 P0 與影片路徑 |
| 夜間自動修復改壞 `main` | 早上 CI 紅燈或白屏 | 測試檔 hash 不可變、綠才 push、最多 6 次；早上 A 先跑全套，壞的 `git revert` |
| E2E 偶發紅（flaky） | 同一測試有時過有時不過 | 只 retry 1 次；flaky 不自動修，記報告；不要放寬 assertion |
| 夜間修到視覺／文案 | 影片與 build 對不上 | commit 加 `[visual]`；早上 C 重錄或 A revert；不確定就不要在夜間改 |
| **A 機器睡著／斷網** | 07:30 沒有報告 | 插電、關休眠；沒報告就當沒修，09:00 手動跑全套 |
| **C 機器睡著／斷網** | 影片 v1 沒產出 | 插電、關休眠；09:00 用 11/15 16:00–18:00 備案重錄 |
| 夜間 Claude 額度用完 | `claude -p` 或 C 影片 session 失敗 | 立即停止、寫報告；不要重試到天亮；影片腳本可重跑，不要讓 Claude 反覆重剪 |
| **影片錄到舊 build／localhost** | 影片數字與 freeze build 不一致 | C 錄前對 A 的 build 標籤；只錄部署 URL；不一致就停，不要改畫面數字 |

## 12. 11/13 20:00 sync 議程（15 分鐘）

- [ ] 三台都跑過 §6.7 驗收，貼版本號。
- [ ] 確認 B／C 的 GitHub 登入（三台都直接推 `main`；B 用家長帳號）。
- [ ] 確認直接推送協定：`pull --rebase` → build → push；不 force；壞了 revert。
- [ ] 確認 LOCK／UNLOCK 在群組怎麼貼。
- [ ] 確認 issue 標籤：`bug`、`p0`、`p1`、`p2`、`fix-ok`、`submission`、`overnight`；11/14 09:10 由 A 建 `overnight`（`gh label create overnight`）。
- [ ] 確認 11/14 09:00 A commit＋push 第一版程式碼，B／C 09:05 才 clone；之前不碰 repo。
- [ ] 確認 11/15 由 A 上傳 GitHub repo＋成品 URL 並按 final submit；11/14 只準備草稿，不按 NASA submit。
- [ ] 確認 C 上午圖片去背／壓縮、下午寫 E2E、晚上做影片；A 晚上跑 §7.1；B 不留守、晚上關機。
- [ ] 確認 C 已裝 Pillow／rembg／ffmpeg／edge-tts，並跑過 §6.7 煙霧測試。
- [ ] 確認 22:00 `tools/video/**` 交接給 C；A 之後不改。
- [ ] 確認夜間規則：A 的 runner 測試檔不可改、綠色才 push、不 deploy、`[visual]` 早上 C 重錄。
- [ ] 確認模型分配與額度（A 夜間 Sonnet+；C 影片以腳本為主）。
- [ ] 確認 11/14 08:30 全員 ready。

## 13. 今天（11/12）可先做

- [x] 寫好這份計畫。
- [x] 建立 repo 根目錄 `CLAUDE.md`（三個 session 的共同規則；11/14 09:00 一併 commit）。
- [ ] 印好 `docs/playtest.md` 第 6 節記錄表（11/13 晚上）。

## 14. 共同規則（可直接貼進 `CLAUDE.md`）

- 回覆用繁體中文；遊戲文案中英雙語，英文為預設語言。
- 不讀、不印、不複製 `.dev.vars`；不把任何 key 貼進聊天、issue、截圖或 commit。
- 三台都直接推 `main`：推前 `pull --rebase`、跑 build／test、推後確認 main 綠燈；不 force push。
- 只有 A 能 `wrangler deploy`、改 Cloudflare。一個檔案同一時間只有一台機器改；動共用檔前先 LOCK。
- 小孩機不錄音、不錄影、不拍小孩；只截遊戲畫面。
- 事件卡與知識卡文案以 `docs/event-cards.md`、`docs/glossary.md` 為準；不自行新增 NASA 事實。
- 所有 NASA 數字要能回指 `docs/data-sources.md`；不確定就開 issue 問，不要猜。
- 修正只改 issue 指名的檔案；不順手重構、不改文案風格、不加新功能。
- 夜間自動修復只在 A 機、照 §7.1：測試檔不可改、綠色才 push、不 deploy；C 機晚上做 30 秒影片，不跑測試迴圈；早上 A 驗收、C 審影片。
