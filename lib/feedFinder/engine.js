/**
 * Find My Feed — the rules.
 *
 * Pure functions over (answers, catalogue). No React, no fetching, so every
 * path in the spec can be tested without rendering anything. What gets
 * recommended lives in data.js; this file only knows WHEN to ask and HOW the
 * tables combine.
 *
 * `answers` is a flat object, mirrored one-to-one in the URL so a result can
 * be shared and Back always restores exactly what the customer picked:
 *
 *   { species, size, mates: [], home, goal, count }
 *
 * An answer is only USED when it is still valid for the questions the customer
 * now sees. Changing the species never has to clear anything: a stale size
 * from another group simply fails validation and that question is asked again.
 */
import {
  BADGES,
  BIG_CICHLID_GROW_OUT,
  BOTTOM_OTHER_ALT,
  FEEDING_PLANS,
  GOALS,
  GOLDFISH_HOME_FEED,
  GROUPS,
  HATCHE,
  HOMES,
  MESSAGES,
  MONSTER_JUVENILE_NOTE,
  NEVER_RECOMMEND,
  NO_MATCH,
  PACK_TIERS,
  PRODUCT_NAMES,
  SIZE_SETS,
  SMALL_FISH_ALT,
  SPECIES,
  SWITCHING_NOTE,
  TANKMATE_ADDONS,
  TANKMATES,
} from "./data";

export const STEPS = ["species", "size", "home", "goal", "count"];

export const EMPTY_ANSWERS = Object.freeze({
  species: null,
  size: null,
  mates: [],
  home: null,
  goal: null,
  count: null,
});

// ─── Lookups ──────────────────────────────────────────────────────────────────

const speciesIndex = new Map(SPECIES.map((s) => [s.id, s]));
const groupIndex = new Map(GROUPS.map((g) => [g.id, g]));

export const getSpecies = (id) => speciesIndex.get(id) ?? null;
export const getGroup = (id) => groupIndex.get(id) ?? null;
export const speciesInGroup = (groupId) => SPECIES.filter((s) => s.group === groupId);

function ctx(answers) {
  const species = getSpecies(answers.species);
  const group = species ? getGroup(species.group) : null;
  return { species, group };
}

// ─── Per-question options ─────────────────────────────────────────────────────

export function sizeOptions(answers) {
  const { group } = ctx(answers);
  return group?.sizes ? SIZE_SETS[group.sizes] : null;
}

function validSize(answers) {
  const opts = sizeOptions(answers);
  return opts?.find((o) => o.id === answers.size) ?? null;
}

/** The fry option picked in Q2, or null. */
export function fryStage(answers) {
  return validSize(answers)?.fry ?? null;
}

/** §8 case key, or null. Decided by Q1, or by Q2 for Koi/Carp under 15 cm. */
export function noMatchCase(answers) {
  const { species } = ctx(answers);
  if (!species) return null;
  if (species.noMatch) return species.noMatch;
  if (species.koi && validSize(answers)?.id === "under15") return "youngkoi";
  return null;
}

/**
 * Which Q3 version applies: "tank" | "bottom" | "pond" | null (skip).
 *
 * Goldfish under 15 cm are K4 whatever the home, so the question would change
 * nothing — design rule 1 says skip it. Until the size is known it is assumed
 * shown, which only affects the progress estimate.
 */
export function homeVersion(answers) {
  const { species, group } = ctx(answers);
  if (!group?.home || fryStage(answers) || noMatchCase(answers)) return null;
  if (group.home === "pond") {
    if (species.koi) return null;
    const size = validSize(answers)?.id;
    return size && size !== "over15" ? null : "pond";
  }
  return group.home;
}

export function homeOptions(answers) {
  const v = homeVersion(answers);
  if (v === "pond") return HOMES;
  return v ? TANKMATES[v] : null;
}

/** The staple product code — null until enough is known, or on a no-match. */
export function feedCode(answers) {
  const { species, group } = ctx(answers);
  if (!species?.feed || noMatchCase(answers)) return null;
  const fry = fryStage(answers);
  if (fry) return fry;
  const size = validSize(answers)?.id;
  if (group.id === "bigcichlids" && size === "under8") return "C4";
  if (group.id === "goldfish" && !species.koi && size === "over15") {
    return answers.home && GOLDFISH_HOME_FEED[answers.home] ? GOLDFISH_HOME_FEED[answers.home] : null;
  }
  return species.feed;
}

