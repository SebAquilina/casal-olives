import { listPosts } from "@/lib/journal/store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function JournalAdmin() {
  const posts = await listPosts({ publishedOnly: false });
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Journal</h1>
          <p className="muted">{posts.length} posts. Markdown body, server-rendered. Toni edits these.</p>
        </div>
      </header>
      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Slug</th><th>Published</th><th>Reading time</th><th>Excerpt</th></tr></thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.slug}>
                <td><strong>{p.title}</strong></td>
                <td><code>{p.slug}</code></td>
                <td>{p.published ? new Date(p.published_at).toLocaleDateString("en-MT") : <span className="muted">draft</span>}</td>
                <td>{p.reading_min ?? "—"} min</td>
                <td className="muted" style={{ maxWidth: 380 }}>{p.excerpt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted" style={{ marginTop: "var(--space-5)" }}>Posts are sourced from the migration on the standard tier. Replace with a markdown editor when needed.</p>
    </>
  );
}
