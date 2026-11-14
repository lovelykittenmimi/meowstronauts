# 低重力跳躍小遊戲（Low-gravity hop）

> 最後更新：2026-11-14
> 程式：`src/minigames/hop/`；資料來源：`docs/data-sources.md` §3.4；手動 QA：`docs/qa-checklist.md` §3
> 定位：Sol 1「火星重力是地球的 38%」的延伸練習。**不是主線**，不玩也能完成 7 sol；不改事件牌庫與平衡表。

## 1. 入口

| 入口 | 出現時機 | `data-testid` | 文案（EN／zh-TW） |
|---|---|---|---|
| Sol 1 每日簡報 | 只在 `state.sol === 1`，術語 chip 下方 | `hop-practice` | `Try the low-gravity hop`／`試試低重力跳躍` |
| Sol 切換列 | 任何 sol，〔🚀 著陸練習〕之後 | `hop-open` | `Low-gravity hop`／`低重力跳躍` |
| `?video=` 錄影模式 | **不顯示**（`onHop`／`onHopPractice` 都不傳） | — | — |

兩者開同一個全螢幕 `LowGravityHop`（`role="dialog"`、`aria-modal`、Escape 關閉）。關閉後回到原本畫面；除了下面 §4 的一次性獎勵，不動任何任務狀態。

## 2. 玩法

`intro → playing → result`，**沒有失敗狀態**。

- **世界**：邏輯座標 2880×540，視窗 960×540；相機跟隨玩家，玩家固定在畫面左側約 1/3。
- **目標**：從 `x=80` 走到最右側氣閘艙（`x=2790` 觸發完成）。3 個赤鐵礦樣本浮在玄武岩尖柱上方，要跳才碰得到；2 個塵捲風在地面巡邏。
- **塵捲風**：碰到會被推開並計入「被塵捲風推開」次數（1.2 秒冷卻），**不扣血、不失敗**。
- **操作**：← →／A、D 移動；Space／↑／W 跳，按住跳更高、放開會切斷上升；觸控用畫面下方的方向鍵與「跳」按鈕（pointer events）；Escape 或右上角 ✕ 離開。
- **HUD**：左上樣本 `0/3` 與三個圓點；右上「火星重力 0.38 g」徽章；樣本、塵捲風與跳躍提示用 toast 顯示，同時以 `aria-live="polite"` 公告。
- **結果**：樣本數、被推開次數、獎勵結果、三條知識回饋（質量／慣性、赤鐵礦、塵捲風）與三個 NASA 來源連結；可「再跳一次」或返回。
- **無障礙**：`prefers-reduced-motion` 關掉星星閃爍、塵捲風搖擺、貓的走路動畫與面板淡入，物理不變。

## 3. 物理

純函式在 `src/minigames/hop/game/physics.ts`；固定步長 `1/120 s`，渲染約 30 fps，單次模擬最多 `0.05 s`（掉幀不會把貓傳送到對岸）。

| 常數 | 值 | 用途 |
|---|---|---|
| `PX_PER_M` | `80 px/m` | 邏輯世界比例尺 |
| `MARS_G` | `3.71 m/s²` → `296.8 px/s²` | 火星表面重力 |
| `EARTH_G` | `9.81 m/s²` → `784.8 px/s²` | 只用於 intro 對照與測試 |
| `JUMP_SPEED` | `300 px/s` | 起跳速度（火星、地球相同） |
| `JUMP_CUT` | `120 px/s` | 放開跳躍鍵後保留的上升速度上限 |
| `WALK_MAX` | `200 px/s` | 水平最高速 |
| `GROUND_ACCEL` | `900 px/s²` | 地面加速度 |
| `AIR_ACCEL` | `320 px/s²` | 空中微調 |
| `MU` | `0.85` | 地面摩擦係數；摩擦加速度 = `MU × g` |
| `SAMPLE_LIFT` | `115 px` | 樣本離地高度 |
| `SAMPLE_PICKUP_RADIUS` | `55 px` | 以貓的胸口（腳底上方 40 px）判定 |
| `DEVIL_RADIUS` | `55 px` | 塵捲風碰撞半徑 |
| `DEVIL_COOLDOWN` | `1.2 s` | 被推開後再次計數的間隔 |
| `DEVIL_PUSH_X`／`DEVIL_PUSH_Y` | `220`／`200 px/s` | 推開的衝量 |

兩個可直接驗證的關係（`physics.test.ts` 有斷言）：

- **跳躍高度**：`v² / 2g`。同樣 `JUMP_SPEED`，火星是地球的 `EARTH_G / MARS_G = 9.81 / 3.71 ≈ 2.64` 倍；遊戲裡約 `151.6 px` 對 `57.3 px`。文案寫「約 2.6 倍」。
- **煞車距離**：`v² / (2μg)`。同一 `MU` 下比例完全相同；以最高速 200 px/s 算，火星約 `79 px`、地球約 `30 px`。

地形是手寫控制點的分段線性 `groundY(x)`：3 個隕石坑（最低 y≈486）與多段岩石高地（最高 y≈400），**沒有無底洞**，掉進坑可以走出來。樣本在 `x = 890 / 1470 / 2010`；兩個塵捲風分別在 `1150–1350`（0.9 rad/s）與 `2050–2250`（0.7 rad/s）之間往返。

