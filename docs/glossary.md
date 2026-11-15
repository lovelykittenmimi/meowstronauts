# 太空通識術語與 NASA 來源（20 個）

> 最後更新：2026-11-14
> **這是研究稿，不是遊戲文案。** 術語以一般太空概念為主；火星與地球的差異放在知識卡的 `example`，不寫進術語名稱。
> 對應 PLAN 3.8：MVP 20 張知識卡。
> 2026-11-14：太空健康內容併入 `gravity`（#16），**不新增第 21 張卡**；背包總數維持 20，30 秒影片的 8/20 fixture 不變。日後若要獨立 `spaceAdaptation` 卡，必須在影片錄製後，並同步更新背包總數與測試。

---

## 1. 怎麼用這份文件

- `id` 就是未來 `glossary.json` 的 key，也是事件卡 `{{termId}}` 用的 token。
- **研究註記**只放可查證的事實，不寫比喻、不寫貓咪台詞。
- **命名原則：概念一般化、例子火星化。** 用「大氣層」「重力」「氣壓」，不用「火星大氣」「火星重力」；地球與火星的數字放在 `example`。
- **例外：** `sol`（火星日）與 `subsurfaceIce`（地下冰）保留火星情境，因為它們就是遊戲機制或單位；卡片仍會說明一般概念。
- 每一條都要有 NASA 來源；沒有 NASA 頁面可引的，標「一般科學知識」，不硬掛 NASA 名字。
- 20 個都是 MVP；若 11/14 時間不足，最後 4 個（17–20）可先以純文字出現，卡片之後再補。健康內容已併入 `gravity`，不另立第 21 個術語。
- 三個近義詞（太陽風暴／太陽閃焰／CME）必須分開寫，不能互換。

## 2. 20 個術語

> 類別：`spaceWeather` 太空天氣、`mars` 基地環境、`lifeSupport` 生命維持、`engineering` 工程。

