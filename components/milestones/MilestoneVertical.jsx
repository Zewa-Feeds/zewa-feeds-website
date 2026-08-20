"use client";

import { MILESTONES_DATA } from "@/lib/milestones";
import MilestoneCard from "./MilestoneCard";
import Reveal from "@/components/Reveal";

export default function MilestoneVertical() {
  return (
    <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 py-8">
      {/* Central timeline line (Left-aligned on mobile, centered on lg screens) */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 top-12 left-5 sm:left-9 lg:left-1/2 w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/80 via-primary/40 to-primary/10"
      />

      <div className="space-y-12 sm:space-y-16">
        {MILESTONES_DATA.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <Reveal
              key={item.year}
              className="relative flex flex-col lg:flex-row items-start lg:items-center"
            >
              {/* Central Node Badge */}
              <div className="absolute left-5 sm:left-9 lg:left-1/2 -translate-x-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-primary bg-[#080e1c] shadow-[0_0_15px_rgba(68,229,194,0.4)]">
                <span className="font-display-lg text-[13px] sm:text-[15px] text-primary leading-none">
                  {item.year.slice(2)}
                </span>
                {item.isFuture && (
                  <span className="absolute inset-0 rounded-full border border-primary animate-ping opacity-75" />
                )}
              </div>

              {/* Layout Container */}
              <div
                className={`w-full pl-14 sm:pl-20 lg:pl-0 flex ${
                  isEven ? "lg:justify-start" : "lg:justify-end"
                }`}
              >
                <div className="w-full lg:w-[calc(50%-48px)]">
                  <MilestoneCard item={item} isVertical={true} />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
