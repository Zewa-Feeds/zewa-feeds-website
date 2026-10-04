/**
 * Backend API client.
 *
 * One place that knows the API's shape, so components never build URLs or unwrap
 * envelopes themselves. Two conventions from the backend matter here:
 *
 *   success → { data, meta? }
 *   failure → { error: { code, message, fields? } }
 *
 * `ApiError` carries the machine-readable `code`, so callers branch on
 * `err.code === 'OUT_OF_STOCK'` rather than matching message text (which changes).
 *
 * Money crosses the wire as integer paise. Format with `formatInr()` — never do
 * float arithmetic on prices in the UI.
 */

/**
 * Where the API lives, resolved once.
 *
 * Order of precedence:
 *   1. NEXT_PUBLIC_API_URL — an explicit override always wins, so a preview
 *      deploy or a laptop pointed at staging needs no code change.
 *   2. NODE_ENV — development falls back to the local backend, anything else
 *      (production builds, `next start`) falls back to the hosted API.
 *
 * The environment-aware fallback matters: a bare localhost default would let a
 * production build ship silently pointing at a machine that is not there, and
 * the failure only shows up in the browser as a connection refused.
 *
 * Next.js inlines NEXT_PUBLIC_* at build time, so this is decided when the app
 * is compiled, not when it runs.
 */
const HOSTED_API = 'https://zewa-api.onrender.com/api/v1';
const LOCAL_API = 'http://localhost:4000/api/v1';

export const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? LOCAL_API : HOSTED_API)
).replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { code, status, fields, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code ?? 'UNKNOWN';
    this.status = status ?? 0;
    /** Field-keyed messages for inline form errors. */
    this.fields = fields ?? null;
    this.details = details ?? null;
  }
}

/** Customer session token, kept in localStorage so a reload stays signed in. */
const TOKEN_KEY = 'zewa_customer_token';

/**
 * Last known profile, cached beside the token.
 *
 * The token alone is enough to STAY signed in but not to SHOW it: the header
 * needs a name and initials, which only /account/me returns. That call takes
 * 9-13s against the current API, so every page load used to paint a signed-out
 * header first and correct itself once the request landed — which customers
 * read, reasonably, as having been logged out.
 *
 * Caching the profile lets the header paint the right thing immediately while
 * the real request revalidates underneath. It is a display cache and nothing
 * more: it never authorises anything, the token remains the only credential,
 * and the server's answer always wins once it arrives.
 */
const PROFILE_KEY = 'zewa_customer_profile';

export const auth = {
  get token() {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* private browsing — session simply won't persist */
    }
  },
  clear() {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      // The cached profile goes with it. A profile outliving its token would
      // paint a signed-in header for a session that no longer exists.
      window.localStorage.removeItem(PROFILE_KEY);
    } catch {
      /* ignore */
    }
  },

  /** The cached profile, or null. Never trusted beyond what it displays. */
  get profile() {
    if (typeof window === 'undefined') return null;
    try {
      // No token means no session, whatever is cached.
      if (!window.localStorage.getItem(TOKEN_KEY)) return null;
      const raw = window.localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      // Unparseable or unavailable: fall back to fetching, never throw.
      return null;
    }
  },
  setProfile(profile) {
    try {
      if (profile) window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      else window.localStorage.removeItem(PROFILE_KEY);
    } catch {
      /* ignore */
    }
  },
};

/**
 * Core fetch wrapper.
 *
 * `cache: 'no-store'` by default because almost everything here is per-user or
 * needs to be current; pass `next: { revalidate }` for the catalogue, which is
 * safely cacheable.
 */
async function request(path, { method = 'GET', body, authenticated = false, headers = {}, ...rest } = {}) {
  const finalHeaders = { ...headers };
  if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';

  if (authenticated) {
    const token = auth.token;
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: finalHeaders,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      cache: 'no-store',
      ...rest,
    });
  } catch {
    // Network-level failure — the server was never reached.
    throw new ApiError('Cannot reach the server. Check your connection and try again.', {
      code: 'NETWORK_ERROR',
    });
  }

  // 204 and other empty bodies.
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = payload.error ?? {};
    // An expired customer token should not leave the UI in a half-signed-in state.
    if (response.status === 401 && authenticated) auth.clear();

    throw new ApiError(error.message ?? 'Something went wrong.', {
      code: error.code,
      status: response.status,
      fields: error.fields,
      details: error.details,
    });
  }

  return payload;
}

