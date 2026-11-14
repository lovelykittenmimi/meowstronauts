# 11/13 Final Check（賽前最後檢查）

> 最後更新：2026-11-12
> 位置：`docs/pre-event/preflight.md`（賽前內部紀錄，不是遊戲或 submission 內容）。
> 對應 PLAN 9.4。**11/13 白天跑 A 機可做的項目；B／C 安裝與驗收晚上其他人回家後再做；22:00 freeze。** 指令中的路徑都以 repo 根目錄為準。
> 指令以 Git Bash 為主；PowerShell 版本附在後面。每項都有「預期結果」，不符合就修，不要跳過。

---

## 1. 網域與 TLS

| # | 指令 | 預期 | 失敗時 |
|---:|---|---|---|
| 1.1 | `curl -sI https://mars.flymymind.com \| head -8` | `200`、`server: cloudflare`（這台 curl 不支援 `--http2`，不要用 HTTP/2 當通過條件） | 看 Cloudflare Worker → Settings → Domains 是否仍綁定 |
| 1.2 | `curl -sI http://mars.flymymind.com \| head -3` | `301` 且 `location: https://...` | 檢查 SSL/TLS → Always Use HTTPS |
| 1.3 | `nslookup -type=NS flymymind.com` | `clark.ns.cloudflare.com`、`dahlia.ns.cloudflare.com` | 不要動 registrar；先確認 zone 仍 Active |
| 1.4 | `nslookup mars.flymymind.com` | 回 Cloudflare IP | 同上；DNS 傳播最多 24h |
| 1.5 | 瀏覽器開 `https://mars.flymymind.com` | 憑證有效、無警告 | 憑證由 Cloudflare 簽發；不要改 SSL 模式 |

**不要做的事：** 不要把 SSL/TLS 改成 Full (strict)。zone 同時服務既有 `flymymind.com` 主站，origin 憑證若不受公開信任會讓主站 526。Worker custom domain 沒有 origin，維持 Full 不影響 `mars`。

## 2. Cloudflare Worker 與密鑰

| # | 檢查 | 預期 |
|---:|---|---|
| 2.1 | Dashboard → Workers & Pages → `meowstronauts` | 存在、有 custom domain |
| 2.2 | Settings → Variables and Secrets | `NASA_API_KEY` 存在，型別 Secret，**看不到值** |
| 2.3 | 本機 `.dev.vars` | 只有本機用；`git check-ignore -v .dev.vars` 命中 `.gitignore` |
| 2.4 | 舊 key | 已撤銷（api.nasa.gov 重新產生時舊 key 應失效；不確定就再產一次） |

> 11/13 還沒有 `wrangler.jsonc`，所以 `wrangler secret list` 可能找不到專案；用 Dashboard 確認即可。11/14 建好 Worker 專案後再跑一次 `npx wrangler secret list`（只顯示名稱，不顯示值）。
>
> **2026-11-12 已確認：** 使用者在 Dashboard 目視確認 `NASA_API_KEY` 型別為 **Secret**、值隱藏；2.2 通過。
>
> 2026-11-12：`npx wrangler@latest --version`＝4.161.0，npx 可用，不必全域安裝（使用者已在 PowerShell 實測）。`npx wrangler login` 會開瀏覽器授權；`npx wrangler secret list` 等 11/14 建好 wrangler 專案再跑。

### 2.5 wrangler 是什麼、你要做什麼

**一句話：** wrangler 是 Cloudflare 的官方命令列工具，用來把 Worker 部署上去、管理環境變數與 secret。它不是遊戲的一部分，也不會影響網域設定。

**今天（11/12）不用做任何事。** 11/13 想先確認工具可用，照下面做：

| 步驟 | 指令／動作 | 預期 |
|---:|---|---|
| 1 | 開 Git Bash，cd 到 repo | 路徑結尾是 `project/Mars` |
| 2 | `npx -y wrangler@latest --version` | 印出 `4.x`（已測 4.161.0）；第一次會下載幾十秒 |
| 3 | （可選）`npx wrangler login` | 開瀏覽器；用 Cloudflare 帳號按 Allow |
| 4 | （可選）`npx wrangler whoami` | 顯示你的 email 與 account；沒有 login 會提示先登入 |
| 5 | Worker secret 用 **Dashboard** 看 | Workers & Pages → `meowstronauts` → Settings → Variables and Secrets → `NASA_API_KEY` 型別 Secret、值顯示為隱藏 |

**不要做：**

