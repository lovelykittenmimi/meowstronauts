# 事件卡 Schema 與牌庫設計

> 最後更新：2026-11-14
> **賽前設計稿，不含最終文案。** 卡名是工作標題；給兒童看的中英文句子等 11/14 開工後再寫。
> 平衡數值在 [`balance-sheet.csv`](balance-sheet.csv)，24 張設計庫 × 3 個選項共 72 列；**MVP 先做 12 張（§3.2）**，其餘 12 張保留為 11/15 擴充。
> `H1 健康檢查` 是 11/15 候選（替換 `P3`，設計庫維持 24 張），只有時間允許才做；見 §3.4。

---

## 1. 範圍

- 設計庫 24 張；**MVP 先實作 12 張（§3.2）**，一局抽 7 張；第 4 sol 固定 `S1` 太陽閃焰警報。
- Sol 1 是 scripted 教學卡（2 個選項），不從牌庫抽，也不計入 12／24 張。
- 每張卡 3 個選項；每個選項至少一個負向 delta；同一張卡內不得有選項在所有資源上都優於另一個。
- 卡片只影響資源與狀態，不直接判定勝負；健康歸零才失敗。

## 2. 型別（給 11/14 實作用）

```ts
export type ResourceKey =
  | 'power'        // 電力
  | 'lifeSupport'  // 生命維持
  | 'shield'       // 輻射遮蔽
  | 'food'         // 食物（罐頭數）
  | 'health'       // 健康
  | 'science';     // 科學（星等用）

export type CardCategory =
  | 'power' | 'lifeSupport' | 'shield'
  | 'food' | 'comms' | 'science' | 'morale';

export type CatId = 'silver' | 'shadow' | 'ginger';
export type AssistId = CatId;

export interface LocalizedText {
  zh: string;
  en: string;
}

/** 每個 key 的數字是「每個 sol」的變化；沒有列的 key 視為 0。 */
export type Effects = Partial<Record<ResourceKey, number>>;

export interface RiskOutcome {
  chance: number;          // 0–1
  effects: Effects;        // 失敗時「取代」base effects，不是疊加
  outcome: LocalizedText;  // 失敗時顯示的結果句
}

export interface Choice {
  id: string;
  label: LocalizedText;
  effects: Effects;
  duration?: number;       // 默認 1；>1 表示效果持續幾個 sol
  risk?: RiskOutcome;
  requires?: AssistId;     // 使用該貓的專長，消耗 1 次
  clearStatus?: boolean;   // 搭配 requires：清除一個故障狀態
  outcome: LocalizedText;
  knowledgeCard?: string;  // 這個選擇額外解鎖的知識卡
  tags?: string[];
}

export interface EventCard {
  id: string;
  category: CardCategory;
  cat: CatId;              // 卡片主視覺／發言者
  title: LocalizedText;
  brief: LocalizedText;    // 可用 {{termId}} 標記術語
  choices: [Choice, Choice, Choice];
  terms?: string[];        // 最多 2 個，必須存在於 glossary
  source?: {
    name: string;
    url: string;
    snapshot?: string;     // src/data/... 的快照檔
    date?: string;         // 真實觀測日，例如 2025-05-14
  };
  art?: string;
  minSol?: number;
  maxSol?: number;
  tags?: string[];
}
```

### 2.1 風險與持續時間的語意

- `risk.chance = 0.2`：20% 失敗；失敗時用 `risk.effects` **取代** `effects`，不是相加。
- `duration = 2`：`effects` 連續套用 2 個 sol；UI 顯示「還剩 N sol」的狀態圖示。
- 同一個狀態不疊加；再次抽到同一張卡時，重置持續時間而不是乘二。
- 所有資源在結算後 clamp：電力／生命維持／遮蔽 0–100、食物 0–12、健康 0–100、科學 ≥0。
- 科學不會被扣到負數；需要「少做科學」的選項，用 0 或「沒有科學獎勵」表達，不要寫負數。

### 2.2 貓咪專長（Assist）

| 貓 | 效果 | 次數 | 實作 |
|---|---|---:|---|
| 銀白 | 立即獲得 1 張知識卡＋提示最危險的系統 | 2 | 不消耗資源；`requires: 'silver'` |
| 暗影 | +12 電力，或消除一個故障狀態 | 2 | `effects: { power: 12 }` 或 `clearStatus: true` |
| 金桔 | +1 食物，或 +10 生命維持 | 2 | 二選一，由玩家按鈕決定 |

