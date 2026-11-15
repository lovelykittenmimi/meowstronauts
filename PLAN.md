# 喵航員：火星基地 — NASA Space Apps Challenge 2026 計畫

> **版本** v1.2 · 2026-11-12  
> **Challenge** Build a Junior Astronaut Mission Trainer  
> **產品代號** Meowstronauts: Mars Outpost（喵航員：火星基地）  
> **正式網域** https://mars.flymymind.com  
> **團隊** 2 位人類 + Claude Code + Gemini Nano Banana  
> **第一版程式碼 push** 2026-11-14（六）09:00 開放後（GitHub，供 A／B／C 協作）  
> **NASA final submit** 2026-11-15（日）23:59 前  
> **最終截止** 2026-11-15（日）23:59（當地時間）  
> **2026-11-15 註**：賽前內部紀錄 `docs/pre-event/` 已移出 repo；文中連結僅供歷史參考。

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
| 知識學習 | 文中術語可點開知識卡（20 張），可收入背包複習；可跳過，不影響勝負 |
| 裝置支援 | landscape-first；手機／平板橫放、桌機同一份程式；568px 到 1440px 不破版，直向顯示旋轉提示 |
| 真實資料 | NASA DONKI（太陽活動）、Curiosity REMS（火星天氣）、OSDR（太空人健康研究）、NASA Mars Facts、NASA Image Library |
| 語言 | 英文為主，右上角可切換繁體中文（11/15 切換；開發期暫以繁中為預設） |
| 技術 | Vite + React + TypeScript，Cloudflare Workers 靜態資產 + `/api` 代理 |
| 部署 | Cloudflare Worker `meowstronauts`，自訂網域 `mars.flymymind.com` |
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
| 兒童學得到東西 | 20 張可選知識卡＋背包複習；術語連到 NASA 來源，不強迫閱讀 |
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

**術語命名：** 知識卡以一般太空概念為主（大氣層、重力、氣壓、輻射……），火星與地球的差異放在卡片的 `example`；只有 `sol`、`subsurfaceIce` 這種與火星機制綁定的詞保留火星名稱。所有 20 個術語的出場時機見 `docs/glossary.md` §3.5。

#### 3.1.1 開場分鏡（6 幕，75–90 秒，可跳過）

| 幕 | 畫面 | 台詞／旁白（繁中） | 互動 | 長度 |
|---|---|---|---|---|
| 1 | 火星日出，Hope-1 全景，太陽能陣列與溫室 | 旁白：「這裡是火星。距離地球 2 億 2 千萬公里。這裡有一座人類的基地：希望一號。今天，基地裡只有一個見習指揮官。」 | 無 | 5s |
| 2 | 天空變成橘紅色，太陽風暴掃過；星塵號冒煙打轉，撞上太陽能陣列；警報響起 | 暗影（無線電）：「星塵號呼叫火星基地！我們被太陽風暴打中了！船尾著火，儀表板一直嗶嗶叫，還有——」<br>金桔（無線電）：「我的尾巴也著火了！」<br>暗影：「那是船尾。」<br>金桔：「哦。」<br>旁白：「然後，他們就撞上來了。」 | 無 | 15s |
| 3 | 三隻貓爬出船艙，灰頭土臉；銀白在前，暗影拿星圖，金桔東張西望 | 銀白：「我是銀白，星塵號艦長。這裡的最高指揮官是誰？」<br>玩家選「我就是！」→ 銀白：「很好。勇氣可嘉。現在請用同樣的勇氣面對維修帳單。」<br>玩家選「我只是見習生……」→ 銀白：「更好。見習生學得快，而且便宜。」<br>銀白：「從現在起，你就是指揮官。恭喜升遷，薪水是每天一顆番茄。」<br>金桔：「那我呢？」<br>銀白：「你是廚師。番茄是你種的。」<br>金桔：「……合理。」<br>暗影：「我是暗影，導航員。抱歉撞壞了你們的太陽能板。我會修。……大概。」<br>銀白：「大概？」<br>暗影：「工程師的『大概』是很有誠意的。『一定』是騙人的。」<br>金桔：「我是金桔，廚師。你們的冰箱在哪裡？我餓了。」<br>旁白：「火星沒有冰箱。」<br>金桔：「什麼？那我們完了。」<br>銀白：「我們才剛到。」<br>金桔：「所以更要先吃飽。」<br>銀白：「吃飽之前，先慢慢走。在太空待了好幾個月，我們的身體變弱了。」 | 玩家二選一（不影響結果） | 25s（健康句約 4s；真要縮短可砍暗影「大概」來回） |
| 4 | 暗影低伏在星圖前（角色以 `ref-shadow.jpg` 為準，星圖是新生成的場景）；星圖上有喵星、火星、一條航線，以及一個被燒黑的引擎圖示 | 暗影：「這是星圖。這裡是喵星。這裡是火星。這裡是我們撞壞的太陽能板。」<br>銀白：「最後那個不用標。」<br>暗影：「要做紀錄。」<br>暗影：「補給船 7 天後到，會帶來星塵號的引擎零件。在那之前，我們回不了家。」<br>金桔：「所以我們要一起活過 7 天？」<br>銀白：「正確。成人隊員也會一起回來。」<br>金桔：「他們會帶零食嗎？」<br>銀白：「……我會把這個問題列入任務清單。」 | 無 | 15s |
| 5 | 基地三個角落發光：太陽能板、溫室、外牆遮蔽層 | 點太陽能板 → 暗影：「電力優先。沒有電，氧氣、暖氣、還有我的加熱毯都會停。」銀白：「基地沒有加熱毯。」暗影：「所以我說『優先』。」<br>點溫室 → 金桔：「食物和水。我會讓溫室活過來。第一顆番茄是我的。」銀白：「那是公共財產。」金桔：「我種的。」<br>點外牆 → 銀白：「火星的大氣層太稀薄，保護不了我們。遮蔽，是我們的盾。」金桔：「也是我的曬太陽區。」銀白：「你不能在火星曬太陽。」金桔：「為什麼？」銀白：「因為你會變成烤橘貓。」金桔：「……那我塗防曬。」 | 3 個 tap，每點一個 HUD 長出一個資源 | 25s |
| 6 | 三個資源儀表亮起，7 個 sol 倒數出現在基地上方，三隻貓看著玩家 | 銀白：「7 個火星日。每個選擇都有代價。準備好了嗎，指揮官？」<br>金桔：「等等，我可以先吃一顆番茄嗎？」<br>銀白：「不行。」<br>金桔：「這就是代價。」<br>按鈕：「開始任務」 | 按鈕 | 5s |

