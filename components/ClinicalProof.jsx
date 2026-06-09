import Reveal from "./Reveal";
import { proofStats } from "@/lib/content";

export default function ClinicalProof() {
  return (
    <Reveal as="section" className="bg-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-primary" />
              <span className="font-label-caps text-label-caps text-primary tracking-[0.18em]">
                NABL VERIFIED DATA
              </span>
            </div>
            <h2 className="font-display-lg text-[28px] sm:text-[36px] text-gray-900 leading-tight">
              Science doesn't lie. The numbers do.
            </h2>
          </div>
          <p className="font-body-md text-[14px] text-gray-500 max-w-xs leading-relaxed">
            Every claim backed by independent lab testing and controlled feeding trials.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {proofStats.map((stat, i) => (
            <div
              key={stat.label}
              className={`p-7 sm:p-8 flex flex-col justify-between border transition-shadow duration-300 hover:shadow-lg ${
                i === 0
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-100 hover:border-primary/30"
              }`}
            >
              <span
                className={`font-label-caps text-label-caps tracking-widest uppercase ${
                  i === 0 ? "text-on-primary/70" : "text-gray-400"
                }`}
              >
                {stat.label}
              </span>
              <div className="mt-8">
                <div
                  className={`text-[52px] sm:text-[60px] font-display-lg leading-none mb-2 ${
                    i === 0 ? "text-on-primary" : "text-primary"
                  }`}
                >
                  {stat.value}
                </div>
                <div
                  className={`font-body-md text-[13px] leading-snug ${
                    i === 0 ? "text-on-primary/80" : "text-gray-500"
                  }`}
                >
                  {stat.caption}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-8 font-body-md text-[12px] text-gray-400 text-center tracking-wide">
          Results from 8-week controlled feeding trial vs leading premium brand. NABL lab certified.
        </p>
      </div>
    </Reveal>
  );
}
