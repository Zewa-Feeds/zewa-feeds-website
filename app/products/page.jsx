"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";
import { catalog, formatInr } from "@/lib/api";

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
const IcoMapPin = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
    <path d="M10 2a5 5 0 0 1 5 5c0 3.5-5 11-5 11S5 10.5 5 7a5 5 0 0 1 5-5z" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="10" cy="7" r="1.8" fill="currentColor" opacity=".5"/>
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
  { icon: <IcoMapPin />, label: "Made in India" },
  { icon: <IcoLarva />, label: "Insect Protein" },
];

/**
 * Shown when a product carries no image of its own.
 *
 * A neutral panel rather than a photo of some other product: borrowing another
 * item's picture is worse than showing none, because it misrepresents what the
 * customer is buying.
 */
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">` +
      `<rect width="400" height="400" fill="#0d1321"/>` +
      `<text x="200" y="205" text-anchor="middle" fill="#3c4a45"` +
      ` font-family="Montserrat,sans-serif" font-size="16">Image coming soon</text>` +
      `</svg>`,
  );

const CATEGORIES = [
  "All",
  "Dried BSF Larvae",
  "Slow Sinking Pellets",
  "Floating Pellets",
  "Bottom Dwellers",
  "Hatchery Feeds",
  "1kg Packs",
];

function ProductCard({ p }) {
  const gallery = p.gallery || [p.image];
  const [imgIdx, setImgIdx] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const autoTimerRef = useRef(null);
  const videoTimerRef = useRef(null);
  const videoRef = useRef(null);

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
     * VIDEO IS THE SECOND THING SEEN, matching the PDP gallery order
     * (photo, video, photo…). It used to cycle images every second and only cut
     * to video after 3s, so the film was the fourth slide — by which point the
     * cursor has usually moved on.
     *
     * With a video: hold the hero for 1.2s, play the video, and do not cycle
     * stills underneath it. Without one: fall back to cycling images.
     */
    if (p.video) {
      videoTimerRef.current = setTimeout(() => {
        setShowVideo(true);
        if (videoRef.current) videoRef.current.play().catch(() => {});
      }, 1200);
      return;
    }
    startImageCycle();
  }, [startImageCycle, p.video]);

  const handleMouseLeave = useCallback(() => {
    stopAuto();
    clearTimeout(videoTimerRef.current);
    setShowVideo(false);
    setImgIdx(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [stopAuto]);

  const goTo = useCallback((dir, e) => {
    e.preventDefault();
    e.stopPropagation();
    stopAuto();
    /*
     * Stepping the gallery cancels the video. The arrows are now available while
     * it plays, and without this the still underneath would change invisibly
     * behind the video — the click would appear to do nothing.
     */
    clearTimeout(videoTimerRef.current);
    setShowVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setImgIdx((prev) => (prev + dir + gallery.length) % gallery.length);
  }, [gallery.length, stopAuto]);

  useEffect(() => () => {
    clearInterval(autoTimerRef.current);
    clearTimeout(videoTimerRef.current);
  }, []);

  return (
    <a
      href={p.slug ? `/products/${p.slug}` : undefined}
      className={`group relative flex flex-col rounded-2xl transition-all duration-300 hover:-translate-y-0.5 ${p.slug ? "cursor-pointer" : "cursor-default pointer-events-none"}`}
      style={{ background: "linear-gradient(160deg, #0d1726 0%, #0a1219 100%)", overflow: "hidden" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${p.accentColor || "rgba(68,229,194,0.12)"}, transparent)` }} />

      {/* Image / Video zone */}
      <div className="relative flex items-center justify-center pt-8 pb-4 px-6" style={{ minHeight: "220px" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 60%, ${p.accentColor || "rgba(68,229,194,0.10)"}, transparent 65%)` }} />

        {/* Gallery images — crossfade */}
        {gallery.map((src, gi) => (
          <Image
            key={src}
            src={src}
            alt={`${p.name} ${gi + 1}`}
            width={220}
            height={220}
            className="absolute object-contain max-h-[200px] w-auto pointer-events-none"
            style={{
              filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.5))",
              opacity: !showVideo && gi === imgIdx ? 1 : 0,
              transform: !showVideo && gi === imgIdx ? "scale(1.05) translateY(-4px)" : "scale(1) translateY(0)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              zIndex: gi === imgIdx ? 2 : 1,
            }}
          />
        ))}

        {/* Video — fades in after 3s hover */}
        {p.video && (
          <video
            ref={videoRef}
            src={p.video}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{
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
              className="absolute left-1 top-1/2 -translate-y-1/2 z-30 flex h-6 w-6 items-center justify-center rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-white/10"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.9))" }}>
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
              className="absolute right-1 top-1/2 -translate-y-1/2 z-30 flex h-6 w-6 items-center justify-center rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-white/10"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.9))" }}>
                <path d="M4.5 2L8.5 6L4.5 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {gallery.map((_, gi) => (
                <span key={gi} className="block rounded-full transition-all duration-300"
                  style={{ width: gi === imgIdx ? "16px" : "4px", height: "4px", background: gi === imgIdx ? "rgba(68,229,194,1)" : "rgba(255,255,255,0.25)" }} />
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
        <p className="text-[12px] text-white/35 font-[Montserrat] leading-relaxed line-clamp-2">{p.tagline}</p>
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

