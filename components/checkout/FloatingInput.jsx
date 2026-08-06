"use client";

import React, { useState } from "react";
import { EASE } from "./tokens";

/**
 * Shared field chrome.
 *
 * Input and select must be visually indistinguishable at rest, on hover and on
 * focus — a form where the two drift apart looks unfinished. Keeping the class
 * strings in one place is what guarantees that.
 */
const fieldBase =
  "w-full rounded-xl border bg-[#090f1d] text-[14px] font-[Montserrat] focus:outline-none";

const fieldState = ({ error, isFocused, disabled }) =>
  [
    error
      ? "border-red-500/50 bg-red-500/[0.04] focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
      : isFocused
      ? "border-primary/60 bg-[#0f192b] shadow-[0_0_0_3px_rgba(68,229,194,0.10)]"
      : "border-white/10 hover:border-white/20 hover:bg-[#0c1424]",
    disabled ? "opacity-50 cursor-not-allowed" : "",
  ].join(" ");

/**
 * Floating label position.
 *
 * The label sits on top of the border when raised, so it carries the field's
 * own background colour to punch a gap in that border. That background must
 * track the focus state or the label appears to sit in a mismatched swatch.
 */
const labelClasses = ({ isFloating, error, isFocused, icon }) =>
  [
    "absolute pointer-events-none origin-top-left font-[Montserrat]",
    EASE,
    icon ? (isFloating ? "left-3" : "left-10") : "left-3.5",
    isFloating
      ? `-top-2.5 text-[11px] font-semibold uppercase tracking-wider px-1.5 rounded ${
          error
            ? "text-red-400 bg-[#090f1d]"
            : isFocused
            ? "text-primary bg-[#0f192b]"
            : "text-white/50 bg-[#090f1d]"
        }`
      : "top-3.5 text-[13px] font-normal text-white/35",
  ].join(" ");

/**
 * Validation message.
 *
 * Rendered in a fixed-height slot that is always present, so a message
 * appearing or clearing never reflows the fields below it — a form that jumps
 * while you type feels broken, and on mobile it can move the submit button
 * out from under a thumb mid-tap.
 */
function FieldMessage({ id, error, hint }) {
  if (!error && !hint) return null;

  return (
    <div className="min-h-[15px] pl-1">
      <p
        id={id}
        className={`text-[11px] font-[Montserrat] ${EASE} ${
          error
            ? "translate-y-0 text-red-400 opacity-100"
            : "translate-y-0 text-[10px] text-white/35 opacity-100"
        }`}
      >
        {error || hint}
      </p>
    </div>
  );
}

export function FloatingInput({
  id,
  name,
  type = "text",
  label,
  value = "",
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  autoComplete,
  maxLength,
  placeholder,
  icon,
  isValid,
  loading = false,
  inputMode,
  disabled = false,
  className = "",
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || (value !== undefined && value !== null && String(value).length > 0);
  const fieldId = id || name;
  const messageId = `${fieldId}-message`;

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className={`relative flex flex-col gap-1 ${className}`}>
      <div className="relative flex items-center">
        {icon && (
          <div
            aria-hidden="true"
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${EASE} ${
              error ? "text-red-400/70" : isFocused ? "text-primary" : "text-white/30"
            }`}
          >
            {icon}
          </div>
        )}

        <input
          id={fieldId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={isFocused ? placeholder : ""}
          aria-invalid={Boolean(error)}
          /*
           * Always point at the single message slot. Previously this switched
           * to the hint id when no error was set, so the id referenced an
           * element that did not exist and screen readers announced nothing.
           */
          aria-describedby={error || hint ? messageId : undefined}
          className={`${fieldBase} text-white/90 ${EASE} ${
            icon ? "pl-10 pr-10" : "px-4 pr-10"
          } py-3.5 ${fieldState({ error, isFocused, disabled })}`}
          {...props}
        />

        <label htmlFor={fieldId} className={labelClasses({ isFloating, error, isFocused, icon })}>
          {label}
          {required && (
            <span className="ml-1 text-primary" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {/*
          Status icon — at most ONE ever shows.

          Loading outranks the others: while a lookup is in flight the field's
          validity is not yet settled, so showing a tick next to a spinner
          would be both cluttered and premature.
        */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          {loading ? (
            <span
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent motion-reduce:animate-none"
              role="status"
              aria-label="Checking"
            />
          ) : error ? (
            <svg
              className={`h-4 w-4 scale-100 text-red-400 ${EASE}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : isValid ? (
            <svg
              className={`h-4 w-4 scale-100 text-primary ${EASE}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </div>
      </div>

      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}

export function FloatingSelect({
  id,
  name,
  label,
  value = "",
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  options = [],
  icon,
  className = "",
  disabled = false,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || Boolean(value);
  const fieldId = id || name;
  const messageId = `${fieldId}-message`;

  /* The chevron tracks focus, matching the input's icon behaviour. */
  const chevron = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
      isFocused ? "rgb(68,229,194)" : "rgba(255,255,255,0.4)"
    }' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>`,
  );

  return (
    <div className={`relative flex flex-col gap-1 ${className}`}>
      <div className="relative flex items-center">
        {icon && (
          <div
            aria-hidden="true"
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${EASE} ${
              error ? "text-red-400/70" : isFocused ? "text-primary" : "text-white/30"
            }`}
          >
            {icon}
          </div>
        )}

        <select
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? messageId : undefined}
          className={`${fieldBase} cursor-pointer appearance-none ${EASE} ${
            icon ? "pl-10 pr-10" : "px-4 pr-10"
          } py-3.5 ${
            value ? "font-medium text-white/90" : "text-transparent"
          } ${fieldState({ error, isFocused, disabled })}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,${chevron}")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 14px center",
            backgroundSize: "16px 16px",
          }}
          {...props}
        >
          <option value="" disabled className="bg-[#090f1d] text-white/30">
            Select {label}
          </option>
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const lbl = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={val} value={val} className="bg-[#0c1526] py-2 text-white/90">
                {lbl}
              </option>
            );
          })}
        </select>

        <label htmlFor={fieldId} className={labelClasses({ isFloating, error, isFocused, icon })}>
          {label}
          {required && (
            <span className="ml-1 text-primary" aria-hidden="true">
              *
            </span>
          )}
        </label>
      </div>

      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}
