"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { account as accountApi, auth as tokenStore } from "@/lib/api";

/**
 * Customer session state.
 *
 * The token lives in localStorage (see `auth` in lib/api.js) and the profile is
 * re-fetched from `/account/me` on mount. The token is NOT trusted as a source of
 * profile data: it is a bearer credential, not a database row, so a customer who
 * changed their name elsewhere would otherwise keep seeing the stale copy baked
 * into the JWT.
 *
 * Three-state status, deliberately, rather than a boolean plus a loading flag:
 *
 *   "loading"       — token is being checked; nothing about auth is known yet
 *   "authenticated" — `customer` is populated
 *   "anonymous"     — no valid session
 *
 * The distinction is what stops the navbar flickering. With a boolean, the first
 * paint necessarily says "signed out" and then corrects itself a moment later,
 * which reads as a broken header on every single page load.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [status, setStatus] = useState("loading");

  /**
   * Guards against duplicate /account/me calls.
   *
   * React 18 StrictMode mounts effects twice in development, and `refresh` is
   * also called after sign-in. Without this the app fires the same request two
   * or three times on a single page load.
   */
  const inflight = useRef(null);

  /**
   * Pending retry after an unreachable server, so it can be cancelled on
   * unmount and never outlive the provider.
   */
  const retryTimer = useRef(null);
  /** Backoff attempt count; reset by any successful refresh. */
  const retryAttempt = useRef(0);

  /**
   * Try again after a transport failure, backing off 2s, 4s, 8s to a 30s
   * ceiling. The ceiling matters more than the curve: the customer may sit on
   * a page for minutes, and a session that only recovers on reload is barely
   * better than one that ended.
   */
  const scheduleRetry = useCallback(() => {
    if (retryTimer.current) return;
    const delay = Math.min(2000 * 2 ** retryAttempt.current, 30_000);
    retryAttempt.current += 1;
    retryTimer.current = setTimeout(() => {
      retryTimer.current = null;
      void refreshRef.current?.();
    }, delay);
  }, []);

  /**
   * `refresh` and `scheduleRetry` call each other. A ref breaks the cycle
   * without making either depend on the other's identity, which would
   * re-create both on every render and refire the mount effect.
   */
  const refreshRef = useRef(null);

  /** Pull the current profile from the API. Safe to call repeatedly. */
  const refresh = useCallback(async () => {
    if (!tokenStore.token) {
      setCustomer(null);
      setStatus("anonymous");
      return null;
    }

    if (inflight.current) return inflight.current;

    inflight.current = (async () => {
      try {
        const me = await accountApi.me();
        retryAttempt.current = 0;
        setCustomer(me);
        setStatus("authenticated");
        return me;
      } catch {
        /*
         * Only the SERVER can end a session.
         *
         * This used to land every failure on "anonymous", which conflated two
         * very different things: "your token is no longer valid" and "we could
         * not reach the server". The second is an outage, and treating it as a
         * sign-out is how clicking a product signed customers out — the API
         * answers /account/me in 9-13s, so a cold start or a slow response
         * routinely times out, and the header flipped to signed-out while the
         * token sat untouched in localStorage.
         *
         * request() clears the token on a 401 and ONLY on a 401, so the token's
         * continued presence is the signal that the server never rejected it.
         * When it is still there, the session is kept and retried; the customer
         * is not thrown out of a checkout because one request was slow.
         */
        const rejected = !tokenStore.token;
        if (rejected) {
          setCustomer(null);
          setStatus("anonymous");
          return null;
        }

        // Unreachable, not unauthenticated. Keep whatever profile we already
        // have; a first load with none stays "loading" so the header shows no
        // claim either way rather than a wrong one.
        setStatus((prev) => (prev === "authenticated" ? "authenticated" : "loading"));
        scheduleRetry();
        return null;
      } finally {
        inflight.current = null;
      }
    })();

    return inflight.current;
    // `scheduleRetry` is a stable useCallback([]); naming it keeps that
    // dependency honest rather than relying on it silently.
  }, [scheduleRetry]);

  refreshRef.current = refresh;

  useEffect(() => {
    void refresh();
    return () => {
      if (retryTimer.current) {
        clearTimeout(retryTimer.current);
        retryTimer.current = null;
      }
    };
  }, [refresh]);

  /**
   * Keep tabs in sync.
   *
   * `storage` fires in OTHER tabs, so signing out in one tab drops the rest
   * rather than leaving them showing an account that no longer has a token.
   */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === null || e.key === "zewa_customer_token") void refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const signIn = useCallback(async (credentials) => {
    const me = await accountApi.login(credentials);
    setCustomer(me);
    setStatus("authenticated");
    return me;
  }, []);

  const signUp = useCallback(async (payload) => {
    const res = await accountApi.register(payload);
    if (res?.accessToken || res?.id) {
      setCustomer(res);
      setStatus("authenticated");
    }
    return res;
  }, []);

  const completeReset = useCallback(async (payload) => {
    const me = await accountApi.resetPassword(payload);
    setCustomer(me);
    setStatus("authenticated");
    return me;
  }, []);

  /**
   * Sign out.
   *
   * Local only, because the session is a stateless JWT with nothing to revoke
   * server-side. The cart is deliberately left alone — it belongs to the browser,
   * not the account, and wiping someone's basket because they signed out would
   * lose a purchase in progress.
   */
  const signOut = useCallback(() => {
    accountApi.logout();
    setCustomer(null);
    setStatus("anonymous");
  }, []);

  /** Local patch after a profile save, so the UI updates without a refetch. */
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authDrawerTab, setAuthDrawerTab] = useState("signin");

  const openAuthDrawer = useCallback((tab = "signin") => {
    setAuthDrawerTab(tab);
    setAuthDrawerOpen(true);
  }, []);

  const closeAuthDrawer = useCallback(() => {
    setAuthDrawerOpen(false);
  }, []);

  const applyProfile = useCallback((next) => {
    setCustomer((prev) => (prev ? { ...prev, ...next } : next));
  }, []);

  const value = useMemo(
    () => ({
      customer,
      status,
      isLoading: status === "loading",
      isAuthenticated: status === "authenticated",
      signIn,
      signUp,
      signOut,
      completeReset,
      refresh,
      applyProfile,
      authDrawerOpen,
      setAuthDrawerOpen,
      authDrawerTab,
      setAuthDrawerTab,
      openAuthDrawer,
      closeAuthDrawer,
    }),
    [
      customer,
      status,
      signIn,
      signUp,
      signOut,
      completeReset,
      refresh,
      applyProfile,
      authDrawerOpen,
      authDrawerTab,
      openAuthDrawer,
      closeAuthDrawer,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/**
 * Where to send someone after they authenticate.
 *
 * Encoded as a `next` query param rather than held in memory, because the
 * journey usually crosses a full page load (checkout → sign in → checkout) and
 * in-memory state does not survive that.
 *
 * Only same-origin PATHS are honoured. Accepting an arbitrary URL here would be
 * an open redirect: a link to /signin?next=https://evil.example would bounce a
 * freshly authenticated customer straight off the site.
 */
export function safeNext(raw, fallback = "/account") {
  if (!raw) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}

/** Build a sign-in link that returns to `here` afterwards. */
export function signInHref(here) {
  return here && here !== "/" ? `/signin?next=${encodeURIComponent(here)}` : "/signin";
}
