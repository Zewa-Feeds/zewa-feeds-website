import { notFound } from "next/navigation";
import { catalog } from "@/lib/api";
import ProductDetail from "./ProductDetail";
import { SITE_URL } from "@/lib/site";
import { COMPANY } from "@/lib/company";

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

    /*
     * The share image comes from the SAME listing presentation the card and the
     * homepage use.
     *
     * It read `product.images[0]` — the first image of ANY pack, in CMS order —
     * so Cichlid C4, whose default pack is the 45g, was shared to WhatsApp,
     * Facebook and Google as a 1kg pouch. This is the most widely seen image on
     * the site and it was the least correct.
     *
     * The poster frame stands in for a product with a film and no photograph.
     * No image at all is better than another pack's: an omitted og:image shows a
     * link card with no picture, which is honest.
     */
    const shareImage = product.listing?.heroUrl ?? product.listing?.posterUrl ?? null;

    return {
      title: { absolute: title },
      description,
      openGraph: {
        title,
        description,
        type: "website",
        ...(shareImage ? { images: [shareImage] } : {}),
      },
      twitter: {
        card: shareImage ? "summary_large_image" : "summary",
        title,
        description,
        ...(shareImage ? { images: [shareImage] } : {}),
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
  } catch {
    notFound();
  }

  /*
   * Product + Offer + BreadcrumbList schema.
   *
   * The site had Article schema on posts and Organization on About, but no
   * Product schema anywhere — the one type that actually matters on a shop.
   * It is what Google Shopping and AI assistants read to answer "what does
   * this cost / is it in stock", which is the stated GEO objective.
   *
   * One Offer per pack, because each is a separately purchasable SKU at its
   * own price. `highPrice`/`lowPrice` on the AggregateOffer let a result show
   * a range rather than an arbitrary single figure.
   */
  const packs = product.packs ?? [];
  const offers = packs
    .filter((k) => typeof k.pricePaise === "number")
    .map((k) => ({
      "@type": "Offer",
      sku: k.sku,
      name: k.pack,
      price: (k.pricePaise / 100).toFixed(2),
      priceCurrency: "INR",
      availability:
        k.inStock === false
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `${SITE_URL}/products/${product.slug}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: COMPANY.legalName },
    }));

  const prices = offers.map((o) => Number(o.price)).filter(Number.isFinite);

  /*
   * Structured data leads with the representative pack, not with array order.
   *
   * `sku: packs[0].sku` and `image: images[0..6]` were both position accidents:
   * the first pack in the payload and the first images of any pack. Google
   * treats the FIRST image as the primary one, so a product could be indexed
   * under a pack size no customer-facing surface shows.
   *
   * The representative image leads; the rest of that pack's gallery follows.
   * Assets belonging to other packs are excluded rather than reordered — a
   * shopping result should not illustrate a 45g bottle with a 1kg pouch.
   */
  const listing = product.listing ?? null;
  const repPack = packs.find((k) => k.sku === listing?.sku) ?? null;
  const repImages = (repPack?.gallery?.items ?? [])
    .filter((m) => m.type !== "VIDEO")
    .map((m) => m.url);
  const schemaImages = [
    ...(listing?.heroUrl ? [listing.heroUrl] : []),
    ...repImages.filter((u) => u !== listing?.heroUrl),
  ].slice(0, 6);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc || undefined,
    sku: listing?.sku ?? packs[0]?.sku,
    category: product.category || undefined,
    image: schemaImages,
    brand: { "@type": "Brand", name: "Zewa Feeds" },
    ...(offers.length === 1
      ? { offers: offers[0] }
      : offers.length > 1
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "INR",
            lowPrice: Math.min(...prices).toFixed(2),
            highPrice: Math.max(...prices).toFixed(2),
            offerCount: offers.length,
            offers,
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
