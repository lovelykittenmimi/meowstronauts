# 影片路徑契約（30 秒 demo）

> 最後更新：2026-11-12
> 對應 PLAN 12.3、`docs/video-script.md` §1 與 §7。
> **這是 11/14 build 必須實作的介面契約，不是今天的程式。** 目的：讓 30 秒影片的 8 個鏡頭可以用固定 URL＋固定 `data-testid` 重錄，不靠剪接假造 HUD 數字。
> 11/14 21:00 build freeze 後，這份文件與 `docs/video-script.md` §7.3 一起當交接依據。

---

## 1. 三個固定入口

| URL | 用途 | 對應鏡頭 |
|---|---|---|
| `/?scene=opening2&lang=en` | 直接進開場幕 2（太陽風暴／迫降），18 秒動畫從 0 秒開始 | 1 |
| `/?video=s1&lang=en` | 載入固定存檔：Sol 4、S1 太陽閃焰卡、背包 8/20 | 3–7 |
| `/?video=report&lang=en` | 載入固定存檔的任務報告：7 sol 完成、3 星、背包 9/20 | 8 |

規則：

- `lang=en` 一律優先於瀏覽器語言與 localStorage；英文版是送出語言。
- `?video=*` 只讀取記憶體中的 fixture，**不寫入、不覆蓋**玩家的 localStorage 存檔；離開頁面即消失。
- 一般玩家不會看到這三個參數的痕跡：不顯示「demo mode」橫幅、不顯示除錯面板、不把參數寫進畫面。
- `?reset=1` 清空 localStorage 後回標題；錄影前先用一次，確保沒有舊存檔干擾。
- 既有參數 `?scene=opening2` 已在 `docs/wireframes.md` §10.1 定義；`openingN`（N=1–6）給其餘幕使用，不在 30 秒影片路徑內。

## 2. `?video=s1` 的固定狀態

### 2.1 顯示值（HUD）

| 資源 | 點「加厚遮蔽」前 | 點之後 | 說明 |
|---|---:|---:|---|
| ⚡ power | 62 | **42** | −20，不會 clamp（62 ≥ 20） |
| 💧 lifeSupport | 58 | 58 | 此選項不改 |
| 🛡️ shield | 55 | **80** | +25，不會 clamp（55 ≤ 75） |
| 🥕 food | 5 | 5 | |
| ❤️ health | 82 | 82 | |
| 🔬 science | 3 | 3 | |
| 🎒 backpack | 8 / 20 | **9 / 20** | 收到 `solarFlare` 後 |

- 這些值必須是**真實 reducer 套用 fixture 後的輸出**，不是 UI 寫死的字串。建議做法：`src/data/video-fixtures.json` 存「Sol 1–3 的 cardId＋choiceId 序列＋8 個已收藏 id」，載入時用正式 reducer 重放；重放結果若與上表不同，以 reducer 為準並更新本表與 `docs/video-script.md` §7.3，**不要改 UI 硬湊**。
- fixture 在 Sol 4 事件卡出現、每日消耗已結算之後載入；玩家按選項前不再扣資源。所以點擊後的數字就是上表，可直接錄。
- fixture 重放與 S1 結算都必須用固定 seed，不用 `Math.random()`；同一個 URL 重載 10 次，HUD、卡片、揹包數字都一樣，才可錄影。
- S1 卡由牌庫規則固定在 Sol 4（`docs/event-cards.md` §3），不是 `?video=s1` 特例；`?video=s1` 只跳過前面 3 個 sol。

### 2.2 已收藏的 8 張知識卡

```json
["solarStorm", "solarPower", "greenhouse", "atmosphere",
 "radiationShielding", "sol", "gravity", "solarWind"]
```

- 這 8 個都在 Sol 1–4 之前出場過（開場、Sol 1–3 艦長日誌），故事上合理。
- **不含 `solarFlare`**，所以影片第 5 鏡點開並收藏後，背包才會從 8 變成 9。
- 知識卡面板若對已收藏的詞顯示「已收藏」，`solarFlare` 仍必須顯示「收入背包」可按。

### 2.3 S1 卡與選項

