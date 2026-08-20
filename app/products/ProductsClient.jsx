"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";
import { formatInr, catalog } from "@/lib/api";
import { useHoverVideo } from "@/lib/useHoverVideo";
import { PLACEHOLDER_IMAGE } from "./adapters";
import { COMPANY } from "@/lib/company";

// ─── SVG icons ────────────────────────────────────────────────────────────────
const IcoMicroscope = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
    <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 10v6M5 16h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M11 5l2-2 2 2-2 2-2-2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M14 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const IcoLeaf = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
    <path d="M10 17C10 17 3 13 3 7a7 7 0 0 1 14 0c0 6-7 10-7 10z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M10 17V10M10 10C10 10 7 8 7 6M10 10C10 10 13 8 13 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const IcoMakeInIndia = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-primary">
    {/* Clean geometric Tiger Head / Make in India Icon */}
    {/* Ears */}
    <path d="M4.5 6C4 3.8 6 3 7.5 4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M15.5 6C16 3.8 14 3 12.5 4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    {/* Head shape */}
    <path d="M4.5 6C4 9.5 5 13 7.5 15L10 16.5L12.5 15C15 13 16 9.5 15.5 6C13.8 6.5 12.5 5 10 5C7.5 5 6.2 6.5 4.5 6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    {/* Forehead Tiger stripes / Crown */}
    <path d="M10 5.8V9M8.2 7.2L10 8.5M11.8 7.2L10 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Eyes & Nose bridge */}
    <path d="M7 10.2L8.2 9.8M13 10.2L11.8 9.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M9 13H11L10 14Z" fill="currentColor"/>
    {/* Whiskers */}
    <path d="M6 12L3.5 11.5M6 13.2L3.2 13.8M14 12L16.5 11.5M14 13.2L16.8 13.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
  </svg>
);

const IcoLarva = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
    <ellipse cx="10" cy="10" rx="7" ry="4" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="4" cy="9" r="1" fill="currentColor" opacity=".5"/>
    <path d="M6 8.5 Q8 7 10 8.5 Q12 10 14 8.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    <circle cx="16.5" cy="9.5" r=".8" fill="currentColor"/>
  </svg>
);

const TRUST_BADGES = [
  { icon: <IcoMicroscope />, label: "NABL Tested" },
  { icon: <IcoLeaf />, label: "100% Natural" },
  { icon: <IcoMakeInIndia />, label: "Made in India" },
  { icon: <IcoLarva />, label: "Insect Protein" },
];


/**
 * Filter chips.
 *
 * The list is the CMS taxonomy (GET /catalog/categories), NOT a summary of the
 * products currently on the page. Deriving it from the products was wrong: only
 * three of thirteen products are published, so every category whose products
 * are still DRAFT — Dried BSF Larvae, Bottom Dwellers, Hatchery Feeds —
 * disappeared from the shop entirely.
 *
 * A chip with nothing behind it yet is the correct behaviour here: the taxonomy
 * is fixed, and the products fill in as they are published.
 *
 * `fallback` is used only if the categories call fails, so the page still has
 * filters rather than none.
 */
function buildCategories(categories, products) {
  if (categories?.length) return ["All", ...categories];

  const seen = [];
  for (const p of products) {
    const [category] = p.tags ?? [];
    if (category && !seen.includes(category)) seen.push(category);
  }
  return ["All", ...seen];
}