- 不要跑 `wrangler secret put NASA_API_KEY`；那會覆蓋現有 key，而且值會出現在 shell history。
- 不要跑 `wrangler deploy`；11/13 還沒有遊戲專案，部署沒有意義。
- 不要為此全域安裝 `wrangler`；`npx` 已足夠，版本也較新。

**11/14 建好 `wrangler.jsonc` 之後**，才需要 `npx wrangler secret list`（只列名稱，不顯示值）。若 `secret list` 說找不到專案，先確認 `wrangler.jsonc` 的 `name` 是 `meowstronauts`。

## 3. Repo 與金鑰衛生（最重要）

| # | 指令 | 預期 |
|---:|---|---|
| 3.1 | `git status --short` | 只有預期的修改；沒有 `.dev.vars`、`node_modules`、`dist` |
| 3.2 | `git check-ignore -v .dev.vars` | 命中 `.gitignore` |
| 3.3 | `git grep -n "NASA_API_KEY" -- .` | 只出現在文件說明與 `.dev.vars` 的**名稱**，沒有 40 字元的值 |
| 3.4 | `git grep -nE "[A-Za-z0-9]{40}" -- . ':!.dev.vars'` | 沒有看起來像 key 的字串（commit hash 例外） |
| 3.5 | `git log --oneline -5` | 首個 commit `1e4b4d7`；沒有把 key 帶進歷史 |
| 3.6 | GitHub repo `lovelykittenmimi/meowstronauts` | private；11/15 才轉 public |

> 2026-11-12：`git grep` 只掃已 commit 的檔案，目前文件多數未 commit。補掃工作區用 `rg -l "[A-Za-z0-9]{40}" --glob '!.dev.vars' --glob '!output/**' --glob '!node_modules/**' --glob '!**/package-lock.json' .`；只列檔名，不印內容。`rg` 預設就是 regex，不要加 `-E`（那是編碼參數）；`package-lock.json` 的 sha 片段會誤中，排除它。

**如果 3.3 或 3.4 找到真 key：** 立刻撤銷該 key、重產、更新 Worker secret 與 `.dev.vars`，**不要**只刪檔案就當沒事（歷史仍看得到）。

## 4. 資產盤點

| # | 指令 | 預期 |
|---:|---|---|
| 4.1 | `ls brand` | 3 張 avatar、3 張 full、favicon ×5、paw ×2、logo ×1、OG ×1 |
| 4.2 | `ls brand/source` | 三隻貓去背母檔＋logo 母檔＋兩張腳印原始檔 |
| 4.3 | `python -c "from PIL import Image; im=Image.open('brand/og-1200x630.jpg'); print(im.size)"` | `(1200, 630)` |
| 4.4 | `ls docs/assets/characters` | `ref-silver.jpg`、`ref-shadow.jpg`、`ref-ginger.jpg` |
| 4.5 | `ls src/data` | DONKI、REMS、照片快照 JSON／影像齊全 |
| 4.6 | 開 `brand/og-1200x630.jpg` | 標題、副標、`Fly My Mind` 都在安全區內 |

**已完成：** 11/12 的 logo 已驗證為真 alpha PNG，母檔與 512 版皆已更新（見 `brand/README.md`）。

## 5. 文件盤點

| # | 指令 | 預期 |
|---:|---|---|
| 5.1 | `ls docs` | 下列必備文件都在；其中 `preflight.md` 在 `docs/pre-event/` |
| 5.2 | 抽讀 `docs/submission.md` | 所有 `【 】` 都還是待填，沒有假數據 |
| 5.3 | 抽讀 `docs/ai-disclosure.md` | 版本欄位留空待填，沒有編造型號 |
| 5.4 | 抽讀 `docs/video-script.md` §7 | 交接清單已印出；22:30 可逐項填寫 |
| 5.5 | 抽讀 `docs/video-path.md` §8 | 三個 URL、fixture 數值、`data-testid` 清單都在；21:00 可逐項驗收 |

必備文件：`docs/` 下有 `data-sources.md`、`playtest.md`、`glossary.md`、`event-cards.md`、`balance-sheet.csv`、`wireframes.md`、`character-voices.md`、`submission.md`、`ai-disclosure.md`、`video-script.md`、`video-path.md`、`iconography.md`；`docs/pre-event/` 下有 `preflight.md`、`data-audit.md`、`worklog-2026-11-12.md`。

## 6. 開發環境

