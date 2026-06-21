"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/lib/cartContext";

export default function CartDrawer() {
  const { items, subtotal, totalItems, drawerOpen, setDrawerOpen, removeFromCart, setQty } = useCart();
  const pathname = usePathname();
  const isShopPage = pathname === "/products" || pathname.startsWith("/products/");

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setDrawerOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 z-[60] transition-all duration-300"
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(2px)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
        }}
      />

      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 h-full z-[70] flex flex-col bg-[#06080f] border-l border-white/8 shadow-2xl"
        style={{
          width: "min(440px, 100vw)",
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
          <div className="flex items-center gap-3">
            <span className="font-[Playfair_Display] text-[20px] text-white">Your Cart</span>
            {totalItems > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary font-[Montserrat] tracking-widest">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all duration-200"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-white/4 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white/20">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-[Playfair_Display] text-[18px] text-white/60">Your cart is empty</p>
                <p className="text-[12px] text-white/25 font-[Montserrat] mt-1">Add a product to get started</p>
              </div>
              {isShopPage ? (
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-primary text-[#00382d] text-[11px] font-bold tracking-widest uppercase font-[Montserrat] hover:bg-primary/85 transition-all duration-200"
                >
                  Continue Shopping
                </button>
              ) : (
                <a
                  href="/products"
                  onClick={() => setDrawerOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-primary text-[#00382d] text-[11px] font-bold tracking-widest uppercase font-[Montserrat] hover:bg-primary/85 transition-all duration-200"
                >
                  Shop Now
                </a>
              )}
            </div>
          ) : (
            items.map((item) => (
              <div key={item.sku} className="flex gap-4 p-4 rounded-2xl bg-white/3 border border-white/5">
                {/* Image */}
                <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
                  style={{ background: item.accentBg || "#1a2235" }}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="object-contain w-full h-full p-1"
                    style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-[Playfair_Display] text-[15px] text-white leading-snug truncate">{item.name}</p>
                  <p className="text-[10px] text-white/30 font-[Montserrat] mt-0.5">{item.pack}</p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty stepper */}
                    <div className="flex items-center rounded-lg border border-white/10 overflow-hidden">
                      <button
                        onClick={() => setQty(item.sku, item.qty - 1)}
                        className="w-7 h-7 flex items-center justify-center text-white/50 text-[16px] hover:bg-white/8 hover:text-white transition-all duration-100 select-none"
                      >−</button>
                      <span className="w-7 text-center text-white text-[12px] font-bold font-[Montserrat] border-x border-white/10 h-7 flex items-center justify-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => setQty(item.sku, item.qty + 1)}
                        className="w-7 h-7 flex items-center justify-center text-primary text-[16px] hover:bg-primary/15 transition-all duration-100 select-none"
                      >+</button>
                    </div>

                    <div className="text-right">
                      <p className="font-[Playfair_Display] text-[16px] text-primary">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-white/20 font-[Montserrat]">₹{item.price.toLocaleString("en-IN")} each</p>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.sku)}
                  className="shrink-0 self-start mt-0.5 text-white/15 hover:text-red-400 transition-colors duration-200"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/6 px-6 py-5 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/40 font-[Montserrat]">Subtotal</span>
              <span className="font-[Playfair_Display] text-[22px] text-white">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-[10px] text-white/20 font-[Montserrat] -mt-2">Shipping & taxes calculated at checkout</p>

            {/* CTA buttons */}
            <a
              href="/checkout"
              onClick={() => setDrawerOpen(false)}
              className="block w-full py-3.5 rounded-full bg-primary text-[#00382d] text-center text-[11px] font-bold tracking-[0.18em] uppercase font-[Montserrat] hover:bg-primary/85 active:scale-[0.98] transition-all duration-200"
            >
              Checkout → ₹{subtotal.toLocaleString("en-IN")}
            </a>
            <a
              href="/cart"
              onClick={() => setDrawerOpen(false)}
              className="block w-full py-3 rounded-full border border-white/10 text-white/40 text-center text-[11px] font-bold tracking-[0.15em] uppercase font-[Montserrat] hover:border-white/25 hover:text-white/70 transition-all duration-200"
            >
              View Full Cart
            </a>
          </div>
        )}
      </div>
    </>
  );
}
