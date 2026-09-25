/**
 * Five stars, filled to the nearest half.
 *
 * Every place that showed a rating drew its own: the product card showed ONE
 * star beside the number, the detail page rounded 4.5 up to five filled stars,
 * and the home page had a third variant. A rating is a shape people read at a
 * glance, and "4.5" next to five solid stars overstates it.
 *
 * Halves are rendered by clipping a second star to a percentage width rather
 * than using a half-star glyph, so any fraction is representable and the two
 * layers always align exactly.
 */
export default function StarRating({
  value = 0,
  /** Tailwind size classes for one star, e.g. "w-3.5 h-3.5". */
  size = "w-3.5 h-3.5",
  className = "",
  /** Rounds to the nearest half before drawing; pass false for exact fills. */
  snapToHalf = true,
  /*
   * Colour of the UNFILLED portion. The default suits the dark storefront; the
   * home page's testimonials sit on near-white, where a translucent white star
   * would vanish entirely.
   */
  emptyFill = "rgba(255,255,255,0.18)",
}) {
  const rating = snapToHalf ? Math.round(value * 2) / 2 : value;

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        // How much of THIS star is filled: 1 for a full star, 0.5 for a half.
        const fill = Math.min(1, Math.max(0, rating - (n - 1)));
        return (
          <span key={n} className={`relative inline-block shrink-0 ${size}`} aria-hidden="true">
            <svg viewBox="0 0 20 20" className={`${size} absolute inset-0`} fill={emptyFill}>
              <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
            </svg>
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <svg viewBox="0 0 20 20" className={`${size} absolute inset-0`} fill="#44e5c2">
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                </svg>
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
