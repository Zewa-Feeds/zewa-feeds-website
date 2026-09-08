"use client";

import { formatInr } from "@/lib/api";

/**
 * Offers the shop is advertising, straight from the server's opt-in list.
 *
 * A shopper cannot use a code they have never heard of, and listing them beats
 * hoping they saw an Instagram story. Private referral and influencer codes are
 * excluded server-side, so nothing personal is ever published by this panel.
 *
 * Presentational only. What tapping a code DOES is the caller's decision:
 * checkout fills its coupon input so the shopper confirms with Apply, while the
 * cart applies straight away. Sharing the markup keeps the two identical to
 * look at without forcing the same interaction on both.
 */
export default function AvailableOffers({
  offers = [],
  appliedCodes = [],
  onSelect,
  disabled = false,
}) {
  if (offers.length === 0) return null;

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
        {offers.map((offer) => {
          const alreadyOn = appliedCodes.includes(offer.code);
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

          return (
            <li key={offer.code}>
              <button
                type="button"
                disabled={alreadyOn || disabled}
                onClick={() => onSelect?.(offer.code)}
                className="group flex w-full items-center gap-2.5 rounded-lg border border-dashed border-primary/25 bg-primary/[0.04] px-2.5 py-2 text-left transition-all hover:border-primary/50 hover:bg-primary/10 disabled:cursor-default disabled:opacity-45 disabled:hover:border-primary/25 disabled:hover:bg-primary/[0.04]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-mono text-[12px] font-bold uppercase tracking-wider text-primary">
                      {offer.code}
                    </span>
                    <span className="text-[11.5px] font-semibold text-white/85 font-[Montserrat]">
                      {offer.discountLabel}
                    </span>
                  </div>
                  {conditions.length > 0 && (
                    <p className="mt-0.5 text-[10.5px] text-white/40 font-[Montserrat]">
                      {conditions.join(" · ")}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-primary/70 font-[Montserrat] group-hover:text-primary">
                  {alreadyOn ? "Applied" : "Use"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
