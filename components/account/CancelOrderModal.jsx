"use client";

import { useEffect, useRef, useState } from "react";
import { FormMessage } from "./ui";
import { formatInr } from "@/lib/api";

/**
 * Confirmation before cancelling an order.
 *
 * Cancellation is irreversible and, on a paid order, moves money — so the
 * click on the order page opens this rather than doing it. What the customer
 * needs in order to be sure they have the right order is repeated here: the
 * number, the total, and how they paid.
 *
 * The two buttons are deliberately unequal. "Keep order" is the wide, quiet
 * default; "Cancel order" is the narrower destructive one. A misclick should
 * land on the harmless choice.
 *
 * REFUND WORDING IS A PROMISE, so it tracks what the system actually does.
 * Cancelling never issues a refund — that is a separate step someone performs
 * — so a paid order is told the refund "will be processed", never that it has
 * been. See refundStateFor() on the server for the same distinction.
 */

/** Fixed options, plus free text behind "Other". */
const REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found a better option",
  "Delivery time is too long",
  "Ordered the wrong product",
  "Other",
];

export default function CancelOrderModal({ order, open, onClose, onConfirm, busy, error, success = false }) {
  const [reason, setReason] = useState("");
  const [otherText, setOtherText] = useState("");
  const dialogRef = useRef(null);
  const firstFocusRef = useRef(null);

  const isPaid = order?.paymentStatus === "PAID";
  const isCod = order?.paymentMethod === "COD";

  /* Fresh choices each time it opens — a reason left over from a dismissed
     attempt is not this attempt's reason. */
  useEffect(() => {
    if (open) {
      setReason("");
      setOtherText("");
    }
  }, [open]);

  /* Escape closes, but not mid-request: the call is already in flight and
     dismissing the dialog would leave the customer with no idea how it ended. */
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !busy && !success) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, success, onClose]);

  /* Move focus in, so a keyboard or screen-reader user is placed inside the
     dialog rather than left behind on the page underneath. */
  useEffect(() => {
    if (open) firstFocusRef.current?.focus();
  }, [open]);

  /* Lock the page behind the dialog so it cannot be scrolled away. */
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open || !order) return null;

  const resolvedReason = reason === "Other" ? otherText.trim() : reason;
  /* "Other" with nothing typed is not a reason. Every other state is fine —
     the reason is optional, so an empty selection still submits. */
  const blocked = reason === "Other" && otherText.trim() === "";

  const submit = () => {
    if (busy || blocked) return;
    onConfirm(resolvedReason || null);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-order-title"
    >
      {/* Backdrop. Click-to-dismiss, except while the request is in flight. */}
      <div
        className="absolute inset-0 bg-[#03060e]/80 backdrop-blur-sm"
        onClick={() => !busy && !success && onClose()}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className="relative w-full max-w-[480px] rounded-t-3xl border border-white/12 bg-[#0b1426] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.7)] sm:rounded-3xl sm:p-7"
      >
        {/*
          Confirmation that it actually happened.

          Shown for a beat and then dismissed by the parent, which has already
          swapped the page underneath to CANCELLED. A success screen you have
          to close yourself would just be an extra click between the customer
          and the page that answers their next question.
        */}
        {success ? (
          <div className="flex flex-col items-center py-4 text-center" role="status" aria-live="polite">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/12">
              <svg viewBox="0 0 20 20" className="h-6 w-6 text-primary" fill="none" aria-hidden="true">
                <path
                  d="M4.5 10.5l3.5 3.5 7.5-7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2
              id="cancel-order-title"
              className="mt-4 font-[Playfair_Display] text-[21px] leading-tight text-white"
            >
              Order cancelled
            </h2>
            <p className="mt-2 font-[Montserrat] text-[13px] leading-relaxed text-white/50">
              {order.orderNo} has been cancelled.
              {isPaid ? " Our team will process your refund." : ""}
            </p>
          </div>
        ) : (
        <>
        <h2
          id="cancel-order-title"
          className="font-[Playfair_Display] text-[22px] leading-tight text-white sm:text-[25px]"
        >
          Cancel this order?
        </h2>

        <p className="mt-2.5 font-[Montserrat] text-[13.5px] leading-relaxed text-white/55">
          Are you sure you want to cancel order{" "}
          <span className="font-semibold text-white">{order.orderNo}</span>? This cannot be
          undone.
        </p>

        {/* The facts needed to be certain this is the right order. */}
        <dl className="mt-5 space-y-2 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3.5">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="font-[Montserrat] text-[12px] text-white/40">Order total</dt>
            <dd className="font-[Montserrat] text-[13.5px] font-bold tabular-nums text-white">
              {formatInr(order.totalPaise)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="font-[Montserrat] text-[12px] text-white/40">Payment</dt>
            <dd className="font-[Montserrat] text-[13px] text-white/80">
              {isCod ? "Cash on Delivery" : "Online"} · {order.paymentLabel}
            </dd>
          </div>
        </dl>

        {/*
          Only a captured payment gets the refund sentence. Saying it on a COD
          order would promise money back that was never taken.

          The wording puts the refund in someone's hands and starts the 5–7 day
          clock at "once processed", because cancelling does not trigger it —
          an admin runs the gateway refund afterwards. Copy that implied the
          money was already moving would be a promise the system does not keep.
        */}
        {isPaid && (
          <p className="mt-3.5 rounded-2xl border border-primary/25 bg-primary/[0.07] px-4 py-3 font-[Montserrat] text-[12.5px] leading-relaxed text-primary/90">
            Our team will process a refund to your original payment method. Once
            processed, it may take 5–7 working days to reflect.
          </p>
        )}
        {isCod && (
          <p className="mt-3.5 font-[Montserrat] text-[12.5px] leading-relaxed text-white/45">
            Nothing has been charged for this order, so there is no refund to process.
          </p>
        )}

        {/* Optional reason. */}
        <div className="mt-5">
          <label
            htmlFor="cancel-reason"
            className="block font-[Montserrat] text-[11px] font-bold uppercase tracking-[0.14em] text-white/40"
          >
            Reason <span className="font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <select
            id="cancel-reason"
            ref={firstFocusRef}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={busy}
            className="mt-2 w-full rounded-xl border border-white/12 bg-[#070e19] px-3.5 py-3 font-[Montserrat] text-[13.5px] text-white outline-none transition-colors focus:border-primary/50 disabled:opacity-50"
          >
            <option value="">Prefer not to say</option>
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {reason === "Other" && (
            <input
              type="text"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              disabled={busy}
              maxLength={200}
              placeholder="Tell us briefly why"
              aria-label="Your reason for cancelling"
              className="mt-2.5 w-full rounded-xl border border-white/12 bg-[#070e19] px-3.5 py-3 font-[Montserrat] text-[13.5px] text-white placeholder:text-white/25 outline-none transition-colors focus:border-primary/50 disabled:opacity-50"
            />
          )}
        </div>

        {error && (
          <div className="mt-4">
            <FormMessage>{error}</FormMessage>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center">
          {/* The safe option is the prominent one. */}
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 rounded-full border border-white/15 py-3.5 font-[Montserrat] text-[12px] font-bold uppercase tracking-[0.16em] text-white/80 transition-all hover:border-white/35 hover:text-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Keep order
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy || blocked}
            className="rounded-full bg-red-500/90 px-6 py-3.5 font-[Montserrat] text-[12px] font-bold uppercase tracking-[0.16em] text-white transition-all hover:bg-red-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            {busy ? "Cancelling…" : "Cancel order"}
          </button>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
