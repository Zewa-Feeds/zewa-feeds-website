"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";

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

const CATEGORIES = [
  "All",
  "Dried BSF Larvae",
  "Slow Sinking Pellets",
  "Floating Pellets",
  "Bottom Dwellers",
  "Hatchery Feeds",
  "1kg Packs",
];

const SPOTLIGHT = [
  {
    name: "Betta Bites F3",
    slug: "betta-bites-f3",
    category: "Betta",
    tagline: "100% natural insect-protein formula for vibrant, healthy bettas",
    price: "₹249",
    mrp: "₹310",
    packs: ["45g", "1kg"],
    badge: "BESTSELLER",
    protein: "46%",
    stat: "Highest protein in the range",
    image: "/Bottles/Betta/Betta F3_Front.png",
    accent: "rgba(68,229,194,0.22)",
    accentStrong: "rgba(68,229,194,0.45)",
  },
  {
    name: "Cichlid Bites C4",
    slug: "cichlid-bites-c4",
    category: "Cichlid",
    tagline: "High-energy insect protein for aggressive cichlid species",
    price: "₹279",
    mrp: "₹349",
    packs: ["100g", "1kg"],
    badge: "NEW",
    protein: "44%",
    stat: "Supports jaw muscle development",
    image: "/Bottles/Cichild/Cichild C4_Front.png",
    accent: "rgba(68,229,194,0.20)",
    accentStrong: "rgba(68,229,194,0.45)",
  },
  {
    name: "DBSFL 25g",
    slug: "dried-bsf-larvae-25g",
    category: "Hatchery",
    tagline: "Whole dried larvae — maximum insect nutrition per gram",
    price: "₹199",
    mrp: "₹249",
    packs: ["25g"],
    badge: "PRO",
    protein: "50%",
    stat: "Whole larvae — maximum nutrition",
    image: "/Bottles/DBSFL/DBSFL 25G.png",
    accent: "rgba(68,229,194,0.20)",
    accentStrong: "rgba(68,229,194,0.45)",
  },
];

