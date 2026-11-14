# 頭像使用說明（avatars）

> 位置：`src/assets/generated/avatars/`
> 產生日期：2026-11-14
> 內容：3 隻貓 × 6 表情 × 一般／透明頭盔 = **36 張**；每張提供 **200／400／800 px** 三種寬度。

這份文件讓使用時**不必再開圖確認內容**：先看表情定義與命名規則，再查最後的檔名對應表即可。
機器可讀版本（含 `srcset`、bytes、中英 `alt`）在 [`manifest.json`](manifest.json)。

## 1. 一眼看懂

| 項目 | 值 |
|---|---|
| 貓 | `silver` = 銀白長毛貓、`shadow` = 黑貓、`ginger` = 橘虎斑 |
| 表情 | `neutral`、`happy`、`worried`、`determined`、`sleepy`、`surprised` |
| 版本 | 一般版（無頭盔）、`-helmet`（透明圓頂太空頭盔，頂端有貓耳造型） |
| 構圖 | 頭肩特寫、正方形、透明背景；底部切到胸口，不裁耳朵或鬍鬚 |
| 尺寸 | 800×800（主檔）、400×400（`-400`）、200×200（`-200`） |
| 格式 | WebP q=85、alpha 透明；三個尺寸內容相同 |

## 2. 表情定義

| 表情 | 眼睛 | 嘴巴／其他 |
|---|---|---|
| `neutral` | 張開、平視 | 嘴巴閉著、表情平靜 |
| `happy` | 柔和半閉（笑眼） | 嘴角放鬆；Shadow 是「淡淡滿意」，不是大笑 |
| `worried` | 睜大、略顯不安 | 耳朵略往後、嘴巴閉小 |
| `determined` | 專注、略瞇 | 嘴巴平直、耳朵朝前 |
| `sleepy` | 眼皮沉重、半閉 | 表情放鬆、耳朵略垂 |
| `surprised` | 圓睜 | 嘴巴張開、耳朵略往後或豎起 |

角色基準：

- **Silver**：白金長毛、藍綠色眼、粉鼻；白銀太空裝配海軍藍與金色滾邊。
- **Shadow**：純黑短毛、琥珀眼；霧黑裝甲配紫色發光飾條，單眼藍色 HUD 護目鏡。
- **Ginger**：胖橘虎斑、奶油色口鼻與胸口、琥珀綠眼；橘白太空裝配多口袋。

頭盔版多了透明玻璃圓頂，可見玻璃邊緣反光；臉部表情與同表情的一般版相同。

## 3. 檔名規則與 srcset

```text
avatar-{cat}-{expression}.webp          # 800×800 主檔
avatar-{cat}-{expression}-400.webp      # 400×400
avatar-{cat}-{expression}-200.webp      # 200×200
avatar-{cat}-{expression}-helmet.webp   # 800×800 頭盔版
avatar-{cat}-{expression}-helmet-400.webp
avatar-{cat}-{expression}-helmet-200.webp
```

```html
<img
  src="avatars/silver/avatar-silver-neutral.webp"
  srcset="avatars/silver/avatar-silver-neutral-200.webp 200w,
          avatars/silver/avatar-silver-neutral-400.webp 400w,
          avatars/silver/avatar-silver-neutral.webp 800w"
  sizes="96px" width="800" height="800"
  alt="Silver, the white long-haired cat, with a calm, neutral expression.">
```

- 路徑以 `avatars/` 為基準；實際前綴依 Vite import 或 `public/` 設定調整。
- HUD、對話小頭像用 200 或 400；角色卡、大圖才用 800。
- 不要一次載入全部 36 張；依目前狀態只載入需要的那一張（或預載同角色常用表情）。
- 圓形頭像用 CSS `border-radius: 50%; object-fit: cover;`，不需要另外裁圖。
- `alt` 可直接取 `manifest.json` 的 `alt.en` 或 `alt.zh-TW`。

## 4. 檔名 ↔ 頭像對應

以下檔名均為 800×800 主檔；`-400` 與 `-200` 版本內容相同，只差尺寸。
所有檔案都在對應的貓資料夾下：`silver/`、`shadow/`、`ginger/`。

### Silver（`silver/`，銀白長毛貓）

