import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import CheckoutPage from "./page";

const validateMock = vi.fn();
const placeMock = vi.fn();
const confirmMock = vi.fn();
const addressesMock = vi.fn();

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual("@/lib/api");
  return {
    ...actual,
    cart: {
      validate: (...args) => validateMock(...args),
    },
    checkout: {
      place: (...args) => placeMock(...args),
      confirm: (...args) => confirmMock(...args),
      status: vi.fn(),
    },
    account: {
      addresses: () => addressesMock(),
    },
    settings: {
      public: () => Promise.resolve({
        shipping: {
          keralaRatePerKgPaise: 4500,
          outsideKeralaRatePerKgPaise: 7000,
          packagingWeightGrams: 100,
          slabWeightGrams: 500,
          freeThresholdPaise: 99900,
        },
        paymentMethods: { cod: false, razorpay: true },
      }),
    },
    formatInr: (paise) => `₹${Math.round(paise / 100)}`,
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

let mockAuthState = {
  customer: null,
  isAuthenticated: false,
  isLoading: false,
};

vi.mock("@/lib/authContext", () => ({
  useAuth: () => mockAuthState,
  signInHref: (next) => `/signin?next=${next}`,
}));

const mockCartState = {
  items: [
    {
      sku: "F3-45G",
      name: "Betta Bites F3",
      qty: 3,
      pricePaise: 10000,
      image: "/product.png",
    },
  ],
  subtotalPaise: 30000,
  discountPaise: 0,
  shippingPaise: 0,
  totalPaise: 30000,
  amountToFreeShippingPaise: 69900,
  coupon: null,
  issues: [],
  fulfillable: true,
  validating: false,
  validate: (...args) => validateMock(...args),
  applyCoupon: vi.fn(),
  clearCart: vi.fn(),
  setQty: vi.fn(),
  removeFromCart: vi.fn(),
  quote: null,
};

vi.mock("@/lib/cartContext", async () => {
  const actual = await vi.importActual("@/lib/cartContext");
  return {
    ...actual,
    useCart: () => mockCartState,
    lineMax: () => 10,
  };
});

describe("Address-Aware Shipping Checkout Flow", () => {
  beforeEach(() => {
    sessionStorage.clear();
    validateMock.mockReset();
    addressesMock.mockReset();
    mockCartState.quote = null;
    mockCartState.shippingPaise = 0;
    mockCartState.totalPaise = 30000;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("Case 1: Logged-in customer with saved Kerala address triggers validate with Kerala on load", async () => {
    mockAuthState = {
      customer: { id: "cust-1", firstName: "Rahul", lastName: "Nair", email: "rahul@example.com" },
      isAuthenticated: true,
      isLoading: false,
    };

    addressesMock.mockResolvedValue([
      {
        id: "addr-kerala",
        name: "Rahul Nair",
        phone: "9876543210",
        line1: "12 Marine Drive",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
        isDefault: true,
      },
    ]);

    validateMock.mockResolvedValue({
      lines: [],
      subtotalPaise: 30000,
      shippingPaise: 2250, // ₹22.50
      totalPaise: 32250,
      deliveryDays: 2,
      deliveryText: "Estimated delivery: 2 days*",
      deliveryNote: "*Rural areas may take 1 additional day.",
      chargeableWeightKg: 0.5,
    });

    render(<CheckoutPage />);

    await waitFor(() => {
      expect(validateMock).toHaveBeenCalledWith(
        expect.objectContaining({ state: "Kerala" }),
      );
    });
  });

  it("Case 2: Logged-in customer with saved Maharashtra address triggers validate with Maharashtra on load", async () => {
    mockAuthState = {
      customer: { id: "cust-2", firstName: "Pooja", lastName: "Sharma", email: "pooja@example.com" },
      isAuthenticated: true,
      isLoading: false,
    };

    addressesMock.mockResolvedValue([
      {
        id: "addr-mh",
        name: "Pooja Sharma",
        phone: "9876543211",
        line1: "45 Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
        isDefault: true,
      },
    ]);

    validateMock.mockResolvedValue({
      lines: [],
      subtotalPaise: 30000,
      shippingPaise: 3500, // ₹35.00
      totalPaise: 33500,
      deliveryDays: 4,
      deliveryText: "Estimated delivery: 4 days*",
      deliveryNote: "*Rural areas may take 1 additional day.",
      chargeableWeightKg: 0.5,
    });

    render(<CheckoutPage />);

    await waitFor(() => {
      expect(validateMock).toHaveBeenCalledWith(
        expect.objectContaining({ state: "Maharashtra" }),
      );
    });
  });

  it("Case 3 & 4: Switching saved address from Kerala to Maharashtra and back recalculates", async () => {
    mockAuthState = {
      customer: { id: "cust-1", firstName: "Rahul", lastName: "Nair", email: "rahul@example.com" },
      isAuthenticated: true,
      isLoading: false,
    };

    addressesMock.mockResolvedValue([
      {
        id: "addr-1",
        name: "Rahul Kochi",
        phone: "9876543210",
        line1: "12 Marine Drive",
        city: "Kochi",
        state: "Kerala",
        pincode: "682001",
        isDefault: true,
      },
      {
        id: "addr-2",
        name: "Rahul Pune",
        phone: "9876543210",
        line1: "100 FC Road",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411004",
        isDefault: false,
      },
    ]);

    render(<CheckoutPage />);

    await waitFor(() => {
      expect(validateMock).toHaveBeenCalledWith(
        expect.objectContaining({ state: "Kerala" }),
      );
    });

    // Switch to Pune (Maharashtra)
    const puneOption = screen.getByText("Rahul Pune");
    fireEvent.click(puneOption);

    await waitFor(() => {
      expect(validateMock).toHaveBeenCalledWith(
        expect.objectContaining({ state: "Maharashtra" }),
      );
    });

    // Switch back to Kochi (Kerala)
    const kochiOption = screen.getByText("Rahul Kochi");
    fireEvent.click(kochiOption);

    await waitFor(() => {
      expect(validateMock).toHaveBeenCalledWith(
        expect.objectContaining({ state: "Kerala" }),
      );
    });
  });

  it("Case 5, 6, 7: New address without state does not quote; selecting state triggers calculation", async () => {
    mockAuthState = {
      customer: null,
      isAuthenticated: false,
      isLoading: false,
    };

    render(<CheckoutPage />);

    // Initially guest / new address: no state
    expect(screen.getByText(/Enter your state to calculate shipping/i)).toBeTruthy();

    // Select State: Kerala
    const stateSelect = screen.getByRole("combobox", { name: /state/i });
    fireEvent.change(stateSelect, { target: { value: "Kerala" } });

    await waitFor(() => {
      expect(validateMock).toHaveBeenCalledWith(
        expect.objectContaining({ state: "Kerala" }),
      );
    });

    // Change State: Maharashtra
    fireEvent.change(stateSelect, { target: { value: "Maharashtra" } });

    await waitFor(() => {
      expect(validateMock).toHaveBeenCalledWith(
        expect.objectContaining({ state: "Maharashtra" }),
      );
    });
  });
});
