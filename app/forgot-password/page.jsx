"use client";

import { useState } from "react";
import { FloatingInput } from "@/components/checkout/FloatingInput";
import AuthShell from "@/components/account/AuthShell";
import { FormMessage, PrimaryButton } from "@/components/account/ui";
import { account as accountApi, ApiError } from "@/lib/api";

/**
 * Request a reset link.
 *
 * The success screen is shown for ANY accepted submission, including addresses
 * with no account. That mirrors the API, which deliberately answers identically
 * either way — telling a visitor "no account with that email" would turn this
 * form into a way to discover who shops here.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const trimmed = email.trim();
    if (!trimmed) return setError("Enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
      return setError("Enter a valid email address.");

    setSubmitting(true);
    setError(null);
    setFormError(null);
    try {
      await accountApi.forgotPassword(trimmed);
      setSent(true);
    } catch (err) {
      // Only genuine failures (network, rate limit) reach here.
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Could not send the reset link. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <AuthShell
        eyebrow="Check your inbox"
        title="Reset link sent."
        subtitle="If that email has an account with us, a link to choose a new password is on its way."
        footer={
          <a href="/signin" className="font-semibold text-primary hover:underline">
            Back to sign in
          </a>
        }
      >
        <div className="flex flex-col items-center py-4 text-center">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/[0.07] text-primary">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path
                d="M3 7l9 6 9-6M3 6.5h18v11H3v-11z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="font-[Montserrat] text-[13px] leading-relaxed text-white/50">
            We sent it to <span className="text-white">{email.trim()}</span>. The link is
            valid for 60 minutes and can be used once.
          </p>
          <p className="mt-4 font-[Montserrat] text-[12px] leading-relaxed text-white/30">
            Nothing arrived? Check your spam folder, or{" "}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-primary/80 underline hover:text-primary"
            >
              try another address
            </button>
            .
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Password reset"
      title="Forgot your password?"
      subtitle="Enter the email on your account and we'll send you a link to choose a new one."
      footer={
        <>
          Remembered it?{" "}
          <a href="/signin" className="font-semibold text-primary hover:underline">
            Back to sign in
          </a>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-1">
        {formError && (
          <div className="mb-3">
            <FormMessage>{formError}</FormMessage>
          </div>
        )}

        <FloatingInput
          name="email"
          type="email"
          label="Email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          error={error}
          autoComplete="email"
          required
        />

        <PrimaryButton type="submit" loading={submitting} className="mt-4">
          {submitting ? "Sending" : "Send reset link"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
