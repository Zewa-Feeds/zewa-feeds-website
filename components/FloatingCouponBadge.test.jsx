import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

let mockPathname = "/products";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

const cart = {
  items: [],
  couponCodes: [],
  applyCoupon: vi.fn(() => Promise.resolve({ ok: true })),
  setDrawerOpen: vi.fn(),
};

vi.mock("@/lib/cartContext", () => ({
  useCart: () => cart,
}));

const { default: FloatingCouponBadge, COUPON_STORAGE_KEY, PROMO_CODE } = await import(
  "./FloatingCouponBadge"
);

beforeEach(() => {
  mockPathname = "/products";
  sessionStorage.clear();
  cart.items = [];
  cart.couponCodes = [];
  cart.applyCoupon.mockClear();
  cart.setDrawerOpen.mockClear();
});

afterEach(cleanup);

describe("FloatingCouponBadge", () => {
  it("renders the floating coupon badge with 'Unlock 10% Off'", () => {
    render(<FloatingCouponBadge />);
    expect(screen.getByLabelText("Unlock 10% Off Coupon")).toBeDefined();
    expect(screen.getByText("Unlock")).toBeDefined();
    expect(screen.getByText("10% Off")).toBeDefined();
  });

  it("does not render when pathname is /checkout", () => {
    mockPathname = "/checkout";
    render(<FloatingCouponBadge />);
    expect(screen.queryByLabelText("Unlock 10% Off Coupon")).toBeNull();
  });

  it("dismisses the badge when close button is clicked and saves in sessionStorage", () => {
    render(<FloatingCouponBadge />);
    const dismissBtn = screen.getByLabelText("Dismiss discount badge");
    fireEvent.click(dismissBtn);

    expect(screen.queryByLabelText("Unlock 10% Off Coupon")).toBeNull();
    expect(sessionStorage.getItem(COUPON_STORAGE_KEY)).toBe("true");
  });

  it("does not render if previously dismissed in sessionStorage", () => {
    sessionStorage.setItem(COUPON_STORAGE_KEY, "true");
    render(<FloatingCouponBadge />);
    expect(screen.queryByLabelText("Unlock 10% Off Coupon")).toBeNull();
  });

  it("opens the offer modal when badge is clicked", () => {
    render(<FloatingCouponBadge />);
    const trigger = screen.getByLabelText("Unlock 10% Off Coupon");
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("Unlock Flat 10% Off")).toBeDefined();
    expect(screen.getByText(PROMO_CODE)).toBeDefined();
  });

  it("closes the modal when close icon is clicked", () => {
    render(<FloatingCouponBadge />);
    fireEvent.click(screen.getByLabelText("Unlock 10% Off Coupon"));
    expect(screen.getByRole("dialog")).toBeDefined();

    const closeBtn = screen.getByLabelText("Close offer modal");
    fireEvent.click(closeBtn);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes the modal when Escape key is pressed", () => {
    render(<FloatingCouponBadge />);
    fireEvent.click(screen.getByLabelText("Unlock 10% Off Coupon"));
    expect(screen.getByRole("dialog")).toBeDefined();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("copies promo code when Copy button is clicked", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });

    render(<FloatingCouponBadge />);
    fireEvent.click(screen.getByLabelText("Unlock 10% Off Coupon"));

    const copyBtn = screen.getByText("Copy");
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(screen.getByText("Copied!")).toBeDefined();
  });

  it("applies coupon to cart and opens cart drawer", async () => {
    vi.useFakeTimers();
    render(<FloatingCouponBadge />);
    fireEvent.click(screen.getByLabelText("Unlock 10% Off Coupon"));

    const applyBtn = screen.getByText("Apply to Cart");
    await act(async () => {
      fireEvent.click(applyBtn);
    });

    expect(cart.applyCoupon).toHaveBeenCalledWith(PROMO_CODE);
    expect(screen.getByText("Coupon applied to your cart!")).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(cart.setDrawerOpen).toHaveBeenCalledWith(true);
    vi.useRealTimers();
  });
});
