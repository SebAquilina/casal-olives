/**
 * Validate Casal Olives seed + system prompt — Phase 6 gate.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

let issues = 0;

function check(file: string, mustContain: string[]) {
  let body: string;
  try { body = readFileSync(resolve(file), "utf8"); }
  catch { console.error(`✗ ${file} — not readable`); issues++; return; }
  for (const m of mustContain) {
    if (!body.includes(m)) { console.error(`✗ ${file} — missing: "${m}"`); issues++; }
  }
}

check("components/site/Footer.tsx", ["Concept site by", "concierge.studio", "VAT/MBR"]);
check("components/site/ConceptBanner.tsx", ["Casal Olives", "concierge.studio"]);
check("lib/agent/system-prompt.ts", ["Olive", "Casal Olives", "concept site", "polyphenols"]);
check("lib/agent/kb.ts", ["Bidni", "Mġarr", "frantoio"]);
check("components/front/FrontHero.tsx", ["Ask Olive anything", "Casal Olives", "Olive"]);
check("app/(public)/page.tsx", ["FrontHero", "ClientIdField"]);
check("drizzle/migrations/0003_casal_olives.sql", ["oils", "tasting_sessions", "tasting_bookings", "journal_posts"]);

if (issues === 0) {
  console.log("[validate-content] OK"); process.exit(0);
} else {
  console.error(`[validate-content] FAILED — ${issues} issues`); process.exit(1);
}
