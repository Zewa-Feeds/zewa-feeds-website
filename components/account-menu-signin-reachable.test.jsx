/**
 * The sign-in control must exist whenever the customer is not signed in.
 *
 * A fix for "a slow server signs you out" held a first load in `status:
 * "loading"` while it retried, on the reasoning that "loading" makes no false
 * claim. It makes no claim at all — and this component renders the profile
 * icon as an INERT div while it holds, with the mobile menu rendering nothing.
 * Against a 9-13s API that is exactly where a first load sits, so the preview
 * site shipped with a profile button that could not be clicked.
 *
 * The context-level tests all passed. They asserted the status string and
 * never rendered the header, so nothing caught that one of its three states is
 * a dead end. These close that gap at the component.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

const openAuthDrawer = vi.fn();
let authState = {};

vi.mock("@/lib/authContext", () => ({
  useAuth: () => ({
    customer: null,
    status: "anonymous",
    isAuthenticated: false,
    signOut: vi.fn(),
    openAuthDrawer,
    ...authState,
  }),
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const AccountMenu = (await import("@/components/AccountMenu")).default;
const { MobileAccountLinks } = await import("@/components/AccountMenu");

afterEach(() => {
  cleanup();
  openAuthDrawer.mockReset();
  authState = {};
});

describe("the header account control, signed out", () => {
  it("offers a clickable sign-in", () => {
    render(<AccountMenu />);
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(openAuthDrawer).toHaveBeenCalledWith("signin");
  });

  it("offers sign-in on mobile too", () => {
    render(<MobileAccountLinks />);
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(openAuthDrawer).toHaveBeenCalled();
  });
});

describe("while the session is still being checked", () => {
  it("renders NO clickable control — which is why that state must be brief", () => {
    authState = { status: "loading" };
    render(<AccountMenu />);

    /*
     * This asserts the dead end deliberately, so the constraint is visible:
     * "loading" is a momentary state, never somewhere a first load may park.
     * `lib/auth-survives-outage.test.jsx` pins the other half — that an
     * unreachable server resolves to "anonymous" rather than staying here.
     */
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders no sign-in on mobile either", () => {
    authState = { status: "loading" };
    render(<MobileAccountLinks />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
