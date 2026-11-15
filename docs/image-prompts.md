# 喵航員：火星基地 — 圖像生成 Prompt Book

> 用途：Nano Banana 逐張生成遊戲視覺。所有 prompt 以英文書寫，說明以繁中書寫。
> 最後更新：2026-11-15（01–42 已出圖，見 §0.6、§7；§3.1 的 31–35、§3.2 的 36–37、§3.3 的 38–42 已壓成 1280 px WebP 並接入 `eventArt.ts`，35 同日重出移除國旗貼布）

---

## 0. 使用方式

### 0.1 正式角色參考圖

這三張是角色設計的唯一基準，不再另外生成「角色設定圖」。**GEM 內已內建這三張**，生成時不需再逐次上傳；本地檔案放在 `docs/assets/characters/`，作為備份：

| 檔案 | 角色 | 設計 |
|---|---|---|
| `ref-silver.jpg` | **Silver** | 長毛銀白貓、藍綠色眼、粉色鼻；白金太空裝，海軍藍與金色滾邊，背後小型銀色科技背包 |
| `ref-shadow.jpg` | **Shadow** | 純黑短毛貓、琥珀眼；霧黑裝甲太空裝，紫色發光飾條與碳纖維板，單眼藍色 HUD 護目鏡，雙推進器背包 |
| `ref-ginger.jpg` | **Ginger** | 胖橘虎斑、奶油色口鼻／胸口／腳掌、琥珀綠眼；橘白蓬鬆太空裝，多口袋、織帶、抽象任務布章，圓形橘色背包 |

原始檔案為 2750×1536（約 16:9）、白底棚拍，可直接當角色卡。GEM 會把這三張當成預設視覺參考；若 GEM 被重置或更換，重新上傳本地備份即可。

### 0.2 生成流程

1. 先生成 **14–19** 的多角度與表情表，確認三隻貓的造型穩定。
2. GEM 已內建三張參考圖；生成場景圖（01、05–13）時直接引用，不需逐次上傳。
3. 每段 prompt 開頭都有一句 `Match the ... reference image in the GEM exactly`，不要刪。
4. 角色圖與場景圖都**不要讓模型寫字**；標題、按鈕、任務名稱由程式疊上去。
5. 若模型在畫面加字，追加：`Remove all text, lettering and labels. Keep the composition and characters unchanged.`
6. 這些 prompt 是為「在 GEM 內生成」設計的。若要把 prompt 拿到外部 Nano Banana 聊天室使用，必須在該聊天室重新附上三張參考圖，否則 `in the GEM` 那句話沒有作用。

### 0.3 Nano Banana 設定

- 比例以介面設定為優先，prompt 裡的 `Aspect ratio` 是輔助。
- 一般輸出約 1K；Pro 可到 2K／4K。表中「遊戲內尺寸」是目標，不是模型必須輸出的像素。
- 同一角色請沿用同一張參考圖與同一個 seed（若介面支援），可大幅降低走鐘。

### 0.4 11/12 生成批次清單（給 GEM 用）

> 02–04 是既有參考圖，不重新生成。實際要生成 27 張，加上 3 張參考圖＝30。
> 2026-11-14：本表批次已全部出圖，網頁用成品與路徑見 §0.6；本節保留 11/12 的批次規劃紀錄。

| 批次 | 張數 | 編號 | 目的 | 完成 |
|---|---:|---|---|---|
| A1 角色穩定 | 6 | 14、15、16、17、18、19 | 六視圖＋表情表；先確認三隻貓不走鐘 | [x] |
| A2 對話特寫 | 3 | 23、24、25 | 3:4 頭像，測裁切與眼神 | [x] |
| B1 主視覺 | 4 | 01、05、06、07 | 標題、團隊、迫降、基地外觀 | [x] |
| B2 場景 | 6 | 08、09、10、11、12、13 | 控制室、溫室、夜修、低溫、覆盤、結局 | [x] |
| B3 英雄／遠景 | 6 | 20、21、22、26、27、28 | 低角度與高角度各三張 | [x] |
| B4 故事板 | 1 | 29 | 開場六格 | [x]（實際 16:9） |
| C OG 卡 | 1 | 30 | 最後做，等主視覺定稿 | [x]（2026-11-14 完成） |

**執行順序**

1. A1 → 檢查第 8 節一致性清單；有任何一隻走鐘，先修 prompt 重出，不要往下做。
2. A2 → B1 → B2 → B3 → B4；每批做完立刻挑圖、改名、放進 `src/assets/generated/`，不要等到最後一次挑。
3. C 最後做；OG 標題仍由程式疊，不讓模型寫字。
4. 每張保留：prompt 版本、seed（若有）、生成日期、淘汰原因。這份紀錄 11/15 要寫進 AI disclosure。

**每批驗收**

- [ ] 三隻貓四足、無手、無工具。
- [ ] 天空是奶油糖色，不是地球藍。
- [ ] 沒有文字、Logo、NASA 標誌。
- [ ] 主體在中央安全區，16:9 邊緣 10% 沒有關鍵內容。
- [ ] 兒童友善：無寫實火焰／受傷／恐怖表情；風格化迫降特效可接受。

---

### 0.5 11/14 MVP 最小圖集（8 張）

> 2026-11-14 已完成：下列 8 張都有成品，放 `src/assets/`（路徑見 §0.6、§7）。MVP 打包以這 8 張為準。
> 27 張完整批次不列入 MVP 載入量；其他圖與頭像是替換與後續使用素材。事件卡插圖用 Lucide 圖示或 NASA 照片，知識卡純文字。
> **幕 2 動畫不需新增圖**：背景用 07＋橘紅 overlay，飛船用 SVG 剪影；06 留給幕 3（三貓爬出船艙）。若 07 的太陽能陣列位置真的不合，才補一張 16:9 風暴天空。

| 用途 | 編號 | 張數 | 備註 |
|---|---|---:|---|
| 三隻貓頭像（3:4） | 23、24、25 | 3 | 對話、角色卡、影片第 2 鏡 |
| 主視覺（16:9） | 01 | 1 | 標題卡、開場 |
| 團隊合照（16:9） | 05 | 1 | 標題卡備用、影片第 1 鏡備用 |
| 迫降（16:9） | 06 | 1 | 開場、影片第 1 鏡 |
| 基地外觀（16:9） | 07 | 1 | 開場、影片第 1 鏡 |
| 控制室（16:9） | 08 | 1 | 遊戲背景、資料面板背景 |

**總計 8 張，2026-11-14 已全部完成**（打包約 779 KB）。

**11/14 後續：** 14–19 六視圖、20–22 低角度、26–28 高角度、29 故事板後來都已出圖；30 OG 已於 11/14 用第 30 號 prompt 重生成（見 §0.6）。

---

### 0.6 2026-11-14 產出結果（repo 內成品）

> 原圖（PNG）不在 repo 內；repo 放的是處理過的 WebP 與 manifest，原圖未被修改或覆寫。

| 項目 | 對應 prompt | 數量 | 位置 |
|---|---|---:|---|
| 場景、劇照、對話頭像、英雄鏡、遠景、故事板 | 01、05–13、20–29 | 20 檔 | `src/assets/generated/scenes/`（最長邊 1280 px、WebP q=82） |
| 去背六視圖／表情表 | 14–19 | 9 檔（6 張基本＋3 張 `_hat` 頭盔版） | `src/assets/generated/cutouts/`（最長邊 1600 px、WebP q=85、透明 alpha） |
| 單格頭像 | 17–19 切格 | 36 張（3 貓 × 6 表情 × 一般／頭盔）× 3 尺寸＝108 檔 | `src/assets/avatars/`（800／400／200 px） |
| 角色參考圖 | 02–04 | 3 檔 | `docs/assets/characters/`（既有，未重新生成） |
| OG 分享卡 | 30 | 1 檔 | `brand/og-1200x630.jpg`（母檔）＋ `public/brand/og-1200x630.jpg`（2026-11-14 定稿；1200×630、112,505 B，兩份位元相同） |