**節奏原則：** 文字一次最多 2 句；玩家點擊「下一幕」才推進；右上角永遠有「跳過故事」。跳過後顯示 1 頁摘要（三隻貓、7 天、三個資源），直接進 Sol 1。**開場長度不是硬性門檻（2026-11-14 產品決定）：標準是「有趣、小孩玩得完」，不為了秒數砍台詞。** 要縮短時先砍幕 3 的寒暄，不要砍三個 tap。

> 6 幕名目上限合計 93 秒（5＋18＋25＋15＋25＋5）；玩家可按「下一幕」提早前進。實測（2026-11-14）：每句停留 2 秒約 77 秒、2.5 秒約 96 秒；兩者都可接受，不因此砍台詞。

**知識卡起點：** 幕 2 暗影無線電台詞的「太陽風暴」是全遊戲第一個可點術語，點開就是第一張知識卡。不點也完全不影響推進；幕 3 銀白只提醒一次「看到虛線字可以點」，之後不再嘮叨。

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
│  事件卡      │  ← MVP 12 張抽 7 張，第 4 sol 固定太陽風暴
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

**設計庫：** 24 張，依類別分配；**MVP 先實作 12 張**（`docs/event-cards.md` §3.2），一局抽 7 張，第 4 sol 固定 S1，其餘 12 張留 11/15 擴充。

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
>
> 每張卡最多 2 個術語；`cme`、`geomagneticStorm`、`solarWind`、`gravity` 用每日簡報或「為什麼？」面板出場，不塞進同一張卡。完整對照見 `docs/glossary.md` §3.5。

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

**每日簡報術語 hook（前 5 個 sol）：**

| Sol | 發言 | 台詞（預定） | 術語 |
|---:|---|---|---|
| 1 | 銀白 | 「第 1 個 {{sol}}。火星的 {{gravity}} 是地球的 38%。身體還在適應，體液往頭上跑，骨頭也變弱了——慢慢來。」 | `sol`, `gravity` |
| 2 | 銀白 | 「第 2 個 {{sol}}。{{solarWind}} 一直在吹；這裡沒有全球磁場擋著。」 | `sol`, `solarWind` |
| 4 | 銀白 | 「第 4 個 {{sol}}。{{solarFlare}} 的光已經到了；{{cme}} 的粒子雲還在路上。」 | `solarFlare`, `cme` |
| 5 | 銀白 | 「Kp 6.33 是地球的 {{geomagneticStorm}} 指數，不是火星的。」 | `geomagneticStorm` |

> S1 的「為什麼？」面板：`{{solarWind}}` 一直在吹；`{{cme}}` 是突然的一大團。用這句複習 Sol 2 的太陽風，並與 CME 對照。

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
  example?: { zh: string; en: string }; // 地球／火星對照，≤ 30 字
  why: { zh: string; en: string };     // 為什麼重要，≤ 30 字
  category: 'spaceWeather' | 'mars' | 'lifeSupport' | 'engineering';
  source?: DataSource;
  related?: string[];
}
```

> `glossary.json` 的物件 key 就是 `id`，載入時補進陣列；`related` 只放已存在的 ID，測試會檢查。
>
> `example` 放地球／火星對照（≤30 字）；一般概念卡（`atmosphere`、`gravity`、`pressure`）必填，事件卡可省略。例：
>
> ```json
> "atmosphere": {
>   "term": { "zh": "大氣層", "en": "atmosphere" },
>   "short": { "zh": "行星外層的氣體，靠重力留在旁邊。", "en": "A planet's layer of gases, held by gravity." },
>   "example": { "zh": "地球以氮、氧為主；火星二氧化碳 95%，空氣稀薄。", "en": "Earth is mostly nitrogen and oxygen; Mars is 95% CO2 and very thin." },
>   "why": { "zh": "你不能直接呼吸，沙塵暴也會遮住太陽能板。", "en": "You can't breathe it, and dust storms can block solar panels." },
>   "category": "mars",
>   "source": { "name": "NASA Space Place", "url": "https://spaceplace.nasa.gov/atmosphere/en/" },
>   "related": ["pressure", "dustStorm"]
> }
> ```

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
- 點卡片可重讀；頂部顯示「已收藏 8 / 20」。
- 存 localStorage 的 `collectedCards`；換裝置不同步（無帳號）。
- 任務報告顯示「本次新收藏」與背包總數。

**寫作規則：**

- 每張事件卡最多 2 個術語；同一術語全遊戲只解釋一次（第一次出現時）。
- 卡片留給「會影響選擇」的核心概念；只出現一次、不影響理解的裝飾性名詞，用一句話帶過，不硬做成卡。
- 不用「參數」「機制」「系統性」等成人詞；用比喻（例：輻射遮蔽＝太空版的防曬乳＋盾牌）。
- 術語名稱用一般概念（大氣層、重力、氣壓），火星與地球的數字放 `example`；不要寫成「火星大氣」「火星重力」。
- 術語必須真的在文中出現，不能為了收集而硬塞；所有 20 個術語的指定出場句見 `docs/glossary.md` §3.5。
- 每個術語都要有 NASA 來源，或清楚標「一般科學知識」。

**MVP 術語清單（20 個）：** 太陽風暴、太陽閃焰、日冕物質拋射（CME）、輻射、輻射遮蔽、大氣層、地下冰、水循環、氧氣回收、溫室、太陽能、沙塵暴、通訊延遲、火星日（sol）、微隕石、重力、地磁風暴、太陽風、氣壓、塵捲風。

> 三個易混淆詞要分開寫：太陽閃焰是光與輻射的爆發，CME 是帶電粒子雲，太陽風暴是它們抵達行星後造成的擾動。  
> 重力要寫對：先講一般重力，再用火星 0.38g（約地球三分之一）當例子；不是「無重力」。這是兒童常見誤解，知識卡要特別澄清。

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
| **NASA API Key** | DONKI 請求 | 2026-11-11 已取得；存在 Worker secret | DEMO_KEY 僅開發用 |

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
| `glossary.json` | 20 張知識卡與 OSDR／Mars Facts 來源 | 人工整理 | 每張卡都有 `source` 與連結 |

每個快照檔都要有 `fetched_at`、`source_url`、`license` 三個欄位；UI 的 Data Sources 面板直接讀這份 metadata。

> **2026-11-11 實測：** DONKI CME／GST 正常（HTTP 200，真實 key）；`/FLR` 回 404，改用 `/notifications?type=FLR` 解析；`api.nasa.gov/mars-photos` 回 404「No such app」；`api.nasa.gov/insight_weather` 回 2020 年舊資料；`mars.nasa.gov` MSL weather feed 正常（資料到 2026-08-25，無風速欄位）；NASA Image Library 正常。API 狀態隨時可能變動，所以一律以快照為準。

> **已產出（2026-11-11）：** `src/data/spaceweather.snapshot.json`（2025-05-13～17：20 CME / 4 FLR / 1 GST；X2.7 閃焰，Kp 6.33，`strongStormConfirmed=true`、`strongGeomagneticStorm=false`）、`mars-weather.snapshot.json`（2025 冷週 14 sol，核心 7 sol 前 1.1%）、`mars-photos/`（6 張，總計約 1.1 MB）、`snapshots.manifest.json`。原本的 2026-11 CME 快照已換掉，原始檔保留在 `scripts/raw/donki-cme-2026-11-11.json` 作為對照（最快 974 km/s、半角 11°，但沒有 X／M5+ 閃焰或 Kp ≥ 7）。
>
> **2026-11-12 追加：** `mars-photos/PIA25077.jpg`（Curiosity「火星花」，1280×956，350,608 B；credit NASA/JPL-Caltech/MSSS），照片總數 6→7（7 張合計 1,450,279 B，約 1.45 MB）；用於 F1 故事客串與資料面板小圖。

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
6. 這些是**賽前品牌／參考素材**，不是比賽期間的遊戲內美術。遊戲內角色圖在 11/14 09:00 後重新生成並放 `src/assets/`；`brand/` 只作識別與參考。來源與 AI 使用記在 `brand/README.md`，提交時寫進 SI disclosure。

### 5.6 Nano Banana 加圖規則

- 統一 prompt 前綴：`High-end 3D animated feature film still in a warm Pixar-like style, soft cinematic lighting, expressive stylized cat faces, realistic fur and fabric materials, family-friendly tone, 35mm cinematic composition, shallow depth of field, no text, no lettering, no logos, no watermark.`
- 所有圖的完整 prompt、比例與檔名以 `docs/image-prompts.md` 為準（共 30 張，含 OG 社群卡），不要另外即興寫 prompt；GEM 指令在 `docs/gem-instructions.md`。
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
| CI/CD | Cloudflare Workers Builds | push main 自動部署（測試紅不部署） |
| 分析 | Cloudflare Web Analytics（可選） | 無 cookie、隱私友善 |

### 6.2 架構圖

```
Browser
  │
  ├─ GET https://mars.flymymind.com/        → Worker → ASSETS（Vite build 的 dist）
  └─ GET https://mars.flymymind.com/api/spaceweather
                                              → Worker → NASA DONKI（快取 1h）
                                                   └─ 失敗 → 回傳快照 JSON

