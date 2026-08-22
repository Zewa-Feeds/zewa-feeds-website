"use client";

import { EASE, FOCUS_RING } from "@/components/checkout/tokens";

/**
 * Shared chrome for the auth and account screens.
 *
 * These deliberately import the CHECKOUT tokens rather than defining a parallel
 * set. Sign-in, checkout and the account dashboard are the three "task" surfaces
 * of the site, and they should be visually indistinguishable — a second copy of
 * the same values would drift the moment one of them was tweaked.
 */

/** Panel used for auth cards and account sections. Solid background, no bleed-through. */
export const PANEL =
  "rounded-3xl border border-white/10 bg-[#09101f] shadow-[0_20px_50px_rgba(0,0,0,0.6)]";

/** Primary action. Mint gradient fill with subtle glow and active scale. */
export function PrimaryButton({ children, loading = false, className = "", ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#44e5c2] to-[#2bd4b1] px-6 py-3.5 font-[Montserrat] text-[12px] font-bold uppercase tracking-[0.18em] text-[#00382d] shadow-[0_0_20px_rgba(68,229,194,0.25)] ${EASE} ${FOCUS_RING} hover:from-[#52ebd0] hover:to-[#38e0bd] hover:shadow-[0_0_30px_rgba(68,229,194,0.4)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${className}`}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#00382d]/40 border-t-[#00382d] motion-reduce:animate-none"
        />
      )}
      {children}
    </button>
  );
}

/** Secondary action — glassmorphic outlined button for secondary choices. */
export function GhostButton({ children, className = "", tone = "default", ...props }) {
  const tones = {
    default: "border-white/15 bg-white/[0.02] text-white/80 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_15px_rgba(68,229,194,0.15)]",
    danger: "border-red-500/30 bg-red-500/[0.03] text-red-400 hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-300",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 font-[Montserrat] text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-200 ${EASE} ${FOCUS_RING} disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

/** Form-level alert / message banner. */
export function FormMessage({ tone = "error", children }) {
  if (!children) return null;
  const isError = tone === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 font-[Montserrat] text-[12px] leading-relaxed shadow-sm ${
        isError
          ? "border-red-500/30 bg-red-500/[0.08] text-red-200"
          : "border-primary/35 bg-primary/[0.08] text-primary"
      }`}
    >
      <svg viewBox="0 0 20 20" className="mt-[1px] h-4 w-4 shrink-0" fill="none" aria-hidden="true">
        {isError ? (
          <path
            d="M10 6.5v4m0 3h.01M10 2.5l7.5 13h-15l7.5-13z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M5 10.5l3.5 3.5L15 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <span>{children}</span>
    </div>
  );
}

/** Small caps section label with glowing mint bar. */
export function EyebrowLabel({ children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-[2px] w-6 rounded-full bg-primary shadow-[0_0_8px_rgba(68,229,194,0.6)]" />
      <span className="font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
        {children}
      </span>
    </div>
  );
}

/** Skeleton block for loading states. */
export function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-white/[0.08] motion-reduce:animate-none ${className}`}
    />
  );
}

/** Empty state — styled icon, text, optional CTA action. */
export function EmptyState({ icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary shadow-[0_0_20px_rgba(68,229,194,0.15)]">
          {icon}
        </div>
      )}
      <p className="font-[Playfair_Display] text-[20px] font-medium text-white">{title}</p>
      {body && (
        <p className="mt-2 max-w-sm font-[Montserrat] text-[13px] leading-relaxed text-white/45">{body}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/**
 * Password visibility toggle.
 *
 * Sits inside the field's right gutter. `tabIndex={-1}` keeps it out of the tab
 * order so keyboard users move field → field → submit rather than being
 * interrupted by a control they mostly do not want.
 */
export function PasswordToggle({ visible, onToggle, className = "" }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onToggle}
      aria-label={visible ? "Hide password" : "Show password"}
      className={`absolute right-3 top-[26px] z-20 -translate-y-1/2 flex items-center justify-center rounded-lg p-1.5 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-primary active:scale-95 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${className}`}
    >
      {visible ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden="true">
          <path
            d="M3 3l18 18M10.6 10.7a2 2 0 002.8 2.8M9.4 5.2A9.6 9.6 0 0112 5c5 0 9 4.5 9 7a12 12 0 01-2.4 3.3M6.2 6.7A12.3 12.3 0 003 12c0 2.5 4 7 9 7a9.9 9.9 0 003.4-.6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden="true">
          <path
            d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
        </svg>
      )}
    </button>
  );
}
