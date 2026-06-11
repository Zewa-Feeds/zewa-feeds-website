import Reveal from "./Reveal";

export default function Science() {
  return (
    <Reveal
      id="science"
      className="bg-[#080e1c]"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-10 sm:pb-14">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* Left — copy */}
          <div className="w-full lg:w-5/12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px bg-primary" />
              <span className="font-label-caps text-label-caps text-primary tracking-[0.18em]">
                RESEARCH &amp; DEVELOPMENT
              </span>
            </div>
            <h2 className="font-display-lg text-[32px] sm:text-[44px] leading-tight mb-8 text-white">
              The Bio-Availability<br />of Insects.
            </h2>
            <p className="font-body-lg text-[17px] text-white/50 mb-6 italic leading-relaxed border-l-2 border-primary/40 pl-5">
              "Nature does not make mistakes. For millions of years, aquatic
              species have relied on insect protein as their primary amino acid
              source."
            </p>
            <p className="font-body-md text-[15px] text-white/50 mb-10 leading-relaxed">
              Soy and corn-based fillers create metabolic stress and waste. Our BSF
              (Black Soldier Fly) larvae protein matches the ancestral diet,
              ensuring near-perfect absorption rates and drastically reducing tank
              pollution.
            </p>
            <button className="border-b border-primary text-primary font-button text-button pb-1 hover:text-white hover:border-white transition-all duration-200">
              READ THE WHITE PAPER →
            </button>
          </div>

          {/* Right — chart card */}
          <div className="w-full lg:w-7/12 bg-white/4 border border-white/8 p-8 sm:p-10">
            <div className="flex justify-between items-end mb-10">
              <div className="font-headline-sm text-[18px] text-white">Digestion Efficiency</div>
              <div className="font-label-caps text-[10px] text-white/30 tracking-widest">COMPARATIVE LAB DATA</div>
            </div>
            <div className="space-y-8">
              {[
                { label: "ZEWA INSECT PROTEIN", pct: 94, value: "94%", color: "#44e5c2" },
                { label: "FISH MEAL", pct: 78, value: "78%", color: "rgba(186,202,195,0.5)" },
                { label: "TRADITIONAL SOY FILLER", pct: 41, value: "41%", color: "rgba(186,202,195,0.25)" },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between mb-2.5">
                    <span className="font-button text-[11px] tracking-widest" style={{ color: bar.color }}>
                      {bar.label}
                    </span>
                    <span className="font-button text-[11px] text-white/60">{bar.value}</span>
                  </div>
                  <div className="h-[3px] bg-white/8 w-full overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${bar.pct}%`, backgroundColor: bar.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/8 grid grid-cols-2 gap-8">
              <div>
                <div className="text-[32px] font-display-lg text-primary leading-none mb-2">4.2x</div>
                <p className="text-[12px] text-white/40 leading-snug">
                  More efficient amino acid chain conversion vs soy alternatives.
                </p>
              </div>
              <div>
                <div className="text-[32px] font-display-lg text-primary leading-none mb-2">0%</div>
                <p className="text-[12px] text-white/40 leading-snug">
                  Anti-nutritional factors (ANFs) vs common agricultural fillers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
