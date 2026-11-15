# AI 使用揭露（AI Disclosure）

> 最後更新：2026-11-14（新增幕 2 迫降參考影片的揭露；NASA 來源清單更新為 S1–S22；健康內容併入 `gravity`）
> 用途：填 Space Apps submission 的 AI 揭露欄位、放進 README、必要時附在專案頁。
> **11/15 送出前把版本號與實際使用範圍更新為最終版。**

---

## 1. 一句話版本（給 submission 短欄位）

> We used AI assistants for research summarization, documentation, code scaffolding, and image and video generation. All NASA facts were checked against NASA pages, all game design decisions and final assets were made by the team, and no AI runs inside the game at runtime.

中文：我們用 AI 協助整理研究、寫文件、搭程式骨架與生成圖像、影片；所有 NASA 事實都對照 NASA 頁面查證，遊戲設計與最終素材由團隊決定，遊戲執行時不使用 AI。

## 2. 使用的工具與範圍

| 工具 | 版本／形式 | 用途 | 產出是否經人工確認 |
|---|---|---|---|
| **Claude Code**（Anthropic） | CLI；實際模型與版本於送出時記錄：`__________` | 研究整理、文件撰寫、資料快照腳本、程式骨架與測試、文案初稿 | 是。每一項都經團隊閱讀、修改或否決 |
| **Google Gemini＋Nano Banana** | GEM（自訂指令）＋圖像生成；影片生成 | 角色與場景圖像生成、OG 卡片素材、幕 2 迫降參考影片 | 是。人工挑選、裁切、去背、重新生成不合格的圖；影片重新壓縮、無聲化，只當動態背景 |
| **AI 輔助翻譯** | 併入上述工具 | 中英文文案對照 | 是。英文為預設語言，團隊逐句校對 |

> 版本號以送出當天的實際紀錄為準；若中途換模型，於此表加一列，不覆蓋舊列。

## 3. 各階段的分工

| 階段 | AI 做什麼 | 人做什麼 |
|---|---|---|
| 賽前研究（11/11–11/13） | 整理 NASA 頁面、比對資料欄位、草擬術語表 | 決定 challenge、遊戲核心、取捨規則；檢查每個連結與數字 |
| 品牌與圖像 | 依 prompt 生成角色與場景 | 定風格、寫 prompt 規則、挑圖、去背、合成、退件重做 |
| 遊戲開發（11/14 起） | 依規格產生程式碼、測試、修正 | 定規格、驗收行為、playtest、決定砍什麼 |
| 文案 | 依語氣 guide 產生初稿 | 逐句改寫、檢查兒童用語與事實正確性 |
| 提交 | 草擬描述與影片腳本 | 確認每個 claim 有證據、決定送出的版本 |

## 4. 事實查核方式

- **NASA 事實**：只採用 NASA 網域頁面（`science.nasa.gov`、`nasa.gov`、`techport.nasa.gov`）；`docs/glossary.md` 第 5 節列出 S1–S22（S8 保留未用；21 個已驗證連結，2026-11-14 更新）。
- **資料數值**：DONKI 與 Curiosity REMS 的數字直接來自 API 回應，快照存於 `src/data/`；不經 AI 改寫數值。
- **AI 產生的文字不當作資料來源**：若 AI 產出的句子含有事實，必須回查 NASA 頁面才算通過。
- **不確定就降級說法**：例如 Kp 6.33 只能寫「強烈太陽閃焰」，不寫「強烈地磁風暴」；火星天氣只寫「很冷」，不強調百分位排名。

## 5. 圖像與影片揭露

- 所有角色與場景圖為 AI 生成，prompt 與產出紀錄保存在 `docs/image-prompts.md` 與 `brand/README.md`。
- 幕 2 的背景影片為 AI 生成（Google Gemini 影片生成，2026-11-13），原始檔未進 repo；使用的版本已重新壓縮、移除音軌，只作無聲動態背景，最後一格停在核准的 `06-crash` 構圖。來源與處理記錄見 `src/assets/video/README.md`。
- 生成圖不含 NASA 標誌、任務徽章、可讀文字或浮水印；標題與按鈕由程式疊字。影片同樣不宣稱是 NASA 畫面或真實任務影像。
- 火星照片為 NASA/JPL-Caltech 公共領域素材，與 AI 生成圖分開標示；每張照片保留 NASA ID 與 credit。
- 幕 2 迫降前先播一組**真實 NASA／ESA 影像**（SDO、SOHO、Viking、Mars Trek），不是 AI 生成；2026-11-14 起這組靜圖在影片前放映約 5 秒，最後一張停在畫面上，等無線電對話推進到「然後，他們就撞上來了。」才播 AI 迫降影片（從 0 秒完整播放），兩者不重疊。畫面逐一標示 credit，清單見 `src/assets/nasa/README.md`。它們是示意鏡頭，不宣稱是當次任務或 2025-05-14 X2.7 閃焰的畫面。
- OG 社群卡為人工合成（裁切、遮罩、排版），不是單次 AI 生成。
- 30 秒 Demo 影片的第 3 鏡（04.0–09.0）是兩張**角色與場景 AI 生成圖**（`tools/video/assets/opening/`），不是 NASA 影像，也不是遊戲執行畫面；同一個迫降在遊戲內仍是預先做好的 AI 生成影片。其餘 NASA 影像在畫面右下標 `NASA/SDO` 等 credit。

## 6. 執行時（runtime）聲明

- 遊戲**不在 runtime 呼叫任何 LLM 或生成式 API**。
- 所有文字、知識卡、事件卡在 build 時就是靜態資料；NASA 資料為賽前快照，介面標明「snapshot, not live」。
- 沒有使用者帳號、沒有上傳、沒有把兒童資料送到任何伺服器。

## 7. 賽前／賽間界線（給評審參考）

| 時間 | 做的事 | 性質 |
|---|---|---|
| 11/11–11/13 | 研究、資料快照、品牌資產、wireframe、image prompts、提交模板 | 賽前準備；不含遊戲程式與遊戲內文案 |
| 11/14 09:00 起 | 遊戲程式、事件卡文案、知識卡文案、關卡與平衡 | 比賽期間完成 |
| 11/15 | playtest 修正、影片、提交 | 比賽期間完成 |

- Git commit 時間戳可佐證：public repo 於 11/15 開放，遊戲程式碼的 commit 全部在 11/14 09:00 之後。

## 8. 待補（11/15 前）

- [ ] 填入 Claude Code 實際模型與版本。
- [ ] 填入 Gemini／Nano Banana 的實際型號與使用日期（含幕 2 影片的生成模型與日期）。
- [ ] 補上實際生成張數與最後採用張數（例：生成 48 張，採用 22 張）。
- [ ] 把本文件連結放進 README 與 submission 頁。
