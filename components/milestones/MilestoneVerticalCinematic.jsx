"use client";

import { useEffect, useRef, useState } from "react";
import { MILESTONES_DATA } from "@/lib/milestones";
import MilestoneCardCinematic from "./MilestoneCardCinematic";

export default function MilestoneVerticalCinematic() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Distance from top of element to middle of viewport
      const totalH = rect.height;
      const scrolled = Math.max(0, windowHeight / 2 - rect.top);
      const pct = Math.min(1, Math.max(0, scrolled / totalH));

      setScrollPct(pct);

      // Determine active index
      const cards = el.querySelectorAll(".cinematic-v-card");
      let currentActive = 0;
      cards.forEach((card, idx) => {
        const cRect = card.getBoundingClientRect();
        if (cRect.top <= windowHeight * 0.6) {
          currentActive = idx;
        }
      });
      setActiveIndex(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-[1240px] px-4 sm:px-6 py-12">
      {/* ── CONTINUOUS ANIMATED SVG VERTICAL SPINE LINE ───────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-12 top-16 left-5 sm:left-9 lg:left-1/2 w-1 -translate-x-1/2 bg-white/10 overflow-hidden rounded-full"
      >
        {/* Active glowing line fill that draws itself on scroll */}
        <div
          className="w-full bg-gradient-to-b from-primary via-[#44e5c2] to-primary/30 transition-all duration-300 shadow-[0_0_15px_rgba(68,229,194,0.8)]"
          style={{ height: `${scrollPct * 100}%` }}
        />
      </div>

      {/* ── GLOWING TRACER BEAD ──────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-5 sm:left-9 lg:left-1/2 -translate-x-1/2 z-30 h-6 w-6 rounded-full border-2 border-primary bg-[#080e1c] shadow-[0_0_20px_rgba(68,229,194,1)] transition-all duration-300"
        style={{
          top: `calc(4rem + ${scrollPct * 85}%)`,
        }}
      >
        <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
      </div>

      {/* ── MILESTONE CHAPTERS ──────────────────────────────────── */}
      <div className="space-y-16 sm:space-y-24">
        {MILESTONES_DATA.map((item, index) => {
          const isEven = index % 2 === 0;
          const isActive = index === activeIndex;

          return (
            <div
              key={item.year}
              className="cinematic-v-card relative flex flex-col lg:flex-row items-start lg:items-center"
            >
              {/* Year Node Marker on Spine */}
              <div
                className={`absolute left-5 sm:left-9 lg:left-1/2 -translate-x-1/2 z-20 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  isActive
                    ? "border-primary bg-primary/20 shadow-[0_0_30px_rgba(68,229,194,0.8)] scale-110"
                    : "border-white/20 bg-[#080e1c] scale-95"
                }`}
              >
                <span
                  className={`font-display-lg text-[14px] sm:text-[16px] leading-none ${
                    isActive ? "text-primary font-bold" : "text-white/40"
                  }`}
                >
                  {item.year.slice(2)}
                </span>
              </div>

              {/* Card Container (Alternating Left/Right on Desktop) */}
              <div
                className={`w-full pl-14 sm:pl-20 lg:pl-0 flex ${
                  isEven ? "lg:justify-start" : "lg:justify-end"
                }`}
              >
                <div className="w-full lg:w-[calc(50%-56px)]">
                  <MilestoneCardCinematic item={item} isActive={isActive} isVertical={true} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
