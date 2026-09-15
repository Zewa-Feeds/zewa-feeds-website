"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { account as accountApi } from "@/lib/api";

/**
 * Zewa Coins at checkout — ZSOP004 §4.1, §4.3, §8.1 #11, §10.1.
 *
 * Owns the reservation lifecycle so the checkout page does not have to. Four
 * behaviours here are specified rather than chosen:
 *
 *   FAILS INVISIBLY (§8.1 #11, §10.1). Every call is wrapped: a loyalty outage
 *   leaves `quote` null, the panel renders nothing, and checkout continues at
 *   full price. "It must never block rendering of the payment step or show an
 *   error on the payment path." Redemption fails CLOSED — no coins applied —
 *   which is the safe direction.
 *
 *   RECALCULATE, NEVER PRESERVE (§4.1). Any cart change re-quotes and re-applies.
 *   "If the eligible value falls below the coins already applied, silently reduce
 *   and show a non-blocking notice. A stale applied value surviving a cart
 *   mutation is how negative order totals get created."
 *
 *   THE CART KEY IS STABLE PER SESSION, not per cart contents. The reservation
 *   is account-anchored (§4.3) and re-applying on the same key replaces the hold
 *   rather than stacking, so a customer editing their cart repeatedly ends up
 *   with exactly one hold.
 *
 *   HOLDS ARE RELEASED ON UNMOUNT. A customer who navigates away should get
 *   their coins back immediately rather than waiting out the 30-minute sweep.
 */
export function useCoins({ items, isAuthenticated, enabled = true, couponCodes = [] }) {
  const [quote, setQuote] = useState(null);
  const [applied, setApplied] = useState(0);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  /*
   * One key for the life of this checkout session. Deliberately not derived from
   * cart contents: a key that changed with the cart would orphan the previous
   * hold on every quantity tweak, and the customer would watch their spendable
   * balance drain until the sweeper caught up.
   */
  const cartKey = useRef(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  ).current;

  const lines = items.map((i) => ({ sku: i.sku, qty: i.qty }));
  /*
   * Coupon codes are part of the cart's identity here (ZSOP004 §4): a coupon
   * carrying `blocksCoins` refuses the hold, so applying or removing one must
   * re-quote exactly as a quantity change does.
   */
  const linesKey = JSON.stringify({ lines, couponCodes });

  /** Latest applied amount, readable from cleanup without re-subscribing. */
  const appliedRef = useRef(0);
  useEffect(() => {
    appliedRef.current = applied;
  }, [applied]);

  // ---- Quote, re-run whenever the cart changes (§4.1) ----------------------
  useEffect(() => {
    if (!enabled || !isAuthenticated || lines.length === 0) {
      setQuote(null);
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const next = await accountApi.coinQuote(lines, couponCodes);
        if (!cancelled) setQuote(next);
      } catch {
        // Fail invisibly — no box, no error, checkout unaffected.
        if (!cancelled) setQuote(null);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linesKey, isAuthenticated, enabled]);

  /*
   * Re-apply after a cart change (§4.1).
   *
   * The server is the authority on how much still fits: it returns what it
   * actually held, which may be less than was applied before. A reduction is a
   * NON-BLOCKING notice, never an error — the customer did nothing wrong.
   */
  useEffect(() => {
    if (!enabled || !isAuthenticated || appliedRef.current <= 0) return;
    let cancelled = false;

    (async () => {
      try {
        const result = await accountApi.applyCoins({
          coins: appliedRef.current,
          cartKey,
          lines,
          couponCodes,
        });
        if (cancelled) return;

        setApplied(result.held);
        if (result.held < appliedRef.current) {
          setNotice(
            result.held === 0
              ? "Your coins were removed because your cart changed."
              : `We reduced your coins to ${result.held} because your cart changed.`,
          );
        }
      } catch {
        if (!cancelled) {
          setApplied(0);
          setNotice("Your coins could not be applied to this cart.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linesKey]);

  const apply = useCallback(
    async (coins) => {
      setBusy(true);
      setNotice("");
      try {
        const result = await accountApi.applyCoins({ coins, cartKey, lines, couponCodes });
        setApplied(result.held);
        if (result.held > 0 && result.held < coins) {
          setNotice(`We could only apply ${result.held} coins to this order.`);
        }
        return result;
      } catch {
        // Fail closed: nothing held, and the panel stays usable.
        setApplied(0);
        setNotice("Your coins could not be applied. Please try again.");
        return { held: 0 };
      } finally {
        setBusy(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [linesKey, cartKey],
  );

  const remove = useCallback(async () => {
    setBusy(true);
    setNotice("");
    try {
      await accountApi.removeCoins(cartKey);
    } catch {
      // The hold expires on its own within 30 minutes even if this fails, so
      // there is nothing useful to tell the customer.
    } finally {
      setApplied(0);
      setBusy(false);
    }
  }, [cartKey]);

  // Release the hold if the customer leaves without paying (§8.1 #2).
  useEffect(() => {
    return () => {
      if (appliedRef.current > 0) {
        void accountApi.removeCoins(cartKey).catch(() => undefined);
      }
    };
  }, [cartKey]);

  return {
    quote,
    applied,
    busy,
    notice,
    cartKey,
    apply,
    remove,
    /** Paise taken off the payable total, for the order summary. */
    discountPaise: applied * (quote?.coinValuePaise ?? 100),
    /** Clears local state once an order is placed; the hold is now the order's. */
    settle: () => {
      appliedRef.current = 0;
      setApplied(0);
      setNotice("");
    },
  };
}
