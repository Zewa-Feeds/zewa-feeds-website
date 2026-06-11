"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CATEGORIES = ["All", "Betta", "Cichlid", "Hatchery"];

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
    slug: null,
    category: "Cichlid",
    tagline: "High-energy insect protein for aggressive cichlid species",
    price: "₹279",
    mrp: "₹349",
    packs: ["100g", "1kg"],
    badge: "NEW",
    protein: "44%",
    stat: "Supports jaw muscle development",
    image: "/Bottles/Cichild/Cichild C4_Front.png",
    accent: "rgba(56,189,248,0.20)",
    accentStrong: "rgba(56,189,248,0.45)",
  },
  {
    name: "DBSFL 25g",
    slug: null,
    category: "Hatchery",
    tagline: "Whole dried larvae — maximum insect nutrition per gram",
    price: "₹199",
    mrp: "₹249",
    packs: ["25g"],
    badge: "PRO",
    protein: "50%",
    stat: "Whole larvae — maximum nutrition",
    image: "/Bottles/DBSFL/DBSFL 25G.png",
    accent: "rgba(167,139,250,0.20)",
    accentStrong: "rgba(167,139,250,0.45)",
  },
];

const PRODUCTS = [
  {
    name: "Betta Bites F3",
    slug: "betta-bites-f3",
    category: "Betta",
    tagline: "100% natural insect-protein formula for vibrant, healthy bettas",
    price: "₹249",
    mrp: "₹310",
    packs: ["45g", "1kg"],
    badge: "BESTSELLER",
    badgeColor: "bg-primary text-[#00382d]",
    protein: "46%",
    image: "/Bottles/Betta/Betta F3_Front.png",
    accentColor: "rgba(68,229,194,0.18)",
    featured: true,
  },
  {
    name: "Cichlid Bites C4",
    slug: null,
    category: "Cichlid",
    tagline: "High-energy insect protein for aggressive cichlid species",
    price: "₹279",
    mrp: "₹349",
    packs: ["100g", "1kg"],
    badge: "NEW",
    badgeColor: "bg-sky-500 text-white",
    protein: "44%",
    image: "/Bottles/Cichild/Cichild C4_Front.png",
    accentColor: "rgba(56,189,248,0.15)",
    featured: false,
  },
  {
    name: "Cichlid Bites C4 — Back",
    slug: null,
    category: "Cichlid",
    tagline: "Full nutritional panel — zero synthetic additives",
    price: "₹279",
    mrp: "₹349",
    packs: ["100g", "1kg"],
    badge: null,
    protein: "44%",
    image: "/Bottles/Cichild/Cichild C4_back.png",
    accentColor: "rgba(56,189,248,0.12)",
    featured: false,
  },
  {
    name: "DBSFL 25g",
    slug: null,
    category: "Hatchery",
    tagline: "Whole dried larvae — maximum insect nutrition per gram",
    price: "₹199",
    mrp: "₹249",
    packs: ["25g"],
    badge: "PRO",
    badgeColor: "bg-violet-500 text-white",
    protein: "50%",
    image: "/Bottles/DBSFL/DBSFL 25G.png",
    accentColor: "rgba(139,92,246,0.15)",
    featured: false,
  },
  {
    name: "DBSFL 75g",
    slug: null,
    category: "Hatchery",
    tagline: "Large pack for hatchery operators & serious breeders",
    price: "₹449",
    mrp: "₹560",
    packs: ["75g"],
    badge: null,
    protein: "50%",
    image: "/Bottles/DBSFL/DBSFL 75G.png",
    accentColor: "rgba(139,92,246,0.12)",
    featured: false,
  },
  {
    name: "Guppy Bites G2",
    slug: null,
    category: "Others",
    tagline: "Precision micro-nutrition for guppies & livebearers",
    price: "₹199",
    mrp: "₹249",
    packs: ["45g", "500g"],
    badge: null,
    protein: "40%",
    image: "/Bottles/45G Bottles.jpg",
    accentColor: "rgba(68,229,194,0.10)",
    featured: false,
  },
  {
    name: "Full Range",
    slug: null,
    category: "Others",
    tagline: "The complete Zewa insect-protein lineup",
    price: null,
    mrp: null,
    packs: [],
    badge: null,
    protein: null,
    image: "/Bottles/All products.jpg",
    accentColor: "rgba(68,229,194,0.08)",
    featured: false,
  },
];

