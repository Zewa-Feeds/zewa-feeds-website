/**
 * The visitor's analytics-cookie choice.
 *
 * "granted" | "denied" | null (not asked yet). Kept in localStorage, which is
 * the right place for a per-browser preference. Every read and write is
 * guarded, because storage can throw in private windows or when site data is
 * blocked, and then the visitor is simply treated as not having chosen.
 *
 * Only Google Analytics waits on this. Cart, sign-in and checkout storage is
 * strictly necessary. Tidio (the live-chat bubble) is a support service the
 * visitor uses directly, and the privacy policy names it.
 */
const KEY = "zewa_cookie_consent";
export const CONSENT_EVENT = "zewa:consent";

export function readConsent() {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(value) {
  try {
    if (value) window.localStorage.setItem(KEY, value);
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the choice holds for this page view only.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/** Re-open the banner (footer "Cookie settings"). */
export function resetConsent() {
  writeConsent(null);
}
