/**
 * The shared star display.
 *
 * Every rating on the site draws through this, so the rounding is worth
 * pinning: the product page used `Math.round`, which turned a 4.5 average into
 * five solid stars beside the text "4.5" — an overstatement on every product
 * whose rating ends in .5, which is most of them.
 */
import { describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach } from "vitest";
import StarRating from "./StarRating";

afterEach(cleanup);

/** The fill width of each of the five stars, in order. */
const widths = (container) =>
  [...container.querySelectorAll("span[style*='width']")].map(
    (el) => el.style.width,
  );

describe("StarRating", () => {
  it("draws four full stars and a half for 4.5", () => {
    const { container } = render(<StarRating value={4.5} />);
    expect(widths(container)).toEqual(["100%", "100%", "100%", "100%", "50%"]);
  });

  it("snaps to the nearest half rather than rounding up", () => {
    // 4.7 reads as four-and-a-half, not five. Math.round gave five.
    const { container } = render(<StarRating value={4.7} />);
    expect(widths(container)).toEqual(["100%", "100%", "100%", "100%", "50%"]);
  });

  it("fills every star at 5", () => {
    const { container } = render(<StarRating value={5} />);
    expect(widths(container)).toEqual(["100%", "100%", "100%", "100%", "100%"]);
  });

  it("fills none at 0, so an unrated product shows five empty stars", () => {
    const { container } = render(<StarRating value={0} />);
    expect(widths(container)).toEqual([]);
  });

  it("rounds 4.2 down to four full stars", () => {
    const { container } = render(<StarRating value={4.2} />);
    expect(widths(container)).toEqual(["100%", "100%", "100%", "100%"]);
  });

  it("announces the rating to screen readers", () => {
    const { getByRole } = render(<StarRating value={4.5} />);
    expect(getByRole("img").getAttribute("aria-label")).toBe("4.5 out of 5 stars");
  });
});
