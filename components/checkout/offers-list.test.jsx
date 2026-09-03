/**
 * The available-offers list.
 *
 * A shopper cannot use a code nobody told them about, so the panel exists to
 * name them. The conditions are part of that: ZEWA1 is first-order-only and
 * needs ₹499, and a customer who taps it and is refused learns nothing except
 * that the shop offered them something it would not honour.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import OrderSummaryCard from "./OrderSummaryCard";

vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }) => <img src={typeof src === "string" ? src : ""} alt={alt} {...rest} />,
}));

const OFFERS = [
  { code: "SPECIAL10", discountLabel: "10% off", minOrderPaise: 0, firstOrderOnly: false },
  { code: "ZEWA1", discountLabel: "Free shipping", minOrderPaise: 49900, firstOrderOnly: true },
];

const base = {
  items: [{ sku: "F2-1KG", name: "Tetra Pellets F2", qty: 1, pricePaise: 143000, image: "/p.png" }],
  subtotalPaise: 143000, discountPaise: 0, shippingPaise: 18000, totalPaise: 161000,
  coupon: null, couponInput: "", couponError: null, onSubmitCoupon: vi.fn(),
  paymentMethod: "RAZORPAY", config: { tax: { gstRatePct: 0, gstInclusive: true } },
  validating: false, stateSelected: true, setQty: vi.fn(),
};

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("available offers", () => {
  it("lists every advertised code", () => {
    render(<OrderSummaryCard {...base} availableOffers={OFFERS} onCouponInputChange={vi.fn()} />);
    expect(screen.getByText("SPECIAL10")).toBeTruthy();
    expect(screen.getByText("ZEWA1")).toBeTruthy();
    expect(screen.getByText("Free shipping")).toBeTruthy();
  });

  it("shows the conditions, so a code that will be refused says why", () => {
    render(<OrderSummaryCard {...base} availableOffers={OFFERS} onCouponInputChange={vi.fn()} />);
    expect(screen.getByText(/First order only/)).toBeTruthy();
    expect(screen.getByText(/Min ₹499/)).toBeTruthy();
  });

  it("shows no conditions line for an unconditional code", () => {
    render(<OrderSummaryCard {...base} availableOffers={[OFFERS[0]]} onCouponInputChange={vi.fn()} />);
    expect(screen.queryByText(/First order only/)).toBeNull();
    expect(screen.queryByText(/^Min /)).toBeNull();
  });

  it("fills the input when a code is tapped", () => {
    const onChange = vi.fn();
    render(<OrderSummaryCard {...base} availableOffers={OFFERS} onCouponInputChange={onChange} />);
    fireEvent.click(screen.getByText("ZEWA1").closest("button"));
    expect(onChange).toHaveBeenCalledWith("ZEWA1");
  });

  it("marks an already-applied code as applied and stops re-applying it", () => {
    const onChange = vi.fn();
    render(
      <OrderSummaryCard {...base} availableOffers={OFFERS} appliedCodes={["SPECIAL10"]}
        onCouponInputChange={onChange} />,
    );
    expect(screen.getByText("Applied")).toBeTruthy();
    const btn = screen.getByText("SPECIAL10").closest("button");
    expect(btn.disabled).toBe(true);
    fireEvent.click(btn);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders nothing at all when the shop advertises no codes", () => {
    render(<OrderSummaryCard {...base} availableOffers={[]} onCouponInputChange={vi.fn()} />);
    expect(screen.queryByText(/Available offers/i)).toBeNull();
  });
});
