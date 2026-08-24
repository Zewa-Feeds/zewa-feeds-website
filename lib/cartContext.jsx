"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { cart as cartApi, settings as settingsApi } from "@/lib/api";

/**
 * Cart state.
 *
 * localStorage holds only what identifies a line — SKU and quantity — plus display
 * fields for instant rendering. It is NOT the source of truth for price or stock:
 * a cart can sit in a browser for weeks, so on mount and before checkout we call
 * `POST /cart/validate` and take the server's numbers.
 *
 * All money is integer paise.
 */

const CartContext = createContext(null);

// v2: the old key held rupee prices, so a stale cart would render wrong amounts.
const STORAGE_KEY = "zewa_cart_v2";

/**
 * Fallback ceiling when a line has no `maxQty` (an older stored cart).
 *
 * Was 99, which let the drawer and cart page climb far past real stock — the
 * shopper only discovered the problem at checkout. Each line now carries its own
 * `maxQty` from the API; this is only the floor for legacy entries.
 */
const FALLBACK_MAX_QTY = 10;

/** Ceiling for one line: what the API said, else the fallback. */
export const lineMax = (item) => item?.maxQty ?? FALLBACK_MAX_QTY;

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const idx = state.findIndex((i) => i.sku === action.item.sku);
      if (idx > -1) {
        return state.map((i, n) =>
          n === idx
            ? {
                ...i,
                // Refresh maxQty from the incoming item: stock may have changed
                // since this line was added.
                maxQty: action.item.maxQty ?? i.maxQty,
                qty: Math.min(
                  lineMax(action.item.maxQty ? action.item : i),
                  i.qty + (action.item.qty ?? 1),
                ),
              }
            : i,
        );
      }
      return [
        ...state,
        {
          ...action.item,
          qty: Math.min(lineMax(action.item), action.item.qty ?? 1),
        },
      ];
    }
    case "REMOVE":
      return state.filter((i) => i.sku !== action.sku);
    case "SET_QTY": {
      if (action.qty <= 0) return state.filter((i) => i.sku !== action.sku);
      return state.map((i) =>
        i.sku === action.sku ? { ...i, qty: Math.min(lineMax(i), action.qty) } : i,
      );
    }
    case "CLEAR":
      return [];
    case "INIT":
      return action.items;
    /** Overwrite display fields with server truth after validation. */
    case "RECONCILE":
      return state
        .map((i) => {
          const line = action.lines.find((l) => l.sku === i.sku);
          if (!line) return null; // no longer sold — drop it
          return {
            ...i,
            name: line.productName,
            slug: line.productSlug,
            pack: line.pack,
            pricePaise: line.unitPricePaise,
            mrpPaise: line.mrpPaise,
            image: line.imageUrl ?? i.image,
            availableStock: line.availableStock,
            /*
             * The real ceiling for every quantity stepper.
             *
             * The cart page read `item.maxQty ?? 10`, but nothing ever set
             * maxQty — so every line fell back to 10 and a customer could put
             * 10 of something in the cart when only 3 existed. Deriving it
             * from the server's availableStock caps each stepper at what is
             * actually in stock, still bounded by the per-order limit.
             */
            maxQty:
              typeof line.availableStock === "number"
                ? Math.min(line.availableStock, FALLBACK_MAX_QTY)
                : FALLBACK_MAX_QTY,
          };
        })
        .filter(Boolean);
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  /** Server-validated totals. Null until the first validate call returns. */
  const [quote, setQuote] = useState(null);

  /**
   * The cart line-up a quote was priced for.
   *
   * Without this the UI kept rendering the PREVIOUS quote's totals for the
   * whole round trip after a quantity change — around a second against a remote
   * API — so the amount visibly lagged the button that changed it. Comparing
   * this to the current signature says whether the quote still describes what
   * is in the cart, and the optimistic totals below cover the gap.
   */
  const [quoteSignature, setQuoteSignature] = useState(null);

  /**
   * Shipping rules, fetched once.
   *
   * Only needed so the free-shipping threshold can be applied locally while a
   * quote is in flight. The server stays authoritative — this just stops the
   * shipping line sitting on a stale value for a second.
   */
  const [shippingRules, setShippingRules] = useState(null);
  const [validating, setValidating] = useState(false);
  const [couponCode, setCouponCode] = useState(null);

  // Guards against a slow earlier response overwriting a newer one.
  const requestSeq = useRef(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: "INIT", items: JSON.parse(stored) });
    } catch {
      /* corrupt payload — start empty rather than crashing the app */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    settingsApi
      .public()
      .then((cfg) => {
        if (!cancelled) setShippingRules(cfg?.shipping ?? null);
      })
      // Unavailable: optimistic totals simply omit shipping until a quote lands.
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* quota or private mode — the cart just won't persist */
    }
  }, [items, hydrated]);

  /**
   * Re-price against the backend.
   *
   * Returns the quote so checkout can await it directly rather than reading
   * possibly-stale state.
   */
  const validate = useCallback(
    async ({ code = couponCode, email, state } = {}) => {
      if (items.length === 0) {
        setQuote(null);
        return null;
      }

      const seq = ++requestSeq.current;
      // The line-up being priced, captured before the await so a cart change
      // mid-flight cannot make this quote look current when it is not.
      const pricedSignature = items.map((i) => `${i.sku}:${i.qty}`).join(",");
      setValidating(true);
      try {
        const result = await cartApi.validate({
          lines: items.map((i) => ({ sku: i.sku, qty: i.qty })),
          couponCode: code ?? undefined,
          email,
          state,
        });

        // A newer request has started — discard this stale response.
        if (seq !== requestSeq.current) return result;

        setQuote(result);
        setQuoteSignature(pricedSignature);
        dispatch({ type: "RECONCILE", lines: result.lines });
        return result;
      } catch {
        // Offline or server down: keep showing local estimates rather than
        // emptying the cart.
        if (seq === requestSeq.current) setQuote(null);
        return null;
      } finally {
        if (seq === requestSeq.current) setValidating(false);
      }
    },
    [items, couponCode],
  );

  // Signature of the line-up, so the effect below fires on real changes only.
  const signature = items.map((i) => `${i.sku}:${i.qty}`).join(",");

  // Debounced so holding a quantity stepper does not fire a request per tick.
  useEffect(() => {
    if (!hydrated) return;
    if (!signature) {
      setQuote(null);
      return;
    }
    const timer = setTimeout(() => void validate(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, signature, couponCode]);

  const addToCart = (item) => {
    dispatch({ type: "ADD", item });
    setDrawerOpen(true);
  };

  const applyCoupon = useCallback(
    async (code) => {
      setCouponCode(code || null);
      return validate({ code: code || null });
    },
    [validate],
  );

  const localSubtotalPaise = useMemo(
    () => items.reduce((sum, i) => sum + (i.pricePaise ?? 0) * i.qty, 0),
    [items],
  );

  /** Does the quote still describe what is in the cart right now? */
  const quoteIsCurrent = Boolean(quote) && quoteSignature === signature;

  /**
   * Totals shown while the server is still pricing a change.
   *
   * Mirrors the server formula exactly (pricing.service.ts): shipping is
   * assessed on the POST-discount value, so a coupon can drop an order back
   * below the free-shipping threshold.
   *
   * The discount is carried over from the last quote rather than recomputed —
   * coupon rules live on the server and are not safe to reimplement here. For a
   * percentage coupon that makes the figure slightly stale for the second it
   * takes the real quote to arrive; it then corrects itself. Showing a
   * near-right number immediately beats showing a definitely-wrong one for a
   * second, which is what the previous behaviour did.
   */
  const optimistic = useMemo(() => {
    const discountPaise = Math.min(quote?.discountPaise ?? 0, localSubtotalPaise);
    const payable = Math.max(0, localSubtotalPaise - discountPaise);

    const threshold = shippingRules?.freeThresholdPaise ?? quote?.freeShippingThresholdPaise;
    const rate = shippingRules?.standardRatePaise ?? 0;

    // No rules yet: leave shipping out rather than invent a number.
    const shippingPaise =
      items.length === 0 || threshold == null ? 0 : payable >= threshold ? 0 : rate;

    return {
      subtotalPaise: localSubtotalPaise,
      discountPaise,
      shippingPaise,
      totalPaise: payable + shippingPaise,
      amountToFreeShippingPaise:
        threshold == null ? null : Math.max(0, threshold - payable),
    };
  }, [items.length, localSubtotalPaise, quote, shippingRules]);

  // Server numbers once they describe the current cart; the estimate until then.
  const shown = quoteIsCurrent ? quote : optimistic;

  const value = {
    items,
    totalItems: items.reduce((sum, i) => sum + i.qty, 0),

    subtotalPaise: shown.subtotalPaise ?? 0,
    discountPaise: shown.discountPaise ?? 0,
    shippingPaise: shown.shippingPaise ?? 0,
    totalPaise: shown.totalPaise ?? localSubtotalPaise,
    amountToFreeShippingPaise: shown.amountToFreeShippingPaise ?? null,
    /** True while the figures on screen are an estimate awaiting the server. */
    pricesPending: !quoteIsCurrent && items.length > 0,
    coupon: quote?.coupon ?? null,
    /** Stock and availability problems, for per-line warnings. */
    issues: quote?.issues ?? [],
    deliveryText: quote?.deliveryText ?? null,
    quote,
    validating,
    freeShippingThresholdPaise: quote?.freeShippingThresholdPaise ?? shippingRules?.freeThresholdPaise ?? null,
    /** True when everything in the cart can actually be bought. */
    fulfillable: (quote?.issues ?? []).filter((i) => i.sku !== "__coupon__").length === 0,

    drawerOpen,
    setDrawerOpen,
    addToCart,
    removeFromCart: (sku) => dispatch({ type: "REMOVE", sku }),
    setQty: (sku, qty) => dispatch({ type: "SET_QTY", sku, qty }),
    clearCart: () => {
      dispatch({ type: "CLEAR" });
      setQuote(null);
      setQuoteSignature(null);
      setCouponCode(null);
    },
    validate,
    applyCoupon,
    couponCode,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
