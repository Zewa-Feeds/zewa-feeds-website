import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

/**
 * A hold must not survive the tab closing.
 *
 * THE GAP THE OTHER FIXES LEAVE. Every release so far reaches the hold THROUGH
 * ITS ORDER: cancel the order, and its coin reservation and coupon redemption
 * come back. That covers a dismissed modal, a failed payment and the webhook.
 *
 * A hold applied but never checked out has NO order. Nothing can reach it that
 * way, so the only thing that frees it is the 30-minute expiry sweep — and the
 * customer meets it as "You have 0" on a balance they never spent.
 *
 * The hook's unmount cleanup already handles a normal in-app navigation, but a
 * React unmount does not happen when the TAB CLOSES. `pagehide` is the event
 * that does fire there (`beforeunload` is unreliable on mobile Safari), and a
 * `keepalive` fetch is allowed to outlive the document.
 *
 * `sendBeacon` is the usual tool here and is deliberately NOT used: it cannot
 * set an Authorization header, and this API authenticates with a Bearer token.
 * Reaching for it would have meant a new cookie-authenticated endpoint — a real
 * security surface for a convenience feature.
 */
const applyCoins = vi.fn();
const removeCoins = vi.fn();
const coinQuote = vi.fn();
const releaseCoinsOnUnload = vi.fn();

vi.mock("@/lib/api", () => ({
  account: {
    applyCoins: (...a) => applyCoins(...a),
    removeCoins: (...a) => removeCoins(...a),
    coinQuote: (...a) => coinQuote(...a),
    releaseCoinsOnUnload: (...a) => releaseCoinsOnUnload(...a),
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

beforeEach(() => {
  applyCoins.mockReset();
  // Resolve by default: the unmount cleanup calls it during teardown, and an
  // undefined return there throws and masks the assertion under test.
  removeCoins.mockReset().mockResolvedValue({ released: 0 });
  coinQuote.mockReset().mockResolvedValue(QUOTE);
  releaseCoinsOnUnload.mockReset();
});

afterEach(() => vi.clearAllMocks());

async function withHold() {
  const hook = renderHook(() => useCoins({ items: ITEMS, isAuthenticated: true }));
  await waitFor(() => expect(hook.result.current.quote).not.toBeNull());
  applyCoins.mockResolvedValue({ held: 376 });
  await act(async () => {
    await hook.result.current.apply(376);
  });
  await waitFor(() => expect(hook.result.current.applied).toBe(376));
  return hook;
}

describe("closing the tab with coins applied", () => {
  it("releases the hold on pagehide", async () => {
    await withHold();

    await act(async () => {
      window.dispatchEvent(new Event("pagehide"));
    });

    expect(releaseCoinsOnUnload).toHaveBeenCalledTimes(1);
  });

  it("does not release a hold the order already owns", async () => {
    const hook = await withHold();
    // Paid: the reservation belongs to the order now, and releasing it here
    // would take the discount off an order the customer has paid for.
    act(() => hook.result.current.settle());

    await act(async () => {
      window.dispatchEvent(new Event("pagehide"));
    });

    expect(releaseCoinsOnUnload).not.toHaveBeenCalled();
  });

  it("does nothing when no coins are applied", async () => {
    const hook = renderHook(() => useCoins({ items: ITEMS, isAuthenticated: true }));
    await waitFor(() => expect(hook.result.current.quote).not.toBeNull());

    await act(async () => {
      window.dispatchEvent(new Event("pagehide"));
    });

    expect(releaseCoinsOnUnload).not.toHaveBeenCalled();
  });
});
