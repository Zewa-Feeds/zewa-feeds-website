import { describe, expect, it } from "vitest";
import { isValidElement } from "react";
import snapshot from "../../../content/site-snapshot.fallback.json";
import { withLinks } from "./page";

/*
 * React keys are written into the inline page data Next.js ships with every
 * page. When an inline link's key was `${href}-${offset}`, Googlebot read it as
 * a URL and reported /blog/crude-protein-fish-food-vs-protein-quality-38 and
 * six others like it as 404s (Search Console, Nov 2026). Keys must never look
 * like a URL.
 */
const linkedBlocks = snapshot.articles.flatMap((article) =>
  (article.blocks ?? [])
    .filter((block) => block.links?.length && typeof block.text === "string")
    .map((block) => ({ slug: article.slug, block })),
);

const anchors = (parts) => (Array.isArray(parts) ? parts : [parts]).filter(isValidElement);

describe("withLinks", () => {
  it("has real linked paragraphs to check", () => {
    expect(linkedBlocks.length).toBeGreaterThan(0);
  });

  it.each(linkedBlocks.map(({ slug, block }) => [slug, block]))(
    "%s: no URL-shaped keys, and hrefs are unchanged",
    (_slug, block) => {
      const links = anchors(withLinks(block.text, block.links, "#fff"));
      expect(links.length).toBeGreaterThan(0);

      for (const a of links) {
        expect(a.key).not.toMatch(/^\/|https?:|\/\//);
        // The href itself is still the clean link from content.
        expect(block.links.map((l) => l.href)).toContain(a.props.href);
      }
    },
  );

  it("still links an exact phrase to its href", () => {
    const [a] = anchors(
      withLinks("Try Betta Bites today", [{ text: "Betta Bites", href: "/products/betta-bites" }], "#fff"),
    );
    expect(a.props.href).toBe("/products/betta-bites");
    expect(a.props.children).toBe("Betta Bites");
    expect(a.key).toBe("link-4");
  });
});
