import { formatInr } from "@/lib/api";

/**
 * Catalogue adapters — API shape -> the shape the shop UI renders.
 *
 * These live OUTSIDE ProductsClient.jsx deliberately. They were exported from
 * that file while it carried "use client", and calling one from the server
 * page threw:
 *
 *   Attempted to call adaptProduct() from the server but adaptProduct is on
 *   the client.
 *
 * A module with no "use client" directive can be imported by both, so the
 * server page can map the catalogue before handing it to the client.
 */

/**
 * Shown when a product carries no image of its own.
 *
 * A neutral panel rather than a photo of some other product: borrowing another
 * item's picture is worse than showing none, because it misrepresents what the
 * customer is buying.
 */
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">` +
      `<rect width="400" height="400" fill="#0d1321"/>` +
      `<text x="200" y="205" text-anchor="middle" fill="#3c4a45"` +
      ` font-family="Montserrat,sans-serif" font-size="16">Image coming soon</text>` +
      `</svg>`,
  );

export function adaptProduct(api) {
  /*
   * The pack this card actually sells.
   *
   * Prefer the first IN-STOCK pack, not simply the first one. A product is
   * `inStock` when ANY pack is available, so a product whose first pack is sold
   * out — Koi Bites K7-500G — showed an enabled "+ Add" that put an
   * unpurchasable SKU in the cart, while its own detail page correctly refused.
   * Falling back to packs[0] keeps price and imagery sensible when every pack
   * is gone; `cardInStock` below then disables the button.
   */
  const packs = api.packs ?? [];
  const first = packs.find((p) => p.inStock !== false) ?? packs[0];
  /*
   * Whitespace-stripped for tag MATCHING (the filter normalises the same way).
   * `packLabels` keeps the readable form, because these strings are also shown
   * on the filter chips — "45g — Pack of 2", not "45g—Packof2".
   */
  const packSizes = (api.packs ?? []).map((v) => v.pack.replace(/\s+/g, ""));
  const packLabels = (api.packs ?? []).map((v) => v.pack);

  /*
   * CARD GALLERY = THE BASE PACK ONLY, plus shared assets.
   *
   * This used to be `api.images.map(...)` — every image of every pack. A product
   * with a 45g bottle, a 200g pouch and a 1kg pouch put ~20 slides in one card,
   * including back-of-pack label shots, so hovering cycled through the whole
   * photo library instead of showing the product.
   *
   * `api.media` carries a `sku` per asset (null = shared), so the card can show
   * just the first pack — which is what the card's price and Add-to-Cart refer
   * to — and the product video.
   */
  const media = api.media ?? [];
  const baseSku = first?.sku ?? null;

  const cardImages = media
    .filter((m) => m.type !== "VIDEO" && (!m.sku || m.sku === baseSku))
    .map((m) => m.url);

  const video = media.find((m) => m.type === "VIDEO")?.url ?? null;

  return {
    name: api.name,
    slug: api.slug,
    // Filter chips match on category and pack size.
    tags: [api.category, ...packSizes],
    /** Readable pack names, for display rather than matching. */
    packLabels,
    tagline: api.shortDesc,
    price: first ? first.pricePaise / 100 : 0,
    mrp: first && first.mrpPaise > first.pricePaise ? formatInr(first.mrpPaise) : null,
    packs: packSizes,
    badge: api.badge ?? null,
    badgeColor: "bg-primary text-[#00382d]",
    protein: api.proteinPct ? `${api.proteinPct}%` : null,
    image: cardImages[0] ?? api.images?.[0]?.url ?? PLACEHOLDER_IMAGE,
    // Cap at 4: a card is a glance, not a gallery. The PDP has the full set.
    gallery: (cardImages.length ? cardImages : (api.images ?? []).map((i) => i.url)).slice(0, 4),
    /** The card cycles to this after ~3s of hover. Null hides that behaviour. */
    video,
    accentColor: api.presentation?.accent ?? "rgba(68,229,194,0.18)",
    /*
     * Backdrop for the card's image well, matching the PDP gallery.
     * Artwork is dark-on-transparent, so it was unreadable against the dark
     * card. Same #f4f7f6 fallback the PDP uses.
     */
    accentBg: api.presentation?.accentBg ?? "#f4f7f6",
    /*
     * Stock of the pack this card sells — NOT api.inStock.
     *
     * api.inStock is true when any pack is available, so using it here let the
     * card offer a sold-out SKU. The button must reflect the exact thing it
     * adds to the cart.
     */
    inStock: Boolean(first?.sku) && api.inStock !== false && first?.inStock !== false,
    // Real SKU, so Add to Cart sends what the backend expects.
    sku: first?.sku ?? null,
    packLabel: first?.pack ?? null,
    pricePaise: first?.pricePaise ?? 0,
    mrpPaise: first?.mrpPaise ?? 0,
  };
}

/**
 * Spotlight banner shape.
 *
 * Note this differs from adaptProduct: the banner renders `price` as a preformatted
 * STRING ("₹249") while the product cards use a NUMBER. That asymmetry is in the
 * original hand-written data, and both shapes must be reproduced exactly or the
 * render breaks — the banner does string work on `price`, the cards do maths.
 */
export function adaptSpotlight(api) {
  return {
    name: api.name,
    slug: api.slug,
    tagline: api.tagline,
    sub: api.subText,
    // String, with the symbol, matching how the card renders price.
    price: api.pricePaise ? formatInr(api.pricePaise) : "",
    mrp: api.mrpPaise && api.mrpPaise > api.pricePaise ? formatInr(api.mrpPaise) : null,
    packs: api.packs ?? [],
    badge: api.badge ?? null,
    protein: api.proteinPct ? `${api.proteinPct}%` : null,
    image: api.imageUrl ?? PLACEHOLDER_IMAGE,
    category: api.category ?? api.name,
    accent: "rgba(68,229,194,0.22)",
    accentStrong: "rgba(68,229,194,0.45)",
    stat: api.subText ?? "",
  };
}

/**
 * Is this asset a transparent cutout rather than a full-bleed photo?
 *
 * Cutout artwork is dark-on-transparent, so it disappears against the dark
 * card and PDP surfaces and needs a light backdrop behind it. Full-bleed
 * photography brings its own background and must stay edge to edge.
 *
 * PNG is the signal: the catalogue exports cutouts as PNG and photographs as
 * JPEG. Shared so the card grid and the PDP cannot drift apart on this.
 */
export const isCutout = (url) => /\.png(\?|$)/i.test(url ?? "");
