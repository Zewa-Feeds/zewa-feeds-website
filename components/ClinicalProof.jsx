import Reveal from "./Reveal";
import { proofStats } from "@/lib/content";

export default function ClinicalProof() {
  return (
    <Reveal className="py-section-padding px-margin-mobile md:px-gutter max-w-container-max mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        {proofStats.map((stat) => (
          <div
            key={stat.label}
            className="p-10 bg-surface-container border-none flex flex-col justify-between h-64"
          >
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              {stat.label}
            </span>
            <div className="space-y-2">
              <div className="text-[56px] font-display-lg text-primary leading-none">
                {stat.value}
              </div>
              <div className="font-body-md text-on-surface-variant">
                {stat.caption}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
