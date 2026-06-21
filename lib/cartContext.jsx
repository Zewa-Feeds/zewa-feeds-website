"use client";

import { createContext, useContext, useEffect, useReducer, useState } from "react";

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const idx = state.findIndex(
        (i) => i.sku === action.item.sku
      );
      if (idx > -1) {
        return state.map((i, n) =>
          n === idx ? { ...i, qty: i.qty + (action.item.qty ?? 1) } : i
        );
      }
      return [...state, { ...action.item, qty: action.item.qty ?? 1 }];
    }
    case "REMOVE":
      return state.filter((i) => i.sku !== action.sku);
    case "SET_QTY": {
      if (action.qty <= 0) return state.filter((i) => i.sku !== action.sku);
      return state.map((i) =>
        i.sku === action.sku ? { ...i, qty: action.qty } : i
      );
    }
    case "CLEAR":
      return [];
    case "INIT":
      return action.items;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("zewa_cart");
      if (stored) dispatch({ type: "INIT", items: JSON.parse(stored) });
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("zewa_cart", JSON.stringify(items));
  }, [items, hydrated]);

  const addToCart = (item) => {
    dispatch({ type: "ADD", item });
    setDrawerOpen(true);
  };
  const removeFromCart = (sku) => dispatch({ type: "REMOVE", sku });
  const setQty = (sku, qty) => dispatch({ type: "SET_QTY", sku, qty });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        drawerOpen,
        setDrawerOpen,
        addToCart,
        removeFromCart,
        setQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
