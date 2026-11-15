# 30 秒 Demo 影片腳本（11/12）

> 最後更新：2026-11-15（第五版：片頭拿掉 Gale 衛星圖，只留 SDO 閃焰 1.5 秒；迫降取 `scene2-crash.mp4` 的 5.00–6.80 秒，用 0.5× 慢動作播成 3.6 秒；片頭四個鏡頭之間加暗轉，全片 11 鏡。第三版把第 8 鏡改成 Low-gravity hop 與 Harvest the tomatoes 的開場畫面，不錄遊玩；第 6 句旁白改為 12 字。逐格時間表見 `tools/video/DEMO-TIMELINE.md`，重做清單見 §0.7）
> 對應 PLAN 12.3。英文旁白＋英文字幕（全球評審）；可另附繁中字幕檔。
> **定版：總長 30.0 秒。** 0–2.5 秒文字卡不配音；旁白 v3 **9 句 59 字**，燒字幕唯一來源是 `narration-ana-45-v3.srt`（重拍後重跑 `make-narration.mjs`）；結尾卡只佔 **最後 1.0 秒**（29.0–30.0，播完停在這一頁）。鏡表見 §0.4、旁白見 §0.6。
>
> 11/12 以 Windows SAPI（Zira，rate 3）實測 57 字＝23.8 秒；edge-tts 7.3.1 的 Ana +45%＝**26.5 秒（已選）**、Aria +45%＝24.0 秒（成人聲備案）、Guy +45%＝23.4 秒；+0% 約 34 秒，不能直接用。

---

## 0. 官方 30 秒規格對照（2026-11-13）

> 官方規則：≤30 秒；影片**必須有英文字幕**；放 YouTube／Google Drive 等外部託管，連結公開可開；評審看 **Impact／Creativity／Validity／Relevance／Presentation**。
> 官方建議節拍與我們的對應：

| 官方節拍 | 要求 | 我們的畫面 |
|---|---|---|
| 0:00 | 你的名字＋團隊名 | 第 1 鏡**文字卡（無旁白）**：`FLY MY MIND`＋成人名字＋`our junior astronaut`＋專案名 |
| 0:02 | 解決什麼挑戰、為什麼選它 | 第 2 鏡口播「A Mars mission trainer for kids seven to twelve.」（lower-third 於 11/15 取消，與字幕重複；改由旁白＋標題卡 eyebrow 承擔） |
| 0:05 | 專案名稱＋口號 | 第 4 鏡標題卡 |
| 0:10 | 怎麼運作、UX、NASA 開放資料 | 第 5–10 鏡（S1 卡→取捨→三款小遊戲：著陸實玩＋hop／tomato 開場→知識卡＋背包→資料面板） |
| 0:20–0:30 | 展望未來 | 第 11 鏡（任務報告→結尾卡）。本版末句是 `One choice they'll remember.`，沒有明講「未來」；要補展望句見 §0.6 最後一條 |

### 0.1 與 §1 的差異

1. **原稿 0:00 直接進「Three cat astronauts」，沒有自我介紹與團隊名。** 官方要 0:00 看到名字與團隊；改用 2.5 秒**無旁白文字卡**，資訊到位、不佔旁白秒數。
2. **原稿沒有「挑戰名稱＋動機」。** 評審要聽到這是 Junior Astronaut Mission Trainer、給 7–12 歲。
3. **原稿 22–30 秒是標題卡，沒有展望。** 官方要 0:20–0:30 講「還能為誰做什麼」。

### 0.2 修訂版：開場文字卡＋55 字口播（旁白約 25.6 秒）

> 第 1 鏡**不配音**，只放全螢幕文字卡；旁白從 2.5 秒開始。不新增鏡頭、不換錄影路徑。**錄前用 edge-tts 重測**，超過 29 秒就砍第 2 鏡的 "Three cats, seven sols."。

| # | 秒數 | 英文旁白 | 字數 | 畫面／螢幕文字 |
|---:|---:|---|---:|---|
| 1 | 0.0–2.5 | （無旁白） | 0 | 全螢幕文字卡，背景 `brand/og-1200x630.jpg`；OG 左上已有 `MEOWSTRONAUTS / MARS OUTPOST`、左下已有 `Fly My Mind`，只再加一行 `【Adult 1】 · 【Adult 2】 · our junior astronaut` |
| 2 | 2.5–8.5 | A Mars mission trainer for kids 7 to 12. Three cats, seven sols. | 13 | 2.5–4.6 Gale 由遠而近（Mars Trek wide→mid）→ 4.6–5.5 SDO 閃焰白閃（NASA/SDO）→ 5.5–8.5 遊戲迫降動畫；lower-third：`JUNIOR ASTRONAUT MISSION TRAINER · KIDS 7–12` |
| 3 | 8.5–9.9 | Meowstronauts: Mars Outpost. | 3 | 標題卡疊在遊戲畫面上：`SEVEN SOLS · THREE CATS · ONE CHOICE A DAY` |
| 4 | 9.9–13.7 | Every sol, one choice. Every choice costs something. | 8 | S1 太陽閃焰卡；按「加厚遮蔽」 |
| 5 | 13.7–16.9 | Save the power — or save the crew. | 7 | HUD 結算：`⚡ −20`、`🛡️ +25` |
| 6 | 16.9–19.7 | Tap a word. Learn the science. | 6 | 點 `solar flare` 開知識卡；收入背包（8/20→9/20，**不口播**） |
| 7 | 19.7–23.5 | Real NASA data: the May 2025 X2.7 flare. | 8 | 資料面板：DONKI 折線＋REMS 曲線 |
| 8 | 23.5–28.1 | Next: more sols, classroom mode, a live space-weather feed. | 10 | 任務報告→結尾卡：標題、`FREE · BILINGUAL · 10 MINUTES`、`mars.flymymind.com` |

