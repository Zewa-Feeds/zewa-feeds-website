import { catalog } from "@/lib/api";
import ProductsClient from "./ProductsClient";
import { adaptProduct, adaptSpotlight } from "./adapters";

/**
 * Shop page — server component.
 *
 * The catalogue is fetched HERE rather than in an effect on the client. It used
 * to load client-side, so the server sent an empty grid reading "0 products":
 * that is what search engines index, and what anyone on a slow connection or
 * with JavaScript blocked saw on the shop page of a store that takes payments.
 *
 * The interactive parts — filters, quantity steppers, the Find My Feed quiz —
 * stay in ProductsClient. This file only fetches and hands the data over,
 * mirroring how the product detail route already works.
 */

export const metadata = {
  title: "All Products",
  description:
    "Insect-protein fish food from Zewa Feeds: slow-sinking granules, bottom dwellers, floating pellets, dried BSF larvae and hatchery feeds, formulated by species.",
  alternates: { canonical: "/products" },
};

/*
 * Revalidate hourly. The catalogue changes when someone publishes in the CMS,
 * not per request, so serving a cached page and refreshing in the background
 * keeps the shop fast without going stale for long.
 */
export const revalidate = 3600;

export default async function ProductsPage({ searchParams }) {
  let products = [];
  let spotlights = [];
  let categories = [];
  let loadFailed = false;

  try {
    /*
     * Settled rather than all: a failing spotlights call must not blank the
     * product grid. Spotlights are a banner; the catalogue is the page.
     */
    const [productsResult, spotlightsResult, categoriesResult] = await Promise.allSettled([
      catalog.products(),
      catalog.spotlights(),
      catalog.categories(),
    ]);

    if (productsResult.status === "fulfilled") {
      products = productsResult.value.map(adaptProduct);
    } else {
      loadFailed = true;
    }

    if (spotlightsResult.status === "fulfilled") {
      spotlights = spotlightsResult.value.map(adaptSpotlight);
    }

    /*
     * Categories come from the CMS taxonomy, not from the products on the page.
     * A failed call leaves the list empty, which the client falls back to
     * deriving — better a short list than no filters at all.
     */
    if (categoriesResult.status === "fulfilled") {
      categories = categoriesResult.value.map((c) => c.label);
    }
  } catch {
    loadFailed = true;
  }

  /*
   * Read ?category= here, not in the client.
   *
   * useSearchParams() would opt the whole client subtree out of server
   * rendering — the exact problem this page exists to fix. Reading it on the
   * server keeps the filter shareable AND the grid server-rendered.
   */
  const params = await searchParams;
  const initialCategory =
    typeof params?.category === "string" ? params.category : "All";

  return (
    <ProductsClient
      products={products}
      spotlights={spotlights}
      categories={categories}
      loadFailed={loadFailed}
      initialCategory={initialCategory}
    />
  );
}
