"use client";

export default function MilestoneStage2023({ data, activeProgress = 1, mouseParallax = { x: 0, y: 0 } }) {
  const { year, theme, title, tagline, subtitle, description, metrics, highlights, honours, badge } = data;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-6 py-4 flex flex-col justify-center min-h-[550px]">
      {/* Background Watermark Year with 3D Parallax */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-display-lg leading-none select-none text-white/[0.04] text-[160px] sm:text-[240px] lg:text-[320px] transition-transform duration-700"
        style={{
          transform: `translate3d(${mouseParallax.x * -0.5}px, calc(-50% + ${mouseParallax.y * -0.5}px), 0)`,
        }}
      >
        {year}
      </div>

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        {/* Left Column: Scientific Research Narrative */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-6 bg-primary" />
            <span className="font-label-caps text-[11px] tracking-[0.24em] text-primary uppercase">
              {badge} · KAU &amp; ICAR-CIFT TRIALS
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

          <ul className="space-y-3 mb-8">
            {highlights.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 font-body-md text-[14px] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

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

        {/* Right Column: NABL Digestibility Benchmark Laboratory Display */}
        <div className="space-y-5">
          <div className="rounded-3xl border border-primary/40 bg-[#0a1526] p-8 shadow-[0_0_40px_rgba(68,229,194,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-caps text-[10px] tracking-[0.2em] text-primary">
                PEPSIN DIGESTION BENCHMARK
              </span>
              <span className="font-label-caps text-[9px] tracking-widest text-white/40 border border-white/10 rounded-full px-2 py-0.5">
                NABL CERTIFIED
              </span>
            </div>

            <div className="font-display-lg text-[64px] sm:text-[76px] text-primary leading-none mb-2">
              88%
            </div>
            <p className="font-body-md text-[13px] text-white/60">
              Validated absorption rate — superior protein bioavailability with zero soy fillers and significantly lower ammonia discharge.
            </p>

            {/* Comparison progress bars */}
            <div className="mt-6 space-y-3 pt-6 border-t border-white/10">
              <div>
                <div className="flex justify-between text-[11px] font-label-caps text-primary mb-1">
                  <span>ZEWA INSECT PROTEIN</span>
                  <span>88%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[88%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-label-caps text-white/40 mb-1">
                  <span>STANDARD COMMERCIAL SOY MEAL</span>
                  <span>70%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-white/30 rounded-full w-[70%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <span className="font-headline-sm text-[14px] text-white block">
                  +15% Accelerated Metabolic Growth
                </span>
                <span className="font-body-md text-[11px] text-white/50">
                  Multi-generation species trials
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
