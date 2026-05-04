import Link from "next/link";
import { FrontHero } from "@/components/front/FrontHero";
import { ClientIdField } from "@/components/analytics/ClientIdField";
import type { D1Database } from "@cloudflare/workers-types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function db(): D1Database | null {
  const env = process.env as unknown as { DB?: D1Database };
  const g = globalThis as unknown as { DB?: D1Database };
  return env.DB ?? g.DB ?? null;
}

const STORY = [
  {
    title: "One grove",
    body: "12 acres in Mġarr, planted 1962, 320 trees. Mostly Bidni — the indigenous Maltese cultivar — with two rows of Carolea for the Riserva.",
  },
  {
    title: "One harvest",
    body: "Hand-picked over 11 days in October–November 2024. Pressed at our restored 1965 stone frantoio within four hours of picking.",
  },
  {
    title: "One press",
    body: "No blends. No buying-in. No off-estate fruit. Single-grove, single-harvest, single-press — every bottle traces back to a row of trees and the day it was milled.",
  },
];

const FAQS = [
  { q: "Is the oil organic?", a: "Not certified — we don't use sprays, but the certification paperwork costs more than it'd add to the bottle. Working toward it for the 2026 harvest." },
  { q: "Do you ship outside the EU?", a: "Yes — but we put a custom quote together. Ask Olive with the country and the order size." },
  { q: "How long does it ship?", a: "Within Malta, 1-2 working days. Within EU, 3-6 working days. Outside EU, custom." },
  { q: "Returns?", a: "Damaged-in-transit, replaced free. Opened bottles, not accepted." },
  { q: "Allergies?", a: "Our press handles only olives. No nut, sesame, dairy, or gluten contact at any stage." },
  { q: "Subscription?", a: "Not yet — one-shot orders only on the standard tier." },
];

