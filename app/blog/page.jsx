import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ARTICLES = [
  {
    tag: "BIOLOGY",
    readTime: "6 min read",
    title: "Microbiome health and the impact of insect chitin.",
    excerpt: "How natural prebiotics found in insects boost the immune system of ornamental species — and why chitin outperforms synthetic gut supplements at a molecular level.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiYflndevKu4513c5n5GkXHFV-EvpSb6E9OSZRVKqujnzd9U7Xr_tIQy1kZHY11LNO5o8ODPGnM7Uvjja23suH7GPK-dMUN_aGIElLrm9UAkN7J-JYLp6TB2KnCjyNC91mmNoJYjrvollwE4zRkORRW9hr6aCvp7d1ohugUA--vy5EOb_Sso9ji_7HDoVXfj-my9H-K_9o2lzEmMNnv69QLJcVl_KvFqOXEv3TWYfAOUiD9gRx4hZcKB50ZWvRf8lW-gEhQVgcHy_M",
    alt: "Laboratory microscope with teal lighting",
    stat: "88%",
    statLabel: "digestibility",
    tagColor: "text-primary border-primary/30 bg-primary/8",
    accentColor: "rgba(68,229,194,0.18)",
    featured: true,
  },
  {
    tag: "SUSTAINABILITY",
    readTime: "4 min read",
    title: "Reducing ammonia output through high-absorption diets.",
    excerpt: "Quantifying the link between food quality and tank environment maintenance cycles. Less waste means healthier water and fewer water changes.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUe08wYFIo3tYtgxi8tLeYAnY8T9Euno8TRXF4wFxp5bhBUZzEyUtyf1mUL2QK6RPU_-fTOT8tpMXxVnVxfBHE9_Tk4WQA2ucZg2nGcfiRPKexQwwQ6IZ6spCEybiPfIRhkJLgIG0r7GNOduPmfg_40jyDCPkBi_2ApzQcL2tMMd2Jc4n1BtwNjNFC_IArh_scx77EeciaX2839Gmfko-hPxmFQ0NeZbD0Y9v0aLUagj9EC5yOtmMSVSKIpEApcbu5Nfi988pET_QN",
    alt: "Water ripples in deep blue and teal tones",
    stat: "40%",
    statLabel: "less ammonia",
    tagColor: "text-sky-400 border-sky-400/30 bg-sky-400/8",
    accentColor: "rgba(56,189,248,0.15)",
    featured: false,
  },
  {
    tag: "NUTRITION",
    readTime: "5 min read",
    title: "The role of carotenoids in natural color enhancement.",
    excerpt: "Science-backed methods for achieving stage-ready vibrancy without synthetic dyes. Natural pigments metabolised at 3× the efficiency of astaxanthin.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSgIye9Yh0nQgRwf4QaNSGRsnvb-RcyO_FqFLVh8phEUsmplOMky5xWS9_gZlgKpDGxiRrTWtApT7JsYtlUISTVY3e0DPLJsZ4hd3N4whAcOzatvlS2EwABa7gWtsFeTpOPj9VDhmrH1PeQT9qFLDWkLaRTkSrf8-O_OuNJwFte-dpNkHAalHmqofooAV_NZgwCdJBfloB0qgmF1MAtmpJ09uDa2vICxBUfJREejpfA7av-tD3mCe0OPgdEjKlKnnCdN3o7POwCInL",
    alt: "Exotic fish scales reflecting teal and orange",
    stat: "3×",
    statLabel: "richer pigment",
    tagColor: "text-orange-400 border-orange-400/30 bg-orange-400/8",
    accentColor: "rgba(251,146,60,0.15)",
    featured: false,
  },
];

const TOPICS = ["All", "Biology", "Nutrition", "Sustainability", "Hatchery", "Species Guide"];

