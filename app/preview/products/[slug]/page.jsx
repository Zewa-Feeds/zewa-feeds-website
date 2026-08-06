import { notFound } from "next/navigation";
import { preview } from "@/lib/api";
import ProductDetail from "@/app/products/[slug]/ProductDetail";

/**
 * Draft product preview — what the CMS's Preview button opens.
 *
 * Renders the real PDP component with draft data, so staff see exactly what
 * customers will see rather than an approximation.
 *
 * `noindex` and `no-store` throughout: unpublished content must never reach a
 * crawler or a CDN.
 */
export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "Draft preview | Zewa Feeds" },
  robots: { index: false, follow: false },
};

export default async function ProductPreviewPage({ params, searchParams }) {
  const { slug } = await params;
  const { token } = await searchParams;

  if (!token) notFound();

  let product;
  try {
    product = await preview.product(slug, token);
  } catch {
    // An expired, malformed or wrongly-scoped token is indistinguishable from a
    // missing page — deliberately, so this route reveals nothing.
    notFound();
  }

  /*
   * `isPreview` is always true here — it is what makes the page read-only.
   * `isDraft` only says whether there are unpublished changes to highlight in the
   * banner. Passing only isDraft used to leave Add to Cart live whenever a
   * product had no pending overlay.
   */
  return <ProductDetail product={product} isDraft={product.isDraft} isPreview />;
}
