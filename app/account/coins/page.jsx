"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AccountShell, { AccountCard } from "@/components/account/AccountShell";
import { EmptyState, GhostButton, PrimaryButton, Skeleton } from "@/components/account/ui";
import { useAuth } from "@/lib/authContext";
import { account as accountApi } from "@/lib/api";

/**
 * Zewa Coins — balance, pending, expiring and history (ZSOP004 §10.2).
 *
 * Four rules from §10 shape this screen, and each is a decision rather than a
 * style choice:
 *
 *   Available is the headline; PENDING IS NEVER SUMMED INTO IT (§10.1). Pending
 *   sits in its own panel with its unlock date, because a number that includes
 *   coins the customer cannot spend produces exactly the support contact the
 *   unlock date exists to prevent.
 *
 *   A negative balance is never shown (§6.7). The API already reports 0 with
 *   `negative: true`; this screen shows the neutral line the specification
 *   dictates rather than a minus sign, "which reads as a bug".
 *
 *   Holdout customers see no coin surface at all (§13.5) — the API returns
 *   `holdout` and the page renders nothing coin-related, so the control group
 *   stays uncontaminated.
 *
 *   The vocabulary is fixed (§10.3): "Zewa Coins", and "unlock" — never
 *   cashback, wallet, points, rewards, credits, mature or vest.
 */

