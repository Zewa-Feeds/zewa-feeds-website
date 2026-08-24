/**
 * Storefront coupon behaviour under stacking.
 *
 * The property worth pinning is a negative one: the storefront never decides
 * whether coupons combine. It sends the codes, renders what the server applied,
 * and shows the server's reason when one is refused. These tests drive the cart
 * context against a stubbed API and assert exactly that.
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

/** A quote as the backend would return it. */
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

/** Seed a cart line so the context has something to price. */
async function setupCart() {
  const hook = renderHook(() => useCart(), { wrapper });
  await act(async () => {
    hook.result.current.addToCart({ sku: "F3-45G", qty: 1, pricePaise: 30000, maxQty: 10 });
  });
  await waitFor(() => expect(validate).toHaveBeenCalled());
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

describe("applying coupons", () => {
  it("sends codes as a list, never a stacking decision", async () => {
    const { result } = await setupCart();

    validate.mockResolvedValue(
      quote({ coupons: [{ code: "SAVE10", discountLabel: "10% off", discountPaise: 3000 }], discountPaise: 3000 }),
    );
    await act(async () => {
      await result.current.applyCoupon("SAVE10");
    });

    const lastCall = validate.mock.calls.at(-1)[0];
    expect(lastCall.couponCodes).toEqual(["SAVE10"]);
    // No client-side judgement is transmitted — just the codes.
    expect(lastCall).not.toHaveProperty("stackingMode");
  });

  it("keeps a code only when the server actually applied it", async () => {
    const { result } = await setupCart();

    // Server refuses it.
    validate.mockResolvedValue(
      quote({
        coupons: [],
        issues: [
          {
            sku: "__coupon__",
            code: "COUPON_NOT_STACKABLE",
            couponCode: "ALONE",
            message: "ALONE cannot be combined with other coupons.",
          },
        ],
      }),
    );
    await act(async () => {
      await result.current.applyCoupon("ALONE");
    });

    // The refused code is not retained, so the UI cannot imply a discount.
    expect(result.current.couponCodes).toEqual([]);
    expect(result.current.coupons).toEqual([]);
  });

  it("holds both codes when the server stacks them", async () => {
    const { result } = await setupCart();

    validate.mockResolvedValue(
      quote({ coupons: [{ code: "A", discountLabel: "10% off" }], discountPaise: 3000 }),
    );
    await act(async () => {
      await result.current.applyCoupon("A");
    });

    validate.mockResolvedValue(
      quote({
        coupons: [
          { code: "A", discountLabel: "10% off" },
          { code: "B", discountLabel: "20% off" },
        ],
        discountPaise: 8400,
      }),
    );
    await act(async () => {
      await result.current.applyCoupon("B");
    });

    expect(result.current.couponCodes).toEqual(["A", "B"]);
    expect(result.current.discountPaise).toBe(8400);
  });

  it("normalises case and whitespace before sending", async () => {
    const { result } = await setupCart();
    validate.mockResolvedValue(quote({ coupons: [{ code: "SAVE10", discountLabel: "10% off" }] }));

    await act(async () => {
      await result.current.applyCoupon("  save10  ");
    });

    expect(validate.mock.calls.at(-1)[0].couponCodes).toEqual(["SAVE10"]);
  });

  it("does not apply the same code twice", async () => {
    const { result } = await setupCart();
    validate.mockResolvedValue(quote({ coupons: [{ code: "SAVE10", discountLabel: "10% off" }] }));

    await act(async () => {
      await result.current.applyCoupon("SAVE10");
    });
    await act(async () => {
      await result.current.applyCoupon("SAVE10");
    });

    expect(result.current.couponCodes).toEqual(["SAVE10"]);
  });
});

describe("removing coupons", () => {
  it("drops the code and re-prices without it", async () => {
    const { result } = await setupCart();

    validate.mockResolvedValue(
      quote({ coupons: [{ code: "SAVE10", discountLabel: "10% off" }], discountPaise: 3000 }),
    );
    await act(async () => {
      await result.current.applyCoupon("SAVE10");
    });
    expect(result.current.couponCodes).toEqual(["SAVE10"]);

    validate.mockResolvedValue(quote());
    await act(async () => {
      await result.current.removeCoupon("SAVE10");
    });

    expect(result.current.couponCodes).toEqual([]);
    expect(validate.mock.calls.at(-1)[0].couponCodes).toEqual([]);
    expect(result.current.discountPaise).toBe(0);
  });

  it("frees the slot so a previously blocked coupon can be applied", async () => {
    const { result } = await setupCart();

    validate.mockResolvedValue(
      quote({ coupons: [{ code: "ALONE", discountLabel: "₹50 off" }], discountPaise: 5000 }),
    );
    await act(async () => {
      await result.current.applyCoupon("ALONE");
    });

    // Second code refused while ALONE is on the cart.
    validate.mockResolvedValue(
      quote({
        coupons: [{ code: "ALONE", discountLabel: "₹50 off" }],
        discountPaise: 5000,
        issues: [
          {
            sku: "__coupon__",
            code: "COUPON_NOT_STACKABLE",
            couponCode: "SAVE10",
            message: "ALONE cannot be combined with other coupons.",
          },
        ],
      }),
    );
    await act(async () => {
      await result.current.applyCoupon("SAVE10");
    });
    expect(result.current.couponCodes).toEqual(["ALONE"]);

    // Remove the blocker, then the other one applies.
    validate.mockResolvedValue(quote());
    await act(async () => {
      await result.current.removeCoupon("ALONE");
    });
    validate.mockResolvedValue(
      quote({ coupons: [{ code: "SAVE10", discountLabel: "10% off" }], discountPaise: 3000 }),
    );
    await act(async () => {
      await result.current.applyCoupon("SAVE10");
    });

    expect(result.current.couponCodes).toEqual(["SAVE10"]);
  });
});

describe("cart changes", () => {
  it("re-prices with the applied codes when a quantity changes", async () => {
    const { result } = await setupCart();
    validate.mockResolvedValue(
      quote({ coupons: [{ code: "SAVE10", discountLabel: "10% off" }], discountPaise: 3000 }),
    );
    await act(async () => {
      await result.current.applyCoupon("SAVE10");
    });

    validate.mockClear();
    await act(async () => {
      result.current.setQty("F3-45G", 3);
    });

    await waitFor(() => expect(validate).toHaveBeenCalled());
    expect(validate.mock.calls.at(-1)[0].couponCodes).toEqual(["SAVE10"]);
  });

  it("clears applied codes when the cart is emptied", async () => {
    const { result } = await setupCart();
    validate.mockResolvedValue(
      quote({ coupons: [{ code: "SAVE10", discountLabel: "10% off" }] }),
    );
    await act(async () => {
      await result.current.applyCoupon("SAVE10");
    });

    await act(async () => {
      result.current.clearCart();
    });

    expect(result.current.couponCodes).toEqual([]);
  });
});

describe("discount display", () => {
  it("never shows a discount the server did not return", async () => {
    const { result } = await setupCart();

    validate.mockResolvedValue(
      quote({
        coupons: [],
        issues: [
          {
            sku: "__coupon__",
            code: "COUPON_EXPIRED",
            couponCode: "OLD",
            message: "OLD has expired.",
          },
        ],
      }),
    );
    await act(async () => {
      await result.current.applyCoupon("OLD");
    });

    expect(result.current.discountPaise).toBe(0);
    expect(result.current.coupons).toEqual([]);
  });

  it("does not treat a coupon problem as an unfulfillable cart", async () => {
    const { result } = await setupCart();
    validate.mockResolvedValue(
      quote({
        issues: [
          { sku: "__coupon__", code: "COUPON_EXPIRED", couponCode: "OLD", message: "OLD has expired." },
        ],
      }),
    );
    await act(async () => {
      await result.current.applyCoupon("OLD");
    });

    // The sentinel sku is filtered out of the fulfillability check — a bad
    // coupon must never block checkout.
    expect(result.current.fulfillable).toBe(true);
  });
});
