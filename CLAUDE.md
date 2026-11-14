# CLAUDE.md — Meowstronauts: Mars Outpost

> 給所有 Claude Code session 的共同規則。三個 session（A 主機／B 小孩測試機／C 協作機）都適用。
> 分工細節見 `docs/pre-event/multi-machine-plan.md`。

## 專案

- **Meowstronauts: Mars Outpost（喵航員：火星基地）**，NASA Space Apps Challenge 2026 參賽作品。
- 瀏覽器資源管理遊戲，對象 7–12 歲；繁體中文＋英文，英文為預設語言。
- 技術：Vite + React + TypeScript；Cloudflare Worker 保管 NASA API key；遊戲用賽前快照，runtime 不呼叫 LLM。
- 賽程：2026-11-14 09:00 開工，11/15 23:59 截止。**11/14 09:00 前沒有遊戲程式碼、沒有遊戲內文案。**

## 硬規則

1. **不讀、不印、不複製 `.dev.vars`。** 不把任何 API key、token、secret 貼進聊天、issue、截圖或 commit。
2. **手動 `wrangler deploy` 與 Cloudflare 設定只有 A 主機可以動。** `main` 每次 push 由 Cloudflare Workers Builds 自動建置部署（`npm ci && npm test && npm run build` 紅就不部署），所以**推上 `main` 等於上線**；三台都可以直接推 `main`，但必須照下面的推送協定。
3. **B／C 不碰 `.dev.vars`；** 本機跑遊戲用快照，不打 NASA API。
4. **不 force push、不用 `git reset --hard origin/main`、不改 repo visibility。** repo 11/15 才轉 public。
5. **一個檔案，同一時間只有一台機器在改。** 動共用檔前先 LOCK；跨區修改先開 issue。
6. **不錄音、不錄影、不拍小孩。** Playtest 只截遊戲畫面，記錄用代號，不寫姓名或學校。
7. **夜間自動修復只在 A 機**（`docs/test-plan.md` §14、`docs/pre-event/multi-machine-plan.md` §7.1）：測試檔不可改、綠色才 commit、**不 push**（push 即上線）、不 deploy；早上 A 驗收後再 push，壞的 `git revert`。C 機晚上做 30 秒影片，不跑測試迴圈。

## 直接推送 `main`

**沒有 PR、沒有長期分支、沒有人工合併。**

```bash
git pull --rebase origin main
# 小段落修改（30–45 分鐘內）
git add <只加自己的檔>
git commit -m "fix: ..."
git pull --rebase origin main
npm run build        # 有 code 就一定要跑；有 test 就跑
git push origin main
```

- 小 commit、常推送；不要累積半天才推。`pull --rebase` 前先 commit 或 `git stash`。
- push 被拒：再做一次 `git pull --rebase origin main` 再推；**不 force**。
- 弄壞 `main`：立刻修，或 `git revert <sha>`；最後推的人負責 15 分鐘內讓 main 綠燈。
- 衝突檔是你的 → 解衝突、`git rebase --continue`；不是你的 → `git rebase --abort`，在群組問 owner，不要幫別人解。
- `package.json`／`package-lock.json` 只有 A 能改；需要新套件先開 issue。
- Commit 前綴：`feat:`、`fix:`、`docs:`、`qa:`、`chore:`。一次 commit 一件事。
- 修正只改 issue 指名的檔案；不順手重構、不改文案風格、不加新功能。超過 30 分鐘交回 A。

## 夜間自動修復（11/14 晚上）

- 只在 A 機跑（`docs/test-plan.md` §14、`docs/pre-event/multi-machine-plan.md` §7.1）；B 關機，C 做 30 秒影片。
- runner 腳本管迴圈；Claude 一次只修一個 failing test；測試檔 hash 不可變、`package.json`／lock 不可改、不 deploy、不碰 secret。
- 全套綠才 commit，**commit 留在 A 本機不 push**（`main` 每次 push 由 Workers Builds 自動上線；早上 A 驗收後才推）；最多 6 次、3 個未解、02:00 停止；失敗不 commit，寫 `output/overnight/report.md`。
- 影片從 A 21:00 部署的 freeze build 錄；A 夜間不 deploy。影片路徑（HUD 數值）是 freeze lock，修正不得改測試／fixture 來配合。
- 動到視覺／文案的 commit 加 `[visual]`；早上 C 重錄或 A revert。

## 回報格式（B）

```text
[P1] 一句話
Build:
Steps:
Expected:
Actual:
Screenshot:
```

P0 玩不下去／白屏／資料誤導；P1 主流程卡住；P2 版面與動線；P3 潤飾。
B 的 Claude 只有拿到 `fix-ok` 標籤的 issue 才能動手修；修完照推送協定直接推 `main`，在 issue 貼 commit SHA。

## 文案與事實

- 回覆用繁體中文；遊戲文案中英雙語，英文為預設語言。
- 事件卡以 `docs/event-cards.md` 為準；術語以 `docs/glossary.md` 為準；資料數字要能回指 `docs/data-sources.md`。
- 不自行新增 NASA 事實、不把推測寫成肯定句；不確定就開 issue 問。
- 可寫「strong solar flare」；**不可**寫「strong geomagnetic storm」。火星天氣只寫「很冷」，不寫百分位排名。
- PIA25077 是岩石，不是植物或化石；caption 必須寫明。

## 目前階段（2026-11-12 至 11/14 09:00；此節在開工後失效）

- 只做研究、設計、品牌、文件、影片工具與環境準備。
- **不建立遊戲 `package.json`／Vite 專案、不生成最終遊戲圖、不寫遊戲內文案。**
- **不 commit、不 push**；11/14 09:00 做賽前唯一一次 commit。
- 11/14 09:00 之後：照常 commit／push，那些都屬於比賽期間開發。

## 文件入口

- 計畫與排程：`PLAN.md` §9–§10
- 賽前檢查：`docs/pre-event/preflight.md`
- 三台電腦分工：`docs/pre-event/multi-machine-plan.md`；B／C 預裝與指令：`docs/pre-event/b-c-setup-and-prompts.md`
- 資料來源：`docs/data-sources.md`；授權：`docs/licenses.md`
- 影片：`docs/video-script.md`、`docs/video-path.md`
- 測試規格：`docs/test-plan.md`；手動 QA：`docs/qa-checklist.md`
- Playtest：`docs/playtest.md`

## 指令

- 遊戲 scaffold 尚未建立；11/14 09:00 後以 `package.json` 的 scripts 為準（預計 `npm run dev`、`npm run build`、`npm run test`）。
- 影片工具在 `tools/video/`，與遊戲無關，不要混用依賴。