GitHub repo ──push main──▶ Workers Builds（npm test → build）──wrangler deploy──▶ Cloudflare Worker
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
│  └─ playtest.md
├─ .github/workflows/ci.yml    # lint / test / build；部署交給 Workers Builds
├─ package.json                # 11/14 才建立
├─ vite.config.ts
├─ wrangler.jsonc              # 靜態資產 Worker；部署設定
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

**前置（2026-11-11 現況：zone 已 Active）：**

1. ✅ `flymymind.com` 已在 Cloudflare；NS 為 `clark.ns.cloudflare.com`、`dahlia.ns.cloudflare.com`，不需要再改 registrar。
2. ✅ zone 已在 Cloudflare 解析（根網域有 proxy A 記錄）；到 Dashboard 確認狀態為 Active 即可。
3. 建立 Worker `meowstronauts`；在 Workers & Pages → Custom Domains 加入 `mars.flymymind.com`。
4. SSL/TLS → Full (strict)；Always Use HTTPS 開啟。
5. 用 Hello World 驗證網域；**不做 coming soon 頁**（2026-11-11 決定）。11/14 前只保留驗證頁，遊戲 11/14 後才上。
6. GitHub 連接等 11/14 有 `package.json` 與 build 後再做；現在接會讓 build 失敗。可選 Workers Builds 或下方 GitHub Actions。

**`wrangler.jsonc`：**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "meowstronauts",
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

**自動部署（2026-11-14 改為 Cloudflare Workers Builds）：**

Worker → Settings → Builds → Connect Git，接 `lovelykittenmimi/meowstronauts`、production branch `main`：

| 欄位 | 值 |
|---|---|
| Build command | `npm ci && npm test && npm run build` |
| Deploy command | `npx wrangler deploy` |
| Preview builds | 關閉（不開分支，`wrangler preview` 在 v4 已淘汰） |

push `main` → Cloudflare 建置 → 測試紅就停在 build、不部署 → 綠燈才 `wrangler deploy`。
Worker 名稱、`./dist` 與 `mars.flymymind.com` 都來自 repo 的 `wrangler.jsonc`。

**注意：**

- 自動部署開啟後，**推上 `main` 就等於上線**；`NASA_API_KEY` 與 custom domain 綁在同一個 Worker，重新部署不會掉。
- `NASA_API_KEY` 用 `wrangler secret put NASA_API_KEY`，不要進 repo。
- 手動 `wrangler deploy` 只有 A 機可以跑，且非必要不要跑（會和 Workers Builds 搶版本）。

### 6.6 效能與品質預算

- 首次載入 JS < 200KB gzip（不含圖片）；圖片總量 < 1.5MB。
- Lighthouse Performance / Accessibility / Best Practices ≥ 90（手機）。
- 無 layout shift；貓圖有固定寬高與 `aspect-ratio`。
- 支援 Chrome、Edge、Safari（含 iPad）、Firefox 最新兩個版本。
- 無帳號、無 cookie、無個資；localStorage 只存語言與進度。

### 6.7 測試

> 完整規格（P0 清單、影片 fixture、時程門檻）見 `docs/test-plan.md`；這節只列檔名。11/14 09:00 前只寫規格，不寫測試程式。

- `reducer.test.ts`：資源增減、歸零、勝負判定。
- `balance.test.ts`：每個事件至少一個負向 delta；沒有支配性選項。
- `i18n.test.ts`：zh/en key 完全對齊。
- `events.test.ts`：每個事件 3 個選項、ID 唯一、文字長度限制。
- `glossary.test.ts`：每個 `{{termId}}` 都存在、每個知識卡都有中英文與來源、無孤兒卡。
- 手動：iPhone Safari、iPad Safari、Android Chrome、桌面 Chrome。
- Playwright（P0）：載入 → 選難度 → 完成 7 sol → 看到任務報告；`?video=s1` 與 `?video=report` 的 fixture 數值。

### 6.8 響應式設計（橫向優先）

**策略：** landscape-first CSS，同一份元件、兩套佈局，不做兩個網站。手機與平板以橫向為預設；桌機同一套寬版。直向時顯示旋轉提示，不提供直向遊玩。手機／平板是主要遊玩裝置；桌機是評審 demo 與教室投影。

| 斷點 | 寬度 | 高度 | 佈局 |
|---|---|---|---|
| `sm` | 568–767px | 320–430px | 小手機橫放：單列 HUD、左事件卡＋選項、右貓咪小圖；高度 < 380px 時收起右圖 |
| `md` | 768–1023px | 430–768px | 大手機／小平板橫放：左 60% 事件卡＋選項、右 40% 貓咪與名詞；HUD 單列 |
| `lg` | 1024px 以上 | 600px 以上 | 桌機／平板橫放：左事件卡＋選項（max-width 1100px）、右貓咪立繪與背包；HUD 單列 |

