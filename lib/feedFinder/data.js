/**
 * Find My Feed — the recommendation tables.
 *
 * Source: "Find My Feed — Flow & Logic" v2.0 (21 Oct 2026), built from PDP
 * Content Master v5.0. Every table in that document lives here, in the same
 * shape, so a change to a recommendation is an edit to this file and never to
 * engine.js. The engine only knows the RULES (fry → Hatch'E, skip Q3 for these
 * groups, …); WHAT is recommended is data.
 *
 * Product codes are the catalogue's SKU prefixes: "G2" means every SKU that
 * starts "G2-". Live price, MRP and stock always come from the catalogue by
 * SKU; nothing here carries a price.
 */

// ─── Q1 · Group tiles ─────────────────────────────────────────────────────────

/**
 * `sizes`  — which Q2 option set the group uses (null = skip Q2).
 * `home`   — which Q3 version the group sees (null = skip Q3).
 * `icon`   — silhouette key, drawn in FeedFinder.jsx.
 */
export const GROUPS = [
  { id: "mixed", label: "Mixed community tank", subtitle: "A bit of everything", sizes: "standard", home: "tank", icon: "mixed" },
  { id: "livebearers", label: "Guppies & livebearers", subtitle: "Guppy, Molly, Platy", sizes: "standard", home: "tank", icon: "guppy" },
  { id: "schoolers", label: "Tetras & small schoolers", subtitle: "Neon, Rasbora, Danio", sizes: "standard", home: "tank", icon: "tetra" },
  { id: "betta", label: "Betta & gourami", subtitle: "Fighters & labyrinth fish", sizes: "standard", home: "tank", icon: "betta" },
  { id: "cichlids", label: "Cichlids", subtitle: "Angelfish, Discus, Mbuna", sizes: "standard", home: "tank", icon: "cichlid" },
  { id: "bigcichlids", label: "Oscar, Flowerhorn & big cichlids", subtitle: "The big personalities", sizes: "bigcichlid", home: null, icon: "flowerhorn" },
  { id: "monster", label: "Arowana & monster fish", subtitle: "Surface hunters", sizes: "monster", home: null, icon: "arowana" },
  { id: "goldfish", label: "Goldfish & Koi", subtitle: "Tanks and ponds", sizes: "goldfish", home: "pond", icon: "goldfish" },
  { id: "bottom", label: "Plecos & bottom feeders", subtitle: "The clean-up crew", sizes: "standard", home: "bottom", icon: "pleco" },
  { id: "shrimp", label: "Shrimp & snails", subtitle: "Tiny grazers", sizes: null, home: null, icon: "shrimp" },
  { id: "other", label: "Something else", subtitle: "My fish isn't listed", sizes: null, home: null, icon: "other" },
];

// ─── Q1 · Species → feed ──────────────────────────────────────────────────────

/**
 * `names`  — every name on the chip; all of them are searchable.
 * `feed`   — product code, or null for "No match" (§8).
 * `basis`  — "primary" → "Made for your fish", "also" → "A great match".
 * `alt`    — alternative product code, shown under "What's next".
 * `treat`  — true shows "Treats & enrichment" in Q4.
 * `noun`   — Q5 title: "How many {noun} are you feeding?"
 * `noMatch`— §8 case key when `feed` is null.
 * `koi`    — Koi/Carp: skip Q3, and under 15 cm is a no-match.
 */
