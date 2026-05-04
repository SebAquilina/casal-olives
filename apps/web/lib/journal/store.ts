import type { D1Database } from "@cloudflare/workers-types";

export type Post = { slug: string; title: string; excerpt: string; body_md: string; published: number; published_at: string; hero_image: string | null; reading_min: number | null };

function db(): D1Database | null {
  const env = process.env as unknown as { DB?: D1Database };
  const g = globalThis as unknown as { DB?: D1Database };
  return env.DB ?? g.DB ?? null;
}

export async function listPosts(opts: { publishedOnly?: boolean } = {}): Promise<Post[]> {
  const d = db(); if (!d) return [];
  const sql = opts.publishedOnly === false
    ? "SELECT * FROM journal_posts ORDER BY published_at DESC"
    : "SELECT * FROM journal_posts WHERE published = 1 ORDER BY published_at DESC";
  const r = await d.prepare(sql).all<Post>();
  return r.results ?? [];
}
export async function getPost(slug: string): Promise<Post | null> {
  const d = db(); if (!d) return null;
  return await d.prepare("SELECT * FROM journal_posts WHERE slug = ?").bind(slug).first<Post>() ?? null;
}
export async function upsertPost(p: Partial<Post> & { slug: string }): Promise<void> {
  const d = db(); if (!d) return;
  await d.prepare(`INSERT INTO journal_posts (slug, title, excerpt, body_md, published, hero_image, reading_min, published_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title, excerpt = excluded.excerpt, body_md = excluded.body_md,
      published = excluded.published, hero_image = excluded.hero_image,
      reading_min = excluded.reading_min, updated_at = CURRENT_TIMESTAMP`)
    .bind(
      p.slug, p.title ?? "", p.excerpt ?? "", p.body_md ?? "",
      p.published ?? 1, p.hero_image ?? null, p.reading_min ?? 5,
      p.published_at ?? new Date().toISOString()
    ).run();
}
