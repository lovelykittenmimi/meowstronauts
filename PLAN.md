# 喵航員：火星基地 — NASA Space Apps Challenge 2026 計畫

> **版本** v1.1 · 2026-11-11  
> **Challenge** Build a Junior Astronaut Mission Trainer  
> **產品代號** Meowstronauts: Mars Outpost（喵航員：火星基地）  
> **正式網域** https://mars.flymymind.com  
> **團隊** 2 位人類 + Claude Code + Gemini Nano Banana  
> **第一版提交** 2026-11-14（六）09:00 開放後儘早送  
> **最終截止** 2026-11-15（日）23:59（當地時間）

---

## 0. 一頁摘要

| 項目 | 決定 |
|---|---|
| 官方 challenge | Build a Junior Astronaut Mission Trainer |
| 目標玩家 | 7–12 歲兒童（可延伸到家長／老師） |
| 遊戲形式 | 瀏覽器直接玩的回合制資源管理遊戲，首次 10–14 分鐘（含開場；讀知識卡會再久一點），重玩 8–12 分鐘 |
| 核心體驗 | 玩家是火星前哨站的「見習指揮官」，在三隻貓咪協助下撐過 7 個火星日（sol） |
| 故事開場 | 三隻喵星貓的飛船被太陽風暴打中，迫降 Hope-1、撞壞太陽能板；補給船 7 個 sol 後才到，基地裡只剩見習指揮官 |
| 核心資源 | 電力、生命維持、輻射遮蔽（三條主計量）＋食物庫存＋船員健康 |
| 知識學習 | 文中術語可點開知識卡（16 張），可收入背包複習；可跳過，不影響勝負 |
| 裝置支援 | landscape-first；手機／平板橫放、桌機同一份程式；568px 到 1440px 不破版，直向顯示旋轉提示 |
| 真實資料 | NASA DONKI（太陽活動）、Curiosity REMS（火星天氣）、OSDR（太空人健康研究）、NASA Mars Facts、NASA Image Library |
| 語言 | 英文為主，右上角可切換繁體中文（11/15 切換；開發期暫以繁中為預設） |
| 技術 | Vite + React + TypeScript，Cloudflare Workers 靜態資產 + `/api` 代理 |
| 部署 | Cloudflare Worker `mars-cat-outpost`，自訂網域 `mars.flymymind.com` |
| 範圍策略 | 先做可玩的 MVP，再依時間加掛；任何時候都保留可提交狀態 |

**North Star：** 小朋友在 10 分鐘內，親手做過一次「救了氧氣就少了電力」的選擇，並且說得出為什麼；想繼續追問的人，背包裡已經有一張知識卡可以再看。

---

## 1. 官方 Challenge 解讀

### 1.1 官方原文重點

> Your challenge is to design and build an interactive game or app that lets kids ages 7–12 manage a lunar or Martian outpost, making real decisions about life support, radiation shielding, power budgeting, food production, and communication delay, and experiencing how those choices play out over the course of a simulated mission.

官方明確要求／建議：

1. **對象是 7–12 歲**，不是給成人玩的硬核模擬器。
2. **火星或月球前哨站**，玩家要管理生命維持、輻射遮蔽、電力、食物。
3. **通訊延遲**是真實 constraint，不能忽略。
4. **盡量用真實 NASA 開放資料**：DONKI、OSDR、Artemis／Mars 表面任務資料。
5. **瀏覽器可直接玩、免下載、免帳號**。
6. **不要有「安全但零成本」的選項**；每個選擇都要有代價。
7. **不要一次丟五六個系統**；2–3 個核心資源通常更有效。
8. **要能重玩**，失敗不要有懲罰感。
9. **要在遊戲內標註資料來源**，讓評審可以追溯。
10. 交付**可運作的原型**，不是簡報或概念圖。

### 1.2 我們的對應

| 官方要求 | 我們的設計 |
|---|---|
| 7–12 歲 | 大字、圖示＋文字、短句、每局 8–12 分鐘、無計時壓力 |
| 火星前哨站 | 「Hope-1 火星前哨站」，7 個 sol 的補給週期 |
| 生命維持 | O₂／水循環計量，歸零則健康快速下降 |
| 輻射遮蔽 | 遮蔽計量，太陽風暴會大幅削減 |
| 電力 | 太陽能供電，沙塵與風暴會影響發電 |
| 食物 | 溫室庫存，吃光會影響健康與士氣 |
| 通訊延遲 | 「呼叫地球」要等 2 個 sol，逼玩家自己做決定 |
| 真實 NASA 資料 | DONKI 快照＋Curiosity REMS 天氣快照＋OSDR 知識卡＋Mars Facts＋Image Library 照片 |
| 兒童學得到東西 | 16 張可選知識卡＋背包複習；術語連到 NASA 來源，不強迫閱讀 |
| 手機與桌機 | landscape-first；手機與平板橫放、桌機；568px 到 1440px 都能玩，直向顯示旋轉提示，不用 hover |
| 瀏覽器、免帳號 | 純前端 SPA，Cloudflare 全球 CDN |
| 每個選擇都有代價 | 每個選項至少有一個負向 delta；有平衡測試 |
| 2–3 個核心資源 | 三條主計量；食物是庫存、健康是結果，不另開系統 |
| 重玩性 | 事件牌洗牌、三種難度、隨機突發事件、分數星等 |
| 資料標註 | 知識卡背包＋Data Sources 面板＋每張卡的真實來源 |

### 1.3 賽前準備的合規界線（重要）

你的理解是「只要賽前不要把程式碼 submit 到 GitHub 就好」。**這樣不夠安全。**  
NASA 官方 FAQ 的原句是：

> “We ask that participants start the actual work when the hackathon begins.”

重點是**作品本身不得在活動開始前開發**，GitHub 只是提交管道；即使活動開始才 push，賽前就寫好的遊戲邏輯仍可能被視為違規，影響全球評審資格。2026 年官方條款以活動頁與 Participant Guide 為準，但保守做法如下：

| ✅ 賽前可以做（基礎設施／品牌／研究） | ❌ 留到 11/14 09:00 後（作品本身） |
|---|---|
| 網域、DNS、Cloudflare、SSL、部署管線 | 遊戲程式碼、元件、狀態機 |
| 空 repo、README、LICENSE、CI/CD 設定 | 實際關卡、事件文案、最終平衡數值 |
| 三隻貓角色設定、世界觀、美術素材、style guide | 把遊戲 build 部署到正式網域 |
| 資料來源研究、API 連通性測試、離線資料快照 | 在提交 repo 留下賽前遊戲 commit |
| 關卡格式、平衡試算表、playtest 計畫 | 最終版知識卡內容 |
| 提交文件模板、影片腳本、評審簡報大綱 | 任何「已經可以玩」的版本 |

> **原則：** 賽前把「舞台」搭好，11/14 09:00 才讓演員上台。Commit history 自然會證明作品是比賽期間完成的。  
> 若主辦單位有更寬鬆的書面說明，以主辦單位為準；目前查不到台北場的例外規定。

---

## 2. 產品定位

### 2.1 一句話

**「地球在 12 光分鐘外。你有 7 個火星日，讓基地和三隻貓活下去。」**

### 2.2 體驗支柱

1. **故事先抓住你** — 三隻迷路的貓、7 天倒數、一個被託付的基地；孩子先在乎角色，才在乎資源。
2. **每個選擇都有代價** — 沒有免費的安全牌；救氧氣就會吃電力。
3. **三隻貓，三種解決問題的方式** — 銀白的知識、暗影的工程、金桔的生活。
4. **10 分鐘一場** — 適合兒童注意力，也適合評審現場 demo。
5. **玩真的 NASA 資料** — 太陽風暴不是隨機數字，而是 DONKI 的真實事件。
6. **想深入的人有路可走** — 專業術語可點開知識卡、收入背包複習；不想看也能順順玩完。
7. **手機、平板、桌機都能玩** — landscape-first；手機與平板橫放、桌機，從 568px 到 1440px 都清楚好按，直向時顯示旋轉提示。
8. **失敗不可怕** — 任務暫停會解釋「哪個系統先撐不住」，讓孩子想再試一次。

### 2.3 不是什麼

- 不是問答測驗（quiz）——知識卡是自由閱讀，不打分、不卡關。
- 不是點擊放置遊戲（clicker）。
- 不是有 20 個儀表的硬核模擬器。
- 不是要下載、註冊、付費的 App。

---

## 3. 遊戲設計

### 3.1 世界觀與故事開場

**Logline：** 三隻來自喵星的貓，飛船被太陽風暴打中，迫降在人類的火星基地。補給船七天後才會到——在那之前，基地裡只剩你一個見習指揮官。

**背景：**  
2040 年代，人類在火星建立第一座長期前哨站 **Hope-1**。成人隊員前往火星另一側進行 7 個 sol 的採樣任務，基地交給見習指揮官（玩家）留守。任務開始前（2025-05-14），一場強烈的太陽閃焰（X2.7，真實 DONKI 事件）爆發；在遊戲的訓練模擬中，伴隨的太陽風暴掃過火星，一艘喵星探測船「星塵號」剛好路過，引擎被燒壞，冒著煙迫降在基地的太陽能陣列上，撞歪了通訊天線。

> 文案 gating：2025-05-14 的 X2.7 閃焰已確認 `strongFlare = true`、`strongStormConfirmed = true`；但 Kp 只有 6.33，`strongGeomagneticStorm = false`。所以可以寫「強烈的太陽閃焰」，不要寫「強烈的地磁風暴」。與 X2.7 對應的 CME 是 08:48Z、1036 km/s、半角 40°（不是 halo）；另有一顆 1755 km/s、半角 16° 的窄 CME 與 M1.2 相關。兩者都不要說擊中火星。

三隻貓爬出船艙：

- **銀白 Silver**：星塵號艦長，優雅、高傲、有智慧。她第一個問題是：「這裡的最高指揮官是誰？」不管玩家怎麼回答，她都會宣布：「很好。從現在起，你就是指揮官。恭喜升遷，薪水是每天一顆番茄。」
- **暗影 Shadow**：導航員兼工程師，負責電力、維修、通訊與外勤。他為撞壞太陽能板感到抱歉，但嘴上不說；星圖是他唯一的牽掛。
- **金桔 Ginger**：廚師兼補給官，負責食物、水、氧氣與士氣。爬出船艙的第一句話是：「你們的冰箱在哪裡？」他隨身帶著一包番茄種子，說「這是緊急糧食」，但其實一顆都捨不得吃。

**為什麼是 7 個 sol：**  
星塵號的引擎被太陽風暴燒壞，暗影需要替換零件才能修好。人類補給船剛好 7 個 sol 後抵達，會帶來零件，也會載回在火星另一側採樣的成人隊員。在那之前，沒有大人、沒有救援、沒有零件——玩家必須讓基地和三隻貓一起活下來。

**玩家的角色：**  
見習指揮官。不是因為玩家最強，而是因為玩家是唯一在基地裡的人。三隻貓不是工具人，而是各有專長、各有脾氣的隊友；玩家要聽他們的意見，也要自己做決定。

**故事與真實的界線：**  
喵星與會說話的貓是虛構的；2025-05-14 的 X2.7 太陽閃焰、火星環境、輻射、資源限制與 NASA 資料是真的，但「風暴擊中火星、貓咪迫降」是訓練模擬情節。遊戲內用一小行字標示：**「喵星是虛構的，太陽閃焰是真的；迫降是訓練模擬。」** 讓兒童享受故事，也讓評審看到科學嚴謹度。

- 基地位置：虛構的「貓耳隕石坑」邊緣，環境數值引用真實火星資料。
- 時間單位：1 sol = 24 小時 39 分 35 秒（真實火星日）。
- 地球通訊：單向延遲 3–22 分鐘，劇情設定為 12 分鐘；太陽風暴震歪天線，遊戲中「呼叫地球」要等 2 個 sol 才有回覆。

#### 3.1.1 開場分鏡（75–90 秒，可跳過）