- 結尾卡至少停 1.5 秒；修訂版旁白 28.1 秒結束，留 1.9 秒，不要馬上切黑。
- 第 1 鏡只有**成人團隊成員的名字**；小孩一律寫 `our junior astronaut`，不放姓名、正臉、學校。不想露名就只留 `FLY MY MIND`，不要編名字。
- `brand/og-1200x630.jpg` 已印 `MEOWSTRONAUTS / MARS OUTPOST / Fly My Mind`，字卡只加「成人名字」那一行，不要重複壓大標。做法：等比放到 **1920×1008、上下各 36px 同色底**（不裁切；裁滿 16:9 會切到左上標題，只剩約 14px 邊）。1.6× 放大可加輕微銳化；`brand/logo-three-cats-512.png` 只有 512px，不要拿來重排。
- 第 2 鏡的 Gale 由遠而近用 **Mars Trek 匯出的三張靜圖**（`tools/video/assets/mars-trek/`），不要螢幕錄製網站：wide 2.5–3.6 慢慢推近、mid 3.6–4.6 接手，crossfade 0.25 秒；`gale-close.jpg` 放大後偏軟，只在需要時當 0.4 秒尾拍。credit 見同目錄 `CREDITS.md`。
- 火星全景 `tools/video/assets/apod/mars-globe-viking-2024-11-10.jpg` 是**備選**：想先看到整顆火星，就放 2.5–3.3 再切 Gale（3.3–4.6）；不放也可以，Gale 直接開場比較順。
- 閃焰 `sun-flare-sdo-2017-09-14.jpg`（NASA/SDO）放 4.6–5.5；**不要把這張圖講成 2025-05-14 的 X2.7**，旁白與字幕都不提它的日期，X2.7 只出現在 23 秒的 DONKI 資料面板。畫面右下角小字 `NASA/SDO`、`NASA/JPL-Caltech · Mars Trek` 各停約 1.5 秒。
- 第 1 鏡之後的 lower-third 是文字，不佔旁白秒數；若畫面太擠，改成只在 2.5–4.0 秒出現。
- 英文字幕照 §4 燒進影片，另附 `.srt`；英文是必要，繁中可選。第 1 鏡已有英文文字，不需另加字幕。
- 若重測超過 29 秒：先砍第 2 鏡的 "Three cats, seven sols."（-4 字），再砍第 6 鏡（-6 字），最後才用 §6 的 20 秒版。不要加快語速。

### 0.3 評審五項對照（寫給剪輯與 QA）

| 標準 | 影片裡要看到 |
|---|---|
| Impact | 兒童真的在做取捨，不是答題 |
| Creativity | 三隻貓＋卡片式任務，不是儀表板 |
| Validity | 真實 DONKI X2.7 與 REMS 冷週，標「snapshot, not live」 |
| Relevance | 對應 Junior Astronaut Mission Trainer、7–12 歲 |
| Presentation | 英文字幕、清楚可讀、≤30 秒、無 debug 畫面 |

### 0.4 定版鏡表（2026-11-15 第五版；第二～五版改動列在下方）

> 錄影、剪輯與 QA 的唯一依據；§0.2 的 8 鏡表保留作修訂過程。旁白 `tools/video/narration-ana-45-v3.mp3`、字幕 `narration-ana-45-v3.srt`（9 句，時間軸由 `make-narration.mjs` 產生；第 6、9 句改字後**必須重跑**）。音樂候選見 `tools/video/assets/music/CREDITS.md`。
>
> **逐格對照表**：`tools/video/DEMO-TIMELINE.md`（每個輸出時間 ↔ 圖檔／影片檔來源時間 ↔ 旁白 cue ↔ SRT 行）。重建後跑 `node tools/video/verify-timeline.mjs`，17 個抽格要全部 PASS；任何一格對不上就先修時間表，不要直接上傳。
>
> **第二版四項改動（11/15 重拍時一起做）**
>
> 1. **全片英文語系**：所有錄影網址都帶 `lang=en`，畫面不得出現任何中文（見 §0.5）。
> 2. **片頭遊戲影片取撞擊段，不取片尾**：`scene2-crash.mp4` 是 10.00 秒，真正的迫降在 **5.0–6.8 秒**的地面鏡頭；6.8–10.0 只剩慢慢散開的塵土和站定的貓，剪片尾會看不到迫降。第五版從地面鏡頭的剪接點 **`-ss 5.00`** 取 **1.8 秒**（5.00–6.80），用 **0.5× 慢動作**播成 **3.6 秒**（`setpts=(PTS-STARTPTS)*2.0`）；落下約 0.8 秒、撞地約在輸出 4.40 秒、爆炸＋揚塵約 2 秒、三隻貓在輸出 7.0 秒後出現。不要從中間任意秒數起剪。
> 3. **第一個小遊戲縮短**：Mars Weather Lander 2.8 秒 → **2.2 秒**，省下的 0.6 秒給第 8 鏡（第三版改成 hop／tomato 開場各約 1 秒，見下面第 5 點）。
> 4. **旁白不說「10 minutes」**：第 9 句改成 `One choice they'll remember.`。
>
> **第三版（11/15 追加，與上面四項一起做）**
>
> 5. **第 8 鏡只拍開場畫面**：Low-gravity hop 與 Harvest the tomatoes 各給約 1 秒的開場／第一屏，**不錄遊玩**；著陸小遊戲仍是實玩 2.2 秒。
> 6. **第 6 句旁白改字**：`Then practice with mini-games: land the ship, hop the ridge, pick tomatoes.`（12 字，15.60 起），重跑 `make-narration.mjs`。
>
> **第四版（11/15 追加）**
>
> 7. **片頭拿掉 Gale 衛星圖**：第 2 鏡只放 SDO 閃焰（1.5 秒），不再放 Mars Trek 推近。
> 8. **迫降吃滿片頭剩下秒數**：第 3 鏡延長為 **3.6 秒**，從地面鏡頭起點 **`-ss 5.00`** 取 5.00–6.80 的 1.8 秒再放慢。**不要取片尾**：6.80–10.00 只剩塵土，迫降會整段看不到。
>
> **第五版（11/15 晚，修正「閃來閃去」）**
>
> 9. **迫降慢動作**：第 3 鏡改成 **0.5×**（`setpts=(PTS-STARTPTS)*2.0`，來源 5.00–6.80），讓落下、撞地、爆炸、貓出現各有秒數，不再一閃而過。
> 10. **片頭暗轉**：第 1→2 鏡、2→3 鏡、3→4 鏡、4→5 鏡都改成 0.25 秒淡出＋淡入（不再硬切）；第 2 鏡的 SDO credit 先畫再淡，避免 credit 留在黑格上。第 5 鏡用 `setpts=PTS-STARTPTS` 讓淡入從第 0 格開始。
> 11. **逐格驗證**：`tools/video/verify-timeline.mjs` 對 17 個時間點抽格比對 SSIM，全部 PASS 才產出最終檔。
>
> **結尾卡只吃最後 1 秒。** 播放器播完會停在最後一格，所以識別卡不需要自己站 3 秒；維持 29.0–30.0，不把多出來的秒數吃掉，多出來的時間給前面的鏡頭。

