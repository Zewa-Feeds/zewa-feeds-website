import { ARTICLES } from "@/lib/articles";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: { absolute: "Article Not Found | Zewa Feeds" },
      description: "This article could not be found. Browse the full Zewa Feeds Knowledge Hub for lab-verified aquatic nutrition insights.",
    };
  }

  return {
    title: { absolute: `${article.shortTitle} | Zewa Feeds` },
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | Zewa Feeds`,
      description: article.excerpt,
      type: "article",
    },
  };
}

export default function ArticleLayout({ children }) {
  return children;
}
