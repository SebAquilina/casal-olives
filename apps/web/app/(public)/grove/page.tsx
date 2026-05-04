import Link from "next/link";

export const runtime = "edge";
export const dynamic = "force-static";

export const metadata = {
  title: "The grove — Casal Olives",
  description: "Twelve acres in Mġarr, planted 1962 by Toma Cassar. The press, the harvest, the oil, the siblings.",
  alternates: { canonical: "/grove" },
};

export default function GrovePage() {
  return (
    <>
      <section>
        <div className="container container--narrow">
          <p className="eyebrow">The grove</p>
          <h1>Twelve acres in Mġarr, planted 1962.</h1>
          <p className="lead muted">A long-form scroll about how Casal Olives came to bottle for the first time in 2024.</p>
        </div>
      </section>

      <article className="grove-article">
        <div className="container container--narrow">
          <h2>1. The grove (1962)</h2>
          <p>Toma Cassar bought 12 acres outside Mġarr in 1962, after coming back from sixteen years in Australia. He picked the land because the south-facing limestone slope drained well after a wet October — which most fields in the village didn't — and because his uncle was selling.</p>
          <p>He planted 320 trees that winter. 318 of them were Bidni — the indigenous Maltese cultivar that nobody else was planting any more, because the yield was lower than the imported Italian and Spanish varieties. Two rows were Carolea, mostly as an experiment, in case the Bidni didn't take.</p>
          <p>The Carolea took fine. The Bidni took better. Toma made oil for the family every November for the next 53 years, never bottled, never sold. When he died in 2015, the grove went to his daughter, Lena. When Lena retired in 2023, it went to her three children.</p>

          <h2>2. The press (2023)</h2>
          <p>The press in the grove's stone shed is from 1965. Two granite wheels around a central spindle, on a granite base, a hydraulic ram for the second-stage press. Toma installed it himself with two friends from the village; they were professional welders, not millers.</p>
          <p>By 2023 it had been idle for eight years. The bearings were rusted; the hydraulic seals were rotten; the granite was cracked in two places. We had a fork in the road: replace the whole thing with a modern hammer-mill (€42,000), or restore.</p>
          <p>We restored. Stefano — a Tuscan miller from Lucca, who runs a press not unlike ours — came over for two harvests, October 2023 and October 2024, and re-trained us on the older technique. The first commercial run was October 7, 2024.</p>
          <p>Why bother? Because a stone press doesn't aerate the paste. The oil comes out cooler (under 25°C — "cold-pressed" in the literal sense, not the marketing sense), with the polyphenols intact, oxidising slower in the bottle. We get less oil per kilo of fruit than we would with a hammer-mill — about 14 litres per 100kg, vs 16-18 — but the oil is better. We're fine with that trade.</p>

          <h2>3. The harvest</h2>
          <p>Eleven days, October 7 — November 7. Three siblings plus four neighbours plus, on the heaviest days, a couple of friends from the village.</p>
          <p>We pick Verde first — three days, October 7-10, on the south slope when the fruit is still green. The oil is intense: pepper, fresh-cut grass, a long throat-burn finish. It's the oil for finishing.</p>
          <p>We pick Riserva on a single day — October 19 — from two specific Carolea trees in the middle row. Eight hours of picking, pressed on its own. 220 bottles total, hand-numbered. This is the dish-you-want-to-remember oil.</p>
          <p>We pick Maturo last — November 3-7, when the fruit has darkened and the polyphenols have softened. The oil is mellower, almond-and-ripe-tomato, with enough smoke point to sauté with. This is the everyday bottle.</p>
          <p>Everything that's picked one day is pressed within four hours. We don't store fruit overnight.</p>

          <h2>4. The oil</h2>
          <p>The numbers on a bottle of Verde say: <strong>acidity 0.18%, polyphenols 412 mg/kg.</strong> Both are measurements you can do in a small lab; both tell you something useful.</p>
          <p>Acidity is a measure of free fatty acids in the oil. Below 0.8% the oil qualifies as "extra virgin"; below 0.3% is unusual; under 0.2% is what you get from cold-pressing fruit picked at the right ripeness, fast. Our three oils sit between 0.13% (Riserva) and 0.22% (Maturo).</p>
          <p>Polyphenols are the antioxidant compounds that produce the bitter, peppery sensation at the back of the throat. The European Food Safety Authority recognises that levels above 250 mg/kg "contribute to the protection of blood lipids from oxidative stress." Above 400 the oil keeps for a year on the shelf instead of six months.</p>
          <p>The smoke point — the temperature at which the oil starts to break down — depends on acidity. Our three oils smoke between 200°C (Verde, lowest acidity, highest polyphenols, NOT for cooking with) and 220°C (Maturo, the cooking oil).</p>
          <p>None of these numbers matter unless the oil tastes good. That's the floor. They matter as a way to tell you what you're paying for.</p>

          <h2>5. The siblings</h2>
          <p>Three of us run the place.</p>
          <p><strong>Nikol Cassar</strong> (eldest) handles the press. Trained as a mechanical engineer, retrained on the frantoio with Stefano. Knows the wheels by sound — can tell from the room next door if a batch is running too dry.</p>
          <p><strong>Andrei Cassar</strong> handles harvest logistics — the picking schedule, the pickers, the storage, the press timetable. Seven years as a chef in London before coming back, which is where the recipe-pairing instinct comes from.</p>
          <p><strong>Toni Cassar</strong> handles sales, bottling, and the journal. Used to run a bookshop in Sliema. Writes most of what you read on this site.</p>

          <p className="muted" style={{ marginTop: "var(--space-7)" }}>
            Concept site — founder portraits and biographies are illustrative.
            <Link href="/concept" style={{ marginLeft: "0.5rem" }}>What that means →</Link>
          </p>
        </div>
      </article>
    </>
  );
}
