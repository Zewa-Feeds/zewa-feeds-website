"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FloatingInput } from "@/components/checkout/FloatingInput";
import AuthShell from "@/components/account/AuthShell";
import { FormMessage, PasswordToggle, PrimaryButton } from "@/components/account/ui";
import { PasswordStrength, validatePassword } from "@/components/account/PasswordStrength";
import { useAuth } from "@/lib/authContext";
import { ApiError } from "@/lib/api";

/**
 * Choose a new password from an emailed link.
 *
 * The token arrives as `?token=` and is never displayed or logged. On success the
 * API returns a session, so the customer lands signed in on their account rather
 * than at a login form.
 */
function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { completeReset } = useAuth();

  const token = params.get("token") ?? "";

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* A link with no token cannot be completed — say so instead of failing on submit. */
  if (!token) {
    return (
      <AuthShell
        eyebrow="Password reset"
        title="This link is incomplete."
        subtitle="The reset link is missing its token. It may have been cut short by your email client."
        footer={
          <a href="/forgot-password" className="font-semibold text-primary hover:underline">
            Request a new link
          </a>
        }
      >
        <FormMessage>
          Open the link directly from your email, or request a fresh one — reset links
          expire after 60 minutes.
        </FormMessage>
      </AuthShell>
    );
  }

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (formError) setFormError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const found = {};
    const pwError = validatePassword(form.password);
    if (pwError) found.password = pwError;
    if (!form.confirmPassword) found.confirmPassword = "Re-enter your new password.";
    else if (form.confirmPassword !== form.password)
      found.confirmPassword = "Passwords do not match.";

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await completeReset({ token, password: form.password });
      router.replace("/account");
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Could not reset your password. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Password reset"
      title="Choose a new password."
      subtitle="Pick something you haven't used here before. You'll be signed in straight away."
      footer={
        <a href="/signin" className="font-semibold text-primary hover:underline">
          Back to sign in
        </a>
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-1">
        {formError && (
          <div className="mb-3">
            <FormMessage>{formError}</FormMessage>
          </div>
        )}

        <div className="relative">
          <FloatingInput
            name="password"
            type={showPassword ? "text" : "password"}
            label="New password"
            value={form.password}
            onChange={setField("password")}
            error={errors.password}
            autoComplete="new-password"
            required
          />
          <PasswordToggle
            visible={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
        </div>
        <PasswordStrength value={form.password} />

        <FloatingInput
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          label="Confirm new password"
          value={form.confirmPassword}
          onChange={setField("confirmPassword")}
          error={errors.confirmPassword}
          isValid={Boolean(form.confirmPassword) && form.confirmPassword === form.password}
          autoComplete="new-password"
          required
        />

        <PrimaryButton type="submit" loading={submitting} className="mt-4">
          {submitting ? "Updating" : "Update password"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#06080f]" />}>
      <ResetForm />
    </Suspense>
  );
}
