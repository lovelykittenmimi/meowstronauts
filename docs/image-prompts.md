# 喵航員：火星基地 — 圖像生成 Prompt Book

> 用途：Nano Banana 逐張生成遊戲視覺。所有 prompt 以英文書寫，說明以繁中書寫。
> 最後更新：2026-11-12（新增 §0.4 生成批次清單）

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
> **今天生成的圖是參考與測試素材；遊戲內正式美術在 11/14 09:00 後用同一批 prompt 重出並挑選**（見 `brand/style-guide.md` 5.5）。

| 批次 | 張數 | 編號 | 目的 | 完成 |
|---|---:|---|---|---|
| A1 角色穩定 | 6 | 14、15、16、17、18、19 | 六視圖＋表情表；先確認三隻貓不走鐘 | [ ] |
| A2 對話特寫 | 3 | 23、24、25 | 3:4 頭像，測裁切與眼神 | [ ] |
| B1 主視覺 | 4 | 01、05、06、07 | 標題、團隊、迫降、基地外觀 | [ ] |
| B2 場景 | 6 | 08、09、10、11、12、13 | 控制室、溫室、夜修、低溫、覆盤、結局 | [ ] |
| B3 英雄／遠景 | 6 | 20、21、22、26、27、28 | 低角度與高角度各三張 | [ ] |
| B4 故事板 | 1 | 29 | 開場六格 | [ ] |
| C OG 卡 | 1 | 30 | 最後做，等主視覺定稿 | [ ] |

**執行順序**

1. A1 → 檢查第 8 節一致性清單；有任何一隻走鐘，先修 prompt 重出，不要往下做。
2. A2 → B1 → B2 → B3 → B4；每批做完立刻挑圖、改名、放進 `docs/assets/generated/`（暫存），不要等到最後一次挑。
3. C 最後做；OG 標題仍由程式疊，不讓模型寫字。
4. 每張保留：prompt 版本、seed（若有）、生成日期、淘汰原因。這份紀錄 11/15 要寫進 AI disclosure。

**每批驗收**

- [ ] 三隻貓四足、無手、無工具。
- [ ] 天空是奶油糖色，不是地球藍。
- [ ] 沒有文字、Logo、NASA 標誌。
- [ ] 主體在中央安全區，16:9 邊緣 10% 沒有關鍵內容。
- [ ] 兒童友善：無火焰、受傷、恐怖表情。

---

### 0.5 11/14 MVP 最小圖集（8 張）

> 11/12 的圖是參考／測試素材，**不要直接當遊戲內正式美術**。11/14 09:00 後用同一批 prompt 生成、挑選、去背，放 `src/assets/`。
> 27 張完整批次不列入 MVP；11/15 有時間再補。事件卡插圖用 Lucide 圖示或 NASA 照片，知識卡純文字。
> **幕 2 動畫不需新增圖**：背景用 07＋橘紅 overlay，飛船用 SVG 剪影；06 留給幕 3（三貓爬出船艙）。若 07 的太陽能陣列位置真的不合，才補一張 16:9 風暴天空。

| 用途 | 編號 | 張數 | 備註 |
|---|---|---:|---|
| 三隻貓頭像（3:4） | 23、24、25 | 3 | 對話、角色卡、影片第 2 鏡 |
| 主視覺（16:9） | 01 | 1 | 標題卡、開場 |
| 團隊合照（16:9） | 05 | 1 | 標題卡備用、影片第 1 鏡備用 |
| 迫降（16:9） | 06 | 1 | 開場、影片第 1 鏡 |
| 基地外觀（16:9） | 07 | 1 | 開場、影片第 1 鏡 |
| 控制室（16:9） | 08 | 1 | 遊戲背景、資料面板背景 |

**總計 8 張。** 若時間不足，先做 3 頭像＋01＋06＋07（6 張）；05、08 可先用現有圖或 CSS 背景。

**不要生成：** 14–19 六視圖、20–22 低角度、26–28 高角度、29 故事板、30 OG（除非 11/15 有時間）。

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
- **性格**：優雅、高傲、有智慧；姿勢挺立，尾巴繞腳，目光平靜。
- **視覺母題**：金色滾邊、星光、指揮感。
- **不要**：圍裙、腰帶、星形別針、擬人站立、用手拿東西。

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

