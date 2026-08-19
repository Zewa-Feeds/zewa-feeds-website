"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { ARTICLES as ALL_ARTICLES } from "@/lib/articles";

/*
 * Read from the real article source rather than a hand-kept copy.
 *
 * This list used to be duplicated here, and it drifted: it still pointed at
 * "microbiome-health-insect-chitin" after that article was re-slugged, so the
 * homepage linked to a 404. Deriving it means the two can no longer disagree.
 *
 * Ordered newest first and capped at three — this is a teaser, not the index.
 */
const ARTICLES = [...ALL_ARTICLES]
  .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1))
  .slice(0, 3);

export default function KnowledgeHub() {
  const [hoveredArticle, setHoveredArticle] = useState(null);

  return (
    <Reveal id="knowledge" className="relative overflow-hidden bg-[#06080f]">
      {/* ── Background Science Lab & Article Cover Images ─────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Default background image */}
        <Image
          src="/Banner 3.png"
          alt="Laboratory research"
          fill
          className={`object-cover object-center transition-opacity duration-500 ease-in-out ${
            hoveredArticle ? "opacity-10" : "opacity-35"
          }`}
          priority
        />

        {/* Hovered article background images */}
        {ARTICLES.map((a) => (
          <Image
            key={a.slug}
            src={a.image}
            alt={a.title}
            fill
            className={`object-cover object-center transition-all duration-700 ease-in-out ${
              hoveredArticle === a.slug ? "opacity-45 scale-105" : "opacity-0 scale-100"
            }`}
          />
        ))}

        {/* Dark vignettes for text contrast and seamless blending */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080f] via-[#06080f]/80 to-[#06080f]/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080f]/80 via-transparent to-[#06080f]" />
      </div>

      <div className="relative z-10 h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.2) 50%, transparent)" }} />

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 pt-12 sm:pt-16 pb-24 sm:pb-32">

        {/* Header row */}
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-px bg-primary" />
              <span className="text-[10px] font-bold text-primary tracking-[0.28em] font-[Montserrat] uppercase">
                Knowledge Hub
              </span>
            </div>
            <h2 className="font-[Playfair_Display] text-[32px] sm:text-[48px] text-white leading-tight">
              Science you can{" "}
              <span className="text-primary italic">feed on.</span>
            </h2>
          </div>
          <a
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-full border border-primary/25 text-primary text-[10px] font-bold tracking-[0.18em] uppercase font-[Montserrat] hover:bg-primary hover:text-[#00382d] transition-all duration-200 backdrop-blur-sm"
          >
            All Articles
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Article list */}
        <div
          className="rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-md"
          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(8,14,26,0.82)" }}
          onMouseLeave={() => setHoveredArticle(null)}
        >

          {/* Top accent line */}
          <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.35) 50%, transparent)" }} />

          {ARTICLES.map((a, i) => (
            <a
              key={a.slug}
              href={`/blog/${a.slug}`}
              onMouseEnter={() => setHoveredArticle(a.slug)}
              className="group flex items-center justify-between gap-6 px-7 py-5 transition-colors duration-200 hover:bg-white/[0.05]"
              style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : undefined }}
            >
              <div className="flex items-center gap-5 min-w-0">
                {/* Index */}
                <span className="shrink-0 font-[Playfair_Display] text-[22px] leading-none text-white/10 group-hover:text-primary/40 transition-colors duration-200 w-6 text-right">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  {/* Tag + read time */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[8px] font-bold tracking-[0.2em] font-[Montserrat] uppercase text-primary/60 group-hover:text-primary transition-colors duration-200">
                      {a.tag}
                    </span>
                    <span className="text-white/15 text-[8px]">·</span>
                    <span className="text-[10px] text-white/25 font-[Montserrat]">{a.readTime} read</span>
                  </div>
                  {/* Title */}
                  <p className="font-[Playfair_Display] text-[16px] sm:text-[18px] text-white/70 leading-snug group-hover:text-white transition-colors duration-200 line-clamp-1">
                    {a.title}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0 text-white/15 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}

          {/* Footer CTA row */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <a
              href="/blog"
              className="group flex items-center justify-between gap-4 px-7 py-4 transition-colors duration-150 hover:bg-white/[0.02]"
            >
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-[Montserrat] text-primary/50 group-hover:text-primary transition-colors duration-200">
                Browse all articles
              </span>
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </Reveal>
  );
}

