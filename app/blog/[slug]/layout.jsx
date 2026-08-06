import { ARTICLES } from "@/lib/articles";

const SITE = "https://zewafeeds.com";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: { absolute: "Article Not Found | Zewa Feeds" },
      description: "This article could not be found. Browse the full Zewa Feeds Knowledge Hub for lab-verified aquatic nutrition insights.",
    };
  }

  // Articles may carry a dedicated `seo` block; fall back to display copy so
  // entries written before it existed keep working unchanged.
  const seo = article.seo ?? {};
  const title = seo.title ?? `${article.shortTitle} | Zewa Feeds`;
  const description = seo.description ?? article.excerpt;
  const url = `${SITE}/blog/${article.slug}`;

  return {
    title: { absolute: title },
    description,
    keywords: seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: seo.ogTitle ?? `${article.title} | Zewa Feeds`,
      description: seo.ogDescription ?? description,
      url,
      type: "article",
      publishedTime: article.isoDate,
      authors: [article.author],
      images: article.image
        ? [{ url: article.image, alt: article.imageAlt ?? article.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle ?? title,
      description: seo.ogDescription ?? description,
      images: article.image ? [article.image] : undefined,
    },
  };
}

/**
 * Structured data.
 *
 * Article schema drives rich results. FAQPage is emitted ONLY when the body
 * actually contains an FAQ block — marking up questions that are not visible on
 * the page is a Search Console violation, not a shortcut.
 */
function schemaFor(article) {
  const url = `${SITE}/blog/${article.slug}`;

  const graph = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: article.seo?.title ?? article.title,
      description: article.seo?.description ?? article.excerpt,
      image: article.image,
      datePublished: article.isoDate,
      dateModified: article.isoDate,
      author: { "@type": "Organization", name: article.author, url: SITE },
      publisher: { "@type": "Organization", name: "Zewa Feeds", url: SITE },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      articleSection: article.tag,
      keywords: article.seo?.keywords?.join(", "),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Knowledge Hub", item: `${SITE}/blog` },
        { "@type": "ListItem", position: 3, name: article.shortTitle, item: url },
      ],
    },
  ];

  const faq = article.content?.find((b) => b.type === "faq");
  if (faq) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export default async function ArticleLayout({ children, params }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  return (
    <>
      {article && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFor(article)) }}
        />
      )}
      {children}
    </>
  );
}
