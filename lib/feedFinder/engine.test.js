import { describe, expect, it } from "vitest";
import {
  EMPTY_ANSWERS,
  fromQuery,
  nextStep,
  pickPack,
  resolve,
  searchSpecies,
  toQuery,
  visibleSteps,
} from "./engine";
import { NEVER_RECOMMEND, PACK_TIERS, SPECIES } from "./data";

const a = (over) => ({ ...EMPTY_ANSWERS, ...over });

/** Every SKU the live catalogue carried on 30 Oct 2026, all in stock. */
const LIVE = Object.fromEntries(
  [
    "DBSFL-25G", "DBSFL-25GX2", "DBSFL-75G", "S5-20G",
    "G2-45G", "G2-45GX2", "G2-45GX3", "G2-200G", "G2-1KG",
    "M3-45G", "M3-45GX2", "M3-45GX3", "M3-200G",
    "F2-45G", "F2-45GX2", "F2-45GX3", "F2-1KG",
    "F3-20G", "F3-45G", "F3-45GX2", "F3-45GX3", "F3-1KG",
    "C4-45G", "C4-45GX2", "C4-45GX3", "C4-1KG", "C5-500G", "C5-1KG",
    "P5-45G", "P5-45GX2", "P5-45GX3", "P5-500G", "P5-1KG",
    "H1-1KG", "H2-1KG", "H3-1KG",
    "K4-45G", "K4-45GX2", "K4-45GX3", "K4-140G", "K7-500G", "K7-1KG", "A10-140G",
  ].map((sku) => [sku, { inStock: true }]),
);

describe("path lengths (spec §1)", () => {
  it("fry: 2 questions, straight to Hatch'E", () => {
    const ans = a({ species: "guppy", size: "newborn" });
    expect(visibleSteps(ans)).toEqual(["species", "size"]);
    const r = resolve(ans, LIVE);
    expect(r.hero.sku).toBe("H1-1KG");
    expect(r.next).toMatchObject({ type: "growout", code: "G2" });
    expect(r.routine).toEqual([]);
  });

  it("shrimp: Q2, Q3 and Q5 are skipped", () => {
    const ans = a({ species: "cherryshrimp", goal: "colour" });
    expect(visibleSteps(ans)).toEqual(["species", "goal"]);
    expect(resolve(ans, LIVE).hero.sku).toBe("S5-20G");
  });

  it("arowana: 4 questions max, no Q3, no Q5", () => {
    const ans = a({ species: "arowana", size: "juvenile", goal: "treats" });
    expect(visibleSteps(ans)).toEqual(["species", "size", "goal"]);
    const r = resolve(ans, LIVE);
    expect(r.hero.sku).toBe("A10-140G");
    expect(r.plan.notes[0]).toMatch(/soak sticks/);
    expect(r.routine.map((x) => x.sku)).toEqual(["DBSFL-25G"]);
  });

  it("guppy: all 5 questions", () => {
    const ans = a({ species: "guppy", size: "adult", mates: ["plecos", "shrimp"], goal: "breeding", count: "11–30" });
    expect(visibleSteps(ans)).toEqual(["species", "size", "home", "goal", "count"]);
    const r = resolve(ans, LIVE);
    expect(r.hero).toMatchObject({ sku: "G2-45GX2", badge: "Made for your fish" });
    expect(r.routine.map((x) => x.sku)).toEqual(["P5-45G", "S5-20G", "H1-1KG"]);
    expect(r.plan.forLine).toBe("For 11–30 guppies");
    expect(r.why[1]).toMatch(/spawning/);
  });
});

