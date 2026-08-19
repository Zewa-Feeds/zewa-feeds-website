"use client";

import { useState } from "react";
import AccountShell, { AccountCard } from "@/components/account/AccountShell";
import { FloatingInput } from "@/components/checkout/FloatingInput";
import {
  FormMessage,
  GhostButton,
  PasswordToggle,
  PrimaryButton,
} from "@/components/account/ui";
import { PasswordStrength, validatePassword } from "@/components/account/PasswordStrength";
import { useAuth } from "@/lib/authContext";
import { account as accountApi, ApiError } from "@/lib/api";

/**
 * Account settings — change password, sign out.
 *
 * Changing a password requires the current one, which is what stops someone who
 * finds an unlocked laptop from locking the owner out of their own account.
 */
export default function SettingsPage() {
  const { customer, signOut } = useAuth();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (formError) setFormError(null);
    if (saved) setSaved(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const found = {};
    if (!form.currentPassword) found.currentPassword = "Enter your current password.";
    const pwError = validatePassword(form.newPassword);
    if (pwError) found.newPassword = pwError;
    else if (form.newPassword === form.currentPassword)
      found.newPassword = "Choose a password different from your current one.";
    if (!form.confirmPassword) found.confirmPassword = "Re-enter your new password.";
    else if (form.confirmPassword !== form.newPassword)
      found.confirmPassword = "Passwords do not match.";

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    setFormError(null);
    try {
      await accountApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSaved(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      if (err instanceof ApiError && err.fields) setErrors(err.fields);
      setFormError(
        err instanceof ApiError ? err.message : "Couldn't change your password. Try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountShell title="Settings" subtitle="Password and session.">
      <div className="flex flex-col gap-6">
        <AccountCard
          title="Change password"
          description="You'll stay signed in on this device."
        >
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 sm:gap-6">
            {formError && (
              <div className="mb-1">
                <FormMessage>{formError}</FormMessage>
              </div>
            )}
            {saved && (
              <div className="mb-1">
                <FormMessage tone="success">
                  Your password has been changed. We&rsquo;ve emailed you a confirmation.
                </FormMessage>
              </div>
            )}

            <FloatingInput
              name="currentPassword"
              type="password"
              label="Current password"
              value={form.currentPassword}
              onChange={setField("currentPassword")}
              error={errors.currentPassword}
              autoComplete="current-password"
              required
            />

            <div className="relative">
              <FloatingInput
                name="newPassword"
                type={showPassword ? "text" : "password"}
                label="New password"
                value={form.newPassword}
                onChange={setField("newPassword")}
                error={errors.newPassword}
                autoComplete="new-password"
                required
              />
              <PasswordToggle
                visible={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
              />
            </div>
            <PasswordStrength value={form.newPassword} />

            <FloatingInput
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              label="Confirm new password"
              value={form.confirmPassword}
              onChange={setField("confirmPassword")}
              error={errors.confirmPassword}
              isValid={
                Boolean(form.confirmPassword) && form.confirmPassword === form.newPassword
              }
              autoComplete="new-password"
              required
            />

            <div className="mt-4 sm:max-w-[220px]">
              <PrimaryButton type="submit" loading={saving}>
                {saving ? "Updating" : "Update password"}
              </PrimaryButton>
            </div>
          </form>
        </AccountCard>

        <AccountCard title="Session">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-[Montserrat] text-[13px] text-white/60">
                Signed in as <span className="text-white">{customer?.email}</span>
              </p>
              <p className="mt-1 font-[Montserrat] text-[11.5px] text-white/30">
                Signing out leaves your cart untouched on this device.
              </p>
            </div>
            <GhostButton
              tone="danger"
              /* No navigation here — AccountShell's guard sends us home once the
                 session clears. Doing both raced, and the guard won. */
              onClick={signOut}
              className="shrink-0"
            >
              Sign out
            </GhostButton>
          </div>
        </AccountCard>
      </div>
    </AccountShell>
  );
}