| # | id | 中文 | English | 類別 | 研究註記（事實，非文案） | 來源 |
|---:|---|---|---|---|---|---|
| 1 | `solarStorm` | 太陽風暴 | solar storm | spaceWeather | 太陽活動造成的一連串擾動的總稱，可包含閃焰、CME、太陽高能粒子；抵達行星附近時可能干擾通訊、導航與電網。它不是單一現象。 | S1 |
| 2 | `solarFlare` | 太陽閃焰 | solar flare | spaceWeather | 太陽磁場重聯時釋放的電磁輻射，以光速傳播，約 8 分鐘抵達地球；依亮度分 A、B、C、M、X 級，每級相差 10 倍。 | S2 |
| 3 | `cme` | 日冕物質拋射 | coronal mass ejection (CME) | spaceWeather | 太陽向外拋出大量磁化電漿，速度可達每秒數百至數千公里；與閃焰常同時發生，但不是同一個東西，抵達地球通常要一到三天。 | S2 |
| 4 | `radiation` | 輻射 | radiation | spaceWeather | 太空輻射主要分成持續的銀河宇宙射線（GCR）與隨太陽風暴出現的太陽高能粒子（SEP）；帶電粒子會傷害 DNA，增加癌症與急性輻射症候群風險。 | S3 |
| 5 | `radiationShielding` | 輻射遮蔽 | radiation shielding | engineering | 用質量阻擋帶電粒子：船艙結構、水、食物與土壤都能當遮蔽；NASA 也研究用行星風化層做掩體，並以個人劑量計監測累積劑量。 | S3 |
| 6 | `atmosphere` | 大氣層 | atmosphere | mars | 行星外層的氣體，靠重力留在星球旁。地球以氮（約 78%）與氧（約 21%）為主；火星大氣稀薄，二氧化碳占 95% 以上，氧氣不到 1%。 | S4, S5, S16, S17 |
| 7 | `subsurfaceIce` | 地下冰 | subsurface ice | mars | 火星兩極與中高緯度的地表下有水冰；Odyssey 以伽馬射線與中子探測氫，Phoenix 著陸點直接確認冰的存在。 | S7 |
| 8 | `waterRecycling` | 水循環 | water recycling | lifeSupport | 國際太空站回收尿液、冷凝水與廢水；Brine Processor 讓水回收率可達約 98%，密閉基地必須把水一再循環。 | S10 |
| 9 | `oxygenRecovery` | 氧氣回收 | oxygen recovery | lifeSupport | NASA 的 MOXIE 用電解把火星大氣的 CO₂ 分解成 O₂ 與 CO；全任務共產生 122 公克氧氣，最高每小時 12 公克、純度至少 98%。 | S9 |
| 10 | `greenhouse` | 溫室 | greenhouse | lifeSupport | 太空種植在受控環境中進行：LED 光照、水耕或氣耕、溫濕度與二氧化碳控制；可提供食物與心理支持，但耗電與體積是限制。 | S11 |
| 11 | `solarPower` | 太陽能 | solar power | engineering | 太陽能板把陽光轉成電，是火星探測車常用的電力來源；夜間、季節與灰塵都會讓輸出下降。 | S12 |
| 12 | `dustStorm` | 沙塵暴 | dust storm | mars | 火星風可揚起區域性甚至全球性的沙塵暴，NASA 指出塵埃可在大氣中懸浮數月才沉降。 | S4 |
| 13 | `commsDelay` | 通訊延遲 | communication delay | engineering | 無線電以光速傳播；地球與火星距離 54.6 至 400.2 百萬公里時，單向訊號約需 3 到 22.4 分鐘，無法即時遙控。 | S13 |
| 14 | `sol` | 火星日 | sol | mars | 火星自轉一圈約 24.6 小時，稱為一個 sol；一個火星年約 669.6 sol。地球日約 24 小時。因為 sol 比地球日稍長，日曆日期會慢慢漂移；有些地球日期沒有對應的 sol。 | S4, S5 |
| 15 | `micrometeorite` | 微隕石 | micrometeoroid | spaceWeather | 極小但速度極高的塵粒或碎片，能穿透薄殼；NASA 用多層遮蔽與撞擊風險模型（如 BUMPER）保護太空船。 | S14 |
| 16 | `gravity` | 重力 | gravity | mars | 物體之間的吸引力；質量越大，重力越強。地球表面約 1g；火星約 0.38g（約地球三分之一），是低重力，不是無重力。長期無重力會讓體液往頭部移動，骨密度每月約流失 1–1.5%（4–6 個月任務）。 | S5, S18, S20, S21 |
| 17 | `geomagneticStorm` | 地磁風暴 | geomagnetic storm | spaceWeather | 太陽風或 CME 擾動地球磁層造成；強度常用 Kp 指數表示，Kp 7 以上屬於強烈風暴。**火星沒有全球磁場**，遊戲只把 Kp 當成太陽風暴強度的簡化代理。 | S1 |
| 18 | `solarWind` | 太陽風 | solar wind | spaceWeather | 太陽持續向外吹出的帶電粒子流；地球靠磁場偏轉，火星沒有全球磁場，太陽風可直接作用於大氣。 | S1 |
| 19 | `pressure` | 氣壓 | pressure | mars | 空氣的重量造成的壓力。地球海平面約 1013 hPa（一般科學知識）；火星表面氣壓不到地球的 1%，液態水在表面不穩定。 | S6；一般科學知識 |
| 20 | `dustDevil` | 塵捲風 | dust devil | mars | 火星上的小型旋風，會把塵土捲起並在地面留下深色軌跡；NASA 的多台探測車都拍到過。 | S15 |

**MVP 20：** 1–20 全部（太陽風暴、太陽閃焰、日冕物質拋射、輻射、輻射遮蔽、大氣層、地下冰、水循環、氧氣回收、溫室、太陽能、沙塵暴、通訊延遲、火星日、微隕石、重力、地磁風暴、太陽風、氣壓、塵捲風）。

## 3. 最容易寫錯的六件事

