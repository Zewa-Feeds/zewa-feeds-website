"use client";

export default function MilestoneStage2024({ data, activeProgress = 1, mouseParallax = { x: 0, y: 0 } }) {
  const { year, theme, title, tagline, subtitle, description, products, highlights, honours, badge } = data;

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
        {/* Left Column: Commercial Product Formulation Architecture Stack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products?.map((prod) => (
            <div
              key={prod.name}
              className="rounded-2xl border border-white/10 bg-[#091222]/80 backdrop-blur-md p-6 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="h-2 w-8 rounded-full bg-primary/40 group-hover:bg-primary mb-4 transition-colors" />
              <h4 className="font-display-lg text-[20px] text-white mb-1 group-hover:text-primary transition-colors">
                {prod.name}
              </h4>
              <p className="font-body-md text-[13px] text-white/60">
                {prod.spec}
              </p>
            </div>
          ))}

          <div className="sm:col-span-2 rounded-2xl border border-primary/30 bg-primary/10 p-4.5 flex items-center justify-between">
            <span className="font-label-caps text-[11px] tracking-widest text-primary">
              SPECIES-CALIBRATED FLOATING &amp; SINKING PROFILES
            </span>
            <span className="font-display-lg text-[13px] text-primary">
              2024
            </span>
          </div>
        </div>

        {/* Right Column: Commercial Rollout Narrative */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-6 bg-primary" />
            <span className="font-label-caps text-[11px] tracking-[0.24em] text-primary uppercase">
              {badge} · SPECIES-SPECIFIC NUTRITION
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
      </div>
    </div>
  );
}
