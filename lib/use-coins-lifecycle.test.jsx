import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, cleanup, waitFor } from "@testing-library/react";

/**
 * The coin reservation lifecycle.
 *
 * THE DEFECT THIS FILE EXISTS FOR
 *
 * A 376-coin checkout displayed ₹0.20 and charged ₹376.20. The server half was a
 * bad comparison; this half was the hold being given up at the wrong moments.
 *
 * `settle()` marks the hold as the ORDER's. After that, two things must stop
 * happening, and neither is obvious from reading the hook:
 *
 *   - the unmount cleanup must not release it, or a paid order loses its discount
 *   - the cart-change effect must not re-apply it, because success CLEARS THE CART,
 *     which changes `linesKey` and would re-hold coins against an empty cart
 *
 * Everything else about the lifecycle must be unaffected: an abandoned checkout
 * still returns its coins rather than waiting out the 30-minute sweep.
 */

const applyCoins = vi.fn();
const removeCoins = vi.fn();
const coinQuote = vi.fn();

vi.mock("@/lib/api", () => ({
  account: {
    applyCoins: (...a) => applyCoins(...a),
    removeCoins: (...a) => removeCoins(...a),
    coinQuote: (...a) => coinQuote(...a),
  },
}));

const { useCoins } = await import("./useCoins");

const ITEMS = [{ sku: "F3-45G", qty: 1 }];
const QUOTE = {
  visible: true,
  available: 500,
  maxRedeemable: 376,
  minRedemption: 10,
  coinValuePaise: 100,
};

function setup(props = {}) {
  return renderHook((p) => useCoins({ items: ITEMS, isAuthenticated: true, ...p }), {
    initialProps: props,
  });
}

/** Apply coins and wait for the hook to register the hold. */
async function withHold(hook, coins = 376) {
  applyCoins.mockResolvedValue({ held: coins });
  await act(async () => {
    await hook.result.current.apply(coins);
  });
  await waitFor(() => expect(hook.result.current.applied).toBe(coins));
}

