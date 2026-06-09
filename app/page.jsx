import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ClinicalProof from "@/components/ClinicalProof";
import ProductShowcase from "@/components/ProductShowcase";
import Science from "@/components/Science";
import KnowledgeHub from "@/components/KnowledgeHub";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const sections = [
  Hero,
  ClinicalProof,
  ProductShowcase,
  Science,
  KnowledgeHub,
  Testimonials,
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
