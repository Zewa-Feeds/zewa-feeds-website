/**
 * The available-offers list.
 *
 * A shopper cannot use a code nobody told them about, so the panel exists to
 * name them. The conditions are part of that: ZEWA1 is first-order-only and
 * needs ₹499, and a customer who taps it and is refused learns nothing except
 * that the shop offered them something it would not honour.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

  it("applies the code on tap, without a second confirm step", async () => {
    const onSubmitCoupon = vi.fn();
    const onChange = vi.fn();
    render(
      <OrderSummaryCard {...base} availableOffers={OFFERS}
        onCouponInputChange={onChange} onSubmitCoupon={onSubmitCoupon} />,
    );
    fireEvent.click(offerButton("ZEWA1"));
    // The code goes straight to the apply handler; nothing is typed into the
    // input for the shopper to confirm.
    await waitFor(() => expect(onSubmitCoupon).toHaveBeenCalledWith("ZEWA1"));
    expect(onChange).not.toHaveBeenCalled();
  });

  /*
   * An applied row is the ONLY remove control for an advertised code — the
   * duplicate chip that used to carry one was removed, because listing the same
   * coupon twice on one screen confused more than it helped. So the row stays
   * live and toggles back off rather than going inert.
   */
  it("marks an already-applied code as applied and removes it when tapped", () => {
    const onRemove = vi.fn();
    render(
      <OrderSummaryCard {...base} availableOffers={OFFERS} appliedCodes={["SPECIAL10"]}
        coupons={[{ code: "SPECIAL10", discountLabel: "10% off" }]}
        onRemoveCoupon={onRemove} onCouponInputChange={vi.fn()} />,
    );
    expect(first("Applied")).toBeTruthy();
    const btn = offerButton("SPECIAL10");
    expect(btn.disabled).toBe(false);
    fireEvent.click(btn);
    expect(onRemove).toHaveBeenCalledWith("SPECIAL10");
  });

  it("does not list an advertised coupon a second time once applied", () => {
    render(
      <OrderSummaryCard {...base} availableOffers={OFFERS} appliedCodes={["SPECIAL10"]}
        coupons={[{ code: "SPECIAL10", discountLabel: "10% off" }]}
        onRemoveCoupon={vi.fn()} onCouponInputChange={vi.fn()} />,
    );
    // Once in the offers panel, and nowhere else.
    expect(screen.queryByText(/SPECIAL10 applied/)).toBeNull();
  });

  it("still lists a privately typed code, which no offer row covers", () => {
    render(
      <OrderSummaryCard {...base} availableOffers={OFFERS} appliedCodes={["PARTNER20"]}
        coupons={[{ code: "PARTNER20", discountLabel: "20% off" }]}
        onRemoveCoupon={vi.fn()} onCouponInputChange={vi.fn()} />,
    );
    // The chip wraps the code in <strong>, so match across elements.
    expect(
      screen.getAllByText((_t, el) => /PARTNER20 applied/.test(el?.textContent || ""))[0],
    ).toBeTruthy();
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

  /*
   * A refused code must be removable.
   *
   * The applied rows render from `coupons`, so a code the server refused —
   * "You have already used SPECIAL10" — appeared nowhere and had no Remove
   * control, while still sitting in the cart and being re-sent on every
   * attempt. The only way out was to abandon the order.
   */
  it("gives a selected-but-unapplied code its own Remove control", async () => {
    const onRemoveCoupon = vi.fn();
    render(
      <OrderSummaryCard
        {...base}
        coupons={[]}
        selectedCodes={["SPECIAL10"]}
        onRemoveCoupon={onRemoveCoupon}
      />,
    );

    expect(first(/SPECIAL10/)).toBeTruthy();
    expect(first(/not applied/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Remove SPECIAL10" }));
    expect(onRemoveCoupon).toHaveBeenCalledWith("SPECIAL10");
  });

  it("does not duplicate a code that the server did apply", () => {
    render(
      <OrderSummaryCard
        {...base}
        coupons={[{ code: "SPECIAL10", discountLabel: "10% off", discountPaise: 1850 }]}
        selectedCodes={["SPECIAL10"]}
        onRemoveCoupon={vi.fn()}
      />,
    );

    // The applied row owns it; no "not applied" twin alongside.
    expect(screen.queryByText(/not applied/i)).toBeNull();
    expect(screen.getAllByRole("button", { name: "Remove SPECIAL10" })).toHaveLength(1);
  });

  /*
   * An offer the customer cannot use must not invite a tap.
   *
   * The advertised list is anonymous, so it cannot know a code has already
   * been used by THIS customer. The quote's issues do, and greying the offer
   * out with the server's own reason beats a button whose only outcome is an
   * error banner.
   */
  it("greys out a code the server refused, with its reason", () => {
    render(
      <OrderSummaryCard
        {...base}
        availableOffers={OFFERS}
        coupons={[]}
        issues={[
          {
            sku: "__coupon__",
            code: "COUPON_ALREADY_USED",
            couponCode: "SPECIAL10",
            message: "You have already used SPECIAL10.",
          },
        ]}
      />,
    );

    const offer = offerButton("SPECIAL10");
    expect(offer.disabled).toBe(true);
    expect(within(offer).getByText(/Unavailable/i)).toBeTruthy();
    expect(within(offer).getByText(/already used SPECIAL10/i)).toBeTruthy();
  });

  it("leaves an offer with no issue fully usable", () => {
    render(<OrderSummaryCard {...base} availableOffers={OFFERS} coupons={[]} issues={[]} />);

    const offer = offerButton("SPECIAL10");
    expect(offer.disabled).toBe(false);
    expect(within(offer).getByText(/^Apply$/i)).toBeTruthy();
  });

  /*
   * Greying out used to depend on the SERVER refusing a code, which it only
   * does for a code the shopper submitted. An untried offer therefore looked
   * applicable however short the cart was. The minimum spend is checked here
   * instead, so the row is honest before it is tapped.
   */
  describe("minimum spend, before the code is tried", () => {
    it("greys out an offer the cart is short of, and says by how much", () => {
      render(
        <OrderSummaryCard {...base} subtotalPaise={20000} availableOffers={OFFERS}
          onCouponInputChange={vi.fn()} />,
      );
      const btn = offerButton("ZEWA1");
      expect(btn.disabled).toBe(true);
      // The line appends other conditions, so match across child elements.
      expect(
        screen.getAllByText((_t, el) => /Add ₹299 more/.test(el?.textContent || ""))[0],
      ).toBeTruthy();
    });

    it("keeps an offer live once the cart clears its minimum", () => {
      render(
        <OrderSummaryCard {...base} subtotalPaise={60000} availableOffers={OFFERS}
          onCouponInputChange={vi.fn()} />,
      );
      expect(offerButton("ZEWA1").disabled).toBe(false);
    });

    it("still shows conditions the shortfall does not cover", () => {
      render(
        <OrderSummaryCard {...base} subtotalPaise={20000} availableOffers={OFFERS}
          onCouponInputChange={vi.fn()} />,
      );
      // "First order only" decides eligibility even once the minimum is met.
      expect(first(/First order only/)).toBeTruthy();
    });

    it("puts usable offers above ones the cart cannot take", () => {
      render(
        <OrderSummaryCard {...base} subtotalPaise={20000} availableOffers={OFFERS}
          onCouponInputChange={vi.fn()} />,
      );
      const codes = screen
        .getAllByRole("button", { name: /^(SPECIAL10|ZEWA1)/ })
        .map((b) => b.getAttribute("aria-label").split(" ")[0]);
      // SPECIAL10 has no minimum; ZEWA1 is out of reach at this subtotal.
      expect(codes.slice(0, 2)).toEqual(["SPECIAL10", "ZEWA1"]);
    });
  });
});