const PRODUCTS = [
  {
    name: "Betta Bites F3",
    slug: "betta-bites-f3",
    tags: ["Slow Sinking Pellets", "1kg Packs"],
    tagline: "100% natural insect-protein formula for vibrant, healthy bettas",
    price: 249,
    mrp: "₹310",
    packs: ["45g", "1kg"],
    badge: "BESTSELLER",
    badgeColor: "bg-primary text-[#00382d]",
    protein: "46%",
    image: "/Bottles/Betta/Betta F3_Front.png",
    video: "/videos/brand_video.mp4",
    gallery: [
      "/Bottles/Betta/Betta F3_Front.png",
      "/Bottles/Betta/Betta F3_Back.png",
      "/Bottles/Betta/Betta 01.png",
      "/Bottles/Betta/Betta 02.png",
      "/Bottles/Betta/Betta 03.png",
    ],
    accentColor: "rgba(68,229,194,0.18)",
  },
  {
    name: "Cichlid Bites C4",
    slug: "cichlid-bites-c4",
    tags: ["Floating Pellets", "Bottom Dwellers", "1kg Packs"],
    tagline: "High-energy insect protein for aggressive cichlid species",
    price: 279,
    mrp: "₹349",
    packs: ["100g", "1kg"],
    badge: "NEW",
    badgeColor: "bg-primary text-[#00382d]",
    protein: "44%",
    image: "/Bottles/Cichild/Cichild C4_Front.png",
    video: "/videos/brand_video.mp4",
    gallery: [
      "/Bottles/Cichild/Cichild C4_Front.png",
      "/Bottles/Cichild/Cichild C4_back.png",
      "/Bottles/Cichild/Cichild 01.png",
      "/Bottles/Cichild/Cichild 02.png",
      "/Bottles/Cichild/Cichild 03.png",
    ],
    accentColor: "rgba(68,229,194,0.15)",
  },
  {
    name: "Dried BSF Larvae 25g",
    slug: "dried-bsf-larvae-25g",
    tags: ["Dried BSF Larvae", "Hatchery Feeds"],
    tagline: "Whole dried larvae — maximum insect nutrition per gram",
    price: 199,
    mrp: "₹249",
    packs: ["25g"],
    badge: "PRO",
    badgeColor: "bg-primary text-[#00382d]",
    protein: "50%",
    image: "/Bottles/DBSFL/DBSFL 25G.png",
    video: "/videos/brand_video.mp4",
    gallery: [
      "/Bottles/DBSFL/DBSFL 25G.png",
      "/Bottles/DBSFL/DBSFL25_02.png",
      "/Bottles/DBSFL/India/25/Artboard 1.png",
      "/Bottles/DBSFL/India/25/Artboard 1 copy.png",
    ],
    accentColor: "rgba(68,229,194,0.15)",
  },
  {
    name: "Dried BSF Larvae 75g",
    slug: "dried-bsf-larvae-75g",
    tags: ["Dried BSF Larvae", "Hatchery Feeds", "1kg Packs"],
    tagline: "Large pack for hatchery operators & serious breeders",
    price: 449,
    mrp: "₹560",
    packs: ["75g"],
    badge: null,
    protein: "50%",
    image: "/Bottles/DBSFL/DBSFL 75G.png",
    video: "/videos/brand_video.mp4",
    gallery: [
      "/Bottles/DBSFL/DBSFL 75G.png",
      "/Bottles/DBSFL/DBSFL 75G_Front.png",
      "/Bottles/DBSFL/DBSFL 75G_back.png",
      "/Bottles/DBSFL/India/75/Artboard 1.png",
    ],
    accentColor: "rgba(68,229,194,0.12)",
  },
  {
    name: "Guppy Bites G2",
    slug: "guppy-bites-g2",
    tags: ["Slow Sinking Pellets", "Bottom Dwellers"],
    tagline: "Precision micro-nutrition for guppies & livebearers",
    price: 199,
    mrp: "₹249",
    packs: ["45g", "500g"],
    badge: null,
    protein: "40%",
    image: "/Bottles/Guppy/Guppy G2_Front.png",
    video: "/videos/brand_video.mp4",
    gallery: [
      "/Bottles/Guppy/Guppy G2_Front.png",
      "/Bottles/Guppy/Guppy G2_Back.png",
      "/Bottles/Guppy/Guppy 01.png",
      "/Bottles/Guppy/Guppy 02.png",
      "/Bottles/Guppy/Guppy 03.png",
    ],
    accentColor: "rgba(68,229,194,0.10)",
  },
  {
    name: "Full Range",
    slug: null,
    tags: [],
    tagline: "The complete Zewa insect-protein lineup",
    price: null,
    mrp: null,
    packs: [],
    badge: null,
    protein: null,
    image: "/Bottles/All products.jpg",
    gallery: ["/Bottles/All products.jpg"],
    accentColor: "rgba(68,229,194,0.08)",
  },
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
    // Immediately start cycling images on hover
    startImageCycle();
    // After 3s switch to video if available
    if (p.video) {
      videoTimerRef.current = setTimeout(() => {
        setShowVideo(true);
        if (videoRef.current) videoRef.current.play().catch(() => {});
      }, 3000);
    }
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

        {/* Video playing badge */}
        {showVideo && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[9px] font-bold tracking-widest font-[Montserrat] text-white/60">VIDEO</span>
          </div>
        )}

        {/* Badge */}
        {p.badge && (
          <span className={`absolute top-4 left-4 text-[9px] font-bold px-2.5 py-1 rounded-full tracking-widest font-[Montserrat] z-10 ${p.badgeColor || "bg-primary text-[#00382d]"}`}>
            {p.badge}
          </span>
        )}

        {/* Prev / Next arrows — shown while hovering (images only) */}
        {gallery.length > 1 && !showVideo && (
          <>
            <button
              onMouseDown={(e) => goTo(-1, e)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 2L3.5 6L7.5 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onMouseDown={(e) => goTo(1, e)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 2L8.5 6L4.5 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

function getResult(answers) {
  const { species, stage } = answers;
  if (species === "betta") return {
    name: "Betta Bites F3", badge: "PERFECT MATCH", accent: "#44e5c2",
    tagline: "46% insect protein · slow-sinking · zero soy fillers",
    why: "Betta Bites F3 matches the betta's ancestral diet — high insect protein, slow-sinking so they feed at their natural depth, with natural carotenoids for vivid colour.",
    image: "/Bottles/Betta/Betta F3_Front.png", href: "/products/betta-bites-f3",
    stats: [{ val: "46%", label: "Protein" }, { val: "88%", label: "Digestibility" }, { val: "0%", label: "Soy" }],
  };
  if (species === "cichlid") return {
    name: "Cichlid Bites C4", badge: "BEST FIT", accent: "#38bdf8",
    tagline: "44% insect protein · floating pellets · high-energy formula",
    why: "C4's floating pellets trigger the cichlid's natural surface-strike feeding instinct. Dense amino acids support jaw muscle growth and aggressive body mass.",
    image: "/Bottles/Cichild/Cichild C4_Front.png", href: "/products",
    stats: [{ val: "44%", label: "Protein" }, { val: "85%", label: "Digestibility" }, { val: "0%", label: "Soy" }],
  };
  if (species === "hatchery" || stage === "fry") return {
    name: "Dried BSF Larvae 25g", badge: "RECOMMENDED", accent: "#a78bfa",
    tagline: "50% insect protein · whole larvae · hatchery grade",
    why: "Whole Black Soldier Fly Larvae are the densest natural protein source available — critical in the fry phase where every gram drives cellular development.",
    image: "/Bottles/DBSFL/DBSFL 25G.png", href: "/products",
    stats: [{ val: "50%", label: "Protein" }, { val: "92%", label: "Digestibility" }, { val: "0%", label: "Fillers" }],
  };
  return {
    name: "Guppy Bites G2", badge: "GREAT MATCH", accent: "#44e5c2",
    tagline: "40% insect protein · micro pellets · balanced omnivore formula",
    why: "G2's micro-pellet format and balanced omega profile make it ideal for livebearers and small ornamentals that need daily colour and sustained vitality.",
    image: "/Bottles/Guppy/Guppy G2_Front.png", href: "/products",
    stats: [{ val: "40%", label: "Protein" }, { val: "86%", label: "Digestibility" }, { val: "0%", label: "Soy" }],
  };
}

function FindMyFeedQuiz({ onClose }) {
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
      transition(() => setResult(getResult(next)));
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
  const { price, name, slug, image, accentColor } = product;
  const [flash, setFlash] = useState(null);
  const { items, addToCart, setQty, removeFromCart } = useCart();

  if (!price) return null;

  const sku = slug || name.toLowerCase().replace(/\s+/g, "-");
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
    addToCart({ sku, name, pack: "45g", price, image, accentBg: "#1a2235" });
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
          className="w-full h-9 rounded-lg bg-primary text-[#00382d] text-[11px] font-bold tracking-[0.12em] uppercase font-[Montserrat] hover:bg-primary/85 active:scale-[0.97] transition-all duration-150 shadow-[0_0_16px_rgba(68,229,194,0.25)]"
        >
          + Add
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
            ₹{(price * qty).toLocaleString("en-IN")}
          </span>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const [active, setActive] = useState("All");
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setSlide((s) => (s + 1) % SPOTLIGHT.length);
        setFading(false);
      }, 350);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i) => {
    if (i === slide) return;
    setFading(true);
    setTimeout(() => { setSlide(i); setFading(false); }, 350);
  };

  const sp = SPOTLIGHT[slide];

  const filtered =
    active === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.tags.includes(active));

  return (
    <>
      <Header />
      <main className="bg-[#06080f] text-[#dde2f6] min-h-screen">

        {/* ── Hero banner ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(68,229,194,0.07) 0%, transparent 70%), linear-gradient(180deg, #06080f 0%, #0b1220 100%)" }} />

          <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-14 sm:pb-20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-5 h-px bg-primary" />
                  <span className="text-[10px] font-bold text-primary tracking-[0.25em] font-[Montserrat] uppercase">Our Range</span>
                </div>
                <h1 className="font-[Playfair_Display] text-[44px] sm:text-[64px] text-white leading-[1.0] mb-5">
                  Engineered<br />
                  <span className="text-primary italic">for the species.</span>
                </h1>
                <p className="text-[15px] text-white/45 font-[Montserrat] leading-relaxed mb-7">
                  Every formula is NABL lab-tested, insect-protein based, and calibrated for a specific species and life stage.
                </p>

              </div>

              <div className="flex gap-10 lg:gap-14 shrink-0">
                {[
                  { val: "46%", label: "Max Protein", sub: "in the range" },
                  { val: "88%", label: "Digestibility", sub: "lab verified" },
                  { val: "10+", label: "Formulas", sub: "species-specific" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <span className="font-[Playfair_Display] text-[38px] text-primary leading-none">{s.val}</span>
                    <span className="text-[12px] font-semibold text-white/70 font-[Montserrat]">{s.label}</span>
                    <span className="text-[10px] text-white/25 font-[Montserrat]">{s.sub}</span>
                  </div>
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
                    <span className="font-[Playfair_Display] text-[30px] text-primary leading-none">₹{sp.price.replace("₹", "")}</span>
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

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, i) => (
              <ProductCard key={`${p.name}-${i}`} p={p} />
            ))}
          </div>

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
      {quizOpen && <FindMyFeedQuiz onClose={() => setQuizOpen(false)} />}
    </>
  );
}
