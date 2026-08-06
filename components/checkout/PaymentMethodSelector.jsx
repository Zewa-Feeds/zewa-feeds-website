"use client";

import React from "react";
import { EASE } from "./tokens";

/**
 * Payment method selection.
 *
 * Currently Razorpay-only by product decision. It is still built as a real
 * radiogroup rather than a static panel: the semantics are what make it
 * accessible, and adding Cash on Delivery later becomes a data change (one more
 * entry in `methods`) instead of a rewrite.
 */

const CardIcon = (props) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      d="M3 10h18M7 15h2m4 0h4M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
    />
  </svg>
);

export default function PaymentMethodSelector({
  selectedMethod = "RAZORPAY",
  onSelectMethod,
}) {
  const methods = [
    {
      id: "RAZORPAY",
      title: "Pay Online",
      description:
        "UPI, cards, netbanking or wallets. You are redirected to Razorpay's secure window to finish payment.",
      badges: ["UPI", "GPay", "PhonePe", "Cards"],
      icon: CardIcon,
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Payment method"
      className="flex flex-col gap-3"
    >
      {methods.map((method) => {
        const selected = selectedMethod === method.id;
        const Icon = method.icon;

        return (
          <label
            key={method.id}
            className={`group relative block cursor-pointer rounded-2xl border p-5 sm:p-6 ${EASE} ${
              selected
                ? "border-primary/45 bg-[#0c1424] shadow-[0_4px_24px_rgba(68,229,194,0.10)]"
                : "border-white/10 bg-[#0a1120] hover:border-white/20 hover:bg-[#0c1424]"
            } focus-within:ring-2 focus-within:ring-primary/60 focus-within:ring-offset-2 focus-within:ring-offset-[#090f1d]`}
          >
            {/*
             * A real radio input, visually hidden but focusable: this is what
             * gives arrow-key navigation, screen-reader announcement and form
             * semantics for free. `peer` is not used because the styling above
             * keys off `selected`, which stays in sync with the input.
             */}
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selected}
              onChange={() => onSelectMethod?.(method.id)}
              className="sr-only"
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${EASE} ${
                    selected
                      ? "border-primary bg-primary/20"
                      : "border-white/25 group-hover:border-white/40"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full bg-primary ${EASE} ${
                      selected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}
                  />
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h3 className="text-[15px] font-semibold tracking-wide text-white font-[Montserrat]">
                      {method.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 max-w-prose text-[13px] leading-relaxed text-white/50 font-[Montserrat]">
                    {method.description}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-1.5 pl-8 sm:pl-0">
                {method.badges.map((badge, i) => (
                  <span
                    key={badge}
                    className={`rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold font-[Montserrat] ${
                      i === 0 ? "text-primary" : "text-white/80"
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

          </label>
        );
      })}
    </div>
  );
}
