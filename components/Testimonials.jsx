import { featuredReviews } from "@/lib/api";
import { FALLBACK_REVIEWS, FALLBACK_RATING } from "@/lib/fallback-reviews";
import StarRating from "./StarRating";
import TestimonialsMarquee from "./TestimonialsMarquee";

/**
 * What keepers actually said, on the home page.
 *
 * This section used to hold SIX INVENTED CUSTOMERS — "Rahul Menon, Discus
 * Breeder, Kochi" and five others who do not exist — under a headline of
 * "4.9 / 5 across 200+ reviews" that was equally made up. Every card also drew
 * five stars regardless of what it claimed to be quoting.
 *
 * Real reviews exist now, so all of it is served from the database: the quotes,
 * the names, the per-card ratings and the headline figure. If the shop's rating
 * moves, this moves with it — there is no second number to keep in sync.
 *
 * A server component, so the fetch happens during render and the marquee ships
 * with its content rather than popping in. The animation lives in the client
 * child, which is the only part that needs the browser.
 */
export default async function Testimonials() {
  let data = null;
  try {
    data = await featuredReviews.list();
  } catch {
    /*
     * Fall back to the snapshot rather than deleting the section.
     *
     * Returning null here meant one unreachable API removed "What keepers say"
     * from the home page entirely — which is what happens during any deploy
     * where the storefront is newer than the running backend. The snapshot is
     * the same real reviews, so the worst case is slightly stale, never
     * invented.
     */
  }

  const items = data?.items?.length ? data.items : FALLBACK_REVIEWS;
  const rating =
    data?.average != null ? { average: data.average, count: data.count } : FALLBACK_RATING;

  if (items.length === 0) return null;

  return (
    <section className="bg-[#f8faf9] py-12 sm:py-16 overflow-hidden">
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-px bg-primary" />
              <span className="font-label-caps text-label-caps text-primary tracking-[0.18em]">
                WHAT KEEPERS SAY
              </span>
            </div>
            <h2 className="font-display-lg text-[28px] sm:text-[36px] text-gray-900 leading-tight">
              Trusted by serious aquarists.
            </h2>
          </div>

          {/*
            The real figure, over every rating the range has earned. It was
            hardcoded to "4.9 / 5 across 200+ reviews", which was both wrong
            and unfalsifiable.
          */}
          {rating?.average != null && (
            <div className="flex items-center gap-2">
              {/* Shared with the product pages, so one rating looks the same everywhere. */}
              <StarRating value={rating.average} size="w-4 h-4" emptyFill="rgba(0,0,0,0.14)" />
              <span className="font-body-md text-[13px] text-gray-400 ml-2 tabular-nums">
                {rating.average} / 5 across {rating.count.toLocaleString("en-IN")} ratings
              </span>
            </div>
          )}
        </div>
      </div>

      <TestimonialsMarquee items={items} />
    </section>
  );
}