export function goalOptions(answers) {
  const { species, group } = ctx(answers);
  if (!species) return GOALS;
  const feed = feedCode(answers);
  return GOALS.filter((g) => {
    if (g.hideGroups?.includes(group.id)) return false;
    if (g.requiresTreat && !species.treat) return false;
    if (feed && g.hideFeeds?.includes(feed)) return false;
    return true;
  });
}

export function countTiers(answers) {
  const feed = feedCode(answers);
  return feed ? PACK_TIERS[feed] ?? null : null;
}

// ─── Which questions this customer sees ───────────────────────────────────────

function isValid(step, answers) {
  switch (step) {
    case "species":
      return Boolean(getSpecies(answers.species));
    case "size":
      return Boolean(validSize(answers));
    case "home": {
      const v = homeVersion(answers);
      if (v === "pond") return HOMES.some((h) => h.id === answers.home);
      const ids = TANKMATES[v]?.map((o) => o.id) ?? [];
      const mates = answers.mates ?? [];
      if (!mates.length || !mates.every((m) => ids.includes(m))) return false;
      return !(mates.includes("just") && mates.length > 1);
    }
    case "goal":
      return goalOptions(answers).some((g) => g.id === answers.goal);
    case "count":
      return Boolean(countTiers(answers)?.some((t) => t.label === answers.count));
    default:
      return false;
  }
}

/**
 * The questions this customer will see, in order, given what is known so far.
 *
 * `groupHint` is the tile picked in Q1 before a species chip — it lets the
 * progress bar shrink as soon as the customer taps "Shrimp & snails".
 */
export function visibleSteps(answers, groupHint = null) {
  const { species } = ctx(answers);
  const group = species ? getGroup(species.group) : getGroup(groupHint);
  const steps = ["species"];

  if (!species) {
    if (!group) return STEPS;
    if (group.id === "other") return steps;
    if (group.sizes) steps.push("size");
    if (group.home) steps.push("home");
    steps.push("goal");
    if (group.id !== "shrimp") steps.push("count");
    return steps;
  }

  if (species.noMatch) return steps;
  if (group.sizes) steps.push("size");
  if (fryStage(answers) || noMatchCase(answers)) return steps;
  if (homeVersion(answers)) steps.push("home");
  steps.push("goal");

  // Goldfish over 15 cm: the feed waits on Q3, but both candidates have tiers.
  const tiers = countTiers(answers);
  if (tiers ? tiers.length > 1 : !feedCode(answers)) steps.push("count");
  return steps;
}

/** First visible question without a valid answer, or "result". */
export function nextStep(answers) {
  const steps = visibleSteps(answers);
  // Steps are recomputed after each answer, because an answer can remove later ones.
  for (const step of steps) {
    if (!isValid(step, answers)) return step;
  }
  return "result";
}

/** The visible question before `step`, or null at the start. */
export function previousStep(answers, step) {
  const steps = visibleSteps(answers);
  if (step === "result") return steps[steps.length - 1] ?? null;
  const i = steps.indexOf(step);
  return i > 0 ? steps[i - 1] : null;
}

/** Is it legitimate to show `step` now (every earlier visible question answered)? */
export function canShow(answers, step) {
  if (step === "result") return nextStep(answers) === "result";
  const steps = visibleSteps(answers);
  const i = steps.indexOf(step);
  if (i === -1) return false;
  return steps.slice(0, i).every((s) => isValid(s, answers));
}

// ─── Packs ────────────────────────────────────────────────────────────────────

/** "45GX2" → 90, "1KG" → 1000. Used only to order packs of one product. */
function packGrams(sku) {
  const m = /-(\d+(?:\.\d+)?)(G|KG)(?:X(\d+))?$/i.exec(sku);
  if (!m) return Number.MAX_SAFE_INTEGER;
  const grams = Number(m[1]) * (m[2].toUpperCase() === "KG" ? 1000 : 1);
  return grams * (m[3] ? Number(m[3]) : 1);
}

const isAvailable = (catalogue, sku) =>
  Boolean(catalogue[sku]) && catalogue[sku].inStock !== false && !NEVER_RECOMMEND.includes(sku);

/**
 * The SKU to sell, honouring "out of stock → the next pack of the same product,
 * never a different product". Next means the next larger pack; if there is none,
 * the closest smaller one.
 *
 * With no catalogue (the live fetch failed) the planned SKU is returned as-is
 * and marked `live: false`, so the page can still recommend without pricing.
 */
