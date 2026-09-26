import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import AvailableOffers from "./AvailableOffers";

/**
 * A coupon the customer chose must always be removable.
 *
 * THE DEFECT THIS FILE EXISTS FOR
 *
 * ZEWA1 was advertised, applied, and THEN refused by the server ("valid only on
 * your first order"). Two rules then collided:
 *
 *   - this panel decides "is this a remove control?" from `appliedCodes`, the
 *     server-CONFIRMED list — a refused code is absent from it, so the row
 *     rendered as "Apply"
 *   - the Order Summary skips advertised codes when listing refused ones,
 *     because it assumes this panel already offers removal
 *
 * So the code sat on the order, was re-sent on every attempt, blocked checkout
 * with an error, and had no remove control anywhere on the page.
 */
afterEach(cleanup);

const ZEWA1 = { code: "ZEWA1", label: "Free shipping", minOrderPaise: 9900, firstOrderOnly: true };
const REFUSED = { ZEWA1: "ZEWA1 is valid only on your first order." };

const row = () => screen.getByRole("button", { name: /^ZEWA1/ });

function renderOffers(props = {}) {
  const onSelect = vi.fn();
  const onRemove = vi.fn();
  render(
    <AvailableOffers
      offers={[ZEWA1]}
      appliedCodes={[]}
      selectedCodes={[]}
      unavailableReasons={{}}
      subtotalPaise={41800}
      onSelect={onSelect}
      onRemove={onRemove}
      {...props}
    />,
  );
  return { onSelect, onRemove };
}

describe("a coupon the customer chose but the server refused", () => {
  /* The exact stuck state. */
  it("stays clickable so it can be taken off", () => {
    renderOffers({ selectedCodes: ["ZEWA1"], unavailableReasons: REFUSED });
    expect(row().disabled).toBe(false);
  });

  it("removes rather than re-applying when tapped", () => {
    const { onRemove, onSelect } = renderOffers({
      selectedCodes: ["ZEWA1"],
      unavailableReasons: REFUSED,
    });

    fireEvent.click(row());

    expect(onRemove).toHaveBeenCalledWith("ZEWA1");
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("says what the tap will do", () => {
    renderOffers({ selectedCodes: ["ZEWA1"], unavailableReasons: REFUSED });
    expect(row().getAttribute("aria-label")).toMatch(/tap to remove/i);
  });

  /* The reason is still the point — only the disabled state is suppressed. */
  it("still explains why it will not apply", () => {
    renderOffers({ selectedCodes: ["ZEWA1"], unavailableReasons: REFUSED });
    expect(screen.getByText(/valid only on your first order/i)).toBeTruthy();
  });
});

describe("a coupon the customer has NOT chosen", () => {
  /*
   * The other half of the ask: an unusable coupon must be greyed out rather than
   * inviting a tap that can only fail.
   */
  it("is disabled when the server says it is unavailable", () => {
    renderOffers({ unavailableReasons: REFUSED });
    expect(row().disabled).toBe(true);
  });

  it("is disabled when the cart is below its minimum", () => {
    renderOffers({ subtotalPaise: 100 });
    expect(row().disabled).toBe(true);
  });

  it("applies normally when it is usable", () => {
    const { onSelect, onRemove } = renderOffers();

    fireEvent.click(row());

    expect(onSelect).toHaveBeenCalledWith("ZEWA1");
    expect(onRemove).not.toHaveBeenCalled();
  });
});

describe("a coupon the server confirmed", () => {
  it("remains removable, as before", () => {
    const { onRemove } = renderOffers({ appliedCodes: ["ZEWA1"] });

    expect(row().disabled).toBe(false);
    fireEvent.click(row());
    expect(onRemove).toHaveBeenCalledWith("ZEWA1");
  });

  /*
   * An applied coupon must not be disabled by a stale minimum-spend prediction:
   * the row is the only way to take it off.
   */
  it("is not disabled by a local minimum-spend check", () => {
    renderOffers({ appliedCodes: ["ZEWA1"], subtotalPaise: 100 });
    expect(row().disabled).toBe(false);
  });
});