| 幕 | 畫面 | 台詞／旁白（繁中） | 互動 | 長度 |
|---|---|---|---|---|
| 1 | 火星日出，Hope-1 全景，太陽能陣列與溫室 | 旁白：「這裡是火星。距離地球 2 億 2 千萬公里。這裡有一座人類的基地：希望一號。今天，基地裡只有一個見習指揮官。」 | 無 | 5s |
| 2 | 天空變成橘紅色，太陽風暴掃過；星塵號冒煙打轉，撞上太陽能陣列；警報響起 | 暗影（無線電）：「星塵號呼叫火星基地！我們被太陽風暴打中了！船尾著火，儀表板一直嗶嗶叫，還有——」<br>金桔（無線電）：「我的尾巴也著火了！」<br>暗影：「那是船尾。」<br>金桔：「哦。」<br>旁白：「然後，他們就撞上來了。」 | 無 | 15s |
| 3 | 三隻貓爬出船艙，灰頭土臉；銀白在前，暗影拿星圖，金桔東張西望 | 銀白：「我是銀白，星塵號艦長。這裡的最高指揮官是誰？」<br>玩家選「我就是！」→ 銀白：「很好。勇氣可嘉。現在請用同樣的勇氣面對維修帳單。」<br>玩家選「我只是見習生……」→ 銀白：「更好。見習生學得快，而且便宜。」<br>銀白：「從現在起，你就是指揮官。恭喜升遷，薪水是每天一顆番茄。」<br>金桔：「那我呢？」<br>銀白：「你是廚師。番茄是你種的。」<br>金桔：「……合理。」<br>暗影：「我是暗影，導航員。抱歉撞壞了你們的太陽能板。我會修。……大概。」<br>銀白：「大概？」<br>暗影：「工程師的『大概』是很有誠意的。『一定』是騙人的。」<br>金桔：「我是金桔，廚師。你們的冰箱在哪裡？我餓了。」<br>旁白：「火星沒有冰箱。」<br>金桔：「什麼？那我們完了。」<br>銀白：「我們才剛到。」<br>金桔：「所以更要先吃飽。」 | 玩家二選一（不影響結果） | 25s |
| 4 | 暗影低伏在星圖前（角色以 `ref-shadow.jpg` 為準，星圖是新生成的場景）；星圖上有喵星、火星、一條航線，以及一個被燒黑的引擎圖示 | 暗影：「這是星圖。這裡是喵星。這裡是火星。這裡是我們撞壞的太陽能板。」<br>銀白：「最後那個不用標。」<br>暗影：「要做紀錄。」<br>暗影：「補給船 7 天後到，會帶來星塵號的引擎零件。在那之前，我們回不了家。」<br>金桔：「所以我們要一起活過 7 天？」<br>銀白：「正確。成人隊員也會一起回來。」<br>金桔：「他們會帶零食嗎？」<br>銀白：「……我會把這個問題列入任務清單。」 | 無 | 15s |
| 5 | 基地三個角落發光：太陽能板、溫室、外牆遮蔽層 | 點太陽能板 → 暗影：「電力優先。沒有電，氧氣、暖氣、還有我的加熱毯都會停。」銀白：「基地沒有加熱毯。」暗影：「所以我說『優先』。」<br>點溫室 → 金桔：「食物和水。我會讓溫室活過來。第一顆番茄是我的。」銀白：「那是公共財產。」金桔：「我種的。」<br>點外牆 → 銀白：「火星沒有大氣層保護。遮蔽，是我們的盾。」金桔：「也是我的曬太陽區。」銀白：「你不能在火星曬太陽。」金桔：「為什麼？」銀白：「因為你會變成烤橘貓。」金桔：「……那我塗防曬。」 | 3 個 tap，每點一個 HUD 長出一個資源 | 25s |
| 6 | 三個資源儀表亮起，7 個 sol 倒數出現在基地上方，三隻貓看著玩家 | 銀白：「7 個火星日。每個選擇都有代價。準備好了嗎，指揮官？」<br>金桔：「等等，我可以先吃一顆番茄嗎？」<br>銀白：「不行。」<br>金桔：「這就是代價。」<br>按鈕：「開始任務」 | 按鈕 | 5s |

**節奏原則：** 文字一次最多 2 句；玩家點擊「下一幕」才推進；右上角永遠有「跳過故事」。跳過後顯示 1 頁摘要（三隻貓、7 天、三個資源），直接進 Sol 1。**最長 90 秒，超過就砍台詞，不要砍三個 tap。**

**知識卡起點：** 幕 2 旁白的「太陽風暴」是全遊戲第一個可點術語，點開就是第一張知識卡。不點也完全不影響推進；幕 3 銀白只提醒一次「看到虛線字可以點」，之後不再嘮叨。

#### 3.1.2 故事如何綁定遊戲

1. **HUD 由玩家親手組裝：** 第 5 幕的三個 tap 依序長出電力、生命維持、遮蔽儀表。玩家不是「讀」教學，而是「用手」認識基地。
2. **7 天是救援倒數：** 補給船會帶來星塵號的引擎零件，也會載回成人隊員。玩家撐過 7 個 sol，不只是通關，而是真的等到救援。
3. **三隻貓各有動機：**
   - 銀白嘴上說「快點修好船回家」，其實擔心船員；她每天寫艦長日誌，笑話很爛，但從不缺席。
   - 暗影對撞壞基地感到自責，拼命維修；他會對星圖說話。口頭禪「數據不會說謊。但我會。」是他掩飾害怕的方式。
   - 金桔假裝只在乎吃，其實偷偷種了一顆番茄給每位隊員；補給船抵達時，番茄剛好成熟。
4. **結局留鉤子：** 成功時補給船抵達，貓咪修好星塵號，銀白把星圖交給玩家：「下一次，換你來喵星做客。」失敗時補給船也抵達，但貓咪選擇留下來幫忙重建：「下一次，我們一起回家。」兩種都不懲罰玩家。
5. **開場的破壞決定初始值：** 太陽風暴＋星塵號撞擊 → 初始電力只有 70；震歪通訊天線 → 「呼叫地球」要等 2 個 sol。故事不是背景，而是資源模型的解釋；那場太陽風暴的強度，就是 DONKI 的真實資料。
6. **可回顧：** 設定選單有「故事回顧」，讓玩過一次的小孩可以重看或唸給別人聽。

### 3.2 三隻貓的角色與遊戲功能

| 角色 | 設定 | 個性 | 遊戲功能 | 招牌台詞 |
|---|---|---|---|---|
| **銀白 Silver** | 銀白金吉拉貓，優雅、高傲、有智慧的領導者 | 冷靜、精準、偶爾毒舌，其實很貓 | 任務簡報、知識卡、提示、科學分數 | 「先觀察，再決定。……好啦，先吃一口。」 |
| **暗影 Shadow** | 精實黑貓，橘金色眼睛，負責科技、領航、外勤 | 務實、簡短、乾幽默，會對星圖說話 | 電力、維修、通訊、EVA 任務 | 「數據不會說謊。但我會。」 |
| **金桔 Ginger** | 橘花紋胖貓，瞇瞇眼、愛吃愛睡、性格豁達 | 悠哉、溫暖、吃貨，危機時只想先吃飯 | 食物、水、氧氣、士氣 | 「先吃飯，再拯救世界。」 |

**貓咪專長（Cat Assist）**  
每隻貓每局有 2 次「專長」可使用，對應一個資源或效果：

- 銀白：立即獲得 1 張知識卡（直接收入背包），並提示目前最危險的系統。
- 暗影：立即修復 +12 電力，或消除一次故障。
- 金桔：立即 +1 食物，或 +10 生命維持。

使用時機是「選擇行動之後、結算之前」，讓玩家有「要不要現在請貓幫忙」的決策。用完就沒有，鼓勵保留到危機。

### 3.3 核心循環

```
┌─────────────┐
│  開場分鏡    │  ← 75–90 秒，三個 tap 組出 HUD（可跳過）
└──────┬──────┘
       ▼
┌─────────────┐
│  Sol 開始    │
│  銀白簡報    │  ← 1 句真實火星知識 + 今日太陽活動
└──────┬──────┘
       ▼
┌─────────────┐
│  事件卡      │  ← 24 張牌抽 7 張，第 4 sol 固定太陽風暴
│  3 個選項    │     術語可點開知識卡（可跳過）
└──────┬──────┘
       ▼
┌─────────────┐
│  知識卡      │  ← 可選；讀完可收入背包，不強迫
└──────┬──────┘
       ▼
┌─────────────┐
│  貓咪專長    │  ← 可選，每隻 2 次
└──────┬──────┘
       ▼
┌─────────────┐
│  結算        │  ← 資源變化、健康判定、知識卡收藏
└──────┬──────┘
       ▼
┌─────────────┐
│  任務日誌    │  ← 一句話結果 + 真實資料來源
└──────┬──────┘
       ▼
   next sol → 7 sol 後任務報告
```

**開場：** 75–90 秒互動分鏡（可跳過）。玩家在三個 tap 中依序「組裝」出電力、生命維持、遮蔽的 HUD，順便認識三隻貓。

一局流程：開場 75–90 秒 + 7 個 sol × 約 60–90 秒 = 首次 10–14 分鐘；重玩可跳過開場，8–12 分鐘。

### 3.4 資源模型

| 資源 | 初始 | 每 sol 消耗 | 主要回復 | 歸零後果 |
|---|---:|---:|---|---|
| ⚡ 電力 Power | 70 | −8 | 太陽能 +4～16（依天氣）、暗影維修 | 生命維持失效，健康 −20／sol |
| 💧 生命維持 Life Support | 70 | −6 | 水回收、金桔補給、溫室 | 健康 −25／sol |
| 🛡️ 輻射遮蔽 Shield | 60 | −5 | 加厚遮蔽（吃電力）、避難 | 健康 −15／sol |
| 🥕 食物 Food | 6 | −1 | 溫室收成 +2、補給 | 健康 −10／sol、士氣下降 |
| ❤️ 健康 Health | 100 | — | 休息、醫療、食物充足 | 歸零 → 任務失敗 |
| 🔬 科學 Science | 0 | — | 科學選項、銀白專長 | 不影響生存，影響星等 |

** UI 呈現：** 三條主計量（電力／生命維持／遮蔽）放大顯示；食物用「罐頭數量」呈現；健康用愛心；科學用星星。避免一次出現太多數字。

**平衡原則：**

- 每個事件的三個選項，至少各有一個負向 delta。
- 沒有單一選項在「所有資源」上都優於其他選項。
- 任一資源都不該在 2 個 sol 內從滿歸零；給玩家反應時間。
- 普通難度目標勝率約 55–65%；簡單 75–85%；困難 35–45%。
- 用 Node 腳本模擬 10,000 局，調整初始值與事件 delta。

### 3.5 事件卡設計

**牌庫：** 24 張，依類別分配：

| 類別 | 張數 | 例子 |
|---|---:|---|
| 電力 | 4 | 太陽能板積塵、電池故障、日食 |
| 生命維持 | 4 | 氧氣回收機故障、水循環堵塞、二氧化碳超標 |
| 輻射遮蔽 | 3 | 太陽閃焰警報、遮蔽層微隕石破損 |
| 食物 | 3 | 溫室番茄豐收、根腐病、補給箱延誤 |
| 通訊 | 3 | 地球來電延遲、天線偏移、資料回傳窗口 |
| 科學 | 3 | 岩石樣本、地下冰探測、火星地震 |
| 士氣／突發 | 4 | 貓咪吵架、生日、沙塵暴、補給船提前 |

**每張卡結構：**

```ts
interface EventCard {
  id: string;
  category: 'power' | 'lifeSupport' | 'shield' | 'food' | 'comms' | 'science' | 'morale';
  cat: 'silver' | 'shadow' | 'ginger';
  title: { zh: string; en: string };
  brief: { zh: string; en: string };  // 可用 {{termId}} 標記術語
  choices: Choice[];       // 固定 3 個
  terms?: string[];        // 這張卡帶出的知識卡 ID（最多 2 個）
  source?: DataSource;     // 真實 NASA 資料來源
  art?: string;            // 事件插圖（可選）
}

interface Choice {
  id: string;
  label: { zh: string; en: string };
  cost: Partial<Record<'power' | 'lifeSupport' | 'shield' | 'food' | 'health' | 'science', number>>;
  outcome: { zh: string; en: string };  // 也可用 {{termId}}
  knowledgeCard?: string;  // 這個選擇可解鎖的知識卡 ID
  risk?: number;           // 0–1，可選隨機結果
}
```

**術語標記：** 文案中用 `{{solarStorm}}` 這種 token，渲染時查 `glossary.json` 換成該語言的名詞，並加上虛線底線與小書本圖示。不要在文案硬寫「太陽風暴」再靠字串比對，雙語會對不上。

