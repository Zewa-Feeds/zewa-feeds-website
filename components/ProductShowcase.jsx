"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { useCart } from "@/lib/cartContext";

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
    name: "Dried BSFL 25g",
    slug: null,
    blurb: "Whole dried Black Soldier Fly Larvae — maximum insect nutrition per gram.",
    price: "₹199",
    mrp: "₹249",
    badge: "PRO",
    protein: "50%",
    image: "/Bottles/DBSFL/DBSFL 25G.png",
    accentBg: "#ede9fb",
    accentDot: "#7c3aed",
  },
  {
    name: "Dried BSFL 75g",
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

const BG = "#ffffff";

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

    const scrollMax = el.scrollWidth - el.clientWidth;
    let reachable = 0;
    cardRefs.current.forEach((card) => {
      if (card && card.offsetLeft <= scrollMax + 8) reachable++;
    });
    setMaxIdx(Math.max(0, reachable - 1));

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

  const { addToCart, items, setQty: setCartQty, removeFromCart } = useCart();

  return (
    <Reveal id="products" className="relative bg-white overflow-hidden">

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-24 pb-16 sm:pb-24">

        {/* Header */}
        <div className="mb-10 sm:mb-14">
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

        {/* Track — arrows flank the entire scrollable section */}
        <div className="relative" style={{ overflow: "visible" }}>

          {/* Left arrow — sits just outside the left edge, centred vertically */}
          <button
            onClick={() => scroll(-1)}
            disabled={!canLeft}
            aria-label="Previous"
            className="hidden sm:flex group absolute -left-7 top-1/2 -translate-y-1/2 z-20 focus:outline-none"
            style={{ cursor: canLeft ? "pointer" : "default" }}
          >
            <div className="w-9 h-9 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="transition-colors duration-200"
                style={{ color: canLeft ? "#00a882" : "rgba(0,0,0,0.15)" }}>
                <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll(1)}
            disabled={!canRight}
            aria-label="Next"
            className="hidden sm:flex group absolute -right-7 top-1/2 -translate-y-1/2 z-20 focus:outline-none"
            style={{ cursor: canRight ? "pointer" : "default" }}
          >
            <div className="w-9 h-9 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="transition-colors duration-200"
                style={{ color: canRight ? "#00a882" : "rgba(0,0,0,0.15)" }}>
                <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>


          {/* Scrollable track */}
          <div
            ref={trackRef}
            className="flex gap-5 overflow-x-auto pb-4 no-scrollbar"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", paddingTop: "8px" }}
          >
            {PRODUCTS.map((p, i) => {
              const sku = p.slug || p.name.toLowerCase().replace(/\s+/g, "-");
              const cartItem = items.find((ci) => ci.sku === sku);
              const qty = cartItem?.qty ?? 0;

              return (
                <div
                  key={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="group shrink-0 flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/30 cursor-pointer"
                  style={{ scrollSnapAlign: "start", minWidth: "300px", maxWidth: "300px", background: "linear-gradient(160deg, #0d1726 0%, #0a1219 100%)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${p.accentBg}40, transparent)` }} />

                  {/* Image zone */}
                  <a href={p.slug ? `/products/${p.slug}` : "/products"} className="block">
                    <div className="relative flex items-center justify-center pt-8 pb-4 px-6 overflow-hidden" style={{ minHeight: "220px" }}>
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: `radial-gradient(circle at 50% 60%, ${p.accentDot}28, transparent 65%)` }} />
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={200}
                        height={200}
                        className="relative z-10 object-contain max-h-[190px] w-auto transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1"
                        style={{ filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.5))" }}
                      />
                      {p.badge && (
                        <span className="absolute top-4 left-4 text-[9px] font-bold px-2.5 py-1 rounded-full tracking-widest font-[Montserrat] text-white"
                          style={{ background: p.accentDot }}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </a>

                  {/* Content */}
                  <div className="flex flex-col flex-1 px-5 pt-1 pb-5 gap-2">
                    <a href={p.slug ? `/products/${p.slug}` : "/products"}>
                      <h3 className="font-[Playfair_Display] text-[19px] text-white leading-snug group-hover:text-primary transition-colors duration-200">
                        {p.name}
                      </h3>
                    </a>
                    <p className="text-[12px] text-white/35 font-[Montserrat] leading-relaxed flex-1 line-clamp-2">{p.blurb}</p>

                    <div className="mt-3 pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-[Playfair_Display] text-[24px] text-white leading-none">{p.price}</span>
                          <span className="text-[11px] text-white/20 line-through font-[Montserrat] ml-2">{p.mrp}</span>
                        </div>
                      </div>

                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart({ sku, name: p.name, pack: "45g", price: parseInt(p.price.replace(/[^\d]/g, "")), image: p.image, accentBg: "#1a2235" })}
                          className="w-full h-9 rounded-lg bg-primary text-[#00382d] text-[11px] font-bold tracking-[0.12em] uppercase font-[Montserrat] hover:bg-primary/85 active:scale-[0.97] transition-all duration-150 shadow-[0_0_16px_rgba(68,229,194,0.25)]"
                        >
                          + Add
                        </button>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center rounded-lg border border-primary/30 overflow-hidden h-9">
                            <button onClick={() => qty <= 1 ? removeFromCart(sku) : setCartQty(sku, qty - 1)}
                              className="w-9 h-9 flex items-center justify-center text-[20px] leading-none select-none font-light transition-all duration-150 bg-primary/8 text-primary hover:bg-primary/20">
                              −
                            </button>
                            <span className="w-9 text-center text-white text-[13px] font-bold font-[Montserrat] tabular-nums select-none border-x border-primary/20">
                              {qty}
                            </span>
                            <button onClick={() => setCartQty(sku, qty + 1)}
                              className="w-9 h-9 flex items-center justify-center text-[20px] leading-none select-none font-light transition-all duration-150 bg-primary/8 text-primary hover:bg-primary/20">
                              +
                            </button>
                          </div>
                          <span className="font-[Montserrat] text-[14px] font-bold text-primary tabular-nums">
                            ₹{(parseInt(p.price.replace(/[^\d]/g, "")) * qty).toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* View all tile */}
            <a href="/products"
              className="shrink-0 group flex flex-col items-center justify-center gap-5 rounded-2xl cursor-pointer transition-all duration-300"
              style={{ scrollSnapAlign: "start", minWidth: "180px", maxWidth: "180px", minHeight: "260px", background: "linear-gradient(160deg, #0d1726 0%, #0a1219 100%)", border: "1px dashed rgba(68,229,194,0.2)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(68,229,194,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(68,229,194,0.2)"; }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{ background: "rgba(68,229,194,0.08)", border: "1px solid rgba(68,229,194,0.2)" }}>
                <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#44e5c2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center px-4">
                <p className="text-[12px] font-bold tracking-[0.12em] uppercase font-[Montserrat]" style={{ color: "#44e5c2" }}>View All</p>
                <p className="text-[11px] font-[Montserrat] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>10+ formulas</p>
              </div>
            </a>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button key={i} onClick={() => scrollToIdx(i)} aria-label={`Product ${i + 1}`}>
              <span className="block rounded-full transition-all duration-300"
                style={{ width: i === activeIdx ? "24px" : "6px", height: "6px", background: i === activeIdx ? "#00a882" : "#e5e7eb" }} />
            </button>
          ))}
        </div>

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </Reveal>
  );
}
