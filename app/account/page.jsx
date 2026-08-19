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
            icon={
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            }
          />
          <SummaryTile
            label="Saved addresses"
            value={addressCount === null ? null : String(addressCount)}
            href="/account/addresses"
            error={loadError}
            icon={
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
          />
          <SummaryTile
            label="Total spent"
            value={
              orders === null
                ? null
                : formatInr(
                    orders
                      .filter((o) => o.status !== "CANCELLED")
                      .reduce((sum, o) => sum + (o.totalPaise ?? 0), 0),
                  )
            }
            className="col-span-2 lg:col-span-1"
            error={loadError}
            icon={
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            }
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
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
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
            <ul className="flex flex-col divide-y divide-white/[0.08]">
              {recent.map((order) => (
                <li key={order.orderNo}>
                  <a
                    href={`/account/orders/${order.orderNo}`}
                    className="group flex items-center justify-between gap-4 py-4.5 transition-all duration-200 hover:px-2 rounded-xl hover:bg-white/[0.03]"
                  >
                    <div className="min-w-0">
                      <p className="font-[Montserrat] text-[13.5px] font-bold text-white group-hover:text-primary transition-colors">
                        {order.orderNo}
                      </p>
                      <p className="mt-1 truncate font-[Montserrat] text-[11.5px] text-white/45">
                        {formatOrderDate(order.placedAt)} ·{" "}
                        {order.items.length} item{order.items.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <OrderStatusPill status={order.status} label={order.statusLabel} />
                      <span className="font-[Montserrat] text-[14px] font-bold text-white">
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

function SummaryTile({ label, value, href, className = "", error, icon }) {
  const body = (
    <div className="flex flex-col h-full justify-between gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
          {label}
        </p>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 shadow-[0_0_12px_rgba(68,229,194,0.15)]">
            {icon}
          </div>
        )}
      </div>
      {error ? (
        <p className="font-[Playfair_Display] text-[24px] text-white/25">—</p>
      ) : value === null ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <p className="font-[Playfair_Display] text-[28px] font-semibold leading-none text-white sm:text-[34px] drop-shadow-[0_0_12px_rgba(255,255,255,0.1)]">
          {value}
        </p>
      )}
    </div>
  );

  const shell = `group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0b1424]/90 to-[#080f1d]/90 p-6 ${className}`;

  return href ? (
    <a
      href={href}
      className={`${shell} transition-all duration-300 hover:-translate-y-1 hover:border-[#44e5c2]/40 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(68,229,194,0.1)]`}
    >
      {body}
    </a>
  ) : (
    <div className={shell}>{body}</div>
  );
}

function Detail({ label, value, muted = false }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <dt className="font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
        {label}
      </dt>
      <dd
        className={`mt-1.5 break-words font-[Montserrat] text-[14px] ${
          muted ? "text-white/30" : "text-white/90"
        }`}
      >
        {value || "—"}
      </dd>
    </div>
  );
}
