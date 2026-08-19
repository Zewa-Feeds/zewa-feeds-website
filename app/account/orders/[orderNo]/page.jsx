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
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

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

  const backButton = (
    <GhostButton onClick={() => (window.location.href = "/account/orders")}>
      All orders
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
      title={order ? `Order ${order.orderNo}` : "Order"}
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
          {/* ---- Status + payment ---- */}
          <AccountCard title="Status">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div>
                <p className="font-[Montserrat] text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Order status
                </p>
                <div className="mt-2">
                  <OrderStatusPill status={order.status} label={order.statusLabel} />
                </div>
              </div>
              <div>
                <p className="font-[Montserrat] text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Payment
                </p>
                <p
                  className={`mt-2 font-[Montserrat] text-[13px] font-semibold ${
                    PAYMENT_TONE[order.paymentStatus] ?? "text-white/50"
                  }`}
                >
                  {order.paymentLabel}
                  <span className="ml-2 font-normal text-white/30">
                    {order.paymentMethod === "COD" ? "Cash on delivery" : "Online"}
                  </span>
                </p>
              </div>
              {order.invoiceNumber && (
                <div>
                  <p className="font-[Montserrat] text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                    Invoice
                  </p>
                  <p className="mt-2 font-[Montserrat] text-[13px] text-white/70">
                    {order.invoiceNumber}
                  </p>
                </div>
              )}
            </div>

            {/*
              Tracking sits ABOVE the timeline: once an order is moving, opening
              the carrier's page is the thing the customer came here to do, and
              the timeline is history by comparison. Renders nothing until there
              are shipment details.
            */}
            <TrackingPanel fulfilment={order.fulfilment} status={order.status} />

            {/* Timeline — the backend already marks which steps are done. */}
            {/*
              `state` is one of done | current | todo | cancelled (see
              lifecycle.ts). "current" is a step the order HAS reached, so it
              renders filled like "done" — only "todo" is hollow.
            */}
            {order.timeline?.length > 0 && (
              <ol className="mt-7 flex flex-col gap-0 border-t border-white/[0.06] pt-6">
                {order.timeline.map((step, i) => {
                  const cancelled = step.state === "cancelled";
                  const reached = cancelled || step.state === "done" || step.state === "current";
                  return (
                    <li key={`${step.label}-${i}`} className="flex gap-3.5">
                      <div className="flex flex-col items-center">
                        <span
                          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                            cancelled
                              ? "bg-red-400"
                              : reached
                              ? "bg-primary"
                              : "border border-white/20 bg-transparent"
                          } ${
                            step.state === "current" && !cancelled
                              ? "ring-4 ring-primary/20"
                              : ""
                          }`}
                        />
                        {i < order.timeline.length - 1 && (
                          <span
                            className={`w-px flex-1 ${reached ? "bg-primary/30" : "bg-white/10"}`}
                          />
                        )}
                      </div>
                      <div className="pb-5 last:pb-0">
                        <p
                          className={`font-[Montserrat] text-[12.5px] font-semibold ${
                            cancelled
                              ? "text-red-300"
                              : reached
                              ? "text-white/85"
                              : "text-white/30"
                          }`}
                        >
                          {step.label}
                        </p>
                        {step.at && (
                          <p className="mt-0.5 font-[Montserrat] text-[11px] text-white/30">
                            {formatOrderDateTime(step.at)}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

          </AccountCard>

          {/* ---- Items ---- */}
          <AccountCard title="Items">
            <ul className="flex flex-col divide-y divide-white/[0.06]">
              {order.items.map((item, i) => (
                <li
                  key={`${item.sku}-${i}`}
                  className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="font-[Montserrat] text-[13px] text-white/85">
                      {item.productName}
                    </p>
                    <p className="mt-1 font-[Montserrat] text-[11.5px] text-white/35">
                      {item.pack} · Qty {item.qty}
                      {item.sku && <span className="ml-2 font-mono text-white/20">{item.sku}</span>}
                    </p>
                  </div>
                  <p className="shrink-0 font-[Montserrat] text-[13px] font-semibold text-white">
                    {formatInr(item.lineTotalPaise)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 flex flex-col gap-2.5 border-t border-white/[0.06] pt-5">
              <Row label="Subtotal" value={formatInr(order.subtotalPaise)} />
              {order.discountPaise > 0 && (
                <Row
                  label="Discount"
                  value={`− ${formatInr(order.discountPaise)}`}
                  tone="text-primary"
                />
              )}
              <Row
                label="Shipping"
                value={order.shippingPaise > 0 ? formatInr(order.shippingPaise) : "Free"}
              />
              <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-4">
                <dt className="font-[Montserrat] text-[13px] font-semibold text-white">Total</dt>
                <dd className="font-[Playfair_Display] text-[22px] text-primary">
                  {formatInr(order.totalPaise)}
                </dd>
              </div>
            </dl>
          </AccountCard>

          {/* ---- Delivery ---- */}
          <AccountCard title="Delivery address">
            <p className="font-[Montserrat] text-[13px] leading-relaxed text-white/60">
              {order.addressLine}
            </p>
            {order.customerNote && (
              <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] p-3.5">
                <p className="font-[Montserrat] text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Your note
                </p>
                <p className="mt-1.5 font-[Montserrat] text-[12.5px] leading-relaxed text-white/55">
                  {order.customerNote}
                </p>
              </div>
            )}
          </AccountCard>
        </div>
      )}
    </AccountShell>
  );
}

function Row({ label, value, tone = "text-white/70" }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="font-[Montserrat] text-[12.5px] text-white/40">{label}</dt>
      <dd className={`font-[Montserrat] text-[12.5px] ${tone}`}>{value}</dd>
    </div>
  );
}
