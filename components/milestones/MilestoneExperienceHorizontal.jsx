"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MILESTONES_CHAPTERS } from "@/lib/milestones";
import MilestoneStage2021 from "./stages/MilestoneStage2021";
import MilestoneStage2022 from "./stages/MilestoneStage2022";
import MilestoneStage2023 from "./stages/MilestoneStage2023";
import MilestoneStage2024 from "./stages/MilestoneStage2024";
import MilestoneStage2025 from "./stages/MilestoneStage2025";
import MilestoneStage2026 from "./stages/MilestoneStage2026";

const STAGE_COMPONENTS = [
  MilestoneStage2021,
  MilestoneStage2022,
  MilestoneStage2023,
  MilestoneStage2024,
  MilestoneStage2025,
  MilestoneStage2026,
];

export default function MilestoneExperienceHorizontal() {
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDraggingTrack, setIsDraggingTrack] = useState(false);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);

  // Update progress on scroll
  const handleScroll = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    setScrollProgress(Math.min(Math.max(progress, 0), 1));

    // Calculate nearest active index
    const cardWidth = scrollWidth / MILESTONES_CHAPTERS.length;
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(Math.min(Math.max(index, 0), MILESTONES_CHAPTERS.length - 1));
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
        inline: "center",
        block: "nearest",
      });
    }
  };

  const handlePrev = () => {
    scrollToIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    scrollToIndex(Math.min(MILESTONES_CHAPTERS.length - 1, currentIndex + 1));
  };

  // Track scrub bar dragging/clicking
  const handleTrackPointerDown = (e) => {
    setIsDraggingTrack(true);
    handleTrackScrub(e);
  };

  const handleTrackScrub = useCallback((e) => {
    if (!trackRef.current || !sliderRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const fraction = Math.min(Math.max(x / rect.width, 0), 1);
    const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
    sliderRef.current.scrollLeft = fraction * maxScroll;
  }, []);

  useEffect(() => {
    const onPointerMove = (e) => {
      if (isDraggingTrack) {
        handleTrackScrub(e);
      }
    };
    const onPointerUp = () => {
      if (isDraggingTrack) setIsDraggingTrack(false);
    };

    if (isDraggingTrack) {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDraggingTrack, handleTrackScrub]);

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
    <div className="relative w-full overflow-hidden pb-12">
      {/* ── TOP CONTROLS: Quick-Jump Year Pills + Navigation Arrows ── */}
      <div className="mx-auto max-w-7xl px-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          {/* Year Quick-Jump Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {MILESTONES_CHAPTERS.map((ch, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={ch.year}
                  onClick={() => scrollToIndex(idx)}
                  className={`rounded-full px-4 py-1.5 font-display-lg text-[13px] sm:text-[14px] transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-on-primary font-bold shadow-[0_0_20px_rgba(68,229,194,0.5)] scale-105"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {ch.year}
                </button>
              );
            })}
          </div>

          {/* Desktop Left & Right Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous milestone"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:text-primary active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === MILESTONES_CHAPTERS.length - 1}
              aria-label="Next milestone"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:text-primary active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── HORIZONTAL SCROLL CAROUSEL ──────────────────────────────── */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex items-stretch gap-6 sm:gap-8 overflow-x-auto px-6 sm:px-12 lg:px-16 scrollbar-none snap-x snap-mandatory py-4 ${
          isDraggingSlider ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
        style={{ scrollBehavior: isDraggingSlider ? "auto" : "smooth" }}
      >
        {MILESTONES_CHAPTERS.map((data, index) => {
          const StageComponent = STAGE_COMPONENTS[index];
          const isActive = index === currentIndex;

          return (
            <div
              key={data.year}
              className={`w-[88vw] sm:w-[80vw] lg:w-[75vw] max-w-5xl shrink-0 snap-center rounded-3xl border transition-all duration-300 shadow-2xl relative overflow-hidden ${
                isActive
                  ? "border-primary/40 bg-[#091322]/90 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
                  : "border-white/10 bg-[#080e1a]/60 opacity-75 hover:opacity-100 hover:border-white/20"
              }`}
            >
              <div className="p-6 sm:p-10 lg:p-12">
                <StageComponent data={data} activeProgress={1} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── BOTTOM DRAG & SCRUB LINE + NAVIGATION ─────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 mt-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-label-caps text-[11px] tracking-widest text-white/50 uppercase">
              Drag or use arrows to explore
            </span>
            <span className="text-white/20">·</span>
            <span className="font-display-lg text-[13px] text-primary">
              {MILESTONES_CHAPTERS[currentIndex].year} ({currentIndex + 1}/{MILESTONES_CHAPTERS.length})
            </span>
          </div>

          {/* Interactive Drag Scrub Line */}
          <div className="flex items-center gap-4 w-full sm:w-80 lg:w-96">
            <div
              ref={trackRef}
              onPointerDown={handleTrackPointerDown}
              className="relative h-2 w-full cursor-pointer rounded-full bg-white/10 hover:bg-white/15 transition-colors py-2 -my-2"
              title="Click or drag to scrub timeline"
            >
              {/* Background thin track */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-white/10 overflow-hidden">
                {/* Active progress fill */}
                <div
                  className="h-full bg-gradient-to-r from-primary to-[#44e5c2] shadow-[0_0_12px_rgba(68,229,194,0.8)] transition-all duration-150"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>

              {/* Draggable thumb pill */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary border-2 border-[#06080f] shadow-[0_0_10px_rgba(68,229,194,0.9)] transition-transform hover:scale-125"
                style={{ left: `${scrollProgress * 100}%` }}
              />
            </div>

            {/* Mobile / Compact Arrow Buttons */}
            <div className="flex sm:hidden items-center gap-1.5 shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 disabled:opacity-30"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === MILESTONES_CHAPTERS.length - 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 disabled:opacity-30"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
