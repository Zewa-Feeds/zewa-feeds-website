import Image from "next/image";
import Reveal from "./Reveal";

const ARTICLES = [
  {
    tag: "BIOLOGY",
    readTime: "6 min",
    title: "Microbiome health and the impact of insect chitin.",
    excerpt: "How natural prebiotics found in insects boost the immune system of ornamental species.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiYflndevKu4513c5n5GkXHFV-EvpSb6E9OSZRVKqujnzd9U7Xr_tIQy1kZHY11LNO5o8ODPGnM7Uvjja23suH7GPK-dMUN_aGIElLrm9UAkN7J-JYLp6TB2KnCjyNC91mmNoJYjrvollwE4zRkORRW9hr6aCvp7d1ohugUA--vy5EOb_Sso9ji_7HDoVXfj-my9H-K_9o2lzEmMNnv69QLJcVl_KvFqOXEv3TWYfAOUiD9gRx4hZcKB50ZWvRf8lW-gEhQVgcHy_M",
    tagColor: "text-primary border-primary/30 bg-primary/8",
  },
  {
    tag: "SUSTAINABILITY",
    readTime: "4 min",
    title: "Reducing ammonia output through high-absorption diets.",
    excerpt: "Quantifying the link between food quality and tank environment maintenance cycles.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUe08wYFIo3tYtgxi8tLeYAnY8T9Euno8TRXF4wFxp5bhBUZzEyUtyf1mUL2QK6RPU_-fTOT8tpMXxVnVxfBHE9_Tk4WQA2ucZg2nGcfiRPKexQwwQ6IZ6spCEybiPfIRhkJLgIG0r7GNOduPmfg_40jyDCPkBi_2ApzQcL2tMMd2Jc4n1BtwNjNFC_IArh_scx77EeciaX2839Gmfko-hPxmFQ0NeZbD0Y9v0aLUagj9EC5yOtmMSVSKIpEApcbu5Nfi988pET_QN",
    tagColor: "text-sky-400 border-sky-400/30 bg-sky-400/8",
  },
  {
    tag: "NUTRITION",
    readTime: "5 min",
    title: "The role of carotenoids in natural color enhancement.",
    excerpt: "Science-backed methods for achieving stage-ready vibrancy without synthetic dyes.",
    image: "/Bottles/Betta/Betta 01.png",
    tagColor: "text-orange-400 border-orange-400/30 bg-orange-400/8",
  },
];

export default function KnowledgeHub() {
  return (
    <Reveal id="knowledge" className="relative bg-[#080e1c] overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(68,229,194,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-16 pt-20 sm:pt-24 pb-20 sm:pb-28">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-primary" />
              <span className="text-[10px] font-bold text-primary tracking-[0.28em] font-[Montserrat] uppercase">Knowledge Hub</span>
            </div>
            <h2 className="font-[Playfair_Display] text-[32px] sm:text-[44px] text-white leading-tight">
              Science you can <span className="text-primary italic">feed on.</span>
            </h2>
          </div>
          <a
            href="/blog"
            className="group shrink-0 flex items-center gap-2.5 px-5 py-2.5 border border-white/12 rounded-full text-[11px] font-bold text-white/40 tracking-[0.12em] uppercase font-[Montserrat] hover:border-primary/50 hover:text-primary transition-all duration-300"
          >
            All Articles
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* 3-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {ARTICLES.map((article, i) => (
            <a
              key={`hub-${i}`}
              href="/blog"
              className="group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer"
              style={{ background: "linear-gradient(160deg, #0d1726 0%, #0a1219 100%)" }}
            >
              {/* 16:9 thumbnail */}
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(10,18,25,0.75) 100%)" }} />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-2.5">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[0.18em] font-[Montserrat] border ${article.tagColor}`}>
                    {article.tag}
                  </span>
                  <span className="text-[10px] text-white/20 font-[Montserrat]">{article.readTime} read</span>
                </div>

                <h3 className="font-[Playfair_Display] text-[18px] text-white leading-snug group-hover:text-primary transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="text-[12px] text-white/35 font-[Montserrat] leading-relaxed line-clamp-2 flex-1">
                  {article.excerpt}
                </p>

                <div className="flex items-center gap-1.5 pt-3 border-t border-white/5 text-[10px] font-bold text-primary tracking-widest uppercase font-[Montserrat]">
                  Read Article
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Hover bottom line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl"
                style={{ background: "linear-gradient(to right, rgba(68,229,194,0.7), transparent)" }} />
            </a>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="flex flex-col items-center gap-1 mt-12" style={{ animation: "scrollBounce 2s ease-in-out infinite" }}>
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
