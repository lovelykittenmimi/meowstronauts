# 30 秒 Demo 影片腳本（11/12）

> 最後更新：2026-11-13（新增 §0 官方 30 秒規格修訂；§1 保留為原量測版）
> 對應 PLAN 12.3。英文旁白＋英文字幕（全球評審）；可另附繁中字幕檔。
> 總長 **30.0 秒**，旁白 **55 字**（§0 修訂版；第 1 鏡文字卡不配音）。**已選童聲 `en-US-AnaNeural` +45%：57 字實測 26.5 秒（約 2.15 字／秒），55 字約 25.6 秒**；2.5 秒開場字卡＋25.6 秒旁白，結尾留 1.9 秒。**11/14 深夜錄遊戲畫面＋TTS 對時；11/15 09:30 可換人聲，或直接用 TTS 定稿。**
>
> 11/12 以 Windows SAPI（Zira，rate 3）實測 57 字＝23.8 秒；edge-tts 7.3.1 的 Ana +45%＝**26.5 秒（已選）**、Aria +45%＝24.0 秒（成人聲備案）、Guy +45%＝23.4 秒；+0% 約 34 秒，不能直接用。

---

## 0. 官方 30 秒規格對照（2026-11-13）

> 官方規則：≤30 秒；影片**必須有英文字幕**；放 YouTube／Google Drive 等外部託管，連結公開可開；評審看 **Impact／Creativity／Validity／Relevance／Presentation**。
> 官方建議節拍與我們的對應：

| 官方節拍 | 要求 | 我們的畫面 |
|---|---|---|
| 0:00 | 你的名字＋團隊名 | 第 1 鏡**文字卡（無旁白）**：`FLY MY MIND`＋成人名字＋`our junior astronaut`＋專案名 |
| 0:02 | 解決什麼挑戰、為什麼選它 | 第 2 鏡口播＋lower-third「JUNIOR ASTRONAUT MISSION TRAINER · KIDS 7–12」 |
| 0:05 | 專案名稱＋口號 | 第 3 鏡標題卡 |
| 0:10 | 怎麼運作、UX、NASA 開放資料 | 第 4–7 鏡（S1 卡→取捨→知識卡＋背包→資料面板） |
| 0:20–0:30 | 展望未來 | 第 8 鏡（任務報告→結尾卡＋展望句） |

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

| # | 字幕 |
|---:|---|
| 1 | 三隻貓太空人，一次迫降，七個火星日。 |
| 2 | 認識銀白、暗影、金桔。 |
| 3 | 每個火星日，一個選擇。每個選擇都有代價。 |
| 4 | 救電力，還是救同伴？ |
| 5 | 點開一個詞，看懂背後的科學。 |
| 6 | 收進背包，隨時再看。 |
| 7 | 真實 NASA 資料：2025 年 5 月的 X2.7 閃焰。 |
| 8 | 免費、雙語、十分鐘。《喵航員：火星基地》，Fly My Mind 出品。 |

## 3. 素材需求

| 鏡頭 | 需要什麼 | 來源 | 狀態 |
|---:|---|---|---|
| 0 | 開場文字卡：`FLY MY MIND`／成人名字＋`our junior astronaut`／專案名；背景 `brand/og-1200x630.jpg`（1920×1080 重排，或放大後左右裁切） | 已有 | 剪輯時做 |
| 0a | Gale 由遠而近：Mars Trek（NASA/JPL-Caltech）wide→mid，1920×1080，同一中心可直接推近 | `tools/video/assets/mars-trek/gale-wide.jpg`、`gale-mid.jpg` | 已有 |
| 0b | 太陽閃焰：NASA/SDO（APOD 2017-09-14），4096×4096，縮到 1080 高左右補黑；只作示意，不說是 2025-05-14 | `tools/video/assets/apod/sun-flare-sdo-2017-09-14.jpg` | 已有 |
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
| 錄製 | OBS 或系統錄影；瀏覽器縮放 100%，隱藏書籤列 |
| 游標 | 顯示，但不要抖動；點擊前停 0.3 秒 |
| 字幕 | 英文字幕燒進影片（YouTube 自動字幕不可靠），另上傳 `.srt` |
| 音樂 | 輕柔、無版權疑慮；音量壓在旁白 −18dB 以下 |
| 旁白 | 清楚、從容、每句之間留 0.5–0.7 秒；不用誇張廣告腔 |
| 結尾 | 最後一鏡旁白結束後，標題卡至少停留 1.5 秒（§0 修訂版約 1.9 秒） |

