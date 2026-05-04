"use client";
import { useEffect, useState } from "react";

export function ConceptBanner() {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    try {
      if (!document.cookie.includes("cv_concept_seen=1")) setHidden(false);
    } catch { /* ignore */ }
  }, []);
  if (hidden) return null;
  return (
    <div className="concept-banner" role="region" aria-label="Concept site disclosure">
      <p>
        Hey — quick heads up. <strong>Casal Olives</strong> is a concept site we built to show
        what concierge.studio can do at the <strong>Standard tier</strong>. Real concierge,
        real admin, real analytics. The brand and product list are invented for this demo;
        no oil is sold and no payment is taken. Click around freely — nothing here charges
        your card. Want one of these for your own business?{" "}
        <a href="https://concierge.studio" target="_blank" rel="noreferrer">See pricing →</a>
      </p>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => {
          document.cookie = "cv_concept_seen=1; path=/; max-age=31536000; SameSite=Lax";
          setHidden(true);
        }}
      >
        Got it
      </button>
    </div>
  );
}
