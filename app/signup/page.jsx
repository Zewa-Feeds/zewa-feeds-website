"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FloatingInput } from "@/components/checkout/FloatingInput";
import AuthShell from "@/components/account/AuthShell";
import { FormMessage, PasswordToggle, PrimaryButton } from "@/components/account/ui";
import { PasswordStrength, validatePassword } from "@/components/account/PasswordStrength";
import { useAuth, safeNext } from "@/lib/authContext";
import { ApiError } from "@/lib/api";

/**
 * Create an account.
 *
 * Registration signs the customer straight in — the API returns a session with
 * the 201, so making someone re-enter the password they just chose would be
 * friction with nothing behind it.
 *
 * Phone is optional here even though checkout requires it. Asking for everything
 * up front is what makes signup forms feel like paperwork; the address step
 * collects it when it is actually needed.
 */
function SignUpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { signUp, isAuthenticated, isLoading, openAuthDrawer } = useAuth();
  const next = safeNext(params.get("next"));

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openAuthDrawer("signup");
    }
  }, [isLoading, isAuthenticated, openAuthDrawer]);

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

  const fieldError = (key, value, all) => {
    switch (key) {
      case "firstName":
        return value.trim() ? null : "Enter your first name.";
      case "lastName":
        return value.trim() ? null : "Enter your last name.";
      case "email":
        if (!value.trim()) return "Enter your email address.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
          ? null
          : "Enter a valid email address.";
      case "phone":
        if (!value.trim()) return null;
        return /^[6-9]\d{9}$/.test(value.trim().replace(/\s+/g, ""))
          ? null
          : "Enter a 10-digit mobile number.";
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        if (!value) return "Re-enter your password.";
        return value === all.password ? null : "Passwords do not match.";
      default:
        return null;
    }
  };

  const onBlur = (key) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: fieldError(key, form[key], form) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const found = {};
    for (const key of Object.keys(form)) {
      const msg = fieldError(key, form[key], form);
      if (msg) found[key] = msg;
    }
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(form).map((k) => [k, true])));
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await signUp({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        ...(form.phone.trim() ? { phone: form.phone.trim().replace(/\s+/g, "") } : {}),
        password: form.password,
      });
      window.location.href = next;
    } catch (err) {
      if (err instanceof ApiError && err.fields) {
        setErrors((prev) => ({ ...prev, ...err.fields }));
        setFormError(err.message);
      } else {
        setFormError(
          err instanceof ApiError
            ? err.message
            : "Something went wrong creating your account. Please try again.",
        );
      }
      setSubmitting(false);
    }
  };

  if (!isLoading && isAuthenticated) {
    return (
      <AuthShell
        eyebrow="Create account"
        title="Join Zewa Feeds."
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

  const shown = (key) => (touched[key] ? errors[key] : undefined);

  return (
    <AuthShell
      eyebrow="Create account"
      title="Join Zewa Feeds."
      subtitle="One account for your orders, addresses and reorders."
      footer={
        <>
          Already have an account?{" "}
          <a
            href={`/signin${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-semibold text-primary hover:underline"
          >
            Sign in
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

        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-3">
          <FloatingInput
            name="firstName"
            label="First name"
            value={form.firstName}
            onChange={setField("firstName")}
            onBlur={onBlur("firstName")}
            error={shown("firstName")}
            autoComplete="given-name"
            required
          />
          <FloatingInput
            name="lastName"
            label="Last name"
            value={form.lastName}
            onChange={setField("lastName")}
            onBlur={onBlur("lastName")}
            error={shown("lastName")}
            autoComplete="family-name"
            required
          />
        </div>

        <FloatingInput
          name="email"
          type="email"
          label="Email address"
          value={form.email}
          onChange={setField("email")}
          onBlur={onBlur("email")}
          error={shown("email")}
          autoComplete="email"
          required
        />

        <FloatingInput
          name="phone"
          type="tel"
          label="Mobile number"
          value={form.phone}
          onChange={setField("phone")}
          onBlur={onBlur("phone")}
          error={shown("phone")}
          hint="Optional — used for delivery updates"
          autoComplete="tel"
          inputMode="numeric"
          maxLength={10}
        />

        <div className="relative">
          <FloatingInput
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={form.password}
            onChange={setField("password")}
            onBlur={onBlur("password")}
            error={shown("password")}
            autoComplete="new-password"
            required
          />
          <PasswordToggle
            visible={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
        </div>
        <PasswordStrength value={form.password} />

        <div className="relative">
          <FloatingInput
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            label="Confirm password"
            value={form.confirmPassword}
            onChange={setField("confirmPassword")}
            onBlur={onBlur("confirmPassword")}
            error={shown("confirmPassword")}
            isValid={
              Boolean(form.confirmPassword) && form.confirmPassword === form.password
            }
            autoComplete="new-password"
            required
          />
        </div>

        <PrimaryButton type="submit" loading={submitting} className="mt-4">
          {submitting ? "Creating account" : "Create account"}
        </PrimaryButton>

        <p className="mt-4 text-center font-[Montserrat] text-[11px] leading-relaxed text-white/30">
          By creating an account you agree to our{" "}
          <a href="/terms" className="text-white/50 underline hover:text-primary">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-white/50 underline hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </AuthShell>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#06080f]" />}>
      <SignUpForm />
    </Suspense>
  );
}
