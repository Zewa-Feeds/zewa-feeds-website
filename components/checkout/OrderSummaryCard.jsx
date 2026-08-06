"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatInr } from "@/lib/api";
import { CARD, EASE } from "./tokens";

export default function OrderSummaryCard({
  items = [],
  issues = [],
  subtotalPaise = 0,
  discountPaise = 0,
  shippingPaise = 0,
  totalPaise = 0,
  amountToFreeShippingPaise,
  coupon,
  couponInput,
  onCouponInputChange,
  couponError,
  onSubmitCoupon,
  paymentMethod,
  config,
  validating,
  setQty,
  removeFromCart,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [couponApplying, setCouponApplying] = useState(false);

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponApplying(true);
    await onSubmitCoupon(e);
    setCouponApplying(false);
  };

  return (
    <div className={`flex flex-col ${CARD} p-5 sm:p-7 ${EASE}`}>
      {/* Header & Mobile Toggle */}
      <div className="flex items-center justify-between pb-4 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <h2 className="font-[Playfair_Display] text-[20px] font-bold text-white tracking-wide">
              Order Summary
            </h2>
            <p className="text-[11px] text-white/40 font-[Montserrat]">
              {items.length} {items.length === 1 ? "item" : "items"} in cart
            </p>
          </div>
        </div>

        {/* Mobile Accordion Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="flex lg:hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-primary font-[Montserrat] hover:bg-white/10"
        >
          <span>{isMobileOpen ? "Hide details" : "Show details"}</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isMobileOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Main Content Area (Always visible on LG+, collapsible on Mobile) */}
      <div className={`flex flex-col gap-6 pt-5 ${isMobileOpen ? "block" : "hidden lg:flex"}`}>
        {/* Line Items List */}
        <div className="flex flex-col divide-y divide-white/6 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
          {items.map((item) => {
            const issue = issues.find((i) => i.sku === item.sku);
            return (
              <div key={item.sku} className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0">
                {/* Product Thumbnail */}
                <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-white/10 p-1" style={{ background: item.accentBg || "#111a2d" }}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/20 text-[10px]">No img</div>
                  )}
                </div>

                {/* Item Details */}
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-[Playfair_Display] text-[14px] font-semibold text-white/90">
                    {item.name}
                  </h4>
                  <p className="mt-0.5 text-[11px] text-white/40 font-[Montserrat]">{item.pack}</p>

                  {/*
                    Quantity stepper.

                    The buttons render at 20px but carry `before:` hit areas
                    expanded to 44px — the minimum comfortable touch target —
                    so the control stays visually compact in a dense summary
                    without being fiddly to tap on a phone.
                  */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center rounded-lg border border-white/10 bg-[#0d1627] p-0.5">
                      <button
                        type="button"
                        onClick={() => setQty && setQty(item.sku, Math.max(1, item.qty - 1))}
                        disabled={item.qty <= 1}
                        className="relative flex h-5 w-5 items-center justify-center rounded text-white/50 transition-colors before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-9 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        −
                      </button>
                      <span
                        className="w-6 text-center text-[11px] font-semibold tabular-nums text-white font-[Montserrat]"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty && setQty(item.sku, item.qty + 1)}
                        className="relative flex h-5 w-5 items-center justify-center rounded text-white/50 transition-colors before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-9 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:bg-white/10 hover:text-white"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>

                    {removeFromCart && (
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.sku)}
                        className="text-[10px] text-white/30 transition-colors hover:text-red-400 font-[Montserrat]"
                        aria-label={`Remove ${item.name} from order`}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {issue && (
                    <p className="mt-1 text-[10px] text-amber-400 font-[Montserrat] flex items-center gap-1">
                      <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{issue.message}</span>
                    </p>
                  )}
                </div>

                {/* Line Item Total */}
                <div className="text-right shrink-0">
                  <span className="block text-[14px] font-bold tabular-nums text-white font-[Montserrat]">
                    {formatInr((item.pricePaise ?? 0) * item.qty)}
                  </span>
                  {item.mrpPaise && item.mrpPaise > (item.pricePaise ?? 0) && (
                    <span className="block text-[10px] line-through text-white/30 tabular-nums font-[Montserrat]">
                      {formatInr(item.mrpPaise * item.qty)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Shipping Progress Indicator */}
        {amountToFreeShippingPaise !== null && amountToFreeShippingPaise !== undefined && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
            {amountToFreeShippingPaise > 0 ? (
              <p className="text-[11px] text-white/80 font-[Montserrat]">
                Add <span className="font-bold text-primary">{formatInr(amountToFreeShippingPaise)}</span> more to unlock <span className="font-bold text-primary">FREE Shipping</span>!
              </p>
            ) : (
              <p className="text-[11px] text-primary font-semibold font-[Montserrat] flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>You unlocked FREE Express Shipping!</span>
              </p>
            )}
          </div>
        )}

        {/* Coupon Code Input */}
        <form onSubmit={handleCouponSubmit} className="flex flex-col gap-2 pt-2 border-t border-white/8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                value={couponInput}
                onChange={(e) => onCouponInputChange(e.target.value.toUpperCase())}
                placeholder="Discount code or promo"
                className="w-full rounded-xl border border-white/10 bg-[#0d1627] px-3.5 py-2.5 text-[12px] uppercase tracking-wider text-white placeholder-white/25 font-[Montserrat] focus:border-primary/50 focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={couponApplying || !couponInput.trim()}
              className="rounded-xl border border-primary/30 bg-primary/10 px-4 text-[11px] font-bold uppercase tracking-wider text-primary font-[Montserrat] transition-all hover:bg-primary/20 hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {couponApplying ? "Applying..." : "Apply"}
            </button>
          </div>

          {couponError && (
            <p className="text-[11px] text-red-400 font-[Montserrat] flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{couponError}</span>
            </p>
          )}

          {coupon && (
            <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-[11px] text-primary font-[Montserrat]">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>
                  <strong className="font-bold">{coupon.code}</strong> applied ({coupon.discountLabel})
                </span>
              </div>
            </div>
          )}
        </form>

        {/* Pricing Breakdown */}
        <div className="flex flex-col gap-2.5 pt-4 border-t border-white/8 text-[13px] font-[Montserrat]">
          <div className="flex justify-between text-white/50">
            <span>Subtotal</span>
            <span className="font-semibold text-white/80 tabular-nums">{formatInr(subtotalPaise)}</span>
          </div>

          {discountPaise > 0 && (
            <div className="flex justify-between text-primary">
              <span className="flex items-center gap-1">
                <span>Discount</span>
                {coupon && <span className="text-[10px] bg-primary/15 px-1.5 py-0.5 rounded">({coupon.code})</span>}
              </span>
              <span className="font-semibold tabular-nums">− {formatInr(discountPaise)}</span>
            </div>
          )}

          <div className="flex justify-between text-white/50">
            <span>Shipping</span>
            <span className={shippingPaise === 0 ? "font-bold text-primary uppercase" : "font-semibold text-white/80 tabular-nums"}>
              {shippingPaise === 0 ? "FREE" : formatInr(shippingPaise)}
            </span>
          </div>

          <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/*
            The total is the one number people actually look for, so it gets
            the largest type on the card and the only serif treatment in the
            breakdown. Everything above it stays at 13px muted — the contrast
            is what creates the hierarchy, not extra weight or colour.
          */}
          <div className="flex items-baseline justify-between gap-4 pt-1">
            <div className="flex min-w-0 flex-col">
              <span className="text-[15px] font-bold text-white">Total</span>
              <span className="text-[10px] font-normal leading-snug text-white/35">
                {config?.tax
                  ? config.tax.gstInclusive
                    ? `Inclusive of ${config.tax.gstRatePct}% GST`
                    : "GST added at invoicing"
                  : "Inclusive of all applicable taxes"}
              </span>
            </div>

            <span className="shrink-0 font-[Playfair_Display] text-[28px] font-bold tracking-tight tabular-nums text-white">
              {formatInr(totalPaise)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