**六個具體例子（給工程與文案的同一個參考）：**

1. **太陽閃焰警報**（輻射遮蔽／銀白，DONKI）
   - 加厚遮蔽：電力 −20、遮蔽 +25
   - 全員進避難艙：科學 −1、健康 +5、食物 −1
   - 硬撐繼續發電：電力 +15、遮蔽 −20、健康 −10
2. **太陽能板積塵**（電力／暗影）
   - 派暗影清潔：花掉 1 個 sol 的行動、電力 +14
   - 震動除塵：電力 −5、電力 +8（淨 +3，但風險 20% 失敗）
   - 不理它：電力 −6／sol，持續 2 sol
3. **溫室番茄豐收**（食物／金桔）
   - 全部收成：食物 +3
   - 留種：食物 +1，之後 2 個 sol 各 +2
   - 開派對：食物 −1、健康 +10、士氣 +1
4. **地球來電**（通訊／暗影）
   - 等地球回覆：2 個 sol 後獲得補給提示，期間不能再用通訊
   - 派探測車中繼：電力 −10，立即通訊
   - 自己決定：科學 +1，隨機風險
5. **氧氣回收機故障**（生命維持／暗影）
   - 立即維修：電力 −15、生命維持 +15
   - 旁通運轉：生命維持 −10／sol，電力 +5
   - 請暗影處理：消耗 1 次暗影專長，免費修好
6. **沙塵暴**（突發／金桔）
   - 封閉基地：電力 −5、遮蔽 +10
   - 繼續 EVA：科學 +2、健康 −10
   - 把溫室移進室內：電力 −10、食物 +1

> 文案規則：每張卡 2 句以內；選項按鈕 12 字以內；結果訊息 2 句以內。專業術語用 `{{termId}}` 標記、連到知識卡，不要在句子裡用括號硬塞解釋；例：太陽閃焰卡標 `{{solarFlare}}`、`{{radiation}}`，沙塵暴卡標 `{{dustStorm}}`。

### 3.6 勝負與回饋

- **勝利：** 撐過 7 個 sol，健康 > 0。
- **星等：**
  - ★ 任務完成
  - ★★ 健康 ≥ 50 且科學 ≥ 5
  - ★★★ 健康 ≥ 70、科學 ≥ 8、沒有動用緊急補給
- **失敗：** 顯示「任務暫停」而不是「Game Over」；說明哪個系統先歸零、送一張安慰用的知識卡、提供「再試一次」。
- **任務報告：** 三隻貓各給一句評論、本次新收藏的知識卡、背包總數、資源曲線、真實資料來源。
- **知識卡不影響星等：** 收藏是給好奇的人的獎勵，不是考試；不點、不收集也能拿三星。
- **重玩：** 事件牌洗牌、三種難度、每日種子挑戰（同一日期同一牌序，可選）。

### 3.7 教學與引導

- 開場就是教學：三個 tap 分別建立電力、生命維持、遮蔽的 HUD；玩家不用讀說明書，先用手指認識基地。
- Sol 1 只給兩個選項，銀白一步一步說明，讓玩家理解「資源會每天下降」。
- 每個資源第一次出現時，用 1 句話解釋（例：「遮蔽越高，太陽風暴時船員越安全」）。
- Sol 1 第一次出現術語時，銀白說一句：「看到虛線字，點一下就有解釋。不想看也沒關係。」只說一次，之後不再打擾。
- 每個結果畫面都有「為什麼？」按鈕，展開真實科學解釋與資料來源。
- 不做計時器、不做體力制、不做每日簽到。

### 3.8 知識卡與背包

**設計原則：** 專業術語不強迫閱讀。術語在文中以「虛線底線＋小書本圖示」標示，玩家想懂再點；點開後可讀，也可收入背包複習。不自動彈窗、不自動收集、不中斷遊戲、不列入星等。

**術語來源：** 事件卡簡報、選項結果、貓咪台詞、開場旁白、任務報告。全部集中在 `glossary.json`，用 `{{termId}}` 標記。

```json
{
  "solarStorm": {
    "term": { "zh": "太陽風暴", "en": "solar storm" },
    "short": {
      "zh": "太陽突然噴出大量帶電粒子和輻射。",
      "en": "The Sun suddenly throws out a burst of charged particles and radiation."
    },
    "why": {
      "zh": "它會干擾通訊、讓輻射變強，太空人必須躲進避難艙。",
      "en": "It can jam radios, boost radiation, and force astronauts into shelter."
    },
    "category": "spaceWeather",
    "source": { "name": "NASA DONKI", "url": "https://kauai.ccmc.gsfc.nasa.gov/DONKI/" },
    "related": ["solarFlare", "radiation"]
  }
}
```

**知識卡資料結構：**

```ts
interface KnowledgeCard {
  id: string;
  term: { zh: string; en: string };
  short: { zh: string; en: string };   // 一句話，≤ 25 字
  why: { zh: string; en: string };     // 為什麼重要，≤ 30 字
  category: 'spaceWeather' | 'mars' | 'lifeSupport' | 'engineering';
  source?: DataSource;
  related?: string[];
}
```

> `glossary.json` 的物件 key 就是 `id`，載入時補進陣列；`related` 只放已存在的 ID，測試會檢查。

**三個入口，都可跳過：**

1. **行內術語**：點虛線字 → 開知識卡面板。
2. **「今日名詞」chip 列**：事件卡下方列出本卡術語，每個 chip ≥ 44px，手機好點；已收藏的 chip 顯示 ✓。
3. **背包**：HUD 的 🎒 按鈕，隨時打開複習。

**知識卡面板：**

- 手機橫放（高度小於 500px）：右側 drawer 或中央 modal，最大 90vw × 85dvh，單欄可捲動，右上關閉。
- 桌面（≥ 1024px）：右側 drawer 420px，事件卡仍看得見。
- 內容順序：術語（中／英）→ 一句話解釋 → 為什麼重要 → 資料來源 → 相關卡 → ［收入背包］。
- 不想讀也可以直接按［收入背包］；讀不讀、收不收，都由玩家決定。
- 已收藏時按鈕顯示「已在背包 ✓」，仍可重讀。
- 關閉後焦點回到原本的術語；`Esc` 可關；開啟時背景鎖捲動。

**背包：**

- 分類 tab：全部／太空天氣／火星環境／生命維持／工程。
- 容器：手機橫放全螢幕、桌面中央 900px modal。
- 格狀圖鑑：手機 2–3 欄、桌面 4 欄；未收藏顯示灰色剪影＋「?」，不劇透內容。
- 點卡片可重讀；頂部顯示「已收藏 8 / 16」。
- 存 localStorage 的 `collectedCards`；換裝置不同步（無帳號）。
- 任務報告顯示「本次新收藏」與背包總數。

**寫作規則：**

- 每張事件卡最多 2 個術語；同一術語全遊戲只解釋一次（第一次出現時）。
- 卡片留給「會影響選擇」的核心概念；只出現一次、不影響理解的裝飾性名詞，用一句話帶過，不硬做成卡。
- 不用「參數」「機制」「系統性」等成人詞；用比喻（例：輻射遮蔽＝太空版的防曬乳＋盾牌）。
- 術語必須真的在文中出現，不能為了收集而硬塞。
- 每個術語都要有 NASA 來源，或清楚標「一般科學知識」。

**MVP 術語清單（16 個）：** 太陽風暴、太陽閃焰、日冕物質拋射（CME）、輻射、輻射遮蔽、火星大氣、地下冰、水循環、氧氣回收、溫室、太陽能、沙塵暴、通訊延遲、火星日（sol）、微隕石、低重力。

> 三個易混淆詞要分開寫：太陽閃焰是光與輻射的爆發，CME 是帶電粒子雲，太陽風暴是它們抵達行星後造成的擾動。  
> 低重力要寫對：火星重力約地球的 38%，不是「無重力」。這是兒童常見誤解，知識卡要特別澄清。

---

## 4. 真實 NASA 資料

### 4.1 資料來源與用途

| 資料源 | 用途 | 取得方式 | 備援 |
|---|---|---|---|
| **NASA DONKI** | 太陽閃焰、CME、地磁風暴；決定「今日太空天氣」與風暴強度 | `https://api.nasa.gov/DONKI/CME`、`/FLR`、`/GST`；透過 Cloudflare Worker 代理，避開 CORS 並隱藏 API key | 已抓 **2025-05-13～17** 快照（20 CME / 4 FLR / 1 GST）：X2.7 閃焰使 `strongFlare=true`、`strongStormConfirmed=true`；Kp 6.33，`strongGeomagneticStorm=false`。**強度以 FLR（X 級／M5+）或 GST（Kp ≥ 7）判定，CME 速度單獨不算** |
| **NASA Mars Weather（Curiosity REMS）** | 每個 sol 的真實氣溫、地面溫度、氣壓；影響暖氣耗電與戶外行動 | `https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json`（約 1.7MB，只取需要的欄位） | 已抓 **2025-05-08～05-22 冷週**快照；核心 7 sol（05-15～05-22，05-18 缺資料）平均白天高溫 −29.7°C，是前 1.1% 的冷週（2019 窗口第 4 冷，保留為歷史對照）；feed 不提供風速（全為 `--`），機制改用氣溫／地面溫度／氣壓；**不使用 InSight `insight_weather`**（資料停在 2020，任務已結束） |
| **NASA OSDR** | 太空人健康與生物研究；知識卡內容（輻射、骨密度、睡眠、免疫、營養）與失敗覆盤 | 官方網站與 API；MVP 用 8–16 張人工整理卡，附 dataset 連結 | 靜態 JSON，無網路也能玩；覆盤用預寫模板，不在 runtime 呼叫 LLM |
| **NASA Mars Facts** | sol 長度、重力 0.38g、平均溫度 −63°C、大氣 95% CO₂、氣壓 <1% 地球 | 官方 Mars Facts 頁面 | 靜態 JSON |
| **NASA Image Library** | 5–8 張真實火星表面照片，用於黑貓巡邏回報、事件卡與任務報告 | `https://images-api.nasa.gov/`；`api.nasa.gov/mars-photos` 實測 404（2026-11-11），不列為依賴 | 圖片賽前抓取並打包進 assets，附 NASA ID、拍攝日、來源連結 |
| **NASA API Key** | DONKI 請求 | 2026-11-11 已取得；存在 Worker secret；**因曾在對話中曝光，請重新產生** | DEMO_KEY 僅開發用 |

### 4.2 資料誠實原則

- 即時資料要顯示「擷取時間」；快照要顯示「快照日期」。
- 不得把靜態資料說成即時。
- 每張知識卡都有 `source` 欄位與可點擊連結。
- 遊戲內 Data Sources 面板列出：資料集、NASA 連結、授權、使用方式。
- DONKI 掛掉時，遊戲仍可完整遊玩；只是太空天氣改用快照。
- 在 README 與 submission 描述中明確寫出：「喵星與會說話的貓是虛構敘事框架；太陽風暴事件、火星環境、資源限制與 NASA 資料皆為真實，但『這場風暴擊中火星』是訓練模擬情節。」
- 火星天氣快照要標「Curiosity REMS 觀測日 YYYY-MM-DD」，不得寫成「即時天氣」。
- **不得只憑 CME 速度就寫「強烈太陽風暴」**：需有 X 級（或 M5+）閃焰或 Kp ≥ 7 的地磁風暴，並檢查 `meta.assessment`。2025-05 窗口的 X2.7 閃焰使 `strongFlare=true`、`strongStormConfirmed=true`，所以 event card 可以寫「強烈的太陽閃焰」；但 `strongGeomagneticStorm=false`（Kp 6.33），不要寫「強烈的地磁風暴」。
- **「很冷」可以說，但「最冷」要有依據**：遊戲文案可寫「2025 年 5 月，Gale 測到一次很冷的 7 sol 冷期，其中一天白天只有 -33°C」；不需要強調「第 52 冷」，但不要寫「最冷的一天」、「火星史上最冷」或「NASA 認證最冷」。排名與百分位保留在 `meta`（2025 窗口前 1.1%；2019 窗口第 4 冷），供評審追問。每張天氣卡要顯示觀測日與 `maxTempPercentile`。
- **本作是 Junior Astronaut Mission Trainer**：歷史冷週與風暴是「真實事件的訓練模擬」，UI 寫「重現 Curiosity 2025-05-16 觀測」或「重現 DONKI 2025-05-14 X2.7 閃焰」，不要假裝是當下即時資料。
- **DONKI GST／Kp 是地球指數，不是火星指數**：火星沒有全球磁場；遊戲把 Kp 當作風暴強度的簡化代理，資料面板要註明「簡化」，不要說「NASA 偵測到火星風暴」。火星受災是虛構訓練情境。
- 探測車照片要標 NASA ID、拍攝日、相機與 credit（NASA/JPL-Caltech）。
- 資源消耗與勝負數值是遊戲平衡設計，標為「模擬」，不得假稱為 NASA 數據。

