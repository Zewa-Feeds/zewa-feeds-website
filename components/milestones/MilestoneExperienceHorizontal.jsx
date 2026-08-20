"use client";

import { useCinematicScroll } from "@/hooks/useCinematicScroll";
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
  const {
    containerRef,
    scrollProgress,
    currentChapter,
    mouseParallax,
    jumpToChapter,
  } = useCinematicScroll(MILESTONES_CHAPTERS.length);

  return (
    // Outer scroll track — provides the vertical scroll height to drive horizontal traversal
    <div ref={containerRef} className="relative h-[480vh] w-full">
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden bg-[#06080f] py-6 sm:py-8">
        
        {/* Top Control Bar & Live Year Tracker */}
        <div className="relative z-30 mx-auto w-full max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="font-label-caps text-[11px] tracking-[0.22em] text-primary uppercase">
                HORIZONTAL TRAVERSAL · CHAPTER {currentChapter + 1} OF {MILESTONES_CHAPTERS.length}
              </span>
              <span className="text-white/30 hidden sm:inline">·</span>
              <span className="font-headline-sm text-[13px] text-white/80 hidden sm:inline">
                {MILESTONES_CHAPTERS[currentChapter].year} — {MILESTONES_CHAPTERS[currentChapter].title}
              </span>
            </div>

            {/* Year Quick-Jump Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {MILESTONES_CHAPTERS.map((ch, idx) => {
                const isActive = idx === currentChapter;
                return (
                  <button
                    key={ch.year}
                    onClick={() => jumpToChapter(idx)}
                    className={`rounded-full px-3 py-1 font-display-lg text-[12px] sm:text-[13px] transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-on-primary font-bold shadow-[0_0_20px_rgba(68,229,194,0.6)] scale-110"
                        : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {ch.year}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── PANORAMIC HORIZONTAL STAGE TRACK ──────────────────────── */}
        <div className="relative z-20 my-auto w-full overflow-hidden">
          {/* Horizontal animated growth path line */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-white/10 pointer-events-none"
          >
            <div
              className="h-full bg-gradient-to-r from-primary via-[#44e5c2] to-primary shadow-[0_0_20px_rgba(68,229,194,0.9)] transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Horizontal Translating Stages Strip */}
          <div
            className="flex items-center gap-12 sm:gap-20 px-6 sm:px-16 transition-transform duration-300 ease-out"
            style={{
              transform: `translate3d(calc(-${scrollProgress * (MILESTONES_CHAPTERS.length - 1) * 85}vw), 0, 0)`,
            }}
          >
            {MILESTONES_CHAPTERS.map((data, index) => {
              const StageComponent = STAGE_COMPONENTS[index];
              const isActive = index === currentChapter;

              return (
                <div
                  key={data.year}
                  className={`w-[88vw] sm:w-[82vw] max-w-6xl shrink-0 transition-all duration-500 ${
                    isActive ? "opacity-100 scale-100" : "opacity-35 scale-95 blur-[1px]"
                  }`}
                >
                  <StageComponent
                    data={data}
                    activeProgress={isActive ? 1 : 0}
                    mouseParallax={mouseParallax}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="relative z-30 mx-auto w-full max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
            <span className="font-label-caps text-[10px] tracking-widest text-white/40">
              SCROLL DOWN TO MOVE HORIZONTALLY (2021 → 2026)
            </span>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="font-display-lg text-[13px] text-primary">
                {Math.round(scrollProgress * 100)}% COMPLETE
              </span>
              <div className="h-1.5 w-full sm:w-64 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-[#44e5c2] shadow-[0_0_10px_rgba(68,229,194,0.8)] transition-all duration-300"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
