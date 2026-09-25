import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

/**
 * Unverified-account recovery in the sign-in DRAWER.
 *
 * The /signin page already offered a resend; this drawer did not — and the drawer is
 * the surface most customers use, because it opens from the header rather than
 * needing navigation. So the common path showed "Please verify your email address
 * before signing in" with nothing to act on, and a customer whose verification mail
 * failed at signup was stuck. That is exactly what the Sep 2026 ZeptoMail outage
 * produced.
 */

const signInMock = vi.fn();
const resendVerificationMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(""),
  usePathname: () => "/",
}));

vi.mock("@/lib/authContext", () => ({
  useAuth: () => ({
    authDrawerOpen: true,
    setAuthDrawerOpen: vi.fn(),
    authDrawerTab: "signin",
    setAuthDrawerTab: vi.fn(),
    signIn: (...a) => signInMock(...a),
    signUp: vi.fn(),
    isAuthenticated: false,
  }),
  safeNext: () => null,
}));

vi.mock("@/lib/api", () => ({
  account: {
    resendVerification: (...a) => resendVerificationMock(...a),
    requestPasswordReset: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    constructor(message, { code, fields, details } = {}) {
      super(message);
      this.name = "ApiError";
      this.code = code;
      this.fields = fields ?? null;
      this.details = details ?? null;
    }
  },
}));

const { default: AuthDrawer } = await import("./AuthDrawer");
const { ApiError } = await import("@/lib/api");

/** Fill the form and submit, which is what surfaces the error. */
async function attemptSignIn(email = "parthk@zewafeeds.com") {
  render(<AuthDrawer />);
  // Exact labels: /password/i also matches "Forgot password?", and /email/i matches
  // more than one control once the panel renders.
  fireEvent.change(emailInput(), { target: { value: email } });
  fireEvent.change(passwordInput(), { target: { value: "Correct123!" } });
  // The "SIGN IN" tab shares its name with the submit button; take the submit one.
  const submit = screen
    .getAllByRole("button", { name: /^sign in$/i })
    .find((b) => b.getAttribute("type") === "submit");
  fireEvent.click(submit);
}

const emailInput = () => screen.getByLabelText(/^email address/i);
const passwordInput = () => screen.getByLabelText(/^password/i);

beforeEach(() => {
  resendVerificationMock.mockResolvedValue({ message: "sent" });
  signInMock.mockRejectedValue(
    new ApiError("Please verify your email address before signing in.", {
      code: "EMAIL_UNVERIFIED",
      details: { email: "parthk@zewafeeds.com", unverified: true },
    }),
  );
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("signing in with an unverified account", () => {
  it("offers a resend instead of a dead end", async () => {
    await attemptSignIn();

    expect(await screen.findByRole("button", { name: /resend verification email/i })).toBeTruthy();
  });

  it("names the address the link will go to", async () => {
    await attemptSignIn();

    await screen.findByRole("button", { name: /resend verification email/i });
    expect(screen.getByText(/parthk@zewafeeds\.com/)).toBeTruthy();
  });

  it("requests a fresh link for that address", async () => {
    await attemptSignIn();

    fireEvent.click(await screen.findByRole("button", { name: /resend verification email/i }));

    await waitFor(() =>
      expect(resendVerificationMock).toHaveBeenCalledWith("parthk@zewafeeds.com"),
    );
    expect(await screen.findByText(/new verification link has been sent/i)).toBeTruthy();
  });

  it("reports a failed resend rather than claiming success", async () => {
    resendVerificationMock.mockRejectedValue(new Error("network"));
    await attemptSignIn();

    fireEvent.click(await screen.findByRole("button", { name: /resend verification email/i }));

    expect(await screen.findByText(/could not resend link right now/i)).toBeTruthy();
  });

  /*
   * Otherwise the panel keeps offering to resend to the PREVIOUS address while the
   * customer types a different one, and the link goes to an account they are no
   * longer trying to sign in to.
   */
  it("drops the panel once a different email is typed", async () => {
    await attemptSignIn();
    await screen.findByRole("button", { name: /resend verification email/i });

    fireEvent.change(emailInput(), { target: { value: "someone-else@example.com" } });

    expect(screen.queryByRole("button", { name: /resend verification email/i })).toBeNull();
  });

  /* An ordinary wrong-password failure must not offer verification recovery. */
  it("does not offer a resend for bad credentials", async () => {
    signInMock.mockRejectedValue(
      new ApiError("Incorrect email or password.", { code: "INVALID_CREDENTIALS" }),
    );
    await attemptSignIn();

    expect(await screen.findByText(/incorrect email or password/i)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /resend verification email/i })).toBeNull();
  });
});
