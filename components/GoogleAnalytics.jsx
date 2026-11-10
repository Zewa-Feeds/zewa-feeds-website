"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-GNFXXB2PKY";

/**
 * Google Analytics 4 (gtag.js), as given by the GA property's setup screen.
 *
 * Loads ONLY after the visitor accepts analytics cookies in the cookie banner
 * (components/CookieBanner.jsx). Before that, no Google script runs and no
 * _ga cookie is set. Production builds only, so local development never
 * shows up as traffic. Client-side navigations are counted by GA4's enhanced
 * measurement, so no per-route page_view call is needed.
 *
 * Withdrawing consent stops collection from the next page load. The script
 * can't be unloaded from a page that has already run it.
 */
export default function GoogleAnalytics() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const sync = () => setGranted(readConsent() === "granted");
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (process.env.NODE_ENV !== "production" || !GA_MEASUREMENT_ID || !granted) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
