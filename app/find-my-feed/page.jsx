import { catalog } from "@/lib/api";
import { adaptProduct } from "@/app/products/adapters";
import FeedFinder from "./FeedFinder";

/**
 * /find-my-feed — server half.
 *
 * Fetches the live catalogue once and flattens it to one entry per SKU, which
 * is all the finder needs: the recommendation is decided from its own tables
 * (lib/feedFinder/data.js) and only PRICE, MRP, STOCK and the pack photo come
 * from here — "fetched by SKU", as the spec puts it. Checkout re-validates
 * every line server-side regardless.
 *
 * A failed catalogue call still renders the flow: the customer gets their
 * recommendation and feeding plan, just without a live price.
 */

const DESCRIPTION =
  "Answer up to five quick questions about your fish and get one exact Zewa Feeds pack plus a personalised feeding plan.";

/**
 * The bare page is indexable; any URL carrying answers is a personal result
 * and is not (spec §9: "Result URLs are not indexed").
 */
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const hasAnswers = params && Object.keys(params).length > 0;
  return {
    title: "Find My Feed",
    description: DESCRIPTION,
    alternates: { canonical: "/find-my-feed" },
    ...(hasAnswers ? { robots: { index: false, follow: true } } : {}),
  };
}

/** One entry per SKU: { sku, pack, pricePaise, mrpPaise, inStock, slug, name, image, accentBg }. */
function flatten(products) {
  const bySku = {};
  for (const api of products) {
    const card = adaptProduct(api);
    for (const pack of api.packs ?? []) {
      // The pack's own photo when it has one; never another pack's.
      const items = pack.gallery?.items ?? [];
      const byId = new Map(items.map((m) => [m.id, m]));
      const ordered = (pack.gallery?.presentation?.orderedIds ?? []).map((id) => byId.get(id)).filter(Boolean);
      const still = (ordered.length ? ordered : items).find((m) => m.type !== "VIDEO");
      bySku[pack.sku] = {
        sku: pack.sku,
        pack: pack.pack,
        pricePaise: pack.pricePaise,
        mrpPaise: pack.mrpPaise,
        inStock: api.inStock !== false && pack.inStock !== false && !api.isComingSoon,
        slug: api.slug,
        name: api.name.replace(/^Zewa Feeds\s+/i, ""),
        image: still?.url ?? card.image,
        accentBg: card.accentBg,
      };
    }
  }
  return bySku;
}

export default async function FindMyFeedPage({ searchParams }) {
  let catalogue = {};
  try {
    catalogue = flatten(await catalog.products());
  } catch {
    /* Recommend without prices rather than fail the page. */
  }

  const params = await searchParams;
  const initialQuery = new URLSearchParams(
    Object.entries(params ?? {}).filter(([, v]) => typeof v === "string"),
  ).toString();

  return <FeedFinder catalogue={catalogue} initialQuery={initialQuery} />;
}