/**
 * Server-side/ISR fetch for cacheable public data with timeout & hibernation
 * wake-up retry.
 *
 * `tags` is what makes a CMS publish visible immediately: /api/revalidate calls
 * revalidateTag with the same names, which drops the stored response so the next
 * render fetches fresh. Without tags the only lever is the time window — an hour
 * on the shop grid.
 */
/**
 * Server-side catalogue fetch, with a budget that matches reality.
 *
 * The timeout was 6s. Product queries currently take 7-20s — Render is in
 * Oregon, Supabase in Mumbai, and Prisma issues a round trip per relation — so
 * this aborted EVERY time and no product page could render. Worse, timeouts
 * were excluded from the retry below, so the one failure mode that actually
 * happens was the one that never got a second chance.
 *
 * 25s is chosen to sit above the observed worst case (20.5s) rather than to be
 * comfortable. It is a ceiling for a slow backend, not a target: moving the API
 * closer to the database is the actual fix, after which this never binds.
 */
async function cached(path, revalidate = 60, retries = 1, tags = ["catalog"]) {
  const signal = AbortSignal.timeout(25000);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      signal,
      next: { revalidate, tags },
    });

    if (response.status === 503 && retries > 0) {
      // Render free tier waking up from hibernation — wait 1.2s and retry
      await new Promise((r) => setTimeout(r, 1200));
      return cached(path, revalidate, retries - 1, tags);
    }

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new ApiError(payload.error?.message ?? 'Failed to load.', {
        code: payload.error?.code,
        status: response.status,
      });
    }
    return response.json();
  } catch (err) {
    /*
     * Retry timeouts too.
     *
     * They used to be excluded, on the reasoning that a request already given
     * its full budget will not do better on a second attempt. That holds for a
     * genuinely dead backend; it is wrong for a slow one, where the first call
     * can pay a cold start or a pool wait the second does not. This was the
     * only failure mode occurring in practice, and it was the one exempted.
     */
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 1200));
      return cached(path, revalidate, retries - 1, tags);
    }

    // If local dev server is unreachable, automatically fall back to hosted production API
    if (API_BASE !== HOSTED_API) {
      try {
        const fallbackRes = await fetch(`${HOSTED_API}${path}`, {
          signal: AbortSignal.timeout(25000),
          next: { revalidate, tags },
        });
        if (fallbackRes.ok) {
          return fallbackRes.json();
        }
      } catch {
        /* secondary fallback failed */
      }
    }

    if (err.name === 'AbortError' || err.name === 'TimeoutError') {
      throw new ApiError('API request timed out.', { code: 'TIMEOUT' });
    }
    throw err;
  }
}

// ============================================================================
// CATALOGUE + CONTENT
// ============================================================================

export const catalog = {
  async products({ category, q } = {}) {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (q) params.set('q', q);
    const suffix = params.toString() ? `?${params}` : '';
    const { data } = await cached(`/catalog/products${suffix}`);
    return data;
  },

  async product(slug) {
    /* Tagged per product as well as catalogue-wide, so publishing one product
       does not evict the whole catalogue's stored responses. */
    const { data } = await cached(`/catalog/products/${slug}`, 60, 1, [
      'catalog',
      `product:${slug}`,
    ]);
    return data;
  },

  /**
   * Browsable categories, from the CMS taxonomy.
   *
   * NOT derived from the products currently returned: only three of thirteen
   * products are published, so deriving would drop every category whose
   * products are still DRAFT.
   */
  async categories() {
    const { data } = await cached('/catalog/categories');
    return data;
  },

  async spotlights() {
    const { data } = await cached('/catalog/spotlights');
    return data;
  },

  async homepage() {
    const { data } = await cached('/catalog/homepage');
    return data;
  },
};

export const content = {
  async articles({ tag } = {}) {
    const suffix = tag && tag !== 'All' ? `?tag=${encodeURIComponent(tag)}` : '';
    const { data } = await cached(`/content/articles${suffix}`);
    return data;
  },

  async article(slug) {
    const { data } = await cached(`/content/articles/${slug}`);
    return data;
  },
};

export const settings = {
  async public() {
    const { data } = await cached('/settings/public', 30);
    return data;
  },
};

/**
 * Offers the shop is currently advertising.
 *
 * Opt-in per coupon on the server, so private referral and influencer codes are
 * never returned here. Cached briefly — this is a shop window, not a price.
 */
