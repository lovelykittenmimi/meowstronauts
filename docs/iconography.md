# 圖示與品牌標記規範（11/12）

> 最後更新：2026-11-12
> 回答兩個問題：要不要先收集通用 icon？要不要用三隻貓做 UI icon？
> 結論先講：**通用 UI 用 Lucide，品牌用三貓 logo 與腳印，遊戲專屬圖示才自己畫。**

---

## 1. 三層圖示策略

| 層級 | 用什麼 | 範圍 | 為什麼 |
|---|---|---|---|
| **L1 通用 UI** | Lucide（ISC 授權，開源圖示集） | 返回、關閉、home、音量、設定、書本、背包、箭頭、星星、鎖頭 | 兒童對「箭頭＝返回」「✕＝關閉」有既有認知；自己畫會變慢又容易不一致 |
| **L2 品牌標記** | 三貓水彩 logo、黑色腳印、粉色腳印 | favicon、載入畫面、頁尾、關於面板、收藏印章、OG 卡角落 | 這是團隊的識別，不是控制項；不拿來取代箭頭或按鈕 |
| **L3 遊戲專屬** | 自繪或 AI 生成的小圖示 | 六個資源（電力、水、遮蔽、食物、健康、科學）、貓咪專長 | 這些沒有通用符號，值得自己做；MVP 可先用 Lucide 代替 |

**不要做的事**

- 不要自己畫 20 個通用 icon。時間應該花在事件卡與動畫上。
- 不要把腳印做成「返回」或「下一頁」。兒童會看不懂，而且品牌符號會被稀釋。
- 不要用 emoji 當最終圖示。`⚡💧🛡️` 在 Windows、Android、iOS 長得都不一樣，投影時尤其明顯；wireframe 裡的 emoji 只是佔位。
- 不要混用填色與線條兩種風格。全站統一線條圖示（stroke 2px）。

## 2. Lucide 使用規則

- 套件：`lucide-react`，只 import 用到的圖示（tree-shaking），不要整包載入。
- 預設尺寸 24px、`stroke-width: 2`、`color: currentColor`；小尺寸 20px 時 stroke 仍用 2，不要加粗到 2.5。
- 所有圖示必須有文字標籤；只有 icon 的按鈕要 `aria-label`，並提供 44×44 觸控區。
- 圖示與文字間距 8px；圖示不單獨作為狀態顏色（顏色不是唯一資訊）。
- 11/14 安裝後以實際版本的名稱為準（Lucide 偶爾改名，例如 `AlertTriangle` → `TriangleAlert`，舊 alias 仍可用）。

**對照表（MVP 需要的圖示）**

| 用途 | Lucide 名稱 | 尺寸 | 備註 |
|---|---|---|---|
| 返回 | `ArrowLeft` / `ChevronLeft` | 24 | 左上角，一定搭配「返回」文字 |
| 下一頁 | `ArrowRight` | 24 | |
| 關閉面板 | `X` | 24 | 44×44 熱區 |
| 首頁 | `Home` | 24 | 只出現在選單，不放在遊戲 HUD |
| 重新開始 | `RotateCcw` | 24 | 任務報告 |
| 音量 | `Volume2` / `VolumeX` | 24 | 標題畫面與 HUD |
| 設定 | `Settings` | 24 | 語言、字幕、減少動效 |
| 知識卡 | `BookOpen` | 20/24 | 虛線字旁的小書本 |
| 背包 | `Backpack` | 24 | HUD 右側 |
| 電力 | `Zap` | 20/24 | 替代 emoji ⚡ |
| 水／生命維持 | `Droplets` | 20/24 | |
| 輻射遮蔽 | `Shield` | 20/24 | |
| 食物 | `Utensils` 或 `Apple` | 20/24 | 二選一，全站一致 |
| 健康 | `HeartPulse` | 20/24 | |
| 科學 | `FlaskConical` | 20/24 | |
| 太陽／天氣 | `Sun`、`CloudFog`、`Wind`、`Snowflake` | 20 | 資料面板 |
| 通訊 | `Radio`、`Signal` | 20 | |
| 維修 | `Wrench` | 20 | 事件卡類別 |
| 警告 | `TriangleAlert` | 20 | 一定要有文字 |
| 收藏成功 | `Check` | 16/20 | 搭配品牌腳印印章 |
| 未收藏 | `Lock` 或灰剪影 | 16/20 | 背包 |
| 外部連結 | `ExternalLink` | 16 | NASA 來源連結 |
| 星星 | `Star` | 24/48 | 任務報告 |
| 播放／跳過 | `Play`、`SkipForward` | 24 | 開場分鏡 |

## 3. 品牌標記

### 3.1 三貓水彩 logo

`brand/logo-three-cats-512.png`（透明去背，原始檔 `brand/source/logo-three-cats-transparent.png`）

