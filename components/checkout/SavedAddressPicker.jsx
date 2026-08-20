"use client";

import { EASE, FOCUS_RING } from "./tokens";

/**
 * Choose a saved delivery address, or opt into typing a new one.
 *
 * Only rendered when the customer actually has saved addresses — a picker with
 * nothing in it is worse than no picker, so a first-time buyer sees the plain
 * form exactly as before.
 *
 * "Use a different address" is a real option in the same list rather than a link
 * somewhere else. Someone shipping a gift is not doing something exceptional,
 * and hiding that behind an edit affordance is how checkouts end up sending
 * parcels to the wrong house.
 */
export default function SavedAddressPicker({ addresses, selectedId, onSelect }) {
  if (!addresses?.length) return null;

  const Option = ({ id, checked, children }) => (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${EASE} ${
        checked
          ? "border-primary/50 bg-primary/[0.06]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <input
        type="radio"
        name="savedAddress"
        checked={checked}
        onChange={() => onSelect(id)}
        className={`mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#44e5c2] ${FOCUS_RING}`}
      />
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  );

  return (
    <div className="flex flex-col gap-2.5">
      {addresses.map((a) => (
        <Option key={a.id} id={a.id} checked={selectedId === a.id}>
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-[Montserrat] text-[13.5px] font-semibold text-white">
              {a.name}
            </span>
            {a.isDefault && (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-[Montserrat] text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                Default
              </span>
            )}
          </span>
          <span className="mt-1 block font-[Montserrat] text-[12.5px] leading-relaxed text-white/50">
            {a.line1}
            {a.line2 ? `, ${a.line2}` : ""}
            <br />
            {a.city}, {a.state} {a.pincode}
          </span>
          <span className="mt-1 block font-[Montserrat] text-[12px] text-white/30">
            {a.phone}
          </span>
        </Option>
      ))}

      <Option id="new" checked={selectedId === "new"}>
        <span className="font-[Montserrat] text-[13.5px] font-semibold text-white">
          Deliver somewhere else
        </span>
        <span className="mt-1 block font-[Montserrat] text-[12.5px] text-white/45">
          Enter a new address below.
        </span>
      </Option>
    </div>
  );
}

/**
 * "Save this address for next time".
 *
 * The wording changes with sign-in state because the promise genuinely differs.
 * A guest's address is attached to the customer record checkout already creates
 * from their email, so it is waiting for them if they register with that same
 * address later — worth saying plainly rather than implying an account exists.
 */
export function SaveAddressToggle({ checked, onChange, isAuthenticated, disabled }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5 ${EASE} hover:border-white/20 ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className={`mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#44e5c2] ${FOCUS_RING}`}
      />
      <span className="min-w-0">
        <span className="block font-[Montserrat] text-[13px] text-white/80">
          Save this address for next time
        </span>
        <span className="mt-0.5 block font-[Montserrat] text-[11.5px] leading-relaxed text-white/35">
          {isAuthenticated
            ? "It'll appear in your address book, ready to pick at your next checkout."
            : "We'll keep it against this email address, so it's already here when you create an account."}
        </span>
      </span>
    </label>
  );
}