使用時機：選完行動、結算之前。用完就不能再用；UI 要顯示剩餘次數。

## 3. 牌庫（24 張設計庫；MVP 12 張）

> 工作標題只為識別，不是最終文案。`術語` 全部對應 [`glossary.md`](glossary.md) 的 id。所有 20 個術語的出場時機見 `glossary.md` §3.5；事件卡只放與選擇直接相關的 1–2 個詞，其餘用每日簡報或「為什麼？」面板出場。首次出場在事件卡的 8 個術語（MVP 12 張），簡報句列於牌庫表下方；`dustDevil` 移到 Sol 2 每日簡報，因為 MVP 不含 P3 沙塵季。

| ID | 類別 | 貓 | 工作標題 | 術語 | 資料來源 |
|---|---|---|---|---|---|
| P1 | power | 暗影 | 太陽能板積塵 | `dustStorm`, `solarPower` | MSL 天氣快照 |
| P2 | power | 暗影 | 電池故障 | `solarPower`, `gravity` | —（一般工程知識） |
| P3 | power | 暗影 | 沙塵季來臨 | `dustStorm`, `dustDevil` | MSL 天氣快照 |
| P4 | power | 金桔 | 冷週暖氣吃電 | `atmosphere` | MSL 2025 冷週快照 |
| L1 | lifeSupport | 暗影 | 氧氣回收機故障 | `oxygenRecovery` | MOXIE（S9） |
| L2 | lifeSupport | 金桔 | 水循環堵塞 | `waterRecycling` | ISS ECLSS／BPA（S10） |
| L3 | lifeSupport | 銀白 | 二氧化碳超標 | `atmosphere`, `pressure` | Mars Facts（S4, S6） |
| L4 | lifeSupport | 金桔 | 冷凝水過多 | `waterRecycling` | ISS ECLSS（S10） |
| S1 | shield | 銀白 | 太陽閃焰警報（第 4 sol 固定） | `solarFlare`, `radiationShielding` | DONKI 2025-05-14 |
| S2 | shield | 暗影 | 微隕石破損 | `micrometeorite`, `radiationShielding` | NASA Impact Protection（S14） |
| S3 | shield | 銀白 | 避難艙檢查 | `radiation`, `radiationShielding` | Real Martians（S3） |
| F1 | food | 金桔 | 溫室番茄豐收 | `greenhouse` | Growing Plants in Space（S11）＋ PIA25077 照片 |
| F2 | food | 金桔 | 根腐病 | `greenhouse` | Growing Plants in Space（S11） |
| F3 | food | 金桔 | 補給箱延誤 | `commsDelay` | Mars Relay Network（S13） |
| C1 | comms | 暗影 | 地球來電 | `commsDelay` | Mars Relay Network（S13） |
| C2 | comms | 暗影 | 天線偏移 | `commsDelay` | Mars Relay Network（S13） |
| C3 | comms | 暗影 | 資料回傳窗口 | `commsDelay`, `solarPower` | Mars Relay Network（S13） |
| SC1 | science | 銀白 | 岩石樣本 | `radiation` | NASA Image Library 照片 |
| SC2 | science | 銀白 | 地下冰探測 | `subsurfaceIce` | Odyssey（S7） |
| SC3 | science | 銀白 | 火星地震 | —（候選新詞 marsquake） | —（一般科學知識） |
| M1 | morale | 金桔 | 貓咪吵架 | — | — |
| M2 | morale | 金桔 | 生日 | — | — |
| M3 | morale | 金桔 | 沙塵暴 | `dustStorm`, `solarPower` | Mars Facts（S4） |
| M4 | morale | 金桔 | 補給船提前 | `commsDelay` | Mars Relay Network（S13） |

> `P3` 不在 MVP；若 11/15 做 `H1 健康檢查`，以 H1 替換 P3，設計庫維持 24 張（見 §3.4）。不要增加第 25 張。

**首次出場在事件卡的 8 個術語（MVP 12 張；簡報句預定）：**

| 術語 | 卡 | 簡報句 |
|---|---|---|
| `radiation` | S3 | 「{{radiation}} 升高，先進避難艙。」 |
| `subsurfaceIce` | SC2 | 「探測車找到 {{subsurfaceIce}}。」 |
| `waterRecycling` | L2 | 「{{waterRecycling}} 堵塞，回收率下降。」 |
| `oxygenRecovery` | L1 | 「{{oxygenRecovery}} 機故障，氧氣不夠了。」 |
| `dustStorm` | P1 | 「{{dustStorm}} 的沙塵蓋住太陽能板。」 |
| `commsDelay` | C1 | 「{{commsDelay}} 14 分鐘；地球的回覆要等。」 |
| `micrometeorite` | S2 | 「{{micrometeorite}} 打穿遮蔽層。」 |
| `pressure` | L3 | 「火星 {{pressure}} 不到地球 1%。」 |

