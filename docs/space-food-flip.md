# 太空食物翻卡小遊戲（Space food flip）

> 最後更新：2026-11-15
> 程式：`src/minigames/food/`；資料來源：`docs/data-sources.md` §3.5；手動 QA：`docs/qa-checklist.md` §3
> 定位：Sol 7「溫室與新鮮食物」的延伸練習，加上 **F3「補給箱延誤」的操作橋段**（選「配給」或「吃庫存」時先開）。F3 那一關可以按 Back 跳過直接結算，所以**不玩也走得完 7 sol**；不改事件牌庫與平衡表。

## 1. 入口

| 入口 | 出現時機 | `data-testid` | 文案（EN／zh-TW） |
|---|---|---|---|
| Sol 7 每日簡報 | 只在 `state.sol === 7`，術語 chip 下方 | `food-practice` | `Try the space food flip`／`試試太空食物翻卡` |
| Sol 切換列 | 任何 sol，〔🦘 低重力跳躍〕之後 | `food-open` | `Space food flip`／`太空食物翻卡` |
| F3 補給箱延誤（事件卡） | 選「配給」`ration` 或「吃庫存」`stores` 後、結算前；「派探測車」`rover` 不開 | `food-game`（`food-back` 可跳過） | 沿用遊戲內建文案 |
| `?video=` 錄影模式 | **不顯示**（`onFood`／`onFoodPractice` 都不傳） | — | — |

三者開同一個全螢幕 `SpaceFoodFlip`（`role="dialog"`、`aria-modal`、Escape 關閉）。從 Sol 7 簡報或 Sol 列開啟時，關閉後回到原本畫面；除了 §4 的一次性獎勵，不動任何任務狀態。從 F3 開啟時，**關閉（Back／✕／Escape）等於完成該選項的結算**——按鈕已經按下，不能再改選其他選項；「派探測車」是唯一不經小遊戲的選項。

## 2. 玩法

`intro → playing → result`，**沒有計時、沒有失敗、沒有扣分**。

- **目標**：6 組「食物卡 ↔ NASA 事實卡」共 12 張，全部配對完成。
- **翻牌**：一次翻兩張。同組 → 兩張鎖定、配對數 +1、公告該組事實；不同組 → 顯示「不是一對」，約 900 ms 後自動翻回。判定動畫期間忽略點擊。
- **洗牌**：正式遊玩每次 `Math.random` 洗牌；測試可傳 seed（mulberry32 + Fisher–Yates），同 seed 牌序固定。
- **HUD**：配對 `0/6` 與翻牌次數；翻牌次數只在結果顯示，不評價。
- **結果**：6/6 後約 700 ms 進入結果畫面，顯示 6 條事實總覽、4 個 NASA 來源連結、獎勵結果；可「再翻一次」或返回。
- **無障礙**：卡片是 `<button>`，未翻開時 `aria-label` 不劇透內容；翻開後讀出食物名或事實；`aria-live="polite"` 公告配對、失誤與完成；`prefers-reduced-motion` 關掉翻牌 pop 與面板淡入，邏輯不變。
- **觸控**：卡片本身就是按鈕，不需要拖曳。

## 3. 卡牌內容（6 組）

| # | 食物卡 EN／zh-TW | 事實卡 EN | 事實卡 zh-TW | 來源 |
|---|---|---|---|---|
| 1 | Freeze-dried strawberries／冷凍乾燥草莓 | Freeze-dried: water removed, light to carry, no fridge. | 冷凍乾燥：去掉水，變輕、不用冰箱。 | S23 |
| 2 | Heat-stabilized pouch／熱殺菌軟袋 | Heat-stabilized: sealed pouch, keeps at room temperature. | 熱殺菌：密封軟袋，常溫保存。 | S23 |
| 3 | Drink pouch／飲料軟袋 | Drink pouch: water goes in through a one-way valve. | 飲料袋：水從單向閥加進去。 | S23 |
| 4 | Veggie lettuce／太空生菜 | Veggie: grown on the ISS and eaten by astronauts in 2015. | Veggie：種在太空站，2015 年太空人吃過。 | S25 |
| 5 | Station chili peppers／太空辣椒 | Station peppers: grown on the ISS; taste changes in space. | 太空辣椒：種在太空站；太空中的味覺會改變。 | S11 |
| 6 | Vitamin D／維生素 D | Vitamin D: a nutrient NASA watches because bones need calcium. | 維生素 D：NASA 特別關注，因為骨骼需要鈣。 | S24、S20 |

事實卡用「關鍵字：一句話」開頭，讓 7–12 歲先抓到主題再讀句子；括號外的名詞與數字都對應 `docs/data-sources.md` §3.5。

## 4. 獎勵

- 條件：6/6 完成、本次任務尚未領過、非 `?video=`、階段是 `briefing`／`choice`／`result` → `food +1`（`FOOD_GAME_REWARD_FOOD = 1`，上限 12）。
- 每次任務只給一次：`GameState.foodGameRewarded` 標記；`START_GAME`／`RESTART` 由 `createInitialState` 重置。
- 5/6 或中途離開：可以離開，只是不給獎勵。
- 已領過再玩：完成畫面顯示「這次任務的食物獎勵已領取」，不再加。
- 食物已滿 12：**不發獎勵、也不標記**；完成畫面顯示「儲糧已經滿了」，結果不會假裝 +1。之後某個 sol 消耗食物、有空間時再完成，仍可領取。
- 在 `result` 階段領獎時，同步把 `resourceHistory` 最後一點的 food 對齊，讓任務報告的曲線與最終數值一致；其他階段不動歷史（下一次 `CHOOSE` 自然記進新點）。
- 相關程式：`GameAction` 的 `{ type: 'COMPLETE_FOOD_GAME'; pairs }`、`handleCompleteFoodGame`（`src/game/reducer.ts`）、`FOOD_PAIR_TOTAL`／`FOOD_GAME_REWARD_FOOD`（`src/game/balance.ts`）。

