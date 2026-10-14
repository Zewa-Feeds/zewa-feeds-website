import BlogIndex from "@/components/blog/BlogIndex";
import ContentVersion from "@/components/ContentVersion";
import { getArticleIndex, getSection, versionOf } from "@/lib/siteContent";
import { articleView } from "@/lib/articleView";

/**
 * Knowledge Hub index — pre-rendered from the published CMS content and
 * regenerated when an article or the blog placements are published.
 * Metadata lives in layout.jsx.
 */
export default async function BlogPage() {
  const [blog, index] = await Promise.all([getSection("blog"), getArticleIndex()]);

  return (
    <>
      <ContentVersion version={versionOf(blog, index)} />
      <BlogIndex
        articles={index.data.map(articleView)}
        featuredSlug={blog.data.featuredSlug}
        topics={blog.data.topics}
      />
    </>
  );
}
