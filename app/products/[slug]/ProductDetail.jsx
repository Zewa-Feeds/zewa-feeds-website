"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/ReviewForm";
import { useCart } from "@/lib/cartContext";
import { discountPct, formatInr } from "@/lib/api";
import { COMPANY, COMPANY_ADDRESS_LINE } from "@/lib/company";

/**
 * Product detail — data-driven.
 *
 * Replaces five hand-written per-product directories (2,196 lines) with one
 * component fed by `GET /catalog/products/:slug`.
 *
 * Everything that used to be hardcoded now comes from the API:
 *   packs, prices, stock  → variants
 *   highlights, gallery   → the `presentation` JSONB blob the CMS passes through
 *   description           → sanitised HTML from the CMS
 *   reviews               → approved reviews only
 *
 * `dangerouslySetInnerHTML` is safe here specifically because the backend
 * sanitises rich text on write against an allowlist — see Backend/src/lib/sanitize.ts.
 */
/**
 * Is this asset a transparent cutout that needs padding and a backdrop?
 *
 * PNGs in this catalogue are bottle shots on transparency; JPGs are full-bleed
 * design slides that carry their own layout and margins. Extension is a crude
 * signal but an accurate one here, and it beats adding a CMS field nobody would
 * remember to set.
 */
/**
 * Trim to a word boundary with an ellipsis.
 *
 * The catalogue's `shortDesc` is a hard 200-character cut of the full
 * description, so it ends mid-word — "…paprica essence create a m". Nothing
 * downstream can recover the missing words, but it can at least stop at the
 * last whole word and signal that there is more.
 */
function tidyExcerpt(text, limit = 200) {
  const s = String(text ?? "").trim();
  if (!s) return "";

  /*
   * Detect the CMS cut, do not just re-apply our own.
   *
   * shortDesc arrives at EXACTLY the limit, so `s.length > limit` is false and
   * a naive check leaves the mid-word ending untouched. What marks a truncated
   * string is that it reaches the cap and does not end in sentence punctuation.
   */
  const looksTruncated = s.length >= limit && !/[.!?]$/.test(s);
  if (!looksTruncated) return s;

  const cleaned = s
    .slice(0, limit)
    .replace(/\s+\S*$/, "")          // drop the partial trailing word
    .replace(/[\s,;:.\-–—]+$/, "");  // and any dangling punctuation
  return `${cleaned}…`;
}

const isCutout = (url) => /\.png(\?|$)/i.test(url ?? "");

