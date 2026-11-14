# 已處理圖像資產（2026-11-14）

此資料夾是工作區 `pic/` 原圖的網頁用衍生物，供遊戲與 submission 使用。
**原圖未被修改或覆寫**（仍在 repo 外的 `C:\Projects\Meow\pic`）。

## 目錄

| 路徑 | 內容 |
|---|---|
| `scenes/` | 27 張有背景的場景、劇照、對話頭像、英雄鏡、遠景與故事板（含 7 張無貓底板候選），WebP（不透明） |
| `cutouts/` | 9 張去背角色設定表（14–19 與 `_hat` 頭盔版），WebP（透明 alpha） |
| `manifest.json` | 本資料夾 36 張圖的尺寸、bytes、處理參數、英文與繁中 `alt`、`credit` |

單格頭像不在本資料夾，已獨立放在 [`../avatars/`](../avatars/)（36 張，108 個 WebP）。

## 規格

- **場景**：最長邊 1280 px（Lanczos）、WebP q=82、單張 ≤ 250 KB；實測 39–155 KB。
- **去背**：最長邊 1600 px、rembg 2.0.87（`bria-rmbg`、CPU）、WebP q=85；
  alpha 0–255、透明像素占比已記在 manifest，深色與米色底皆無白邊。
- 原圖 207 MB → 本資料夾 3.94 MB（場景 1.87 MB、去背 2.07 MB）。
- 去背素材保留原本 **3 欄 × 2 列** 六格排版（六視圖／六表情）。

## 頭像

單格頭像不在本資料夾，已獨立放在 [`../avatars/`](../avatars/)：
36 張（3 貓 × 6 表情 × 一般／頭盔），每張 200／400／800 px，共 108 個 WebP。
使用說明、srcset 範例與完整檔名對應表見 [`../avatars/README.md`](../avatars/README.md)。

## 使用規則

- 遊戲目前打包 15 張場景：`01`（標題）、`05`、`06`（開場迫降，**不當事件卡背景**）、
  `07`–`11` 與 `20`–`22`、`26`–`28`（事件場景舞台，對應表在 [`src/game/eventArt.ts`](../../game/eventArt.ts)）、
  `07`／`11`（每日簡報）、`12`（失敗）、`13`（任務報告）；其餘與 `cutouts/` 是替換與後續使用的素材。
- 場景舞台由 [`src/ui/SceneStage.tsx`](../../ui/SceneStage.tsx) 呈現：同一張圖的模糊 cover 填滿框、
  清晰版用 `object-fit: contain` 完整顯示（不裁切），換圖只改 `eventArt.ts`。
- 寬螢幕（≥1024px 橫放）與手機橫放（矮於 520px）都是場景在左、內容卡在右；
  只有直放與窄螢幕才改成場景在上、卡片在下。
  舞台會依圖片載入後的長寬比調整高度（`--art-ratio`），避免上下留黑邊。
- 事件卡的貓咪表情頭像來自 [`../avatars/`](../avatars/)（`src/ui/catFaces.ts`，3 貓 × determined／happy／worried）。
- `scenes/*-nocat.webp` 是 2026-11-14 加入的無貓背景底板（06、08–10、12–13、21）。
  以 `briefingSrc` 接進每日簡報的有 08–10、12、21（S1、L1、P4、L3、F1、T1／P1）；
  T1／P1 的掃沙小遊戲用 21 的積塵底板開場，六個沙塵點清完後換成
  `21-shadow-hero-nocat-clean.webp`（同一場景、沙子已清乾淨）。06 的底板仍是候選素材。
  11 只有兩個版本：原圖（探測車＋兩隻貓）與 `11-cold-patrol-nocar.webp`（沒車也沒貓，只剩車轍與塵捲風）；
  不做「空車」版。06 與 13 的底板已於同日重出，艙身沒有美國國旗貼布；13 為 2.02:1，比其他張寬；06 仍有風格化的小火焰。
- `manifest.json` 的 `alt.en`／`alt.zh-TW` 可直接給 `<img alt>`；
  `credit` 皆為 `null`（本批為 AI 生成圖，不是 NASA 照片）。
- 去背圖的 alpha 已保留，可直接疊在 `--paper`、`--navy` 或場景圖上。
- 14–19 設定表保留原 3×2 排版；單格頭像已切在 `../avatars/`，不用再自行切格。
- 14–16 原圖有部分視圖的腳掌被原圖邊界裁掉，去背不會補回。
- 不要覆寫 `pic/` 原圖；重出圖時沿用 `docs/image-prompts.md` 的同一批 prompt。

## 產製

Pillow 縮圖（Lanczos）＋ WebP；去背用本機 rembg（`bria-rmbg`，CPU）。
處理腳本不在 repo 內；完整參數記在 `manifest.json` 的 `pipeline` 欄位。
