export const dynamic = "force-static";
import Link from "next/link";

export const runtime = "edge";
export const metadata = { title: "Concept — Casal Olives", alternates: { canonical: "/concept" } };

export default function ConceptPage() {
  return (
    <section>
      <div className="container container--narrow">
        <p className="eyebrow">Concept site</p>
        <h1>What you're looking at.</h1>
        <p>
          Casal Olives is a concept site by{" "}
          <a href="https://concierge.studio" target="_blank" rel="noreferrer">concierge.studio</a>.
          The brand, the siblings, the harvest dates, the polyphenol numbers — all invented for
          this portfolio piece. Everything else is exactly what a real Casal Olives client would
          get on the Standard tier.
        </p>
        <p>
          What's <strong>real</strong>: the concierge, the admin, the analytics, the journal CMS,
          the contact form. Olive runs on Gemini Flash-Lite. The contact form lands at{" "}
          <a href="mailto:portfolio@concierge.studio">portfolio@concierge.studio</a>. /admin/* is
          a working Shopify-grade panel.
        </p>
        <p>
          What's <strong>not</strong>: no oil is sold. No payment is taken. No tasting is booked
          (the request lands in the inbox; no card is charged). The lab numbers are realistic for
          Bidni cultivar oil but not from a real lab test on a real bottle.
        </p>
        <p>
          Want one of these for your own business? <Link href="https://concierge.studio">See pricing →</Link>
        </p>
      </div>
    </section>
  );
}
