import { notFound } from "next/navigation";
import { catalog } from "@/lib/api";
import ProductDetail from "./ProductDetail";

/**
 * Product detail page — one route for the whole catalogue.
 *
 * Replaces the five hand-written per-product directories. A new product added in
 * the CMS appears here automatically, with no deploy.
 *
 * Server component so SEO metadata comes from the CMS's own SEO fields; the
 * interactive parts live in ProductDetail (client).
 */

/** ISR: rebuilt at most once a minute, matching the API's cache window. */
export const revalidate = 60;

/** Pre-render known slugs at build time; new ones render on demand. */
export async function generateStaticParams() {
  try {
    const products = await catalog.products();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    // A build with the API unavailable should still succeed — pages then render
    // on first request instead of being pre-generated.
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const product = await catalog.product(slug);
    /*
     * Decode HTML entities before they reach the metadata object.
     *
     * The CMS stores SEO copy already escaped ("500g &amp; 1kg"), and Next
     * escapes again on render — so search results showed the literal "&amp;".
     * Metadata values must be plain text; escaping is the renderer's job.
     */
    const decodeEntities = (s) =>
      String(s ?? "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;|&apos;/g, "'")
        .replace(/&nbsp;/g, " ");

    const title = decodeEntities(product.seo?.title || `${product.name} | Zewa Feeds`);
    const description = decodeEntities(product.seo?.description || product.shortDesc);

    return {
      title: { absolute: title },
      description,
      openGraph: {
        title,
        description,
        type: "website",
        ...(product.images?.[0]?.url ? { images: [product.images[0].url] } : {}),
      },
      alternates: { canonical: `/products/${slug}` },
    };
  } catch {
    return { title: { absolute: "Product | Zewa Feeds" } };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  let product;
  try {
    product = await catalog.product(slug);
  } catch (err) {
    if (err.status === 404) notFound();
    throw err;
  }

  return <ProductDetail product={product} />;
}
