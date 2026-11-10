/**
 * Security headers for every storefront response.
 *
 * The Content-Security-Policy is an allowlist of where scripts, frames and
 * network calls may come from. With Tidio and Google Analytics on the page,
 * it is what keeps an injected script tag from loading code off some other host.
 *
 * Scripts keep 'unsafe-inline' because Next.js emits inline bootstrap
 * scripts on statically rendered pages. A nonce would remove that need, but it
 * forces every page to render per request, which this site's static
 * publishing model avoids on purpose. Everything else is locked down.
 *
 * ADDING A THIRD-PARTY SERVICE? Its hosts go in the list below, or the browser
 * silently blocks it. The console shows "Refused to load ... Content Security
 * Policy" when that happens.
 */
const isDev = process.env.NODE_ENV !== "production";

const TIDIO = ["https://*.tidio.co", "wss://*.tidio.co", "https://*.tidiochat.com", "wss://*.tidiochat.com"];
const GOOGLE = [
  "https://www.googletagmanager.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.googletagmanager.com",
  // GA4 sends some hits here when Google Signals is on.
  "https://www.google.com",
  "https://stats.g.doubleclick.net",
];
const RAZORPAY = ["https://checkout.razorpay.com", "https://api.razorpay.com", "https://*.razorpay.com"];

const csp = {
  "default-src": ["'self'"],
  // 'unsafe-eval' only in development: React Fast Refresh needs it.
  "script-src": ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : []), ...GOOGLE, ...RAZORPAY, "https://code.tidio.co", ...TIDIO.filter((h) => h.startsWith("https"))],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://*.tidio.co", "https://*.tidiochat.com"],
  "font-src": ["'self'", "data:", "https://fonts.gstatic.com", "https://*.tidio.co", "https://*.tidiochat.com"],
  // Images come from many places (Cloudinary, Google profile photos, Unsplash,
  // GA pixels, Tidio avatars). An image cannot execute, so any HTTPS host is allowed.
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "media-src": ["'self'", "blob:", "https://res.cloudinary.com", "https://*.tidio.co", "https://*.tidiochat.com"],
  "connect-src": [
    "'self'",
    "https://api.zewafeeds.com",
    "https://*.onrender.com",
    "https://api.postalpincode.in",
    "https://res.cloudinary.com",
    ...GOOGLE,
    ...RAZORPAY,
    ...TIDIO,
    ...(isDev ? ["http://localhost:4000", "ws://localhost:3000"] : []),
  ],
  "frame-src": ["https://www.youtube-nocookie.com", "https://www.youtube.com", ...RAZORPAY, "https://*.tidio.co", "https://*.tidiochat.com"],
  "worker-src": ["'self'", "blob:"],
  "manifest-src": ["'self'"],
  "form-action": ["'self'", ...RAZORPAY],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  // Nobody may put zewafeeds.com in a frame (clickjacking).
  "frame-ancestors": ["'none'"],
  ...(isDev ? {} : { "upgrade-insecure-requests": [] }),
};

export const contentSecurityPolicy = Object.entries(csp)
  .map(([k, v]) => [k, ...v].join(" "))
  .join("; ");

export const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Older browsers that ignore frame-ancestors.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];
