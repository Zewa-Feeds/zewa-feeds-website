/**
 * The cart drawer must cost nothing until it is opened.
 *
 * It used to call `catalog.spotlights()` from a mount effect — and CartDrawer is
 * mounted by the root layout, so that request went out on EVERY page, including
 * the account screens whose slowness prompted this. It took ~1.2s against
 * production and fed an upsell section that was never built: `upsellItems` and
 * `filteredUpsell` were computed and then referenced by no JSX at all.
 *
 * The dead chain is gone. These tests pin down that it stays gone — on mount and
 * on open — and that removing it left the drawer itself untouched.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

const spotlights = vi.fn(() => Promise.resolve([]));
const products = vi.fn(() => Promise.resolve([]));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual("@/lib/api");
  return {
    ...actual,
    catalog: { spotlights, products },
  };
});

vi.mock("next/navigation", () => ({ usePathname: () => "/account" }));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }) => <img src={typeof src === "string" ? src : ""} alt={alt} {...rest} />,
}));

const cart = {
  items: [],
  subtotalPaise: 0,
  totalItems: 0,
  amountToFreeShippingPaise: 0,
  drawerOpen: false,
  setDrawerOpen: vi.fn(),
  removeFromCart: vi.fn(),
  setQty: vi.fn(),
  addToCart: vi.fn(),
};

vi.mock("@/lib/cartContext", () => ({ useCart: () => cart }));

const { default: CartDrawer } = await import("./CartDrawer");

const LINE = {
  sku: "G2-45G",
  name: "Zewa Feeds Guppy Bites G2",
  pack: "45g Bottle",
  pricePaise: 18500,
  qty: 2,
  maxQty: 10,
  image: "/x.png",
  accentBg: "#101010",
};

beforeEach(() => {
  spotlights.mockClear();
  products.mockClear();
  Object.assign(cart, {
    items: [],
    subtotalPaise: 0,
    totalItems: 0,
    amountToFreeShippingPaise: 0,
    drawerOpen: false,
  });
  cart.setDrawerOpen.mockClear();
  cart.removeFromCart.mockClear();
  cart.setQty.mockClear();
});

afterEach(cleanup);

describe("the drawer makes no catalogue request", () => {
  it("does not call catalog.spotlights() on mount", () => {
    render(<CartDrawer />);
    expect(spotlights).not.toHaveBeenCalled();
  });

  it("still does not call it once the drawer is open", () => {
    cart.drawerOpen = true;
    render(<CartDrawer />);
    expect(spotlights).not.toHaveBeenCalled();
  });

  it("does not call it when the drawer is opened, closed and opened again", () => {
    const { rerender } = render(<CartDrawer />);
    for (const open of [true, false, true]) {
      cart.drawerOpen = open;
      rerender(<CartDrawer />);
    }
    expect(spotlights).not.toHaveBeenCalled();
  });

  it("makes no catalogue call of any kind", () => {
    cart.drawerOpen = true;
    cart.items = [LINE];
    render(<CartDrawer />);
    expect(products).not.toHaveBeenCalled();
    expect(spotlights).not.toHaveBeenCalled();
  });
});

describe("the drawer itself is unchanged", () => {
  it("shows the empty state when there is nothing in the cart", () => {
    cart.drawerOpen = true;
    render(<CartDrawer />);
    expect(screen.getByText("Your cart is empty")).toBeDefined();
  });

  it("renders a cart line with its name, pack and quantity", () => {
    cart.drawerOpen = true;
    cart.items = [LINE];
    cart.totalItems = 2;
    cart.subtotalPaise = 37000;
    render(<CartDrawer />);

    expect(screen.getByText(LINE.name)).toBeDefined();
    expect(screen.getByText(LINE.pack)).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
  });

  it("removes a line through the cart, after the exit animation", () => {
    vi.useFakeTimers();
    cart.drawerOpen = true;
    cart.items = [LINE];
    render(<CartDrawer />);

    fireEvent.click(screen.getByLabelText(`Remove ${LINE.name}`));
    // The row fades for 200ms before the line is dropped; let that elapse.
    act(() => vi.advanceTimersByTime(250));

    expect(cart.removeFromCart).toHaveBeenCalledWith(LINE.sku);
    vi.useRealTimers();
  });

  it("closes on Escape", () => {
    cart.drawerOpen = true;
    render(<CartDrawer />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(cart.setDrawerOpen).toHaveBeenCalledWith(false);
  });

  it("is inert to keyboard users while closed", () => {
    render(<CartDrawer />);
    const panel = screen.getByLabelText("Shopping Cart Drawer");
    expect(panel.getAttribute("aria-hidden")).toBe("true");
  });

  it("is exposed to the accessibility tree once open", () => {
    cart.drawerOpen = true;
    render(<CartDrawer />);
    const panel = screen.getByLabelText("Shopping Cart Drawer");
    expect(panel.getAttribute("aria-hidden")).toBeNull();
  });
});
