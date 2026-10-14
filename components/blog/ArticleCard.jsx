import Image from "next/image";

/** Grid / related-reading card (spec #11: 16:9, object-cover). */
export default function ArticleCard({ article: a }) {
  return (
    <a href={`/blog/${a.slug}`} className="group relative flex flex-col overflow-hidden rounded-[20px] cursor-pointer"
      style={{ background: "#0a1221" }}>

      <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: "16/9" }}>
        <Image src={a.image} alt={a.title} fill sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,7,13,0.05) 0%, rgba(5,7,13,0.55) 70%, rgba(5,7,13,0.97) 100%)" }} />

        <div className="absolute top-4 right-5 text-right">
          <div className="font-[Playfair_Display] text-[40px] leading-none text-white"
            style={{ textShadow: `0 0 40px ${a.tagColor}55` }}>{a.stat}</div>
          <div className="text-[9px] text-white/45 font-[Montserrat] tracking-widest uppercase">{a.statLabel}</div>
        </div>

        <div className="absolute bottom-4 left-5 flex items-center gap-2.5">
          <span className="text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[0.18em] font-[Montserrat] border backdrop-blur-sm"
            style={{ color: a.tagColor, borderColor: `${a.tagColor}35`, background: a.tagBg }}>
            {a.tag}
          </span>
          <span className="text-[10px] text-white/30 font-[Montserrat]">{a.readTime} read</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 px-6 pt-5 pb-6 gap-2.5"
        style={{ borderTop: `1px solid ${a.tagColor}18` }}>
        <h3 className="font-[Playfair_Display] text-[21px] text-white leading-snug transition-colors duration-300 group-hover:text-primary">
          {a.title}
        </h3>
        <p className="text-[12.5px] text-white/32 font-[Montserrat] leading-relaxed line-clamp-3 flex-1">
          {a.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 mt-1 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] uppercase font-[Montserrat] transition-colors duration-300"
            style={{ color: a.tagColor }}>
            Read Article
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1.5">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" style={{ color: "rgba(255,255,255,0.25)" }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: `linear-gradient(to right, ${a.tagColor}, transparent 55%)` }} />
    </a>
  );
}
