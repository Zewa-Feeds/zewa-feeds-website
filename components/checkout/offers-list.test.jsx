/**
 * The available-offers list.
 *
 * A shopper cannot use a code nobody told them about, so the panel exists to
 * name them. The conditions are part of that: ZEWA1 is first-order-only and
 * needs ₹499, and a customer who taps it and is refused learns nothing except
 * that the shop offered them something it would not honour.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
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

/*
 * The list is MOUNTED TWICE — a mobile copy above the accordion (visible even
 * when the summary is collapsed, because the sticky pay bar lets a shopper
 * check out without ever opening it) and a desktop copy inside. Tailwind shows
 * exactly one per breakpoint; jsdom applies no CSS, so both are in the DOM
 * here. Both are driven by the same props, so asserting on the first is
 * equivalent to asserting on whichever one the shopper actually sees.
 */
const first = (matcher) => screen.getAllByText(matcher)[0];
/*
 * By role: the offer button's accessible name STARTS with the code, which also
 * disambiguates it from anything else carrying the same text.
 */
const offerButton = (code) => screen.getAllByRole("button", { name: new RegExp(`^${code}`) })[0];

describe("available offers", () => {
  it("lists every advertised code", () => {
    render(<OrderSummaryCard {...base} availableOffers={OFFERS} onCouponInputChange={vi.fn()} />);
    expect(first("SPECIAL10")).toBeTruthy();
    expect(first("ZEWA1")).toBeTruthy();
    expect(first("Free shipping")).toBeTruthy();
  });

  it("shows the conditions, so a code that will be refused says why", () => {
    render(<OrderSummaryCard {...base} availableOffers={OFFERS} onCouponInputChange={vi.fn()} />);
    expect(first(/First order only/)).toBeTruthy();
    expect(first(/Min ₹499/)).toBeTruthy();
  });

  it("shows no conditions line for an unconditional code", () => {
    render(<OrderSummaryCard {...base} availableOffers={[OFFERS[0]]} onCouponInputChange={vi.fn()} />);
    expect(screen.queryByText(/First order only/)).toBeNull();
    expect(screen.queryByText(/^Min /)).toBeNull();
  });

  it("fills the input when a code is tapped", () => {
    const onChange = vi.fn();
    render(<OrderSummaryCard {...base} availableOffers={OFFERS} onCouponInputChange={onChange} />);
    fireEvent.click(offerButton("ZEWA1"));
    expect(onChange).toHaveBeenCalledWith("ZEWA1");
  });

  it("marks an already-applied code as applied and stops re-applying it", () => {
    const onChange = vi.fn();
    render(
      <OrderSummaryCard {...base} availableOffers={OFFERS} appliedCodes={["SPECIAL10"]}
        onCouponInputChange={onChange} />,
    );
    expect(first("Applied")).toBeTruthy();
    const btn = offerButton("SPECIAL10");
    expect(btn.disabled).toBe(true);
    fireEvent.click(btn);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders nothing at all when the shop advertises no codes", () => {
    render(<OrderSummaryCard {...base} availableOffers={[]} onCouponInputChange={vi.fn()} />);
    expect(screen.queryByText(/Available offers/i)).toBeNull();
  });

  it("shows the offers on mobile without opening the collapsed summary", () => {
    /*
     * The regression this guards. The summary is collapsed by default on a
     * phone and sits below a sticky pay bar, so an offers panel rendered only
     * inside the accordion is one a customer can check out without ever seeing.
     */
    const { container } = render(
      <OrderSummaryCard {...base} availableOffers={OFFERS} onCouponInputChange={vi.fn()} />,
    );

    const mobileCopy = container.querySelector(".lg\\:hidden.pt-4");
    expect(mobileCopy).toBeTruthy();
    expect(within(mobileCopy).getByText("SPECIAL10")).toBeTruthy();

    // And it is OUTSIDE the collapsible region, not nested within it.
    const accordion = container.querySelector(".hidden.lg\\:flex");
    expect(accordion?.contains(mobileCopy)).toBeFalsy();
  });
});