> 其餘 12 個術語在開場或每日簡報首次出場；完整對照見 `docs/glossary.md` §3.5。`dustDevil` 改在 Sol 2 每日簡報出場，避免在晴天冷週硬塞沙塵季。

### 3.1 發牌規則

1. 第 4 sol 固定 `S1`，其他 6 張從 MVP 12 張扣掉 `S1` 的 11 張抽，不重複；11/15 擴充到 24 張後，再從 23 張抽。
2. 6 張中至少各 1 張 `power`、`lifeSupport`、`food`；否則重抽。
3. 同一類別最多 2 張（`S1` 不算在內）。
4. 約束無法滿足時，依序放寬：類別上限 2→3；再放寬「至少 1 張 power／lifeSupport／food」為「候選池有什麼就抽什麼」，不為了湊類別硬塞不符合 `when` 的卡。
5. 每日種子挑戰：用日期當 seed，同一日同一牌序。
6. 候選池先過 §3.3 的 `when` 條件；不符合故事／天氣／資源狀態的卡不得硬塞。

### 3.2 MVP 12 張（先做）

> 選擇原則：先覆蓋 8 個「事件卡首次出場」術語＋S1，再保食物與生存；24 張設計庫保留給 11/15 擴充。
> `P3 沙塵季來臨` 不進 MVP：REMS 快照是晴天冷週，沒有沙塵暴資料；`dustDevil` 改在 Sol 2 每日簡報出場。`P4 冷週暖氣吃電` 進 MVP，且只在 `cold_snap`／`severe_cold` 出，符合真實天氣。

| ID | 類別 | 貓 | 工作標題 | 術語 | 觸發條件（符合才進候選池） |
|---|---|---|---|---|---|
| P1 | power | 暗影 | 太陽能板積塵 | `dustStorm`, `solarPower` | Sol 2–6；`power < 65` 或 `crashDust` flag；`power ≥ 80` 不抽 |
| P4 | power | 金桔 | 冷週暖氣吃電 | `atmosphere` | Sol 2–6；當日 `cold_snap` 或 `severe_cold`；不是冷天不出 |
| L1 | lifeSupport | 暗影 | 氧氣回收機故障 | `oxygenRecovery` | Sol 2–6；`lifeSupport < 65`；`≥ 80` 不抽 |
| L2 | lifeSupport | 金桔 | 水循環堵塞 | `waterRecycling` | Sol 2–6；`lifeSupport < 70`；`≥ 80` 不抽 |
| L3 | lifeSupport | 銀白 | 二氧化碳超標 | `atmosphere`, `pressure` | Sol 3–6；`lifeSupport < 60`；`≥ 75` 不抽 |
| S1 | shield | 銀白 | 太陽閃焰警報 | `solarFlare`, `radiationShielding` | 固定 Sol 4；不受條件影響 |
| S2 | shield | 暗影 | 微隕石破損 | `micrometeorite`, `radiationShielding` | Sol 2–6；`shield < 60`，或 S1 後 Sol 5–6；`≥ 80` 不抽 |
| S3 | shield | 銀白 | 避難艙檢查 | `radiation`, `radiationShielding` | Sol 3–5；已收到 `flareForecast` flag；`shield < 75` |
| F1 | food | 金桔 | 溫室番茄豐收 | `greenhouse` | Sol 3–7；`food ≤ 4`；`food ≥ 5` 不抽 |
| F3 | food | 金桔 | 補給箱延誤 | `commsDelay` | Sol 2–6；`food ≤ 4` 或 `commsWindow` flag；`food ≥ 5` 不抽 |
| C1 | comms | 暗影 | 地球來電 | `commsDelay` | Sol 3–5；`commsWindow` 於 Sol 3 每日簡報開啟；不因資源滿而硬出 |
| SC2 | science | 銀白 | 地下冰探測 | `subsurfaceIce` | Sol 2–6；`science < 4`；`science` 高不抽 |