export const SPECIES = [
  { id: "mixed", group: "mixed", label: "Mixed community tank", names: [], feed: "M3", basis: "primary", noun: "fish" },

  { id: "guppy", group: "livebearers", label: "Guppy", names: ["Fancy", "Endler", "Wild"], feed: "G2", basis: "primary", alt: "M3", noun: "guppies" },
  { id: "molly", group: "livebearers", label: "Molly, Platy, Swordtail", names: ["Molly", "Platy", "Swordtail"], feed: "G2", basis: "also", alt: "M3", noun: "livebearers" },

  { id: "tetra", group: "schoolers", label: "Tetras", names: ["Neon", "Cardinal", "Black Skirt", "Rummy Nose", "Ember", "Glowlight", "Congo", "Serpae"], feed: "F2", basis: "primary", alt: "M3", noun: "tetras" },
  { id: "rasbora", group: "schoolers", label: "Rasbora, Danio, Barbs", names: ["Rasbora", "Danio", "Barbs", "Barb"], feed: "M3", basis: "primary", alt: "F2", noun: "fish" },
  { id: "whitecloud", group: "schoolers", label: "White Cloud Minnow, Killifish", names: ["White Cloud Minnow", "Killifish"], feed: "M3", basis: "also", noun: "fish" },

  { id: "bettafish", group: "betta", label: "Betta", names: ["Halfmoon", "Crowntail", "Veiltail", "Double Tail", "Plakat", "Giant", "Siamese fighting fish", "Fighter"], feed: "F3", basis: "primary", alt: "M3", noun: "bettas" },
  { id: "gourami", group: "betta", label: "Dwarf / Honey Gourami, Paradise Fish", names: ["Dwarf Gourami", "Honey Gourami", "Gourami", "Paradise Fish"], feed: "F3", basis: "also", alt: "M3", noun: "gouramis" },

  { id: "african", group: "cichlids", label: "African cichlids", names: ["Mbuna", "Peacock", "Aulonocara", "Hap"], feed: "C4", basis: "primary", noun: "cichlids" },
  { id: "angelfish", group: "cichlids", label: "Angelfish", names: ["Angel"], feed: "C4", basis: "primary", noun: "angelfish" },
  { id: "discus", group: "cichlids", label: "Discus", names: [], feed: "C4", basis: "primary", noun: "discus" },
  { id: "dwarfcichlid", group: "cichlids", label: "Ram, Apistogramma, Kribensis, Convict, Firemouth", names: ["Ram", "Apistogramma", "Apisto", "Kribensis", "Krib", "Convict", "Firemouth"], feed: "C4", basis: "also", noun: "cichlids" },

  { id: "oscar", group: "bigcichlids", label: "Oscar", names: ["Red Oscar", "Tiger Oscar"], feed: "C5", basis: "primary", alt: "A10", treat: true, noun: "oscars" },
  { id: "flowerhorn", group: "bigcichlids", label: "Flowerhorn", names: [], feed: "C5", basis: "primary", alt: "A10", treat: true, noun: "flowerhorns" },
  { id: "parrot", group: "bigcichlids", label: "Parrot Fish (Blood Parrot)", names: ["Blood Parrot", "Parrot"], feed: "C5", basis: "also", alt: "A10", treat: true, noun: "parrot fish" },
  { id: "bigother", group: "bigcichlids", label: "Jaguar, Jack Dempsey, Green Terror, Texas, Red Devil, Midas, Wolf", names: ["Jaguar", "Jack Dempsey", "Green Terror", "Texas", "Red Devil", "Midas", "Wolf"], feed: "C5", basis: "primary", noun: "cichlids" },

  { id: "arowana", group: "monster", label: "Arowana", names: ["Silver", "Asian", "Jardini"], feed: "A10", basis: "primary", treat: true, noun: "arowanas" },
  { id: "gar", group: "monster", label: "Gar, Datnoid, Peacock Bass, Pacu", names: ["Gar", "Datnoid", "Peacock Bass", "Pacu"], feed: "A10", basis: "also", treat: true, noun: "fish" },
  { id: "snakehead", group: "monster", label: "Snakehead", names: [], feed: "A10", basis: "also", noun: "snakeheads" },
  { id: "redtail", group: "monster", label: "Red Tail Catfish", names: ["RTC"], feed: null, noMatch: "redtail", treat: true },
  { id: "stingray", group: "monster", label: "Stingray", names: ["Ray"], feed: null, noMatch: "stingray" },

  { id: "fancygoldfish", group: "goldfish", label: "Fancy Goldfish", names: ["Oranda", "Ryukin", "Lionhead", "Ranchu", "Telescope Eye", "Pearlscale", "Fantail", "Black Moor", "Bubble Eye"], feed: "K4", basis: "primary", noun: "goldfish" },
  { id: "commongoldfish", group: "goldfish", label: "Common Goldfish, Comet, Shubunkin", names: ["Common Goldfish", "Comet", "Shubunkin"], feed: "K4", basis: "also", noun: "goldfish" },
  { id: "koi", group: "goldfish", label: "Koi", names: ["Kohaku", "Sanke", "Showa", "Butterfly", "Ogon", "Tancho"], feed: "K7", basis: "primary", koi: true, noun: "koi" },
  { id: "carp", group: "goldfish", label: "Common Carp, Grass Carp, Ghost Koi", names: ["Common Carp", "Grass Carp", "Ghost Koi", "Carp"], feed: "K7", basis: "also", koi: true, noun: "carp" },

  { id: "pleco", group: "bottom", label: "Pleco", names: ["Common", "Bristlenose", "Zebra L046", "Royal L190", "Plecostomus"], feed: "P5", basis: "primary", noun: "plecos" },
  { id: "otocinclus", group: "bottom", label: "Otocinclus, Corydoras, Loaches, Siamese Algae Eater", names: ["Otocinclus", "Oto", "Corydoras", "Cory", "Loaches", "Loach", "Kuhli", "Hillstream", "Siamese Algae Eater", "SAE"], feed: "P5", basis: "also", noun: "bottom feeders" },

  { id: "cherryshrimp", group: "shrimp", label: "Cherry, Blue Velvet, Snowball, Crystal Red, Crystal Black", names: ["Cherry", "Blue Velvet", "Snowball", "Crystal Red", "Crystal Black", "Neocaridina", "Caridina"], feed: "S5", basis: "primary", noun: "shrimp" },
  { id: "amano", group: "shrimp", label: "Amano, Ghost, Bamboo, Tiger shrimp; Nerite, Mystery snails", names: ["Amano", "Ghost shrimp", "Bamboo", "Tiger shrimp", "Nerite", "Mystery snail", "Snail"], feed: "S5", basis: "also", noun: "shrimp" },

  { id: "notlisted", group: "other", label: "My fish isn't listed", names: [], feed: null, noMatch: "notlisted" },
];

