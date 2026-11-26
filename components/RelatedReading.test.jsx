/**
 * "Related reading" under the product description.
 *
 * Pins the approved product → article mapping exactly (26 Nov 2026), that every
 * link renders with its approved anchor text and destination through next/link,
 * that it sits in the Description tab of the real product page, and that the
 * two products with no relevant article (Shrimp Grazers, Hatch'E) show no
 * section at all rather than an empty heading.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import snapshot from "@/content/site-snapshot.fallback.json";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }) => (
    <a href={href} data-next-link="true" {...rest}>{children}</a>
  ),
}));
vi.mock("next/image", () => ({ default: ({ alt }) => <span role="img" aria-label={alt} /> }));
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/ReviewForm", () => ({ default: () => null }));
vi.mock("@/lib/cartContext", () => ({ useCart: () => ({ addToCart: vi.fn() }) }));

const { RELATED_READING, relatedReadingFor } = await import("@/lib/relatedReading");
const { default: RelatedReading } = await import("./RelatedReading");
const { default: ProductDetail } = await import("@/app/products/[slug]/ProductDetail");

afterEach(cleanup);

const SPARING = "/blog/the-protein-sparing-effect-how-dietary-fat-changes-protein-use-in-fish";
const ABSORBED = "/blog/protein-absorption-in-fish-absorbed-vs-declared";
const CRUDE = "/blog/crude-protein-fish-food-vs-protein-quality";
const FISHMEAL = "/blog/fish-meal-vs-soy-vs-insect-protein";
const CHITIN = "/blog/insect-chitin-prebiotic-fish-food-gut-health";
const CAROTENOIDS = "/blog/carotenoids-natural-color-enhancement";

/** The approved mapping, written out independently of the module under test. */
const APPROVED = {
  "betta-bites": [
    [CAROTENOIDS, "How natural carotenoids build betta colour"],
    [CRUDE, "Why a 46% protein feed suits carnivorous bettas"],
  ],
  "goldfish-bites": [
    [ABSORBED, "Why goldfish digest protein differently"],
    [CRUDE, "Why goldfish need a lower-protein feed"],
  ],
  "koi-bites": [
    [SPARING, "How dietary fat changes protein use in carp and koi"],
    [CAROTENOIDS, "Natural vs synthetic astaxanthin for colour"],
  ],
  "cichlid-bites-c5": [
    [SPARING, "How fat and protein work together in large cichlids"],
    [CAROTENOIDS, "How natural carotenoids intensify fish colour"],
  ],
  "monster-sticks": [
    [CAROTENOIDS, "Natural vs synthetic astaxanthin"],
    [SPARING, "Why more protein isn't always better"],
  ],
  "dried-bsf-larvae": [
    [FISHMEAL, "How black soldier fly protein compares with fish meal and soy"],
    [CHITIN, "Chitin in black soldier fly larvae"],
  ],
  "micro-pellets": [
    [FISHMEAL, "Insect protein vs soy in community fish food"],
    [CRUDE, "What the protein figure on a label tells you"],
  ],
  "tetra-pellets": [[CAROTENOIDS, "How natural carotenoids intensify fish colour"]],
  "cichlid-bites-c4": [[CAROTENOIDS, "How natural carotenoids intensify fish colour"]],
  "guppy-bites": [[SPARING, "How dietary fat and protein affect fish growth"]],
  "pleco-bites": [[CRUDE, "Why a matched protein level beats a higher one"]],
};
const UNMAPPED = ["shrimp-grazers", "hatchery-feeds"];

describe("the mapping", () => {
  it("is exactly the approved one: 11 products, same order, text and URLs", () => {
    const actual = Object.fromEntries(
      Object.entries(RELATED_READING).map(([slug, links]) => [slug, links.map((l) => [l.href, l.text])]),
    );
    expect(actual).toEqual(APPROVED);
    expect(Object.keys(RELATED_READING)).toHaveLength(11);
  });

  it("leaves Shrimp Grazers and Hatch'E out", () => {
    for (const slug of UNMAPPED) {
      expect(RELATED_READING[slug]).toBeUndefined();
      expect(relatedReadingFor(slug)).toEqual([]);
    }
  });

  it("never lists the same article twice for one product", () => {
    for (const links of Object.values(RELATED_READING)) {
      expect(new Set(links.map((l) => l.href)).size).toBe(links.length);
    }
    // An unmapped or unknown slug gets nothing, never an error.
    expect(relatedReadingFor("unknown-product")).toEqual([]);
  });

  it("points only at the six published Knowledge Hub articles", () => {
    /*
     * Listed explicitly rather than read from content/site-snapshot.fallback.json:
     * that bundled fallback predates the Protein Sparing article (3 Nov 2026) and
     * would wrongly fail it. Live URLs were checked when the mapping was approved.
     */
    const published = new Set([SPARING, ABSORBED, CRUDE, FISHMEAL, CHITIN, CAROTENOIDS]);
    for (const links of Object.values(RELATED_READING)) {
      for (const l of links) expect(published.has(l.href), l.href).toBe(true);
    }
    // Every article in the older fallback that IS mapped is also in this list.
    const fallback = new Set(snapshot.articles.map((a) => `/blog/${a.slug}`));
    for (const href of published) if (href !== SPARING) expect(fallback.has(href), href).toBe(true);
  });
});

describe("the component", () => {
  it.each(Object.entries(APPROVED))("%s: renders each approved link through next/link", (slug, expected) => {
    render(<RelatedReading slug={slug} />);
    const section = screen.getByRole("region", { name: "Related reading" });
    const anchors = within(section).getAllByRole("link");
    expect(anchors.map((a) => [a.getAttribute("href"), a.textContent.replace("arrow_forward", "").trim()])).toEqual(expected);
    for (const a of anchors) expect(a.getAttribute("data-next-link")).toBe("true");
  });

  it.each(UNMAPPED)("%s: renders nothing at all", (slug) => {
    const { container } = render(<RelatedReading slug={slug} />);
    expect(container.innerHTML).toBe("");
    expect(screen.queryByText("Related reading")).toBeNull();
  });
});

/** Just enough of the catalogue API's product for the page to render. */
const product = (slug) => ({
  slug,
  name: "Test Product",
  category: "Slow-Sinking Granules",
  shortDesc: "short",
  fullDescHtml: "<p>The full description.</p>",
  proteinPct: 40,
  nutrition: {},
  benefits: [],
  tags: [],
  feeding: {},
  media: [],
  images: [],
  packs: [{ sku: "T-45G", pack: "45g Bottle", pricePaise: 18500, mrpPaise: 24900, price: 185, mrp: 249, inStock: true, maxQty: 5 }],
  reviews: { count: 0, average: null, items: [] },
});

describe("on the product page", () => {
  it("appears in the Description tab, after the description, and not under Reviews", () => {
    render(<ProductDetail product={product("betta-bites")} />);
    const description = screen.getByText("The full description.");
    const heading = screen.getByRole("heading", { name: "Related reading" });
    // Description first, then Related reading.
    expect(description.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /How natural carotenoids build betta colour/ })[0].getAttribute("href")).toBe(CAROTENOIDS);

    fireEvent.click(screen.getByRole("button", { name: /^Reviews/ }));
    expect(screen.queryByRole("heading", { name: "Related reading" })).toBeNull();
  });

  it.each(UNMAPPED)("%s page has no Related reading section", (slug) => {
    render(<ProductDetail product={product(slug)} />);
    expect(screen.getByText("The full description.")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Related reading" })).toBeNull();
  });
});
