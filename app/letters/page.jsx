import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LetterCard from "@/components/letters/LetterCard";
import ContentVersion from "@/components/ContentVersion";
import { getSection } from "@/lib/siteContent";

export const metadata = {
  title: "Founder's Letters",
  description:
    "Letters from Nik Mulakkal, Founder & CEO of Zewa Feeds, on where the company stands and what it has learnt.",
  alternates: { canonical: "/letters" },
};

/** Letters are CMS content (Website → Letters), newest first. */
export default async function LettersPage() {
  const letters = await getSection("letters");
  return (
    <>
      <ContentVersion version={letters.version} />
      <Header />
      <main className="min-h-screen bg-[#05070d] pb-24 pt-28 text-[#dde2f6] sm:pt-32">
        <div className="mx-auto max-w-[1080px] px-6 sm:px-10">
          <p className="mb-5 font-body-md text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            From the founder
          </p>
          <h1
            className="font-display-lg leading-[1.1] text-white"
            style={{ fontSize: "clamp(32px, 5vw, 52px)" }}
          >
            Founder&rsquo;s Letters
          </h1>
          <p className="mt-5 max-w-[560px] font-body-md text-[15px] leading-relaxed text-white/45">
            Where Zewa stands, what we have learnt, and where we are going next.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {letters.data.map((l) => (
              <LetterCard key={l.slug} letter={l} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
