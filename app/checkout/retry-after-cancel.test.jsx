import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * A retry after a cancelled attempt must be a NEW order, not a replay.
 *
 * THE DEFECT, AND IT WAS INTRODUCED BY THE FIX ABOVE IT.
 *
 * Dismissing or failing a payment now cancels the pending order, so the coupon
 * and coin holds come straight back — which is right, and is what lets the
 * customer re-apply their coins immediately.
 *
 * But `idempotencyKey` is generated once per page mount and was never reset.
 * The retry therefore replayed the SAME key, the server found the order that
 * had just been cancelled, and refused:
 *
 *   "That order was cancelled because payment was not completed.
 *    Please place a new order."
 *
 * The server is right to refuse. A cancelled order has already returned its
 * stock and released its holds; resurrecting it would confirm an order nobody
 * paid for. The mistake is the client asking about a dead order at all.
 *
 * So the key is rotated wherever an attempt is cancelled — both the dismissal
 * and the failure branch — which is exactly the set of places that call
 * `cancelOrder`. The next attempt is then a genuinely new checkout, and the
 * customer is not told to "place a new order" when that is precisely what
 * they are trying to do.
 *
 * Asserted as source structure for the same reason as the sibling checkout
 * tests: rendering this page needs the Razorpay script, a cart provider, an
 * auth session and five network paths.
 */
const SOURCE = readFileSync(join(process.cwd(), "app/checkout/page.jsx"), "utf8");

/** Everything from the failed branch through to the end of the dismissal branch. */
const CANCEL_PATHS = (() => {
  const start = SOURCE.indexOf('if (outcome === "failed" || outcome === "unavailable")');
  expect(start).toBeGreaterThan(-1);
  const end = SOURCE.indexOf('setStep("form");', start);
  expect(end).toBeGreaterThan(start);
  return SOURCE.slice(start, end);
})();

describe("retrying after a cancelled attempt", () => {
  it("rotates the idempotency key on a dismissed payment", () => {
    const dismissed = CANCEL_PATHS.slice(CANCEL_PATHS.indexOf('outcome === "dismissed"'));
    expect(dismissed).toMatch(/rotateIdempotencyKey\(\)|idempotencyKey\.current\s*=/);
  });

  it("rotates the idempotency key on a failed payment", () => {
    const failed = CANCEL_PATHS.slice(0, CANCEL_PATHS.indexOf('outcome === "dismissed"'));
    expect(failed).toMatch(/rotateIdempotencyKey\(\)|idempotencyKey\.current\s*=/);
  });

  it("rotates it wherever an order is cancelled", () => {
    // One rotation per cancelOrder call — the two must not drift apart.
    const cancels = (CANCEL_PATHS.match(/cancelOrder\(/g) ?? []).length;
    const rotations = (CANCEL_PATHS.match(/rotateIdempotencyKey\(\)|idempotencyKey\.current\s*=/g) ?? []).length;
    expect(cancels).toBeGreaterThanOrEqual(2);
    expect(rotations).toBe(cancels);
  });

  it("generates a distinct key, not a fixed string", () => {
    // Wherever the value is actually produced, it must vary per attempt —
    // a constant would bring the replay problem straight back.
    const factory = SOURCE.match(/newIdempotencyKey\s*=\s*\(\)\s*=>\s*([^;]+);/);
    expect(factory).not.toBeNull();
    expect(factory[1]).toMatch(/Date\.now\(\)|Math\.random|randomUUID/);
  });
});
