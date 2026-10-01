/**
 * A slow server must not sign the customer out.
 *
 * Clicking any product signed customers out of the preview site. The session
 * was never revoked: `refresh()` caught EVERY failure from /account/me and set
 * "anonymous", so a timeout read exactly like a rejected token. The API answers
 * /account/me in 9-13 seconds (Render in Oregon, database in Mumbai), so that
 * branch fired routinely — the header flipped to signed-out while the token sat
 * untouched in localStorage.
 *
 * The rule these pin: only the SERVER ends a session. `request()` clears the
 * token on a 401 and only on a 401, so the token still being present means the
 * server never rejected it, and the session must survive.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";

const me = vi.fn();
const logout = vi.fn();
let token = "a-valid-token";

vi.mock("@/lib/api", () => ({
  account: { me: (...a) => me(...a), logout: (...a) => logout(...a) },
  auth: {
    get token() {
      return token;
    },
    set: (t) => {
      token = t;
    },
    clear: () => {
      token = null;
    },
  },
}));

const { AuthProvider, useAuth } = await import("@/lib/authContext");

function Probe() {
  const { status, customer } = useAuth();
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="who">{customer?.email ?? "-"}</span>
    </div>
  );
}

const show = () => render(<AuthProvider><Probe /></AuthProvider>);
const status = () => screen.getByTestId("status").textContent;

const CUSTOMER = { id: "c1", email: "abhi@example.com" };

/** What request() throws when the server was never reached. */
const unreachable = () =>
  Object.assign(new Error("Cannot reach the server."), { code: "NETWORK_ERROR" });

/** What a rejected token looks like: request() has already cleared it. */
const rejected = () => {
  token = null;
  return Object.assign(new Error("Invalid token."), { code: "TOKEN_INVALID", status: 401 });
};

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  token = "a-valid-token";
  me.mockReset();
  logout.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

describe("a session that the server never rejected", () => {
  it("is KEPT when /account/me times out", async () => {
    me.mockResolvedValueOnce(CUSTOMER);
    show();
    await waitFor(() => expect(status()).toBe("authenticated"));

    // A later refresh fails on transport, as it does against the slow API.
    me.mockRejectedValue(unreachable());
    await act(async () => {
      window.dispatchEvent(new StorageEvent("storage", { key: "zewa_customer_token" }));
    });

    expect(status()).toBe("authenticated");
    expect(screen.getByTestId("who").textContent).toBe("abhi@example.com");
  });

  it("never claims 'anonymous' on a first load that could not reach the server", async () => {
    me.mockRejectedValue(unreachable());
    show();

    // "loading" makes no claim; "anonymous" would be a false one.
    await waitFor(() => expect(me).toHaveBeenCalled());
    expect(status()).toBe("loading");
  });

  it("recovers by itself once the server answers, without a reload", async () => {
    me.mockRejectedValueOnce(unreachable());
    show();
    await waitFor(() => expect(me).toHaveBeenCalledTimes(1));
    expect(status()).toBe("loading");

    me.mockResolvedValue(CUSTOMER);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });

    await waitFor(() => expect(status()).toBe("authenticated"));
  });

  it("backs off rather than hammering an API that is already struggling", async () => {
    me.mockRejectedValue(unreachable());
    show();
    await waitFor(() => expect(me).toHaveBeenCalledTimes(1));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });
    await waitFor(() => expect(me).toHaveBeenCalledTimes(2));

    // The second wait is longer; 2.5s more is not yet enough to fire it.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });
    expect(me).toHaveBeenCalledTimes(2);
  });
});

describe("a session the server DID reject", () => {
  it("still signs out on a 401", async () => {
    me.mockImplementation(() => Promise.reject(rejected()));
    show();

    await waitFor(() => expect(status()).toBe("anonymous"));
    expect(screen.getByTestId("who").textContent).toBe("-");
  });

  it("drops a signed-in customer when their token is later rejected", async () => {
    me.mockResolvedValueOnce(CUSTOMER);
    show();
    await waitFor(() => expect(status()).toBe("authenticated"));

    me.mockImplementation(() => Promise.reject(rejected()));
    await act(async () => {
      window.dispatchEvent(new StorageEvent("storage", { key: "zewa_customer_token" }));
    });

    await waitFor(() => expect(status()).toBe("anonymous"));
  });

  it("is anonymous with no token at all, without calling the API", async () => {
    token = null;
    show();

    await waitFor(() => expect(status()).toBe("anonymous"));
    expect(me).not.toHaveBeenCalled();
  });
});