export default function ProductsPage() {
  const [active, setActive] = useState("All");
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);

  // Auto-rotate spotlight every 4s
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

  const filtered = active === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

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
                <p className="text-[15px] text-white/45 font-[Montserrat] leading-relaxed">
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

          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.3) 50%, transparent)" }} />
        </section>

        {/* ── Filter bar ──────────────────────────────────────────────── */}
        <div className="sticky top-20 z-30 bg-[#06080f]/96 backdrop-blur-md border-b border-white/5">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between gap-4 py-3">
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase font-[Montserrat] transition-all duration-200 ${
                    active === cat
                      ? "bg-primary text-[#00382d]"
                      : "text-white/35 hover:text-white/65 hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <span className="shrink-0 text-[11px] text-white/20 font-[Montserrat]">{filtered.length} products</span>
          </div>
        </div>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">

          {/* ── Spotlight rotator ── */}
          <div
            className="relative overflow-hidden rounded-3xl mb-8"
            style={{ background: "linear-gradient(135deg, #0d1a2e 0%, #091a18 100%)" }}
          >
            {/* Animated background glow */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-700"
              style={{ background: `radial-gradient(ellipse 55% 90% at 28% 50%, ${sp.accent}, transparent 70%)` }}
            />

            <div
              className="relative flex flex-col sm:flex-row items-center gap-8 sm:gap-0"
              style={{ opacity: fading ? 0 : 1, transform: fading ? "translateY(8px)" : "translateY(0)", transition: "opacity 0.35s ease, transform 0.35s ease" }}
            >
              {/* Bottle */}
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

              {/* Content */}
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
                    <span className="font-[Playfair_Display] text-[30px] text-primary leading-none">{sp.price}</span>
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

                {sp.slug && (
                  <a
                    href={`/products/${sp.slug}`}
                    className="self-center sm:self-start inline-flex items-center gap-2 text-[11px] font-bold text-primary tracking-widest uppercase font-[Montserrat] hover:gap-3 transition-all duration-200"
                  >
                    Explore Product
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Dot controls */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 flex sm:flex-col items-center gap-2.5 sm:pr-10">
                {SPOTLIGHT.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        i === slide
                          ? "w-5 h-1.5 sm:w-1.5 sm:h-5 bg-primary"
                          : "w-1.5 h-1.5 bg-white/20 hover:bg-white/45"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, i) => (
              <a
                key={`${p.name}-${i}`}
                href={p.slug ? `/products/${p.slug}` : undefined}
                className={`group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-400 ${p.slug ? "cursor-pointer" : "cursor-default"}`}
                style={{ background: "linear-gradient(160deg, #0d1726 0%, #0a1219 100%)" }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${p.accentColor || "rgba(68,229,194,0.12)"}, transparent)` }}
                />
                <div className="relative flex items-center justify-center pt-8 pb-4 px-6 overflow-hidden" style={{ minHeight: "220px" }}>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 60%, ${p.accentColor || "rgba(68,229,194,0.10)"}, transparent 65%)` }}
                  />
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={220}
                    height={220}
                    className="relative z-10 object-contain max-h-[200px] w-auto transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1"
                    style={{ filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.5))" }}
                  />
                  {p.badge && (
                    <span className={`absolute top-4 left-4 text-[9px] font-bold px-2.5 py-1 rounded-full tracking-widest font-[Montserrat] ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-col flex-1 px-5 pb-5 pt-1 gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-primary/50 tracking-[0.2em] font-[Montserrat] uppercase">{p.category}</span>
                    {p.protein && (
                      <span className="text-[11px] font-bold text-primary font-[Montserrat]">{p.protein} <span className="text-white/25 font-normal text-[10px]">protein</span></span>
                    )}
                  </div>
                  <h3 className="font-[Playfair_Display] text-[19px] text-white leading-snug group-hover:text-primary transition-colors duration-200">
                    {p.name}
                  </h3>
                  <p className="text-[12px] text-white/35 font-[Montserrat] leading-relaxed line-clamp-2">{p.tagline}</p>
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    {p.price ? (
                      <div className="flex items-baseline gap-2">
                        <span className="font-[Playfair_Display] text-[24px] text-white">{p.price}</span>
                        <span className="text-[11px] text-white/20 line-through font-[Montserrat]">{p.mrp}</span>
                      </div>
                    ) : (
                      <span className="text-[12px] text-white/25 font-[Montserrat] italic">Multiple packs</span>
                    )}
                    <div className="flex gap-1.5">
                      {p.packs.slice(0, 2).map((pack) => (
                        <span key={pack} className="text-[9px] px-2 py-1 rounded-full bg-white/5 text-white/30 font-[Montserrat]">{pack}</span>
                      ))}
                    </div>
                  </div>
                  {!p.slug && (
                    <div className="mt-1 text-[10px] text-white/20 font-[Montserrat] tracking-widest uppercase text-center py-1.5 rounded-lg bg-white/3">
                      Coming Soon
                    </div>
                  )}
                </div>
                {p.slug && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" style={{ background: "linear-gradient(to right, rgba(68,229,194,0.6), transparent)" }} />
                )}
              </a>
            ))}
          </div>

          {/* Trust strip */}
          <div className="mt-16 pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/18 font-[Montserrat] tracking-wide text-center sm:text-left">
              Manufactured at Zewa Ecosystems Pvt Ltd · Thrissur, Kerala · NABL Lab Certified
            </p>
            <div className="flex items-center gap-6">
              {["🔬 NABL Tested", "🌿 100% Natural", "🇮🇳 Made in India", "🪲 Insect Protein"].map((b) => (
                <span key={b} className="text-[10px] text-white/25 font-[Montserrat] whitespace-nowrap">{b}</span>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
