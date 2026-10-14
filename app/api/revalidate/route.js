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

  if (body.scope === "site") return revalidateSite(body);

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

/*
 * ---- Website publications -------------------------------------------------
 *
 * Sent by the CMS publish worker with exactly the tags and pages one
 * publication changed. Both lists are allowlisted: the secret already gates
 * this route, but a leaked secret should still not be able to evict arbitrary
 * cache entries or make the server render arbitrary paths.
 *
 * TAGS ONLY — never revalidatePath here. Every site page reads its content
 * through tagged fetches, and revalidateTag(tag, "max") is stale-while-
 * revalidate: the current page keeps serving until the regenerated one has
 * rendered successfully, so a failed regeneration (API down, a render error)
 * can never replace a good page. revalidatePath, by contrast, EXPIRES the page:
 * the next visitor gets a blocking render, and if that throws they get a 500.
 * Verified end to end — with the API stopped, a path purge turned /about into
 * a 500 while a tag purge kept serving the last good page.
 *
 * `paths` is accepted (and allowlisted) so the publish worker can say which
 * pages it will read back, but it purges nothing.
 */
const SITE_TAG = /^site:(home|products|blog|about|letters|articles|article:[a-z0-9]+(?:-[a-z0-9]+)*)$/;
const SITE_PATH = /^\/(|products|blog|about|letters|sitemap\.xml|(?:blog|letters)\/[a-z0-9]+(?:-[a-z0-9]+)*)$/;

function revalidateSite(body) {
  const tags = Array.isArray(body.tags) ? body.tags.filter((t) => typeof t === "string" && SITE_TAG.test(t)) : [];
  const paths = Array.isArray(body.paths) ? body.paths.filter((p) => typeof p === "string" && SITE_PATH.test(p)) : [];

  if (tags.length === 0) {
    return Response.json({ error: "Nothing to revalidate" }, { status: 400 });
  }

  for (const tag of tags) revalidateTag(tag, "max");

  return Response.json({ revalidated: tags.map((t) => `tag:${t}`), pages: paths, version: body.version ?? null, at: Date.now() });
}
