# 候選照片檢視（2026-11-12）

> 使用者提供的 5 張 Perseverance raw image＋1 張 Curiosity 圖片。**這份是內部參考紀錄。**
> 檢視方式：抓 1200px 預覽圖實際看過；metadata 取自 NASA 頁面。
> 結論：**PIA25077 已納入為第 7 張照片**（`src/data/mars-photos/PIA25077.jpg`，1280×956，350,608 B，credit NASA/JPL-Caltech/MSSS），用於 F1 故事客串與資料面板小圖；其餘 5 張不建議使用。

## 1. 逐張判斷

| # | 連結 | 實看內容 | Sol／日期 | Credit | 判斷 |
|---:|---|---|---|---|---|
| 1 | [ZL7_2024…](https://mars.nasa.gov/mars2020/multimedia/raw-images/ZL7_2024_0846619804_644EBY_N0930000ZCAM01002_1100LMJ) | 畫面像太陽盤面（Mastcam-Z；原始頁無 caption） | Sol 2024／2026-10-30 12:25 LMST | NASA/JPL-Caltech/ASU | **不用。** 白光照不出閃焰，不能當 S1 證據；畫面也太空。 |
| 2 | [ZL0_2024…](https://mars.nasa.gov/mars2020/multimedia/raw-images/ZL0_2024_0846621597_147EBY_N0930000ZCAM10058_1100LMJ) | 塵土與礫石近景 | Sol 2024／2026-10-30 12:55 LMST | NASA/JPL-Caltech/ASU | **可當 P1 質感參考，但不進卡面。** 不是沙塵暴，也沒有太陽能板。 |
| 3 | [ZR0_1974…](https://mars.nasa.gov/mars2020/multimedia/raw-images/ZR0_1974_0842136238_223ECM_N0910806ZCAM01578_1100LMJ) | 夜空與一顆明亮天體（可能是火衛） | Sol 1974／2026-09-08 00:18 LMST | NASA/JPL-Caltech/ASU | **不用。** 太暗、原始頁無 caption，未查證前不能當教材。 |
| 4 | [ESF_0004…](https://mars.nasa.gov/mars2020/multimedia/raw-images/ESF_0004_0667289099_515ECM_N0010052EDLC00004_0010LUJ01) | Perseverance 著陸下視圖（ rover 掛在下降段下方） | Sol 4／2021-02-24 10:46 LMST | NASA/JPL-Caltech | **不用。** 是真實著陸，不是我們的虛構迫降；放進開場會混淆現實與故事。 |
| 5 | [ZL7_2012…](https://mars.nasa.gov/mars2020/multimedia/raw-images/ZL7_2012_0845541856_905ECM_N0920000ZCAM01002_1100LMJ) | 幾乎全黑，只有極少亮點 | Sol 2012／2026-10-17 09:01 LMST | NASA/JPL-Caltech/ASU | **不可用。** 預覽幾乎看不到內容。 |
| 6 | [PIA25077](https://images.nasa.gov/details/PIA25077) | Curiosity「火星花」：比一分錢還小的花狀岩石，水中的礦物膠結而成 | 2022-02-24（sol 3396） | NASA/JPL-Caltech/MSSS | **已納入第 7 張**（`src/data/mars-photos/PIA25077.jpg`；1280×956、350,608 B）。用於 F1 故事客串與資料面板小圖；不是植物、不是化石，caption 要明說「它是岩石」。 |

## 2. 沙塵暴照片（未採用）

| NASA ID | 內容 | 什麼時候可考慮 |
|---|---|---|
| [PIA22519](https://images.nasa.gov/details/PIA22519) | 2018 全球沙塵暴地圖（MRO） | P1 `dustStorm` 知識卡需要示意圖時；要標「2018 全球風暴，與遊戲的 2025 冷週不是同一事件」 |
| [PIA22487](https://images.nasa.gov/details/PIA22487) | 2018 沙塵暴前後對比 | 解釋沙塵暴如何遮蔽地表；同樣要標日期與事件 |
| [PIA22960](https://images.nasa.gov/details/PIA22960) | Curiosity 在區域沙塵暴中的自拍（2019-01-15, sol 2291） | 若想要「地表看起來灰濛濛」的真實照片，這張比地圖更直觀 |

- **MVP 不需要沙塵暴照片。** 目前故事是太陽閃焰＋冷週；P3 沙塵季不在 MVP，P1 只是太陽能板積塵。多一張風暴圖不會讓核心循環更好，反而多一份 caption、credit 與 QA。
- 若 11/15 後擴充 P3，再從上表挑一張有明確 caption 的圖；**不要用沒有說明的 raw frame 充當沙塵暴。**

## 3. 建議

1. **已新增 `src/data/mars-photos/PIA25077.jpg`，照片總數 6→7。** 其餘 5 張 raw image 不放進 repo；MVP 的視覺核心仍是 8 張生成圖。
2. **PIA25077 只當故事客串。** 放在 F1「溫室番茄豐收」：金桔看到第一朵番茄花，提到 NASA 的「火星花」其實是石頭；不進 30 秒影片。設計筆記見 `docs/event-cards.md` §3.2 F1。卡面建議用小圖（inset），主圖仍是溫室／番茄，免得兒童把岩石當成番茄。
3. **已同步更新** `src/data/mars-photos/metadata.json`（7 筆）、`src/data/snapshots.manifest.json`（`counts.photos: 7`）、`scripts/fetch-snapshots.mjs`（`PHOTO_LIMIT` 預設 7 與 `CURATED_PHOTOS`）。
4. **raw image 的使用門檻：** 沒有 caption 的圖，先查證內容與拍攝目標，不直接給兒童看；NASA 頁面只說「Left Mastcam-Z Camera」不等於我們知道它在拍什麼。

## 4. 連結與 credit 備註

- 前 5 張是 Perseverance raw images，credit 為 **NASA/JPL-Caltech/ASU**；第 6 張是 JPL 發布圖，credit 為 **NASA/JPL-Caltech/MSSS**（NASA 資產中繼資料 `AVAIL:SecondaryCreator`）。
- NASA 影像使用規範見 `docs/licenses.md`；不要加上 NASA 標誌或暗示 NASA 背書。
- 這些連結只作參考；11/15 submission 不需要列出未採用照片。
