import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CoinsPanel from "./CoinsPanel";

/**
 * The coins box must be recognisable as a rewards feature, even at zero.
 *
 * THE PROBLEM. Below the redemption minimum the panel rendered a single line of
 * `text-white/50` prose — "Earn 10 Zewa Coins to start using them. You have 0."
 * — wedged between the offers box and the totals. It reads as filler. A
 * customer who has never seen Zewa Coins has no reason to register that a
 * wallet exists at all, which is the one moment the feature has to introduce
 * itself.
 *
 * It must NOT overclaim either: nothing here is spendable yet, so it cannot
 * look like an applied discount. A labelled, visibly inert panel that names the
 * balance and what unlocks it is the honest version.
 */
const BASE = {
  quote: { visible: true, available: 0, maxRedeemable: 0, minRedemption: 10, coinValuePaise: 100 },
  applied: 0,
  onApply: () => {},
  onRemove: () => {},
};

describe("the coins panel below the minimum", () => {
  it("names the feature in its own label, not buried in a sentence", () => {
    render(<CoinsPanel {...BASE} />);
    // A short standalone label — the old version had the name only inside a
    // full sentence, which is why the box did not read as a feature.
    const label = screen.getByText(/^\s*Zewa Coins\s*$/i);
    expect(label).toBeTruthy();
  });

  it("states the balance and what unlocks it", () => {
    render(<CoinsPanel {...BASE} />);
    // textContent concatenates adjacent elements ("Zewa Coins0Earn 10 more"),
    // so assert the rendered nodes rather than word boundaries in a run-on string.
    expect(screen.getByText("0")).toBeTruthy();       // the balance figure
    expect(document.body.textContent).toMatch(/Earn 10 more/i);
  });

  it("explains how coins are earned, so the number means something", () => {
    render(<CoinsPanel {...BASE} />);
    expect(document.body.textContent).toMatch(/earn/i);
  });

  it("does not present itself as an applied discount", () => {
    render(<CoinsPanel {...BASE} />);
    expect(screen.queryByRole("button", { name: /remove/i })).toBeNull();
    expect(document.body.textContent).not.toMatch(/applied/i);
  });

  it("still renders nothing when the server withholds the quote", () => {
    const { container } = render(
      <CoinsPanel applied={0} onApply={() => {}} onRemove={() => {}} quote={null} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("gives way to the real control once coins are spendable", () => {
    render(
      <CoinsPanel
        {...BASE}
        quote={{ ...BASE.quote, available: 340, maxRedeemable: 260 }}
      />,
    );
    expect(screen.getByRole("slider")).toBeTruthy();
  });
});