/**
 * Reviews for the home page, plus the range-wide rating.
 *
 * Real approved reviews — the marquee used to hold six invented customers under
 * an invented score. Cached like the rest of the catalogue: a stale minute on a
 * testimonial is fine.
 */
export const featuredReviews = {
  async list() {
    const { data } = await cached('/reviews/featured', 300);
    return data;
  },
};

export const offers = {
  /**
   * Offers, judged for the current viewer when signed in.
   *
   * A signed-in list carries `unavailableReason` (already used, first order
   * only...), so it is per-customer and must not go through the shared
   * catalogue cache. Guests still get the cached, anonymous list.
   */
  async list() {
    if (auth.token) {
      const { data } = await request('/offers', { authenticated: true });
      return data;
    }
    const { data } = await cached('/offers', 60);
    return data;
  },
};

/** Draft preview — token-scoped, never cached. */
export const preview = {
  async product(slug, token) {
    const { data } = await request(
      `/preview/products/${slug}?token=${encodeURIComponent(token)}`,
    );
    return data;
  },
  async article(slug, token) {
    const { data } = await request(
      `/preview/articles/${slug}?token=${encodeURIComponent(token)}`,
    );
    return data;
  },
  async homepage(token) {
    const { data } = await request(`/preview/homepage?token=${encodeURIComponent(token)}`);
    return data;
  },
};

// ============================================================================
// CART + CHECKOUT
// ============================================================================

export const cart = {
  /** Re-price against live data. Call on mount and before checkout. */
  /**
   * Re-price against live data.
   *
   * `couponCodes` is a list because promotions can stack — but WHETHER they may
   * is the server's decision, not this call's. Sending several codes asks the
   * question; the response says which were applied and why the rest were not.
   */
  async validate({ lines, couponCodes, couponCode, email, state } = {}) {
    const { data } = await request('/cart/validate', {
      method: 'POST',
      body: { lines, couponCodes, couponCode, email, state },
      // The server decides first-order and per-customer rules from the SESSION.
      // Without the token a signed-in customer who has not typed an email yet
      // looks like a first-time guest, and ZEWA1 is applied again.
      authenticated: true,
    });
    return data;
  },
};

export const coupons = {
  /**
   * Check a code against a cart.
   *
   * Sends cart LINES, not a subtotal: the server prices the cart itself and the
   * minimum-order rule is checked against its own figure, so a total computed
   * here could never be authoritative anyway.
   */
  async validate({ code, lines, email, state }) {
    const { data } = await request('/coupons/validate', {
      method: 'POST',
      body: { code, lines, email, state },
      authenticated: true,
    });
    return data;
  },
};

export const checkout = {
  /**
   * Place an order.
   *
   * `idempotencyKey` should be stable for one attempt — generate it when the form
   * mounts, not per click, so a double-submit reuses it.
   */
  async place(payload, idempotencyKey) {
    const { data } = await request('/checkout', {
      method: 'POST',
      body: payload,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
      authenticated: true,
    });
    return data;
  },

  /** Confirm after the Razorpay widget succeeds (live mode). */
  async confirm(orderNo, { razorpayPaymentId, razorpaySignature }) {
    const { data } = await request(`/checkout/${orderNo}/confirm`, {
      method: 'POST',
      body: { razorpayPaymentId, razorpaySignature },
    });
    return data;
  },

  /** Poll payment status — used while waiting for test-mode auto-confirm. */
  async status(orderNo, email) {
    const { data } = await request(
      `/checkout/${orderNo}/status?email=${encodeURIComponent(email)}`,
    );
    return data;
  },
};

export const orders = {
  /** Guest tracking: order number + email act as the credential pair. */
  async track(orderNo, email) {
    const { data } = await request(
      `/orders/track?orderNo=${encodeURIComponent(orderNo)}&email=${encodeURIComponent(email)}`,
    );
    return data;
  },
};

// ============================================================================
// REVIEWS
// ============================================================================

export const reviews = {
  async submit({ productSlug, rating, body, email, name }) {
    const { data } = await request('/reviews', {
      method: 'POST',
      body: { productSlug, rating, body, email, name },
    });
    return data;
  },
};

// ============================================================================
// CUSTOMER ACCOUNT
// ============================================================================

