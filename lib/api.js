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
async function cached(path, revalidate = 60, retries = 1, tags = ["catalog"]) {
  const signal = AbortSignal.timeout(6000);
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
    if (retries > 0 && !(err.name === 'AbortError' || err.name === 'TimeoutError')) {
      await new Promise((r) => setTimeout(r, 1200));
      return cached(path, revalidate, retries - 1, tags);
    }

    // If local dev server is unreachable, automatically fall back to hosted production API
    if (API_BASE !== HOSTED_API) {
      try {
        const fallbackRes = await fetch(`${HOSTED_API}${path}`, {
          signal: AbortSignal.timeout(6000),
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
  async validate({ lines, couponCode, email, state } = {}) {
    const { data } = await request('/cart/validate', {
      method: 'POST',
      body: { lines, couponCode, email, state },
    });
    return data;
  },
};

export const coupons = {
  async validate({ code, subtotalPaise, email }) {
    const { data } = await request('/coupons/validate', {
      method: 'POST',
      body: { code, subtotalPaise, email },
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
    auth.set(data.accessToken);
    return data.customer;
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
};

// ============================================================================
// FORMATTING
// ============================================================================

/** Paise → "₹1,847". The backend is authoritative on amounts; this only displays. */
export function formatInr(paise, { decimals = false } = {}) {
  const rupees = (paise ?? 0) / 100;
  return `₹${rupees.toLocaleString('en-IN', {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  })}`;
}

/** Discount percentage from MRP and selling price. */
export function discountPct(mrpPaise, pricePaise) {
  if (!mrpPaise || mrpPaise <= pricePaise) return 0;
  return Math.round((1 - pricePaise / mrpPaise) * 100);
}
