import Image from "next/image";
import Reveal from "./Reveal";
import { articles } from "@/lib/content";

export default function KnowledgeHub() {
  return (
    <Reveal id="knowledge" className="py-section-padding bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
        <div className="flex justify-between items-center mb-16">
          <h2 className="font-headline-md text-headline-md">
            Laboratory Insights.
          </h2>
          <button className="font-button text-button text-on-surface-variant hover:text-primary underline underline-offset-8">
            VIEW ALL ARTICLES
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {articles.map((article) => (
            <article key={article.title} className="group cursor-pointer">
              <div className="aspect-[16/10] overflow-hidden mb-8 relative">
                <Image
                  src={article.image}
                  alt={article.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="font-label-caps text-label-caps text-primary mb-4 block">
                {article.tag}
              </span>
              <h3 className="font-headline-sm text-headline-sm mb-4 leading-snug group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="font-body-md text-on-surface-variant text-sm">
                {article.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
