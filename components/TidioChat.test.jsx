import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

// Mock Next.js Script component
vi.mock("next/script", () => ({
  default: ({ src, id, onReady }) => {
    return <script data-testid="tidio-script" id={id} src={src} />;
  },
}));

const { default: TidioChat, TIDIO_PUBLIC_KEY } = await import("./TidioChat");

beforeEach(() => {
  mockPathname = "/";
  window.tidioChatApi = {
    show: vi.fn(),
    hide: vi.fn(),
    display: vi.fn(),
  };
});

afterEach(() => {
  cleanup();
  delete window.tidioChatApi;
});

describe("TidioChat", () => {
  it("uses the configured Tidio public key", () => {
    expect(TIDIO_PUBLIC_KEY).toBe("bskymfizgyuqcwn3wpsiffd7i4zrhwrn");
  });

  it("renders the Tidio script tag with correct public key", () => {
    render(<TidioChat />);
    const script = screen.getByTestId("tidio-script");
    expect(script.getAttribute("src")).toContain(TIDIO_PUBLIC_KEY);
  });

  it("does not render when pathname is /checkout", () => {
    mockPathname = "/checkout";
    const { container } = render(<TidioChat />);
    expect(container.innerHTML).toBe("");
  });

  it("starts hidden when hero is on screen, then shows when scrolled past hero", () => {
    mockPathname = "/";
    let heroTop = 0;
    let heroBottom = 800;
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function () {
      if (this.id === "hero") {
        return {
          top: heroTop,
          bottom: heroBottom,
          left: 0,
          right: 1000,
          width: 1000,
          height: 800,
        };
      }
      return originalGetBoundingClientRect.call(this);
    };

    try {
      const { container } = render(
        <div>
          <div id="hero" style={{ height: "800px" }}>Hero section</div>
          <TidioChat />
          <div id="products">Products section</div>
        </div>
      );

      // Initially on hero: style block should set opacity 0
      const style = container.querySelector("style");
      expect(style.textContent).toContain("opacity: 0");

      // Simulate user scrolling down past hero
      heroTop = -700;
      heroBottom = 100;
      Object.defineProperty(window, "scrollY", { value: 750, writable: true });

      act(() => {
        fireEvent.scroll(window);
      });

      // After scrolling: style block should set opacity 1 and call tidio API show
      expect(style.textContent).toContain("opacity: 1");
      expect(window.tidioChatApi.show).toHaveBeenCalled();
    } finally {
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    }
  });
});
