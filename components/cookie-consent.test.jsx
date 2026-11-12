/**
 * Google Analytics waits for consent; the banner asks once and can be reopened.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next/script", () => ({
  default: ({ src, id }) => <script data-testid="ga-script" data-src={src} id={id} />,
}));

const { default: GoogleAnalytics } = await import("./GoogleAnalytics");
const { default: CookieBanner } = await import("./CookieBanner");
const { default: CookieSettingsLink } = await import("./CookieSettingsLink");

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "production");
  window.localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

const page = () =>
  render(
    <>
      <GoogleAnalytics />
      <CookieBanner />
      <CookieSettingsLink />
    </>,
  );

describe("cookie consent", () => {
  it("loads no Google script until the visitor chooses", () => {
    page();
    expect(screen.getByRole("dialog", { name: /cookie preferences/i })).toBeTruthy();
    expect(screen.queryAllByTestId("ga-script")).toHaveLength(0);
  });

  it("'Essential only' keeps Google Analytics off and closes the banner", () => {
    page();
    act(() => fireEvent.click(screen.getByRole("button", { name: /essential only/i })));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryAllByTestId("ga-script")).toHaveLength(0);
  });

  it("'Accept all' loads Google Analytics", () => {
    page();
    act(() => fireEvent.click(screen.getByRole("button", { name: /accept all/i })));
    expect(screen.queryAllByTestId("ga-script").length).toBeGreaterThan(0);
  });

  it("remembers the choice and Cookie settings asks again", () => {
    window.localStorage.setItem("zewa_cookie_consent", "denied");
    page();
    expect(screen.queryByRole("dialog")).toBeNull();
    act(() => fireEvent.click(screen.getByRole("button", { name: /cookie settings/i })));
    expect(screen.getByRole("dialog", { name: /cookie preferences/i })).toBeTruthy();
  });
});