### 4.3 建議的 DONKI 代理

```ts
// worker/index.ts（示意）
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/spaceweather') {
      const cache = caches.default;
      const cacheKey = new Request(url.toString(), request);
      const cached = await cache.match(cacheKey);
      if (cached) return cached;

      const end = new Date();
      const start = new Date(end.getTime() - 7 * 864e5);
      const nasa = new URL('https://api.nasa.gov/DONKI/notifications');
      nasa.searchParams.set('startDate', start.toISOString().slice(0, 10));
      nasa.searchParams.set('endDate', end.toISOString().slice(0, 10));
      nasa.searchParams.set('type', 'all');
      nasa.searchParams.set('api_key', env.NASA_API_KEY);

      const res = await fetch(nasa, { cf: { cacheTtl: 3600 } });
      const body = await res.text();
      const out = new Response(body, {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'public, max-age=3600',
          'access-control-allow-origin': '*',
        },
      });
      await cache.put(cacheKey, out.clone());
      return out;
    }
    return env.ASSETS.fetch(request);
  },
};
```

> 若時間不夠，MVP 可先只用快照；DONKI 代理列為 Should-have。

### 4.4 賽前快照清單（11/13 前完成）

| 快照檔 | 內容 | 來源 | 注意 |
|---|---|---|---|
| `spaceweather.snapshot.json` | 2025-05-13～05-17：20 CME、4 FLR（X1.2／M5.3／X2.7／M7.7）、1 GST（Kp 6.33） | DONKI | X2.7 使 `strongStormConfirmed=true`，但 Kp 6.33 未達 Kp ≥ 7；可寫「強烈太陽閃焰」，不可寫「強烈地磁風暴」；顯示事件日期與 DONKI 連結 |
| `mars-weather.snapshot.json` | Curiosity REMS **2025-05-08～05-22** 的 14 sol（氣溫、地面溫度、氣壓、season、`gameplayTags`、`maxTempPercentile`） | `mars.nasa.gov` MSL weather feed | 核心 7 sol 前 1.1%（05-18 feed 缺資料，`meta.observation.missingDates` 有記錄）；裁剪欄位；feed 無風速，不要捏造；原始 1.7MB archive 只放 `scripts/raw/`，不進 bundle |
| `mars-photos/metadata.json`＋圖片 | 5–8 張真實火星表面照片 | NASA Image Library | 存 1200px WebP，附 NASA ID 與 credit |
| `glossary.json` | 8–16 張知識卡與 OSDR／Mars Facts 來源 | 人工整理 | 每張卡都有 `source` 與連結 |

每個快照檔都要有 `fetched_at`、`source_url`、`license` 三個欄位；UI 的 Data Sources 面板直接讀這份 metadata。

> **2026-11-11 實測：** DONKI CME／GST 正常（HTTP 200，真實 key）；`/FLR` 回 404，改用 `/notifications?type=FLR` 解析；`api.nasa.gov/mars-photos` 回 404「No such app」；`api.nasa.gov/insight_weather` 回 2020 年舊資料；`mars.nasa.gov` MSL weather feed 正常（資料到 2026-08-25，無風速欄位）；NASA Image Library 正常。API 狀態隨時可能變動，所以一律以快照為準。

> **已產出（2026-11-11）：** `src/data/spaceweather.snapshot.json`（2025-05-13～17：20 CME / 4 FLR / 1 GST；X2.7 閃焰，Kp 6.33，`strongStormConfirmed=true`、`strongGeomagneticStorm=false`）、`mars-weather.snapshot.json`（2025 冷週 14 sol，核心 7 sol 前 1.1%）、`mars-photos/`（6 張，總計約 1.2MB）、`snapshots.manifest.json`。原本的 2026-11 CME 快照已換掉，原始檔保留在 `scripts/raw/donki-cme-2026-11-11.json` 作為對照（最快 974 km/s、半角 11°，但沒有 X／M5+ 閃焰或 Kp ≥ 7）。

---

## 5. 視覺設計

### 5.1 風格

**「3D 動畫電影 × 任務控制台」**：角色與場景走 Pixar-like 3D 動畫質感（柔和電影光、真實毛髮與布料、圓潤的 NASA 啟發造型）；介面走溫暖、圓角、圖示清楚的任務控制台，米色面板搭配海軍藍與琥珀色。不要做成人向的暗色科幻 HUD，也不要做成純繪本沒有資訊層次。三隻貓的長相一律以 `docs/assets/characters/` 的三張參考圖為準。

### 5.2 色彩

| Token | Hex | 用途 |
|---|---|---|
| `--navy` | `#1B2A5B` | 主要文字、圓框、按鈕 |
| `--ink` | `#172033` | 深色文字 |
| `--paper` | `#F7F3EA` | 背景與面板底色 |
| `--silver` | `#C9D2DC` | 銀白主題 |
| `--amber` | `#E8A33D` | 金桔、警示 |
| `--coral` | `#E07A5F` | 危險、健康 |
| `--teal` | `#4E8C8A` | 生命維持、成功 |
| `--rust` | `#B85C38` | 火星土壤、次要強調 |

對比度以 WCAG AA 為準；顏色不能是唯一資訊來源，所有資源都有圖示＋文字。

### 5.3 字體

- 中文：Noto Sans TC（Google Fonts，`display=swap`）。
- 英文／數字：Nunito 或 Baloo 2（圓潤、兒童友善）。
- 標題 28–36px、內文 16–18px、按鈕 18–20px；手機最小 16px。
- 不用全大寫、不用細體、不用裝飾性過強的字體。

### 5.4 主要元件

1. **資源列**：三個大圓形儀表＋食物罐頭＋愛心；固定在畫面上方。
2. **事件卡**：溫暖面板質感、類別標籤、貓咪頭像、2 句簡報。
3. **選項按鈕**：大按鈕、左圖示右文字、下方顯示代價圖示（⚡−20、🛡️+25）。
4. **貓咪對話框**：圓形頭像＋名字＋一句話。
5. **術語標記**：虛線底線＋小書本；行內不可點太小的話，卡片下方另給「今日名詞」chip（≥ 44px）。
6. **知識卡面板**：手機橫放用右側 drawer 或中央 modal；桌面右側 drawer；含［收入背包］。
7. **背包**：HUD 的 🎒 按鈕＋格狀圖鑑＋分類 tab＋收藏進度。
8. **任務報告**：星等、資源曲線、貓咪評論、本次新收藏、資料來源。

### 5.5 三張貓咪參考圖的處理

三張原始參考圖（2750×1536 JPG）已放在專案內，也是 Gemini GEM 的內建參考圖：

| 檔案 | 角色 | 外觀 |
|---|---|---|
| `ref-silver.jpg` | 銀白 | 長毛銀白貓、湖水綠眼、粉鼻，白銀色四足太空裝、海軍藍與金滾邊、小型銀色背包 |
| `ref-shadow.jpg` | 暗影 | 純黑短毛貓、琥珀眼，霧黑碳纖維裝甲、紫色發光飾條、單眼藍色 HUD、雙推進器背包 |
| `ref-ginger.jpg` | 金桔 | 橘虎斑貓、奶油色口鼻與腳掌、琥珀綠眼，橘白蓬鬆太空裝、多口袋、圓形橘色背包 |

**處理流程（賽前可做）：**

1. 用 `rembg`（u2net）或影像編輯工具去背，輸出透明 PNG。
2. 檢查邊緣：3D 渲染的毛髮與服裝輪廓不要被硬切；必要時手動補。
3. 產出三種尺寸：
   - `avatar-{cat}-512.webp`：圓形徽章用（含海軍藍外框）。
   - `full-{cat}-800.webp`：事件卡／任務報告用。
   - `favicon-{32,180}.png`、`og-1200x630.jpg`。
4. 圓形徽章、卡片框與陰影用同一套樣式，確保三隻貓視覺一致；不要改角色花紋與配色。
5. 原始參考圖留在 `docs/assets/characters/`，不要壓縮覆蓋；去背檔與各尺寸輸出放 `brand/`。

### 5.6 Nano Banana 加圖規則

- 統一 prompt 前綴：`High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.`
- 所有圖的完整 prompt、比例與檔名以 `docs/image-prompts.md` 為準（共 29 張），不要另外即興寫 prompt；GEM 指令在 `docs/gem-instructions.md`。
- 三隻主角的全身圖、多角度表與表情表用 14–28 產出；GEM 內建三張參考圖，生成時直接引用，不需要每次上傳。
- 場景圖 16:9（1920×1080）；對話頭像 3:4（1200×1600）；事件卡 4:3（1600×1200）；多角度表 3:2（1800×1200）。3:4 與 4:3 只做卡片，不當全螢幕背景。
- 手機與平板以橫向遊玩：主體放中央 75% 寬 × 80% 高；4:3 平板左右各裁 12.5%，20:9 手機上下各裁 10%。
- 開場用靜態分鏡＋CSS 視差即可，不做影片，控制在 75–90 秒。
- 保留生成紀錄，放進 AI disclosure。

---

## 6. 技術架構

### 6.1 技術選型

| 層 | 選擇 | 理由 |
|---|---|---|
| 前端框架 | React 19 + TypeScript + Vite | 成熟、AI 協作熟悉、開發快 |
| 狀態管理 | `useReducer` + typed actions（或 Zustand） | 遊戲狀態單純， reducer 可測試 |
| 樣式 | CSS Modules + CSS variables（可加 Tailwind） | 角色圖與任務控制台面板需要高度自訂，避免 utility class 失控 |
| 動畫 | Motion（Framer Motion） | 卡片進出、資源脈動、貓咪反應 |
| 音效 | Web Audio API 簡單合成音（可選） | 避免版權問題；預設靜音 |
| 語音 | Web Speech API（可選） | 7–12 歲朗讀輔助；品質不穩，列為 Could |
| 圖示 | Lucide React 或自製 SVG | 一致性、可授權 |
| 測試 | Vitest + Testing Library | 資源計算、事件卡、知識卡、i18n key parity |
| 部署 | Cloudflare Workers 靜態資產 | 全球 CDN、自訂網域、免費額度足夠 |
| CI/CD | GitHub Actions + wrangler-action | push main 自動部署 |
| 分析 | Cloudflare Web Analytics（可選） | 無 cookie、隱私友善 |

### 6.2 架構圖

```
Browser
  │
  ├─ GET https://mars.flymymind.com/        → Worker → ASSETS（Vite build 的 dist）
  └─ GET https://mars.flymymind.com/api/spaceweather
                                              → Worker → NASA DONKI（快取 1h）
                                                   └─ 失敗 → 回傳快照 JSON

GitHub repo ──push main──▶ GitHub Actions ──wrangler deploy──▶ Cloudflare Worker
```

### 6.3 Repo 結構

```
Mars/
├─ README.md
├─ PLAN.md
├─ LICENSE                     # Apache-2.0（NASA 預設）
├─ brand/
│  ├─ source/                  # 原始三張 JPG
│  ├─ processed/               # 去背 PNG / WebP
│  └─ style-guide.md
├─ docs/
│  ├─ data-sources.md
│  ├─ ai-disclosure.md
│  ├─ playtest.md
│  └─ submission.md
├─ .github/workflows/deploy.yml
├─ package.json                # 11/14 才建立
├─ vite.config.ts
├─ wrangler.jsonc
├─ worker/index.ts
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ game/
│  │  ├─ types.ts
│  │  ├─ reducer.ts
│  │  ├─ balance.ts
│  │  ├─ events.ts
│  │  └─ rng.ts
│  ├─ components/
│  │  ├─ ResourceBar.tsx
│  │  ├─ EventCard.tsx
│  │  ├─ ChoiceButton.tsx
│  │  ├─ CatBubble.tsx
│  │  ├─ TermText.tsx          # 解析 {{termId}} 並渲染虛線術語
│  │  ├─ KnowledgeSheet.tsx    # bottom sheet／右側 drawer
│  │  ├─ Backpack.tsx          # 知識卡圖鑑
│  │  └─ MissionReport.tsx
│  ├─ i18n/
│  │  ├─ zh-TW.ts
│  │  ├─ en.ts
│  │  └─ index.ts
│  ├─ data/
│  │  ├─ events.zh-TW.json
│  │  ├─ events.en.json
│  │  ├─ glossary.json         # 知識卡：術語、解釋、來源
│  │  └─ spaceweather.snapshot.json
│  └─ assets/cats/
└─ public/
```

