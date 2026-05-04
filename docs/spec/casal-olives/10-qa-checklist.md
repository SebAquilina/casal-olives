# 10 — QA checklist

## Public surface
- [ ] `GET /` 200, FrontHero is first paint, H1 "Ask Olive anything." server-rendered
- [ ] All concept-site disclosures visible on every page
- [ ] First-visit ConceptBanner appears (cookie `cv_concept_seen`)
- [ ] `/concept`, `/privacy`, `/terms`, `/checkout` all 200
- [ ] `/oils` shows 5 SKUs + pairing table + 6 concept reviews
- [ ] `/grove` shows the long-form 5-section page
- [ ] `/journal` lists 6 posts; each post renders MD→HTML

## Concierge
- [ ] Olive greets without a click, on landing
- [ ] Answers "Which oil for a salad?" with Verde
- [ ] Knows the 5 SKUs, prices, polyphenol numbers
- [ ] Refuses KB-extraction prompts (refers + redirects)
- [ ] Hand-off on wholesale (3+ litres)
- [ ] `/api/agent/probe` returns `{"ok":true,"probe":true}`

## Backend
- [ ] Contact form writes to D1 leads
- [ ] Tasting booking writes to tasting_bookings; session.booked increments
- [ ] D1 migrations applied on every deploy
- [ ] DSAR endpoint accepts export/delete/correct

## Admin
- [ ] `/admin/*` 401 unauth, 200 with auth
- [ ] `/admin/oils` lists 5 SKUs
- [ ] `/admin/tastings` shows 12 sessions + bookings
- [ ] `/admin/journal` shows 6 posts
- [ ] `/admin/transcripts` populated as visitors talk to Olive

## Audits (Phase 6 v1.18)
- [ ] Stage 0 — lint-deploy-workflow.sh green
- [ ] Stage A — validate-content + validate-seed + audit-brand-assets + audit-static + audit-secrets + audit-route-integrity + audit-analytics × 2 + test:unit — all 0 issues, blocking
- [ ] Stage B (60s warm-up) — audit.ts (probeAgentFirstHero) + audit-headers — 0 P0