- 機器可讀清單、中英 `alt`、`srcset`、bytes 與處理參數：`src/assets/generated/manifest.json`、`src/assets/avatars/manifest.json`。
- 使用說明與表情定義：`src/assets/generated/README.md`、`src/assets/avatars/README.md`。
- 01、05–29 全部有對應成品；17–19 的 `_hat` 是額外產出（prompt 未要求，用來做戴頭盔頭像）。
- MVP 打包仍只載入 §0.5 的 8 張（約 779 KB），其餘是替換與後續素材。
- 2026-11-14 另加入無貓背景底板（`scenes/06`、`08`–`10`、`12`–`13`、`21` 的 `*-nocat.webp`）。艦長日誌大圖**依 sol 固定**，不跟當天事件換（`SOL_BRIEF_ART`，11/15 起）：Sol 1 `01-keyart`、Sol 2 `11-cold-patrol-nocar`、Sol 3 `42-dish-forecast`、Sol 4 `08-control-room-nocat`、Sol 5 `41-water-recycling`、Sol 6 `39-earth-call-nocat`、Sol 7 `09-greenhouse-nocat`。事件卡自己的圖不再借給簡報；事件圖的 `briefingSrc` 只在 sol 超出 1–7 時當後備。06 的底板仍是候選素材；它來自 06 第二次重出的構圖，晚間第三次重出後已與主圖不同，目前未接入遊戲。11 只有「有車＋貓」原圖與「沒車也沒貓」的 `11-cold-patrol-nocar.webp` 兩個版本，不做空車版。06 與 13 的底板已於同日重出，沒有美國國旗貼布；13 為 2.02:1、比其他張寬；06 仍有風格化的小火焰。21 有兩個底板：`21-shadow-hero-nocat`（同一片陣列、同一黃昏光線，板面積塵）與 `21-shadow-hero-nocat-clean`（同場景、沙子已清乾淨）；T1／P1 的掃沙小遊戲從積塵版開始，清完六個沙塵點後換成乾淨版。
- OG 底圖由第 30 號 prompt 生成（2848×1504）。原圖貓群高於上方 30%、也超出中央 80%，處理時把整張等比縮進安全區（三貓上緣 y=197、左右 199–1001 px），再用邊緣像素延伸深色漸層補滿留白，最後由程式疊標題與 `Fly My Mind`。

**已知偏差（2026-11-14 抽查 01、06、13、23、25、29 與 OG）：**

- 29 故事板實際輸出 16:9（原圖 2752×1536），不是 prompt 指定的 3:2。
- 已解除：Silver 胸前的金色星形為太空裝刺繡徽飾；2026-11-14 刪除「星形別針」限制，成品保留。
- 25 的 Ginger 袖子有美國國旗貼布；不是 NASA 標誌，但不是 §8 要求的抽象幾何。縮到 1280 px 高後非常不明顯，2026-11-14 決定保留、不重出。06 的太空船艙身與服裝上的美國國旗貼布已於 11/14 重出移除，重出後多出的番茄也在同日第二次重出時移除；晚間第三次重出換成艙門冒煙、太陽能板碎裂的迫降畫面。
- 13 已於 11/14 重出兩次：移除番茄籃、美國國旗貼布與艙身小字樣；艙身只剩幾個抽象小標記，縮到 1280 px 寬後無法辨識。
- 01 已於 11/14 重出：移除 Ginger 旁岩石上的番茄，理由同 06／13／22。
- 14–16 部分視圖的腳掌被原圖邊界裁掉，去背不會補回（見 `src/assets/generated/README.md`）。
- OG 的 Shadow 單眼 HUD 內有原圖自帶的極小字樣；縮到 1200×630 後小於 2 px、無法辨識。
- 2026-11-14 晚間新增 §3.1 的 31–35 與 §3.2 的 36–37（事件卡補圖），皆已出圖並接入 `eventArt.ts`；成品不在上面的批次清單內。
- 2026-11-15 新增 §3.3 的 38–42（P4／C1／SC2 事件卡補圖＋Sol 5／Sol 3 艦長日誌），38–40 另附 `-nocat` 編輯句；40 的銀白為蹲姿按地上掃描器、41 成品有三隻貓，與 prompt 不同，見 §3.3 開頭。

---

## 1. 風格與世界觀

### 1.1 場景用風格句

每段場景 prompt 已內嵌，這裡供核對：

```text
High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

### 1.2 設定表用風格句

用於多角度表、表情表；不要淺景深，否則格子會糊：

```text
High-end 3D animated character design sheet in a warm Pixar-like style, even soft studio lighting, realistic fur and fabric materials, plain light-gray background, deep focus, consistent scale across panels, no text, no lettering, no labels, no logos, no watermark.
```

### 1.3 色彩與光影

- **火星白天**：奶油糖色天空、地平線附近淡藍、紅褐土壤、長陰影。
- **火星夜晚**：深藍星空、銀河、基地暖黃窗光；冷色為主，暖色點綴。
- **室內**：暖黃實用燈光，與全息螢幕的冷藍／青色形成對比。
- **禁止**：地球式的藍天白雲、綠色草地、森林、雨。

### 1.4 構圖安全區與裝置裁切

**遊戲以橫向（landscape）為預設**：手機橫放、平板橫放、桌機。不要在 portrait 全螢幕生成遊戲場景；手機直向時顯示「請橫放裝置」覆蓋層，不另外生成 9:16 場景。

16:9 是基準，但不同裝置會用 `object-fit: cover` 裁切：

| 裝置比例 | 範例 | 裁切 | 可見範圍 |
|---|---|---|---|
| 16:9 | 桌機、多數手機橫放 | 無 | 100% |
| 4:3 | iPad 橫放 | 左右各裁 12.5% | 中央 75% 寬 |
| 16:10 | 部分平板 | 左右各裁 5% | 中央 90% 寬 |
| 20:9 | 長條手機橫放 | 上下各裁 10% | 中央 80% 高 |
| 21:9 | 超寬螢幕 | 上下各裁 12% | 中央 76% 高 |

- **主要角色、臉、關鍵道具**：放在中央 **75% 寬 × 80% 高** 的交叉安全區。
- **外圍 10%**：不要放關鍵內容；HUD、瀏海、手勢區會蓋住。
- **16:9 場景 prompt 裡的「central 80%」是給模型的簡化指令**；實際排版以 75%×80% 為準。
- **3:4 頭像**：只用在對話框、角色卡；臉在上三分之一，下方留名字與對白。
- **4:3 事件卡**：只用在彈窗事件卡；主體與關鍵道具放中央 80%。
- **標題、按鈕、任務文字**：全部由程式疊；圖片裡不要有字。
- **手機 UI**：觸控目標至少 44×44 CSS px；不要用 hover-only 互動；使用 `env(safe-area-inset-*)` 避開瀏海與手勢區。

---

## 2. 角色設定

### 2.1 Silver — 艦長

- **外觀**：fluffy white long-haired cat, silver shading, large teal-green eyes, pink nose。
- **服裝**：fitted white-and-silver spacesuit, navy-blue and gold trim, small round silver tech pack on the back。
- 胸前的金色星形是太空裝上的平面刺繡徽飾（屬「星光」母題），不是別針；成品保留。
- **性格**：優雅、高傲、有智慧；姿勢挺立，尾巴繞腳，目光平靜。
- **視覺母題**：金色滾邊、星光、指揮感。
- **不要**：圍裙、腰帶、擬人站立、用手拿東西。

### 2.2 Shadow — 導航員兼工程師

- **外觀**：sleek solid-black cat, amber eyes, long whiskers。
- **服裝**：matte black armored spacesuit, purple glowing trim, carbon-fiber panels, translucent blue holographic visor over one eye, twin-thruster backpack with purple glowing rings。
- **性格**：安靜、能幹、嘴硬心軟；警戒站姿、低伏、護目鏡掃描。
- **視覺母題**：紫色發光、全息星圖、維修無人機。
- **不要**：工具腰帶、人手、後腿站立。

### 2.3 Ginger — 廚師兼補給官

- **外觀**：chubby orange tabby, cream muzzle/chest/paws, warm amber-green eyes, fluffy tail with cream tip。
- **服裝**：puffy orange-and-cream astronaut suit, utility pockets, straps, small abstract mission patches, rounded orange backpack。
- **性格**：圓潤結實、表情淡定偏嚴肅、其實心軟；坐姿穩重，鼻子湊近植物。
- **視覺母題**：番茄、種子包、暖廚房燈光。
- **不要**：番茄圍裙、手持澆水壺、擬人站立。

### 2.4 四足設計的操作邏輯

三隻貓都是四足，沒有手。需要「操作」的場景一律用：

- 小型維修無人機（Shadow 的搭檔）
- 機械澆水臂（Ginger 的溫室）
- 掌壓／聲控面板（Silver 的指揮台）
- 背包投影（星圖、掃描光束）

不要生成「貓拿扳手」「貓端托盤」「貓開車門」這種畫面。

---

## 3. 場景與事件圖

### 01. 標題主視覺

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`01-keyart.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the three character reference images in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Wide cinematic key art for a family-friendly Mars survival game. Three suited cat astronauts are on a rocky ridge at dawn, looking toward a small domed outpost with solar arrays in the distance. Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim and a small round silver tech pack on the back, sits tall at the center, tail curled around her paws. Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and carbon-fiber panels, a translucent blue holographic visor over one eye, and a twin-thruster backpack with purple glowing rings, stands alert at her left, a small holographic star map projected from its backpack. Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, warm amber-green eyes, wearing a puffy orange-and-cream astronaut suit covered in utility pockets, straps and small abstract mission patches, with a rounded orange backpack, sits at the right, a single ripe tomato resting on the rock beside it. Behind them a small cream-and-teal rounded spacecraft rests tilted against a solar panel array, thin smoke rising. Butterscotch Mars sky, pale blue glow near the horizon, Earth as a tiny blue dot. Keep the three cats inside the central 80% of the frame with safe margins for UI overlays. Mood of wonder and teamwork, not danger. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