describe("rules", () => {
  it("big cichlid under 8 cm gets C4, a grow-out path, and no Treats", () => {
    const ans = a({ species: "oscar", size: "under8" });
    expect(nextStep(ans)).toBe("goal");
    const r = resolve({ ...ans, goal: "everyday", count: "1–5" }, LIVE);
    expect(r.hero.sku).toBe("C4-45G");
    expect(r.next).toMatchObject({ type: "growout", text: "Switch to C5 at 8 cm" });
    expect(resolve({ ...ans, goal: "treats", count: "1–5" }, LIVE)).toBeNull();
  });

  it("goldfish: home is asked only at 15 cm or more, and a pond means K7", () => {
    expect(visibleSteps(a({ species: "fancygoldfish", size: "under15" }))).not.toContain("home");
    const pond = a({ species: "fancygoldfish", size: "over15", home: "pond", goal: "colour", count: "11+" });
    const r = resolve(pond, LIVE);
    expect(r.hero.sku).toBe("K7-1KG");
    expect(r.hero.badge).toBe("A great match");
    expect(resolve({ ...pond, home: "indoor", count: "4+" }, LIVE).hero.sku).toBe("K4-140G");
  });

  it("other small fish adds M3 as the alternative, but not for cichlids", () => {
    const base = { size: "adult", mates: ["small"], goal: "everyday" };
    expect(resolve(a({ species: "tetra", count: "1–15", ...base }), LIVE).next).toMatchObject({ code: "M3", label: "Feeds the whole tank" });
    expect(resolve(a({ species: "angelfish", count: "1–5", ...base }), LIVE).next).toBeNull();
  });

  it("'Just them' cannot be combined with tank mates", () => {
    expect(nextStep(a({ species: "guppy", size: "adult", mates: ["just", "plecos"] }))).toBe("home");
  });

  it("a stale answer from another group is asked again rather than reused", () => {
    expect(nextStep(a({ species: "koi", size: "adult" }))).toBe("size");
  });
});

describe("no match (spec §8)", () => {
  it.each([
    [{ species: "notlisted" }, "notlisted"],
    [{ species: "stingray" }, "stingray"],
    [{ species: "koi", size: "under15" }, "youngkoi"],
    [{ species: "carp", size: "under15" }, "youngkoi"],
  ])("%o → %s", (over, kase) => {
    expect(resolve(a(over), LIVE)).toMatchObject({ kind: "nomatch", case: kase });
  });

  it("red tail catfish offers the larvae as a treat only", () => {
    expect(resolve(a({ species: "redtail" }), LIVE).treat).toMatchObject({ sku: "DBSFL-25G", label: "Treat only" });
  });
});

describe("packs", () => {
  it("no tier ever points at a never-recommend SKU", () => {
    const tierSkus = Object.values(PACK_TIERS).flat().map((t) => t.sku);
    expect(tierSkus.filter((s) => NEVER_RECOMMEND.includes(s))).toEqual([]);
  });

  it("out of stock moves to the next larger pack of the same product", () => {
    const cat = { ...LIVE, "G2-45GX2": { inStock: false } };
    expect(pickPack("G2", "G2-45GX2", cat)).toMatchObject({ sku: "G2-200G", substituted: true });
  });

  it("with no larger pack, falls back to the closest smaller one — M3-1KG does not exist", () => {
    expect(pickPack("M3", "M3-1KG", LIVE)).toMatchObject({ sku: "M3-200G", substituted: true });
  });

  it("never substitutes a never-recommend SKU", () => {
    const cat = { ...LIVE, "G2-200G": { inStock: false }, "G2-1KG": { inStock: false } };
    expect(pickPack("G2", "G2-200G", cat).sku).toBe("G2-45GX2");
  });

  it("every species with a feed resolves to a SKU in the live catalogue", () => {
    for (const s of SPECIES.filter((x) => x.feed)) {
      for (const tier of PACK_TIERS[s.feed]) {
        expect(LIVE[pickPack(s.feed, tier.sku, LIVE).sku], `${s.id} ${tier.sku}`).toBeTruthy();
      }
    }
  });
});

describe("search and URL", () => {
  it("'oranda' lands on Fancy Goldfish", () => {
    expect(searchSpecies("oranda")[0].species.id).toBe("fancygoldfish");
  });

  it("answers survive a round trip through the URL", () => {
    const ans = a({ species: "guppy", size: "adult", mates: ["plecos", "shrimp"], goal: "colour", count: "100+" });
    const back = fromQuery(toQuery(ans, "result"));
    expect(back).toEqual({ answers: ans, step: "result" });
  });
});
