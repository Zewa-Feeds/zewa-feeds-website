"use client";

import { useEffect, useRef, useState } from "react";

const FADE_AFTER_MS = 3000;   // start fade
const HIDE_AFTER_MS = 5000;   // fully invisible (2s after fade starts)

export default function Hero() {
  const [fading, setFading] = useState(false);
  const sectionRef = useRef(null);
  const fadeTimer = useRef(null);
  const hideTimer = useRef(null);
  const inHero = useRef(true);

  // Clear any pending timers
  const clearTimers = () => {
    clearTimeout(fadeTimer.current);
    clearTimeout(hideTimer.current);
  };

  // (Re)start the inactivity countdown — called whenever user enters the hero
  const startCountdown = () => {
    clearTimers();
    setFading(false);
    fadeTimer.current = setTimeout(() => setFading(true), FADE_AFTER_MS);
    hideTimer.current = setTimeout(() => {
      // noop — fading handles visibility via opacity + pointerEvents
    }, HIDE_AFTER_MS);
  };

  useEffect(() => {
    // Watch whether the hero is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          inHero.current = true;
          startCountdown();          // restart countdown every time user comes back
        } else {
          inHero.current = false;
          clearTimers();
          setFading(false);          // restore text when hero is out of view
        }
      },
      { threshold: 0.4 }            // hero must be mostly visible
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    // Any activity (mouse / touch / scroll) inside the hero resets the timer
    const resetOnActivity = () => {
      if (inHero.current) startCountdown();
    };

    window.addEventListener("mousemove", resetOnActivity, { passive: true });
    window.addEventListener("touchstart", resetOnActivity, { passive: true });
    window.addEventListener("keydown", resetOnActivity);

    startCountdown(); // kick off on first mount

    return () => {
      clearTimers();
      observer.disconnect();
      window.removeEventListener("mousemove", resetOnActivity);
      window.removeEventListener("touchstart", resetOnActivity);
      window.removeEventListener("keydown", resetOnActivity);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Full-bleed video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/videos/brand_poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* WebM served first — 29% smaller, used by Chrome/Firefox */}
        <source src="/videos/brand_video.webm" type="video/webm" />
        <source src="/videos/brand_video.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlays — fade with text */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#080e1c]/90 via-[#080e1c]/55 to-[#080e1c]/10 pointer-events-none transition-opacity duration-[2000ms]"
        style={{ opacity: fading ? 0 : 1 }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#080e1c]/60 via-transparent to-transparent pointer-events-none transition-opacity duration-[2000ms]"
        style={{ opacity: fading ? 0 : 1 }}
      />

      {/* Content */}
      <div
        className="relative z-10 min-h-screen pt-20 flex items-center transition-opacity duration-[2000ms]"
        style={{
          opacity: fading ? 0 : 1,
          pointerEvents: fading ? "none" : "auto",
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-8 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-primary" />
              <span className="font-label-caps text-label-caps text-primary tracking-[0.2em]">
                BIOLOGICAL SUPREMACY
              </span>
            </div>

            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-[1.08] text-on-surface">
              Your fish is built to{" "}
              <span className="text-primary italic">digest insects.</span>
              <br />
              Most fish food feeds it soy.
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface/70 mb-12 max-w-lg leading-relaxed">
              Scientific nutrition optimised for aquatic vitality — bridging
              biological evolution and premium performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <button className="bg-primary text-on-primary px-8 py-4 font-button text-button uppercase tracking-widest active:scale-95 transition-transform">
                EXPLORE THE SCIENCE
              </button>
              <a
                href="#"
                className="group flex items-center gap-3 font-button text-button text-on-surface/60 hover:text-primary transition-colors duration-300"
              >
                <span className="w-10 h-10 rounded-full border border-on-surface/20 group-hover:border-primary flex items-center justify-center transition-colors duration-300">
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                </span>
                WATCH FILM
              </a>
            </div>

            <div className="flex gap-8 mt-16 pt-8 border-t border-on-surface/10">
              {[
                { value: "88%", label: "Bio-digestibility" },
                { value: "15%", label: "Faster growth" },
                { value: "10%", label: "Less mortality" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display-lg text-[28px] text-primary leading-none mb-1">
                    {stat.value}
                  </div>
                  <div className="font-label-caps text-label-caps text-on-surface/50 tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-opacity duration-[2000ms]"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <span className="font-label-caps text-label-caps text-on-surface/30 tracking-[0.2em]">SCROLL</span>
        <div className="w-px h-8 bg-on-surface/20 animate-pulse" />
      </div>
    </section>
  );
}