| # | 秒數 | 英文旁白 | 字數 | 畫面／螢幕文字 |
|---:|---:|---|---:|---|
| 1 | 0.0–2.5 | （無旁白） | 0 | 全螢幕文字卡：`FLY MY MIND` ＋ **WU, CHIA-LING · LIN, YU-YU · our junior astronaut** ＋ `MEOWSTRONAUTS: MARS OUTPOST`；背景 `brand/og-1200x630.jpg` 等比 1920×1008、上下 36px 同色底 |
| 2 | 2.5–4.0 | A Mars mission trainer for kids seven to twelve. | 9 | SDO 閃焰淡入 0.25 秒、持 1.5 秒、淡出 0.25 秒；右下 `NASA/SDO`（先畫再淡）。**片頭不放 Gale 衛星圖推近**。**不提這張圖的日期** |
| 3 | 4.0–7.6 | （第 1 句收尾）＋ Three cats. One crash. | 4 | 遊戲內迫降段：`src/assets/video/scene2-crash.mp4`（全長 **10.00 秒**，靜音，1280×720 放大到 1080）的結構是 0–3.5 軌道被擊中、3.5–5.0 火球墜落特寫、5.0–10.0 地面鏡頭（約 5.2 撞地）。取**地面鏡頭 5.00–6.80 的 1.8 秒**，用 **0.5× 慢動作**播成 3.6 秒（`setpts=(PTS-STARTPTS)*2.0`）：落下約 0.8 秒→撞地約在輸出 4.40→爆炸＋揚塵→三隻貓在輸出 7.0 後出現。不要取片尾；6.80–10.00 只剩慢慢散開的塵土與站定的貓 |
| 4 | 7.6–9.7 | Meowstronauts: Mars Outpost. | 3 | 標題卡疊在遊戲畫面上：`SEVEN SOLS · THREE CATS · ONE CHOICE A DAY` |
| 5 | 9.7–13.3 | Seven sols. Every choice costs something. | 6 | `?video=s1`：S1 閃焰警報卡 → 點「加厚遮蔽」→ HUD ⚡62→42、🛡️55→80 |
| 6 | 13.3–15.4 | Save the shield, or save the crew. | 7 | HUD 特寫：`⚡ −20`、`🛡️ +25`（以 build 為準） |
| 7 | 15.4–17.6 | Then practice with mini-games: land the ship, hop the ridge, pick tomatoes. | 12 | **小遊戲 1：Mars Weather Lander**（**2.2 秒**，比第一版短 0.6 秒）：Gale 地圖＋MEDA 樣本 HUD，假游標按 LAND，`Perfect landing!`（final distance 每次錄影不同；11/15 這一版是 15 km，畫面只認 `Perfect landing!`，不寫死數字）。收尾改成 `landed − 1.30` 起剪，落地後至少留 **0.9 秒**看 `Perfect landing!`。畫面已標 `MEDA sample · Jezero Crater`；旁白不說「即時天氣」 |
| 8 | 17.6–19.7 | （同一句，不停） | 0 | **小遊戲 2＆3：只拍開場畫面，不錄遊玩**。17.6–18.6 Low-gravity hop 的 `hop-intro`：標題、`0.38 g practice`、玩法說明、`Start hopping`（**不按** JUMP）；18.6–19.7 Harvest the tomatoes 的第一屏：標題、`Tap the glowing ripe tomatoes…`、`Crate 0/6`、番茄都還在藤上（**不採收**）。兩段都用正常流程從 Sol 列 🦘／🍅 開啟（`?video=` 會把小遊戲列整個藏起來），開啟後停住錄 2–3 秒，剪輯各取約 1 秒 |
| 9 | 19.7–22.1 | Tap a word. Learn the science. | 6 | 點 `solar flare` 開知識卡 → 收入背包 8/20→9/20（不口播） |
| 10 | 22.1–26.0 | Real NASA data: the May 2025 X2.7 flare. | 8 | 資料面板：DONKI 折線（X2.7）＋REMS 曲線，`snapshot, not live` |
| 11 | 26.0–30.0 | One choice they'll remember. | 4 | 任務報告 ★★★（health 78、science 8、背包 9/20）停到 **29.0**，0.2 秒淡入結尾卡：`MEOWSTRONAUTS: MARS OUTPOST`、`FREE · BILINGUAL`、`mars.flymymind.com`、`A FLY MY MIND PROJECT`；**結尾卡 29.0–30.0，最後一格就是這張卡**。旁白與字卡都不再出現「10 minutes」（字卡已於 11/15 重生） |

