import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

const rateMock = vi.fn();
const linkMock = vi.fn();
let search = "t=tok&r=5";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(search),
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/review",
}));
vi.mock("next/image", () => ({ default: ({ alt }) => <img alt={alt} /> }));
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual("@/lib/api");
  return {
    ...actual,
    reviews: {
      rateFromEmail: (...a) => rateMock(...a),
      emailLink: (...a) => linkMock(...a),
    },
  };
});

import { ApiError } from "@/lib/api";
import ReviewPage from "./page";

const VIEW = {
  productName: "Betta Bites",
  productSlug: "betta-bites",
  imageUrl: null,
  orderNo: "27ZFO132",
  firstName: "Nik",
  rating: 5,
  body: "",
};

beforeEach(() => {
  search = "t=tok&r=5";
  rateMock.mockReset();
  linkMock.mockReset();
  rateMock.mockImplementation(async ({ rating, body }) => ({ ...VIEW, rating, body: body ?? "" }));
  linkMock.mockResolvedValue({ ...VIEW, rating: null });
});
afterEach(cleanup);

describe("/review (email star links)", () => {
  it("saves the tapped star as soon as the page loads", async () => {
    render(<ReviewPage />);
    expect(await screen.findByText("Thank you, Nik!")).toBeTruthy();
    expect(rateMock).toHaveBeenCalledTimes(1);
    expect(rateMock).toHaveBeenCalledWith({ token: "tok", rating: 5 });
    expect(screen.getByRole("radio", { name: "5 stars" }).getAttribute("aria-checked")).toBe("true");
  });

  it("only reads, without rating, when the link carries no star", async () => {
    search = "t=tok";
    render(<ReviewPage />);
    expect(await screen.findByText("How did it go, Nik?")).toBeTruthy();
    expect(rateMock).not.toHaveBeenCalled();
  });

  it("changes the rating when another star is tapped", async () => {
    render(<ReviewPage />);
    await screen.findByText("Thank you, Nik!");
    await act(async () => {
      fireEvent.click(screen.getByRole("radio", { name: "3 stars" }));
    });
    expect(rateMock).toHaveBeenLastCalledWith({ token: "tok", rating: 3, body: undefined });
  });

  it("sends the optional note with the current rating", async () => {
    render(<ReviewPage />);
    await screen.findByText("Thank you, Nik!");
    fireEvent.change(screen.getByLabelText(/Tell us more/), { target: { value: "My betta loves these" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Send note" }));
    });
    expect(rateMock).toHaveBeenLastCalledWith({ token: "tok", rating: 5, body: "My betta loves these" });
    expect(await screen.findByText(/your note is saved/)).toBeTruthy();
  });

  it("explains an expired link instead of failing silently", async () => {
    rateMock.mockRejectedValue(new ApiError("expired", { code: "TOKEN_EXPIRED", status: 401 }));
    render(<ReviewPage />);
    await waitFor(() => expect(screen.getByText(/link has expired/)).toBeTruthy());
  });
});
