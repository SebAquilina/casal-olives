# 09 — Deploy plan

- GitHub: `SebAquilina/casal-olives` — main is the production trunk
- Cloudflare account: `cfd32b6623c3b1adce7345cdff737d14`
- Pages project: `casal-olives-web`
- D1 db: `casal-olives-db` (id captured in `wrangler.toml` after provision)
- KV namespace: `DEAD_LETTER` (Casal Olives reuses Studio Vella's namespace pattern)

## CI workflow (`.github/workflows/deploy.yml`)

Stage 0 — `lint-deploy-workflow.sh` (no `continue-on-error` on Phase 6 stages, per skill ref 38).
Stage A — validate-content, validate-seed, audit-brand-assets, audit-static, audit-secrets, audit-route-integrity, audit-analytics-static, audit-analytics-runtime, unit tests — all blocking.
Build + deploy — D1 migrations, next-on-pages, wrangler-action.
Stage B (60s warm-up) — audit-network, audit-headers — blocking after warm-up.

## Custom domain

`casalolives.concierge.studio` — Pages domain attached, status pending CNAME at parent zone (which is unregistered). Live URL until then: `casal-olives-web.pages.dev`.
