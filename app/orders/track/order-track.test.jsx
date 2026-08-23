import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

const trackMock = vi.fn();

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual("@/lib/api");
  return {
    ...actual,
    orders: {
      track: (...args) => trackMock(...args),
    },
    formatInr: (paise) => `₹${(paise / 100).toFixed(2)}`,
  };
});

vi.mock("@/components/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/components/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

const { default: TrackOrderPage } = await import("./page");

beforeEach(() => {
  trackMock.mockReset();
});

afterEach(cleanup);

describe("Guest Order Tracking Page", () => {
  it("renders active order with forward timeline and payment details", async () => {
    trackMock.mockResolvedValue({
      orderNo: "27ZFO101",
      status: "PROCESSING",
      statusLabel: "Processing",
      paymentStatus: "PAID",
      paymentLabel: "Paid",
      paymentMethod: "RAZORPAY",
      placedAt: "2026-08-20T10:00:00Z",
      timeline: [
        { label: "Placed", state: "done", at: "2026-08-20T10:00:00Z" },
        { label: "Processing", state: "current", at: "2026-08-20T11:00:00Z" },
        { label: "Shipped", state: "todo", at: null },
        { label: "Delivered", state: "todo", at: null },
      ],
      totalPaise: 49900,
      addressLine: "Flat 101, Marine Drive, Kochi, Kerala",
      items: [{ productName: "Betta Bites F3", pack: "45g Bottle", qty: 1, lineTotal: 499 }],
    });

    let container;
    await act(async () => {
      const rendered = render(<TrackOrderPage />);
      container = rendered.container;
    });

    fireEvent.change(container.querySelector('input[placeholder="27ZFO001"]'), {
      target: { value: "27ZFO101" },
    });
    fireEvent.change(container.querySelector('input[type="email"]'), {
      target: { value: "customer@example.com" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Track/i }));
    });

    expect(screen.getByText("27ZFO101")).toBeDefined();
    expect(screen.getAllByText("Processing").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Online Payment (Razorpay)")).toBeDefined();
    expect(screen.queryByText(/Order Cancelled/i)).toBeNull();
  });

  it("renders cancelled COD order with 'No refund required' message", async () => {
    trackMock.mockResolvedValue({
      orderNo: "27ZFO102",
      status: "CANCELLED",
      statusLabel: "Cancelled",
      paymentStatus: "UNPAID",
      paymentLabel: "Unpaid",
      paymentMethod: "COD",
      placedAt: "2026-08-20T10:00:00Z",
      cancelledAt: "2026-08-20T12:00:00Z",
      cancelReason: "Ordered by mistake",
      timeline: [
        { label: "Placed", state: "done", at: "2026-08-20T10:00:00Z" },
        { label: "Cancelled", state: "cancelled", at: "2026-08-20T12:00:00Z" },
      ],
      totalPaise: 35000,
      addressLine: "Flat 202, MG Road, Ernakulam, Kerala",
      items: [{ productName: "Guppy Bites G2", pack: "45g Bottle", qty: 2, lineTotal: 350 }],
    });

    let container;
    await act(async () => {
      const rendered = render(<TrackOrderPage />);
      container = rendered.container;
    });

    fireEvent.change(container.querySelector('input[placeholder="27ZFO001"]'), {
      target: { value: "27ZFO102" },
    });
    fireEvent.change(container.querySelector('input[type="email"]'), {
      target: { value: "customer@example.com" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Track/i }));
    });

    expect(screen.getByText("27ZFO102")).toBeDefined();
    expect(screen.getAllByText("Order Cancelled").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Ordered by mistake/i)).toBeDefined();
    expect(screen.getByText(/No payment was collected, so there is no refund to process/i)).toBeDefined();
  });

  it("renders cancelled paid order with 'Refund Pending' message when refund is not yet processed", async () => {
    trackMock.mockResolvedValue({
      orderNo: "27ZFO103",
      status: "CANCELLED",
      statusLabel: "Cancelled",
      paymentStatus: "PAID",
      paymentLabel: "Paid",
      paymentMethod: "RAZORPAY",
      placedAt: "2026-08-20T10:00:00Z",
      cancelledAt: "2026-08-20T12:00:00Z",
      cancelReason: "Delivery delay",
      timeline: [
        { label: "Placed", state: "done", at: "2026-08-20T10:00:00Z" },
        { label: "Cancelled", state: "cancelled", at: "2026-08-20T12:00:00Z" },
      ],
      totalPaise: 49900,
      addressLine: "Flat 303, Aluva, Kerala",
      items: [{ productName: "Betta Bites F3", pack: "45g Bottle", qty: 1, lineTotal: 499 }],
    });

    let container;
    await act(async () => {
      const rendered = render(<TrackOrderPage />);
      container = rendered.container;
    });

    fireEvent.change(container.querySelector('input[placeholder="27ZFO001"]'), {
      target: { value: "27ZFO103" },
    });
    fireEvent.change(container.querySelector('input[type="email"]'), {
      target: { value: "customer@example.com" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Track/i }));
    });

    expect(screen.getByText("27ZFO103")).toBeDefined();
    expect(screen.getAllByText("Order Cancelled").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Refund Pending/i)).toBeDefined();
    expect(screen.getByText(/Your refund will be processed by our team/i)).toBeDefined();
  });

  it("renders cancelled paid order with 'Refund Completed' message when refund has been processed", async () => {
    trackMock.mockResolvedValue({
      orderNo: "27ZFO104",
      status: "CANCELLED",
      statusLabel: "Cancelled",
      paymentStatus: "REFUNDED",
      paymentLabel: "Refunded",
      paymentMethod: "RAZORPAY",
      placedAt: "2026-08-20T10:00:00Z",
      cancelledAt: "2026-08-20T12:00:00Z",
      cancelReason: "Customer requested cancellation",
      timeline: [
        { label: "Placed", state: "done", at: "2026-08-20T10:00:00Z" },
        { label: "Cancelled", state: "cancelled", at: "2026-08-20T12:00:00Z" },
      ],
      totalPaise: 49900,
      addressLine: "Flat 303, Aluva, Kerala",
      items: [{ productName: "Betta Bites F3", pack: "45g Bottle", qty: 1, lineTotal: 499 }],
    });

    let container;
    await act(async () => {
      const rendered = render(<TrackOrderPage />);
      container = rendered.container;
    });

    fireEvent.change(container.querySelector('input[placeholder="27ZFO001"]'), {
      target: { value: "27ZFO104" },
    });
    fireEvent.change(container.querySelector('input[type="email"]'), {
      target: { value: "customer@example.com" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Track/i }));
    });

    expect(screen.getByText("27ZFO104")).toBeDefined();
    expect(screen.getAllByText("Order Cancelled").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Refund Completed/i)).toBeDefined();
    expect(screen.getByText(/refunded to your original payment method/i)).toBeDefined();
  });
});
