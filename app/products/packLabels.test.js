/**
 * What the pack selector calls each pack.
 *
 * Hatch'E ships three feeds — H1, H2 and H3, three particle sizes for three
 * larval stages — all sold as a 1kg bag, so the PDP offered "1kg · ₹1,250"
 * three times and a customer could not tell which stage they were choosing.
 * The catalogue's real pack lists are used here, because the products that
 * must NOT change are as much the point as the one that must.
 */
import { describe, expect, it } from "vitest";
import { packOptionLabels } from "./adapters";

const HATCHE = [
  { sku: "H1-1KG", pack: "1kg" },
  { sku: "H2-1KG", pack: "1kg" },
  { sku: "H3-1KG", pack: "1kg" },
];

const GUPPY = [
  { sku: "G2-45G", pack: "45g Bottle" },
  { sku: "G2-45GX2", pack: "45g — Pack of 2" },
  { sku: "G2-45GX3", pack: "45g — Pack of 3" },
  { sku: "G2-200G", pack: "200g Pouch" },
  { sku: "G2-1KG", pack: "1kg Pouch" },
];

describe("packOptionLabels", () => {
  it("distinguishes Hatch'E's three identically-sized packs", () => {
    expect(packOptionLabels(HATCHE)).toEqual(["H1 — 1kg", "H2 — 1kg", "H3 — 1kg"]);
  });

  it("keeps the net quantity in the label rather than replacing it", () => {
    for (const label of packOptionLabels(HATCHE)) {
      expect(label).toContain("1kg");
    }
  });

  it("leaves a product whose pack sizes already differ completely alone", () => {
    expect(packOptionLabels(GUPPY)).toEqual([
      "45g Bottle",
      "45g — Pack of 2",
      "45g — Pack of 3",
      "200g Pouch",
      "1kg Pouch",
    ]);
  });

  it("returns one label per pack, in the order given", () => {
    expect(packOptionLabels(HATCHE)).toHaveLength(HATCHE.length);
    expect(packOptionLabels(GUPPY)).toHaveLength(GUPPY.length);
  });

  it("disambiguates only the packs that collide, not their neighbours", () => {
    const mixed = [
      { sku: "X-500G", pack: "500g Pouch" },
      { sku: "XA-1KG", pack: "1kg" },
      { sku: "XB-1KG", pack: "1kg" },
    ];
    expect(packOptionLabels(mixed)).toEqual(["500g Pouch", "XA — 1kg", "XB — 1kg"]);
  });

  it("treats casing and stray whitespace as the same pack size", () => {
    const sloppy = [
      { sku: "H1-1KG", pack: " 1KG " },
      { sku: "H2-1KG", pack: "1kg" },
    ];
    expect(packOptionLabels(sloppy)).toEqual(["H1 — 1KG", "H2 — 1kg"]);
  });

  it("uses every SKU segment that differs, not just the first", () => {
    const packs = [
      { sku: "Z-A-1KG-M", pack: "1kg" },
      { sku: "Z-B-1KG-N", pack: "1kg" },
    ];
    expect(packOptionLabels(packs)).toEqual(["A-M — 1kg", "B-N — 1kg"]);
  });

  it("falls back to the whole SKU when the segments do not line up", () => {
    const packs = [
      { sku: "SOLO", pack: "1kg" },
      { sku: "SOLO-B", pack: "1kg" },
    ];
    expect(packOptionLabels(packs)).toEqual(["SOLO — 1kg", "B — 1kg"]);
  });

  it("degrades to the pack label when a pack carries no SKU", () => {
    const packs = [
      { pack: "1kg" },
      { pack: "1kg" },
    ];
    expect(packOptionLabels(packs)).toEqual(["1kg", "1kg"]);
  });

  it("handles an empty or missing pack list", () => {
    expect(packOptionLabels([])).toEqual([]);
    expect(packOptionLabels()).toEqual([]);
  });
});
