"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ARTICLES, ArticleCard } from "@/app/blog/page";

function renderBlock(block, i, tagColor) {
  switch (block.type) {
    case "lead":
      return (
        <p key={i} className="font-[Playfair_Display] text-[20px] sm:text-[22px] text-white/75 leading-[1.65] mb-10">
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h2 key={i} className="font-[Playfair_Display] text-[28px] sm:text-[34px] text-white leading-snug mt-14 mb-5">
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p key={i} className="text-[16px] text-white/55 font-[Montserrat] leading-[1.85] mb-6">
          {block.text}
        </p>
      );
    case "pullquote":
      return (
        <blockquote key={i} className="relative my-12 pl-8 border-l-[3px]" style={{ borderColor: tagColor }}>
          <p className="font-[Playfair_Display] text-[22px] sm:text-[26px] italic text-white/80 leading-snug">
            {block.text}
          </p>
        </blockquote>
      );
    case "stat-block":
      return (
        <div key={i} className="my-10 grid grid-cols-3 gap-0 overflow-hidden rounded-2xl border border-white/6"
          style={{ background: "linear-gradient(135deg,#0b1828 0%,#081917 100%)" }}>
          {block.items.map((s, j) => (
            <div key={j} className={`flex flex-col px-6 py-7 ${j < block.items.length - 1 ? "border-r border-white/6" : ""}`}>
              <span className="font-[Playfair_Display] leading-none mb-2" style={{ fontSize: "clamp(28px,4vw,42px)", color: tagColor }}>{s.val}</span>
              <span className="text-[11px] text-white/30 font-[Montserrat] leading-snug">{s.label}</span>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <>
        <Header />
        <main className="bg-[#05070d] min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="font-[Playfair_Display] text-[32px] text-white/40">Article not found.</p>
          <a href="/blog" className="text-[12px] text-primary font-[Montserrat] tracking-widest uppercase hover:underline">
            ← Back to Knowledge Hub
          </a>
        </main>
        <Footer />
      </>
    );
  }

  const related = ARTICLES.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <>
      <Header />
      <main className="bg-[#05070d] text-[#dde2f6] min-h-screen">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20" style={{ minHeight: 580 }}>
          {/* Hero image */}
          <div className="absolute inset-0">
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            {/* Heavy dark overlays for legibility */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,7,13,0.62) 0%, rgba(5,7,13,0.82) 55%, rgba(5,7,13,1) 100%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(5,7,13,0.5) 0%, transparent 60%)" }} />
            {/* Tag-colour glow */}
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 50% 60% at 20% 70%, ${article.tagColor}0d, transparent 65%)` }} />
          </div>

          {/* Breadcrumb */}
          <div className="relative z-10 max-w-[860px] mx-auto px-6 sm:px-10 pt-12">
            <a href="/blog"
              className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase font-[Montserrat] text-white/30 hover:text-white/60 transition-colors duration-200 mb-10">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Knowledge Hub
            </a>
          </div>

          {/* Title block */}
          <div className="relative z-10 max-w-[860px] mx-auto px-6 sm:px-10 pb-20">
            {/* Tag + meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-7">
              <span className="text-[9px] font-bold px-3 py-1.5 rounded-full tracking-[0.2em] font-[Montserrat] border backdrop-blur-sm"
                style={{ color: article.tagColor, borderColor: `${article.tagColor}40`, background: article.tagBg }}>
                {article.tag}
              </span>
              <span className="text-[11px] text-white/30 font-[Montserrat]">{article.readTime} read</span>
              <span className="text-white/12 select-none">·</span>
              <span className="text-[11px] text-white/30 font-[Montserrat]">{article.date}</span>
            </div>

            <h1 className="font-[Playfair_Display] text-white leading-[1.05] mb-6"
              style={{ fontSize: "clamp(34px, 5.5vw, 68px)" }}>
              {article.title}
            </h1>
            <p className="text-[15px] sm:text-[17px] text-white/42 font-[Montserrat] leading-relaxed max-w-[580px]">
              {article.excerpt}
            </p>

            {/* Author + stat */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/8 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${article.tagColor}20`, border: `1px solid ${article.tagColor}30` }}>
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" style={{ color: article.tagColor }}>
                    <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M2.5 13.5c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] text-white/70 font-[Montserrat] font-semibold">{article.author}</p>
                  <p className="text-[10px] text-white/25 font-[Montserrat]">Zewa Ecosystems</p>
                </div>
              </div>

              {article.stat && (
                <>
                  <div className="h-8 w-px bg-white/8" />
                  <div className="flex items-baseline gap-2">
                    <span className="font-[Playfair_Display] text-[32px] leading-none" style={{ color: article.tagColor }}>{article.stat}</span>
                    <span className="text-[10px] text-white/30 font-[Montserrat] uppercase tracking-widest">{article.statLabel}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── ARTICLE BODY ─────────────────────────────────────────── */}
        <div className="relative">
          {/* Left accent bar */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[3px]"
            style={{ background: `linear-gradient(to bottom, ${article.tagColor}50 0%, transparent 100%)`, marginLeft: "calc((100vw - 860px) / 2 - 48px)" }} />

          <div className="max-w-[860px] mx-auto px-6 sm:px-10 py-16 sm:py-24">

            {/* Progress indicator line */}
            <div className="flex items-center gap-4 mb-14 pb-8 border-b border-white/6">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${article.tagColor}60, transparent)` }} />
              <span className="text-[10px] text-white/20 font-[Montserrat] tracking-widest uppercase shrink-0">Begin Reading</span>
            </div>

            {/* Content blocks */}
            <article>
              {article.content.map((block, i) => renderBlock(block, i, article.tagColor))}
            </article>

            {/* End divider */}
            <div className="flex items-center gap-4 mt-16 pt-10 border-t border-white/6">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${article.tagColor}40, transparent)` }} />
              <span className="text-[10px] text-white/18 font-[Montserrat] tracking-widest uppercase shrink-0">End of Article</span>
            </div>

            {/* Author card */}
            <div className="mt-10 rounded-2xl p-6 sm:p-8 flex gap-5 items-start"
              style={{ background: "linear-gradient(135deg,#0c1828 0%,#091917 100%)", border: `1px solid ${article.tagColor}18` }}>
              <div className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center"
                style={{ background: `${article.tagColor}18`, border: `1px solid ${article.tagColor}30` }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ color: article.tagColor }}>
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white font-[Montserrat] mb-1">{article.author}</p>
                <p className="text-[12px] text-white/30 font-[Montserrat] leading-relaxed">
                  Our research team cross-references every published claim against NABL-certified lab reports. All digestibility and absorption figures are independently verified.
                </p>
              </div>
            </div>

            {/* Tags row */}
            <div className="flex items-center gap-3 mt-8 flex-wrap">
              <span className="text-[10px] text-white/20 font-[Montserrat] tracking-widest uppercase">Tags</span>
              {[article.tag, "Zewa Research", "Aquatic Nutrition"].map((t) => (
                <span key={t} className="text-[10px] font-bold px-3 py-1 rounded-full font-[Montserrat] tracking-wide border border-white/8 text-white/28">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── RELATED ARTICLES ─────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="border-t border-white/5">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 py-16 sm:py-20">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-6 h-px bg-primary" />
                <span className="text-[10px] font-bold text-primary tracking-[0.28em] font-[Montserrat] uppercase">Continue Reading</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {related.map((a, i) => <ArticleCard key={i} article={a} />)}
              </div>
            </div>
          </section>
        )}

        {/* ── BACK CTA ─────────────────────────────────────────────── */}
        <div className="max-w-[860px] mx-auto px-6 sm:px-10 pb-20 flex items-center justify-between gap-4 flex-wrap">
          <a href="/blog"
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase font-[Montserrat] text-white/30 hover:text-white/60 transition-colors duration-200">
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All Articles
          </a>
          <a href="/products"
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase font-[Montserrat] transition-all duration-200 px-6 py-3 rounded-full"
            style={{ background: "#44e5c2", color: "#00382d" }}>
            Shop Products
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </main>
      <Footer />
    </>
  );
}
