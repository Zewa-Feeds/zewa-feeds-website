"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

const ARTICLES = [
  {
    tag: "BIOLOGY",
    readTime: "6 min",
    title: "Microbiome health and the impact of insect chitin.",
    excerpt: "How natural prebiotics found in insects boost the immune system of ornamental species.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiYflndevKu4513c5n5GkXHFV-EvpSb6E9OSZRVKqujnzd9U7Xr_tIQy1kZHY11LNO5o8ODPGnM7Uvjja23suH7GPK-dMUN_aGIElLrm9UAkN7J-JYLp6TB2KnCjyNC91mmNoJYjrvollwE4zRkORRW9hr6aCvp7d1ohugUA--vy5EOb_Sso9ji_7HDoVXfj-my9H-K_9o2lzEmMNnv69QLJcVl_KvFqOXEv3TWYfAOUiD9gRx4hZcKB50ZWvRf8lW-gEhQVgcHy_M",
    tag_style: { color: "#44e5c2", bg: "rgba(68,229,194,0.1)", border: "rgba(68,229,194,0.25)" },
    featured: true,
  },
  {
    tag: "SUSTAINABILITY",
    readTime: "4 min",
    title: "Reducing ammonia output through high-absorption diets.",
    excerpt: "Quantifying the link between food quality and tank environment maintenance cycles.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUe08wYFIo3tYtgxi8tLeYAnY8T9Euno8TRXF4wFxp5bhBUZzEyUtyf1mUL2QK6RPU_-fTOT8tpMXxVnVxfBHE9_Tk4WQA2ucZg2nGcfiRPKexQwwQ6IZ6spCEybiPfIRhkJLgIG0r7GNOduPmfg_40jyDCPkBi_2ApzQcL2tMMd2Jc4n1BtwNjNFC_IArh_scx77EeciaX2839Gmfko-hPxmFQ0NeZbD0Y9v0aLUagj9EC5yOtmMSVSKIpEApcbu5Nfi988pET_QN",
    tag_style: { color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.25)" },
  },
  {
    tag: "NUTRITION",
    readTime: "5 min",
    title: "The role of carotenoids in natural color enhancement.",
    excerpt: "Science-backed methods for achieving stage-ready vibrancy without synthetic dyes.",
    image: "/Bottles/Betta/Betta 01.png",
    tag_style: { color: "#fb923c", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.25)" },
  },
  {
    tag: "BIOLOGY",
    readTime: "7 min",
    title: "Why insect protein outperforms fishmeal for freshwater species.",
    excerpt: "A deep dive into amino acid profiles and bioavailability across protein sources.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiYflndevKu4513c5n5GkXHFV-EvpSb6E9OSZRVKqujnzd9U7Xr_tIQy1kZHY11LNO5o8ODPGnM7Uvjja23suH7GPK-dMUN_aGIElLrm9UAkN7J-JYLp6TB2KnCjyNC91mmNoJYjrvollwE4zRkORRW9hr6aCvp7d1ohugUA--vy5EOb_Sso9ji_7HDoVXfj-my9H-K_9o2lzEmMNnv69QLJcVl_KvFqOXEv3TWYfAOUiD9gRx4hZcKB50ZWvRf8lW-gEhQVgcHy_M",
    tag_style: { color: "#44e5c2", bg: "rgba(68,229,194,0.1)", border: "rgba(68,229,194,0.25)" },
  },
];