> 這是**給 7–12 歲的可玩近似**：保留 0.38 g 的重力比例與「煞車距離變長」的相對關係，但時間感與尺度是為遊戲調整的，不能當成 NASA 的模擬或實測結果。

## 4. 獎勵

- 條件：走到氣閘艙且**收集 3/3 樣本**、本次任務尚未領過、非 `?video=`、階段是 `briefing`／`choice`／`result` → `science +1`（`HOP_REWARD_SCIENCE = 1`）。
- 每次任務只給一次：`GameState.hopRewarded` 標記；`START_GAME`／`RESTART` 由 `createInitialState` 重置。
- 2/3 或更少：可以完成，只是不給獎勵，結果畫面提示「收集全部 3 個樣本可獲得科學 +1」。
- 已領過再玩：完成畫面顯示「這次任務的科學獎勵已領取」，不再加。
- 在 `result` 階段領獎時，同步把 `resourceHistory` 最後一點的 science 對齊，讓任務報告的曲線與最終數值一致；其他階段不動歷史（下一次 `CHOOSE` 自然記進新點）。
- 相關程式：`GameAction` 的 `{ type: 'COMPLETE_HOP'; samples }`、`handleCompleteHop`（`src/game/reducer.ts`）、`HOP_SAMPLE_TOTAL`／`HOP_REWARD_SCIENCE`（`src/game/balance.ts`）。

## 5. 文案與事實

- 可寫：火星重力約地球的 38%（0.38 g）、低重力不是無重力；重量變輕但質量與慣性不變；機會號發現富含赤鐵礦、暱稱「藍莓」的小球；塵捲風是小旋風。
- 不可寫：「火星沒有重力」、把塵捲風寫成沙塵暴、把推測寫成肯定句、任何百分位排名或「strong geomagnetic storm」。
- 赤鐵礦只出現在小遊戲回饋與 `docs/data-sources.md` §3.4；**不新增第 21 張知識卡**，背包維持 20 張。
- 來源（結果畫面三個連結）：NASA Space Place《What Is Gravity?》、NASA Science《Martian “Blueberries”》、NASA Science《Dust Devils on Mars》；逐條對應見 `docs/data-sources.md` §3.4。

## 6. 檔案

| 檔案 | 內容 |
|---|---|
| `src/minigames/hop/LowGravityHop.tsx` | 狀態機、rAF 迴圈、鍵盤／觸控、intro／result／HUD |
| `src/minigames/hop/components/HopScene.tsx` | 純 SVG 世界（天空、地形、樣本、塵捲風、貓、氣閘艙） |
| `src/minigames/hop/game/physics.ts` | 常數、地形、`stepWorld`、拾取／碰撞／完成判定 |
| `src/minigames/hop/game/types.ts` | `HopWorld`、`HopEvent` 等型別 |
| `src/minigames/hop/game/i18n.ts` | 小遊戲內 EN／zh-TW 文案 |
| `src/minigames/hop/styles.css` | 全部 `.hop-*` 前綴，不動共用樣式 |
| `src/game/types.ts`、`src/game/reducer.ts`、`src/game/balance.ts` | `hopRewarded`、`COMPLETE_HOP`、獎勵常數 |
| `src/App.tsx`、`src/ui/BriefingScreen.tsx`、`src/ui/SolNav.tsx`、`src/i18n/index.ts`、`src/styles.css` | 入口按鈕與兩條入口文案 |

## 7. 手動 QA

1. 新遊戲 → 跳過開場 → Sol 1 簡報出現〔🦘 試試低重力跳躍〕；切到 Sol 2 簡報沒有。
2. Sol 列的〔🦘 低重力跳躍〕在任何 sol 都能開；短螢幕（568×320）只顯示 emoji，`aria-label`／`title` 仍在。
3. Intro 的 Start 進入遊戲，HUD 顯示 `0/3`；用鍵盤右移＋跳，確認樣本 toast、HUD 更新、碰到塵捲風被推開且次數 +1。
4. 走到氣閘艙出現結果畫面；**第一次 3/3** 領到科學 +1；同一任務再玩一次顯示「已領取」，數值不變；只拿 2/3 不給獎勵。
5. 在任務報告（`result` 階段）領獎時，報告曲線最後一點與最終科學值一致。
6. 關閉（✕ 或 Escape）回到原本畫面，任務進度與其他資源不變。
7. `?video=s1` 沒有任何 hop 入口；影片 fixture 畫面不變。
8. 568×320 與 1280×800：無 console error、無水平滾動條；觸控按鈕可用、不壓到面板；`prefers-reduced-motion` 下動畫關閉但可玩。
9. 單元測試：`npm test`（`physics.test.ts`、`i18n.test.ts`、`LowGravityHop.test.tsx`、`hopReward.test.ts`、`BriefingScreen.test.tsx`）。

## 8. 已知取捨

- **+1 science 會略微影響星等與 SC2 條件**：這是刻意選的小獎勵，限制「每次任務一次、只能 3/3」，影響有界；不寫進固定 7 sol 平衡表，也不改 `docs/balance-sheet.csv`。
- **遊戲化物理**：不追求實時模擬；不要為了「更真實」把跳躍調到小孩玩不動。
- **不使用照片**：樣本與場景全是手繪 SVG，不引用 NASA 影像，也不涉及圖片 credit。
