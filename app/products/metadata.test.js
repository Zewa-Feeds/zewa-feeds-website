/**
 * Product metadata must not leak another pack's photography.
 *
 * Open Graph and JSON-LD used `product.images[0]` — the first image of ANY pack
 * in CMS order. For Cichlid C4, whose default pack is the 45g, that meant every
 * share on WhatsApp, Facebook and X, and every Google Shopping result, showed a
 * 1kg pouch. It is the most widely seen image on the site and it was the least
 * correct.
 *
 * The metadata builders live inside a server component, so the rules are
 * reproduced here against the same payload shape rather than importing the page
 * (which would drag in next/navigation and the whole render path).
 */
import { describe, expect, it } from "vitest";

const CDN = "https://res.cloudinary.com/x";

/** Exactly the selection the page performs. */
const shareImage = (product) =>
  product.listing?.heroUrl ?? product.listing?.posterUrl ?? null;

const schemaFor = (product) => {
  const packs = product.packs ?? [];
  const listing = product.listing ?? null;
  const repPack = packs.find((k) => k.sku === listing?.sku) ?? null;
  const repImages = (repPack?.gallery?.items ?? [])
    .filter((m) => m.type !== "VIDEO")
    .map((m) => m.url);
  return {
    sku: listing?.sku ?? packs[0]?.sku,
    image: [
      ...(listing?.heroUrl ? [listing.heroUrl] : []),
      ...repImages.filter((u) => u !== listing?.heroUrl),
    ].slice(0, 6),
  };
};

/** Cichlid C4 as the API actually returns it: 45g has only the shared film. */
const cichlidC4 = {
  slug: "cichlid-bites-c4",
  listing: {
    sku: "C4-45G", pack: "45g Bottle", heroUrl: null,
    posterUrl: `${CDN}/film.jpg`, videoUrl: `${CDN}/film.mp4`, coverage: "SHARED_ONLY",
  },
  images: [{ url: `${CDN}/kilo-1.jpg` }, { url: `${CDN}/kilo-2.jpg` }],
  packs: [
    { sku: "C4-45G", gallery: { items: [{ id: "film", type: "VIDEO", url: `${CDN}/film.mp4` }] } },
    { sku: "C4-1KG", gallery: { items: [{ id: "k1", type: "IMAGE", url: `${CDN}/kilo-1.jpg` }] } },
  ],
};

describe("Cichlid C4 metadata", () => {
  it("never shares a 1kg pouch for a page selling the 45g", () => {
    const img = shareImage(cichlidC4);
    expect(img).not.toContain("kilo");
    expect(img).toBe(`${CDN}/film.jpg`);
  });

  it("uses the representative SKU, not packs[0]", () => {
    expect(schemaFor(cichlidC4).sku).toBe("C4-45G");
  });

  it("keeps 1kg photography out of the structured data", () => {
    expect(schemaFor(cichlidC4).image.some((u) => u.includes("kilo"))).toBe(false);
  });

  it("never puts a video URL where an image belongs", () => {
    expect(schemaFor(cichlidC4).image.some((u) => u.endsWith(".mp4"))).toBe(false);
    expect(shareImage(cichlidC4)?.endsWith(".mp4")).toBe(false);
  });
});

describe("a product with real photography", () => {
  const guppy = {
    listing: { sku: "G2-45G", heroUrl: `${CDN}/bottle.png`, posterUrl: `${CDN}/film.jpg` },
    images: [{ url: `${CDN}/panel.jpg` }],
    packs: [
      { sku: "G2-45G", gallery: { items: [
        { id: "v", type: "VIDEO", url: `${CDN}/film.mp4` },
        { id: "b", type: "IMAGE", url: `${CDN}/bottle.png` },
        { id: "p", type: "IMAGE", url: `${CDN}/panel.jpg` },
      ] } },
      { sku: "G2-1KG", gallery: { items: [{ id: "k", type: "IMAGE", url: `${CDN}/pouch.jpg` }] } },
    ],
  };

  it("shares the representative hero", () => {
    expect(shareImage(guppy)).toBe(`${CDN}/bottle.png`);
  });

  it("leads the structured data with the hero, then that pack's images", () => {
    expect(schemaFor(guppy).image).toEqual([`${CDN}/bottle.png`, `${CDN}/panel.jpg`]);
  });

  it("excludes other packs entirely", () => {
    expect(schemaFor(guppy).image).not.toContain(`${CDN}/pouch.jpg`);
  });
});

describe("a product with nothing to show", () => {
  const hatchery = {
    listing: { sku: "H1-1KG", heroUrl: null, posterUrl: null, coverage: "EMPTY" },
    images: [], packs: [{ sku: "H1-1KG", gallery: { items: [] } }],
  };

  it("omits the share image rather than inventing one", () => {
    expect(shareImage(hatchery)).toBeNull();
  });

  it("emits an empty image list", () => {
    expect(schemaFor(hatchery).image).toEqual([]);
  });
});
