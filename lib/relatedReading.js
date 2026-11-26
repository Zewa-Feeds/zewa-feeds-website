/**
 * Knowledge Hub articles shown under a product's description ("Related reading").
 *
 * A fixed, hand-approved mapping (26 Nov 2026), keyed by product slug. Nothing
 * here is inferred from tags or keywords: each pairing was checked against what
 * the article actually discusses, and the anchor text describes the ARTICLE,
 * never claims the product was tested in it (several articles report trials on
 * a generic insect-meal feed, not on these products).
 *
 * Products with no genuinely relevant article (Shrimp Grazers, Hatch'E) are
 * deliberately absent, so their pages show no section at all.
 */
export const RELATED_READING = Object.freeze({
  "betta-bites": [
    { href: "/blog/carotenoids-natural-color-enhancement", text: "How natural carotenoids build betta colour" },
    { href: "/blog/crude-protein-fish-food-vs-protein-quality", text: "Why a 46% protein feed suits carnivorous bettas" },
  ],
  "goldfish-bites": [
    { href: "/blog/protein-absorption-in-fish-absorbed-vs-declared", text: "Why goldfish digest protein differently" },
    { href: "/blog/crude-protein-fish-food-vs-protein-quality", text: "Why goldfish need a lower-protein feed" },
  ],
  "koi-bites": [
    { href: "/blog/the-protein-sparing-effect-how-dietary-fat-changes-protein-use-in-fish", text: "How dietary fat changes protein use in carp and koi" },
    { href: "/blog/carotenoids-natural-color-enhancement", text: "Natural vs synthetic astaxanthin for colour" },
  ],
  "cichlid-bites-c5": [
    { href: "/blog/the-protein-sparing-effect-how-dietary-fat-changes-protein-use-in-fish", text: "How fat and protein work together in large cichlids" },
    { href: "/blog/carotenoids-natural-color-enhancement", text: "How natural carotenoids intensify fish colour" },
  ],
  "monster-sticks": [
    { href: "/blog/carotenoids-natural-color-enhancement", text: "Natural vs synthetic astaxanthin" },
    { href: "/blog/the-protein-sparing-effect-how-dietary-fat-changes-protein-use-in-fish", text: "Why more protein isn't always better" },
  ],
  "dried-bsf-larvae": [
    { href: "/blog/fish-meal-vs-soy-vs-insect-protein", text: "How black soldier fly protein compares with fish meal and soy" },
    { href: "/blog/insect-chitin-prebiotic-fish-food-gut-health", text: "Chitin in black soldier fly larvae" },
  ],
  "micro-pellets": [
    { href: "/blog/fish-meal-vs-soy-vs-insect-protein", text: "Insect protein vs soy in community fish food" },
    { href: "/blog/crude-protein-fish-food-vs-protein-quality", text: "What the protein figure on a label tells you" },
  ],
  "tetra-pellets": [
    { href: "/blog/carotenoids-natural-color-enhancement", text: "How natural carotenoids intensify fish colour" },
  ],
  "cichlid-bites-c4": [
    { href: "/blog/carotenoids-natural-color-enhancement", text: "How natural carotenoids intensify fish colour" },
  ],
  "guppy-bites": [
    { href: "/blog/the-protein-sparing-effect-how-dietary-fat-changes-protein-use-in-fish", text: "How dietary fat and protein affect fish growth" },
  ],
  "pleco-bites": [
    { href: "/blog/crude-protein-fish-food-vs-protein-quality", text: "Why a matched protein level beats a higher one" },
  ],
});

/**
 * The related articles for a product, de-duplicated by URL (first wins).
 * An unknown or unmapped slug gets an empty list.
 */
export function relatedReadingFor(slug) {
  const seen = new Set();
  return (RELATED_READING[slug] ?? []).filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}
