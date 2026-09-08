"use client";

import AvailableOffers from "@/components/AvailableOffers";

/**
 * The cart's coupon controls: type a code, tap an advertised one, see what the
 * server made of it, and remove what is applied.
 *
 * Extracted from the cart page because it is MOUNTED TWICE — above the item
 * list on mobile, inside the Order Summary on desktop — with only one visible
 * at a time. On a phone the summary sits below every item in the cart, so a
 * shopper had to scroll past their whole order to discover the shop even ran
 * promotions. Moving the panel up on small screens fixes that without inverting
 * the review-then-checkout order of the page.
 *
 * All state lives in the page, so both mounts stay in lockstep: typing in one
 * updates the other, and only the visible one can be interacted with.
 */
export default function CartCouponPanel({
  couponInput,
  onCouponInputChange,
  onSubmit,
  availableOffers = [],
  appliedCodes = [],
  coupons = [],
  onRemoveCoupon,
  applying = false,
  error = "",
  success = "",
}) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(couponInput); }}
      className="flex flex-col gap-2"
    >
      <div className="flex gap-2">
        <input
          value={couponInput}
          onChange={(e) => onCouponInputChange(e.target.value.toUpperCase())}
          placeholder="Discount code"
          aria-label="Discount code"
          className="flex-1 min-w-0 rounded-xl border border-white/10 bg-[#0d1627] px-3.5 py-2.5 text-[12px] uppercase tracking-wider text-white placeholder-white/25 font-[Montserrat] focus:border-primary/50 focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={applying || !couponInput.trim()}
          className="rounded-xl border border-primary/30 bg-primary/10 px-4 text-[11px] font-bold uppercase tracking-wider text-primary font-[Montserrat] transition-all hover:bg-primary/20 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {applying ? "Applying..." : "Apply"}
        </button>
      </div>

      {/*
        Tapping a code here APPLIES it, unlike checkout — where the same list
        only fills the input because the shopper is one click from paying. On
        the cart there is still a whole checkout ahead to change their mind, and
        the Remove control below undoes it in one tap.
      */}
      <AvailableOffers
        offers={availableOffers}
        appliedCodes={appliedCodes}
        onSelect={onSubmit}
        disabled={applying}
      />

      {success && !error && (
        <p className="text-[11px] text-primary font-[Montserrat] flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{success}</span>
        </p>
      )}

      {error && (
        <p className="text-[11px] text-red-400 font-[Montserrat] flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{error}</span>
        </p>
      )}

      {/*
        Every promotion the SERVER applied, not what was typed, so the list can
        never imply a discount that is not in the total.
      */}
      {coupons.map((c) => (
        <div
          key={c.code}
          className="flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-[11px] text-primary font-[Montserrat]"
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="truncate">
              <strong className="font-bold">{c.code}</strong> applied ({c.discountLabel})
              {c.automatic && (
                <span className="ml-1.5 text-[9.5px] uppercase tracking-wider text-primary/60">auto</span>
              )}
            </span>
          </div>
          {/* An automatic promotion has no code to remove — the shop applied it. */}
          {!c.automatic && onRemoveCoupon && (
            <button
              type="button"
              onClick={() => onRemoveCoupon(c.code)}
              aria-label={`Remove ${c.code}`}
              className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-primary/70 transition-colors hover:bg-primary/15 hover:text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </form>
  );
}
