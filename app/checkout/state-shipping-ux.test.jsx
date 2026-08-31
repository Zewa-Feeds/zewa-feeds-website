import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";

describe("Weight-based Shipping & State Delivery Checkout UX", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const baseProps = {
    items: [
      {
        sku: "TEST-SKU",
        name: "Test Feed",
        qty: 3,
        pricePaise: 10000, // ₹100 each = ₹300 subtotal
        image: "/test.jpg",
      },
    ],
    subtotalPaise: 30000,
    discountPaise: 0,
    shippingPaise: 7000, // ₹70 for Outside Kerala 0.5kg slab
    totalPaise: 37000, // ₹370
    amountToFreeShippingPaise: 69900,
    coupon: null,
    couponInput: "",
    onCouponInputChange: vi.fn(),
    couponError: null,
    onSubmitCoupon: vi.fn(),
    paymentMethod: "RAZORPAY",
    config: {
      tax: { gstRatePct: 0, gstInclusive: true },
    },
    validating: false,
    stateSelected: true,
    deliveryText: "Estimated delivery: 4 days*",
    deliveryNote: "*Rural areas may take 1 additional day.",
    chargeableWeightKg: 0.5,
    setQty: vi.fn(),
    removeFromCart: vi.fn(),
  };

  it("renders 'Select state' and calculation prompt when state is not selected yet", () => {
    render(<OrderSummaryCard {...baseProps} stateSelected={false} shippingPaise={0} />);

    expect(screen.getByText("Shipping")).toBeTruthy();
    expect(screen.getByText("Select state")).toBeTruthy();
    expect(screen.getByText(/Enter your state to calculate shipping & delivery/i)).toBeTruthy();
  });

  it("renders the authoritative shipping price and delivery days estimate for the selected state", () => {
    render(<OrderSummaryCard {...baseProps} />);

    expect(screen.getByText("Shipping")).toBeTruthy();
    expect(screen.getByText("₹70")).toBeTruthy();
    expect(screen.getByText("₹370")).toBeTruthy();
    expect(screen.getByText("Estimated delivery: 4 days*")).toBeTruthy();
    expect(screen.getByText("*Rural areas may take 1 additional day.")).toBeTruthy();
  });

  it("shows an inline 'Updating…' indicator when shipping calculation is in flight", () => {
    render(<OrderSummaryCard {...baseProps} validating={true} />);

    expect(screen.getByText(/Updating…/)).toBeTruthy();
    // Existing values still remain visible to prevent layout shift
    expect(screen.getByText("₹70")).toBeTruthy();
    expect(screen.getByText("₹370")).toBeTruthy();
  });

  it("renders 'FREE' shipping when shippingPaise is 0", () => {
    render(
      <OrderSummaryCard
        {...baseProps}
        subtotalPaise={120000}
        shippingPaise={0}
        totalPaise={120000}
      />,
    );

    expect(screen.getByText("FREE")).toBeTruthy();
    expect(screen.getAllByText("₹1,200").length).toBeGreaterThanOrEqual(1);
  });
});
