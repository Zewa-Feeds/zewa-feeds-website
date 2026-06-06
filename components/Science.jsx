import Reveal from "./Reveal";

export default function Science() {
  return (
    <Reveal
      id="science"
      className="py-section-padding px-margin-mobile md:px-gutter max-w-container-max mx-auto border-t border-surface-variant/10"
    >
      <div className="flex flex-col md:flex-row gap-gutter items-start">
        <div className="w-full md:w-5/12">
          <span className="font-label-caps text-label-caps text-primary mb-6 block">
            RESEARCH &amp; DEVELOPMENT
          </span>
          <h2 className="font-display-lg text-headline-md md:text-[48px] leading-tight mb-8">
            The Bio-Availability of Insects.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 italic">
            &ldquo;Nature does not make mistakes. For millions of years, aquatic
            species have relied on insect protein as their primary amino acid
            source.&rdquo;
          </p>
          <p className="font-body-md text-on-surface-variant mb-10 leading-relaxed">
            Soy and corn-based fillers create metabolic stress and waste. Our BSF
            (Black Soldier Fly) larvae protein matches the ancestral diet,
            ensuring near-perfect absorption rates and drastically reducing tank
            pollution.
          </p>
          <button className="border-b border-primary text-primary font-button text-button pb-1 hover:text-on-surface hover:border-on-surface transition-all">
            READ THE WHITE PAPER
          </button>
        </div>
        <div className="w-full md:w-7/12 bg-surface-container p-12 mt-12 md:mt-0">
          <div className="flex justify-between items-end mb-12">
            <div className="font-headline-sm text-headline-sm">
              Digestion Velocity
            </div>
            <div className="font-label-caps text-label-caps text-on-surface-variant">
              COMPARATIVE LAB DATA
            </div>
          </div>
          <div className="space-y-12">
            <div>
              <div className="flex justify-between mb-3">
                <span className="font-button text-button text-primary">
                  ZEWA INSECT PROTEIN
                </span>
                <span className="font-button text-button">94% EFFICIENCY</span>
              </div>
              <div className="h-1 bg-surface-container-highest w-full overflow-hidden">
                <div className="h-full bg-primary w-[94%] transition-all duration-1000" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-3">
                <span className="font-button text-button text-on-surface-variant">
                  TRADITIONAL SOY FILLER
                </span>
                <span className="font-button text-button">41% EFFICIENCY</span>
              </div>
              <div className="h-1 bg-surface-container-highest w-full overflow-hidden">
                <div className="h-full bg-on-surface-variant w-[41%]" />
              </div>
            </div>
            <div className="pt-8 border-t border-surface-variant/20 grid grid-cols-2 gap-8">
              <div>
                <div className="text-headline-sm font-headline-sm text-primary">
                  4.2x
                </div>
                <p className="text-xs text-on-surface-variant mt-2">
                  More efficient amino acid chain conversion vs soy alternatives.
                </p>
              </div>
              <div>
                <div className="text-headline-sm font-headline-sm text-primary">
                  0%
                </div>
                <p className="text-xs text-on-surface-variant mt-2">
                  Anti-nutritional factors (ANFs) found in common agricultural
                  fillers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
