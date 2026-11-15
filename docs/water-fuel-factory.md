# 水與燃料工廠小遊戲（Water & fuel factory）

> 最後更新：2026-11-15
> 程式：`src/minigames/factory/`；資料來源：`docs/data-sources.md` §3.7；手動 QA：`docs/qa-checklist.md` §3
> 定位：任何 sol 都能開的延伸練習。**不是主線**，不玩也能完成 7 sol；不改事件牌庫與平衡表。

## 1. 入口

| 入口 | 出現時機 | `data-testid` | 文案（EN／zh-TW） |
|---|---|---|---|
| 每日簡報 | **每個 sol** 的簡報，術語 chip 下方（Sol 1 與跳躍並列、Sol 7 與食物並列） | `factory-practice` | `Try the water & fuel factory`／`試試水與燃料工廠` |
| Sol 切換列 | **不顯示** | — | — |
| `?video=` 錄影模式 | **不顯示**（`onFactoryPractice` 不傳） | — | — |

- 只有簡報入口，沒有第 5 個 SolNav 按鈕：Sol 列已有 7 個 sol＋著陸／跳躍／食物／避難四個練習鈕，568×320 再加一個會換行；簡報是每次開新 sol 的固定入口，先不動共用 nav。
- 開啟同一個全螢幕 `WaterFuelFactory`（`role="dialog"`、`aria-modal`、Escape 關閉）。關閉後回到原本畫面；除了 §4 的一次性獎勵，不動任何任務狀態。

## 2. 玩法

`intro → playing（4 站）→ result`，**沒有計時、沒有失敗、沒有扣分**。點錯只顯示提示、不前進，可以一直重試。

| # | 站名 | 玩家動作 | 通關條件 | NASA 事實 |
|---|---|---|---|---|
| 1 | 冰礦場 Ice mine | 3 個雷達點選有冰的 → 選「密封烤箱／開放托盤」→ 按加熱 | 找到冰（藍色訊號）、選密封烤箱、加熱完成 | 鳳凰號找到水冰；火星氣壓不到地球 1%；鳳凰號找到過氯酸鹽，工廠用濾網濾掉 |
| 2 | 電解水 Electrolysis | 按通電 → 把 O₂ 送到船員空氣、H₂ 送到燃料槽 | 兩種氣體都送對 | ISS 用電流分解水製造氧氣；氫氣留給下一步 |
| 3 | CO₂ 捕集器 CO₂ scrubber | 在 6 個氣泡中點 4 個 CO₂（另有 N₂、Ar 干擾）→ 按加熱濾材 | 4 個 CO₂ 都抓到、加熱釋放 | 火星空氣約 95% CO₂；ISS 用可重複使用的沸石床抓 CO₂，再加熱釋放 |
| 4 | 薩巴提爾反應器 Sabatier reactor | 按反應 → 收集 CH₄ 到燃料槽、H₂O 回水槽 | 兩種產物都收集 | ISS 把 CO₂＋H₂ 變成甲烷和水；ISS 把甲烷排掉，這座工廠存成燃料 |

各站互動細節：

- **站 1**：雷達圖三個點，只有 B 點亮藍色訊號（CSS 脈衝，顏色不是唯一資訊，按鈕有 `Radar spot A/B/C` 的 `aria-label`）。點錯顯示「這裡沒有冰，找藍色訊號」。找到後出現兩個烤箱選項；選開放托盤顯示「火星空氣太稀薄，水會跑掉」，可重選；選密封烤箱後按「加熱土壤」完成。水槽與鹽分濾網是靜態流程圖，不新增資源。
- **站 2**：按「啟動電解器」後出現 O₂／H₂ 兩個氣泡；先點氣體、再點目的地（船員空氣／燃料槽）。送錯顯示提示，氣體回到原位（清除選取）。兩個都送對才前進。
- **站 3**：6 個標示氣泡（4 個 CO₂、1 個 N₂、1 個 Ar）；點 CO₂ 會吸進濾材，點錯只搖一下、不計入。4 個都抓到後才出現「加熱濾材」。畫面註明「空氣樣本，不是按比例」。
- **站 4**：按「啟動反應器」後出現 CH₄／H₂O；點 CH₄ → 燃料槽、點 H₂O → 水槽。兩個都收好即完成，約 700 ms 後進入結果。
- **無障礙**：全部是 `<button>`；`aria-live="polite"` 公告站別、成功與提示；`aria-current="step"` 標目前站；Escape 關閉；`prefers-reduced-motion` 關動畫；顏色不是唯一資訊（氣泡有文字標籤）。
- **短螢幕**：568×320 的進度條只顯示 icon＋目前站名，事實卡收成一行，提示文字顯示在 toast；站內可捲動，結果面板可捲動。

