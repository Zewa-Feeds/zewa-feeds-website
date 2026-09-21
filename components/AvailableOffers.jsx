"use client";

import { formatInr } from "@/lib/api";

/**
 * Offers the shop is advertising, straight from the server's opt-in list.
 *
 * A shopper cannot use a code they have never heard of, and listing them beats
 * hoping they saw an Instagram story. Private referral and influencer codes are
 * excluded server-side, so nothing personal is ever published by this panel.
 *
 * Presentational only — the caller decides what tapping a code does, and both
 * the cart and checkout now apply it straight away. The button reads "Apply"
 * because that is what it does: an earlier version filled checkout's coupon
 * input instead, which made a promoted code cost two taps.
 */
export default function AvailableOffers({
  offers = [],
  appliedCodes = [],
  /**
   * Why the server refused a code, keyed by code.
   *
   * The advertised list is anonymous — it cannot know that THIS customer has
   * already used a code. The cart quote does, so a refusal is passed down here
   * and the offer is greyed out with the server's own reason instead of
   * inviting a tap that can only fail.
   */
  unavailableReasons = {},
  /** Cart subtotal, so a minimum-spend shortfall can be shown before a tap. */
  subtotalPaise = 0,
  onSelect,
  /** Takes an applied coupon back off. Without it an applied row is inert. */
  onRemove,
  disabled = false,
}) {
  if (offers.length === 0) return null;

  /*
   * Usable offers first, then ones within reach, then dead ends — the server's
   * order is by priority, which says nothing about whether THIS cart can use a
   * code. A shopper should not have to read past an offer they cannot take to
   * find one they can. Ties keep the server's order, so the shop's own
   * preference still decides between two equally usable codes.
   */
  const rank = (o) => {
    if (appliedCodes.includes(o.code)) return 0;
    if (unavailableReasons[o.code]) return 3;
    if (o.minOrderPaise > 0 && o.minOrderPaise > subtotalPaise) return 2;
    return 1;
  };
  const ordered = [...offers]
    .map((o, i) => ({ o, i }))
    .sort((a, b) => rank(a.o) - rank(b.o) || a.i - b.i)
    .map(({ o }) => o);

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-2.5">
      <div className="mb-2 flex items-center gap-1.5 px-0.5">
        <svg className="h-3 w-3 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M7 7h.01M7 3h5a2 2 0 011.4.6l7 7a2 2 0 010 2.8l-5.2 5.2a2 2 0 01-2.8 0l-7-7A2 2 0 013 10.2V5a2 2 0 012-2z" />
        </svg>
        <span className="text-[10.5px] uppercase tracking-wider text-white/45 font-[Montserrat]">
          Available offers
        </span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {ordered.map((offer) => {
          const alreadyOn = appliedCodes.includes(offer.code);
          /*
           * The server only reports a refusal for a code the shopper actually
           * SUBMITTED, so an untried offer would otherwise sit there inviting a
           * tap that cannot work. The minimum spend is the one condition we can
           * check here — we hold both numbers — so it is predicted locally and
           * phrased as the gap, which tells the shopper what to do about it.
           *
           * Everything else (first-order-only, per-customer limits) still needs
           * the server, because only it knows who is shopping.
           */
          const shortfallPaise =
            offer.minOrderPaise > 0 ? offer.minOrderPaise - subtotalPaise : 0;
          const belowMinimum = !alreadyOn && shortfallPaise > 0;

          const refusedReason = alreadyOn ? null : unavailableReasons[offer.code];
          const reason =
            refusedReason ||
            (belowMinimum ? `Add ${formatInr(shortfallPaise)} more to use this` : null);
          const unavailable = Boolean(reason);
          /** Short of the minimum, but nothing harder is wrong — still winnable. */
          const withinReach = belowMinimum && !refusedReason;
          /*
           * The conditions are shown, not hidden in a tooltip. A code a customer
           * cannot use is worse than no code at all if they only find out after
           * tapping it — and "first order only" tells a NEW customer this offer
           * is theirs, which is exactly who it is for.
           */
          const conditions = [
            offer.firstOrderOnly ? "First order only" : null,
            offer.minOrderPaise > 0 ? `Min ${formatInr(offer.minOrderPaise)}` : null,
          ].filter(Boolean);
          /** Conditions a shortfall message does not already imply. */
          const otherConditions = offer.firstOrderOnly ? ["First order only"] : [];

          return (
            <li key={offer.code}>
              {/*
                Applied rows stay ENABLED and toggle back off. The applied
                coupon used to be listed a second time below purely to carry a
                Remove button; now that the duplicate is gone, removal has to
                live here or an advertised coupon could never be taken off.
              */}
              <button
                type="button"
                disabled={unavailable || disabled}
                onClick={() => (alreadyOn ? onRemove?.(offer.code) : onSelect?.(offer.code))}
                // The name leads with the code so it stays unique among the
                // several controls that mention the same coupon.
                aria-label={
                  alreadyOn
                    ? `${offer.code} — applied, tap to remove`
                    : `${offer.code} — apply`
                }
                className={
                  // Within reach: dimmed but still warm, because adding a
                  // little more to the cart turns it on.
                  withinReach
                    ? "flex w-full items-center gap-2.5 rounded-lg border border-dashed border-amber-300/20 bg-amber-300/[0.03] px-2.5 py-2 text-left disabled:cursor-not-allowed"
                    : unavailable
                    ? "flex w-full items-center gap-2.5 rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-2.5 py-2 text-left disabled:cursor-not-allowed"
                    : alreadyOn
                      // Solid rather than dashed: this one is ON, and it is
                      // still live so it can be switched back off.
                      ? "group flex w-full items-center gap-2.5 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-2 text-left transition-all hover:border-primary/60 hover:bg-primary/15"
                      : "group flex w-full items-center gap-2.5 rounded-lg border border-dashed border-primary/25 bg-primary/[0.04] px-2.5 py-2 text-left transition-all hover:border-primary/50 hover:bg-primary/10 disabled:cursor-default disabled:opacity-45 disabled:hover:border-primary/25 disabled:hover:bg-primary/[0.04]"
                }
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span
                      className={`font-mono text-[12px] font-bold uppercase tracking-wider ${
                        withinReach
                          ? "text-amber-200/70"
                          : unavailable
                            ? "text-white/35"
                            : "text-primary"
                      }`}
                    >
                      {offer.code}
                    </span>
                    <span
                      /* No strikethrough on a shortfall: the offer is real and
                         still reachable — it is the cart that is short. */
                      className={`text-[11.5px] font-semibold font-[Montserrat] ${
                        withinReach
                          ? "text-white/55"
                          : unavailable
                            ? "text-white/30 line-through"
                            : "text-white/85"
                      }`}
                    >
                      {offer.discountLabel}
                    </span>
                  </div>
                  {/*
                    Why this cannot be used, preferring the server's reason —
                    it knows things we cannot, such as who is shopping. The
                    local shortfall is the fallback, and it is actionable.
                  */}
                  {unavailable ? (
                    <p className="mt-0.5 text-[10.5px] text-amber-300/70 font-[Montserrat]">
                      {reason}
                      {/*
                        Conditions the shortfall does not already state. Meeting
                        the minimum is not the whole story — "first order only"
                        still decides whether this offer is theirs at all, and
                        dropping it would promise something we cannot honour.
                      */}
                      {withinReach && otherConditions.length > 0 && (
                        <span className="text-white/35">
                          {" · "}
                          {otherConditions.join(" · ")}
                        </span>
                      )}
                    </p>
                  ) : (
                    conditions.length > 0 && (
                      <p className="mt-0.5 text-[10.5px] text-white/40 font-[Montserrat]">
                        {conditions.join(" · ")}
                      </p>
                    )
                  )}

                  {/*
                    How close the cart is to qualifying. A bar makes "₹499"
                    concrete in a way the number alone does not, and it is the
                    difference between a dead row and one worth ₹100 more in
                    the basket. Only for a shortfall we predicted ourselves —
                    a server refusal has no progress to show.
                  */}
                  {withinReach && (
                    <div
                      className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-white/8"
                      role="presentation"
                    >
                      <div
                        className="h-full rounded-full bg-amber-300/50 transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.round((subtotalPaise / offer.minOrderPaise) * 100))}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
                <span
                  className={`shrink-0 text-[10px] font-bold uppercase tracking-wider font-[Montserrat] ${
                    unavailable
                      ? "text-white/25"
                      : "text-primary/70 group-hover:text-primary"
                  }`}
                >
                  {/*
                    An applied row reads "Applied" at rest and "Remove" on
                    hover or keyboard focus, so the state is what you see until
                    you go to act on it.
                  */}
                  {alreadyOn ? (
                    <>
                      <span className="group-hover:hidden group-focus-visible:hidden">Applied</span>
                      <span className="hidden group-hover:inline group-focus-visible:inline">Remove</span>
                    </>
                  ) : withinReach ? (
                    // Not "Unavailable": this one is within reach, and saying
                    // how much is left is more useful than a dead end.
                    <span className="tabular-nums">{formatInr(shortfallPaise)} away</span>
                  ) : unavailable ? (
                    "Unavailable"
                  ) : (
                    "Apply"
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