> 實作補充（2026-11-12）：寬度與高度會落在不同格（例：844×390 是 `md` 寬、`sm` 高）。**版面模式以高度為主**：橫向且高度 < 440px 走「緊湊版」（小 HUD、插圖 140px、選項 48px），440px 以上走標準版；寬度只用來決定欄寬與是否收起右欄（< 680px 收起）。完整規格見 `docs/wireframes.md`。

**手機橫放版型（568–767px）：**

```
┌───────────────────────────────────────────────┐
│ ⚡72 💧68 🛡️61  🥕5 ❤️92 🔬3  🎒 8/20        │
├─────────────────────────────┬─────────────────┤
│ SOL 3 / 7           ☀️      │   貓咪 3:4 小圖  │
│ ┌─────────────────────────┐ │   「先觀察…」    │
│ │ 事件卡                   │ │                 │
│ │ 兩句簡報…                │ │   今日名詞       │
│ │ 今日名詞 ● ●             │ │   ● 太陽風暴     │
│ └─────────────────────────┘ │   ● 地下冰       │
│ ┌─────────────────────────┐ │                 │
│ │ 選項 A                   │ │   背包 8/20      │
│ └─────────────────────────┘ │                 │
│ ┌─────────────────────────┐ │                 │
│ │ 選項 B                   │ │                 │
│ └─────────────────────────┘ │                 │
└─────────────────────────────┴─────────────────┘
```

**桌機版型（1024px 以上）：**

