# 02 — Information architecture

| URL | Purpose | Auth | Notes |
| --- | --- | --- | --- |
| `/` | FrontHero (Olive) + story strip + 3 oils + tasting CTA + journal preview + FAQ + contact | public | Agent-first, FrontHero is first viewport |
| `/oils` | Five-card SKU grid + pairing table + 6 concept reviews | public | |
| `/grove` | Long-form 5-section about/process page | public | force-static |
| `/journal` | Index of 6 published posts | public | |
| `/journal/[slug]` | Individual post | public | force-dynamic, MD→HTML |
| `/contact` | Concierge anchor + form | public | force-static + form |
| `/concept`, `/privacy`, `/terms`, `/checkout` | Framework defaults | public | force-static |
| `/admin/{live,leads,leads/[id],transcripts,oils,tastings,journal,insights,analytics,agent,settings}` | Standard-tier admin | basic auth | |
| `/api/agent`, `/api/agent/{probe,oils,tastings}` | Concierge proxy + read-only catalogue | public | |
| `/api/leads`, `/api/track`, `/api/privacy/request` | Public APIs | public | |
| `/api/admin/{live,insights,oils,tastings,journal,leads/[id]/{tags,notes},agent/regenerate-kb}` | Admin APIs | basic auth | |
