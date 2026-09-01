/**
 * Free shipping is announced only when a coupon actually granted it.
 *
 * ── THE BUG THIS PINS ───────────────────────────────────────────────────────
 * The banner keyed off `amountToFreeShippingPaise === 0`. With the spend
 * threshold disabled (0) the server returns `max(0, 0 - payable)`, which is 0
 * for every cart — so the summary announced "You unlocked FREE Express
 * Shipping!" directly above a ₹150 shipping line.
 *
 * Free shipping now comes from ZEWA1 (first order, entered by the customer),
 * and `freeShippingFromCoupon` is the only signal that says so.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import OrderSummaryCard from "./OrderSummaryCard";

vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }) => <img src={typeof src === "string" ? src : ""} alt={alt} {...rest} />,
}));

const base = {
  items: [{ sku: "F2-1KG", name: "Tetra Pellets F2", qty: 1, pricePaise: 143000, image: "/p.png" }],
  subtotalPaise: 143000,
  discountPaise: 0,
  shippingPaise: 18000, // ₹180 — three slabs to Delhi
  totalPaise: 161000,
  coupon: null,
  couponInput: "",
  onCouponInputChange: vi.fn(),
  couponError: null,
  onSubmitCoupon: vi.fn(),
  paymentMethod: "RAZORPAY",
  config: { tax: { gstRatePct: 0, gstInclusive: true } },
  validating: false,
  stateSelected: true,
  deliveryText: "Estimated delivery: 5 days*",
  setQty: vi.fn(),
};

const BANNER = /free shipping applied to your first order/i;
const OLD_BANNER = /unlocked free/i;

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("the free-shipping banner", () => {
  it("stays hidden when the threshold is disabled and shipping is being charged", () => {
    render(<OrderSummaryCard {...base} amountToFreeShippingPaise={0} freeShippingFromCoupon={false} />);
    expect(screen.queryByText(OLD_BANNER)).toBeNull();
    expect(screen.queryByText(BANNER)).toBeNull();
  });

  it("stays hidden for an ordinary cart with no coupon", () => {
    render(<OrderSummaryCard {...base} amountToFreeShippingPaise={null} freeShippingFromCoupon={false} />);
    expect(screen.queryByText(BANNER)).toBeNull();
  });

  it("appears only once a coupon has waived the charge", () => {
    render(
      <OrderSummaryCard
        {...base}
        shippingPaise={0}
        totalPaise={143000}
        amountToFreeShippingPaise={0}
        freeShippingFromCoupon
      />,
    );
    expect(screen.getByText(BANNER)).toBeTruthy();
  });

  it("never claims FREE before a state is chosen just because the threshold is 0", () => {
    render(
      <OrderSummaryCard
        {...base}
        stateSelected={false}
        shippingPaise={null}
        totalPaise={null}
        amountToFreeShippingPaise={0}
        freeShippingFromCoupon={false}
      />,
    );
    expect(screen.getByText(/select state/i)).toBeTruthy();
    expect(screen.queryByText(BANNER)).toBeNull();
  });
});