// ── Find My Feed quiz ─────────────────────────────────────────────────────────

const QUIZ = [
  {
    id: "size",
    q: "How big is your fish?",
    sub: "Determines pellet size and protein density needed.",
    options: [
      {
        label: "Small fish",
        sub: "Under 5 cm — bettas, guppies, tetras",
        value: "small",
        icon: (
          <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
            <ellipse cx="13" cy="16" rx="8" ry="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 16c-2-2-4-4-4-4s0 4 4 4z" fill="currentColor" opacity=".4"/>
            <circle cx="18" cy="14.5" r="1" fill="currentColor"/>
          </svg>
        ),
      },
      {
        label: "Large fish",
        sub: "Over 5 cm — cichlids, goldfish, plecos",
        value: "large",
        icon: (
          <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
            <ellipse cx="14" cy="16" rx="11" ry="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3 16c-2-3-2-6-2-6s2 4 2 6z" fill="currentColor" opacity=".4"/>
            <circle cx="21" cy="13.5" r="1.2" fill="currentColor"/>
          </svg>
        ),
      },
    ],
  },
  {
    id: "species",
    q: "Which species?",
    sub: "Each species has a distinct nutritional fingerprint.",
    options: [
      { label: "Betta", sub: "Surface feeder · carnivore", value: "betta", img: "/Bottles/Betta/Betta F3_Front.png", accent: "#44e5c2" },
      { label: "Cichlid", sub: "Aggressive · high-energy", value: "cichlid", img: "/Bottles/Cichild/Cichild C4_Front.png", accent: "#38bdf8" },
      { label: "Guppy / Livebearer", sub: "Omnivore · mid-water", value: "guppy", img: "/Bottles/Guppy/Guppy G2_Front.png", accent: "#44e5c2" },
      { label: "Hatchery / Fry", sub: "Rapid growth · micro nutrition", value: "hatchery", img: "/Bottles/DBSFL/DBSFL 25G.png", accent: "#a78bfa" },
    ],
  },
  {
    id: "stage",
    q: "What life stage?",
    sub: "Fry need dense micro-protein; adults need sustained energy.",
    options: [
      {
        label: "Fry / Juvenile",
        sub: "0–6 months · rapid development phase",
        value: "fry",
        icon: (
          <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
            <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M16 10v2M16 20v2M10 16h2M20 16h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Adult",
        sub: "6 months+ · maintenance & colour",
        value: "adult",
        icon: (
          <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
            <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ),
      },
    ],
  },
  {
    id: "goal",
    q: "Primary feeding goal?",
    sub: "Helps us choose between performance and balanced formulas.",
    options: [
      {
        label: "Max nutrition",
        sub: "Competition prep · breeding stock",
        value: "max",
        icon: (
          <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
            <path d="M16 4v8M16 4l-3 4M16 4l3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 14h16l-2 10H10L8 14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: "Daily maintenance",
        sub: "Healthy colour · steady growth",
        value: "balanced",
        icon: (
          <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
            <path d="M6 24l5-6 5 3 5-8 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="26" cy="17" r="2" fill="currentColor" opacity=".4"/>
          </svg>
        ),
      },
    ],
  },
];

/**
 * Pick a recommendation from the LIVE catalogue.
 *
 * The four results here used to be hardcoded, naming products like
 * "Betta Bites F3" whose slugs 404 — so the quiz confidently recommended
 * things nobody could buy. Matching against real products means the quiz can
 * only ever suggest something that exists and is in stock.
 *
 * Matching is deliberately loose (species keyword against name, category and
 * tags): the catalogue is small, and a near-miss recommendation is far better
 * than a dead link. Falls back to the first product, and returns null when the
 * catalogue is empty so the caller can hide the quiz entirely.
 */
function getResult(answers, products) {
  if (!products || products.length === 0) return null;

  const { species, stage } = answers;
  const hay = (p) =>
    `${p.name} ${p.category ?? ""} ${(p.tags ?? []).join(" ")}`.toLowerCase();

  // Fry and hatchery need the densest feed, whatever it is called.
  const wants =
    species === "hatchery" || stage === "fry"
      ? ["larva", "bsf", "hatch", "fry", "starter"]
      : [species];

  const match =
    products.find((p) => wants.some((w) => w && hay(p).includes(w))) ?? products[0];

  return {
    name: match.name,
    badge: match === products[0] ? "GREAT MATCH" : "PERFECT MATCH",
    accent: "#44e5c2",
    tagline: match.tagline ?? "",
    why: match.tagline ?? "",
    image: match.image,
    href: match.slug ? `/products/${match.slug}` : "/products",
    stats: [
      match.protein ? { val: match.protein, label: "Protein" } : null,
      { val: "0%", label: "Soy" },
    ].filter(Boolean),
  };
}

function FindMyFeedQuiz({ onClose, products }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [dir, setDir] = useState(1); // 1 = forward, -1 = back
  const [animating, setAnimating] = useState(false);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const transition = (fn) => {
    setAnimating(true);
    setTimeout(() => { fn(); setAnimating(false); }, 240);
  };

  const choose = (value) => {
    const next = { ...answers, [QUIZ[step].id]: value };
    setAnswers(next);
    setDir(1);
    if (step < QUIZ.length - 1) {
      transition(() => setStep(step + 1));
    } else {
      transition(() => setResult(getResult(next, products)));
    }
  };

  const back = () => {
    setDir(-1);
    transition(() => setStep(step - 1));
  };

  const restart = () => {
    setDir(-1);
    transition(() => { setStep(0); setAnswers({}); setResult(null); });
  };

  const current = QUIZ[step];
  const progress = result ? 100 : ((step) / QUIZ.length) * 100;
  const isSpeciesStep = current?.options?.[0]?.img;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ background: "rgba(3,5,10,0.92)", backdropFilter: "blur(20px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div
        className="relative w-full flex flex-col overflow-hidden"
        style={{
          maxWidth: "560px",
          maxHeight: "92vh",
          margin: "0 16px",
          borderRadius: "28px",
          background: "linear-gradient(150deg, #0a1828 0%, #071512 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 48px 120px rgba(0,0,0,0.85), 0 0 0 1px rgba(68,229,194,0.04)",
        }}
      >
        {/* Gradient top edge */}
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: "linear-gradient(to right, transparent 5%, rgba(68,229,194,0.6) 40%, rgba(56,189,248,0.6) 60%, transparent 95%)" }} />

        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(68,229,194,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />

        {/* ── Header bar ── */}
        <div className="relative flex items-center justify-between px-8 pt-7 pb-0 shrink-0">
          <div className="flex items-center gap-3">
            {/* Zewa wordmark style label */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(68,229,194,0.08)", border: "1px solid rgba(68,229,194,0.18)" }}>
              <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-primary">
                <path d="M7 1C4 1 2 3.5 2 6c0 1.8 1 3.3 2.5 4L4 13h6l-.5-3C11 9.3 12 7.8 12 6c0-2.5-2-5-5-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-[Montserrat] text-primary">Find My Feed</span>
            </div>
          </div>

          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
            <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-white/40">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Progress ── */}
        <div className="px-8 mt-5 shrink-0">
          {/* Step dots */}
          <div className="flex items-center gap-1.5 mb-3">
            {QUIZ.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-500"
                style={{
                  height: "3px",
                  flex: 1,
                  background: i < step || result ? "rgba(68,229,194,0.9)" : i === step && !result ? "rgba(68,229,194,0.4)" : "rgba(255,255,255,0.08)",
                }} />
            ))}
          </div>
          {!result && (
            <p className="text-[10px] font-[Montserrat] text-white/20 tracking-widest">
              {step + 1} <span className="text-white/10">/ {QUIZ.length}</span>
            </p>
          )}
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? `translateY(${dir > 0 ? "12px" : "-12px"})` : "translateY(0)",
            transition: "opacity 0.24s ease, transform 0.24s ease",
          }}>

          {!result ? (
            <>
              <h2 className="font-[Playfair_Display] text-[28px] sm:text-[32px] text-white leading-[1.1] mb-2">
                {current.q}
              </h2>
              <p className="text-[12px] text-white/30 font-[Montserrat] leading-relaxed mb-8">{current.sub}</p>

              {/* Options */}
              <div className={`grid gap-3 ${isSpeciesStep ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
                {current.options.map((opt) => (
                  <button key={opt.value} onClick={() => choose(opt.value)}
                    className="group relative flex flex-col text-left rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", minHeight: isSpeciesStep ? "auto" : "88px" }}
                    onMouseEnter={(e) => {
                      const accent = opt.accent || "#44e5c2";
                      e.currentTarget.style.background = `${accent}0d`;
                      e.currentTarget.style.borderColor = `${accent}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    }}>

                    {isSpeciesStep ? (
                      /* Species card — image top, text below */
                      <>
                        <div className="relative flex items-center justify-center py-5"
                          style={{ background: `radial-gradient(ellipse at 50% 70%, ${opt.accent}18, transparent 70%)` }}>
                          <Image src={opt.img} alt={opt.label} width={80} height={80}
                            className="object-contain max-h-[76px] w-auto transition-transform duration-400 group-hover:scale-105"
                            style={{ filter: `drop-shadow(0 8px 20px ${opt.accent}44)` }} />
                        </div>
                        <div className="px-4 pb-4 pt-1 border-t border-white/5">
                          <p className="text-[13px] font-semibold font-[Montserrat] text-white group-hover:text-primary transition-colors duration-150 leading-none mb-0.5"
                            style={{ "--hover": opt.accent }}>{opt.label}</p>
                          <p className="text-[10px] text-white/30 font-[Montserrat]">{opt.sub}</p>
                        </div>
                      </>
                    ) : (
                      /* Regular card — icon left, text right */
                      <div className="flex items-center gap-4 px-5 py-4">
                        <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                          style={{ background: "rgba(68,229,194,0.08)", border: "1px solid rgba(68,229,194,0.12)", color: "rgba(68,229,194,0.7)" }}>
                          {opt.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold font-[Montserrat] text-white group-hover:text-primary transition-colors duration-150 leading-none mb-1">{opt.label}</p>
                          <p className="text-[11px] text-white/30 font-[Montserrat] leading-snug">{opt.sub}</p>
                        </div>
                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-white/15 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150 shrink-0">
                          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Back */}
              {step > 0 && (
                <button onClick={back}
                  className="mt-6 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase font-[Montserrat] text-white/20 hover:text-white/50 transition-colors duration-150">
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Previous
                </button>
              )}
            </>
          ) : (
            /* ── Result ── */
            <>
              {/* Product showcase */}
              <div className="relative rounded-2xl overflow-hidden mb-6"
                style={{ background: `linear-gradient(135deg, #0d1f2e 0%, #091914 100%)`, border: `1px solid ${result.accent}20` }}>

                {/* Glow bg */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 70% 80% at 50% 50%, ${result.accent}12, transparent 70%)` }} />

                <div className="relative flex items-center gap-6 p-6">
                  {/* Image */}
                  <div className="shrink-0 relative w-[100px] h-[100px] flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full"
                      style={{ background: `radial-gradient(circle, ${result.accent}22, transparent 70%)` }} />
                    <Image src={result.image} alt={result.name} width={90} height={90}
                      className="relative z-10 object-contain max-h-[90px] w-auto"
                      style={{ filter: `drop-shadow(0 10px 28px ${result.accent}55)` }} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[8px] font-bold px-2.5 py-1 rounded-full tracking-[0.22em] uppercase font-[Montserrat] mb-2"
                      style={{ background: `${result.accent}18`, border: `1px solid ${result.accent}35`, color: result.accent }}>
                      {result.badge}
                    </span>
                    <h3 className="font-[Playfair_Display] text-[22px] text-white leading-none mb-1">{result.name}</h3>
                    <p className="text-[10px] font-[Montserrat] leading-relaxed" style={{ color: `${result.accent}99` }}>{result.tagline}</p>
                  </div>
                </div>

                {/* Stat strip */}
                <div className="grid grid-cols-3 border-t" style={{ borderColor: `${result.accent}15` }}>
                  {result.stats.map((s, i) => (
                    <div key={s.label} className={`flex flex-col items-center py-3 ${i < 2 ? "border-r" : ""}`}
                      style={{ borderColor: `${result.accent}15` }}>
                      <span className="font-[Playfair_Display] text-[20px] leading-none" style={{ color: result.accent }}>{s.val}</span>
                      <span className="text-[9px] font-[Montserrat] mt-0.5 tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why block */}
              <div className="rounded-xl px-5 py-4 mb-6"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase font-[Montserrat] mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>Why this formula</p>
                <p className="text-[13px] text-white/50 font-[Montserrat] leading-relaxed">{result.why}</p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2.5">
                <a href={result.href}
                  className="w-full py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase font-[Montserrat] text-center transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{ background: `linear-gradient(135deg, ${result.accent} 0%, ${result.accent}cc 100%)`, color: "#003d2e" }}>
                  Shop {result.name}
                </a>
                <button onClick={restart}
                  className="w-full py-3.5 rounded-2xl text-[10px] font-bold tracking-[0.2em] uppercase font-[Montserrat] transition-all duration-150"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}>
                  Retake Quiz
                </button>
              </div>
            </>
          )}
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
function adaptProduct(api) {
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
  const packSizes = (api.packs ?? []).map((v) => v.pack.replace(/\s+/g, ""));

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
function adaptSpotlight(api) {
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

export default function ProductsPage() {
  const [active, setActive] = useState("All");
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);

  /**
   * Live catalogue — the API is the only source of products.
   *
   * There is deliberately NO bundled fallback catalogue. One used to exist, and
   * whenever the API was unreachable it rendered six invented products with
   * prices and slugs that no longer matched anything real: customers saw items
   * that could not be bought, linking to pages that 404. Showing the catalogue
   * is unavailable is honest; showing a fictional one is not.
   */
  const [apiProducts, setApiProducts] = useState(null);
  const [apiSpotlights, setApiSpotlights] = useState(null);
  /** "loading" | "ready" | "failed" — drives the skeleton and the error panel. */
  const [loadState, setLoadState] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    Promise.all([catalog.products(), catalog.spotlights()])
      .then(([products, spotlights]) => {
        if (cancelled) return;
        setApiProducts(products.map(adaptProduct));
        if (spotlights.length > 0) setApiSpotlights(spotlights.map(adaptSpotlight));
        setLoadState("ready");
      })
      .catch(() => {
        if (!cancelled) setLoadState("failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loading = loadState === "loading";
  const failed = loadState === "failed";
  // Real products or none. Never invented ones.
  const PRODUCTS = apiProducts ?? [];
  /*
   * NO FALLBACK FOR THE SPOTLIGHT.
   *
   * The bundled array advertises products by slugs that no longer exist
   * ("betta-bites-f3"), so it rendered a banner linking to a 404 — and because
   * the API legitimately returns zero spotlights when none are configured, it
   * showed PERMANENTLY, not just during load. An absent banner is correct here;
   * a wrong one is not.
   */
  const SPOTLIGHT = apiSpotlights ?? [];
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

  const filtered =
    active === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.tags.includes(active));

  return (
    <>
      <Header />
      <main className="bg-[#06080f] text-[#dde2f6] min-h-screen">

        {/* ── Hero banner ─────────────────────────────────────────────── */}
        {/*
          `pt-20` clears the fixed header for the TEXT slide. The banner slide
          escapes it with -mt-20 and sits UNDER the header instead, which is
          what makes it read as full-bleed rather than a framed picture.
        */}
        <section className="relative overflow-hidden pt-20">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(68,229,194,0.07) 0%, transparent 70%), linear-gradient(180deg, #06080f 0%, #0b1220 100%)" }} />

          {/*
            Two slides in one fixed-height box.

            Both are absolutely positioned and cross-faded, so the section never
            changes height — swapping between a 2:1 image and a text block by
            re-flowing would shove the whole product grid up and down every few
            seconds.

            The height is driven by the text slide, which is the taller of the
            two; the banner is object-cover inside it, so it fills without
            letterboxing at any viewport width.
          */}
          <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 pt-16 pb-14 sm:pb-20">
            {/*
              Both slides share this height, so the section never resizes.

              Back to roughly what the text needs. A 560px box let the 2:1
              banner show whole, but handed half the viewport to it — far too
              much for one decorative slide.
            */}
            <div className="relative flex min-h-[260px] items-center sm:min-h-[280px]">

              {/* Slide 0 — the range statement */}
              <div
                className={`transition-opacity duration-700 ${
                  heroSlide === 0
                    ? "relative w-full opacity-100"
                    : "pointer-events-none absolute inset-0 opacity-0"
                }`}
                aria-hidden={heroSlide !== 0}
              >
                <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
                  <div className="max-w-xl">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="h-px w-5 bg-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary font-[Montserrat]">Our Range</span>
                    </div>
                    <h1 className="mb-5 font-[Playfair_Display] text-[44px] leading-[1.0] text-white sm:text-[64px]">
                      Engineered<br />
                      <span className="italic text-primary">for the species.</span>
                    </h1>
                    <p className="mb-7 text-[15px] leading-relaxed text-white/45 font-[Montserrat]">
                      Every formula is NABL lab-tested, insect-protein based, and calibrated for a specific species and life stage.
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-10 lg:gap-14">
                    {[
                      { val: "46%", label: "Max Protein", sub: "in the range" },
                      { val: "88%", label: "Digestibility", sub: "lab verified" },
                      { val: "13+", label: "Formulas", sub: "species-specific" },
                    ].map((s) => (
                      <div key={s.label} className="flex flex-col gap-1">
                        <span className="font-[Playfair_Display] text-[38px] leading-none text-primary">{s.val}</span>
                        <span className="text-[12px] font-semibold text-white/70 font-[Montserrat]">{s.label}</span>
                        <span className="text-[10px] text-white/25 font-[Montserrat]">{s.sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slide 1 — the brand banner */}
              <div
                className={`transition-opacity duration-700 ${
                  heroSlide === 1
                    ? "relative w-full opacity-100"
                    : "pointer-events-none absolute inset-0 opacity-0"
                }`}
                aria-hidden={heroSlide !== 1}
              >
                {/*
                  object-cover with the focal point low.

                  The artwork is 2:1 in a ~3.6:1 box, so something has to give.
                  Stretching it (object-fill) would render everything 1.9x too
                  wide — round bottle caps become ovals, the logo warps — which
                  is not acceptable on brand artwork.

                  Focal point at 35%, not centre. Full-bleed at ~1920px wide,
                  the box shows only ~46% of the artwork height; centring that
                  slice lands on y=27-73% and crops the banner's own headline
                  (~15-25%) clean off. Biasing upward keeps the headline just
                  below the site header and still holds the product line-up.
                */}
                {/*
                  The banner fills the slot exactly — no gaps above or below.

                  Height is deliberately container + cancelled padding:
                  280 (container) + 80 (section pt-20) + 64 (wrapper pt-16)
                  + 80 (wrapper pb-20) = 504, with -mt-36 and -mb-20 cancelling
                  the paddings at both ends. Every one of those four values has
                  to be accounted for; missing any single one leaves a strip of
                  visible background.

                  The container is 280 rather than 360 because the text slide's
                  content only measures ~258px — the extra 80 was making the
                  banner taller than it needed to be.

                  w-screen with the centring transform escapes max-w-[1440px], so
                  it also spans the full viewport width.
                */}
                <div className="relative left-1/2 -mb-14 -mt-36 h-[460px] w-screen -translate-x-1/2 overflow-hidden sm:-mb-20 sm:h-[504px]">
                  <Image
                    src="/Banner 3.png"
                    alt="Zewa Feeds — to nourish every species of fish"
                    fill
                    className="object-cover object-[center_35%]"
                    sizes="(max-width: 1440px) 100vw, 1440px"
                    priority
                  />
                </div>
              </div>

              {/* Slide dots — bottom right, as requested */}
              <div className="absolute bottom-0 right-0 z-10 flex items-center gap-2">
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

          {/* Scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            style={{ animation: "scrollBounce 2s ease-in-out infinite" }}>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-white/30">
              <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-primary/35">
              <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.3) 50%, transparent)" }} />

          <style>{`
            @keyframes scrollBounce {
              0%, 100% { transform: translateY(0) translateX(-50%); opacity: 1; }
              50%       { transform: translateY(4px) translateX(-50%); opacity: 0.5; }
            }
          `}</style>
        </section>

        {/* ── Filter bar ──────────────────────────────────────────────── */}
        <div className="sticky top-20 z-30 bg-[#06080f]/96 backdrop-blur-md border-b border-white/5">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between gap-4 py-3">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.08em] uppercase font-[Montserrat] transition-all duration-200 ${
                    active === cat
                      ? "bg-primary text-[#00382d]"
                      : "text-white/35 hover:text-white/65 hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => setQuizOpen(true)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.08em] uppercase font-[Montserrat] transition-all duration-200 border border-primary/35 text-primary hover:bg-primary/10"
              >
                <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M5.5 5.5C5.5 4.67 6.172 4 7 4s1.5.67 1.5 1.5c0 .6-.36 1.1-.875 1.35L7 7.2V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <circle cx="7" cy="10" r=".5" fill="currentColor"/>
                </svg>
                Find My Feed
              </button>
            </div>
            <span className="shrink-0 text-[11px] text-white/20 font-[Montserrat]">{filtered.length} products</span>
          </div>
        </div>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">

          {/* ── Spotlight rotator ── */}
          {/* `sp` is null until the catalogue loads, so gate the whole banner. */}
          {sp && (
          <a
            href={`/products/${sp.slug}`}
            className="block relative overflow-hidden rounded-3xl mb-8 cursor-pointer group"
            style={{ background: "linear-gradient(135deg, #0d1a2e 0%, #091a18 100%)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-700"
              style={{ background: `radial-gradient(ellipse 55% 90% at 28% 50%, ${sp.accent}, transparent 70%)` }}
            />

            <div
              className="relative flex flex-col sm:flex-row items-center gap-8 sm:gap-0"
              style={{ opacity: fading ? 0 : 1, transform: fading ? "translateY(8px)" : "translateY(0)", transition: "opacity 0.35s ease, transform 0.35s ease" }}
            >
              <div className="relative w-full sm:w-[38%] flex items-center justify-center py-10 px-8 shrink-0">
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 55%, ${sp.accent}, transparent 65%)` }} />
                <Image
                  src={sp.image}
                  alt={sp.name}
                  width={320}
                  height={320}
                  className="relative z-10 object-contain max-h-[280px] w-auto"
                  style={{ filter: "drop-shadow(0 20px 48px rgba(0,0,0,0.65))" }}
                />
              </div>

              <div className="flex flex-col justify-center gap-4 flex-1 px-8 sm:px-12 pb-10 sm:py-12 text-center sm:text-left">
                <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                  <span className="text-[9px] font-bold px-2.5 py-1 rounded-full tracking-widest font-[Montserrat] bg-primary/15 text-primary border border-primary/30">
                    {sp.badge}
                  </span>
                  <span className="text-[10px] text-white/30 font-[Montserrat] tracking-[0.15em] uppercase">{sp.category}</span>
                </div>

                <h2 className="font-[Playfair_Display] text-[30px] sm:text-[40px] text-white leading-tight">{sp.name}</h2>
                <p className="text-[13px] text-white/40 font-[Montserrat] leading-relaxed max-w-sm mx-auto sm:mx-0">{sp.tagline}</p>

                <div className="flex items-center gap-5 justify-center sm:justify-start">
                  <div>
                    {/* String(...) guards against a number slipping through —
                        a price mismatch should not white-screen the page. */}
                    <span className="font-[Playfair_Display] text-[30px] text-primary leading-none">₹{String(sp.price ?? "").replace("₹", "")}</span>
                    <span className="text-[11px] text-white/20 line-through font-[Montserrat] ml-2">{sp.mrp}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <span className="text-[20px] font-bold text-primary font-[Montserrat] leading-none">{sp.protein}</span>
                    <span className="text-[10px] text-white/30 font-[Montserrat] ml-1.5">protein</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-center sm:justify-start">
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

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 flex sm:flex-col items-center gap-2.5 sm:pr-10">
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

          {/*
            Product grid.

            Skeletons while loading, so a hard refresh shows placeholders in the
            right shape instead of flashing the bundled fallback catalogue and
            then swapping it out.
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

          <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-28 sm:py-36">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

              {/* Left — copy */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-5 h-px bg-primary" />
                  <span className="text-[10px] font-bold text-primary tracking-[0.28em] font-[Montserrat] uppercase">Feed Finder</span>
                </div>

                <h2 className="font-[Playfair_Display] text-[36px] sm:text-[52px] text-white leading-[1.08] mb-6">
                  Not sure which<br />
                  <span className="text-primary italic">formula is right?</span>
                </h2>

                <p className="text-[15px] text-white/40 font-[Montserrat] leading-relaxed mb-10 max-w-[440px]">
                  Answer four questions about your fish — species, size, life stage, and feeding goal — and we'll match you to the exact formula built for them.
                </p>

                <button
                  onClick={() => setQuizOpen(true)}
                  className="group inline-flex items-center gap-4 px-7 py-4 rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                  style={{ background: "linear-gradient(135deg, #44e5c2 0%, #38d4b4 100%)", color: "#003d2e" }}
                >
                  <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0">
                    <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 7.5C7 6.67 7.895 6 9 6s2 .67 2 1.5c0 .664-.45 1.24-1.1 1.43L9 9.2V10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    <circle cx="9" cy="12.5" r=".7" fill="currentColor"/>
                  </svg>
                  <span className="text-[12px] font-bold tracking-[0.18em] uppercase font-[Montserrat]">Find My Feed</span>
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <p className="mt-5 text-[11px] text-white/20 font-[Montserrat]">Takes less than 60 seconds</p>
              </div>

              {/* Right — 4-step preview cards */}
              <div className="grid grid-cols-2 gap-3">
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
                    className="group flex flex-col gap-3 p-5 rounded-2xl text-left transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(68,229,194,0.06)"; e.currentTarget.style.borderColor = "rgba(68,229,194,0.25)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[9px] font-bold tracking-[0.25em] font-[Montserrat] text-white/15 uppercase">{step}</span>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
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
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-10">
          {/* Trust strip */}
          <div className="pt-0 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/18 font-[Montserrat] tracking-wide text-center sm:text-left">
              Manufactured at Zewa Ecosystems Pvt Ltd · Thrissur, Kerala · NABL Lab Certified
            </p>
            <div className="flex items-center gap-6">
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
