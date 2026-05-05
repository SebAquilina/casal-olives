import Link from "next/link";
import type { D1Database } from "@cloudflare/workers-types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Grove tastings — Casal Olives",
  description: "Saturday morning tastings at the grove. 90 minutes, 8 seats, three oils, walk through the rows.",
  alternates: { canonical: "/tastings" },
};

function db(): D1Database | null {
  const env = process.env as unknown as { DB?: D1Database };
  const g = globalThis as unknown as { DB?: D1Database };
  return env.DB ?? g.DB ?? null;
}

type Session = { id: string; date: string; time: string; capacity: number; booked: number; notes: string | null };

export default async function Tastings() {
  const d = db();
  let sessions: Session[] = [];
  if (d) {
    try {
      const r = await d.prepare("SELECT id, date, time, capacity, booked, notes FROM tasting_sessions WHERE active = 1 AND date >= date('now') ORDER BY date LIMIT 12").all<Session>();
      sessions = r.results ?? [];
    } catch {}
  }
  return (
    <>
      <section style={{ padding: "var(--space-9) 0 var(--space-6)" }}>
        <div className="container container--narrow">
          <p className="eyebrow">Tastings</p>
          <h1 style={{ marginTop: "var(--space-3)" }}>Saturday mornings at the grove.</h1>
          <p className="lead muted" style={{ marginTop: "var(--space-4)" }}>90 minutes, 8 seats, three oils, a walk through the rows. €35 per person; free if you've ordered a Riserva in the last twelve months.</p>
        </div>
      </section>

      <section>
        <div className="container container--narrow">
          <p className="eyebrow">Format</p>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "var(--space-4)" }}>
            <li style={{ borderTop: "1px solid var(--color-line)", padding: "var(--space-4) 0" }}><strong>10:30 — Walk to the south slope.</strong> Twenty minutes among the trees. The Bidni rows are 60+ years old.</li>
            <li style={{ borderTop: "1px solid var(--color-line)", padding: "var(--space-4) 0" }}><strong>10:50 — In the press house.</strong> The 1965 frantoio in motion. We mill once a week even off-season.</li>
            <li style={{ borderTop: "1px solid var(--color-line)", padding: "var(--space-4) 0" }}><strong>11:10 — Tasting on the terrace.</strong> Verde, Maturo, Riserva, side by side. With bread, tomato, and one runny egg.</li>
            <li style={{ borderTop: "1px solid var(--color-line)", padding: "var(--space-4) 0", borderBottom: "1px solid var(--color-line)" }}><strong>11:45 — Questions and orders.</strong> No pressure to buy.</li>
          </ul>
        </div>
      </section>

      <section style={{ background: "var(--color-surface)" }}>
        <div className="container container--narrow">
          <p className="eyebrow">Upcoming sessions</p>
          <h2 style={{ marginTop: "var(--space-2)" }}>Twelve Saturdays.</h2>
          {sessions.length === 0 ? (
            <p className="muted" style={{ marginTop: "var(--space-4)" }}>No upcoming sessions found. Ask Olive — she may have an off-schedule slot.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, marginTop: "var(--space-4)" }}>
              {sessions.map((s) => {
                const free = s.capacity - s.booked;
                const date = new Date(s.date).toLocaleDateString("en-MT", { weekday: "long", day: "numeric", month: "long" });
                return (
                  <li key={s.id} style={{ borderTop: "1px solid var(--color-line)", padding: "var(--space-4) 0", display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "var(--space-4)", alignItems: "baseline" }}>
                    <strong>{date}</strong>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>{s.time}</span>
                    <span className="muted" style={{ fontSize: "0.875rem" }}>{free} of {s.capacity} free</span>
                    <Link href="/#concierge" className="btn btn-secondary btn-sm">Book</Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section>
        <div className="container container--narrow" style={{ textAlign: "center" }}>
          <h2>Talk to Olive.</h2>
          <p className="muted" style={{ marginTop: "var(--space-3)" }}>Group of more than four? Off-Saturday request? Ask the concierge.</p>
          <Link href="/#concierge" className="btn btn-primary btn-lg" style={{ marginTop: "var(--space-5)" }}>Ask Olive →</Link>
        </div>
      </section>
    </>
  );
}