export default function BlogPage() {
  const featured = ARTICLES[0];
  const rest = ARTICLES.slice(1);

  return (
    <>
      <Header />
      <main className="bg-[#06080f] text-[#dde2f6] min-h-screen">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(68,229,194,0.06) 0%, transparent 70%), linear-gradient(180deg, #06080f 0%, #0b1220 100%)" }} />

          <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-14 sm:pb-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-5 h-px bg-primary" />
                  <span className="text-[10px] font-bold text-primary tracking-[0.25em] font-[Montserrat] uppercase">Knowledge Hub</span>
                </div>
                <h1 className="font-[Playfair_Display] text-[44px] sm:text-[64px] text-white leading-[1.0] mb-5">
                  Science you can<br />
                  <span className="text-primary italic">feed on.</span>
                </h1>
                <p className="text-[15px] text-white/45 font-[Montserrat] leading-relaxed max-w-lg">
                  Lab-verified insights on insect protein, fish biology, and aquatic nutrition — straight from the Zewa research team.
                </p>
              </div>

              {/* Topic filter pills */}
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {TOPICS.map((t, i) => (
                  <span
                    key={`topic-${i}`}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.08em] uppercase font-[Montserrat] cursor-pointer transition-all duration-200 ${
                      i === 0
                        ? "bg-primary text-[#00382d]"
                        : "border border-white/10 text-white/35 hover:border-primary/40 hover:text-primary/70"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.3) 50%, transparent)" }} />
        </section>

        {/* ── Articles ──────────────────────────────────────────────── */}
        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">

          {/* Featured — large horizontal card */}
          <a
            href="#"
            className="group relative flex flex-col sm:flex-row overflow-hidden rounded-3xl mb-6 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #0d1a2e 0%, #091a18 100%)" }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(ellipse 60% 80% at 30% 50%, ${featured.accentColor}, transparent)` }} />

            {/* Image */}
            <div className="relative w-full sm:w-[48%] overflow-hidden shrink-0" style={{ aspectRatio: "16/9" }}>
              <Image
                src={featured.image}
                alt={featured.alt}
                fill
                sizes="(max-width: 640px) 100vw, 48vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to right, transparent 60%, rgba(9,26,24,0.8) 100%)" }} />
              {/* Floating stat */}
              <div className="absolute bottom-5 left-6">
                <span className="font-[Playfair_Display] text-[48px] text-primary leading-none drop-shadow-lg">{featured.stat}</span>
                <p className="text-[11px] text-white/55 font-[Montserrat] tracking-wide">{featured.statLabel}</p>
              </div>
            </div>

            {/* Content */}
            <div className="relative flex flex-col justify-center p-8 sm:p-12 gap-5 flex-1">
              <div className="flex items-center gap-3">
                <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[0.18em] font-[Montserrat] border ${featured.tagColor}`}>
                  {featured.tag}
                </span>
                <span className="text-[10px] text-white/25 font-[Montserrat]">{featured.readTime}</span>
                <span className="text-[10px] text-white/15 font-[Montserrat]">· Featured</span>
              </div>
              <h2 className="font-[Playfair_Display] text-[26px] sm:text-[34px] text-white leading-snug group-hover:text-primary transition-colors duration-300">
                {featured.title}
              </h2>
              <p className="text-[14px] text-white/40 font-[Montserrat] leading-relaxed max-w-md">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-2 text-[11px] font-bold text-primary tracking-widest uppercase font-[Montserrat] hover:gap-3 transition-all duration-200">
                Read Article
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
              style={{ background: "linear-gradient(to right, rgba(68,229,194,0.7), transparent)" }} />
          </a>

          {/* Rest — 2 col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {rest.map((article, i) => (
              <a
                key={`blog-card-${i}`}
                href="#"
                className="group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer"
                style={{ background: "linear-gradient(160deg, #0d1726 0%, #0a1219 100%)" }}
              >
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${article.accentColor}, transparent)` }} />

                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={article.image}
                    alt={article.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(10,18,25,0.75) 100%)" }} />
                  <div className="absolute bottom-4 right-4">
                    <span className="font-[Playfair_Display] text-[32px] text-primary leading-none drop-shadow-lg">{article.stat}</span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-6 gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[0.18em] font-[Montserrat] border ${article.tagColor}`}>
                      {article.tag}
                    </span>
                    <span className="text-[10px] text-white/25 font-[Montserrat]">{article.readTime}</span>
                  </div>
                  <h3 className="font-[Playfair_Display] text-[20px] text-white leading-snug group-hover:text-primary transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-[13px] text-white/35 font-[Montserrat] leading-relaxed flex-1 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 pt-3 border-t border-white/5 text-[10px] font-bold text-primary tracking-widest uppercase font-[Montserrat]">
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

          {/* Coming soon strip */}
          <div className="rounded-2xl border border-white/5 bg-white/2 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <p className="text-[14px] font-semibold text-white/50 font-[Montserrat] mb-1">More articles on the way</p>
              <p className="text-[12px] text-white/25 font-[Montserrat]">Species guides, hatchery protocols, feeding schedules — all coming soon.</p>
            </div>
            <a
              href="https://www.instagram.com/zewa_feeds/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2.5 px-5 py-2.5 border border-primary/30 rounded-full text-[11px] font-bold text-primary tracking-[0.12em] uppercase font-[Montserrat] hover:bg-primary/10 transition-all duration-200"
            >
              Follow on Instagram
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Bottom trust strip */}
          <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/18 font-[Montserrat] tracking-wide text-center sm:text-left">
              Every article is reviewed against NABL lab data · Zewa Ecosystems Pvt Ltd
            </p>
            <div className="flex items-center gap-5">
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
