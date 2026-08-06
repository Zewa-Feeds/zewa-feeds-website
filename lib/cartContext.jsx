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
import { cart as cartApi } from "@/lib/api";

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
const lineMax = (item) => item?.maxQty ?? FALLBACK_MAX_QTY;

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

  // Local fallback totals, used until the first quote lands.
  const localSubtotalPaise = useMemo(
    () => items.reduce((sum, i) => sum + (i.pricePaise ?? 0) * i.qty, 0),
    [items],
  );

  const value = {
    items,
    totalItems: items.reduce((sum, i) => sum + i.qty, 0),

    // Server numbers when available, local estimate otherwise.
    subtotalPaise: quote?.subtotalPaise ?? localSubtotalPaise,
    discountPaise: quote?.discountPaise ?? 0,
    shippingPaise: quote?.shippingPaise ?? 0,
    totalPaise: quote?.totalPaise ?? localSubtotalPaise,
    amountToFreeShippingPaise: quote?.amountToFreeShippingPaise ?? null,
    coupon: quote?.coupon ?? null,
    /** Stock and availability problems, for per-line warnings. */
    issues: quote?.issues ?? [],
    deliveryText: quote?.deliveryText ?? null,
    quote,
    validating,
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