/** Coins are rupees one-for-one, so this is a formatter, not a conversion. */
function rupees(coins, coinValuePaise = 100) {
  return `₹${((coins * coinValuePaise) / 100).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CoinsPage() {
  const { isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState(null);
  const [claimable, setClaimable] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const load = useCallback(async () => {
    const [coins, ledger, unclaimed] = await Promise.all([
      accountApi.coins(),
      accountApi.coinHistory({ limit: 25 }),
      // Claimable is best-effort: a customer with no guest orders is the norm,
      // and a failure here must not blank the balance they came to see.
      accountApi.claimableCoins().catch(() => ({ orders: [], totalCoins: 0 })),
    ]);
    setBalance(coins);
    setHistory(ledger);
    setClaimable(unclaimed);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, load]);

  async function handleClaim() {
    setClaiming(true);
    try {
      await accountApi.claimCoins();
      await load();
    } catch {
      setLoadError(true);
    } finally {
      setClaiming(false);
    }
  }

  const loading = !balance && !loadError;

  /*
   * §13.5: holdout customers see "no coin surface anywhere". Rendering an empty
   * coins page would still tell them the programme exists, so the whole screen
   * becomes a plain not-available state.
   */
  if (balance?.holdout) {
    return (
      <AccountShell title="Zewa Coins" subtitle="Rewards on your orders.">
        <AccountCard>
          <EmptyState
            title="Not available on your account"
            body="Zewa Coins are not currently available on this account."
          />
        </AccountCard>
      </AccountShell>
    );
  }

  return (
    <AccountShell
      title="Zewa Coins"
      subtitle="Earn coins on every order and spend them on the next one."
    >
      <div className="flex flex-col gap-6 sm:gap-8">
        {loadError && (
          <AccountCard>
            <EmptyState
              title="We couldn't load your coins"
              body="Please refresh the page. Your balance is safe."
            />
          </AccountCard>
        )}

        {loading && (
          <AccountCard>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-16 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </AccountCard>
        )}

        {balance && !loadError && (
          <>
            {/* ---- Headline balance. Available only — never plus pending. ---- */}
            <section className="overflow-hidden rounded-3xl border border-[#44e5c2]/20 bg-gradient-to-br from-[#0c1a2b] to-[#09101f] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div className="flex flex-col gap-6 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div>
                  <p className="font-[Montserrat] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#44e5c2]/70">
                    Available to use
                  </p>
                  <p className="mt-2 font-[Playfair_Display] text-[44px] leading-none text-white">
                    {balance.available.toLocaleString("en-IN")}
                    <span className="ml-2 font-[Montserrat] text-[15px] font-medium text-white/50">
                      Zewa Coins
                    </span>
                  </p>
                  <p className="mt-2 font-[Montserrat] text-[13px] text-white/55">
                    Worth {rupees(balance.available, balance.coinValuePaise)} off your next order
                    · 1 coin = ₹1
                  </p>
                </div>

                {balance.available >= balance.minRedemption && (
                  <Link href="/products" className="shrink-0 sm:w-48">
                    <PrimaryButton type="button">Shop now</PrimaryButton>
                  </Link>
                )}
              </div>

              {/*
                §6.7: a negative balance is shown as 0 with a neutral line, and
                the redemption surface disappears. Never a minus sign.
              */}
              {balance.negative && (
                <div className="border-t border-white/10 bg-white/[0.03] px-6 py-4 sm:px-8">
                  <p className="font-[Montserrat] text-[12.5px] text-white/60">
                    Your coins balance is being adjusted following a recent return.
                  </p>
                </div>
              )}

              {!balance.negative && balance.available < balance.minRedemption && (
                <div className="border-t border-white/10 bg-white/[0.03] px-6 py-4 sm:px-8">
                  <p className="font-[Montserrat] text-[12.5px] text-white/60">
                    Earn {balance.minRedemption} coins to start using them. You have{" "}
                    {balance.available}.
                  </p>
                </div>
              )}
            </section>

            {/* ---- Guest orders waiting to be claimed (§3.4) ---- */}
            {claimable?.totalCoins > 0 && (
              <AccountCard
                title="Claim your coins"
                description="You placed an order before creating your profile."
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-[Montserrat] text-[13.5px] leading-relaxed text-white/70">
                    <span className="font-semibold text-[#44e5c2]">
                      {claimable.totalCoins} Zewa Coins
                    </span>{" "}
                    are waiting on{" "}
                    {claimable.orders.length === 1
                      ? "an earlier order"
                      : `${claimable.orders.length} earlier orders`}
                    . That's {rupees(claimable.totalCoins, balance.coinValuePaise)} off your next
                    one.
                  </p>
                  <div className="shrink-0 sm:w-40">
                    <PrimaryButton type="button" loading={claiming} onClick={handleClaim}>
                      Claim now
                    </PrimaryButton>
                  </div>
                </div>
              </AccountCard>
            )}

            {/* ---- Pending, shown separately with the unlock date (§10.1) ---- */}
            {balance.pending > 0 && (
              <AccountCard
                title="On the way"
                description="Coins unlock once the return window on your order closes."
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-[Playfair_Display] text-[28px] leading-none text-white">
                    {balance.pending.toLocaleString("en-IN")}
                  </span>
                  <span className="font-[Montserrat] text-[13px] text-white/55">
                    coins pending
                    {balance.nextUnlockAt && ` · unlock on ${formatDate(balance.nextUnlockAt)}`}
                  </span>
                </div>
              </AccountCard>
            )}

            {/* ---- Expiring soon (§4.3) ---- */}
            {balance.expiringSoon?.length > 0 && (
              <AccountCard
                title="Expiring soon"
                description="Use these before they go — coins last 12 months from the day you earn them."
              >
                <ul className="flex flex-col divide-y divide-white/10">
                  {balance.expiringSoon.map((lot) => (
                    <li
                      key={`${lot.expiresAt}-${lot.coins}`}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <span className="font-[Montserrat] text-[13.5px] text-white/75">
                        {lot.coins} coins
                      </span>
                      <span className="font-[Montserrat] text-[12.5px] text-white/45">
                        Expires {formatDate(lot.expiresAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              </AccountCard>
            )}

            {/* ---- History, in plain language, linking to orders (§9.4) ---- */}
            <AccountCard
              title="History"
              description="Every coin you've earned, used or had returned."
            >
              {!history?.entries?.length ? (
                <EmptyState
                  title="No coin activity yet"
                  body="You'll earn 2 Zewa Coins for every ₹100 you spend."
                  action={
                    <Link href="/products">
                      <GhostButton type="button">Browse products</GhostButton>
                    </Link>
                  }
                />
              ) : (
                <ul className="flex flex-col divide-y divide-white/10">
                  {history.entries.map((entry) => (
                    <li key={entry.id} className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="font-[Montserrat] text-[13.5px] text-white/80">
                          {entry.description}
                        </p>
                        <p className="mt-0.5 font-[Montserrat] text-[12px] text-white/40">
                          {formatDate(entry.at)}
                          {entry.orderNo && (
                            <>
                              {" · "}
                              <Link
                                href={`/account/orders/${encodeURIComponent(entry.orderNo)}`}
                                className="text-[#44e5c2]/70 underline-offset-2 hover:underline"
                              >
                                {entry.orderNo}
                              </Link>
                            </>
                          )}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 font-[Montserrat] text-[13.5px] font-semibold tabular-nums ${
                          entry.coins > 0 ? "text-[#44e5c2]" : "text-white/50"
                        }`}
                      >
                        {entry.coins > 0 ? "+" : ""}
                        {entry.coins}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </AccountCard>

            {/* ---- The terms, where the balance is shown (§12.2) ---- */}
            <p className="px-1 font-[Montserrat] text-[11.5px] leading-relaxed text-white/35">
              Earn 2 Zewa Coins for every ₹100 of eligible product value. 1 coin = ₹1 off a
              future order. Coins unlock after the return window closes and expire 12 months
              after you earn them. Coins have no cash value and are not refundable as cash.{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-white/60">
                Full terms
              </Link>
            </p>
          </>
        )}
      </div>
    </AccountShell>
  );
}
