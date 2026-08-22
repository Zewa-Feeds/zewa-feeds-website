import { catalog } from "@/lib/api";
import { ARTICLES } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

/**
 * sitemap.xml — the crawl map for zewafeeds.com.
 *
 * Absolute URLs are built from SITE_URL, so this follows the domain rather than
 * naming it. On the Vercel host it therefore advertises zewafeeds.com, which is
 * correct: that is the canonical origin every page already declares, and the
 * preview host should not be inviting its own indexing.
 *
 * WHAT IS DELIBERATELY ABSENT
 *
 * Category pages. The shop filters by query string — /products?category=… — and
 * /products declares a static canonical of "/products", so every filtered view
 * is the same canonical page. Listing them would submit a dozen URLs that all
 * point somewhere else, which is precisely the duplicate-content signal a
 * sitemap is supposed to avoid.
 *
 * Anything private or transactional: /account, /cart, /checkout, /signin,
 * /signup, /forgot-password, /reset-password, /orders/track. Also /preview
 * (token-gated staff route, already noindex) and /api. None of these belong to
 * a search engine, and robots.js disallows them as well.
 *
 * Draft and discontinued products never appear because the catalogue endpoint
 * does not serve them — the filtering is the API's, not ours to reimplement.
 */

/** Matches the shop grid, so a publish reaches the sitemap on the same cycle. */
export const revalidate = 3600;

/** Public pages that are not products. Paths only; the origin is added below. */
const STATIC_PATHS = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "daily" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/shipping", priority: 0.3, changeFrequency: "yearly" },
  { path: "/returns", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

const absolute = (path) => `${SITE_URL}${path}`;

export default async function sitemap() {
  const now = new Date();

  const entries = STATIC_PATHS.map((entry) => ({
    url: absolute(entry.path),
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  for (const article of ARTICLES) {
    entries.push({
      url: absolute(`/blog/${article.slug}`),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  /*
   * Products come from the live catalogue, never a hardcoded list.
   *
   * A failure here must not fail the build or serve an empty sitemap: losing
   * the product URLs for one revalidation cycle is a small problem, while
   * submitting a sitemap that has dropped the entire catalogue tells Google the
   * shop no longer exists. The static pages above are still returned.
   */
  try {
    const products = await catalog.products();
    const seen = new Set();

    for (const product of products ?? []) {
      if (!product?.slug || seen.has(product.slug)) continue;
      seen.add(product.slug);

      entries.push({
        url: absolute(`/products/${product.slug}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // Catalogue unreachable — ship the static map rather than nothing.
  }

  return entries;
}
