"use client";

import { useEffect, useState } from "react";

/**
 * Reading-progress bar, pinned under the header.
 *
 * Measured against the ARTICLE element rather than the whole document, so the
 * bar reaches 100% when the article ends — not after the reader has also
 * scrolled through related posts and the footer.
 */
export function ReadingProgress({ targetId, accent }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const { top, height } = el.getBoundingClientRect();
      const scrolled = -top;
      const total = height - window.innerHeight;
      if (total <= 0) return setPct(scrolled > 0 ? 100 : 0);
      setPct(Math.min(100, Math.max(0, (scrolled / total) * 100)));
    };

    // rAF-throttled: scroll fires far more often than the browser paints.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div className="fixed left-0 right-0 top-0 z-[150] h-[2px] bg-transparent" aria-hidden="true">
      <div
        className="h-full origin-left transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%`, background: accent, boxShadow: `0 0 12px ${accent}80` }}
      />
    </div>
  );
}

/**
 * Sticky table of contents (desktop only).
 *
 * Hidden below lg: a fixed side rail on a narrow screen either overlaps the
 * article or squeezes it, and the article already has clear headings to scan.
 *
 * The active item comes from IntersectionObserver rather than scroll maths, so
 * it stays correct regardless of section height.
 */
export function TableOfContents({ items, accent }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Topmost heading currently inside the band wins, so scrolling up
        // highlights the section being entered rather than the one being left.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Band across the upper third of the viewport.
      { rootMargin: "-88px 0px -68% 0px", threshold: 0 },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="mb-4 font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">
        On this page
      </p>
      <ul className="space-y-1 border-l border-white/8">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className="-ml-px block border-l py-[7px] pl-4 font-[Montserrat] text-[12.5px] leading-snug transition-colors duration-200"
                style={{
                  borderColor: isActive ? accent : "transparent",
                  color: isActive ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.32)",
                }}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
