"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SLIDE_DURATION = 5000; // ms before auto-advancing tiles 1 & 2

// ── Tile 1: WHY provocation ──────────────────────────────────────────────────
function TileWhy() {
  return (
    <div className="relative w-full h-full flex items-center">
      {/* Illustration placeholder background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#080e1c] via-[#0d1a2e] to-[#091a18]" />
      {/* Subtle teal orb */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[80%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-[10%] top-[20%] w-[30%] h-[50%] rounded-full bg-primary/8 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 py-6 sm:py-0">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-5 sm:mb-8">
            <div className="w-8 h-px bg-primary" />
            <span className="font-label-caps text-label-caps text-primary tracking-[0.2em]">
              BIOLOGICAL SUPREMACY
            </span>
          </div>

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
            <button className="bg-primary text-on-primary px-8 py-4 font-button text-button uppercase tracking-widest active:scale-95 transition-transform">
              EXPLORE THE SCIENCE
            </button>
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
      </div>
    </div>
  );
}

// ── Tile 2: Proof stats + bar chart ─────────────────────────────────────────
function AnimatedBar({ pct, color, delay }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    // Trigger after a short delay so CSS transition plays visibly
    const t = setTimeout(() => setWidth(pct), delay ?? 200);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="h-1.5 bg-surface-container-highest w-full overflow-hidden rounded-full">
      <div
        className="h-full rounded-full transition-all duration-[1200ms] ease-out"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}

function TileProof() {
  const stats = [
    { value: "88%", label: "Bio-Digestibility", caption: "Absorbed nutrient profile vs 72% soy" },
    { value: "15%", label: "Faster Growth", caption: "8-week controlled trial vs leading brand" },
    { value: "10%", label: "Less Mortality", caption: "Controlled feeding study result" },
    { value: "Rich", label: "Colour Vibrancy", caption: "Natural carotenoids, zero synthetic dyes" },
  ];

  const bars = [
    { label: "ZEWA INSECT PROTEIN", pct: 94, value: "94%", color: "#44e5c2", delay: 200 },
    { label: "FISH MEAL", pct: 78, value: "78%", color: "#bacac3", delay: 400 },
    { label: "SOY FILLER", pct: 41, value: "41%", color: "#3c4a45", delay: 600 },
  ];

  return (
    <div className="relative w-full h-full flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#080e1c] via-[#0a1520] to-[#080e1c]" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[40%] h-[60%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 py-4 sm:py-8 overflow-y-auto">
        <div className="flex items-center gap-3 mb-5 sm:mb-8">
          <div className="w-8 h-px bg-primary" />
          <span className="font-label-caps text-label-caps text-primary tracking-[0.2em]">
            CLINICAL PROOF
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-start">
          {/* Stats grid */}
          <div>
            <h2 className="font-display-lg text-[22px] sm:text-[32px] md:text-[40px] leading-tight mb-5 sm:mb-8 text-on-surface">
              The numbers that matter.
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {stats.map((s) => (
                <div key={s.label} className="bg-surface-container/60 backdrop-blur-sm p-3 sm:p-5 border border-on-surface/5">
                  <div className="text-[28px] sm:text-[40px] md:text-[48px] font-display-lg text-primary leading-none mb-1 sm:mb-2">
                    {s.value}
                  </div>
                  <div className="font-label-caps text-[9px] sm:text-label-caps text-on-surface/80 tracking-widest mb-0.5 sm:mb-1">
                    {s.label}
                  </div>
                  <div className="font-body-md text-[10px] sm:text-[12px] text-on-surface/40 leading-snug hidden sm:block">
                    {s.caption}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Animated bar chart — hidden on mobile to save space */}
          <div className="hidden sm:block bg-surface-container/40 backdrop-blur-sm p-8 border border-on-surface/5">
            <div className="flex justify-between items-end mb-8">
              <div className="font-headline-sm text-[18px] text-on-surface">Digestion Efficiency</div>
              <div className="font-label-caps text-label-caps text-on-surface/30 text-[10px]">NABL LAB DATA</div>
            </div>
            <div className="space-y-7">
              {bars.map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between mb-2">
                    <span className="font-button text-[11px] tracking-widest" style={{ color: bar.color }}>
                      {bar.label}
                    </span>
                    <span className="font-button text-button text-on-surface/70">{bar.value}</span>
                  </div>
                  <AnimatedBar pct={bar.pct} color={bar.color} delay={bar.delay} />
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-on-surface/10 grid grid-cols-2 gap-6">
              <div>
                <div className="text-[28px] font-display-lg text-primary leading-none mb-1">4.2x</div>
                <p className="text-[11px] text-on-surface/40 leading-snug">
                  More efficient amino acid conversion vs soy
                </p>
              </div>
              <div>
                <div className="text-[28px] font-display-lg text-primary leading-none mb-1">0%</div>
                <p className="text-[11px] text-on-surface/40 leading-snug">
                  Anti-nutritional factors vs common fillers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    <div className="absolute inset-0 bg-[#080e1c]">
      {/* Mobile: padded framed video with breathing room around it */}
      <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-8 md:p-0">
        <div className="relative w-full h-full overflow-hidden rounded-2xl md:rounded-none">
          <video
            ref={videoRef}
            muted
            playsInline
            poster="/videos/brand_poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/brand_video.webm" type="video/webm" />
            <source src="/videos/brand_video.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080e1c]/50 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Label */}
      <div className="absolute top-24 left-8 sm:left-12 flex items-center gap-3 z-10">
        <div className="w-8 h-px bg-primary" />
        <span className="font-label-caps text-label-caps text-primary tracking-[0.2em]">
          BRAND FILM
        </span>
      </div>
    </div>
  );
}

// ── Main Hero Slider ─────────────────────────────────────────────────────────
const TILES = ["why", "proof", "video"];

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

  return (
    <section className="relative w-full pt-20" style={{ height: "90dvh", minHeight: "620px" }}>
      {/* Slides */}
      <div
        className="absolute inset-0 overflow-hidden transition-opacity duration-[400ms]"
        style={{ opacity: animating ? 0 : 1 }}
      >
        {current === 0 && <TileWhy />}
        {current === 1 && <TileProof />}
        {current === 2 && <TileVideo onVideoEnd={handleVideoEnd} />}
      </div>

      {/* Peek gradient — bleeds into the white section below */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(248,250,249,0.55) 70%, rgba(248,250,249,0.9))" }}
      />

      {/* Left arrow */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="group absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 focus:outline-none"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:border-primary/60 group-hover:bg-primary/10 group-hover:-translate-x-0.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/60 group-hover:text-primary transition-colors duration-300">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="group absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 focus:outline-none"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:border-primary/60 group-hover:bg-primary/10 group-hover:translate-x-0.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/60 group-hover:text-primary transition-colors duration-300">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
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

      <style>{`
        @keyframes slideProgress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  );
}