export default function ProductDetail({ product, isDraft = false, isPreview = false }) {
  /*
   * TWO DIFFERENT QUESTIONS, previously conflated:
   *
   *   isPreview — "is this the staff-only token-gated preview route?"
   *   isDraft   — "does this product have unpublished draft changes?"
   *
   * Buying must be blocked on the whole PREVIEW ROUTE. Keying it to `isDraft`
   * was a real bug: a product with no pending overlay returns isDraft=false, so
   * the preview page rendered a live, working Add to Cart and staff could put
   * unpublished items into a real customer cart.
   */
  const readOnly = isPreview || isDraft;
  const { addToCart } = useCart();

  const packs = product.packs ?? [];
  /*
   * Open on the first PURCHASABLE pack, not simply the first one.
   *
   * Hardcoding 0 meant Koi Bites opened on its sold-out 500g pouch showing
   * "OUT OF STOCK", while the listing card for the same product offered the
   * in-stock 1kg — the two pages appeared to disagree about whether it could
   * be bought. Falling back to 0 keeps the page sensible when every pack is
   * gone, since the button correctly reads out of stock then anyway.
   */
  const firstAvailable = Math.max(
    0,
    packs.findIndex((p) => p.inStock !== false),
  );
  const [activePack, setActivePack] = useState(firstAvailable);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState("description");

  const pack = packs[activePack];
  const presentation = product.presentation ?? {};
  const gallery = presentation.gallery ?? [];
  const highlights = presentation.highlights ?? [];

  /*
   * Gallery: an ordered mix of photos and (at most) one video, exactly as the CMS
   * arranged it — so "photo, video, photo, photo" needs no special case here. We
   * walk the list and switch on `type`.
   *
   * `product.images` is the older images-only field, still sent for compatibility;
   * it is the fallback for a product saved before video existed.
   */
  const allMedia = (() => {
    if (product.media?.length) return product.media;
    if (product.images?.length) return product.images.map((i) => ({ ...i, type: "IMAGE" }));
    if (gallery.length) return gallery.map((g) => ({ type: "IMAGE", url: g.src, alt: g.alt }));
    return [{ type: "IMAGE", url: "/Bottles/Betta/Betta F3_Front.png", alt: product.name }];
  })();

  /*
   * Show only the SELECTED pack's photography, plus shared assets (sku === null:
   * fish photos, nutrition panels, the product video).
   *
   * One product sells the same feed as a 45g bottle, a 200g pouch and a 1kg
   * pouch, each shot separately. Without this filter the gallery mixed all three,
   * so choosing "45g Bottle" still showed 1kg pouch photos.
   *
   * Falls back to the unfiltered list when the selected pack has no photography
   * of its own — an empty gallery would be worse than a slightly generic one.
   */
  /*
   * A multi-pack has no photography of its own — "45g × 2" is two of the same
   * bottle — so it falls back to its BASE pack: G2-45GX2 -> G2-45G.
   *
   * Without this, the filter found nothing for G2-45GX2 and fell back to the
   * whole unfiltered gallery, so choosing "Pack of 2" showed 200g pouch and 1kg
   * pouch photos as well.
   */
  const baseSku = (sku) => (sku ? sku.replace(/X\d+$/i, "") : sku);

  const media = (() => {
    if (!pack?.sku) return allMedia;

    const wanted = [pack.sku];
    const base = baseSku(pack.sku);
    if (base !== pack.sku) wanted.push(base);

    const forPack = allMedia.filter((m) => !m.sku || wanted.includes(m.sku));
    // Genuinely no pack-specific photography anywhere — a generic gallery beats
    // an empty one.
    if (!forPack.some((m) => m.sku)) return allMedia;

    /*
     * RESPECT THE CMS ORDER. This used to return [...packSpecific, ...shared],
     * which reshuffled the whole gallery — so the order an admin arranged in the
     * Media tab was ignored, and reordering there appeared to do nothing.
     *
     * The only adjustment is the LEAD image: if the first item is a shared asset
     * (a video, or a generic fish photo) the hero would look identical for every
     * pack, defeating the filter. So the first pack-specific photo is promoted to
     * the front and everything else keeps its arranged order.
     */
    const leadIdx = forPack.findIndex((m) => m.sku);
    if (leadIdx <= 0) return forPack;
    return [forPack[leadIdx], ...forPack.filter((_, i) => i !== leadIdx)];
  })();

  const primaryImage = media.find((m) => m.type === "IMAGE")?.url ?? media[0]?.url;
  const [activeIndex, setActiveIndex] = useState(0);
  const active = media[activeIndex] ?? media[0];

  /**
   * Move through the gallery, wrapping at both ends.
   *
   * The `+ length` before the modulo keeps it correct going backwards from 0 —
   * `-1 % n` is -1 in JavaScript, not n-1.
   */
  const step = (dir) =>
    setActiveIndex((i) => (i + dir + media.length) % media.length);

  /*
   * COMING_SOON products are served by the catalogue on purpose (so they can be
   * teased before launch) but must not be purchasable. The API now sends `status`
   * — before it did not, so "coming soon" was indistinguishable from "out of
   * stock" and the PDP just showed a dead button with no explanation.
   */
  const isComingSoon = product.isComingSoon || product.status === "COMING_SOON";
  const outOfStock = !product.inStock || !pack?.inStock;
  /** Anything that blocks buying, for whatever reason. */
  const notBuyable = isComingSoon || outOfStock || readOnly;

  /*
   * Ceiling for this line, from the API (min of real stock and the per-line cap).
   * Falls back to 1 rather than 99 for an older payload without maxQty: refusing
   * to guess is safer than letting someone build a cart that fails at checkout.
   */
  const maxQty = pack?.maxQty ?? 1;
  const atMax = qty >= maxQty;

  /** Switching pack can lower the ceiling, so re-clamp rather than carry a bad qty. */
  const selectPack = (i) => {
    setActivePack(i);
    // The gallery is filtered by pack, so a stale index could point past the end
    // of the new list — or at a different product photo entirely.
    setActiveIndex(0);
    const nextMax = packs[i]?.maxQty ?? 1;
    setQty((q) => Math.min(q, Math.max(1, nextMax)));
  };

  const handleAddToCart = () => {
    // Guard the ACTION, not just the button. `disabled` is presentation only —
    // a preview must not be able to write to a real customer cart even if the
    // handler is reached some other way.
    if (readOnly) return;
    // Not yet on sale — guard the action, not just the button.
    if (isComingSoon) return;
    if (!pack || !pack.inStock) return;
    addToCart({
      sku: pack.sku,
      name: product.name,
      slug: product.slug,
      pack: pack.pack,
      pricePaise: pack.pricePaise,
      mrpPaise: pack.mrpPaise,
      image: primaryImage,
      accentBg: presentation.accentBg ?? "#d4f5ed",
      qty,
      // Carried into the cart so the drawer and cart page enforce the same
      // ceiling without having to re-fetch the product.
      maxQty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Header />

      {/* Preview banner — only on the token-gated staff route. */}
      {readOnly && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 px-4 py-2 text-center text-[12px] font-bold uppercase tracking-[0.15em] text-black font-[Montserrat]">
          {isDraft
            ? "Draft preview · unpublished changes · not visible to customers"
            : "Preview · staff only · not a customer view"}
        </div>
      )}

      <main className={`bg-[#06080f] min-h-screen text-[#dde2f6] pb-20 ${readOnly ? "pt-36" : "pt-28"}`}>
        <div className="max-w-[1180px] mx-auto px-6 sm:px-10">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-[Montserrat] text-white/30">
            <a href="/" className="hover:text-white/60 transition-colors">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-white/60 transition-colors">Products</a>
            <span>/</span>
            <span className="text-white/60">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* ── Gallery ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
              {/*
                Light frame, not the page's dark surface.

                This defaulted to rgba(68,229,194,0.06) — a barely-tinted teal
                that reads as near-black over the dark page. Product artwork is
                designed for print and packaging, so several assets carry dark
                text on a transparent background; on that frame the text was
                effectively invisible. A near-white panel is what the artwork
                expects, and it also makes the bottle photography pop.

                A CMS-supplied accentBg still wins, so a product can override
                this per-item.
              */}
              {/*
                The frame takes the shape of what it holds.

                Images are 1:1, but the product video is 1920x1080. Forcing 16:9
                into a square left ~44% of the frame empty above and below the
                video — letterboxing that no amount of padding fixes, because it
                is the aspect mismatch itself.

                No background either when the media is full-bleed: a JPG slide or
                a video fills the box edge to edge, so a panel behind it is never
                visible. The tint stays for transparent PNG cutouts, which do sit
                on it.
              */}
              {/*
                The frame is ALWAYS square — it must not resize between slides.

                An aspect-video frame fitted the 1920x1080 video exactly, but the
                frame then shrank from 588px to 331px whenever you stepped onto
                it, shifting everything below by 257px. Stable geometry is worth
                more than filling one slide of five.

                The video is centred instead, with the light panel visible above
                and below it — which is why the panel stays for video as well as
                for transparent cutouts, and is dropped only for the full-bleed
                JPG slides that cover the box edge to edge.
              */}
              <div
                className="group relative aspect-square overflow-hidden rounded-3xl flex items-center justify-center"
                style={{
                  /*
                   * Three cases, one per kind of media:
                   *
                   *   PNG cutout  — light panel, so the bottle has something to
                   *                 sit on and its dark label stays readable.
                   *   VIDEO       — the PAGE colour. A 16:9 file in a square
                   *                 frame leaves ~44% empty, and as a white band
                   *                 that emptiness is the loudest thing on the
                   *                 slide. Matching #06080f makes it vanish into
                   *                 the page, so only the video itself reads.
                   *   JPG slide   — transparent; the artwork covers the box.
                   */
                  background: isCutout(active?.url)
                    ? (presentation.accentBg ?? "#f4f7f6")
                    : active?.type === "VIDEO"
                    ? "#06080f"
                    : "transparent",
                }}
              >
                {active?.type === "VIDEO" ? (
                  /*
                   * controls + muted + playsInline, and deliberately NOT autoplay:
                   * a product page that starts making noise is hostile, and iOS
                   * blocks unmuted autoplay anyway. preload="metadata" fetches
                   * only the header, not the whole file, so a 100 MB video costs
                   * nothing until the shopper presses play.
                   */
                  <video
                    key={active.url}
                    // React does not reflect `muted` to the DOM attribute, so set
                    // it on the element itself or the video plays with sound.
                    ref={(el) => {
                      if (el) el.muted = true;
                    }}
                    src={active.url}
                    poster={active.posterUrl ?? primaryImage}
                    controls
                    playsInline
                    preload="metadata"
                    /*
                     * object-contain centres the 16:9 file in the square frame.
                     * No rounding: the frame behind it is now the page colour,
                     * so rounded corners would cut into the video itself rather
                     * than soften an edge against a visible panel.
                     */
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Image
                    src={active?.url ?? primaryImage}
                    alt={active?.alt ?? product.name}
                    width={640}
                    height={640}
                    /*
                     * Padding only for transparent cutouts.
                     *
                     * Every asset is a 1:1 square, matching this frame, so
                     * object-contain never crops. But a flat p-10 shrank the
                     * artwork to 86% of the frame — and the JPG design slides
                     * ("Key Features", nutrition panels) already carry their
                     * own margins, so the result looked inset and clipped.
                     *
                     * PNGs here are bottle cutouts on transparency, which do
                     * need breathing room or they touch the frame edge. JPGs
                     * are full-bleed layouts and should fill it completely.
                     */
                    className={`h-full w-full object-contain ${
                      isCutout(active?.url) ? "p-10" : "p-0"
                    }`}
                    priority
                  />
                )}
                {product.badge && (
                  <span className="absolute top-5 left-5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-[#00382d] font-[Montserrat]">
                    {product.badge}
                  </span>
                )}

                {/*
                  Prev / next arrows.

                  Previously the only way through 19 images was the thumbnail
                  strip, which needs horizontal scrolling to even reach the
                  later ones. Dark chevrons because the frame is now light.

                  type="button" matters: this sits inside the page, and a bare
                  <button> in a form context would submit it.
                */}
                {media.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-[#0b1220] shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    >
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-[#0b1220] shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    >
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {/* Position readout — 19 thumbnails give no sense of place. */}
                    <span className="absolute bottom-4 right-4 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold tabular-nums text-white/90 font-[Montserrat]">
                      {activeIndex + 1} / {media.length}
                    </span>
                  </>
                )}
              </div>

              {media.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {media.map((item, i) => (
                    <button
                      key={item.url + i}
                      onClick={() => setActiveIndex(i)}
                      type="button"
                      // Same light fill as the main frame, or dark-inked
                      // artwork is unreadable at 72px too.
                      className={`relative shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden border transition-all duration-200 ${
                        i === activeIndex
                          ? "border-primary ring-2 ring-primary/40"
                          : "border-white/10 hover:border-white/30"
                      }`}
                      style={{ background: presentation.accentBg ?? "#f4f7f6" }}
                      aria-label={
                        item.type === "VIDEO" ? "Play product video" : `View image ${i + 1}`
                      }
                    >
                      {/* A video thumbnail is its poster frame — never the video. */}
                      <Image
                        src={item.type === "VIDEO" ? (item.posterUrl ?? primaryImage) : item.url}
                        alt={item.alt ?? ""}
                        width={72}
                        height={72}
                        // Same rule as the main frame: pad cutouts, let
                        // full-bleed slides fill the tile.
                        className={`h-full w-full object-contain ${
                          isCutout(item.url) ? "p-2" : "p-0"
                        }`}
                      />
                      {item.type === "VIDEO" && (
                        <span className="absolute inset-0 grid place-items-center bg-black/35">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/90">
                            <svg width="10" height="11" viewBox="0 0 10 11" fill="#00382d" aria-hidden="true">
                              <path d="M0 0.5v10l10-5-10-5z" />
                            </svg>
                          </span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Buy box ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-px w-5 bg-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary font-[Montserrat]">
                    {product.category}
                  </span>
                </div>
                <h1 className="font-[Playfair_Display] text-[36px] sm:text-[44px] leading-tight text-white">
                  {product.name}
                </h1>
                {/*
                  shortDesc is a hard 200-char cut and ends mid-word, so the
                  hero showed "…paprica essence create a m". Tidy it to the last
                  whole word — the complete copy renders in the Description tab
                  below from fullDescHtml.
                */}
                <p className="mt-3 text-[14px] leading-relaxed text-white/45 font-[Montserrat]">
                  {tidyExcerpt(product.shortDesc)}
                </p>
              </div>

              {/* Reviews summary */}
              {product.reviews?.count > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex" aria-label={`${product.reviews.average} out of 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <svg key={n} viewBox="0 0 20 20" className="w-4 h-4"
                        fill={n <= Math.round(product.reviews.average) ? "#44e5c2" : "rgba(255,255,255,0.15)"}>
                        <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[12px] text-white/40 font-[Montserrat]">
                    {product.reviews.average} · {product.reviews.count} review
                    {product.reviews.count === 1 ? "" : "s"}
                  </span>
                </div>
              )}

              {/* Pack selector */}
              {packs.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 font-[Montserrat]">
                    Pack size
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {packs.map((p, i) => (
                      <button
                        key={p.sku}
                        onClick={() => selectPack(i)}
                        disabled={!p.inStock}
                        className={`relative rounded-xl border px-5 py-3 text-left transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                          i === activePack
                            ? "border-primary/50 bg-primary/8"
                            : "border-white/10 hover:border-white/25"
                        }`}
                      >
                        <div className="text-[14px] font-semibold text-white font-[Montserrat]">
                          {p.pack}
                        </div>
                        <div className="text-[12px] text-white/45 font-[Montserrat]">
                          {formatInr(p.pricePaise)}
                        </div>
                        {!p.inStock && (
                          <span className="mt-1 block text-[10px] uppercase tracking-wider text-red-400 font-[Montserrat]">
                            Sold out
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              {pack && (
                <div className="flex items-baseline gap-3">
                  <span className="font-[Playfair_Display] text-[34px] text-white">
                    {formatInr(pack.pricePaise)}
                  </span>
                  {pack.mrpPaise > pack.pricePaise && (
                    <>
                      <span className="text-[15px] text-white/30 line-through font-[Montserrat]">
                        {formatInr(pack.mrpPaise)}
                      </span>
                      <span className="rounded-full bg-primary/12 px-2.5 py-1 text-[11px] font-bold text-primary font-[Montserrat]">
                        {discountPct(pack.mrpPaise, pack.pricePaise)}% off
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Quantity + add to cart */}
              {/* Say WHY it cannot be bought, rather than only greying the button. */}
              {isComingSoon && !readOnly && (
                <div className="rounded-2xl border border-primary/25 bg-primary/8 px-5 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary font-[Montserrat]">
                    Coming soon
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/60 font-[Montserrat]">
                    This product is not on sale yet. Follow us or talk to a dealer to hear
                    when it launches.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/*
                  Hidden when nothing can be bought. Choosing a quantity next to a
                  dead "Coming soon" / "Out of stock" button is meaningless, and it
                  makes the button look like the thing that is broken.
                */}
                <div
                  className={`flex items-center rounded-full border border-white/12 ${
                    notBuyable ? "hidden" : ""
                  }`}
                >
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 text-white/50 hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-[14px] font-semibold text-white font-[Montserrat] tabular-nums">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    disabled={atMax}
                    title={atMax ? `Maximum ${maxQty} per order` : "Increase quantity"}
                    className="w-11 h-11 text-white/50 transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-white/15 disabled:hover:text-white/15"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={notBuyable}
                  className="flex-1 rounded-full bg-primary py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-[#00382d] font-[Montserrat] transition-all duration-200 hover:bg-primary/85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {readOnly
                    ? "Preview mode — cannot buy"
                    : isComingSoon
                      ? "Coming soon"
                      : outOfStock
                        ? "Out of stock"
                        : added
                          ? "Added to cart ✓"
                          : `Add to cart · ${formatInr((pack?.pricePaise ?? 0) * qty)}`}
                </button>
              </div>

              {/* Highlights */}
              {highlights.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {highlights.slice(0, 6).map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <div>
                        <div className="text-[13px] font-semibold text-white/85 font-[Montserrat]">
                          {h.title}
                        </div>
                        {h.sub && (
                          <div className="text-[11px] text-white/35 font-[Montserrat]">{h.sub}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/*
                Key benefits (from the CMS).

                These were rounded pills in a flex-wrap row. That works for short
                tags, but these are full sentences — each pill claimed its own line
                and the differing widths made a ragged staircase of outlines, with
                the border drawing more attention than the words.

                Now a two-column checklist: a teal check carries the "benefit"
                meaning, the text is readable at 13px, and equal columns give a
                clean left edge. Matches the `highlights` block above, so a
                product with either data source looks the same.
              */}
              {product.benefits?.length > 0 && highlights.length === 0 && (
                <div className="pt-1">
                  <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                    {product.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="mt-[3px] shrink-0"
                          aria-hidden="true"
                        >
                          <circle cx="8" cy="8" r="7.25" stroke="rgba(68,229,194,0.35)" />
                          <path
                            d="M4.75 8.25L6.9 10.4L11.25 6"
                            stroke="#44E5C2"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-[13px] leading-[1.45] text-white/70 font-[Montserrat]">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/*
                Mandatory listing declarations.

                The Legal Metrology (Packaged Commodities) Rules require an
                e-commerce listing to show net quantity, country of origin,
                the manufacturer's name and address, and consumer-care contact
                details. None of these were on the page.

                Net quantity comes from the selected pack, so it tracks the
                variant the customer is actually buying rather than stating one
                figure for the whole product.
              */}
              <details className="rounded-xl border border-white/10 bg-white/[0.02]">
                <summary className="cursor-pointer list-none px-4 py-3 text-[12.5px] font-semibold text-white/70 font-[Montserrat] transition-colors hover:text-white">
                  Product & seller information
                </summary>
                <dl className="space-y-2 border-t border-white/8 px-4 py-3.5 text-[12px] leading-relaxed text-white/45 font-[Montserrat]">
                  {pack?.pack && (
                    <div>
                      <dt className="inline text-white/35">Net quantity: </dt>
                      <dd className="inline">{pack.pack}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="inline text-white/35">Country of origin: </dt>
                    <dd className="inline">{COMPANY.countryOfOrigin}</dd>
                  </div>
                  <div>
                    <dt className="inline text-white/35">Marketed by: </dt>
                    <dd className="inline">
                      {COMPANY.legalName}, {COMPANY_ADDRESS_LINE}
                    </dd>
                  </div>
                  <div>
                    <dt className="inline text-white/35">Consumer care: </dt>
                    <dd className="inline">
                      <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">
                        {COMPANY.email}
                      </a>
                      {" · "}
                      <a href={COMPANY.phoneHref} className="text-primary hover:underline">
                        {COMPANY.phone}
                      </a>
                    </dd>
                  </div>
                  <p className="pt-1 text-[11.5px] text-white/30">
                    Prices are inclusive of all taxes. Any struck-through figure is
                    the printed maximum retail price.
                  </p>
                </dl>
              </details>

              {/*
                Explain the ceiling instead of leaving a dead "+". Only shown once
                it is actually reached, so a normal 1-unit purchase sees nothing.
              */}
              {!outOfStock && !readOnly && atMax && (
                <p className="text-[11.5px] text-white/45 font-[Montserrat]">
                  {/*
                    No dealer-enquiry route exists yet (the header's "Find a Dealer"
                    is a button with no handler), so this deliberately does not link
                    anywhere rather than pointing at a 404.
                  */}
                  Maximum {maxQty} per order.
                </p>
              )}

              {pack && (
                <p className="text-[11px] text-white/20 font-[Montserrat]">SKU: {pack.sku}</p>
              )}
            </div>
          </div>

          {/* ── Tabs ──────────────────────────────────────────────────── */}
          <div className="mt-20">
            <div className="flex gap-1 border-b border-white/8">
              {[
                ["description", "Description"],
                ["nutrition", "Nutrition"],
                ["feeding", "Feeding guide"],
                ["reviews", `Reviews${product.reviews?.count ? ` (${product.reviews.count})` : ""}`],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] font-[Montserrat] transition-all duration-200 ${
                    tab === key
                      ? "border-b-2 border-primary text-primary"
                      : "text-white/35 hover:text-white/60"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="py-8">
              {tab === "description" && (
                <div
                  className="prose-zewa max-w-[720px] text-[14px] leading-relaxed text-white/60 font-[Montserrat]"
                  // Safe: sanitised server-side on write against an allowlist.
                  dangerouslySetInnerHTML={{ __html: product.fullDescHtml || "<p>Details coming soon.</p>" }}
                />
              )}

              {tab === "nutrition" && (
                <div className="max-w-[520px]">
                  <div className="mb-4 flex items-baseline gap-3">
                    <span className="font-[Playfair_Display] text-[30px] text-primary">
                      {product.proteinPct}%
                    </span>
                    <span className="text-[13px] text-white/45 font-[Montserrat]">
                      insect protein
                    </span>
                  </div>
                  {Object.keys(product.nutrition ?? {}).length > 0 ? (
                    <dl className="divide-y divide-white/6">
                      {Object.entries(product.nutrition).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-3">
                          <dt className="text-[13px] capitalize text-white/45 font-[Montserrat]">
                            {key}
                          </dt>
                          <dd className="text-[13px] text-white/85 font-[Montserrat]">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-[13px] text-white/35 font-[Montserrat]">
                      Full nutritional analysis coming soon.
                    </p>
                  )}
                </div>
              )}

              {tab === "feeding" && (
                <div className="max-w-[720px] flex flex-col gap-5">
                  {(product.feeding?.frequency || product.feeding?.portion) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.feeding.frequency && (
                        <div className="rounded-xl border border-white/8 bg-white/3 p-4">
                          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35 font-[Montserrat]">
                            Frequency
                          </div>
                          <div className="text-[14px] text-white/85 font-[Montserrat]">
                            {product.feeding.frequency}
                          </div>
                        </div>
                      )}
                      {product.feeding.portion && (
                        <div className="rounded-xl border border-white/8 bg-white/3 p-4">
                          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35 font-[Montserrat]">
                            Portion
                          </div>
                          <div className="text-[14px] text-white/85 font-[Montserrat]">
                            {product.feeding.portion}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {product.feeding?.notesHtml ? (
                    <div
                      className="prose-zewa text-[14px] leading-relaxed text-white/60 font-[Montserrat]"
                      dangerouslySetInnerHTML={{ __html: product.feeding.notesHtml }}
                    />
                  ) : (
                    !product.feeding?.frequency && (
                      <p className="text-[13px] text-white/35 font-[Montserrat]">
                        Feeding guidance coming soon.
                      </p>
                    )
                  )}
                </div>
              )}

              {tab === "reviews" && (
                <div className="max-w-[720px] flex flex-col gap-8">
                  {product.reviews?.items?.length > 0 ? (
                    <div className="flex flex-col gap-5">
                      {product.reviews.items.map((r, i) => (
                        <div key={i} className="rounded-xl border border-white/8 bg-white/3 p-5">
                          <div className="mb-2 flex items-center gap-3">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <svg key={n} viewBox="0 0 20 20" className="w-3.5 h-3.5"
                                  fill={n <= r.rating ? "#44e5c2" : "rgba(255,255,255,0.15)"}>
                                  <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-[12px] font-semibold text-white/70 font-[Montserrat]">
                              {r.author}
                            </span>
                            {r.verifiedPurchase && (
                              <span className="rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-bold text-primary font-[Montserrat]">
                                Verified purchase
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] leading-relaxed text-white/55 font-[Montserrat]">
                            {r.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-white/35 font-[Montserrat]">
                      No reviews yet — be the first.
                    </p>
                  )}

                  {!readOnly && <ReviewForm productSlug={product.slug} />}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
