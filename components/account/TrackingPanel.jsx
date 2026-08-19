"use client";

import { useState } from "react";
import { EASE, FOCUS_RING } from "@/components/checkout/tokens";

/**
 * Shipment tracking for a customer's order.
 *
 * Staff enter carrier, tracking number and (optionally) a tracking URL when they
 * mark an order shipped in the CMS. Those three land on the order and are what
 * this renders.
 *
 * Two things it deliberately does differently from the old inline block:
 *
 *   1. It shows if EITHER a URL or a number is present. The previous version was
 *      gated on the number alone, so a carrier that only gives a link — which is
 *      increasingly common — displayed nothing at all.
 *   2. The link is a real button, not a text link buried under the timeline.
 *      Tracking is the single thing a customer opens this page to do once an
 *      order is on its way, so it should read as the primary action.
 *
 * When there is no URL, the number gets a copy control instead: without a link
 * the customer's only route is pasting that number into the carrier's own site,
 * and long alphanumeric codes are exactly what people mistype.
 */
export default function TrackingPanel({ fulfilment, status }) {
  const [copied, setCopied] = useState(false);

  const carrier = fulfilment?.carrier?.trim() || null;
  const number = fulfilment?.trackingNumber?.trim() || null;
  const url = safeTrackingUrl(fulfilment?.trackingUrl);

  // Nothing to show until the order actually carries shipment details.
  if (!number && !url) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked (insecure context, denied permission) — the number is
         on screen and selectable, so this is a convenience, not the only route. */
    }
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-primary/25 bg-primary/[0.04]">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-primary" fill="none" aria-hidden="true">
              <path
                d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="7" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="17.5" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <p className="font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              {status === "DELIVERED" ? "Delivered by" : "On its way"}
            </p>
          </div>

          <p className="mt-2 font-[Montserrat] text-[13.5px] text-white/85">
            {carrier ?? "Your courier"}
          </p>

          {number && (
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[12.5px] text-white/55">{number}</span>
              <button
                type="button"
                onClick={copy}
                aria-label="Copy tracking number"
                className={`rounded-lg border border-white/10 px-2 py-0.5 font-[Montserrat] text-[10px] font-semibold uppercase tracking-[0.1em] text-white/45 ${EASE} ${FOCUS_RING} hover:border-primary/40 hover:text-primary`}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}
        </div>

        {url ? (
          <a
            href={url}
            target="_blank"
            /* noreferrer alongside noopener: the carrier should not receive this
               account page as a referrer, and it carries an order number. */
            rel="noopener noreferrer"
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-[Montserrat] text-[11px] font-bold uppercase tracking-[0.16em] text-on-primary ${EASE} ${FOCUS_RING} hover:bg-primary/90 active:scale-[0.99]`}
          >
            Track shipment
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M6 3h7v7M13 3L4 12"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ) : (
          /* No link from the carrier — say so, so the copy control reads as the
             intended next step rather than the customer waiting for a button. */
          <p className="shrink-0 font-[Montserrat] text-[11px] leading-relaxed text-white/30 sm:max-w-[180px] sm:text-right">
            Use this number on {carrier ? `${carrier}'s` : "the courier's"} website to
            follow your parcel.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Only http(s) links are rendered.
 *
 * The URL is staff-entered free text and ends up in an href. Without this a typo
 * or a paste of `javascript:…` would become a live link on a customer's page, so
 * anything that is not a well-formed http(s) URL is dropped rather than trusted.
 */
function safeTrackingUrl(raw) {
  const value = raw?.trim();
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : null;
  } catch {
    return null;
  }
}
