"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CATEGORIES = ["All", "Betta", "Cichlid", "Hatchery", "Others"];

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

  const filtered = active === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);
  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

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

          {/* Featured card — full-width horizontal */}
          {featured && (
            <a
              href={`/products/${featured.slug}`}
              className="group relative flex flex-col sm:flex-row overflow-hidden rounded-3xl mb-8 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #0d1a2e 0%, #091a18 100%)" }}
            >
              {/* Glow blob */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 80% at 30% 50%, ${featured.accentColor}, transparent)` }} />

              {/* Image side */}
              <div className="relative w-full sm:w-[42%] aspect-square sm:aspect-auto shrink-0 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 60%, ${featured.accentColor}, transparent 70%)` }} />
                <Image
                  src={featured.image}
                  alt={featured.name}
                  width={420}
                  height={420}
                  className="relative z-10 object-contain w-[75%] sm:w-[80%] max-h-[360px] transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content side */}
              <div className="relative flex flex-col justify-center p-8 sm:p-12 gap-5 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold px-2.5 py-1 rounded-full tracking-widest font-[Montserrat] bg-primary text-[#00382d]">
                    BESTSELLER
                  </span>
                  <span className="text-[10px] text-primary/60 font-bold tracking-[0.18em] font-[Montserrat] uppercase">{featured.category}</span>
                </div>

                <div>
                  <h2 className="font-[Playfair_Display] text-[34px] sm:text-[42px] text-white leading-tight mb-2">{featured.name}</h2>
                  <p className="text-[14px] text-white/45 font-[Montserrat] leading-relaxed max-w-sm">{featured.tagline}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-[Playfair_Display] text-[32px] text-primary leading-none">{featured.price}</span>
                    <span className="text-[12px] text-white/25 line-through font-[Montserrat] mt-0.5">{featured.mrp}</span>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[22px] font-bold text-primary font-[Montserrat] leading-none">{featured.protein}</span>
                    <span className="text-[10px] text-white/30 font-[Montserrat] tracking-wide">insect protein</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {featured.packs.map((pack) => (
                    <span key={pack} className="text-[10px] px-3 py-1 rounded-full bg-white/6 text-white/50 font-[Montserrat] border border-white/8">{pack}</span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-2 text-primary font-[Montserrat] text-[12px] font-bold tracking-widest uppercase">
                  <span>Explore Product</span>
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </a>
          )}

          {/* Rest of products — 3 col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((p, i) => (
              <a
                key={`${p.name}-${i}`}
                href={p.slug ? `/products/${p.slug}` : undefined}
                className={`group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-400 ${p.slug ? "cursor-pointer" : "cursor-default"}`}
                style={{ background: "linear-gradient(160deg, #0d1726 0%, #0a1219 100%)" }}
              >
                {/* Per-card glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${p.accentColor || "rgba(68,229,194,0.12)"}, transparent)` }}
                />

                {/* Image zone */}
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
                    className="relative z-10 object-contain max-h-[200px] w-auto transition-transform duration-500 group-hover:scale-108 group-hover:-translate-y-1"
                    style={{ filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.5))" }}
                  />
                  {p.badge && (
                    <span className={`absolute top-4 left-4 text-[9px] font-bold px-2.5 py-1 rounded-full tracking-widest font-[Montserrat] ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* Info zone */}
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
                  <p className="text-[12px] text-white/35 font-[Montserrat] leading-relaxed line-clamp-2">
                    {p.tagline}
                  </p>

                  {/* Divider */}
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

                {/* Bottom teal line on hover */}
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
