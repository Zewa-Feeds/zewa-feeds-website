"use client";

import { useEffect, useState } from "react";
import AccountShell, { AccountCard } from "@/components/account/AccountShell";
import { FloatingInput, FloatingSelect } from "@/components/checkout/FloatingInput";
import {
  EmptyState,
  FormMessage,
  GhostButton,
  PrimaryButton,
  Skeleton,
} from "@/components/account/ui";
import { useAuth } from "@/lib/authContext";
import { account as accountApi, ApiError } from "@/lib/api";
import { INDIAN_STATES, pincodeMatchesState, likelyStateForPincode } from "@/lib/pincode";

/**
 * Address book.
 *
 * Same field set and same validation as the checkout address step — including the
 * PIN-code/state cross-check, which is a tax-correctness rule rather than tidiness
 * (the state decides the GST split on the invoice). An address saved here has to be
 * usable at checkout unchanged, so the two must agree.
 */

const EMPTY = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function AddressesPage() {
  const { isAuthenticated } = useAuth();

  const [addresses, setAddresses] = useState(null);
  const [loadError, setLoadError] = useState(null);
  /** null = form closed; "new" = adding; otherwise the id being edited. */
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    (async () => {
      try {
        const list = await accountApi.addresses();
        if (!cancelled) setAddresses(list);
      } catch (err) {
        if (!cancelled) setLoadError(err?.message ?? "Couldn't load your addresses.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const reload = async () => {
    const list = await accountApi.addresses();
    setAddresses(list);
  };

  const onDelete = async (id) => {
    setBusyId(id);
    try {
      await accountApi.deleteAddress(id);
      await reload();
    } catch (err) {
      setLoadError(err?.message ?? "Couldn't delete that address.");
    } finally {
      setBusyId(null);
    }
  };

  const onMakeDefault = async (id) => {
    setBusyId(id);
    try {
      await accountApi.updateAddress(id, { isDefault: true });
      await reload();
    } catch (err) {
      setLoadError(err?.message ?? "Couldn't update that address.");
    } finally {
      setBusyId(null);
    }
  };

  const editingAddress =
    editing && editing !== "new" ? addresses?.find((a) => a.id === editing) : null;

  return (
    <AccountShell
      title="Addresses"
      subtitle="Saved delivery addresses for faster checkout."
      actions={
        addresses && addresses.length > 0 && !editing ? (
          <GhostButton onClick={() => setEditing("new")}>Add address</GhostButton>
        ) : null
      }
    >
      <div className="flex flex-col gap-6">
        {loadError && (
          <AccountCard>
            <FormMessage>{loadError}</FormMessage>
          </AccountCard>
        )}

        {editing && (
          <AddressForm
            key={editing}
            initial={editingAddress ?? EMPTY}
            isNew={editing === "new"}
            onCancel={() => setEditing(null)}
            onSaved={async () => {
              await reload();
              setEditing(null);
            }}
          />
        )}

        <AccountCard title="Saved addresses">
          {loadError && addresses === null ? (
            <p className="font-[Montserrat] text-[13px] text-white/40">
              Refresh to try loading your addresses again.
            </p>
          ) : addresses === null ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : addresses.length === 0 ? (
            <EmptyState
              icon={
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path
                    d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              }
              title="No saved addresses"
              body="Save an address now and checkout becomes a two-tap affair next time."
              action={
                !editing && (
                  <GhostButton onClick={() => setEditing("new")}>Add your first address</GhostButton>
                )
              }
            />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {addresses.map((address) => (
                <li
                  key={address.id}
                  className={`relative flex flex-col rounded-2xl border p-5 transition-colors ${
                    address.isDefault
                      ? "border-primary/30 bg-primary/[0.04]"
                      : "border-white/8 bg-white/[0.02]"
                  }`}
                >
                  {address.isDefault && (
                    <span className="mb-2.5 inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-[Montserrat] text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                      Default
                    </span>
                  )}

                  <p className="font-[Montserrat] text-[13.5px] font-semibold text-white">
                    {address.name}
                  </p>
                  <p className="mt-1.5 font-[Montserrat] text-[12.5px] leading-relaxed text-white/45">
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ""}
                    <br />
                    {address.city}, {address.state} {address.pincode}
                  </p>
                  <p className="mt-1.5 font-[Montserrat] text-[12px] text-white/30">
                    {address.phone}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
                    <GhostButton
                      onClick={() => setEditing(address.id)}
                      disabled={busyId === address.id}
                      className="!px-3.5 !py-2 !text-[10px]"
                    >
                      Edit
                    </GhostButton>
                    {!address.isDefault && (
                      <>
                        <GhostButton
                          onClick={() => onMakeDefault(address.id)}
                          disabled={busyId === address.id}
                          className="!px-3.5 !py-2 !text-[10px]"
                        >
                          Set default
                        </GhostButton>
                        <GhostButton
                          tone="danger"
                          onClick={() => onDelete(address.id)}
                          disabled={busyId === address.id}
                          className="!px-3.5 !py-2 !text-[10px]"
                        >
                          {busyId === address.id ? "Working" : "Delete"}
                        </GhostButton>
                      </>
                    )}
                  </div>

                  {/*
                    The default address has no Delete. Removing it would leave the
                    account with addresses but no default, and checkout would have
                    nothing to preselect. Promote another one first.
                  */}
                  {address.isDefault && addresses.length > 1 && (
                    <p className="mt-2 font-[Montserrat] text-[10.5px] leading-relaxed text-white/25">
                      Set another address as default to remove this one.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </AccountCard>
      </div>
    </AccountShell>
  );
}

function AddressForm({ initial, isNew, onCancel, onSaved }) {
  /*
   * Normalise nulls to empty strings.
   *
   * The API returns optional columns as null (`line2` especially), and spreading
   * that straight over EMPTY puts null into an input's `value`. React then treats
   * the field as uncontrolled and warns, and the value silently stops tracking
   * state — so editing an address with no line 2 would break that field.
   */
  const [form, setForm] = useState(() => {
    const seeded = { ...EMPTY, ...initial };
    for (const [key, val] of Object.entries(seeded)) {
      if (val === null || val === undefined) seeded[key] = EMPTY[key] ?? "";
    }
    return seeded;
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  const setField = (key) => (e) => {
    const value = key === "isDefault" ? e.target.checked : e.target.value;
    setForm((f) => {
      const next = { ...f, [key]: value };
      /*
       * Fill the state from the PIN code when it is still blank. A suggestion,
       * never an override: the prefix table maps a postal circle, which can span
       * more than one state, so a customer's own choice always wins.
       */
      if (key === "pincode" && !f.state) {
        const guess = likelyStateForPincode(value);
        if (guess) next.state = guess;
      }
      return next;
    });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (formError) setFormError(null);
  };

  const validate = () => {
    const found = {};
    if (form.name.trim().length < 2) found.name = "Enter the recipient's full name.";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim().replace(/\s+/g, "")))
      found.phone = "Enter a 10-digit mobile number.";
    if (form.line1.trim().length < 4) found.line1 = "Enter the street address.";
    if (form.city.trim().length < 2) found.city = "Enter the city.";
    if (!form.state) found.state = "Select a state.";
    if (!/^\d{6}$/.test(form.pincode.trim())) found.pincode = "Enter a 6-digit PIN code.";
    else if (form.state && !pincodeMatchesState(form.pincode.trim(), form.state))
      found.pincode = `That PIN code isn't in ${form.state}.`;
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
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim().replace(/\s+/g, ""),
      line1: form.line1.trim(),
      // Omit rather than send "" — the API's optional string still has a min length.
      ...(form.line2.trim() ? { line2: form.line2.trim() } : {}),
      city: form.city.trim(),
      state: form.state,
      pincode: form.pincode.trim(),
      isDefault: Boolean(form.isDefault),
    };

    try {
      if (isNew) await accountApi.addAddress(payload);
      else await accountApi.updateAddress(initial.id, payload);
      await onSaved();
    } catch (err) {
      if (err instanceof ApiError && err.fields) setErrors(err.fields);
      setFormError(
        err instanceof ApiError ? err.message : "Couldn't save that address. Try again.",
      );
      setSaving(false);
    }
  };

  return (
    <AccountCard title={isNew ? "Add an address" : "Edit address"}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 sm:gap-6">
        {formError && (
          <div className="mb-1">
            <FormMessage>{formError}</FormMessage>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
          <FloatingInput
            name="name"
            label="Full name"
            value={form.name}
            onChange={setField("name")}
            error={errors.name}
            autoComplete="name"
            required
          />
          <FloatingInput
            name="phone"
            type="tel"
            label="Mobile number"
            value={form.phone}
            onChange={setField("phone")}
            error={errors.phone}
            autoComplete="tel"
            inputMode="numeric"
            maxLength={10}
            required
          />
        </div>

        <FloatingInput
          name="line1"
          label="Address line 1"
          value={form.line1}
          onChange={setField("line1")}
          error={errors.line1}
          autoComplete="address-line1"
          required
        />
        <FloatingInput
          name="line2"
          label="Address line 2"
          value={form.line2}
          onChange={setField("line2")}
          error={errors.line2}
          hint="Optional — landmark, apartment"
          autoComplete="address-line2"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4">
          <FloatingInput
            name="pincode"
            label="PIN code"
            value={form.pincode}
            onChange={setField("pincode")}
            error={errors.pincode}
            autoComplete="postal-code"
            inputMode="numeric"
            maxLength={6}
            required
          />
          <FloatingInput
            name="city"
            label="City"
            value={form.city}
            onChange={setField("city")}
            error={errors.city}
            autoComplete="address-level2"
            required
          />
          <FloatingSelect
            name="state"
            label="State"
            value={form.state}
            onChange={setField("state")}
            error={errors.state}
            options={INDIAN_STATES}
            required
          />
        </div>

        <label className="mt-2 flex cursor-pointer items-center gap-2.5 font-[Montserrat] text-[12px] text-white/50">
          <input
            type="checkbox"
            checked={Boolean(form.isDefault)}
            onChange={setField("isDefault")}
            /* The only address is the default whatever the box says, so lock it. */
            disabled={Boolean(initial.isDefault)}
            className="h-3.5 w-3.5 cursor-pointer accent-[#44e5c2] disabled:opacity-40"
          />
          {initial.isDefault
            ? "This is your default address"
            : "Use as my default delivery address"}
        </label>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
          <GhostButton type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </GhostButton>
          <div className="sm:max-w-[220px] sm:flex-1">
            <PrimaryButton type="submit" loading={saving}>
              {saving ? "Saving" : isNew ? "Save address" : "Update address"}
            </PrimaryButton>
          </div>
        </div>
      </form>
    </AccountCard>
  );
}