### 6.4 遊戲狀態

```ts
type ResourceKey = 'power' | 'lifeSupport' | 'shield' | 'food';
type CatId = 'silver' | 'shadow' | 'ginger';
type Phase = 'title' | 'briefing' | 'choice' | 'resolve' | 'report' | 'gameover';

interface GameState {
  sol: number;                       // 1..7
  phase: Phase;
  resources: Record<ResourceKey, number>;
  health: number;
  science: number;
  deck: string[];                    // 洗好的事件 ID
  currentEventId?: string;
  catCharges: Record<CatId, number>; // 每隻 2 次
  collectedCards: string[];          // 背包中的知識卡 ID
  newCards: string[];                // 本次任務新收藏，報告用
  history: Array<{ sol: number; eventId: string; choiceId: string }>;
  lang: 'zh-TW' | 'en';
  difficulty: 'cadet' | 'officer' | 'ace';
}
```

**收藏生命週期：** 開新局時從 localStorage 載入 `collectedCards`（圖鑑跨局保留）；`newCards` 每局清空。設定裡可「清除收藏」，需二次確認。

### 6.5 Cloudflare 部署

**前置（網域目前尚未設定）：**

1. Cloudflare Dashboard → Add a site → `flymymind.com` → Free plan。
2. 到網域註冊商把 nameserver 改成 Cloudflare 配發的兩組。
3. 等 zone 變為 Active（通常 5 分鐘–24 小時）。
4. 建立 Worker `mars-cat-outpost`；在 Workers & Pages → Custom Domains 加入 `mars.flymymind.com`。
5. SSL/TLS → Full (strict)；Always Use HTTPS 開啟。
6. 用 `wrangler deploy` 部署第一個 “coming soon” 頁面，驗證網域。

**`wrangler.jsonc`：**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "mars-cat-outpost",
  "main": "worker/index.ts",
  "compatibility_date": "2026-11-01",
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS",
    "not_found_handling": "single-page-application",
    "run_worker_first": ["/api/*"]
  },
  "routes": [
    { "pattern": "mars.flymymind.com", "custom_domain": true }
  ],
  "observability": { "enabled": true }
}
```

**GitHub Actions：**

```yaml
name: deploy
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test -- --run
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

**注意：**

- `CLOUDFLARE_API_TOKEN` 只用最小權限：Workers Scripts:Edit、Account Settings:Read。
- `NASA_API_KEY` 用 `wrangler secret put NASA_API_KEY`，不要進 repo。
- 正式網域只部署「coming soon」到 11/13；遊戲 11/14 後才上。

### 6.6 效能與品質預算

- 首次載入 JS < 200KB gzip（不含圖片）；圖片總量 < 1.5MB。
- Lighthouse Performance / Accessibility / Best Practices ≥ 90（手機）。
- 無 layout shift；貓圖有固定寬高與 `aspect-ratio`。
- 支援 Chrome、Edge、Safari（含 iPad）、Firefox 最新兩個版本。
- 無帳號、無 cookie、無個資；localStorage 只存語言與進度。

### 6.7 測試

- `reducer.test.ts`：資源增減、歸零、勝負判定。
- `balance.test.ts`：每個事件至少一個負向 delta；沒有支配性選項。
- `i18n.test.ts`：zh/en key 完全對齊。
- `events.test.ts`：每個事件 3 個選項、ID 唯一、文字長度限制。
- `glossary.test.ts`：每個 `{{termId}}` 都存在、每個知識卡都有中英文與來源、無孤兒卡。
- 手動：iPhone Safari、iPad Safari、Android Chrome、桌面 Chrome。
- Playwright smoke test（可選）：載入 → 選難度 → 完成 7 sol → 看到任務報告。

### 6.8 響應式設計（橫向優先）

**策略：** landscape-first CSS，同一份元件、兩套佈局，不做兩個網站。手機與平板以橫向為預設；桌機同一套寬版。直向時顯示旋轉提示，不提供直向遊玩。手機／平板是主要遊玩裝置；桌機是評審 demo 與教室投影。

| 斷點 | 寬度 | 高度 | 佈局 |
|---|---|---|---|
| `sm` | 568–767px | 320–430px | 小手機橫放：單列 HUD、左事件卡＋選項、右貓咪小圖；高度 < 380px 時收起右圖 |
| `md` | 768–1023px | 430–768px | 大手機／小平板橫放：左 60% 事件卡＋選項、右 40% 貓咪與名詞；HUD 單列 |
| `lg` | 1024px 以上 | 600px 以上 | 桌機／平板橫放：左事件卡＋選項（max-width 1100px）、右貓咪立繪與背包；HUD 單列 |

**手機橫放版型（568–767px）：**

```
┌───────────────────────────────────────────────┐
│ ⚡72 💧68 🛡️61  🥕5 ❤️92 🔬3  🎒 8/16        │
├─────────────────────────────┬─────────────────┤
│ SOL 3 / 7           ☀️      │   貓咪 3:4 小圖  │
│ ┌─────────────────────────┐ │   「先觀察…」    │
│ │ 事件卡                   │ │                 │
│ │ 兩句簡報…                │ │   今日名詞       │
│ │ 今日名詞 ● ●             │ │   ● 太陽風暴     │
│ └─────────────────────────┘ │   ● 地下冰       │
│ ┌─────────────────────────┐ │                 │
│ │ 選項 A                   │ │   背包 8/16      │
│ └─────────────────────────┘ │                 │
│ ┌─────────────────────────┐ │                 │
│ │ 選項 B                   │ │                 │
│ └─────────────────────────┘ │                 │
└─────────────────────────────┴─────────────────┘
```

**桌機版型（1024px 以上）：**

```
┌──────────────────────────────────────────────┐
│ ⚡72  💧68  🛡️61    🥕5 ❤️92 🔬3      🎒 8/16 │
├────────────────────────────┬─────────────────┤
│ SOL 3 / 7                  │   貓咪立繪       │
│ ┌────────────────────────┐ │   「先觀察…」    │
│ │ 事件卡                  │ │                 │
│ │ 兩句簡報…               │ │   今日名詞       │
│ │ 今日名詞 ● ●            │ │   ● 太陽風暴     │
│ └────────────────────────┘ │   ● 地下冰       │
│ ┌────────────────────────┐ │                 │
│ │ 選項 A                  │ │   背包進度 8/16  │
│ └────────────────────────┘ │                 │
│ …                          │                 │
└────────────────────────────┴─────────────────┘
```

**橫向手機規則：**

- HUD 固定頂部單列：六個資源圖示＋數字，數字最小 14–16px；寬度不足時省略文字標籤，但保留 `aria-label`。
- 主區左右分欄：左欄事件卡＋選項（可捲動），右欄貓咪 3:4 小圖＋今日名詞＋背包進度。
- 高度 < 380px 時收起右欄貓圖，改用事件卡上的圓形頭像；避免壓縮選項。
- 主要按鈕高度 ≥ 48px，間距 ≥ 8px；所有觸控目標 ≥ 44×44px。
- 用 `100dvh` 不用 `100vh`；左右留 `env(safe-area-inset-left/right)`，底部留 `env(safe-area-inset-bottom)`。
- 事件卡與選項可捲動，不把文字塞進固定高度；200% 文字縮放不能破版。
- 不用 hover 才能看到的資訊；不用 tooltip 當唯一入口。
- 開場分鏡用 16:9 全螢幕，主體放中央 75% 寬 × 80% 高；不要用 `cover` 把 16:9 裁成直式。
- 背包與知識卡用右側 drawer 或中央 modal；不要用 bottom sheet 蓋住整個橫向畫面。
- 直向（寬 < 高）時顯示旋轉覆蓋層：標題、三貓小圖、「請將裝置橫放」；不載入遊戲主畫面。

**桌機規則：**

- 內容 max-width 1100px 居中；米色面板底色延伸到滿版，16:9 場景圖鋪滿背景。
- 事件卡與選項在左，貓咪大圖與背包進度在右；不做滑鼠追蹤特效。
- 鍵盤完整操作；`Esc` 關面板；焦點可見。
- 視窗高度不足時，主區可捲動，不裁切選項。

**圖片與效能：**

- 貓圖 `srcset`：400w / 800w / 1200w，WebP＋PNG fallback。
- 事件插圖 `loading="lazy"`、固定 `aspect-ratio`，避免 CLS。
- 手機關閉視差與大部分進場動畫；`prefers-reduced-motion` 一律關。
- 知識卡文字先出現，插圖後載；面板開啟不等圖片。

**驗收尺寸（橫向）：** 568×320、667×375、844×390、932×430、1024×768、1440×900、1920×1080；另外在 390×844 直向測旋轉提示。實機測 iPhone Safari、Android Chrome、iPad Safari。

---

## 7. 雙語與無障礙

### 7.1 雙語

- **11/15 起預設 `en`**，右上角可切換繁體中文；開發期暫以 `zh-TW` 為預設。選擇存在 localStorage，有儲存值時以儲存值優先。
- 預設語言集中在 `src/i18n/index.ts` 的 `DEFAULT_LOCALE` 常數，11/15 切換只改這一行並重新部署。
- 切換鈕顯示「切換過去的語言」：英文介面顯示「中文」，中文介面顯示 `EN`。
- `<html lang>`、頁面 title、meta description、OG 圖的預設值使用英文版。
- 英文比中文長 30–50%：預設英文後，568px 寬度以英文版面驗收，不以中文版面為準。
- 所有文案放 `src/i18n/`，不在 JSX 寫死。
- 事件資料用 `{ zh, en }` 結構；用 zod 或 TypeScript 型別檢查。
- 英文是預設語言，也是全球評審的第一印象，以 CEFR A2 為目標：短句、主動語態、避免 idioms；完稿需人工順稿，不直接使用機器翻譯。
- 中文以 7–12 歲為目標：每句 ≤ 20 字；句子本身要讀得懂，術語的深入解釋放知識卡，不強迫點。
- 影片用英文旁白或中文字幕＋英文字幕；全球評審看英文。

### 7.2 無障礙

- 所有互動元素可用鍵盤（Tab / Enter / Space）。
- 圖示按鈕有 `aria-label`；資源變化用 `aria-live="polite"` 播報。
- 顏色對比 ≥ 4.5:1；不以顏色單獨區分資源。
- 觸控目標 ≥ 44×44px。
- 支援 `prefers-reduced-motion`：關閉卡片飛入與脈動。
- 無計時壓力；可暫停閱讀。
- 可選朗讀（Web Speech API），預設關閉。
- 術語用 `<button>` 而非 `<span onclick>`；知識卡面板開啟時鎖焦點、`Esc` 關閉、關閉後焦點回到原術語。
- 知識卡面板用 `role="dialog"`＋`aria-modal="true"`；標題是第一焦點。
- 背包的收藏進度用文字（「已收藏 8 / 16」），不只靠進度條顏色。

---

## 8. 範圍分級

### 8.1 MVP（必須，11/14 晚上前完成）

| 項目 | 內容 | 預估 |
|---|---|---|
| 核心循環 | 7 sol、事件卡、3 選項、結算、勝負 | 5–6h |
| 資源 | 電力／生命維持／遮蔽／食物／健康／科學 | 2h |
| 角色 | 三隻貓、對話、貓咪專長各 2 次 | 2h |
| 故事開場 | 4–6 幕分鏡、3 個互動 tap、可跳過 | 2–3h |
| 內容 | 12 張事件卡、16 張知識卡、引導關 | 3–4h |
| 知識卡與背包 | `{{termId}}` 渲染、面板、圖鑑、localStorage | 3–4h |
| 介面 | 資源列、事件卡、選項、任務報告、手機／桌機雙佈局 | 5–6h |
| 雙語 | zh-TW / en 全介面 | 2h |
| 部署 | Cloudflare、網域、GitHub Actions | 1h |
| 文件 | README、DATA_SOURCES、AI disclosure | 1h |
| **合計** | | **26–31h（AI 協作）** |