- 旁白 **59 字、9 句**；剪輯點照上表，字幕時間軸照 SRT（兩者都由 §0.6 的同一組 `start` 產生），不要再套 §1 的 26.5 秒舊時間。
- **全片英文語系**：`?video=s1`、`?video=report` 之外，正常流程那段（hop／tomato 開場）也要在 English 模式錄完再錄。驗收時逐鏡看過，畫面任何角落都不能出現中文（含遊戲 UI、提示、測試殘留、console 疊字）。英文是預設語言，不帶 `lang=zh` 就不會出現中文，但**不能只靠預設值**，錄完要目視確認。
- 第 1 鏡名字只用成人團隊成員：**WU, CHIA-LING**、**LIN, YU-YU**；小孩一律 `our junior astronaut`，不放姓名、正臉、學校。
- 第 3 鏡是**遊戲內同一支影片**（Gemini 生成的迫降動畫，已在 `docs/ai-disclosure.md` 揭露），不是 NASA 畫面；不加 NASA credit，也不說是 NASA 動畫。
- 第 7 鏡的 MEDA 數值是 Jezero 的訓練樣本、地圖是 Gale；畫面上兩者已分開標示，旁白只說「land the ship」，不說是 Gale 的即時風。
- 第 8 鏡走**正常流程**錄，不能用 `?video=s1`：`video` 模式把小遊戲列整個藏起來（`src/ui/SolNav.tsx`，`onMinigame` 不傳）。錄法：首頁 → `Officer` → 跳過開場 → SolNav 的 🦘 → 停在 `hop-intro`（**不按** `Start hopping`／JUMP）；關閉後再點 🍅 → 停在 `Harvest the tomatoes` 第一屏（**不點**任何番茄）。兩段各錄 2–3 秒，剪輯各取約 1 秒；是部署版實錄，不是 AI 圖。
- 第 11 鏡的結尾卡是**整支影片的最後一格**，不再往後留黑。YouTube 播完會停在這個畫面，所以看得到網址；若改放不 freeze 的平台（例如 Google Drive 預覽），把結尾卡加回 2 秒。
- 第 5–11 鏡全部是部署版實錄：`?video=s1`（S1 卡→加厚遮蔽→知識卡→背包→資料面板）與 `?video=report`；契約見 `docs/video-path.md`。
- 音樂：兩首 Pixabay 曲目皆為 Content ID Registered。預設 `paulyudin-space-space-music-607605.mp3` 鋪 30 秒床（淡入 1 秒、28.0 秒起 2 秒淡出收在結尾卡、旁白 −18dB 以下）；被 YouTube claim 就用曲目頁與授權申訴，不用下架。

### 0.5 錄法：Playwright＋假游標（2026-11-14，11/15 補英文語系規則）

- **一律 English 模式錄。** 每一段都用 `lang=en`（English 是預設語言，但不能依賴預設）：`?reset=1&video=s1&lang=en`、`?reset=1&video=report&lang=en`、`?reset=1&lang=en`（低重力跳躍那段的正常流程）。錄前先手動確認頁面是英文；錄完在剪輯前逐格檢查畫面有沒有中文，有就重錄該段，**不要在剪輯裡遮字**。
- 對**部署版** `https://mars.flymymind.com` 錄，1920×1080、`deviceScaleFactor` 1，輸出 30fps。
- Playwright 的 `recordVideo` **不會錄到真實游標**，所以在頁面注入假游標（圓點＋光暈，隨 `mousemove` 移動、點擊時縮一下），只影響錄影、不改遊戲程式。
- `?scene=opening2` 的 Skip 按鈕直接在錄影腳本裡按掉；**不要用注入 CSS 隱藏**——部署版的 CSP 會擋掉 `addStyleTag` 注入的 `<style>`。
- **「中文」切換鈕錄影時從 DOM 移除**：正常流程錄的著陸、番茄小遊戲與頂端語言鈕都有「中文」按鈕（`?video=` 模式沒有，但第 8、9 鏡走正常流程）。`capture-demo.mjs` 的 `hideLangToggles()` 在開啟遊戲後把這些按鈕 `remove()`；只在錄影腳本裡，不動遊戲程式。CSP 會擋 CSS，所以是移除不是隱藏。
- 分段錄：A＝SDO／標題（靜圖與字卡在剪輯做；迫降用遊戲內影片檔，不用錄）、B＝`?video=s1` 全程、C＝著陸小遊戲實玩（SolNav `landing game`）、D＝`?video=report`、E＝Low-gravity hop 與 Harvest the tomatoes 的開場畫面（走正常流程，見 §0.4 第 8 鏡）；每段重載並帶 `?reset=1`，避免 localStorage 殘留。
- 錄影腳本放 `tools/video/`（與遊戲無關、不加遊戲依賴）；輸出到 `tools/video/output/`（git-ignored）。
- 只重錄某一段：`node capture-demo.mjs hopIntro`／`node capture-demo.mjs tomatoIntro`（參數是 clip 名），標記會併回 `capture.json`，不會動到其他段。

