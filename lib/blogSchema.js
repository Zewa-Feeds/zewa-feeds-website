import { SITE_URL } from "@/lib/site";

/**
 * CollectionPage structured data for the listing.
 *
 * Name and description are passed in from the page's own metadata
 * (app/blog/layout.jsx); the list is exactly what BlogIndex shows, in the
 * same order: the featured article first, then the rest. Each URL is the
 * article's canonical. The site's Organization
 * and WebSite are referenced by @id (defined once, on the homepage) rather than
 * repeated here.
 */
export function blogCollectionSchema(articles, featuredSlug, { name, description }) {
  const featured = articles.find((a) => a.slug === featuredSlug) ?? articles[0];
  const ordered = featured ? [featured, ...articles.filter((a) => a !== featured)] : [];
  const url = `${SITE_URL}/blog`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name,
    description,
    url,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${SITE_URL}#website` },
    publisher: { "@id": `${SITE_URL}#organization` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: ordered.length,
      itemListElement: ordered.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.title,
        url: `${SITE_URL}/blog/${a.slug}`,
      })),
    },
  };
}
