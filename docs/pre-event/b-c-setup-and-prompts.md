# B／C 機預裝與 Claude Code 指令（2026-11-13）

> 這份文件只列**需要安裝**的工具與**可以直接貼給 Claude Code** 的指令。
> 已經裝過、版本符合的就跳過，不必重裝；版本較舊就只升級該工具；缺的再補。
> 關聯：`docs/pre-event/multi-machine-plan.md` §6–§7、`docs/test-plan.md` §14、`docs/video-script.md` §7、`docs/video-path.md` §8。

## 0. 分工速查

| 機器 | 主要工作 | 11/14 晚上 |
|---|---|---|
| **A 主機** | 核心程式、部署、夜間自動測試／修復 | 22:30 跑 runner |
| **B 測試機** | 小孩遊玩、開 issue、被指派的小修 | 關機 |
| **C 協作機** | 圖片去背／壓縮、E2E、30 秒影片 | 22:00 接手影片 |

**只有 A 能 `wrangler deploy`、改 Cloudflare、按 final submit。**
B／C 都不需要 `.dev.vars` 或 NASA API key；本機跑遊戲用快照。

---

## 1. B 機：需要安裝與設定

### 1.1 需要安裝

| 工具 | 用途 | 版本檢查 |
|---|---|---|
| Git for Windows | clone、`pull --rebase`、push | `git --version`（2.4x 以上） |
| Node.js 24 LTS＋npm | 本機 build、跑 Vitest | `node -v`（v24.x）、`npm -v` |
| GitHub CLI | 開 issue、push | `gh auth status` |
| Claude Code | B 的 session | `claude --version` |
| Chrome 或 Edge 最新版 | 測部署版、截圖 | 可開空白頁 |

```powershell
winget install --id Git.Git -e --source winget
winget install --id OpenJS.NodeJS.LTS -e --source winget
winget install --id GitHub.cli -e --source winget
npm install -g @anthropic-ai/claude-code
```

### 1.2 設定

```powershell
gh auth login          # 用家長的 GitHub 帳號
claude                 # 首次開 → /login
git config --global user.name "B Tester"
git config --global user.email "你的信箱"
```

### 1.3 先確認機器位元數

Node.js 24 需要 64-bit Windows：

```bash
echo $PROCESSOR_ARCHITECTURE
```

- 出現 `AMD64`：可以照上面安裝。
- 不是 `AMD64`，或 `node -v` 一直裝不到 v24：B 只測 A 的部署版、開 issue；**不要**在本機 build／push，修正交給 A 或 C。

### 1.4 11/13 驗收

在**空資料夾**執行，不要碰真 repo：

```bash
node -v
npm -v
git --version
git config --global user.name
git config --global user.email
gh auth status
claude --version
```

預期：Node v24.x、npm 11.x、Git 2.4x 以上、GitHub 已登入、Claude Code 有版本號。

---

## 2. C 機：需要安裝與設定

C 的開發工具與 A 相同；另外需要影像與影片工具。Playwright 由 11/14 repo 的 `npm ci` 提供；`wrangler` 與 Cloudflare 登入只留在 A 機。

### 2.1 需要安裝

| 工具 | 用途 | 版本檢查 |
|---|---|---|
| Git for Windows | clone、push | `git --version` |
| Node.js 24 LTS＋npm | build、E2E、專案工具 | `node -v`、`npm -v` |
| GitHub CLI | issue、push | `gh auth status` |
| Claude Code | C 的 session | `claude --version` |
| Chrome 或 Edge 最新版 | E2E、錄影、截圖 | 可開空白頁 |
| Python 3.12 | 影像處理、TTS | `py --version` |
| Pillow | 裁切、resize、WebP | `py -c "from PIL import Image; print(Image.__version__)"` |
| rembg＋onnxruntime | 角色頭像去背 | `py -c "import rembg; print('rembg ok')"` |
| ffmpeg | 剪片、字幕、音軌、ffprobe | `ffmpeg -version` |
| edge-tts | TTS 備援 | `py -m edge_tts --version` |
| Playwright | E2E；11/14 由 repo 提供 | `npx playwright --version`（clone 後） |