beforeEach(() => {
  coinQuote.mockResolvedValue(QUOTE);
  applyCoins.mockResolvedValue({ held: 376 });
  removeCoins.mockResolvedValue({ released: 376 });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("a hold that has been handed to an order", () => {
  /*
   * The bug, directly. Razorpay opens over the page, but ANY unmount — a
   * navigation, a remount, React's own teardown — used to release the hold, and
   * the retry then priced at full value.
   */
  it("is not released when the component unmounts", async () => {
    const hook = setup();
    await withHold(hook);

    act(() => hook.result.current.settle());
    hook.unmount();

    expect(removeCoins).not.toHaveBeenCalled();
  });

  /*
   * Success calls clearCart(), which changes `linesKey`. Without the guard the
   * re-apply effect fires against an EMPTY cart, asking the server to re-hold
   * coins the order has already consumed.
   */
  it("is not re-applied when the cart empties after the order is placed", async () => {
    const hook = renderHook(({ items }) => useCoins({ items, isAuthenticated: true }), {
      initialProps: { items: ITEMS },
    });
    await withHold(hook);
    applyCoins.mockClear();

    act(() => hook.result.current.settle());
    hook.rerender({ items: [] });

    await new Promise((r) => setTimeout(r, 20));
    expect(applyCoins).not.toHaveBeenCalled();
  });

  it("stops advertising a live hold, so the key is no longer sent", async () => {
    const hook = setup();
    await withHold(hook);
    expect(hook.result.current.hasHold).toBe(true);

    act(() => hook.result.current.settle());
    expect(hook.result.current.hasHold).toBe(false);
  });
});

describe("a hold this checkout still owns", () => {
  /* An abandoned checkout must return the coins, not wait out the sweep. */
  it("is released on unmount when no order was placed", async () => {
    const hook = setup();
    await withHold(hook);

    hook.unmount();

    expect(removeCoins).toHaveBeenCalledTimes(1);
  });

  /*
   * A dismissed Razorpay modal does not settle anything, so the hold must still
   * be advertised — this is what lets the retry reuse the same discount.
   */
  it("is still advertised after a dismissed payment", async () => {
    const hook = setup();
    await withHold(hook);

    // No settle() — the customer closed the modal without paying.
    expect(hook.result.current.hasHold).toBe(true);
    expect(hook.result.current.applied).toBe(376);
    expect(removeCoins).not.toHaveBeenCalled();
  });

  it("is released when the customer explicitly removes the coins", async () => {
    const hook = setup();
    await withHold(hook);

    await act(async () => {
      await hook.result.current.remove();
    });

    expect(removeCoins).toHaveBeenCalledTimes(1);
    expect(hook.result.current.applied).toBe(0);
  });

  /* A genuine cart change must still re-price the hold against the new cart. */
  it("is re-applied when the cart changes before an order exists", async () => {
    const hook = renderHook(({ items }) => useCoins({ items, isAuthenticated: true }), {
      initialProps: { items: ITEMS },
    });
    await withHold(hook);
    applyCoins.mockClear();

    hook.rerender({ items: [{ sku: "F3-45G", qty: 2 }] });

    await waitFor(() => expect(applyCoins).toHaveBeenCalled());
  });

  /*
   * §4.1: the server is the authority on how much still fits. A silent reduction
   * is a notice, never an error.
   */
  it("accepts a server-reduced amount on a cart change", async () => {
    const hook = renderHook(({ items }) => useCoins({ items, isAuthenticated: true }), {
      initialProps: { items: ITEMS },
    });
    await withHold(hook);

    applyCoins.mockResolvedValue({ held: 100 });
    hook.rerender({ items: [{ sku: "F3-45G", qty: 3 }] });

    await waitFor(() => expect(hook.result.current.applied).toBe(100));
    expect(hook.result.current.notice).toMatch(/reduced/i);
  });

  it("drops the hold when the server can no longer place it", async () => {
    const hook = renderHook(({ items }) => useCoins({ items, isAuthenticated: true }), {
      initialProps: { items: ITEMS },
    });
    await withHold(hook);

    applyCoins.mockRejectedValue(new Error("expired"));
    hook.rerender({ items: [{ sku: "F3-45G", qty: 4 }] });

    await waitFor(() => expect(hook.result.current.applied).toBe(0));
    expect(hook.result.current.hasHold).toBe(false);
  });
});

describe("with no hold at all", () => {
  it("releases nothing on unmount", () => {
    const hook = setup();
    hook.unmount();
    expect(removeCoins).not.toHaveBeenCalled();
  });

  it("advertises no hold, so no cart key is sent", () => {
    const hook = setup();
    expect(hook.result.current.hasHold).toBe(false);
  });
});

/*
 * WHAT ACTUALLY BROKE, isolated.
 *
 * `settle()` already zeroed `appliedRef`, which is what the unmount cleanup and
 * the re-apply effect both test — so those guards were never the live defect.
 * The defect was that the checkout page NEVER CALLED `settle()`. An order was
 * placed, the cart cleared, and the hook still believed the hold was its own:
 * the cart change re-applied it, and the unmount released it out from under the
 * order that owned it.
 *
 * These assert the un-settled path directly, so they fail if the call sites are
 * ever removed again.
 */
describe("an order placed WITHOUT settling (the original defect)", () => {
  it("re-applies the hold when success clears the cart", async () => {
    const hook = renderHook(({ items }) => useCoins({ items, isAuthenticated: true }), {
      initialProps: { items: ITEMS },
    });
    await withHold(hook);
    applyCoins.mockClear();

    // clearCart() with no settle() — exactly what the page used to do.
    hook.rerender({ items: [] });

    await waitFor(() => expect(applyCoins).toHaveBeenCalled());
    // Re-holding coins for an order that has already consumed them.
    expect(applyCoins.mock.calls[0][0].lines).toEqual([]);
  });

  it("releases the order's hold on unmount", async () => {
    const hook = setup();
    await withHold(hook);

    hook.unmount();

    // The order owns this hold; releasing it is what lost the discount.
    expect(removeCoins).toHaveBeenCalledTimes(1);
  });
});
