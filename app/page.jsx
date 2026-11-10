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
import { COMPANY } from "@/lib/company";
import { SITE_URL } from "@/lib/site";

/*
 * The homepage's own title. The layout default is just "Zewa Feeds", which
 * says nothing in a search result. Canonical "/" comes from the layout.
 */
export const metadata = {
  title: { absolute: "Zewa Feeds | Species-Specific Insect Protein Fish Food" },
};

/*
 * Organization + WebSite structured data, homepage only. The Organization
 * shares its @id with the fuller record on /about, so search engines merge
 * the two into one entity rather than seeing two companies.
 */
const HOME_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: COMPANY.legalName,
      alternateName: COMPANY.brand,
      url: SITE_URL,
      logo: `${SITE_URL}/logo-transparent.png`,
      email: COMPANY.email,
      telephone: COMPANY.phone.replace(/\s+/g, "-"),
      sameAs: [
        "https://www.instagram.com/zewa_feeds/",
        "https://www.linkedin.com/company/34740037/",
        "https://www.facebook.com/ZewaFeeds/",
        "https://x.com/zewaecosystems",
        "https://www.youtube.com/@zewafeeds",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: COMPANY.brand,
      url: SITE_URL,
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}#organization` },
    },
  ],
};

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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_SCHEMA) }} />
      <HomeView home={home} index={index} />
    </>
  );
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