> 以 11/14 09:00–23:00 約 14 小時 + 11/15 上午緩衝，必須砍到 12 張事件卡、16 張知識卡；不要做 24 張事件卡。  
> **知識卡可降級但不可砍：** 最少 8 張、純文字面板＋背包列表（不做插圖、不做分類 tab），仍要能點、能收藏、能複習。這是本作品「兒童學科學」的證據。  
> **開場是 MVP 的一部分，但可降級：** 若 11/14 16:00 核心循環還沒完成，先上 3 幕文字版＋三個 tap，11/15 再補圖。不要為了開場犧牲可玩性。

### 8.2 Should-have（11/15 中午前，時間允許）

- 事件卡擴到 18–24 張。
- DONKI 即時資料 + 快照切換。
- 每日火星天氣：Curiosity REMS 2025 冷週快照的 `cold_snap`／`severe_cold` 影響暖氣耗電與健康（14 筆，8 天 `cold_snap`、1 天 `severe_cold`；核心 7 sol 前 1.1%）。`pressure_drop` 機制保留，但這個窗口沒有觸發。
- 黑貓巡邏回報：5–8 張真實火星照片，離線打包。
- 三種難度。
- 任務報告星等與資源曲線。
- 音效開關、貓咪表情動畫。
- 知識卡擴到 24 張、加插圖。
- 每日種子挑戰。

### 8.3 Could-have（加掛模組，賽後也可）

- 語音朗讀（zh-TW / en）。
- 知識卡複習小測驗（3 題、不計分、可跳過）。
- 背包完成度徽章（收集 8／16 張）。
- 分享卡（Canvas 生成任務報告 PNG）。
- PWA 離線安裝。
- 教室模式（老師投影、討論問題）。
- 更多語言（日文、西班牙文）。
- 無帳號的本機排行榜。
- 真實 NASA 火星照片事件卡。

### 8.4 Won't-have（這次不做）

- 後端資料庫、帳號、多人連線。
- 3D、Unity/Unreal、原生 App。
- 使用者生成內容、社群功能。
- 即時多人合作。
- 付費／廣告。

---

## 9. 賽前前置工作（11/11–11/13）

> 目標：11/13 晚上 22:00 前，除了「遊戲本身」以外全部就緒，然後好好睡一覺。

### 9.1 11/11（三）

- [x] 確認遊戲名稱：《喵航員：火星基地》／Meowstronauts: Mars Outpost（2026-11-11 定案，不改名）。
- [ ] 確認 GitHub repo 名稱與擁有者（建議 `mars-cat-outpost`）。
- [ ] Cloudflare：加入 `flymymind.com` zone、改 nameserver。
- [ ] 建立空 repo：README、LICENSE（Apache-2.0）、`.gitignore`、`docs/`。
- [ ] 三張貓圖去背，產出 avatar / full / favicon / OG。
- [ ] 建立 `brand/style-guide.md`（色彩、字體、元件、Nano Banana prompt）。
- [ ] 建立 `docs/data-sources.md` 初稿。

### 9.2 11/11（三）

- [ ] 等 Cloudflare zone Active；建立 Worker 與 `mars.flymymind.com` custom domain。
- [ ] 部署一個 “Coming soon — 11/14” 靜態頁，驗證 HTTPS 與網域。
- [ ] 建 GitHub Actions skeleton（先不部署遊戲）。
- [x] 申請 NASA API key；測試 DONKI `/CME`、`/GST` 正常；`/FLR` 回 404，改用 `/notifications?type=FLR`（2026-11-11）。
- [x] 抓 DONKI 2025-05-13～17 快照（20 CME / 4 FLR / 1 GST）。
- [x] 抓 Curiosity REMS 天氣快照（2025 冷週 14 sol，核心 7 sol 前 1.1%；已裁剪欄位）。
- [x] 以真實 key 取得 2025-05-13～17 FLR／GST：X2.7 閃焰確認 `strongFlare=true`、`strongStormConfirmed=true`；Kp 6.33，`strongGeomagneticStorm=false`。開場可寫「強烈太陽閃焰」，不可寫「強烈地磁風暴」。
- [ ] 重新產生 NASA API key（舊 key 已在 2026-11-11 對話中曝光）並更新 Cloudflare Worker secret。
- [x] 從 NASA Image Library 抓 6 張火星照片（含 NASA ID、拍攝日、credit）。
- [ ] 寫 `docs/playtest.md`：3 位兒童、20 分鐘流程、觀察問題（含「會不會點虛線字」、「找不找得到背包」）。
- [ ] 整理 20 個候選術語與 NASA 來源（只做研究與連結，不寫遊戲文案）。
- [ ] 設計事件卡 schema 與平衡試算表（不含最終文案）。

### 9.3 11/12（四）

- [ ] 完成 UI wireframe：手機橫放 844×390、平板橫放 1024×768、桌機 1440×900 各一版，另做 390×844 旋轉提示；含知識卡面板與背包（紙上或 Figma，不用寫程式）。
- [ ] 完成三隻貓的語氣 guide 與各 10 句以內的代表台詞。
- [ ] 用 Nano Banana 依 `docs/image-prompts.md` 生成角色多角度表與場景圖（29 張，可分兩批），人工挑選。
- [ ] 寫 submission 模板：專案描述、資料來源、AI disclosure、影片腳本。
- [ ] 邀請 2–3 位小朋友參加 11/14、11/15 的 playtest（家長同意）。

### 9.4 11/13（五）

- [ ] 上午：所有素材、文件、網域、部署管線 final check。
- [ ] 下午：整理開發環境（Node 24、npm、wrangler、VS Code、GitHub CLI）。
- [ ] 17:00：官方 Resources 釋出；把 challenge 資源連結補進 `docs/data-sources.md`。
- [ ] 20:00：團隊線上 sync（15 分鐘）：確認 11/14 09:00 開工、分工、第一版目標。
- [ ] 22:00：**Freeze**。不再碰任何遊戲內容。睡覺。

---

## 10. 比賽兩天 Runbook

### 10.1 11/14（六）

| 時間 | 工作 | 負責 | 完成標準 |
|---|---|---|---|
| 08:30 | 開機、開 repo、開 Cloudflare、開計時器 | 全員 | 環境就緒 |
| 09:00 | 官方開始；第一個 commit（證明作品從此刻開始） | Claude | `chore: start hackathon` |
| 09:00–10:30 | Vite + React + TS scaffold、design tokens、匯入貓圖 | Claude | 首頁可跑 |
| 10:30–13:00 | 核心狀態機、資源結算、7 sol、12 張事件卡、16 張知識卡文案 | Claude | 可玩一局 |
| 13:00–14:00 | 午餐＋第一次 playtest（自己玩） | 全員 | 找出 3 個卡點 |
| 14:00–16:00 | UI 元件、三隻貓對話、開場 4 幕＋3 個 tap、知識卡面板、雙語、手機／桌機佈局 | Claude + 小孩 | 手機可玩 |
| 16:00–16:30 | 開場節奏測試（小孩試看 1 次）＋修正 | 小孩 + 使用者 | 90 秒內 |
| 16:30–17:30 | 部署 v0.1、送第一版 submission | 使用者 | 正式 URL 可開 |
| 17:30–19:00 | 小孩 playtest #1（20 分鐘）＋修正 | 小孩 + 使用者 | 記錄 5 個問題 |
| 19:00–22:00 | DONKI 代理、知識卡背包、動畫、平衡 | Claude | Should-have 一半 |
| 22:00–23:00 | commit、截圖、更新 submission、緩衝 | 全員 | 可提交狀態 |
| 23:00 | 睡覺（不要通宵） | 全員 | — |

**11/14 第一版的最低標準：**

- 首頁 → 開場（可跳過）→ 選難度 → 7 sol → 任務報告，全程可完成。
- 開場至少 3 幕＋3 個資源 tap；三隻貓都出現，至少各 2 句台詞。
- 至少 8 張知識卡可點開、可收入背包、可在任務中複習。
- 手機橫放（568px 起）、平板橫放與桌機（1440px）都不破版；直向顯示旋轉提示；不用 hover 也能玩。
- 正式 URL 可開，GitHub repo 公開。
- README 有「這是 2026 Space Apps 作品」與資料來源。

### 10.2 11/15（日）

| 時間 | 工作 | 負責 | 完成標準 |
|---|---|---|---|
| 09:00–11:00 | 小孩 playtest #2（2–3 位）＋記錄 | 使用者 | 完成回饋表 |
| 11:00–11:30 | **切換預設語言為英文**（`DEFAULT_LOCALE`）並部署 | Claude | 無痕視窗首次開啟為英文；切換繁中後選擇會保留 |
| 11:30–13:00 | 修正最痛的 5 個問題、平衡調整 | Claude | 勝率合理 |
| 13:00–14:00 | 午餐＋檢查 submission 連結 | 全員 | 連結全通 |
| 14:00–16:00 | 無障礙、效能、跨瀏覽器、404/OG | Claude | Lighthouse ≥ 90 |
| 16:00–18:00 | 錄 2–3 分鐘 demo 影片（英文預設介面）、截圖、更新 README | 使用者 + 小孩 | 影片上傳 |
| 18:00–20:00 | 最終 QA（英文預設路徑＋繁中切換）、更新 project page、按 submit | 使用者 | 收到確認 |
| 20:00–23:00 | 緩衝：只修 critical bug，不改功能 | Claude | 23:59 前保持可用 |
| 23:59 | **Final deadline** | — | — |

### 10.3 如果落後，砍什麼

1. 先砍事件卡數量（24 → 12）。
2. 砍三種難度（只留普通）。
3. 砍音效、語音、分享卡、知識卡插圖。
4. 知識卡降到 8 張、純文字面板＋背包列表（**不要砍知識卡**，這是科學學習的證據）。
5. 開場砍到 3 幕文字版＋三個 tap（**不要砍三個 tap**，那是資源教學）。
6. 砍 DONKI 即時（用快照）。
7. **不要砍**：核心循環、三隻貓、知識卡與背包、開場三個 tap、雙語、資料來源、手機版、可提交狀態。

---

## 11. 分工

| 角色 | 負責 | 不負責 |
|---|---|---|
| **你（產品負責人）** | 遊戲方向、中文文案、平衡決策、playtest 主持、submission、對外溝通 | 不要陷入實作細節 |
| **小孩（小隊長測試員）** | 試玩、說出「哪裡無聊／看不懂」、貓咪台詞想法、美術方向投票 | 不負責趕工；不要給壓力 |
| **Claude Code** | 程式、測試、部署、文件、英文翻譯初稿、平衡模擬、bug 修正 | 不代替你決定產品方向 |
| **Gemini Nano Banana** | 貓咪表情、事件插圖、OG 圖、風格探索 | 不重新生成主角全身圖，避免不一致 |

**決策規則：**

- 產品／文案：你決定。
- 技術／架構：Claude 決定，必要時解釋 trade-off。
- 「小朋友會不會喜歡」：小孩有否決權。
- 時間不夠時：Claude 提砍案，你拍板。

---

## 12. 提交清單

### 12.1 GitHub Repo

- [ ] Public repo，包含完整原始碼。
- [ ] `LICENSE`（Apache-2.0；或團隊選擇的 OSI 授權）。
- [ ] `README.md`：
  - [ ] 一句話介紹與截圖。
  - [ ] 線上 demo 連結。
  - [ ] 本機執行方式（`npm install`、`npm run dev`、`npm run build`）。
  - [ ] 使用到的 NASA 資料與連結。
  - [ ] AI 工具揭露。
  - [ ] 授權與致謝。
- [ ] `docs/data-sources.md`：每個資料集的用途、連結、授權、擷取日期。
- [ ] `docs/ai-disclosure.md`：Claude Code、Gemini Nano Banana 的使用範圍。
- [ ] 不要 commit API key、`.env`、`node_modules`。

### 12.2 線上 Demo

- [ ] https://mars.flymymind.com 可開、HTTPS 正常。
- [ ] 手機橫放、平板橫放、桌機都可玩；568×320、844×390、1024×768、1440×900 各測一次；390×844 測旋轉提示。
- [ ] 知識卡可點開、可收入背包；重新整理後收藏仍在（localStorage）。
- [ ] 首次載入 < 3 秒（4G）。
- [ ] 無 console error。
- [ ] 資料來源與 AI 揭露可在遊戲內找到。

