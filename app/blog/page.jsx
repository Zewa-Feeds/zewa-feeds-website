"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ARTICLES = [
  {
    tag: "BIOLOGY",
    readTime: "6 min read",
    title: "Microbiome health and the impact of insect chitin.",
    excerpt:
      "How natural prebiotics found in insects boost the immune system of ornamental species — and why chitin outperforms synthetic gut supplements at a molecular level.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiYflndevKu4513c5n5GkXHFV-EvpSb6E9OSZRVKqujnzd9U7Xr_tIQy1kZHY11LNO5o8ODPGnM7Uvjja23suH7GPK-dMUN_aGIElLrm9UAkN7J-JYLp6TB2KnCjyNC91mmNoJYjrvollwE4zRkORRW9hr6aCvp7d1ohugUA--vy5EOb_Sso9ji_7HDoVXfj-my9H-K_9o2lzEmMNnv69QLJcVl_KvFqOXEv3TWYfAOUiD9gRx4hZcKB50ZWvRf8lW-gEhQVgcHy_M",
    alt: "Laboratory microscope with teal lighting",
    stat: "88%",
    statLabel: "Digestibility",
    tagColor: "text-primary border-primary/30 bg-primary/10",
    accent: "rgba(68,229,194,0.22)",
    accentLight: "rgba(68,229,194,0.08)",
  },
  {
    tag: "SUSTAINABILITY",
    readTime: "4 min read",
    title: "Reducing ammonia output through high-absorption diets.",
    excerpt:
      "Quantifying the link between food quality and tank environment maintenance cycles. Less waste means healthier water and fewer water changes.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUe08wYFIo3tYtgxi8tLeYAnY8T9Euno8TRXF4wFxp5bhBUZzEyUtyf1mUL2QK6RPU_-fTOT8tpMXxVnVxfBHE9_Tk4WQA2ucZg2nGcfiRPKexQwwQ6IZ6spCEybiPfIRhkJLgIG0r7GNOduPmfg_40jyDCPkBi_2ApzQcL2tMMd2Jc4n1BtwNjNFC_IArh_scx77EeciaX2839Gmfko-hPxmFQ0NeZbD0Y9v0aLUagj9EC5yOtmMSVSKIpEApcbu5Nfi988pET_QN",
    alt: "Water ripples in deep blue and teal tones",
    stat: "40%",
    statLabel: "Less Ammonia",
    tagColor: "text-sky-400 border-sky-400/30 bg-sky-400/10",
    accent: "rgba(56,189,248,0.22)",
    accentLight: "rgba(56,189,248,0.06)",
  },
  {
    tag: "NUTRITION",
    readTime: "5 min read",
    title: "The role of carotenoids in natural color enhancement.",
    excerpt:
      "Science-backed methods for achieving stage-ready vibrancy without synthetic dyes. Natural pigments metabolised at 3× the efficiency of astaxanthin.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSgIye9Yh0nQgRwf4QaNSGRsnvb-RcyO_FqFLVh8phEUsmplOMky5xWS9_gZlgKpDGxiRrTWtApT7JsYtlUISTVY3e0DPLJsZ4hd3N4whAcOzatvlS2EwABa7gWtsFeTpOPj9VDhmrH1PeQT9qFLDWkLaRTkSrf8-O_OuNJwFte-dpNkHAalHmqofooAV_NZgwCdJBfloB0qgmF1MAtmpJ09uDa2vICxBUfJREejpfA7av-tD3mCe0OPgdEjKlKnnCdN3o7POwCInL",
    alt: "Exotic fish scales reflecting teal and orange",
    stat: "3×",
    statLabel: "Richer Pigment",
    tagColor: "text-orange-400 border-orange-400/30 bg-orange-400/10",
    accent: "rgba(251,146,60,0.22)",
    accentLight: "rgba(251,146,60,0.06)",
  },
];

const TOPICS = ["All", "Biology", "Nutrition", "Sustainability", "Hatchery", "Species Guide"];

const STATS = [
  { val: "3", label: "Articles Published" },
  { val: "NABL", label: "Lab Verified" },
  { val: "100%", label: "Open Access" },
];

