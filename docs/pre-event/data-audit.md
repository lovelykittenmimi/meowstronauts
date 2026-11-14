# 資料快照稽核（2026-11-12）

> 範圍：`src/data/` 全部快照、`scripts/fetch-snapshots.mjs` 寫入的中繼資料。
> 方法：重新 `JSON.parse`、逐檔比對位元組數、以 Pillow 讀取影像尺寸與色彩模式。
> 結論：**PASS**，數值與 metadata 一致；有 4 個照片使用注意事項（見 §5）與 manifest 變更（見 §6），沒有阻擋項。

---

## 1. 檔案與筆數

| 檔案 | 大小 | 內容 | 筆數 |
|---|---:|---|---:|
| `src/data/spaceweather.snapshot.json` | 17,863 B | DONKI CME／FLR／GST | 20／4／1 |
| `src/data/mars-weather.snapshot.json` | 8,994 B | Curiosity REMS sols | 14 |
| `src/data/mars-photos/metadata.json` | 6,483 B | NASA Image Library 精選 | 7 |
| `src/data/snapshots.manifest.json` | 1,486 B | 快照索引與選取理由 | — |

四份 JSON 都可正常解析，UTF-8 無亂碼（先前 console 出現的 `�X` 是 cp950 終端顯示問題，檔案內是正確的 U+2014 破折號）。

## 2. DONKI 太空天氣

- 窗口：**2025-05-13 → 2025-05-17**；快照 `mode: "cached"`，由 `scripts/raw/donki-*-2025-05.json` 產生。
- 計數：20 CME、4 FLR、1 GST，與 manifest 的 `counts` 一致。
- 判定（`meta.assessment`）：

| 欄位 | 值 | 意義 |
|---|---|---|
| `strongFlare` | `true` | 2025-05-14 08:25Z 的 **X2.7** 閃焰（AR 14087） |
| `strongStormConfirmed` | `true` | 有 X 級閃焰作為「強烈太陽事件」的依據 |
| `strongGeomagneticStorm` | `false` | 最大 **Kp 6.33** < 7，未達地磁風暴門檻 |
| `maxFlareClass` | `X2.7` | |
| `maxKp` | `6.33` | 地球的地磁指數，不是火星量測 |
| `fastestCmeKms` | `1,755` | 對應 M1.2，半角 16°，不是 halo |
| `widestCmeHalfAngleDeg` | `47` | |
| `missingFlrGst` | `false` | FLR／GST 皆有抓到 |

**文案紅線：**可寫「強烈太陽閃焰／strong solar flare」；**不可**寫「強烈地磁風暴／strong geomagnetic storm」。CME 速度不是風暴分類，也不能宣稱 CME 擊中火星。

## 3. Curiosity REMS 火星天氣

- 觀測範圍：**2025-05-08 → 2025-05-22**，sol **4534 → 4547**，共 14 筆；`2025-05-18` 缺資料（feed 無該日）。
- 核心七日：**2025-05-15 → 2025-05-22**（扣除缺日後 7 筆），平均白天高溫 **−29.7 °C**、平均夜間低溫 **−79.7 °C**。
- 排名：4,547 個 7-sol 窗口中第 **52** 名（並列 14 個），前 **1.14%**；最冷日 2025-05-16 為 −33 °C。
- `windSpeedMs` 全為 `null`：此 feed 不提供風速。遊戲機制不可用風速；可用氣溫、地面溫度、氣壓。
- 快照是**歷史觀測**，不是即時、不是預報。UI 必須標日期。

## 4. 照片

| NASA ID | 檔名 | 尺寸 | 模式 | 位元組 | 用途注意 |
|---|---|---|---|---:|---|
| PIA24487 | `PIA24487.jpg` | 1280×960 | RGB | 249,165 | 4:3，可當事件卡主圖 |
| PIA24542 | `PIA24542.jpg` | 1280×941 | RGB | 166,854 | 近 4:3，Perseverance 與 Ingenuity 自拍 |
| PIA26344 | `PIA26344.jpg` | 1280×908 | RGB | 217,669 | 近 16:11，可裁 16:9 |
| PIA24173 | `PIA24173.jpg` | 1075×1280 | RGB | 232,093 | **直式**（5:6），不可硬塞 16:9 |
| PIA26632 | `PIA26632.jpg` | 1280×720 | **L（灰階）** | 159,254 | 見 §5 注意 1 |
| PIA24264 | `PIA24264.jpg` | 1280×339 | RGB | 74,636 | 見 §5 注意 2（3.78:1 全景條） |
| PIA25077 | `PIA25077.jpg` | 1280×956 | RGB | 350,608 | 4:3 近景；花狀岩石，適合 F1 小圖；見 §5 注意 4 |

7 張檔案的實際位元組數與 `metadata.json` 的 `bytes` 完全相同；`nasaId`、`credit`、`dateCreated`、`sourceUrl` 皆存在。PIA25077 的 NASA `dateCreated` 是 2022-03-01，實際拍攝日為 2022-02-24（sol 3396）。

## 5. 使用注意事項

1. **PIA26632 是灰階影像（PIL mode `L`）。** 它是乾淨的黑白 Navcam 全景，不是損壞檔。放進彩色 UI 時要加邊框或註記「原始影像為黑白」，**不可上色**假裝彩色；也不宜當唯一的主視覺。
2. **PIA24264 是 1280×339 的全景條（3.78:1）。** 當 16:9 卡片主圖裁切會只剩一條天空或地面；只能當橫幅、知識卡內小圖，或標明「Mastcam-Z 第一張 360° 全景（裁切）」。
3. **PIA24173 是直式（1075×1280）。** 事件卡是 4:3／16:9，需 `object-fit: cover` 並確認貓臉與字幕不互相遮擋；或改用其他張。
4. **PIA25077 是 4:3 近景（1280×956）。** 花狀岩石在中央偏左；裁 16:9 可保留主體，但 caption 必須寫「岩石，不是植物」，不要讓兒童誤以為是化石或植物。

## 6. Manifest 變更

原本 manifest 有 `"api_key": "NASA_API_KEY"` 字串。這不是真金鑰，但會讓人誤以為快照裡存了 key。2026-11-12 已改為：

```json
"api_key_included": false,
"api_key_source": "Cloudflare Worker secret (production) / .dev.vars (local)"
```

`scripts/fetch-snapshots.mjs` 的兩個寫入點同步修改，並 `delete manifest.api_key`，避免舊 manifest 的欄位殘留。`node --check` 通過。**repo 內沒有任何金鑰材料。**

## 7. 重新驗證指令

```bash
# JSON 全部可解析
node -e "for (const f of ['spaceweather.snapshot.json','mars-weather.snapshot.json','mars-photos/metadata.json','snapshots.manifest.json']) JSON.parse(require('fs').readFileSync('src/data/'+f,'utf8')); console.log('JSON OK')"

# 照片尺寸與色彩模式
python -c "from PIL import Image; import glob,os; [print(os.path.basename(f), Image.open(f).size, Image.open(f).mode, os.path.getsize(f)) for f in sorted(glob.glob('src/data/mars-photos/*.jpg'))]"

# 腳本語法
node --check scripts/fetch-snapshots.mjs
```

## 8. 不在本次範圍

- 沒有重新呼叫 NASA API；快照是 2026-11-11 抓取的歷史窗口，重抓不會改變數值。
- 沒有驗證照片的內容正確性（例如是否真為火星）；以 NASA Image Library 的 `nasaId` 與 credit 為準。
- 沒有檢查 `scripts/raw/` 的原始檔是否仍與線上一致；它們只作重建快照的來源。
