import Reveal from "./Reveal";

export default function Science() {
  return (
    <Reveal
      id="science"
      className="bg-[#f8faf9]"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* Left — copy */}
          <div className="w-full lg:w-5/12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px bg-gray-400" />
              <span className="font-label-caps text-label-caps text-gray-500 tracking-[0.18em]">
                RESEARCH &amp; DEVELOPMENT
              </span>
            </div>
            <h2 className="font-display-lg text-[32px] sm:text-[44px] leading-tight mb-8 text-gray-900">
              The Bio-Availability<br />of Insects.
            </h2>
            <p className="font-body-lg text-[17px] text-gray-500 mb-6 italic leading-relaxed border-l-2 border-primary/40 pl-5">
              "Nature does not make mistakes. For millions of years, aquatic
              species have relied on insect protein as their primary amino acid
              source."
            </p>
            <p className="font-body-md text-[15px] text-gray-500 mb-10 leading-relaxed">
              Soy and corn-based fillers create metabolic stress and waste. Our BSF
              (Black Soldier Fly) larvae protein matches the ancestral diet,
              ensuring near-perfect absorption rates and drastically reducing tank
              pollution.
            </p>
            <button className="border-b border-primary text-primary font-button text-button pb-1 hover:text-gray-900 hover:border-gray-900 transition-all duration-200">
              READ THE WHITE PAPER →
            </button>
          </div>

          {/* Right — chart card */}
          <div className="w-full lg:w-7/12 bg-white border border-gray-100 shadow-sm p-8 sm:p-10">
            <div className="flex justify-between items-end mb-10">
              <div className="font-headline-sm text-[18px] text-gray-900">Digestion Efficiency</div>
              <div className="font-label-caps text-[10px] text-gray-400 tracking-widest">COMPARATIVE LAB DATA</div>
            </div>
            <div className="space-y-8">
              {[
                { label: "ZEWA INSECT PROTEIN", pct: 94, value: "94%", color: "#44e5c2", labelColor: "#1a9e83" },
                { label: "FISH MEAL", pct: 78, value: "78%", color: "#94a3b8", labelColor: "#64748b" },
                { label: "TRADITIONAL SOY FILLER", pct: 41, value: "41%", color: "#cbd5e1", labelColor: "#94a3b8" },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between mb-2.5">
                    <span className="font-button text-[11px] tracking-widest" style={{ color: bar.labelColor }}>
                      {bar.label}
                    </span>
                    <span className="font-button text-[11px] text-gray-500">{bar.value}</span>
                  </div>
                  <div className="h-[3px] bg-gray-100 w-full overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${bar.pct}%`, backgroundColor: bar.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-2 gap-8">
              <div>
                <div className="text-[32px] font-display-lg text-gray-900 leading-none mb-2">4.2x</div>
                <p className="text-[12px] text-gray-400 leading-snug">
                  More efficient amino acid chain conversion vs soy alternatives.
                </p>
              </div>
              <div>
                <div className="text-[32px] font-display-lg text-gray-900 leading-none mb-2">0%</div>
                <p className="text-[12px] text-gray-400 leading-snug">
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
