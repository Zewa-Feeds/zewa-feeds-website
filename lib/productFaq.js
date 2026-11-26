/**
 * Product FAQs: one source for the visible section and the FAQPage JSON-LD.
 *
 * Both read the same cleaned list, so the structured data can never describe
 * questions the page does not show (Google requires FAQ markup to match
 * visible content).
 */

/** The product's FAQs as [{ q, a }], keeping only complete entries, in order. */
export function faqItems(product) {
  const raw = Array.isArray(product?.faq) ? product.faq : [];
  return raw
    .filter((f) => f && typeof f.q === "string" && typeof f.a === "string")
    .map((f) => ({ q: f.q.trim(), a: f.a.trim() }))
    .filter((f) => f.q && f.a);
}

/** FAQPage structured data, or null when the product has no FAQs. */
export function faqPageSchema(product) {
  const items = faqItems(product);
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * JSON for a <script type="application/ld+json"> body. "<" is escaped so text
 * typed into the CMS can never close the script element early.
 */
export function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
