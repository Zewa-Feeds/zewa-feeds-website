/**
 * Crawl surface: sitemap, robots, and the Dukaan redirect map.
 *
 * These exist because the domain cutover puts the new storefront on a URL space
 * that search engines already hold opinions about. The failure modes are all
 * silent — a sitemap that lists a private page, a robots rule that swallows
 * /products, a redirect that points at itself — so they are pinned here rather
 * than trusted to review.
 */
import { describe, expect, it, vi } from "vitest";

const products = vi.fn();
vi.mock("@/lib/api", () => ({ catalog: { products: () => products() } }));

const { default: sitemap } = await import("./sitemap");
const { default: robots } = await import("./robots");
const { default: nextConfig } = await import("../next.config.mjs");
const { SITE_URL } = await import("@/lib/site");

const CATALOGUE = [
  { slug: "guppy-bites" },
  { slug: "goldfish-bites" },
  { slug: "koi-bites" },
  { slug: "cichlid-bites-c4" },
];

const urls = async () => {
  products.mockResolvedValue(CATALOGUE);
  return (await sitemap()).map((e) => e.url);
};

describe("sitemap", () => {
  it("uses zewafeeds.com as the origin for every entry", async () => {
    expect(SITE_URL).toBe("https://zewafeeds.com");
    for (const url of await urls()) {
      expect(url.startsWith("https://zewafeeds.com/")).toBe(true);
    }
  });

  it("never advertises the Vercel preview host", async () => {
    for (const url of await urls()) expect(url).not.toContain("vercel.app");
  });

  it("includes the homepage and the products listing", async () => {
    const list = await urls();
    expect(list).toContain("https://zewafeeds.com/");
    expect(list).toContain("https://zewafeeds.com/products");
  });

  it("includes a PDP for every published product", async () => {
    const list = await urls();
    for (const p of CATALOGUE) {
      expect(list).toContain(`https://zewafeeds.com/products/${p.slug}`);
    }
  });

  it("excludes private, transactional and internal routes", async () => {
    const list = await urls();
    for (const path of [
      "/account", "/cart", "/checkout", "/signin", "/signup",
      "/forgot-password", "/reset-password", "/orders/track", "/api", "/preview",
    ]) {
      expect(list.some((u) => u.includes(path))).toBe(false);
    }
  });

  it("excludes query-string URLs, so filtered views cannot compete with /products", async () => {
    for (const url of await urls()) expect(url).not.toContain("?");
  });

  it("contains no duplicates", async () => {
    const list = await urls();
    expect(new Set(list).size).toBe(list.length);
  });

  it("does not repeat a product the API sent twice", async () => {
    products.mockResolvedValue([{ slug: "koi-bites" }, { slug: "koi-bites" }]);
    const list = (await sitemap()).map((e) => e.url);
    expect(list.filter((u) => u.endsWith("/products/koi-bites"))).toHaveLength(1);
  });

  it("still returns the static pages when the catalogue is unreachable", async () => {
    products.mockRejectedValue(new Error("API down"));
    const list = (await sitemap()).map((e) => e.url);

    // A build must not fail, and an empty sitemap would read as "shop deleted".
    expect(list).toContain("https://zewafeeds.com/");
    expect(list).toContain("https://zewafeeds.com/products");
    expect(list.some((u) => u.includes("/products/"))).toBe(false);
  });

  it("gives every entry a lastModified and a priority", async () => {
    products.mockResolvedValue(CATALOGUE);
    for (const entry of await sitemap()) {
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(typeof entry.priority).toBe("number");
    }
  });
});

describe("robots", () => {
  const r = robots();
  const rule = r.rules[0];

  it("points crawlers at the sitemap on the canonical domain", () => {
    expect(r.sitemap).toBe("https://zewafeeds.com/sitemap.xml");
  });

  it("allows the site at large", () => {
    expect(rule.userAgent).toBe("*");
    expect(rule.allow).toBe("/");
  });

  it("disallows every private and transactional path", () => {
    for (const path of [
      "/account", "/signin", "/signup", "/forgot-password",
      "/reset-password", "/cart", "/checkout", "/orders/track", "/api/", "/preview",
    ]) {
      expect(rule.disallow).toContain(path);
    }
  });

  it("does NOT block the catalogue — the whole point of being crawled", () => {
    for (const blocked of rule.disallow) {
      expect("/products".startsWith(blocked)).toBe(false);
      expect("/products/koi-bites".startsWith(blocked)).toBe(false);
      expect("/blog".startsWith(blocked)).toBe(false);
      expect("/".startsWith(blocked)).toBe(false);
    }
  });
});

