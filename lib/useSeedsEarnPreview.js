"use client";

import { useEffect, useState } from "react";
import { cart as cartApi } from "@/lib/api";

/**
 * How many Zewa Seeds this cart would earn, for the line under the checkout
 * total. Re-asks the server when the cart, coupons or applied seeds change.
 *
 * Fails invisibly: on any error it reports 0 and the line simply doesn't show.
 */
export function useSeedsEarnPreview({ items, couponCodes, coinsApplied }) {
  const [coins, setCoins] = useState(0);
  const lines = items.map((i) => ({ sku: i.sku, qty: i.qty }));
  const key = JSON.stringify({ lines, couponCodes, coinsApplied });

  useEffect(() => {
    if (lines.length === 0) {
      setCoins(0);
      return;
    }
    let cancelled = false;
    // Debounced: quantity buttons can fire several changes in a row.
    const t = setTimeout(() => {
      cartApi
        .seedsEarnPreview(lines, { couponCodes, coinsApplied })
        .then((n) => !cancelled && setCoins(n))
        .catch(() => !cancelled && setCoins(0));
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return coins;
}
