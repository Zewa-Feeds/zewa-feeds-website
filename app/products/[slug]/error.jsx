"use client";

/**
 * Error boundary for the product page.
 *
 * The page rethrows anything that is NOT a "product does not exist" answer —
 * a timeout, a network failure, a 5xx — because `notFound()` is a factual claim
 * and ISR caches it, so a slow backend would otherwise bake a permanent 404
 * over a live product.
 *
 * Rethrowing without a boundary got Next's unstyled "This page couldn't load",
 * which is worse than the 404 it replaced: unbranded, no navigation, no way out
 * but the back button. This is the same recoverable outcome in the site's own
 * clothes, with a retry that re-runs the server render rather than reloading
 * the document.
 */
export default function ProductError({ reset }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="font-[Montserrat] text-[12px] font-semibold uppercase tracking-[0.2em] text-[#44e5c2]/70">
        Taking longer than usual
      </p>
      <h1 className="mt-4 font-[Poppins] text-3xl font-bold text-white sm:text-4xl">
        We couldn&rsquo;t load this product.
      </h1>
      <p className="mt-4 font-[Montserrat] text-[14px] leading-relaxed text-white/60">
        This is on us, not you &mdash; the product is still here. Try again in a
        moment, or browse the rest of the range.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-[#44e5c2] px-6 py-3 font-[Montserrat] text-[12px] font-bold uppercase tracking-wider text-[#00382d] transition hover:bg-[#44e5c2]/90 active:scale-[0.98]"
        >
          Try again
        </button>
        <a
          href="/products"
          className="rounded-xl border border-white/15 px-6 py-3 font-[Montserrat] text-[12px] font-bold uppercase tracking-wider text-white/80 transition hover:border-white/30 hover:text-white"
        >
          Browse products
        </a>
      </div>
    </main>
  );
}
