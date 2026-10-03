import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * A dismissed payment must give the coins back immediately.
 *
 * THE DEFECT: a clean Razorpay dismissal returned the customer to the form and
 * left the order PENDING. The coin reservation stayed bound to that order for the
 * full 30-minute unpaid sweep, so the balance had silently dropped with nothing on
 * screen explaining why — which reads as the coins having been taken.
 *
 * Asserted as source structure rather than by driving the page: rendering this
 * checkout needs the Razorpay script, a cart provider, an auth session and five
 * network paths, and a test built on all that breaks for reasons unrelated to the
 * rule. The rule itself is simple and worth pinning exactly.
 */
const SOURCE = readFileSync(join(process.cwd(), "app/checkout/page.jsx"), "utf8");

/** The dismissal branch, from its guard to the `setStep("form")` that ends it. */
const DISMISS_BRANCH = (() => {
  const start = SOURCE.indexOf('if (outcome === "dismissed")');
  expect(start).toBeGreaterThan(-1);
  return SOURCE.slice(start, SOURCE.indexOf('setStep("form");', start));
})();

describe("dismissing the payment modal", () => {
  it("cancels the pending order so the hold is released", () => {
    expect(DISMISS_BRANCH).toMatch(/cancelOrder\(/);
  });

  /*
   * Order matters. The gateway is checked FIRST, so an order paid in the
   * background is never cancelled out from under a real payment.
   */
  it("checks whether payment actually succeeded before cancelling", () => {
    const statusAt = DISMISS_BRANCH.indexOf("checkoutApi.status(");
    const cancelAt = DISMISS_BRANCH.indexOf("cancelOrder(");
    expect(statusAt).toBeGreaterThan(-1);
    expect(cancelAt).toBeGreaterThan(statusAt);
  });

  /* A paid order settles and succeeds — it must never reach the cancel. */
  it("settles and returns early when the payment did go through", () => {
    const paidBlock = DISMISS_BRANCH.slice(0, DISMISS_BRANCH.indexOf("cancelOrder("));
    expect(paidBlock).toMatch(/coins\.settle\(\)/);
    expect(paidBlock).toMatch(/setStep\("success"\)/);
    expect(paidBlock).toMatch(/return;/);
  });

  /*
   * A failed cancel must not trap the customer on a spinner. The 30-minute sweep
   * is the fallback, which is exactly the behaviour that existed before.
   */
  it("never lets a failed cancellation block the customer", () => {
    expect(DISMISS_BRANCH).toMatch(/cancelOrder\([\s\S]*?\.catch\(/);
  });

  /*
   * The server has released the reservation, so the hook must stop believing an
   * order owns it — otherwise `hasHold` stays false, no cart key is sent on the
   * next attempt, and it quietly prices at full value.
   */
  it("hands the hold back to the page", () => {
    expect(DISMISS_BRANCH).toMatch(/coins\.reopen\(/);
  });

  /*
   * The cancel is what RELEASES the reservation, and `reopen` refreshes the
   * balance from the server. Refreshing first reads the pre-release figure, so
   * the panel keeps showing coins as held — which is what
   * "Earn 10 Zewa Coins... You have 0." was, with the coins sitting untouched
   * in the account. The cancel is therefore handed to `reopen` to wait on.
   */
  it("refreshes the balance only after the release it depends on", () => {
    expect(DISMISS_BRANCH).toMatch(/coins\.reopen\(\s*\{\s*after:/);
  });

  /* Reuses the existing customer-cancel flow rather than a new release path. */
  it("uses the existing cancelOrder endpoint", () => {
    expect(SOURCE).toMatch(/accountApi\s*\n?\s*\.cancelOrder\(|accountApi\.cancelOrder\(/);
  });
});
