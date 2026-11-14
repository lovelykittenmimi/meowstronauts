# 授權與致謝（Licenses & Credits）

> 最後更新：2026-11-14（新增幕 2 的 NASA／ESA 太陽與火星影像）
> 用途：submission 的 license／credits 欄位、README 致謝段、評審詢問時的依據。
> 原則：**每一項資產都能說出來源與授權**；不確定的就不要用。

---

## 1. 專案本身

| 項目 | 授權 | 備註 |
|---|---|---|
| 程式碼 | **Apache License 2.0** | 見根目錄 `LICENSE` |
| 文件與研究稿 | 同專案授權 | 引用 NASA 頁面時保留連結 |
| 團隊標記（三貓水彩 logo、腳印） | 團隊所有 | 由 Fly My Mind 提供；非 NASA 資產 |
| AI 生成圖像 | 依生成工具條款，團隊使用 | 於 `docs/ai-disclosure.md` 揭露；上傳與商用前確認工具條款 |

## 2. 字體

| 字體 | 授權 | 用途 |
|---|---|---|
| Noto Sans TC | SIL Open Font License 1.1 | 中文介面 |
| Nunito | SIL Open Font License 1.1 | 英文／數字（主選） |
| Baloo 2 | SIL Open Font License 1.1 | 英文標題（備選） |

- 以 Google Fonts 載入（`display=swap`）；OFL 允許嵌入與商用，不需付費。
- 不要修改字體檔名後再散布；不要單獨販售字體。

## 3. 圖示

| 來源 | 授權 | 用途 |
|---|---|---|
| **Lucide**（`lucide-react`） | ISC License | 通用 UI 圖示：箭頭、關閉、home、書本、背包、資源替代圖示 |

- ISC 允許商用與修改，保留版權聲明即可。
- 自繪的資源圖示（若 11/14 後製作）屬專案資產，依 Apache-2.0 釋出。

## 4. NASA 資料與影像

| 項目 | 狀態 | 使用方式 |
|---|---|---|
| NASA DONKI（CME／FLR／GST） | 公開資料 | 賽前快照，標註來源與日期 |
| Curiosity REMS 氣象資料（MSL） | 公開資料 | 賽前快照，標註來源與日期 |
| NASA Image Library 照片 | 多為公共領域 | 保留 NASA ID 與 `NASA/JPL-Caltech` credit |
| NASA SDO 太陽閃焰（APOD 2017-09-14） | 公共領域（NASA） | 幕 2 開場；畫面標 `NASA / SDO` |
| NASA/ESA SOHO 日冕物質拋射（APOD 2016-01-10） | NASA/ESA；教育用途保留 credit | 幕 2 開場；畫面標 `NASA / ESA / SOHO` |
| NASA/USGS Viking 火星全景（APOD 2024-11-10） | 公共領域 | 幕 2 開場；畫面標 `NASA / USGS / Viking` |
| Mars Trek Gale 三張（wide／mid／close） | 公共領域（NASA/JPL-Caltech） | 幕 2 迫近鏡頭；畫面標 `NASA/JPL-Caltech · Mars Trek` |
| NASA Science／NASA 學習頁面 | 引用 | 知識卡來源連結；不整段複製 |

**NASA 使用紅線**

- 不使用 NASA meatball 標誌、任務徽章、官方識別色當作本專案品牌。
- 不暗示 NASA 背書或合作。
- 照片若含可辨識人物或第三方版權，先換一張；目前選用的 NASA 影像包含 7 張地表／探測車影像（PIA25077 為 Curiosity MAHLI 近景，credit NASA/JPL-Caltech/MSSS），以及幕 2 開場的 SDO 太陽閃焰、SOHO 日冕物質拋射、Viking 火星全景與 Mars Trek 蓋爾撞擊坑三張；每張都在畫面上標 credit。
- NASA 媒體指南：<https://www.nasa.gov/nasa-brand-center/images-and-media/>

## 5. 開源依賴（預計）

| 套件 | 授權 | 用途 |
|---|---|---|
| React | MIT | UI |
| TypeScript | Apache-2.0 | 型別 |
| Vite | MIT | 建置 |
| Vitest | MIT | 測試 |
| Tailwind CSS（若使用） | MIT | 樣式 |
| lucide-react | ISC | 圖示 |

> 11/14 安裝後跑一次 `npx license-checker --summary`（或 `npm ls --all`）核對；把新增的套件補進本表。

## 6. 品牌合成工具

| 工具 | 授權 | 用途 |
|---|---|---|
| Pillow | HPND | OG 卡合成、尺寸輸出、favicon |
| rembg（U2-Net） | rembg MIT；模型權重依其來源 | 角色與 logo 去背，只用於團隊提供的圖 |

## 7. 致謝文字（可貼在 README 或 submission）

```
Mars imagery and data courtesy NASA/JPL-Caltech. This project is not affiliated
with or endorsed by NASA. Icons by Lucide (ISC). Fonts: Noto Sans TC, Nunito
(SIL OFL 1.1). Built with React, TypeScript and Vite.
```

中文版：

```
火星影像與資料由 NASA/JPL-Caltech 提供；本專案與 NASA 無隸屬或背書關係。
圖示使用 Lucide（ISC）；字體為 Noto Sans TC、Nunito（SIL OFL 1.1）。
以 React、TypeScript、Vite 製作。
```

## 8. 待補（11/15 前）

- [ ] 安裝依賴後核對實際套件與授權，補進第 5 節。
- [ ] 確認 AI 生成圖像的工具條款允許提交與公開展示。
- [ ] README 加入第 7 節致謝段。
- [ ] 若使用任何外部音樂或音效，補上來源與授權（目前計畫不使用）。
