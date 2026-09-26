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
  /*
   * True once an order owns this hold.
   *
   * A ref, not state: the unmount cleanup reads it after the last render, where a
   * state value would be the stale one captured when the effect was created.
   */
  const settledRef = useRef(false);
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
    /*
     * `settledRef` stops this firing after an order is placed. Success clears the
     * cart, which changes `linesKey` and would otherwise re-apply the hold against
     * an EMPTY cart — asking the server to re-hold coins for an order that has
     * already consumed them.
     */
    if (!enabled || !isAuthenticated || appliedRef.current <= 0 || settledRef.current) return;
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

    /*
     * Re-quote so the balance reflects the released hold.
     *
     * `available` is spendable coins — balance MINUS what is currently held —
     * so a stale quote kept showing the reduced figure after a removal: apply
     * 229 of 271, remove them, and the panel still said 42 were spendable. The
     * coins were genuinely back; only the number on screen was wrong.
     *
     * Deliberately after the hold is dropped, and non-blocking: a failure here
     * leaves the previous quote in place, which is the same fail-invisible
     * behaviour as the initial fetch.
     */
    if (lines.length > 0) {
      try {
        const next = await accountApi.coinQuote(lines, couponCodes);
        setQuote(next);
      } catch {
        /* keep the previous quote — never surface an error on the pay path */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey, linesKey]);

  /*
   * Release the hold if the customer leaves without paying (§8.1 #2).
   *
   * `settledRef` is the guard. Once an order has been placed the hold belongs to
   * that ORDER, not to this component: the server bound it inside the placement
   * transaction, and releasing it here would take the discount off an order the
   * customer has already paid for — or, on a dismissed payment, off the order the
   * retry is about to reuse.
   *
   * Deliberately NOT removed outright. A customer who abandons checkout without
   * placing anything must still get their coins back rather than wait out the
   * 30-minute sweep, which is what this cleanup is for.
   */
  useEffect(() => {
    return () => {
      if (appliedRef.current > 0 && !settledRef.current) {
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
    /*
     * A live hold this checkout still owns.
     *
     * Distinct from `applied > 0`, which is display state: after `settle()` the
     * coins are the order's, and re-sending the key would ask the server to
     * resolve a reservation that is already bound.
     */
    hasHold: applied > 0 && !settledRef.current,
    apply,
    remove,
    /** Paise taken off the payable total, for the order summary. */
    discountPaise: applied * (quote?.coinValuePaise ?? 100),
    /**
     * Hand the hold over to the order.
     *
     * Called once an order exists — the server has bound the reservation to it
     * inside the placement transaction, so this component must stop treating the
     * hold as its own: no re-apply on a cart change, and no release on unmount.
     *
     * The ref is set BEFORE the state update, because the unmount cleanup and the
     * re-apply effect both read the ref and either can run before React processes
     * the re-render.
     */
    settle: () => {
      settledRef.current = true;
      appliedRef.current = 0;
      setApplied(0);
      setNotice("");
    },
  };
}
