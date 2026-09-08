/**
 * Coupons on the full cart page.
 *
 * The cart had no coupon UI at all: a shopper had to reach checkout before
 * discovering the shop even ran promotions, or already know a code by heart.
 * These cover the two things that panel has to get right — naming the codes
 * that exist, and telling the truth about what happened when one is used.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import CartPage from "./page";

const OFFERS = [
  { code: "SPECIAL10", discountLabel: "10% off", minOrderPaise: 0, firstOrderOnly: false },
  { code: "ZEWA1", discountLabel: "Free shipping", minOrderPaise: 49900, firstOrderOnly: true },
];

const listOffers = vi.fn();
let mockCartState;

function baseCart(overrides = {}) {
  return {
    items: [
      { sku: "F3-45G", name: "Betta Bites F3", qty: 1, pricePaise: 18500, image: "/p.png", pack: "45g Bottle", maxQty: 10 },
    ],
    subtotalPaise: 18500,
    discountPaise: 0,
    totalPaise: 18500,
    amountToFreeShippingPaise: 0,
    freeShippingThresholdPaise: 0,
    totalItems: 1,
    removeFromCart: vi.fn(),
    setQty: vi.fn(),
    clearCart: vi.fn(),
    coupons: [],
    couponCodes: [],
    applyCoupon: vi.fn(),
    removeCoupon: vi.fn(),
    ...overrides,
  };
}

vi.mock("@/lib/cartContext", async () => {
  const actual = await vi.importActual("@/lib/cartContext");
  return { ...actual, useCart: () => mockCartState };
});

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual("@/lib/api");
  return {
    ...actual,
    formatInr: (paise) => `₹${Math.round(paise / 100)}`,
    offers: { list: (...args) => listOffers(...args) },
  };
});

vi.mock("@/components/Header", () => ({ default: () => <header /> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer /> }));
vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }) => <img src={typeof src === "string" ? src : ""} alt={alt} {...rest} />,
}));

/*
 * The panel is MOUNTED TWICE — above the items on mobile, inside the Order
 * Summary on desktop — with Tailwind showing exactly one per breakpoint. jsdom
 * applies no CSS, so both are in the DOM here. Both are driven by the same page
 * state, so exercising the first is equivalent to exercising whichever one the
 * shopper is actually looking at; these helpers say that once instead of
 * scattering [0] through every assertion.
 */
const codeInput = () => screen.getAllByLabelText("Discount code")[0];
const applyButton = () => screen.getAllByText("Apply")[0];
/*
 * By role, not by text: an applied code also appears in the chip below the
 * list, so text alone is ambiguous. The offer button's accessible name STARTS
 * with the code, while the chip's control is named "Remove <CODE>".
 */
const offerButton = async (code) =>
  (await screen.findAllByRole("button", { name: new RegExp(`^${code}`) }))[0];
const firstText = async (matcher) => (await screen.findAllByText(matcher))[0];