// ─── Q2 · How big are they now? ───────────────────────────────────────────────

const FRY = [
  { id: "newborn", label: "Newborn fry", hint: "0–2 weeks", fry: "H1" },
  { id: "growing", label: "Growing fry", hint: "2–4 weeks", fry: "H2" },
  { id: "young", label: "Young fry", hint: "4 weeks +", fry: "H3" },
];

/** Options left → right, smallest → largest; the tiles draw them growing. */
export const SIZE_SETS = {
  standard: [...FRY, { id: "juvenile", label: "Juvenile" }, { id: "adult", label: "Adult" }],
  monster: [...FRY, { id: "juvenile", label: "Juvenile" }, { id: "adult", label: "Adult" }],
  bigcichlid: [...FRY, { id: "under8", label: "Under 8 cm" }, { id: "over8", label: "8 cm or more" }],
  goldfish: [...FRY, { id: "under15", label: "Under 15 cm" }, { id: "over15", label: "15 cm or more" }],
};

/** Q2 rule 1 — any fry option goes to Hatch'E. "Why" is the result's stage line. */
export const HATCHE = {
  H1: { sku: "H1-1KG", why: "0.175–0.3 mm · first feeding, 48–72 h post-hatch" },
  H2: { sku: "H2-1KG", why: "0.3–0.5 mm · from ~2–3 weeks" },
  H3: { sku: "H3-1KG", why: "0.5–0.7 mm · from ~4–6 weeks until fry take adult pellets" },
};

/** Q2 rule 5. */
export const MONSTER_JUVENILE_NOTE =
  "Young or pellet-shy fish: soak sticks briefly or mix with a familiar food for 5–7 days.";

// ─── Q3 · The home ────────────────────────────────────────────────────────────

