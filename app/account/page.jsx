"use client";

import { useEffect, useState } from "react";
import AccountShell, { AccountCard } from "@/components/account/AccountShell";
import { EmptyState, GhostButton, Skeleton } from "@/components/account/ui";
import { useAuth } from "@/lib/authContext";
import { account as accountApi, formatInr } from "@/lib/api";
import { STATUS_TONE, OrderStatusPill, formatOrderDate } from "@/components/account/orderUi";

/**
 * Account overview.
 *
 * Deliberately a summary, not a fourth place to edit things: the most recent
 * orders, a saved-address count, and the profile at a glance. Everything
 * actionable links out to the section that owns it, so there is exactly one
 * screen responsible for each kind of change.
 */
export default function AccountOverviewPage() {
  const { customer, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState(null);
  const [addressCount, setAddressCount] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    (async () => {
      try {
        // Parallel: neither depends on the other, and serialising them would
        // double the time the dashboard spends on skeletons.
        const [orderList, addressList] = await Promise.all([
          accountApi.orders(),
          accountApi.addresses(),
        ]);
        if (cancelled) return;
        setOrders(orderList);
        setAddressCount(addressList.length);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const recent = orders?.slice(0, 3) ?? [];

  return (
    <AccountShell
      title={`Hello, ${customer?.firstName ?? "there"}.`}
      subtitle="Your orders, addresses and account details in one place."
    >
      <div className="flex flex-col gap-6">
        {/* ---- Summary tiles ---- */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <SummaryTile
            label="Orders"
            value={orders === null ? null : String(orders.length)}
            href="/account/orders"
            error={loadError}
          />
          <SummaryTile
            label="Saved addresses"
            value={addressCount === null ? null : String(addressCount)}
            href="/account/addresses"
            error={loadError}
          />
          <SummaryTile
            label="Total spent"
            value={
              orders === null
                ? null
                : formatInr(
                    orders
                      // Cancelled orders were never money that left the customer.
                      .filter((o) => o.status !== "CANCELLED")
                      .reduce((sum, o) => sum + (o.totalPaise ?? 0), 0),
                  )
            }
            className="col-span-2 lg:col-span-1"
            error={loadError}
          />
        </div>

        {/* ---- Recent orders ---- */}
        <AccountCard
          title="Recent orders"
          description="Your three most recent orders."
          actions={
            orders && orders.length > 0 ? (
              <GhostButton onClick={() => (window.location.href = "/account/orders")}>
                View all
              </GhostButton>
            ) : null
          }
        >
          {loadError ? (
            <p className="font-[Montserrat] text-[13px] text-white/40">
              Couldn&rsquo;t load your orders just now. Refresh to try again.
            </p>
          ) : orders === null ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : recent.length === 0 ? (
            <EmptyState
              icon={
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path
                    d="M4 7h16l-1.5 12h-13L4 7zM9 7V5a3 3 0 016 0v2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              title="No orders yet"
              body="When you place your first order it will appear here, with tracking and invoices."
              action={
                <GhostButton onClick={() => (window.location.href = "/products")}>
                  Browse the range
                </GhostButton>
              }
            />
          ) : (
            <ul className="flex flex-col divide-y divide-white/[0.06]">
              {recent.map((order) => (
                <li key={order.orderNo}>
                  <a
                    href={`/account/orders/${order.orderNo}`}
                    className="flex items-center justify-between gap-4 py-4 transition-colors first:pt-0 last:pb-0 hover:opacity-80"
                  >
                    <div className="min-w-0">
                      <p className="font-[Montserrat] text-[13px] font-semibold text-white">
                        {order.orderNo}
                      </p>
                      <p className="mt-1 truncate font-[Montserrat] text-[11.5px] text-white/35">
                        {formatOrderDate(order.placedAt)} ·{" "}
                        {order.items.length} item{order.items.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <OrderStatusPill status={order.status} label={order.statusLabel} />
                      <span className="font-[Montserrat] text-[13px] font-semibold text-white">
                        {formatInr(order.totalPaise)}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </AccountCard>

        {/* ---- Profile at a glance ---- */}
        <AccountCard
          title="Your details"
          actions={
            <GhostButton onClick={() => (window.location.href = "/account/profile")}>
              Edit
            </GhostButton>
          }
        >
          <dl className="grid gap-5 sm:grid-cols-3">
            <Detail label="Name" value={`${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`.trim()} />
            <Detail label="Email" value={customer?.email} />
            <Detail label="Mobile" value={customer?.phone || "Not added"} muted={!customer?.phone} />
          </dl>
        </AccountCard>
      </div>
    </AccountShell>
  );
}

function SummaryTile({ label, value, href, className = "", error }) {
  const body = (
    <>
      <p className="font-[Montserrat] text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      {error ? (
        <p className="mt-2.5 font-[Playfair_Display] text-[22px] text-white/25">—</p>
      ) : value === null ? (
        <Skeleton className="mt-2.5 h-7 w-16" />
      ) : (
        <p className="mt-2.5 font-[Playfair_Display] text-[26px] leading-none text-white sm:text-[30px]">
          {value}
        </p>
      )}
    </>
  );

  const shell = `rounded-2xl border border-white/8 bg-white/[0.02] p-5 ${className}`;

  return href ? (
    <a href={href} className={`${shell} transition-colors hover:border-primary/30`}>
      {body}
    </a>
  ) : (
    <div className={shell}>{body}</div>
  );
}

function Detail({ label, value, muted = false }) {
  return (
    <div>
      <dt className="font-[Montserrat] text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
        {label}
      </dt>
      <dd
        className={`mt-1.5 break-words font-[Montserrat] text-[13.5px] ${
          muted ? "text-white/25" : "text-white/80"
        }`}
      >
        {value || "—"}
      </dd>
    </div>
  );
}