> 2026-11-14 重出：成品已移除 Ginger 旁岩石上的番茄——火星地表溫度會讓番茄立刻凍壞，與世界觀不符；與 06／13／22 的處理一致。其他構圖不變。prompt 保留原樣作生成紀錄。

### 05. 三貓團隊合照

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`05-team-lineup.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the three character reference images in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Three suited cat astronauts on a clean metallic hangar floor, full body, character-select lineup with consistent scale, all three inside the central 80% safe area. Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim and a small round silver tech pack on the back, sits upright in the center, tail wrapped around her paws. Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and carbon-fiber panels, a translucent blue holographic visor over one eye, and a twin-thruster backpack with purple glowing rings, stands at the left with its visor scanning. Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, warm amber-green eyes, wearing a puffy orange-and-cream astronaut suit covered in utility pockets, straps and small abstract mission patches, with a rounded orange backpack, sits at the right, calm and sturdy. Natural cat postures, tails visible. Warm practical lights, soft shadows on the floor. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

### 06. 迫降現場

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`06-crash.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the three character reference images in the GEM exactly for suit design, colors, and quadrupedal cat proportions. A small cream-and-teal rounded explorer spacecraft has crash-landed nose-down across a row of solar panels on Mars, hatch open, thin smoke drifting, panels slightly bent but no fire. Three suited cats pick their way out of the open hatch onto the dusty ground: Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim and a small round silver tech pack on the back; Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim, a translucent blue holographic visor over one eye, and a twin-thruster backpack with purple glowing rings; Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, wearing a puffy orange-and-cream astronaut suit covered in utility pockets, straps and small abstract mission patches, a small seed packet clipped to its suit. A small domed outpost with a communications dish stands nearby. Butterscotch sky, low sun, long shadows, dust motes in the air. Keep the ship and cats inside the central 80% of the frame for UI overlays. Dramatic but child-friendly, no injuries, no fire. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

> 2026-11-14 重出兩次：第一次移除太空船艙身與服裝上的美國國旗貼布，但 Ginger 旁岩石上多了一顆番茄；同日第二次重出再移除番茄，與 13／22 因「火星地表會立刻凍壞」的處理一致。晚間第三次重出：改用真正拍到迫降後的畫面（艙門冒煙、太陽能板碎裂在地、背景有基地圓頂），不再與 01 主視覺共用同一張圖。prompt 保留原樣作生成紀錄。

### 07. 基地外觀

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`07-base-exterior.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Exterior of Hope-1, a small fictional Mars outpost at golden hour: a rounded cream habitat dome with teal accent stripes, two inflatable modules, a neat solar farm, a communications dish, and a small six-wheeled pressurized rover parked nearby. The layered rim of Gale Crater and a distant flat-topped mountain rise on the horizon. Cat-sized boot prints cross the reddish dust in the foreground. Butterscotch sky fading to pale blue, soft dust haze, long shadows. Keep the habitat dome in the central 80% of the frame so the UI does not cover it. Cozy, safe, lived-in frontier feeling. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

### 08. 控制室

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`08-control-room.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the three character reference images in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Interior of a small Mars habitat control room, cozy and a little cluttered. A curved holographic display floats above a paw-height console, showing a simple orange planet diagram, weather icons, and a bright sun symbol with abstract warning shapes; screens show only icons and simple diagrams, no readable text. Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim and a small round silver tech pack on the back, sits before the display, tail wrapped around her paws. Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and carbon-fiber panels, a translucent blue holographic visor over one eye, and a twin-thruster backpack with purple glowing rings, stands beside the console, a thin blue scan beam projecting from its visor toward a wall panel. Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, warm amber-green eyes, wearing a puffy orange-and-cream astronaut suit covered in utility pockets, straps and small abstract mission patches, with a rounded orange backpack, sits beside a small crate of tomatoes. Keep the cats and the main console inside the central 80% of the frame. Warm interior lamps against cool holographic light. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

### 09. 溫室與廚房

**比例：4:3｜遊戲內尺寸：1600×1200｜檔名：`09-greenhouse.png`**

```text
Aspect ratio 4:3, target size 1600x1200. Match the three character reference images in the GEM exactly for suit design, colors, and quadrupedal cat proportions. A cozy corner of a Mars habitat greenhouse: young tomato seedlings under soft pink-purple grow lights, a small hydroponic shelf, and a compact kitchen with a warm lamp. Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, warm amber-green eyes, wearing a puffy orange-and-cream astronaut suit covered in utility pockets, straps and small abstract mission patches, with a rounded orange backpack, sits among the seedling trays with its nose close to a young tomato plant, tail curled. A small robotic watering arm gently waters the seedlings. A single ripe tomato sits on the counter like a treasure. Keep Ginger and the tomato inside the central 80% of the frame for the event-card crop. Warm, intimate, hopeful mood. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

### 10. 夜間維修

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`10-night-repair.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the three character reference images in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Night on Mars. Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and carbon-fiber panels, a translucent blue holographic visor over one eye, and a twin-thruster backpack with purple glowing rings, stands on a solar panel array while a small repair drone hovers beside it with a tool, and a thin scan beam projects from its visor onto the panel. A portable light pod on the panel illuminates the work. Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim, sits on the ground below, tail wrapped around her paws, watching. Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, wearing a puffy orange-and-cream astronaut suit, waits inside the nearby rover, a thermos beside it. Frost on the panel edges, star-filled sky, faint Milky Way, distant habitat dome glowing warm. Keep the three cats inside the central 80% of the frame. Cool blue palette with warm accents, quiet and brave, not scary. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

### 11. 低溫巡邏

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`11-cold-patrol.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the three character reference images in the GEM exactly for suit design, colors, and quadrupedal cat proportions. A small rounded six-wheeled pressurized rover drives across a frost-dusted Martian plain at cold dawn, leaving fresh tracks. Inside the canopy, Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and a translucent blue holographic visor over one eye, sits in the driver's seat with one paw on the control yoke, a holographic map glowing on the dashboard. Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, wearing a puffy orange-and-cream astronaut suit covered in utility pockets and straps, sits beside it with its nose near the window. A thin dust devil spins in the distance, the low sun casts long blue shadows, the sky is pale butterscotch with a hint of cold pink. Keep the rover in the central 80% of the frame. Vast, quiet, adventurous. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

### 12. 任務覆盤

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`12-debrief.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the three character reference images in the GEM exactly for suit design, colors, and quadrupedal cat proportions. A quiet debrief room inside a Mars habitat, warm lamp light. A soft holographic report floats above a table, showing only simple abstract icons and a gentle diagram, no readable text. Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim, sits with her tail wrapped around her paws, ears slightly lowered but expression kind. Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and a translucent blue holographic visor, lies beside the table with its visor dimmed. Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, wearing a puffy orange-and-cream astronaut suit, sits with a small tomato on the table in front of it. Keep the three cats and the holographic report inside the central 80% of the frame. Gentle, reflective, encouraging mood; not sad or punishing. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