/** Version A — "Who's sharing the tank?" (multi-select). */
export const TANKMATES = {
  tank: [
    { id: "just", label: "Just them", exclusive: true, icon: "solo" },
    { id: "plecos", label: "Plecos, corydoras or loaches", icon: "pleco" },
    { id: "shrimp", label: "Shrimp or snails", icon: "shrimp" },
    { id: "small", label: "Other small fish", icon: "tetra" },
  ],
  bottom: [
    { id: "just", label: "Just them", exclusive: true, icon: "solo" },
    { id: "shrimp", label: "Shrimp or snails", icon: "shrimp" },
    { id: "fish", label: "Other fish", icon: "tetra" },
  ],
};

export const TANKMATE_ADDONS = {
  plecos: { sku: "P5-45G", label: "For your clean-up crew" },
  shrimp: { sku: "S5-20G", label: "For your shrimp & snails" },
};

/** "Other small fish" → M3 as the alternative, except for these groups. */
export const SMALL_FISH_ALT = { feed: "M3", label: "Feeds the whole tank", exceptGroups: ["mixed", "cichlids"] };
/** Bottom feeders + "Other fish". */
export const BOTTOM_OTHER_ALT = { feed: "M3", label: "Feeds the whole tank", note: "Feed the top and middle of the tank too." };

/** Version B — "Where do they live?" (Goldfish only). */
export const HOMES = [
  { id: "indoor", label: "Indoor tank or aquarium", icon: "tank" },
  { id: "pond", label: "Outdoor pond", icon: "pond" },
];
/** Goldfish 15 cm or more: feed by home. Under 15 cm is always K4, so Q3 is skipped. */
export const GOLDFISH_HOME_FEED = { indoor: "K4", pond: "K7" };

// ─── Q4 · What do you want to see more of? ────────────────────────────────────

export const GOALS = [
  { id: "everyday", label: "Healthy everyday growth", hint: "Steady growth, clean water", icon: "growth" },
  { id: "colour", label: "Brighter, richer colour", hint: "Deeper reds, blues & golds", icon: "colour", hideGroups: ["bottom"] },
  { id: "breeding", label: "Breeding & healthy fry", hint: "Condition parents, raise fry", icon: "breeding", hideGroups: ["shrimp"], addOn: { sku: "H1-1KG", label: "Ready for the fry" } },
  { id: "treats", label: "Treats & enrichment", hint: "Something they go wild for", icon: "treats", requiresTreat: true, hideFeeds: ["C4"], addOn: { sku: "DBSFL-25G", label: "Their favourite treat" } },
];

// ─── Q5 · How many? ───────────────────────────────────────────────────────────

export const COUNT_HELPER = "We'll pick a pack that's finished fresh — within 2 months of opening.";

/** Tiers in order. `max: null` is the open-ended top tier. One tier = skip Q5. */
export const PACK_TIERS = {
  G2: [{ label: "1–10", sku: "G2-45G" }, { label: "11–30", sku: "G2-45GX2" }, { label: "31–100", sku: "G2-200G" }, { label: "100+", sku: "G2-1KG" }],
  F2: [{ label: "1–15", sku: "F2-45G" }, { label: "16–40", sku: "F2-45GX2" }, { label: "41–100", sku: "F2-45GX3" }, { label: "100+", sku: "F2-1KG" }],
  F3: [{ label: "1–2", sku: "F3-20G" }, { label: "3–10", sku: "F3-45G" }, { label: "11–50", sku: "F3-45GX2" }, { label: "50+", sku: "F3-1KG" }],
  M3: [{ label: "1–15", sku: "M3-45G" }, { label: "16–40", sku: "M3-45GX2" }, { label: "41–100", sku: "M3-200G" }, { label: "100+", sku: "M3-1KG" }],
  C4: [{ label: "1–5", sku: "C4-45G" }, { label: "6–15", sku: "C4-45GX2" }, { label: "16–30", sku: "C4-45GX3" }, { label: "30+", sku: "C4-1KG" }],
  C5: [{ label: "1–3", sku: "C5-500G" }, { label: "4+", sku: "C5-1KG" }],
  P5: [{ label: "1–3", sku: "P5-45G" }, { label: "4–8", sku: "P5-45GX2" }, { label: "9–20", sku: "P5-500G" }, { label: "20+", sku: "P5-1KG" }],
  K4: [{ label: "1–3", sku: "K4-45G" }, { label: "4+", sku: "K4-140G" }],
  K7: [{ label: "1–10", sku: "K7-500G" }, { label: "11+", sku: "K7-1KG" }],
  S5: [{ label: "Any", sku: "S5-20G" }],
  A10: [{ label: "Any", sku: "A10-140G" }],
};

