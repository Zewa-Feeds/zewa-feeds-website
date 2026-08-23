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

  it("transitions immediately to full-screen payment loading state and locks viewport when Pay Online is clicked", async () => {
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

    // 1. Full-screen payment processing overlay is immediately active
    expect(screen.getByRole("heading", { name: /Processing Your Payment/i })).toBeDefined();
    expect(screen.getByText(/Initializing secure checkout…/i)).toBeDefined();
    expect(screen.getByText(/Please do not close or refresh this window/i)).toBeDefined();

    // 2. The standard checkout form is completely unmounted / unavailable
    expect(screen.queryByRole("heading", { name: /Complete Your Order/i })).toBeNull();

    // 3. Viewport reset and body scroll locked
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
    expect(document.body.style.overflow).toBe("hidden");

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

  it("restores the checkout form cleanly if payment initialization fails", async () => {
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

    // Full-screen loading overlay is dismissed, form is restored with error banner
    expect(screen.queryByRole("heading", { name: /Processing Your Payment/i })).toBeNull();
    expect(screen.getByRole("heading", { name: /Complete Your Order/i })).toBeDefined();
    expect(screen.getByText("Unable to connect to payment server.")).toBeDefined();
    expect(document.body.style.overflow).toBe("");
  });

  it("transitions directly to success screen when payment succeeds and signature verifies", async () => {
    placeMock.mockResolvedValue({
      orderNo: "27ZFO001",
      payment: {
        required: true,
        publicKey: "rzp_test_key",
        amountPaise: 29900,
        gatewayOrderId: "order_rzp_123",
      },
    });
    confirmMock.mockResolvedValue({ orderNo: "27ZFO001", paymentStatus: "PAID" });

    let rzpHandler;
    window.Razorpay = vi.fn().mockImplementation((opts) => {
      rzpHandler = opts.handler;
      return {
        open: vi.fn().mockImplementation(() => {
          // simulate user paying immediately in modal
          setTimeout(() => {
            rzpHandler({
              razorpay_payment_id: "pay_123",
              razorpay_signature: "sig_123",
            });
          }, 10);
        }),
        on: vi.fn(),
      };
    });

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

    await waitFor(() => {
      expect(screen.getByText(/Thank you for your order!/i)).toBeDefined();
      expect(screen.getByText("27ZFO001")).toBeDefined();
      expect(mockCart.clearCart).toHaveBeenCalled();
    });
  });

  it("transitions directly to failure screen when bank declines payment", async () => {
    placeMock.mockResolvedValue({
      orderNo: "27ZFO002",
      payment: {
        required: true,
        publicKey: "rzp_test_key",
        amountPaise: 29900,
        gatewayOrderId: "order_rzp_456",
      },
    });

    window.Razorpay = vi.fn().mockImplementation((opts) => {
      let failCb;
      return {
        open: vi.fn().mockImplementation(() => {
          setTimeout(() => {
            if (failCb) {
              failCb({ error: { description: "Insufficient balance in account." } });
            }
          }, 0);
        }),
        on: vi.fn().mockImplementation((event, cb) => {
          if (event === "payment.failed") failCb = cb;
        }),
        close: vi.fn(),
      };
    });

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

    await waitFor(() => {
      expect(screen.getByText(/Your payment didn't go through/i)).toBeDefined();
      expect(screen.getByText("Insufficient balance in account.")).toBeDefined();
      expect(screen.getByText("27ZFO002")).toBeDefined();
    });
  });

  it("restores active form cleanly when user dismisses modal without paying", async () => {
    placeMock.mockResolvedValue({
      orderNo: "27ZFO003",
      payment: {
        required: true,
        publicKey: "rzp_test_key",
        amountPaise: 29900,
        gatewayOrderId: "order_rzp_789",
      },
    });
    statusMock.mockResolvedValue({ paymentStatus: "UNPAID", status: "PENDING" });

    window.Razorpay = vi.fn().mockImplementation((opts) => {
      return {
        open: vi.fn().mockImplementation(() => {
          setTimeout(() => {
            opts.modal.ondismiss();
          }, 0);
        }),
        on: vi.fn(),
      };
    });

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

    await waitFor(() => {
      expect(screen.queryByText(/Processing your payment/i)).toBeNull();
      expect(screen.getByRole("heading", { name: /Complete Your Order/i })).toBeDefined();
      expect(payButton.getAttribute("disabled")).toBeNull();
    });
  });

  it("handles delayed UPI confirmation by transitioning to pending confirmation state", async () => {
    vi.useFakeTimers();
    placeMock.mockResolvedValue({
      orderNo: "27ZFO004",
      payment: {
        required: true,
        publicKey: "rzp_test_key",
        amountPaise: 29900,
        gatewayOrderId: "order_rzp_upi",
      },
    });
    statusMock.mockResolvedValue({ paymentStatus: "UNPAID", status: "PENDING" });

    window.Razorpay = vi.fn().mockImplementation((opts) => {
      return {
        open: vi.fn().mockImplementation(() => {
          opts.handler({
            razorpay_payment_id: "pay_upi_123",
            razorpay_signature: "sig_upi_123",
          });
        }),
        on: vi.fn(),
      };
    });
    confirmMock.mockRejectedValue(new Error("Network timeout during confirm."));

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

    for (let i = 0; i < 16; i++) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2500);
      });
    }

    expect(screen.getByText(/Payment Confirmation Pending/i)).toBeDefined();
    expect(screen.getByText("27ZFO004")).toBeDefined();
    vi.useRealTimers();
  });
});
