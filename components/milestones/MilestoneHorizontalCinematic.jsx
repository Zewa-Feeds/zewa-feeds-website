"use client";

import { useEffect, useRef, useState } from "react";
import { MILESTONES_DATA } from "@/lib/milestones";
import MilestoneCardCinematic from "./MilestoneCardCinematic";

export default function MilestoneHorizontalCinematic() {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const outer = outerRef.current;
      const track = trackRef.current;
      if (!outer || !track) return;

      const rect = outer.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalScrollable = rect.height - windowH;

      if (totalScrollable <= 0) return;

      const current = Math.max(0, -rect.top);
      const pct = Math.min(1, Math.max(0, current / totalScrollable));

      setScrollProgress(pct);

      const idx = Math.min(
        MILESTONES_DATA.length - 1,
        Math.floor(pct * MILESTONES_DATA.length)
      );
      setActiveIndex(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToYear = (idx) => {
    setActiveIndex(idx);
    const outer = outerRef.current;
    if (!outer) return;
    const windowH = window.innerHeight;
    const totalScrollable = outer.getBoundingClientRect().height - windowH;
    const targetY = outer.offsetTop + (idx / (MILESTONES_DATA.length - 1)) * totalScrollable;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  return (
    // Outer scroll container (gives vertical height so page scroll translates to horizontal movement)
    <div ref={outerRef} className="relative h-[300vh] w-full">
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-[#06080f] py-8">
        {/* Top Header & Year Tracker Bar */}
        <div className="relative z-20 mx-auto w-full max-w-[1440px] px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="font-label-caps text-[11px] tracking-[0.2em] text-primary">
                JOURNEY PROGRESSION
              </span>
              <span className="text-white/30">·</span>
              <span className="font-headline-sm text-[14px] text-white">
                {MILESTONES_DATA[activeIndex].year} — {MILESTONES_DATA[activeIndex].theme}
              </span>
            </div>

            {/* Interactive Year Navigation Buttons */}
            <div className="flex items-center gap-2">
              {MILESTONES_DATA.map((item, i) => (
                <button
                  key={item.year}
                  onClick={() => scrollToYear(i)}
                  className={`rounded-full px-3 py-1 font-display-lg text-[13px] transition-all duration-300 ${
                    i === activeIndex
                      ? "bg-primary text-on-primary font-bold shadow-[0_0_15px_rgba(68,229,194,0.6)] scale-110"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.year}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── HORIZONTAL TRACK ────────────────────────────────────── */}
        <div className="relative z-10 my-auto w-full overflow-hidden">
          {/* Connecting Line Track */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-white/10"
          >
            <div
              className="h-full bg-gradient-to-r from-primary via-[#44e5c2] to-primary transition-all duration-300 shadow-[0_0_20px_rgba(68,229,194,0.8)]"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Horizontal Translating Cards Container */}
          <div
            ref={trackRef}
            className="flex items-center gap-8 sm:gap-12 px-6 sm:px-16 transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(calc(-${scrollProgress * 80}% + ${scrollProgress * 20}vw))`,
            }}
          >
            {MILESTONES_DATA.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={item.year}
                  className="w-[85vw] sm:w-[540px] md:w-[620px] shrink-0 transition-all duration-500"
                >
                  <MilestoneCardCinematic item={item} isActive={isActive} isVertical={false} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="relative z-20 mx-auto w-full max-w-[1440px] px-6">
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
            <span className="font-label-caps text-[10px] tracking-widest text-white/40">
              SCROLL DOWN TO TRAVEL THROUGH TIME (2021 → 2026)
            </span>

            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
