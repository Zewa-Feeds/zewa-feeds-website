import Link from "next/link";
import { relatedReadingFor } from "@/lib/relatedReading";

/**
 * "Related reading": Knowledge Hub articles that explain the nutrition behind a
 * product, from the fixed mapping in lib/relatedReading.js.
 *
 * Renders NOTHING for a product with no mapped articles, so pages like Shrimp
 * Grazers never show an empty heading. Links use next/link so opening an
 * article stays a client-side navigation (see product-nav-is-client-side.test).
 */
export default function RelatedReading({ slug }) {
  const links = relatedReadingFor(slug);
  if (links.length === 0) return null;

  return (
    <section aria-labelledby="related-reading-heading" className="mt-10 border-t border-white/8 pt-8">
      <h3
        id="related-reading-heading"
        className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 font-[Montserrat]"
      >
        Related reading
      </h3>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex h-full items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/3 px-5 py-4 transition-colors duration-200 hover:border-primary/40 hover:bg-white/5"
            >
              <span className="text-[13.5px] font-semibold leading-snug text-white/80 font-[Montserrat] group-hover:text-white">
                {link.text}
              </span>
              <span
                className="material-symbols-outlined shrink-0 text-[18px] text-primary transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
