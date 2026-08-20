"use client";

import { useRef, useState } from "react";
import { MILESTONES_DATA } from "@/lib/milestones";
import MilestoneCard from "./MilestoneCard";

export default function MilestoneHorizontal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const scrollToCard = (index) => {
    setActiveIndex(index);
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(".milestone-horizontal-card");
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToCard(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < MILESTONES_DATA.length - 1) {
      scrollToCard(activeIndex + 1);
    }
  };

  return (
    <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 py-6">
      {/* Top Year Tracker Navigation */}
      <div className="mb-10 overflow-x-auto pb-4 scrollbar-none">
        <div className="relative flex items-center justify-between min-w-[640px] px-8 py-4">
          {/* Track background line */}
          <div className="absolute left-8 right-8 top-1/2 h-0.5 -translate-y-1/2 bg-white/10" />
          {/* Active progress fill */}
          <div
            className="absolute left-8 top-1/2 h-0.5 -translate-y-1/2 bg-primary transition-all duration-400"
            style={{
              width: `${(activeIndex / (MILESTONES_DATA.length - 1)) * 88}%`,
            }}
          />

          {MILESTONES_DATA.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.year}
                onClick={() => scrollToCard(idx)}
                className="relative z-10 flex flex-col items-center gap-2 group focus:outline-none"
              >
                <div
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? "border-primary bg-primary/20 shadow-[0_0_20px_rgba(68,229,194,0.5)] scale-110"
                      : "border-white/20 bg-[#080e1c] group-hover:border-primary/50"
                  }`}
                >
                  <span
                    className={`font-display-lg text-[13px] sm:text-[15px] ${
                      isActive ? "text-primary font-bold" : "text-white/60 group-hover:text-primary"
                    }`}
                  >
                    {item.year.slice(2)}
                  </span>
                </div>
                <span
                  className={`font-label-caps text-[11px] tracking-wider transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-white/40 group-hover:text-white/70"
                  }`}
                >
                  {item.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls Row */}
      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="font-label-caps text-[11px] tracking-widest text-primary uppercase">
            MILESTONE {activeIndex + 1} OF {MILESTONES_DATA.length}
          </span>
          <span className="text-white/30">·</span>
          <span className="font-body-md text-[13px] text-white/60">
            {MILESTONES_DATA[activeIndex].year} — {MILESTONES_DATA[activeIndex].title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous milestone"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-200 hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none"
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={activeIndex === MILESTONES_DATA.length - 1}
            aria-label="Next milestone"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-200 hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none"
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scrollbar-none"
        onScroll={(e) => {
          const el = e.currentTarget;
          const cardWidth = el.firstElementChild?.getBoundingClientRect().width || 360;
          const index = Math.round(el.scrollLeft / (cardWidth + 24));
          if (index >= 0 && index < MILESTONES_DATA.length && index !== activeIndex) {
            setActiveIndex(index);
          }
        }}
      >
        {MILESTONES_DATA.map((item) => (
          <div
            key={item.year}
            className="milestone-horizontal-card min-w-[300px] sm:min-w-[440px] max-w-[500px] snap-center shrink-0"
          >
            <MilestoneCard item={item} isVertical={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
