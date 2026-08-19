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
  const initials = `${customer?.firstName?.[0] ?? ""}${customer?.lastName?.[0] ?? ""}`.toUpperCase() || "A";

  const totalSpentPaise = orders
    ? orders.filter((o) => o.status !== "CANCELLED").reduce((sum, o) => sum + (o.totalPaise ?? 0), 0)
    : 0;

  return (
    <AccountShell
      title={`Welcome back, ${customer?.firstName ?? "Customer"}`}
      subtitle="Manage your orders, saved addresses and account settings."
    >
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* ---- Customer Welcome Hero Banner ---- */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0b1426] via-[#0e1b33] to-[#070e1c] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 font-[Montserrat] text-[18px] font-bold text-primary shadow-[0_0_20px_rgba(68,229,194,0.2)]">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-[Playfair_Display] text-[22px] sm:text-[26px] font-bold text-white tracking-wide truncate">
                    {customer?.firstName} {customer?.lastName}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Account Active
                  </span>
                </div>
                <p className="mt-1 font-[Montserrat] text-[13px] text-white/50 truncate">
                  {customer?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/account/profile"
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 font-[Montserrat] text-[12px] font-semibold text-white transition-all hover:border-primary/40 hover:bg-white/[0.08]"
              >
                Edit Profile
              </a>
            </div>
          </div>
        </div>

        {/* ---- Summary Stat Tiles ---- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryTile
            label="Total Orders"
            value={orders === null ? null : String(orders.length)}
            href="/account/orders"
            error={loadError}
            subtext="Track & view past orders"
            icon={
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            }
          />
          <SummaryTile
            label="Saved Addresses"
            value={addressCount === null ? null : String(addressCount)}
            href="/account/addresses"
            error={loadError}
            subtext="Delivery locations"
            icon={
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
          />
          <SummaryTile
            label="Total Spent"
            value={orders === null ? null : formatInr(totalSpentPaise)}
            className="sm:col-span-2 lg:col-span-1"
            error={loadError}
            subtext="Lifetime order total"
            icon={
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            }
          />
        </div>

        {/* ---- Recent Orders ---- */}
        <AccountCard
          title="Recent Orders"
          description="Your latest purchases and shipment statuses."
          actions={
            orders && orders.length > 0 ? (
              <GhostButton onClick={() => (window.location.href = "/account/orders")}>
                View all orders →
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
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
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
                  Browse products
                </GhostButton>
              }
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {recent.map((order) => (
                <li key={order.orderNo}>
                  <a
                    href={`/account/orders/${order.orderNo}`}
                    className="group block rounded-2xl border border-white/10 bg-[#09101f] p-5 sm:p-6 transition-all duration-200 hover:border-primary/50 hover:bg-[#0d1627] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(68,229,194,0.08)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-[Montserrat] text-[15px] font-bold text-white group-hover:text-primary transition-colors">
                            {order.orderNo}
                          </span>
                          <OrderStatusPill status={order.status} label={order.statusLabel} />
                        </div>
                        <p className="font-[Montserrat] text-[12.5px] text-white/50">
                          Placed {formatOrderDate(order.placedAt)} · {order.items.length} item{order.items.length === 1 ? "" : "s"}
                        </p>
                      </div>

                      <div className="flex items-center gap-5">
                        <span className="font-[Montserrat] text-[17px] font-bold text-white tabular-nums">
                          {formatInr(order.totalPaise)}
                        </span>
                        <span className="font-[Montserrat] text-[12px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Details →
                        </span>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </AccountCard>

        {/* ---- Profile Details at a Glance ---- */}
        <AccountCard
          title="Account Details"
          description="Your primary contact information."
          actions={
            <GhostButton onClick={() => (window.location.href = "/account/profile")}>
              Edit Details
            </GhostButton>
          }
        >
          <dl className="grid gap-4 sm:grid-cols-3">
            <Detail
              label="Full Name"
              value={`${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`.trim() || "Not set"}
              icon={
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            <Detail
              label="Email Address"
              value={customer?.email ?? "Not set"}
              icon={
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            <Detail
              label="Mobile Number"
              value={customer?.phone || "Not added"}
              muted={!customer?.phone}
              icon={
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
            />
          </dl>
        </AccountCard>
      </div>
    </AccountShell>
  );
}

function SummaryTile({ label, value, href, className = "", error, icon, subtext }) {
  const body = (
    <div className="flex flex-col h-full justify-between gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
          {label}
        </p>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 shadow-[0_0_12px_rgba(68,229,194,0.15)]">
            {icon}
          </div>
        )}
      </div>

      <div>
        {error ? (
          <p className="font-[Playfair_Display] text-[24px] text-white/25">—</p>
        ) : value === null ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <p className="font-[Playfair_Display] text-[28px] font-bold leading-none text-white sm:text-[34px] drop-shadow-[0_0_12px_rgba(255,255,255,0.1)]">
            {value}
          </p>
        )}
        {subtext && (
          <p className="mt-2 font-[Montserrat] text-[11px] text-white/40 flex items-center gap-1">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );

  const shell = `group relative overflow-hidden rounded-2xl border border-white/10 bg-[#09101f] p-6 ${className}`;

  return href ? (
    <a
      href={href}
      className={`${shell} transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-[#0d1627] hover:shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(68,229,194,0.1)]`}
    >
      {body}
    </a>
  ) : (
    <div className={shell}>{body}</div>
  );
}

function Detail({ label, value, muted = false, icon }) {
  return (
    <div className="flex flex-col justify-between gap-2.5 rounded-2xl border border-white/10 bg-[#09101f] p-5 sm:p-6 transition-all hover:border-primary/30">
      <div className="flex items-center gap-2">
        {icon}
        <dt className="font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
          {label}
        </dt>
      </div>
      <dd
        className={`break-all font-[Montserrat] text-[14.5px] font-semibold leading-relaxed ${
          muted ? "text-white/30" : "text-white"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