### 0.6 旁白 v3（2026-11-15 01:10；第三版改第 6 句）

> 由 `tools/video/make-narration.mjs` 產生：每句一個 edge-tts 音檔（Ana +45%），先去掉首尾靜音，再依下表的 `start` 排到 30 秒時間軸上，同一組數字同時寫出 MP3 與 SRT——字幕不會跟畫面飄開。改字就改 `CUES` 再跑一次。

| # | 起 | 迄 | 英文旁白 | 字 | 對應鏡頭 |
|---:|---:|---:|---|---:|---|
| 1 | 2.50 | 4.71 | A Mars mission trainer for kids seven to twelve. | 9 | 2 SDO＋3 迫降開頭 |
| 2 | 5.60 | 7.49 | Three cats. One crash. | 4 | 3 迫降 |
| 3 | 7.80 | 9.46 | Meowstronauts: Mars Outpost. | 3 | 4 標題卡 |
| 4 | 9.90 | 12.57 | Seven sols. Every choice costs something. | 6 | 5 S1 卡 |
| 5 | 13.50 | 15.16 | Save the shield, or save the crew. | 7 | 6 HUD |
| 6 | 15.60 | 19.42 | Then practice with mini-games: land the ship, hop the ridge, pick tomatoes. | 12 | 7 著陸＋8 hop／tomato 開場 |
| 7 | 19.80 | 21.83 | Tap a word. Learn the science. | 6 | 9 知識卡＋背包 |
| 8 | 22.20 | 25.59 | Real NASA data: the May 2025 X2.7 flare. | 8 | 10 資料面板 |
| 9 | 26.10 | 27.17 | One choice they'll remember. | 4 | 11 任務報告 |

- 總計 **9 句 59 字**（`make-narration.mjs` 以空白斷詞，`they'll` 算一字；第 6 句 10→12 字）；末句 27.17 秒結束，留約 1.8 秒給結尾卡。**已於 11/15 重跑 TTS**：`narration-ana-45-v3.mp3/.srt` 同步更新，第 6 句 15.60–19.42、第 9 句 26.10–27.17。之後再改字仍要重跑；若第 6 句收在 19.80 之後，把第 7 句起往後挪 0.2–0.4 秒。
- 和第 2 版（61 字）比：砍掉 `Three cats, seven sols.` 與 `Every sol, one choice` 的重複、把練習小遊戲收進同一句（第三版再點名三款）、結尾從功能清單（`classroom mode` 等）改成北極星句。**「classroom mode」在 `PLAN.md` 與任何產品文件都沒有定義過**，寫在影片裡等於承諾一個不存在的功能，所以拿掉。
- 想保留展望句（官方 0:20–0:30 建議「未來」）就換第 9 句為：`Next: more sols, and live space weather.`（7 字，約 2.5–2.7 秒，26.10 起仍可在結尾卡 29.0 前收完）。
- 句間停頓至少 0.18 秒；`make-narration.mjs` 遇到排不進去會直接失敗並列出重疊的句子，不會默默擠在一起。

### 0.7 11/15 重做清單（照這張做，不要憑記憶）

> 11/15 早上重拍。**只重拍，不改遊戲程式**；下面是唯一要動的地方。

1. **英文語系**（不用改程式）：`tools/video/capture-demo.mjs` 的五個 `page.goto`（`s1`／`lander`／`report`／`hopIntro`／`tomatoIntro`）都要帶 `lang=en`。正常流程的片段要先移除「中文」切換鈕（`hideLangToggles()`，見 §0.5）。動手前先確認 `.mjs` 沒被人改掉；錄完逐鏡目視，**畫面出現任何中文就重錄該段**（不是遮掉）。
2. **片頭先 SDO、再迫降，迫降取撞擊段並放慢**：`assemble-demo.mjs` 第 2 段是 SDO 靜圖 **1.5 秒**（`2.5–4.0`，0.25 秒淡入／淡出，`NASA/SDO` 先畫再淡），不再放 Gale 衛星圖；第 3 段迫降 `start: 5.00`、`seconds: 3.6`，`vf` 最後加上 **`setpts=(PTS-STARTPTS)*2.0`**（來源 `scene2-crash.mp4` 全長 10.00 秒、24 fps，5.00 是地面鏡頭的剪接點；5.00–6.80 的 1.8 秒放成 3.6 秒）。`-ss` 必須放在 `-i` **前面**（input seeking），且淡入淡出放在 `post`（`fps=30` 之後）；把 `-ss` 放後面會讓來源 PTS 帶著 5.00 的偏移，淡出濾鏡會以為已經播完，整段變黑。**不要取片尾**：6.80–10.00 只剩塵土，迫降會看不到。
3. **著陸小遊戲縮短**：第 7 段 `seconds: 2.8 → 2.2`、`start: landed − 1.75 → landed − 1.30`（落地後留 0.9 秒的 `Perfect landing!`）。
4. **第 8 段改成兩個開場畫面**：hop 取 `hop-intro`（17.6–18.6）、tomato 取第一屏（18.6–19.7），各約 1 秒，**不要再 JUMP、不要採收**。`capture-demo.mjs` 的 hop 段改成只停在開場，並新增 tomato 段；`assemble-demo.mjs` 第 8 段用這兩段串接。
5. **旁白改兩句**：`make-narration.mjs` 的 `CUES` 第 6 句改成 `Then practice with mini-games: land the ship, hop the ridge, pick tomatoes.`，最後一句改成 `One choice they'll remember.`；重跑後把新的結束秒數填回 §0.6、確認 26.10 起、29.0 前收完；SRT 會一起重寫。
   - **結尾卡已同步改掉**：`demo-cards.html` 的 chips 改成 `FREE · BILINGUAL`，`end.png` 已重生（11/15），旁白與畫面都不再出現「10 minutes」。重拍時直接用新卡，不要用舊的 `end.png` 備份。
