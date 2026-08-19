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
      {/*
        overflow-x-clip, not overflow-hidden: the ambient glow below is wider
        than a phone viewport by design (720px, centred), so it hangs off both
        edges and would otherwise add ~165px of horizontal scroll on mobile.
        Clipping only the X axis kills that scroll without turning this into a
        vertical scroll container.
      */}
      <main className="relative min-h-dvh overflow-x-clip bg-[#06080f] pt-20">
      {/* Ambient mint wash, matching the hero and checkout backdrops. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[130px]"
      />

      <div className="relative mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16 lg:py-20">
        {/* ---- Form column ---- */}
        <div className="mx-auto w-full max-w-[440px] lg:mx-0">
          <div className="mb-7">
            <EyebrowLabel>{eyebrow}</EyebrowLabel>
            <h1 className="mt-4 font-[Playfair_Display] text-[30px] leading-tight text-white sm:text-[36px]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2.5 font-[Montserrat] text-[13.5px] leading-relaxed text-white/45">
                {subtitle}
              </p>
            )}
          </div>

          <div className={`${PANEL} p-6 sm:p-8`}>{children}</div>

          {footer && (
            <div className="mt-6 text-center font-[Montserrat] text-[12.5px] text-white/40">
              {footer}
            </div>
          )}
        </div>

        {/* ---- Brand column (desktop only) ---- */}
        <aside className="hidden lg:flex lg:flex-col lg:justify-center">
          <div className={`${PANEL} relative overflow-hidden p-9`}>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/[0.06] blur-3xl"
            />

            <Image
              src="/logo-transparent.png"
              alt=""
              width={120}
              height={120}
              aria-hidden="true"
              className="h-14 w-auto object-contain brightness-0 invert"
            />

            <p className="relative mt-7 font-[Playfair_Display] text-[23px] leading-snug text-white">
              Nutrition you can <span className="italic text-primary">verify</span>, not just trust.
            </p>
            <p className="relative mt-3 font-[Montserrat] text-[13px] leading-relaxed text-white/40">
              An account keeps your orders, addresses and reorders in one place — so
              the next tank refill takes seconds.
            </p>

            <dl className="relative mt-9 space-y-5">
              {HIGHLIGHTS.map((h) => (
                <div key={h.stat} className="flex items-baseline gap-4">
                  <dt className="min-w-[62px] font-[Playfair_Display] text-[26px] leading-none text-primary">
                    {h.stat}
                  </dt>
                  <dd className="font-[Montserrat] text-[12px] leading-relaxed text-white/45">
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