/** A bigger pack costs the same or less — never recommend these. */
export const NEVER_RECOMMEND = ["G2-45GX3", "M3-45GX3", "K4-45GX2", "K4-45GX3", "DBSFL-25GX2"];

// ─── Result · Product copy ────────────────────────────────────────────────────

export const PRODUCT_NAMES = {
  G2: "Guppy Bites", F2: "Tetra Pellets", F3: "Betta Bites", M3: "Micro Pellets",
  S5: "Shrimp Grazers", C4: "Cichlid Bites C4", C5: "Cichlid Bites C5", P5: "Pleco Bites",
  K4: "Goldfish Bites", K7: "Koi Bites", A10: "Monster Sticks", DBSFL: "Dried BSF Larvae",
  H1: "Hatch'E H1", H2: "Hatch'E H2", H3: "Hatch'E H3",
};

export const BADGES = { primary: "Made for your fish", also: "A great match" };

/** One-line spec + the three goal messages. `null` = not applicable. */
export const MESSAGES = {
  G2: { spec: "0.3–0.6 mm slow-sinking micro pellet, 38% insect protein", everyday: "88% protein digestibility — less waste, cleaner water", colour: "Spirulina and carotenoids intensify guppy colour", breeding: "Breeding formula supports spawning and fry survival" },
  F2: { spec: "0.4–0.6 mm slow-sinking pellet, 46% insect protein", everyday: "Fatty acids fuel all-day schooling energy", colour: "Paprica carotenoids amplify Neon and Cardinal blues and reds", breeding: "Lean protein for conditioning — start fry on Hatch'E H1" },
  F3: { spec: "0.6–0.8 mm slow-sinking pellet, 46% insect protein", everyday: "88% digestibility keeps small betta tanks cleaner", colour: "Paprica and carotenoids intensify reds, blues and iridescence", breeding: "High protein for finnage and breeding condition — fry go on H1" },
  M3: { spec: "0.5–1 mm slow-sinking community pellet, 42% insect protein", everyday: "One feed for every small species in the tank", colour: "Spirulina for natural colour", breeding: "Feed adults M3, start fry on Hatch'E H1" },
  S5: { spec: "1.2–2 mm sinking granule, 2.5% calcium, 2% phosphorus", everyday: "Holds 20+ min without clouding — safe for nano tanks", colour: "Spirulina and moringa pigments for shrimp colour", breeding: null },
  C4: { spec: "0.8–1.4 mm slow-sinking pellet, 44% insect protein", everyday: "88% digestibility — less ammonia", colour: "Spirulina and carotenoids enhance natural cichlid colour", breeding: "Broodstock formula — feed 3× daily in smaller portions" },
  C5: { spec: "1.2–2 mm dense pellet, 44% insect protein", everyday: "High digestibility for high-bioload tanks", colour: "Colour support for Flowerhorn and Red Oscar", breeding: "Broodstock compatible" },
  P5: { spec: "1.2–2 mm sinking crumble, 15% fibre, 36% insect protein", everyday: "Fibre matches the natural algae diet — no bloating", colour: null, breeding: "Lean protein for condition — fry go on H1" },
  K4: { spec: "3 mm slow-sinking pellet, 28% protein, prebiotics", everyday: "Slow-sinking stops air-gulping and swim-bladder trouble", colour: "Krill astaxanthin for vivid gold, orange and red", breeding: "Gentle conditioning — fry go on H1" },
  K7: { spec: "4 mm floating pellet, 32% insect protein, krill, probiotics", everyday: "Probiotics for pond gut health across seasons", colour: "Krill, spirulina and paprika colour system", breeding: "Steady condition — fry go on H1" },
  A10: { spec: "4×10 mm floating stick, 36% insect protein", everyday: "Balanced for daily feeding without fouling the tank", colour: "Krill and astaxanthin intensify reds and oranges", breeding: "L-tryptophan supports calmer behaviour" },
  HATCHE: { spec: "48% insect protein; particle size matched to fry mouth size", everyday: "Omega fatty acids for brain and eye development", colour: "Spirulina starts early colour", breeding: null },
};

