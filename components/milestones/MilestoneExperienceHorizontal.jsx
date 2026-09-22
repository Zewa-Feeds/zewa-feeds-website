"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

const MILESTONES = [
  {
    year: "2021",
    points: [
      "Incorporation",
      "First waste-to-protein pilots",
      "UNDP Green Innovation Fund Winner",
    ],
    index: "01",
    image: "/Website_ Milestones/Incorporation& first office.jpg",
    imageAlt: "Incorporation and first waste-to-protein pilots, 2021",
  },
  {
    year: "2022",
    points: [
      "Commercial plant producing insect protein from municipal waste",
      "EY Climathon Champion",
      "Swachh Technology Challenge, Kerala Nominee",
    ],
    index: "02",
    image: "/Website_ Milestones/India's first data centric Insect farm 2022.png",
    imageAlt: "India's first data-centric insect farm, 2022",
  },
  {
    year: "2023",
    points: [
      "Pivot to formulation science",
      "Formulation research and field trials begin",
      "Australian Government AAGS Winner",
      "KSUM Market Acceleration Grant",
      "ICAR-CIFT MoU signed",
    ],
    index: "03",
    image: "/Website_ Milestones/AAGS 2023.jpg",
    imageAlt: "Australian Government AAGS Winner & formulation trials, 2023",
  },
  {
    year: "2024",
    points: [
      "Facility and team rebuilt",
      "First species-specific SKUs launched",
      "ICAR Pusa Krishi UPJA Winner",
      "AgHub Catalytic Capital Recipient",
    ],
    index: "04",
    image: "/Website_ Milestones/ICAR IARI 2024.JPG",
    imageAlt: "ICAR Pusa Krishi UPJA Winner & species-specific feeds, 2024",
  },
  {
    year: "2025",
    points: [
      "KAU feeding trial validates 2.2× weight gain over imported feed",
      "Temasek Foundation Ecosphere NextGen Leader",
      "AFTEA Finalist, Singapore",
    ],
    index: "05",
    image: "/Website_ Milestones/Product display 2025.jpeg",
    imageAlt: "KAU feeding trial validation & product display, 2025",
  },
  {
    year: "2025",
    points: [
      "Research presented at MECOS 4 (SFM-177)",
      "National expansion",
      "Amazon, Flipkart, Blinkit and D2C live",
    ],
    index: "06",
    image: "/Website_ Milestones/Product display 2025_2.jpeg",
    imageAlt: "MECOS 4 research presentation & national expansion, 2025",
  },
  {
    year: "2026",
    points: [
      "44 SKUs across 29 formulations",
      "500+ outlets in 8 states",
      "Amazon US Global Selling opened",
      "KSIDC Scale up Support",
      "Vande Bharatam National Finalist — 56 selected from 26,000+ applications",
    ],
    index: "07",
    image: "/Website_ Milestones/Vande Bharatam 2026.webp",
    imageAlt: "Vande Bharatam National Finalist & global expansion, 2026",
  },
];

