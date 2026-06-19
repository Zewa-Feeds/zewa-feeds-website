import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ARTICLES = [
  {
    tag: "BIOLOGY",
    readTime: "6 min read",
    title: "Microbiome health and the impact of insect chitin.",
    excerpt: "How natural prebiotics found in insects boost the immune system of ornamental species — and why chitin outperforms synthetic gut supplements.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiYflndevKu4513c5n5GkXHFV-EvpSb6E9OSZRVKqujnzd9U7Xr_tIQy1kZHY11LNO5o8ODPGnM7Uvjja23suH7GPK-dMUN_aGIElLrm9UAkN7J-JYLp6TB2KnCjyNC91mmNoJYjrvollwE4zRkORRW9hr6aCvp7d1ohugUA--vy5EOb_Sso9ji_7HDoVXfj-my9H-K_9o2lzEmMNnv69QLJcVl_KvFqOXEv3TWYfAOUiD9gRx4hZcKB50ZWvRf8lW-gEhQVgcHy_M",
  },
  {
    tag: "SUSTAINABILITY",
    readTime: "4 min read",
    title: "Reducing ammonia output through high-absorption diets.",
    excerpt: "Quantifying the link between food quality and tank environment maintenance cycles.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUe08wYFIo3tYtgxi8tLeYAnY8T9Euno8TRXF4wFxp5bhBUZzEyUtyf1mUL2QK6RPU_-fTOT8tpMXxVnVxfBHE9_Tk4WQA2ucZg2nGcfiRPKexQwwQ6IZ6spCEybiPfIRhkJLgIG0r7GNOduPmfg_40jyDCPkBi_2ApzQcL2tMMd2Jc4n1BtwNjNFC_IArh_scx77EeciaX2839Gmfko-hPxmFQ0NeZbD0Y9v0aLUagj9EC5yOtmMSVSKIpEApcbu5Nfi988pET_QN",
  },
  {
    tag: "NUTRITION",
    readTime: "5 min read",
    title: "The role of carotenoids in natural color enhancement.",
    excerpt: "Science-backed methods for achieving stage-ready vibrancy without synthetic dyes.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSgIye9Yh0nQgRwf4QaNSGRsnvb-RcyO_FqFLVh8phEUsmplOMky5xWS9_gZlgKpDGxiRrTWtApT7JsYtlUISTVY3e0DPLJsZ4hd3N4whAcOzatvlS2EwABa7gWtsFeTpOPj9VDhmrH1PeQT9qFLDWkLaRTkSrf8-O_OuNJwFte-dpNkHAalHmqofooAV_NZgwCdJBfloB0qgmF1MAtmpJ09uDa2vICxBUfJREejpfA7av-tD3mCe0OPgdEjKlKnnCdN3o7POwCInL",
  },
];

const TAG_COLORS = {
  BIOLOGY: "text-primary border-primary/30 bg-primary/8",
  SUSTAINABILITY: "text-sky-400 border-sky-400/30 bg-sky-400/8",
  NUTRITION: "text-orange-400 border-orange-400/30 bg-orange-400/8",
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="bg-[#080e1c] text-[#dde2f6] min-h-screen">

        {/* Hero */}
        <section className="relative overflow-hidden pt-20">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(68,229,194,0.06) 0%, transparent 70%)" }} />
          <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-14 sm:pb-20">
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
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.3) 50%, transparent)" }} />
        </section>

        {/* Articles */}
        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((article, i) => (
              <article key={`blog-${i}`} className="group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer"
                style={{ background: "linear-gradient(160deg, #0d1726 0%, #0a1219 100%)" }}>
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(10,18,25,0.7) 100%)" }} />
                </div>
                <div className="flex flex-col flex-1 p-6 gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[0.18em] font-[Montserrat] border ${TAG_COLORS[article.tag]}`}>
                      {article.tag}
                    </span>
                    <span className="text-[10px] text-white/25 font-[Montserrat]">{article.readTime}</span>
                  </div>
                  <h2 className="font-[Playfair_Display] text-[20px] text-white leading-snug group-hover:text-primary transition-colors duration-300">
                    {article.title}
                  </h2>
                  <p className="text-[13px] text-white/40 font-[Montserrat] leading-relaxed flex-1">{article.excerpt}</p>
                  <div className="flex items-center gap-1.5 pt-3 border-t border-white/5 text-[10px] font-bold text-primary tracking-widest uppercase font-[Montserrat]">
                    Read Article
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl"
                  style={{ background: "linear-gradient(to right, rgba(68,229,194,0.7), transparent)" }} />
              </article>
            ))}
          </div>

          <div className="mt-20 pt-10 border-t border-white/5 text-center">
            <p className="text-[13px] text-white/20 font-[Montserrat]">More articles coming soon · Follow us on Instagram for updates</p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
