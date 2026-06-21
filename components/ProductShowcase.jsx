"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

const PRODUCTS = [
  {
    name: "Betta Bites F3",
    slug: "betta-bites-f3",
    blurb: "100% natural insect-protein formula for vibrant, healthy bettas.",
    price: "₹249",
    mrp: "₹310",
    badge: "BESTSELLER",
    protein: "46%",
    image: "/Bottles/Betta/Betta F3_Front.png",
    accentBg: "#d4f5ed",
    accentDot: "#00a882",
  },
  {
    name: "Cichlid Bites C4",
    slug: null,
    blurb: "High-energy insect protein for aggressive cichlid species.",
    price: "₹279",
    mrp: "₹349",
    badge: "NEW",
    protein: "44%",
    image: "/Bottles/Cichild/Cichild C4_Front.png",
    accentBg: "#d0eefb",
    accentDot: "#0284c7",
  },
  {
    name: "DBSFL 25g",
    slug: null,
    blurb: "Whole dried larvae — maximum insect nutrition per gram.",
    price: "₹199",
    mrp: "₹249",
    badge: "PRO",
    protein: "50%",
    image: "/Bottles/DBSFL/DBSFL 25G.png",
    accentBg: "#ede9fb",
    accentDot: "#7c3aed",
  },
  {
    name: "DBSFL 75g",
    slug: null,
    blurb: "Large pack for hatchery operators & serious breeders.",
    price: "₹449",
    mrp: "₹560",
    badge: null,
    protein: "50%",
    image: "/Bottles/DBSFL/DBSFL 75G.png",
    accentBg: "#ede9fb",
    accentDot: "#7c3aed",
  },
  {
    name: "Guppy Bites G2",
    slug: null,
    blurb: "Precision micro-nutrition for guppies & livebearers.",
    price: "₹199",
    mrp: "₹249",
    badge: null,
    protein: "40%",
    image: "/Bottles/45G Bottles.jpg",
    accentBg: "#d4f5ed",
    accentDot: "#00a882",
  },
];

export default function ProductShowcase() {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [maxIdx, setMaxIdx] = useState(PRODUCTS.length - 1);

  const checkScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);

    // compute how many snap positions actually exist
    const scrollMax = el.scrollWidth - el.clientWidth;
    let reachable = 0;
    cardRefs.current.forEach((card) => {
      if (card && card.offsetLeft <= scrollMax + 8) reachable++;
    });
    setMaxIdx(Math.max(0, reachable - 1));

    // find active card
    let closest = 0, minDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const dist = Math.abs(card.offsetLeft - el.scrollLeft);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIdx(Math.min(closest, reachable - 1));
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollToIdx = (i) => {
    const card = cardRefs.current[i];
    const el = trackRef.current;
    if (!card || !el) return;
    el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  const scroll = (dir) =>
    scrollToIdx(Math.max(0, Math.min(maxIdx, activeIdx + dir)));

  return (
    <Reveal id="products" className="relative bg-white overflow-hidden">

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-24 pb-16 sm:pb-24">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ background: "#44e5c2" }} />
              <span className="text-[10px] font-bold tracking-[0.28em] font-[Montserrat] uppercase" style={{ color: "#44e5c2" }}>
                Our Range
              </span>
            </div>
            <h2 className="font-[Playfair_Display] text-[32px] sm:text-[48px] text-[#0a1a14] leading-tight">
              Engineered{" "}
              <span className="italic" style={{ color: "#00a882" }}>for the species.</span>
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll(-1)}
              disabled={!canLeft}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200"
              style={{ borderColor: canLeft ? "#44e5c2" : "#e5e7eb", color: canLeft ? "#00a882" : "#d1d5db", cursor: canLeft ? "pointer" : "not-allowed" }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={!canRight}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200"
              style={{ borderColor: canRight ? "#44e5c2" : "#e5e7eb", color: canRight ? "#00a882" : "#d1d5db", cursor: canRight ? "pointer" : "not-allowed" }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Track */}
        <div className="relative">
          <div className={`absolute left-0 top-0 bottom-4 w-12 z-10 pointer-events-none transition-opacity duration-300 ${canLeft ? "opacity-100" : "opacity-0"}`}
            style={{ background: "linear-gradient(to right, white, transparent)" }} />
          <div className={`absolute right-0 top-0 bottom-4 w-16 z-10 pointer-events-none transition-opacity duration-300 ${canRight ? "opacity-100" : "opacity-0"}`}
            style={{ background: "linear-gradient(to left, white, transparent)" }} />

          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto pb-4 no-scrollbar"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          >
            {PRODUCTS.map((p, i) => (
              <a
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                href={p.slug ? `/products/${p.slug}` : "/products"}
                style={{ scrollSnapAlign: "start", minWidth: "300px", maxWidth: "300px" }}
                className="group shrink-0 flex flex-col rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 cursor-pointer bg-white"
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Image zone */}
                <div className="relative overflow-hidden" style={{ background: p.accentBg, aspectRatio: "4/3" }}>
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 70% 60% at 50% 80%, ${p.accentDot}28, transparent 70%)` }} />
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="300px"
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.13))" }}
                  />
                  {p.badge && (
                    <span className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest font-[Montserrat] text-white"
                      style={{ background: p.accentDot }}>
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-2 bg-white">
                  <h3 className="font-[Playfair_Display] text-[20px] text-[#0a1a14] leading-snug group-hover:text-[#00a882] transition-colors duration-200">
                    {p.name}
                  </h3>
                  <p className="text-[12px] text-gray-400 font-[Montserrat] leading-relaxed flex-1">{p.blurb}</p>

                  <div className="flex items-center justify-between mt-3 pt-4 border-t border-gray-100">
                    <div>
                      <span className="font-[Playfair_Display] text-[24px] leading-none" style={{ color: "#00a882" }}>{p.price}</span>
                      <span className="text-[11px] text-gray-300 line-through font-[Montserrat] ml-2">{p.mrp}</span>
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shrink-0"
                      style={{ background: "#44e5c2" }}>
                      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                        <path d="M8 3v10M3 8h10" stroke="#00382d" strokeWidth="2.2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            ))}

            {/* View all */}
            <a href="/products"
              style={{ scrollSnapAlign: "start", minWidth: "180px", maxWidth: "180px" }}
              className="shrink-0 flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#44e5c2] transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110" style={{ background: "#e8fdf8" }}>
                <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#00a882" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center px-4">
                <p className="text-[12px] font-bold tracking-[0.12em] uppercase font-[Montserrat]" style={{ color: "#00a882" }}>View All</p>
                <p className="text-[11px] text-gray-400 font-[Montserrat] mt-1">10+ formulas</p>
              </div>
            </a>
          </div>
        </div>

        {/* Dots — only reachable positions */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button key={i} onClick={() => scrollToIdx(i)} aria-label={`Product ${i + 1}`}>
              <span className="block rounded-full transition-all duration-300"
                style={{ width: i === activeIdx ? "24px" : "6px", height: "6px", background: i === activeIdx ? "#44e5c2" : "#e5e7eb" }} />
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <a href="/products"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-[Montserrat] text-[11px] font-bold tracking-[0.18em] uppercase border-2 transition-all duration-200"
            style={{ borderColor: "#44e5c2", color: "#00a882", background: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#44e5c2"; e.currentTarget.style.color = "#00382d"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#00a882"; }}>
            Explore Full Range
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </Reveal>
  );
}