export const account = {
  async register(payload) {
    const { data } = await request('/auth/customer/register', { method: 'POST', body: payload });
    if (data?.accessToken) {
      auth.set(data.accessToken);
      return data.customer;
    }
    return data;
  },

  async verifyEmail(token) {
    const { data } = await request('/auth/customer/verify-email', {
      method: 'POST',
      body: { token },
    });
    if (data?.accessToken) {
      auth.set(data.accessToken);
    }
    return data;
  },

  async resendVerification(email) {
    const { data } = await request('/auth/customer/resend-verification', {
      method: 'POST',
      body: { email },
    });
    return data;
  },

  async login({ email, password, remember = false }) {
    const { data } = await request('/auth/customer/login', {
      method: 'POST',
      body: { email, password, remember },
    });
    auth.set(data.accessToken);
    return data.customer;
  },

  logout() {
    auth.clear();
  },

  async forgotPassword(email) {
    const { data } = await request('/auth/customer/forgot-password', {
      method: 'POST',
      body: { email },
    });
    return data;
  },

  async me() {
    const { data } = await request('/account/me', { authenticated: true });
    return data;
  },

  async update(payload) {
    const { data } = await request('/account/me', {
      method: 'PATCH',
      body: payload,
      authenticated: true,
    });
    return data;
  },

  async changePassword({ currentPassword, newPassword }) {
    const { data } = await request('/account/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword },
      authenticated: true,
    });
    return data;
  },

  /**
   * Finish a reset. The response carries a session, so the customer lands
   * signed in rather than being sent back to the login form.
   */
  async resetPassword({ token, password }) {
    const { data } = await request('/auth/customer/reset-password', {
      method: 'POST',
      body: { token, password },
    });
    auth.set(data.accessToken);
    return data.customer;
  },

  async orders() {
    const { data } = await request('/account/orders', { authenticated: true });
    return data;
  },

  /**
   * Cancel one's own order.
   *
   * The server decides whether this is allowed — a stale page showing the
   * button is not permission. A 409 comes back when the order moved on
   * (shipped while the modal was open, most likely) and its message is written
   * for the customer, so it can be shown as-is.
   */
  async cancelOrder(orderNo, { reason } = {}) {
    const { data } = await request(
      `/account/orders/${encodeURIComponent(orderNo)}/cancel`,
      {
        method: 'POST',
        body: { ...(reason ? { reason } : {}) },
        authenticated: true,
      },
    );
    return data;
  },

  async order(orderNo) {
    const { data } = await request(`/account/orders/${encodeURIComponent(orderNo)}`, {
      authenticated: true,
    });
    return data;
  },

  /**
   * Fetch the invoice PDF as a Blob.
   *
   * Not a plain <a href> — the endpoint needs the Authorization header, and a
   * link cannot carry one. `request()` is bypassed too: it parses every response
   * as JSON, which would corrupt binary. Errors still come back as JSON, so the
   * content type decides how to read the body.
   */
  async invoice(orderNo) {
    const token = auth.token;
    const response = await fetch(
      `${API_BASE}/account/orders/${encodeURIComponent(orderNo)}/invoice`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      if (response.status === 401) auth.clear();
      const payload = await response.json().catch(() => ({}));
      throw new ApiError(payload.error?.message ?? 'Could not download the invoice.', {
        code: payload.error?.code,
        status: response.status,
      });
    }

    // The server names the file; fall back to the order number if the header is
    // missing (some proxies strip it unless it is CORS-exposed).
    const disposition = response.headers.get('content-disposition') ?? '';
    const match = disposition.match(/filename="?([^";]+)"?/i);

    return {
      blob: await response.blob(),
      filename: match?.[1] ?? `invoice-${orderNo}.pdf`,
    };
  },

  async addresses() {
    const { data } = await request('/account/addresses', { authenticated: true });
    return data;
  },

  async addAddress(payload) {
    const { data } = await request('/account/addresses', {
      method: 'POST',
      body: payload,
      authenticated: true,
    });
    return data;
  },

  async updateAddress(id, payload) {
    const { data } = await request(`/account/addresses/${id}`, {
      method: 'PATCH',
      body: payload,
      authenticated: true,
    });
    return data;
  },

  async deleteAddress(id) {
    await request(`/account/addresses/${id}`, { method: 'DELETE', authenticated: true });
  },

  // ---- Zewa Coins (ZSOP004) ------------------------------------------------
  //
  // `coins()` returns `pending` as its own field, never folded into `available`.
  // §10.1 is explicit that pending must be shown separately with its unlock
  // date, because a headline that includes coins the customer cannot spend
  // generates exactly the support contact the unlock date exists to prevent.

  /** Balance, pending, expiring-soon and the programme's own terms. */
  async coins() {
    const { data } = await request('/account/coins', { authenticated: true });
    return data;
  },

  /** Plain-language ledger, newest first. Cursor-paginated. */
  async coinHistory({ limit = 25, cursor } = {}) {
    const query = new URLSearchParams({ limit: String(limit) });
    if (cursor) query.set('cursor', cursor);
    const { data } = await request(`/account/coins/history?${query}`, { authenticated: true });
    return data;
  },

  /**
   * What the checkout coins box should show for this cart.
   *
   * Resolves to `null` when the box must not render at all — programme off,
   * or a negative balance (§10.1: "hide the box entirely").
   * Callers treat null as "no coins UI", never as an error.
   */
  async coinQuote(lines, couponCodes) {
    const { data } = await request('/account/coins/quote', {
      method: 'POST',
      body: { lines, ...(couponCodes?.length ? { couponCodes } : {}) },
      authenticated: true,
    });
    return data;
  },

  /**
   * Hold coins for this cart (§4.3).
   *
   * Returns what was ACTUALLY held, which may be less than asked for when the
   * cart shrank — `reduced: true` says so, and §4.1 wants that shown as a
   * non-blocking notice rather than an error.
   */
  async applyCoins({ coins, cartKey, lines, couponCodes }) {
    const { data } = await request('/account/coins/apply', {
      method: 'POST',
      body: { coins, cartKey, lines, ...(couponCodes?.length ? { couponCodes } : {}) },
      authenticated: true,
    });
    return data;
  },

  /** Drop the hold immediately rather than waiting for the 30-minute sweep. */
  async removeCoins(cartKey) {
    const { data } = await request('/account/coins/apply', {
      method: 'DELETE',
      body: { cartKey },
      authenticated: true,
    });
    return data;
  },

  /**
   * Release a coin hold while the page is going away.
   *
   * Cannot use `request()`: the document is being torn down, so a normal fetch
   * is cancelled the moment it unloads. `keepalive` is what lets the request
   * outlive the page.
   *
   * Cannot use `navigator.sendBeacon` either, which is the usual tool for this:
   * it sends no custom headers, and this API authenticates with a Bearer token.
   * Using it would have meant a second, cookie-authenticated release endpoint —
   * a real security surface for a convenience feature.
   *
   * Fire-and-forget by nature. Nothing can observe the outcome from a page that
   * no longer exists, and the 30-minute sweep is still the backstop.
   */
  releaseCoinsOnUnload(cartKey) {
    const token = auth.token;
    if (!token || !cartKey) return;
    try {
      fetch(`${API_BASE}/account/coins/apply`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cartKey }),
        keepalive: true,
      }).catch(() => undefined);
    } catch {
      /* the sweep will get it */
    }
  },

  /** Guest orders still claimable on this verified email (§3.4). */
  async claimableCoins() {
    const { data } = await request('/account/coins/claimable', { authenticated: true });
    return data;
  },

  async claimCoins() {
    const { data } = await request('/account/coins/claim', {
      method: 'POST',
      authenticated: true,
    });
    return data;
  },
};

