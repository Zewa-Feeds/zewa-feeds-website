import Image from "next/image";
import Reveal from "./Reveal";

const ARTICLES = [
  {
    tag: "BIOLOGY",
    readTime: "6 min read",
    title: "Microbiome health and the impact of insect chitin.",
    excerpt:
      "How natural prebiotics found in insects boost the immune system of ornamental species — and why chitin outperforms synthetic gut supplements.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiYflndevKu4513c5n5GkXHFV-EvpSb6E9OSZRVKqujnzd9U7Xr_tIQy1kZHY11LNO5o8ODPGnM7Uvjja23suH7GPK-dMUN_aGIElLrm9UAkN7J-JYLp6TB2KnCjyNC91mmNoJYjrvollwE4zRkORRW9hr6aCvp7d1ohugUA--vy5EOb_Sso9ji_7HDoVXfj-my9H-K_9o2lzEmMNnv69QLJcVl_KvFqOXEv3TWYfAOUiD9gRx4hZcKB50ZWvRf8lW-gEhQVgcHy_M",
    alt: "Laboratory microscope with teal lighting",
    accentColor: "rgba(68,229,194,0.18)",
    stat: "88%",
    statLabel: "digestibility improvement",
    href: "/blog",
    featured: true,
  },
  {
    tag: "SUSTAINABILITY",
    readTime: "4 min read",
    title: "Reducing ammonia output through high-absorption diets.",
    excerpt:
      "Quantifying the link between food quality and tank environment maintenance cycles.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUe08wYFIo3tYtgxi8tLeYAnY8T9Euno8TRXF4wFxp5bhBUZzEyUtyf1mUL2QK6RPU_-fTOT8tpMXxVnVxfBHE9_Tk4WQA2ucZg2nGcfiRPKexQwwQ6IZ6spCEybiPfIRhkJLgIG0r7GNOduPmfg_40jyDCPkBi_2ApzQcL2tMMd2Jc4n1BtwNjNFC_IArh_scx77EeciaX2839Gmfko-hPxmFQ0NeZbD0Y9v0aLUagj9EC5yOtmMSVSKIpEApcbu5Nfi988pET_QN",
    alt: "Water ripples in deep blue and teal tones",
    accentColor: "rgba(56,189,248,0.15)",
    stat: "40%",
    statLabel: "less ammonia per feed cycle",
    href: "/blog",
    featured: false,
  },
  {
    tag: "NUTRITION",
    readTime: "5 min read",
    title: "The role of carotenoids in natural color enhancement.",
    excerpt:
      "Science-backed methods for achieving stage-ready vibrancy without synthetic dyes.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSgIye9Yh0nQgRwf4QaNSGRsnvb-RcyO_FqFLVh8phEUsmplOMky5xWS9_gZlgKpDGxiRrTWtApT7JsYtlUISTVY3e0DPLJsZ4hd3N4whAcOzatvlS2EwABa7gWtsFeTpOPj9VDhmrH1PeQT9qFLDWkLaRTkSrf8-O_OuNJwFte-dpNkHAalHmqofooAV_NZgwCdJBfloB0qgmF1MAtmpJ09uDa2vICxBVfJREejpfA7av-tD3mCe0OPgdEjKlKnnCdN3o7POwCInL",
    alt: "Exotic fish scales reflecting teal and orange",
    accentColor: "rgba(251,146,60,0.15)",
    stat: "3×",
    statLabel: "richer pigment vs synthetic",
    href: "/blog",
    featured: false,
  },
];

const TAG_COLORS = {
  BIOLOGY: "text-primary border-primary/30 bg-primary/8",
  SUSTAINABILITY: "text-sky-400 border-sky-400/30 bg-sky-400/8",
  NUTRITION: "text-orange-400 border-orange-400/30 bg-orange-400/8",
};

