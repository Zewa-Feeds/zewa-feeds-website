"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, readConsent, writeConsent } from "@/lib/consent";

/**
 * Asks once whether analytics cookies may be used.
 *
 * "Accept all" loads Google Analytics (components/GoogleAnalytics.jsx).
 * "Essential only" keeps only what the shop needs to work: cart, sign-in,
 * checkout. Wording follows the common online-store pattern (Nov 2026). Both
 * buttons carry the same weight, so declining is as easy as accepting. The
 * footer's "Cookie settings" brings the banner back.
 *
 * Not shown on /preview (the CMS preview) or before the client has read
 * storage, so it never flashes on a visitor who already chose.
 */
export default function CookieBanner() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setOpen(readConsent() === null);
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!open || pathname?.startsWith("/preview")) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-[560px] rounded-2xl border border-white/10 bg-[#0b1120]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur sm:bottom-5 sm:p-5"
    >
      <p className="font-[Montserrat] text-[12.5px] leading-relaxed text-white/70">
        We use cookies to give you the best shopping experience and to improve our website. You can
        accept all cookies or keep only the essential ones.{" "}
        <a href="/privacy#cookies" className="text-primary underline-offset-2 hover:underline">
          Cookie policy
        </a>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => writeConsent("denied")}
          className="flex-1 border border-white/20 px-4 py-2 font-button text-[11px] uppercase tracking-wider text-white/80 transition-colors hover:border-white/40 hover:text-white"
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => writeConsent("granted")}
          className="flex-1 border border-primary bg-primary px-4 py-2 font-button text-[11px] uppercase tracking-wider text-on-primary transition-colors hover:bg-primary/90"
        >
          Accept all
        </button>
      </div>
    </div>
  );
}