// ============================================================================
// FORMATTING
// ============================================================================

/**
 * Paise → "₹1,847", or "₹22.50" when the amount is not whole rupees.
 *
 * Whole amounts stay clean; fractional ones show their paise. Rounding those to
 * the rupee made the summary contradict itself — weight-slab shipping of 2250
 * paise rendered as "₹23" beside a total computed from the true ₹22.50, so the
 * lines visibly did not add up to the sum underneath them.
 *
 * `decimals` still forces two places for a whole amount when a caller wants a
 * column to line up; passing false forces the old rounded form.
 */
export function formatInr(paise, { decimals } = {}) {
  const amount = paise ?? 0;
  const rupees = amount / 100;
  const showDecimals = decimals ?? amount % 100 !== 0;
  return `₹${rupees.toLocaleString('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })}`;
}

/**
 * An amount, or a placeholder when it is not yet known.
 *
 * The cart reports `null` for shipping and total while a server quote is in
 * flight, because the weight-slab charge is the server's to compute and a
 * plausible-looking stand-in is worse than an honest dash.
 */
export function formatInrPending(paise, placeholder = '—') {
  return paise == null ? placeholder : formatInr(paise);
}

/** Discount percentage from MRP and selling price. */
export function discountPct(mrpPaise, pricePaise) {
  if (!mrpPaise || mrpPaise <= pricePaise) return 0;
  return Math.round((1 - pricePaise / mrpPaise) * 100);
}
