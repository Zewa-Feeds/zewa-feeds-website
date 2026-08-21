"use client";

import MilestoneExperienceHorizontal from "./MilestoneExperienceHorizontal";

export default function MilestonesSection() {
  return (
    <section className="relative w-full bg-[#06080f] text-white border-y border-white/5 overflow-hidden">
      {/* ── HERO INTRO HEADER ────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
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
        </div>
      </div>

      {/* ── HORIZONTAL MILESTONES SLIDER EXPERIENCE ──────────────────── */}
      <MilestoneExperienceHorizontal />
    </section>
  );
}
