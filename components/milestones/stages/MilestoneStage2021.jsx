"use client";

export default function MilestoneStage2021({ data, activeProgress = 1, mouseParallax = { x: 0, y: 0 } }) {
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
        {/* Left Column: Origin Narrative */}
        <div>
          {/* Eyebrow badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="font-label-caps text-[11px] tracking-[0.24em] text-primary uppercase">
              {badge} · 10.8505° N, 76.2711° E (KERALA)
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

          {/* Highlights */}
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

        {/* Right Column: Origin Bio-Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between hover:border-primary/40 transition-colors duration-300"
            >
              <div className="font-label-caps text-[10px] tracking-[0.2em] text-white/40 mb-6">
                {m.label}
              </div>
              <div className="font-display-lg text-[44px] sm:text-[56px] text-primary leading-none">
                {m.value}
              </div>
              <div className="font-body-md text-[12px] text-white/50 mt-4">
                Compared to conventional soy production
              </div>
            </div>
          ))}

          <div className="sm:col-span-2 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-6 flex items-center justify-between">
            <div>
              <span className="font-label-caps text-[10px] tracking-widest text-primary block mb-1">
                CIRCULAR BIO-ECONOMY
              </span>
              <span className="font-headline-sm text-[15px] text-white">
                Zero-Waste Municipal Upcycling Model
              </span>
            </div>
            <div className="h-10 w-10 rounded-full border border-primary flex items-center justify-center text-primary font-display-lg text-[14px]">
              01
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
