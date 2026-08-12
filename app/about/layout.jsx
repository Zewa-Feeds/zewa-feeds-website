import { COMPANY } from "@/lib/company";

const SITE = "https://zewafeeds.com";
const URL = `${SITE}/about`;

const TITLE = "About Zewa Feeds — Insect Protein Aquafeed from Kerala, India";
const DESCRIPTION =
  "Zewa Ecosystems builds aquafeed on Black Soldier Fly protein, farmed at India's first data-centric insect farming plant and verified at 88% pepsin digestibility by NABL-accredited testing.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: "website",
    siteName: "Zewa Feeds",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/**
 * Organization schema.
 *
 * Only claims the source document supports: legal name, founder, registered
 * address and the institutions Zewa is formally associated with. No employee
 * counts, revenue or founding date, none of which the document states.
 */
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE}#organization`,
  name: COMPANY.legalName,
  alternateName: "Zewa Feeds",
  url: SITE,
  description: DESCRIPTION,
  founder: {
    "@type": "Person",
    name: "Nik Mulakkal",
    jobTitle: "Founder & CEO",
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "University of Melbourne" },
      { "@type": "CollegeOrUniversity", name: "University of Calicut" },
    ],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: `${COMPANY.address.line1}, ${COMPANY.address.line2}`,
    addressLocality: COMPANY.address.city,
    addressRegion: COMPANY.address.state,
    postalCode: COMPANY.address.postalCode,
    addressCountry: "IN",
  },
  /*
   * E.164 format — Google expects the country code and no separators here,
   * even though the footer displays it grouped for readability. Keep both in
   * step: this is the number search results and the business panel show.
   */
  telephone: COMPANY.phone.replace(/\s+/g, "-"),
  contactPoint: {
    "@type": "ContactPoint",
    telephone: COMPANY.phone.replace(/\s+/g, "-"),
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["en", "ml"],
  },
  memberOf: [
    { "@type": "Organization", name: "Kerala Startup Mission" },
    { "@type": "Organization", name: "Startup India" },
    { "@type": "Organization", name: "AgHub (PJTSAU)" },
    { "@type": "Organization", name: "Pusa Krishi (ICAR-IARI)" },
  ],
  knowsAbout: [
    "Black Soldier Fly protein",
    "Insect protein aquafeed",
    "Ornamental fish nutrition",
    "Sustainable aquaculture",
  ],
};

export default function AboutLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      {children}
    </>
  );
}