6. **重跑順序**：`node make-narration.mjs` → `node capture-demo.mjs`（五段都重錄；只想補一段就帶 clip 名）→ `node assemble-demo.mjs`。最後用 `ffprobe` 確認長度 ≤30.000 秒、有音軌、有燒字幕。
7. **驗收**：先對 `tools/video/DEMO-TIMELINE.md` 的逐格表，再跑 `node tools/video/verify-timeline.mjs`，**17 個抽格要全部 PASS**（圖卡 ≥0.90、影片 ≥0.82）。另外目視確認片頭沒有 Gale、第 3 鏡看得到太空船掉下來＋撞地＋爆炸＋揚塵＋貓（不是只有塵土）、第 8 鏡兩段都停在開場（沒有遊玩畫面）、片尾卡在 29.0 秒出現、第 11 鏡最後一格是結尾卡、全片無中文。

---

## 1. 分鏡表

| # | 畫面時間 | 秒數 | 畫面 | 英文旁白 | 字數 | 語音區間（實測） | 螢幕文字 |
|---:|---|---:|---|---|---:|---|---|
| 1 | 0.0–4.8 | 4.8 | 開場分鏡：太陽風暴打中航行中的貓咪船，畫面震動、警報閃 | Three cat astronauts. One crash landing. Seven sols to survive. | 10 | 0.0–4.6 | 7 SOLS |
| 2 | 4.8–7.4 | 2.6 | 三隻貓一一出現（頭像圓盤），名字淡入 | Meet Silver, Shadow, and Ginger. | 5 | 5.3–7.2 | SILVER · SHADOW · GINGER |
| 3 | 7.4–11.2 | 3.8 | S1 太陽閃焰警報事件卡出現，手指點開「加厚遮蔽」 | Every sol, one choice. Every choice costs something. | 8 | 7.9–11.0 | POWER −20 / SHIELD +25 |
| 4 | 11.2–13.8 | 2.6 | 結算：⚡ 下降、🛡️ 上升，HUD 數字跳動 | Save the power — or save the crew. | 7 | 11.7–13.3 | ⚡ −20　🛡️ +25 |
| 5 | 13.8–16.2 | 2.4 | 點虛線字 `solar flare` → 知識卡 drawer；按「收入背包」 | Tap a word. Learn the science. | 6 | 14.0–16.0 | KNOWLEDGE CARD |
| 6 | 16.2–17.8 | 1.6 | 背包打開，8/20 → 9/20 | Keep it in your backpack. | 5 | 16.6–17.5 | 9 / 20 COLLECTED |
| 7 | 17.8–22.0 | 4.2 | 資料面板：DONKI 圖表與 REMS 曲線，游標停在 X2.7 | Real NASA data: the May 2025 X2.7 flare. | 8 | 18.3–21.6 | NASA DONKI · CURIOSITY REMS |
| 8 | 22.0–30.0 | 8.0 | 任務報告 3 星 → 標題卡＋隊伍名 | Meowstronauts: Mars Outpost. A Fly My Mind project. | 8 | 22.3–25.9 | FREE · BILINGUAL · 10 MINUTES<br>MEOWSTRONAUTS: MARS OUTPOST<br>A FLY MY MIND PROJECT |

**旁白總字數：57 字。** 已選 Ana +45%：實測 **26.5 秒**（總平均 2.15 字／秒）；最後一句 25.9 秒結束，標題卡停 4.1 秒。語音區間用 `ffmpeg silencedetect` 量測，剪輯時以此對齊，不要再套 23.8 秒的舊時間。第 4、6 鏡的短句聽起來較快，但句子短、前後有停頓；若換人聲，總長控制在 27 秒內。

> 若實錄超過 30 秒，先砍第 2 鏡整句（角色名字由畫面承擔）與第 3 鏡第二句；仍超過就改用第 6 節 20 秒版。不要加快語速。
>
> **不在這支影片裡：** PIA25077「火星花」只放遊戲內 F1（見 `docs/event-cards.md` §3.2）；影片沒有秒數，不要加。它是石頭，不是植物。

## 2. 繁中字幕（對照用，不燒進英文版）

> 這張表對應的是 §1 的舊 8 鏡版（第 8 句的「十分鐘」已於 11/15 拿掉）。成片以 §0.4／§0.6 為準；**不要把這張燒進任何版本**，英文版字幕唯一來源是 `narration-ana-45-v3.srt`。

| # | 字幕 |
|---:|---|
| 1 | 三隻貓太空人，一次迫降，七個火星日。 |
| 2 | 認識銀白、暗影、金桔。 |
| 3 | 每個火星日，一個選擇。每個選擇都有代價。 |
| 4 | 救電力，還是救同伴？ |
| 5 | 點開一個詞，看懂背後的科學。 |
| 6 | 收進背包，隨時再看。 |
| 7 | 真實 NASA 資料：2025 年 5 月的 X2.7 閃焰。 |
| 8 | 免費、雙語。《喵航員：火星基地》，Fly My Mind 出品。 |

## 3. 素材需求