export function pickPack(code, plannedSku, catalogue = {}) {
  const known = Object.keys(catalogue);
  if (!known.length) return { sku: plannedSku, live: false, substituted: false };
  if (isAvailable(catalogue, plannedSku)) return { sku: plannedSku, live: true, substituted: false };

  const prefix = `${code}-`;
  const siblings = known
    .filter((sku) => sku.startsWith(prefix) && isAvailable(catalogue, sku))
    .sort((a, b) => packGrams(a) - packGrams(b));
  const target = packGrams(plannedSku);
  const pick = siblings.find((s) => packGrams(s) > target) ?? siblings.filter((s) => packGrams(s) < target).pop();

  if (pick) return { sku: pick, live: true, substituted: true };
  return { sku: plannedSku, live: true, substituted: false, outOfStock: true };
}

// ─── The result ───────────────────────────────────────────────────────────────

const codeOf = (sku) => sku.split("-")[0];

function addOn(sku, label, catalogue) {
  const code = codeOf(sku);
  return { code, name: PRODUCT_NAMES[code], label, ...pickPack(code, sku, catalogue) };
}

/**
 * Everything the result screen shows, in the spec's six blocks.
 * Returns null if the flow is not finished.
 */
export function resolve(answers, catalogue = {}) {
  if (nextStep(answers) !== "result") return null;
  const { species, group } = ctx(answers);

  const noMatch = noMatchCase(answers);
  if (noMatch) {
    const c = NO_MATCH[noMatch];
    return {
      kind: "nomatch",
      case: noMatch,
      title: c.title,
      message: c.message,
      treat: c.treat ? addOn(c.treat.sku, c.treat.label, catalogue) : null,
    };
  }

  const fry = fryStage(answers);
  const feed = feedCode(answers);
  const size = validSize(answers)?.id;
  const msg = MESSAGES[fry ? "HATCHE" : feed];

  // 1 · Hero
  let plannedSku;
  let tier = null;
  if (fry) {
    plannedSku = HATCHE[fry].sku;
  } else {
    const tiers = PACK_TIERS[feed];
    tier = tiers.length > 1 ? tiers.find((t) => t.label === answers.count) : null;
    plannedSku = (tier ?? tiers[0]).sku;
  }
  const pondGoldfish = group.id === "goldfish" && !species.koi && feed === "K7";
  const basis = pondGoldfish ? "also" : species.basis;

  const hero = {
    code: feed,
    name: PRODUCT_NAMES[feed],
    badge: BADGES[basis],
    basis,
    ...pickPack(feed, plannedSku, catalogue),
  };

  // 2 · Why it fits
  const goal = fry ? "everyday" : answers.goal;
  const why = [msg.spec, msg[goal] ?? msg.everyday];

  // 3 · Feeding plan
  const plan = {
    ...FEEDING_PLANS[feed],
    forLine: tier ? `For ${tier.label} ${species.noun}` : null,
    stage: fry ? HATCHE[fry].why : null,
    notes: [],
  };
  if (group.id === "monster" && size === "juvenile") plan.notes.push(MONSTER_JUVENILE_NOTE);
  plan.notes.push(SWITCHING_NOTE);

  // 4 · Complete the routine
  const addOns = [];
  const mates = homeVersion(answers) && homeVersion(answers) !== "pond" ? answers.mates : [];
  for (const m of mates) {
    if (TANKMATE_ADDONS[m]) addOns.push(addOn(TANKMATE_ADDONS[m].sku, TANKMATE_ADDONS[m].label, catalogue));
  }
  const goalDef = GOALS.find((g) => g.id === answers.goal);
  if (!fry && goalDef?.addOn) addOns.push(addOn(goalDef.addOn.sku, goalDef.addOn.label, catalogue));
  const routine = addOns.filter((a, i) => a.code !== feed && addOns.findIndex((b) => b.code === a.code) === i);

  // 5 · What's next — grow-out path wins; otherwise the alternative.
  let next = null;
  if (fry) {
    const after = group.id === "bigcichlids" ? "C4" : species.feed;
    next = {
      type: "growout",
      code: after,
      name: PRODUCT_NAMES[after],
      text: species.koi
        ? "After Hatch'E, young koi need an in-between size until 15 cm — ask our feed expert."
        : `When they take adult pellets, move to ${PRODUCT_NAMES[after]}.`,
    };
  } else if (group.id === "bigcichlids" && size === "under8") {
    next = { type: "growout", code: "C5", name: PRODUCT_NAMES.C5, text: BIG_CICHLID_GROW_OUT };
  } else {
    let alt = null;
    if (mates.includes("small") && !SMALL_FISH_ALT.exceptGroups.includes(group.id)) {
      alt = { code: SMALL_FISH_ALT.feed, label: SMALL_FISH_ALT.label };
    } else if (mates.includes("fish") && group.id === "bottom") {
      alt = { code: BOTTOM_OTHER_ALT.feed, label: BOTTOM_OTHER_ALT.label, note: BOTTOM_OTHER_ALT.note };
    } else if (species.alt) {
      alt = { code: species.alt, label: "Also a good fit" };
    }
    if (alt && alt.code !== feed) next = { type: "alt", name: PRODUCT_NAMES[alt.code], ...alt };
  }

  return { kind: "match", species, group, hero, why, plan, routine, next, tier };
}