## 3. 四張事實卡

1. **Ice mine**
   - EN: `NASA's Phoenix lander found water ice just below the surface. Mars air is very thin — less than 1% of Earth's pressure — so the oven is sealed.`
   - zh-TW: `NASA 的鳳凰號著陸器在火星表面下找到水冰。火星空氣非常稀薄，氣壓不到地球的 1%，所以烤箱要密封。`
   - EN: `Phoenix also found a salt called perchlorate in the soil. The factory filters it out before the water goes to the crew.`
   - zh-TW: `鳳凰號也在土壤裡找到一種叫過氯酸鹽的鹽。工廠先把鹽濾掉，水才會送到船員那裡。`
2. **Electrolysis**
   - EN: `The ISS makes breathing oxygen by running electricity through water. The oxygen goes to the crew; the hydrogen is kept for the next step.`
   - zh-TW: `太空站用電流分解水，製造呼吸用的氧氣。氧氣給船員，氫氣留給下一步。`
3. **CO₂ scrubber**
   - EN: `Mars air is about 95% carbon dioxide. The ISS uses reusable zeolite beds to catch CO₂, then heats them to release it.`
   - zh-TW: `火星空氣大約 95% 是二氧化碳。太空站用可重複使用的沸石床抓住二氧化碳，再加熱把它放出來。`
4. **Sabatier reactor**
   - EN: `The ISS Sabatier reactor combines CO₂ with hydrogen to make methane and water. The ISS vents the methane; this factory saves it as fuel.`
   - zh-TW: `太空站的薩巴提爾反應器把二氧化碳和氫氣結合成甲烷和水。太空站把甲烷排掉；這座工廠把它存成燃料。`

結果畫面另加：

- **Why it matters**：`NASA's SWIM map shows where subsurface water ice is buried. Future crews could use that ice for drinking water and rocket fuel.`／`NASA 的 SWIM 地圖顯示地下冰埋在哪裡。未來的船員可以用這些冰取得飲用水和火箭燃料。`
- **Another way**：`NASA's MOXIE also made oxygen from Mars air on Perseverance.`／`NASA 的 MOXIE 也在毅力號上從火星空氣製造氧氣。`

## 4. 獎勵

- 條件：4/4 完成、本次任務尚未領過、非 `?video=`、階段是 `briefing`／`choice`／`result` → `lifeSupport +5`（`FACTORY_REWARD_LIFE_SUPPORT = 5`，上限 100）。
- **顯示實際增加量**：`gain = min(100, lifeSupport + 5) - lifeSupport`，例如 98 → 100 顯示「+2」，不寫 +5。
- 每次任務只給一次：`GameState.factoryRewarded` 標記；`START_GAME`／`RESTART` 由 `createInitialState` 重置。
- 3/4 或中途離開：可以離開，只是不給獎勵。
- 已領過再玩：完成畫面顯示「這次任務的工廠獎勵已領取」，不再加。
- 生命維持已滿 100：**不發獎勵、也不標記**；完成畫面顯示「生命維持已經滿了」，結果不會假裝 +5。之後某個 sol 消耗生命維持、有空間時再完成，仍可領取。
- 在 `result` 階段領獎時，同步把 `resourceHistory` 最後一點的 lifeSupport 對齊，讓任務報告的曲線與最終數值一致。
- 相關程式：`GameAction` 的 `{ type: 'COMPLETE_FACTORY'; stations }`、`handleCompleteFactory`（`src/game/reducer.ts`）、`FACTORY_STATION_TOTAL`／`FACTORY_REWARD_LIFE_SUPPORT`／`LIFE_SUPPORT_CAP`（`src/game/balance.ts`）。

## 5. 文案與事實

- 可寫：火星表面氣壓 6.36 mb（約地球 1014 mb 的 0.6%）、大氣 CO₂ 95.32%；鳳凰號確認表面下有水冰、土壤中有過氯酸鹽；ISS 電解水製造氧氣；ISS CDRA 用可再生沸石床抓 CO₂ 再加熱釋放；ISS 薩巴提爾用 CO₂＋H₂ 製造水與甲烷並把甲烷排掉；SWIM 地圖標出地下冰；MOXIE 從火星大氣製造氧氣。
- 遊戲文案只留兩個數字：氣壓「不到地球 1%」與 CO₂「約 95%」；完整數字記在 `docs/data-sources.md` §3.7。
- 不可寫：「NASA 已經在火星採水／蓋工廠」「NASA 用甲烷當 ISS 燃料」「過氯酸鹽有毒／濃度多少」「Starship／SpaceX 時程」「strong geomagnetic storm」；也不寫 530 加侖、12 g/hr、122 g 等計畫數字。
- 工廠的密封烤箱、鹽分濾網、燃料槽是**簡化工程模型／遊戲設定**；結果畫面用「this factory」區分，不寫成 NASA 的做法。
- MOXIE 是 CO₂ → O₂ 的另一條路，不是水電解；只放在結果 bonus，不混進站 2。
- 不新增知識卡；背包維持 20 張，這些詞只出現在小遊戲與 `docs/data-sources.md` §3.7。