| 鏡頭 | 需要什麼 | 來源 | 狀態 |
|---:|---|---|---|
| 0 | 開場文字卡：`FLY MY MIND`／成人名字＋`our junior astronaut`／專案名；背景 `brand/og-1200x630.jpg`（1920×1080 重排，或放大後左右裁切） | 已有 | 剪輯時做 |
| 0b | 太陽閃焰：NASA/SDO（APOD 2017-09-14），4096×4096，縮到 1080 高左右補黑；只作示意，不說是 2025-05-14。**第四版片頭只放這張，Gale 衛星圖不用** | `tools/video/assets/apod/sun-flare-sdo-2017-09-14.jpg` | 已有 |
| 0c | 備選火星全景：NASA/USGS/Viking（APOD 2024-11-10），1552×1552，放黑底 | `tools/video/assets/apod/mars-globe-viking-2024-11-10.jpg` | 已有 |
| 1 | 優先錄遊戲內幕 2 動畫的風暴＋飛船段（約 2.5–5.5 秒，靜音，可慢放）；2.5 秒後接在文字卡之後 | 11/14 build；靜圖見 `docs/image-prompts.md` | 11/14 深夜錄 |
| 2 | 三張角色頭像（透明底） | `brand/avatar-*-512.webp` | 已有 |
| 3–4 | 真實遊戲畫面錄影 | 11/14 build（21:00 freeze） | 11/14 深夜錄 |
| 5–6 | 知識卡與背包畫面 | 同上 | 11/14 深夜錄 |
| 7 | 資料面板畫面 | 同上；DONKI 用快照畫折線 | 11/14 深夜錄 |
| 8 | 任務報告＋標題卡 | 同上；標題卡可用 OG 素材重排 | 11/14 深夜錄 |

- 不要用 AI 生成圖假裝是遊戲畫面；第 3–7 鏡必須是實際 build 的螢幕錄影，第 8 鏡的任務報告也是實錄（標題卡可用 OG 素材重排）。
- 第 1 鏡優先錄遊戲內幕 2 動畫（靜音）；動畫不穩才用分鏡圖＋簡單位移，不需要另外做動畫影片。

## 4. 錄製規格

| 項目 | 規格 |
|---|---|
| 解析度 | 1920×1080，30fps |
| 錄製 | Playwright 對部署版錄製（§0.5）；瀏覽器縮放 100%，無書籤列 |
| 游標 | 注入假游標（§0.5）；點擊前停 0.3 秒，移動用緩動 |
| 字幕 | 英文字幕燒進影片（YouTube 自動字幕不可靠），另上傳 `.srt` |
| 音樂 | 輕柔、無版權疑慮；音量壓在旁白 −18dB 以下 |
| 旁白 | 清楚、從容、每句之間留 0.5–0.7 秒；不用誇張廣告腔 |
| 結尾 | 最後一鏡旁白結束後，標題卡至少停留 1.5 秒（§0 修訂版約 1.9 秒） |

## 5. 拍攝前檢查（11/14 21:00 build freeze）

- [ ] build 在 21:00 凍結；21:00 後沒有再改遊戲程式。
- [ ] 影片路徑可用 `?video=s1`／`?video=report` 重現（契約見 `docs/video-path.md`）：Sol 4 S1 卡 → 加厚遮蔽 → `solar flare` 知識卡 → 背包 → 資料面板 → 任務報告。
- [ ] 英文介面已切好；沒有 debug 面板、測試資料、console error。
- [ ] 鏡表照 **§0.4 定版**（11 鏡：文字卡→SDO 閃焰→遊戲內迫降→標題→S1 卡→HUD→Mars Weather Lander→Low-gravity hop 開場＋Harvest the tomatoes 開場→知識卡＋背包→資料面板→任務報告／結尾卡）；旁白 `narration-ana-45-v3.mp3`、字幕 `narration-ana-45-v3.srt`；音樂兩首候選見 §7.2。
- [ ] 實照已加 credit（`NASA/SDO`）；沒有把 SDO 閃焰說成 2025-05-14 的 X2.7。
- [ ] 遊戲為最終版，沒有測試資料、沒有 `localhost`、沒有開發者工具。
- [ ] 畫面中的數字與腳本一致（⚡ −20、🛡️ +25、9/20）；不一致就改腳本，不改畫面。
- [ ] 沒有出現「strong geomagnetic storm」字樣。
- [ ] 三隻貓名字拼字正確：Silver、Shadow、Ginger。
- [ ] 遊戲名拼字正確：Meowstronauts: Mars Outpost。
- [ ] 隊伍名只有 `Fly My Mind`，沒有其他 Logo。
- [ ] 匯出後先存 `output/`；長度、聲音、字幕與 YouTube 上傳在 11/15 §8 檢查。

## 6. 備用腳本（20 秒版）

若提交頁限制 20 秒，砍第 2、6 鏡，只留第 1、3、4、5、7、8 鏡，旁白改為：

```
Three cat astronauts. Seven sols to survive.
Every sol, one choice. Save power, or save the crew.
Tap a word. Learn the science. Real NASA data.
Meowstronauts: Mars Outpost. A Fly My Mind project.
```

（34 字，約 20 秒；實際錄一次確認。）

## 7. 11/14 睡前交接清單（22:30–23:00）

> 逐項確認；任何一項「否」就先不要交接，回到 11/15 16:00–18:00 原案。
> 交接後團隊睡覺；Claude 夜間產出 v1，11/15 09:00 審閱。

### 7.1 Build 與錄影路徑

> 完整 URL 契約、fixture 數值與 `data-testid` 清單見 `docs/video-path.md`；本節只列交接時要口頭確認的項目。

