"use client";

import { useState } from "react";
import MilestoneExperienceVertical from "./MilestoneExperienceVertical";
import MilestoneExperienceHorizontal from "./MilestoneExperienceHorizontal";

export default function MilestonesSection() {
  // View mode switcher: 'both' (default for comparison), 'vertical' (Version A), 'horizontal' (Version B)
  const [viewMode, setViewMode] = useState("both");

  return (
    <section className="relative w-full bg-[#06080f] text-white border-y border-white/5">
      {/* ── HERO INTRO HEADER ────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-6 bg-primary" />
              <span className="font-label-caps text-label-caps tracking-[0.24em] text-primary uppercase">
                KEY EVENTS, NATIONAL &amp; INTERNATIONAL RECOGNITIONS
              </span>
            </div>

            <h2
              className="font-display-lg leading-[1.02] text-white"
              style={{ fontSize: "clamp(42px, 6vw, 84px)" }}
            >
              # MILESTONES
            </h2>

            <div className="mt-5 space-y-1">
              <p className="font-display-lg text-[22px] sm:text-[28px] text-primary leading-snug">
                From waste to protein.
              </p>
              <p className="font-body-lg text-[16px] sm:text-[18px] text-white/50">
                From an idea to a growing movement.
              </p>
            </div>
          </div>

          {/* Interactive Mode Toggle Switch */}
          <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1.5 backdrop-blur-md self-start md:self-auto shadow-2xl">
            <button
              onClick={() => setViewMode("both")}
              className={`rounded-full px-4 py-2 font-label-caps text-[10px] tracking-widest transition-all duration-300 ${
                viewMode === "both"
                  ? "bg-primary text-on-primary font-bold shadow-[0_0_20px_rgba(68,229,194,0.6)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              SHOW BOTH VERSIONS
            </button>
            <button
              onClick={() => setViewMode("vertical")}
              className={`rounded-full px-4 py-2 font-label-caps text-[10px] tracking-widest transition-all duration-300 ${
                viewMode === "vertical"
                  ? "bg-primary text-on-primary font-bold shadow-[0_0_20px_rgba(68,229,194,0.6)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              VERSION A (VERTICAL)
            </button>
            <button
              onClick={() => setViewMode("horizontal")}
              className={`rounded-full px-4 py-2 font-label-caps text-[10px] tracking-widest transition-all duration-300 ${
                viewMode === "horizontal"
                  ? "bg-primary text-on-primary font-bold shadow-[0_0_20px_rgba(68,229,194,0.6)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              VERSION B (HORIZONTAL)
            </button>
          </div>
        </div>
      </div>

      {/* ── VERSION A (VERTICAL STICKY SCROLL EXPERIENCE) ──────────── */}
      {(viewMode === "both" || viewMode === "vertical") && (
        <div className="relative border-t border-white/5">
          {viewMode === "both" && (
            <div className="mx-auto max-w-7xl px-6 py-6 flex items-center gap-3">
              <span className="rounded-full bg-primary/15 border border-primary/40 px-4 py-1 font-label-caps text-[10px] tracking-widest text-primary shadow-[0_0_15px_rgba(68,229,194,0.3)]">
                VERSION A — VERTICAL CINEMATIC JOURNEY
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          )}
          <MilestoneExperienceVertical />
        </div>
      )}

      {/* ── VERSION B (HORIZONTAL STICKY SCROLL EXPERIENCE) ────────── */}
      {(viewMode === "both" || viewMode === "horizontal") && (
        <div className="relative border-t border-white/10">
          {viewMode === "both" && (
            <div className="mx-auto max-w-7xl px-6 py-6 flex items-center gap-3">
              <span className="rounded-full bg-primary/15 border border-primary/40 px-4 py-1 font-label-caps text-[10px] tracking-widest text-primary shadow-[0_0_15px_rgba(68,229,194,0.3)]">
                VERSION B — HORIZONTAL CINEMATIC JOURNEY
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          )}
          <MilestoneExperienceHorizontal />
        </div>
      )}
    </section>
  );
}