export default function KnowledgeHub() {
  const featured = ARTICLES[0];
  const secondary = ARTICLES.slice(1);

  return (
    <Reveal id="knowledge" className="relative bg-[#080e1c] overflow-hidden">

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(68,229,194,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-16 pt-20 sm:pt-28 pb-24 sm:pb-32">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-px bg-primary" />
              <span className="text-[10px] font-bold text-primary tracking-[0.28em] font-[Montserrat] uppercase">
                Knowledge Hub
              </span>
            </div>
            <h2 className="font-[Playfair_Display] text-[36px] sm:text-[52px] text-white leading-[1.05]">
              Science you can<br />
              <span className="text-primary italic">feed on.</span>
            </h2>
          </div>

          <a
            href="/blog"
            className="group shrink-0 flex items-center gap-3 px-5 py-2.5 border border-white/12 rounded-full text-[11px] font-bold text-white/45 tracking-[0.12em] uppercase font-[Montserrat] hover:border-primary/50 hover:text-primary transition-all duration-300"
          >
            All Articles
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* ── Editorial grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-5">

          {/* Featured article — large left card */}
          <a href={featured.href} className="group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer"
            style={{ background: "linear-gradient(160deg, #0d1726 0%, #091a18 100%)" }}>

            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
              style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${featured.accentColor}, transparent)` }} />

            {/* 16:9 image */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <Image
                src={featured.image}
                alt={featured.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(9,26,24,0.85) 100%)" }} />

              {/* Floating stat */}
              <div className="absolute bottom-5 right-5 flex flex-col items-end">
                <span className="font-[Playfair_Display] text-[42px] text-primary leading-none drop-shadow-lg">{featured.stat}</span>
                <span className="text-[10px] text-white/60 font-[Montserrat] tracking-wide text-right">{featured.statLabel}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-7 sm:p-8 gap-4">
              <div className="flex items-center gap-3">
                <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[0.18em] font-[Montserrat] border ${TAG_COLORS[featured.tag]}`}>
                  {featured.tag}
                </span>
                <span className="text-[10px] text-white/25 font-[Montserrat]">{featured.readTime}</span>
              </div>

              <h3 className="font-[Playfair_Display] text-[24px] sm:text-[28px] text-white leading-snug group-hover:text-primary transition-colors duration-300">
                {featured.title}
              </h3>
              <p className="text-[13px] text-white/40 font-[Montserrat] leading-relaxed">
                {featured.excerpt}
              </p>

              <div className="flex items-center gap-2 mt-auto pt-2 text-[11px] font-bold text-primary tracking-widest uppercase font-[Montserrat]">
                Read Article
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Bottom teal line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl"
              style={{ background: "linear-gradient(to right, rgba(68,229,194,0.7), transparent)" }} />
          </a>

          {/* Secondary articles — stacked right column */}
          <div className="flex flex-col gap-5">
            {secondary.map((article) => (
              <a
                key={article.title}
                href={article.href}
                className="group relative flex flex-col sm:flex-row lg:flex-col overflow-hidden rounded-2xl cursor-pointer flex-1"
                style={{ background: "linear-gradient(160deg, #0d1726 0%, #0a1219 100%)" }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${article.accentColor}, transparent)` }} />

                {/* Image — 16:9 */}
                <div className="relative w-full sm:w-[45%] lg:w-full overflow-hidden shrink-0" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={article.image}
                    alt={article.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 35vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(10,18,25,0.7) 100%)" }} />

                  {/* Floating stat */}
                  <div className="absolute bottom-3 right-4">
                    <span className="font-[Playfair_Display] text-[26px] text-primary leading-none drop-shadow-lg">{article.stat}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col p-5 sm:p-6 gap-2.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[0.18em] font-[Montserrat] border ${TAG_COLORS[article.tag]}`}>
                      {article.tag}
                    </span>
                    <span className="text-[10px] text-white/25 font-[Montserrat]">{article.readTime}</span>
                  </div>

                  <h3 className="font-[Playfair_Display] text-[18px] sm:text-[20px] text-white leading-snug group-hover:text-primary transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-[12px] text-white/35 font-[Montserrat] leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-1.5 mt-auto pt-2 text-[10px] font-bold text-primary tracking-widest uppercase font-[Montserrat]">
                    Read Article
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl"
                  style={{ background: `linear-gradient(to right, ${article.accentColor.replace("0.15", "0.8")}, transparent)` }} />
              </a>
            ))}
          </div>
        </div>

        {/* ── Bottom strip ───────────────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-[12px] text-white/20 font-[Montserrat] tracking-wide text-center sm:text-left">
            Science-first content — every article is reviewed against NABL lab data
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

        {/* Scroll cue */}
        <div className="flex flex-col items-center gap-1 mt-10 sm:mt-12" style={{ animation: "scrollBounce 2s ease-in-out infinite" }}>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-white/20">
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-primary/35">
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50%       { transform: translateY(4px); opacity: 0.5; }
        }
      `}</style>
    </Reveal>
  );
}
