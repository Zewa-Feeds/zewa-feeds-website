import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The checkout page must hand every placed order's coin hold to the order.
 *
 * THE DEFECT: `coins.settle()` was never called anywhere on this page. An order
 * was placed, `clearCart()` ran, and the hook still believed the hold was its
 * own — so the cart change re-applied it and the unmount released it out from
 * under the order that owned it. The customer was charged full price and lost
 * the coins.
 *
 * Asserted as source structure rather than by driving the page. Rendering this
 * checkout needs Razorpay's script, a cart provider, an auth session and five
 * network paths; a test built on all that would break for reasons unrelated to
 * the rule, and the rule itself is simple: every place that clears the cart
 * after a successful order must settle first.
 */
const SOURCE = readFileSync(join(process.cwd(), "app/checkout/page.jsx"), "utf8");

describe("settling the coin hold", () => {
  it("settles the hold at all, which it previously never did", () => {
    expect(SOURCE).toMatch(/coins\.settle\(\)/);
  });

  /*
   * `clearCart()` marks a completed order on this page. Every one of those is a
   * settlement point, and one missed is a customer losing their coins on that
   * particular success path.
   */
  it("settles at EVERY success path, not just the common one", () => {
    const clears = SOURCE.match(/clearCart\(\);/g) ?? [];
    const settles = SOURCE.match(/coins\.settle\(\);/g) ?? [];

    expect(clears.length).toBeGreaterThan(0);
    expect(settles.length).toBe(clears.length);
  });

  /*
   * Order matters. Settling AFTER clearing the cart would let the cart-change
   * effect fire against the emptied cart before the hold was handed over.
   */
  it("settles BEFORE clearing the cart, never after", () => {
    const lines = SOURCE.split("\n");
    lines.forEach((line, i) => {
      if (!line.includes("clearCart();")) return;
      const previous = lines[i - 1] ?? "";
      expect(previous).toMatch(/coins\.settle\(\)/);
    });
  });

  /*
   * The key must be sent whenever a hold is live — including on a retry after a
   * dismissed payment. Gating on `applied > 0` alone dropped it once the hook had
   * settled, and gating on nothing would send a key for a hold already bound.
   */
  it("sends the cart key from the hold's own liveness, not display state", () => {
    expect(SOURCE).toMatch(/coinCartKey:\s*coins\.hasHold\s*\?\s*coins\.cartKey\s*:\s*undefined/);
  });

  /* The server owns the amount; the client may only name the key (§4.3). */
  it("never sends a coin AMOUNT to the placement endpoint", () => {
    const placeCall = SOURCE.slice(SOURCE.indexOf("checkoutApi.place("));
    const body = placeCall.slice(0, placeCall.indexOf("));"));
    expect(body).not.toMatch(/coinDiscountPaise|coinsApplied|coins:\s*\d/);
  });
});
