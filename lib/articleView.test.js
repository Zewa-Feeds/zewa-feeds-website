import { describe, expect, it } from "vitest";
import { articleView, pickArticles, relatedFor } from "./articleView";

const a = (slug, extra = {}) => ({ slug, title: slug, readMinutes: 6, publishedAt: "2026-10-08T18:30:00.000Z", ...extra });

describe("articleView", () => {
  it("formats the date in IST, as the hand-written dates were", () => {
    // 18:30Z on the 8th is midnight on the 9th in India.
    const v = articleView(a("x", { cover: { url: "/c.jpg" } }));
    expect(v.date).toBe("9 October 2026");
    expect(v.isoDate).toBe("2026-10-09");
    expect(v.readTime).toBe("6 min");
    expect(v.image).toBe("/c.jpg");
  });
});

describe("pickArticles", () => {
  const list = [a("n1"), a("n2"), a("n3"), a("n4")];
  it("puts pinned first and tops up with the newest", () => {
    expect(pickArticles(list, ["n4"]).map((x) => x.slug)).toEqual(["n4", "n1", "n2"]);
  });
  it("skips a pinned slug that is no longer published", () => {
    expect(pickArticles(list, ["gone", "n3"]).map((x) => x.slug)).toEqual(["n3", "n1", "n2"]);
  });
});

describe("relatedFor", () => {
  it("never relates an article to itself", () => {
    const list = [a("x"), a("y"), a("z")];
    expect(relatedFor(a("x", { relatedSlugs: ["x", "z"] }), list).map((r) => r.slug)).toEqual(["z", "y"]);
  });
});
