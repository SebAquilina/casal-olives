import Link from "next/link";
import { listSessions, listBookings } from "@/lib/tastings/store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function TastingsAdmin() {
  const sessions = await listSessions({ activeOnly: false });
  const bookings = await listBookings();
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Tastings</h1>
          <p className="muted">Saturday tasting sessions + their bookings. Concept site — no payment is taken.</p>
        </div>
      </header>

      <section className="admin-card">
        <h2 style={{ marginTop: 0 }}>Sessions</h2>
        <table className="admin-table">
          <thead><tr><th>Date</th><th>Time</th><th>Capacity</th><th>Booked</th><th>Notes</th><th>Active</th></tr></thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <td>{s.date}</td>
                <td>{s.time}</td>
                <td>{s.capacity}</td>
                <td>{s.booked > 0 ? <strong>{s.booked}</strong> : <span className="muted">0</span>}</td>
                <td className="muted">{s.notes ?? "—"}</td>
                <td>{s.active ? "yes" : <span className="muted">no</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-card">
        <h2 style={{ marginTop: 0 }}>Recent bookings ({bookings.length})</h2>
        {bookings.length === 0 ? (
          <p className="muted">No bookings yet. They'll populate as visitors ask Olive to hold a Saturday spot.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>When</th><th>Session</th><th>Name</th><th>Email</th><th>Party</th><th>Status</th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{new Date(b.created_at).toLocaleString("en-MT")}</td>
                  <td>{b.session_id}</td>
                  <td>{b.name}</td>
                  <td className="muted">{b.email}</td>
                  <td>{b.party_size}</td>
                  <td><span className={`badge badge--${b.status === "confirmed" ? "won" : "qualified"}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
