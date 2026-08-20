"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import MilestoneVerticalCinematic from "./MilestoneVerticalCinematic";
import MilestoneHorizontalCinematic from "./MilestoneHorizontalCinematic";

export default function MilestonesSection() {
  // View mode switcher: 'both' (default for side-by-side comparison), 'vertical' (Version A), 'horizontal' (Version B)
  const [viewMode, setViewMode] = useState("both");

  return (
    <Reveal as="section" className="bg-[#06080f] border-y border-white/5 py-16 sm:py-24">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-10 mb-12">
        {/* Eyebrow & Main Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-6 bg-primary" />
              <span className="font-label-caps text-label-caps tracking-[0.2em] text-primary uppercase">
                KEY EVENTS, NATIONAL &amp; INTERNATIONAL RECOGNITIONS
              </span>
            </div>

            <h2
              className="font-display-lg leading-[1.08] text-white"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              # MILESTONES
            </h2>
            <p className="font-body-md mt-3 max-w-xl text-[15px] leading-relaxed text-white/50">
              A cinematic journey through Zewa's scientific R&amp;D, commercial facility expansion, formulation breakthroughs, and global recognitions (2021 → 2026).
            </p>
          </div>

          {/* Interactive View Switcher for Version Comparison */}
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm self-start md:self-auto">
            <button
              onClick={() => setViewMode("both")}
              className={`rounded-full px-4 py-2 font-label-caps text-[10px] tracking-widest transition-all duration-200 ${
                viewMode === "both"
                  ? "bg-primary text-on-primary font-bold shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              SHOW BOTH VERSIONS
            </button>
            <button
              onClick={() => setViewMode("vertical")}
              className={`rounded-full px-4 py-2 font-label-caps text-[10px] tracking-widest transition-all duration-200 ${
                viewMode === "vertical"
                  ? "bg-primary text-on-primary font-bold shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              VERSION A (VERTICAL)
            </button>
            <button
              onClick={() => setViewMode("horizontal")}
              className={`rounded-full px-4 py-2 font-label-caps text-[10px] tracking-widest transition-all duration-200 ${
                viewMode === "horizontal"
                  ? "bg-primary text-on-primary font-bold shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              VERSION B (HORIZONTAL)
            </button>
          </div>
        </div>
      </div>

      {/* Render Version A (Cinematic Vertical Timeline) */}
      {(viewMode === "both" || viewMode === "vertical") && (
        <div className="mb-20 border-b border-white/5 pb-16">
          {viewMode === "both" && (
            <div className="mx-auto max-w-[1240px] px-6 sm:px-10 mb-8 flex items-center gap-3">
              <span className="rounded-full bg-primary/15 border border-primary/40 px-3.5 py-1 font-label-caps text-[10px] tracking-widest text-primary shadow-[0_0_15px_rgba(68,229,194,0.3)]">
                VERSION A — CINEMATIC VERTICAL TIMELINE
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          )}
          <MilestoneVerticalCinematic />
        </div>
      )}

      {/* Render Version B (Cinematic Horizontal Timeline) */}
      {(viewMode === "both" || viewMode === "horizontal") && (
        <div>
          {viewMode === "both" && (
            <div className="mx-auto max-w-[1240px] px-6 sm:px-10 mb-8 flex items-center gap-3">
              <span className="rounded-full bg-primary/15 border border-primary/40 px-3.5 py-1 font-label-caps text-[10px] tracking-widest text-primary shadow-[0_0_15px_rgba(68,229,194,0.3)]">
                VERSION B — CINEMATIC HORIZONTAL TIMELINE
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          )}
          <MilestoneHorizontalCinematic />
        </div>
      )}
    </Reveal>
  );
}
