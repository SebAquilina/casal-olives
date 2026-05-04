import type { D1Database } from "@cloudflare/workers-types";

export type Oil = {
  slug: string; name: string; kind: "oil" | "gift" | "experience";
  price_cents: number; size: string | null; hook: string; description: string;
  acidity: number | null; polyphenols: number | null; harvest_dates: string | null;
  notes: string | null; active: number; sort_order: number;
};

function db(): D1Database | null {
  const env = process.env as unknown as { DB?: D1Database };
  const g = globalThis as unknown as { DB?: D1Database };
  return env.DB ?? g.DB ?? null;
}

export async function listOils(activeOnly = true): Promise<Oil[]> {
  const d = db(); if (!d) return [];
  const sql = activeOnly
    ? "SELECT * FROM oils WHERE active = 1 ORDER BY sort_order, name"
    : "SELECT * FROM oils ORDER BY sort_order, name";
  const r = await d.prepare(sql).all<Oil>();
  return r.results ?? [];
}
export async function getOil(slug: string): Promise<Oil | null> {
  const d = db(); if (!d) return null;
  return await d.prepare("SELECT * FROM oils WHERE slug = ?").bind(slug).first<Oil>() ?? null;
}
export async function upsertOil(o: Partial<Oil> & { slug: string }): Promise<void> {
  const d = db(); if (!d) return;
  await d.prepare(`INSERT INTO oils (slug, name, kind, price_cents, size, hook, description, acidity, polyphenols, harvest_dates, notes, active, sort_order, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name, kind = excluded.kind, price_cents = excluded.price_cents,
      size = excluded.size, hook = excluded.hook, description = excluded.description,
      acidity = excluded.acidity, polyphenols = excluded.polyphenols,
      harvest_dates = excluded.harvest_dates, notes = excluded.notes,
      active = excluded.active, sort_order = excluded.sort_order, updated_at = CURRENT_TIMESTAMP`)
    .bind(
      o.slug, o.name ?? "", o.kind ?? "oil", o.price_cents ?? 0, o.size ?? null,
      o.hook ?? "", o.description ?? "", o.acidity ?? null, o.polyphenols ?? null,
      o.harvest_dates ?? null, o.notes ?? null, o.active ?? 1, o.sort_order ?? 0
    ).run();
}
