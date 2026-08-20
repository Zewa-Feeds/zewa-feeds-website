"use client";

import Image from "next/image";

export default function MilestoneCard({ item, isVertical = false }) {
  const { year, category, title, description, recognitions, image, imageAlt, isFuture, highlight } = item;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-6 sm:p-8 transition-all duration-300 ${
        isFuture
          ? "bg-gradient-to-br from-[#0c1a2e] via-[#091524] to-[#0d2222] border-primary/40 hover:border-primary shadow-[0_0_30px_rgba(68,229,194,0.1)] hover:shadow-[0_0_40px_rgba(68,229,194,0.2)]"
          : "bg-white/[0.03] border-white/10 hover:border-primary/40 hover:bg-white/[0.05] hover:shadow-xl"
      }`}
    >
      {/* Top row: Year & Category */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span
              className={`font-display-lg text-[28px] sm:text-[34px] leading-none ${
                isFuture ? "text-primary italic animate-pulse" : "text-primary"
              }`}
            >
              {year}
            </span>
            <div className="h-4 w-px bg-white/15" />
            <span className="font-label-caps text-[10px] tracking-[0.2em] text-white/50 uppercase">
              {category}
            </span>
          </div>

          {isFuture && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-label-caps tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              COMING SOON
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-headline-sm text-[20px] sm:text-[22px] leading-snug text-white mb-3 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="font-body-md text-[14.5px] leading-relaxed text-white/60 mb-6">
          {description}
        </p>

        {/* Highlight pill if present */}
        {highlight && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg bg-primary/8 border border-primary/20 px-3.5 py-1.5 text-[12px] font-body-md text-primary">
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0 text-primary">
              <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{highlight}</span>
          </div>
        )}

        {/* Image / Visual Asset Slot */}
        {image && (
          <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 group-hover:border-primary/30 transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-[#080e1c] via-transparent to-transparent z-10 opacity-70" />
            <div className="absolute top-3 right-3 z-20 rounded-full bg-[#080e1c]/80 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[10px] font-label-caps text-white/70">
              FACILITY
            </div>
            <Image
              src={image}
              alt={imageAlt || title}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Image placeholder slot for future photos */}
        {!image && isFuture && (
          <div className="relative mb-6 flex h-28 w-full items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center">
            <div className="flex flex-col items-center gap-1.5 text-primary/70">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-label-caps text-[10px] tracking-wider">AWARDS & EXPANSION MEDIA SLOT</span>
            </div>
          </div>
        )}
      </div>

      {/* Recognitions & Grants section */}
      {recognitions && recognitions.length > 0 && (
        <div className="pt-4 border-t border-white/8">
          <span className="font-label-caps block text-[10px] tracking-[0.18em] text-white/35 mb-2.5 uppercase">
            RECOGNITIONS & GRANTS
          </span>
          <ul className="space-y-2">
            {recognitions.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2.5 font-body-md text-[13px] text-white/75">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 shrink-0 mt-0.5 text-primary/80"
                >
                  <path
                    d="M12 15a5 5 0 100-10 5 5 0 000 10z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8.5 14L7 22l5-2.5L17 22l-1.5-8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
