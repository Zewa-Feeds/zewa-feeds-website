"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";

export const COUPON_STORAGE_KEY = "zewa_promo_badge_dismissed_v1";
export const PROMO_CODE = "SPECIAL10";

export default function FloatingCouponBadge() {
  const pathname = usePathname();
  const { applyCoupon, couponCodes, items, setDrawerOpen } = useCart();

  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");

  const isApplied = couponCodes.includes(PROMO_CODE);

  useEffect(() => {
    setMounted(true);
    try {
      const isDismissed = sessionStorage.getItem(COUPON_STORAGE_KEY) === "true";
      setDismissed(isDismissed);
    } catch {
      setDismissed(false);
    }
  }, []);

  // Scroll detection: reveal when customer reaches products section, hide when scrolling back to hero
  useEffect(() => {
    if (!mounted || dismissed) return;

    if (pathname === "/checkout") {
      setVisible(false);
      return;
    }

    // On pages already dedicated to products (e.g. /products, /products/[slug])
    if (pathname.startsWith("/products")) {
      setVisible(true);
      return;
    }

    const updateVisibility = () => {
      const productsEl = document.getElementById("products");
      if (productsEl) {
        const rect = productsEl.getBoundingClientRect();
        // Visible only when user has scrolled down to products section
        const isReached = rect.top <= window.innerHeight * 0.85;
        setVisible(isReached);
      } else {
        // Fallback for pages without #products section
        setVisible(window.scrollY > 400);
      }
    };

    updateVisibility();

    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateVisibility);
    };
  }, [mounted, dismissed, pathname]);

  // Close modal on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  const handleDismiss = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDismissed(true);
    try {
      sessionStorage.setItem(COUPON_STORAGE_KEY, "true");
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(PROMO_CODE);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, []);

  const handleApplyToCart = useCallback(async () => {
    if (isApplied) {
      setApplyMessage("Already applied to your cart!");
      setTimeout(() => {
        setModalOpen(false);
        setDrawerOpen(true);
      }, 400);
      return;
    }
    setApplying(true);
    setApplyMessage("");
    try {
      await applyCoupon(PROMO_CODE);
      setApplyMessage("Coupon applied to your cart!");
      setTimeout(() => {
        setModalOpen(false);
        setDrawerOpen(true);
      }, 600);
    } catch {
      setApplyMessage("Applied code to cart.");
      setTimeout(() => {
        setModalOpen(false);
        setDrawerOpen(true);
      }, 600);
    } finally {
      setApplying(false);
    }
  }, [isApplied, applyCoupon, setDrawerOpen]);

  // Don't render server-side, if dismissed, or on checkout page
  if (!mounted || dismissed) return null;
  if (pathname === "/checkout") return null;

  return (
    <>
      {/* ── Circular Floating Badge at bottom-left ── */}
      <aside
        aria-label="Promotional Discount"
        className={`fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 select-none transition-all duration-500 ease-out ${
          visible
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-8 scale-90 pointer-events-none"
        }`}
      >
        <div className="relative">
          {/* Circular Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
            aria-label="Unlock 10% Off Coupon"
            tabIndex={visible ? 0 : -1}
            style={{ borderRadius: "9999px" }}
            className="flex h-16 w-16 sm:h-[70px] sm:w-[70px] flex-col items-center justify-center bg-white text-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-1 ring-black/10 hover:shadow-[0_12px_36px_rgba(0,0,0,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span className="text-[11px] sm:text-[12px] font-medium leading-tight text-neutral-600 font-[Montserrat]">
              Unlock
            </span>
            <span className="text-[13px] sm:text-[14px] font-extrabold leading-tight text-black font-[Montserrat] tracking-tight">
              10% Off
            </span>
          </button>

          {/* Close / Dismiss Button attached to circle */}
          <button
            type="button"
            onClick={handleDismiss}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="Dismiss discount badge"
            title="Dismiss offer"
            tabIndex={visible ? 0 : -1}
            style={{ borderRadius: "9999px" }}
            className="absolute -top-2 -right-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center bg-[#090f1d] text-white/90 border border-white/30 shadow-lg hover:bg-black hover:text-white hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer z-30 ring-1 ring-white/10"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Offer Modal / Popover ── */}
      {modalOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-modal-title"
            className="fixed bottom-0 sm:bottom-auto sm:top-1/2 left-1/2 -translate-x-1/2 sm:-translate-y-1/2 w-full max-w-md z-[70] bg-[#080d1a] border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.85)] animate-in fade-in slide-in-from-bottom-6 sm:slide-in-from-bottom-4 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <span
                style={{ borderRadius: "9999px" }}
                className="inline-flex items-center gap-1.5 border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-primary font-[Montserrat]"
              >
                <span style={{ borderRadius: "9999px" }} className="w-1.5 h-1.5 bg-primary animate-pulse" />
                Special Offer
              </span>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 hover:bg-white/15 hover:text-white transition-all"
                aria-label="Close offer modal"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Title & Description */}
            <div className="mt-4">
              <h3 id="promo-modal-title" className="font-[Playfair_Display] text-[22px] sm:text-[24px] font-bold text-white leading-tight">
                Unlock Flat 10% Off
              </h3>
              <p className="mt-2 text-[13px] text-white/60 font-[Montserrat] leading-relaxed">
                Enjoy a flat 10% discount on your order across our entire lab-verified insect-protein aquafeed range.
              </p>
            </div>

            {/* Coupon Code Block */}
            <div className="mt-5 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-3.5 flex items-center justify-between gap-3">
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-primary/70 font-[Montserrat]">
                  Coupon Code
                </span>
                <span className="font-mono text-[18px] sm:text-[20px] font-black tracking-widest text-primary">
                  {PROMO_CODE}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-white/20 active:scale-95 transition-all font-[Montserrat] shrink-0"
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5 text-primary" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-primary">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Feedback / Status */}
            {applyMessage && (
              <p className="mt-3 text-[12px] font-medium text-emerald-400 font-[Montserrat] flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{applyMessage}</span>
              </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleApplyToCart}
                disabled={applying}
                className="w-full rounded-2xl bg-primary py-3.5 text-center text-[12px] font-bold uppercase tracking-[0.16em] text-[#00382d] font-[Montserrat] transition-all duration-200 hover:bg-primary/90 active:scale-[0.99] shadow-[0_4px_20px_rgba(68,229,194,0.3)] disabled:opacity-50"
              >
                {applying
                  ? "Applying..."
                  : isApplied
                  ? "Applied in Cart · View Cart"
                  : "Apply to Cart"}
              </button>

              {items.length === 0 && (
                <Link
                  href="/products"
                  onClick={() => setModalOpen(false)}
                  className="w-full rounded-2xl border border-white/10 py-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-white/70 font-[Montserrat] transition-all hover:bg-white/5 hover:text-white"
                >
                  Browse Products
                </Link>
              )}
            </div>

            {/* Terms note */}
            <p className="mt-4 text-center text-[10px] text-white/35 font-[Montserrat]">
              Applicable on all products · 1 use per customer
            </p>
          </div>
        </>
      )}
    </>
  );
}
