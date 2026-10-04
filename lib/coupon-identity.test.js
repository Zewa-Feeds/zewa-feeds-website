/**
 * The server decides "first order only" and per-customer limits from the
 * session. These calls used to go out without the token, so a signed-in
 * customer who had not typed an email yet looked like a first-time guest and
 * ZEWA1 was applied — and offered — again after their first order.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { auth, cart, coupons, offers } from "./api";

const ok = (data) =>
  Promise.resolve(new Response(JSON.stringify({ data }), { status: 200 }));

describe("coupon calls carry the signed-in identity", () => {
  let fetchMock;
  beforeEach(() => {
    fetchMock = vi.fn(() => ok([]));
    vi.stubGlobal("fetch", fetchMock);
    auth.set("tok-123");
  });
  afterEach(() => {
    auth.clear();
    vi.unstubAllGlobals();
  });

  const authHeader = () => fetchMock.mock.calls[0][1]?.headers?.Authorization;

  it("cart re-pricing", async () => {
    await cart.validate({ lines: [] });
    expect(authHeader()).toBe("Bearer tok-123");
  });

  it("applying a code", async () => {
    await coupons.validate({ code: "ZEWA1", lines: [] });
    expect(authHeader()).toBe("Bearer tok-123");
  });

  it("the offers list, which greys out codes this customer cannot use", async () => {
    await offers.list();
    expect(authHeader()).toBe("Bearer tok-123");
  });

  it("guests still get the shared, cached offers list", async () => {
    auth.clear();
    await offers.list();
    expect(authHeader()).toBeUndefined();
    expect(fetchMock.mock.calls[0][1]?.next?.revalidate).toBe(60);
  });
});
