import type { D1Database } from "@cloudflare/workers-types";
import { z } from "zod";

export type Session = { id: string; date: string; time: string; capacity: number; booked: number; notes: string | null; active: number };
export type Booking = { id: string; session_id: string; name: string; email: string; party_size: number; notes: string | null; status: string; created_at: string };

function db(): D1Database | null {
  const env = process.env as unknown as { DB?: D1Database };
  const g = globalThis as unknown as { DB?: D1Database };
  return env.DB ?? g.DB ?? null;
}

export async function listSessions(opts: { from?: string; to?: string; activeOnly?: boolean } = {}): Promise<Session[]> {
  const d = db(); if (!d) return [];
  const conds: string[] = []; const args: unknown[] = [];
  if (opts.activeOnly !== false) conds.push("active = 1");
  if (opts.from) { conds.push("date >= ?"); args.push(opts.from); }
  if (opts.to)   { conds.push("date <= ?"); args.push(opts.to); }
  const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
  const r = await d.prepare(`SELECT * FROM tasting_sessions ${where} ORDER BY date, time`).bind(...args).all<Session>();
  return r.results ?? [];
}

export async function listAvailableSessions(from: string, to?: string): Promise<Session[]> {
  const d = db(); if (!d) return [];
  const r = to
    ? await d.prepare("SELECT * FROM tasting_sessions WHERE active = 1 AND booked < capacity AND date >= ? AND date <= ? ORDER BY date, time").bind(from, to).all<Session>()
    : await d.prepare("SELECT * FROM tasting_sessions WHERE active = 1 AND booked < capacity AND date >= ? ORDER BY date, time LIMIT 8").bind(from).all<Session>();
  return r.results ?? [];
}

export const BookingInput = z.object({
  session_id: z.string().regex(/^ts-\d{4}-\d{2}-\d{2}$/),
  name: z.string().min(2).max(120),
  email: z.string().email().max(254),
  party_size: z.number().int().min(1).max(8),
  notes: z.string().max(500).optional(),
});
export type BookingInput = z.infer<typeof BookingInput>;

export async function createBooking(input: BookingInput): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const d = db(); if (!d) return { ok: false, error: "no_db" };
  // Confirm capacity
  const s = await d.prepare("SELECT capacity, booked FROM tasting_sessions WHERE id = ? AND active = 1").bind(input.session_id).first<{ capacity: number; booked: number }>();
  if (!s) return { ok: false, error: "session_not_found" };
  if (s.booked + input.party_size > s.capacity) return { ok: false, error: "session_full" };
  const id = `tb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await d.batch([
    d.prepare("INSERT INTO tasting_bookings (id, session_id, name, email, party_size, notes, status) VALUES (?, ?, ?, ?, ?, ?, 'requested')")
     .bind(id, input.session_id, input.name, input.email, input.party_size, input.notes ?? null),
    d.prepare("UPDATE tasting_sessions SET booked = booked + ? WHERE id = ?").bind(input.party_size, input.session_id),
  ]);
  return { ok: true, id };
}

export async function listBookings(): Promise<Booking[]> {
  const d = db(); if (!d) return [];
  const r = await d.prepare("SELECT * FROM tasting_bookings ORDER BY created_at DESC LIMIT 200").all<Booking>();
  return r.results ?? [];
}