## 5. 文案與事實

- 可寫：NASA 生產冷凍乾燥食品與熱殺菌軟袋；飲料袋用單向閥注水；2015-08-10 Expedition 44 在軌品嚐 Veggie 的 Outredgeous 紅蘿蔓；太空人回報喜歡太空站的辣椒、太空中味覺會改變；NASA 關注 vitamin D、calcium 等營養素。
- 不可寫：維生素 D 劑量（IU）、Omega-3 抗發炎／抗輻射、辣醬取代高鹽、任何骨密度百分比或「NASA 建議」；也不把 2014 年的 VEG-01A 寫成「太空人第一次吃掉生菜」。
- 不新增第 21 張知識卡；背包維持 20 張，太空食物只出現在小遊戲與 `docs/data-sources.md` §3.5。
- 來源（結果畫面四個連結）：Space Food Systems、JSC Food & Nutrition、2015-08-10 太空站部落格、Growing Plants in Space；逐條對應見 `docs/data-sources.md` §3.5。

## 6. 檔案

| 檔案 | 內容 |
|---|---|
| `src/minigames/food/SpaceFoodFlip.tsx` | 狀態機、翻牌計時、intro／playing／result、HUD、aria-live |
| `src/minigames/food/game/state.ts` | 6 組資料、洗牌、`flipCard`／`resolveMismatch`／`isComplete` |
| `src/minigames/food/game/i18n.ts` | 小遊戲內 EN／zh-TW 文案 |
| `src/minigames/food/styles.css` | 全部 `.food-*` 前綴，不動共用樣式 |
| `src/game/types.ts`、`src/game/reducer.ts`、`src/game/balance.ts` | `foodGameRewarded`、`COMPLETE_FOOD_GAME`、獎勵常數 |
| `src/App.tsx`、`src/ui/BriefingScreen.tsx`、`src/ui/SolNav.tsx`、`src/i18n/index.ts`、`src/styles.css` | 入口按鈕與兩條入口文案 |
| `src/ui/EventCardView.tsx` | F3 的橋段：`FOOD_CHOICES`（`ration`／`stores`）→ 開小遊戲，`onExit` 才 `onChoose`；獎勵由 `App` 傳入的 `onFoodComplete` 派送 |
| `src/minigames/food/game/state.test.ts`、`i18n.test.ts`、`src/minigames/food/SpaceFoodFlip.test.tsx`、`src/game/foodGameReward.test.ts`、`src/ui/EventCardView.test.tsx` | 單元與元件測試 |

## 7. 手動 QA

1. 新遊戲 → 跳過開場 → 推進到 Sol 7 簡報，出現〔🍽️ 試試太空食物翻卡〕；Sol 1 與 Sol 6 簡報沒有。
2. Sol 列的〔🍽️ 太空食物翻卡〕在任何 sol 都能開；短螢幕（568×320）只顯示 emoji，`aria-label`／`title` 仍在，整列不換行、無水平滾動。
3. Intro 的 Start 進入牌桌，HUD 顯示 `0/6`；翻一組正確的卡，兩張保持翻開、配對數 +1；翻一組錯的，約 900 ms 後翻回。
4. 完成 6/6 出現結果畫面；**第一次**領到食物 +1；同一任務再玩一次顯示「已領取」，數值不變。
5. 在任務報告（`result` 階段）領獎時，報告曲線最後一點與最終食物值一致；食物已滿 12 時不發獎勵、不標記，結果畫面顯示「儲糧已經滿了」，之後有空間再完成仍可領取。
6. 關閉（✕ 或 Escape）回到原本畫面，任務進度與其他資源不變。
7. `?video=s1` 與 `?video=report` 沒有任何 food 入口；影片 fixture 的 HUD 數字不變。
8. 568×320 與 1280×800：12 張卡都在視窗內、無 console error、無水平滾動條；`prefers-reduced-motion` 下動畫關閉但可玩。
9. 單元測試：`npm test`（`state.test.ts`、`i18n.test.ts`、`SpaceFoodFlip.test.tsx`、`foodGameReward.test.ts`、`BriefingScreen.test.tsx`、`EventCardView.test.tsx`）。
10. F3「補給箱延誤」：選「配給」或「吃庫存」都先開翻卡；按 Back／✕ 直接進結算，選項效果只套一次；選「派探測車」不開遊戲。`npx playwright test tests/e2e/full-run.spec.ts` 會走過這條路徑。

## 8. 已知取捨

- **F3 是主線上的橋段，但可以跳過**：選了「配給」或「吃庫存」就一定要看到翻卡（Back 也算完成），不能改選；這是刻意的——按鈕上的代價在按下時就成立。不想玩的人可以按 Back，選項照樣結算，只是拿不到 6/6 的 +1 food。

- **+1 食物會略微影響生存曲線**：這是刻意選的小獎勵，限制「每次任務一次、只能 6/6、上限 12」，比科學 +1 更不容易動到三星門檻；不寫進固定 7 sol 平衡表，也不改 `docs/balance-sheet.csv`。滿 12 時不發、不標記，避免完成畫面與 HUD 對不上。
- **記憶遊戲吃運氣**：不計時、不評分，只顯示翻牌次數；固定 seed 只用於測試，正式遊玩每次洗牌。
- **Sol 列第三個練習鈕**：短螢幕只顯示 icon（🍽️），保留 `aria-label`／`title`；若真的放不下，退路是把 food 入口只留在 Sol 7 簡報。
- **不使用照片**：卡片是 emoji 與文字，不引用 NASA 影像，也不涉及圖片 credit。
