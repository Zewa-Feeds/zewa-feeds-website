"use client";

export default function MilestoneStage2025({ data, activeProgress = 1, mouseParallax = { x: 0, y: 0 } }) {
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
        {/* Left Column: National Scale Narrative */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-6 bg-primary" />
            <span className="font-label-caps text-[11px] tracking-[0.24em] text-primary uppercase">
              {badge} · NATIONWIDE SCALE
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

        {/* Right Column: Hero Typographic "44+ PRODUCTS" & Geographic Network Constellation */}
        <div className="space-y-5">
          <div className="rounded-3xl border border-primary/50 bg-gradient-to-br from-[#091526] to-[#072422] p-8 shadow-[0_0_50px_rgba(68,229,194,0.2)] relative overflow-hidden text-center">
            <span className="font-label-caps text-[11px] tracking-[0.22em] text-primary block mb-2">
              EXPANDED COMMERCIAL FORMULATIONS
            </span>
            <div className="font-display-lg text-[84px] sm:text-[108px] text-primary leading-none tracking-tight my-2">
              44+
            </div>
            <div className="font-headline-sm text-[16px] text-white/90">
              Specialized Product SKUs Live
            </div>
            <p className="font-body-md text-[13px] text-white/50 mt-2 max-w-xs mx-auto">
              Serving premier hatcheries, aquaculture facilities, and retail partners across India.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
              <div className="font-display-lg text-[32px] sm:text-[40px] text-white leading-none mb-1">
                18+
              </div>
              <div className="font-label-caps text-[10px] tracking-wider text-white/50">
                INDIAN STATES REACHED
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
              <div className="font-display-lg text-[32px] sm:text-[40px] text-primary leading-none mb-1">
                SG
              </div>
              <div className="font-label-caps text-[10px] tracking-wider text-white/50">
                TEMASEK SINGAPORE COHORT
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
