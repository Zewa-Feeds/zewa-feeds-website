import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * A FAILED payment must release its holds, exactly as a dismissed one does.
 *
 * THE DEFECT: the dismissed branch cancels the pending order, so the coin
 * reservation and the coupon redemption come back straight away. The
 * failed/unavailable branch did not — it set the failure screen and returned,
 * leaving the order PENDING for the full 30-minute unpaid sweep.
 *
 * The customer sees the consequence on their very next attempt: a
 * `perCustomerLimit: 1` coupon is still held by the order that just failed, so
 * retrying is refused with "You have already used ZEWA1" — for an order they
 * never paid for and cannot see. Their coins are held the same way.
 *
 * A declined card is a NORMAL event, and retrying immediately is the normal
 * response to it. Blocking that retry for half an hour is the worst possible
 * moment to do it.
 *
 * Asserted as source structure for the same reason as the dismissal test:
 * rendering this page needs the Razorpay script, a cart provider, an auth
 * session and five network paths.
 */
const SOURCE = readFileSync(join(process.cwd(), "app/checkout/page.jsx"), "utf8");

/** The failed/unavailable branch, from its guard to the `return` that ends it. */
const FAILED_BRANCH = (() => {
  const start = SOURCE.indexOf('if (outcome === "failed" || outcome === "unavailable")');
  expect(start).toBeGreaterThan(-1);
  const end = SOURCE.indexOf('if (outcome === "dismissed")', start);
  expect(end).toBeGreaterThan(start);
  return SOURCE.slice(start, end);
})();

describe("a failed payment", () => {
  it("cancels the pending order so the coupon and coin holds are released", () => {
    expect(FAILED_BRANCH).toMatch(/cancelOrder\(/);
  });

  it("never lets a failed cancellation block the customer", () => {
    // The 30-minute sweep is the backstop. A cancel that rejects must not throw
    // on the payment path — the customer is already looking at a failure screen.
    expect(FAILED_BRANCH).toMatch(/cancelOrder\([\s\S]*?\.catch\(/);
  });

  it("hands the coin hold back to the page", () => {
    // Without this the hook still believes an order owns the hold, so `hasHold`
    // stays false and the retry sends no cart key — quietly pricing at full
    // value even though the coins are genuinely the customer's again.
    expect(FAILED_BRANCH).toMatch(/coins\.reopen\(/);
  });

  it("refreshes the balance only after the release it depends on", () => {
    expect(FAILED_BRANCH).toMatch(/coins\.reopen\(\s*\{\s*after:/);
  });

  it("still shows the failure screen", () => {
    expect(FAILED_BRANCH).toMatch(/setStep\("failed"\)/);
    expect(FAILED_BRANCH).toMatch(/setFailure\(/);
  });
});
