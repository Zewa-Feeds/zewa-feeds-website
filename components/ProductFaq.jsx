import { faqItems } from "@/lib/productFaq";

/**
 * "Frequently asked questions" under the product tabs.
 *
 * Always in the page HTML (answers collapse with <details>, but are not
 * removed), so it matches the FAQPage JSON-LD the page emits. Renders nothing
 * for a product with no FAQs.
 */
export default function ProductFaq({ product }) {
  const items = faqItems(product);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="product-faq-heading" className="mt-16 border-t border-white/8 pt-10">
      <h2
        id="product-faq-heading"
        className="mb-6 text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 font-[Montserrat]"
      >
        Frequently asked questions
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((f, i) => (
          <details key={i} className="group rounded-xl border border-white/8 bg-white/3 px-5 py-4 open:bg-white/5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[14px] font-semibold leading-snug text-white/85 font-[Montserrat] [&::-webkit-details-marker]:hidden">
              <span>{f.q}</span>
              <span
                className="material-symbols-outlined shrink-0 text-[20px] text-primary transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              >
                expand_more
              </span>
            </summary>
            <p className="mt-3 text-[13.5px] leading-relaxed text-white/60 font-[Montserrat]">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
