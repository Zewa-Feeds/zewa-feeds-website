import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * 404 — the branded one.
 *
 * Reached two ways: a URL matching no route at all, and a route calling
 * notFound() because the thing it needed does not exist (an unknown product
 * slug, most often). Both return a real HTTP 404, which is the point — a
 * redirect to the homepage would tell Google the page moved there, and every
 * dead Dukaan link would quietly collapse the homepage's relevance.
 *
 * This matters more than usual right now: when zewafeeds.com moves off Dukaan,
 * every stale link, bookmark and search result that was never mapped lands
 * here. It should read as a considered part of the shop rather than a wall.
 *
 * Header and Footer are kept so someone who arrives here still has the whole
 * site to hand — nav, search, cart, contact details — instead of a dead end
 * with two buttons on it.
 *
 * Nothing about the failure is exposed: no path, no slug, no upstream error.
 * A visitor cannot act on any of it, and a crawler should not index it.
 */
export const metadata = {
  title: "Page not found",
  description: "The page you were looking for has moved or no longer exists.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="bg-[#06080f] min-h-screen text-[#dde2f6] pt-28 pb-24">
        <div className="mx-auto flex max-w-[720px] flex-col items-center px-6 text-center sm:px-10">
          {/*
            The number is decoration, so it is hidden from screen readers —
            they get the heading, which says the same thing in words.
          */}
          <p
            aria-hidden="true"
            className="font-[Playfair_Display] text-[76px] leading-none text-white/[0.07] sm:text-[104px]"
          >
            404
          </p>

          <div className="-mt-6 flex items-center gap-3 sm:-mt-9">
            <div className="h-px w-5 bg-primary" />
            <span className="font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
              Page not found
            </span>
            <div className="h-px w-5 bg-primary" />
          </div>

          <h1 className="mt-5 font-[Playfair_Display] text-[32px] leading-tight text-white sm:text-[42px]">
            Oops! We couldn&rsquo;t find that page.
          </h1>

          <p className="mt-4 max-w-[46ch] font-[Montserrat] text-[14.5px] leading-relaxed text-white/45">
            The page you&rsquo;re looking for may have moved or no longer exists. If you
            followed a link to a product, it might have been renamed or retired.
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a
              href="/products"
              className="rounded-full bg-primary px-8 py-4 font-[Montserrat] text-[12px] font-bold uppercase tracking-[0.2em] text-[#00382d] transition-all duration-200 hover:bg-primary/85 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080f]"
            >
              Browse products
            </a>
            <a
              href="/"
              className="rounded-full border border-white/15 px-8 py-4 font-[Montserrat] text-[12px] font-bold uppercase tracking-[0.2em] text-white/70 transition-all duration-200 hover:border-white/35 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080f]"
            >
              Go to homepage
            </a>
          </div>

          {/*
            A dead end is the most likely moment for someone to give up, so the
            two next-best routes out sit right here rather than in the footer.
          */}
          <div className="mt-12 w-full border-t border-white/8 pt-7">
            <p className="font-[Montserrat] text-[11px] uppercase tracking-[0.16em] text-white/25">
              Or try
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
              <a
                href="/blog"
                className="font-[Montserrat] text-[13px] text-primary/70 transition-colors hover:text-primary"
              >
                Knowledge Hub
              </a>
              <a
                href="/contact"
                className="font-[Montserrat] text-[13px] text-primary/70 transition-colors hover:text-primary"
              >
                Contact us
              </a>
              <a
                href="/orders/track"
                className="font-[Montserrat] text-[13px] text-primary/70 transition-colors hover:text-primary"
              >
                Track an order
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
