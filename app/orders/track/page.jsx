"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { orders as ordersApi, formatInr } from "@/lib/api";

/**
 * Guest order tracking.
 *
 * Order number + email act as the credential pair, so a customer who checked out
 * without an account can still follow their order. The backend returns the same
 * 404 for a wrong email as for a missing order, so this page cannot be used to
 * discover which order numbers exist.
 */
export default function TrackOrderPage() {
  const [form, setForm] = useState({ orderNo: "", email: "" });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Deep-link from the confirmation email / success page.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderNo = params.get("orderNo");
    const email = params.get("email");
    if (orderNo && email) {
      setForm({ orderNo, email });
      void lookup(orderNo, email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function lookup(orderNo, email) {
    setLoading(true);
    setError("");
    try {
      setOrder(await ordersApi.track(orderNo.trim().toUpperCase(), email.trim()));
    } catch (err) {
      setError(
        err.code === "NOT_FOUND"
          ? "We couldn't find an order with that number and email. Check both and try again."
          : err.message,
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  const submit = (e) => {
    e.preventDefault();
    void lookup(form.orderNo, form.email);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#06080f] pb-20 pt-28 text-[#dde2f6]">
        <div className="mx-auto max-w-[720px] px-6 sm:px-10">
          <div className="mb-10">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px w-5 bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary font-[Montserrat]">
                Order status
              </span>
            </div>
            <h1 className="font-[Playfair_Display] text-[36px] leading-tight text-white sm:text-[44px]">
              Track your order
            </h1>
          </div>

          <form
            onSubmit={submit}
            className="mb-10 flex flex-col gap-4 rounded-2xl border border-white/6 bg-white/3 p-6 sm:flex-row sm:items-end"
          >
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 font-[Montserrat]">
                Order number
              </span>
              <input
                value={form.orderNo}
                onChange={(e) => setForm((f) => ({ ...f, orderNo: e.target.value.toUpperCase() }))}
                placeholder="27ZFO001"
                className="rounded-xl border border-white/8 bg-[#0e1828] px-4 py-3 font-mono text-[13px] text-[#b8c4d4] placeholder-white/15 focus:border-primary/40 focus:outline-none"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 font-[Montserrat]">
                Email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="rounded-xl border border-white/8 bg-[#0e1828] px-4 py-3 text-[14px] text-[#b8c4d4] placeholder-white/15 font-[Montserrat] focus:border-primary/40 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00382d] font-[Montserrat] transition-all duration-200 hover:bg-primary/85 disabled:opacity-50"
            >
              {loading ? "Looking…" : "Track"}
            </button>
          </form>

          {error && (
            <div className="mb-8 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3">
              <p className="text-[13px] text-red-300 font-[Montserrat]">{error}</p>
            </div>
          )}

          {order && (
            <div className="flex flex-col gap-6">
              {/* Order Overview & Status */}
              <div className="rounded-2xl border border-white/6 bg-white/3 p-6 sm:p-7">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 font-[Montserrat]">
                      Order Reference
                    </span>
                    <span className="font-mono text-[18px] font-bold text-white tracking-wide">
                      {order.orderNo}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.14em] ${
                        order.status === "CANCELLED"
                          ? "border-red-500/30 bg-red-500/10 text-red-300"
                          : order.status === "DELIVERED" || order.status === "SHIPPED"
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-sky-500/30 bg-sky-500/10 text-sky-300"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          order.status === "CANCELLED"
                            ? "bg-red-400"
                            : order.status === "DELIVERED" || order.status === "SHIPPED"
                              ? "bg-primary"
                              : "bg-sky-400"
                        }`}
                      />
                      {order.statusLabel}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.14em] ${
                        order.paymentStatus === "PAID"
                          ? "border-primary/25 bg-primary/5 text-primary"
                          : order.paymentStatus === "REFUNDED"
                            ? "border-white/20 bg-white/5 text-white/60"
                            : "border-amber-500/25 bg-amber-500/5 text-amber-300"
                      }`}
                    >
                      {order.paymentLabel}
                    </span>
                  </div>
                </div>

                {/* Cancelled Order Notice */}
                {order.status === "CANCELLED" && (
                  <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 sm:p-5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-300">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <span className="font-[Montserrat] text-[13px] font-bold uppercase tracking-wider text-red-200">
                        Order Cancelled
                      </span>
                    </div>
                    {order.cancelReason && (
                      <p className="mt-2.5 text-[13px] leading-relaxed text-red-200/90 font-[Montserrat]">
                        <strong className="font-semibold text-red-100">Reason:</strong> {order.cancelReason}
                      </p>
                    )}
                    {order.cancelledAt && (
                      <p className="mt-1 text-[11.5px] text-red-300/70 font-[Montserrat]">
                        Cancelled on {new Date(order.cancelledAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                )}

                {/* Status Timeline */}
                <p className="mb-4 font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Order Status Progress
                </p>
                <ol className="flex flex-col gap-0">
                  {order.timeline.map((step, i) => (
                    <li key={step.label} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            step.state === "done"
                              ? "border-primary bg-primary"
                              : step.state === "current"
                                ? "border-primary bg-transparent"
                                : step.state === "cancelled"
                                  ? "border-red-400 bg-red-400"
                                  : "border-white/15 bg-transparent"
                          }`}
                        >
                          {step.state === "done" && (
                            <svg viewBox="0 0 12 12" className="h-3 w-3 text-[#00382d]" fill="none">
                              <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          )}
                          {step.state === "cancelled" && (
                            <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
                              <path d="M3 9l6-6M3 3l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          )}
                        </span>
                        {i < order.timeline.length - 1 && (
                          <span
                            className={`w-0.5 flex-1 ${
                              step.state === "done" ? "bg-primary/40" : "bg-white/8"
                            }`}
                            style={{ minHeight: 34 }}
                          />
                        )}
                      </div>
                      <div className="pb-6">
                        <div
                          className={`text-[14px] font-semibold font-[Montserrat] ${
                            step.state === "todo"
                              ? "text-white/25"
                              : step.state === "cancelled"
                                ? "text-red-300"
                                : "text-white/85"
                          }`}
                        >
                          {step.label}
                        </div>
                        {step.at && (
                          <div className="mt-0.5 text-[11px] text-white/30 font-[Montserrat]">
                            {new Date(step.at).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>

                {order.fulfilment?.trackingNumber && (
                  <div className="mt-2 rounded-xl border border-white/8 bg-white/2 p-4">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35 font-[Montserrat]">
                      Shipment Tracking
                    </div>
                    <div className="text-[13px] text-white/85 font-[Montserrat]">
                      {order.fulfilment.carrier} ·{" "}
                      <span className="font-mono">{order.fulfilment.trackingNumber}</span>
                    </div>
                    {order.fulfilment.trackingUrl && (
                      <a
                        href={order.fulfilment.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-[12px] text-primary hover:underline font-[Montserrat]"
                      >
                        Track with carrier →
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Payment & Refund Information Card */}
              <div className="rounded-2xl border border-white/6 bg-white/3 p-6 sm:p-7">
                <h2 className="mb-4 font-[Playfair_Display] text-[18px] text-white">
                  Payment & Refund Details
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40 font-[Montserrat]">
                      Payment Method
                    </span>
                    <p className="mt-1 font-[Montserrat] text-[13.5px] font-semibold text-white/90">
                      {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment (Razorpay)"}
                    </p>
                    <p className="mt-0.5 font-[Montserrat] text-[12px] text-white/50">
                      Status: <span className="font-medium text-white/80">{order.paymentLabel}</span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40 font-[Montserrat]">
                      Total Amount
                    </span>
                    <p className="mt-1 font-[Playfair_Display] text-[20px] font-bold tabular-nums text-white">
                      {formatInr(order.totalPaise)}
                    </p>
                    {order.paymentMethod === "COD" && order.paymentStatus === "UNPAID" && (
                      <p className="mt-0.5 font-[Montserrat] text-[11px] text-amber-300">
                        Payable on delivery
                      </p>
                    )}
                  </div>
                </div>

                {/* Refund Status block for cancelled orders */}
                {order.status === "CANCELLED" && (
                  <div className="mt-4">
                    {order.paymentMethod === "COD" ? (
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[12.5px] text-white/70 font-[Montserrat]">
                        <span className="block font-bold text-[11px] uppercase tracking-wider text-white/40 mb-1">
                          Refund Status
                        </span>
                        No payment was collected, so there is no refund to process.
                      </div>
                    ) : order.paymentStatus === "REFUNDED" ? (
                      <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-[12.5px] text-emerald-200 font-[Montserrat]">
                        <span className="block font-bold text-[11px] uppercase tracking-wider text-emerald-300 mb-1">
                          Refund Completed
                        </span>
                        {formatInr(order.totalPaise)} refunded to your original payment method. After processing, it may take 5–7 working days to reflect in your account.
                      </div>
                    ) : order.paymentStatus === "PARTIALLY_REFUNDED" ? (
                      <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-[12.5px] text-amber-200 font-[Montserrat]">
                        <span className="block font-bold text-[11px] uppercase tracking-wider text-amber-300 mb-1">
                          Partially Refunded
                        </span>
                        A partial refund has been processed to your original payment method. Contact us if you have any questions.
                      </div>
                    ) : (
                      <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-[12.5px] text-amber-200 font-[Montserrat]">
                        <span className="block font-bold text-[11px] uppercase tracking-wider text-amber-300 mb-1">
                          Refund Pending
                        </span>
                        Your refund will be processed by our team to your original payment method. Once processed, it may take 5–7 working days to reflect.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="rounded-2xl border border-white/6 bg-white/3 p-6 sm:p-7">
                <h2 className="mb-4 font-[Playfair_Display] text-[18px] text-white">Items Ordered</h2>
                <div className="flex flex-col gap-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="text-[13px] font-medium text-white/85 font-[Montserrat]">{item.productName}</div>
                        <div className="text-[11px] text-white/35 font-[Montserrat]">
                          {item.pack} × {item.qty}
                        </div>
                      </div>
                      <span className="text-[13px] font-semibold tabular-nums text-white/80 font-[Montserrat]">
                        {formatInr(item.lineTotal * 100)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t border-white/8 pt-4">
                  <span className="text-[13px] font-semibold text-white/70 font-[Montserrat]">
                    Total Amount
                  </span>
                  <span className="font-[Playfair_Display] text-[20px] font-bold text-white">
                    {formatInr(order.totalPaise)}
                  </span>
                </div>
                <p className="mt-3 text-[11.5px] text-white/40 font-[Montserrat]">
                  Delivering to {order.addressLine}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
