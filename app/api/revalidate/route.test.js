/**
 * The invalidation endpoint is a cache-purge lever pointed at production.
 *
 * An unauthenticated one would let anyone evict the whole catalogue repeatedly
 * and turn a cached storefront into an uncached one — a denial-of-service with a
 * single curl. These pin that it fails closed and that it purges the right
 * things.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePath = vi.fn();
const revalidateTag = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: (...a) => revalidatePath(...a),
  revalidateTag: (...a) => revalidateTag(...a),
}));

const { POST } = await import("./route");

const SECRET = "s".repeat(48);
const post = (headers = {}, body = {}) =>
  POST(new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  }));

beforeEach(() => {
  process.env.REVALIDATE_SECRET = SECRET;
  revalidatePath.mockClear();
  revalidateTag.mockClear();
});
afterEach(() => { delete process.env.REVALIDATE_SECRET; });

describe("authorisation", () => {
  it("rejects a request with no token", async () => {
    expect((await post()).status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a wrong token of the same length", async () => {
    const res = await post({ authorization: `Bearer ${"x".repeat(48)}` });
    expect(res.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects a token that is merely a prefix", async () => {
    expect((await post({ authorization: `Bearer ${"s".repeat(10)}` })).status).toBe(401);
  });

  it("rejects a raw token without the Bearer scheme", async () => {
    expect((await post({ authorization: SECRET })).status).toBe(401);
  });

  it("FAILS CLOSED when no secret is configured", async () => {
    // Otherwise a missing env var would silently open the endpoint to everyone.
    delete process.env.REVALIDATE_SECRET;
    expect((await post({ authorization: `Bearer ${SECRET}` })).status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("accepts the correct token", async () => {
    expect((await post({ authorization: `Bearer ${SECRET}` })).status).toBe(200);
  });
});

describe("what it purges", () => {
  const auth = { authorization: `Bearer ${SECRET}` };

  it("clears the data cache AND the rendered pages", async () => {
    await post(auth, { slug: "guppy-bites" });
    // Tag first: clearing only the page would re-render from the same stale
    // API response and look like the purge did nothing.
    expect(revalidateTag).toHaveBeenCalledWith("catalog");
    expect(revalidateTag).toHaveBeenCalledWith("product:guppy-bites");
    expect(revalidatePath).toHaveBeenCalledWith("/products/guppy-bites");
  });

  it("clears the grid and the homepage, which carry the same imagery", async () => {
    await post(auth, { slug: "guppy-bites" });
    expect(revalidatePath).toHaveBeenCalledWith("/products");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("stays targeted — no global purge", async () => {
    await post(auth, { slug: "guppy-bites" });
    const paths = revalidatePath.mock.calls.map((c) => c[0]);
    expect(paths).toEqual(["/products/guppy-bites", "/products", "/"]);
    expect(paths).not.toContain("/[...all]");
  });

  it("handles a catalogue-wide purge with no slug", async () => {
    await post(auth, {});
    expect(revalidateTag).toHaveBeenCalledWith("catalog");
    expect(revalidatePath.mock.calls.map((c) => c[0])).toEqual(["/products", "/"]);
  });

  it("ignores a non-string slug rather than interpolating it", async () => {
    await post(auth, { slug: { evil: true } });
    expect(revalidateTag).not.toHaveBeenCalledWith(expect.stringContaining("object"));
    expect(revalidatePath.mock.calls.map((c) => c[0])).toEqual(["/products", "/"]);
  });

  it("survives an empty body", async () => {
    const res = await POST(new Request("http://localhost/api/revalidate", {
      method: "POST", headers: { authorization: `Bearer ${SECRET}` },
    }));
    expect(res.status).toBe(200);
  });
});
