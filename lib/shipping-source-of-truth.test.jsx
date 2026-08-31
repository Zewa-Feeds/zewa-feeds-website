/**
 * The backend is the ONLY source of the shipping charge.
 *
 * ── THE BUG THESE PIN ───────────────────────────────────────────────────────
 * While a quote was in flight the cart filled the gap with
 * `shippingRules.standardRatePaise` — a flat ₹60 — for every cart regardless of
 * weight, slab or destination. That is a legacy fallback rate, not the
 * weight-slab charge, so a ₹185 Kerala order displayed ₹60 and then corrected
 * to ₹22.50 once the server answered.
 *
 * The fix is NOT to reimplement the slab formula here — that would create a
 * second source of truth free to drift from pricing.service.ts. The client
 * computes no shipping at all: it shows the server's figure when the quote
 * still describes the current cart, and `null` (rendered as a dash) when it
 * does not.
 */
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const validate = vi.fn();

vi.mock("@/lib/api", () => ({
  cart: { validate: (...args) => validate(...args) },
  settings: {
    public: vi.fn().mockResolvedValue({
      shipping: {
        keralaRatePerKgPaise: 4500,
        outsideKeralaRatePerKgPaise: 7000,
        packagingWeightGrams: 100,
        slabWeightGrams: 500,
        freeThresholdPaise: 49900, // ₹499, as configured in production
        standardRatePaise: 6000, // ₹60 — the legacy flat rate
      },
    }),
  },
  formatInr: (p) => `₹${(p / 100).toFixed(2)}`,
}));

import { CartProvider, useCart } from "./cartContext";

/** The legacy flat rate. If the client ever reached for it, these would catch it. */
const STANDARD_RATE_PAISE = 6000;

/** A quote as the backend returns it, with the server's weight-slab shipping. */
function quote({ unitPricePaise = 18500, qty = 1, shippingPaise = 2250 } = {}) {
  const subtotalPaise = unitPricePaise * qty;
  return {
    lines: [{
      sku: "F3-45G", qty, productName: "Betta Bites F3", productSlug: "betta-bites-f3",
      pack: "45g Bottle", unitPricePaise, mrpPaise: unitPricePaise,
      lineTotalPaise: subtotalPaise, availableStock: 50, imageUrl: null,
    }],
    subtotalPaise,
    discountPaise: 0,
    shippingPaise,
    totalPaise: subtotalPaise + shippingPaise,
    freeShippingThresholdPaise: 49900,
    amountToFreeShippingPaise: Math.max(0, 49900 - subtotalPaise),
    issues: [], coupons: [], coupon: null, freeShippingFromCoupon: false,
  };
}

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

async function seed({ qty = 1, unitPricePaise = 18500, shippingPaise = 2250, state = "Kerala" } = {}) {
  validate.mockResolvedValue(quote({ qty, unitPricePaise, shippingPaise }));
  const { result } = renderHook(() => useCart(), { wrapper });
  await act(async () => {
    result.current.addToCart({ sku: "F3-45G", qty, pricePaise: unitPricePaise });
  });
  await act(async () => { await result.current.validate({ state }); });
  return result;
}

beforeEach(() => { validate.mockReset(); localStorage.clear(); });
afterEach(() => { vi.clearAllMocks(); });

describe("the shipping figure the cart reports", () => {
  it("is the server's weight-slab amount — ₹22.50 for 1 × 45g to Kerala", async () => {
    const result = await seed({ shippingPaise: 2250 });
    await waitFor(() => expect(result.current.shippingPaise).toBe(2250));
    expect(result.current.totalPaise).toBe(18500 + 2250);
  });

  it("is ₹45 for 10 × 45g to Kerala, exactly as the server priced it", async () => {
    // 450g + 100g = 550g -> 1000g slab -> 1.0 × ₹45
    const result = await seed({ qty: 10, unitPricePaise: 4000, shippingPaise: 4500 });
    await waitFor(() => expect(result.current.shippingPaise).toBe(4500));
  });

  it("becomes NULL — never the flat rate — once the cart no longer matches the quote", async () => {
    const result = await seed({ shippingPaise: 2250 });
    await waitFor(() => expect(result.current.shippingPaise).toBe(2250));

    validate.mockImplementation(() => new Promise(() => {})); // quote never arrives
    await act(async () => { result.current.setQty("F3-45G", 2); });

    await waitFor(() => expect(result.current.shippingPaise).toBeNull());
    expect(result.current.shippingPaise).not.toBe(STANDARD_RATE_PAISE);
    // An unknown shipping charge means an unknown total, not a smaller one.
    expect(result.current.totalPaise).toBeNull();
    expect(result.current.pricesPending).toBe(true);
  });

  it("never reports the legacy flat rate, in any state of the cart", async () => {
    const result = await seed({ shippingPaise: 2250 });
    validate.mockImplementation(() => new Promise(() => {}));

    for (const qty of [2, 3, 4]) {
      await act(async () => { result.current.setQty("F3-45G", qty); });
      expect(result.current.shippingPaise).not.toBe(STANDARD_RATE_PAISE);
    }
  });

  it("still shows FREE immediately once the subtotal clears the threshold", async () => {
    // The threshold is a subtotal comparison, not a weight calculation, so the
    // client can answer it without guessing. ₹185 × 3 = ₹555 > ₹499.
    const result = await seed({ shippingPaise: 2250 });
    validate.mockImplementation(() => new Promise(() => {}));

    await act(async () => { result.current.setQty("F3-45G", 3); });
    await waitFor(() => expect(result.current.shippingPaise).toBe(0));
  });

  it("keeps the subtotal exact while shipping is pending", async () => {
    const result = await seed({ shippingPaise: 2250 });
    validate.mockImplementation(() => new Promise(() => {}));

    await act(async () => { result.current.setQty("F3-45G", 2); });
    expect(result.current.subtotalPaise).toBe(37000); // instantly correct
    expect(result.current.shippingPaise).toBeNull();  // honestly unknown
  });
});

describe("the delivery state is remembered across re-prices", () => {
  it("keeps pricing for the same state when only the quantity changes", async () => {
    /*
     * The debounced re-price that follows a cart change calls validate() with no
     * arguments. Without a sticky state the server got no place of supply and
     * returned shipping of ₹0 — so the UI showed FREE for a chargeable order.
     */
    const result = await seed({ state: "Kerala" });
    validate.mockClear();
    validate.mockResolvedValue(quote());

    await act(async () => { await result.current.validate(); });

    expect(validate).toHaveBeenCalledWith(
      expect.objectContaining({ state: "Kerala" }),
    );
  });
});