1. **閃焰 ≠ CME ≠ 太陽風暴。** 閃焰是光與輻射（8 分鐘到地球）；CME 是帶電粒子雲（一到三天）；太陽風暴是兩者抵達行星後造成的擾動總稱。
2. **Kp 是地球的指數。** DONKI 的 GST 與 Kp 描述地球磁層；火星沒有全球磁場。遊戲可以借用 Kp 當「風暴強度」，但資料面板要寫明這是簡化，不能說 NASA 偵測到火星地磁風暴。
3. **重力不是無重力。** 先講一般重力，再用火星當例子：火星重力 0.38g，約地球三分之一。兒童常以為太空人等於飄浮，知識卡要特別澄清。
4. **大氣層不是地球專有。** 火星大氣稀薄（氣壓不到地球 1%），但仍有天氣；不要寫成「火星沒有大氣」。
5. **通訊延遲是光速造成的，不是網路慢。** 單向 3–22.4 分鐘，來回最長約 45 分鐘；所以火星車要能自主判斷。
6. **沙塵暴與塵捲風不同。** 塵捲風是小型、短時間的旋風；沙塵暴可以是大範圍、持續數週的事件。不要把兩者寫成同一種。

### 3.5 出場時機對照（所有 20 個術語）

> 規則：每個術語只解說一次，第一次出現時就掛 `{{termId}}`。事件卡最多 2 個術語；`cme`、`geomagneticStorm`、`solarWind`、`gravity` 用艦長日誌或「為什麼？」面板出場，不塞進同一張卡。
>
> 2026-11-12 調整：MVP 不含 P3 沙塵季（REMS 快照全是晴天冷週）；`dustDevil` 改在 Sol 2 艦長日誌出場。
>
> 條件式卡（P4、L1–L3、S2、S3、F1、F3、C1、SC2）可能因當日天氣或資源狀況不符而不出場；這是預期行為，**不要為了讓某個術語出現而硬抽卡**。上表的「第一次出場」是設計上的 slot，不保證每一局都會走到。

| # | id | 第一次出場 | 出場句（預定，一律用 token） | 備註 |
|---:|---|---|---|---|
| 1 | `solarStorm` | 開場 幕 2 | 「我們被 {{solarStorm}} 打中了！」 | 全遊戲第一個可點詞 |
| 2 | `solarFlare` | Sol 4 艦長日誌（接 S1） | 「{{solarFlare}} 的光已經到了；{{cme}} 的粒子雲還在路上。」 | 與 `cme` 同句；S1 卡再以 `solarFlare`＋`radiationShielding` 回應 |
| 3 | `cme` | Sol 4 艦長日誌 | 「{{solarFlare}} 的光已經到了；{{cme}} 的粒子雲還在路上。」 | 與閃焰分開，不塞進 S1 卡；S1「為什麼？」面板再對照 `solarWind` |
| 4 | `radiation` | S3 避難艙檢查 | 「{{radiation}} 升高，先進避難艙。」 | S3 terms：`radiation`＋`radiationShielding` |
| 5 | `radiationShielding` | 開場 幕 5 外牆 tap | 「{{radiationShielding}}，是我們的盾。」 | 與 atmosphere 同句，共 2 詞 |
| 6 | `atmosphere` | 開場 幕 5 外牆 tap | 「火星的 {{atmosphere}} 太稀薄，保護不了我們。」 | 與 radiationShielding 同句；不寫「火星沒有大氣」 |
| 7 | `subsurfaceIce` | SC2 地下冰探測 | 「探測車找到 {{subsurfaceIce}}。」 | |
| 8 | `waterRecycling` | L2 水循環堵塞 | 「{{waterRecycling}} 堵塞，回收率下降。」 | |
| 9 | `oxygenRecovery` | L1 氧氣回收機故障 | 「{{oxygenRecovery}} 機故障，氧氣不夠了。」 | |
| 10 | `greenhouse` | 開場 幕 5 溫室 tap | 「我會讓 {{greenhouse}} 活過來。」 | |
| 11 | `solarPower` | 開場 幕 3 暗影台詞 | 「抱歉撞壞了你們的 {{solarPower}} 板。」 | |
| 12 | `dustStorm` | P1 太陽能板積塵 | 「{{dustStorm}} 的沙塵蓋住太陽能板。」 | P1 terms：`dustStorm`＋`solarPower` |
| 13 | `commsDelay` | C1 地球來電 | 「{{commsDelay}} 14 分鐘；地球的回覆要等。」 | |
| 14 | `sol` | 開場 幕 6 | 「7 個 {{sol}}。每個選擇都有代價。」 | |
| 15 | `micrometeorite` | S2 微隕石破損 | 「{{micrometeorite}} 打穿遮蔽層。」 | S2 terms：`micrometeorite`＋`radiationShielding` |
| 16 | `gravity` | Sol 1 艦長日誌 | 「第 1 個 {{sol}}。火星的 {{gravity}} 是地球的 38%。身體還在適應，體液往頭上跑，骨頭也變弱了——慢慢來。」 | 銀白簡報；P2 再重複；健康內容併入此卡，不新增術語 |
| 17 | `geomagneticStorm` | Sol 5 艦長日誌 | 「Kp 6.33 是地球的 {{geomagneticStorm}} 指數，不是火星的。」 | 只寫這句，不寫「強烈地磁風暴」 |
| 18 | `solarWind` | Sol 2 艦長日誌 | 「{{solarWind}} 一直在吹；這裡沒有全球磁場擋著。」 | S1「為什麼？」面板再與 `cme` 對照 |
| 19 | `pressure` | L3 二氧化碳超標 | 「火星 {{pressure}} 不到地球 1%。」 | L3 terms：`atmosphere`＋`pressure` |
| 20 | `dustDevil` | Sol 2 艦長日誌（接在 solarWind 後） | 「晴天也可能出現 {{dustDevil}}。」 | MVP 不含 P3；避免在晴天冷週硬塞沙塵季 |