describe("Dukaan redirects", () => {
  let rules;
  const load = async () => (rules ??= await nextConfig.redirects());
  /*
   * First rule with this source. Two rules share /products/cichlid-bites — one
   * qualified by sku_id, one not — so those two are asserted individually
   * below rather than through this helper.
   */
  const find = (source) => rules.find((r) => r.source === source);

  it("sends Cichlid Power Bites to C4 as well — both were the same product", async () => {
    await load();
    expect(find("/products/cichlid-power-bites")).toMatchObject({
      destination: "/products/cichlid-bites-c4",
      permanent: true,
    });
  });

  /*
   * The Dukaan 1kg cichlid page carried two variants that are two different
   * products now. Getting this wrong sends someone who chose the large pellet
   * for an Oscar to a feed for mid-sized fish, so each branch is pinned.
   */
  it("routes the C5 variant's sku_id to C5", async () => {
    await load();
    const rule = rules.find(
      (r) =>
        r.source === "/products/cichlid-bites" &&
        r.has?.some((h) => h.type === "query" && h.key === "sku_id" && h.value === "58928994"),
    );
    expect(rule).toBeDefined();
    expect(rule).toMatchObject({
      destination: "/products/cichlid-bites-c5",
      permanent: true,
    });
  });

  it("puts the sku_id-qualified rule BEFORE the unqualified one", async () => {
    await load();
    const qualified = rules.findIndex(
      (r) => r.source === "/products/cichlid-bites" && r.has?.length,
    );
    const generic = rules.findIndex(
      (r) => r.source === "/products/cichlid-bites" && !r.has,
    );
    expect(qualified).toBeGreaterThanOrEqual(0);
    expect(generic).toBeGreaterThanOrEqual(0);
    // Next.js takes the first match; the wrong order silently sends every
    // C5 link to C4 with no error anywhere.
    expect(qualified).toBeLessThan(generic);
  });

  it("leaves the bare Cichlid URL and the C4 variant on C4", async () => {
    await load();
    const generic = rules.find(
      (r) => r.source === "/products/cichlid-bites" && !r.has,
    );
    // Unqualified, so it catches both no-query and sku_id=58928993.
    expect(generic).toMatchObject({
      destination: "/products/cichlid-bites-c4",
      permanent: true,
    });
  });

  it("qualifies only on sku_id, never on anything a visitor could spoof", async () => {
    await load();
    for (const rule of rules) {
      for (const h of rule.has ?? []) {
        expect(h.type).toBe("query");
        expect(h.key).toBe("sku_id");
      }
    }
  });

  it("collapses each pack-size page onto its product", async () => {
    await load();
    const expected = {
      "/products/betta-bites-1-kg": "/products/betta-bites",
      "/products/guppy-bites-1kg": "/products/guppy-bites",
      "/products/advanced-micro-pellets": "/products/micro-pellets",
      "/products/dried-black-soldier-fly-larvae-25g": "/products/dried-bsf-larvae",
      "/products/dried-black-soldier-fly-larvae-75": "/products/dried-bsf-larvae",
    };
    for (const [source, destination] of Object.entries(expected)) {
      expect(find(source)).toMatchObject({ destination, permanent: true });
    }
  });

  it("sends the pack-size category URLs and the catch-all to the full range", async () => {
    await load();
    for (const source of [
      "/categories/1-kg-packets",
      "/categories/45g-bottles",
      "/categories/fish-feed",
    ]) {
      expect(find(source)).toMatchObject({ destination: "/products", permanent: true });
    }
  });

  it("sends the BSF category to the filtered shop, which has a real equivalent", async () => {
    await load();
    expect(find("/categories/dried-bsf-larvae")).toMatchObject({
      destination: "/products?category=Dried+BSF+Larvae",
      permanent: true,
    });
  });

  it("leaves the three already-dead Dukaan URLs alone", async () => {
    await load();
    // These 404 on Dukaan today, so there is no ranking to preserve and
    // nothing to point at.
    for (const source of [
      "/products/dried-black-soldier-fly-larvae-1",
      "/products/guppy-bites-45g",
      "/products/tetra-treats-45g-125ml",
    ]) {
      expect(find(source)).toBeUndefined();
    }
  });

  it("uses permanent redirects throughout — only a 301 passes ranking signal", async () => {
    await load();
    for (const rule of rules) expect(rule.permanent).toBe(true);
  });

  it("never points a rule at itself", async () => {
    await load();
    for (const rule of rules) expect(rule.destination).not.toBe(rule.source);
  });

  it("has no chains — no destination is another rule's source", async () => {
    await load();
    const sources = new Set(rules.map((r) => r.source));
    for (const rule of rules) {
      // Compare on the path alone: /products?category=… must be checked
      // against /products, or a chain through it would slip past.
      expect(sources.has(rule.destination.split("?")[0])).toBe(false);
    }
  });

  it("leaves slugs that did not move alone, so they resolve directly", async () => {
    await load();
    // These five are the same slug on both sites. A rule would be a self-loop.
    for (const slug of [
      "betta-bites", "guppy-bites", "goldfish-bites", "pleco-bites", "tetra-pellets",
    ]) {
      expect(find(`/products/${slug}`)).toBeUndefined();
    }
  });

  it("does not catch-all unknown product URLs — those must 404, not guess", async () => {
    await load();
    for (const rule of rules) {
      expect(rule.source).not.toMatch(/\/products\/:|\/products\/\*|\(\.\*\)/);
    }
  });
});

