/**
 * Which products the homepage leads with.
 *
 * The Range section used to render `products.slice(0, 3)` — the first three of
 * a catalogue the API sorts by status then name. That put Betta Bites F3 and
 * both Cichlids on the homepage, which was never a merchandising decision,
 * just alphabetical order showing through.
 *
 * SLUGS ONLY, deliberately. Everything a card shows — name, copy, photograph,
 * and the pack that photograph represents — still comes from the live
 * catalogue, so this file decides WHICH products appear and nothing about how
 * they look. Renaming a product, re-shooting it, or changing its Main Listing
 * Variant in the CMS all reach the homepage with no code change.
 *
 * It lives in code rather than the CMS because there is nowhere in the CMS to
 * put it yet: HomepageContent.sections carries copy (hero, science, why,
 * knowledge, announcement) and has no product slot. A featured-products slot
 * would be a backend and CMS change; until then this is the one place to edit.
 */
export const FEATURED_SLUGS = ["guppy-bites", "goldfish-bites", "koi-bites"];

/**
 * Resolve slugs against the live catalogue, in the order given.
 *
 * A slug that resolves to nothing — unpublished, renamed, or the API was
 * unreachable and the caller passed its hand-written fallback — is skipped
 * rather than rendered as a hole, and the row is topped back up from the rest
 * of the catalogue so the grid always fills. Dropping to two cards because a
 * product went out of season is a worse homepage than showing a fourth.
 */
export function selectFeatured(products, { slugs = FEATURED_SLUGS, count = 3 } = {}) {
  const catalogue = products ?? [];
  const bySlug = new Map(catalogue.map((p) => [p?.slug, p]));

  const chosen = slugs.map((slug) => bySlug.get(slug)).filter(Boolean);
  const rest = catalogue.filter((p) => !chosen.includes(p));

  return [...chosen, ...rest].slice(0, count);
}