| 元素 | 顯示 | `data-testid` |
|---|---|---|
| 事件卡 | 太陽閃焰警報／Solar Flare Warning，Sol 4 | `event-card-S1` |
| 選項 1 | 加厚遮蔽（⚡ −20／🛡️ +25） | `choice-shield-up` |
| 選項 2 | 全員進避難艙 | `choice-shelter` |
| 選項 3 | 硬撐繼續發電 | `choice-keep-generating` |
| 結果面板 | 套用後出現，列出 `Power −20`、`Shield +25` | `result-panel` |

- 三個選項都要 enabled；影片只點 `choice-shield-up`。
- 點擊後**不自動進下一 sol**；停在結果面板，讓鏡頭 4 拍到 HUD 數字變動。按「繼續」才進 Sol 5。
- HUD 數字用 `data-testid="resource-power"` 等元素；值放 textContent，動畫期間也必須可讀（不要用 canvas 畫數字）。

## 3. 知識卡與背包

| 元素 | 顯示 | `data-testid` |
|---|---|---|
| 卡片上的術語 | `solar flare` 虛線＋書本圖示 | `term-solar-flare` |
| 知識卡面板 | 標題 Solar Flare、NASA 來源 | `knowledge-card` |
| 面板內的卡 | `solarFlare` | `knowledge-card-solar-flare` |
| 收入背包 | 按鈕，點後變成「已收藏」 | `knowledge-collect` |
| 背包按鈕 | HUD 右上，顯示 `8 / 20` | `backpack-button` |
| 背包內的計數 | 收藏後 `9 / 20` | `backpack-count` |

- 點 `term-solar-flare` 開啟面板時，背後的遊戲狀態不重算。
- 收進背包後關閉面板，`backpack-count` 必須立即更新為 9；重新整理後（一般模式）仍為 9，但 `?video=s1` 重載會回到 fixture 的 8。
- 背包只顯示已收藏的 9 張；其餘 11 格顯示未收藏剪影，不劇透。

## 4. 資料面板

| 元素 | 顯示 | `data-testid` |
|---|---|---|
| 開啟按鈕 | HUD 或結果面板的「看資料」 | `data-panel-button` |
| 面板 | 資料來源列表＋兩張圖 | `data-panel` |
| DONKI 折線 | 2025-05-13～17，標出 5/14 X2.7 | `donki-chart` |
| REMS 曲線 | 2025-05-08～22 氣溫，標出冷週 | `rems-chart` |

- 兩張圖都用 `src/data/` 的快照，不連網。
- 面板必須有「snapshot, not live」字樣與 NASA 出處；不可出現 `strong geomagnetic storm`。
- `donki-chart` 的 X2.7 標籤要能在 1920×1080 錄影中讀到（字級 ≥14px）。

## 5. `?video=report` 的固定狀態

| 元素 | 顯示 | `data-testid` |
|---|---|---|
| 任務報告 | 7 sol 完成 | `mission-report` |
| 星等 | ★★★（三顆實心） | `mission-report-stars` |
| 結束資源 | health ≥ 70、science ≥ 8 | `report-resource-health`、`report-resource-science` |
| 緊急補給 | 未使用 | `report-emergency-unused` |
| 背包 | 9 / 20 | `report-backpack-count` |
| 資源曲線 | 7 個點，最後一點與 HUD 一致 | `report-curve` |

- 三星門檻依 PLAN：健康 ≥ 70、科學 ≥ 8、沒有動用緊急補給（`docs/event-cards.md` §5.5 的科學門檻若調整，以 build 為準）。
- 報告的 7 個資源點必須來自同一條 fixture 重放，不能只有最後一格是手寫的；曲線最後一點要等於報告上的數字。
- 貓咪評論依實際結果挑一句，不隨機；錄影當天每次重載都一樣。

## 6. 錄影順序（對應 8 個鏡頭）