### 13. 補給船抵達（選用）

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`13-ending.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the three character reference images in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Sunrise on Mars. A small supply spacecraft descends toward a landing pad beside the Hope-1 habitat dome, parachute and retro-rocket glow, dust billowing softly. Three suited cats stand at the edge of the pad with their tails up: Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim; Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and a translucent blue holographic visor; Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, wearing a puffy orange-and-cream astronaut suit, sitting beside a small crate of tomatoes. Keep the landing ship and the three cats inside the central 80% of the frame. Warm golden light, long shadows, hopeful and celebratory. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

> 2026-11-14 重出：成品已移除停機坪旁的番茄籃——火星地表溫度會讓番茄立刻凍壞，與世界觀不符；同日第二次重出再移除補給艙的美國國旗貼布與極小字樣。其他構圖不變。prompt 保留原樣作生成紀錄。

---

### 3.1 事件卡補圖 31–35（2026-11-14，已出圖並接入）

> 補 `eventArt.ts` 裡「有圖、但圖沒拍到事件本身」的 5 張事件卡。S2、L1、S3 是主辦重點；L2、F3 是加分項。
> 原圖為 2752×1536 JPEG，已處理成 1280×714 WebP q=82（46–95 KB）放在 `src/assets/generated/scenes/`，
> 由 `src/game/eventArt.ts` 一行一張接上；`alt` 已依實際畫面在該檔與 `manifest.json` 重寫。
> **31–35 與原始 prompt 的差異**：31 的掃描光束未出現，改成洞口揚塵；
> 35 的第一版 Ginger 右肩帶美國國旗貼布，已於同日重出移除（同名替換，構圖不變），
> 現在肩上是空白與抽象任務布章。
> 事件卡以寬橫幅顯示（`object-fit: cover`），主體壓在畫面中央，重要細節不要貼上下緣。

#### 31. 微隕石擊穿外牆（S2）

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`31-meteorite-breach.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the Shadow reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Night on Mars, close exterior view of the Hope-1 habitat wall: rounded cream hull panels with teal accent stripes, and a small fresh puncture where a micrometeorite punched through, fine dust streaks radiating from it, a few tiny curled metal petals, a thin wisp of vapor drifting out and a warm sliver of interior light leaking through the hole. Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and carbon-fiber panels, a translucent blue holographic visor over one eye, and a twin-thruster backpack with purple glowing rings, stands on the reddish dust before the breach, tail low and alert, a thin blue scan beam projecting from its visor onto the puncture. A small repair drone hovers beside it, scanning the wall. Deep blue star-filled sky, faint Milky Way, warm window light along the habitat in the background, long shadows. Keep the breach and Shadow inside the central 80% of the frame, and keep key detail away from the top and bottom edges because the image is shown as a wide banner. No fire, no injury, calm and investigative, not scary. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

#### 32. 氧氣回收機故障（L1）

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`32-oxygen-unit.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the Shadow reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Night inside a small Mars habitat life-support bay: a compact rounded oxygen recovery unit mounted on the wall, cream and teal casing, visible pipes, small canisters and a clear sight glass, its access panel open, a soft amber warning light on its status strip, and a small screen showing only simple abstract icons of oxygen molecules, no readable text. Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and carbon-fiber panels, a translucent blue holographic visor over one eye, and a twin-thruster backpack with purple glowing rings, sits before the open panel, tail low and focused, a thin blue scan beam from its visor sweeping the unit. A small repair drone hovers at the panel holding a slim tool. Warm interior lamps, cool cyan glow from the unit, clean metallic floor with a coiled hose. Keep the unit and Shadow inside the central 80% of the frame. Calm, competent repair mood, no fire, no alarm drama. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

#### 33. 避難艙檢查（S3）

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`33-shelter-door.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the Silver reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Interior of a small emergency radiation shelter inside a Mars habitat: thick rounded walls with layered padding, a heavy circular shielding door with a soft rubber seal ring and simple abstract geometric markings, a paw-height control panel beside it with a small icon screen, a status light glowing calm green, folded blankets and stowed supply boxes on a low shelf. Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim and a small round silver tech pack on the back, sits before the door with one front paw pressed on the low control panel, tail wrapped around her paws, calm and focused. Soft silver-blue interior lighting with one warm accent lamp, clean and safe, no red alert lights. Keep the shielding door and Silver inside the central 80% of the frame. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

#### 34. 水循環堵塞（L2）

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`34-water-line.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the Ginger reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Interior of the Mars habitat greenhouse, close on the water recycling line: white and translucent pipes running along the wall, one joint with visible mineral buildup and condensation, a clear sight-glass dripping into a small basin, and a soft amber indicator light on the joint. A small robotic maintenance arm with a wrench-like tool gently works the joint. Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, warm amber-green eyes, wearing a puffy orange-and-cream astronaut suit covered in utility pockets, straps and small abstract mission patches, with a rounded orange backpack, sits beside the pipe with its nose close to the sight-glass, tail curled. Seedling trays under soft pink-purple grow lights and a warm kitchen lamp in the background. Keep the pipe joint and Ginger inside the central 80% of the frame. Patient, curious, cozy mood. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

#### 35. 補給箱延誤（F3）

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`35-supply-crate.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the Ginger reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Exterior of the Hope-1 habitat at golden hour: the cargo hatch and a small supply cradle beside the base wall, painted with simple geometric markings only, no letters. A neat stack of plain cargo crates waits beside the empty cradle — the missing crate has not arrived. Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, warm amber-green eyes, wearing a puffy orange-and-cream astronaut suit covered in utility pockets, straps and small abstract mission patches, with a rounded orange backpack, sits before a paw-height cargo console beside the hatch, one front paw on the panel, checking a delivery schedule shown as simple abstract icons on its small screen, no readable text. A small six-wheeled pressurized rover parked in the background. Butterscotch sky fading to pale blue near the horizon, long shadows, light dust haze. Keep the crates, the console and Ginger inside the central 80% of the frame. Calm, patient, slightly wistful mood — waiting, not disaster. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

---

### 3.2 事件卡補圖 36–37（2026-11-14，已出圖並接入）

> 補最後兩張「圖沒拍到事件本身」的卡：L3（CO₂ 超標）與 P1（太陽能板積塵）。
> 原圖為 2752×1536 JPEG，處理成 1280×714 WebP q=82 放進 `src/assets/generated/scenes/`，
> 由 `src/game/eventArt.ts` 接上；卡片圖與艦長日誌底板成對生成，接法同 §3.1。
> P1 的除塵小遊戲仍沿用 21 的黃昏積塵／乾淨兩張板（同一個陣列、同一件工作），
> 卡片與簡報改用 37 的夜間版本。
> **與原始 prompt 的差異**：36 的琥珀色狀態燈做成洗滌器右側的直條燈，不是細小指示燈；
> 37 的探測車是圓筒玻璃罩六輪車，Ginger 坐在罩內；其餘構圖與 prompt 一致。
> **36 取代 12-debrief 之後，12-debrief 只剩 Game Over 使用**，不再與 L3 共用同一張圖。

#### 36. 二氧化碳超標（L3）

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`36-co2-scrubber.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the Silver reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Night inside a small Mars habitat life-support bay: a wall-mounted carbon dioxide scrubber unit in cream-and-teal casing, with a round filter housing, visible ribbed ducting and a status strip glowing soft amber. Its small screen shows only simple abstract icons — three rising bars and a loose cluster of round molecule symbols — no readable text or numbers. The round filter hatch is open, and a spare filter cartridge lies on the floor beside it. Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim and a small round silver tech pack on the back, sits before the open housing with one front paw pressed on the low wall control panel, tail wrapped around her paws, ears slightly back, calm but concerned, looking up at the rising-level screen. Cool cyan light spills out of the unit onto the metal floor; warm amber lamps light the rest of the bay. Keep Silver, the scrubber and the warning strip inside the central 80% of the frame, and keep key detail away from the top and bottom edges because the image is shown as a wide banner. Tense but composed, family-friendly, no fire, no red klaxon lights. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

**36-nocat（L3 艦長日誌底板）**

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`36-co2-scrubber-nocat.png`**

```text
Aspect ratio 16:9, target size 1920x1080. No cats, no crew anywhere in frame. Night inside a small Mars habitat life-support bay: a wall-mounted carbon dioxide scrubber unit in cream-and-teal casing, with a round filter housing, visible ribbed ducting and a status strip glowing soft amber. Its small screen shows only simple abstract icons — three rising bars and a loose cluster of round molecule symbols — no readable text or numbers. The round filter hatch is open, and a spare filter cartridge lies on the floor beside the open panel. Cool cyan light spills from the unit onto the metal floor; warm amber lamps light the rest of the bay. Keep the scrubber and the warning strip inside the central 80% of the frame, and keep key detail away from the top and bottom edges. Quiet, slightly tense mood, family-friendly. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, realistic materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

