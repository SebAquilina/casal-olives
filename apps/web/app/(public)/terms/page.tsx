export const dynamic = "force-static";
export const runtime = "edge";
export const metadata = { title: "Terms", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <section>
      <div className="container container--narrow">
        <p className="eyebrow">Terms</p>
        <h1>Concept-site terms.</h1>
        <p>Casal Olives is a concept site by concierge.studio — a portfolio piece. No goods or services are sold. No tasting is actually booked. The contact form sends an email to a real inbox.</p>
        <h2>What you can expect</h2>
        <p>If you submit the contact form or request a tasting, we'll reply by email within 30 days. Your message reaches portfolio@concierge.studio.</p>
        <h2>What we'll never do</h2>
        <p>Take payment. Ship a bottle. Confirm a tasting time as if it were a real reservation.</p>
        <h2>Privacy</h2>
        <p>See <a href="/privacy">/privacy</a>.</p>
      </div>
    </section>
  );
}
