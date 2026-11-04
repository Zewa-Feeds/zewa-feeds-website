import Script from "next/script";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-GNFXXB2PKY";

/**
 * Google Analytics 4 (gtag.js), as given by the GA property's setup screen.
 *
 * Production builds only, so local development never shows up as traffic.
 * Client-side navigations are counted by GA4's enhanced measurement ("page
 * changes based on browser history events", on by default), so no
 * per-route page_view call is needed.
 */
export default function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production" || !GA_MEASUREMENT_ID) return null;
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
