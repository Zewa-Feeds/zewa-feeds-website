"use client";

import Image from "next/image";

export default function MilestoneCardCinematic({ item, isActive = true, isVertical = true }) {
  const {
    year,
    theme,
    subtitle,
    category,
    title,
    description,
    highlights,
    recognitions,
    metrics,
    products,
    image,
    imageAlt,
    isFuture,
  } = item;

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border p-7 sm:p-10 transition-all duration-500 ${
        isActive
          ? isFuture
            ? "bg-gradient-to-br from-[#0a182b] via-[#091f24] to-[#0c2b29] border-primary shadow-[0_0_50px_rgba(68,229,194,0.25)] scale-[1.02]"
            : "bg-[#0b1424] border-primary/50 shadow-[0_10px_40px_rgba(8,14,28,0.8)] scale-[1.01]"
          : "bg-white/[0.02] border-white/8 opacity-60 hover:opacity-100 hover:border-primary/30"
      }`}
    >
      {/* ── GIANT BACKGROUND YEAR WATERMARK ───────────────────────── */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-4 -top-6 sm:-right-8 sm:-top-10 font-display-lg leading-none select-none transition-all duration-700 ${
          isActive
            ? isFuture
              ? "text-primary/15 scale-105"
              : "text-white/10 scale-100"
            : "text-white/4 scale-95"
        }`}
        style={{ fontSize: "clamp(100px, 16vw, 220px)" }}
      >
        {year}
      </div>

      {/* Ambient glowing radial light */}
      {isActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[80px]"
        />
      )}

      {/* Card Content Container */}
      <div className="relative z-10">
        {/* Eyebrow Header: Year & Theme Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span
              className={`font-display-lg text-[32px] sm:text-[42px] leading-none ${
                isFuture ? "text-primary italic" : "text-primary"
              }`}
            >
              {year}
            </span>
            <div className="h-5 w-px bg-white/20" />
            <div>
              <span className="font-label-caps block text-[10px] tracking-[0.22em] text-primary uppercase">
                {category}
              </span>
              <span className="font-headline-sm block text-[12px] text-white/50">
                {theme}
              </span>
            </div>
          </div>

          {isFuture && (
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/15 px-3.5 py-1.5 text-[10px] font-label-caps tracking-widest text-primary shadow-[0_0_15px_rgba(68,229,194,0.3)]">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              FUTURE BEACON
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display-lg text-[22px] sm:text-[28px] leading-tight text-white mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Subtitle / Chapter intro */}
        <p className="font-label-caps text-[11px] tracking-[0.16em] text-primary/80 mb-4 uppercase">
          {subtitle}
        </p>

        {/* Description Narrative */}
        <p className="font-body-md text-[15px] leading-relaxed text-white/65 mb-8 max-w-xl">
          {description}
        </p>

        {/* ── YEAR-SPECIFIC BESPOKE COMPOSITIONS ────────────────────── */}

        {/* 2022: Commercial Plant Image Reveal */}
        {image && (
          <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-primary/30 bg-white/5 shadow-2xl group-hover:border-primary transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-t from-[#080e1c] via-transparent to-transparent z-10 opacity-60" />
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-[#080e1c]/90 border border-primary/40 px-3.5 py-1 text-[10px] font-label-caps text-primary shadow-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              FACILITY SHOWCASE
            </div>
            <Image
              src={image}
              alt={imageAlt || title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}

        {/* 2023: Scientific R&D Lab Metrics Split Grid */}
        {year === "2023" && metrics && (
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
              <div className="font-display-lg text-[36px] sm:text-[44px] leading-none text-primary mb-1">
                88%
              </div>
              <div className="font-label-caps text-[10px] tracking-wider text-white/50">
                PEPSIN DIGESTIBILITY
              </div>
              <div className="font-body-md text-[11px] text-primary/70 mt-1">
                NABL Certified Benchmark
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="font-display-lg text-[36px] sm:text-[44px] leading-none text-white mb-1">
                +15%
              </div>
              <div className="font-label-caps text-[10px] tracking-wider text-white/50">
                GROWTH ACCELERATION
              </div>
              <div className="font-body-md text-[11px] text-white/40 mt-1">
                KAU & ICAR-CIFT Field Trials
              </div>
            </div>
          </div>
        )}

        {/* 2024: Product Formulation Pill Stack */}
        {products && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <span className="font-label-caps block text-[10px] tracking-[0.2em] text-primary mb-3">
              COMMERCIAL FORMULATIONS LAUNCHED
            </span>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {products.map((prod) => (
                <div
                  key={prod.name}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-center transition-colors hover:border-primary/40"
                >
                  <div className="font-headline-sm text-[14px] text-white">{prod.name}</div>
                  <div className="font-body-md text-[11px] text-primary/80 mt-0.5">{prod.spec}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2025: Animated Network Expansion Nodes */}
        {year === "2025" && (
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-[12px] font-body-md text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span>44+ Commercial Product SKUs</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] font-body-md text-white/70">
              <span>18+ Indian States Reached</span>
            </div>
          </div>
        )}

        {/* 2026: Future Climax Particle Ring Indicator */}
        {isFuture && (
          <div className="mb-8 relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-caps block text-[10px] tracking-[0.2em] text-primary mb-1">
                  NEXT-GEN INNOVATION PIPELINE
                </span>
                <span className="font-headline-sm text-[15px] text-white">
                  AI Insect Automation &amp; Global Aqua Exports
                </span>
              </div>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <span className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            </div>
          </div>
        )}

        {/* Highlights List */}
        {highlights && (
          <ul className="mb-6 space-y-2">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5 font-body-md text-[13.5px] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Recognitions & Awards Footer */}
        {recognitions && recognitions.length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <span className="font-label-caps block text-[10px] tracking-[0.2em] text-white/40 mb-3 uppercase">
              HONOURS &amp; RECOGNITIONS
            </span>
            <div className="flex flex-wrap gap-2">
              {recognitions.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12px] font-body-md text-white/85 transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-primary">
                    <path d="M12 15a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8.5 14L7 22l5-2.5L17 22l-1.5-8" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
