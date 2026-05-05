import Link from "next/link";
import type { D1Database } from "@cloudflare/workers-types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata = { title: "Journal", alternates: { canonical: "/journal" } };

function db(): D1Database | null {
  const env = process.env as unknown as { DB?: D1Database };
  const g = globalThis as unknown as { DB?: D1Database };
  return env.DB ?? g.DB ?? null;
}

export default async function JournalIndex() {
  const d = db();
  type Row = { slug: string; title: string; excerpt: string; reading_min: number | null; published_at: string };
  let rows: Row[] = [];
  if (d) {
    try {
      const r = await d.prepare("SELECT slug, title, excerpt, reading_min, published_at FROM journal_posts WHERE published = 1 ORDER BY published_at DESC").all<Row>();
      rows = r.results ?? [];
    } catch {}
  }
  return (
    <section>
      <div className="container container--narrow">
        <p className="eyebrow">Journal</p>
        <h1>Reading from the grove.</h1>
        <p className="lead muted">Toni writes most of these. Six posts at the moment; more during harvest.</p>
        <ul className="journal-list">
          {rows.map((p) => (
            <li key={p.slug} className="journal-list-item">
              <Link href={`/journal/${p.slug}`}>
                <h2>{p.title}</h2>
                <p className="muted">{p.excerpt}</p>
                <p className="meta">{new Date(p.published_at).toLocaleDateString("en-MT", { dateStyle: "long" })} · {p.reading_min ?? 5} min read</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