### 12.3 影片

- [ ] 30秒。
- [ ] 英文旁白或英文字幕（全球評審）。
- [ ] 內容：開場 hook（三隻貓被太陽風暴打中、迫降火星、7 天倒數）→ 三隻貓 → 玩一局 → 點開知識卡、收入背包 → 真實資料 → 影響力 → 團隊。
- [ ] 開場前幾秒可直接用遊戲分鏡快轉，讓評審先被故事抓住。
- [ ] 上傳 YouTube（public 或 unlisted，確認評審可看）。

### 12.4 Space Apps Project Page

- [ ] 標題、一句話、完整描述。
- [ ] Challenge 選擇正確。
- [ ] Demo URL、GitHub URL、影片 URL。
- [ ] 3–5 張截圖（含手機版、事件卡、知識卡背包）。
- [ ] 團隊成員都註冊、選擇 Taipei local event。
- [ ] 按 Submit，截圖確認頁面。
- [ ] 11/15 23:59 前可持續更新。

### 12.5 備援

- [ ] 本機 `dist/` 可離線跑。
- [ ] Demo 影片已上傳（即使網站掛掉也能看）。
- [ ] GitHub repo 已 push 到 remote。
- [ ] 投影片／pitch 大綱存在 `docs/`。

---

## 13. 評分對應

| 獎項類別 | 我們的證據 |
|---|---|
| **Best Use of Science** | 真實火星環境數值、DONKI 太陽活動、OSDR 健康研究；每個選擇對應真實 constraint；16 張知識卡可複習 |
| **Best Use of Data** | DONKI／Curiosity REMS 快照、Image Library 照片、資料來源面板、每張知識卡可追溯 |
| **Best Game** | 7 sol 核心循環、三選項取捨、貓咪專長、知識卡背包、重玩性、星等 |
| **Best Storytelling** | 開場「太陽風暴迫降＋7 天倒數」、三隻貓各自的動機、任務日誌、結局星圖、失敗時的溫柔敘事 |
| **Best Design** | 3D 動畫電影風格、清楚的資訊層次、手機橫放／平板／桌機佈局、無障礙 |
| **Galactic Impact** | 免費、免帳號、雙語、可給教室用、7–12 歲；知識卡可離線複習 |
| **Most Inspirational** | 孩子扮演指揮官，理解「每個選擇都有代價」 |
| **Best Mission Concept** | 火星前哨站的資源取捨具體、可玩、可解釋 |

**3 分鐘評審 pitch 結構：**

1. 0:00–0:20：問題——兒童太空內容不是太抽象，就是太難。
2. 0:20–0:40：解法——10 分鐘的火星基地遊戲，三隻貓帶你做真正的取捨。
3. 0:40–2:00：demo 一局（太陽風暴那張卡，點開知識卡、收入背包）。
4. 2:00–2:30：真實資料與知識卡背包。
5. 2:30–3:00：影響力與團隊。

---

## 14. 風險與備案

| 風險 | 機率 | 影響 | 備案 | 負責 |
|---|---|---|---|---|
| 賽前先做遊戲，違反「活動開始才動工」 | 中 | 高（全球評審資格） | 嚴格遵守第 1.3 節界線；commit history 佐證 | 你 |
| NASA API 不穩／停用（mars-photos 實測 404、InSight 資料停在 2020） | 高 | 中 | 所有資料以賽前快照為準；Worker 代理＋1h 快取只當加分項；遊戲不依賴即時資料 | Claude |
| 時間不夠，做不完 | 高 | 高 | 依 10.3 砍功能；11/14 17:30 必須有可提交版本 | 你 |
| 小孩 playtest 注意力不足 | 中 | 低 | 20 分鐘、一次一位、有獎勵貼紙；不強迫 | 你 |
| 三隻貓畫風不一致 | 中 | 中 | 不重新生成主角；只加表情；style guide＋人工挑選 | 小孩＋你 |
| 雙語內容走鐘 | 中 | 高（英文為預設） | key parity 測試；英文先機器翻再人工順稿；568px 以英文版面驗收 | Claude |
| 知識卡寫錯科學內容 | 中 | 中 | 每張卡附 NASA 來源；請一位理科背景的人抽查；不確定就標「一般科學知識」 | Claude |
| 手機破版／按鈕太小 | 中 | 中 | landscape-first；真實裝置測 568×320 與 844×390；直向顯示旋轉提示；觸控目標 ≥ 44px；不用 hover | Claude |
| 網域／SSL 沒設好 | 中 | 高 | 11/11 前完成 zone 與 custom domain；先部署 coming soon | 你 |
| 正式網站掛掉 | 低 | 高 | 影片、截圖、本機 build、GitHub Pages 備援 | Claude |
| Submission 網站出錯 | 低 | 高 | 11/14 先送一次；11/15 截圖確認；保留文字檔 | 你 |
| AI 揭露不全 | 中 | 中 | `docs/ai-disclosure.md` 列出工具、版本、用途 | Claude |
| 版權／授權問題 | 低 | 中 | 只用原創／AI 圖、NASA 公共領域、OFL 字體、MIT/Apache 套件 | Claude |

---

## 15. 決策記錄

| 日期 | 決策 | 理由 |
|---|---|---|
| 2026-11-10 | Challenge 選 Build a Junior Astronaut Mission Trainer | 與三隻貓、火星基地、兒童遊戲完全吻合 |
| 2026-11-10 | 繁中為主＋英文切換 | 兼顧台北現場與全球評審 |
| 2026-11-10 | 2 位人類 + AI，先做 MVP | 時間有限，範圍必須可控 |
| 2026-11-10 | 11/14 09:00 送第一版，11/15 23:59 前更新 | 先卡位、再優化 |
| 2026-11-10 | Cloudflare Workers 靜態資產 | 網域已在 Cloudflare、部署簡單、全球 CDN |
| 2026-11-10 | 遊戲名稱暫定「喵航員：火星基地」 | 中英都好記、符合三隻貓設定 |
| 2026-11-11 | 名稱定案《喵航員：火星基地》，不改用《時空特務貓》的「場景＋角色＋貓」字輩 | 名稱已用於 PLAN、GEM 指令、prompt 書與網域，改名成本高於效益；與前作的連結靠同一組三隻貓延續，不靠字輩 |
| 2026-11-10 | 新增互動式故事開場：三隻喵星貓被太陽風暴打中，迫降 Hope-1 | 用故事吸引兒童，同時用三個 tap 教學三條資源；太陽風暴可接 DONKI 真實資料 |
| 2026-11-10 | 專業術語做成知識卡，可選讀、可收入背包 | 不強迫閱讀，讓好奇的孩子自己深入；背包提供複習與收藏動機；不影響星等 |
| 2026-11-10 | 介面同時支援手機與桌機，mobile-first | 兒童多用平板／手機；評審 demo 用桌機；同一份程式、兩套佈局 |
| 2026-11-11 | 方向改為 landscape-first；直向只顯示旋轉提示，不提供直向遊玩 | 16:9 場景與三貓同框需要橫向空間；手機與平板橫放、桌機共用同一套寬版；避免把 16:9 裁成直式全螢幕而犧牲角色與 HUD；上一列 mobile-first 保留為歷史 |
| 2026-11-11 | 11/15 起語言預設由繁中改為英文，可切換繁中 | 全球評審第一印象以英文為主，與英文旁白影片一致；架構不變，只改 `DEFAULT_LOCALE` 並做英文版面 QA；原繁中優先決策保留於上一列 |
| 2026-11-11 | 火星天氣採 Curiosity REMS 快照；InSight API 不採用 | 實測 InSight 資料停在 2020（任務已結束），不能宣稱即時；MSL feed 有 2026 年資料，但不提供風速，機制改用氣溫／地面溫度／氣壓 |
| 2026-11-11 | 火星照片改用 NASA Image Library 6 張精選快照；Mars Photos API 不列依賴 | `api.nasa.gov/mars-photos` 實測 404；已人工篩掉拼接黑邊、工程照與有標尺的灰階圖；保留 5 張彩色地表／自拍與 1 張乾淨的黑白 Navcam 全景（PIA26632） |
| 2026-11-11 | 天氣快照由「最新 14 sol」改為 2019-08-15～08-29 冷週（核心 08-22～08-29） | 最新 14 sol（2026-08-12～25）白天高溫約在第 51～74 百分位，並不冷，`cold_snap` 只是窗口內相對標籤；2019 核心 7 sol 平均白天高溫 −31.9°C，在 4,547 個 7-sol 窗口中排名第 4（前 0.09%），故事與資料一致 |
| 2026-11-11 | 天氣快照再由 2019 改為 2025-05-08～05-22 冷週（核心 05-15～05-22） | 使用者希望時間更近；2025 核心 7 sol 平均 −29.7°C，是前 1.1% 的冷週；2026 沒有可用深冷事件（Gale 下一次冬至約 2027-04）；2025-04-17 遠日點窗口只有前 11%，不是最冷，冷峰在冬至前。遊戲文案只說「很冷」，不強調排名 |
| 2026-11-11 | 「強烈太陽風暴」文案改為資料驅動，當時 `strongStormConfirmed = false` | 現有 20 筆 CME 最快 974 km/s 但半角 11°、最寬 43°，沒有 halo CME；CME 速度不是風暴強度分類。需 FLR（X 級／M5+）或 GST（Kp ≥ 7）；待真實 key 補抓 G5 窗口 |
| 2026-11-11 | 太空天氣快照由 2026-11 改為 2025-05-13～17；確認 X2.7 閃焰 | 2025-05-14 08:25Z 的 X2.7 閃焰（AR 14087）使 `strongFlare=true`、`strongStormConfirmed=true`；Kp 6.33 未達 Kp ≥ 7，`strongGeomagneticStorm=false`。可寫「強烈太陽閃焰」，不可寫「強烈地磁風暴」。DONKI 將 1755 km/s、半角 16° 的窄 CME 連到 M1.2；X2.7 對應的是 08:48Z、1036 km/s、半角 40° 的 CME。兩者都不是 halo，也不宣稱擊中火星 |
| 2026-11-11 | OSDR 失敗覆盤用預寫靜態模板，不在 runtime 呼叫 LLM | 避免金鑰、延遲、成本與兒童內容風險；資料仍標 OSDR dataset ID |

**待確認：**

- [ ] 重新產生 NASA API key（舊 key 已在 2026-11-11 對話中曝光）並更新 Cloudflare Worker secret。
- [ ] GitHub repo 擁有者與名稱。
- [ ] 台北 local event 的實際報到、pitch、judging 時間（目前頁面顯示 virtual，schedule 為空）。
- [ ] 是否要在 11/14 前先部署「Coming soon」頁（不包含遊戲）。
- [ ] 小孩的 playtest 時間與家長同意。

---

## 16. 今天就能做的下一步

1. **你：** 在 Cloudflare 加入 `flymymind.com`，把 nameserver 改成 Cloudflare 配發的。
2. **你：** 確認 GitHub repo 名稱（建議 `mars-cat-outpost`）與 public/private。
3. **Claude：** 建 repo skeleton（README、LICENSE、docs、brand 資料夾）。
4. **Claude：** 三張貓圖去背、產出 avatar／favicon／OG。
5. **Claude：** 整理 20 個候選術語與 NASA 來源，建立 `glossary` 研究草案（只列術語與連結，不寫遊戲文案）。
6. **Claude：** 寫 `docs/data-sources.md`、`docs/ai-disclosure.md`、`docs/playtest.md` 初稿。
7. **你＋小孩：** 用 10 分鐘投票決定遊戲名稱與三隻貓的招牌台詞。
8. **全員：** 11/13 22:00 前完成前置，11/14 09:00 準時開工。

---

## 附錄 A：官方連結

- Challenge：https://www.spaceappschallenge.org/2026/challenges/build-a-junior-astronaut-mission-trainer/
- Taipei Local Event：https://www.spaceappschallenge.org/2026/local-events/taipei/
- 2026 Challenges：https://www.spaceappschallenge.org/2026/challenges/
- Participant FAQ：https://legacy.spaceappschallenge.org/resources/faq/
- NASA DONKI：https://kauai.ccmc.gsfc.nasa.gov/DONKI/
- NASA OSDR：https://osdr.nasa.gov/
- NASA Mars Facts：https://science.nasa.gov/mars/facts/
- NASA Image Library：https://images.nasa.gov/
- NASA API Portal：https://api.nasa.gov/

