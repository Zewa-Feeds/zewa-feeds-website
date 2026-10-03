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

// Models the real store, including the display cache: a profile is only
// readable while a token exists, and clearing the token drops both.
let cachedProfile = null;

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
      cachedProfile = null;
    },
    get profile() {
      return token ? cachedProfile : null;
    },
    setProfile: (p) => {
      cachedProfile = p;
    },
  },
}));

// AccountMenu reads the pathname; the provider itself does not.
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const { AuthProvider, useAuth } = await import("@/lib/authContext");

function Probe() {
  const { status, customer } = useAuth();
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="who">{customer?.email ?? "-"}</span>
      <span data-testid="name">{customer?.firstName ?? "-"}</span>
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
  // Default to a COLD start (nothing cached) so each test states its own
  // starting point; the hydration tests set it explicitly.
  cachedProfile = null;
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

  it("does NOT strand a first load in 'loading' — the header must stay usable", async () => {
    me.mockRejectedValue(unreachable());
    show();

    /*
     * There is no session to protect on a first load, and "loading" is not a
     * free parking state: AccountMenu renders the profile icon as an inert
     * div while it holds, and MobileAccountLinks renders nothing, so a stuck
     * "loading" leaves the customer unable to sign in at all.
     */
    await waitFor(() => expect(status()).toBe("anonymous"));
  });

  it("recovers by itself once the server answers, without a reload", async () => {
    me.mockRejectedValueOnce(unreachable());
    show();
    await waitFor(() => expect(me).toHaveBeenCalledTimes(1));
    expect(status()).toBe("anonymous");

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

describe("a page load while already signed in", () => {
  const CACHED = { id: "c1", email: "abhi@example.com", firstName: "Abhi", lastName: "M" };

  it("paints signed-in on the FIRST render, before /account/me answers", async () => {
    cachedProfile = CACHED;
    // Never resolves: stands in for the 9-13s the real call takes.
    me.mockImplementation(() => new Promise(() => {}));

    show();

    /*
     * Asserted synchronously, with no waitFor. The header must be correct in
     * the very first paint — a signed-in customer seeing the signed-out icon
     * for even a moment is the whole complaint, and for most of a minute is
     * what made people think they had been logged out.
     */
    expect(status()).toBe("authenticated");
    expect(screen.getByTestId("who").textContent).toBe("abhi@example.com");
  });

  it("shows the account icon, not a dead one, while revalidating", async () => {
    cachedProfile = CACHED;
    me.mockImplementation(() => new Promise(() => {}));
    const { default: AccountMenu } = await import("@/components/AccountMenu");

    render(
      <AuthProvider>
        <AccountMenu />
      </AuthProvider>
    );

    // Not the "Sign in to your account" button, and not the inert loading div.
    expect(screen.queryByRole("button", { name: /sign in/i })).toBeNull();
    expect(screen.getByRole("button", { name: /account/i })).toBeTruthy();
  });

  it("lets the server's answer win over the cache", async () => {
    cachedProfile = { ...CACHED, firstName: "Stale" };
    me.mockResolvedValue({ ...CACHED, firstName: "Fresh" });

    show();
    expect(status()).toBe("authenticated"); // cached, immediately

    await waitFor(() => expect(me).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByTestId("name").textContent).toBe("Fresh")
    );
  });

  it("signs out on a 401 even though a profile was cached", async () => {
    cachedProfile = CACHED;
    me.mockImplementation(() => Promise.reject(rejected()));

    show();
    expect(status()).toBe("authenticated"); // optimistic from cache

    // The server rejecting the token must override the cache.
    await waitFor(() => expect(status()).toBe("anonymous"));
    expect(screen.getByTestId("who").textContent).toBe("-");
  });

  it("ignores a cached profile when the token is gone", async () => {
    token = null;
    cachedProfile = CACHED;

    show();

    await waitFor(() => expect(status()).toBe("anonymous"));
    expect(me).not.toHaveBeenCalled();
  });
});

describe("the header the customer actually sees", () => {
  it("offers a clickable sign-in when the server cannot be reached", async () => {
    // The provider and the real AccountMenu together — the combination the
    // status-only tests missed, and where the dead profile icon appeared.
    const { default: AccountMenu } = await import("@/components/AccountMenu");
    me.mockRejectedValue(unreachable());

    render(
      <AuthProvider>
        <AccountMenu />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByRole("button", { name: /sign in/i })).toBeTruthy());
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
