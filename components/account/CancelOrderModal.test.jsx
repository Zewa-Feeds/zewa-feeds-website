/**
 * The cancellation dialog.
 *
 * Worth testing because the failure modes are quiet ones: promising a refund
 * on a COD order that was never charged, letting a double-click fire two
 * cancellations, or submitting "Other" with nothing typed and recording an
 * empty reason.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import CancelOrderModal from "./CancelOrderModal";

const paidOrder = {
  orderNo: "27ZFO123",
  totalPaise: 50000,
  paymentStatus: "PAID",
  paymentLabel: "Paid",
  paymentMethod: "RAZORPAY",
};

const codOrder = { ...paidOrder, paymentStatus: "UNPAID", paymentLabel: "Unpaid", paymentMethod: "COD" };

const setup = (props = {}) =>
  render(
    <CancelOrderModal
      order={paidOrder}
      open
      busy={false}
      error={null}
      onClose={vi.fn()}
      onConfirm={vi.fn()}
      {...props}
    />,
  );

beforeEach(cleanup);

describe("CancelOrderModal", () => {
  it("renders nothing when closed", () => {
    const { container } = setup({ open: false });
    expect(container.innerHTML).toBe("");
  });

  it("shows the order number and total so the right order is confirmed", () => {
    setup();
    expect(screen.getByText(/27ZFO123/)).toBeTruthy();
    expect(screen.getByText(/₹500/)).toBeTruthy();
  });

  it("warns that the action cannot be undone", () => {
    setup();
    expect(screen.getByText(/cannot be undone/i)).toBeTruthy();
  });

  it("mentions a refund only for a captured payment", () => {
    setup({ order: paidOrder });
    expect(screen.getByText(/will process a refund/i)).toBeTruthy();
  });

  it("does NOT mention a refund on COD — nothing was charged", () => {
    setup({ order: codOrder });
    expect(screen.queryByText(/will process a refund/i)).toBeNull();
    expect(screen.getByText(/no refund to process/i)).toBeTruthy();
  });

  it("never claims the refund is already done", () => {
    setup({ order: paidOrder });
    expect(screen.queryByText(/refund has been (processed|completed)/i)).toBeNull();
    expect(screen.queryByText(/refund is being processed/i)).toBeNull();
  });

  it("does not start the 5–7 day clock at cancellation", () => {
    /*
     * Cancelling does not trigger the gateway refund — an admin does, later.
     * So the wait has to be anchored to "once processed", not to now, or the
     * customer starts counting from the wrong day and we look late.
     */
    setup({ order: paidOrder });
    expect(screen.getByText(/once\s+processed/i)).toBeTruthy();
    expect(screen.getByText(/original payment method/i)).toBeTruthy();
  });

  it("submits with no reason when none is chosen", () => {
    const onConfirm = vi.fn();
    setup({ onConfirm });
    fireEvent.click(screen.getByRole("button", { name: /^cancel order$/i }));
    expect(onConfirm).toHaveBeenCalledWith(null);
  });

  it("submits the selected reason", () => {
    const onConfirm = vi.fn();
    setup({ onConfirm });
    fireEvent.change(screen.getByLabelText(/reason/i), { target: { value: "Changed my mind" } });
    fireEvent.click(screen.getByRole("button", { name: /^cancel order$/i }));
    expect(onConfirm).toHaveBeenCalledWith("Changed my mind");
  });

  it("blocks submission when Other is chosen but nothing is typed", () => {
    const onConfirm = vi.fn();
    setup({ onConfirm });
    fireEvent.change(screen.getByLabelText(/reason/i), { target: { value: "Other" } });

    const confirm = screen.getByRole("button", { name: /^cancel order$/i });
    expect(confirm.disabled).toBe(true);
    fireEvent.click(confirm);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("submits the free text once Other is filled in", () => {
    const onConfirm = vi.fn();
    setup({ onConfirm });
    fireEvent.change(screen.getByLabelText(/reason/i), { target: { value: "Other" } });
    fireEvent.change(screen.getByLabelText(/your reason/i), { target: { value: "Duplicate order" } });
    fireEvent.click(screen.getByRole("button", { name: /^cancel order$/i }));
    expect(onConfirm).toHaveBeenCalledWith("Duplicate order");
  });

  it("prevents a second submission while one is in flight", () => {
    const onConfirm = vi.fn();
    setup({ onConfirm, busy: true });

    const confirm = screen.getByRole("button", { name: /cancelling/i });
    expect(confirm.disabled).toBe(true);
    fireEvent.click(confirm);
    fireEvent.click(confirm);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("shows a busy label while cancelling", () => {
    setup({ busy: true });
    expect(screen.getByRole("button", { name: /cancelling/i })).toBeTruthy();
  });

  it("surfaces a server error", () => {
    setup({ error: "This order has already shipped and can no longer be cancelled online." });
    expect(screen.getByText(/already shipped/i)).toBeTruthy();
  });

  it("keeps the order when the safe option is taken", () => {
    const onClose = vi.fn();
    setup({ onClose });
    fireEvent.click(screen.getByRole("button", { name: /keep order/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("cannot be dismissed mid-request", () => {
    const onClose = vi.fn();
    setup({ onClose, busy: true });
    expect(screen.getByRole("button", { name: /keep order/i }).disabled).toBe(true);
  });

  describe("success state", () => {
    it("confirms the cancellation instead of showing the form", () => {
      setup({ success: true });
      expect(screen.getByText(/order cancelled/i)).toBeTruthy();
      expect(screen.getByText(/27ZFO123 has been cancelled/i)).toBeTruthy();
      // The form is gone — there is nothing left to submit.
      expect(screen.queryByRole("button", { name: /^cancel order$/i })).toBeNull();
      expect(screen.queryByLabelText(/reason/i)).toBeNull();
    });

    it("tells a paid customer the refund is coming, without claiming it is done", () => {
      setup({ success: true, order: paidOrder });
      expect(screen.getByText(/our team will process your refund/i)).toBeTruthy();
      expect(screen.queryByText(/refund (has been|was) (processed|sent)/i)).toBeNull();
    });

    it("says nothing about a refund on COD", () => {
      setup({ success: true, order: codOrder });
      expect(screen.queryByText(/refund/i)).toBeNull();
    });

    it("announces itself to assistive technology", () => {
      setup({ success: true });
      const status = screen.getByRole("status");
      expect(status.getAttribute("aria-live")).toBe("polite");
    });

    it("cannot be dismissed during the confirmation beat", () => {
      const onClose = vi.fn();
      setup({ success: true, onClose });
      // No Keep-order button exists any more, and Escape is ignored.
      fireEvent.keyDown(window, { key: "Escape" });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it("is a labelled modal dialog", () => {
    setup();
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-labelledby")).toBe("cancel-order-title");
  });
});