export default function BlogPage() {
  const [activeTopic, setActiveTopic] = useState("All");
  const featured = ARTICLES[0];
  const rest = ARTICLES.slice(1);

  return (
    <>
      <Header />
      <main className="bg-[#06080f] text-[#dde2f6] min-h-screen">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20">
          {/* Multi-layered bg */}
          <div className="absolute inset-0 pointer-events-none">
            <div style={{ background: "linear-gradient(180deg, #06080f 0%, #0b1523 100%)", position: "absolute", inset: 0 }} />
            <div style={{ background: "radial-gradient(ellipse 70% 80% at 70% 60%, rgba(68,229,194,0.07) 0%, transparent 65%)", position: "absolute", inset: 0 }} />
            <div style={{ background: "radial-gradient(ellipse 40% 50% at 20% 30%, rgba(56,189,248,0.04) 0%, transparent 65%)", position: "absolute", inset: 0 }} />
          </div>

          <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-20 pb-0">
            {/* Top label */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-5 h-px bg-primary" />
              <span className="text-[10px] font-bold text-primary tracking-[0.3em] font-[Montserrat] uppercase">Knowledge Hub</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-end pb-14 sm:pb-20">
              <div>
                <h1 className="font-[Playfair_Display] text-[52px] sm:text-[80px] lg:text-[96px] text-white leading-[0.95] mb-6">
                  Science<br />
                  <span className="text-primary italic">you can</span><br />
                  feed on.
                </h1>
                <p className="text-[15px] text-white/40 font-[Montserrat] leading-relaxed max-w-md">
                  Lab-verified insights on insect protein, fish biology, and aquatic nutrition — reviewed against NABL data.
                </p>
              </div>

              {/* Right: stats column */}
              <div className="flex lg:flex-col gap-8 lg:gap-6 pb-2">
                {STATS.map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <span className="font-[Playfair_Display] text-[36px] text-primary leading-none">{s.val}</span>
                    <span className="text-[10px] text-white/30 font-[Montserrat] tracking-widest uppercase">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teal separator */}
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.35) 50%, transparent)" }} />
        </section>

        {/* ── Topic filter ─────────────────────────────────────────────── */}
        <div className="sticky top-20 z-30 bg-[#06080f]/96 backdrop-blur-md border-b border-white/5">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between gap-4 py-3">
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTopic(t)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase font-[Montserrat] transition-all duration-200 ${
                    activeTopic === t
                      ? "bg-primary text-[#00382d]"
                      : "text-white/35 hover:text-white/65 hover:bg-white/5"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <span className="shrink-0 text-[11px] text-white/20 font-[Montserrat]">{ARTICLES.length} articles</span>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">

          {/* ── Featured — full bleed editorial card ── */}
          <a href="#" className="group block relative overflow-hidden rounded-3xl mb-6 cursor-pointer" style={{ minHeight: "480px" }}>

            {/* Full-bleed background image */}
            <div className="absolute inset-0">
              <Image
                src={featured.image}
                alt={featured.alt}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              {/* Dark overlay — heavier at bottom and left for text legibility */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(6,8,15,0.95) 0%, rgba(6,8,15,0.7) 45%, rgba(6,8,15,0.2) 100%)" }} />
              {/* Teal glow overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: "radial-gradient(ellipse 50% 60% at 20% 50%, rgba(68,229,194,0.12), transparent)" }} />
            </div>

            {/* Content over image */}
            <div className="relative z-10 flex flex-col justify-end h-full p-8 sm:p-12 lg:p-16" style={{ minHeight: "480px" }}>
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <span className={`text-[9px] font-bold px-3 py-1.5 rounded-full tracking-[0.2em] font-[Montserrat] border backdrop-blur-sm ${featured.tagColor}`}>
                    {featured.tag}
                  </span>
                  <span className="text-[10px] text-white/40 font-[Montserrat]">{featured.readTime}</span>
                  <span className="text-[10px] text-white/20 font-[Montserrat] px-2 py-0.5 border border-white/10 rounded-full">FEATURED</span>
                </div>

                <h2 className="font-[Playfair_Display] text-[32px] sm:text-[48px] text-white leading-tight mb-4 group-hover:text-primary transition-colors duration-500">
                  {featured.title}
                </h2>
                <p className="text-[14px] sm:text-[16px] text-white/55 font-[Montserrat] leading-relaxed mb-8 max-w-lg">
                  {featured.excerpt}
                </p>

                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-primary tracking-widest uppercase font-[Montserrat]">
                    Read Article
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="h-8 w-px bg-white/15" />
                  {/* Stat inline */}
                  <div className="flex items-baseline gap-2">
                    <span className="font-[Playfair_Display] text-[32px] text-primary leading-none">{featured.stat}</span>
                    <span className="text-[11px] text-white/35 font-[Montserrat] uppercase tracking-wide">{featured.statLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom teal sweep */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
              style={{ background: "linear-gradient(to right, rgba(68,229,194,0.9), transparent 60%)" }} />
          </a>

          {/* ── Secondary cards — asymmetric 2-col ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {rest.map((article, i) => (
              <a
                key={`card-${i}`}
                href="#"
                className="group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer"
              >
                {/* Full-bleed image section */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={article.image}
                    alt={article.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(6,8,15,0.1) 0%, rgba(6,8,15,0.5) 60%, rgba(6,8,15,0.95) 100%)" }} />

                  {/* Stat badge — top right */}
                  <div className="absolute top-4 right-4 flex flex-col items-end">
                    <span className="font-[Playfair_Display] text-[38px] text-white leading-none drop-shadow-2xl"
                      style={{ textShadow: `0 0 30px ${article.accent}` }}>
                      {article.stat}
                    </span>
                    <span className="text-[9px] text-white/50 font-[Montserrat] tracking-widest uppercase">{article.statLabel}</span>
                  </div>

                  {/* Tag pill — bottom left inside image */}
                  <div className="absolute bottom-4 left-5 flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[0.18em] font-[Montserrat] border backdrop-blur-sm ${article.tagColor}`}>
                      {article.tag}
                    </span>
                    <span className="text-[10px] text-white/35 font-[Montserrat]">{article.readTime}</span>
                  </div>
                </div>

                {/* Text area — dark bg continuing below image */}
                <div className="flex flex-col flex-1 p-6 gap-3" style={{ background: `linear-gradient(160deg, #0d1726 0%, #0a1219 100%)` }}>
                  {/* Subtle top glow matching accent */}
                  <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none opacity-40"
                    style={{ background: `linear-gradient(to bottom, ${article.accentLight}, transparent)` }} />

                  <h3 className="font-[Playfair_Display] text-[22px] text-white leading-snug group-hover:text-primary transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-[13px] text-white/38 font-[Montserrat] leading-relaxed line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/6">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary tracking-widest uppercase font-[Montserrat]">
                      Read Article
                      <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:bg-primary/10"
                      style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                      <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-white/30 group-hover:text-primary transition-colors">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: `linear-gradient(to right, ${article.accent}, transparent)` }} />
              </a>
            ))}
          </div>

          {/* ── Coming soon — full-width tease card ── */}
          <div className="relative overflow-hidden rounded-2xl px-8 sm:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ background: "linear-gradient(135deg, #0d1a2e 0%, #091a18 100%)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 50% 80% at 0% 50%, rgba(68,229,194,0.06), transparent)" }} />
            <div className="relative">
              <p className="text-[11px] font-bold text-primary/60 tracking-[0.2em] uppercase font-[Montserrat] mb-2">Coming Soon</p>
              <h3 className="font-[Playfair_Display] text-[24px] sm:text-[30px] text-white mb-2">More articles on the way.</h3>
              <p className="text-[13px] text-white/35 font-[Montserrat] max-w-sm">
                Species guides, hatchery protocols, feeding schedules — reviewed by our research team.
              </p>
            </div>
            <a
              href="https://www.instagram.com/zewa_feeds/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative shrink-0 group flex items-center gap-3 px-6 py-3 border border-primary/40 rounded-full text-[11px] font-bold text-primary tracking-[0.12em] uppercase font-[Montserrat] hover:bg-primary hover:text-[#00382d] hover:border-primary transition-all duration-300"
            >
              Follow on Instagram
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* ── Bottom strip ── */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/18 font-[Montserrat] tracking-wide text-center sm:text-left">
              Every article reviewed against NABL lab data · Zewa Ecosystems Pvt Ltd · Thrissur, Kerala
            </p>
            <div className="flex items-center gap-6">
              {[
                { label: "Biology", color: "bg-primary" },
                { label: "Sustainability", color: "bg-sky-400" },
                { label: "Nutrition", color: "bg-orange-400" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${t.color}`} />
                  <span className="text-[10px] text-white/25 font-[Montserrat]">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