| # | 指令 | 預期 | 失敗時 |
|---:|---|---|---|
| 6.1 | `node -v` | `v24.x` | 用 nvm／官網安裝；不要用 18 |
| 6.2 | `npm -v` | `11.x` 或以上 | 隨 Node 更新 |
| 6.3 | `git --version` | 2.4x | |
| 6.4 | `gh auth status` | 已登入 `lovelykittenmimi` | `gh auth login` |
| 6.5 | `npx -y wrangler@latest --version` | 4.x（已測 4.161.0） | 確認網路；不必全域安裝 |
| 6.6 | VS Code 擴充 | ESLint、Prettier、Tailwind（若用） | 11/14 再裝 |

> 2026-11-12 實測：Node 24.19、npm 11.17、git 2.55、`gh` 已登入；`wrangler` 尚未安裝。11/13 用 `npx wrangler --version` 或 `npm i -g wrangler` 補上，不必先建 `wrangler.jsonc`。

> 11/13 不要建立**遊戲的** `package.json` 或 `vite` 專案；那是 11/14 09:00 之後的事。影片工具放 `tools/video/`，有自己的 `package.json`，與遊戲無關。

### 6.5 影片管線（11/13 預備，不碰遊戲內容）

| # | 檢查 | 預期 |
|---:|---|---|
| 6.5.1 | `ffmpeg -version` | 有輸出；沒有的話 `winget install --id Gyan.FFmpeg -e`。Git Bash 若看不到 PATH，用 `"$LOCALAPPDATA/Microsoft/WinGet/Links/ffmpeg.exe" -version`；`assemble-test.mjs` 會自己解析這個路徑 |
| 6.5.2 | Chrome／Edge | 已安裝；Playwright 用 `channel: "chrome"` 或 `"msedge"` 啟動，不另外下載瀏覽器 |
| 6.5.3 | Playwright | `npx -y playwright@latest --version` 可跑；`tools/video/` 的測試頁可錄 3 秒 WebM |
| 6.5.4 | TTS | `edge-tts` 可用（需網路）或 Windows SAPI 備援；產出一段 26–27 秒英文 WAV。**11/12：SAPI Zira rate 3＝23.8 秒；edge-tts 7.3.1 已裝，已選 Ana +45%＝26.5 秒（Aria +45%＝24.0 秒、Guy +45%＝23.4 秒備案）；樣本 `output/tts-samples.html`** |
| 6.5.5 | 字卡／字幕 | `tools/video/title-card.html`、`docs/video-script.md` §2 的英文 `.srt` |
| 6.5.6 | 剪輯腳本 | `tools/video/assemble-test.mjs` 可把測試片段＋WAV＋字幕輸出 1920×1080 MP4；正式版 11/14 建 |
| 6.5.7 | 輸出資料夾 | `output/` 已存在且在 `.gitignore` |
| 6.5.8 | 10 秒測試片 | 長度、字幕、音量、解析度都正確 |

> §6.5 只裝工具與測試假畫面；**不要錄遊戲、不要生成最終圖**。遊戲的 `package.json` 仍然 11/14 09:00 後才建立。
>
> **C 機也要跑一次 §6.5.1–§6.5.4 與 §6.5.7**，因為 11/14 晚上由 C 做影片；repo 已放 `tools/video/narration-ana-45.mp3`（158,832 B，26.5 秒），C 先用它轉 WAV，不必依賴夜間網路 TTS。若腳本有改才重產。

## 7. GitHub 與 CI

| # | 檢查 | 預期 |
|---:|---|---|
| 7.1 | `.github/workflows/ci.yml` 存在 | 有；沒有 `package.json` 時會乾淨跳過 |
| 7.2 | Actions 頁 | 最近一次 run 是綠色（或「no jobs」但沒有紅） |
| 7.3 | Branch protection | 這次不需要；private repo 即可 |

> 2026-11-12 團隊決定：11/13 不先 commit/push；**11/14 09:00 做賽前唯一一次 commit**（賽前文件＋scaffold），09:10 再看 Actions。7.2 在 11/13 不列為阻擋項；若 11/14 09:10 仍沒有 run，再查 workflow 是否被 GitHub 辨識。09:00 之後的 commit 都屬於比賽期間的開發，照常 commit／push，不與賽前工作混淆。

## 8. Playtest 準備

