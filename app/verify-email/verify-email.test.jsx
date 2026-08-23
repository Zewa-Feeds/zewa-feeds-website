import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VerifyEmailPage from "./page";
import { account as accountApi } from "@/lib/api";

const verifyEmailMock = vi.fn();
const resendVerificationMock = vi.fn();
const refreshMock = vi.fn();

let mockSearchParams = new URLSearchParams("token=test_token_123");

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => "/verify-email",
}));

vi.mock("@/components/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/components/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("@/lib/api", () => ({
  account: {
    verifyEmail: (...args) => verifyEmailMock(...args),
    resendVerification: (...args) => resendVerificationMock(...args),
  },
  ApiError: class ApiError extends Error {
    constructor(message, { code, details } = {}) {
      super(message);
      this.name = "ApiError";
      this.code = code;
      this.details = details;
    }
  },
}));

vi.mock("@/lib/authContext", () => ({
  useAuth: () => ({
    refresh: refreshMock,
    isAuthenticated: false,
    isLoading: false,
  }),
}));

describe("VerifyEmailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams("token=test_token_123");
  });

  it("verifies email successfully and displays account activated screen", async () => {
    verifyEmailMock.mockResolvedValue({
      verified: true,
      accessToken: "token_123",
      customer: { email: "user@example.com", firstName: "Aarav" },
    });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText("Email Verified!")).toBeDefined();
    });

    expect(verifyEmailMock).toHaveBeenCalledWith("test_token_123");
    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Go to Account/i)).toBeDefined();
  });

  it("displays already verified state if email was already verified", async () => {
    verifyEmailMock.mockResolvedValue({
      alreadyVerified: true,
      message: "Your email address is already verified.",
    });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText("Already Verified")).toBeDefined();
    });

    expect(screen.getByText(/Sign In Now/i)).toBeDefined();
  });

  it("displays expired token view and allows resending verification email", async () => {
    const { ApiError } = await import("@/lib/api");
    verifyEmailMock.mockRejectedValue(
      new ApiError("This verification link has expired.", {
        code: "TOKEN_EXPIRED",
        details: { expired: true, email: "user@example.com" },
      }),
    );
    resendVerificationMock.mockResolvedValue({ message: "Sent" });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText("Link Expired")).toBeDefined();
    });

    const resendBtn = screen.getByRole("button", { name: /Resend Verification Link/i });
    expect(resendBtn).toBeDefined();

    fireEvent.click(resendBtn);

    await waitFor(() => {
      expect(resendVerificationMock).toHaveBeenCalledWith("user@example.com");
    });
  });

  it("displays safe error on missing or invalid token", async () => {
    mockSearchParams = new URLSearchParams("");

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(screen.getByText("Invalid Link")).toBeDefined();
    });
  });
});