#### 37. 太陽能板積塵（P1）

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`37-night-dust.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the three character reference images in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Night on Mars outside the Hope-1 habitat: a solar panel array on the plain under a deep blue star-filled sky with the faint Milky Way, every glass face coated in a thick matte rust-red film of dust, fine dust ridges piled along the metal frames and small drifts at the panel feet; dust hangs in the air and catches the light. Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and carbon-fiber panels, a translucent blue holographic visor over one eye, and a twin-thruster backpack with purple glowing rings, stands on the array with one front paw lifted toward a dust-covered panel, its visor scanning the glass. A portable light pod clipped to the panel frame shines a warm pool of light across the dust. Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim, sits on the ground below with her tail wrapped around her paws, watching. Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, wearing a puffy orange-and-cream astronaut suit covered in utility pockets and straps, waits inside the nearby rounded six-wheeled rover, a thermos beside it. The habitat dome glows warm in the distance. No frost and no ice on the panels — the story here is dust, not cold. Keep the three cats and the dust-covered panels inside the central 80% of the frame, and keep key detail away from the top and bottom edges because the image is shown as a wide banner. Quiet, determined mood, not scary. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

**37-nocat（P1 艦長日誌底板）**

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`37-night-dust-nocat.png`**

```text
Aspect ratio 16:9, target size 1920x1080. No cats, no crew anywhere in frame. Night on Mars outside the Hope-1 habitat: a solar panel array on the plain under a deep blue star-filled sky with the faint Milky Way, every glass face coated in a thick matte rust-red film of dust, fine dust ridges piled along the metal frames and small drifts at the panel feet; dust hangs in the air and catches the light. A portable light pod clipped to the panel frame shines a warm pool of light across the dust. A repair drone hovers over the array, its small work light on the panels. No frost and no ice on the panels. The habitat dome glows warm in the distance. Keep the dust-covered panels inside the central 80% of the frame, and keep key detail away from the top and bottom edges. Quiet, slightly tense mood, family-friendly. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, realistic materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

---

### 3.3 事件卡與艦長日誌補圖 38–42（2026-11-15，已出圖並接入）

> 依 `docs/event-art-audit.md` 的巡檢重出 5 張：P4、C1、SC2 三張事件卡拍不到事件本身；
> Sol 5、Sol 3 兩個艦長日誌沒有對應畫面。原始 JPEG 為 2752×1536，
> 已處理成 1280×714 WebP q=82 放進 `src/assets/generated/scenes/`（48–159 KB），
> 其中 38、39、40 另有 `-nocat` 底板（同批編輯生成）。
> 接線：P4／C1／SC2 走 `EVENT_ART`；Sol 5／Sol 3 走 `SOL_BRIEF_ART`（艦長日誌依 sol 固定，見 §0.6 與 `eventArt.ts`）。
> **與原始 prompt 的差異**：40 的銀白是蹲姿、前掌按地上的掃描器（不是站姿按車上控制面板）；
> 41 的 prompt 寫 `No cats`，但成品有三隻貓（暗影、銀白、金桔都在水回收艙裡），
> 目前當 Sol 5 艦長日誌圖使用，是七個 sol 裡唯一有貓的簡報大圖；
> 42 的太陽外亮環很明顯（像日食光環），其餘與 prompt 一致；38、39 與 prompt 一致。
> `38-cold-week-nocat` 與 `40-ice-survey-nocat` 目前未接入遊戲（事件卡用有貓版，簡報已被 sol 固定圖取代）；
> `39-earth-call-nocat` 當 Sol 6 艦長日誌。

| 檔案 | 用在哪 | 接進 code |
|---|---|---|
| `38-cold-week.webp`（＋`-nocat`） | P4 事件卡（金桔） | `EVENT_ART.P4` |
| `39-earth-call.webp`（＋`-nocat`） | C1 事件卡（暗影）；底板當 Sol 6 艦長日誌 | `EVENT_ART.C1`、`SOL_BRIEF_ART[6]` |
| `40-ice-survey.webp`（＋`-nocat`） | SC2 事件卡（銀白） | `EVENT_ART.SC2` |
| `41-water-recycling.webp` | Sol 5 艦長日誌（有貓） | `SOL_BRIEF_ART[5]` |
| `42-dish-forecast.webp` | Sol 3 艦長日誌（無貓） | `SOL_BRIEF_ART[3]` |

#### 38. 冷週暖氣（P4）

**比例：16:9｜成品：2752×1536 → 1280×714 WebP q=82｜檔名：`38-cold-week.webp`**

```text
Wide cinematic still of the Mars outpost at cold blue-hour dusk. Frost crystals coat the orange-red soil and the ribs of the cream habitat modules, and the habitat windows glow warm amber. On the outside wall, a quilted silver insulation panel and a vent casting a soft orange heater glow; a power cable runs along the base. Ginger, a chubby orange tabby cat in a cream-and-orange astronaut suit with orange pouches and a small blue triangular mission patch, sits inside the large oval window on a bench close to a glowing heater, looking out at the frost. Thin butterscotch-to-deep-blue sky, first stars, layered mesas behind. Pixar-style 3D animation still, physically based lighting, soft depth of field, wide 16:9. No text, no logos, no humans.
```

**38-nocat**

編輯句（在生成好的 38 上下）：

```text
Remove the cat from the window only; keep the warm empty room, the heater glow, the frost and everything else identical.
```

存成 `38-cold-week-nocat.jpeg`。

#### 39. 地球來電（C1）

**比例：16:9｜成品：2752×1536 → 1280×714 WebP q=82｜檔名：`39-earth-call.webp`**

```text
Interior of the outpost's small communications bay at dusk. Warm-lit room with coiled cables, a headset hanging beside a low curved radio console. A large rounded wall screen shows a small blue Earth with a dashed signal arc and a thin, mostly empty progress ring, next to a small orange Mars globe; the screen glows softly with no lettering. A tall dish antenna is visible through a round porthole against a pink-orange sky. Shadow, a sleek black cat in a black-and-purple armored tech spacesuit with a glowing blue AR visor, sits at the console with one paw on a dial, ears perked. Pixar-style 3D animation still, physically based lighting, soft depth of field, wide 16:9. No text, no numbers, no logos, no humans.
```

**39-nocat**

編輯句：

```text
Remove the cat and fill in only what it covered; keep the empty chair, console, Earth screen and dish; everything else identical.
```

存成 `39-earth-call-nocat.jpeg`；這張就是 Sol 6 艦長日誌大圖。

#### 40. 地下冰探測（SC2）

**比例：16:9｜成品：2752×1536 → 1280×714 WebP q=82｜檔名：`40-ice-survey.webp`**

```text
Wide cinematic still on a frost-dusted Martian plain at golden hour. Silver, a fluffy long-haired white cat with big teal-green eyes, in a white astronaut suit with navy-blue and gold trim and a small star badge, stands beside a six-wheeled Mars rover with one paw on its control panel. The rover's small screen shows a simple cross-section of the ground with a bright glowing blue layer below the surface. A lowered drill arm touches the frosty ground beside a small borehole with ice crystals around the rim. Fresh wheel tracks curve away. The cream outpost dome sits far on the horizon. Orange-red soil, thin peach sky, layered mesas. Pixar-style 3D animation still, physically based lighting, soft depth of field, wide 16:9. No text, no logos, no humans.
```

**40-nocat**

編輯句：

```text
Remove the cat; keep the rover, drill, borehole and tracks; everything else identical.
```

存成 `40-ice-survey-nocat.jpeg`（目前未接入遊戲）。

#### 41. 水回收艙（Sol 5 艦長日誌）

**比例：16:9｜成品：2752×1536 → 1280×714 WebP q=82｜檔名：`41-water-recycling.webp`**

```text
Interior of the outpost's water recycling bay: three upright cylindrical tanks connected by curved pipes, a glass tube where condensation droplets run back down into a tank, a circular closed-loop diagram on the wall panel with a blue droplet icon and arrows, no words. Gauges glow soft cyan, one tank shows a rising water level. Clean, warm-lit engineering room with ribbed cream walls and a small porthole showing rust-red Mars outside. No cats, no people. Pixar-style 3D animated film still, physically based lighting, soft depth of field, wide 16:9. No text, no logos.
```

