export const dynamic = "force-static";
import Link from "next/link";

export const runtime = "edge";
export const metadata = { title: "Checkout — Casal Olives", alternates: { canonical: "/checkout" } };

export default function CheckoutPage() {
  return (
    <section>
      <div className="container container--narrow" style={{ textAlign: "center", paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}>
        <p className="eyebrow">Checkout</p>
        <h1>Checkout is disabled.</h1>
        <p className="lead">Casal Olives is a concept site by concierge.studio — no oil is actually sold here. To find a real Maltese olive-oil producer, ask Olive (she'll point you at one).</p>
        <div className="hero-ctas" style={{ justifyContent: "center", marginTop: "var(--space-6)" }}>
          <Link href="/#concierge" className="btn btn-primary">Talk to Olive →</Link>
          <Link href="/concept" className="btn btn-secondary">What is this site?</Link>
        </div>
      </div>
    </section>
  );
}