## 附錄 B：事件卡文案模板

```text
【標題】6–10 字，具體、有畫面
【簡報】2 句，說明發生什麼事、為什麼現在要決定
【術語】最多 2 個；在簡報中用 {{termId}} 標記
【選項 A】12 字以內，圖示＋代價
【選項 B】12 字以內，圖示＋代價
【選項 C】12 字以內，圖示＋代價
【結果】2 句，說明結果與真實科學
【知識卡】termId｜一句話解釋（≤25 字）｜為什麼重要（≤30 字）｜NASA 來源
```

## 附錄 C：每日 stand-up 三問

1. 昨天完成了什麼可玩／可提交的東西？
2. 今天最重要的一個目標是什麼？
3. 有什麼卡住，需要誰幫忙？

---

## 附錄 D：開場分鏡腳本（繁中／英文）

**標題：** 七個火星日 / Seven Sols  
**長度：** 75–90 秒（可跳過）  
**互動：** 3 個 tap（太陽能板、溫室、基地外牆）  
**美術：** 3 張背景（Hope-1 全景、太陽風暴的天空、墜毀的星塵號）＋三隻貓去背立繪＋太陽風暴光效

### 幕 1 — 火星的早晨

**畫面：** 火星日出，Hope-1 全景。太陽能陣列與溫室在前景，遠處是貓耳隕石坑。  
**旁白（繁中）：** 「這裡是火星。距離地球 2 億 2 千萬公里。這裡有一座人類的基地：希望一號。今天，基地裡只有一個見習指揮官。」  
**Narrator (EN):** “This is Mars. 220 million kilometers from Earth. This is Hope-1. And today, its only commander is a cadet.”  
**互動：** 無（5 秒，自動進下一幕）。

### 幕 2 — 太陽風暴

**畫面：** 天空轉為橘紅色，太陽風暴掃過；一艘貓耳造型的小飛船「星塵號」冒煙打轉，撞上太陽能陣列；基地警報響起。  
**暗影（無線電，繁中）：** 「星塵號呼叫火星基地！我們被太陽風暴打中了！船尾著火，儀表板一直嗶嗶叫，還有——」  
**金桔（無線電，繁中）：** 「我的尾巴也著火了！」  
**暗影（繁中）：** 「那是船尾。」  
**金桔（繁中）：** 「哦。」  
**旁白（繁中）：** 「然後，他們就撞上來了。」  
**Shadow (radio, EN):** “Stardust to Mars base! We got hit by a solar storm! Tail's on fire, dashboard's beeping, and—”  
**Ginger (radio, EN):** “My tail's on fire too!”  
**Shadow (EN):** “That's the ship's tail.”  
**Ginger (EN):** “Oh.”  
**Narrator (EN):** “And then... they crashed into the solar panels.”  
**互動：** 無（15 秒，可加畫面震動與警報音）。  
**知識卡 hook：** 旁白中的「太陽風暴」是全遊戲第一個可點術語；點開可先讀，也可跳過。沒點的人會在幕 3 聽到銀白的一句教學，之後照常玩。



### 幕 3 — 三隻貓

**畫面：** 三隻貓爬出船艙，灰頭土臉。銀白站在最前面，暗影手上拿著星圖，金桔東張西望。  
**銀白（繁中）：** 「我是銀白，星塵號艦長。這裡的最高指揮官是誰？」  
**玩家選項：** 「我就是！」／「我只是見習生……」  
**銀白（繁中，選「我就是！」）：** 「很好。勇氣可嘉。現在請用同樣的勇氣面對維修帳單。」  
**銀白（繁中，選「我只是見習生……」）：** 「更好。見習生學得快，而且便宜。」  
**銀白（繁中）：** 「從現在起，你就是指揮官。恭喜升遷，薪水是每天一顆番茄。」  
**金桔（繁中）：** 「那我呢？」  
**銀白（繁中）：** 「你是廚師。番茄是你種的。」  
**金桔（繁中）：** 「……合理。」  
**暗影（繁中）：** 「我是暗影，導航員。抱歉撞壞了你們的太陽能板。我會修。……大概。」  
**銀白（繁中）：** 「大概？」  
**暗影（繁中）：** 「工程師的『大概』是很有誠意的。『一定』是騙人的。」  
**金桔（繁中）：** 「我是金桔，廚師。你們的冰箱在哪裡？我餓了。」  
**旁白（繁中）：** 「火星沒有冰箱。」  
**金桔（繁中）：** 「什麼？那我們完了。」  
**銀白（繁中）：** 「我們才剛到。」  
**金桔（繁中）：** 「所以更要先吃飽。」

**Silver (EN):** “I am Silver, captain of the Stardust. Who is the commander of this station?”  
**Choices:** “I am!” / “I'm just a cadet...”  
**Silver (EN, if “I am!”):** “Brave. Now please use that same bravery on the repair bill.”  
**Silver (EN, if “I'm just a cadet...”):** “Even better. Cadets learn fast. And they're cheap.”  
**Silver (EN):** “From now on, you're the commander. Congratulations on the promotion. Your salary is one tomato a day.”  
**Ginger (EN):** “What about me?”  
**Silver (EN):** “You're the cook. The tomatoes are yours.”  
**Ginger (EN):** “...Fair.”  
**Shadow (EN):** “I'm Shadow, navigator. Sorry about your solar array. I'll fix it... probably.”  
**Silver (EN):** “Probably?”  
**Shadow (EN):** “An engineer's ‘probably’ is very sincere. ‘Definitely’ is a lie.”  
**Ginger (EN):** “I'm Ginger, ship's cook. Where's your fridge? I'm starving.”  
**Narrator (EN):** “Mars doesn't have a fridge.”  
**Ginger (EN):** “What? Then we're doomed.”  
**Silver (EN):** “We just got here.”  
**Ginger (EN):** “Exactly. So we should eat first.”  
**互動：** 玩家二選一（不影響結果；兩條回覆都導向同一句）。25 秒。

### 幕 4 — 七個火星日

**畫面：** 暗影低伏在星圖前（角色以 `ref-shadow.jpg` 為準，星圖是新生成的場景）。星圖上有喵星、火星、一條航線，以及一個被燒黑的引擎圖示；7 個亮點逐一亮起。  
**暗影（繁中）：** 「這是星圖。這裡是喵星。這裡是火星。這裡是我們撞壞的太陽能板。」  
**銀白（繁中）：** 「最後那個不用標。」  
**暗影（繁中）：** 「要做紀錄。」  
**暗影（繁中）：** 「補給船 7 天後到，會帶來星塵號的引擎零件。在那之前，我們回不了家。」  
**金桔（繁中）：** 「所以我們要一起活過 7 天？」  
**銀白（繁中）：** 「正確。成人隊員也會一起回來。」  
**金桔（繁中）：** 「他們會帶零食嗎？」  
**銀白（繁中）：** 「……我會把這個問題列入任務清單。」

**Shadow (EN):** “This is the star map. This is Meow Star. This is Mars. And this is the solar panel we crashed into.”  
**Silver (EN):** “You don't need to label that last one.”  
**Shadow (EN):** “Documentation.”  
**Shadow (EN):** “The supply ship arrives in seven days. It's bringing the engine part for the Stardust. Until then, we can't go home.”  
**Ginger (EN):** “So we have to survive seven days... together?”  
**Silver (EN):** “Exactly. The adult crew comes back on the same ship.”  
**Ginger (EN):** “Will they bring snacks?”  
**Silver (EN):** “...I'll add that to the mission checklist.”  
**互動：** 無（15 秒；星圖上的 7 個亮點逐一亮起）。

### 幕 5 — 三個 tap，三個資源

**畫面：** 基地三個角落發光：屋頂的太陽能板、側面的溫室、外牆的遮蔽層。玩家依序點擊（每個都有脈動提示）。  
**點太陽能板：**  
暗影（繁中）：「電力優先。沒有電，氧氣、暖氣、還有我的加熱毯都會停。」  
銀白（繁中）：「基地沒有加熱毯。」  
暗影（繁中）：「所以我說『優先』。」  
Shadow (EN): “Power first. No power, no oxygen, no heat, and no heating blanket.”  
Silver (EN): “The base doesn't have a heating blanket.”  
Shadow (EN): “That's why I said ‘first.’”  
**點溫室：**  
金桔（繁中）：「食物和水。我會讓溫室活過來。第一顆番茄是我的。」  
銀白（繁中）：「那是公共財產。」  
金桔（繁中）：「我種的。」  
Ginger (EN): “Food and water. I'll bring the greenhouse back to life. The first tomato is mine.”  
Silver (EN): “It's communal property.”  
Ginger (EN): “I grew it.”  
**點外牆：**  
銀白（繁中）：「火星沒有大氣層保護。遮蔽，是我們的盾。」  
金桔（繁中）：「也是我的曬太陽區。」  
銀白（繁中）：「你不能在火星曬太陽。」  
金桔（繁中）：「為什麼？」  
銀白（繁中）：「因為你會變成烤橘貓。」  
金桔（繁中）：「……那我塗防曬。」  
Silver (EN): “Mars has no atmosphere to protect us. Shielding is our armor.”  
Ginger (EN): “And my sunbathing spot.”  
Silver (EN): “You can't sunbathe on Mars.”  
Ginger (EN): “Why not?”  
Silver (EN): “Because you'd become a roast orange cat.”  
Ginger (EN): “...I'll wear sunscreen.”  
**互動：** 3 個 tap；每點一個，畫面上方就長出對應的資源儀表（⚡／💧／🛡️）。25 秒。

### 幕 6 — 開始任務

**畫面：** 三個資源儀表亮起，基地上方出現「7 SOLS」倒數；三隻貓轉頭看著玩家。  
**銀白（繁中）：** 「7 個火星日。每個選擇都有代價。準備好了嗎，指揮官？」  
**金桔（繁中）：** 「等等，我可以先吃一顆番茄嗎？」  
**銀白（繁中）：** 「不行。」  
**金桔（繁中）：** 「這就是代價。」  
**按鈕：** 「開始任務」  
**Silver (EN):** “Seven sols. Every choice has a cost. Ready, Commander?”  
**Ginger (EN):** “Wait, can I eat one tomato first?”  
**Silver (EN):** “No.”  
**Ginger (EN):** “That's the cost.”  
**Button:** “Start Mission”  
**互動：** 按鈕（5 秒）。

### 標題畫面文案

**繁中：**

> **喵航員：火星基地**  
> 補給船七天後才會到。  
> ［開始任務］　［故事回顧］　［設定］  
> 小字：喵星是虛構的，太陽閃焰是真的；迫降是訓練模擬。

**English:**

> **MEOWSTRONAUTS: MARS OUTPOST**  
> The supply ship arrives in seven days.  
> [Start Mission]　[Story]　[Settings]  
> Small print: The cats are fiction. The solar flare is real; the crash is a training simulation.

### 故事備註

- **跳過：** 右上角「跳過故事」→ 1 頁摘要（三隻貓、7 天、三個資源）→ 直接進 Sol 1。
- **回顧：** 設定選單的「故事回顧」可重看；已看過的玩家可快速跳過。
- **成功結局：** 補給船抵達，貓咪修好星塵號，金桔的番茄成熟；銀白把星圖交給玩家：「下一次，換你來喵星做客。」
- **失敗結局：** 補給船也抵達，但貓咪選擇留下來幫忙重建；銀白：「下一次，我們一起回家。」
- **真實與虛構：** 載入畫面小字——「喵星是虛構的，太陽閃焰是真的；迫降是訓練模擬。」／“The cats are fiction. The solar flare is real; the crash is a training simulation.”
- **笑點原則：** 笑點來自貓的行為（尾巴、加熱毯、番茄、曬太陽）與工程師的誇張，不嘲笑任何角色；每幕最多 2 個笑點，不要蓋過危機感。
- **不要做的事：** 不要用旁白解釋太陽風暴理論；不要讓開場超過 90 秒；不要讓三隻貓變成純教學 NPC，他們要有脾氣與笑點。

---

*這份計畫是活文件。任何範圍變動，先更新第 8 節與第 10.3 節，再動手。*
