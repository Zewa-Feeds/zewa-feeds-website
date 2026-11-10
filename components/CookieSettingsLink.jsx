"use client";

import { resetConsent } from "@/lib/consent";

/** Footer link that re-opens the cookie banner, so a choice can be changed. */
export default function CookieSettingsLink({ className = "" }) {
  return (
    <button type="button" onClick={resetConsent} className={className}>
      Cookie settings
    </button>
  );
}