```powershell
winget install --id Git.Git -e --source winget
winget install --id OpenJS.NodeJS.LTS -e --source winget
winget install --id GitHub.cli -e --source winget
winget install --id Python.Python.3.12 -e --source winget
winget install --id Gyan.FFmpeg -e --source winget
npm install -g @anthropic-ai/claude-code

py -m pip install --upgrade pillow rembg onnxruntime edge-tts
```

### 2.2 設定

```powershell
gh auth login
claude
git config --global user.name "C Collaborator"
git config --global user.email "你的信箱"
```

### 2.3 11/13 驗收與煙霧測試

```bash
node -v
npm -v
git --version
gh auth status
claude --version
ffmpeg -version
py --version
py -c "from PIL import Image; print('Pillow', Image.__version__)"
py -m edge_tts --version
py -c "import rembg; print('rembg ok')"
npx -y playwright@latest --version
```

再做三個煙霧測試，全部放在 `C:\tmp\c-smoke`，不要碰 repo：

1. 用 Pillow 產一張 512×512 測試圖，跑一次 rembg 去背，確認輸出有 alpha。
2. 用 edge-tts 產一句 `en-US-AnaNeural --rate=+45%`，用 ffprobe 確認有音軌。
3. 用 ffmpeg 產 3 秒 1920×1080 30fps 測試片，確認可播放。

> 若 `ffmpeg -version` 在 Git Bash 找不到，先關掉終端再開；winget 版的執行檔在 `%LOCALAPPDATA%\Microsoft\WinGet\Links\`。仍找不到就把該資料夾加進 PATH，並確認 `ffprobe` 也在同一資料夾。

### 2.4 C 的硬體與電源

- 至少 8 GB RAM、10 GB 可用磁碟（rembg 模型與影片輸出）。
- 11/14 晚上插電、關休眠、關 Windows 自動重開機。
- 影片旁白優先用 repo 的 `tools/video/narration-ana-45.mp3`（158,832 B，26.5 秒），可離線使用。

---

## 3. 共通工作邊界

這不是安裝清單，是三台都適用的工作規則：

- **金鑰：** `.dev.vars`、NASA key、Cloudflare token 只在 A 機；不貼進聊天、issue、截圖或 commit。
- **部署：** 只有 A 能 `wrangler deploy`、改 Cloudflare、按 final submit。
- **推送：** 三台都直接推 `main`；推前 `git pull --rebase`、`npm run build`，推後確認 CI 綠；不 force push。
- **所有權：** 一個檔案同一時間只有一台機器改；動共用檔前先 LOCK。
- **隱私：** 不錄小孩的影像與聲音；playtest 用代號，只截遊戲畫面。
- **B 的舊機器：** 若 `npm run build` 超過 10 分鐘或記憶體不足，停止本機修改，只回報 issue。

---

## 4. 11/13：今天要下的指令

### 4.1 B 機（直接貼）

```text
你是 B 機（小孩測試機）的 Claude。今天只做環境確認，不 clone repo、不寫程式、不 commit。

請確認以下工具可用；已經安裝且版本符合就跳過，缺的再安裝：
- Git
- Node.js 24 LTS＋npm
- GitHub CLI
- Claude Code
- Chrome 或 Edge

執行並用表格回報：
node -v
npm -v
git --version
gh auth status
claude --version
echo $PROCESSOR_ARCHITECTURE

若 Node 不是 v24，先回報目前版本與 Windows 位元數，再決定怎麼補。
```

### 4.2 C 機（直接貼）

```text
你是 C 機（協作機）的 Claude。今天只做環境確認與工具煙霧測試，不 clone 遊戲、不寫遊戲程式、不 commit。

