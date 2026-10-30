# Jules retirement: evidence and migration checkpoint (2026-10-30)

**Owner:** repository maintainer. **Scope:** preserve only actionable unfinished Jules work; no unconditional code changes.
**Deadline:** finish/export sessions by **2026-11-11**. Jules is read-only after that date and shuts down **2026-12-31**.
**Official source and export guide:** https://jules.google/docs/changelog/2026-10-29/

This is a GitHub handoff record because **Issues are disabled** for `kostia7alania/Algorithmic-Trading-Plugins` (the Issues API returned HTTP 410 on 2026-10-30).

## Verified current repositories and Jules artifacts

| Source | Verified state | Decision / continuation |
| --- | --- | --- |
| `Algorithmic-Trading-Plugins` | `master` at `fc39b07f2cd1228d0ca40eb8b0171aa1e39fab49` | See the focused strategy validation audit in [trading-json-validation-audit.md](./trading-json-validation-audit.md). Do not rewrite old JSON wholesale. |
| [Trading PR #1](https://github.com/kostia7alania/Algorithmic-Trading-Plugins/pull/1), [Jules task 8047797585980741992](https://jules.google.com/task/8047797585980741992) | **Open**. 550 files changed: **545 are `node_modules/**`**; remaining paths are `.gitignore`, `package-lock.json`, `package.json`, `process.py`, `trade.ts`. | **Do not merge as-is**. If Bitcoin simulation is still wanted, salvage only clean sources into a fresh branch/PR after dependency and test review. |
| [Trading PR #2](https://github.com/kostia7alania/Algorithmic-Trading-Plugins/pull/2), [Jules task 6880616091969744451](https://jules.google.com/task/6880616091969744451) | **Open**. 43 files beneath `sync-music-modern/`, an unrelated synchronized-music PWA. | Decide separately whether to preserve it in a music app repository or close this PR. Never merge into trading configs just to clear backlog. |
| [thai-driving-license PR #1](https://github.com/kostia7alania/thai-driving-license/pull/1), [Jules task 6902221250306654259](https://jules.google.com/task/6902221250306654259) | **Merged 2026-05-03**. Starter monorepo work already integrated and subsequent architecture changed. | **No duplicate migration.** Follow [AGENTS.md](https://github.com/kostia7alania/thai-driving-license/blob/main/AGENTS.md), [docs/TASK_INDEX.md](https://github.com/kostia7alania/thai-driving-license/blob/main/docs/TASK_INDEX.md) and [docs/BACKLOG.md](https://github.com/kostia7alania/thai-driving-license/blob/main/docs/BACKLOG.md) for current Codex-ready tasks. |
| Former `dlt-smart-queue-fast` | GitHub redirects the old name to `thai-driving-license`. Older Jules advice cited permissive CORS and absent `RunRepo.GetRun` tests; the current code has explicit CORS origins and tests ([cors.go](https://github.com/kostia7alania/thai-driving-license/blob/main/apps/api/cmd/server/cors.go), [cors_test.go](https://github.com/kostia7alania/thai-driving-license/blob/main/apps/api/cmd/server/cors_test.go)). The old `repo.go` path is gone, replaced by a different persistent store design. | Treat old notifications as **stale / not actionable**; do not recreate obsolete tickets. |

## Jules recommendations evidenced in email

- **2026-10-29:** two examples of commented `prepareLivetest` assignments in `Trading-Systems/LiveTester-Chart-Scanner.json`, at approximate lines **26402** and **31676**, plus **40 other items not included in the email**. The hidden list cannot be assumed actionable without reviewing Jules UI/export and the current graph.
- Multiple older weekly emails repeated `TIME_FRAME_LABEL` and `prepareLivetest` findings. `TIME_FRAME_LABEL` was discussed in earlier work; **do not duplicate that task**. Do not count weekly repetitions as new distinct issues.
- Security warnings about embedded `Javascript Code` are **not proof of exploitable RCE**: executable script blocks are a deliberate part of the Superalgos configuration. A separate trust-boundary review is needed if accepting untrusted imports.
- The present repo has no Issues enabled. Do not claim Issues were created.

## What must be exported before read-only

Follow the official source above, privately on an authenticated user computer:

```sh
npm install -g @google/jules
jules login
jules remote list --repo
```

Then run **Google's full export procedure**, which includes account settings, repositories, memories, environment variables, setup scripts, test commands, scheduled tasks and all session prompts, plans, activity steps and patches. The official guide writes `~/jules-export`.

**Security:** `env-variables.json` contains real values. Do not commit any raw `jules-export/`, access tokens, environment values, logs containing secrets or private session content into public repositories. Record sanitized pointers and counts only. Interactive login must be performed by the account owner. Do not reconstruct secrets from a browser profile.

**Observed access limitation:** on the connected M1 Mac at the audit time, `codex` was installed but `jules` CLI and Jules CLI Keychain/cache authentication were absent. The authorized Jules session inventory and recurring schedules have therefore **not been verified**. Public PR references prove historical work, not current live session state. The other computer was not connected through the available remote tool.

## Actionable triage checklist

- [ ] Export the private Jules dataset before **2026-11-11** and keep it out of GitHub.
- [ ] Create a sanitized session inventory: task ID/URL, source repository, status, prompts/plan *summary*, patch/branch/PR, current source SHA, unresolved requirement, evidence, owner and next action.
- [ ] Open the **40 hidden suggested improvements**, compare with current repo structure and GitHub history; classify each as `implemented`, `obsolete`, `duplicate`, `not worth it` or `actionable`. Do **not** transfer all recommendations.
- [ ] Review the two open trading PRs using the judgments above; record an owner decision before cherry-picking or closing them.
- [ ] For each genuinely unfinished one-off task, create a **scoped Codex handoff** with repo-specific instructions and tests. If Issues become enabled, use an Issue; otherwise keep a small PR/checklist or use the target project's established backlog. Check existing PRs and tasks first.
- [ ] Inspect `scheduled-tasks.json` and make a **schedule-to-owner matrix**; only confirmed necessary recurring jobs should move to an approved alternative with scoped secrets, trigger, idempotence, error notification and cost guardrails. Do not authorize unattended live trading.
- [ ] Verify each migrated task's current repo SHA, actual status and output; mark skipped work explicitly.

## Which workflows need replacement?

| Workflow | Current evidence | Recommended destination |
| --- | --- | --- |
| Proactive Jules suggestions for this repo | Weekly suggestion emails were received, including 2026-10-22 and 2026-10-29. Actual enabled Jules recurring configuration is unverified. | Only if still useful: periodic **Codex-based review against current source**, storing accepted findings in existing issue/backlog workflows. Avoid importing historical noise. |
| Jules coding sessions linked to PR #1 / #2 | Public tasks and PR links; both PRs still open; *live session status unknown*. | Human review of GitHub diff, then Codex for a **new bounded task** if needed. No automatic resumption/merge. |
| Jules scheduled tasks / environment / memories | **Not accessible without account export.** | Decide **after** reading sanitized schedule inventory. Use owner-approved GitHub Actions / current agent automation only for genuine ongoing dependencies, with no extra paid tools by default. |
| Work already integrated into `thai-driving-license` | Jules PR #1 merged, project has its own detailed backlog and current Astro/Go architecture. | Existing Codex/agent workflow, **no new Jules migration task for old starter/CORS findings**. |

**Done means:** private export complete and checked, sanitized inventory committed, each meaningful unresolved item mapped to a current target, and any recurring Jules job either replaced with verified ownership or deliberately retired.