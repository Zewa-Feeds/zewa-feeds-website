/**
 * The checkout coins box — ZSOP004 §10.1, §10.2.
 *
 * Tested because every rule here is a specified behaviour that a redesign could
 * silently undo: defaulting the field to empty, hiding the box entirely rather
 * than showing a negative balance, and correcting an over-entry inline with the
 * reason instead of failing at payment.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import CoinsPanel from "./CoinsPanel";

afterEach(cleanup);

const QUOTE = {
  visible: true,
  available: 340,
  maxRedeemable: 260,
  minRedemption: 10,
  coinValuePaise: 100,
};

describe("§10.1 The box is hidden where the specification says hide it", () => {
  it("renders nothing when the server returns no quote", () => {
    // Negative balance, kill switch off, or a loyalty error — all of
    // which the server reports as a null quote so there is no client branch to
    // get wrong.
    const { container } = render(<CoinsPanel quote={null} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when the quote is explicitly not visible", () => {
    const { container } = render(<CoinsPanel quote={{ ...QUOTE, visible: false }} />);
    expect(container.innerHTML).toBe("");
  });
});

describe("§10.1 Free entry, defaulting to empty", () => {
  it("does not pre-fill the maximum", () => {
    // "Default the field to empty, not to the maximum. Auto-applying burns a
    // balance the customer may have been saving."
    render(<CoinsPanel quote={QUOTE} />);
    expect(screen.getByLabelText(/Zewa Coins to use/i).value).toBe("");
  });

  it("offers the order maximum as a one-tap shortcut", () => {
    render(<CoinsPanel quote={QUOTE} />);
    fireEvent.click(screen.getByRole("button", { name: /Use maximum 260 Coins/i }));
    expect(screen.getByLabelText(/Zewa Coins to use/i).value).toBe("260");
  });

  it("shows the live rupee conversion as the customer types", () => {
    render(<CoinsPanel quote={QUOTE} />);
    fireEvent.change(screen.getByLabelText(/Zewa Coins to use/i), {
      target: { value: "150" },
    });
    expect(screen.getByText(/Using 150 Coins = ₹150 off/i)).toBeDefined();
  });

  it("says unused coins stay in the account, so partial use feels normal", () => {
    render(<CoinsPanel quote={QUOTE} />);
    expect(screen.getByText(/Coins you don't use stay in your account/i)).toBeDefined();
  });

  it("accepts only digits", () => {
    render(<CoinsPanel quote={QUOTE} />);
    const input = screen.getByLabelText(/Zewa Coins to use/i);
    fireEvent.change(input, { target: { value: "1a2b3" } });
    expect(input.value).toBe("123");
  });
});

describe("§10.1 Validate on entry, with the reason", () => {
  it("rejects more coins than the customer holds", () => {
    const onApply = vi.fn();
    render(<CoinsPanel quote={QUOTE} onApply={onApply} />);
    fireEvent.change(screen.getByLabelText(/Zewa Coins to use/i), {
      target: { value: "9999" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Apply$/i }));

    expect(screen.getByRole("alert").textContent).toContain("You have 340 Zewa Coins.");
    expect(onApply).not.toHaveBeenCalled();
  });

  it("explains the cart ceiling rather than just refusing (§10.2)", () => {
    const onApply = vi.fn();
    render(<CoinsPanel quote={QUOTE} onApply={onApply} />);
    fireEvent.change(screen.getByLabelText(/Zewa Coins to use/i), {
      target: { value: "300" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Apply$/i }));

    expect(screen.getByRole("alert").textContent).toMatch(/You can use up to 260 coins on this order.*full product value.*Shipping is payable separately/i);
    expect(onApply).not.toHaveBeenCalled();
  });

  it("enforces the 10-coin minimum", () => {
    const onApply = vi.fn();
    render(<CoinsPanel quote={QUOTE} onApply={onApply} />);
    fireEvent.change(screen.getByLabelText(/Zewa Coins to use/i), { target: { value: "5" } });
    fireEvent.click(screen.getByRole("button", { name: /^Apply$/i }));

    expect(screen.getByRole("alert").textContent).toContain("Use at least 10 coins.");
    expect(onApply).not.toHaveBeenCalled();
  });

  it("applies a valid amount", () => {
    const onApply = vi.fn();
    render(<CoinsPanel quote={QUOTE} onApply={onApply} />);
    fireEvent.change(screen.getByLabelText(/Zewa Coins to use/i), {
      target: { value: "150" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Apply$/i }));

    expect(onApply).toHaveBeenCalledWith(150);
  });
});

describe("The balance and the order ceiling are two different numbers", () => {
  it("names the balance AND the order maximum when the order caps redemption", () => {
    // 340 owned, 260 usable here. Saying only "260" would read as "you have
    // 260 coins" to someone holding 340.
    render(<CoinsPanel quote={QUOTE} />);

    expect(screen.getByText(/340 Zewa Coins \(₹340\)/i)).toBeDefined();
    expect(screen.getByText(/Maximum usable on this order/i)).toBeDefined();
    expect(screen.getByText(/260 Coins \(₹260\)/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Use maximum 260 Coins/i })).toBeDefined();
  });

  it("invents no ceiling when the order can absorb the whole balance", () => {
    // 340 owned, 340 usable — a "maximum" line here would imply a limit that
    // does not exist.
    render(<CoinsPanel quote={{ ...QUOTE, maxRedeemable: 340 }} />);

    expect(screen.getByText(/340 Zewa Coins \(₹340\)/i)).toBeDefined();
    expect(screen.queryByText(/Maximum usable on this order/i)).toBeNull();
    expect(screen.getByRole("button", { name: /Use all 340 Coins/i })).toBeDefined();
  });

  it("tracks the ceiling when the cart changes it", () => {
    // The maximum comes from the server quote; it must follow the cart.
    const { rerender } = render(<CoinsPanel quote={QUOTE} />);
    expect(screen.getByText(/260 Coins \(₹260\)/i)).toBeDefined();

    rerender(<CoinsPanel quote={{ ...QUOTE, maxRedeemable: 100 }} />);
    expect(screen.getByText(/100 Coins \(₹100\)/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Use maximum 100 Coins/i })).toBeDefined();
    // The balance is unchanged by a cart change.
    expect(screen.getByText(/340 Zewa Coins \(₹340\)/i)).toBeDefined();
  });

  it("still applies nothing until the customer acts", () => {
    const onApply = vi.fn();
    render(<CoinsPanel quote={QUOTE} onApply={onApply} />);
    expect(screen.getByLabelText(/Zewa Coins to use/i).value).toBe("");
    expect(onApply).not.toHaveBeenCalled();
  });
});

describe("§10.2 Below the minimum balance", () => {
  it("tells the customer how far off they are", () => {
    // "Earn 10 coins to start using them. You have 6."
    render(<CoinsPanel quote={{ ...QUOTE, available: 6, maxRedeemable: 6 }} />);
    expect(
      screen.getByText(/Earn 10 Zewa Coins to start using them\. You have 6\./i),
    ).toBeDefined();
    expect(screen.queryByLabelText(/Zewa Coins to use/i)).toBeNull();
  });
});

describe("Applied state", () => {
  it("shows what is applied and lets it be removed", () => {
    const onRemove = vi.fn();
    render(<CoinsPanel quote={QUOTE} applied={150} onRemove={onRemove} />);

    expect(screen.getByText(/150 Zewa Coins/i)).toBeDefined();
    expect(screen.getByText(/₹150 off/i)).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: /Remove/i }));
    expect(onRemove).toHaveBeenCalled();
  });

  it("surfaces a silent reduction as a non-blocking notice (§4.1)", () => {
    // "If the eligible value falls below the coins already applied, silently
    // reduce and show a non-blocking notice."
    render(
      <CoinsPanel
        quote={QUOTE}
        applied={100}
        notice="We reduced your coins to 100 because your cart changed."
      />,
    );
    expect(screen.getByText(/We reduced your coins to 100/i)).toBeDefined();
    // Still an applied state, not an error state — checkout is not blocked.
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("Accessibility (§10.1)", () => {
  it("labels the input with the balance and the order ceiling", () => {
    render(<CoinsPanel quote={QUOTE} />);
    expect(
      screen.getByLabelText(/You have 340 coins, worth ₹340\. Up to 260 can be used on this order/i),
    ).toBeDefined();
  });

  it("omits the ceiling from the label when there is none", () => {
    render(<CoinsPanel quote={{ ...QUOTE, maxRedeemable: 340 }} />);
    const input = screen.getByLabelText(/You have 340 coins, worth ₹340/i);
    expect(input.getAttribute("aria-label")).not.toMatch(/can be used on this order/i);
  });

  it("marks the field invalid when entry is rejected", () => {
    render(<CoinsPanel quote={QUOTE} />);
    fireEvent.change(screen.getByLabelText(/Zewa Coins to use/i), {
      target: { value: "9999" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Apply$/i }));
    expect(screen.getByLabelText(/Zewa Coins to use/i).getAttribute("aria-invalid")).toBe("true");
  });

  it("disables the controls while a request is in flight", () => {
    render(<CoinsPanel quote={QUOTE} busy />);
    expect(screen.getByLabelText(/Zewa Coins to use/i).disabled).toBe(true);
  });
});
