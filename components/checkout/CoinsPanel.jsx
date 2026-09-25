"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The Zewa Coins box at checkout — ZSOP004 §10.1.
 *
 * Every decision below is specified, not stylistic:
 *
 *   A SLIDER AND A NUMERIC INPUT, bound to one value. An earlier review asked
 *   for free entry and rejected a slider outright; the slider was reinstated on
 *   25 Sep 2026 by product decision, because a bare number gives no sense of
 *   where the ceiling is — someone holding 500 coins on a 229-coin order has to
 *   read the limit, do the arithmetic, and hope. Dragging shows it.
 *
 *   FREE ENTRY IS PRESERVED, which is what that review actually protected: the
 *   field still accepts a typed number, and typing is the only way to hit an
 *   exact figure on a touchscreen. The two controls are the same state, so
 *   neither can disagree with the other.
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

  /*
   * Where the slider sits.
   *
   * Clamped only for the THUMB's position — an out-of-range typed number parks it
   * at the end rather than throwing the control off its track, while the field
   * keeps the digits as entered so `submit` can explain what is wrong.
   */
  const sliderValue = Number.isFinite(typed) ? Math.min(Math.max(typed, 0), maxRedeemable) : 0;

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
      {/*
        ONE HEADING, NOT FOUR COMPETING LINES.

        The balance leads because it is the thing the customer wants to know. The
        order ceiling is a sub-line under it, and only when it actually bites —
        when the order can absorb the whole balance, naming a second number
        invents a limit that is not there.
      */}
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className="font-[Montserrat] text-[12.5px] text-white/70">
          Use your{" "}
          <span className="font-semibold text-[#44e5c2]">{available} Zewa Coins</span>
        </label>
        <span className="shrink-0 font-[Montserrat] text-[11.5px] tabular-nums text-white/40">
          worth {rupeesFor(available)}
        </span>
      </div>

      {capped && (
        <p className="-mt-1 font-[Montserrat] text-[11.5px] text-white/45">
          Up to{" "}
          <span className="font-semibold text-white/70">{maxRedeemable} on this order</span>{" "}
          — the full product value. Shipping is payable separately.
        </p>
      )}

      {/*
        SLIDER, FIELD AND APPLY ON ONE ROW.

        Previously the slider floated above a full-width field, so a three-digit
        number sat in a control sized for a sentence and the value was restated
        four times over. One row, one restatement: the field IS the readout, so
        dragging writes the number the customer is about to apply.

        Both controls write `value` and cannot drift. The slider is capped at
        `maxRedeemable`, so it physically cannot select an invalid amount. The
        TYPED field is deliberately NOT clamped while typing — silently rewriting
        digits mid-entry is disorienting, and `submit` reports the real reason
        with the real number.
      */}
      <div className="flex items-center gap-2.5">
        {maxRedeemable >= minRedemption && (
          <input
            type="range"
            min={0}
            max={maxRedeemable}
            step={1}
            value={sliderValue}
            onChange={(e) => {
              setValue(e.target.value === "0" ? "" : e.target.value);
              setError("");
            }}
            disabled={busy}
            /*
             * Deliberately NOT "Zewa Coins to use" — that names the text field,
             * and two controls sharing a label reads as duplicates to a screen
             * reader. "Adjust" marks this as the coarse control.
             */
            aria-label={`Adjust Zewa Coins, 0 to ${maxRedeemable}`}
            aria-valuetext={`${sliderValue} coins, ${rupeesFor(sliderValue)} off`}
            /*
             * Drives the filled portion of the track. WebKit has no
             * `::-moz-range-progress`, so the fill is a gradient whose hard stop
             * sits at this percentage — the only way to colour the left of the
             * thumb in Chrome and Safari.
             *
             * Guarded against a zero ceiling: `maxRedeemable` can be 0 on a cart
             * that cannot absorb any coins, and 0/0 is NaN, which would drop the
             * gradient entirely and leave an unstyled track.
             */
            style={{
              "--coin-fill": `${maxRedeemable > 0 ? (sliderValue / maxRedeemable) * 100 : 0}%`,
            }}
            className="zewa-coin-slider min-w-0 flex-1 accent-[#44e5c2] disabled:opacity-40"
          />
        )}

        {/*
          Sized to its content, not to the row. A coin count is three or four
          digits; a full-width box made the number look like an afterthought
          floating in empty space.
        */}
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
          className={`w-[4.5rem] shrink-0 rounded-lg border bg-[#060c17] px-2.5 py-2 text-center font-[Montserrat] text-[13px] font-semibold tabular-nums text-white outline-none transition placeholder:font-normal placeholder:text-white/25 focus:border-[#44e5c2]/50 disabled:opacity-50 ${
            error ? "border-rose-400/50" : "border-white/12"
          }`}
        />

        {/*
          A chip, not a sentence. "Use all 124 Coins" on its own line read as a
          heading rather than a control, and restated a number already on screen
          twice.
        */}
        {maxRedeemable >= minRedemption && (
          <button
            type="button"
            onClick={() => {
              setValue(String(maxRedeemable));
              setError("");
            }}
            disabled={busy || sliderValue === maxRedeemable}
            title={capped ? `Use the maximum ${maxRedeemable} coins` : `Use all ${maxRedeemable} coins`}
            className="shrink-0 rounded-lg border border-white/12 px-2.5 py-2 font-[Montserrat] text-[11px] font-bold uppercase tracking-[0.1em] text-white/55 transition hover:border-[#44e5c2]/40 hover:text-[#44e5c2] disabled:opacity-30 disabled:hover:border-white/12 disabled:hover:text-white/55"
          >
            Max
          </button>
        )}

        <button
          type="submit"
          disabled={busy || !value}
          className="shrink-0 rounded-lg border border-[#44e5c2]/30 bg-[#44e5c2]/10 px-3.5 py-2 font-[Montserrat] text-[11px] font-bold uppercase tracking-[0.1em] text-[#44e5c2] transition hover:bg-[#44e5c2]/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Apply
        </button>
      </div>

      {/*
        ONE line below the row, and only ever one: the error when something is
        wrong, otherwise the conversion. Stacking both is what made this panel
        feel like a wall of grey text.
      */}
      {error ? (
        <p role="alert" className="font-[Montserrat] text-[11.5px] text-rose-300/90">
          {error}
        </p>
      ) : previewValid ? (
        <p className="font-[Montserrat] text-[11.5px] text-white/55">
          <span className="font-semibold text-[#44e5c2]">{rupeesFor(typed)} off</span> this order
          {/*
            The remainder is mentioned only when there IS one. Spending the whole
            balance rendered "0 coins stay in your account", which states a loss
            where the line is meant to reassure — §10.1 wants partial use to feel
            normal, not full use to feel like a warning.
          */}
          {available - typed > 0 && (
            <span className="text-white/45">
              {" "}· {available - typed} coins stay in your account
            </span>
          )}
        </p>
      ) : null}

      {/*
        §10.1: "Partial use is normal and must feel normal."
        
        Shown only while the live line is NOT saying it. Once a number is entered
        that line already reads "… N coins stay in your account", and printing the
        same promise twice is what made this panel feel repetitive.
      */}
      {!previewValid && (
        <p className="font-[Montserrat] text-[11.5px] text-white/40">
          Coins you don&apos;t use stay in your account.
        </p>
      )}
    </form>
  );
}
