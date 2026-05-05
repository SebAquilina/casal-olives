import Link from "next/link";
import { notFound } from "next/navigation";
import type { D1Database } from "@cloudflare/workers-types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function db(): D1Database | null {
  const env = process.env as unknown as { DB?: D1Database };
  const g = globalThis as unknown as { DB?: D1Database };
  return env.DB ?? g.DB ?? null;
}

type Oil = {
  slug: string;
  name: string;
  price_cents: number;
  size: string | null;
  hook: string | null;
  description: string | null;
  acidity: number | null;
  polyphenols: number | null;
  harvest_dates: string | null;
};

const PAIRINGS: Record<string, { food: string; note: string }[]> = {
  verde: [
    { food: "Tomato + flaky salt + sourdough", note: "The defining test. Verde holds its own against acidity." },
    { food: "Grilled white fish (sea bream, sea bass)", note: "Drizzled raw at the table. Cuts the fattiness without flattening the dish." },
    { food: "Beef carpaccio + parmesan + pepper", note: "Verde's pepper notes echo the dish's own — they reinforce each other." },
    { food: "Burrata + green peach + basil", note: "Pour generously. Summer dish; needs a finishing oil with throat-burn." },
  ],
  maturo: [
    { food: "Roasted root vegetables — carrot, parsnip, beet", note: "Maturo's mellower fruit doesn't fight the caramel from roasting." },
    { food: "Soft-cooked egg on toast", note: "A weekday breakfast. Pour over a still-runny yolk." },
    { food: "Soft cheese + honeycomb", note: "Maturo bridges the sweet-savoury gap; verde would be too aggressive." },
    { food: "Pumpkin or bean soup", note: "Stir in a tablespoon at the end of cooking." },
  ],
  riserva: [
    { food: "Aged hard cheese — pecorino, Maltese ġbejna", note: "A small pour. Riserva's complexity matches the cheese's age." },
    { food: "Steak tartare", note: "A finishing pour — never to dress raw meat aggressively." },
    { food: "Truffle pasta", note: "When the sauce is already this loud, Riserva is the only oil that holds." },
    { food: "On its own with bread", note: "How the head-press tasted it the day it came out of the press." },
  ],
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const d = db();
  if (!d) return { title: "Oil" };
  const o = await d.prepare("SELECT name, hook FROM oils WHERE slug = ?").bind(params.slug).first<Oil>().catch(() => null);
  if (!o) return { title: "Not found" };
  return {
    title: `${o.name}`,
    description: o.hook ?? undefined,
    alternates: { canonical: `/oils/${params.slug}` },
  };
}

export default async function OilDetail({ params }: { params: { slug: string } }) {
  const d = db();
  if (!d) notFound();
  const o = await d.prepare("SELECT slug, name, price_cents, size, hook, description, acidity, polyphenols, harvest_dates FROM oils WHERE slug = ? AND active = 1").bind(params.slug).first<Oil>().catch(() => null);
  if (!o) notFound();

  const pairings = PAIRINGS[o.slug] ?? [];
  const r = await d.prepare("SELECT slug, name, price_cents, size, hook FROM oils WHERE slug != ? AND active = 1 AND kind = 'oil' ORDER BY sort_order LIMIT 2").bind(o.slug).all<Oil>().catch(() => null);
  const others: Oil[] = r?.results ?? [];

  return (
    <>
      <section style={{ padding: "var(--space-9) 0 var(--space-5)" }}>
        <div className="container">
          <p className="eyebrow">Oils · {o.harvest_dates ? `Harvested ${o.harvest_dates}` : "Single estate"}</p>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginTop: "var(--space-3)" }}>{o.name}.</h1>
          {o.hook && <p className="lead muted" style={{ marginTop: "var(--space-4)", maxWidth: "44rem" }}>{o.hook}</p>}
        </div>
      </section>

      <section>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
          <div className="oil-detail-img" style={{ backgroundImage: `url(/oils/${o.slug}.svg)`, aspectRatio: "3/4" }} aria-hidden="true" />
          <div>
            <p className="eyebrow">Bottle</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontStyle: "italic", marginTop: "0.4rem" }}>{o.size}</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "1.5rem", marginTop: "var(--space-3)", color: "var(--color-accent)" }}>€{(o.price_cents/100).toFixed(2)}</p>

            <table className="lab-table" style={{ marginTop: "var(--space-5)", width: "100%" }}>
              <tbody>
                {o.acidity != null && <tr><th>Acidity</th><td>{o.acidity}%</td></tr>}
                {o.polyphenols != null && <tr><th>Polyphenols</th><td>{o.polyphenols} mg/kg</td></tr>}
                {o.harvest_dates && <tr><th>Harvest</th><td>{o.harvest_dates}</td></tr>}
                <tr><th>Cultivar</th><td>{o.slug === "riserva" ? "Carolea (Tuscan)" : "Bidni (Maltese)"}</td></tr>
                <tr><th>Press</th><td>1965 stone frantoio · cold-pressed within 4h</td></tr>
              </tbody>
            </table>

            <p style={{ marginTop: "var(--space-5)" }}>
              <Link href="/#concierge" className="btn btn-primary">Talk to Olive about ordering →</Link>
            </p>
          </div>
        </div>
      </section>

      {o.description && (
        <section>
          <div className="container container--narrow">
            <p className="eyebrow">Tasting</p>
            <h2 style={{ marginTop: "var(--space-2)" }}>How it tastes.</h2>
            <p className="lead" style={{ marginTop: "var(--space-4)", lineHeight: 1.65, fontSize: "1.0625rem" }}>{o.description}</p>
          </div>
        </section>
      )}

      {pairings.length > 0 && (
        <section style={{ background: "var(--color-surface)" }}>
          <div className="container container--narrow">
            <p className="eyebrow">Food pairings</p>
            <h2 style={{ marginTop: "var(--space-2)" }}>What to serve it with.</h2>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "var(--space-5)" }}>
              {pairings.map((p, i) => (
                <li key={i} style={{ borderTop: "1px solid var(--color-line)", padding: "var(--space-4) 0" }}>
                  <strong style={{ fontSize: "1.0625rem" }}>{p.food}</strong>
                  <p className="muted" style={{ marginTop: "0.4rem" }}>{p.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <div className="container">
            <p className="eyebrow">Other oils</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-5)", marginTop: "var(--space-5)" }}>
              {others.map((x) => (
                <Link key={x.slug} href={`/oils/${x.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="oil-card-img" style={{ backgroundImage: `url(/oils/${x.slug}.svg)`, aspectRatio: "3/4" }} aria-hidden="true" />
                  <h3 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", marginTop: "var(--space-3)" }}>{x.name}</h3>
                  <p className="muted">{x.hook}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
