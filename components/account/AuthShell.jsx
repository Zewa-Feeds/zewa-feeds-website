"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EyebrowLabel, PANEL } from "./ui";

/**
 * Frame shared by every unauthenticated screen (sign in, sign up, forgot, reset).
 *
 * Two columns on desktop: the form on the left, a quiet brand panel on the right.
 * The panel is decorative and is dropped entirely below `lg` rather than stacked —
 * on a phone it would push the actual form below the fold, which is the one thing
 * a sign-in page must never do.
 *
 * Colours, type and the card treatment come from the checkout surface, so this
 * reads as the same product rather than a bolted-on auth template.
 */

/** Proof points — the same claims the storefront already makes elsewhere. */
const HIGHLIGHTS = [
  { stat: "88%", label: "Pepsin digestibility, NABL-verified" },
  { stat: "13", label: "Formulas, matched to species and life stage" },
  { stat: "0%", label: "Soy filler — insect protein only" },
];

export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <>
      <Header />
      <main className="relative min-h-dvh overflow-x-clip bg-[#06080f] pt-20">
        {/* Ambient mint washes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-primary/[0.08] blur-[140px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-1/3 h-[320px] w-[320px] rounded-full bg-primary/[0.04] blur-[110px]"
        />

        <div className="relative mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16 lg:py-20">
          {/* ---- Form column ---- */}
          <div className="mx-auto w-full max-w-[440px] lg:mx-0">
            <div className="mb-7">
              <EyebrowLabel>{eyebrow}</EyebrowLabel>
              <h1 className="mt-4 font-[Playfair_Display] text-[32px] leading-tight text-white sm:text-[38px]">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2.5 font-[Montserrat] text-[13.5px] leading-relaxed text-white/50">
                  {subtitle}
                </p>
              )}
            </div>

            <div className={`${PANEL} p-6 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(68,229,194,0.08)]`}>
              {children}
            </div>

            {footer && (
              <div className="mt-6 text-center font-[Montserrat] text-[13px] text-white/45">
                {footer}
              </div>
            )}
          </div>

          {/* ---- Brand column (desktop only) ---- */}
          <aside className="hidden lg:flex lg:flex-col lg:justify-center">
            <div className={`${PANEL} relative overflow-hidden p-10 border-[#44e5c2]/25 bg-gradient-to-b from-[#0b1424]/90 to-[#080f1d]/90 shadow-[0_24px_64px_rgba(0,0,0,0.7),0_0_35px_rgba(68,229,194,0.08)]`}>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/[0.12] blur-3xl"
              />

              <div className="flex items-center gap-3">
                <Image
                  src="/logo-transparent.png"
                  alt="Zewa Feeds"
                  width={130}
                  height={130}
                  aria-hidden="true"
                  className="h-12 w-auto object-contain brightness-0 invert"
                />
              </div>

              <p className="relative mt-7 font-[Playfair_Display] text-[24px] leading-snug text-white">
                Nutrition you can <span className="italic text-primary">verify</span>, not just trust.
              </p>
              <p className="relative mt-3 font-[Montserrat] text-[13px] leading-relaxed text-white/50">
                An account keeps your orders, addresses and reorders in one place — so
                the next tank refill takes seconds.
              </p>

              <dl className="relative mt-9 space-y-4">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.stat} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.03]">
                    <dt className="min-w-[56px] font-[Playfair_Display] text-[26px] font-semibold leading-none text-primary drop-shadow-[0_0_12px_rgba(68,229,194,0.3)]">
                      {h.stat}
                    </dt>
                    <dd className="font-[Montserrat] text-[12px] leading-relaxed text-white/60">
                      {h.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