export default function KnowledgeHub() {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [maxIdx, setMaxIdx] = useState(ARTICLES.length - 1);

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

  return (
    <Reveal id="knowledge" className="relative overflow-hidden" style={{ background: "#06080f" }}>

      {/* Ambient glow */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.25) 50%, transparent)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(68,229,194,0.05) 0%, transparent 65%)", filter: "blur(80px)" }} />

      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-20 sm:pb-28">

        {/* Header */}
        <div className="flex items-end justify-between gap-5 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-px bg-primary" />
              <span className="text-[10px] font-bold text-primary tracking-[0.28em] font-[Montserrat] uppercase">Knowledge Hub</span>
            </div>
            <h2 className="font-[Playfair_Display] text-[32px] sm:text-[48px] text-white leading-tight">
              Science you can{" "}
              <span className="text-primary italic">feed on.</span>
            </h2>
            <p className="mt-3 text-[13px] text-white/35 font-[Montserrat] max-w-md leading-relaxed">
              Research-backed insights on insect nutrition, tank health, and sustainable aquaculture.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <div className="flex gap-2">
              <button onClick={() => scroll(-1)} disabled={!canLeft}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${canLeft ? "border-primary/40 text-primary hover:bg-primary/10" : "border-white/8 text-white/15 cursor-not-allowed"}`}>
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={() => scroll(1)} disabled={!canRight}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${canRight ? "border-primary/40 text-primary hover:bg-primary/10" : "border-white/8 text-white/15 cursor-not-allowed"}`}>
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <a href="/blog"
              className="flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase font-[Montserrat] transition-all duration-200 text-primary border border-primary/25 hover:bg-primary hover:text-[#00382d]">
              All Articles
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* Scroll track */}
        <div className="relative">
          <div className={`absolute left-0 top-0 bottom-4 w-12 z-10 pointer-events-none transition-opacity duration-300 ${canLeft ? "opacity-100" : "opacity-0"}`}
            style={{ background: "linear-gradient(to right, #06080f, transparent)" }} />
          <div className={`absolute right-0 top-0 bottom-4 w-16 z-10 pointer-events-none transition-opacity duration-300 ${canRight ? "opacity-100" : "opacity-0"}`}
            style={{ background: "linear-gradient(to left, #06080f, transparent)" }} />

          <div
            ref={trackRef}
            className="flex gap-5 overflow-x-auto pb-4 no-scrollbar"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          >
            {ARTICLES.map((a, i) => (
              <a
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                href="/blog"
                style={{
                  scrollSnapAlign: "start",
                  minWidth: i === 0 ? "380px" : "300px",
                  maxWidth: i === 0 ? "380px" : "300px",
                }}
                className="group shrink-0 flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image — taller for featured */}
                <div className="relative w-full overflow-hidden shrink-0"
                  style={{ aspectRatio: i === 0 ? "3/2" : "16/9" }}>
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    sizes={i === 0 ? "380px" : "300px"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Dark gradient */}
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(6,8,15,0.85) 100%)" }} />

                  {/* Tag overlaid on image */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[0.18em] font-[Montserrat] border"
                      style={{ color: a.tag_style.color, background: a.tag_style.bg, borderColor: a.tag_style.border }}>
                      {a.tag}
                    </span>
                    <span className="text-[10px] text-white/40 font-[Montserrat]">{a.readTime} read</span>
                  </div>

                  {i === 0 && (
                    <span className="absolute top-4 right-4 text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[0.18em] font-[Montserrat] bg-primary text-[#00382d]">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-2.5"
                  style={{ background: "linear-gradient(160deg, #0e1828 0%, #0a1219 100%)" }}>
                  <h3 className={`font-[Playfair_Display] text-white leading-snug group-hover:text-primary transition-colors duration-300 ${i === 0 ? "text-[20px]" : "text-[16px]"}`}>
                    {a.title}
                  </h3>
                  <p className="text-[11px] text-white/30 font-[Montserrat] leading-relaxed line-clamp-2 flex-1">
                    {a.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 pt-3 border-t border-white/5 text-[10px] font-bold text-primary tracking-widest uppercase font-[Montserrat]">
                    Read Article
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div className="h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: `linear-gradient(to right, ${a.tag_style.color}, transparent)` }} />
              </a>
            ))}

            {/* View all card */}
            <a href="/blog"
              style={{ scrollSnapAlign: "start", minWidth: "160px", maxWidth: "160px" }}
              className="shrink-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/6 hover:border-primary/35 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-200">
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-primary">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center px-3">
                <p className="text-[11px] font-bold text-primary tracking-[0.12em] uppercase font-[Montserrat]">All Articles</p>
                <p className="text-[10px] text-white/25 font-[Montserrat] mt-1">Knowledge Hub</p>
              </div>
            </a>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button key={i} onClick={() => scrollToIdx(i)} aria-label={`Article ${i + 1}`}>
              <span className="block rounded-full transition-all duration-300"
                style={{ width: i === activeIdx ? "24px" : "6px", height: "6px", background: i === activeIdx ? "#44e5c2" : "rgba(255,255,255,0.12)" }} />
            </button>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden flex justify-center mt-6">
          <a href="/blog" className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase font-[Montserrat] border border-primary/25 px-5 py-2 rounded-full">
            All Articles →
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