| # | 檢查 | 預期 |
|---:|---|---|
| 8.1 | 人數 | 已確認：1 位 12 歲兒童（團隊成員）；家長兩人在場；不追加第二位 |
| 8.2 | 時段 | 11/14 17:30 已確認（2026-11-12）；11/15 不追加兒童場 |
| 8.3 | 家長同意 | 家長在場＋口頭說明；不錄影、不錄音、不簽書面同意 |
| 8.4 | 記錄表 | `docs/playtest.md` 第 6 節印好，一張 |
| 8.5 | 裝置 | 平板×1；備用手機×1；電量 > 80%；Chrome／Safari 最新 |
| 8.6 | 重置流程 | 測試前清 `localStorage`、縮放 100%、關通知 |
| 8.7 | 三台電腦 | B／C 已裝 Git、Node 24、GitHub CLI、Claude Code；**三台都直接推 `main`**（推前 `pull --rebase`＋build，不 force）；B 用家長 GitHub 帳號、只修 `fix-ok` 的檔；兩台都沒有 `.dev.vars`（見 `docs/pre-event/multi-machine-plan.md` §4、§6、`b-c-setup-and-prompts.md`） |
| 8.8 | 夜間機器 | **A 機**插電、關休眠／關自動重開機、網路穩定、Claude Code 已登入，22:30 跑測試迴圈；**C 機**插電、關休眠、網路穩定（TTS 備援需要）、ffmpeg／Pillow／rembg／edge-tts 可用，22:30 做影片；B 機晚上關機。C 的 Playwright 由 11/14 repo 的 `package.json` 提供，11/13 不先裝（見 `docs/pre-event/multi-machine-plan.md` §6.4、§7.1） |
| 8.9 | C 的影片工具 | `ffmpeg -version`、`python -m edge_tts --version`、`python -c "import rembg"`、Pillow 都有輸出；用 Ana +45% 產一段測試音檔，ffprobe 看得到音軌（見 `docs/pre-event/multi-machine-plan.md` §6.7） |

## 9. 內容與資料誠實（抽檢）

- [ ] 全站沒有「strong geomagnetic storm」字樣；只有「strong solar flare」。
- [ ] 火星天氣只寫「很冷」，不寫百分位排名。
- [ ] 快照面板標「snapshot, not live」。
- [ ] 每張知識卡都有 NASA 來源或標「一般科學知識」。
- [ ] 三隻貓名字拼字：Silver、Shadow、Ginger。
- [ ] 遊戲名拼字：Meowstronauts: Mars Outpost。
- [ ] 影片腳本數字與 `docs/balance-sheet.csv` 一致：S1 加厚遮蔽 `power −20, shield +25`；背包 9/20。
- [ ] 影片使用 S1 太陽閃焰故事；沒有把 P1 太陽能板積塵的舊數字 `shield −5` 帶進來。

> 11/13 還沒有遊戲畫面，第 9 節先用文件與文案草稿抽檢；11/14 晚上再對實際 build 抽一次。

## 10. 22:00 Freeze

- [ ] 上面 1–9 全數通過，或已知問題已記錄。
- [ ] 18:30 第二次賽前整理完成（`docs/pre-event/README.md` §4）：沒有暫存產物、重複檔，連結都指向 `docs/pre-event/`。
- [ ] §6.5 影片管線測試通過（10 秒測試片）。
- [ ] `docs/video-script.md` §7 交接清單與 `docs/video-path.md` §8 驗收清單已印出。
- [ ] 11/14 09:00–10:30 生成最小圖集 8 張（不是 27 張）。
- [ ] 電源設定插電不休眠；VSCode 不關。
- [ ] 不再新增文件、不再改文案、不再生成圖。
- [ ] A 機夜間 runner 設定：插電、不休眠、網路、Claude 登入、22:30 啟動（§8.8）。
- [ ] C 機夜間影片設定：插電、不休眠、網路（TTS 備援）、ffmpeg／Pillow／rembg／edge-tts、22:00 影片交接（§8.8–§8.9）。
- [ ] 手機、平板、筆電充電線收好。
- [ ] 鬧鐘設 08:00；11/14 09:00 開工。
- [ ] 睡覺。

## 11. PowerShell 對照（如果你不用 Git Bash）

```powershell
curl.exe -sI https://mars.flymymind.com | Select-Object -First 5
curl.exe -sI http://mars.flymymind.com | Select-Object -First 3
Resolve-DnsName -Name flymymind.com -Type NS
git check-ignore -v .dev.vars
Select-String -Path .gitignore -Pattern "dev.vars"
node -v; npm -v; git --version; gh auth status
```

> `curl` 在 PowerShell 是 `Invoke-WebRequest` 的 alias，請用 `curl.exe` 才會拿到 raw header。

## 12. 如果時間不夠

依序砍：第 7 節（CI 可以 11/14 再弄）→ 第 6.6（擴充）→ 第 4.6（OG 目視）→ 第 8.6（現場再設定）。
**不能砍：** 第 3 節（金鑰）、第 1 節（網域）、第 8.1–8.3（playtest 準備與家長在場）。
