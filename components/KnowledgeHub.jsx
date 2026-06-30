import Image from "next/image";
import Reveal from "./Reveal";

const FEATURED = {
  tag: "BIOLOGY",
  tagColor: "#44e5c2",
  tagBg: "rgba(68,229,194,0.1)",
  tagBorder: "rgba(68,229,194,0.25)",
  readTime: "6 min",
  title: "Microbiome health and the impact of insect chitin.",
  excerpt:
    "Natural prebiotics found in Black Soldier Fly chitin prime the gut microbiome of ornamental fish — boosting immune response, reducing disease susceptibility, and improving feed conversion ratios by up to 22%.",
  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiYflndevKu4513c5n5GkXHFV-EvpSb6E9OSZRVKqujnzd9U7Xr_tIQy1kZHY11LNO5o8ODPGnM7Uvjja23suH7GPK-dMUN_aGIElLrm9UAkN7J-JYLp6TB2KnCjyNC91mmNoJYjrvollwE4zRkORRW9hr6aCvp7d1ohugUA--vy5EOb_Sso9ji_7HDoVXfj-my9H-K_9o2lzEmMNnv69QLJcVl_KvFqOXEv3TWYfAOUiD9gRx4hZcKB50ZWvRf8lW-gEhQVgcHy_M",
  slug: "microbiome-health-insect-chitin",
  stat: "22%",
  statLabel: "better FCR",
};

const SECONDARY = [
  {
    tag: "SUSTAINABILITY",
    tagColor: "#38bdf8",
    readTime: "4 min",
    title: "Reducing ammonia output through high-absorption diets.",
    slug: "ammonia-reduction-high-absorption-diets",
  },
  {
    tag: "NUTRITION",
    tagColor: "#fb923c",
    readTime: "5 min",
    title: "The role of carotenoids in natural colour enhancement.",
    slug: "carotenoids-natural-color-enhancement",
  },
];

export default function KnowledgeHub() {
  return (
    <Reveal id="knowledge" className="bg-[#06080f]">

      {/* Top rule */}
      <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.2) 50%, transparent)" }} />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-24 sm:pb-32">

        {/* Header row */}
        <div className="flex items-end justify-between gap-6 mb-14 sm:mb-18">
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
            className="hidden sm:inline-flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-full border border-primary/25 text-primary text-[10px] font-bold tracking-[0.18em] uppercase font-[Montserrat] hover:bg-primary hover:text-[#00382d] transition-all duration-200"
          >
            All Articles
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* ── FEATURED CARD ─────────────────────────────────────── */}
        <a
          href={`/blog/${FEATURED.slug}`}
          className="group relative flex flex-col lg:flex-row rounded-2xl overflow-hidden mb-4 transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #0e1f30 0%, #091914 100%)", minHeight: "380px" }}
        >
          {/* Image — left ~60% */}
          <div className="relative w-full lg:w-[60%] shrink-0 overflow-hidden" style={{ minHeight: "280px" }}>
            <Image
              src={FEATURED.image}
              alt={FEATURED.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-103"
              priority
            />
            {/* Gradient into text side */}
            <div className="absolute inset-0" style={{
              background: "linear-gradient(to bottom, rgba(9,25,20,0.25) 0%, rgba(9,25,20,0.5) 70%, rgba(9,25,20,0.85) 100%)"
            }} />
            <div className="absolute inset-0 hidden lg:block" style={{
              background: "linear-gradient(to right, transparent 60%, rgba(9,25,20,0.95) 100%)"
            }} />

            {/* FEATURED badge */}
            <span className="absolute top-5 left-5 text-[9px] font-bold px-3 py-1.5 rounded-full tracking-[0.2em] font-[Montserrat] bg-primary text-[#00382d]">
              FEATURED
            </span>
          </div>

          {/* Text — right ~40% */}
          <div className="relative z-10 flex flex-col justify-center px-8 sm:px-10 py-10 lg:py-12 w-full lg:w-[40%]">
            {/* Tag + read time */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[0.18em] font-[Montserrat] border"
                style={{ color: FEATURED.tagColor, background: FEATURED.tagBg, borderColor: FEATURED.tagBorder }}>
                {FEATURED.tag}
              </span>
              <span className="text-[11px] text-white/30 font-[Montserrat]">{FEATURED.readTime} read</span>
            </div>

            <h3 className="font-[Playfair_Display] text-[26px] sm:text-[32px] text-white leading-[1.15] mb-5 group-hover:text-primary transition-colors duration-300">
              {FEATURED.title}
            </h3>

            <p className="text-[13px] text-white/40 font-[Montserrat] leading-relaxed mb-8 max-w-[360px]">
              {FEATURED.excerpt}
            </p>

            {/* Stat */}
            <div className="flex items-baseline gap-2 mb-8 pb-8 border-b border-white/8">
              <span className="font-[Playfair_Display] text-[36px] leading-none" style={{ color: FEATURED.tagColor }}>
                {FEATURED.stat}
              </span>
              <span className="text-[10px] text-white/30 font-[Montserrat] tracking-widest uppercase">
                {FEATURED.statLabel}
              </span>
            </div>

            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase font-[Montserrat] text-primary group-hover:gap-3 transition-all duration-200">
              Read Article
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
            style={{ background: `linear-gradient(to right, ${FEATURED.tagColor}, transparent)` }} />
        </a>

        {/* ── SECONDARY ROW — text-only, noticeably smaller ─────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px mb-12"
          style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", overflow: "hidden" }}>
          {SECONDARY.map((a, i) => (
            <a
              key={i}
              href={`/blog/${a.slug}`}
              className="group flex flex-col gap-3 px-6 py-6 transition-all duration-200 hover:bg-white/[0.03]"
              style={{ background: "linear-gradient(160deg, #0c1824 0%, #090f18 100%)" }}
            >
              {/* Tag + time */}
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold tracking-[0.2em] font-[Montserrat] uppercase"
                  style={{ color: a.tagColor }}>
                  {a.tag}
                </span>
                <span className="text-white/15 text-[9px]">·</span>
                <span className="text-[10px] text-white/25 font-[Montserrat]">{a.readTime}</span>
              </div>

              {/* Title — smaller, tighter */}
              <h4 className="font-[Playfair_Display] text-[15px] text-white/75 leading-snug group-hover:text-white transition-colors duration-200 line-clamp-2">
                {a.title}
              </h4>

              {/* CTA */}
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.18em] uppercase font-[Montserrat] mt-auto pt-1"
                style={{ color: a.tagColor, opacity: 0.6 }}>
                Read
                <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5 transition-transform duration-200 group-hover:translate-x-0.5">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center">
          <a
            href="/blog"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-primary/30 text-primary text-[11px] font-bold tracking-[0.2em] uppercase font-[Montserrat] hover:bg-primary hover:text-[#00382d] hover:border-primary transition-all duration-250"
          >
            Browse All Articles
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </Reveal>
  );
}
