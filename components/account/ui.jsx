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

/** Panel used for auth cards and account sections. Matches the checkout card. */
export const PANEL =
  "rounded-3xl border border-white/10 bg-[#090f1d]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.36)]";

/** Primary action. Mint fill, dark ink — the site's main CTA treatment. */
export function PrimaryButton({ children, loading = false, className = "", ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-[Montserrat] text-[12px] font-bold uppercase tracking-[0.18em] text-on-primary ${EASE} ${FOCUS_RING} hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55 ${className}`}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-on-primary/40 border-t-on-primary motion-reduce:animate-none"
        />
      )}
      {children}
    </button>
  );
}

/** Secondary action — outlined, for destructive or lesser choices. */
export function GhostButton({ children, className = "", tone = "default", ...props }) {
  const tones = {
    default: "border-white/15 text-white/70 hover:border-primary/50 hover:text-primary",
    danger: "border-red-500/30 text-red-400/80 hover:border-red-500/60 hover:text-red-400",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 font-[Montserrat] text-[11px] font-semibold uppercase tracking-[0.16em] ${EASE} ${FOCUS_RING} disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * Form-level message.
 *
 * `role="alert"` on errors so a screen reader announces a failed submit — the
 * visual banner alone leaves non-sighted users with a form that silently did
 * nothing.
 */
export function FormMessage({ tone = "error", children }) {
  if (!children) return null;
  const isError = tone === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 font-[Montserrat] text-[12px] leading-relaxed ${
        isError
          ? "border-red-500/25 bg-red-500/[0.06] text-red-300"
          : "border-primary/25 bg-primary/[0.06] text-primary"
      }`}
    >
      <svg viewBox="0 0 20 20" className="mt-[1px] h-3.5 w-3.5 shrink-0" fill="none" aria-hidden="true">
        {isError ? (
          <path
            d="M10 6.5v4m0 3h.01M10 2.5l7.5 13h-15l7.5-13z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M5 10.5l3.5 3.5L15 7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <span>{children}</span>
    </div>
  );
}

/** Small caps section label with the site's mint rule. */
export function EyebrowLabel({ children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-6 bg-primary" />
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
      className={`animate-pulse rounded-xl bg-white/[0.06] motion-reduce:animate-none ${className}`}
    />
  );
}

/** Empty state — icon, line, optional action. */
export function EmptyState({ icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-primary/60">
          {icon}
        </div>
      )}
      <p className="font-[Playfair_Display] text-[19px] text-white">{title}</p>
      {body && (
        <p className="mt-2 max-w-sm font-[Montserrat] text-[13px] leading-relaxed text-white/40">{body}</p>
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
export function PasswordToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onToggle}
      aria-label={visible ? "Hide password" : "Show password"}
      className={`absolute right-3 top-[26px] z-10 -translate-y-1/2 rounded-lg p-1.5 text-white/35 ${EASE} hover:text-primary`}
    >
      {visible ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
          <path
            d="M3 3l18 18M10.6 10.7a2 2 0 002.8 2.8M9.4 5.2A9.6 9.6 0 0112 5c5 0 9 4.5 9 7a12 12 0 01-2.4 3.3M6.2 6.7A12.3 12.3 0 003 12c0 2.5 4 7 9 7a9.9 9.9 0 003.4-.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
          <path d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7z" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )}
    </button>
  );
}