export default function MilestoneExperienceHorizontal() {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);

  // Update scroll boundaries & active card index
  const updateScrollState = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

    // Threshold of 8px to handle sub-pixel rounding
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);

    // Calculate active milestone index based on card positions
    const cards = sliderRef.current.children;
    if (cards && cards.length > 0) {
      let activeIndex = 0;
      let minDiff = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const diff = Math.abs(card.offsetLeft - scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          activeIndex = i;
        }
      }
      setCurrentIndex(activeIndex);
    }
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    updateScrollState();
    slider.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      slider.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const handlePrev = () => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const firstCard = container.querySelector(".snap-start");
    const scrollAmount = firstCard ? firstCard.offsetWidth + 20 : 340;
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const handleNext = () => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const firstCard = container.querySelector(".snap-start");
    const scrollAmount = firstCard ? firstCard.offsetWidth + 20 : 340;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
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
    <div className="relative mx-auto max-w-7xl px-4 sm:px-10 lg:px-14 py-12 sm:py-16">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-6 bg-primary" />
            <span className="font-label-caps text-label-caps tracking-[0.2em] text-primary">
              MILESTONES
            </span>
          </div>
          <h2
            className="font-display-lg leading-[1.15] text-white"
            style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}
          >
            Key events, National and International recognitions
          </h2>
        </div>

        {/* Milestone Position Counter */}
        <div className="flex items-center gap-3 shrink-0 pb-1 self-start sm:self-end">
          <span className="font-label-caps text-[11px] sm:text-[12px] tracking-[0.2em] text-white/50 tabular-nums">
            {String(currentIndex + 1).padStart(2, "0")} / {String(MILESTONES.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* ── CAROUSEL WITH SADDLE NAVIGATION ARROWS ─────────────────────── */}
      <div className="relative">
        {/* Left Navigation Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canScrollLeft}
          aria-label="Previous milestone"
          className={`absolute -left-2 sm:-left-5 lg:-left-7 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full border border-white/20 bg-[#080e1a]/90 text-white/90 backdrop-blur-md transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.6)] hover:scale-110 hover:border-primary hover:bg-[#0c1524] hover:text-primary hover:shadow-[0_0_20px_rgba(68,229,194,0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            canScrollLeft
              ? "opacity-100 pointer-events-auto translate-x-0"
              : "opacity-0 pointer-events-none -translate-x-2"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:h-5 sm:w-5">
            <path
              d="M15 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Left edge fade gradient */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 bottom-4 w-10 sm:w-16 bg-gradient-to-r from-[#06080f] via-[#06080f]/75 to-transparent z-20 transition-opacity duration-300 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Horizontal yearwise cards strip */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x snap-mandatory ${
            isDraggingSlider ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
          style={{ scrollBehavior: isDraggingSlider ? "auto" : "smooth" }}
        >
        {MILESTONES.map((m, idx) => {
          const isActive = idx === currentIndex;

          return (
            <div
              key={`${m.year}-${m.index}`}
              className={`w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start rounded-2xl border p-4 sm:p-5 flex flex-col transition-all duration-200 shadow-md group ${
                isActive
                  ? "border-primary/50 bg-[#0c1524] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                  : "border-white/10 bg-[#080e1a]/80 hover:border-white/20 hover:bg-[#0a1220]"
              }`}
            >
              <div>
                {/* Milestone Image */}
                {m.image && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/40 border border-white/10 mb-4 group-hover:border-primary/30 transition-colors">
                    <Image
                      src={m.image}
                      alt={m.imageAlt || (m.points ? m.points.join(", ") : m.text || "")}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 280px, 340px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}

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

                {/* Milestone Points as Separate Bullets */}
                {Array.isArray(m.points) && m.points.length > 0 ? (
                  <ul className="space-y-2 mt-1">
                    {m.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_6px_rgba(68,229,194,0.6)]" />
                        <span className="font-body-md text-[13.5px] sm:text-[14px] text-white/85 leading-relaxed">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-body-md text-[13.5px] sm:text-[14px] text-white/85 leading-relaxed">
                    {m.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        </div>

        {/* Right edge fade gradient */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 top-0 bottom-4 w-10 sm:w-16 bg-gradient-to-l from-[#06080f] via-[#06080f]/75 to-transparent z-20 transition-opacity duration-300 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right Navigation Arrow */}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canScrollRight}
          aria-label="Next milestone"
          className={`absolute -right-2 sm:-right-5 lg:-right-7 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full border border-white/20 bg-[#080e1a]/90 text-white/90 backdrop-blur-md transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.6)] hover:scale-110 hover:border-primary hover:bg-[#0c1524] hover:text-primary hover:shadow-[0_0_20px_rgba(68,229,194,0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            canScrollRight
              ? "opacity-100 pointer-events-auto translate-x-0"
              : "opacity-0 pointer-events-none translate-x-2"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:h-5 sm:w-5">
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