| 表情 | 一般版 | 頭盔版 | 頭像內容 |
|---|---|---|---|
| `neutral` | `avatar-silver-neutral.webp` | `avatar-silver-neutral-helmet.webp` | 藍綠眼張開、嘴巴閉著、表情平靜；頭盔版隔著透明圓頂 |
| `happy` | `avatar-silver-happy.webp` | `avatar-silver-happy-helmet.webp` | 眼睛柔和半閉、嘴角放鬆的微笑；頭盔版隔著透明圓頂 |
| `worried` | `avatar-silver-worried.webp` | `avatar-silver-worried-helmet.webp` | 藍綠眼睜大、耳朵略後、嘴巴閉小；頭盔版隔著透明圓頂 |
| `determined` | `avatar-silver-determined.webp` | `avatar-silver-determined-helmet.webp` | 眼神專注略瞇、嘴巴平直、耳朵朝前；頭盔版隔著透明圓頂 |
| `sleepy` | `avatar-silver-sleepy.webp` | `avatar-silver-sleepy-helmet.webp` | 眼皮沉重半閉、表情放鬆；頭盔版隔著透明圓頂 |
| `surprised` | `avatar-silver-surprised.webp` | `avatar-silver-surprised-helmet.webp` | 圓睜雙眼、嘴巴張開；頭盔版隔著透明圓頂 |

### Shadow（`shadow/`，黑貓）

| 表情 | 一般版 | 頭盔版 | 頭像內容 |
|---|---|---|---|
| `neutral` | `avatar-shadow-neutral.webp` | `avatar-shadow-neutral-helmet.webp` | 琥珀眼平視、嘴巴閉著；藍色 HUD 護目鏡發光，頭盔版隔著透明圓頂 |
| `happy` | `avatar-shadow-happy.webp` | `avatar-shadow-happy-helmet.webp` | 眼神柔和、淡淡滿意（不是大笑）；HUD 護目鏡發光，頭盔版隔著透明圓頂 |
| `worried` | `avatar-shadow-worried.webp` | `avatar-shadow-worried-helmet.webp` | 琥珀眼睜大、耳朵略後、表情不安；頭盔版隔著透明圓頂 |
| `determined` | `avatar-shadow-determined.webp` | `avatar-shadow-determined-helmet.webp` | 眼神專注、嘴巴平直、耳朵朝前；頭盔版隔著透明圓頂 |
| `sleepy` | `avatar-shadow-sleepy.webp` | `avatar-shadow-sleepy-helmet.webp` | 眼睛半閉、耳朵略垂、表情放鬆；頭盔版隔著透明圓頂 |
| `surprised` | `avatar-shadow-surprised.webp` | `avatar-shadow-surprised-helmet.webp` | 琥珀眼圓睜、耳朵豎起；頭盔版隔著透明圓頂 |

### Ginger（`ginger/`，橘虎斑）

| 表情 | 一般版 | 頭盔版 | 頭像內容 |
|---|---|---|---|
| `neutral` | `avatar-ginger-neutral.webp` | `avatar-ginger-neutral-helmet.webp` | 琥珀綠眼張開、嘴巴閉著、表情平靜；頭盔版隔著透明圓頂 |
| `happy` | `avatar-ginger-happy.webp` | `avatar-ginger-happy-helmet.webp` | 眼睛柔和半閉、嘴角放鬆的微笑；頭盔版隔著透明圓頂 |
| `worried` | `avatar-ginger-worried.webp` | `avatar-ginger-worried-helmet.webp` | 眼睛睜大、耳朵略後、嘴巴閉小；頭盔版隔著透明圓頂 |
| `determined` | `avatar-ginger-determined.webp` | `avatar-ginger-determined-helmet.webp` | 眼神專注略瞇、嘴巴平直；頭盔版隔著透明圓頂 |
| `sleepy` | `avatar-ginger-sleepy.webp` | `avatar-ginger-sleepy-helmet.webp` | 眼皮沉重半閉、表情放鬆；頭盔版隔著透明圓頂 |
| `surprised` | `avatar-ginger-surprised.webp` | `avatar-ginger-surprised-helmet.webp` | 圓睜雙眼、嘴巴張開、耳朵略後；頭盔版隔著透明圓頂 |

## 5. 重新產生

- 來源：工作區 `pic/` 的 `17-silver-expressions(_hat).png`、`18-shadow-expressions(_hat).png`、`19-ginger-expressions(_hat).png`（repo 外，不進版控）。
- 流程：全張 rembg `bria-rmbg` 去背 → 依 3×2 格線切格 → 800×800 頂部對齊方形裁切 → 200／400／800 WebP。
- 切圖母檔在 `C:\Projects\Meow\_image_work\avatar_masters\`（repo 外）。
- 若重出圖，請同步更新 `manifest.json`、本文件的對應表，以及 `src/assets/generated/README.md` 的統計數字。
