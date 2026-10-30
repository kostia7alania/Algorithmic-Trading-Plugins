# Trading JSON / embedded-JavaScript audit (2026-10-30)

**Source reference:** `master@fc39b07f2cd1228d0ca40eb8b0171aa1e39fab49`.

This is an **inspection/acceptance plan**, not a request to mass-fix or merge stale code.

## Read-only findings

- The **10** committed `Trading-Engines/`, `Trading-Mines/` and `Trading-Systems/` JSON files were downloaded from public GitHub and parsed successfully using Python's `json.loads`. **JSON syntax is valid**; there is no schema or Superalgos runtime assertion.
- [Trading-Systems/LiveTester-Chart-Scanner.json](https://github.com/kostia7alania/Algorithmic-Trading-Plugins/blob/master/Trading-Systems/LiveTester-Chart-Scanner.json): **33,431 lines**, **114** embedded nodes whose `type` is `Javascript Code`, **22 distinct `code` bodies**.
- **19 distinct bodies** contain the `isBestOption` logic and commented `prepareLivetest` assignments. Different bodies mean potentially different graph parameters (such as `myChart`), so they are **not safe to replace wholesale with one implementation**.
- The sample code begins by invoking `isBestOption()`, then defines `function isBestOption()`. It assigns names such as `k`, `i`, `j`, `label`, `myChart`, `maxPPH`, `bestChart` without local declarations. Whether this causes shared-global leakage or strict-mode errors depends on **actual Superalgos runtime semantics**; this is a hypothesis for targeted tests, not a confirmed exploit/bug.
- There is no committed test framework or GitHub Actions CI on this repository's `master`. The strategy configs therefore have **no visible automated regression coverage**.
- Jules' 2026-10-29 message repeats a `prepareLivetest` commented-code warning at lines ~**26402** and **31676**; many other Jules suggestions are unavailable in the email itself. `TIME_FRAME_LABEL` caching had already been considered separately and is explicitly **out of scope** here.

## Work worth doing only if these strategies are maintained

1. **Confirm compatibility:** document the Superalgos version and exact import/execution path; baseline one representative chart-scanner strategy and keep its observable signals.
2. **JSON structural test:** add a lightweight reader over all 10 files, verify expected root fields, strategy graph node IDs/relationships, and supplied schema if available. Never mistake JSON parsing for full validation.
3. **Targeted behavior tests:** execute representative `isBestOption` cases (no match, exactly one, multiple candidates, missing fields) in the actual supported runtime or a proven equivalent. Check unexpected global writes only if the host runtime can produce them.
4. **Only then review dead comments:** the `// prepareLivetest = ...` statements may be safe to remove, but saving lines is low priority if it changes graph serialization or node IDs. Avoid sweeping JSON reformatting.
5. **Security context:** `Javascript Code` in Superalgos JSON is intentional. Evaluate who can supply/import these files before treating Jules' `eval` warning as security-critical. Do not automatically claim RCE.
6. **No duplicate work:** do not reimplement or reopen `TIME_FRAME_LABEL` optimization as part of this document.

## Verification/acceptance gates

- Document current runtime, file set and baseline import results.
- Report actual test commands and pass/fail plus behavior differences.
- Preserve strategy node IDs, relationships and signal semantics unless an explicitly tested correction is approved.
- Limit code changes to proven defects with a reviewable diff. No unattended trading, deployment, or large generated rewrites.

**Priority:** conditional on project being actively used; after time-sensitive Jules session export.