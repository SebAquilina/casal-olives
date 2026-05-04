# audit-runbook — Casal Olives Phase 6 (v1.18)

8-step sequence per skill ref 38. Each step writes to its section of `audit-report-<YYYY-MM-DD>.md`.

1. **Environment + scope.** Capture deploy URL, branch, sha.
2. **Seed validation.** `pnpm validate:seed` + `pnpm tsx scripts/validate-seed.ts`. Both must exit 0.
3. **Static audit (Stage A).** `audit-static.ts ../..` + `audit-secrets.sh` + `audit-route-integrity.sh` + `audit-brand-assets.sh`. 0 P0.
4. **Analytics audit (skill ref 36).** `audit-analytics/run.ts` (15) + `audit-analytics/runtime.test.ts` (38). 0 fails.
5. **Network audit (Stage B, after 60s warm-up).** `audit.ts $URL` (probeAgentFirstHero etc.) + `audit-headers.sh`. 0 P0.
6. **Visual walkthrough (10-step).** Per skill ref 17.
7. **Privacy review.** Processors itemised, retention stated, DSAR reachable.
8. **Triage + gate.** 0 P0 → PASS, ≥1 P0 → FAIL.
