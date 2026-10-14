/**
 * Website content, as published from the CMS. SERVER ONLY.
 *
 * WHEN THIS RUNS. During `next build` and when a page is regenerated after a
 * publish — never on an ordinary page view. Every fetch is cached indefinitely
 * (`revalidate: false`) under a tag; the CMS publish worker calls
 * /api/revalidate with exactly the tags that changed, and only then is the API
 * asked again. A visitor is always served pre-rendered HTML.
 *
 * WHAT HAPPENS ON FAILURE. In production a failed fetch THROWS. That is the
 * safe direction:
 *   - during a build, the build fails and the host keeps serving the previous
 *     deploy (Netlify and Vercel both deploy atomically)
 *   - during regeneration, Next keeps the last page it rendered successfully
 * Falling back to bundled content instead would publish stale copy over a
 * newer live site and call it a success.
 *
 * The committed snapshot (content/site-snapshot.fallback.json) is used only
 * when the API answers that nothing has been published yet, or in development
 * (or with SITE_CONTENT_ALLOW_FALLBACK=1) when the API is unreachable. It is
 * the content the site shipped with before the CMS took over.
 *
 * Each page reads only the parts it shows, each under its own tag, so a
 * homepage edit regenerates the homepage and not the blog.
 */
import { API_BASE } from "@/lib/api";
import FALLBACK from "@/content/site-snapshot.fallback.json";

/**
 * The content SHAPE this code renders. Part of every cached request URL.
 *
 * Next's data cache outlives a deploy (on Vercel it is shared across
 * deployments). Without this, new code expecting a new field — the About page
 * copy, letters — would read a response cached by the previous deploy, and
 * either fail the build or render with the field missing. Bump it whenever the
 * snapshot shape the pages read changes; the API ignores the parameter.
 */
const CONTENT_SHAPE = 2;

const STRICT =
  process.env.NODE_ENV === "production" && process.env.SITE_CONTENT_ALLOW_FALLBACK !== "1";

class SiteContentError extends Error {
  constructor(message) {
    super(message);
    this.name = "SiteContentError";
  }
}

async function live(path, tags) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const sep = path.includes("?") ? "&" : "?";
      const res = await fetch(`${API_BASE}/site/live${path}${sep}shape=${CONTENT_SHAPE}`, {
        next: { revalidate: false, tags },
        signal: AbortSignal.timeout(25000),
      });
      if (res.status === 404) {
        const body = await res.json().catch(() => ({}));
        if (body?.error?.details?.reason === "NO_PUBLICATION") return { fallback: true };
        /*
         * "Route GET /api/v1/site/live/... not found" means the API predates
         * website publishing — it is NOT "this article does not exist".
         * Treated as unavailable, so a storefront deployed ahead of its
         * backend fails loudly instead of building every article as a 404.
         */
        if (/^Route /.test(body?.error?.message ?? "")) {
          throw new SiteContentError(
            `${API_BASE} has no /site/live routes — deploy the backend (website publishing) before the storefront.`,
          );
        }
        return { notFound: true };
      }
      if (!res.ok) throw new SiteContentError(`GET /site/live${path} answered ${res.status}`);
      const { data } = await res.json();
      return { data };
    } catch (err) {
      lastError = err;
      // One retry: the API may be waking from idle.
      if (attempt === 0) await new Promise((r) => setTimeout(r, 1500));
    }
  }
  if (STRICT) {
    throw new SiteContentError(
      `Website content unavailable (${lastError?.message}). Refusing to render stale content — the previous page stays live.`,
    );
  }
  console.warn(`[siteContent] ${path}: ${lastError?.message} — using the bundled snapshot (development only).`);
  return { fallback: true };
}

const fromFallback = {
  part: (part) => ({ version: FALLBACK.version ?? 0, data: FALLBACK.sections[part] }),
  index: () => ({
    version: FALLBACK.version ?? 0,
    data: FALLBACK.articles.map(({ blocks: _b, bodyHtml: _h, toc: _t, ...card }) => card),
  }),
  article: (slug) => {
    const a = FALLBACK.articles.find((x) => x.slug === slug);
    return a ? { version: FALLBACK.version ?? 0, data: a } : null;
  },
};

/** One website section: "home" | "products" | "blog" | "about" | "letters". */
export async function getSection(part) {
  const r = await live(`/sections/${part}`, [`site:${part}`]);
  if (r.fallback) return fromFallback.part(part);
  if (r.notFound) throw new SiteContentError(`The API has no website section "${part}".`);
  return r.data;
}

/** Published articles, newest first, without bodies. */
export async function getArticleIndex() {
  const r = await live("/articles", ["site:articles"]);
  if (r.fallback) return fromFallback.index();
  if (r.notFound) throw new SiteContentError("The API returned no article index.");
  return r.data;
}

/** One published article with its body, or null if it is not published. */
export async function getArticle(slug) {
  const r = await live(`/articles/${encodeURIComponent(slug)}`, [`site:article:${slug}`, "site:articles"]);
  if (r.notFound) return null;
  if (r.fallback) return fromFallback.article(slug);
  return r.data;
}

/** Highest publication version among the parts a page rendered from. */
export const versionOf = (...parts) => Math.max(0, ...parts.filter(Boolean).map((p) => p.version ?? 0));

// ---------------------------------------------------------------------------
// Draft preview — token-scoped, never cached.
// ---------------------------------------------------------------------------

async function preview(path, token) {
  const res = await fetch(`${API_BASE}/preview/site${path}?token=${encodeURIComponent(token)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const { data } = await res.json();
  return data;
}

export const previewSection = (part, token) => preview(`/sections/${part}`, token);
export const previewArticle = (slug, token) => preview(`/articles/${encodeURIComponent(slug)}`, token);
