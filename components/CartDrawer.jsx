"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/lib/cartContext";
import { formatInr } from "@/lib/api";

export default function CartDrawer() {
  const {
    items,
    subtotalPaise,
    discountPaise,
    totalPaise,
    coupon,
    coupons,
    couponCodes,
    removeCoupon,
    totalItems,
    amountToFreeShippingPaise,
    drawerOpen,
    setDrawerOpen,
    removeFromCart,
    setQty,
    addToCart,
  } = useCart();

  const pathname = usePathname();
  const isShopPage = pathname === "/products" || pathname.startsWith("/products/");
  const [removingSku, setRemovingSku] = useState(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setDrawerOpen]);

  const handleRemove = (sku) => {
    setRemovingSku(sku);
    setTimeout(() => {
      removeFromCart(sku);
      setRemovingSku(null);
    }, 200);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 z-[60] transition-all duration-300"
        style={{
          background: "rgba(3, 6, 14, 0.75)",
          backdropFilter: "blur(4px)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
        }}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className="fixed top-0 right-0 h-full z-[70] flex flex-col bg-[#060913] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out"
        style={{
          width: "min(460px, 100vw)",
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
        }}
        aria-label="Shopping Cart Drawer"
        /*
          Closed, this panel is parked off the right edge but still in the DOM
          so it can slide. Without inert its close button and links stayed in
          the tab order on every page — a keyboard user tabbing the homepage
          landed inside an invisible cart. inert removes the subtree from focus
          and from the accessibility tree.
        */
        inert={!drawerOpen}
        aria-hidden={drawerOpen ? undefined : "true"}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 bg-[#080d1a]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>

            <div className="flex items-baseline gap-2">
              <h2 className="font-[Playfair_Display] text-[22px] font-bold text-white tracking-wide">
                Your Cart
              </h2>
              {totalItems > 0 && (
                <span className="rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary font-[Montserrat]">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 hover:bg-white/12 hover:text-white hover:border-white/20 transition-all duration-200 group"
            aria-label="Close cart drawer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Indicator (if items in cart) */}
        {items.length > 0 && amountToFreeShippingPaise !== null && amountToFreeShippingPaise !== undefined && (
          <div className="bg-[#091122] px-6 py-3 border-b border-white/6 flex items-center gap-3">
            <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-[11px] text-white/80 font-[Montserrat] leading-snug">
              {amountToFreeShippingPaise > 0 ? (
                <>
                  Add <strong className="text-primary font-bold">{formatInr(amountToFreeShippingPaise)}</strong> more to unlock <strong className="text-primary font-bold">FREE Express Delivery</strong>
                </>
              ) : (
                <span className="text-primary font-semibold">Unlocked FREE Express Delivery across India!</span>
              )}
            </p>
          </div>
        )}

        {/* Scrollable Items Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 custom-scrollbar">
          {items.length === 0 ? (
            /* EMPTY CART STATE */
            <div className="flex flex-col items-center justify-center h-full py-12 text-center my-auto">
              <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-[0_0_32px_rgba(68,229,194,0.15)]">
                <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-primary">
                  <path
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="font-[Playfair_Display] text-[24px] font-bold text-white">
                Your cart is empty
              </h3>
              <p className="mt-2 max-w-xs text-[13px] text-white/45 font-[Montserrat] leading-relaxed">
                Explore our scientifically formulated insect-protein feeds for optimal aquatic health.
              </p>

              <div className="mt-8">
                {isShopPage ? (
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-2xl bg-primary px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00382d] font-[Montserrat] transition-all duration-200 hover:bg-primary/90 shadow-[0_4px_20px_rgba(68,229,194,0.3)]"
                  >
                    Continue Shopping
                  </button>
                ) : (
                  <a
                    href="/products"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-2xl bg-primary px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00382d] font-[Montserrat] transition-all duration-200 hover:bg-primary/90 shadow-[0_4px_20px_rgba(68,229,194,0.3)] inline-block"
                  >
                    Explore Products
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* CART PRODUCT CARDS LIST */
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.sku}
                  className={`group relative flex gap-4 rounded-2xl border border-white/10 bg-[#090f1d]/90 p-4 transition-all duration-300 hover:border-white/20 hover:bg-[#0c1527] shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${
                    removingSku === item.sku ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  {/* Product Image */}
                  <div
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 p-1.5 flex items-center justify-center shadow-inner"
                    style={{ background: item.accentBg || "#0d1627" }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={72}
                        height={72}
                        className="h-full w-full object-contain p-1 rounded-xl drop-shadow-md"
                      />
                    ) : (
                      <div className="text-[10px] text-white/20">No image</div>
                    )}
                  </div>

                  {/* Info Column */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="truncate font-[Playfair_Display] text-[15px] font-semibold text-white/95 leading-snug">
                          {item.name}
                        </h4>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item.sku)}
                          className="shrink-0 p-1 rounded-lg text-white/25 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                          aria-label={`Remove ${item.name}`}
                          title="Remove item"
                        >
                          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-[11px] text-white/40 font-[Montserrat]">{item.pack}</span>
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                        <span className="text-[10px] text-emerald-400 font-semibold font-[Montserrat]">In Stock</span>
                      </div>
                    </div>

                    {/* Bottom row: Stepper + Price */}
                    <div className="mt-3 flex items-center justify-between">
                      {/* Segmented Pill Quantity Stepper */}
                      <div className="flex items-center rounded-xl border border-white/10 bg-[#0c1424] p-0.5 shadow-inner">
                        <button
                          type="button"
                          onClick={() => setQty(item.sku, item.qty - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 text-[15px] font-semibold hover:bg-white/10 hover:text-white transition-all select-none"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="w-7 text-center text-[12px] font-bold text-white font-[Montserrat] tabular-nums">
                          {item.qty}
                        </span>

                        <button
                          type="button"
                          onClick={() => setQty(item.sku, item.qty + 1)}
                          disabled={item.qty >= (item.maxQty ?? 10)}
                          title={
                            item.qty >= (item.maxQty ?? 10)
                              ? `Maximum ${item.maxQty ?? 10} per order`
                              : "Increase quantity"
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-primary text-[15px] font-semibold hover:bg-primary/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed select-none"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <div className="text-right">
                        <span className="block font-[Playfair_Display] text-[17px] font-bold text-primary tabular-nums">
                          {formatInr((item.pricePaise ?? 0) * item.qty)}
                        </span>
                        <span className="block text-[10px] text-white/30 font-[Montserrat]">
                          {formatInr(item.pricePaise ?? 0)} each
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STICKY ACTION FOOTER */}
        {items.length > 0 && (
          <div className="border-t border-white/10 bg-[#080d1a]/95 backdrop-blur-xl px-6 py-5 space-y-4 shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
            {/* Applied Coupons List / Tags */}
            {(couponCodes || []).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-0.5">
                {(couponCodes || []).map((code) => {
                  const appliedInfo = (coupons || []).find((c) => c.code === code) || coupon;
                  const discountLabel = appliedInfo?.discountPaise
                    ? `- ${formatInr(appliedInfo.discountPaise)}`
                    : appliedInfo?.percent
                    ? `${appliedInfo.percent}% off`
                    : code === "SPECIAL10"
                    ? "10% off"
                    : "Applied";

                  return (
                    <div
                      key={code}
                      className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary font-[Montserrat]"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>
                        <strong className="tracking-wide">{code}</strong> ({discountLabel})
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCoupon(code)}
                        className="ml-1 text-primary/70 hover:text-red-400 transition-colors"
                        title="Remove coupon"
                        aria-label={`Remove coupon ${code}`}
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Price Summary Breakdown */}
            <div className="flex flex-col gap-1.5 text-[13px] font-[Montserrat]">
              <div className="flex items-baseline justify-between text-white/60">
                <span className="text-[13px]">Subtotal</span>
                <span className="text-[15px] text-white tabular-nums">
                  {formatInr(subtotalPaise)}
                </span>
              </div>

              {discountPaise > 0 && (
                <div className="flex items-baseline justify-between text-emerald-400">
                  <span className="text-[13px] flex items-center gap-1.5">
                    <span>Discount</span>
                    {couponCodes[0] && (
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        {couponCodes[0]}
                      </span>
                    )}
                  </span>
                  <span className="text-[15px] font-semibold tabular-nums">
                    - {formatInr(discountPaise)}
                  </span>
                </div>
              )}

              <div className="flex items-baseline justify-between pt-1 border-t border-white/8">
                <span className="text-white/80 font-semibold text-[14px]">Total</span>
                <span className="font-[Playfair_Display] text-[24px] font-bold text-primary tabular-nums">
                  {formatInr(totalPaise > 0 ? totalPaise : Math.max(0, subtotalPaise - discountPaise))}
                </span>
              </div>

              <p className="text-[10px] text-white/30 font-normal">
                Taxes and shipping calculated at checkout
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2.5">
              <a
                href="/checkout"
                onClick={() => setDrawerOpen(false)}
                className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-center text-[12px] font-bold uppercase tracking-[0.18em] text-[#00382d] font-[Montserrat] transition-all duration-300 hover:bg-primary/90 active:scale-[0.99] shadow-[0_4px_24px_rgba(68,229,194,0.35)]"
              >
                <span>Checkout · {formatInr(totalPaise > 0 ? totalPaise : Math.max(0, subtotalPaise - discountPaise))}</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

              <a
                href="/cart"
                onClick={() => setDrawerOpen(false)}
                className="block w-full rounded-2xl border border-white/12 py-3 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 font-[Montserrat] transition-all duration-200 hover:border-white/30 hover:text-white hover:bg-white/5"
              >
                View Full Cart
              </a>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
