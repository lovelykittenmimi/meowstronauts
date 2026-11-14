# 賽前準備紀錄（Pre-event records）

> 這個資料夾放 **2026-11-14 09:00 之前**的內部工作紀錄、環境檢查與資料稽核。
> 它不是遊戲內容，也不是 submission 的一部分；放在這裡是為了讓 repo 對評審透明，而不是把準備過程藏起來。

## 1. 內容

| 檔案 | 內容 | 什麼時候用 |
|---|---|---|
| `worklog-2026-11-12.md` | 11/12 夜間完成事項、決策記錄、明早待辦 | 11/13 早上先看這份 |
| `preflight.md` | 11/13 final check：網域、Worker secret、金鑰衛生、資產、環境、playtest、22:00 freeze | 11/13 白天照著跑；B／C 項目晚上其他人回家後再做 |
| `data-audit.md` | 快照稽核：DONKI／REMS／照片筆數、尺寸、manifest、使用限制 | 查資料來源時參考 |
| `photo-review-2026-11-12.md` | 使用者提供的 6 張候選照片檢視：內容、credit、為何不採用；PIA25077 已納入第 7 張，作 F1 故事客串 | 查照片來源與取捨理由時參考 |
| `multi-machine-plan.md` | 11/14–15 三台電腦（A 主機／B 小孩測試／C 協作）的角色、檔案所有權、直接推送規則、預裝清單、時間表；A 夜間測試／修復、C 夜間影片 | 11/13 設定 B／C 時照著做；20:00 sync 用 |
| `b-c-setup-and-prompts.md` | B／C 需要安裝的工具、11/13–15 可以直接貼給 Claude Code 的指令 | 11/13 設環境、11/14 開工時照貼 |
| `pre-event-review-2026-11-13.md` | 11/13 檢查：完成項、資料驗證、執行紀錄、待辦、風險、11/14 早上清單 | 下午先看 §7.1；晚上照 §7 收尾 |

## 2. 賽前／賽間界線

- 11/14 09:00 前：只有研究、設計、品牌資產、文件與影片工具，**沒有遊戲程式碼、沒有遊戲內文案**。
- 11/14 09:00：賽前唯一一次 commit，包含這個資料夾與 scaffold；09:10 看 GitHub Actions。
- 09:00 之後：照常 commit／push，那些都屬於比賽期間的開發。
- 11/15 提交時：submission 連到 `docs/` 的設計與研究文件；這個資料夾保留，不需要刪除，也不要改寫 git 歷史。

## 3. 不要放進來的東西

- `.dev.vars`、任何 API key 或 secret 的值。
- `output/`、`node_modules/`、`dist/`、`.wrangler/` 等暫存或建置產物（都已在 `.gitignore`）。
- 重複的照片檔或一次性的測試資料。

## 4. 11/13 晚上第二次整理（10 分鐘）

- [ ] `ls docs/pre-event` 只有上面七個檔案與這份 README。
- [ ] `README.md`、`PLAN.md`、`docs/qa-checklist.md`、`docs/data-sources.md` 的連結都指向 `docs/pre-event/`。
- [ ] `git status --short` 沒有 `.dev.vars`、`output/`、`node_modules/`、`dist/`。
- [ ] 11/14 09:00 commit 前再看一次 `git status --short`；不要提前 commit。

> 這份 README 與七個紀錄檔都算賽前文件，11/14 09:00 一併 commit。之後不再新增賽前文件。