export default async function Home() {
  const d = db();
  type OilRow = { slug: string; name: string; price_cents: number; size: string | null; hook: string };
  type PostRow = { slug: string; title: string; excerpt: string; reading_min: number | null; published_at: string };
  type SessionRow = { id: string; date: string; time: string; capacity: number; booked: number };

  let oils: OilRow[] = [];
  let posts: PostRow[] = [];
  let nextSession: SessionRow | null = null;

  if (d) {
    try {
      const r = await d.prepare("SELECT slug, name, price_cents, size, hook FROM oils WHERE active = 1 AND kind = 'oil' ORDER BY sort_order LIMIT 3").all<OilRow>();
      oils = r.results ?? [];
    } catch {}
    try {
      const r = await d.prepare("SELECT slug, title, excerpt, reading_min, published_at FROM journal_posts WHERE published = 1 ORDER BY published_at DESC LIMIT 3").all<PostRow>();
      posts = r.results ?? [];
    } catch {}
    try {
      const r = await d.prepare("SELECT id, date, time, capacity, booked FROM tasting_sessions WHERE active = 1 AND booked < capacity AND date >= date('now') ORDER BY date LIMIT 1").first<SessionRow>();
      nextSession = r ?? null;
    } catch {}
  }

  const eur = (cents: number) => `€${(cents / 100).toFixed(2)}`;

  return (
    <>
      <FrontHero />

      <section id="story" className="story-strip">
        <div className="container">
          <p className="eyebrow">Single-estate, single-harvest, single-press</p>
          <h2>The grove our grandfather planted in 1962. Bottled for the first time in 2024.</h2>
          <div className="story-cards">
            {STORY.map((s) => (
              <div key={s.title} className="story-card">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="oils" className="oils-section">
        <div className="container">
          <p className="eyebrow">The oils</p>
          <h2>Three from the 2024 harvest.</h2>
          <div className="oils-grid">
            {oils.length > 0 ? oils.map((o) => (
              <article key={o.slug} className="oil-card">
                <div className="oil-card-img" style={{ backgroundImage: `url(/oils/${o.slug}.jpg)` }} aria-hidden="true" />
                <div className="oil-card-body">
                  <h3>{o.name}</h3>
                  <p className="muted">{o.hook}</p>
                  <div className="oil-card-foot">
                    <span className="price">{eur(o.price_cents)} <span className="muted">/ {o.size}</span></span>
                    <Link href={`/oils#${o.slug}`} className="btn btn-secondary btn-sm">Tell me more →</Link>
                  </div>
                </div>
              </article>
            )) : (
              <p className="muted">Catalogue is loading. Ask Olive — she has all the details.</p>
            )}
          </div>
          <div className="oils-cta-row">
            <Link href="/oils" className="btn btn-secondary">See all five SKUs →</Link>
          </div>
        </div>
      </section>

      <section id="tasting" className="tasting-cta">
        <div className="container container--narrow">
          <p className="eyebrow">Saturday tasting · €45 / person</p>
          <h2>90 minutes at the grove. Three oils, three breads, two cheeses, one bottle of estate red.</h2>
          <p className="muted">
            Saturdays at 10:30, May–October. Maximum 8 per session — the siblings host. {nextSession ? `Next session: ${nextSession.date}, ${nextSession.capacity - nextSession.booked} spots left.` : "Ask Olive for the calendar."}
          </p>
          <div className="hero-ctas" style={{ marginTop: "var(--space-5)" }}>
            <Link href="/#concierge" className="btn btn-primary btn-lg">Talk to Olive →</Link>
            <Link href="/grove" className="btn btn-secondary btn-lg">Read about the grove</Link>
          </div>
        </div>
      </section>

      <section id="journal-preview">
        <div className="container">
          <p className="eyebrow">Recent journal</p>
          <h2>Reading from the grove.</h2>
          <div className="journal-preview-grid">
            {posts.map((p) => (
              <Link key={p.slug} href={`/journal/${p.slug}`} className="journal-card">
                <h3>{p.title}</h3>
                <p className="muted">{p.excerpt}</p>
                <p className="meta">{new Date(p.published_at).toLocaleDateString("en-MT", { month: "long", day: "numeric", year: "numeric" })} · {p.reading_min ?? 5} min</p>
              </Link>
            ))}
          </div>
          <div className="oils-cta-row">
            <Link href="/journal" className="btn btn-secondary">All journal posts →</Link>
          </div>
        </div>
      </section>

      <section id="faq" style={{ background: "var(--color-surface)" }}>
        <div className="container container--narrow">
          <p className="eyebrow">FAQ</p>
          <h2>Quick answers.</h2>
          <dl className="faq-list">
            {FAQS.map((f) => (
              <div key={f.q} className="faq-item">
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="book" className="contact-section">
        <div className="container container--narrow">
          <p className="eyebrow">Tell us what you need</p>
          <h2>Wholesale, gift, or something else.</h2>
          <p className="muted">For one-bottle questions, talk to Olive above. For everything else (3+ litre wholesale, gift cards in bulk, press credentials), drop a note here.</p>
          <form action="/api/leads" method="post" className="form-grid">
            <ClientIdField />
            <div className="form-row">
              <label>Your name <input type="text" name="name" required autoComplete="name" /></label>
            </div>
            <div className="form-row">
              <label>Email <input type="email" name="email" required autoComplete="email" /></label>
            </div>
            <div className="form-row">
              <label>About
                <select name="project_type" required defaultValue="other">
                  <option value="wholesale">Wholesale (3+ litres)</option>
                  <option value="gift">Gift / corporate</option>
                  <option value="tasting">Tasting question</option>
                  <option value="other">Something else</option>
                </select>
              </label>
            </div>
            <div className="form-row">
              <label>Notes <textarea name="brief" rows={4} placeholder="Quantity, delivery date, anything else."></textarea></label>
            </div>
            <div className="form-row">
              <label className="checkbox">
                <input type="checkbox" name="consent" value="true" required />
                <span>OK to use my details to reply to this enquiry. I won't be added to any list.</span>
              </label>
            </div>
            <button type="submit" className="btn btn-primary">Send →</button>
          </form>
        </div>
      </section>
    </>
  );
}