請確認以下工具可用；已經安裝且版本符合就跳過，缺的再安裝：
- Git、Node.js 24 LTS＋npm、GitHub CLI、Claude Code、Chrome 或 Edge
- Python 3.12＋Pillow
- rembg＋onnxruntime
- ffmpeg
- edge-tts
- Playwright（11/14 由 repo 的 npm ci 提供；今天只確認 npx playwright --version）

執行並回報：
node -v
npm -v
git --version
gh auth status
claude --version
ffmpeg -version
py --version
py -c "from PIL import Image; print('Pillow', Image.__version__)"
py -m edge_tts --version
py -c "import rembg; print('rembg ok')"
npx -y playwright@latest --version

再做三個煙霧測試，全部放在 C:\tmp\c-smoke，不要碰 repo：
1. 用 Pillow 產一張 512×512 測試圖，跑一次 rembg 去背，確認輸出有 alpha。
2. 用 edge-tts 產一句 en-US-AnaNeural --rate=+45%，用 ffprobe 確認有音軌。
3. 用 ffmpeg 產 3 秒 1920×1080 30fps 測試片，確認可播放。

用表格回報：項目／版本或結果／OK 或 FAIL／備註。
```

---

## 5. 11/14：B 機的指令

### 5.1 白天角色（直接貼）

```text
請先讀 CLAUDE.md、docs/pre-event/multi-machine-plan.md §5、docs/qa-checklist.md、docs/playtest.md §6。

你是 B 機（小孩測試機，機器較舊）。今天做四件事：
1. 用瀏覽器測 A 部署的 URL（不是 localhost），把小孩口述的問題先重現，再整理成 issue。
2. 只有 issue 有 fix-ok 標籤才能改；只改 issue 指名的檔；30 分鐘內完成；超過就交回 A。
3. **19:00 之後負責 E2E**：`tests/e2e/**` 與 `playwright.config.ts` 歸你（LOCK），指令見 §5.3。
4. 修正後照這個順序：
   git pull --rebase origin main
   npm run build
   git commit -m "fix: ..."
   git pull --rebase origin main
   git push origin main

Issue 格式：
[P1] 一句話
Build:
Steps:
Expected:
Actual:
Screenshot:

若缺少工具，或 npm run build 超過 10 分鐘，停止本機修改，回報 issue；不要為此改 package.json。
每次回報附 issue 編號與 commit SHA。
```

### 5.2 17:30 playtest（直接貼）

```text
現在是 11/14 17:30 playtest。小孩操作，你只記錄，不提示、不打斷。
用代號 P1 tester，不寫姓名、學校。只截遊戲畫面，不錄影、不錄音。
結束後把最重要的 5 個觀察整理成 issue 草稿，先給家長確認再開 issue。
```

### 5.3 19:00 之後：E2E（直接貼）

```text
任務：建立 repo 裡第一套 E2E。`tests/e2e/**` 與 `playwright.config.ts` 由你擁有（LOCK）；不要改 src/、不要改 package.json。

先裝瀏覽器：npx playwright install chromium

1. 建 playwright.config.ts：

import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:4174';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run preview -- --port 4174 --strictPort',
        url: 'http://127.0.0.1:4174',
        reuseExistingServer: true,
        timeout: 180_000,
      },
});

2. 建 tests/e2e/video-path.spec.ts，照 docs/video-path.md 的契約逐條斷言：
   - goto('/?video=s1&lang=en') → HUD resource-power 62、resource-life-support 58、
     resource-shield 55、resource-food 5、resource-health 82、resource-science 3、backpack-count '8 / 20'
   - event-card-S1 可見；choice-shield-up 可點
   - 點 choice-shield-up → resource-power 42、resource-shield 80、result-panel 可見
   - 同一個 session 內：點 term-solar-flare → knowledge-card 開 → knowledge-collect → backpack-count '9 / 20'
   - 開 data-panel-button → data-panel、donki-chart、rems-chart 都在
   - 另開一個 test：goto('/?video=report&lang=en') → mission-report-stars 三顆、
     report-backpack-count '9 / 20'、report-curve 7 個點、最後一點等於 report-resource-health

