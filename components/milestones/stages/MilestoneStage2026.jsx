"use client";

export default function MilestoneStage2026({ data, activeProgress = 1, mouseParallax = { x: 0, y: 0 } }) {
  const { year, theme, title, tagline, subtitle, description, metrics, highlights, honours, badge } = data;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-6 py-4 flex flex-col justify-center min-h-[550px]">
      {/* Background Watermark Year with 3D Parallax & Future Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 font-display-lg leading-none select-none text-primary/[0.08] text-[160px] sm:text-[240px] lg:text-[320px] transition-transform duration-700"
        style={{
          transform: `translate3d(${mouseParallax.x * -0.5}px, calc(-50% + ${mouseParallax.y * -0.5}px), 0)`,
        }}
      >
        {year}
      </div>

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        {/* Left Column: Future Vision Narrative */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
            <span className="font-label-caps text-[11px] tracking-[0.24em] text-primary uppercase">
              {badge} · THE STORY CONTINUES
            </span>
          </div>

          <h2 className="font-display-lg text-[38px] sm:text-[54px] lg:text-[64px] text-white leading-[1.05] mb-4">
            {title}
          </h2>

          <div className="font-headline-sm text-[20px] sm:text-[24px] text-primary mb-6 animate-pulse">
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
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-1.5 text-[12px] font-body-md text-primary shadow-[0_0_20px_rgba(68,229,194,0.3)]"
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

        {/* Right Column: Futuristic Infinite Beacon Card */}
        <div className="relative">
          <div className="rounded-3xl border border-primary/60 bg-gradient-to-br from-[#0c1e36] via-[#091b24] to-[#0d332f] p-8 sm:p-10 shadow-[0_0_60px_rgba(68,229,194,0.25)] relative overflow-hidden text-center">
            {/* Spinning ambient ring */}
            <div className="mx-auto mb-6 relative flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display-lg text-[18px]">
                &gt;&gt;
              </div>
            </div>

            <span className="font-label-caps text-[11px] tracking-[0.24em] text-primary block mb-2">
              HORIZON 2026 &amp; BEYOND
            </span>

            <h3 className="font-display-lg text-[24px] sm:text-[28px] text-white leading-tight mb-3">
              Reinventing Pet Nutrition Globally
            </h3>

            <p className="font-body-md text-[13.5px] text-white/60 mb-6 max-w-sm mx-auto">
              Gen-3 automated insect bioreactors, international exports, and novel circular pet food formulas in active development.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-[12px] font-button text-primary uppercase tracking-widest">
              <span>UNFOLDING IN REAL TIME</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
