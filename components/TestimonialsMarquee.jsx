"use client";

/**
 * The scrolling row of review cards.
 *
 * Split from Testimonials so the fetch can stay on the server: only the
 * pause-on-hover and the keyframes need a browser.
 */

/** "Kshyanaprava Mishra" -> "KM"; a single name -> its first letter. */
function initialsOf(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "★";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** "Zewa Feeds Shrimp Grazers S5" -> "Shrimp Grazers S5". */
function shortProduct(name) {
  return String(name || "").replace(/^Zewa Feeds\s+/i, "");
}

export default function TestimonialsMarquee({ items = [] }) {
  // Duplicated so the track can loop seamlessly at -50%.
  const doubled = [...items, ...items];

  return (
    <>
      <div
        className="flex gap-5 w-max"
        style={{ animation: "marquee 60s linear infinite" }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
      >
        {doubled.map((t, i) => (
          <div
            key={`${t.author}-${i}`}
            className="w-[340px] sm:w-[380px] shrink-0 bg-white border border-gray-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between gap-4"
          >
            <div>
              <div className="text-primary text-[28px] font-display-lg leading-none mb-2 opacity-50">
                &ldquo;
              </div>
              {t.title && (
                <p className="font-button text-[14px] text-gray-800 mb-2 leading-snug">
                  {t.title}
                </p>
              )}
              {/*
                Clamped to four lines. Real reviews vary wildly in length — one
                runs to a paragraph — and letting the longest one set the card
                height made the whole section far taller than it needed to be.
              */}
              <p className="font-body-md text-[14px] sm:text-[15px] text-gray-600 leading-relaxed line-clamp-4">
                {t.body}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                <span className="font-label-caps text-[11px] text-primary font-bold">
                  {initialsOf(t.author)}
                </span>
              </div>
              <div className="min-w-0">
                <div className="font-button text-[13px] text-gray-800 tracking-wide truncate">
                  {t.author}
                </div>
                <div className="font-body-md text-[11px] text-gray-400 mt-0.5 truncate">
                  {/*
                    The product reviewed, and where it was written. The old
                    cards invented an occupation and a city for each person;
                    what they actually bought is true and more useful.
                  */}
                  {shortProduct(t.product)}
                  {t.source ? ` · via ${t.source}` : ""}
                </div>
              </div>
              {/* The rating this reviewer GAVE, not a decorative five. */}
              <div className="ml-auto flex gap-0.5 shrink-0">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={`card-star-${i}-${s}`}
                    className={s <= t.rating ? "text-primary text-[12px]" : "text-gray-200 text-[12px]"}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0) }
          to   { transform: translateX(-50%) }
        }
        @media (prefers-reduced-motion: reduce) {
          /* Honour the OS setting: an endless horizontal crawl is exactly the
             kind of motion that setting exists to stop. */
          .flex.w-max { animation: none !important; }
        }
      `}</style>
    </>
  );
}
