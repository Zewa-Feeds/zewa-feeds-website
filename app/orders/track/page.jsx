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
              <div className="rounded-2xl border border-white/6 bg-white/3 p-6">
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-[15px] text-white">{order.orderNo}</span>
                  <span className="rounded-full bg-primary/12 px-3 py-1 text-[11px] font-bold text-primary font-[Montserrat]">
                    {order.statusLabel}
                  </span>
                </div>

                {/* Timeline */}
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
                        </span>
                        {i < order.timeline.length - 1 && (
                          <span
                            className={`w-0.5 flex-1 ${step.state === "done" ? "bg-primary/40" : "bg-white/8"}`}
                            style={{ minHeight: 34 }}
                          />
                        )}
                      </div>
                      <div className="pb-6">
                        <div
                          className={`text-[14px] font-semibold font-[Montserrat] ${
                            step.state === "todo" ? "text-white/25" : "text-white/85"
                          }`}
                        >
                          {step.label}
                        </div>
                        {step.at && (
                          <div className="mt-0.5 text-[11px] text-white/30 font-[Montserrat]">
                            {new Date(step.at).toLocaleString("en-IN", {
                              day: "2-digit", month: "short", year: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>

                {order.cancelReason && (
                  <p className="mt-2 rounded-lg bg-red-500/8 px-3 py-2 text-[12px] text-red-300 font-[Montserrat]">
                    {order.cancelReason}
                  </p>
                )}

                {order.fulfilment?.trackingNumber && (
                  <div className="mt-4 rounded-xl border border-white/8 bg-white/2 p-4">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35 font-[Montserrat]">
                      Shipment
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

              {/* Items */}
              <div className="rounded-2xl border border-white/6 bg-white/3 p-6">
                <h2 className="mb-4 font-[Playfair_Display] text-[18px] text-white">Items</h2>
                <div className="flex flex-col gap-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="text-[13px] text-white/85 font-[Montserrat]">{item.productName}</div>
                        <div className="text-[11px] text-white/30 font-[Montserrat]">
                          {item.pack} × {item.qty}
                        </div>
                      </div>
                      <span className="text-[13px] tabular-nums text-white/70 font-[Montserrat]">
                        {formatInr(item.lineTotal * 100)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t border-white/8 pt-4">
                  <span className="text-[13px] font-semibold text-white/70 font-[Montserrat]">
                    Total {order.paymentMethod === "COD" && order.paymentStatus === "UNPAID" ? "(due on delivery)" : ""}
                  </span>
                  <span className="font-[Playfair_Display] text-[20px] text-white">
                    {formatInr(order.totalPaise)}
                  </span>
                </div>
                <p className="mt-3 text-[11px] text-white/30 font-[Montserrat]">
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
