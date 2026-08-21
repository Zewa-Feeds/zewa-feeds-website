"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

const MILESTONES = [
  {
    year: "2021",
    text: "Incorporation, First Waste to protein pilots",
    index: "01",
    recognition: "UNDP GIF Winner",
  },
  {
    year: "2022",
    text: "Commercial plant to produce Insect protein from municipal waste",
    index: "02",
    recognition: "EY Climathon Winner",
  },
  {
    year: "2023",
    text: "Formulation research and field trials",
    index: "03",
    recognition: "AAGS Biotech Winner",
  },
  {
    year: "2024",
    text: "Launch of ornamental fish feeds",
    index: "04",
    recognition: "UPJA National Winner",
  },
  {
    year: "2025",
    text: "National expansion of 44+ products",
    index: "05",
    recognition: "Temasek Cohort SG",
  },
  {
    year: "2026",
    text: "...Major updates on the way...",
    index: "06",
    recognition: "Adani Green Finalist",
  },
];

export default function MilestoneExperienceHorizontal() {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);

  // Update progress on scroll
  const handleScroll = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth } = sliderRef.current;
    const cardWidth = scrollWidth / MILESTONES.length;
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(Math.min(Math.max(index, 0), MILESTONES.length - 1));
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.addEventListener("scroll", handleScroll, { passive: true });
    return () => slider.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Jump to specific index smoothly
  const scrollToIndex = (index) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const targetCard = container.children[index];
    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
  };

  const handlePrev = () => {
    scrollToIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    scrollToIndex(Math.min(MILESTONES.length - 1, currentIndex + 1));
  };

  // Mouse Drag-to-scroll on slider
  const handleMouseDown = (e) => {
    if (e.button !== 0 || e.target.closest("button") || e.target.closest("a")) return;
    setIsDraggingSlider(true);
    dragStartX.current = e.pageX - (sliderRef.current?.offsetLeft || 0);
    dragStartScrollLeft.current = sliderRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingSlider || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - (sliderRef.current.offsetLeft || 0);
    const walk = (x - dragStartX.current) * 1.5;
    sliderRef.current.scrollLeft = dragStartScrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDraggingSlider(false);
  };

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h2 className="font-display-lg text-3xl sm:text-4xl text-white tracking-tight">
            Milestones
          </h2>
        </div>

        {/* Left & Right Arrow Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous milestone"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:text-primary active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === MILESTONES.length - 1}
            aria-label="Next milestone"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:text-primary active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── HORIZONTAL YEARWISE CARDS STRIP ──────────────────────────── */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory ${
          isDraggingSlider ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
        style={{ scrollBehavior: isDraggingSlider ? "auto" : "smooth" }}
      >
        {MILESTONES.map((m, idx) => {
          const isActive = idx === currentIndex;

          return (
            <div
              key={m.year}
              className={`w-[260px] sm:w-[290px] md:w-[310px] shrink-0 snap-start rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 shadow-md group ${
                isActive
                  ? "border-primary/50 bg-[#0c1524] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                  : "border-white/10 bg-[#080e1a]/80 hover:border-white/20 hover:bg-[#0a1220]"
              }`}
            >
              <div>
                {/* Year Header & Index */}
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-display-lg text-2xl sm:text-3xl text-primary leading-none group-hover:scale-105 transition-transform">
                    {m.year}
                  </span>
                  <span className="font-label-caps text-[10px] tracking-widest text-white/30">
                    {m.index}
                  </span>
                </div>

                {/* Accent rule */}
                <div className="h-0.5 w-6 bg-primary/40 group-hover:w-10 group-hover:bg-primary transition-all duration-200 mb-3.5" />

                {/* Exact Milestone Copy */}
                <p className="font-body-md text-[13.5px] sm:text-[14px] text-white/85 leading-relaxed">
                  {m.text}
                </p>
              </div>

              {/* Recognition Pill */}
              <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span className="font-label-caps text-[10px] tracking-wider text-white/50 truncate">
                  {m.recognition}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
