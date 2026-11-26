import BlogIndex from "@/components/blog/BlogIndex";
import ContentVersion from "@/components/ContentVersion";
import { getArticleIndex, getSection, versionOf } from "@/lib/siteContent";
import { articleView } from "@/lib/articleView";
import { blogCollectionSchema } from "@/lib/blogSchema";
import { metadata } from "./layout";

/**
 * Knowledge Hub index — pre-rendered from the published CMS content and
 * regenerated when an article or the blog placements are published.
 * Metadata lives in layout.jsx.
 */
export default async function BlogPage() {
  const [blog, index] = await Promise.all([getSection("blog"), getArticleIndex()]);
  const articles = index.data.map(articleView);
  // "<" escaped so article text can never close the script element.
  const schema = JSON.stringify(blogCollectionSchema(articles, blog.data.featuredSlug, {
    name: metadata.title.absolute,
    description: metadata.description,
  })).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <ContentVersion version={versionOf(blog, index)} />
      <BlogIndex
        articles={articles}
        featuredSlug={blog.data.featuredSlug}
        topics={blog.data.topics}
        quote={blog.data.quote}
      />
    </>
  );
}
