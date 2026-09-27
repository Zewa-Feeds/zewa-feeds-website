/**
 * The quote must stop being "pending" once the server has priced the cart.
 *
 * `pricesPending` gates the checkout button and the total. It is derived by
 * comparing the signature of the cart the quote was PRICED against with the
 * signature of the cart as it stands NOW. If those two can disagree while the
 * cart is in fact settled, checkout wedges on "Validating prices..." and the
 * total renders as a dash — with no way for the shopper to recover.
 *
 * That is exactly what a REFUSED coupon used to cause: the quote recorded the
 * codes that were REQUESTED, then the refused one was pruned from the applied
 * list, so the two signatures could never match again.
 */
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const validate = vi.fn();

vi.mock("@/lib/api", () => ({
  cart: { validate: (...args) => validate(...args) },
  settings: { public: vi.fn().mockResolvedValue({ shipping: { freeThresholdPaise: 99900 } }) },
  formatInr: (p) => `₹${(p / 100).toFixed(2)}`,
}));

import { CartProvider, useCart } from "./cartContext";

function quote({ coupons = [], issues = [], discountPaise = 0 } = {}) {
  return {
    lines: [
      {
        sku: "F3-45G",
        qty: 1,
        productName: "Betta Bites",
        unitPricePaise: 30000,
        lineTotalPaise: 30000,
        availableStock: 10,
      },
    ],
    subtotalPaise: 30000,
    discountPaise,
    shippingPaise: 0,
    taxPaise: 0,
    totalPaise: 30000 - discountPaise,
    coupon: coupons[0] ?? null,
    coupons,
    freeShippingFromCoupon: false,
    freeShippingThresholdPaise: 99900,
    amountToFreeShippingPaise: 0,
    issues,
  };
}

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

async function setupCart() {
  const hook = renderHook(() => useCart(), { wrapper });
  await act(async () => {
    hook.result.current.addToCart({ sku: "F3-45G", qty: 1, pricePaise: 30000, maxQty: 10 });
  });
  await waitFor(() => expect(validate).toHaveBeenCalled());
  await waitFor(() => expect(hook.result.current.pricesPending).toBe(false));
  return hook;
}

beforeEach(() => {
  validate.mockReset();
  validate.mockResolvedValue(quote());
  window.localStorage.clear();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("quote freshness after a refused coupon", () => {
  it("settles pricesPending when the server refuses a stacking coupon", async () => {
    const { result } = await setupCart();

    // One coupon is already on and accepted.
    validate.mockResolvedValue(
      quote({
        coupons: [{ code: "ZEWA1", discountLabel: "Free shipping", discountPaise: 0 }],
      }),
    );
    await act(async () => {
      await result.current.applyCoupon("ZEWA1");
    });
    await waitFor(() => expect(result.current.pricesPending).toBe(false));

    /*
     * Now a second offer of the same kind. The server keeps ZEWA1 and refuses
     * FREESHIPPING — the real response behind the checkout screenshot.
     */
    validate.mockResolvedValue(
      quote({
        coupons: [{ code: "ZEWA1", discountLabel: "Free shipping", discountPaise: 0 }],
        issues: [
          {
            sku: "__coupon__",
            code: "COUPON_STACKING_CONFLICT",
            couponCode: "FREESHIPPING",
            message:
              "ZEWA1 is already applied, and only one offer of its kind can be used per order.",
          },
        ],
      }),
    );
    await act(async () => {
      await result.current.applyCoupon("FREESHIPPING");
    });

    // The refused code is dropped, as before.
    expect(result.current.couponCodes).toEqual(["ZEWA1"]);

    // THE REGRESSION: the cart is settled, so the button must not stay stuck.
    await waitFor(() => expect(result.current.pricesPending).toBe(false));
    expect(result.current.totalPaise).not.toBeNull();
  });

  it("settles pricesPending when a coupon is refused for any other reason", async () => {
    const { result } = await setupCart();

    // Not a stacking conflict — a minimum-spend refusal. Same shape of bug.
    validate.mockResolvedValue(
      quote({
        coupons: [],
        issues: [
          {
            sku: "__coupon__",
            code: "COUPON_MIN_SPEND",
            couponCode: "BIG500",
            message: "Spend ₹500 to use BIG500.",
          },
        ],
      }),
    );
    await act(async () => {
      await result.current.applyCoupon("BIG500");
    });

    expect(result.current.couponCodes).toEqual([]);
    await waitFor(() => expect(result.current.pricesPending).toBe(false));
    expect(result.current.totalPaise).not.toBeNull();
  });
});