## 6. 檔案

| 檔案 | 內容 |
|---|---|
| `src/minigames/factory/WaterFuelFactory.tsx` | 狀態機、4 站 UI、進度、提示、aria-live、Escape |
| `src/minigames/factory/game/state.ts` | 4 站資料、事實卡、雷達點／氣泡、`createFactoryGame`／`applyFactoryAction`／`isFactoryComplete` |
| `src/minigames/factory/game/i18n.ts` | 小遊戲內 EN／zh-TW 文案與 `factoryT()` |
| `src/minigames/factory/styles.css` | 全部 `.factory-*` 前綴，不動共用樣式 |
| `src/game/types.ts`、`src/game/reducer.ts`、`src/game/balance.ts` | `factoryRewarded`、`COMPLETE_FACTORY`、獎勵與上限常數 |
| `src/App.tsx`、`src/ui/BriefingScreen.tsx`、`src/i18n/index.ts`、`src/styles.css` | 簡報入口按鈕與入口文案 |
| `src/minigames/factory/game/state.test.ts`、`i18n.test.ts`、`src/minigames/factory/WaterFuelFactory.test.tsx`、`src/game/factoryReward.test.ts` | 單元、文案與元件測試 |

## 7. 手動 QA

1. 新遊戲 → 跳過開場 → Sol 1 簡報出現〔🏭 試試水與燃料工廠〕；推進到 Sol 4、Sol 7 簡報仍在。
2. Sol 切換列**沒有**工廠按鈕；短螢幕 568×320 的簡報不因新增按鈕而水平溢出。
3. Intro 的 Start 進入站 1；點 A／C 顯示乾土提示、不前進；點 B 找到冰；選開放托盤顯示稀薄大氣提示；改選密封烤箱＋加熱，進入站 2。
4. 站 2 送錯氣體不前進；O₂ → 船員空氣、H₂ → 燃料槽後進入站 3。
5. 站 3 點 N₂／Ar 不計入；4 個 CO₂＋加熱濾材後進入站 4。
6. 站 4 只收一種不完成；CH₄ → 燃料槽、H₂O → 水槽後約 700 ms 出現結果；第一次領到生命維持 +5；同一任務再玩顯示「已領取」，數值不變。
7. 生命維持 98 時完成顯示「+2」；生命維持 100 時顯示「已滿」、不發也不標記，之後有空間再完成仍可領取。
8. 在任務報告（`result` 階段）領獎時，報告曲線最後一點與最終生命維持一致。
9. 關閉（✕ 或 Escape）回到原本畫面，任務進度與其他資源不變。
10. `?video=s1` 與 `?video=report` 沒有任何 factory 入口；影片 fixture 的 HUD 數字不變。
11. 568×320 與 1280×800：4 站都能按、無水平滾動、結果可捲動、無 console error；`prefers-reduced-motion` 下動畫關閉但可玩。
12. 單元測試：`npx vitest run src/minigames/factory src/game/factoryReward.test.ts src/ui/BriefingScreen.test.tsx`。

## 8. 已知取捨

- **+5 生命維持會略微影響生存曲線**：這是刻意選的小獎勵，限制「每次任務一次、只能 4/4、上限 100」，不寫進固定 7 sol 平衡表，也不改 `docs/balance-sheet.csv`。滿 100 時不發、不標記，避免完成畫面與 HUD 對不上。
- **沒有 SolNav 入口**：Sol 列在 568×320 已經很滿；簡報是每次開新 sol 的固定入口，先不動共用 nav。若之後要加入 Sol 列，需要先處理換行與 `aria-label`。
- **遊戲是簡化模型**：沒有真正的質量平衡、能量計算、過氯酸鹽濃度或甲烷儲存工程；四個站是教學節點，不是 NASA 已飛的系統。
- **結果畫面較長**：4 張事實＋2 張補充＋7 個來源，1280×800 可捲動；568×320 需要捲動才能看完全部來源。這是把可回指來源留在畫面的代價。
- **不使用照片**：全部是 CSS、emoji、文字；不新增圖檔、不涉及圖片 credit。
