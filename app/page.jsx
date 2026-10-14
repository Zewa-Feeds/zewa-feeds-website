import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ClinicalProof from "@/components/ClinicalProof";
import ProductShowcase from "@/components/ProductShowcase";
import Science from "@/components/Science";
import KnowledgeHub from "@/components/KnowledgeHub";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ContentVersion from "@/components/ContentVersion";
import { getArticleIndex, getSection, versionOf } from "@/lib/siteContent";
import { articleView, pickArticles } from "@/lib/articleView";

/**
 * Homepage.
 *
 * Editorial content (hero slides, which products and articles lead) is the
 * published CMS content, read at build/regeneration time. Product cards and
 * reviews stay on the live catalogue's own short cache — prices and stock are
 * not editorial and must not wait for a publish.
 */
export default async function Home() {
  const [home, index] = await Promise.all([getSection("home"), getArticleIndex()]);
  return <HomeView home={home} index={index} />;
}

/** The page body; /preview/site renders it with draft content. */
export function HomeView({ home, index }) {
  const hubArticles = pickArticles(index.data, home.data.knowledgeHub?.articleSlugs, 3).map(articleView);

  return (
    <>
      <ContentVersion version={versionOf(home, index)} />
      <Header />
      <main>
        <Hero slides={home.data.heroSlides} statement={home.data.statement} />
        <ClinicalProof proof={home.data.proof} />
        <Science />
        <ProductShowcase productSlugs={home.data.showcase?.productSlugs} />
        <KnowledgeHub articles={hubArticles} />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
