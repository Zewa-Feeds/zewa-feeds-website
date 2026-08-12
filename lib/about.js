import { COMPANY, COMPANY_ADDRESS_LINE } from "./company";

/**
 * About page content.
 *
 * Copy lives here so text edits never touch layout — the same split used by
 * lib/articles.js.
 *
 * Every figure traces to "zewa about page r3.docx". Where the document gives a
 * range (40–55% protein) the range is preserved rather than reduced to a single
 * number, and nothing is inferred beyond what it states.
 */

export const HERO = {
  eyebrow: "ABOUT ZEWA",
  title: "Reinventing aqua nutrition from the protein up.",
  lead: "For millions of years, aquatic species evolved on insect protein. The modern aquafeed industry replaced it with soy, corn and fillers.",
  sub: "Zewa Ecosystems, founded in Kerala, is rebuilding that formula from first principles — feeds that work with fish biology, not against it.",
};

/** Three figures carry the credibility argument. More would dilute it. */
export const HEADLINE_STATS = [
  { value: "88%", label: "Pepsin digestibility", note: "NABL-verified benchmark" },
  { value: "4", label: "Years of R&D", note: "Multi-year feeding trials" },
  { value: "13+", label: "Formulations", note: "Species-specific" },
];

export const STORY = {
  eyebrow: "OUR STORY",
  title: "A $500 billion industry, built on the wrong protein.",
  paragraphs: [
    "The global animal feed industry is worth half a trillion dollars, and most of it runs on soy and corn — crops chosen for cost and scale, not for how aquatic species actually digest.",
    "Zewa went back to the biology. Every formula is anchored in Black Soldier Fly protein, farmed in-house at India's first data-centric insect farming plant, and validated by independent NABL-accredited laboratory testing.",
  ],
  outcomes: [
    "More nutrition absorbed per feeding.",
    "Less ammonia in the tank.",
    "Healthier fish on fewer meals.",
  ],
};

export const PURPOSE = [
  {
    label: "VISION",
    text: "Developing and advancing sustainable, functional pet nutrition around the planet.",
  },
  {
    label: "MISSION",
    text: "By advancing insect protein technology and life sciences expertise, we develop and sell validated products which can advance animal nutrition.",
  },
];

export const WHY = {
  eyebrow: "WHY ZEWA EXISTS",
  title: "Two-thirds of global deforestation is driven by protein production.",
  body: "Zewa's entire model is built to push against that. BSF larvae are raised on organic bio-waste — upcycling what would otherwise decompose in landfill into high-quality protein, using a fraction of the land, water and energy that soy or fish meal demand.",
  loop: [
    { step: "Waste in", detail: "Organic bio-waste destined for landfill becomes larval substrate." },
    { step: "Protein out", detail: "Larvae convert it into dense, highly digestible feed protein." },
    { step: "Fertiliser back", detail: "Frass, the larval by-product, returns to the soil." },
  ],
  quote: "From waste in, to protein out, to fertiliser back — nothing is lost.",
};

export const FOUNDER = {
  eyebrow: "FOUNDER",
  name: "Nik Mulakkal",
  role: "Founder & CEO, Zewa Ecosystems",
  portrait: "/team/nik-mulakkal.jpg",
  portraitAlt: "Nik Mulakkal, Founder and CEO of Zewa Ecosystems",
  /** The founding principle, in the founder's own framing. */
  statement:
    "Zewa is short for Zero Waste Ecosystems. That is not branding — it is the process. Larvae raised on organic bio-waste, converting landfill-bound material into nutrient-dense protein, traceable end to end.",
  bio: "An engineer by training, Nik returned to India in 2021 after leading engineering teams in Australia, convinced that insect protein could reshape how food systems work.",
  credentials: [
    { label: "M.Eng", detail: "University of Melbourne" },
    { label: "B.Tech", detail: "University of Calicut" },
    { label: "MDP", detail: "IIM Bangalore & Calicut" },
    { label: "CPEng", detail: "Engineers Australia" },
  ],
  honours: [
    "Temasek NextGen Ecosphere Future Leaders, Singapore 2025",
    "Australian Foreign Ministry AAGS 2023",
    "ICAR UPJA Winner 2023",
    "UNDP Green Innovation Fund awardee",
  ],
};

export const VALUES = {
  eyebrow: "WHAT WE STAND FOR",
  title: "Four principles, applied to every batch.",
  items: [
    {
      title: "Evidence over claims",
      detail: "Every nutritional value is NABL-accredited laboratory tested. Nothing ships on marketing alone.",
    },
    {
      title: "Biology first",
      detail: "Pellet size, sinking profile and protein ratio are calibrated to each species' actual anatomy.",
    },
    {
      title: "Nothing wasted",
      detail: "Bio-waste becomes protein; the by-product becomes fertiliser. The loop closes by design.",
    },
    {
      title: "Traceable end to end",
      detail: "Bio-secure production, from substrate preparation through to the packaged batch.",
    },
  ],
};

export const TRUST = {
  eyebrow: "WHY CUSTOMERS TRUST US",
  title: "Validated by institutions, not by us.",
  body: "Formulations are developed with ICAR-IARI (Pusa Krishi), ICAR-Central Institute for Fisheries Technology and AgHub (PJTSAU). In an 8-week controlled trial against a leading premium brand, Zewa feeds delivered measurably better outcomes.",
  trialStats: [
    { value: "15%", label: "Faster metabolic growth" },
    { value: "10%", label: "Reduced mortality" },
  ],
  institutions: [
    "Kerala Startup Mission",
    "Startup India",
    "Goa Angel Network",
    "AgHub (PJTSAU)",
    "Pusa Krishi (ICAR-IARI)",
    "ICAR-CIFT",
    "Make in India",
  ],
  recognition: [
    "Climathon 2022 winner",
    "Kerala Startup Mission Innovation Grant",
    "Climate Collective National Springboard",
    "Swachh Technology Challenge",
  ],
};

export const RANGE = {
  eyebrow: "THE RANGE",
  title: "Engineered for the species, not the shelf.",
  body: "Over 13 distinct formulations, each developed for a specific species or group — protein from 26% to 50%, pellets from 0.175 mm powder to 4 mm floating koi.",
  products: [
    { name: "Betta Bites", spec: "46% protein · 0.6–0.8 mm", slug: "betta-bites" },
    { name: "Guppy Bites", spec: "38% protein · prebiotics", slug: "guppy-bites" },
    { name: "Hatch'E", spec: "H1 / H2 / H3 system", slug: "hatchery-feeds" },
    { name: "Shrimp Grazers", spec: "Moulting support", slug: "shrimp-grazers" },
    { name: "Goldfish Bites", spec: "28% protein", slug: "goldfish-bites" },
    { name: "Koi Bites", spec: "Krill meal · probiotics", slug: "koi-bites" },
  ],
};

export const REGISTERED_ADDRESS =
  `${COMPANY.legalName}, ${COMPANY_ADDRESS_LINE}.`;