| 鏡頭 | 影片時間 | 操作 | 等待／停止 |
|---:|---|---|---|
| 1 | 0.0–4.8s | 開 `/?scene=opening2&lang=en`；從動畫 0 秒錄到約 8 秒（風暴＋飛船進場），剪 2.5–5.5 秒 | 不點術語、不按繼續；錄完另存 |
| 2 | 4.8–7.4s | 三張頭像由剪輯疊上（`brand/avatar-*-512.webp`），不是遊戲畫面 | — |
| 3 | 7.4–11.2s | 開 `/?video=s1&lang=en`；滑到 `choice-shield-up`，停 0.3 秒再點 | 點擊前停 0.3 秒 |
| 4 | 11.2–13.8s | 結果面板出現；鏡頭拍 `resource-power` 與 `resource-shield` 變動 | 不按繼續 |
| 5 | 13.8–16.2s | 點 `term-solar-flare`；面板開；停 0.3 秒後點 `knowledge-collect` | 面板動畫 200ms 內不剪 |
| 6 | 16.2–17.8s | 點 `backpack-button`；拍 `backpack-count` 由 8 變 9 | 停一下讓 9/20 可讀 |
| 7 | 17.8–22.0s | 點 `data-panel-button`；游標停在 `donki-chart` 的 X2.7 | 面板不關也可，後製再切 |
| 8 | 22.0–30.0s | 開 `/?video=report&lang=en`；拍三星與資源曲線，後接標題卡 | 標題卡停 4.1 秒 |

- 鏡頭 1 是靜音素材；旁白與字幕在剪輯時加，不是現場錄。
- 鏡頭 3–7 必須是同一個 `?video=s1` 工作階段，才能讓 8→9 的收藏連續；中途不要重新載入。
- 每次重載 `?video=s1` 都會回到 8/20；要重錄鏡頭 6 之後的段落，必須從鏡頭 3 重跑一次。

## 7. 錄製環境

| 項目 | 規格 |
|---|---|
| 瀏覽器 | Chrome 最新版；`channel: "chrome"` 或手動錄影 |
| 視窗 | 1920×1080，`devicePixelRatio = 1`，縮放 100% |
| 介面 | 英文、無書籤列、無擴充功能圖示、無開發者工具 |
| 游標 | 可見；點擊前停 0.3 秒；移動路徑平滑，不抖動 |
| 音效 | 遊戲音效可關；影片只留旁白與輕音樂 |
| 網路 | 可離線；資料面板只讀快照 |
| Console | 無 error；有 warning 先記下來，不影響錄影才繼續 |

## 8. 交接檢查（11/14 21:00 freeze 前）

- [ ] 三個 URL 都能直接開，且 `lang=en` 生效。
- [ ] `?video=s1` 的 HUD 顯示 62／58／55／5／82／3、背包 8/20；S1 卡在 Sol 4。
- [ ] 點 `choice-shield-up` 後顯示 42／80，結果面板出現，不自動跳下一 sol。
- [ ] `term-solar-flare` 可點，面板可開，`knowledge-collect` 後 `backpack-count` 變 9/20。
- [ ] `data-panel` 可開，`donki-chart` 與 `rems-chart` 都看得到，無 console error。
- [ ] `?video=report` 顯示三星、9/20、7 點曲線；曲線最後一點等於報告上的資源數字，且 9/20 與第 6 鏡一致（不要求 Sol 7 數值等於 `?video=s1` 的 Sol 4 數值）。
- [ ] `?video=s1` 不寫 localStorage；開一般模式不會被 fixture 覆蓋。
- [ ] 上述 `data-testid` 全部存在；`docs/video-script.md` §7.1 的清單已填實際值。
- [ ] 1920×1080 下所有要拍的數字字級 ≥14px、不被裁切。

## 9. 若 11/14 21:00 前做不完

優先順序：

1. **先保住 `?video=s1` 與 `choice-shield-up`**（鏡頭 3–4 是影片核心）。
2. 知識卡與背包用一般點擊路徑錄，不必等 `?video=s1` 的 fixture 完美；只要 8→9 是真的。
3. 資料面板與任務報告若 hook 來不及，改成手動點擊並在 `docs/video-script.md` §7.3 記錄實際數字。
4. **不要**用後製把 HUD 數字改成腳本上的數字；畫面與旁白不一致時，改旁白，不改畫面。
5. 開場動畫不穩就退回 07 靜圖＋位移（`docs/wireframes.md` §10.1 的降級版），不犧牲核心循環。

## 10. 使用者今天需要做什麼

**今天不需要做任何事。** 這份是 11/14 的實作契約。

11/14 晚上只需要確認兩件事：

1. 21:00 前 build 已 freeze，`?video=s1` 與 `?video=report` 在瀏覽器開得起來。
2. 若某個 `data-testid` 不存在，口頭告訴 Claude 是哪一個；不要臨時改遊戲玩法或手動改畫面數字。

錄影、TTS 對時、ffmpeg 組裝由 Claude 在 11/14 22:30 後處理；團隊睡覺，11/15 09:00 審閱 v1。