```
┌──────────────────────────────────────────────┐
│ ⚡72  💧68  🛡️61    🥕5 ❤️92 🔬3      🎒 8/20 │
├────────────────────────────┬─────────────────┤
│ SOL 3 / 7                  │   貓咪立繪       │
│ ┌────────────────────────┐ │   「先觀察…」    │
│ │ 事件卡                  │ │                 │
│ │ 兩句簡報…               │ │   今日名詞       │
│ │ 今日名詞 ● ●            │ │   ● 太陽風暴     │
│ └────────────────────────┘ │   ● 地下冰       │
│ ┌────────────────────────┐ │                 │
│ │ 選項 A                  │ │   背包進度 8/20  │
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
- 背包的收藏進度用文字（「已收藏 8 / 20」），不只靠進度條顏色。

---

## 8. 範圍分級

### 8.1 MVP（必須，11/14 晚上前完成）

| 項目 | 內容 | 預估 |
|---|---|---|
| 核心循環 | 7 sol、事件卡、3 選項、結算、勝負 | 5–6h |
| 資源 | 電力／生命維持／遮蔽／食物／健康／科學 | 2h |
| 角色 | 三隻貓、對話、貓咪專長各 2 次 | 2h |
| 故事開場 | 6 幕分鏡（最低 3 幕）、3 個互動 tap、可跳過 | 2–3h |
| 內容 | 12 張事件卡、20 張知識卡、引導關 | 3–4h |
| 知識卡與背包 | `{{termId}}` 渲染、面板、圖鑑、localStorage | 3–4h |
| 介面 | 資源列、事件卡、選項、任務報告、手機／桌機雙佈局 | 5–6h |
| 雙語 | zh-TW / en 全介面 | 2h |
| 部署 | Cloudflare、網域、GitHub Actions | 1h |
| 文件 | README、DATA_SOURCES、AI disclosure | 1h |
| **合計** | | **26–31h（AI 協作）** |

> 以 11/14 09:00–23:00 約 14 小時 + 11/15 上午緩衝，必須砍到 12 張事件卡、20 張知識卡；不要做 24 張事件卡。  
> **知識卡可降級但不可砍：** 最少 8 張、純文字面板＋背包列表（不做插圖、不做分類 tab），仍要能點、能收藏、能複習。這是本作品「兒童學科學」的證據。  
> **開場是 MVP 的一部分，但可降級：** 若 11/14 16:00 核心循環還沒完成，先上 3 幕文字版＋三個 tap，11/15 再補圖。不要為了開場犧牲可玩性。

### 8.2 Should-have（11/15 中午前，時間允許）

- `H1 健康檢查` 事件卡（替換 P3；`docs/event-cards.md` §3.4）＋ S1「為什麼？」補閃焰／CME 時間差；只有核心循環與影片都完成才做。
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
- 背包完成度徽章（收集 8／20 張）。
- 分享卡（Canvas 生成任務報告 PNG）。
- PWA 離線安裝。
- 教室模式（老師投影、討論問題）。
- 更多語言（日文、西班牙文）。
- 無帳號的本機排行榜。
- 真實 NASA 火星照片事件卡。
- 資料面板的「火星相片」7 張縮圖列（現有照片＋caption；不做獨立頁面、不新增下載）。

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
- [x] GitHub repo：`lovelykittenmimi/meowstronauts`（private；11/15 送出前轉 public）。
- [x] Cloudflare：`flymymind.com` 已在 Cloudflare（NS `clark.ns.cloudflare.com`／`dahlia.ns.cloudflare.com`），zone Active；不需改 registrar（2026-11-11 驗證）。
- [x] 建立 repo：README、LICENSE（Apache-2.0）、`.gitignore`、`docs/`；首個 commit `1e4b4d7`。
- [x] 三張貓圖去背，產出 avatar / full / favicon / OG（`brand/`，去背母檔在 `brand/source/`）。
- [x] 建立 `brand/style-guide.md`（色彩、字體、元件、角色資產、生成規則）。
- [x] 建立 `docs/data-sources.md`（2026-11-11；含快照清單、API 實測、資料強度驗證、欄位對應）。

### 9.2 11/11（三）

- [x] 建立 Worker `meowstronauts` 與 `mars.flymymind.com` custom domain；HTTPS 200、HTTP→HTTPS 301（2026-11-11）。
- [x] 不做 Coming soon 頁（2026-11-11 決定）；改用 Worker Hello World 驗證 HTTPS 與網域。
- [x] 建 GitHub Actions skeleton（`.github/workflows/ci.yml`；沒有 package.json 時乾淨跳過，11/14 後自動跑 lint／test／build）。
- [x] 申請 NASA API key；測試 DONKI `/CME`、`/GST` 正常；`/FLR` 回 404，改用 `/notifications?type=FLR`（2026-11-11）。
- [x] 抓 DONKI 2025-05-13～17 快照（20 CME / 4 FLR / 1 GST）。
- [x] 抓 Curiosity REMS 天氣快照（2025 冷週 14 sol，核心 7 sol 前 1.1%；已裁剪欄位）。
- [x] 以真實 key 取得 2025-05-13～17 FLR／GST：X2.7 閃焰確認 `strongFlare=true`、`strongStormConfirmed=true`；Kp 6.33，`strongGeomagneticStorm=false`。開場可寫「強烈太陽閃焰」，不可寫「強烈地磁風暴」。
- [x] 重新產生 NASA API key 並更新 Cloudflare Worker secret（2026-11-11 完成；新 key 只在 Worker secret 與本機 `.dev.vars`）。
- [x] 建立本機 `.dev.vars`（dotenv 格式、已 gitignore）；以新 key 實測 DONKI `/CME` HTTP 200。
- [x] 從 NASA Image Library 抓 6 張火星照片（含 NASA ID、拍攝日、credit）。
- [x] 2026-11-12 追加 PIA25077「Curiosity Finds a Martian Flower」為第 7 張（4:3，credit NASA/JPL-Caltech/MSSS；F1 故事客串，不是植物）。
- [x] 寫 `docs/playtest.md`：1 位兒童、20 分鐘流程、觀察問題（含「會不會點虛線字」、「找不找得到背包」）。
- [x] 整理 20 個術語與 NASA 來源（`docs/glossary.md`；只做研究與連結，不寫遊戲文案）。
- [x] 設計事件卡 schema 與平衡試算表（`docs/event-cards.md`＋`docs/balance-sheet.csv`；不含最終文案）。

### 9.3 11/12（四）

- [x] 完成 UI wireframe：844×390、1024×768、1440×900、390×844 旋轉提示；含知識卡 drawer、背包、任務報告、開場（`docs/wireframes.md`，2026-11-12）。
- [x] 完成三隻貓的語氣 guide 與各 10 句代表台詞（`docs/character-voices.md`；樣本句非最終文案）。
- [x] 圖像範圍改為 MVP 最小圖集 8 張：3 頭像 23–25、01、05、06、07、08（見 `docs/image-prompts.md` §0.5）；**11/14 09:00–10:30 生成**。27 張完整批次不列入 MVP；OG 卡 11/15 有時間再做。
- [x] 寫 submission 模板：專案描述、資料來源、AI disclosure、影片腳本（`docs/submission.md`、`docs/ai-disclosure.md`、`docs/video-script.md`）。
- [x] 圖示與品牌標記：通用 UI 採 Lucide、遊戲專屬圖示自繪；三貓水彩 logo 與腳印定位為團隊標記（`docs/iconography.md`、`brand/` 新檔，2026-11-12）。
- [x] 第三方授權盤點：字體、圖示、NASA 影像、依賴與致謝文字（`docs/licenses.md`，2026-11-12）。
- [x] 已確認 1 位 12 歲兒童（團隊成員）參加 11/14 17:30 的 playtest；家長兩人在場；因時間不足，不追加 11/15 場次，也不對外發邀請。
- [x] 事件卡定案：MVP 12 張（P1、P4、L1、L2、L3、S1、S2、S3、F1、F3、C1、SC2）＋24 張設計庫；每張加 `when` 條件，不硬塞溫度／生存事件（`docs/event-cards.md` §3.2–§3.3，2026-11-12）。
- [x] 開場定案：目標 6 幕、最低 3 幕（幕 1、2、5）；3 幕降級版不影響三個 tap（`docs/wireframes.md` §10.0，2026-11-12）。
- [x] 影片路徑契約：`?video=s1`、`?video=report`、fixture 數值、`data-testid`、錄影順序與 21:00 驗收（`docs/video-path.md`，2026-11-12）。
- [x] 賽前資料整理：內部紀錄移到 `docs/pre-event/`、更新連結、刪除重複照片 `PIA24173 copy.jpg`；11/13 18:30 再做第二次整理（`docs/pre-event/README.md` §4，2026-11-12）。

### 9.4 11/13（五）

**白天：final check**

- [x] A 機 preflight §1–§7、§8.1–§8.6、§9 已跑（2026-11-13 12:51；結果見 `docs/pre-event/pre-event-review-2026-11-13.md` §7.1）。
- [ ] B／C preflight §8.7–§8.9 與環境驗收：**晚上其他人回家後**再做。
- [x] 已備好 final check、pitch、QA 文件（`docs/pre-event/preflight.md`、`docs/pitch.md`、`docs/qa-checklist.md`，2026-11-12）。

**下午：環境與影片管線（不碰遊戲內容）**

- [x] A 機開發環境已確認（Node 24.19、npm 11.17、wrangler 4.161.0、VS Code、GitHub CLI）；B／C 兩台的 Git、Node 24、GitHub CLI、Claude Code **晚上其他人回家後**再裝（見 `docs/pre-event/multi-machine-plan.md` §6）。
- [x] 跑 `docs/pre-event/preflight.md` §6.5：裝 ffmpeg、Playwright（用已裝的 Chrome／Edge）、TTS（edge-tts 或 Windows SAPI）。2026-11-12 先完成：ffmpeg 9.0.2、Playwright 1.65.0＋ffmpeg helper、SAPI Zira、edge-tts 7.3.1（已選 Ana +45%＝26.5 秒；Aria +45%＝24.0 秒備案）。
- [x] 建 `tools/video/`：字卡 HTML、英文字幕 `.srt`、Playwright 錄影腳本、ffmpeg 組片腳本；用假畫面輸出 10 秒測試片。2026-11-12 完成。
- [x] 建 `output/` 並加進 `.gitignore`；確認 1920×1080、30fps、字幕、音量。2026-11-12 完成：10.00 秒、1920×1080、30fps、AAC 48kHz。
- [x] 確認 MVP 最小圖集 8 張與 prompt（`docs/image-prompts.md` §0.5）與 3 張角色參考圖；**11/13 沒有新增參考圖、沒有生成最終圖**，11/14 09:00–10:30 才生成。
- [x] 確認影片路徑契約：`data-testid`、`?video=s1`／`?video=report`、S1 卡、`solarFlare` 知識卡、背包、資料面板、任務報告。2026-11-12 完成，見 `docs/video-path.md`。

**傍晚**

- [ ] 17:00：官方 Resources 釋出；把 challenge 資源連結補進 `docs/data-sources.md`。目前尚未取得可引用的官方 resource 清單，不貼未驗證連結。
- [x] 18:30：**第二次賽前整理**（10 分鐘，照 `docs/pre-event/README.md` §4）：確認 `docs/pre-event/` 只有內部紀錄、README／PLAN／QA／data-sources 連結正確、`git status` 沒有暫存產物；不要把重複檔或測試資料帶進 11/14 09:00 commit。2026-11-13 12:55 已完成初檢，晚上再快掃。
- [ ] 19:00：印出／填好 `docs/video-script.md` §7 交接清單與 `docs/video-path.md` §8 驗收清單；playtest 已確認（1 位 12 歲團隊成員、家長兩人在場）。
- [ ] 20:00 或 B／C 設定完成後：團隊線上 sync（15 分鐘）：確認 11/14 09:00 開工、三台電腦分工（見 `docs/pre-event/multi-machine-plan.md`）、第一版目標、影片交接人、**C 下午寫 E2E／晚上做影片；A 夜間跑測試**。
- [ ] 21:30：手機、平板、筆電充電；電源設定為插電不休眠；鬧鐘 08:00。
- [ ] 22:00：**Freeze**。不再碰任何遊戲內容、不再生成圖。睡覺。

---

## 10. 比賽兩天 Runbook

### 10.1 11/14（六）

> **名詞：** 這天的「第一版」是 **push 第一版程式碼到 GitHub**，讓 A／B／C 三台能 clone 後一起工作；**不是 NASA submission**。NASA project 頁面的 final submit 在 11/15，由 A 按。

| 時間 | 工作 | 負責 | 完成標準 |
|---|---|---|---|
| 08:30 | 開機、開 repo、開 Cloudflare、開計時器；確認 GEM 三張參考圖 | 全員 | 環境就緒 |
| 09:00 | 官方開始；**賽前唯一一次 commit＋push**（賽前文件＋可 build 的 scaffold；證明作品從此刻開始；11/13 不先 commit）；**B／C 09:05 clone 這版**；之後的 commit 都屬比賽期間開發 | Claude | GitHub 上有 `chore: start hackathon`；B／C 可 clone；09:10 看 Actions |
| 09:00–10:30 | **生成 MVP 最小圖集 8 張原圖**：3 頭像（23–25）、01、05、06、07、08；放 `output/raw/`，建 `src/assets/generated/`；**去背／壓縮交給 C（10:30 後）** | 使用者 | 8 張原圖 |
| 09:00–10:30 | Vite + React + TS scaffold、design tokens、`package.json`／lock；**Vitest／Playwright harness、seed、test IDs**；圖到位後匯入 | Claude | 首頁可跑；`npm ci`、`npm test` 可跑 |
| 10:30–13:00 | 核心狀態機、資源結算、7 sol、12 張事件卡、20 張知識卡文案；加 `data-testid` 與 `?video=s1`／`?video=report` 入口（不顯示在 UI；契約見 `docs/video-path.md`）；**11:00 確認 B／C 已拿到同一版、CI 綠燈** | Claude＋使用者 | 可玩一局；影片路徑可重現 |
| 13:00–14:00 | 午餐＋第一次 playtest（自己玩） | 全員 | 找出 3 個卡點 |
| 14:00–16:00 | UI 元件、三隻貓對話、開場 6 幕（最低 3 幕）＋3 個 tap（幕 2 動畫 1.5–2 小時，16:00 前沒穩就退回靜態）、知識卡面板、雙語、手機／桌機佈局；資料面板先用快照 | Claude + 小孩 | 手機可玩 |
| 16:00–16:30 | 開場節奏測試（小孩試看 1 次）＋修正 | 小孩 + 使用者 | 試看完成並記錄秒數（長度不是硬性門檻） |
| 16:30–17:30 | 部署 v0.1；整理 submission 文案與截圖草稿（**不按 final submit**） | 使用者 | 正式 URL 可開 |
| 17:30–19:00 | 小孩 playtest #1（20 分鐘）＋修正 | 小孩 + 使用者 | 記錄 5 個問題 |
| 19:00–21:00 | **影片路徑優先**：S1 卡在 Sol 4、`solarFlare` 知識卡、背包 8/20→9/20、DONKI／REMS 資料面板、任務報告；英文介面；跑一次完整錄影路徑；修 P0 | Claude + 使用者 | 路徑從頭走到尾；**21:00 build freeze** |
| 21:00–22:00 | **不改遊戲**：截圖 3–5 張、更新 README／submission、整理 playtest 紀錄 | 使用者 + Claude | 截圖與文件完成 |
| 22:00–22:30 | 最後一次 build 檢查、填寫影片交接清單；**把 `tools/video/**` 交接給 C**；**A 準備夜間 runner（`docs/pre-event/multi-machine-plan.md` §7.1）** | 全員 | build 凍結；清單 100%；C 接手影片、A 顧 runner |
| 22:30–23:00 | **交接給 Claude**：**A 啟動 runner**、C 開始錄影片；確認 `docs/video-script.md` §7 清單；團隊睡覺 | 使用者 | 交接完成 |
| 23:00 | 睡覺（不要通宵） | 全員 | — |
| 23:00–隔日 | **C 機夜間：錄第 3–7 鏡、字卡、字幕、使用 repo 的 Ana +45% 旁白、剪輯、輸出 v1**；**A 機夜間測試＋定點修復，07:30 寫報告** | Claude（A／C） | 早上 09:00 前有 v1 與夜間報告 |

**C 機平行工作：** 10:30–12:00 圖片去背／壓縮（輸出 `src/assets/generated/**`）；13:00–16:30 建 E2E（完整一局、影片路徑、語言）；19:00–21:00 全套 unit＋build＋E2E 綠燈；22:00 接手影片管線，22:30–07:30 產出 v1。**B 機不留守、晚上關機；A 機留守跑測試。**

**11/14 第一版的最低標準：**

- 首頁 → 開場（可跳過）→ 選難度 → 7 sol → 任務報告，全程可完成。
- 開場至少 3 幕＋3 個資源 tap；三隻貓都出現，至少各 2 句台詞。
- 幕 2 動畫是加分項，不列入最低標準；11/14 16:00 前不穩就退回靜態版。
- 至少 8 張知識卡可點開、可收入背包、可在任務中複習；其中包含 `solarFlare`。
- 影片路徑可重現：`?video=s1` → Sol 4 S1 卡、`solarFlare` 知識卡、背包 8/20→9/20、資料面板；`?video=report` → 任務報告（契約見 `docs/video-path.md`）。
- 21:00 build freeze；22:30 交接清單完成。
- 手機橫放（568px 起）、平板橫放與桌機（1440px）都不破版；直向顯示旋轉提示；不用 hover 也能玩。
- 正式 URL 可開；GitHub repo 保持 private，11/15 轉 public 後才貼連結。
- README 有「這是 2026 Space Apps 作品」與資料來源。

### 10.2 11/15（日）

| 時間 | 工作 | 負責 | 完成標準 |
|---|---|---|---|
| 09:00–09:30 | **讀 A 夜間報告、跑全套、revert 壞 commit**；C 看影片 v1、確認旁白／第 1 鏡／音樂；整理 playtest #1 紀錄 | 使用者 + Claude | v1 審閱完成；main 綠；P0 清單 |
| 09:30–10:00 | A 修 P0；C 必要時換音軌重出 v2 | 使用者 + Claude | 新 WAV／MP3 給 C，或沿用 Ana +45% |
| 10:00–10:30 | C 重出 v2；團隊確認；A 必要時 deploy | Claude（A／C） | v2 可看 |
| 10:30–11:00 | 影片字幕／長度／畫面 QA；必要時補拍一個鏡頭 | Claude + 使用者 | v2 定稿候選 |
| 11:00–11:30 | **切換預設語言為英文**（`DEFAULT_LOCALE`）並部署 | Claude | 無痕視窗首次開啟為英文；切換繁中後選擇會保留 |
| 11:30–13:00 | 修正最痛的 5 個問題、平衡調整 | Claude | 勝率合理 |
| 13:00–14:00 | 午餐＋檢查 submission 連結；**GitHub repo 轉 public** | 全員 | 連結全通、無痕視窗開得到 repo |
| 14:00–16:00 | 無障礙、效能、跨瀏覽器、404/OG | Claude | Lighthouse ≥ 90 |
| 16:00–18:00 | **16:00 code freeze**；C 最終影片 QA／輸出（上傳由 A 確認）；C 截圖、更新 README；A deploy final | 使用者 + Claude（A／C） | 影片定稿、截圖完成 |
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

- [ ] 11/15 送出前把 `lovelykittenmimi/meowstronauts` 由 private 轉 public，包含完整原始碼。
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

- [ ] 30 秒（含結尾停留）。
- [ ] 英文旁白或英文字幕（全球評審）。
- [ ] 內容：開場 hook（三隻貓被太陽風暴打中、迫降火星、7 天倒數）→ 三隻貓 → 一張事件卡的選擇與代價 → 點開知識卡、收入背包 → 真實資料 → 影響力 → 團隊。
- [ ] 開場前幾秒可直接用遊戲分鏡快轉，讓評審先被故事抓住。
- [ ] 11/14 21:00 build freeze；22:30–23:00 交接（清單見 `docs/video-script.md` §7）。
- [ ] 11/14 深夜 **C 機 Claude** 產出 v1（TTS scratch）；11/15 09:30 錄正式旁白（若換），10:00 由 C 換音軌重出 v2。
- [ ] 16:00–18:00 最終 QA；若 11:30 後 UI 有改，C 補拍受影響鏡頭；A 確認上傳。
- [ ] 影片檔案在 `output/`，不進 git；YouTube 上傳由團隊做。
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
- [ ] 30 秒簡報大綱存在 `docs/`。

---

## 13. 評分對應

| 獎項類別 | 我們的證據 |
|---|---|
| **Best Use of Science** | 真實火星環境數值、DONKI 太陽活動、OSDR 健康研究；每個選擇對應真實 constraint；20 張知識卡可複習 |
| **Best Use of Data** | DONKI／Curiosity REMS 快照、Image Library 照片、資料來源面板、每張知識卡可追溯 |
| **Best Game** | 7 sol 核心循環、三選項取捨、貓咪專長、知識卡背包、重玩性、星等 |
| **Best Storytelling** | 開場「太陽風暴迫降＋7 天倒數」、三隻貓各自的動機、任務日誌、結局星圖、失敗時的溫柔敘事 |
| **Best Design** | 3D 動畫電影風格、清楚的資訊層次、手機橫放／平板／桌機佈局、無障礙 |
| **Galactic Impact** | 免費、免帳號、雙語、可給教室用、7–12 歲；知識卡可離線複習 |
| **Most Inspirational** | 孩子扮演指揮官，理解「每個選擇都有代價」 |
| **Best Mission Concept** | 火星前哨站的資源取捨具體、可玩、可解釋 |

**30 秒評審簡報／影片結構（11/12 依過去參賽者經驗調整）：**

1. 0:00–0:04：hook——三隻貓迫降火星，7 個 sol 倒數。
2. 0:04–0:07：角色——銀白、暗影、金桔（畫面帶過，不逐一介紹）。
3. 0:07–0:14：核心——每個 sol 一個選擇，每個選擇都有代價。
4. 0:14–0:21：知識卡——點虛線字、收進背包。
5. 0:21–0:30：真實資料、影響力與團隊。

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
| 網域／SSL 沒設好 | 中 | 高 | 11/11 已完成 zone、custom domain、HTTPS 驗證；11/13 再跑一次 `curl -I` final check | 你 |
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
| 2026-11-10 | 11/14 09:00 先 push 第一版程式碼到 GitHub，11/15 23:59 前完成 NASA final submit | 先讓三台能協作、再優化；NASA 頁面不提早送 |
| 2026-11-13 | 11/14 上午的「submission」正名為「push 第一版程式碼到 GitHub」 | 使用者澄清：這是指先上傳一版程式碼，讓 A／B／C 三台一起做事；不是 NASA project 頁面的 submission。NASA final submit 仍在 11/15 |
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
| 2026-11-11 | GitHub repo 定為 `lovelykittenmimi/meowstronauts`，先 private | 與產品英文名一致、網址短；先不公開，11/15 送出前轉 public；公開後 commit 時間戳可證明遊戲從 11/14 09:00 才開始 |
| 2026-11-11 | 不做 Coming soon 頁；用 Worker Hello World 驗證 `mars.flymymind.com` | 使用者決定不額外維護 placeholder；網域與憑證用最小 Worker 驗證即可，11/14 在同一個 Worker 換成正式版 |
| 2026-11-11 | Worker 命名 `meowstronauts`；`mars.flymymind.com` 綁 custom domain 完成 | 與 repo／產品英文名一致；HTTPS 200、HTTP→HTTPS 301，憑證由 Cloudflare 自動簽發 |
| 2026-11-11 | SSL/TLS 模式維持 **Full**，不改 Full (strict) | zone 同時服務既有 `flymymind.com` 主站；若 origin 憑證非公開信任，Full (strict) 會讓主站 526。Worker custom domain 沒有 origin，模式不影響 `mars` |
| 2026-11-12 | 版面模式以**高度**判定（緊湊 < 440px），不完全照 6.8 的寬度斷點 | 844×390 的寬度落在 `md`、高度卻只有 390；若照寬度走會套到大平板的留白與字級，選項被擠出畫面。實作以 `orientation: landscape` ＋ `max-height` 為主，寬度只用來決定欄寬與是否收起右欄 |
| 2026-11-12 | 通用 UI 圖示採 **Lucide**，不自己畫方向鍵／home；貓化只用於品牌與收藏印章 | 兒童對標準符號有既有認知，自繪通用圖示耗時且不一致；`⚡💧🛡️` 等 emoji 僅作 wireframe 佔位，11/14 換成 Lucide；六個資源圖示列為 Should-have |
| 2026-11-12 | 三貓水彩 logo 定位為**團隊標記**，不當遊戲主標題、不進事件卡與場景 | 水彩比例與服裝和 3D 角色參考圖不同，並排會讓兒童混淆；遊戲標題仍用 3D 主視覺＋程式排字；logo 用於載入畫面、關於面板、頁尾、簡報與 OG 角落 |
| 2026-11-12 | 腳印（黑）作 favicon 與收藏印章；粉色只做裝飾 | 16–32px 時腳印剪影比貓臉清楚；粉紅不在品牌色票內，不能當狀態色，狀態一律用 `--coral` |
| 2026-11-12 | 新增文字安全色 `--amber-ink #9A5B00`、`--coral-ink #B34A33`、`--teal-ink #356B69`、`--rust-ink #9A4A2B` | 實測原色在 paper 上只有 1.95–4.10，未達 AA 4.5；原色改當填充／圖示／大字，填色按鈕配 navy 字（amber 6.37、coral 4.66），silver 不當文字 |
| 2026-11-12 | 家長同意書獨立為 `docs/consent-form.md`（可列印一頁） | 書面同意需要正式文件；只收 C1／C2／C3 代號、不拍照不錄音，螢幕錄影另勾選，2026-11-22 前刪除 |
| 2026-11-12 | 刪除 `docs/consent-form.md`；playtest 改為 1 位兒童、11/14 單場 | 時間不足，不對外找 2 位兒童；只保留家長在場的 1 位兒童測試，口頭說明即可，不做書面同意與螢幕錄影 |
| 2026-11-12 | 快照 manifest 移除 `api_key` 佔位，改記 `api_key_included: false` 與來源 | 避免任何人誤以為 repo 存有金鑰；金鑰只在 Worker secret 與 `.dev.vars` |
| 2026-11-12 | 照片加註使用限制：PIA26632 灰階、PIA24264 全景條、PIA24173 直式 | 實測尺寸與色彩模式後發現直接當 16:9 主圖會壞；先寫進 `data-sources`，避免 11/14 選錯圖 |
| 2026-11-12 | 加入 PIA25077「Curiosity Finds a Martian Flower」為第 7 張照片 | 使用者決定；花狀岩石是真實 NASA 影像，能支撐水與溫室主題；**它是岩石，不是植物**，文案與 caption 必須寫明 |
| 2026-11-12 | **不做獨立相片庫**；照片只用於事件卡／資料面板，11/15 有時間才在資料面板加 7 張現有照片的縮圖列 | MVP 26–31h 已滿；完整藝廊要新增導覽、縮圖、caption、雙語與 QA，對核心循環與 30 秒影片沒有幫助；7 張照片已能用於事件卡與資料誠實展示 |
| 2026-11-13 | 成品網址確定沿用 `https://mars.flymymind.com`；`meowstronauts` 只是 Worker 名稱 | 這個網域已 HTTPS 200、憑證正常，submission 與文件都已用它；不另綁 `meowstronauts.flymymind.com`，避免臨時改 DNS／文件與影片路徑 |

**待確認：**

- [x] 重新產生 NASA API key 並更新 Cloudflare Worker secret → 已完成（2026-11-11）。
- [ ] 台北 local event 的實際報到、pitch、judging 時間（目前頁面顯示 virtual，schedule 為空）。
- [x] 是否要在 11/14 前先部署「Coming soon」頁（不包含遊戲）→ 不做（2026-11-11）。
- [ ] 小孩的 playtest 時間（1 位，家長在場）。

---

## 16. 今天就能做的下一步

1. **你：** Cloudflare zone、Worker `meowstronauts`、`mars.flymymind.com`、NASA 新 key 與 Worker secret — 已於 2026-11-11 完成，11/13 只需回測。
2. **Claude：** 建 repo skeleton（README、LICENSE、docs、brand 資料夾）。已完成 repo 與首個 commit；`brand/` 已建立。
4. **Claude：** 三張貓圖去背、產出 avatar／favicon／OG。
5. **Claude：** 整理 20 個術語與 NASA 來源，建立 `glossary` 研究草案（只列術語與連結，不寫遊戲文案）。
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
**長度：** 名目 75–90 秒（不是硬性門檻；可按「下一幕」提早；可跳過）  
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
**互動：** 「太陽風暴」虛線術語可點（全遊戲第一個知識卡 hook）；點開時動畫暫停，關閉續播。18 秒；18 秒後顯示「繼續」，停在最後一格等玩家點擊；可加畫面震動與警報音。動畫規格見 `docs/wireframes.md` §10.1。  
**配音：** 遊戲內不錄人聲；無線電台詞以文字呈現（文字即字幕）。30 秒影片旁白是另一條音軌，已選 edge-tts 童聲 Ana +45%（26.5 秒）。  
**知識卡 hook：** 暗影無線電中的「太陽風暴」是全遊戲第一個可點術語；點開可先讀，也可跳過。沒點的人會在 Sol 1 聽到銀白的一句教學，之後照常玩。



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
**銀白（繁中）：** 「吃飽之前，先慢慢走。在太空待了好幾個月，我們的身體變弱了。」  

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
**Silver (EN):** “Before you eat, walk slowly. Months in space made us weaker.”  
**互動：** 玩家二選一（不影響結果；兩條回覆都導向同一句）。25 秒。
> 2026-11-14 新增銀白健康句（約 4 秒）。若幕 3 超時，優先砍暗影「工程師的『大概』…」與銀白「大概？」的來回，不砍健康句。

### 幕 4 — 七個火星日

**畫面：** 暗影低伏在星圖前（角色以 `ref-shadow.jpg` 為準；以 08 控制室裁切＋CSS 星圖 overlay，不新增生成圖）。星圖上有喵星、火星、一條航線，以及一個被燒黑的引擎圖示；7 個亮點逐一亮起。  
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
銀白（繁中）：「火星的大氣層太稀薄，保護不了我們。遮蔽，是我們的盾。」  
金桔（繁中）：「也是我的曬太陽區。」  
銀白（繁中）：「你不能在火星曬太陽。」  
金桔（繁中）：「為什麼？」  
銀白（繁中）：「因為你會變成烤橘貓。」  
金桔（繁中）：「……那我塗防曬。」  
Silver (EN): “Mars's atmosphere is too thin to protect us. Shielding is our armor.”  
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

**術語 hook（用 `{{termId}}` 標記）：** 幕 2 `{{solarStorm}}`；幕 3 `{{solarPower}}`；幕 5 `{{greenhouse}}`、`{{atmosphere}}`、`{{radiationShielding}}`；幕 6 `{{sol}}`。其餘術語在事件卡與每日簡報出場，完整對照見 `docs/glossary.md` §3.5。

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
- **不要做的事：** 不要用旁白解釋太陽風暴理論；不要讓開場長到小孩想按「跳過故事」；不要讓三隻貓變成純教學 NPC，他們要有脾氣與笑點。

---

*這份計畫是活文件。任何範圍變動，先更新第 8 節與第 10.3 節，再動手。*