- **定位：團隊標記**，不是遊戲主標題。遊戲標題用 3D 主視覺與程式排字；這張水彩圖單獨出現時代表「Fly My Mind 的三隻貓」。
- **可用**：載入畫面中央（≤ 240px）、關於／團隊面板、頁尾、簡報封面、社群頭像、OG 卡角落（≤ 180px）。
- **不要用**：事件卡插圖、遊戲內場景、與 3D 角色圖並排（水彩比例與服裝和 3D 參考圖不同，兒童會混淆）。
- **背景**：米色或深色底皆可；母檔是真 alpha PNG，邊緣乾淨。若誤用 `logo-three-cats-rembg.png` 備用版，深色底才會有淡灰光暈。
- **安全區**：四周留 ≥ 0.15 × 圖高；最小顯示 96px。
- **禁止**：改色、加描邊、加陰影、旋轉、裁掉任何一隻貓、加水印文字。

### 3.2 腳印

| 檔案 | 顏色 | 用途 |
|---|---|---|
| `brand/paw-ink-256.png` | `#020202`（墨黑） | 主要標記：favicon、載入動畫、收藏印章、清單項目符號 |
| `brand/paw-pink-256.png` | `#F0A4A6`（粉） | **只做裝飾**：空狀態插圖、背景圖樣；不要用在警告、失敗、狀態色 |

- 腳印可以當「已完成／已收藏」的印章（搭配 `Check`），但不要當導航箭頭。
- 最小尺寸 24px；小於 24px 只保留 favicon 版本。
- 不要翻轉、不要加眼睛或表情、不要做成走路動畫（會變吉祥物，失焦）。
- 粉紅色不在品牌色票內；若要做狀態色，改用 `--coral #E07A5F`。

### 3.3 favicon

- 建議改用 **`brand/favicon-paw-32.png`／`favicon-paw-180.png`**：米色圓角底＋墨黑腳印。
  - 理由：16–32px 時，貓臉的細節會糊掉，腳印剪影仍可辨識；也與三貓 logo 區隔。
- 既有的 `favicon-32.png`／`favicon-180.png`（Silver 頭像）保留，作為「角色版」備案；11/14 在瀏覽器分頁實際比一次再定案。
- HTML 需同時提供 32、180 與 `apple-touch-icon`；不要只給 SVG。

## 4. 檔案清單

| 檔案 | 尺寸 | 說明 |
|---|---|---|
| `brand/logo-three-cats-512.png` | 512×512 | 去背、置中、留白 4%（215 KB） |
| `brand/logo-three-cats-512.webp` | 512×512 | 網頁用，37 KB，優先載入這張 |
| `brand/logo-three-cats-256.png` | 256×256 | 頁尾、載入畫面小圖 |
| `brand/source/logo-three-cats-transparent.png` | 677×369 | 真 alpha 母檔（內容 460×311；使用者 11/12 提供） |
| `brand/source/logo-three-cats-original.png` | 677×369 | 使用者提供的原始 PNG（保留備份） |
| `brand/source/logo-three-cats-rembg.png` | 1024×1024 | 由 JPEG 去背的備用版，深色底有光暈，非必要不用 |
| `brand/source/logo-three-cats-checkerboard.jpg` | 1024×1024 | 最早的 JPEG（棋盤格烙印在像素裡），只作紀錄 |
| `brand/paw-ink-256.png` | 256×256 | 墨黑腳印 |
| `brand/paw-pink-256.png` | 256×256 | 粉色腳印（裝飾用） |
| `brand/favicon-paw-32.png` | 32×32 | 分頁圖示 |
| `brand/favicon-paw-180.png` | 180×180 | Apple touch icon |

> 原始附件是 JPEG，棋盤格是**畫上去的像素**，不是透明背景；已用 `rembg` 去背。若日後取得真正的透明 PNG／向量檔，直接取代母檔，輸出尺寸不變。

## 5. 11/14 實作清單

- [ ] `npm i lucide-react`，建立一個 `Icon` wrapper（統一尺寸、stroke、aria-hidden）。
- [ ] 把 wireframe 裡的 emoji 全部換成 Lucide 圖示；資源列先用 `Zap`／`Droplets`／`Shield`／`Utensils`／`HeartPulse`／`FlaskConical`。
- [ ] favicon 換成腳印版，實際在 Chrome／Safari 分頁看一次（淺色與深色主題都要看）。
- [ ] 載入畫面放三貓 logo（≤ 240px），確認 1 秒內可看到。
- [ ] 收藏成功的印章：腳印＋`Check`，不要用愛心或星星（星星留給任務評分）。
- [ ] 檢查 icon-only 按鈕都有 `aria-label` 與 44×44 熱區。