// ─── URL ⇄ answers ────────────────────────────────────────────────────────────

const KEYS = { species: "s", size: "z", mates: "m", home: "h", goal: "g", count: "n" };

export function toQuery(answers, step) {
  const p = new URLSearchParams();
  for (const [field, key] of Object.entries(KEYS)) {
    const v = answers[field];
    if (Array.isArray(v) ? v.length : v) p.set(key, Array.isArray(v) ? v.join(",") : v);
  }
  // A bare /find-my-feed is Q1. Once anything is answered the step is always
  // written, so a reload on Q1 with kept answers stays on Q1.
  if (step && (step !== "species" || p.toString())) p.set("step", step);
  return p.toString();
}

export function fromQuery(search) {
  const p = new URLSearchParams(search);
  const answers = { ...EMPTY_ANSWERS };
  for (const [field, key] of Object.entries(KEYS)) {
    const v = p.get(key);
    if (!v) continue;
    answers[field] = field === "mates" ? v.split(",").filter(Boolean) : v;
  }
  const step = p.get("step");
  return { answers, step: STEPS.includes(step) || step === "result" ? step : null };
}

// ─── Search & summaries ───────────────────────────────────────────────────────

const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]/g, "").trim();

/** Every name on every chip is searchable: "oranda" → Fancy Goldfish. */
export function searchSpecies(query) {
  const q = norm(query);
  if (q.length < 2) return [];
  const hits = [];
  for (const s of SPECIES) {
    const label = norm(s.label);
    const name = [s.label, ...s.names].find((n) => norm(n).includes(q));
    if (!name) continue;
    hits.push({ species: s, matched: name, rank: label.startsWith(q) ? 0 : norm(name).startsWith(q) ? 1 : 2 });
  }
  return hits.sort((a, b) => a.rank - b.rank).slice(0, 6);
}

/** Human-readable answers, for the summary chips and the expert chat. */
export function describeAnswers(answers) {
  const out = [];
  const { species, group } = ctx(answers);
  if (!species) return out;
  out.push({ step: "species", label: "Fish", value: species.group === "other" ? "Not listed" : species.label });
  const size = validSize(answers);
  if (size) out.push({ step: "size", label: "Size", value: size.hint ? `${size.label} (${size.hint})` : size.label });
  const v = homeVersion(answers);
  if (v && isValid("home", answers)) {
    const value =
      v === "pond"
        ? HOMES.find((h) => h.id === answers.home).label
        : answers.mates.map((m) => TANKMATES[v].find((o) => o.id === m).label).join(", ");
    out.push({ step: "home", label: v === "pond" ? "Home" : "Tank mates", value });
  }
  if (isValid("goal", answers)) out.push({ step: "goal", label: "Goal", value: GOALS.find((g) => g.id === answers.goal).label });
  if (isValid("count", answers)) out.push({ step: "count", label: "How many", value: `${answers.count} ${species.noun}` });
  if (group?.id === "other") out.length = 1;
  return out;
}

/** The message pre-filled into the expert chat, so nobody repeats themselves. */
export function expertMessage(answers, result) {
  const lines = ["Hi! I used Find My Feed and would like some advice."];
  for (const a of describeAnswers(answers)) lines.push(`${a.label}: ${a.value}`);
  if (result?.kind === "match") lines.push(`Recommended: ${result.hero.name} (${result.hero.sku})`);
  return lines.join("\n");
}
