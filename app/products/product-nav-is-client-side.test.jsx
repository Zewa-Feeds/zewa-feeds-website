/**
 * Opening a product must not reload the document.
 *
 * The catalogue cards were raw `<a href>`. An anchor is a FULL document
 * navigation: it tears down the React tree, remounts AuthProvider, and
 * re-fetches /account/me. That call takes 9-13s against the current API, so a
 * signed-in customer saw the signed-out header for most of a minute every time
 * they opened a product — and reasonably concluded they had been logged out.
 *
 * Next's <Link> keeps the route change client-side, so the session held in
 * memory is never discarded. These pin that, because the regression is
 * invisible in review: `<a href>` and `<Link href>` render almost the same DOM
 * and differ only in behaviour.
 */
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// next/link renders an <a> with a marker we can assert on, so the test
// distinguishes a real Link from a hand-written anchor.
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }) => (
    <a href={href} data-next-link="true" {...rest}>
      {children}
    </a>
  ),
}));

const { default: Link } = await import("next/link");

/** The shell the catalogue card uses: a Link when navigable, a div when not. */
function CardShell({ slug, children, ...props }) {
  if (!slug) return <div {...props}>{children}</div>;
  return (
    <Link href={`/products/${slug}`} {...props}>
      {children}
    </Link>
  );
}

describe("a catalogue card", () => {
  it("navigates through next/link, not a plain anchor", () => {
    render(<CardShell slug="guppy-bites">Guppy Bites</CardShell>);

    const el = screen.getByText("Guppy Bites");
    expect(el.getAttribute("data-next-link")).toBe("true");
    expect(el.getAttribute("href")).toBe("/products/guppy-bites");
  });

  it("renders a non-navigating element when the product has no slug", () => {
    render(<CardShell slug={undefined}>No Slug</CardShell>);

    const el = screen.getByText("No Slug");
    // <Link> requires a real href; a missing slug must not become href="undefined".
    expect(el.tagName).toBe("DIV");
    expect(el.getAttribute("href")).toBeNull();
  });
});

describe("the live catalogue and product sources", () => {
  const read = async (path) => {
    const { readFileSync } = await import("node:fs");
    return readFileSync(new URL(path, import.meta.url), "utf8");
  };

  it("uses no raw anchor for an internal /products route", async () => {
    for (const file of ["./ProductsClient.jsx", "./[slug]/ProductDetail.jsx"]) {
      const src = await read(file);
      // `<a ... href="/products...">` in any form. tel:/mailto:/external stay fine.
      const rawInternal = /<a\s[^>]*href=\{?["`]\/products/.test(src);
      expect(rawInternal, `${file} still uses <a> for an internal product link`).toBe(false);
    }
  });

  it("imports next/link where it navigates", async () => {
    for (const file of ["./ProductsClient.jsx", "./[slug]/ProductDetail.jsx"]) {
      const src = await read(file);
      expect(src, `${file} does not import next/link`).toContain('from "next/link"');
    }
  });
});
