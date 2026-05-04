-- Casal Olives — Standard tier additions on top of skill schema (0001_init + 0002_analytics)

CREATE TABLE IF NOT EXISTS oils (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'oil',          -- 'oil' | 'gift' | 'experience'
  price_cents INTEGER NOT NULL,
  size TEXT,                                  -- "250ml", "500ml", "per person"
  hook TEXT NOT NULL,                         -- one-line description on cards
  description TEXT NOT NULL,                  -- full prose for /oils/[slug]
  acidity REAL,                               -- 0.18 etc
  polyphenols INTEGER,                        -- 412 mg/kg
  harvest_dates TEXT,                         -- "October 7-10"
  notes TEXT,                                 -- tasting notes, free-form
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasting_sessions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,                         -- ISO date "2026-05-23"
  time TEXT NOT NULL DEFAULT '10:30',
  capacity INTEGER NOT NULL DEFAULT 8,
  booked INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tasting_sessions_date ON tasting_sessions(date);

CREATE TABLE IF NOT EXISTS tasting_bookings (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  party_size INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'requested',  -- requested | confirmed | declined | cancelled
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES tasting_sessions(id)
);
CREATE INDEX IF NOT EXISTS idx_tasting_bookings_session ON tasting_bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_tasting_bookings_email ON tasting_bookings(email);

CREATE TABLE IF NOT EXISTS journal_posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body_md TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1,
  published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hero_image TEXT,
  reading_min INTEGER,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_journal_posts_published ON journal_posts(published, published_at DESC);

-- A simple cart store (per-cc_cid; client_id binds to lead at checkout)
CREATE TABLE IF NOT EXISTS carts (
  client_id TEXT PRIMARY KEY,
  items_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed five SKUs
INSERT OR REPLACE INTO oils (slug, name, kind, price_cents, size, hook, description, acidity, polyphenols, harvest_dates, sort_order) VALUES
('verde',   'Verde — Early Harvest 2024', 'oil', 1800, '250ml',
 'The oil for finishing — peppery, fresh-cut grass, long throat-burn finish.',
 'Picked October 7–10 from the south slope, when the fruit is still green. Cold-pressed within four hours of picking at our restored 1965 stone frantoio. Acidity 0.18%, polyphenols 412 mg/kg — both well into the "high" range. Use it raw: drizzled on salads, finished over white fish, on toasted bread with a pinch of flaky salt.',
 0.18, 412, 'October 7-10', 1),
('maturo',  'Maturo — Late Harvest 2024', 'oil', 1600, '250ml',
 'The oil for cooking with — mellow, almond, a touch of ripe tomato.',
 'Picked November 3–7, when the fruit has darkened. Mellower than Verde, with notes of almond and ripe tomato. Acidity 0.22%. The smoke point is high enough to sauté onions without breaking the oil down; the flavour is gentle enough to dress a salad. This is the everyday bottle.',
 0.22, 286, 'November 3-7', 2),
('riserva', 'Riserva — Limited 2024', 'oil', 3800, '500ml',
 'Two trees. 220 bottles. Numbered. The oil for the dish you want to remember.',
 'The middle row of the grove, two trees, eight hours of picking on October 19. We pressed them on their own. 220 bottles total, hand-numbered. Acidity 0.13%, polyphenols 580 mg/kg. The aroma is herbaceous and complex — green almond, artichoke, a faint mineral edge from the south-slope stone. Open it for the dish you want to remember.',
 0.13, 580, 'October 19', 3),
('duo',     'The Duo', 'gift', 3200, 'set',
 'Verde + Maturo, in a linen wrap, harvest dates handwritten.',
 'One bottle of Verde, one of Maturo, wrapped together in unbleached Maltese linen. The card inside has the harvest dates written by hand. Ships in a single mailer; no padding waste. The default gift answer when you''re not sure if they cook for finishing or cook for cooking.',
 NULL, NULL, NULL, 4),
('tasting', 'Saturday Tasting', 'experience', 4500, 'per person',
 '90 minutes at the grove. Three oils, three breads, two cheeses, one bottle of estate red.',
 'Saturdays at 10:30, May through October. Maximum 8 people per session. We sit you under the olive trees, pour the three oils side-by-side, hand round three breads (a Maltese hobż, a country sourdough, a focaccia from down the road), two local cheeses, and one bottle of the family estate red. 90 minutes. The siblings host.',
 NULL, NULL, NULL, 5);

-- Seed twelve Saturday tastings May-October 2026
INSERT OR REPLACE INTO tasting_sessions (id, date, time, capacity, booked, notes) VALUES
('ts-2026-05-09', '2026-05-09', '10:30', 8, 0, 'Opening Saturday of the season'),
('ts-2026-05-16', '2026-05-16', '10:30', 8, 0, NULL),
('ts-2026-05-23', '2026-05-23', '10:30', 8, 4, NULL),
('ts-2026-05-30', '2026-05-30', '10:30', 8, 0, NULL),
('ts-2026-06-06', '2026-06-06', '10:30', 8, 0, NULL),
('ts-2026-06-13', '2026-06-13', '10:30', 8, 2, NULL),
('ts-2026-06-20', '2026-06-20', '10:30', 8, 0, NULL),
('ts-2026-06-27', '2026-06-27', '10:30', 8, 0, NULL),
('ts-2026-07-04', '2026-07-04', '10:30', 8, 0, NULL),
('ts-2026-07-11', '2026-07-11', '10:30', 8, 0, NULL),
('ts-2026-09-12', '2026-09-12', '10:30', 8, 0, 'Pre-harvest tasting'),
('ts-2026-10-10', '2026-10-10', '10:30', 8, 0, 'Mid-harvest — see the press at work');

-- Seed six journal posts
INSERT OR REPLACE INTO journal_posts (slug, title, excerpt, body_md, hero_image, reading_min, published_at) VALUES
('why-bidni',
 'Why Bidni',
 'The Maltese cultivar, why it''s nearly extinct, what it tastes like vs Tuscan Frantoio.',
 '# Why Bidni

When my grandfather Toma planted this grove in 1962, he didn''t pick Bidni because it was fashionable. He picked it because it was the only cultivar that survived two summers without water in 1956.

Bidni is the indigenous Maltese olive. Pre-WWII it was on most farms in the islands; by 1990 it was nearly gone, replaced by faster-fruiting Italian and Spanish cultivars. The fruit is small, the yield is low, and the harvest window is narrow — three weeks at the most. It is, by every modern commercial metric, a bad olive.

The flavour, though, is unlike anything else. Picked early, it''s green tomato leaf and white pepper. Picked late, it''s ripe almond and a hint of marzipan that you don''t find in any Tuscan oil. It carries a mineral edge from Malta''s limestone that the Tuscan Frantoio simply doesn''t have access to.

We have 318 Bidni trees. Two more rows are Carolea, planted in 1970 by my grandfather as an experiment — those go into the Riserva. Everything else is Bidni. We don''t plan to change that.

The Bidni Foundation in Sannat (Gozo) is the reason this cultivar still exists. They''ve preserved cuttings, mapped surviving groves, and run a propagation programme since 2008. If you care about indigenous food crops, donate to them, not us.',
 NULL, 6, '2026-04-12T09:00:00'),

('what-single-estate-means',
 'What "single-estate" actually means',
 'A short rant against blending.',
 '# What "single-estate" actually means

Most olive oil — even the bottles in the "extra virgin" tier at €40 a litre — is a blend.

A miller takes fruit from twelve farms, presses them on the same day, mixes the resulting oils to a target profile, and bottles them under a label that says nothing about provenance. If you''re lucky, the label says "100% Italian" or "100% Tuscan." That''s a region, not an estate. The oil in that bottle came from somewhere between 5 and 30 different growers.

Single-estate means: this oil came from one piece of land, harvested in one season, pressed on one set of equipment, bottled without mixing with anything else.

Why does that matter?

1. **You can taste the year.** A late wet spring tastes different from a dry one. A blend smooths that out. A single-estate oil keeps it.
2. **You can taste the soil.** Olives grown on Malta''s south-facing limestone taste different from olives grown on volcanic Sicilian soil. A blend smooths that out too.
3. **You know what you''re paying for.** When the label says "Verde, Casal Olives, Mġarr 2024", you know exactly which 12 acres, which 11 days, which 320 trees.

That''s the entire pitch. We''re not the cheapest oil. We''re the most specific.',
 NULL, 5, '2026-04-19T09:00:00'),

('polyphenols-briefly',
 'Polyphenols, briefly',
 'What 412 mg/kg means in your kitchen.',
 '# Polyphenols, briefly

The number on the side of a Casal Olives Verde bottle reads "polyphenols 412 mg/kg." Most people glance at it and assume it''s a marketing flourish.

It''s not. Here''s what it actually means.

Polyphenols are the antioxidant compounds in the oil that produce the bitter, peppery sensation at the back of your throat. They''re the reason high-quality oil makes you cough a little. The European Food Safety Authority recognises that olive oil polyphenols above 250 mg/kg "contribute to the protection of blood lipids from oxidative stress."

The numbers, in context:

- Mass-market Italian oil: typically 50–150 mg/kg.
- A serious extra-virgin: 200–300 mg/kg.
- Premium early-harvest: 400+ mg/kg.
- Our Verde: 412.
- Our Riserva: 580.

Above 400, the oil keeps for longer (a year on the shelf instead of six months) and the throat-burn finish is more pronounced. Above 600 you''re into single-cultivar Tuscan Coratina territory, which is genuinely intense.

What does that mean in your kitchen? At 412, Verde is for raw use — salads, finishing, dipping. The peppery finish is what you want there. At 286, Maturo is gentler; you can cook with it. At 580, Riserva is best on a piece of bread you''re going to eat slowly.',
 NULL, 4, '2026-04-26T09:00:00'),

('three-things-with-verde',
 'Three things to do with Verde this week',
 'A recipe trio.',
 '# Three things to do with Verde this week

Three uses for a 250ml bottle of Verde, in increasing order of how much you''ll think about it afterwards.

## 1. The salad you''ve been making wrong

Bitter leaves (radicchio, rocket, frisée), torn, with shavings of aged Pecorino. Two tablespoons of Verde, one of red wine vinegar, a pinch of flaky salt, no garlic, no mustard. Eat immediately.

The pepper finish in Verde is doing the work of the mustard. The acid in the vinegar lifts it. Pecorino does the salt. That''s the entire dressing.

## 2. The toast that costs €18

A thick slice of sourdough, toasted dark. Rub one half-clove of garlic across the surface while it''s hot. Drizzle Verde — generously, this is the moment for it. Maldon salt. Eat.

If you can find a tomato in season, half a tomato pressed onto the bread before the oil. *Pa amb tomàquet.* This is what Riserva is for, but Verde does the same job.

## 3. The fish you''ll cook again

A fillet of bream or sea bass, skin on, flour-dusted, fried in cheap olive oil for six minutes total. Off the heat, finish with a tablespoon of Verde, the juice of half a lemon, and a small handful of capers crushed in your fingers. Plate with one boiled potato.

The fish was cooked in something forgettable. The dish tastes the way it does because of the Verde. That''s the point.',
 NULL, 5, '2026-05-03T09:00:00'),

('the-1965-frantoio',
 'The 1965 frantoio',
 'Restoring a stone press, in 8 photos.',
 '# The 1965 frantoio

When we restored the press in 2023, two things were obvious: it would never be as efficient as a modern hammer-mill, and it would always make better oil.

A frantoio is a stone press. Two granite wheels, each about a metre across, rotate around a central spindle on a granite base. The olives — fruit, pit, skin — are crushed under the weight of the stones for 25–35 minutes. The resulting paste is then spread onto woven mats, stacked, and pressed hydraulically to release the oil.

Total cycle time: about three hours per batch. A modern hammer-mill does the same volume in 35 minutes.

Why bother?

Heat. Hammer-mills generate friction; the paste comes out at 30–34°C even with cooling. Stone-mills work cold — under 25°C even on a warm October day. Above 27°C, the polyphenols start to oxidise; the bitter, peppery compounds soften and the shelf life shortens.

Air. Hammer-mills emulsify. The paste comes out aerated, oxygen-rich, ready to oxidise on contact with light. Stone-mills don''t aerate — the paste is heavy, almost like dough, and the oil released from it has had less air contact.

The trade-off is yield. We get about 14 litres of oil per 100kg of fruit. A hammer-mill would get 16–18. We''re fine with that.

The eight photos in this post — a Stefano-the-Tuscan-miller demo from October 2024, the wheels mid-cycle, the paste on mats, oil flowing into the steel tank — are below.',
 NULL, 7, '2026-05-10T09:00:00'),

('pairing-oil-and-bread',
 'Pairing oil and bread',
 'What a sourdough wants vs what a Hobż tal-Malti wants.',
 '# Pairing oil and bread

Bread is the unforgiving test. There''s nowhere for a bad oil to hide. There''s also nowhere for the wrong oil to fit in.

A short field guide.

## Maltese hobż tal-Malti

Dense, salty, with a thick crust and a closed crumb. It wants something assertive enough to carry — but not so peppery it overwhelms the salt that''s already in the bread.

Maturo, every time. The almond and ripe-tomato notes complement the wheat. Verde gets lost; Riserva is overkill.

## Country sourdough

Open crumb, lactic tang, mild crust. The acidity in the sourdough lifts the oil; you can use a more delicate one and it''ll still register.

Verde. The grass and pepper finish bounces off the sourdough''s acidity in a way that Maturo can''t.

## Focaccia (Maltese-style, not Roman)

Olive oil is already in the bread. The dipping oil''s job is to amplify what''s there, not introduce a new flavour. You want softness, not edge.

Maturo, slightly more than you think. Or, controversially, a small puddle of Verde with a tomato pressed in alongside, à la pa amb tomàquet.

## A baguette from Tower Road

Honestly: any of the three. The bread is so neutral it''s essentially a delivery system. Use whichever you have open.

## Brioche

None of them. Eat brioche with butter.',
 NULL, 5, '2026-05-17T09:00:00');
