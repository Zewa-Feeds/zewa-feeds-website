/**
 * What the product card is told to show.
 *
 * These use the real catalogue's shapes — Guppy's five packs, Cichlid C4's
 * unphotographed 45g, Hatchery's empty gallery — because those are the cases
 * that were wrong on the live site, not invented edge cases.
 */
import { describe, expect, it } from "vitest";
import { adaptProduct, getSortedNutritionEntries, PLACEHOLDER_IMAGE } from "./adapters";

const CDN = "https://res.cloudinary.com/x";

const item = (id, type = "IMAGE") => ({
  id,
  type,
  url: `${CDN}/${id}.${type === "VIDEO" ? "mp4" : "jpg"}`,
  alt: `alt ${id}`,
  source: "VARIANT",
  isPrimary: false,
});

/** A pack with a resolved gallery, as serializePublic sends it. */
const pack = (sku, { items = [], order = null, inStock = true, price = 24900 } = {}) => ({
  sku,
  pack: sku,
  pricePaise: price,
  mrpPaise: price,
  inStock,
  gallery: {
    coverage: items.length ? "EXACT" : "EMPTY",
    inheritedFromSku: null,
    heroMediaId: items.find((m) => m.type === "IMAGE")?.id ?? null,
    items,
    presentation: {
      orderedIds: order ?? items.map((m) => m.id),
      heroId: items.find((m) => m.type === "IMAGE")?.id ?? null,
      videoId: items.find((m) => m.type === "VIDEO")?.id ?? null,
      videoSource: items.find((m) => m.type === "VIDEO") ? "SHARED" : null,
    },
  },
});

const product = (overrides = {}) => ({
  name: "Zewa Feeds Guppy Bites G2",
  slug: "guppy-bites",
  category: "Slow-Sinking Pellets",
  shortDesc: "x",
  inStock: true,
  media: [],
  images: [],
  packs: [],
  ...overrides,
});

describe("card imagery", () => {
  it("uses the listing hero, not the first image of any pack", () => {
    const card = adaptProduct(
      product({
        listing: {
          sku: "G2-45G", pack: "45g Bottle", heroUrl: `${CDN}/bottle.jpg`,
          heroAlt: "bottle", videoUrl: null, posterUrl: null, coverage: "EXACT",
        },
        packs: [pack("G2-45G", { items: [item("bottle")] }), pack("G2-1KG", { items: [item("pouch")] })],
      }),
    );
    expect(card.image).toBe(`${CDN}/bottle.jpg`);
  });

  it("NEVER borrows another pack’s photograph — Cichlid C4", () => {
    /*
     * C4's 45g has no photography of its own and only the shared film resolves
     * for it. The 1kg pouch photograph exists on the same product and must not
     * be reached for.
     */
    const card = adaptProduct(
      product({
        slug: "cichlid-bites-c4",
        listing: {
          sku: "C4-45G", pack: "45g Bottle", heroUrl: null, heroAlt: null,
          videoUrl: `${CDN}/film.mp4`, posterUrl: `${CDN}/film.jpg`, coverage: "SHARED_ONLY",
        },
        // The 1kg photograph is present on the product, in both legacy fields.
        media: [{ id: "pouch", type: "IMAGE", url: `${CDN}/pouch.jpg`, sku: "C4-1KG" }],
        images: [{ url: `${CDN}/pouch.jpg` }],
        packs: [
          pack("C4-45G", { items: [item("film", "VIDEO")] }),
          pack("C4-1KG", { items: [item("pouch")] }),
        ],
      }),
    );

    expect(card.image).not.toContain("pouch");
    expect(card.gallery).not.toContain(`${CDN}/pouch.jpg`);
    // The poster is a real frame of the product, so it stands in for the photo.
    expect(card.image).toBe(`${CDN}/film.jpg`);
    expect(card.video).toBe(`${CDN}/film.mp4`);
    // Framed as film, not as photography — a 16:9 poster covering a square well
    // loses about 44% of its width.
    expect(card.imageIsPoster).toBe(true);
  });

  it("does not letterbox a real photograph", () => {
    const card = adaptProduct(
      product({
        listing: {
          sku: "G2-45G", pack: "45g", heroUrl: `${CDN}/bottle.jpg`, heroAlt: "b",
          videoUrl: `${CDN}/film.mp4`, posterUrl: `${CDN}/film.jpg`, coverage: "EXACT",
        },
        packs: [pack("G2-45G", { items: [item("bottle"), item("film", "VIDEO")] })],
      }),
    );
    expect(card.imageIsPoster).toBe(false);
  });

  it("uses the placeholder when there is nothing at all — Hatchery", () => {
    const card = adaptProduct(
      product({
        slug: "hatchery-feeds",
        listing: {
          sku: "H1-1KG", pack: "1kg", heroUrl: null, heroAlt: null,
          videoUrl: null, posterUrl: null, coverage: "EMPTY",
        },
        packs: [pack("H1-1KG")],
      }),
    );
    expect(card.image).toBe(PLACEHOLDER_IMAGE);
    expect(card.video).toBeNull();
    expect(card.gallery).toEqual([PLACEHOLDER_IMAGE]);
  });

  it("leads with the hero and follows presentation order", () => {
    const items = [item("panel"), item("film", "VIDEO"), item("bottle"), item("back")];
    const card = adaptProduct(
      product({
        listing: {
          sku: "G2-45G", pack: "45g", heroUrl: `${CDN}/bottle.jpg`, heroAlt: "b",
          videoUrl: `${CDN}/film.mp4`, posterUrl: `${CDN}/film.jpg`, coverage: "EXACT",
        },
        packs: [
          pack("G2-45G", { items, order: ["bottle", "film", "back", "panel"] }),
        ],
      }),
    );
    // The film is excluded from the still gallery; the order is otherwise kept.
    expect(card.gallery).toEqual([`${CDN}/bottle.jpg`, `${CDN}/back.jpg`, `${CDN}/panel.jpg`]);
  });

  it("caps the card gallery at four", () => {
    const items = ["a", "b", "c", "d", "e", "f"].map((id) => item(id));
    const card = adaptProduct(
      product({
        listing: {
          sku: "G2-45G", pack: "45g", heroUrl: `${CDN}/a.jpg`, heroAlt: "a",
          videoUrl: null, posterUrl: null, coverage: "EXACT",
        },
        packs: [pack("G2-45G", { items })],
      }),
    );
    expect(card.gallery).toHaveLength(4);
  });
});

