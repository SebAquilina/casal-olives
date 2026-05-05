import Link from "next/link";
import { ClientIdField } from "@/components/analytics/ClientIdField";

export const runtime = "edge";
export const dynamic = "force-static";

export const metadata = { title: "Contact", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <>
      <section>
        <div className="container container--narrow">
          <p className="eyebrow">Contact</p>
          <h1>Talk to Olive — or write.</h1>
          <p className="lead muted">For one-bottle questions, the concierge above is faster. For wholesale, gifts, or press credentials, the form lands directly with us.</p>
          <Link href="/#concierge" className="btn btn-primary">Talk to Olive →</Link>
        </div>
      </section>

      <section>
        <div className="container container--narrow">
          <h2>Or send a note</h2>
          <form action="/api/leads" method="post" className="form-grid">
            <ClientIdField />
            <div className="form-row"><label>Your name <input type="text" name="name" required autoComplete="name" /></label></div>
            <div className="form-row"><label>Email <input type="email" name="email" required autoComplete="email" /></label></div>
            <div className="form-row">
              <label>About
                <select name="project_type" required defaultValue="other">
                  <option value="wholesale">Wholesale (3+ litres)</option>
                  <option value="gift">Gift / corporate</option>
                  <option value="tasting">Tasting question</option>
                  <option value="other">Something else</option>
                </select>
              </label>
            </div>
            <div className="form-row"><label>Notes <textarea name="brief" rows={5} placeholder="Quantity, delivery date, anything else."></textarea></label></div>
            <div className="form-row">
              <label className="checkbox">
                <input type="checkbox" name="consent" value="true" required />
                <span>OK to use my details to reply to this enquiry. I won't be added to any list.</span>
              </label>
            </div>
            <button type="submit" className="btn btn-primary">Send →</button>
          </form>
          <p className="muted" style={{ marginTop: "var(--space-5)" }}>
            Form lands at <a href="mailto:portfolio@concierge.studio">portfolio@concierge.studio</a> with a [Casal Olives] prefix.
          </p>
        </div>
      </section>
    </>
  );
}
