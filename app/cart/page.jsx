"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";
import { PLACEHOLDER_IMAGE } from "@/app/products/adapters";
import { formatInr } from "@/lib/api";

export default function CartPage() {
  const {
    items, subtotalPaise, discountPaise, shippingPaise, totalPaise,
    amountToFreeShippingPaise, totalItems, removeFromCart, setQty, clearCart,
  } = useCart();

  // Shipping and totals are the server's — the free-shipping threshold lives in
  // CMS settings (§13), so hardcoding it here would drift.
  const shipping = shippingPaise;
  const total = totalPaise;

  return (
    <>
      <Header />
      <main className="bg-[#06080f] min-h-screen text-[#dde2f6] pt-28 pb-20">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10">

          {/* Heading */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-primary" />
              <span className="text-[10px] font-bold text-primary tracking-[0.28em] font-[Montserrat] uppercase">Review Order</span>
            </div>
            <h1 className="font-[Playfair_Display] text-[36px] sm:text-[48px] text-white leading-tight">
              Your Cart
              {totalItems > 0 && (
                <span className="ml-4 text-[18px] text-white/25 font-[Montserrat] font-normal">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              )}
            </h1>
          </div>

          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
              <div className="w-20 h-20 rounded-full bg-white/4 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-white/15">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-[Playfair_Display] text-[24px] text-white/50 mb-2">Nothing here yet</p>
                <p className="text-[13px] text-white/25 font-[Montserrat]">Add some products to get started</p>
              </div>
              <a href="/products"
                className="mt-2 px-8 py-3.5 rounded-full bg-primary text-[#00382d] text-[11px] font-bold tracking-[0.18em] uppercase font-[Montserrat] hover:bg-primary/85 transition-all duration-200">
                Shop Products
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* Items list */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {/* Free shipping notice */}
                {amountToFreeShippingPaise > 0 && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/8 border border-primary/20">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-primary shrink-0">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-[12px] text-primary font-[Montserrat]">
                      Add <strong>{formatInr(amountToFreeShippingPaise)}</strong> more for free shipping
                    </p>
                  </div>
                )}

                {items.map((item) => (
                  <div key={item.sku} className="flex gap-5 p-5 rounded-2xl bg-white/3 border border-white/6 hover:border-white/10 transition-all duration-200">
                    {/* Image */}
                    <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
                      style={{ background: item.accentBg || "#1a2235" }}>
                      <Image
                        /*
                          A line can legitimately have no photograph: a pack
                          whose only asset is a film, or one whose photography
                          has not been shot yet. next/image throws on a null
                          src, which would take the whole cart down rather than
                          show a neutral square — and this is the page someone
                          is on with money in hand.
                        */
                        src={item.image || PLACEHOLDER_IMAGE}
                        alt={item.name}
                        width={72}
                        height={72}
                        className="object-contain w-full h-full p-2 rounded-xl"
                        style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-[Playfair_Display] text-[18px] text-white leading-snug">{item.name}</p>
                          <p className="text-[11px] text-white/30 font-[Montserrat] mt-0.5">Pack: {item.pack}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.sku)}
                          className="shrink-0 text-white/15 hover:text-red-400 transition-colors duration-200 mt-0.5">
                          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Qty stepper */}
                        <div className="flex items-center rounded-xl border border-white/10 overflow-hidden">
                          <button onClick={() => item.qty <= 1 ? removeFromCart(item.sku) : setQty(item.sku, item.qty - 1)}
                            className="w-9 h-9 flex items-center justify-center text-white/50 text-[18px] hover:bg-white/8 hover:text-white transition-all duration-100 select-none">−</button>
                          <span className="w-10 text-center text-white text-[14px] font-bold font-[Montserrat] border-x border-white/10 h-9 flex items-center justify-center tabular-nums">
                            {item.qty}
                          </span>
                          <button onClick={() => setQty(item.sku, item.qty + 1)}
                        disabled={item.qty >= (item.maxQty ?? 10)}
                        title={
                          item.qty >= (item.maxQty ?? 10)
                            ? `Maximum ${item.maxQty ?? 10} per order`
                            : "Increase quantity"
                        }
                            className="w-9 h-9 flex items-center justify-center text-primary text-[18px] hover:bg-primary/15 transition-all duration-100 select-none">+</button>
                        </div>

                        <div className="text-right">
                          <p className="font-[Playfair_Display] text-[20px] text-primary">{formatInr((item.pricePaise ?? 0) * item.qty)}</p>
                          <p className="text-[10px] text-white/20 font-[Montserrat]">{formatInr(item.pricePaise ?? 0)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={clearCart}
                  className="self-start text-[11px] text-white/20 hover:text-red-400 font-[Montserrat] tracking-widest uppercase transition-colors duration-200 mt-2">
                  Clear cart
                </button>
              </div>

              {/* Order summary */}
              <div className="lg:sticky lg:top-28 rounded-2xl bg-white/3 border border-white/6 p-6 flex flex-col gap-5">
                <h2 className="font-[Playfair_Display] text-[20px] text-white">Order Summary</h2>

                <div className="flex flex-col gap-3 text-[13px] font-[Montserrat]">
                  <div className="flex justify-between">
                    <span className="text-white/40">Subtotal ({totalItems} items)</span>
                    <span className="text-white">{formatInr(subtotalPaise)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Shipping</span>
                    <span className={shipping === 0 ? "text-primary" : "text-white"}>
                      {shipping === 0 ? "FREE" : formatInr(shipping)}
                    </span>
                  </div>
                  <div className="h-px bg-white/6" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-white/60 font-semibold">Total</span>
                    <span className="font-[Playfair_Display] text-[26px] text-white">{formatInr(total)}</span>
                  </div>
                </div>

                <a href="/checkout"
                  className="block w-full py-4 rounded-full bg-primary text-[#00382d] text-center text-[11px] font-bold tracking-[0.18em] uppercase font-[Montserrat] hover:bg-primary/85 active:scale-[0.98] transition-all duration-200">
                  Proceed to Checkout
                </a>

                <a href="/products"
                  className="block text-center text-[11px] text-white/25 font-[Montserrat] hover:text-white/50 transition-colors duration-200">
                  ← Continue Shopping
                </a>

                {/* Trust */}
                <div className="pt-4 border-t border-white/6 flex flex-col gap-2.5">
                  {[
                    { text: "Secure checkout", svg: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /> },
                    /*
                     * The live setting is a ₹999 free threshold (CMS -> Settings ->
                     * Shipping, freeThresholdPaise 99900). This badge said ₹499,
                     * which promised free delivery on orders that are charged ₹60.
                     */
                    { text: "Free shipping above ₹999", svg: <path d="M1 3h15v11H1zM16 8h4l3 3v3h-7V8zM5.5 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /> },
                    // Must match /returns — a trust badge that overstates the window on the
                    // cart is a promise made at the moment of payment.
                    { text: "Easy returns within 3 days", svg: <path d="M9 14L5 10l4-4M5 10h8a4 4 0 010 8h-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /> },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-primary/40 shrink-0">{t.svg}</svg>
                      <p className="text-[11px] text-white/25 font-[Montserrat]">{t.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
