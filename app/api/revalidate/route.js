import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

/**
 * Targeted cache invalidation, called by the CMS backend after a publish.
 *
 * WHY THIS EXISTS
 *
 * The shop grid is cached for an hour and the product pages for a minute, and
 * nothing invalidated either. An operator who fixed a wrong photograph, changed
 * a product's main image or archived an asset watched the storefront keep
 * serving the old one for up to an hour, with no way to force it. The CMS was
 * authoritative only eventually.
 *
 * WHY IT IS A ROUTE AND NOT A SHORTER REVALIDATE WINDOW
 *
 * Dropping `revalidate` to 60s would multiply catalogue traffic by sixty for a
 * catalogue that changes a few times a week, and would still leave a minute of
 * wrong photography. Invalidating exactly what changed, when it changes, costs
 * nothing while nothing is happening.
 */

export const runtime = "nodejs";
/** Never cache the invalidator itself. */
export const dynamic = "force-dynamic";

/**
 * Constant-time bearer check.
 *
 * `===` on a secret leaks its prefix through timing. The length is compared
 * first because timingSafeEqual throws on a length mismatch, and that throw
 * would itself be an oracle.
 */
function authorised(request) {
  const secret = process.env.REVALIDATE_SECRET;
  // No secret configured means no remote purge. Failing closed is the only safe
  // default: an open endpoint here lets anyone evict the whole catalogue cache.
  if (!secret) return false;

  const header = request.headers.get("authorization") ?? "";
  const offered = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(offered);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request) {
  if (!authorised(request)) {
    // Deliberately terse: a detailed error tells an attacker which half is wrong.
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    /* an empty body means "catalogue-wide", which is a valid request */
  }

  const slug = typeof body.slug === "string" ? body.slug : null;
  const revalidated = [];

  /*
   * Tags first, then paths.
   *
   * The tag clears the DATA cache — the stored API response that every render
   * reads from. The path clears the RENDERED page. Clearing only the page would
   * re-render it from the same stale API response, which looks like the purge
   * silently did nothing.
   */
  revalidateTag("catalog");
  revalidated.push("tag:catalog");

  if (slug) {
    revalidateTag(`product:${slug}`);
    revalidatePath(`/products/${slug}`);
    revalidated.push(`tag:product:${slug}`, `/products/${slug}`);
  }

  /*
   * The grid and the homepage carry the product's representative image, so both
   * go stale when its media changes — not only its own page. Two fixed paths
   * rather than a global purge: everything else on the site is untouched.
   */
  revalidatePath("/products");
  revalidatePath("/");
  revalidated.push("/products", "/");

  return Response.json({ revalidated, at: Date.now() });
}
