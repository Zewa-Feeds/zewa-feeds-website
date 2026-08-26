"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";

export const COUPON_STORAGE_KEY = "zewa_promo_badge_dismissed_v1";
export const PROMO_CODE = "ZEWA10";

export default function FloatingCouponBadge() {
  const pathname = usePathname();
  const { applyCoupon, couponCodes, items, setDrawerOpen } = useCart();

  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [showTeaser, setShowTeaser] = useState(false);

  const isApplied = couponCodes.includes(PROMO_CODE);

  useEffect(() => {
    setMounted(true);
    try {
      const isDismissed = sessionStorage.getItem(COUPON_STORAGE_KEY) === "true";
      setDismissed(isDismissed);
      if (!isDismissed) {
        // Show subtle teaser tag for 6 seconds on initial visit
        const teaserTimer = setTimeout(() => setShowTeaser(true), 1200);
        const hideTeaserTimer = setTimeout(() => setShowTeaser(false), 7000);
        return () => {
          clearTimeout(teaserTimer);
          clearTimeout(hideTeaserTimer);
        };
      }
    } catch {
      setDismissed(false);
    }
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    if (!modalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  const handleDismiss = useCallback((e) => {
    e.stopPropagation();
    setDismissed(true);
    setShowTeaser(false);
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
      setApplyMessage("Coupon applied to your cart! 🎉");
      setTimeout(() => {
        setModalOpen(false);
        setDrawerOpen(true);
      }, 700);
    } catch {
      setApplyMessage("Applied code to cart.");
      setTimeout(() => {
        setModalOpen(false);
        setDrawerOpen(true);
      }, 700);
    } finally {
      setApplying(false);
    }
  }, [isApplied, applyCoupon, setDrawerOpen]);

  // Don't render server-side, if dismissed, or on checkout page
  if (!mounted || dismissed) return null;
  if (pathname === "/checkout") return null;

  return (
    <>
      {/* ── Circular Floating Widget at bottom-left ── */}
      <aside
        aria-label="Promotional Discount"
        className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 flex items-center gap-3 transition-all duration-300 select-none"
      >
        {/* Main Circular Widget Container */}
        <div className="relative group flex items-center justify-center">
          {/* Ambient Glow Aura */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-60 group-hover:opacity-100 group-hover:bg-primary/30 transition-all duration-500 pointer-events-none scale-110" />

          {/* Rotating Circular Typography Badge */}
          <button
            type="button"
            onClick={() => {
              setShowTeaser(false);
              setModalOpen(true);
            }}
            aria-label="Unlock 10% Off Coupon"
            className="relative flex h-[76px] w-[76px] sm:h-[84px] sm:w-[84px] items-center justify-center rounded-full bg-[#080d1a]/95 backdrop-blur-md border border-primary/40 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(68,229,194,0.25)] hover:border-primary hover:shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_30px_rgba(68,229,194,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            {/* SVG Rotating Text Ring around perimeter */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite] group-hover:animate-[spin_7s_linear_infinite] pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <path
                  id="zewaCirclePath"
                  d="M 50, 50 m -36.5, 0 a 36.5,36.5 0 1,1 73,0 a 36.5,36.5 0 1,1 -73,0"
                />
              </defs>
              <text className="text-[9.5px] font-bold uppercase tracking-[0.19em] fill-primary/90 font-[Montserrat]">
                <textPath href="#zewaCirclePath" startOffset="0%">
                  • UNLOCK 10% OFF • ZEWA FEEDS •
                </textPath>
              </text>
            </svg>

            {/* Inner Center Core */}
            <div className="relative flex h-[46px] w-[46px] sm:h-[52px] sm:w-[52px] flex-col items-center justify-center rounded-full bg-gradient-to-b from-[#101c30] to-[#070b16] border border-white/15 shadow-inner group-hover:border-primary/60 transition-colors duration-300">
              {/* Radial gloss reflection */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

              <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-widest text-primary font-[Montserrat] leading-none">
                FLAT
              </span>
              <span className="my-0.5 text-[14px] sm:text-[16px] font-extrabold text-white font-[Montserrat] leading-none tracking-tight">
                10%
              </span>
              <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider text-white/70 font-[Montserrat] leading-none">
                OFF
              </span>
            </div>
          </button>

          {/* Close / Dismiss Button attached to circle corner */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss discount badge"
            title="Dismiss offer"
            className="absolute -top-1 -right-1 sm:top-0 sm:right-0 flex h-5 w-5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#080d1a] text-white/60 border border-white/30 shadow-md hover:bg-red-950/80 hover:text-white hover:border-red-400/50 hover:scale-110 active:scale-90 transition-all duration-150 z-10"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-2.5 h-2.5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Temporary Teaser Tooltip Tag */}
        {showTeaser && (
          <div
            onClick={() => {
              setShowTeaser(false);
              setModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-primary/30 bg-[#080d1a]/95 backdrop-blur-md px-3 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:border-primary transition-all duration-200 animate-in fade-in slide-in-from-left-2"
          >
            <span className="text-[11px] font-medium text-white/90 font-[Montserrat]">
              Tap to claim <strong className="text-primary font-bold">10% Off</strong>
            </span>
            <span className="text-primary text-[12px] font-bold leading-none">→</span>
          </div>
        )}
      </aside>

      {/* ── Offer Modal / Popover ── */}
      {modalOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-modal-title"
            className="fixed bottom-0 sm:bottom-auto sm:top-1/2 left-1/2 -translate-x-1/2 sm:-translate-y-1/2 w-full max-w-md z-[70] bg-[#080d1a] border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.85)] animate-in fade-in slide-in-from-bottom-6 sm:slide-in-from-bottom-4 duration-250"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-primary font-[Montserrat]">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
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

            {/* Voucher / Coupon Code Block */}
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-[#0d1627] to-[#09101e] p-4 shadow-inner">
              {/* Glow Accent */}
              <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-primary/10 blur-xl pointer-events-none" />

              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-widest text-primary/80 font-[Montserrat]">
                    Coupon Code
                  </span>
                  <span className="font-mono text-[20px] sm:text-[22px] font-black tracking-widest text-primary drop-shadow-[0_0_8px_rgba(68,229,194,0.3)]">
                    {PROMO_CODE}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-white/20 active:scale-95 transition-all font-[Montserrat] shrink-0"
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
                className="w-full rounded-2xl bg-primary py-3.5 text-center text-[12px] font-bold uppercase tracking-[0.16em] text-[#00382d] font-[Montserrat] transition-all duration-200 hover:bg-primary/90 active:scale-[0.99] shadow-[0_4px_24px_rgba(68,229,194,0.35)] disabled:opacity-50"
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