> 成品與 `No cats` 不同：畫面裡有三隻貓，所以 `SOL_BRIEF_ART[5]` 的 alt 照實描述牠們，不是空景。

#### 42. 天線與低日（Sol 3 艦長日誌）

**比例：16:9｜成品：2752×1536 → 1280×714 WebP q=82｜檔名：`42-dish-forecast.webp`**

```text
Exterior of the Mars outpost at dawn: a large dish antenna in the foreground angled toward a low, bright sun on the horizon, with a thin bright ring of light around the sun. Long shadows across rust-red soil, solar panels and the cream dome behind, a tiny red indicator lamp on the antenna mount. Thin dusty peach sky, layered mesas. No cats, no people. Pixar-style 3D animated still, physically based lighting, soft depth of field, wide 16:9. No text, no logos, no watermark.
```

---

## 4. 角色多角度分鏡

### 4.1 六視圖 turnaround

用途：確認造型、給場景生成當參考、未來做 3D 或動畫時使用。每張六格，不要文字標籤。

#### 14. Silver 六視圖

**比例：3:2｜遊戲內尺寸：1800×1200｜檔名：`14-silver-turnaround.png`**

```text
Aspect ratio 3:2, target size 1800x1200. Match the Silver reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Character turnaround sheet of Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim and a small round silver tech pack on the back. Six full-body views in a clean 3x2 grid: front view, three-quarter front view, side profile facing right, three-quarter rear view, rear view, and seated front view. Neutral standing pose, consistent scale, proportions, fur and suit details across all panels, plain light-gray studio background, even soft lighting, deep focus, no text, no lettering, no labels, no logos, no watermark.
```

#### 15. Shadow 六視圖

**比例：3:2｜遊戲內尺寸：1800×1200｜檔名：`15-shadow-turnaround.png`**

```text
Aspect ratio 3:2, target size 1800x1200. Match the Shadow reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Character turnaround sheet of Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and carbon-fiber panels, a translucent blue holographic visor over one eye, and a twin-thruster backpack with purple glowing rings. Six full-body views in a clean 3x2 grid: front view, three-quarter front view, side profile facing right, three-quarter rear view, rear view, and seated front view. Neutral standing pose, consistent scale, proportions, fur and suit details across all panels, plain light-gray studio background, even soft lighting, deep focus, no text, no lettering, no labels, no logos, no watermark.
```

#### 16. Ginger 六視圖

**比例：3:2｜遊戲內尺寸：1800×1200｜檔名：`16-ginger-turnaround.png`**

```text
Aspect ratio 3:2, target size 1800x1200. Match the Ginger reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Character turnaround sheet of Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, warm amber-green eyes, wearing a puffy orange-and-cream astronaut suit covered in utility pockets, straps and small abstract mission patches, with a rounded orange backpack. Six full-body views in a clean 3x2 grid: front view, three-quarter front view, side profile facing right, three-quarter rear view, rear view, and seated front view. Neutral standing pose, consistent scale, proportions, fur and suit details across all panels, plain light-gray studio background, even soft lighting, deep focus, no text, no lettering, no labels, no logos, no watermark.
```

### 4.2 表情與姿態表

用途：對話框頭像、事件反應、任務成功／失敗表情。每張六格，頭肩特寫。

#### 17. Silver 表情表

**比例：3:2｜遊戲內尺寸：1800×1200｜檔名：`17-silver-expressions.png`**

```text
Aspect ratio 3:2, target size 1800x1200. Match the Silver reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Expression sheet of Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim. Six head-and-shoulders portraits in a clean 3x2 grid: neutral, gently happy, worried, determined, sleepy, surprised. Facing the camera, same lighting, same plain light-gray studio background, consistent design across all panels, deep focus, no text, no lettering, no labels, no logos, no watermark.
```

#### 18. Shadow 表情表

**比例：3:2｜遊戲內尺寸：1800×1200｜檔名：`18-shadow-expressions.png`**

```text
Aspect ratio 3:2, target size 1800x1200. Match the Shadow reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Expression sheet of Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and a translucent blue holographic visor over one eye. Six head-and-shoulders portraits in a clean 3x2 grid: neutral, quietly pleased, worried, determined, sleepy, surprised. Facing the camera, visor glowing softly, same lighting, same plain light-gray studio background, consistent design across all panels, deep focus, no text, no lettering, no labels, no logos, no watermark.
```

#### 19. Ginger 表情表

**比例：3:2｜遊戲內尺寸：1800×1200｜檔名：`19-ginger-expressions.png`**

```text
Aspect ratio 3:2, target size 1800x1200. Match the Ginger reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Expression sheet of Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, warm amber-green eyes, wearing a puffy orange-and-cream astronaut suit covered in utility pockets and straps. Six head-and-shoulders portraits in a clean 3x2 grid: neutral, gently happy, worried, determined, sleepy, surprised. Facing the camera, same lighting, same plain light-gray studio background, consistent design across all panels, deep focus, no text, no lettering, no labels, no logos, no watermark.
```

### 4.3 電影感角度

#### 4.3.1 低角度英雄鏡

用途：角色選擇、任務開始、士氣事件。

##### 20. Silver 低角度

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`20-silver-hero.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the Silver reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Low-angle hero shot of Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim and a small round silver tech pack on the back, standing on a rocky ledge on Mars at dawn, tail raised, chest forward, calm and regal. Camera close to the ground looking up, butterscotch sky and a small pale-blue Earth in the background, long shadows, dust drifting. She fills the central 70% of the frame. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

##### 21. Shadow 低角度

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`21-shadow-hero.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the Shadow reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Low-angle hero shot of Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and carbon-fiber panels, a translucent blue holographic visor over one eye, and a twin-thruster backpack with purple glowing rings, standing on the frame of a solar panel array at dusk, tail low and alert, visor glowing. Camera close to the panel looking up, purple rim light on the armor, butterscotch sky fading to deep blue, stars appearing, dust in the air. The cat fills the central 70% of the frame. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

##### 22. Ginger 低角度

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`22-ginger-hero.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the Ginger reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Low-angle hero shot of Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, warm amber-green eyes, wearing a puffy orange-and-cream astronaut suit covered in utility pockets, straps and small abstract mission patches, with a rounded orange backpack, standing on a low rock at dawn, sturdy and calm, a small crate of tomatoes beside it. Camera close to the ground looking up, warm golden light, butterscotch sky, long shadows, dust drifting. The cat fills the central 70% of the frame. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

> 2026-11-14 重出：成品已移除旁邊的番茄籃——火星地表溫度會讓番茄立刻凍壞，與世界觀不符。其他構圖不變。prompt 保留原樣作生成紀錄。

#### 4.3.2 3:4 對話特寫

用途：對話框、角色檔案、任務簡報。臉放在上三分之一。

##### 23. Silver 對話特寫

**比例：3:4｜遊戲內尺寸：1200×1600｜檔名：`23-silver-portrait.png`**

```text
Aspect ratio 3:4, target size 1200x1600. Match the Silver reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Head-and-shoulders dialogue portrait of Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim, looking slightly off-camera, calm and thoughtful, soft rim light on the fur. Blurred habitat interior background with warm practical lights and a hint of a holographic display, shallow depth of field. Keep the face in the upper third of the frame, leave calm space below for UI text. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, no text, no lettering, no logos, no watermark.
```

##### 24. Shadow 對話特寫

**比例：3:4｜遊戲內尺寸：1200×1600｜檔名：`24-shadow-portrait.png`**

```text
Aspect ratio 3:4, target size 1200x1600. Match the Shadow reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Head-and-shoulders dialogue portrait of Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and a translucent blue holographic visor over one eye, looking slightly off-camera, calm and quietly confident. Soft purple rim light on the armor, one amber eye visible through the visor, blurred dark habitat background with faint holographic blue light, shallow depth of field. Keep the face in the upper third of the frame, leave calm space below for UI text. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, no text, no lettering, no logos, no watermark.
```

##### 25. Ginger 對話特寫

**比例：3:4｜遊戲內尺寸：1200×1600｜檔名：`25-ginger-portrait.png`**

```text
Aspect ratio 3:4, target size 1200x1600. Match the Ginger reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. Head-and-shoulders dialogue portrait of Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, warm amber-green eyes, wearing a puffy orange-and-cream astronaut suit covered in utility pockets and straps, looking slightly off-camera with a calm, slightly stoic expression. Soft warm kitchen light, blurred greenhouse background with pink-purple grow lights and a tomato on the counter, shallow depth of field. Keep the face in the upper third of the frame, leave calm space below for UI text. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, no text, no lettering, no logos, no watermark.
```

> 2026-11-14：成品袖子上有美國國旗貼布，縮到 1280 px 高後非常不明顯；決定保留、不重出。prompt 保留原樣作生成紀錄。

#### 4.3.3 高角度遠景

用途：任務開場、地圖畫面、孤獨感與規模感。不要做得可怕或陰暗。

##### 26. Silver 高角度遠景

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`26-silver-wide.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the Silver reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. High-angle wide shot looking down at Silver, a fluffy white long-haired cat with silver shading, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim, small in the frame on a vast frost-dusted Martian plain, her long shadow stretching toward the camera, the Hope-1 dome tiny in the distance. Butterscotch sky, pale blue near the horizon, soft dust haze. Sense of scale and solitude, not scary. Silver occupies about 15% of the frame, placed off-center. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

