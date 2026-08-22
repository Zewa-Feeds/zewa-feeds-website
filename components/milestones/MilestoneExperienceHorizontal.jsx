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
      "EY Climathon Champion · Swachh Technology Challenge Kerala, Nominee",
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
      "Australian Government AAGS Winner · KSUM Market Acceleration Grant · ICAR-CIFT MoU signed",
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
      "ICAR Pusa Krishi UPJA Winner · AgHub Catalytic Capital Recipient",
    ],
    index: "04",
    image: "/Website_ Milestones/ICAR IARI 2024.JPG",
    imageAlt: "ICAR Pusa Krishi UPJA Winner & species-specific feeds, 2024",
  },
  {
    year: "2025",
    points: [
      "KAU feeding trial validates 2.2× weight gain over imported feed",
      "Temasek Foundation Ecosphere NextGen Leader · AFTEA Finalist, Singapore",
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
      "AFTEA Finalist, Singapore",
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
      <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-6 mb-8">
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

        {/* Left & Right Arrow Navigation */}
        <div className="flex items-center gap-2 shrink-0">
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
    </div>
  );
}
