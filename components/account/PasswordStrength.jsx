"use client";

import { EASE } from "@/components/checkout/tokens";

/**
 * Password strength.
 *
 * The backend's rule is the only HARD requirement (8–72 characters, enforced in
 * account.routes.ts). This meter is advice on top of that, so the two can never
 * disagree about whether a password is acceptable — the bar reads "Weak" but the
 * form still submits, because inventing a stricter client-side gate would reject
 * passwords the API is perfectly happy with.
 *
 * Scored on variety and length rather than a dictionary check: a real strength
 * estimator (zxcvbn and friends) costs hundreds of kilobytes, which is a poor
 * trade on a storefront where the server already rate-limits guessing.
 */

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

/** Shared with the signup and reset forms so their rules cannot drift apart. */
export function validatePassword(value) {
  if (!value) return "Choose a password.";
  if (value.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (value.length > PASSWORD_MAX) return `Use ${PASSWORD_MAX} characters or fewer.`;
  return null;
}

/** 0–4. Length carries the most weight, because in practice it matters most. */
export function scorePassword(value) {
  if (!value) return 0;
  let score = 0;
  if (value.length >= PASSWORD_MIN) score += 1;
  if (value.length >= 12) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score += 1;
  return Math.min(score, 4);
}

const LEVELS = [
  { label: "Too short", color: "bg-white/15", text: "text-white/35" },
  { label: "Weak", color: "bg-red-500/70", text: "text-red-400" },
  { label: "Fair", color: "bg-amber-500/70", text: "text-amber-400" },
  { label: "Good", color: "bg-primary/70", text: "text-primary/80" },
  { label: "Strong", color: "bg-primary", text: "text-primary" },
];

export function PasswordStrength({ value }) {
  /*
   * Reserve the row's height even when empty. Without this the whole form
   * shifts down the instant the first character is typed, which on mobile can
   * move the submit button out from under a thumb.
   */
  if (!value) return <div className="h-[26px]" aria-hidden="true" />;

  const score = scorePassword(value);
  const level = LEVELS[score];

  return (
    <div className="flex h-[26px] items-center gap-3 pl-1">
      <div className="flex flex-1 gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-[3px] flex-1 rounded-full ${EASE} ${
              i < score ? level.color : "bg-white/10"
            }`}
          />
        ))}
      </div>
      {/*
        aria-live so the strength is announced as it changes — the coloured bars
        alone convey nothing to a screen reader.
      */}
      <span
        aria-live="polite"
        className={`font-[Montserrat] text-[10px] font-semibold uppercase tracking-[0.14em] ${level.text}`}
      >
        {level.label}
      </span>
    </div>
  );
}