beforeEach(() => {
  mockCartState = baseCart();
  listOffers.mockResolvedValue(OFFERS);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("available offers on the cart", () => {
  it("lists every advertised code with its conditions", async () => {
    render(<CartPage />);

    expect(await firstText("SPECIAL10")).toBeTruthy();
    expect(await firstText("ZEWA1")).toBeTruthy();
    expect(await firstText("Free shipping")).toBeTruthy();
    // A code that will be refused should say why BEFORE it is tapped.
    expect(await firstText(/First order only/)).toBeTruthy();
    expect(await firstText(/Min ₹499/)).toBeTruthy();
  });

  it("renders no offers panel when the shop advertises nothing", async () => {
    listOffers.mockResolvedValue([]);
    render(<CartPage />);

    await waitFor(() => expect(listOffers).toHaveBeenCalled());
    expect(screen.queryByText(/Available offers/i)).toBeNull();
  });

  it("still renders the cart when the offers request fails", async () => {
    listOffers.mockRejectedValue(new Error("network"));
    render(<CartPage />);

    await waitFor(() => expect(listOffers).toHaveBeenCalled());
    // Not knowing what is on offer must never take down the cart.
    expect(screen.getByText("Order Summary")).toBeTruthy();
    expect(screen.queryByText(/Available offers/i)).toBeNull();
  });

  it("applies a code on tap, rather than only filling the input", async () => {
    mockCartState.applyCoupon.mockResolvedValue({
      coupons: [{ code: "SPECIAL10", discountLabel: "10% off", discountPaise: 1850 }],
      issues: [],
    });
    render(<CartPage />);

    fireEvent.click(await offerButton("SPECIAL10"));

    await waitFor(() => expect(mockCartState.applyCoupon).toHaveBeenCalledWith("SPECIAL10"));
  });

  it("marks an already-applied code as applied and will not re-apply it", async () => {
    mockCartState = baseCart({
      couponCodes: ["SPECIAL10"],
      coupons: [{ code: "SPECIAL10", discountLabel: "10% off", discountPaise: 1850 }],
    });
    render(<CartPage />);

    const btn = await offerButton("SPECIAL10");
    expect(btn.disabled).toBe(true);
    expect(within(btn).getByText("Applied")).toBeTruthy();
    fireEvent.click(btn);
    expect(mockCartState.applyCoupon).not.toHaveBeenCalled();
  });

  it("shows the offers on mobile without scrolling past the whole order", async () => {
    /*
     * The regression this guards: the panel used to live ONLY inside the Order
     * Summary, which on a phone sits below every line in the cart — so the
     * offers were unreachable without scrolling past the entire order. It is
     * now mounted twice, and the mobile copy must sit BEFORE the items.
     */
    const { container } = render(<CartPage />);
    await firstText("SPECIAL10");

    const mobileMount = container.querySelector(".lg\\:hidden");
    const desktopMount = container.querySelector(".hidden.lg\\:block");
    expect(mobileMount).toBeTruthy();
    expect(desktopMount).toBeTruthy();

    // The mobile copy carries the offers, and precedes the first cart line.
    expect(within(mobileMount).getByText("SPECIAL10")).toBeTruthy();
    const firstItem = screen.getByText("Betta Bites F3");
    expect(mobileMount.compareDocumentPosition(firstItem) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe("applying a coupon by code", () => {
  it("confirms what the code was actually worth", async () => {
    mockCartState.applyCoupon.mockResolvedValue({
      coupons: [{ code: "SPECIAL10", discountLabel: "10% off", discountPaise: 1850 }],
      issues: [],
    });
    render(<CartPage />);

    fireEvent.change(codeInput(), { target: { value: "special10" } });
    fireEvent.click(applyButton());

    // Typed lowercase, sent uppercase — codes are case-insensitive to shoppers.
    await waitFor(() => expect(mockCartState.applyCoupon).toHaveBeenCalledWith("SPECIAL10"));
    expect(await firstText(/You saved ₹19/)).toBeTruthy();
  });

  it("says what a free-shipping perk did instead of 'you saved ₹0'", async () => {
    mockCartState.applyCoupon.mockResolvedValue({
      coupons: [{ code: "ZEWA1", discountLabel: "Free shipping", discountPaise: 0 }],
      issues: [],
    });
    render(<CartPage />);

    fireEvent.change(codeInput(), { target: { value: "ZEWA1" } });
    fireEvent.click(applyButton());

    expect(await firstText(/Coupon ZEWA1 applied\. Free shipping\./)).toBeTruthy();
  });

  it("shows the server's refusal reason verbatim", async () => {
    mockCartState.applyCoupon.mockResolvedValue({
      coupons: [],
      issues: [{ sku: "__coupon__", couponCode: "ZEWA1", message: "Valid on your first order only." }],
    });
    render(<CartPage />);

    fireEvent.change(codeInput(), { target: { value: "ZEWA1" } });
    fireEvent.click(applyButton());

    expect(await firstText("Valid on your first order only.")).toBeTruthy();
  });

  it("does not report another coupon's problem under this code", async () => {
    mockCartState.applyCoupon.mockResolvedValue({
      coupons: [{ code: "SPECIAL10", discountLabel: "10% off", discountPaise: 1850 }],
      issues: [{ sku: "__coupon__", couponCode: "SOMEOTHER", message: "Expired." }],
    });
    render(<CartPage />);

    fireEvent.change(codeInput(), { target: { value: "SPECIAL10" } });
    fireEvent.click(applyButton());

    await firstText(/You saved/);
    expect(screen.queryByText("Expired.")).toBeNull();
  });

  it("reports a failure rather than silently clearing the input when the network is down", async () => {
    // cartContext.validate swallows network errors and resolves null.
    mockCartState.applyCoupon.mockResolvedValue(null);
    render(<CartPage />);

    fireEvent.change(codeInput(), { target: { value: "SPECIAL10" } });
    fireEvent.click(applyButton());

    expect(await firstText(/Could not apply that code/)).toBeTruthy();
    expect(codeInput().value).toBe("SPECIAL10");
  });

  it("will not submit an empty code", async () => {
    render(<CartPage />);
    // Await the offers fetch so its state update lands inside act().
    await firstText(/Available offers/i);
    expect(applyButton().disabled).toBe(true);
  });
});

describe("applied coupons", () => {
  it("lists what the server applied, with a way to remove it", async () => {
    mockCartState = baseCart({
      couponCodes: ["SPECIAL10"],
      coupons: [{ code: "SPECIAL10", discountLabel: "10% off", discountPaise: 1850 }],
      discountPaise: 1850,
    });
    render(<CartPage />);

    expect(await firstText(/applied \(10% off\)/)).toBeTruthy();
    fireEvent.click(screen.getAllByLabelText("Remove SPECIAL10")[0]);
    await waitFor(() => expect(mockCartState.removeCoupon).toHaveBeenCalledWith("SPECIAL10"));
  });

  it("offers no Remove for an automatic promotion the shop applied itself", async () => {
    mockCartState = baseCart({
      coupons: [{ code: "AUTOSAVE", discountLabel: "Bundle deal", discountPaise: 500, automatic: true }],
    });
    render(<CartPage />);
    await firstText(/Available offers/i);

    expect(await firstText("auto")).toBeTruthy();
    expect(screen.queryByLabelText("Remove AUTOSAVE")).toBeNull();
  });

  it("survives a provider that supplies no coupon fields at all", async () => {
    // Defaulted in the page: an older provider or a test double gives neither
    // list, and reading .map off undefined would take down the whole cart.
    mockCartState = {
      items: [{ sku: "F3-45G", name: "Betta Bites F3", qty: 1, pricePaise: 18500, pack: "45g", maxQty: 10 }],
      subtotalPaise: 18500, discountPaise: 0, totalPaise: 18500,
      amountToFreeShippingPaise: 0, freeShippingThresholdPaise: 0, totalItems: 1,
      removeFromCart: vi.fn(), setQty: vi.fn(), clearCart: vi.fn(),
    };

    expect(() => render(<CartPage />)).not.toThrow();
    await firstText(/Available offers/i);
    expect(screen.getByText("Order Summary")).toBeTruthy();
  });
});
