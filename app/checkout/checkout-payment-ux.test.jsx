import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

const placeMock = vi.fn();
const confirmMock = vi.fn();
const statusMock = vi.fn();
const publicSettingsMock = vi.fn(() =>
  Promise.resolve({ paymentMethods: { cod: false, razorpay: true } }),
);

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual("@/lib/api");
  return {
    ...actual,
    checkout: {
      place: (...args) => placeMock(...args),
      confirm: (...args) => confirmMock(...args),
      status: (...args) => statusMock(...args),
    },
    settings: {
      public: () => publicSettingsMock(),
    },
    formatInr: (paise) => `₹${(paise / 100).toFixed(2)}`,
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/checkout",
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }) => (
    <img src={typeof src === "string" ? src : ""} alt={alt} {...rest} />
  ),
}));

vi.mock("@/components/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/components/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("@/lib/authContext", () => ({
  useAuth: () => ({
    customer: null,
    isAuthenticated: false,
    isLoading: false,
  }),
  signInHref: (next) => `/signin?next=${next}`,
}));

const mockCart = {
  items: [
    {
      sku: "F3-45G",
      name: "Betta Bites F3",
      qty: 1,
      pricePaise: 29900,
      image: "/product.png",
      accentBg: "#111",
      maxQty: 10,
    },
  ],
  subtotalPaise: 29900,
  discountPaise: 0,
  shippingPaise: 0,
  totalPaise: 29900,
  amountToFreeShippingPaise: 0,
  coupon: null,
  issues: [],
  fulfillable: true,
  validating: false,
  validate: vi.fn(() => Promise.resolve({ issues: [] })),
  applyCoupon: vi.fn(),
  clearCart: vi.fn(),
  setQty: vi.fn(),
  removeFromCart: vi.fn(),
};

vi.mock("@/lib/cartContext", async () => {
  const actual = await vi.importActual("@/lib/cartContext");
  return {
    ...actual,
    useCart: () => mockCart,
    lineMax: (item) => item.maxQty || 10,
  };
});

const { default: CheckoutPage } = await import("./page");

function fillValidForm(container) {
  fireEvent.change(container.querySelector('#firstName'), { target: { value: "Aarav" } });
  fireEvent.change(container.querySelector('#lastName'), { target: { value: "Sharma" } });
  fireEvent.change(container.querySelector('#email'), { target: { value: "aarav@example.com" } });
  fireEvent.change(container.querySelector('#phone'), { target: { value: "9876543210" } });
  fireEvent.change(container.querySelector('#address'), { target: { value: "Flat 402, Lotus Tower" } });
  fireEvent.change(container.querySelector('#pincode'), { target: { value: "680014" } });
  fireEvent.change(container.querySelector('#city'), { target: { value: "Thrissur" } });
  fireEvent.change(container.querySelector('#state'), { target: { value: "Kerala" } });
}

beforeEach(() => {
  placeMock.mockReset();
  confirmMock.mockReset();
  statusMock.mockReset();
  mockCart.validate.mockClear();
  mockCart.clearCart.mockClear();
  window.scrollTo = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.sessionStorage.clear();
  delete window.Razorpay;
});

afterEach(cleanup);

describe("Checkout Payment UX & Loading State", () => {
  it("preloads the Razorpay Checkout script on mount", async () => {
    await act(async () => {
      render(<CheckoutPage />);
    });
    const script = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    expect(script).not.toBeNull();
  });

  it("shows immediate loading banner, disables submit button, and smooth scrolls to top when Pay Online is clicked", async () => {
    let resolvePlace;
    placeMock.mockReturnValue(
      new Promise((res) => {
        resolvePlace = res;
      }),
    );

    let container;
    await act(async () => {
      const rendered = render(<CheckoutPage />);
      container = rendered.container;
    });

    fillValidForm(container);

    const payButton = screen.getAllByRole("button", { name: /Pay Online/i })[0];
    await act(async () => {
      fireEvent.click(payButton);
    });

    // 1. Immediate loading banner at the top
    const loadingBanner = container.querySelector("#checkout-payment-loading");
    expect(loadingBanner).not.toBeNull();
    expect(loadingBanner.textContent).toContain("Preparing secure payment");

    // 2. Button is disabled and in busy state
    expect(payButton.getAttribute("disabled")).not.toBeNull();
    expect(payButton.getAttribute("aria-busy")).toBe("true");

    // 3. Smooth scrolled to top
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "smooth" });

    // 4. Duplicate click is prevented
    fireEvent.click(payButton);
    expect(placeMock).toHaveBeenCalledTimes(1);

    // Mock Razorpay instance
    let rzpHandler;
    window.Razorpay = vi.fn().mockImplementation((opts) => {
      rzpHandler = opts.handler;
      return {
        open: vi.fn(),
        on: vi.fn(),
      };
    });

    await act(async () => {
      resolvePlace({
        orderNo: "ORD-2026-0001",
        payment: {
          required: true,
          publicKey: "rzp_test_123",
          amountPaise: 29900,
          gatewayOrderId: "order_rzp_123",
        },
      });
    });

    expect(window.Razorpay).toHaveBeenCalledTimes(1);
  });

  it("clears loading state and displays error if checkoutApi.place fails", async () => {
    placeMock.mockRejectedValue(new Error("Unable to connect to payment server."));

    let container;
    await act(async () => {
      const rendered = render(<CheckoutPage />);
      container = rendered.container;
    });

    fillValidForm(container);

    const payButton = screen.getAllByRole("button", { name: /Pay Online/i })[0];
    await act(async () => {
      fireEvent.click(payButton);
    });

    // Loading banner is cleared
    const loadingBanner = container.querySelector("#checkout-payment-loading");
    expect(loadingBanner).toBeNull();

    // Error banner is shown
    expect(screen.getByText("Unable to connect to payment server.")).toBeDefined();

    // Button is re-enabled
    expect(payButton.getAttribute("disabled")).toBeNull();
  });
});