## 5. 拍攝前檢查（11/14 21:00 build freeze）

- [ ] build 在 21:00 凍結；21:00 後沒有再改遊戲程式。
- [ ] 影片路徑可用 `?video=s1`／`?video=report` 重現（契約見 `docs/video-path.md`）：Sol 4 S1 卡 → 加厚遮蔽 → `solar flare` 知識卡 → 背包 → 資料面板 → 任務報告。
- [ ] 英文介面已切好；沒有 debug 面板、測試資料、console error。
- [ ] 第 1 鏡是 0–2.5 秒文字卡（`brand/og-1200x630.jpg` 重排，無旁白）；第 2 鏡 2.5–4.6 Gale 由遠而近（Mars Trek）、4.6–5.5 SDO 閃焰、5.5–8.5 接遊戲內幕 2 動畫（靜音），不穩才用 01／06／07 靜圖＋位移；音樂已決定；旁白走 TTS scratch（見 §7.2）。
- [ ] 實照已加 credit（`NASA/JPL-Caltech · Mars Trek`、`NASA/SDO`）；沒有把 SDO 閃焰說成 2025-05-14 的 X2.7。
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
- [ ] 英文介面已切好；`localStorage` 重置方式：＿＿。
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
- [ ] 音樂：＿＿（檔案）或「先不要音樂」。
- [ ] 旁白：已選 edge-tts 童聲 Ana +45%（26.5 秒）。**`tools/video/narration-ana-45.mp3` 已放進 repo（158,832 B），C 可直接使用，不必夜間連 TTS**；需要 WAV 時用 ffmpeg 轉 48 kHz mono。11/15 09:30 可換人聲；若換，目標 26–27 秒，對齊現有剪輯點；不換就直接用 TTS 定稿。
- [ ] 發音確認：Meowstronauts（meow-STRON-awts）、sols（souls）、X2.7（ex-two-point-seven）。

### 7.3 腳本與數字

- [ ] 採用 §0 修訂版：第 1 鏡是**無旁白文字卡**（`Fly My Mind`＋成人名字＋`our junior astronaut`＋專案名）；第 2 鏡（2.5 秒起）有挑戰 lower-third；最後一鏡有展望句。
- [ ] 名字只用成人團隊成員；小孩寫 `our junior astronaut`，不放姓名、正臉、學校；不編名字。
- [ ] S1：`⚡−20`、`🛡️+25`（build 不同時以 build 為準：＿＿）。
- [ ] 背包總數 20、目前 9（build 不同時：＿＿／＿＿）。
- [ ] 標題卡：`MEOWSTRONAUTS: MARS OUTPOST`、`A FLY MY MIND PROJECT`、`FREE · BILINGUAL · 10 MINUTES`。
- [ ] 第 2 鏡實照：`tools/video/assets/mars-trek/` 的 Gale wide→mid、`tools/video/assets/apod/` 的 SDO flare；credit `NASA/JPL-Caltech · Mars Trek`、`NASA/SDO`；旁白不提那張圖的日期。
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
| 10:00–10:30 | Claude 換音軌、重出 v2 | v2 可看 |
| 10:30–11:00 | 字幕／長度／畫面 QA | ≤30.0 秒 |
| 16:00–18:00 | 最終 QA／上傳 YouTube（必要時補拍） | 影片上傳 |