## 4. 卡片寫法：一般概念＋地球／火星對照

每張知識卡固定三層，總長不超過 3 句：

| 欄位 | 內容 | 長度 |
|---|---|---:|
| `short` | 一句一般定義 | ≤ 25 字 |
| `example` | 地球 vs 火星，1–2 個數字 | ≤ 30 字 |
| `why` | 在這款遊戲裡為什麼重要 | ≤ 30 字 |

**範例一：大氣層**

- `short`：行星外層的氣體，靠重力留在旁邊。
- `example`：地球以氮、氧為主；火星二氧化碳 95%，空氣稀薄。
- `why`：你不能直接呼吸，沙塵暴也會遮住太陽能板。

**範例二：重力（含太空健康）**

- `short`：物體之間的吸引力；質量越大，重力越強。
- `example`：地球 1g；火星 0.38g。長期無重力會讓體液上移，骨密度每月約流失 1–1.5%。
- `why`：在火星搬東西變輕，但身體還在適應，動作要慢。

英文版：

- `short`: Gravity is the pull between objects; more mass means more gravity.
- `example`: Earth is 1 g; Mars is 0.38 g. Months in weightlessness shift fluids upward, and bones lose about 1–1.5% density a month.
- `why`: Things feel lighter on Mars, but your body is still adapting — move slowly.

**範例三：氣壓**

- `short`：空氣的重量壓在物體上的力量。
- `example`：地球海平面約 1013 hPa；火星不到地球 1%。
- `why`：液態水在火星表面不穩定，太空衣必須加壓。

## 5. 來源清單（2026-11-12 重新驗證 HTTP 200）

