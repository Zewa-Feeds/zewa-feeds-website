import { notFound } from "next/navigation";
import { HomeView } from "@/app/page";
import { AboutView } from "@/app/about/page";
import { LetterView } from "@/app/letters/[slug]/page";
import { getArticleIndex, previewSection } from "@/lib/siteContent";

/**
 * Website draft preview — what CMS → Website → Preview opens.
 *
 *   /preview/site?token=…              homepage with the draft hero & picks
 *   /preview/site?token=…&page=about   About page with draft milestones etc.
 *   /preview/site?token=…&page=letters[&slug=…]   a draft letter (newest by default)
 *
 * Rendered with the real page components, so staff see what customers will.
 * Never cached, never indexed, and the token is checked by the API.
 */
export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "Draft preview | Zewa Feeds" },
  robots: { index: false, follow: false },
};

function DraftBanner() {
  return (
    <div className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-amber-400 px-4 py-2 text-[12px] font-bold text-black shadow-lg">
      DRAFT PREVIEW — not live
    </div>
  );
}

export default async function SitePreviewPage({ searchParams }) {
  const { token, page = "home", slug } = await searchParams;
  if (!token || !["home", "about", "letters"].includes(page)) notFound();

  const draft = await previewSection(page === "letters" ? "letters" : page, token);
  if (!draft) notFound();

  if (page === "letters") {
    const letter = draft.data.find((l) => l.slug === slug) ?? draft.data[0];
    if (!letter) notFound();
    return (
      <>
        <DraftBanner />
        <LetterView letter={letter} others={draft.data.filter((l) => l !== letter)} />
      </>
    );
  }

  if (page === "about") {
    return (
      <>
        <DraftBanner />
        <AboutView about={draft} letters={await previewSection("letters", token)} />
      </>
    );
  }

  return (
    <>
      <DraftBanner />
      <HomeView home={draft} index={await getArticleIndex()} />
    </>
  );
}