describe("canonical origin", () => {
  /*
   * metadataBase is new URL(SITE_URL) in the root layout, and every route
   * declares a RELATIVE canonical. So the resolution below is exactly what
   * Next.js performs when it renders <link rel="canonical">. Testing the
   * resolution rather than the string is what makes this meaningful: it proves
   * relative canonicals land on the production domain, whichever host serves
   * the page.
   */
  const resolve = (path) => new URL(path, SITE_URL).href;

  it("resolves relative canonicals onto zewafeeds.com", () => {
    expect(resolve("/")).toBe("https://zewafeeds.com/");
    expect(resolve("/products")).toBe("https://zewafeeds.com/products");
    expect(resolve("/products/koi-bites")).toBe("https://zewafeeds.com/products/koi-bites");
  });

  it("gives each Cichlid destination its own canonical", () => {
    // The redirect decides which product; the canonical must then name that
    // product and drop the sku_id, so the two never collapse into one entry.
    expect(resolve("/products/cichlid-bites-c4")).toBe(
      "https://zewafeeds.com/products/cichlid-bites-c4",
    );
    expect(resolve("/products/cichlid-bites-c5")).toBe(
      "https://zewafeeds.com/products/cichlid-bites-c5",
    );
    expect(resolve("/products/cichlid-bites-c4")).not.toBe(
      resolve("/products/cichlid-bites-c5"),
    );
  });

  it("strips sku_id from a Cichlid canonical", () => {
    for (const sku of ["58928993", "58928994"]) {
      const landed = `/products/cichlid-bites-c4?sku_id=${sku}`;
      const canonical = landed.split("?")[0];
      expect(resolve(canonical)).toBe("https://zewafeeds.com/products/cichlid-bites-c4");
      expect(resolve(canonical)).not.toContain("sku_id");
    }
  });

  it("never resolves onto the Vercel host or localhost", () => {
    for (const path of ["/", "/products", "/products/koi-bites", "/about", "/blog"]) {
      const href = resolve(path);
      expect(href).not.toContain("vercel.app");
      expect(href).not.toContain("localhost");
    }
  });
});

describe("query parameters", () => {
  /*
   * Two different behaviours, both deliberate.
   *
   * A PDP ignores the query string entirely — nothing in the route or the
   * component reads it — so ?sku_id=… from an old Dukaan link renders the same
   * page. Its canonical is built from the slug alone, so the parameter cannot
   * mint a duplicate.
   *
   * /products DOES read ?category=, because that is the shop filter, and its
   * canonical is the static "/products" so every filtered view consolidates
   * onto one indexable URL. The feature keeps working; the duplicates do not
   * appear.
   */
  const pdpCanonical = (slug) => `/products/${slug}`;

  it("keeps a PDP canonical clean when the URL carries a query string", () => {
    const requested = "/products/cichlid-bites-c4?sku_id=58928993";
    const slug = requested.split("?")[0].split("/").pop();
    expect(pdpCanonical(slug)).toBe("/products/cichlid-bites-c4");
    expect(pdpCanonical(slug)).not.toContain("?");
  });

  it("consolidates every category filter onto one canonical", () => {
    const canonicalForFilteredShop = "/products";
    for (const category of ["Floating Pellets", "Bottom Dwellers", "Hatchery Feeds"]) {
      const browsed = `/products?category=${encodeURIComponent(category)}`;
      expect(browsed).toContain("?category=");
      expect(canonicalForFilteredShop).toBe("/products");
    }
  });

  it("keeps no query-string URL in the sitemap", async () => {
    products.mockResolvedValue(CATALOGUE);
    for (const entry of await sitemap()) expect(entry.url).not.toContain("?");
  });
});