| # | 檔名 | 比例 | 遊戲內尺寸 | 用途 |
|---|---|---|---|---|
| 01 | `01-keyart.png` | 16:9 | 1920×1080 | 標題、封面 |
| 02–04 | `ref-silver.jpg` / `ref-shadow.jpg` / `ref-ginger.jpg`（`docs/assets/characters/`） | 約 16:9 | 2750×1536（現有） | 角色參考圖，已內建於 GEM，不再生成 |
| 05 | `05-team-lineup.png` | 16:9 | 1920×1080 | 角色選擇 |
| 06 | `06-crash.png` | 16:9 | 1920×1080 | 開場、任務背景 |
| 07 | `07-base-exterior.png` | 16:9 | 1920×1080 | 基地底圖 |
| 08 | `08-control-room.png` | 16:9 | 1920×1080 | 主介面 |
| 09 | `09-greenhouse.png` | 4:3 | 1600×1200 | 事件卡 |
| 10 | `10-night-repair.png` | 16:9 | 1920×1080 | 夜間關卡 |
| 11 | `11-cold-patrol.png` | 16:9 | 1920×1080 | 探索關卡 |
| 12 | `12-debrief.png` | 16:9 | 1920×1080 | 失敗畫面 |
| 13 | `13-ending.png` | 16:9 | 1920×1080 | 結局 |
| 14 | `14-silver-turnaround.png` | 3:2 | 1800×1200 | 六視圖 |
| 15 | `15-shadow-turnaround.png` | 3:2 | 1800×1200 | 六視圖 |
| 16 | `16-ginger-turnaround.png` | 3:2 | 1800×1200 | 六視圖 |
| 17 | `17-silver-expressions.png` | 3:2 | 1800×1200 | 表情表 |
| 18 | `18-shadow-expressions.png` | 3:2 | 1800×1200 | 表情表 |
| 19 | `19-ginger-expressions.png` | 3:2 | 1800×1200 | 表情表 |
| 20 | `20-silver-hero.png` | 16:9 | 1920×1080 | 低角度英雄鏡 |
| 21 | `21-shadow-hero.png` | 16:9 | 1920×1080 | 低角度英雄鏡 |
| 22 | `22-ginger-hero.png` | 16:9 | 1920×1080 | 低角度英雄鏡 |
| 23 | `23-silver-portrait.png` | 3:4 | 1200×1600 | 對話特寫 |
| 24 | `24-shadow-portrait.png` | 3:4 | 1200×1600 | 對話特寫 |
| 25 | `25-ginger-portrait.png` | 3:4 | 1200×1600 | 對話特寫 |
| 26 | `26-silver-wide.png` | 16:9 | 1920×1080 | 高角度遠景 |
| 27 | `27-shadow-wide.png` | 16:9 | 1920×1080 | 高角度遠景 |
| 28 | `28-ginger-wide.png` | 16:9 | 1920×1080 | 高角度遠景 |
| 29 | `29-opening-storyboard.png` | 3:2 | 1800×1200 | 開場故事板 |
| 30 | `og-1200x630.jpg` | 1.9:1 | 1200×630 | OG 社群卡（標題由程式疊） |

---

## 8. 一致性檢查清單

生成後逐張檢查：

- [ ] 三隻貓都是**四足**，沒有擬人站立、沒有手。
- [ ] Silver 是白金長毛、藍綠眼；沒有圍裙、腰帶、星形別針。
- [ ] Shadow 是純黑、紫黑裝甲、單眼藍色 HUD；沒有工具腰帶。
- [ ] Ginger 是胖橘虎斑、橘白太空裝；沒有番茄圍裙、沒有手持澆水壺。
- [ ] 太空裝顏色、口袋、背包與參考圖一致。
- [ ] 布章只有抽象幾何；沒有 NASA meatball、沒有 `NASA` 字母。
- [ ] 需要操作的動作由無人機、機械臂、掌壓面板完成。
- [ ] 畫面沒有文字、標籤、Logo、浮水印。
- [ ] OG 卡上方 30% 沒有臉或耳朵，標題由程式疊，不是模型畫的。
- [ ] 火星天空是奶油糖色，地平線附近淡藍；沒有藍天白雲、綠地。
- [ ] 16:9 主體在中央 80%；3:4 臉在上三分之一。
- [ ] 兒童友善：沒有受傷、火焰、尖牙、恐怖表情。

---

## 9. 備註

- 這份文件只放圖像 prompt，不放 NASA 資料出處；資料來源與誠實性說明見 `docs/data-sources.md`。
- 圖像屬遊戲虛構；太陽閃焰是真實事件，迫降與火星受災是訓練模擬，相關文案見 `PLAN.md`。
- 若之後新增角色或場景，沿用第 1 節的風格句與第 2 節的角色錨點，不要另創風格。
- 三張參考圖已內建於 GEM；本文件與 `docs/gem-instructions.md` 都假設 GEM 看得到它們。若 GEM 重置，先把 `docs/assets/characters/` 的三張圖重新上傳。
