"use client";

import { useEffect, useState } from "react";
import AccountShell, { AccountCard } from "@/components/account/AccountShell";
import { FloatingInput } from "@/components/checkout/FloatingInput";
import { FormMessage, PrimaryButton } from "@/components/account/ui";
import { useAuth } from "@/lib/authContext";
import { account as accountApi, ApiError } from "@/lib/api";

/**
 * Edit profile.
 *
 * Email is shown but not editable: it keys order history (the API matches past
 * guest orders by address), so letting someone change it here would quietly
 * detach their own orders from their account. Changing it is a support action,
 * and the field says so rather than being mysteriously disabled.
 */
export default function ProfilePage() {
  const { customer, isAuthenticated, applyProfile } = useAuth();

  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  /* Seed the form once the profile arrives. */
  useEffect(() => {
    if (!customer) return;
    setForm({
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      phone: customer.phone ?? "",
    });
  }, [customer]);

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (formError) setFormError(null);
    if (saved) setSaved(false);
  };

  const validate = () => {
    const found = {};
    if (!form.firstName.trim()) found.firstName = "Enter your first name.";
    if (!form.lastName.trim()) found.lastName = "Enter your last name.";
    const phone = form.phone.trim().replace(/\s+/g, "");
    if (phone && !/^[6-9]\d{9}$/.test(phone))
      found.phone = "Enter a 10-digit mobile number.";
    return found;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    setFormError(null);
    try {
      const phone = form.phone.trim().replace(/\s+/g, "");
      const updated = await accountApi.update({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        // Only send phone when there is one — the API rejects an empty string.
        ...(phone ? { phone } : {}),
      });
      // Patch context so the header initials and greeting update immediately.
      applyProfile(updated);
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiError && err.fields) setErrors(err.fields);
      setFormError(
        err instanceof ApiError ? err.message : "Couldn't save your details. Try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const dirty =
    customer &&
    (form.firstName !== (customer.firstName ?? "") ||
      form.lastName !== (customer.lastName ?? "") ||
      form.phone !== (customer.phone ?? ""));

  return (
    <AccountShell title="Profile" subtitle="Your name and contact details.">
      <AccountCard title="Personal details">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 sm:gap-6">
          {formError && (
            <div className="mb-1">
              <FormMessage>{formError}</FormMessage>
            </div>
          )}
          {saved && (
            <div className="mb-1">
              <FormMessage tone="success">Your details have been saved.</FormMessage>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
            <FloatingInput
              name="firstName"
              label="First name"
              value={form.firstName}
              onChange={setField("firstName")}
              error={errors.firstName}
              autoComplete="given-name"
              required
            />
            <FloatingInput
              name="lastName"
              label="Last name"
              value={form.lastName}
              onChange={setField("lastName")}
              error={errors.lastName}
              autoComplete="family-name"
              required
            />
          </div>

          <FloatingInput
            name="phone"
            digitsOnly
            type="tel"
            label="Mobile number"
            value={form.phone}
            onChange={setField("phone")}
            error={errors.phone}
            hint="Used for delivery updates"
            autoComplete="tel"
            inputMode="numeric"
            maxLength={10}
          />

          <FloatingInput
            name="email"
            type="email"
            label="Email address"
            value={customer?.email ?? ""}
            onChange={() => {}}
            disabled
            readOnly
            hint="Your email keys your order history — contact us to change it."
          />

          <div className="mt-4 sm:max-w-[220px]">
            <PrimaryButton type="submit" loading={saving} disabled={!dirty}>
              {saving ? "Saving" : "Save changes"}
            </PrimaryButton>
          </div>
        </form>
      </AccountCard>
    </AccountShell>
  );
}
