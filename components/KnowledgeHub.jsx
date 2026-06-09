import Image from "next/image";
import Reveal from "./Reveal";
import { articles } from "@/lib/content";

export default function KnowledgeHub() {
  return (
    <Reveal id="knowledge" className="bg-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-primary" />
              <span className="font-label-caps text-label-caps text-primary tracking-[0.18em]">
                KNOWLEDGE HUB
              </span>
            </div>
            <h2 className="font-display-lg text-[28px] sm:text-[36px] text-gray-900 leading-tight">
              Laboratory Insights.
            </h2>
          </div>
          <a
            href="/blog"
            className="font-button text-button text-[12px] text-primary border-b border-primary/40 pb-1 hover:border-primary tracking-wider uppercase transition-colors duration-200 shrink-0"
          >
            VIEW ALL ARTICLES →
          </a>
        </div>

        {/* Article cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article) => (
            <article
              key={article.title}
              className="group cursor-pointer border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Image */}
              <div className="aspect-[16/10] overflow-hidden relative w-full">
                <Image
                  src={article.image}
                  alt={article.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-7">
                <span className="font-label-caps text-label-caps text-primary tracking-widest mb-3 block">
                  {article.tag}
                </span>
                <h3 className="font-headline-sm text-[17px] text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors duration-200">
                  {article.title}
                </h3>
                <p className="font-body-md text-[13px] text-gray-500 leading-relaxed mb-5">
                  {article.excerpt}
                </p>
                <span className="font-button text-[11px] text-primary tracking-wider uppercase border-b border-primary/30 pb-0.5 group-hover:border-primary transition-colors duration-200">
                  READ MORE →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
