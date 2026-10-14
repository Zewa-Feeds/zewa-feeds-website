/**
 * Published article (from the CMS snapshot) → what the blog components render.
 *
 * One mapping, used by the blog list, the article page, the related-reading
 * cards and the homepage Knowledge Hub, so the four can never disagree about
 * a read time or a date format.
 */

/** "9 October 2026" — the format the hand-written dates used. In IST, the newsroom's day. */
export function displayDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

/** "2026-10-09" in IST, for JSON-LD and Open Graph. */
export function isoDay(iso) {
  if (!iso) return undefined;
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export function articleView(a) {
  if (!a) return null;
  return {
    ...a,
    image: a.cover?.url ?? null,
    imageMobile: a.coverMobile?.url ?? null,
    imageAlt: a.coverAlt ?? a.title,
    readTime: `${a.readMinutes} min`,
    date: displayDate(a.publishedAt),
    isoDate: isoDay(a.publishedAt),
    isoModified: isoDay(a.modifiedAt),
  };
}

/**
 * Pinned slugs first (in the order given), topped up with the newest others.
 * A pinned slug that is no longer published is skipped rather than leaving a hole.
 */
export function pickArticles(articles, pinned = [], count = 3) {
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const chosen = pinned.map((s) => bySlug.get(s)).filter(Boolean);
  const rest = articles.filter((a) => !chosen.includes(a));
  return [...chosen, ...rest].slice(0, count);
}

/** Related reading: the editor's picks, else the newest others. */
export function relatedFor(article, index, count = 2) {
  const others = index.filter((a) => a.slug !== article.slug);
  return pickArticles(others, article.relatedSlugs ?? [], count);
}
