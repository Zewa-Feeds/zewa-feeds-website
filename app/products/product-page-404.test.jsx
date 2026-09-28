import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * A slow API must not turn a live product into a permanent 404.
 *
 * WHAT HAPPENED. The PDP wrapped its fetch in a bare `catch` and called
 * `notFound()` for anything that threw. The backend is currently answering
 * product queries in 7-20 seconds (Render in Oregon, Supabase in Mumbai, and
 * one round trip per relation), so the fetch was timing out — and `catch` could
 * not tell "this product was deleted" from "the request took too long".
 *
 * ISR then CACHED that 404. Every real product on zewafeeds.com returned "Oops!
 * We couldn't find that page", while the API itself answered 200 for all 13
 * slugs. The page stayed dead until the cache entry aged out, and regenerated
 * dead again on the next slow response.
 *
 * `notFound()` is a factual claim: this product does not exist. It may only be
 * made when the SERVER says so. A timeout or a network failure is an outage —
 * rethrowing lets Next.js serve an error and try again, which is recoverable,
 * whereas a cached 404 is not.
 *
 * Asserted as source structure: rendering this page needs the API, the image
 * pipeline and the schema block, and a test built on those breaks for reasons
 * unrelated to the rule.
 */
const SOURCE = readFileSync(join(process.cwd(), "app/products/[slug]/page.jsx"), "utf8");

/** The default export's fetch-and-render body. */
/** Comments stripped: they quote the old buggy code, which would match. */
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const PAGE_BODY = (() => {
  const start = SOURCE.indexOf("export default async function ProductPage");
  expect(start).toBeGreaterThan(-1);
  return stripComments(SOURCE.slice(start));
})();

describe("the product page when the API misbehaves", () => {
  it("does not call notFound() for every thrown error", () => {
    /*
     * The defect was `catch { notFound(); }` — no error bound, nothing
     * inspected, so every failure became a permanent cached 404. The rule is
     * that the error is CAUGHT BY NAME and GUARDED before the claim is made.
     */
    expect(PAGE_BODY).toMatch(/catch\s*\(\s*\w+\s*\)/);
    // A rethrow must sit between the catch and the notFound().
    const catchAt = PAGE_BODY.search(/catch\s*\(/);
    const throwAt = PAGE_BODY.indexOf("throw", catchAt);
    const notFoundAt = PAGE_BODY.indexOf("notFound()", catchAt);
    expect(throwAt).toBeGreaterThan(catchAt);
    expect(throwAt).toBeLessThan(notFoundAt);
  });

  it("only 404s when the server actually said the product is missing", () => {
    // The status/code must be inspected before the claim is made.
    expect(PAGE_BODY).toMatch(/status\s*===\s*404|NOT_FOUND/);
  });

  it("rethrows a timeout or transport failure instead of caching a 404", () => {
    expect(PAGE_BODY).toMatch(/throw\b/);
  });

  it("still renders the product on the happy path", () => {
    expect(PAGE_BODY).toMatch(/catalog\.product\(/);
  });
});

describe("metadata generation", () => {
  it("does not let a slow API poison the cached title", () => {
    const meta = SOURCE.slice(
      SOURCE.indexOf("export async function generateMetadata"),
      SOURCE.indexOf("export default async function ProductPage"),
    );
    // Metadata may fall back quietly, but it must not silently claim the
    // product is gone — that is the page body's decision, made once, above.
    expect(meta).not.toMatch(/notFound\(\)/);
  });
});
