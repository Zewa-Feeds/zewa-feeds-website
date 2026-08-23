"use client";

import { use, useEffect, useState } from "react";
import AccountShell, { AccountCard } from "@/components/account/AccountShell";
import { EmptyState, FormMessage, GhostButton, Skeleton } from "@/components/account/ui";
import {
  OrderStatusPill,
  PAYMENT_TONE,
  formatOrderDateTime,
} from "@/components/account/orderUi";
import TrackingPanel from "@/components/account/TrackingPanel";
import CancelOrderModal from "@/components/account/CancelOrderModal";
import { useAuth } from "@/lib/authContext";
import { account as accountApi, formatInr, ApiError } from "@/lib/api";

/**
 * One order, in full.
 *
 * Fetched from `/account/orders/:orderNo`, which scopes the lookup to the signed-in
 * customer — an order belonging to someone else comes back 404, so this page can
 * render whatever it receives without doing its own ownership check.
 */
export default function OrderDetailPage({ params }) {
  // Next 15 passes params as a promise; `use` unwraps it in a client component.
  const { orderNo } = use(params);
  const { isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);
  const [invoiceBusy, setInvoiceBusy] = useState(false);
  const [invoiceError, setInvoiceError] = useState(null);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelBusy, setCancelBusy] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    (async () => {
      try {
        const data = await accountApi.order(orderNo);
        if (!cancelled) setOrder(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
        else setError(err?.message ?? "Couldn't load this order.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderNo, isAuthenticated]);

  /**
   * Download the invoice.
   *
   * The PDF arrives as a Blob because the endpoint needs an Authorization
   * header, so it cannot be a plain link. An object URL is created, clicked,
   * and revoked immediately — leaving it alive would pin the whole file in
   * memory for as long as the page stays open.
   */
  const downloadInvoice = async () => {
    if (invoiceBusy) return;
    setInvoiceBusy(true);
    setInvoiceError(null);
    try {
      const { blob, filename } = await accountApi.invoice(orderNo);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setInvoiceError(
        err instanceof ApiError ? err.message : "Could not download the invoice.",
      );
    } finally {
      setInvoiceBusy(false);
    }
  };

  /**
   * Confirm cancellation.
   *
   * `cancelBusy` guards the ACTION, not just the button: a double-click, a
   * retried request or a second tab all funnel through here, and the server's
   * already-cancelled path is idempotent besides.
   *
   * The response is the full updated order, so the page re-renders from
   * server truth rather than a locally patched status — which is what keeps
   * the timeline, the refund line and the button state consistent.
   */
  const confirmCancel = async (reason) => {
    if (cancelBusy) return;
    setCancelBusy(true);
    setCancelError(null);
    try {
      const updated = await accountApi.cancelOrder(orderNo, { reason });
      /*
       * Swap the page to the cancelled view FIRST, then hold the modal on a
       * short confirmation. By the time it dismisses, what is underneath
       * already shows CANCELLED, the refund line and the reason — so the
       * customer is never looking at a stale page wondering whether it worked.
       */
      setOrder(updated);
      setCancelSuccess(true);
      window.setTimeout(() => {
        setCancelOpen(false);
        setCancelSuccess(false);
      }, 1400);
    } catch (err) {
      /*
       * A 409 means the order moved on while the modal was open — shipped by
       * ops, most likely. The server writes that message for the customer, so
       * it is shown as-is; anything else gets a neutral fallback rather than
       * an internal string.
       */
      setCancelError(
        err instanceof ApiError && err.message
          ? err.message
          : "We couldn't cancel this order just now. Please try again.",
      );
      /* Re-read so the page reflects whatever the true state now is. */
      try {
        setOrder(await accountApi.order(orderNo));
      } catch {
        /* leave the existing view in place */
      }
    } finally {
      setCancelBusy(false);
    }
  };

  const backButton = (
    <GhostButton onClick={() => (window.location.href = "/account/orders")}>
      ← All orders
    </GhostButton>
  );

  if (notFound) {
    return (
      <AccountShell title="Order not found" actions={backButton}>
        <AccountCard>
          <EmptyState
            title="We couldn't find that order"
            body="It may belong to a different account, or the order number may be wrong."
            action={backButton}
          />
        </AccountCard>
      </AccountShell>
    );
  }

  return (
    <AccountShell
      title={order ? `Order ${order.orderNo}` : "Order Details"}
      subtitle={order ? `Placed ${formatOrderDateTime(order.placedAt)}` : undefined}
      actions={backButton}
    >
      {error ? (
        <AccountCard>
          <FormMessage>{error}</FormMessage>
        </AccountCard>
      ) : order === null ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-56 w-full rounded-3xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* ---- Top Order Header Card ---- */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0b1426] to-[#081020] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/8 pb-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-[Montserrat] text-[22px] sm:text-[26px] font-bold text-white tracking-tight">
                    {order.orderNo}
                  </h1>
                  <OrderStatusPill status={order.status} label={order.statusLabel} />
                </div>
                <p className="font-[Montserrat] text-[12.5px] text-white/50 flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Placed on {formatOrderDateTime(order.placedAt)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-right">
                  <span className="block font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                    Payment Method
                  </span>
                  <span
                    className={`mt-0.5 block font-[Montserrat] text-[13px] font-bold ${
                      PAYMENT_TONE[order.paymentStatus] ?? "text-white/80"
                    }`}
                  >
                    {order.paymentLabel} · {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online"}
                  </span>
                </div>

                {/*
                  The invoice chip doubles as the download. The number alone is
                  not much use to a customer — the document is what they came
                  for, and hiding it behind a separate button would repeat the
                  same fact twice.
                */}
                {order.invoiceNumber && (
                  <button
                    type="button"
                    onClick={downloadInvoice}
                    disabled={invoiceBusy}
                    aria-label={`Download invoice ${order.invoiceNumber} as PDF`}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-left transition-all duration-200 hover:border-primary/40 hover:bg-primary/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="block font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                      Invoice
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 font-[Montserrat] text-[13px] font-bold text-white/90 group-hover:text-primary">
                      {order.invoiceNumber}
                      {invoiceBusy ? (
                        <span
                          className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent motion-reduce:animate-none"
                          role="status"
                          aria-label="Preparing"
                        />
                      ) : (
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                          <path
                            d="M8 2v8m0 0L5 7m3 3l3-3M3 12.5h10"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {invoiceError && (
              <div className="mt-4">
                <FormMessage>{invoiceError}</FormMessage>
              </div>
            )}

            {/*
              ---- Refund state on a cancelled order ----

              Without this the page shows "Cancelled" beside "Payment
              successful", which reads as a bug. Cancelling does not refund —
              that is a separate step someone performs — so the honest line is
              that the refund is on its way, not that it is done.
            */}
            {order.status === "CANCELLED" && order.paymentMethod === "COD" && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-[Montserrat] text-[12.5px] leading-relaxed text-white/70">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  Refund Status: No refund required
                </span>
                No payment was collected, so there is no refund to process.
              </div>
            )}

            {order.refundState && order.refundState !== "none" && order.paymentMethod !== "COD" && (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 font-[Montserrat] text-[12.5px] leading-relaxed ${
                  order.refundState === "processed"
                    ? "border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-300/90"
                    : "border-amber-400/25 bg-amber-400/[0.07] text-amber-200/90"
                }`}
              >
                <span
                  className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                    order.refundState === "processed" ? "text-emerald-300" : "text-amber-300"
                  }`}
                >
                  Refund Status:{" "}
                  {order.refundState === "processed"
                    ? "Refund Completed"
                    : order.refundState === "partial"
                      ? "Partially Refunded"
                      : "Refund Pending"}
                </span>
                {order.refundState === "processed"
                  ? "Refund processed — the amount has been returned to your original payment method. Depending on your bank, it may take 5–7 working days to reflect."
                  : order.refundState === "partial"
                    ? "Partial refund processed. Contact us if you have any questions about the balance."
                    : "Refund pending — your cancellation has been received. Our team will process the refund to your original payment method. Once processed, it may take 5–7 working days to reflect."}
              </div>
            )}

            {/*
              ---- Cancel action ----

              `canCancel` comes from the server, which applies the same
              predicate the cancel endpoint enforces with, so the button cannot
              drift from what is actually permitted. The endpoint re-checks on
              arrival regardless — a page open since before dispatch is not
              permission to cancel.
            */}
            {order.canCancel ? (
              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/8 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setCancelError(null);
                    setCancelSuccess(false);
                    setCancelOpen(true);
                  }}
                  disabled={cancelBusy}
                  className="rounded-full border border-red-400/30 px-5 py-2.5 font-[Montserrat] text-[11.5px] font-bold uppercase tracking-[0.16em] text-red-300/90 transition-all hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
                >
                  {cancelBusy ? "Cancelling…" : "Cancel order"}
                </button>
                <span className="font-[Montserrat] text-[12px] text-white/35">
                  You can cancel until this order is dispatched.
                </span>
              </div>
            ) : (
              /*
                Explain the absence. A button that silently disappears once an
                order ships looks broken; naming the reason and pointing at
                support is the difference between a dead end and an answer.
                Not shown for cancelled orders — the status pill already says
                so, and repeating it is noise.
              */
              order.cancelBlockedReason &&
              order.status !== "CANCELLED" && (
                <p className="mt-5 border-t border-white/8 pt-5 font-[Montserrat] text-[12.5px] leading-relaxed text-white/40">
                  {order.cancelBlockedReason}
                </p>
              )
            )}

            {/* ---- Tracking Panel ---- */}
            <TrackingPanel fulfilment={order.fulfilment} status={order.status} />

            {/* ---- Horizontal/Vertical Timeline Tracker ---- */}
            {order.timeline?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/8">
                <p className="mb-6 font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Order Status Progress
                </p>
                <ol className="relative flex flex-col gap-6 sm:flex-row sm:gap-0 sm:justify-between">
                  {order.timeline.map((step, i) => {
                    const cancelled = step.state === "cancelled";
                    const reached = cancelled || step.state === "done" || step.state === "current";
                    const isCurrent = step.state === "current";

                    return (
                      <li
                        key={`${step.label}-${i}`}
                        className="relative flex items-start gap-4 sm:flex-col sm:items-center sm:text-center sm:flex-1"
                      >
                        {/* Connecting Line on Desktop */}
                        {i < order.timeline.length - 1 && (
                          <div
                            className={`hidden sm:block absolute top-3.5 left-1/2 w-full h-[2px] -z-0 ${
                              reached ? "bg-primary/50" : "bg-white/10"
                            }`}
                          />
                        )}

                        {/* Step Dot */}
                        <div
                          className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                            cancelled
                              ? "border-red-500 bg-red-500/20 text-red-400"
                              : reached
                              ? "border-primary bg-primary/20 text-primary shadow-[0_0_12px_rgba(68,229,194,0.4)]"
                              : "border-white/20 bg-[#09101f] text-white/20"
                          } ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}`}
                        >
                          {cancelled ? (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : reached ? (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-white/20" />
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="min-w-0">
                          <p
                            className={`font-[Montserrat] text-[13px] font-bold ${
                              cancelled
                                ? "text-red-300"
                                : reached
                                ? "text-white"
                                : "text-white/35"
                            }`}
                          >
                            {step.label}
                          </p>
                          {step.at && (
                            <p className="mt-0.5 font-[Montserrat] text-[11px] text-white/40">
                              {formatOrderDateTime(step.at)}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {/*
                  The reason, under the timeline it belongs to. Shown only when
                  one was recorded — cancellation reasons are optional for the
                  customer, and an empty "Reason:" line is worse than none.
                */}
                {order.status === "CANCELLED" && order.cancelReason && (
                  <p className="mt-6 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 font-[Montserrat] text-[12.5px] leading-relaxed text-white/50">
                    <span className="text-white/35">Reason: </span>
                    {order.cancelReason}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ---- Two-Column Grid: Items & Order Summary + Delivery ---- */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Items Column (2/3 width on desktop) */}
            <div className="lg:col-span-2">
              <AccountCard title="Items Ordered">
                <ul className="flex flex-col divide-y divide-white/8">
                  {order.items.map((item, i) => (
                    <li
                      key={`${item.sku}-${i}`}
                      className="flex items-center justify-between gap-4 py-4.5 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-primary">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="font-[Montserrat] text-[14px] font-bold text-white truncate">
                            {item.productName}
                          </p>
                          <p className="mt-1 font-[Montserrat] text-[12px] text-white/45">
                            {item.pack} · Qty {item.qty}
                            {item.sku && <span className="ml-2.5 font-mono text-[11px] text-white/30">{item.sku}</span>}
                          </p>
                        </div>
                      </div>
                      <p className="shrink-0 font-[Montserrat] text-[15px] font-bold text-white tabular-nums">
                        {formatInr(item.lineTotalPaise)}
                      </p>
                    </li>
                  ))}
                </ul>
              </AccountCard>
            </div>

            {/* Summary & Address Column (1/3 width on desktop) */}
            <div className="flex flex-col gap-6">
              {/* Payment Summary */}
              <AccountCard title="Payment Summary">
                <dl className="flex flex-col gap-3 font-[Montserrat] text-[13px]">
                  <Row label="Subtotal" value={formatInr(order.subtotalPaise)} />
                  {order.discountPaise > 0 && (
                    <Row
                      label="Discount"
                      value={`− ${formatInr(order.discountPaise)}`}
                      tone="text-primary font-bold"
                    />
                  )}
                  <Row
                    label="Shipping"
                    value={order.shippingPaise > 0 ? formatInr(order.shippingPaise) : "FREE"}
                  />
                  <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-4">
                    <dt className="font-[Montserrat] text-[14px] font-bold text-white">Total Paid</dt>
                    <dd className="font-[Playfair_Display] text-[24px] font-bold text-primary tabular-nums">
                      {formatInr(order.totalPaise)}
                    </dd>
                  </div>
                </dl>
              </AccountCard>

              {/* Delivery Address */}
              <AccountCard title="Delivery Address">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-[Montserrat] text-[13px] leading-relaxed text-white/80 whitespace-pre-line">
                      {order.addressLine}
                    </p>
                  </div>
                </div>

                {order.customerNote && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                      Your Note
                    </p>
                    <p className="mt-1.5 font-[Montserrat] text-[12.5px] leading-relaxed text-white/60">
                      {order.customerNote}
                    </p>
                  </div>
                )}
              </AccountCard>
            </div>
          </div>
        </div>
      )}

      <CancelOrderModal
        order={order}
        open={cancelOpen}
        busy={cancelBusy}
        success={cancelSuccess}
        error={cancelError}
        onClose={() => setCancelOpen(false)}
        onConfirm={confirmCancel}
      />
    </AccountShell>
  );
}

function Row({ label, value, tone = "text-white/80" }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="font-[Montserrat] text-[13px] text-white/45">{label}</dt>
      <dd className={`font-[Montserrat] text-[13px] font-medium ${tone}`}>{value}</dd>
    </div>
  );
}
