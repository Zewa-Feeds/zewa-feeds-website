import Reveal from "./Reveal";

/**
 * Research & Development — the one LIGHT section on an otherwise dark page.
 *
 * The inversion is deliberate: this is the evidence-led part of the argument,
 * and a white panel reads as a lab document rather than more marketing.
 *
 * The brand mint (#44e5c2) is a poor foreground on white — around 1.6:1, well
 * under the 4.5:1 needed for body text — so text and rules use the darker
 * #00755f instead. The mint itself is kept only for the chart bar, where it is
 * a large filled shape rather than something anyone has to read.
 */
const INK = "#0b1220"; // near-black, matches the page's dark surface
const ACCENT = "#00755f"; // accessible mint for text on white
const BAR = "#00c9a7"; // brand mint, used as fill only

export default function Science() {
  return (
    <Reveal id="science" className="bg-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* Left — copy */}
          <div className="w-full lg:w-5/12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px" style={{ backgroundColor: ACCENT }} />
              <span
                className="font-label-caps text-label-caps tracking-[0.18em]"
                style={{ color: ACCENT }}
              >
                RESEARCH &amp; DEVELOPMENT
              </span>
            </div>
            <h2
              className="font-display-lg text-[32px] sm:text-[44px] leading-tight mb-8"
              style={{ color: INK }}
            >
              The Bio-Availability<br />of Insects.
            </h2>
            <p
              className="font-body-lg text-[17px] mb-6 italic leading-relaxed border-l-2 pl-5"
              style={{ color: "rgba(11,18,32,0.62)", borderColor: ACCENT }}
            >
              &ldquo;Nature does not make mistakes. For millions of years, aquatic
              species have relied on insect protein as their primary amino acid
              source.&rdquo;
            </p>
            <p
              className="font-body-md text-[15px] mb-10 leading-relaxed"
              style={{ color: "rgba(11,18,32,0.6)" }}
            >
              Soy and corn-based fillers create metabolic stress and waste. Our BSF
              (Black Soldier Fly) larvae protein matches the ancestral diet,
              ensuring near-perfect absorption rates and drastically reducing tank
              pollution.
            </p>
            <button
              className="border-b pb-1 font-button text-button transition-colors duration-200"
              style={{ color: ACCENT, borderColor: ACCENT }}
            >
              READ THE WHITE PAPER →
            </button>
          </div>

          {/* Right — chart card, tinted so it separates from the white page */}
          <div
            className="w-full lg:w-7/12 p-8 sm:p-10 rounded-2xl border"
            style={{ backgroundColor: "#f4f7f6", borderColor: "rgba(11,18,32,0.08)" }}
          >
            <div className="flex justify-between items-end mb-10">
              <div className="font-headline-sm text-[18px]" style={{ color: INK }}>
                Digestion Efficiency
              </div>
              <div
                className="font-label-caps text-[10px] tracking-widest"
                style={{ color: "rgba(11,18,32,0.4)" }}
              >
                COMPARATIVE LAB DATA
              </div>
            </div>
            <div className="space-y-8">
              {[
                { label: "ZEWA INSECT PROTEIN", pct: 94, value: "94%", color: BAR, strong: true },
                { label: "FISH MEAL", pct: 78, value: "78%", color: "rgba(11,18,32,0.32)" },
                { label: "TRADITIONAL SOY FILLER", pct: 41, value: "41%", color: "rgba(11,18,32,0.18)" },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between mb-2.5">
                    <span
                      className="font-button text-[11px] tracking-widest"
                      style={{ color: bar.strong ? ACCENT : "rgba(11,18,32,0.55)" }}
                    >
                      {bar.label}
                    </span>
                    <span
                      className="font-button text-[11px]"
                      style={{ color: "rgba(11,18,32,0.65)" }}
                    >
                      {bar.value}
                    </span>
                  </div>
                  <div
                    className="h-[3px] w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: "rgba(11,18,32,0.08)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${bar.pct}%`, backgroundColor: bar.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-10 pt-8 border-t grid grid-cols-2 gap-8"
              style={{ borderColor: "rgba(11,18,32,0.1)" }}
            >
              <div>
                <div
                  className="text-[32px] font-display-lg leading-none mb-2"
                  style={{ color: ACCENT }}
                >
                  4.2x
                </div>
                <p className="text-[12px] leading-snug" style={{ color: "rgba(11,18,32,0.5)" }}>
                  More efficient amino acid chain conversion vs soy alternatives.
                </p>
              </div>
              <div>
                <div
                  className="text-[32px] font-display-lg leading-none mb-2"
                  style={{ color: ACCENT }}
                >
                  0%
                </div>
                <p className="text-[12px] leading-snug" style={{ color: "rgba(11,18,32,0.5)" }}>
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
