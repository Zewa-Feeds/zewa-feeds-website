import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, cleanup, waitFor } from "@testing-library/react";

/**
 * `reopen()` must re-quote, exactly as `remove()` does.
 *
 * THE DEFECT THIS FILE EXISTS FOR
 *
 * `quote.available` is SPENDABLE coins — the balance MINUS whatever is currently
 * held. So a quote fetched while a hold is live reports a reduced figure, and
 * once the hold goes away that number is wrong until something re-fetches it.
 *
 * `remove()` already re-quotes for this reason. `reopen()` — the dismissed-payment
 * path — did not: it cleared the local applied amount and left the stale quote in
 * place. A customer with 500 coins who applied 376, dismissed Razorpay, then
 * applied 124 on the retry and dismissed again, came back to a panel reading
 * "Earn 10 Zewa Coins to start using them. You have 0."
 *
 * The coins were never gone — 500 in the account, nothing locked, every
 * reservation released. Only the number on screen was wrong, and it read exactly
 * like the balance had been taken.
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

/** Spendable = balance - held, which is what the server actually returns. */
const quoteWith = (available) => ({
  visible: true,
  available,
  maxRedeemable: Math.min(available, 376),
  minRedemption: 10,
  coinValuePaise: 100,
});

function setup() {
  return renderHook(() => useCoins({ items: ITEMS, isAuthenticated: true }));
}

beforeEach(() => {
  applyCoins.mockReset();
  removeCoins.mockReset();
  coinQuote.mockReset();
  // Nothing held yet: the full balance is spendable.
  coinQuote.mockResolvedValue(quoteWith(500));
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("reopen() after a dismissed payment", () => {
  it("re-quotes so the panel stops showing the held-down balance", async () => {
    /*
     * The mount quote is what the panel keeps until something refetches. Model
     * the real sequence: the customer returns to a checkout whose quote was
     * fetched while 376 coins were held, so it reports only 124 spendable.
     */
    coinQuote.mockResolvedValue(quoteWith(124));
    const hook = setup();
    await waitFor(() => expect(hook.result.current.quote?.available).toBe(124));

    applyCoins.mockResolvedValue({ held: 376 });
    await act(async () => {
      await hook.result.current.apply(376);
    });
    await waitFor(() => expect(hook.result.current.applied).toBe(376));

    // Order placed, then the modal is dismissed. The order is cancelled
    // server-side, the reservation released, and all 500 are spendable again.
    act(() => {
      hook.result.current.settle();
    });
    coinQuote.mockResolvedValue(quoteWith(500));

    await act(async () => {
      await hook.result.current.reopen();
    });

    // THE REGRESSION: the panel must not still read the held-down figure.
    // Without the re-quote this stays 124 and, with a second dismissed
    // attempt behind it, 0 — "You have 0." with the coins sitting untouched.
    await waitFor(() => expect(hook.result.current.quote.available).toBe(500));
    expect(hook.result.current.applied).toBe(0);
    expect(hook.result.current.hasHold).toBe(false);
  });

  it("keeps the previous quote when the re-quote fails, and never throws", async () => {
    coinQuote.mockResolvedValue(quoteWith(124));
    const hook = setup();
    await waitFor(() => expect(hook.result.current.quote?.available).toBe(124));

    applyCoins.mockResolvedValue({ held: 376 });
    await act(async () => {
      await hook.result.current.apply(376);
    });
    await waitFor(() => expect(hook.result.current.applied).toBe(376));

    act(() => {
      hook.result.current.settle();
    });

    // Loyalty is down. Fail invisibly (§8.1 #11) — the pay path must not error.
    coinQuote.mockRejectedValue(new Error("loyalty down"));
    await act(async () => {
      await hook.result.current.reopen();
    });

    expect(hook.result.current.applied).toBe(0);
    expect(hook.result.current.quote).not.toBeNull();
    expect(hook.result.current.quote.available).toBe(124);
  });

  it("re-quotes only AFTER the release it depends on has landed", async () => {
    /*
     * The dismissal handler cancels the order fire-and-forget, and that cancel
     * is what releases the reservation. A re-quote issued before it commits
     * reads the OLD spendable figure and the panel stays wrong — the bug this
     * file is about, just moved later.
     *
     * So `reopen()` accepts the release as a promise and waits for it. Modelled
     * here with a cancel that resolves on a later tick, while the server only
     * reports the full balance once it has.
     */
    coinQuote.mockResolvedValue(quoteWith(124));
    const hook = setup();
    await waitFor(() => expect(hook.result.current.quote?.available).toBe(124));

    applyCoins.mockResolvedValue({ held: 376 });
    await act(async () => {
      await hook.result.current.apply(376);
    });
    await waitFor(() => expect(hook.result.current.applied).toBe(376));

    act(() => {
      hook.result.current.settle();
    });

    let released = false;
    const cancel = new Promise((resolve) =>
      setTimeout(() => {
        released = true;
        resolve();
      }, 20),
    );
    // The server reports the released balance only once the cancel has landed.
    coinQuote.mockImplementation(async () =>
      released ? quoteWith(500) : quoteWith(124),
    );

    await act(async () => {
      await hook.result.current.reopen({ after: cancel });
    });

    expect(released).toBe(true);
    await waitFor(() => expect(hook.result.current.quote.available).toBe(500));
  });

  it("still re-quotes when the release fails", async () => {
    coinQuote.mockResolvedValue(quoteWith(124));
    const hook = setup();
    await waitFor(() => expect(hook.result.current.quote?.available).toBe(124));

    applyCoins.mockResolvedValue({ held: 376 });
    await act(async () => {
      await hook.result.current.apply(376);
    });
    await waitFor(() => expect(hook.result.current.applied).toBe(376));

    act(() => {
      hook.result.current.settle();
    });

    // A cancel that rejects must not stop the refresh: the 30-minute sweep is
    // the backstop, and the panel should still show the server's current view.
    coinQuote.mockResolvedValue(quoteWith(500));
    await act(async () => {
      await hook.result.current.reopen({ after: Promise.reject(new Error("no session")) });
    });

    await waitFor(() => expect(hook.result.current.quote.available).toBe(500));
    expect(hook.result.current.applied).toBe(0);
  });
});
