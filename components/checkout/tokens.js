/**
 * Checkout design tokens.
 *
 * The checkout surface deliberately runs SOFTER than the rest of the site: the
 * Tailwind config shrinks the radius scale (xl = 8px, full = 12px), but the
 * checkout cards use `rounded-3xl` / `rounded-2xl`, which are Tailwind defaults
 * (24px / 16px) and so escape that override. That divergence is intentional —
 * checkout reads as a distinct, more premium surface. Everything else (colour,
 * type, the mint primary) stays identical to the shipped pages.
 *
 * These are plain strings rather than a Tailwind plugin so the classes stay
 * statically analysable — Tailwind's JIT only sees complete class names, so
 * composing them at runtime would silently drop styles from the build.
 */

/** Section card: the glass panel every checkout block sits in. */
export const CARD =
  "rounded-3xl border border-white/10 bg-[#090f1d]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.36)]";

/** Standard interior padding for a section card. */
export const CARD_PAD = "p-6 sm:p-8";

/** Divider under a section header. */
export const CARD_HEADER = "flex items-center justify-between border-b border-white/8 pb-4";

/** Numbered step chip beside a section title. */
export const STEP_CHIP =
  "flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold text-[13px] font-[Montserrat]";

/** Section title — Playfair, matching the site's headline treatment. */
export const SECTION_TITLE = "font-[Playfair_Display] text-[20px] font-bold text-white";

/** Muted caption sitting opposite a section title. */
export const SECTION_META = "text-[11px] text-white/35 font-[Montserrat]";

/**
 * The 8px spacing rhythm, as the gap between stacked sections.
 * 32px on desktop keeps sections distinct without feeling sparse.
 */
export const SECTION_GAP = "gap-8";

/**
 * Motion. Every interactive surface shares one easing curve and duration so
 * the page feels like a single system rather than a pile of components.
 *
 * `motion-reduce:transition-none` is applied alongside — the checkout is a
 * task, and animation should never stand between someone and completing it.
 */
export const EASE = "transition-all duration-200 ease-out motion-reduce:transition-none";

/** Focus ring for keyboard navigation. Visible against the dark surface. */
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060913]";