**F1 故事鉤子（設計筆記，非最終文案；11/14 才寫定稿）：** 金桔看到第一朵番茄花，提到 NASA 在火星找到過一朵「花」，結果是石頭（PIA25077，2022-02-24，水礦物膠結的岩石，不是植物）。銀白：「你的番茄會是真的花。」金桔：「那我要種大一點。」只放在遊戲內 F1，**不進 30 秒影片**。照片已加入 `src/data/mars-photos/PIA25077.jpg`（1280×956，credit NASA/JPL-Caltech/MSSS），卡面建議當小圖（inset），主圖仍是溫室／番茄，caption 要寫「岩石，不是植物」。表格資料來源的「＋ PIA25077 照片」只表示**圖片來源與 credit**；`EventCard.source` 仍只放 S11，圖片走 photo metadata，不要因為這張照片寫「火星有花」。

**F3 的操作橋段（2026-11-15）：** 選「配給」`ration` 或「吃庫存」`stores` 都先開太空食物翻卡（見 `docs/space-food-flip.md` §1），按 Back／✕ 直接結算；「派探測車」`rover` 不開遊戲。小遊戲不給額外資源；F3 三個選項自己的 `effects` 就是唯一獎勵，不改卡上的 `effects`，也不寫進固定 7 sol 平衡表。

**健康知識點（2026-11-14）：** 不新增事件卡，也不新增資源。Sol 1 每日簡報、開場幕 3、任務報告各加一句身體適應台詞；健康事實併入 `gravity` 知識卡（見 `glossary.md` #16）。**7 個 sol 內不演骨質快速流失**——骨質與肌肉流失是旅程數月的結果，不是這 7 天的結果。若 11/15 要加 `H1 健康檢查` 卡，放設計庫、不進 MVP，數值要先進 `balance-sheet.csv` 重跑。

**這 12 張的分類：** power 2、lifeSupport 3、shield 3、food 2、comms 1、science 1；沒有 morale 卡。`SC1 岩石樣本` 是第 13 張擴充；若三星太難，11/15 優先加 SC1，或把三星科學門檻 8→6。

**S1 的固定狀態：** Sol 4 一定出 S1；其他卡不得提前用掉 S1 的台詞或結果。

### 3.3 條件式觸發（MVP 實作規則）

- 每張卡在資料裡有 `when` 字串；程式用 `src/game/conditions.ts` 的 predicate 對應，不把規則散在 UI。
- 抽卡前先過濾：`sol` 範圍、`weather` tag、資源門檻、story flags；不符合的卡不進候選池。
- 若候選不足 6 張：先放寬資源門檻 10 點；仍不足，寧可重複一張已符合天氣／故事 flag 的卡，也不要塞不符合的卡。
- 天氣以 `mars-weather.snapshot.json` 的 `gameplayTags` 為準：`cold_snap`／`severe_cold`／`warm_day`／`pressure_drop`。不要自己發明風速；這份 feed 的 `windSpeedMs` 是 `null`。
- 故事 flags：`crashDust`（開場迫降，Sol 2–3 有效）、`flareForecast`（Sol 3 每日簡報）、`commsWindow`（Sol 3 每日簡報開啟，C1 可用）、`s1Resolved`（S1 結算後）。
- 資源門檻是「避免無事硬塞」：`lifeSupport` 高時不出 L1／L2／L3；`shield` 高時不出 S2；`food` 高時不出 F1／F3。這不是絕對禁止，而是 MVP 的預設；11/14 用真實牌庫跑一次，若某卡永遠不出，再調門檻。
- 24 張擴充的 `when` 在 11/15 補；MVP 只實作上表 12 張。

### 3.4 11/15 候選：H1 健康檢查（替換 P3；不進 MVP）

> 2026-11-14 新增。**只有 11/15 中午前核心循環、12 張 MVP、影片都完成才做。**
> 目的：把「太空旅行後身體變弱」變成一個取捨，而不是新增小遊戲。
> 以 H1 替換 `P3 沙塵季來臨`（P3 因 REMS 快照沒有沙塵暴資料，本來就不進 MVP），設計庫維持 24 張；不要增加第 25 張。

| 項目 | 內容 |
|---|---|
| ID／類別／貓 | `H1`／`lifeSupport`／銀白 |
| 工作標題 | 健康檢查 |
| 觸發 | Sol 2–3；`crashDust` flag；`health < 95`；只出一次 |
| 術語 | `gravity`（Sol 1 已出場，這裡只複習；不新增術語） |
| 簡報 | 「迫降後第二天，金桔走路搖搖晃晃，暗影的臉腫腫的。銀白拿出體檢表：『在太空待了好幾個月，身體還沒恢復。』」 |

