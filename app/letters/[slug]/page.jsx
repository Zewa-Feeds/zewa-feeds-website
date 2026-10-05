import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LetterBody from "@/components/letters/LetterBody";
import LetterCard from "@/components/letters/LetterCard";
import { LETTERS, LETTERS_BY_DATE, findLetter } from "@/lib/letters";

export function generateStaticParams() {
  return LETTERS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const letter = findLetter(slug);
  if (!letter) return {};
  return {
    title: `${letter.title} — Founder's Letter`,
    description: letter.excerpt,
    alternates: { canonical: `/letters/${letter.slug}` },
    openGraph: {
      type: "article",
      title: letter.title,
      description: letter.excerpt,
      images: [{ url: letter.cover.src, alt: letter.cover.alt }],
    },
  };
}

export default async function LetterPage({ params }) {
  const { slug } = await params;
  const letter = findLetter(slug);
  if (!letter) notFound();

  const others = LETTERS_BY_DATE.filter((l) => l.slug !== letter.slug);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#05070d] pb-20 pt-28 text-[#dde2f6] sm:pt-32">
        <article className="mx-auto max-w-[780px] px-6 sm:px-10">
          <a
            href="/letters"
            className="mb-10 inline-flex items-center gap-2 font-body-md text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 transition-colors duration-200 hover:text-white/60"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Founder&rsquo;s Letters
          </a>

          {/* Letterhead — deliberately not the blog's photo hero: this is a letter. */}
          <header className="border-b border-white/8 pb-10">
            <p className="mb-5 font-body-md text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Founder&rsquo;s Letter · <time dateTime={letter.date}>{letter.dateLabel}</time>
            </p>
            <h1
              className="font-display-lg leading-[1.1] text-white"
              style={{ fontSize: "clamp(30px, 5vw, 50px)" }}
            >
              {letter.title}
            </h1>
            <p className="mt-4 font-display-lg text-[18px] italic text-white/50 sm:text-[21px]">
              {letter.subtitle}
            </p>
            <p className="mt-7 font-body-md text-[12.5px] text-white/40">
              By <span className="text-white/70">{letter.author}</span>, {letter.authorRole}
            </p>
          </header>

          <div className="pt-10">
            <LetterBody blocks={letter.blocks} />
          </div>

          <footer className="mt-12 border-t border-white/8 pt-8">
            <p className="font-display-lg text-[22px] text-white">{letter.author}</p>
            <p className="mt-1 font-body-md text-[13px] italic text-white/45">{letter.authorRole}</p>
            <p className="font-body-md text-[13px] italic text-white/45">{letter.authorOrg}</p>
          </footer>
        </article>

        {others.length > 0 && (
          <section className="mx-auto mt-20 max-w-[1080px] border-t border-white/5 px-6 pt-14 sm:px-10">
            <h2 className="mb-8 font-display-lg text-[24px] text-white">More letters</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {others.map((l) => (
                <LetterCard key={l.slug} letter={l} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
