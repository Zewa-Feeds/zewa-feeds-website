"use client";

import React from "react";

/**
 * Reassurance strip beneath the submit button.
 *
 * Placed where hesitation actually happens — right after someone reads the
 * total and before they commit. Each item answers a specific question a buyer
 * asks at that moment ("what if it's wrong?", "when does it arrive?", "how do
 * I know it worked?") rather than repeating the SSL claim already made in the
 * payment card and page header.
 */

const badges = [
  {
    title: "Easy returns",
    description: "7-day replacement on damaged or incorrect items",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    ),
  },
  {
    title: "Dispatched in 24 hours",
    description: "Tracking link sent by SMS and email",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
      />
    ),
  },
  {
    title: "Instant confirmation",
    description: "Order summary in your inbox within minutes",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
];

export default function TrustBadges() {
  return (
    <div className="rounded-2xl border border-white/6 bg-[#090f1d]/50 p-5">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {badges.map((badge) => (
          <li key={badge.title} className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {badge.icon}
              </svg>
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-white font-[Montserrat]">
                {badge.title}
              </h4>
              <p className="mt-0.5 text-[10px] leading-snug text-white/40 font-[Montserrat]">
                {badge.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
