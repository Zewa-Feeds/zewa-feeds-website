import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ClinicalProof from "@/components/ClinicalProof";
import ProductShowcase from "@/components/ProductShowcase";
import Science from "@/components/Science";
import KnowledgeHub from "@/components/KnowledgeHub";
import DealerCTA from "@/components/DealerCTA";
import Footer from "@/components/Footer";

const sections = [
  Hero,
  ClinicalProof,
  ProductShowcase,
  Science,
  KnowledgeHub,
  DealerCTA,
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {sections.map((Section) => (
          <Section key={Section.name} />
        ))}
      </main>
      <Footer />
    </>
  );
}
