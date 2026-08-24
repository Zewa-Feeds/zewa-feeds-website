import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import CartPage from "./page";

let mockCartState = {
  items: [
    {
      sku: "F3-45G",
      name: "Betta Bites F3",
      qty: 1,
      pricePaise: 29900,
      image: "/product.png",
      pack: "45g Bottle",
      maxQty: 10,
    },
  ],
  subtotalPaise: 29900,
  discountPaise: 0,
  shippingPaise: 0,
  totalPaise: 29900,
  amountToFreeShippingPaise: 20000,
  freeShippingThresholdPaise: 49900, // ₹499
  totalItems: 1,
  removeFromCart: vi.fn(),
  setQty: vi.fn(),
  clearCart: vi.fn(),
};

vi.mock("@/lib/cartContext", async () => {
  const actual = await vi.importActual("@/lib/cartContext");
  return {
    ...actual,
    useCart: () => mockCartState,
  };
});

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual("@/lib/api");
  return {
    ...actual,
    formatInr: (paise) => `₹${Math.round(paise / 100)}`,
  };
});

vi.mock("@/components/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/components/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }) => (
    <img src={typeof src === "string" ? src : ""} alt={alt} {...rest} />
  ),
}));

describe("CartPage Dynamic Free Shipping Badge", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders dynamic threshold amount when freeShippingThresholdPaise is configured", () => {
    mockCartState.freeShippingThresholdPaise = 49900; // ₹499
    render(<CartPage />);

    expect(screen.getByText("Free shipping above ₹499")).toBeTruthy();
  });

  it("renders 'Free shipping on all orders' when threshold is 0", () => {
    mockCartState.freeShippingThresholdPaise = 0;
    render(<CartPage />);

    expect(screen.getByText("Free shipping on all orders")).toBeTruthy();
  });

  it("does not render a free shipping badge when threshold is null/unavailable", () => {
    mockCartState.freeShippingThresholdPaise = null;
    render(<CartPage />);

    expect(screen.queryByText(/Free shipping above/i)).toBeNull();
  });
});