3. 建 tests/e2e/full-run.spec.ts：從標題畫面玩完 7 個 sol（開場可跳過），
   每個 sol 點第一個 enabled 的 choice，最後看到 mission-report。
   清塵小遊戲（11/14 18:00 新增）：sol 1 的「Sweep the panels」與 P1 的
   「Send Shadow to clean / Shake off the dust」會先開 dust-game，清完 6 團沙塵
   才出現 result-panel。點完 choice 後照這樣處理：
   ```ts
   if (await page.getByTestId('dust-game').isVisible().catch(() => false)) {
     for (let i = 0; i < 6; i += 1) await page.getByTestId('dust-spot').first().click();
   }
   await page.getByTestId('result-panel').waitFor();
   ```
   不處理就會卡在 sol 1 等不到 result-panel。

4. 跑：npm run test:e2e。全綠就 commit：
   git pull --rebase origin main
   git add playwright.config.ts tests/e2e
   git commit -m "test: add the video-path and full-run E2E specs"
   git pull --rebase origin main
   git push origin main

規則：
- 只用 data-testid 與固定 seed；不碰 NASA API、不改 src/ 讓測試過。
- npm run build 超過 10 分鐘：改用 E2E_BASE_URL=https://mars.flymymind.com npm run test:e2e 對部署版跑，然後把這點寫進 commit 訊息。
- 21:00 freeze 前只做這兩個檔；做不完就把已綠的 spec 先推，剩下的記在 report。
- 有測試紅但確定是遊戲的 bug：不要改測試配合，開 issue 給 A，標 P1。
```

---

## 6. 11/14：C 機的指令

### 6.1 白天角色（直接貼）

```text
請先讀 CLAUDE.md、docs/test-plan.md §14、docs/video-path.md、docs/video-script.md §7、docs/pre-event/multi-machine-plan.md §3、§7。

你是 C 機（協作機）。今天的優先序：
1. 10:30–12:00 圖片去背／壓縮。
2. 13:00–21:00 submission 截圖與文案（**E2E 已於 17:40 改派給 B**，不要碰 `tests/e2e/**`）。
3. 22:00 後 30 秒影片。

每次 commit 前：git pull --rebase → npm run build → npm test → git commit → git pull --rebase → git push。
若缺少工具，先用已安裝的完成；缺的項目回報，不要改 package.json／package-lock.json。
```

### 6.2 上午：圖片去背與壓縮（直接貼）

```text
任務：把 A 放在 output/raw/ 的 8 張原圖處理成遊戲資產。

規格：
- 3 張角色頭像：512×512，去背透明，WebP q=85 或 PNG；邊緣不要白邊。
- 5 張場景：最長邊 1280 px，WebP q=82，單張 ≤ 250 KB。
- 輸出到 src/assets/generated/<name>.webp；原圖留在 output/raw/。
- 產生 src/assets/generated/manifest.json：檔名、尺寸、bytes、alt（en/zh-TW）、credit（NASA 圖才要）。
- 目標 8 張總計 ≤ 2 MB；印出 before/after 對照表。