| 選項 | effects | 備註 |
|---|---|---|
| A 全員休息半天 | health +8, power −6 | 最安全，但吃電 |
| B 20 分鐘運動 | health +4, food −1, power −2 | 中間路線；呼應 NASA 每天運動約 2 小時 |
| C 照常出任務 | science +2, health −5 | 科學優先，健康付代價 |

- 數值是草案；實作前要進 `balance-sheet.csv` 重跑，不得跳過平衡檢查。每個選項至少一個負向 delta，A／B／C 不得 Pareto 支配。
- `health < 95` 才出，避免健康全滿時 A 的 +8 溢出；**不要為了這張卡改 MVP 初始健康 100**。若 11/15 真的把初始健康調成 80（§5.5 旋鈕），再一起重跑。
- 卡面不需要新圖；用銀白頭像＋現有控制室／醫療素材。
- 文案紅線：不演骨折、流血、輻射病；不說「回地球連站都站不起來」；只寫「身體還在適應、動作要慢」。

## 4. 一 sol 的結算順序

```
1. 套用每日消耗：power −8、lifeSupport −6、shield −5、food −1
2. 檢查歸零：power 0 → health −20；lifeSupport 0 → −25；
   shield 0 → −15；food 0 → −10（可同時多項）
3. 顯示事件卡，玩家選 1 個選項
4. 可選：使用貓咪專長（結算前）
5. 擲風險（若有）；成功用 effects，失敗用 risk.effects
6. 套用 effects × duration
7. Clamp 所有資源
8. health ≤ 0 → 任務暫停；否則進入下一個 sol
```

> 順序會影響難度。把「歸零懲罰」放在選項之前，玩家就必須先承受昨天留下的後果；這是刻意的，讓「先修哪個系統」有意義。

## 5. 平衡試算表

檔案：[`balance-sheet.csv`](balance-sheet.csv)

### 5.1 欄位

| 欄位 | 說明 |
|---|---|
| `card_id`, `card_title_zh`, `category`, `cat` | 卡片識別 |
| `choice` | A／B／C |
| `label_zh` | 工作標題（非最終文案） |
| `power`, `life_support`, `shield`, `food`, `health`, `science` | 成功時的每 sol 變化 |
| `duration` | 持續 sol 數，默認 1 |
| `risk` | 失敗機率 0–1 |
| `fail_*` | 失敗時的每 sol 變化（取代成功值） |
| `requires` | 需要的貓咪專長，例如 `shadow` |

### 5.2 加權分數

用來快速比較選項，不是最終判定：

| 資源 | 權重 | 理由 |
|---|---:|---|
| power | 1.0 | 主要貨幣，但可回復 |
| lifeSupport | 1.0 | 歸零懲罰重 |
| shield | 1.0 | 防禦性，容易溢出 |
| food | 2.5 | 最稀缺，起點只有 6 |
| health | 1.5 | 失敗條件 |
| science | 0.5 | 不影響生存，只影響星等 |

期望值：`EV = (1 − risk) × effects × duration + risk × fail_effects × duration`。

### 5.3 已檢查的規則（2026-11-11）

- 24 張卡、每張 3 個選項：✅
- 每個選項至少一個負向 delta（使用專長的選項除外）：✅
- 同一張卡內沒有 Pareto 支配（沒有任何選項在所有資源上都 ≥ 另一個）：✅
- 加權分數最大差距：`L1` 20 分（因為其中一個選項消耗暗影專長，屬刻意設計）；其餘 ≤ 14.5 分。

### 5.4 模擬結果（預設值）

假設：7 sol、`S1` 固定第 4 sol、發牌約束開啟、**不使用貓咪專長**、沒有緊急補給、初始 70/70/60/6/100、每日消耗 8/6/5/1、歸零懲罰 20/25/15/10、每種策略 8,000 局。

| 策略 | 失敗率 | ★ | ★★ | ★★★ | 平均科學 |
|---|---:|---:|---:|---:|---:|
| 永遠選 A | 0% | 94% | 5% | 0% | 3.3 |
| 隨機選 | 0% | 88% | 12% | 0% | 2.5 |
| 保守（最大化最低資源比例） | 1% | 79% | 19% | 1% | 2.9 |
| 科學優先（安全前提下最大化科學） | 1% | 68% | 26% | 5% | 5.3 |

