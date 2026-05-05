import Link from "next/link";
import type { D1Database } from "@cloudflare/workers-types";
import { notFound } from "next/navigation";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function db(): D1Database | null {
  const env = process.env as unknown as { DB?: D1Database };
  const g = globalThis as unknown as { DB?: D1Database };
  return env.DB ?? g.DB ?? null;
}

// Tiny Markdown→HTML — handles ## headings + paragraphs + bold + italic
function md(s: string): string {
  return s
    .split(/\n{2,}/)
    .map((block) => {
      if (block.startsWith("# ")) return `<h2>${esc(block.slice(2))}</h2>`;
      if (block.startsWith("## ")) return `<h3>${esc(block.slice(3))}</h3>`;
      const escaped = esc(block).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
      return `<p>${escaped.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}
function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

type Row = { slug: string; title: string; excerpt: string; body_md: string; reading_min: number | null; published_at: string };

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const d = db();
  if (!d) return { title: "Journal" };
  try {
    const r = await d.prepare("SELECT title, excerpt FROM journal_posts WHERE slug = ? AND published = 1").bind(params.slug).first<{ title: string; excerpt: string }>();
    if (r) return { title: `${r.title}`, description: r.excerpt, alternates: { canonical: `/journal/${params.slug}` } };
  } catch {}
  return { title: "Journal" };
}

export default async function JournalPost({ params }: { params: { slug: string } }) {
  const d = db();
  let post: Row | null = null;
  if (d) {
    try {
      post = await d.prepare("SELECT * FROM journal_posts WHERE slug = ? AND published = 1").bind(params.slug).first<Row>();
    } catch {}
  }
  if (!post) notFound();
  return (
    <article className="journal-post">
      <div className="container container--narrow">
        <p className="eyebrow"><Link href="/journal" className="muted">← Journal</Link></p>
        <p className="meta">{new Date(post.published_at).toLocaleDateString("en-MT", { dateStyle: "long" })} · {post.reading_min ?? 5} min read</p>
        <div dangerouslySetInnerHTML={{ __html: md(post.body_md) }} />
      </div>
    </article>
  );
}
