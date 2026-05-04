import Link from "next/link";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function AdminIndex() {
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Casal Olives admin</h1>
          <p className="muted">Standard tier. Catalogue, tastings, journal, leads, conversations, real-time analytics.</p>
        </div>
      </header>
      <div className="admin-card">
        <p>Pick a section from the sidebar. The most-used are:</p>
        <ul>
          <li><Link href="/admin/live">Live</Link> — who's on the site right now.</li>
          <li><Link href="/admin/leads">Leads</Link> — every contact form submission with timeline.</li>
          <li><Link href="/admin/tastings">Tastings</Link> — Saturday sessions and their bookings.</li>
          <li><Link href="/admin/oils">Catalogue</Link> — the five SKUs.</li>
          <li><Link href="/admin/journal">Journal</Link> — six published posts.</li>
        </ul>
      </div>
    </>
  );
}
