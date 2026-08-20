"use client";

import Image from "next/image";

export default function MilestoneStage2022({ data, activeProgress = 1, mouseParallax = { x: 0, y: 0 } }) {
  const { year, theme, title, tagline, subtitle, description, metrics, highlights, honours, badge, image } = data;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-6 py-4 flex flex-col justify-center min-h-[550px]">
      {/* Background Watermark Year with 3D Parallax */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 font-display-lg leading-none select-none text-white/[0.04] text-[160px] sm:text-[240px] lg:text-[320px] transition-transform duration-700"
        style={{
          transform: `translate3d(${mouseParallax.x * -0.5}px, calc(-50% + ${mouseParallax.y * -0.5}px), 0)`,
        }}
      >
        {year}
      </div>

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] items-center">
        {/* Left Column: Commercial Plant Cinematic Media Mask */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-3xl border border-primary/40 shadow-[0_0_50px_rgba(68,229,194,0.15)] group">
          {/* Subtle dark vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080f] via-transparent to-transparent z-10 opacity-70" />

          {/* Plant status badge */}
          <div className="absolute top-5 left-5 z-20 flex items-center gap-2.5 rounded-full bg-[#080e1c]/90 backdrop-blur-md border border-primary/50 px-4 py-1.5 text-[11px] font-label-caps text-primary shadow-lg">
            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span>COMMERCIAL PLANT LIVE</span>
          </div>

          <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between text-white/70 font-label-caps text-[10px] tracking-widest border-t border-white/15 pt-3">
            <span>AUTOMATED DATA-CENTRIC REARING</span>
            <span className="text-primary font-bold">MULTI-TONNE/DAY</span>
          </div>

          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[#0c182b] flex items-center justify-center text-primary font-display-lg text-[24px]">
              COMMERCIAL FACILITY 2022
            </div>
          )}
        </div>

        {/* Right Column: Plant Architecture Details */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-6 bg-primary" />
            <span className="font-label-caps text-[11px] tracking-[0.24em] text-primary uppercase">
              {badge} · INDUSTRIAL UP-SCALING
            </span>
          </div>

          <h2 className="font-display-lg text-[38px] sm:text-[54px] lg:text-[64px] text-white leading-[1.05] mb-4">
            {title}
          </h2>

          <div className="font-headline-sm text-[18px] sm:text-[22px] text-primary mb-6">
            {tagline}
          </div>

          <p className="font-body-lg text-[16px] sm:text-[17px] text-white/70 leading-relaxed mb-8 max-w-xl">
            {description}
          </p>

          {/* Plant Metric Chips */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4.5"
              >
                <div className="font-label-caps text-[10px] tracking-wider text-white/40 mb-1">
                  {m.label}
                </div>
                <div className="font-display-lg text-[26px] sm:text-[32px] text-white leading-none">
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Honours */}
          <div className="flex flex-wrap gap-2.5">
            {honours.map((h, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[12px] font-body-md text-primary"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                  <path d="M12 15a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8.5 14L7 22l5-2.5L17 22l-1.5-8" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
