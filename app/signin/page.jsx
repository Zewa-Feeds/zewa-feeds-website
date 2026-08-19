"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FloatingInput } from "@/components/checkout/FloatingInput";
import AuthShell from "@/components/account/AuthShell";
import { FormMessage, PasswordToggle, PrimaryButton } from "@/components/account/ui";
import { useAuth, safeNext } from "@/lib/authContext";
import { ApiError } from "@/lib/api";

/**
 * Sign in.
 *
 * `?next=` carries the customer back to whatever they were doing — most often
 * checkout. It is run through `safeNext` before any navigation, so a crafted
 * link cannot turn this page into an open redirect.
 */
function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn, isAuthenticated, isLoading } = useAuth();

  const next = safeNext(params.get("next"));
  const justReset = params.get("reset") === "1";
  const justRegistered = params.get("registered") === "1";

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /*
   * Someone already signed in has no business on this page — bounce them to
   * wherever they were headed. Waits for `isLoading` to settle so the redirect
   * is not made on an unknown session.
   */
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = next;
    }
  }, [isLoading, isAuthenticated, next]);

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (formError) setFormError(null);
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Enter your password.";
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await signIn({ email: form.email.trim(), password: form.password, remember });
      window.location.href = next;
    } catch (err) {
      if (err instanceof ApiError && err.fields) {
        setErrors(err.fields);
        setFormError(err.message);
      } else {
        setFormError(
          err instanceof ApiError
            ? err.message
            : "Something went wrong signing you in. Please try again.",
        );
      }
      setSubmitting(false);
    }
  };

  if (!isLoading && isAuthenticated) {
    return (
      <AuthShell
        eyebrow="Account"
        title="Welcome back."
        subtitle="You are currently signed in."
      >
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-4" />
          <p className="font-[Montserrat] text-[14px] font-bold text-white">Signed in successfully</p>
          <p className="font-[Montserrat] text-[12.5px] text-white/50 mt-1">Redirecting to your account...</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Welcome back."
      subtitle="Sign in to track orders, reorder in a tap and manage your delivery addresses."
      footer={
        <>
          New to Zewa Feeds?{" "}
          <a
            href={`/signup${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </a>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-1">
        {justReset && (
          <div className="mb-3">
            <FormMessage tone="success">
              Your password has been updated. Sign in with your new password.
            </FormMessage>
          </div>
        )}
        {justRegistered && (
          <div className="mb-3">
            <FormMessage tone="success">Account created — sign in to continue.</FormMessage>
          </div>
        )}
        {formError && (
          <div className="mb-3">
            <FormMessage>{formError}</FormMessage>
          </div>
        )}

        <FloatingInput
          name="email"
          type="email"
          label="Email address"
          value={form.email}
          onChange={setField("email")}
          error={errors.email}
          autoComplete="email"
          required
        />

        <div className="relative">
          <FloatingInput
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={form.password}
            onChange={setField("password")}
            error={errors.password}
            autoComplete="current-password"
            required
          />
          <PasswordToggle
            visible={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
        </div>

        <div className="mb-5 mt-1 flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2.5 font-[Montserrat] text-[12px] text-white/50">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-3.5 w-3.5 cursor-pointer accent-[#44e5c2]"
            />
            Keep me signed in
          </label>
          <a
            href="/forgot-password"
            className="font-[Montserrat] text-[12px] text-white/45 transition-colors hover:text-primary"
          >
            Forgot password?
          </a>
        </div>

        <PrimaryButton type="submit" loading={submitting}>
          {submitting ? "Signing in" : "Sign in"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}

/**
 * useSearchParams needs a Suspense boundary, otherwise the whole route opts out
 * of static rendering at build time.
 */
export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#06080f]" />}>
      <SignInForm />
    </Suspense>
  );
}
