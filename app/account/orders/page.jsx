"use client";

import { useEffect, useState } from "react";
import AccountShell, { AccountCard } from "@/components/account/AccountShell";
import { EmptyState, FormMessage, GhostButton, Skeleton } from "@/components/account/ui";
import { OrderStatusPill, PAYMENT_TONE, formatOrderDate } from "@/components/account/orderUi";
import { useAuth } from "@/lib/authContext";
import { account as accountApi, formatInr } from "@/lib/api";

/**
 * Order history.
 *
 * Lists every order tied to this customer — including ones placed as a guest
 * before registering, which the API adopts by email. Each row links to the full
 * detail rather than expanding inline, so a deep link to one order is shareable
 * and the back button behaves.
 */
export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    (async () => {
      try {
        const list = await accountApi.orders();
        if (!cancelled) setOrders(list);
      } catch (err) {
        if (!cancelled) setError(err?.message ?? "Couldn't load your orders.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return (
    <AccountShell title="Your orders" subtitle="Every order placed with this email address.">
      <AccountCard title={orders ? `${orders.length} order${orders.length === 1 ? "" : "s"}` : "Orders"}>
        {error ? (
          <FormMessage>{error}</FormMessage>
        ) : orders === null ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : orders.length === 0 ? (
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
            body="Once you place an order it will show up here with its status, tracking and invoice."
            action={
              <GhostButton onClick={() => (window.location.href = "/products")}>
                Browse the range
              </GhostButton>
            }
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {orders.map((order) => (
              <li key={order.orderNo}>
                <a
                  href={`/account/orders/${order.orderNo}`}
                  className="block rounded-2xl border border-white/8 bg-white/[0.02] p-4 transition-all duration-200 hover:border-primary/30 hover:bg-white/[0.04] sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-[Montserrat] text-[13.5px] font-bold text-white">
                          {order.orderNo}
                        </span>
                        <OrderStatusPill status={order.status} label={order.statusLabel} />
                      </div>
                      <p className="mt-1.5 font-[Montserrat] text-[11.5px] text-white/35">
                        Placed {formatOrderDate(order.placedAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-[Montserrat] text-[15px] font-bold text-white">
                        {formatInr(order.totalPaise)}
                      </p>
                      <p
                        className={`mt-1 font-[Montserrat] text-[11px] font-semibold ${
                          PAYMENT_TONE[order.paymentStatus] ?? "text-white/35"
                        }`}
                      >
                        {order.paymentLabel}
                      </p>
                    </div>
                  </div>

                  {/* Item summary — the first two names, then a count. Enough to
                      recognise the order without turning the row into a table. */}
                  <p className="mt-3 truncate border-t border-white/[0.06] pt-3 font-[Montserrat] text-[12px] text-white/45">
                    {order.items
                      .slice(0, 2)
                      .map((i) => `${i.qty}× ${i.productName}`)
                      .join(", ")}
                    {order.items.length > 2 && ` +${order.items.length - 2} more`}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        )}
      </AccountCard>
    </AccountShell>
  );
}