- [ ] build 在 21:00 凍結；21:00 後沒有再改遊戲程式。
- [ ] `npm run dev` 或 `npm run preview` 可起；port：＿＿。
- [ ] 英文介面已切好（**全片錄影網址都帶 `lang=en`**，畫面不得出現中文）；`localStorage` 重置方式：＿＿。
- [ ] 影片路徑可重現（seed／localStorage／照步驟點都可以）：
  - [ ] Sol 4 出現 S1「太陽閃焰警報」。
  - [ ] 「加厚遮蔽」顯示 `⚡−20`、`🛡️+25`。
  - [ ] 點 `solar flare` 開知識卡。
  - [ ] 收入背包後 8/20 → 9/20（實際：＿＿／＿＿）。
  - [ ] 資料面板可開，DONKI 折線與 X2.7、REMS 曲線看得到。
  - [ ] 7 sol 跑完，任務報告可開。
- [ ] 每一步有 `data-testid` 或穩定文字；清單：＿＿。
- [ ] 沒有 debug 面板、測試資料、console error。

### 7.2 素材與聲音

- [ ] 第 1 鏡：0–2.5 秒文字卡完成（背景 `brand/og-1200x630.jpg`）；2.5 秒後遊戲內幕 2 動畫可重現（`?scene=opening2`），不穩才用 01、06、07（05 備用）；路徑：＿＿。
- [ ] 或：同意用現有角色圖＋字卡簡化開場。
- [ ] 三隻貓頭像／全身圖路徑：＿＿。
- [x] 音樂：Pixabay 兩首（`tools/video/assets/music/`）——`paulyudin-space-space-music-607605.mp3`（1:58，預設）、`monume-space-ambient-498030.mp3`（1:53，備選）；皆 Pixabay Content License、**皆標示 Content ID Registered**（claim ≠ strike，用曲目頁申訴）；credit 與授權見同目錄 `CREDITS.md`。
- [x] 旁白：edge-tts 童聲 Ana +45%，v3 **9 句 59 字** → **`narration-ana-45-v3.mp3`／`.srt`**，由 `make-narration.mjs` 排程產生（§0.6），第三版改第 6 句後重跑，最後一句 27.17 秒結束。v2（61 字）已被取代，`narration-ana-45.mp3`（§1 的 57 字版）不要再用。
- [ ] **11/15 重拍版**：第 6 句改成 `Then practice with mini-games: land the ship, hop the ridge, pick tomatoes.`、第 9 句改成 `One choice they'll remember.`（產生器斷詞 59 字），重跑 `make-narration.mjs` 覆蓋 v3 檔案，新的結束秒數填回 §0.6。11/15 想換人聲也可以，同樣改跑 `make-narration.mjs` 重對時間軸。
- [ ] 發音確認：Meowstronauts（meow-STRON-awts）、sols（souls）、X2.7（ex-two-point-seven）。

### 7.3 腳本與數字

- [ ] 採用 §0.4 十一鏡版：第 1 鏡是**無旁白文字卡**（`Fly My Mind`＋成人名字＋`our junior astronaut`＋專案名）；片頭只有 SDO 閃焰與遊戲內迫降，**沒有 Gale 衛星圖**；第 7 鏡是著陸小遊戲實玩，第 8 鏡只給 hop 與 tomato 的開場畫面（不錄遊玩）；結尾卡只吃最後 1 秒。
- [x] 第 1 鏡名字：**WU, CHIA-LING · LIN, YU-YU · our junior astronaut**（成人兩位用大寫姓氏格式）；小孩只有 `our junior astronaut`，不放姓名、正臉、學校。
- [ ] S1：`⚡−20`、`🛡️+25`（build 不同時以 build 為準：＿＿）。
- [ ] 背包總數 20、目前 9（build 不同時：＿＿／＿＿）。
- [ ] 標題卡：`MEOWSTRONAUTS: MARS OUTPOST`、`A FLY MY MIND PROJECT`、`FREE · BILINGUAL`（11/15 起不再有 `10 MINUTES`）。
- [ ] 第 2 鏡實照：`tools/video/assets/apod/` 的 SDO flare；credit `NASA/SDO`；旁白不提那張圖的日期。Gale 衛星圖（`tools/video/assets/mars-trek/`）第四版不用。
- [ ] 英文字幕燒進影片＋另附 `.srt`；繁中字幕檔可選。
- [ ] 若需縮短，同意用第 6 節 20 秒版。

### 7.4 權限與機器

- [ ] 不上傳 YouTube、不送出 submission、不 commit 影片檔；早上由團隊做。
- [ ] 不改遊戲功能；缺 `data-testid`／seed 時回報 A，由 A 加（C 不改 core）。
- [ ] 影片輸出到 `output/`，不進 git。
- [ ] 電腦插電、不休眠、不關 VSCode；網路：＿＿（TTS 需要）。
- [ ] 早上 09:00 審閱；聯絡方式：＿＿。
- [ ] 停止條件：22:30 build 不穩或路徑走不通 → 不交接，11/15 16:00–18:00 再做。

## 8. 11/15 早上定稿流程

| 時間 | 工作 | 完成標準 |
|---|---|---|
| 09:00–09:30 | 看 v1；確認旁白、第 1 鏡、音樂 | 三個決定 |
| 09:30–10:00 | 錄正式英文旁白（若換人聲；目標 26–27 秒），3 次；不換則沿用 Ana +45% | WAV／MP3 給 Claude，或確認沿用 TTS |
| 10:00–10:30 | Claude 換音軌、重出成片 | 新檔可看 |
| 10:30–11:00 | 字幕／長度／畫面 QA | ≤30.0 秒 |
| 16:00–18:00 | 最終 QA／上傳 YouTube（必要時補拍） | 影片上傳 |
