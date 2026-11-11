# 資料來源與快照（Data Sources）

> 最後更新：2026-11-11  
> 用途：賽前資料研究與離線快照。所有資料以快照為準，遊戲不依賴即時 API。

## 1. 原則

- **快照優先**：demo 與比賽期間一律讀 `src/data/` 的快照；即時 API 只當加分項。
- **誠實標註**：即時資料標「擷取時間」，快照標「觀測日／快照日」，模擬數值標「模擬」。
- **可追溯**：每個快照檔都有 `meta.fetched_at`、`meta.source_url`、`meta.license`；照片另附 NASA ID、拍攝日、credit。
- **兒童安全**：失敗覆盤用預寫模板，不在 runtime 呼叫 LLM。

## 2. 快照清單

| 檔案 | 內容 | 筆數 | 來源 | 授權／credit |
|---|---|---|---|---|
| `src/data/spaceweather.snapshot.json` | DONKI 2025-05-13～05-17：20 筆 CME、4 筆 FLR（X1.2／M5.3／X2.7／M7.7）、1 筆 GST（Kp 6.33）＋ `meta.assessment` 風暴判定 | 20 CME / 4 FLR / 1 GST | [NASA DONKI](https://api.nasa.gov/DONKI/) | NASA Open Data |
| `src/data/mars-weather.snapshot.json` | Curiosity REMS 2025-05-08～05-22 的 14 sol（氣溫、地面溫度、氣壓、season、`gameplayTags`）；核心 7 sol（05-15～05-22，05-18 缺資料）平均白天高溫 -29.7°C，是 2012–2026 年檔案中前 1.1% 的冷週（2019 窗口更冷，保留為歷史對照） | 14 | [MSL weather feed](https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json) | NASA/JPL-Caltech |
| `src/data/mars-photos/metadata.json` | 6 張火星照片的 NASA ID、標題、拍攝日、credit、檔案路徑 | 6 | [NASA Image Library](https://images-api.nasa.gov/) | 各圖標註 NASA/JPL-Caltech 等 |
| `src/data/mars-photos/*.jpg` | 真實火星地表／探測車照片 | 6 | 同上 | 見 metadata |
| `src/data/snapshots.manifest.json` | 快照總表、筆數、錯誤紀錄、選擇的窗口與風暴判定 | — | 由腳本產生 | — |

> `scripts/raw/` 另有兩個**只供重新產生快照**的原始快取：`donki-cme-2026-11-11.json`（26 筆 CME）與 `msl-weather-2026-11-11.json`（1.7MB 完整 archive）。它們不進遊戲 bundle，也不會被前端 import。

### 照片清單

| NASA ID | 標題 | 拍攝日 | Credit |
|---|---|---|---|
| PIA24487 | Perseverance Is Roving on Mars | 2021-03-05 | NASA/JPL-Caltech |
| PIA24542 | Perseverance's Selfie with Ingenuity | 2021-04-07 | NASA/JPL-Caltech/MSSS |
| PIA26344 | Perseverance's Selfie With "Cheyava Falls" | 2024-07-25 | NASA/JPL-Caltech/MSSS |
| PIA24173 | Curiosity's Selfie at the "Mary Anning" location on Mars | 2020-11-12 | NASA/JPL-Caltech/MSSS |
| PIA26632 | Curiosity Captures Mars Landscape While Talking to an Orbiter | 2025-08-04 | NASA/JPL-Caltech |
| PIA24264 | Mastcam-Z's First 360-Degree Panorama | 2021-02-24 | NASA/JPL-Caltech/MSSS/ASU |

## 3. API 實測狀態（2026-11-11）

| 來源 | 結果 | 決策 |
|---|---|---|
| DONKI `/CME` | ✅ HTTP 200（真實 key，2025-05-13～17） | 使用；25 筆原始，快照保留 20 筆 |
| DONKI `/GST` | ✅ HTTP 200（真實 key，2025-05-13～17） | 使用；1 筆，Kp 6.33 |
| DONKI `/FLR` | ⚠️ HTTP 404（endpoint 目前回 Not Found） | 不直接用；改抓 `/notifications?type=FLR` |
| DONKI `/notifications`（type=FLR） | ✅ HTTP 200 | 使用；8 則通知解析出 4 筆閃焰 |
| `api.nasa.gov/mars-photos` | ❌ HTTP 404「No such app」 | **不依賴**；改用 NASA Image Library |
| `api.nasa.gov/insight_weather` | ⚠️ HTTP 200，但資料停在 2020（sol 675） | **不使用**；InSight 任務已結束 |
| `mars.nasa.gov` MSL weather feed | ✅ HTTP 200，資料到 2026-08-25 | 使用；快照固定為 2025 冷週（見 §3.1） |
| NASA Image Library | ✅ HTTP 200 | 使用；已存 6 張照片 |

> MSL weather feed **沒有風速欄位**（`wind_speed` 全為 `--`）。天氣機制改用氣溫、地面溫度、氣壓，不要捏造風速。

### 3.1 資料強度驗證：這些資料撐得起故事嗎？

**太陽風暴：2025-05-14 的 X2.7 閃焰成立，但地磁風暴只有 Kp 6.33。**

原本的 2026-11-01～11-11 窗口最快 CME 是 974 km/s，但半角只有 11°，最寬 43°，沒有 halo；當時 FLR/GST 又因 DEMO_KEY 限流缺失，所以不能說「強烈」。現在改用與天氣快照同期的 **2025-05-13～05-17**，DONKI 資料顯示：

- 2025-05-13 15:38Z：**X1.2** 閃焰（AR 14086，N07W80）
- 2025-05-14 03:25Z：**M5.3** 閃焰（AR 14087）
- 2025-05-14 08:25Z：**X2.7** 閃焰（AR 14087，N16E64）— 當時 2025 年最強
- 2025-05-14 11:19Z：**M7.7** 閃焰（AR 14087）
- 2025-05-14 08:48Z：與 X2.7 閃焰對應的 CME，速度 **1036 km/s**、半角 **40°**（仍不是 halo）
- 2025-05-14 08:00Z：另一個快速 CME，速度 **1755 km/s**、半角 **16°**（與 M1.2 相關；是窗口內最快，但窄 CME 不等於強烈風暴）
- 2025-05-17 03:00Z：地磁風暴最大 **Kp 6.33**（G2），未達 Kp ≥ 7

判定：`strongFlare = true`、`strongGeomagneticStorm = false`、`strongStormConfirmed = true`。也就是說，**可以說「強烈的太陽閃焰」，不能說「強烈的地磁風暴」**；更不能說 CME 擊中火星（DONKI 沒有給出火星方向的證據）。遊戲的「三隻貓迫降」是虛構訓練情境，真實依據是 2025-05-14 的 X2.7 閃焰。

**建議的遊戲時間線：**

| 日期 | 真實事件 | 遊戲用途 |
|---|---|---|
| 2025-05-13 | X1.2 閃焰 | 任務警示、知識卡 |
| 2025-05-14 | M5.3 → X2.7 → M7.7 | 迫降日；閃焰干擾通訊／導航是遊戲虛構 |
| 2025-05-15～05-22 | 7 sol 冷期（核心） | 生存挑戰本體 |
| 2025-05-17 | Kp 6.33 地磁風暴 | 中途事件，不是迫降原因 |

**為什麼不用 2026-11 的 CME？** 那批 CME 沒有 X 級／M5+ 閃焰，也沒有 Kp ≥ 7，`strongStormConfirmed` 只能是 `false`；故事和天氣也不在同一時期。現在改用 2025-05 窗口，真實事件與 7 sol 冷期對得上。

**火星天氣：改成最近的 2025 冷週。** 原本的「最新 14 sol」（2026-08-12～08-25）白天高溫約在第 51～74 百分位，並不冷；`cold_snap` 只是相對於那個窗口的標籤。現在快照選 **2025-05-08～05-22**，核心 7 sol（05-15～05-22；05-18 feed 缺資料）平均白天高溫 **-29.7°C**，是 4,547 個 7-sol 窗口中前 **1.1%** 的冷週（14 個窗口同溫並列；精確排名見 `meta.selection.core`）。這波冷期最冷的 **2025-05-16** 白天 **-33°C**、夜間 -79°C，單日前 0.3%。

> **為什麼選 2025，而不是更近的 2026？** 2026 年 Gale 的南半球冬天還沒到（下一次冬至約 2027-04），資料到 2026-08-25 為止沒有可用的深冷事件；2026 最冷可信日只有 -16°C（第 36 百分位）。2025-05 是 archive 裡最近、且連續可信的冷峰。

> **不要用這些孤立尖峰：** 2026-01-10（-59°C，前後 +7/+1°C）、2024-04-14（-49°C，前後 -5/+4°C）、2024-04-12（-38°C）、2024-05-28（-38°C）都是單日異常，不能當成真實冷日。2025-05-16 則是連續冷期的一部分（05-13～05-20 白天高溫 -24、-27、-29、-33、-31、-31、-28°C）。

> **遠日點不是保證：** 2024–2026 唯一的遠日點是 **2025-04-17**。那時 Gale 的 7-sol 平均白天高溫只有 -26.0°C（前 11%），並不是最冷；真正的冷峰在一個月後、南半球冬至（Ls 90）前後。2019-08-26 遠日點剛好遇到特強冷期（第 4 冷），是例外，不應推廣成「遠日點一定最冷」。

> **沒有修改任何溫度數值**：只是選擇不同的真實觀測窗口，並把選擇理由、並列排名、缺資料日與異常值寫進 `meta`。所有數值仍可在 `scripts/raw/msl-weather-2026-11-11.json` 追溯。

> **文案怎麼寫：** 遊戲不需要強調「第 52 冷」。寫「2025 年 5 月，Gale 測到一次很冷的 7 sol 冷期，其中一天白天只有 -33°C」即可；不要寫「最冷的一天」或「火星史上最冷」。排名與百分位留在 `meta` 供評審追問。

> **敘事框架：** 本作品是 Junior Astronaut Mission Trainer，遊戲中的天氣與風暴是「用真實歷史事件做的訓練模擬」，不是宣稱現在是 2025 年。UI 一律顯示「Curiosity 觀測日 2025-05-16」與「DONKI 事件 2025-05-14」，讓兒童知道這是真實紀錄的重現。

> **科學簡化：** DONKI 的 GST／Kp 是**地球**的地磁指數；火星沒有全球磁場。遊戲只把 Kp 當作「太陽風暴強度」的簡化代理，火星受災情節是虛構的訓練情境。資料面板要寫明這個簡化，不要說「NASA 偵測到火星風暴」。

## 4. 重新產生

```bash
# 目前 committed 太空天氣快照：2025-05-13～17（CME/GST 用快取，FLR 由通知解析）
node scripts/fetch-snapshots.mjs --spaceweather-only \
  --start-date=2025-05-13 --end-date=2025-05-17 \
  --cme-file=scripts/raw/donki-cme-2025-05.json \
  --flr-file=scripts/raw/donki-flr-2025-05.json \
  --gst-file=scripts/raw/donki-gst-2025-05.json

# 目前 committed 天氣快照：2025-05-08～22 冷週
node scripts/fetch-snapshots.mjs --weather-only \
  --weather-file=scripts/raw/msl-weather-2026-11-11.json

# 完整重建（太空天氣＋天氣＋照片；需要網路與 key）
NASA_API_KEY=your_key node scripts/fetch-snapshots.mjs \
  --start-date=2025-05-13 --end-date=2025-05-17 \
  --weather-file=scripts/raw/msl-weather-2026-11-11.json --photos=6

# 改用最新天氣（不建議用於開局；最新資料偏暖）
node scripts/fetch-snapshots.mjs --weather-mode=latest

# 自訂天氣窗口（例如只取核心 7 sol）
node scripts/fetch-snapshots.mjs \
  --weather-start=2025-05-15 --weather-end=2025-05-22

# 重現 2019 歷史冷週（較冷，但較舊）
node scripts/fetch-snapshots.mjs \
  --weather-start=2019-08-15 --weather-end=2019-08-29

# 自訂輸出與照片數量
node scripts/fetch-snapshots.mjs --out=src/data --photos=6
```

> `/DONKI/FLR` 在 2026-11-11 實測回 404；4 筆閃焰是從 `/DONKI/notifications?type=FLR` 的通知內文解析（start / peak / class / source region），存成 `donki-flr-2025-05.json`。通知沒有 `endTime`，所以快照的 `endTime` 是 `null`。

腳本輸出：`spaceweather.snapshot.json`、`mars-weather.snapshot.json`、`mars-photos/metadata.json`、`snapshots.manifest.json`。

> **Key 安全：** 不要把 NASA API key 寫進 repo、`.env` 或快照檔；本機用 `NASA_API_KEY` 環境變數，正式站用 Cloudflare Worker secret。`snapshots.manifest.json` 只記錄 `DEMO_KEY` 或 `NASA_API_KEY`，不記錄值。**2026-11-11 曾在對話中貼出真實 key，請到 api.nasa.gov 重新產生一組，舊 key 作廢。**

## 5. 欄位與遊戲對應

### 5.1 太空天氣（DONKI CME／FLR／GST）

```json
{
  "id": "2025-05-14T08:48:00-CME-001",
  "startTime": "2025-05-14T08:48Z",
  "sourceLocation": "N16E64",
  "speedKms": 1036,
  "halfAngleDeg": 40,
  "type": "O"
}
```

```json
{
  "id": "2025-05-14T08:04:00-FLR-001",
  "beginTime": "2025-05-14T08:04Z",
  "peakTime": "2025-05-14T08:25Z",
  "classType": "X2.7",
  "sourceLocation": "N16E64",
  "activeRegionNum": 14087
}
```

```json
{
  "id": "2025-05-17T00:00:00-GST-001",
  "startTime": "2025-05-17T00:00Z",
  "maxKp": 6.33
}
```

- 事件卡顯示 `startTime` 的日期、`speedKms`、`sourceLocation`，並連到 DONKI；不得寫成「即時偵測」，要寫「DONKI 事件 2025-05-14」。
- **強度判定看 FLR／GST，不看 CME 速度**：這次 `strongFlare = true`（X2.7），所以 `strongStormConfirmed = true`；但 `strongGeomagneticStorm = false`（Kp 6.33 < 7）。文案可以說「強烈的太陽閃焰」，不要說「強烈的地磁風暴」。
- 與 X2.7 對應的 CME 是 08:48Z、1036 km/s、半角 40°，仍不是 halo；不要用「寬廣的 CME 掃過火星」這種描述。窗口內最快的 CME 是 08:00Z 的 1755 km/s、半角 16°，但 DONKI 將它連到 M1.2 閃焰，不要當成 X2.7 的 CME。速度只作描述，不單獨構成強烈風暴。
- 不要說 CME 擊中火星：DONKI 沒有給出火星方向的證據。火星受災是訓練模擬。
- Kp 是地球的地磁指數；火星沒有全球磁場。資料面板要寫明這個簡化，不要說「NASA 偵測到火星風暴」。

### 5.2 火星天氣（Curiosity REMS）

```json
{
  "sol": 4542,
  "terrestrialDate": "2025-05-16",
  "minTempC": -79,
  "maxTempC": -33,
  "minGroundTempC": -91,
  "maxGroundTempC": -11,
  "pressurePa": 809,
  "gameplayTags": ["cold_snap", "severe_cold"],
  "maxTempPercentile": 0.3
}
```

`gameplayTags` 是平衡用的啟發式標籤，不是 NASA 分類。門檻用**整個 archive 的百分位**，不是快照窗口內的中位數，否則「整週都很冷」時反而一個 `cold_snap` 都不會產生：

- `cold_snap`：`maxTempC <= p10`（比 90% 的觀測 sol 更冷）→ 暖氣耗電增加
- `severe_cold`：`maxTempC <= p1`（比 99% 更冷）→ 額外電力／健康懲罰
- `warm_day`：`maxTempC >= p90` → 戶外行動較安全
- `pressure_drop`：`pressurePa <= p10` → 事件風險提高

`maxTempPercentile` 是該 sol 白天高溫在全部有效 sol 中的百分位（0 = 最冷）。UI 可寫「比 99% 的觀測日更冷」，但不需要顯示排名，也不要寫「NASA 認證最冷」。2025 窗口的 14 天有 8 天是 `cold_snap`，其中 1 天是 `severe_cold`；2019 歷史窗口則是 14 天全部 `cold_snap`、7 天 `severe_cold`。

### 5.3 照片（NASA Image Library）

```json
{
  "nasaId": "PIA24487",
  "title": "Perseverance Is Roving on Mars",
  "dateCreated": "2021-03-05",
  "credit": "NASA/JPL-Caltech",
  "file": "mars-photos/PIA24487.jpg",
  "sourceUrl": "https://images.nasa.gov/details/PIA24487"
}
```

- 巡邏回報畫面顯示照片＋`credit`＋拍攝日。
- 不要說「今天拍到的」；要說「探測車回傳影像（2021-03-05）」。

## 6. 待補

- [x] 取得 NASA API key（2026-11-11；**已在對話中曝光，請重新產生**），補抓 2025-05-13～17 的 CME／FLR／GST。
- [x] 太空天氣快照改為 2025-05-13～17：X2.7 閃焰確認 `strongFlare = true`；Kp 6.33，`strongGeomagneticStorm = false`。
- [x] 天氣快照改為 2025-05-08～05-22 冷週（核心 7 sol 前 1.1%；2019 冷週保留為歷史對照）。
- [ ] 把 `meta`（觀測日、`assessment`、`selection.core`、`maxTempPercentile`）接入遊戲內 Data Sources 面板。
- [ ] 事件卡與天氣卡依 `strongFlare`／`strongGeomagneticStorm` 決定用字：可寫「強烈太陽閃焰」，不得寫「強烈地磁風暴」；也不要說 CME 擊中火星。
- [ ] submission 的資料來源段落直接引用本文件。
