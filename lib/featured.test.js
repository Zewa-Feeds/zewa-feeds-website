/**
 * Which three products the homepage leads with.
 *
 * The section rendered `products.slice(0, 3)` against a name-sorted catalogue,
 * so the homepage opened on Betta Bites F3 and both Cichlids — alphabetical
 * order standing in for a merchandising decision. These cases use the real
 * catalogue's slugs and ordering, because that ordering is what produced the
 * wrong three.
 */
import { describe, expect, it } from "vitest";
import { FEATURED_SLUGS, selectFeatured } from "./featured";

/** The published catalogue as /catalog/products serves it: status, then name. */
const CATALOGUE = [
  { slug: "betta-bites", name: "Zewa Feeds Betta Bites F3" },
  { slug: "cichlid-bites-c4", name: "Zewa Feeds Cichlid Bites C4" },
  { slug: "cichlid-bites-c5", name: "Zewa Feeds Cichlid Bites C5" },
  { slug: "dried-bsf-larvae", name: "Zewa Feeds Dried BSF Larvae" },
  { slug: "goldfish-bites", name: "Zewa Feeds Goldfish Bites K4" },
  { slug: "guppy-bites", name: "Zewa Feeds Guppy Bites G2" },
  { slug: "hatchery-feeds", name: "Zewa Feeds Hatch'E" },
  { slug: "koi-bites", name: "Zewa Feeds Koi Bites K7" },
];

describe("selectFeatured", () => {
  it("leads with Guppy, Goldfish and Koi, in that order", () => {
    expect(selectFeatured(CATALOGUE).map((p) => p.slug)).toEqual([
      "guppy-bites",
      "goldfish-bites",
      "koi-bites",
    ]);
  });

  it("does not simply take the first three of the catalogue", () => {
    const chosen = selectFeatured(CATALOGUE).map((p) => p.slug);
    expect(chosen).not.toContain("betta-bites");
    expect(chosen).not.toContain("cichlid-bites-c4");
    expect(chosen).not.toContain("cichlid-bites-c5");
  });

  it("returns the catalogue's own objects, so cards stay API-driven", () => {
    const [firstCard] = selectFeatured(CATALOGUE);
    expect(firstCard).toBe(CATALOGUE.find((p) => p.slug === "guppy-bites"));
  });

  it("keeps the requested order even when the catalogue disagrees", () => {
    const reversed = [...CATALOGUE].reverse();
    expect(selectFeatured(reversed).map((p) => p.slug)).toEqual([
      "guppy-bites",
      "goldfish-bites",
      "koi-bites",
    ]);
  });

  it("tops the row back up when a featured product is unpublished", () => {
    const without = CATALOGUE.filter((p) => p.slug !== "goldfish-bites");
    const chosen = selectFeatured(without).map((p) => p.slug);

    expect(chosen).toHaveLength(3);
    expect(chosen.slice(0, 2)).toEqual(["guppy-bites", "koi-bites"]);
    // Filled from the catalogue rather than left as a gap.
    expect(chosen[2]).toBe("betta-bites");
  });

  it("never repeats a product when filling the row", () => {
    const chosen = selectFeatured(CATALOGUE, { slugs: ["koi-bites"] }).map((p) => p.slug);
    expect(new Set(chosen).size).toBe(chosen.length);
    expect(chosen[0]).toBe("koi-bites");
  });

  it("falls back to catalogue order when none of the slugs resolve", () => {
    const chosen = selectFeatured(CATALOGUE, { slugs: ["not-a-product"] }).map((p) => p.slug);
    expect(chosen).toEqual(["betta-bites", "cichlid-bites-c4", "cichlid-bites-c5"]);
  });

  it("survives an empty or missing catalogue rather than throwing", () => {
    expect(selectFeatured([])).toEqual([]);
    expect(selectFeatured(undefined)).toEqual([]);
  });

  it("asks for exactly the three products the homepage is meant to show", () => {
    expect(FEATURED_SLUGS).toEqual(["guppy-bites", "goldfish-bites", "koi-bites"]);
  });
});