##### 27. Shadow 高角度遠景

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`27-shadow-wide.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the Shadow reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. High-angle wide shot looking down at Shadow, a sleek solid-black cat wearing a matte black armored spacesuit with purple glowing trim, a translucent blue visor and a twin-thruster backpack, small in the frame crossing a dark Martian plain at night, its visor and backpack lights the only bright points, a faint trail of paw prints behind it, the habitat dome glowing far away. Star-filled sky, faint Milky Way, cold blue palette with purple accents. Sense of scale and quiet courage, not scary. Shadow occupies about 15% of the frame, placed off-center. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

##### 28. Ginger 高角度遠景

**比例：16:9｜遊戲內尺寸：1920×1080｜檔名：`28-ginger-wide.png`**

```text
Aspect ratio 16:9, target size 1920x1080. Match the Ginger reference image in the GEM exactly for suit design, colors, and quadrupedal cat proportions. High-angle wide shot looking down at Ginger, a chubby orange tabby cat with a cream muzzle and chest, wearing a puffy orange-and-cream astronaut suit with utility pockets and a rounded orange backpack, sitting small in the frame among rows of seedling trays in the habitat greenhouse, tail curled, nose lifted toward the grow lights. Soft pink-purple light, warm kitchen lamp in the corner, a single tomato on the counter. Cozy, quiet, hopeful. Ginger occupies about 20% of the frame, placed off-center. High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.
```

---

## 5. 進階：開場六格故事板

用途：快速確認開場節奏與鏡頭語言。故事板只當構圖參考，正式素材仍用 01、06 等單張圖。

**比例：3:2｜遊戲內尺寸：1800×1200｜檔名：`29-opening-storyboard.png`**

```text
Aspect ratio 3:2, target size 1800x1200. Six-panel cinematic storyboard in a clean 3x2 grid for a family-friendly Mars survival game, consistent character designs from the GEM's reference images, no text. Panel 1: wide shot of the Hope-1 dome at dawn, calm and quiet. Panel 2: medium shot of a bright solar flare on the sun, a small spacecraft silhouetted against it. Panel 3: wide shot of the spacecraft streaking across a butterscotch sky with a smoke trail. Panel 4: close shot of the spacecraft hitting a solar panel array, panels bending, dust bursting, no fire. Panel 5: medium shot of three suited cats emerging from the open hatch. Panel 6: wide shot of the three cats standing before the base, tails up. Consistent lighting, colors and character suits across all panels. High-end 3D animated storyboard in a warm Pixar-like style, soft cinematic lighting, realistic fur and fabric materials, no text, no lettering, no labels, no logos, no watermark.
```

---

## 6. OG 社群分享卡

用途：專案頁、社群分享、提交表單的預覽圖。**標題由程式疊上去，不讓模型寫字**；上方 30% 刻意留空。

**比例：1.9:1｜遊戲內尺寸：1200×630｜檔名：`og-1200x630.jpg`**

```text
Aspect ratio 1.9:1, target size 1200x630. Match the three character reference images in the GEM exactly for suit design, colors, and quadrupedal cat proportions. A warm, front-facing team portrait for a social sharing card: three suited cat astronauts arranged in a shallow triangle on a clean dark surface, all looking directly at the camera. Keep the upper 30% of the frame empty for a title overlay, and keep all three cats inside the lower 70% and the central 80% width. Silver, a fluffy white long-haired cat with silver shading, large teal-green eyes and a pink nose, wearing a fitted white-and-silver spacesuit with navy-blue and gold trim and a small round silver tech pack on the back, sits on her haunches in the center-back, all four paws on the floor, tail wrapped around her paws. Ginger, a chubby orange tabby cat with a cream muzzle, chest and paws, warm amber-green eyes, wearing a puffy orange-and-cream astronaut suit covered in utility pockets, straps and small abstract mission patches, with a rounded orange backpack, lies in a relaxed loaf in the front-left, front paws tucked, head raised. Shadow, a sleek solid-black cat with amber eyes, wearing a matte black armored spacesuit with purple glowing trim and carbon-fiber panels, a translucent blue holographic visor over one eye, and a twin-thruster backpack with purple glowing rings, crouches low in the front-right, one front paw forward, tail curled. All three are quadrupedal and on the floor; no cat stands on its hind legs. Patches are abstract geometric shapes only — no NASA insignia, no letters, no readable text. Background: deep navy-to-rust gradient with a soft warm glow behind the group and subtle dust motes, no window frames, no machinery. Even soft key light on the faces, gentle rim light, shallow depth of field. High-end 3D animated feature film still in a warm Pixar-like style, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, no text, no lettering, no logos, no watermark.
```

**注意：**

- 若介面只能選 16:9，先生成 16:9，再從中央裁成 1200×630；上方留白不會被裁掉。
- 三張臉要在同一視覺帶，Silver 的耳朵不能碰到上緣；標題區寧可不放貓，也不要壓到臉。
- 這張只做分享卡，不是遊戲內場景；不要把標題、按鈕、NASA 標誌畫進去。

---

## 7. 輸出規格與檔名

> 「檔名」欄是生成時的原檔名（PNG，原圖不在 repo 內）；repo 內放的是處理後 WebP。
> 下表 `scenes/`＝`src/assets/generated/scenes/`，`cutouts/`＝`src/assets/generated/cutouts/`；括號內為實際像素。

| # | 檔名（生成原檔） | 比例 | 遊戲內尺寸 | 用途 | repo 內成品（2026-11-15） |
|---|---|---|---|---|---|
| 01 | `01-keyart.png` | 16:9 | 1920×1080 | 標題、封面 | `scenes/01-keyart.webp`（1280×714） |
| 02–04 | `ref-silver.jpg` / `ref-shadow.jpg` / `ref-ginger.jpg`（`docs/assets/characters/`） | 約 16:9 | 2750×1536（現有） | 角色參考圖，已內建於 GEM，不再生成 | 原檔沿用（未重新生成） |
| 05 | `05-team-lineup.png` | 16:9 | 1920×1080 | 角色選擇 | `scenes/05-team-lineup.webp`（1280×714） |
| 06 | `06-crash.png` | 16:9 | 1920×1080 | 開場、任務背景 | `scenes/06-crash.webp`（1280×714） |
| 07 | `07-base-exterior.png` | 16:9 | 1920×1080 | 基地底圖 | `scenes/07-base-exterior.webp`（1280×714） |
| 08 | `08-control-room.png` | 16:9 | 1920×1080 | 主介面 | `scenes/08-control-room.webp`（1280×714） |
| 09 | `09-greenhouse.png` | 4:3 | 1600×1200 | 事件卡 | `scenes/09-greenhouse.webp`（1280×956） |
| 10 | `10-night-repair.png` | 16:9 | 1920×1080 | 夜間關卡 | `scenes/10-night-repair.webp`（1280×714） |
| 11 | `11-cold-patrol.png` | 16:9 | 1920×1080 | 探索關卡 | `scenes/11-cold-patrol.webp`（1280×714） |
| 12 | `12-debrief.png` | 16:9 | 1920×1080 | 失敗畫面 | `scenes/12-debrief.webp`（1280×714） |
| 13 | `13-ending.png` | 16:9 | 1920×1080 | 結局 | `scenes/13-ending.webp`（1280×714） |
| 14 | `14-silver-turnaround.png` | 3:2 | 1800×1200 | 六視圖 | `cutouts/14-silver-turnaround.webp`（1600×1073） |
| 15 | `15-shadow-turnaround.png` | 3:2 | 1800×1200 | 六視圖 | `cutouts/15-shadow-turnaround.webp`（1600×1073） |
| 16 | `16-ginger-turnaround.png` | 3:2 | 1800×1200 | 六視圖 | `cutouts/16-ginger-turnaround.webp`（1600×1073） |
| 17 | `17-silver-expressions.png` | 3:2 | 1800×1200 | 表情表 | `cutouts/17-silver-expressions.webp`（1600×1073）；頭盔版 `_hat.webp`（1600×1195） |
| 18 | `18-shadow-expressions.png` | 3:2 | 1800×1200 | 表情表 | `cutouts/18-shadow-expressions.webp`（1600×1073）；頭盔版 `_hat.webp`（1600×1195） |
| 19 | `19-ginger-expressions.png` | 3:2 | 1800×1200 | 表情表 | `cutouts/19-ginger-expressions.webp`（1600×1073）；頭盔版 `_hat.webp`（1600×1195） |
| 20 | `20-silver-hero.png` | 16:9 | 1920×1080 | 低角度英雄鏡 | `scenes/20-silver-hero.webp`（1280×714） |
| 21 | `21-shadow-hero.png` | 16:9 | 1920×1080 | 低角度英雄鏡 | `scenes/21-shadow-hero.webp`（1280×714） |
| 22 | `22-ginger-hero.png` | 16:9 | 1920×1080 | 低角度英雄鏡 | `scenes/22-ginger-hero.webp`（1280×714） |
| 23 | `23-silver-portrait.png` | 3:4 | 1200×1600 | 對話特寫 | `scenes/23-silver-portrait.webp`（956×1280） |
| 24 | `24-shadow-portrait.png` | 3:4 | 1200×1600 | 對話特寫 | `scenes/24-shadow-portrait.webp`（956×1280） |
| 25 | `25-ginger-portrait.png` | 3:4 | 1200×1600 | 對話特寫 | `scenes/25-ginger-portrait.webp`（956×1280） |
| 26 | `26-silver-wide.png` | 16:9 | 1920×1080 | 高角度遠景 | `scenes/26-silver-wide.webp`（1280×714） |
| 27 | `27-shadow-wide.png` | 16:9 | 1920×1080 | 高角度遠景 | `scenes/27-shadow-wide.webp`（1280×714） |
| 28 | `28-ginger-wide.png` | 16:9 | 1920×1080 | 高角度遠景 | `scenes/28-ginger-wide.webp`（1280×714） |
| 29 | `29-opening-storyboard.png` | 3:2 | 1800×1200 | 開場故事板 | `scenes/29-opening-storyboard.webp`（1280×714；原圖 16:9） |
| 30 | `og-1200x630.jpg` | 1.9:1 | 1200×630 | OG 社群卡（標題由程式疊） | `brand/og-1200x630.jpg`＋`public/brand/og-1200x630.jpg`（1200×630；112,505 B；11/14 定稿，兩份位元相同） |
| 31 | `31-meteorite-breach.png` | 16:9 | 1920×1080 | S2 事件卡：微隕石擊穿外牆（§3.1） | `scenes/31-meteorite-breach.webp`（1280×714；原檔為 `.jpeg`） |
| 32 | `32-oxygen-unit.png` | 16:9 | 1920×1080 | L1 事件卡：氧氣回收機故障（§3.1） | `scenes/32-oxygen-unit.webp`（1280×714；原檔為 `.jpeg`） |
| 33 | `33-shelter-door.png` | 16:9 | 1920×1080 | S3 事件卡：避難艙檢查（§3.1） | `scenes/33-shelter-door.webp`（1280×714；原檔為 `.jpeg`） |
| 34 | `34-water-line.png` | 16:9 | 1920×1080 | L2 事件卡：水循環堵塞（§3.1） | `scenes/34-water-line.webp`（1280×714；原檔為 `.jpeg`） |
| 35 | `35-supply-crate.png` | 16:9 | 1920×1080 | F3 事件卡：補給箱延誤（§3.1） | `scenes/35-supply-crate.webp`（1280×714；原檔為 `.jpeg`；同日重出移除國旗貼布） |
| 36 | `36-co2-scrubber.png` | 16:9 | 1920×1080 | L3 事件卡：二氧化碳超標（§3.2） | `scenes/36-co2-scrubber.webp`（1280×714；簡報板 `36-co2-scrubber-nocat.webp`；原檔為 `.jpeg`） |
| 37 | `37-night-dust.png` | 16:9 | 1920×1080 | P1 事件卡：太陽能板積塵（§3.2） | `scenes/37-night-dust.webp`（1280×714；簡報板 `37-night-dust-nocat.webp`；原檔為 `.jpeg`） |
| 38 | `38-cold-week.jpeg` | 16:9 | 2752×1536（實際） | P4 事件卡：冷週暖氣（§3.3） | `scenes/38-cold-week.webp`（1280×714；另有 `38-cold-week-nocat.webp`，目前未接入） |
| 39 | `39-earth-call.jpeg` | 16:9 | 2752×1536（實際） | C1 事件卡：地球來電（§3.3） | `scenes/39-earth-call.webp`（1280×714）；底板 `39-earth-call-nocat.webp` 當 Sol 6 艦長日誌 |
| 40 | `40-ice-survey.jpeg` | 16:9 | 2752×1536（實際） | SC2 事件卡：地下冰探測（§3.3） | `scenes/40-ice-survey.webp`（1280×714；另有 `40-ice-survey-nocat.webp`，目前未接入） |
| 41 | `41-water-recycling.jpeg` | 16:9 | 2752×1536（實際） | Sol 5 艦長日誌（§3.3） | `scenes/41-water-recycling.webp`（1280×714；成品有三隻貓，與 prompt 的 `No cats` 不同） |
| 42 | `42-dish-forecast.jpeg` | 16:9 | 2752×1536（實際） | Sol 3 艦長日誌（§3.3） | `scenes/42-dish-forecast.webp`（1280×714） |

---

## 8. 一致性檢查清單

目視驗收用；2026-11-14 只完成檔案齊備與 manifest 核對，下列項目仍待看圖者逐項勾選：

- [ ] 三隻貓都是**四足**，沒有擬人站立、沒有手。
- [x] Silver 是白金長毛、藍綠眼；沒有圍裙、腰帶。
- [ ] Shadow 是純黑、紫黑裝甲、單眼藍色 HUD；沒有工具腰帶。
- [ ] Ginger 是胖橘虎斑、橘白太空裝；沒有番茄圍裙、沒有手持澆水壺。
- [ ] 太空裝顏色、口袋、背包與參考圖一致。
- [ ] 布章只有抽象幾何；沒有 NASA meatball、沒有 `NASA` 字母。
- [ ] 需要操作的動作由無人機、機械臂、掌壓面板完成。
- [ ] 畫面沒有文字、標籤、Logo、浮水印。
- [ ] OG 卡上方 30% 沒有臉或耳朵，標題由程式疊，不是模型畫的。
- [ ] 火星天空是奶油糖色，地平線附近淡藍；沒有藍天白雲、綠地。
- [ ] 16:9 主體在中央 80%；3:4 臉在上三分之一。
- [ ] 兒童友善：無寫實火焰／受傷／恐怖表情；風格化迫降特效可接受。

---

## 9. 備註

- 這份文件只放圖像 prompt，不放 NASA 資料出處；資料來源與誠實性說明見 `docs/data-sources.md`。
- 2026-11-14 產出的網頁資產、中英 `alt`、`srcset` 與處理參數見 `src/assets/generated/manifest.json`、`src/assets/avatars/manifest.json`；使用說明見兩份 `README.md`。
- 圖像屬遊戲虛構；太陽閃焰是真實事件，迫降與火星受災是訓練模擬，相關文案見 `PLAN.md`。
- 若之後新增角色或場景，沿用第 1 節的風格句與第 2 節的角色錨點，不要另創風格。
- 三張參考圖已內建於 GEM；本文件與 `docs/gem-instructions.md` 都假設 GEM 看得到它們。若 GEM 重置，先把 `docs/assets/characters/` 的三張圖重新上傳。
