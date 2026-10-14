import Reveal from "./Reveal";
/** Copy and figures: CMS → Website → Homepage → Clinical proof. */
export default function ClinicalProof({ proof }) {
  if (!proof?.stats?.length) return null;
  return (
    <Reveal as="section" className="bg-[#080e1c]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 pt-8 pb-16 sm:py-28">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-primary" />
              <span className="font-label-caps text-label-caps text-primary tracking-[0.18em]">
                {proof.eyebrow}
              </span>
            </div>
            <h2 className="font-display-lg text-[28px] sm:text-[36px] text-white leading-tight">
              {proof.title}
            </h2>
          </div>
          <p className="font-body-md text-[14px] text-white/40 max-w-xs leading-relaxed">
            {proof.intro}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {proof.stats.map((stat, i) => (
            <div
              key={i}
              className={`p-7 sm:p-8 flex flex-col justify-center border transition-shadow duration-300 hover:shadow-lg ${
                i === 0
                  ? "bg-primary border-primary"
                  : "bg-white/5 border-white/8 hover:border-primary/40"
              }`}
            >
              <div>
                <div
                  className={`text-[52px] sm:text-[60px] font-display-lg leading-none mb-2 ${
                    i === 0 ? "text-on-primary" : "text-primary"
                  }`}
                >
                  {stat.value}
                </div>
                <div
                  className={`font-body-md text-[13px] leading-snug ${
                    i === 0 ? "text-on-primary/80" : "text-white/40"
                  }`}
                >
                  {stat.caption}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-8 font-body-md text-[12px] text-white/25 text-center tracking-wide">
          {/*
            Attributed to the institutes rather than an unnamed "leading premium
            brand": that comparison cannot be verified by a reader, and the
            trials it refers to are not published.
          */}
          {proof.footnote}
        </p>
      </div>
    </Reveal>
  );
}
