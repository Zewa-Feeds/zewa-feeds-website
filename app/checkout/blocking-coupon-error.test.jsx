import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * A refused coupon must be removable from where the customer reads the refusal.
 *
 * THE DEFECT: `place()` refuses the whole order when an applied code is no longer
 * usable — "You have already used ZEWA1." — and the banner sat at the top of the
 * page, detached from anything that could fix it. The coupon was still badged
 * APPLIED several hundred pixels away, so the customer saw a contradiction and no
 * next step.
 *
 * Asserted as source structure rather than by driving the page: rendering this
 * checkout needs the Razorpay script, a cart provider, an auth session and five
 * network paths, and a test built on all that breaks for reasons unrelated to the
 * rule. The rule is small and worth pinning exactly.
 */
const SOURCE = readFileSync(join(process.cwd(), "app/checkout/page.jsx"), "utf8");

describe("the checkout error names the coupon blocking it", () => {
  it("works out which applied coupon the server refused", () => {
    expect(SOURCE).toMatch(/blockingCouponCode/);
  });

  /*
   * Matched against the APPLIED codes, so the banner can only ever offer to
   * remove something the customer actually has on the order.
   */
  it("looks only among applied coupons, never an arbitrary token", () => {
    const block = SOURCE.slice(
      SOURCE.indexOf("const blockingCouponCode"),
      SOURCE.indexOf("const dropCoupon"),
    );
    expect(block).toMatch(/coupons \?\? \[\]/);
    expect(block).toMatch(/message\.includes\(code\)/);
  });

  it("offers a remove action inside the error itself", () => {
    expect(SOURCE).toMatch(/Remove \{blockingCouponCode\} to continue\./);
  });

  it("wires that action to the existing removal path", () => {
    // Anchored on the banner's JSX, not the first mention of its id — a scroll
    // helper references the same id earlier in the file.
    const banner = SOURCE.slice(SOURCE.indexOf('id="checkout-root-error"'));
    expect(banner.slice(0, 2000)).toMatch(/dropCoupon\(blockingCouponCode\)/);
  });

  /*
   * The banner is usually ABOUT the code being removed, so leaving it up after
   * the removal tells the customer the problem persists when it does not.
   */
  it("clears the banner when a coupon is removed", () => {
    const drop = SOURCE.slice(
      SOURCE.indexOf("const dropCoupon"),
      SOURCE.indexOf("const resetScrollAndLock"),
    );
    expect(drop).toMatch(/setErrors\(/);
    expect(drop).toMatch(/_root/);
  });

  /* Nothing changes for an error that names no coupon. */
  it("shows a plain error unchanged when no applied code matches", () => {
    const block = SOURCE.slice(
      SOURCE.indexOf("const blockingCouponCode"),
      SOURCE.indexOf("const dropCoupon"),
    );
    expect(block).toMatch(/\?\?\s*null/);
  });
});
