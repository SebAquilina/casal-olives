import Link from "next/link";
import type { D1Database } from "@cloudflare/workers-types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Oils — Casal Olives",
  description: "Verde, Maturo, Riserva — three oils from a single estate in Mġarr. Plus the Duo gift pairing and Saturday tasting.",
  alternates: { canonical: "/oils" },
};

function db(): D1Database | null {
  const env = process.env as unknown as { DB?: D1Database };
  const g = globalThis as unknown as { DB?: D1Database };
  return env.DB ?? g.DB ?? null;
}

const PAIRING = [
  { use: "Salads, raw fish",         verde: "✓ best", maturo: "✓",       riserva: "— too good" },
  { use: "Roasting vegetables",      verde: "—",      maturo: "✓ best",  riserva: "—" },
  { use: "Finishing pasta, soups",   verde: "✓",      maturo: "✓",       riserva: "✓ best" },
  { use: "Bread + a pinch of salt",  verde: "✓",      maturo: "✓",       riserva: "✓ best" },
  { use: "Cooking with heat",        verde: "—",      maturo: "✓",       riserva: "—" },
];

const REVIEWS = [
  { name: "Chef R., Sliema",     body: "Verde on a tomato salad in July is the closest I've come to working in Italy without the flight.", role: "concept review" },
  { name: "M. Borg, home cook, Mosta", body: "We finished the Duo in three weeks. Bought another Maturo within the hour.", role: "concept review" },
  { name: "S. Vella, home cook, St Julian's", body: "Riserva is for a dish you cooked from scratch. It rewards the effort.", role: "concept review" },
  { name: "L. Hartmann, cookbook author, London", body: "The Bidni cultivar tastes nothing like a Tuscan oil. That's the point.", role: "concept review" },
  { name: "K. Schulz, specialty store, Berlin", body: "Polyphenols 580 on the Riserva is real, and it shows in the throat-burn.", role: "concept review" },
  { name: "C. Camilleri, neighbour, Mġarr", body: "I've watched these trees produce for forty years. The siblings are doing it right.", role: "concept review" },
];

export default async function OilsPage() {
  const d = db();
  type Row = { slug: string; name: string; kind: string; price_cents: number; size: string | null; hook: string; description: string; acidity: number | null; polyphenols: number | null; harvest_dates: string | null };
  let rows: Row[] = [];
  if (d) {
    try {
      const r = await d.prepare("SELECT * FROM oils WHERE active = 1 ORDER BY sort_order").all<Row>();
      rows = r.results ?? [];
    } catch {}
  }
  const eur = (c: number) => `€${(c / 100).toFixed(2)}`;
  const oils = rows.filter((r) => r.kind === "oil");
  const others = rows.filter((r) => r.kind !== "oil");

  return (
    <>
      <section>
        <div className="container">
          <p className="eyebrow">Oils</p>
          <h1>Five from the 2024 harvest.</h1>
          <p className="lead muted">Three single-cultivar oils, the Duo gift pairing, and the Saturday tasting at the grove. Prices include 18% VAT — concept-site illustration; no real VAT collected.</p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="oils-detail-grid">
            {rows.map((r) => (
              <article id={r.slug} key={r.slug} className="oil-detail">
                <div className="oil-detail-img" style={{ backgroundImage: `url(/oils/${r.slug}.jpg)` }} aria-hidden="true" />
                <div className="oil-detail-body">
                  <p className="eyebrow">{r.kind === "oil" ? "Oil" : r.kind === "gift" ? "Gift" : "Experience"}</p>
                  <h2 style={{ marginTop: "var(--space-2)" }}>{r.name}</h2>
                  <p className="muted">{r.hook}</p>
                  <p>{r.description}</p>
                  {(r.acidity || r.polyphenols || r.harvest_dates) && (
                    <table className="lab-table">
                      <tbody>
                        {r.harvest_dates && <tr><th>Picked</th><td>{r.harvest_dates}</td></tr>}
                        {r.acidity != null && <tr><th>Acidity</th><td>{r.acidity}%</td></tr>}
                        {r.polyphenols != null && <tr><th>Polyphenols</th><td>{r.polyphenols} mg/kg</td></tr>}
                      </tbody>
                    </table>
                  )}
                  <div className="oil-card-foot">
                    <span className="price">{eur(r.price_cents)}{r.size ? <span className="muted"> / {r.size}</span> : null}</span>
                    <Link href="/#concierge" className="btn btn-primary btn-sm">Tell Olive →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--color-surface)" }}>
        <div className="container container--narrow">
          <p className="eyebrow">Which oil for what dish</p>
          <h2>The pairing table.</h2>
          <table className="rates-table">
            <thead>
              <tr><th>Use</th><th>Verde</th><th>Maturo</th><th>Riserva</th></tr>
            </thead>
            <tbody>
              {PAIRING.map((p) => (
                <tr key={p.use}>
                  <th>{p.use}</th>
                  <td>{p.verde}</td>
                  <td>{p.maturo}</td>
                  <td>{p.riserva}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted" style={{ marginTop: "var(--space-4)" }}>Lab-test-style numbers (acidity, polyphenols) are illustrative for the concept site — realistic for the cultivar but not from a real lab test on a real bottle. See <Link href="/concept">the concept page</Link>.</p>
        </div>
      </section>

      <section>
        <div className="container container--narrow">
          <p className="eyebrow">Concept reviews</p>
          <h2>What people say.</h2>
          <p className="muted">All six are illustrative — written for this concept site, not real customers.</p>
          <ul className="reviews-list">
            {REVIEWS.map((r) => (
              <li key={r.name} className="review">
                <p>"{r.body}"</p>
                <p className="meta">— {r.name} <span className="muted">· {r.role}</span></p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