限制：
- 不改 src/components/**、不改文案。
- 只回報 A 需要接的圖片路徑。
- 若 rembg 去背有瑕疵，先回報，不要硬修到看起來像 AI 生成。
```

### 6.3 下午：E2E 測試（**17:40 起改派 B，本節作廢**）

```text
任務：照 docs/test-plan.md §2、§3.4、§5 與 docs/video-path.md 建立 E2E。

先寫這幾個：
- tests/e2e/full-run.spec.ts
- tests/e2e/video-path.spec.ts
- tests/e2e/report-path.spec.ts
- tests/e2e/language.spec.ts
- tests/e2e/responsive.spec.ts

規則：
- 用 data-testid；固定 seed；?video=s1&lang=en；不要打 NASA API。
- 先 npm run build，再 npm run preview；不要測 dev server。
- 已知 P1／P2 放 tests/e2e/known/issue-<n>.spec.ts，test 標題加 @known-bug；P0 不進 known。
- 不要改 src/ 來讓測試綠；測試是規格。
- 每次 push 前 npm test、npm run build、npm run test:e2e 一般 suite 要綠。

回報：哪些 test 綠、哪些進 known、失敗的 issue 編號。
```

### 6.4 晚上：30 秒影片（直接貼）

```text
任務：22:00 接手 tools/video/**，22:30 前開始做 30 秒影片。A 已把 21:00 freeze build 部署到 https://mars.flymymind.com，並把 tools/video/** 交接給你。

先讀 docs/video-script.md §7、docs/video-path.md §8。

1. 只用部署 URL 錄，不錄 localhost；解析度 1920×1080、30fps。
2. 用 ?video=s1&lang=en 走：S1 卡 → 加厚遮蔽 → solar flare 知識卡 → 背包 8/20→9/20 → 資料面板；再用 ?video=report&lang=en 錄 3 星報告。
3. 旁白優先用 repo 的 tools/video/narration-ana-45.mp3（Ana +45%，26.5 秒）；需要 WAV 時用 ffmpeg 轉 48 kHz mono。
4. 用 tools/video 的剪輯腳本：英文字幕燒進影片、AAC 48 kHz、H.264、≤30.0 秒；另存 .srt。
5. 輸出 output/final-30s.mp4 + output/final-30s.srt；用 ffprobe 驗長度、解析度、音軌。
6. 若畫面數字與腳本不一致，停止並回報；不要改畫面數字或腳本硬湊。
7. 不上傳 YouTube、不送 submission、不 commit 影片、不 deploy、不改遊戲功能。
8. 早上 09:00 前產出 v1 與 output/video-report.md。
```

---

## 7. 11/15：C 機的指令

```text
今天 C 機只做三件事：
1. 跑 E2E 回歸，補 P1；不改 src core。
2. 看 A 夜間報告與新 build；若 UI 有改，重錄受影響鏡頭，16:00 前定稿。
3. 最終截圖、submission 素材、README 更新。

16:00 code freeze 後不改 code、不重錄，除非 A 明確指定 critical fix。
```

---

## 8. 使用順序

> **11/13 的 B／C 設定改到晚上其他人回家後再做**；白天先讓 A 機跑 preflight 與文件檢查。

| 時間 | B 機 | C 機 |
|---|---|---|
| 11/13 晚上（其他人回家後） | 貼 §4.1，回報版本 | 貼 §4.2，跑完煙霧測試 |
| 11/14 09:05 | clone 後 `npm ci`，等 A 說 scaffold ready | clone 後 `npm ci`，等 A 的原圖 |
| 11/14 白天 | 貼 §5.1 | 貼 §6.1，依序做 §6.2、§6.3 |
| 11/14 17:30 | 貼 §5.2 | 繼續 E2E，21:00 前給 A 綠燈 |
| 11/14 22:00 | 關機 | 接手 tools/video（22:30 開錄） |
| 11/15 | 測新 build、回歸 | 貼 §7 |

> `npm ci` 要等 A 的 `package.json`／lock 進 repo 再跑；若 09:05 還沒有，先 `git pull --rebase`，等 A 說「scaffold ready」。

---

## 9. 這份文件不重複的內容

- 三台完整時間表、LOCK 規則、夜間 runner 細節：`docs/pre-event/multi-machine-plan.md` §7.1。
- P0／P1 測試清單與影片 fixture 數值：`docs/test-plan.md` §3–§5。
- 影片分鏡、旁白、字幕：`docs/video-script.md`。
- 手動 QA 與 playtest：`docs/qa-checklist.md`、`docs/playtest.md`。
