/**
 * Product FAQs on the product page: the visible section and the FAQPage JSON-LD
 * come from one list, render nothing for a product without FAQs, and sit outside
 * the tabs so they are always in the page.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({ default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a> }));
vi.mock("next/image", () => ({ default: ({ alt }) => <span role="img" aria-label={alt} /> }));
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/ReviewForm", () => ({ default: () => null }));
vi.mock("@/lib/cartContext", () => ({ useCart: () => ({ addToCart: vi.fn() }) }));

const { faqItems, faqPageSchema, jsonLd } = await import("@/lib/productFaq");
const { default: ProductFaq } = await import("./ProductFaq");
const { default: ProductDetail } = await import("@/app/products/[slug]/ProductDetail");

afterEach(cleanup);

const FAQ = [
  { q: "How many pellets should I feed my betta?", a: "Feed 4–6 pellets twice daily." },
  { q: "Is it suitable for fry?", a: "Use Hatch'E for fry." },
];

describe("faqItems / faqPageSchema", () => {
  it("keeps complete entries in order and drops malformed ones", () => {
    expect(faqItems({ faq: [...FAQ, { q: "No answer?" }, null, { q: " ", a: " " }] })).toEqual(FAQ);
    expect(faqItems({})).toEqual([]);
  });

  it("builds FAQPage data matching the visible list exactly", () => {
    expect(faqPageSchema({ faq: FAQ })).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  });

  it("emits no FAQPage data for a product without FAQs", () => {
    expect(faqPageSchema({ faq: [] })).toBeNull();
    expect(faqPageSchema({})).toBeNull();
  });

  it("escapes '<' so text can never close the script element", () => {
    const out = jsonLd({ text: "</script><b>x" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out)).toEqual({ text: "</script><b>x" });
  });
});

describe("ProductFaq", () => {
  it("shows every question and answer", () => {
    render(<ProductFaq product={{ faq: FAQ }} />);
    expect(screen.getByRole("heading", { name: "Frequently asked questions" })).toBeTruthy();
    for (const f of FAQ) {
      expect(screen.getByText(f.q)).toBeTruthy();
      expect(screen.getByText(f.a)).toBeTruthy(); // in the DOM even while collapsed
    }
  });

  it("renders nothing without FAQs", () => {
    const { container } = render(<ProductFaq product={{ faq: [] }} />);
    expect(container.innerHTML).toBe("");
  });
});

const product = (extra) => ({
  slug: "betta-bites", name: "Test Product", category: "Slow-Sinking Granules", shortDesc: "short",
  fullDescHtml: "<p>The full description.</p>", proteinPct: 40, nutrition: {}, benefits: [], tags: [], feeding: {},
  media: [], images: [],
  packs: [{ sku: "T-45G", pack: "45g Bottle", pricePaise: 18500, mrpPaise: 24900, price: 185, mrp: 249, inStock: true, maxQty: 5 }],
  reviews: { count: 0, average: null, items: [] },
  ...extra,
});

describe("on the product page", () => {
  it("shows the FAQs below the tabs, whichever tab is open", () => {
    render(<ProductDetail product={product({ faq: FAQ })} />);
    const heading = screen.getByRole("heading", { name: "Frequently asked questions" });
    const tabs = document.getElementById("product-tabs");
    expect(tabs.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(tabs.contains(heading)).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: /^Reviews/ }));
    expect(screen.getByText(FAQ[0].q)).toBeTruthy();
    // Related Reading (Description tab) is untouched by this.
    fireEvent.click(screen.getByRole("button", { name: /^Description/ }));
    expect(screen.getByRole("heading", { name: "Related reading" })).toBeTruthy();
  });

  it("shows no FAQ section for a product without FAQs", () => {
    render(<ProductDetail product={product({ faq: [] })} />);
    expect(screen.queryByRole("heading", { name: "Frequently asked questions" })).toBeNull();
  });
});
