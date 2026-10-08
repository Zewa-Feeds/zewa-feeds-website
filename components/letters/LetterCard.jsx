import Image from "next/image";

/** Compact link to a letter, for the /letters index and "More letters". */
export default function LetterCard({ letter }) {
  return (
    <a
      href={`/letters/${letter.slug}`}
      className="group flex gap-5 rounded-2xl border border-white/8 bg-white/[0.02] p-4 transition-colors duration-200 hover:border-primary/30 sm:p-5"
    >
      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-white/8">
        <Image
          src={letter.cover.src}
          alt={letter.cover.alt}
          fill
          sizes="96px"
          className="object-cover object-top"
        />
      </div>
      <div className="min-w-0">
        <p className="font-body-md text-[10.5px] font-semibold uppercase tracking-[0.2em] text-primary/80">
          {letter.dateLabel}
        </p>
        <h3 className="mt-2 font-display-lg text-[18px] leading-snug text-white transition-colors group-hover:text-primary">
          {letter.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 font-body-md text-[12.5px] leading-relaxed text-white/45">
          {letter.subtitle}
        </p>
      </div>
    </a>
  );
}
