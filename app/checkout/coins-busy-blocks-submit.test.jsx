import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Checkout must be blocked while a coin hold is in flight.
 *
 * THE DEFECT: `coins.busy` was passed to the panel so IT could show a spinner,
 * but nothing else looked at it. The Pay button stayed enabled and the submit
 * handler had no guard, so the order could be placed in the window between
 * "apply coins" being sent and the server answering.
 *
 * That window decides the price. The order is created from the quote as it
 * stands when submit runs, so paying mid-apply places it at a total that does
 * not include the coins — while the reservation the server is busy creating
 * still comes off the balance. The customer is charged full price AND loses the
 * coins, which is the same class of defect as the ₹0.20-vs-₹376.20 mismatch.
 *
 * Asserted as source structure for the same reason as the sibling checkout
 * tests: rendering this page needs the Razorpay script, a cart provider, an
 * auth session and five network paths.
 */
const SOURCE = readFileSync(join(process.cwd(), "app/checkout/page.jsx"), "utf8");

describe("while coins are being applied", () => {
  it("guards the submit handler", () => {
    const guard = SOURCE.match(/if \(submitting\.current[^)]*\) return;/);
    expect(guard).not.toBeNull();
    expect(guard[0]).toMatch(/coins\.busy/);
  });

  it("disables every pay button", () => {
    const buttons = [...SOURCE.matchAll(/disabled=\{validating[^}]*\}/g)].map((m) => m[0]);
    // Both the desktop summary button and the sticky mobile bar.
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    for (const b of buttons) expect(b).toMatch(/coins\.busy/);
  });

  it("shows the customer why the button is unavailable", () => {
    // A disabled button with no explanation reads as a broken page.
    expect(SOURCE).toMatch(/coins\.busy[\s\S]{0,400}?Applying (your )?coins/i);
  });
});
