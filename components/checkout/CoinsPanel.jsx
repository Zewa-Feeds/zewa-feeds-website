"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The Zewa Coins box at checkout — ZSOP004 §10.1.
 *
 * Every decision below is specified, not stylistic:
 *
 *   A NUMERIC INPUT, not a slider or a toggle. Review asked for free entry, so
 *   the customer types how many coins to use and the rupee conversion updates
 *   live beside it.
 *
 *   DEFAULTS TO EMPTY, never to the maximum. "Auto-applying burns a balance the
 *   customer may have been saving and removes the agency that makes the reward
 *   feel earned." The maximum is offered as a one-tap shortcut instead.
 *
 *   PARTIAL USE MUST FEEL NORMAL — hence the line under the field saying unused
 *   coins stay in the account.
 *
 *   VALIDATE ON ENTRY, REVALIDATE ON SUBMIT. Typing more than the balance or
 *   more than the eligible value corrects inline with the reason, rather than
 *   failing at payment.
 *
 *   FAILS INVISIBLY. If the loyalty call errors or the quote comes back null,
 *   this renders nothing and checkout continues at full price. It must never
 *   block the payment step or show an error on the payment path (§8.1 #11).
 *
 *   NEVER SHOWN for negative-balance customers — the server returns a null
 *   quote, so there is no client-side branch to get wrong.
 *
 * The parent owns the applied amount so the order summary and this panel cannot
 * disagree; this component is the control surface, not the source of truth.
 */
export default function CoinsPanel({
  /** Server quote, or null when the box must not render at all. */
  quote,
  /** Coins currently held for this cart. */
  applied = 0,
  onApply,
  onRemove,
  busy = false,
  /** Set when the server silently reduced the amount (§4.1). */
  notice = "",
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputId = useRef(`coins-${Math.random().toString(36).slice(2, 8)}`).current;

  // A cart change can lower the ceiling under a typed value; clear the local
  // error so the customer is not left staring at a stale complaint.
  useEffect(() => {
    setError("");
  }, [quote?.maxRedeemable]);

  // §8.1 #11 / §10.1: no quote means no box. Checkout proceeds at full price.
  if (!quote?.visible) return null;

  const { available, maxRedeemable, minRedemption, coinValuePaise } = quote;
  const rupeesFor = (coins) => `₹${((coins * coinValuePaise) / 100).toLocaleString("en-IN")}`;

  // §10.2: "Earn 10 coins to start using them. You have 6."
  if (available < minRedemption) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
        <p className="font-[Montserrat] text-[12.5px] text-white/50">
          Earn {minRedemption} Zewa Coins to start using them. You have {available}.
        </p>
      </div>
    );
  }

  // Already applied — show what is on, and let them take it off.
  if (applied > 0) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-[#44e5c2]/25 bg-[#44e5c2]/[0.06] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-[Montserrat] text-[13px] text-white/85">
            <span className="font-semibold text-[#44e5c2]">{applied} Zewa Coins</span> applied
            · {rupeesFor(applied)} off
          </p>
          <button
            type="button"
            onClick={onRemove}
            disabled={busy}
            className="shrink-0 font-[Montserrat] text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white/50 underline-offset-2 transition hover:text-white/80 hover:underline disabled:opacity-40"
          >
            Remove
          </button>
        </div>
        {notice && (
          <p className="font-[Montserrat] text-[11.5px] text-amber-300/80">{notice}</p>
        )}
        <p className="font-[Montserrat] text-[11.5px] text-white/40">
          Coins you don&apos;t use stay in your account.
        </p>
      </div>
    );
  }

  function submit(e) {
    e?.preventDefault();
    const coins = Number.parseInt(value, 10);

    // Validate on entry with the REASON, not a generic failure (§10.1).
    if (!Number.isFinite(coins) || coins <= 0) {
      setError("Enter how many coins to use.");
      return;
    }
    if (coins < minRedemption) {
      setError(`Use at least ${minRedemption} coins.`);
      return;
    }
    if (coins > available) {
      setError(`You have ${available} Zewa Coins.`);
      return;
    }
    if (coins > maxRedeemable) {
      // §10.2: "You can use up to 260 coins on this order — that's the full
      // product value. Shipping is payable separately."
      setError(
        `You can use up to ${maxRedeemable} coins on this order — that's the full product value. Shipping is payable separately.`,
      );
      return;
    }
    setError("");
    onApply(coins);
  }

  const typed = Number.parseInt(value, 10);
  const previewValid = Number.isFinite(typed) && typed > 0 && typed <= maxRedeemable;

  /** True when this order cannot absorb the customer's whole balance. */
  const capped = maxRedeemable < available;

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      {/*
        TWO DIFFERENT NUMBERS, SAID SEPARATELY.

        `available` is what the customer owns; `maxRedeemable` is what THIS order
        can absorb. Collapsing them reads as "you only have 229 coins" to someone
        holding 500, which is both wrong and alarming. The ceiling line is shown
        only when it actually bites — when the order can take the whole balance,
        a second number would invent a limit that is not there.
      */}
      <label
        htmlFor={inputId}
        className="font-[Montserrat] text-[12.5px] text-white/70"
      >
        You have{" "}
        <span className="font-semibold text-[#44e5c2]">
          {available} Zewa Coins ({rupeesFor(available)})
        </span>
        {capped ? ". How many would you like to use?" : ". Use as many as you like on this order."}
      </label>

      {capped && (
        <p className="-mt-1 font-[Montserrat] text-[11.5px] text-white/50">
          Maximum usable on this order:{" "}
          <span className="font-semibold text-white/75">
            {maxRedeemable} Coins ({rupeesFor(maxRedeemable)})
          </span>
        </p>
      )}

      <div className="flex gap-2">
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          // Empty by default — never pre-filled with the maximum (§10.1).
          placeholder="0"
          onChange={(e) => {
            setValue(e.target.value.replace(/[^0-9]/g, ""));
            setError("");
          }}
          disabled={busy}
          aria-label={
            capped
              ? `Zewa Coins to use. You have ${available} coins, worth ${rupeesFor(available)}. Up to ${maxRedeemable} can be used on this order`
              : `Zewa Coins to use. You have ${available} coins, worth ${rupeesFor(available)}`
          }
          aria-invalid={error ? "true" : undefined}
          className="min-w-0 flex-1 rounded-lg border border-white/12 bg-[#060c17] px-3 py-2.5 font-[Montserrat] text-[13px] text-white outline-none transition placeholder:text-white/25 focus:border-[#44e5c2]/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={busy || !value}
          className="shrink-0 rounded-lg border border-[#44e5c2]/30 bg-[#44e5c2]/10 px-4 font-[Montserrat] text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#44e5c2] transition hover:bg-[#44e5c2]/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Apply
        </button>
      </div>

      {/* The one-tap maximum, offered rather than auto-applied (§10.1). */}
      {maxRedeemable >= minRedemption && (
        <button
          type="button"
          onClick={() => {
            setValue(String(maxRedeemable));
            setError("");
          }}
          disabled={busy}
          className="self-start font-[Montserrat] text-[11.5px] font-semibold text-white/55 underline-offset-2 transition hover:text-[#44e5c2] hover:underline disabled:opacity-40"
        >
          {capped ? `Use maximum ${maxRedeemable} Coins` : `Use all ${maxRedeemable} Coins`}
        </button>
      )}

      {/* Live conversion as they type (§10.1). */}
      {previewValid && !error && (
        <p className="font-[Montserrat] text-[11.5px] text-white/50">
          Using {typed} Coins = {rupeesFor(typed)} off
        </p>
      )}

      {error && (
        <p role="alert" className="font-[Montserrat] text-[11.5px] text-rose-300/90">
          {error}
        </p>
      )}

      {/* §10.1: "Partial use is normal and must feel normal." */}
      <p className="font-[Montserrat] text-[11.5px] text-white/40">
        Coins you don&apos;t use stay in your account.
      </p>
    </form>
  );
}
