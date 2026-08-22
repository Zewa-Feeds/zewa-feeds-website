"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

const SLIDE_DURATION = 5000; // ms before auto-advancing tiles 1 & 2

// ── Tile 1: WHY provocation ──────────────────────────────────────────────────
function TileWhy() {
  return (
    <div className="relative w-full md:h-full flex items-center">
      {/* Illustration placeholder background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#080e1c] via-[#0d1a2e] to-[#091a18]" />
      {/* Subtle teal orb */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[80%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-[10%] top-[20%] w-[30%] h-[50%] rounded-full bg-primary/8 blur-[80px] pointer-events-none" />

      {/*
        Two columns from lg up.

        Everything sat in a max-w-2xl block, so on a 1440px screen the content
        was 672px wide and the right 720px — exactly half the slide — was empty.
        The copy keeps its measure; the evidence for its claim moves beside it.

        Below lg it stays one column: there is no spare width there, and the
        panel would only push the CTAs off the fold.
      */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 pt-6 pb-14 md:py-0">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
        <div className="max-w-2xl">
          <h1 className="font-display-lg text-[32px] sm:text-display-lg-mobile md:text-display-lg mb-4 sm:mb-6 leading-[1.08] text-on-surface">
            Your fish is built to{" "}
            <span className="text-primary italic">digest insects.</span>
            <br />
            Most fish food feeds it soy.
          </h1>

          <p className="font-body-lg text-[15px] sm:text-body-lg text-on-surface/70 mb-8 sm:mb-12 max-w-lg leading-relaxed">
            For millions of years, aquatic species evolved on insect protein.
            Modern fish food replaced that with cheap soy — and your fish pays
            the price.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/*
              Was a <button> with no onClick — it looked like the page's primary
              action and did nothing. #science is the R&D section further down
              the same page, which is what the label promises.
            */}
            <a
              href="#science"
              className="bg-primary text-on-primary px-8 py-4 font-button text-button uppercase tracking-widest active:scale-95 transition-transform inline-block"
            >
              EXPLORE THE SCIENCE
            </a>
            <a
              href="#products"
              className="group flex items-center gap-3 font-button text-button text-on-surface/60 hover:text-primary transition-colors duration-300"
            >
              <span className="w-10 h-10 rounded-full border border-on-surface/20 group-hover:border-primary flex items-center justify-center transition-colors duration-300">
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
              SEE THE FORMULAS
            </a>
          </div>
        </div>

          {/*
            Digestibility panel — the evidence for "built to digest insects".

            Deliberately NOT the four proof stats: slide 2 is those, and
            repeating them would make the two slides read as one. This is the
            single comparison the headline rests on, and the same figures the
            Science section charts further down the page.
          */}
          <div className="hidden lg:block">
            <div
              className="rounded-2xl border border-white/8 p-8"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="mb-7 flex items-baseline justify-between">
                <span className="font-label-caps text-[10px] tracking-[0.18em] text-white/40">
                  DIGESTION EFFICIENCY
                </span>
                <span className="font-label-caps text-[10px] tracking-[0.14em] text-white/25">
                  PEPSIN, NABL LAB
                </span>
              </div>

              <div className="space-y-7">
                {[
                  { label: "ZEWA INSECT PROTEIN", pct: 88, value: "88%", strong: true },
                  { label: "SOY MEAL", pct: 75, value: "75%", strong: false },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="mb-2.5 flex items-baseline justify-between">
                      <span
                        className={`font-button text-[11px] tracking-widest ${
                          bar.strong ? "text-primary" : "text-white/45"
                        }`}
                      >
                        {bar.label}
                      </span>
                      <span
                        className={`font-display-lg text-[20px] leading-none ${
                          bar.strong ? "text-primary" : "text-white/45"
                        }`}
                      >
                        {bar.value}
                      </span>
                    </div>
                    <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${bar.pct}%`,
                          background: bar.strong ? "#44e5c2" : "rgba(255,255,255,0.25)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-8 border-t border-white/8 pt-6 text-[12px] leading-relaxed text-white/35">
                More of every feeding absorbed as nutrition — and less of it
                leaving the fish as ammonia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tile 2: Superior Nutrition Banner ─────────────────────────────────────────
function TileBanner() {
  return (
    <div className="relative w-full h-full bg-[#080e1c] flex items-center justify-center overflow-hidden pb-10 sm:pb-14 md:pb-20">
      <picture className="relative w-full h-full flex items-center justify-center">
        <source media="(min-width: 768px)" srcSet="/zewa-hero2-desktop-1920x814-text.jpg" />
        <img
          src="/zewa-hero2-mobile-1080x1080-text.jpg"
          alt="The Ultimate Superior Nutrition For Your Fish"
          className="w-full h-full object-cover object-center md:object-contain"
        />
      </picture>
    </div>
  );
}

// ── Tile 3: Brand video ──────────────────────────────────────────────────────
function TileVideo({ onVideoEnd }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
    v.addEventListener("ended", onVideoEnd);
    return () => v.removeEventListener("ended", onVideoEnd);
  }, [onVideoEnd]);

  return (
    <div className="relative w-full h-full bg-[#080e1c] flex items-center justify-center">
      {/* Full width, flush edge-to-edge with no border frame or rounded corners */}
      <div className="relative w-full aspect-video md:aspect-auto md:absolute md:inset-0 overflow-hidden">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          poster="/videos/brand_poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/brand_video_720.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/videos/brand_video.webm" type="video/webm" />
          <source src="/videos/brand_video.mp4" type="video/mp4" />
        </video>
        {/* Soft bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080e1c]/40 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

// ── Main Hero Slider ─────────────────────────────────────────────────────────
const TILES = ["why", "banner", "video"];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  }, [animating]);

  const next = useCallback(() => {
    goTo((current + 1) % TILES.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + TILES.length) % TILES.length);
  }, [current, goTo]);

  // Auto-advance for tiles 0 and 1 (tile 2 advances on video end)
  useEffect(() => {
    clearTimeout(timerRef.current);
    if (current !== 2) {
      timerRef.current = setTimeout(next, SLIDE_DURATION);
    }
    return () => clearTimeout(timerRef.current);
  }, [current, next]);

  const handleVideoEnd = useCallback(() => {
    goTo(0); // loop back to tile 1 after video
  }, [goTo]);

  /*
   * HEIGHT IS CONTENT-DRIVEN ON MOBILE, viewport-driven from md up.
   *
   * This was a flat 90dvh with a 620px floor at every width. On a phone that is
   * ~759px, while the slides need roughly 340-570px — so the shorter ones sat in
   * about 420px of empty background, above and below the content.
   *
   * Mobile now sizes to whatever the active slide needs (with a floor so the
   * shortest slide still reads as a hero, and a cap so the tallest never exceeds
   * the viewport). The desktop treatment is unchanged: a fixed 90dvh canvas is
   * what makes the full-bleed video and the side arrows work.
   */
  return (
    <section
      className="relative w-full pt-20 max-h-[100dvh] md:h-[90dvh] md:min-h-[620px] md:max-h-none"
    >
      {/*
        Hero content area: starts below pt-20 header padding.
        Allows absolute children (arrows, pills, vignette) to align relative to the actual slide canvas.
      */}
      <div className="relative w-full h-full md:absolute md:inset-x-0 md:bottom-0 md:top-20">
        <div
          className="relative w-full h-full overflow-hidden transition-opacity duration-[400ms]"
          style={{ opacity: animating ? 0 : 1 }}
        >
          {current === 0 && <TileWhy />}
          {current === 1 && <TileBanner />}
          {current === 2 && <TileVideo onVideoEnd={handleVideoEnd} />}
        </div>

        {/* Bottom fade + teal accent line separator */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10">
          {/* Dark vignette */}
          <div className="h-16" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(8,14,28,0.25) 60%, rgba(8,14,28,0.5) 100%)" }} />
          {/* Teal accent line */}
          <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent 0%, rgba(68,229,194,0.25) 20%, rgba(68,229,194,0.5) 50%, rgba(68,229,194,0.25) 80%, transparent 100%)" }} />
        </div>

        {/* Left arrow */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="group absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 focus:outline-none"
        >
          <div className="w-8 h-8 flex items-center justify-center transition-all duration-250 group-hover:scale-110">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/35 group-hover:text-primary transition-colors duration-250">
              <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>

        {/* Right arrow */}
        <button
          onClick={next}
          aria-label="Next slide"
          className="group absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 focus:outline-none"
        >
          <div className="w-8 h-8 flex items-center justify-center transition-all duration-250 group-hover:scale-110">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/35 group-hover:text-primary transition-colors duration-250">
              <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>

        {/* Slide indicators + scroll cue — stacked in one centred column */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 sm:gap-3">
          {/* Pills */}
          <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => {
            const isActive = i === current;
            const isDone = i < current;
            const isVideo = i === 2;

            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group focus:outline-none"
              >
                <div
                  className="relative overflow-hidden transition-all duration-300"
                  style={{
                    width: isActive ? 72 : 24,
                    height: 3,
                    borderRadius: 99,
                    background: isDone
                      ? "rgba(68,229,194,0.35)"
                      : "rgba(221,226,246,0.12)",
                  }}
                >
                  {isActive && !isVideo && (
                    <span
                      key={`fill-${current}`}
                      className="absolute inset-y-0 left-0 rounded-full bg-primary"
                      style={{
                        animation: `slideProgress ${SLIDE_DURATION}ms linear forwards`,
                      }}
                    />
                  )}
                  {isActive && isVideo && (
                    <span className="absolute inset-0 rounded-full bg-primary/50" />
                  )}
                  {isDone && (
                    <span className="absolute inset-0 rounded-full bg-primary/40" />
                  )}
                </div>
              </button>
            );
          })}
          </div>

          {/* Scroll cue */}
          <div className="flex flex-col items-center gap-1" style={{ animation: "scrollBounce 2s ease-in-out infinite" }}>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-white/30">
              <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-primary/35">
              <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideProgress {
          from { width: 0% }
          to   { width: 100% }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50%       { transform: translateY(4px); opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
