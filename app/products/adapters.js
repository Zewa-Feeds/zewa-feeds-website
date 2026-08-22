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
   * The pack this card represents and sells.
   *
   * The server's `listing.sku` identifies the EFFECTIVE listing variant
   * (the configured variant if in-stock, or the deterministic in-stock fallback
   * if sold out).
   *
   * For legacy or cached responses lacking `listing`, we fall back to the first
   * in-stock pack, or packs[0] if all are sold out.
   */
  const packs = api.packs ?? [];
  const listing = api.listing ?? null;

  const effectivePack =
    (listing?.sku ? packs.find((k) => k.sku === listing.sku) : null) ??
    packs.find((p) => p.inStock !== false) ??
    packs[0];

  const first = effectivePack;
  /*
   * Whitespace-stripped for tag MATCHING (the filter normalises the same way).
   * `packLabels` keeps the readable form, because these strings are also shown
   * on the filter chips — "45g — Pack of 2", not "45g—Packof2".
   */
  const packSizes = (api.packs ?? []).map((v) => v.pack.replace(/\s+/g, ""));
  const packLabels = (api.packs ?? []).map((v) => v.pack);

  /*
   * CARD MEDIA COMES FROM THE SERVER, ALREADY DECIDED.
   *
   * `api.listing` is the canonical resolver plus the presentation layer, so the
   * card, the product page and the CMS preview cannot disagree. There is no
   * cross-pack fallback in it and there must never be one here either.
   */
  const repPack = (api.packs ?? []).find((k) => k.sku === listing?.sku) ?? effectivePack;
  const galleryItems = repPack?.gallery?.items ?? [];
  const byId = new Map(galleryItems.map((m) => [m.id, m]));
  const orderedItems = (repPack?.gallery?.presentation?.orderedIds ?? [])
    .map((id) => byId.get(id))
    .filter(Boolean);

  const cardImages = (orderedItems.length ? orderedItems : galleryItems)
    .filter((m) => m.type !== "VIDEO")
    .map((m) => m.url);

  /*
   * Fallback for a cached response predating `listing`.
   *
   * Deliberately NOT the old behaviour: `packs[0].gallery` is still resolver
   * output, so the worst case is a less-preferred pack, never another pack's
   * photography. Reinstating `api.images[0]` here would reinstate the bug.
   */
  const legacyImages = (api.packs?.[0]?.gallery?.items ?? [])
    .filter((m) => m.type !== "VIDEO")
    .map((m) => m.url);

  /*
   * The still. A product whose only asset is a film shows the poster frame,
   * which is a real picture of the product rather than a black rectangle.
   */
  const image =
    listing?.heroUrl ?? cardImages[0] ?? legacyImages[0] ?? listing?.posterUrl ?? PLACEHOLDER_IMAGE;

  /*
   * Is that still a video poster rather than a photograph?
   *
   * It changes how the card frames it. Photography is shot 1:1 and fills the
   * square well exactly; a poster is a frame of a 16:9 film, and covering a
   * square with one crops about 44% of the width — which cut Cichlid C4's
   * caption off mid-sentence and chopped the pack shots out of both edges.
   *
   * The card letterboxes it instead, exactly as it letterboxes the film that
   * follows, so the hover is a crossfade between two identically framed things
   * rather than a jump.
   */
  const imageIsPoster = Boolean(
    listing && !listing.heroUrl && !cardImages.length && !legacyImages.length && listing.posterUrl,
  );

  const video = listing?.videoUrl ?? null;

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
    image,
    // Cap at 4: a card is a glance, not a gallery. The PDP has the full set.
    gallery: (cardImages.length ? cardImages : legacyImages.length ? legacyImages : [image]).slice(
      0,
      4,
    ),
    /** Plays after ~2s of hover. Null keeps the card on its photograph. */
    video,
    /**
     * Poster frame for that film — and the card's still when the product has a
     * video but no photograph, so the well is never black before playback.
     */
    poster: listing?.posterUrl ?? null,
    /** True when `image` above is that poster, so the card frames it as film. */
    imageIsPoster,
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

/**
 * Same pack written two ways — "1kg", " 1KG " — is still one pack size.
 *
 * Grouping is done on this normalised form so a stray capital or a double
 * space does not make two identical packs look distinct (and so escape
 * disambiguation that they need).
 */
const packKey = (pack) =>
  String(pack ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

/**
 * The part of `sku` that its same-sized siblings do not share.
 *
 * SKUs here are dash-separated — H1-1KG, F3-45GX2 — so comparing segment by
 * segment isolates the one that varies: "H1" out of H1-1KG when the siblings
 * are H2-1KG and H3-1KG. That is deliberately weaker than slicing at a fixed
 * offset or matching a prefix pattern, both of which would turn a naming
 * convention into a rendering rule. When the segments do not line up at all,
 * the whole SKU is returned rather than a misleading fragment.
 */
function distinguishingSkuPart(sku, siblingSkus) {
  const parts = String(sku ?? "").split("-");
  const siblings = siblingSkus.map((s) => String(s ?? "").split("-"));
  const differing = parts.filter((part, i) => siblings.some((other) => other[i] !== part));
  return differing.join("-") || String(sku ?? "");
}

/**
 * Customer-facing labels for a product's pack selector, one per pack.
 *
 * `pack` is a net quantity, and a net quantity does not always identify what
 * you are buying. Hatch'E is three different feeds — H1, H2 and H3, three
 * particle sizes for three larval stages — each sold as a 1kg bag, so the
 * selector offered "1kg · ₹1,250" three times over and nothing on the page
 * said which stage a customer had picked.
 *
 * The variant model has no display-name field: `sku` and `pack` are all there
 * is, and the stage is recorded only in the SKU. So the qualifier is derived
 * from the SKU — and only where it is needed. A pack whose net quantity is
 * unique within its product keeps exactly the label it has today, which is why
 * this changes Hatch'E and no other product in the catalogue.
 *
 * PRESENTATION ONLY. The SKU sent to Add to Cart, the net-quantity declaration
 * in the product & seller information block, the cart line the server prices
 * back, and the CMS's own labels are all untouched — this decides the text on
 * a button and nothing else.
 */
export function packOptionLabels(packs = []) {
  const list = packs ?? [];

  const counts = new Map();
  for (const p of list) {
    const key = packKey(p?.pack);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return list.map((p, i) => {
    const label = String(p?.pack ?? "").trim();
    const key = packKey(p?.pack);
    // Unambiguous on its own — leave it exactly as the CMS wrote it.
    if ((counts.get(key) ?? 0) < 2) return label;

    const siblings = list
      .filter((other, j) => j !== i && packKey(other?.pack) === key)
      .map((other) => other?.sku);
    const qualifier = distinguishingSkuPart(p?.sku, siblings);

    if (!qualifier) return label;
    return label ? `${qualifier} — ${label}` : qualifier;
  });
}
