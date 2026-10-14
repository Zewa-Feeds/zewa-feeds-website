/**
 * The content reader decides what happens when the CMS API is unreachable at
 * build or regeneration time. The rule under test: in production it THROWS,
 * so the host keeps the previous deploy / Next keeps the previous page. It
 * must never quietly render the bundled snapshot over a newer live site.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api", () => ({ API_BASE: "https://api.test/api/v1" }));

const ORIGINAL_ENV = process.env.NODE_ENV;

async function load(env) {
  vi.resetModules();
  process.env.NODE_ENV = env;
  return import("./siteContent");
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout"] });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  process.env.NODE_ENV = ORIGINAL_ENV;
  delete process.env.SITE_CONTENT_ALLOW_FALLBACK;
});

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("getSection", () => {
  it("reads the part under its own cache tag, cached until revalidated", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json(200, { data: { version: 9, data: { heroSlides: [] } } }));
    vi.stubGlobal("fetch", fetchMock);
    const { getSection } = await load("production");

    const home = await getSection("home");
    expect(home.version).toBe(9);
    const [url, init] = fetchMock.mock.calls[0];
    // The shape version keys the cache, so a deploy never reads a response
    // cached by older code.
    expect(url).toBe("https://api.test/api/v1/site/live/sections/home?shape=2");
    expect(init.next).toEqual({ revalidate: false, tags: ["site:home"] });
  });

  it("throws in production when the API is down — the previous page stays live", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    const { getSection } = await load("production");
    const pending = getSection("about");
    const assertion = expect(pending).rejects.toThrow(/Refusing to render stale content/);
    await vi.runAllTimersAsync();
    await assertion;
  });

  it("throws in production on a 5xx rather than rendering the snapshot", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json(503, {})));
    const { getSection } = await load("production");
    const pending = getSection("blog");
    const assertion = expect(pending).rejects.toThrow();
    await vi.runAllTimersAsync();
    await assertion;
  });

  it("uses the committed snapshot when nothing has been published yet", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(json(404, { error: { code: "NOT_FOUND", details: { reason: "NO_PUBLICATION" } } })),
    );
    const { getSection } = await load("production");
    const about = await getSection("about");
    expect(about.data.milestones.length).toBeGreaterThan(0);
  });

  it("falls back in development so the site runs without a backend", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    const { getSection } = await load("development");
    const pending = getSection("home");
    await vi.runAllTimersAsync();
    expect((await pending).data.heroSlides.length).toBeGreaterThan(0);
  });
});

describe("getArticle", () => {
  it("returns null for an article that is not published (the page 404s)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json(404, { error: { code: "NOT_FOUND" } })));
    const { getArticle } = await load("production");
    expect(await getArticle("nope")).toBeNull();
  });

  it("tags an article with its own tag and the index tag", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json(200, { data: { version: 3, data: { slug: "x" } } }));
    vi.stubGlobal("fetch", fetchMock);
    const { getArticle } = await load("production");
    await getArticle("x");
    expect(fetchMock.mock.calls[0][1].next.tags).toEqual(["site:article:x", "site:articles"]);
  });
});
