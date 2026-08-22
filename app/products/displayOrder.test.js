/**
 * The storefront renders the catalogue in the order the API sends it.
 *
 * That is the whole contract now that display order lives in the CMS: the
 * backend sorts by ProductFamily.displayOrder, and nothing on this side may
 * re-sort, or an admin dragging a product in the CMS would have no effect.
 *
 * These assert the ABSENCE of client-side ordering, which is easy to
 * reintroduce by accident — a `.sort()` added for a "nicer" grid would silently
 * override the merchandising decision.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { adaptProduct } from "./adapters";
import { selectFeatured } from "@/lib/featured";

/** A catalogue in a deliberately NON-alphabetical order, as the API now sends. */
const API_ORDER = [
  { slug: "dried-bsf-larvae", name: "Zewa Feeds Dried BSF Larvae" },
  { slug: "guppy-bites", name: "Zewa Feeds Guppy Bites G2" },
  { slug: "tetra-pellets", name: "Zewa Feeds Tetra Pellets F2" },
  { slug: "betta-bites", name: "Zewa Feeds Betta Bites F3" },
  { slug: "koi-bites", name: "Zewa Feeds Koi Bites K7" },
].map((p) => ({
  ...p,
  category: "Slow-Sinking Granules",
  shortDesc: "…",
  inStock: true,
  packs: [{ sku: `${p.slug}-1`, pack: "45g", pricePaise: 18500, mrpPaise: 18500, inStock: true }],
  listing: { sku: `${p.slug}-1`, heroUrl: `https://cdn/${p.slug}.jpg` },
}));

describe("the shop grid follows the API's order", () => {
  it("maps the catalogue without reordering it", () => {
    const cards = API_ORDER.map(adaptProduct);
    expect(cards.map((c) => c.slug)).toEqual([
      "dried-bsf-larvae",
      "guppy-bites",
      "tetra-pellets",
      "betta-bites",
      "koi-bites",
    ]);
  });

  it("is driven by the payload, not by the product name", () => {
    const cards = API_ORDER.map(adaptProduct);
    const alphabetical = [...cards].sort((a, b) => a.name.localeCompare(b.name));
    // If the grid were alphabetical these would match; the point is that they do not.
    expect(cards.map((c) => c.slug)).not.toEqual(alphabetical.map((c) => c.slug));
  });

  it("reverses when the API reverses — the CMS is in charge", () => {
    const forward = API_ORDER.map(adaptProduct).map((c) => c.slug);
    const backward = [...API_ORDER].reverse().map(adaptProduct).map((c) => c.slug);
    expect(backward).toEqual([...forward].reverse());
  });
});

describe("no client-side product sorting has crept back in", () => {
  /*
   * Read as source rather than exercised, because the grid's filter lives
   * inside a 1,200-line client component that cannot be rendered without the
   * whole cart and router context. What must never reappear is a comparator
   * over the product list; a regression here is a one-line edit, so it is worth
   * pinning explicitly.
   */
  const client = readFileSync(resolve(process.cwd(), "app/products/ProductsClient.jsx"), "utf8");

  it("does not sort the product list", () => {
    // Category CHIPS are sorted (sortCategories) and that is intended; the
    // products themselves must not be.
    const productSorts = client.match(/PRODUCTS[\s\S]{0,40}?\.sort\(|filtered[\s\S]{0,20}?\.sort\(/g);
    expect(productSorts).toBeNull();
  });

  it("derives the visible grid by filtering, not by sorting", () => {
    // `filtered` is what the grid maps over. It must come from .filter().
    expect(client).toMatch(/const filtered =/);
    expect(client).toMatch(/PRODUCTS\.filter\(/);
  });
});

describe("the homepage's curated three", () => {
  it("still picks the three chosen slugs regardless of catalogue order", () => {
    expect(selectFeatured(API_ORDER).map((p) => p.slug)).toEqual([
      "guppy-bites",
      "koi-bites",
      "dried-bsf-larvae",
    ]);
  });

  it("tops up from the catalogue in DISPLAY order, not alphabetically", () => {
    // goldfish-bites is absent here, so the third slot falls through to the
    // catalogue — and must take the first one the API listed.
    const chosen = selectFeatured(API_ORDER).map((p) => p.slug);
    expect(chosen[2]).toBe("dried-bsf-larvae");
  });
});