describe("effective listing variant presentation and commerce", () => {
  it("uses the effective listing variant for both imagery and commerce when in stock", () => {
    const card = adaptProduct(
      product({
        listing: {
          sku: "G2-45G", pack: "45g Bottle", heroUrl: `${CDN}/bottle.jpg`,
          heroAlt: "bottle", videoUrl: null, posterUrl: null, coverage: "EXACT",
        },
        packs: [
          pack("G2-45G", { items: [item("bottle")], inStock: true, price: 24900 }),
          pack("G2-1KG", { items: [item("pouch")], inStock: true, price: 99900 }),
        ],
      }),
    );

    expect(card.image).toBe(`${CDN}/bottle.jpg`);
    expect(card.sku).toBe("G2-45G");
    expect(card.price).toBe(249);
    expect(card.inStock).toBe(true);
  });

  it("reflects effective variant fallback when server resolves an in-stock alternative", () => {
    // Backend presentListing resolved effective variant to G2-1KG because G2-45G was sold out
    const card = adaptProduct(
      product({
        listing: {
          sku: "G2-1KG", pack: "1kg Pouch", heroUrl: `${CDN}/pouch.jpg`,
          heroAlt: "pouch", videoUrl: null, posterUrl: null, coverage: "EXACT",
        },
        packs: [
          pack("G2-45G", { items: [item("bottle")], inStock: false, price: 24900 }),
          pack("G2-1KG", { items: [item("pouch")], inStock: true, price: 99900 }),
        ],
      }),
    );

    expect(card.image).toBe(`${CDN}/pouch.jpg`);
    expect(card.sku).toBe("G2-1KG");
    expect(card.price).toBe(999);
    expect(card.inStock).toBe(true);
  });

  it("disables the card when all variants are sold out", () => {
    const card = adaptProduct(
      product({
        inStock: false,
        listing: {
          sku: "G2-45G", pack: "45g Bottle", heroUrl: `${CDN}/bottle.jpg`,
          heroAlt: "bottle", videoUrl: null, posterUrl: null, coverage: "EXACT",
        },
        packs: [
          pack("G2-45G", { items: [item("bottle")], inStock: false, price: 24900 }),
          pack("G2-1KG", { items: [item("pouch")], inStock: false, price: 99900 }),
        ],
      }),
    );

    expect(card.image).toBe(`${CDN}/bottle.jpg`);
    expect(card.sku).toBe("G2-45G");
    expect(card.price).toBe(249);
    expect(card.inStock).toBe(false);
  });
});

describe("older cached responses", () => {
  it("fall back to a resolved pack gallery, never to a cross-pack image", () => {
    const card = adaptProduct(
      product({
        // No `listing` — a response cached before the presentation layer shipped.
        media: [{ id: "pouch", type: "IMAGE", url: `${CDN}/pouch.jpg`, sku: "C4-1KG" }],
        images: [{ url: `${CDN}/pouch.jpg` }],
        packs: [pack("C4-45G", { items: [] }), pack("C4-1KG", { items: [item("pouch")] })],
      }),
    );
    expect(card.image).toBe(PLACEHOLDER_IMAGE);
  });
});

describe("canonical nutrients table order", () => {
  it("strictly sorts nutrients into the exact 7-item order specified", () => {
    const rawNutrition = {
      phosphorus: "0.7%",
      ash: "6%",
      moisture: "<5%",
      calcium: "20%",
      fiber: "5%",
      fat: "30%",
      protein: "40%",
    };

    const sorted = getSortedNutritionEntries(rawNutrition, 40);

    expect(sorted).toEqual([
      ["Crude Protein (min)", "40%"],
      ["Crude Fat (min)", "30%"],
      ["Crude Fiber (max)", "5%"],
      ["Moisture (max)", "<5%"],
      ["Ash (max)", "6%"],
      ["Calcium (min)", "20%"],
      ["Phosphorus (min)", "0.7%"],
    ]);
  });

  it("handles aliases like fibre, crude_protein, etc., and falls back to proteinPct", () => {
    const rawNutrition = {
      fat: "12%",
      fibre: "3%",
      moisture: "8%",
      ash: "9%",
      astaxanthin: "50 ppm",
    };

    const sorted = getSortedNutritionEntries(rawNutrition, 42);

    expect(sorted).toEqual([
      ["Crude Protein (min)", "42%"],
      ["Crude Fat (min)", "12%"],
      ["Crude Fiber (max)", "3%"],
      ["Moisture (max)", "8%"],
      ["Ash (max)", "9%"],
      ["Astaxanthin", "50 ppm"],
    ]);
  });
});
