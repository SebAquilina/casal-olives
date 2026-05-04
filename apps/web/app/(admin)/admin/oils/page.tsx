import { listOils } from "@/lib/oils/store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function OilsAdmin() {
  const oils = await listOils(false);
  const eur = (c: number) => `€${(c / 100).toFixed(2)}`;
  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Catalogue</h1>
          <p className="muted">5 SKUs — three oils, one gift, one experience. Edit prices, descriptions, lab numbers, sort order.</p>
        </div>
      </header>
      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>SKU</th><th>Name</th><th>Kind</th><th>Price</th><th>Acidity</th><th>Polyphenols</th><th>Active</th>
            </tr>
          </thead>
          <tbody>
            {oils.map((o) => (
              <tr key={o.slug}>
                <td><code>{o.slug}</code></td>
                <td>{o.name}</td>
                <td>{o.kind}</td>
                <td>{eur(o.price_cents)}{o.size ? ` / ${o.size}` : ""}</td>
                <td>{o.acidity != null ? `${o.acidity}%` : "—"}</td>
                <td>{o.polyphenols != null ? `${o.polyphenols} mg/kg` : "—"}</td>
                <td>{o.active ? "yes" : <span className="muted">no</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted" style={{ marginTop: "var(--space-5)" }}>
        Editing UI is read-only on the standard tier. Update the <code>oils</code> table directly via wrangler / d1 console; the home + /oils pages refresh on the next deploy.
      </p>
    </>
  );
}
