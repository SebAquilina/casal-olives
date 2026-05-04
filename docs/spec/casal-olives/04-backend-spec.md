# 04 — Backend spec

## Bindings
- `DB` (D1) — `casal-olives-db` (id assigned at provision time)
- `DEAD_LETTER` (KV) — last-resort lead capture

## Schema additions on top of skill base (`drizzle/migrations/0003_casal_olives.sql`)
- `oils` — 5 rows seeded (verde, maturo, riserva, duo, tasting)
- `tasting_sessions` — 12 Saturday slots seeded May–October 2026
- `tasting_bookings` — created via concierge or admin
- `journal_posts` — 6 posts seeded (why-bidni, what-single-estate-means, polyphenols-briefly, three-things-with-verde, the-1965-frantoio, pairing-oil-and-bread)
- `carts` — per-cc_cid cart store

## API routes
- `/api/agent/probe` — sentinel
- `/api/agent/oils` — read-only catalogue for concierge
- `/api/agent/tastings?from=YYYY-MM-DD` — available sessions
- `/api/leads` POST — Zod-validated, dead-letter on D1 failure
- `/api/track` POST — analytics beacon
- `/api/privacy/request` POST — DSAR (export | delete | correct)
- `/api/admin/{oils,tastings,journal}` — read + journal upsert
- `/api/admin/leads/[id]/{tags,notes}` — Timeline CRUD

## Env vars (build-time vs runtime per skill SKILL.md)

| Var | Mode |
| --- | --- |
| `GEMINI_API_KEY` | RUNTIME |
| `RESEND_API_KEY` | RUNTIME |
| `ADMIN_USER` | RUNTIME |
| `ADMIN_PASSWORD` | RUNTIME |
| `ADMIN_OWNER_EMAILS` | BUILD_TIME (wrangler.toml `[vars]`) |
| `NEXT_PUBLIC_SITE_URL` | BUILD_TIME |