**兩個發現：**

1. **生存太容易，三星太難。** 初始健康 100、七個 sol 的歸零懲罰不足以造成失敗；但科學供給太薄，連「科學優先」平均只有 5.3，達不到三星的 8。
2. **食物最緊，電力最吃策略。** 食物起點 6、每天 −1，沒有食物卡就會歸零；電力則是「維修要花、太陽能卡才補得回來」的貨幣。

> 這張表是 24 張設計庫的模擬（每種策略 8,000 局），不是 MVP 12 張的最終數字。11/14 用真實 12 張與貓咪專長重跑後再調整；submission 不引用 8,000 這個數字，除非重跑後仍成立。

### 5.5 難度旋鈕（11/14 再決定）

| 旋鈕 | 影響 | 備註 |
|---|---|---|
| 初始健康 100→80 | 失敗率明顯上升 | 對兒童最直觀，但會改變 UI 愛心數 |
| 每日消耗 8/6/5→10/8/6 | 全面變緊 | 電力會變成主要瓶頸 |
| 歸零懲罰 20/25/15/10→30/35/25/20 | 失誤更痛 | 容易讓兒童挫折，慎用 |
| 三星科學 8→6 | 三星率上升 | 不改生存曲線，只改追求目標 |
| 科學卡 +1（SC1/SC2/C3） | 三星率上升 | 比放寬門檻更有內容感 |

**建議：** 這是給 7–12 歲的 10 分鐘遊戲，**先保住「大家都玩得完」**，把挑戰放在三星與知識卡收集；不要為了 55–65% 勝率把歸零懲罰調到兒童會哭的程度。若評審需要「有難度」，再做一個「困難」模式，而不是把預設變難。

## 6. 三個已寫好的例子

### S1 太陽閃焰警報（shield／銀白／第 4 sol 固定）

| 選項 | effects | duration | risk | 備註 |
|---|---|---|---:|---|
| 加厚遮蔽 | power −20, shield +25 | 1 | — | 用電力換遮蔽 |
| 全員進避難艙 | food −1, health +5 | 1 | — | 不花電力，但少吃一餐 |
| 硬撐繼續發電 | power +18, shield −14, health −6 | 1 | — | 發電優先，代價是健康 |

> **S1 的「為什麼？」面板（11/15 有空再加）：** 「閃焰的光 8 分鐘就到；CME 的帶電粒子要一到三天。遮蔽買的是時間。」用 `solarFlare`／`cme` 既有卡，不新增術語。

> **互動（2026-11-15）：** 第 1 個選項「替防護外牆加厚」與第 2 個選項「全員進避難艙」會先進入「避難艙演練」；完成後才套用原本的 effects，回到事件結果。第 3 個選項直接結算。影片模式（`?video=s1`）維持直接結算，避免錄影被互動卡住。

### P2 電池故障（power／暗影）

| 選項 | effects | duration | risk | fail effects |
|---|---|---|---:|---|
| 立即更換 | power +6, shield −4 | 1 | — | — |
| 降載運轉 | power +4, lifeSupport −4 | 1 | — | — |
| 冒險重啟 | power +16, health −5 | 1 | 35% | power −12, health −5 |

### L1 氧氣回收機故障（lifeSupport／暗影）

| 選項 | effects | duration | requires |
|---|---|---|---|
| 立即維修 | power −15, lifeSupport +18 | 1 | — |
| 旁通運轉 | power +5, lifeSupport −10 | 1 | — |
| 請暗影處理 | lifeSupport +15 | 1 | `shadow`（消耗 1 次） |

## 7. 待辦（11/14 開工後）

- [ ] 先寫 MVP 12 張（§3.2）成 `src/data/events.json`（或 TS 檔），文案中英文各一版；24 張設計庫留 11/15 擴充。
- [ ] 實作 reducer：消耗 → 歸零 → 選項 → 專長 → 風險 → clamp。
- [ ] 用真實牌庫＋貓咪專長跑 10,000 局，調整 §5.5 的旋鈕。
- [ ] 讓 1 位兒童測「哪個選項看起來最安全」，確認圖示與文字沒有誤導。
- [ ] 把 `balance-sheet.csv` 的數值同步進程式，避免文件與實作兩套。
- [ ] 11/15 若有空：做 `H1 健康檢查`（替換 P3，§3.4）與 S1「為什麼？」時間差句；先跑 `balance-sheet.csv`，不影響 MVP。