function ProductCard({ p }) {
  const gallery = p.gallery || [p.image];
  const [imgIdx, setImgIdx] = useState(0);
  /**
   * Is the image well currently showing its LIGHT treatment?
   *
   * Drives the well background, the accent wash, and the contrast of the
   * arrows and dots drawn over it — all of which were built white-on-dark and
   * vanish against a light backdrop.
   *
   * Unlike the PDP, this is NOT decided per image. The grid shows every product
   * side by side, so keying off each card's current slide made cards flip
   * between light and dark as their galleries auto-rotated — some products lead
   * with a PNG cutout, others with a JPEG. The well stays light for every card
   * and only reverts for video, which brings its own dark frame.
   */
  /*
   * The gallery controls sit ON the photograph now that it fills the well, and
   * the photos disagree — white for Koi, dark navy for Betta. Neither a light
   * nor a dark treatment works across both, so the controls carry their own
   * contrast: a translucent dark scrim with a white glyph, which reads on
   * anything underneath.
   */
  const autoTimerRef = useRef(null);

  /*
   * Hover film.
   *
   * The timer, the pointer-capability check, the one-video-at-a-time rule and
   * the cleanup all live in the hook rather than here. They were a bare
   * setTimeout in this component, which meant every card carried its own copy of
   * four subtle rules and a leak on unmount.
   */
  const hover = useHoverVideo({ src: p.video });
  const showVideo = hover.playing;

  const stopAuto = useCallback(() => {
    clearInterval(autoTimerRef.current);
    autoTimerRef.current = null;
  }, []);

  const startImageCycle = useCallback(() => {
    if (gallery.length < 2) return;
    autoTimerRef.current = setInterval(() => {
      setImgIdx((prev) => (prev + 1) % gallery.length);
    }, 1000);
  }, [gallery.length]);

  const handleMouseEnter = useCallback(() => {
    /*
     * ORDER: photograph, then film, then the rest of the photography.
     *
     * With a film the card holds its photograph while the hook waits out the
     * two seconds, then crosses to the video — and does NOT cycle stills
     * underneath it, which would change the picture behind a playing film.
     * Without one, cycling the remaining images is the whole behaviour.
     */
    if (p.video) {
      hover.onEnter();
      return;
    }
    startImageCycle();
  }, [startImageCycle, p.video, hover]);

  const handleMouseLeave = useCallback(() => {
    stopAuto();
    hover.onLeave();
    setImgIdx(0);
  }, [stopAuto, hover]);

  const goTo = useCallback((dir, e) => {
    e.preventDefault();
    e.stopPropagation();
    stopAuto();
    /*
     * Stepping the gallery cancels the film. The arrows are available while it
     * plays, and without this the still underneath would change invisibly
     * behind the video — the click would appear to do nothing.
     */
    hover.onLeave();
    setImgIdx((prev) => (prev + dir + gallery.length) % gallery.length);
  }, [gallery.length, stopAuto, hover]);

  useEffect(() => () => clearInterval(autoTimerRef.current), []);

  return (
    <a
      href={p.slug ? `/products/${p.slug}` : undefined}
      className={`group relative flex flex-col rounded-2xl border border-[#44e5c2]/30 hover:border-[#44e5c2]/55 shadow-[0_0_15px_rgba(68,229,194,0.12)] hover:shadow-[0_0_25px_rgba(68,229,194,0.22)] transition-all duration-300 hover:-translate-y-0.5 ${p.slug ? "cursor-pointer" : "cursor-default pointer-events-none"}`}
      style={{ background: "linear-gradient(160deg, #0d1726 0%, #0a1219 100%)", overflow: "hidden" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${p.accentColor || "rgba(68,229,194,0.12)"}, transparent)` }} />

      {/*
        Image / Video zone.

        Photography FILLS this area rather than sitting inside it.

        Each product's imagery carries its own backdrop, and they disagree: the
        Koi shot is white, Betta is dark navy, Guppy is a transparent cutout.
        Any well colour chosen here therefore framed at least one of them as a
        visible rectangle in a second, slightly different shade. Letting the
        photo cover the well makes its own background the card's background, so
        there is no second colour to mismatch.

        The white underlay is for transparent cutouts only — they have no
        background of their own and would otherwise show the dark card through.
        The well is SQUARE because the source photography is 1:1. At the old
        220px-tall letterbox, object-cover cropped the packs badly — Betta lost
        its lower half. Matching the source aspect means the photo fills the
        well with no crop at all.
      */}
      <div
        className="relative aspect-square overflow-hidden rounded-2xl bg-[#070e19]"
        style={{
          transition: "background-color 0.4s ease",
        }}
      >
        {/* Soft cyan backdrop aura */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(68, 229, 194, 0.22) 0%, rgba(68, 229, 194, 0.05) 55%, transparent 75%)",
          }}
        />
        {/* Gallery images — crossfade */}
        {gallery.map((src, gi) => (
          <Image
            key={src}
            src={src}
            alt={`${p.name} ${gi + 1}`}
            width={440}
            height={440}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none rounded-2xl"
            style={{
              opacity: !showVideo && gi === imgIdx ? 1 : 0,
              transform: !showVideo && gi === imgIdx ? "scale(1.02)" : "scale(1)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              zIndex: gi === imgIdx ? 2 : 1,
            }}
          />
        ))}

        {/*
          Video — fades in once it is genuinely playing, after 2s of hover.

          CONTAIN, not cover. The photography is 1:1 and fills the square well
          exactly, but the clips are 16:9: covering a square with them crops
          about 44% of the frame width, which cut the burned-in caption off
          mid-sentence and removed the logo entirely.

          So the clip is letterboxed and the well goes dark behind it for the
          duration. Losing the white surround for a few seconds of hover is a
          far smaller cost than showing a truncated caption.
        */}
        {p.video && hover.canHover && (
          <video
            {...hover.videoProps}
            /*
              No `src` attribute: the hook attaches it once the pointer has
              stayed for two seconds. With it set here the browser may fetch
              early regardless of preload="none", and these files are megabytes.

              `poster` still paints a real frame the instant playback begins,
              so the crossfade never lands on black.
            */
            poster={p.poster ?? undefined}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{
              /*
                Revealed only when frames are actually on screen — the hook sets
                this from the `playing` event, not from "we asked it to play".
                A file that stalls or is refused leaves the photograph in place.
              */
              opacity: showVideo ? 1 : 0,
              transition: "opacity 0.6s ease",
              zIndex: showVideo ? 10 : 0,
            }}
          />
        )}

        {/* Badge */}
        {p.badge && (
          <span className={`absolute top-4 left-4 text-[9px] font-bold px-2.5 py-1 rounded-full tracking-widest font-[Montserrat] z-10 ${p.badgeColor || "bg-primary text-[#00382d]"}`}>
            {p.badge}
          </span>
        )}

        {/*
          Prev / Next. Available DURING the video too — it used to be gated on
          !showVideo, so once the film started there was no way back to the
          photos without leaving the card. Stepping the gallery also cancels the
          video, since the shopper has clearly asked to browse stills instead.

          Borderless on purpose: a bordered pill over product photography reads
          as chrome. Just the chevron with a soft shadow for legibility.
        */}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              /*
               * onMouseDown alone was not enough: suppressing mousedown does
               * not stop the click that follows, so the card's wrapping <a>
               * still navigated to the product page. The gallery arrows must
               * swallow the click too.
               */
              onMouseDown={(e) => goTo(-1, e)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-black/60"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 2L3.5 6L7.5 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next image"
              /*
               * onMouseDown alone was not enough: suppressing mousedown does
               * not stop the click that follows, so the card's wrapping <a>
               * still navigated to the product page. The gallery arrows must
               * swallow the click too.
               */
              onMouseDown={(e) => goTo(1, e)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-black/60"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 2L8.5 6L4.5 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {gallery.map((_, gi) => (
                <span key={gi} className="block rounded-full transition-all duration-300"
                  style={{ width: gi === imgIdx ? "16px" : "4px", height: "4px", background: gi === imgIdx ? "rgba(68,229,194,1)" : "rgba(255,255,255,0.55)", boxShadow: "0 1px 3px rgba(0,0,0,0.45)" }} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Name + tagline */}
      <div className="px-5 pt-1 pb-1 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {p.tags.slice(0, 1).map((t) => (
              <span key={t} className="text-[9px] font-bold text-primary/50 tracking-[0.18em] font-[Montserrat] uppercase">{t}</span>
            ))}
          </div>
          {p.protein && (
            <span className="text-[11px] font-bold text-primary font-[Montserrat]">{p.protein} <span className="text-white/25 font-normal text-[10px]">protein</span></span>
          )}
        </div>
        <h3 className="font-[Playfair_Display] text-[19px] text-white leading-snug group-hover:text-primary transition-colors duration-200">
          {p.name}
        </h3>
        <p className="text-[12px] text-white/35 font-[Montserrat] leading-relaxed line-clamp-3">{p.tagline}</p>
      </div>

      {/* Price + qty */}
      <div className="px-5 pb-5">
        {p.price ? (
          <>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="font-[Playfair_Display] text-[24px] text-white">
                ₹{p.price.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-white/20 line-through font-[Montserrat]">{p.mrp}</span>
            </div>
            <QtyButton product={p} />
          </>
        ) : (
          <div className="mt-3 pt-4 border-t border-white/5">
            <span className="text-[12px] text-white/25 font-[Montserrat] italic">Multiple packs</span>
          </div>
        )}
      </div>

      {p.slug && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"
          style={{ background: "linear-gradient(to right, rgba(68,229,194,0.6), transparent)" }} />
      )}
    </a>
  );
}

function FindMyFeedQuiz({ onClose }) {
  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(3,5,10,0.85)", backdropFilter: "blur(16px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-[500px] flex flex-col overflow-hidden rounded-3xl p-7 sm:p-9 text-center"
        style={{
          background: "linear-gradient(150deg, #0d1a2d 0%, #06111a 100%)",
          border: "1px solid rgba(68,229,194,0.22)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.85), 0 0 40px rgba(68,229,194,0.12)",
        }}
      >
        {/* Glow & top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.8) 50%, transparent)" }}
        />
        
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-40 pointer-events-none rounded-full"
          style={{ background: "radial-gradient(circle, rgba(68,229,194,0.18) 0%, transparent 70%)", filter: "blur(30px)" }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Icon / AI chip */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_20px_rgba(68,229,194,0.2)]">
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </div>

        {/* Eyebrow badge */}
        <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-primary font-[Montserrat]">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Feed Finder · Model In Training
        </div>

        {/* Heading */}
        <h3 className="font-[Playfair_Display] text-[24px] sm:text-[28px] font-bold text-white leading-snug mb-3">
          Coming Soon
        </h3>

        {/* Exact User Requested Copy */}
        <p className="text-[14px] sm:text-[15px] leading-relaxed text-white/70 font-[Montserrat] mb-8">
          This is a new feature, coming soon! While we train our models, please use the chat option below to connect with our expert team.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={COMPANY.phoneHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-primary text-[#00382d] text-[12px] font-bold tracking-[0.12em] uppercase font-[Montserrat] hover:bg-primary/90 transition-all duration-200 shadow-[0_0_20px_rgba(68,229,194,0.3)]"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.138-3.13C2.41 12.753 2 11.42 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm4 0H9v2h2V9zm4 0h-2v2h2V9z" />
            </svg>
            Connect With Expert Team
          </a>

          <button
            onClick={onClose}
            className="px-5 py-3.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-[12px] font-semibold tracking-wider uppercase font-[Montserrat] hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function QtyButton({ product }) {
  const { name, slug, image, pricePaise, mrpPaise, packLabel, inStock } = product;
  const [flash, setFlash] = useState(null);
  const { items, addToCart, setQty, removeFromCart } = useCart();

  /**
   * The REAL variant SKU, not a slug.
   *
   * Checkout is keyed on SKU, so a synthesised id here would fail validation
   * server-side. A product with no purchasable variant renders no button.
   */
  const sku = product.sku;
  if (!sku || !pricePaise) return null;

  const cartItem = items.find((i) => i.sku === sku);
  const qty = cartItem?.qty ?? 0;

  const trigger = (dir, fn) => (e) => {
    e.preventDefault();
    setFlash(dir);
    setTimeout(() => setFlash(null), 200);
    fn();
  };

  const handleAdd = (e) => {
    e.preventDefault();
    /*
     * Guard the ACTION, not just the button — `disabled` is presentation only.
     * Matches the same guard on the product detail page.
     */
    if (inStock === false || !sku) return;
    addToCart({
      sku,
      name,
      slug,
      pack: packLabel,
      pricePaise,
      mrpPaise,
      image,
      accentBg: "#1a2235",
    });
  };

  const handleDec = trigger("dec", () => {
    if (qty <= 1) removeFromCart(sku);
    else setQty(sku, qty - 1);
  });

  const handleInc = trigger("inc", () => setQty(sku, qty + 1));

  return (
    <div className="mt-4 pt-3 border-t border-white/5">
      {qty === 0 ? (
        <button
          onClick={handleAdd}
          disabled={inStock === false}
          className="w-full h-9 rounded-lg bg-primary text-[#00382d] text-[11px] font-bold tracking-[0.12em] uppercase font-[Montserrat] hover:bg-primary/85 active:scale-[0.97] transition-all duration-150 shadow-[0_0_16px_rgba(68,229,194,0.25)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {inStock === false ? "Sold out" : "+ Add"}
        </button>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center rounded-lg border border-primary/30 overflow-hidden h-9">
            <button onClick={handleDec}
              className={`w-9 h-9 flex items-center justify-center text-[20px] leading-none select-none font-light transition-all duration-150 ${flash === "dec" ? "bg-primary text-[#00382d]" : "bg-primary/8 text-primary hover:bg-primary/20"}`}>
              −
            </button>
            <span className="w-9 text-center text-white text-[13px] font-bold font-[Montserrat] tabular-nums select-none border-x border-primary/20">
              {qty}
            </span>
            <button onClick={handleInc}
              className={`w-9 h-9 flex items-center justify-center text-[20px] leading-none select-none font-light transition-all duration-150 ${flash === "inc" ? "bg-primary text-[#00382d]" : "bg-primary/8 text-primary hover:bg-primary/20"}`}>
              +
            </button>
          </div>
          <span className="font-[Montserrat] text-[14px] font-bold text-primary tabular-nums">
            {formatInr(pricePaise * qty)}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Adapt the API's product shape to what this page's cards already render.
 *
 * The design is unchanged — only the data source is. Prices arrive as paise and
 * are formatted here; `tags` come from the CMS category plus pack sizes so the
 * existing filter chips keep working.
 */


/*
 * No Suspense boundary and no useSearchParams here.
 *
 * Reading the query string on the client opts the whole subtree out of
 * server rendering, which is exactly the bug A1 is about — the server then
 * emits the Suspense fallback instead of the product grid. The server page
 * reads ?category= from its own searchParams and passes it down as a prop.
 */
export default function ProductsClient(props) {
  return <ProductsPageInner {...props} />;
}

function ProductsPageInner({ products, spotlights, loadFailed, initialCategory, categories }) {
  /*
   * The category filter is driven by ?category= in the URL.
   *
   * It was local state only, so the footer's category links — and any shared
   * or bookmarked filter URL — landed on the unfiltered grid. Six indexable
   * URLs all rendered the identical page.
   *
   * The chip still updates the URL via history.replaceState rather than a
   * router push: this is a filter, not a navigation, so it should not stack
   * entries in the back button.
   */
  const [active, setActive] = useState(initialCategory || "All");

  useEffect(() => {
    setActive(initialCategory || "All");
  }, [initialCategory]);

  const selectCategory = useCallback((cat) => {
    setActive(cat);
    const url = new URL(window.location.href);
    if (cat === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", cat);
    window.history.replaceState(null, "", url);
  }, []);
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);

  /*
   * The catalogue arrives as props, fetched on the SERVER.
   *
   * It used to be fetched here in an effect, which meant the server sent an
   * empty grid reading "0 products" — what search engines index and what a
   * no-JS or slow connection sees on a shop page. The fetch now happens in
   * app/products/page.jsx and the markup ships already populated.
   *
   * There is still deliberately NO bundled fallback catalogue. One used to
   * exist, and when the API was unreachable it rendered six invented products
   * with slugs that 404. Saying the catalogue is unavailable is honest;
   * showing a fictional one is not.
   */
  const [items, setItems] = useState(products || []);
  const [failed, setFailed] = useState(loadFailed);

  useEffect(() => {
    if (products && products.length > 0) {
      setItems(products);
      setFailed(false);
      return;
    }

    let isMounted = true;
    catalog
      .products()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setItems(data.map(adaptProduct));
          setFailed(false);
        }
      })
      .catch(() => {
        if (isMounted && (!items || items.length === 0)) {
          setFailed(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [products]);

  const PRODUCTS = items;
  /*
   * Derived per render from the catalogue in hand, so the chips and the grid
   * can never disagree about what exists.
   */
  const CATEGORIES = buildCategories(categories, PRODUCTS);
  /*
   * A ?category= value that no longer exists — an old bookmark, or a chip
   * removed as the catalogue changed — would leave the grid empty with no chip
   * highlighted, which reads as a broken page rather than an empty filter.
   * Falling back to "All" shows the catalogue instead.
   */
  const activeCategory = CATEGORIES.includes(active) ? active : "All";
  const loading = false;
  /*
   * NO FALLBACK FOR THE SPOTLIGHT.
   *
   * The bundled array advertises products by slugs that no longer exist
   * ("betta-bites-f3"), so it rendered a banner linking to a 404 — and because
   * the API legitimately returns zero spotlights when none are configured, it
   * showed PERMANENTLY, not just during load. An absent banner is correct here;
   * a wrong one is not.
   */
  const SPOTLIGHT = spotlights;
  const [quizOpen, setQuizOpen] = useState(false);

  /*
   * Hero rotation: banner 7s, range statement 5s.
   *
   * The two slides hold for different lengths, so this cannot be one interval —
   * the timeout is re-armed from the duration of whichever slide is showing.
   * Keying the effect on `heroSlide` also means a click on the dots resets the
   * clock, rather than leaving a stale timer to jump the slide moments later.
   */
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const HOLD_MS = [5000, 7000]; // [range statement, banner]
    const timer = setTimeout(
      () => setHeroSlide((s) => (s === 0 ? 1 : 0)),
      HOLD_MS[heroSlide],
    );
    return () => clearTimeout(timer);
  }, [heroSlide]);

  useEffect(() => {
    // Nothing to rotate while loading (or with a single slide) — and `% 0` is NaN.
    if (SPOTLIGHT.length < 2) return;
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setSlide((s) => (s + 1) % SPOTLIGHT.length);
        setFading(false);
      }, 350);
    }, 4000);
    return () => clearInterval(timer);
    // Re-created when the spotlight set arrives, so the modulo stays in range.
  }, [SPOTLIGHT.length]);

  const goTo = (i) => {
    if (i === slide) return;
    setFading(true);
    setTimeout(() => { setSlide(i); setFading(false); }, 350);
  };

  const sp = SPOTLIGHT.length ? (SPOTLIGHT[slide % SPOTLIGHT.length] ?? SPOTLIGHT[0]) : null;

  /*
   * Filter chips matched with `tags.includes(active)` — an exact string
   * comparison — and every chip except "Floating Pellets" therefore matched
   * nothing. The catalogue returns "Slow-Sinking Pellets" while the chip reads
   * "Slow Sinking Pellets", so a single hyphen silently emptied the grid.
   *
   * Normalising both sides (lowercase, punctuation stripped) makes the match
   * tolerant of hyphens, en-dashes and case, which is the only difference
   * between these two vocabularies. Pack-size chips like "1kg Packs" match
   * against pack labels ("1kg Pouch") via the substring test, since a label is
   * never exactly equal to the chip.
   */
  const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

  /*
   * A size chip names a weight, not a pack label. "1kg Packs" has to match
   * "1kg Pouch": neither string contains the other, so compare on the weight
   * token alone when the chip is a size rather than a category.
   */
  const sizeToken = (s) => {
    const m = norm(s).match(/^(\d+(?:kg|g))/);
    return m ? m[1] : null;
  };

  const filtered =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => {
          const target = norm(activeCategory);
          const size = sizeToken(activeCategory);
          return p.tags.some((tag) => {
            const t = norm(tag);
            if (size) return sizeToken(tag) === size;
            return t === target || t.includes(target) || target.includes(t);
          });
        });

  return (
    <>
      <Header />
      <main className="bg-[#06080f] text-[#dde2f6] min-h-screen">

        {/* ── Hero banner ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-14 sm:pt-20">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(68,229,194,0.07) 0%, transparent 70%), linear-gradient(180deg, #06080f 0%, #0b1220 100%)" }} />

          {/* Slide 0 — the range statement */}
          {heroSlide === 0 && (
            <div className="relative mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-16 pt-4 sm:pt-8 pb-6 sm:pb-8">
              <div className="relative flex min-h-[280px] sm:h-[380px] lg:h-[430px] items-center py-4 sm:py-0">
                <div className="w-full animate-fadeIn">
                  <div className="flex flex-col justify-between gap-6 sm:gap-8 lg:flex-row lg:items-center">
                    <div className="max-w-xl">
                      <div className="mb-3 sm:mb-5 flex items-center gap-3">
                        <div className="h-px w-5 bg-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary font-[Montserrat]">Our Range</span>
                      </div>
                      <h1 className="mb-3 sm:mb-5 font-[Playfair_Display] text-[30px] sm:text-[60px] leading-[1.05] text-white">
                        Engineered<br />
                        <span className="italic text-primary">for the species.</span>
                      </h1>
                      <p className="mb-4 sm:mb-5 text-[13.5px] sm:text-[16px] leading-relaxed text-white/45 font-[Montserrat]">
                        Every formula is NABL lab-tested, insect-protein based, and calibrated for a specific species and life stage.
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-6 sm:gap-8 lg:gap-14 flex-wrap">
                      {[
                        { val: "46%", label: "Max Protein", sub: "in the range" },
                        { val: "88%", label: "Digestibility", sub: "lab verified" },
                        { val: "13+", label: "Formulas", sub: "species-specific" },
                      ].map((s) => (
                        <div key={s.label} className="flex flex-col gap-0.5 sm:gap-1">
                          <span className="font-[Playfair_Display] text-[32px] sm:text-[48px] leading-none text-primary">{s.val}</span>
                          <span className="text-[11px] sm:text-[12px] font-semibold text-white/70 font-[Montserrat]">{s.label}</span>
                          <span className="text-[9.5px] sm:text-[10px] text-white/25 font-[Montserrat]">{s.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Slide dots — bottom right */}
                <div className="absolute bottom-1 right-2 sm:bottom-0 sm:right-0 z-10 flex items-center gap-2">
                  {[0, 1].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setHeroSlide(i)}
                      aria-label={i === 0 ? "Show range summary" : "Show brand banner"}
                      aria-current={heroSlide === i}
                      className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                        heroSlide === i ? "w-6 bg-primary" : "w-2 bg-white/25 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Slide 1 — Full Bleed Edge-to-Edge Brand Banner */}
          {heroSlide === 1 && (
            <div className="relative w-full h-[200px] sm:h-[380px] md:h-[450px] lg:h-[500px] animate-fadeIn overflow-hidden">
              <Image
                src="/banner-products.png"
                alt="Discover a diverse range of feeds to nourish every species of fish — Zewa Feeds"
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#06080f]/70 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#06080f] via-[#06080f]/30 to-transparent pointer-events-none" />

              {/* Slide dots */}
              <div className="absolute bottom-4 right-4 sm:right-10 lg:right-16 z-10 flex items-center gap-2">
                {[0, 1].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setHeroSlide(i)}
                    aria-label={i === 0 ? "Show range summary" : "Show brand banner"}
                    aria-current={heroSlide === i}
                    className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                      heroSlide === i ? "w-6 bg-primary" : "w-2 bg-white/25 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bottom subtle edge divider */}
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.25) 50%, transparent)" }} />
        </section>

        {/* ── Filter bar ──────────────────────────────────────────────── */}
        <div className="sticky top-20 z-30 bg-[#06080f]/96 backdrop-blur-md border-b border-white/5">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 flex items-center justify-between gap-3 py-2.5 sm:py-3">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full sm:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className={`shrink-0 px-3.5 sm:px-4 py-1.5 rounded-full text-[10.5px] sm:text-[11px] font-bold tracking-[0.08em] uppercase font-[Montserrat] transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-primary text-[#00382d]"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => setQuizOpen(true)}
                className="shrink-0 flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-[10.5px] sm:text-[11px] font-bold tracking-[0.08em] uppercase font-[Montserrat] transition-all duration-200 border border-primary/35 text-primary hover:bg-primary/10"
              >
                <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M5.5 5.5C5.5 4.67 6.172 4 7 4s1.5.67 1.5 1.5c0 .6-.36 1.1-.875 1.35L7 7.2V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <circle cx="7" cy="10" r=".5" fill="currentColor"/>
                </svg>
                Find My Feed
              </button>
            </div>
            <span className="hidden sm:inline-block shrink-0 text-[11px] text-white/20 font-[Montserrat]">{filtered.length} products</span>
          </div>
        </div>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-16">

          {/* ── Spotlight rotator ── */}
          {sp && (
          <a
            href={`/products/${sp.slug}`}
            className="block relative overflow-hidden rounded-2xl sm:rounded-3xl mb-8 cursor-pointer group"
            style={{ background: "linear-gradient(135deg, #0d1a2e 0%, #091a18 100%)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-700"
              style={{ background: `radial-gradient(ellipse 55% 90% at 28% 50%, ${sp.accent}, transparent 70%)` }}
            />

            <div
              className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-0"
              style={{ opacity: fading ? 0 : 1, transform: fading ? "translateY(8px)" : "translateY(0)", transition: "opacity 0.35s ease, transform 0.35s ease" }}
            >
              <div className="relative w-full sm:w-[38%] flex items-center justify-center py-6 sm:py-10 px-4 sm:px-8 shrink-0">
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 55%, ${sp.accent}, transparent 65%)` }} />
                <Image
                  src={sp.image}
                  alt={sp.name}
                  width={320}
                  height={320}
                  className="relative z-10 object-contain max-h-[180px] sm:max-h-[280px] w-auto rounded-2xl"
                  style={{ filter: "drop-shadow(0 20px 48px rgba(0,0,0,0.65))" }}
                />
              </div>

              <div className="flex flex-col justify-center gap-3.5 sm:gap-4 flex-1 px-5 sm:px-12 pb-8 sm:py-12 text-center sm:text-left">
                <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                  <span className="text-[9px] font-bold px-2.5 py-1 rounded-full tracking-widest font-[Montserrat] bg-primary/15 text-primary border border-primary/30">
                    {sp.badge}
                  </span>
                  <span className="text-[10px] text-white/30 font-[Montserrat] tracking-[0.15em] uppercase">{sp.category}</span>
                </div>

                <h2 className="font-[Playfair_Display] text-[24px] sm:text-[40px] text-white leading-tight">{sp.name}</h2>
                <p className="text-[12.5px] sm:text-[13px] text-white/40 font-[Montserrat] leading-relaxed max-w-sm mx-auto sm:mx-0">{sp.tagline}</p>

                <div className="flex items-center gap-5 justify-center sm:justify-start">
                  <div>
                    <span className="font-[Playfair_Display] text-[26px] sm:text-[30px] text-primary leading-none">₹{String(sp.price ?? "").replace("₹", "")}</span>
                    <span className="text-[11px] text-white/20 line-through font-[Montserrat] ml-2">{sp.mrp}</span>
                  </div>
                  <div className="w-px h-7 sm:h-8 bg-white/10" />
                  <div>
                    <span className="text-[18px] sm:text-[20px] font-bold text-primary font-[Montserrat] leading-none">{sp.protein}</span>
                    <span className="text-[10px] text-white/30 font-[Montserrat] ml-1.5">protein</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
                  {sp.packs.map((p) => (
                    <span key={p} className="text-[10px] px-3 py-1 rounded-full border border-white/10 text-white/35 font-[Montserrat]">{p}</span>
                  ))}
                </div>

                <div className="self-center sm:self-start inline-flex items-center gap-2 text-[11px] font-bold text-primary tracking-widest uppercase font-[Montserrat] group-hover:gap-3 transition-all duration-200">
                  Explore Product
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="pb-4 sm:pb-0 flex sm:flex-col items-center justify-center gap-2.5 sm:pr-10">
                {SPOTLIGHT.map((_, i) => (
                  <button key={i} onClick={(e) => { e.preventDefault(); goTo(i); }} aria-label={`Go to slide ${i + 1}`}>
                    <span className={`block rounded-full transition-all duration-300 ${
                      i === slide ? "w-5 h-1.5 sm:w-1.5 sm:h-5 bg-primary" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/45"
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          </a>
          )}

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="animate-pulse overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
                  >
                    <div className="aspect-square bg-white/[0.04]" />
                    <div className="space-y-2.5 p-5">
                      <div className="h-2 w-24 rounded bg-white/[0.06]" />
                      <div className="h-4 w-3/4 rounded bg-white/[0.07]" />
                      <div className="h-2 w-full rounded bg-white/[0.04]" />
                      <div className="h-2 w-2/3 rounded bg-white/[0.04]" />
                      <div className="mt-4 h-9 rounded-full bg-white/[0.05]" />
                    </div>
                  </div>
                ))
              : filtered.map((p, i) => <ProductCard key={`${p.name}-${i}`} p={p} />)}
          </div>

          {/*
            Honest failure states.

            Both sit outside the grid so they are never mistaken for a product.
            A retry is offered rather than a dead end — the usual cause is a
            transient network blip or a backend still waking up.
          */}
          {failed && (
            <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-14 text-center">
              <h3 className="font-[Playfair_Display] text-[20px] font-bold text-white">
                We couldn&apos;t load the catalogue
              </h3>
              <p className="max-w-md text-[13px] leading-relaxed text-white/45 font-[Montserrat]">
                Our product service is not responding right now. Nothing is wrong
                with your order or cart — please try again in a moment.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-1 rounded-xl bg-primary px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#00382d] font-[Montserrat] transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !failed && filtered.length === 0 && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-14 text-center">
              <p className="text-[13px] text-white/45 font-[Montserrat]">
                {PRODUCTS.length === 0
                  ? "No products are available just yet. Please check back soon."
                  : "No products match this filter."}
              </p>
            </div>
          )}

        </section>

        {/* ── Find My Feed Section ─────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Top rule */}
          <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.18) 50%, transparent)" }} />

          {/* Ambient background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]"
              style={{ background: "radial-gradient(ellipse, rgba(68,229,194,0.06) 0%, transparent 65%)", filter: "blur(60px)" }} />
          </div>

          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-16 sm:py-36">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">

              {/* Left — copy */}
              <div>
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-5 h-px bg-primary" />
                  <span className="text-[10px] font-bold text-primary tracking-[0.28em] font-[Montserrat] uppercase">Feed Finder</span>
                </div>

                <h2 className="font-[Playfair_Display] text-[30px] sm:text-[52px] text-white leading-[1.08] mb-4 sm:mb-6">
                  Not sure which<br />
                  <span className="text-primary italic">formula is right?</span>
                </h2>

                <p className="text-[13.5px] sm:text-[15px] text-white/40 font-[Montserrat] leading-relaxed mb-8 sm:mb-10 max-w-[440px]">
                  Answer four questions about your fish — species, size, life stage, and feeding goal — and we'll match you to the exact formula built for them.
                </p>

                <button
                  onClick={() => setQuizOpen(true)}
                  className="group inline-flex items-center gap-3.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                  style={{ background: "linear-gradient(135deg, #44e5c2 0%, #38d4b4 100%)", color: "#003d2e" }}
                >
                  <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0">
                    <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 7.5C7 6.67 7.895 6 9 6s2 .67 2 1.5c0 .664-.45 1.24-1.1 1.43L9 9.2V10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    <circle cx="9" cy="12.5" r=".7" fill="currentColor"/>
                  </svg>
                  <span className="text-[11.5px] sm:text-[12px] font-bold tracking-[0.18em] uppercase font-[Montserrat]">Find My Feed</span>
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <p className="mt-4 sm:mt-5 text-[10.5px] sm:text-[11px] text-white/20 font-[Montserrat]">Takes less than 60 seconds</p>
              </div>

              {/* Right — 4-step preview cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    step: "01", label: "Fish size", hint: "Small or large?",
                    icon: (
                      <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5 text-primary/60">
                        <ellipse cx="12" cy="14" rx="7" ry="4.5" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M5 14c-1.5-1.8-3-3.5-3-3.5s0 3.5 3 3.5z" fill="currentColor" opacity=".4"/>
                        <circle cx="16" cy="12.5" r=".9" fill="currentColor"/>
                      </svg>
                    ),
                  },
                  {
                    step: "02", label: "Species", hint: "Betta, cichlid, guppy…",
                    icon: (
                      <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5 text-primary/60">
                        <path d="M6 14c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M6 14c0 2.2-1.5 4-3 4s3-1.8 3-4z" fill="currentColor" opacity=".35"/>
                        <circle cx="17" cy="11" r="1" fill="currentColor"/>
                      </svg>
                    ),
                  },
                  {
                    step: "03", label: "Life stage", hint: "Fry or adult?",
                    icon: (
                      <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5 text-primary/60">
                        <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M14 9v2M14 17v2M9 14h2M17 14h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    ),
                  },
                  {
                    step: "04", label: "Feeding goal", hint: "Max nutrition or daily?",
                    icon: (
                      <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5 text-primary/60">
                        <path d="M14 4v7M14 4l-2.5 3.5M14 4l2.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 13h14l-1.5 8H8.5L7 13z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                      </svg>
                    ),
                  },
                ].map(({ step, label, hint, icon }) => (
                  <button
                    key={step}
                    onClick={() => setQuizOpen(true)}
                    className="group flex flex-col gap-3 p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(68,229,194,0.06)"; e.currentTarget.style.borderColor = "rgba(68,229,194,0.25)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[9px] font-bold tracking-[0.25em] font-[Montserrat] text-white/15 uppercase">{step}</span>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(68,229,194,0.08)", border: "1px solid rgba(68,229,194,0.12)" }}>
                        {icon}
                      </div>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold font-[Montserrat] text-white leading-none mb-1 group-hover:text-primary transition-colors duration-150">{label}</p>
                      <p className="text-[11px] text-white/25 font-[Montserrat]">{hint}</p>
                    </div>
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Bottom rule */}
          <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.05) 50%, transparent)" }} />
        </section>

        {/* ── Trust strip ─────────────────────────────────────────────── */}
        <section>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-10">
          {/* Trust strip */}
          <div className="pt-0 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/18 font-[Montserrat] tracking-wide text-center sm:text-left">
              Manufactured at {COMPANY.legalName} · {COMPANY.address.city}, {COMPANY.address.state} · NABL Lab Certified
            </p>
            <div className="flex items-center justify-center sm:justify-end gap-4 sm:gap-6 flex-wrap">
              {TRUST_BADGES.map((b) => (
                <span key={b.label} className="flex items-center gap-1.5 text-[10px] text-white/25 font-[Montserrat] whitespace-nowrap">
                  <span className="text-primary/50">{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
          </div>
        </section>

      </main>
      <Footer />
      {quizOpen && <FindMyFeedQuiz onClose={() => setQuizOpen(false)} products={PRODUCTS} />}
    </>
  );
}
