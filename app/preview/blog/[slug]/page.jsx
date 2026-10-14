import { notFound } from "next/navigation";
import { ArticleView } from "@/app/blog/[slug]/page";
import { getArticleIndex, previewArticle } from "@/lib/siteContent";

/**
 * Draft article preview — the article editor's Preview button.
 * The live columns with any pending edits applied, rendered by the real page.
 */
export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "Draft preview | Zewa Feeds" },
  robots: { index: false, follow: false },
};

export default async function ArticlePreviewPage({ params, searchParams }) {
  const { slug } = await params;
  const { token } = await searchParams;
  if (!token) notFound();

  const draft = await previewArticle(slug, token);
  if (!draft) notFound();

  return (
    <>
      <div className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-amber-400 px-4 py-2 text-[12px] font-bold text-black shadow-lg">
        {draft.draft ? "DRAFT PREVIEW — not live" : "PREVIEW — matches the live article"}
      </div>
      <ArticleView result={draft} index={await getArticleIndex()} />
    </>
  );
}
