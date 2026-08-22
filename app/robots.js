import { SITE_URL } from "@/lib/site";

/**
 * robots.txt
 *
 * Allow the whole storefront, then carve out the parts that are private,
 * transactional, or meaningless to a crawler. The disallow list is written as
 * explicit path prefixes rather than patterns: a stray wildcard here is the
 * kind of mistake that silently de-indexes a shop, and there is nothing to gain
 * from being clever.
 *
 * Nothing under /products is disallowed — that is the catalogue, and it is the
 * whole point of the site being crawled.
 *
 * The sitemap is advertised at SITE_URL so it follows the canonical domain
 * rather than whichever host happens to serve the file.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Customer-private.
          "/account",
          "/signin",
          "/signup",
          "/forgot-password",
          "/reset-password",
          // Transactional: never useful in a search result, and /cart and
          // /checkout are per-visitor state rather than pages.
          "/cart",
          "/checkout",
          "/orders/track",
          // Internal.
          "/api/",
          // Token-gated staff preview. Already noindex; excluded here too so a
          // crawler does not spend budget discovering that it cannot enter.
          "/preview",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
