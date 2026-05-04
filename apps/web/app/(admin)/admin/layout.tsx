import Link from "next/link";

export const runtime = "edge";

export const metadata = { title: "Admin — Casal Olives", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <h2>Casal Olives</h2>
        <Link href="/admin/live">Live</Link>
        <Link href="/admin/leads">Leads</Link>
        <Link href="/admin/transcripts">Conversations</Link>
        <Link href="/admin/oils">Catalogue</Link>
        <Link href="/admin/tastings">Tastings</Link>
        <Link href="/admin/journal">Journal</Link>
        <Link href="/admin/insights">Insights</Link>
        <Link href="/admin/analytics">Analytics</Link>
        <Link href="/admin/agent">Concierge</Link>
        <Link href="/admin/settings">Settings</Link>
        <a href="/" target="_blank" rel="noreferrer" style={{ marginTop: "var(--space-5)" }}>Open public →</a>
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  );
}