/** Feeding plans, split into how often / how much / the tip, for the plan card. */
export const FEEDING_PLANS = {
  G2: { often: "2–3× daily", amount: "About 15–20 pellets per 10 guppies", tip: "Gone in 3–4 min" },
  F2: { often: "2–3× daily", amount: "10–15 pellets per 10 tetras", tip: "Scatter across the surface · gone in 3–4 min" },
  F3: { often: "2× daily", amount: "4–6 pellets per betta", tip: "Remove leftovers after 4 min · many keepers fast one day a week" },
  M3: { often: "2–3× daily", amount: "20–25 pellets per 10 small fish", tip: "Gone in 3–4 min" },
  S5: { often: "Once daily or alternate days", amount: "1–2 granules per 10 shrimp", tip: "Remove leftovers after 3 h · in planted tanks, every 2–3 days" },
  C4: { often: "2–3× daily", amount: "8–12 pellets per fish", tip: "Gone in 3–4 min" },
  C5: { often: "1–2× daily", amount: "10–15 pellets per adult", tip: "A slightly lean fish is a healthy fish" },
  P5: { often: "Once daily after lights out", amount: "1–2 pellets per 10 cm of body length", tip: "Remove leftovers after 4 h" },
  K4: { often: "2–3× daily", amount: "3–5 pellets per fish", tip: "Gone in 2–3 min · several small feeds beat one big one" },
  K7: { often: "2–3× daily in warm months", amount: "What they eat in 3–4 min", tip: "Cut back below 15°C, stop below 10°C" },
  A10: { often: "1–2× daily", amount: "2–4 sticks per adult", tip: "Feed to appetite, not to capacity" },
  DBSFL: { often: "Treat only, alongside the staple", amount: "Small fish 2–5 · medium 5–8 · large 8–15 larvae", tip: "Remove anything uneaten" },
  H1: { often: "4–6 light feeds a day", amount: "A light dusting on the surface", tip: "Eaten within 5 min · siphon daily · don't skip a stage" },
  H2: { often: "3–4 feeds a day", amount: "A light dusting on the surface", tip: "Eaten within 5 min · siphon daily · don't skip a stage" },
  H3: { often: "3–4 feeds a day", amount: "A light dusting on the surface", tip: "Eaten within 5 min · siphon daily · don't skip a stage" },
};

export const SWITCHING_NOTE = "When switching foods, introduce the new feed gradually over 5–7 days.";

/** Q2 rule 2 — big cichlids under 8 cm. */
export const BIG_CICHLID_GROW_OUT = "Switch to C5 at 8 cm";

// ─── §8 · No match ────────────────────────────────────────────────────────────

export const NO_MATCH = {
  notlisted: { title: "Let's find it together", message: "Tell us your species — we'll match you to the right feed." },
  redtail: { title: "Red Tail Catfish", message: "No complete daily feed for them in our range yet. Dried BSF Larvae make a great treat.", treat: { sku: "DBSFL-25G", label: "Treat only" } },
  stingray: { title: "Stingray", message: "Stingrays feed on the bottom — talk to us before choosing a feed." },
  youngkoi: { title: "Young koi", message: "Young koi need an in-between size — talk to us." },
};
