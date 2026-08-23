"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthShell from "@/components/account/AuthShell";
import { account as accountApi, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/authContext";

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const { refresh } = useAuth();

  const [state, setState] = useState({
    status: token ? "verifying" : "invalid",
    message: token ? "Verifying your email address…" : "Verification link is missing or malformed.",
    email: "",
  });

  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState(null);

  useEffect(() => {
    if (!token) return;

    let mounted = true;
    (async () => {
      try {
        const res = await accountApi.verifyEmail(token);
        if (!mounted) return;

        if (res?.alreadyVerified) {
          setState({
            status: "already_verified",
            message: "Your email address is already verified. You can sign in to your account.",
            email: "",
          });
          return;
        }

        if (res?.verified) {
          await refresh();
          setState({
            status: "success",
            message: "Your email address has been verified successfully! Your account is now active.",
            email: res.customer?.email || "",
          });
        }
      } catch (err) {
        if (!mounted) return;

        if (err instanceof ApiError && err.code === "TOKEN_EXPIRED") {
          setState({
            status: "expired",
            message: "This verification link has expired. Verification links are valid for 24 hours.",
            email: err.details?.email || "",
          });
          if (err.details?.email) {
            setResendEmail(err.details.email);
          }
        } else {
          setState({
            status: "invalid",
            message:
              err instanceof ApiError
                ? err.message
                : "This verification link is invalid or has already been used.",
            email: "",
          });
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token, refresh]);

  const handleResend = async (e) => {
    e?.preventDefault?.();
    const targetEmail = resendEmail.trim() || state.email.trim();
    if (!targetEmail || resending) return;

    setResending(true);
    setResendMessage(null);
    try {
      await accountApi.resendVerification(targetEmail);
      setResendMessage("If an unverified account exists for that email, a new link has been sent.");
    } catch {
      setResendMessage("Could not send verification email. Please try again in a few moments.");
    } finally {
      setResending(false);
    }
  };

  // 1. VERIFYING IN PROGRESS
  if (state.status === "verifying") {
    return (
      <AuthShell
        eyebrow="Verification"
        title="Verifying your email"
        subtitle="Confirming your account with Zewa Feeds..."
      >
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="relative flex items-center justify-center mb-6">
            <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin shadow-[0_0_24px_rgba(68,229,194,0.3)]" />
            <div className="absolute h-8 w-8 rounded-full bg-primary/20 animate-ping" />
          </div>
          <p className="font-[Montserrat] text-[15px] font-semibold text-white">
            Verifying your security token…
          </p>
          <p className="font-[Montserrat] text-[12.5px] text-white/50 mt-1">
            Please keep this window open while we activate your account.
          </p>
        </div>
      </AuthShell>
    );
  }

  // 2. VERIFIED SUCCESS
  if (state.status === "success") {
    return (
      <AuthShell
        eyebrow="Account Activated"
        title="Email Verified!"
        subtitle="Your Zewa Feeds account is now active and ready to use."
        footer={
          <a href="/account" className="font-semibold text-primary hover:underline">
            Go to My Account &rarr;
          </a>
        }
      >
        <div className="flex flex-col items-center gap-6 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-primary/40 bg-primary/15 text-primary shadow-[0_0_32px_rgba(68,229,194,0.3)]">
            <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 13l4 4L19 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="space-y-2">
            <p className="font-[Montserrat] text-[14px] leading-relaxed text-white/80">
              {state.message}
            </p>
            <p className="font-[Montserrat] text-[12.5px] leading-relaxed text-white/50">
              You now have access to member benefits, saved delivery addresses, and real-time order tracking.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row">
            <a
              href="/account"
              className="flex-1 rounded-xl bg-primary py-3 text-center text-[12px] font-bold uppercase tracking-[0.16em] text-[#00382d] font-[Montserrat] shadow-[0_4px_16px_rgba(68,229,194,0.25)] transition-all hover:bg-primary/90"
            >
              Go to Account
            </a>
            <a
              href="/products"
              className="flex-1 rounded-xl border border-white/15 bg-white/5 py-3 text-center text-[12px] font-bold uppercase tracking-[0.16em] text-white/80 font-[Montserrat] transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              Explore Products
            </a>
          </div>
        </div>
      </AuthShell>
    );
  }

  // 3. ALREADY VERIFIED
  if (state.status === "already_verified") {
    return (
      <AuthShell
        eyebrow="Account Status"
        title="Already Verified"
        subtitle="Your email address has already been verified."
        footer={
          <a href="/signin" className="font-semibold text-primary hover:underline">
            Sign in to your account &rarr;
          </a>
        }
      >
        <div className="flex flex-col items-center gap-6 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_24px_rgba(68,229,194,0.2)]">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <p className="font-[Montserrat] text-[14px] leading-relaxed text-white/80">
            {state.message}
          </p>

          <a
            href="/signin"
            className="w-full rounded-xl bg-primary py-3.5 text-center text-[12px] font-bold uppercase tracking-[0.16em] text-[#00382d] font-[Montserrat] shadow-[0_4px_16px_rgba(68,229,194,0.25)] transition-all hover:bg-primary/90"
          >
            Sign In Now
          </a>
        </div>
      </AuthShell>
    );
  }

  // 4. EXPIRED TOKEN OR INVALID TOKEN
  return (
    <AuthShell
      eyebrow="Verification Error"
      title={state.status === "expired" ? "Link Expired" : "Invalid Link"}
      subtitle={
        state.status === "expired"
          ? "This email verification link is no longer valid."
          : "We could not verify your email address with this link."
      }
      footer={
        <a href="/signin" className="font-semibold text-primary hover:underline">
          Back to Sign In
        </a>
      }
    >
      <div className="flex flex-col items-center gap-6 py-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.15)]">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <p className="font-[Montserrat] text-[14px] leading-relaxed text-white/70">
          {state.message}
        </p>

        <form onSubmit={handleResend} className="w-full space-y-4 pt-2 text-left">
          <div>
            <label htmlFor="resend-email" className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 font-[Montserrat] mb-2">
              Email Address
            </label>
            <input
              id="resend-email"
              type="email"
              required
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[14px] text-white placeholder:text-white/30 font-[Montserrat] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {resendMessage && (
            <div className="rounded-xl border border-primary/25 bg-primary/10 p-3 text-[12.5px] text-primary font-[Montserrat]">
              {resendMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={resending || !resendEmail.trim()}
            className="w-full rounded-xl bg-primary py-3.5 text-center text-[12px] font-bold uppercase tracking-[0.16em] text-[#00382d] font-[Montserrat] shadow-[0_4px_16px_rgba(68,229,194,0.25)] transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {resending ? "Sending New Link…" : "Resend Verification Link"}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthShell eyebrow="Verification" title="Loading…" subtitle="Please wait a moment.">
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </AuthShell>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