| 編號 | NASA 頁面 | 支撐的術語 |
|---|---|---|
| S1 | [Space Weather — NASA Science](https://science.nasa.gov/heliophysics/focus-areas/space-weather/) | solarStorm、geomagneticStorm、solarWind |
| S2 | [Solar Storms and Flares — NASA Science](https://science.nasa.gov/sun/solar-storms-and-flares/) | solarFlare、cme |
| S3 | [Real Martians: How to Protect Astronauts from Space Radiation on Mars](https://science.nasa.gov/resource/real-martians-how-to-protect-astronauts-from-space-radiation-on-mars/) | radiation、radiationShielding |
| S4 | [Mars Facts — NASA Science](https://science.nasa.gov/mars/facts/) | atmosphere、dustStorm、sol |
| S5 | [What Is Mars? (Grades 5–8) — NASA](https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-mars-grades-5-8/) | gravity、atmosphere、sol |
| S6 | [Terraforming the Martian Atmosphere — NASA Science](https://science.nasa.gov/resource/terraforming-the-martian-atmosphere/) | pressure |
| S7 | [Mars Odyssey Science Highlights — NASA Science](https://science.nasa.gov/mission/odyssey/science-highlights/) | subsurfaceIce |
| S9 | [NASA's MOXIE Completes Mars Mission — NASA](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/) | oxygenRecovery |
| S10 | [Brine Processor Assembly — NASA TechPort](https://techport.nasa.gov/projects/184899) | waterRecycling |
| S11 | [Growing Plants in Space — NASA Science](https://science.nasa.gov/biological-physical/the-challenges-of-growing-plants-in-space/) | greenhouse |
| S12 | [Mars Exploration Rovers: Spirit and Opportunity — NASA Science](https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/) | solarPower |
| S13 | [Mars Relay Network — NASA Science](https://science.nasa.gov/mars/mars-relay-network/) | commsDelay |
| S14 | [Impact Protection — NASA](https://www.nasa.gov/impact-protection-2/) | micrometeorite |
| S15 | [Dust Devils on Mars — NASA Science](https://science.nasa.gov/resource/dust-devils-on-mars/) | dustDevil |
| S16 | [Earth's Atmosphere — NASA Space Place](https://spaceplace.nasa.gov/atmosphere/en/) | atmosphere |
| S17 | [Neither Perpendicular nor Parallel — NASA](https://www.nasa.gov/image-article/neither-perpendicular-nor-parallel/) | atmosphere（地球組成 78% 氮、21% 氧） |
| S18 | [What Is Gravity? — NASA Space Place](https://spaceplace.nasa.gov/what-is-gravity/en/) | gravity |
| S19 | [What's in the Atmosphere? — NASA Space Place](https://spaceplace.nasa.gov/whats-in-the-atmosphere/) | atmosphere（重力留住氣體） |
| S20 | [Risk of Spaceflight-Induced Bone Changes — NASA](https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/) | gravity（骨質流失；1–1.5%／月，4–6 個月任務） |
| S21 | [Reduced Gravity Q&A — NASA GRC K-12](https://www.grc.nasa.gov/WWW/K-12/RG_html/documents/AnswerPreCA.htm) | gravity（體液上移、puffy heads） |
| S22 | [Muscle and Exercise Studies to Maintain Crew Health in Space — NASA](https://www.nasa.gov/blogs/spacestation/2025/07/16/muscle-and-exercise-studies-to-maintain-crew-health-in-space/) | gravity（任務報告：每天運動約 2 小時） |

> S8 保留給 `SWIM Map Shows Subsurface Water Ice on Mars`（[連結](https://science.nasa.gov/resource/swim-map-shows-subsurface-water-ice-on-mars/)），目前未使用；S7 已足夠支撐地下冰。

## 6. 下一步（11/14 開工後）

- [x] 2026-11-12：`marsAtmosphere`→`atmosphere`、`lowGravity`→`gravity`、`marsPressure`→`pressure`；事件卡 terms 同步。
- [x] 2026-11-12：20 個術語都有指定出場時機（§3.5）。
- [x] 2026-11-14：健康內容併入 `gravity`；Sol 1 簡報、開場幕 3、任務報告各加一句；不新增卡片。
- [ ] 把這 20 個寫成 `src/data/glossary.json`；key 用上表 `id`。
- [ ] 若 11/15 要獨立 `spaceAdaptation` 卡：先確認影片已錄完，再改背包總數 20→21 與 test fixtures；不要在 freeze 前改。
- [ ] 每張卡：`short` ≤ 25 字、`example` 地球／火星對照、`why` ≤ 30 字（中英文都要）。
- [ ] `related` 只放已存在的 id；測試檢查每個 token 都有對應卡。
- [ ] 事件卡與 UI 文案只能用 `{{termId}}`，不要硬寫中文再靠字串比對。
- [ ] 把「Kp 是地球指數」「重力不是無重力」「大氣層稀薄但仍有天氣」寫進知識卡與資料面板。
- [ ] 測試：掃描所有文案的 `{{termId}}`，列出未被引用的 MVP id。
