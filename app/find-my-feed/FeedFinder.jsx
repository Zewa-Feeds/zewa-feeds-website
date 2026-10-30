"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { openExpertChat } from "@/components/TidioChat";
import { useCart } from "@/lib/cartContext";
import { discountPct, feedFinder, formatInr } from "@/lib/api";
import { COMPANY } from "@/lib/company";
import { COUNT_HELPER, GROUPS } from "@/lib/feedFinder/data";
import {
  EMPTY_ANSWERS,
  canShow,
  countTiers,
  describeAnswers,
  expertMessage,
  fromQuery,
  getGroup,
  getSpecies,
  goalOptions,
  homeOptions,
  homeVersion,
  nextStep,
  pickPack,
  previousStep,
  resolve,
  searchSpecies,
  sizeOptions,
  speciesInGroup,
  toQuery,
  visibleSteps,
} from "@/lib/feedFinder/engine";
import { PLACEHOLDER_IMAGE } from "@/app/products/adapters";

/**
 * Find My Feed — up to five single-tap questions, one exact SKU at the end.
 *
 * State lives in the URL (see engine.toQuery), so:
 *   - the browser's Back button walks the questions,
 *   - a result link can be shared and opens on the same result,
 *   - a reload never loses an answer.
 *
 * Answers are KEPT when the customer goes back: the earlier pick shows as
 * selected, and changing it only re-asks the questions it actually affects.
 */

// ─── Navigation ───────────────────────────────────────────────────────────────

/** Fill answers missing from a URL with the ones still held in memory. */
function mergeKept(kept, fromUrl) {
  const out = { ...kept };
  for (const [k, v] of Object.entries(fromUrl)) {
    if (Array.isArray(v) ? v.length : v) out[k] = v;
  }
  return out;
}

function initialState(query) {
  const { answers, step } = fromQuery(query);
  if (!answers.species) return { answers, step: "species" };
  return { answers, step: step && canShow(answers, step) ? step : nextStep(answers) };
}

/** Where to go after answering `step`: the next visible question, never a skip. */
function stepAfter(step, answers) {
  const steps = visibleSteps(answers);
  const next = steps[steps.indexOf(step) + 1];
  if (next) return canShow(answers, next) ? next : nextStep(answers);
  return nextStep(answers);
}

const STEP_TITLES = {
  species: "Who are we feeding?",
  size: "How big are they now?",
  goal: "What do you want to see more of?",
};

function stepTitle(step, answers) {
  if (step === "home") return homeVersion(answers) === "pond" ? "Where do they live?" : "Who's sharing the tank?";
  if (step === "count") return `How many ${getSpecies(answers.species)?.noun ?? "fish"} are you feeding?`;
  return STEP_TITLES[step];
}

// ─── Silhouettes ──────────────────────────────────────────────────────────────

/** Simple filled silhouettes, all facing right in a 64×40 box. */
const SHAPES = {
  tetra: (
    <>
      <path d="M12 20 3 13l2 7-2 7z" opacity=".55" />
      <path d="M10 20c6-7 24-8 40-3 4 1.5 6 2.5 6 3s-2 1.5-6 3c-16 5-34 4-40-3z" />
      <path d="M20 19.2h26" stroke="#06080f" strokeOpacity=".35" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  guppy: (
    <>
      <path d="M20 20C12 8 4 6 2 10c-2 6-2 14 0 20 2 4 10 2 18-10z" opacity=".5" />
      <path d="M18 20c4-6 20-7 30-2 2 1 3 1.6 3 2s-1 1-3 2c-10 5-26 4-30-2z" />
    </>
  ),
  betta: (
    <>
      <path d="M23 20C12 6 2 10 4 20c-2 10 8 14 19 0z" opacity=".5" />
      <path d="M26 16c-2-10 8-12 14-1zM26 24c-6 14 10 14 14 0z" opacity=".5" />
      <path d="M22 20c4-5 16-6 26-2 2 1 3 1.6 3 2s-1 1-3 2c-10 4-22 3-26-2z" />
    </>
  ),
  cichlid: (
    <>
      <path d="M17 20 7 13l2 7-2 7z" opacity=".55" />
      <path d="M24 13l6-11 6 9zM24 27l6 11 6-9z" opacity=".55" />
      <path d="M16 20c4-10 20-12 32-3 2 1.5 3 2.5 3 3s-1 1.5-3 3c-12 9-28 7-32-3z" />
    </>
  ),
  flowerhorn: (
    <>
      <path d="M13 20 3 12l2 8-2 8z" opacity=".55" />
      <path d="M12 20c2-8 14-11 24-10 4-4 12-4 14 2 4 3 6 6 6 8 0 3-4 7-12 8-14 3-28 0-32-8z" />
    </>
  ),
  arowana: (
    <>
      <path d="M8 20 1 15l1 5-1 5z" opacity=".55" />
      <path d="M6 20c4-5 24-6 46-4 5 .6 8 2 8 4s-3 3.4-8 4c-22 2-42 1-46-4z" />
      <path d="M58 22c1 3 2 5 4 6" stroke="currentColor" strokeWidth="1" fill="none" />
    </>
  ),
  goldfish: (
    <>
      <path d="M24 20C16 8 6 6 4 12c6 4 6 6 8 8-2 2-2 4-8 8 2 6 12 4 20-8z" opacity=".5" />
      <path d="M22 20c0-9 12-12 22-8 6 2.5 8 5 8 8s-2 5.5-8 8c-10 4-22 1-22-8z" />
    </>
  ),
  pleco: (
    <>
      <path d="M10 22 2 17l1 5-1 5z" opacity=".55" />
      <path d="M26 17l6-9 8 9z" opacity=".55" />
      <path d="M8 22c4-4 22-6 42-4 6 1 8 3 8 5s-4 3-10 3H14c-4 0-6-2-6-4z" />
    </>
  ),
  shrimp: (
    <>
      <path d="M50 15c6-7 10-9 12-9M48 14c3-6 6-9 9-10" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M50 14c-10-6-28-4-34 6-4 8 2 14 10 12-4-4-4-8 2-10 8-3 16-2 22 0z" />
      <path d="M26 26l-2 6M32 25l-1 6M38 24v6M44 23l1 5" stroke="currentColor" strokeWidth="1" opacity=".6" />
    </>
  ),
  mixed: (
    <>
      <g transform="translate(2 2) scale(.55)"><path d="M12 20 3 13l2 7-2 7z" opacity=".55" /><path d="M10 20c6-7 24-8 40-3 4 1.5 6 2.5 6 3s-2 1.5-6 3c-16 5-34 4-40-3z" /></g>
      <g transform="translate(24 16) scale(.6)"><path d="M20 20C12 8 4 6 2 10c-2 6-2 14 0 20 2 4 10 2 18-10z" opacity=".5" /><path d="M18 20c4-6 20-7 30-2 2 1 3 1.6 3 2s-1 1-3 2c-10 5-26 4-30-2z" /></g>
      <g transform="translate(6 22) scale(.45)"><path d="M17 20 7 13l2 7-2 7z" opacity=".55" /><path d="M16 20c4-10 20-12 32-3 2 1.5 3 2.5 3 3s-1 1.5-3 3c-12 9-28 7-32-3z" /></g>
    </>
  ),
  other: (
    <>
      <circle cx="32" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3" />
      <path d="M28 16.5c0-2.5 1.8-4 4-4s4 1.5 4 3.8c0 2-1.4 2.8-2.6 3.6-.9.6-1.4 1.2-1.4 2.4v.7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="27" r="1.3" />
    </>
  ),
  solo: (
    <>
      <circle cx="32" cy="20" r="17" fill="currentColor" opacity=".08" />
      <g transform="translate(14 8) scale(.6)"><path d="M12 20 3 13l2 7-2 7z" opacity=".55" /><path d="M10 20c6-7 24-8 40-3 4 1.5 6 2.5 6 3s-2 1.5-6 3c-16 5-34 4-40-3z" /></g>
    </>
  ),
  tank: (
    <>
      <rect x="10" y="6" width="44" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 13c5 2 9 2 14 0s9-2 14 0 11 2 16 0V31a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3z" opacity=".3" />
      <g transform="translate(22 15) scale(.4)"><path d="M10 20c6-7 24-8 40-3 4 1.5 6 2.5 6 3s-2 1.5-6 3c-16 5-34 4-40-3z" /></g>
    </>
  ),
  pond: (
    <>
      <ellipse cx="32" cy="24" rx="27" ry="11" opacity=".3" />
      <ellipse cx="32" cy="24" rx="27" ry="11" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M44 20a5 3 0 1 0 0 .1" opacity=".7" />
      <g transform="translate(14 18) scale(.38)"><path d="M22 20c0-9 12-12 22-8 6 2.5 8 5 8 8s-2 5.5-8 8c-10 4-22 1-22-8z" /></g>
    </>
  ),
};

function Silhouette({ shape, className = "", style }) {
  return (
    <svg viewBox="0 0 64 40" fill="currentColor" aria-hidden="true" className={className} style={style}>
      {SHAPES[shape] ?? SHAPES.tetra}
    </svg>
  );
}

const GOAL_ICONS = {
  growth: (
    <path d="M12 21V11m0 0c0-4 3-7 7-7 0 4-3 7-7 7zm0 0C12 7 9 4 5 4c0 4 3 7 7 7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
  ),
  colour: (
    <>
      <circle cx="9" cy="10" r="5" fill="currentColor" opacity=".9" />
      <circle cx="15" cy="10" r="5" fill="currentColor" opacity=".55" />
      <circle cx="12" cy="15" r="5" fill="currentColor" opacity=".3" />
    </>
  ),
  breeding: (
    <>
      <circle cx="8" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <circle cx="15.5" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <circle cx="12" cy="15" r="3.6" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <circle cx="12.6" cy="14.4" r="1" fill="currentColor" />
    </>
  ),
  treats: (
    <path d="M5 15c2-4 4-4 6-1s4 3 6-1 3-4 3-4M5 15c-.5 1.5.5 3 2 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  ),
};

// ─── Small pieces ─────────────────────────────────────────────────────────────

function Check({ on }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
        on ? "border-primary bg-primary text-[#00382d] scale-100" : "border-white/20 text-transparent scale-90"
      }`}
    >
      <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
        <path d="M2.5 6.2 5 8.5l4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** A big tappable tile. `selected` marks a kept answer; `dashed` is "Something else". */
function Tile({ selected, onClick, children, className = "", dashed = false, row = false, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex ${row ? "flex-row items-center gap-4" : "flex-col"} rounded-2xl border p-3.5 sm:p-4 text-left transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
        selected
          ? "border-primary bg-primary/10 shadow-[0_0_0_1px_rgba(68,229,194,0.35),0_10px_30px_-10px_rgba(68,229,194,0.35)]"
          : `${dashed ? "border-dashed border-white/15" : "border-white/8"} bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.05]`
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-5 bg-primary" />
      <span className="font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.28em] text-primary">{children}</span>
    </div>
  );
}

function SectionTitle({ children, aside }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="font-[Montserrat] text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">{children}</h2>
      {aside}
    </div>
  );
}

// ─── Q1 · Who are we feeding? ─────────────────────────────────────────────────

function SpeciesStep({ answers, groupHint, setGroupHint, onPick }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const panelRef = useRef(null);
  const hits = useMemo(() => searchSpecies(query), [query]);
  const openGroup = groupHint ?? getSpecies(answers.species)?.group ?? null;

  useEffect(() => setActive(0), [query]);

  // Bring the species row into view on phones, where it can land below the fold.
  useEffect(() => {
    if (!groupHint || !panelRef.current) return;
    const r = panelRef.current.getBoundingClientRect();
    if (r.bottom > window.innerHeight - 24) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [groupHint]);

  const tapGroup = (g) => {
    const list = speciesInGroup(g.id);
    if (list.length === 1) return onPick(list[0].id);
    setGroupHint(openGroup === g.id && groupHint ? null : g.id);
  };

  const onKey = (e) => {
    if (!hits.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, hits.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter") { e.preventDefault(); onPick(hits[active].species.id); }
  };

  return (
    <div>
      {/* Search */}
      <div className="relative mb-5">
        <label htmlFor="ff-search" className="sr-only">Search for your fish</label>
        <svg viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
          <path d="m13.5 13.5 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          id="ff-search"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search your fish — try “oranda”, “neon”, “bristlenose”"
          role="combobox"
          aria-expanded={hits.length > 0}
          aria-controls="ff-search-results"
          aria-activedescendant={hits.length ? `ff-hit-${active}` : undefined}
          className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 font-[Montserrat] text-[14px] text-white placeholder:text-white/30 transition-colors focus:border-primary/60 focus:bg-white/[0.06] focus:outline-none"
        />
        {query.trim().length >= 2 && (
          <div
            id="ff-search-results"
            role="listbox"
            className="ff-drop absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1321] shadow-2xl shadow-black/60"
          >
            {hits.length ? (
              hits.map((h, i) => (
                <button
                  key={h.species.id}
                  id={`ff-hit-${i}`}
                  role="option"
                  aria-selected={i === active}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => onPick(h.species.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${i === active ? "bg-primary/10" : ""}`}
                >
                  <Silhouette shape={getGroup(h.species.group).icon} className="h-6 w-9 shrink-0 text-primary/80" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-[Montserrat] text-[14px] font-semibold text-white">{h.matched}</span>
                    {h.matched !== h.species.label && (
                      <span className="block truncate font-[Montserrat] text-[11.5px] text-white/45">{h.species.label}</span>
                    )}
                  </span>
                  <span className="shrink-0 font-[Montserrat] text-[10.5px] text-white/30">{getGroup(h.species.group).label}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-4 font-[Montserrat] text-[13px] text-white/55">
                We don&apos;t have “{query.trim()}” listed yet.{" "}
                <button type="button" onClick={() => onPick("notlisted")} className="font-semibold text-primary underline-offset-2 hover:underline">
                  Ask our feed expert →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Group tiles — the species row is placed after the tapped tile and
          `grid-flow-dense` lets the following tiles backfill that row, so the
          row always lands directly under the tile's own row. */}
      <div className="grid grid-flow-dense grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {GROUPS.map((g) => {
          const isOpen = openGroup === g.id;
          const chosen = getSpecies(answers.species)?.group === g.id;
          const list = speciesInGroup(g.id);
          return [
            <Tile
              key={g.id}
              selected={isOpen || (chosen && !groupHint)}
              dashed={g.id === "other"}
              onClick={() => tapGroup(g)}
              aria-expanded={list.length > 1 ? isOpen : undefined}
              className="min-h-[124px] sm:min-h-[138px]"
            >
              <Silhouette
                shape={g.icon}
                className={`mb-2.5 h-10 w-16 transition-transform duration-300 group-hover:translate-x-0.5 ${isOpen || chosen ? "text-primary" : "text-primary/60"}`}
              />
              <span className="font-[Montserrat] text-[13px] font-semibold leading-snug text-white sm:text-[14px]">{g.label}</span>
              <span className="mt-1 font-[Montserrat] text-[11px] leading-snug text-white/45 sm:text-[11.5px]">{g.subtitle}</span>
            </Tile>,
            isOpen && list.length > 1 && (
              <div key={`${g.id}-chips`} ref={panelRef} className="ff-drop col-span-full rounded-2xl border border-primary/25 bg-[#0b1220] p-3 sm:p-4">
                <p className="mb-2.5 px-1 font-[Montserrat] text-[11px] font-bold uppercase tracking-[0.18em] text-primary/80">Pick the closest match</p>
                <div className="flex flex-wrap gap-2">
                  {list.map((s) => {
                    const on = answers.species === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onPick(s.id)}
                        className={`max-w-full rounded-xl border px-3.5 py-2.5 text-left transition-all duration-150 active:scale-[0.97] ${
                          on ? "border-primary bg-primary text-[#00382d]" : "border-white/10 bg-white/[0.04] text-white hover:border-primary/50"
                        }`}
                      >
                        <span className="block font-[Montserrat] text-[13px] font-semibold leading-snug">{s.label}</span>
                        {s.names.length > 0 && s.label.split(",").length === 1 && (
                          <span className={`block font-[Montserrat] text-[11px] leading-snug ${on ? "text-[#00382d]/70" : "text-white/45"}`}>
                            {s.names.join(" · ")}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ),
          ];
        })}
      </div>
    </div>
  );
}

// ─── Q2 · How big are they now? ───────────────────────────────────────────────

function SizeStep({ answers, onPick }) {
  const opts = sizeOptions(answers);
  const icon = getGroup(getSpecies(answers.species).group).icon;
  return (
    // Phones: three fry tiles on one row, the two grown sizes on the next.
    <div className="grid grid-cols-6 gap-2.5 sm:grid-cols-5 sm:gap-3">
      {opts.map((o, i) => (
        <Tile
          key={o.id}
          selected={answers.size === o.id}
          onClick={() => onPick(o.id)}
          className={`${i < 3 ? "col-span-2" : "col-span-3"} min-h-[132px] items-center justify-end text-center sm:col-span-1 sm:min-h-[168px]`}
        >
          <span className="flex flex-1 items-center justify-center">
            <Silhouette
              shape={icon}
              className={answers.size === o.id ? "text-primary" : "text-primary/65"}
              style={{ width: `${26 + i * 11}px`, height: "auto" }}
            />
          </span>
          <span className="mt-2 font-[Montserrat] text-[12.5px] font-semibold leading-tight text-white sm:text-[13.5px]">{o.label}</span>
          {o.hint && <span className="mt-0.5 font-[Montserrat] text-[10.5px] text-white/45 sm:text-[11px]">{o.hint}</span>}
          {o.fry && <span className="mt-1.5 rounded-full bg-white/5 px-2 py-0.5 font-[Montserrat] text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">Fry</span>}
        </Tile>
      ))}
    </div>
  );
}

// ─── Q3 · The home ────────────────────────────────────────────────────────────

function HomeStep({ answers, onPickHome, onConfirmMates }) {
  const version = homeVersion(answers);
  const opts = homeOptions(answers);
  const [mates, setMates] = useState(() => answers.mates ?? []);

  if (version === "pond") {
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {opts.map((o) => (
          <Tile key={o.id} selected={answers.home === o.id} onClick={() => onPickHome(o.id)} className="min-h-[150px] items-center justify-center text-center">
            <Silhouette shape={o.icon} className={`mb-3 h-14 w-24 ${answers.home === o.id ? "text-primary" : "text-primary/65"}`} />
            <span className="font-[Montserrat] text-[13.5px] font-semibold text-white">{o.label}</span>
          </Tile>
        ))}
      </div>
    );
  }

  const toggle = (o) => {
    // "Just them" is a complete answer on its own — one tap and move on.
    if (o.exclusive) return onConfirmMates([o.id]);
    setMates((cur) => {
      const rest = cur.filter((m) => m !== "just");
      return rest.includes(o.id) ? rest.filter((m) => m !== o.id) : [...rest, o.id];
    });
  };

  const chosen = mates.filter((m) => m !== "just");
  return (
    <div>
      <p className="-mt-2 mb-4 font-[Montserrat] text-[12.5px] text-white/45">Tap everyone who lives with them.</p>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {opts.map((o) => {
          const on = o.exclusive ? answers.mates?.[0] === "just" && !chosen.length : mates.includes(o.id);
          return (
            <Tile key={o.id} selected={on} onClick={() => toggle(o)} className="min-h-[124px]">
              <span className="mb-3 flex items-start justify-between">
                <Silhouette shape={o.icon} className={`h-9 w-14 ${on ? "text-primary" : "text-primary/65"}`} />
                {!o.exclusive && <Check on={on} />}
              </span>
              <span className="font-[Montserrat] text-[13px] font-semibold leading-snug text-white sm:text-[14px]">{o.label}</span>
            </Tile>
          );
        })}
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          disabled={!chosen.length}
          onClick={() => onConfirmMates(chosen)}
          className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3.5 font-[Montserrat] text-[12px] font-bold uppercase tracking-[0.14em] text-[#00382d] shadow-[0_0_20px_rgba(68,229,194,0.25)] transition-all duration-200 hover:bg-primary/90 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none"
        >
          Continue{chosen.length ? ` · ${chosen.length} selected` : ""}
          <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

// ─── Q4 · Goal ────────────────────────────────────────────────────────────────

function GoalStep({ answers, onPick }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
      {goalOptions(answers).map((g) => {
        const on = answers.goal === g.id;
        return (
          <Tile key={g.id} selected={on} onClick={() => onPick(g.id)} row className="sm:min-h-[96px]">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors ${on ? "border-primary/50 bg-primary/15 text-primary" : "border-white/10 bg-white/[0.04] text-primary/75"}`}>
              <svg viewBox="0 0 24 24" className="h-6 w-6">{GOAL_ICONS[g.icon]}</svg>
            </span>
            <span className="min-w-0">
              <span className="block font-[Montserrat] text-[14px] font-semibold text-white">{g.label}</span>
              <span className="mt-0.5 block font-[Montserrat] text-[12px] text-white/45">{g.hint}</span>
            </span>
          </Tile>
        );
      })}
    </div>
  );
}

// ─── Q5 · How many? ───────────────────────────────────────────────────────────

function CountStep({ answers, catalogue, onPick }) {
  const tiers = countTiers(answers);
  const code = tiers[0].sku.split("-")[0];
  return (
    <div>
      <p className="-mt-2 mb-4 flex items-center gap-2 font-[Montserrat] text-[12.5px] text-white/50">
        <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 shrink-0 text-primary/70"><path d="M8 1.5c2.5 2.6 4.5 5 4.5 7.5a4.5 4.5 0 0 1-9 0c0-2.5 2-4.9 4.5-7.5z" stroke="currentColor" strokeWidth="1.3" /></svg>
        {COUNT_HELPER}
      </p>
      <div className={`grid gap-2.5 sm:gap-3 ${tiers.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
        {tiers.map((t, i) => {
          const pack = catalogue[pickPack(code, t.sku, catalogue).sku]?.pack;
          const on = answers.count === t.label;
          return (
            <Tile key={t.label} selected={on} onClick={() => onPick(t.label)} className="min-h-[112px] items-center justify-center text-center">
              <span className="mb-2 flex h-5 items-end gap-[3px]" aria-hidden="true">
                {Array.from({ length: i + 1 + (tiers.length === 2 ? i : 0) }).map((_, k) => (
                  <span key={k} className={`h-2 w-2 rounded-full ${on ? "bg-primary" : "bg-primary/50"}`} style={{ marginBottom: k % 2 ? 6 : 0 }} />
                ))}
              </span>
              <span className="font-[Playfair_Display] text-[26px] leading-none text-white">{t.label}</span>
              {pack && <span className="mt-2 font-[Montserrat] text-[10.5px] text-white/40">{pack}</span>}
            </Tile>
          );
        })}
      </div>
    </div>
  );
}

// ─── Result ───────────────────────────────────────────────────────────────────

function PriceLine({ info, size = "lg" }) {
  if (!info) return null;
  const off = discountPct(info.mrpPaise, info.pricePaise);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={`font-[Montserrat] font-bold text-white ${size === "lg" ? "text-[24px]" : "text-[15px]"}`}>{formatInr(info.pricePaise)}</span>
      {off > 0 && (
        <>
          <span className={`font-[Montserrat] text-white/35 line-through ${size === "lg" ? "text-[14px]" : "text-[12px]"}`}>{formatInr(info.mrpPaise)}</span>
          <span className="rounded-full bg-primary/15 px-2 py-0.5 font-[Montserrat] text-[10.5px] font-bold text-primary">{off}% off</span>
        </>
      )}
    </div>
  );
}

function useAdd(onAdded) {
  const { items, addToCart } = useCart();
  const inCart = (sku) => items.some((i) => i.sku === sku);
  const add = (info) => {
    if (!info || info.inStock === false) return;
    addToCart({
      sku: info.sku,
      name: info.name,
      slug: info.slug,
      pack: info.pack,
      pricePaise: info.pricePaise,
      mrpPaise: info.mrpPaise,
      image: info.image,
      accentBg: info.accentBg,
    });
    onAdded?.(info.sku);
  };
  return { add, inCart };
}

function ProductThumb({ info, className = "" }) {
  return (
    <div className={`overflow-hidden ${className}`} style={{ background: info?.accentBg ?? "#f4f7f6" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={info?.image ?? PLACEHOLDER_IMAGE} alt={info?.name ?? ""} className="h-full w-full object-contain" loading="lazy" />
    </div>
  );
}

function Result({ answers, result, catalogue, onEdit, onRestart, onAdded, notify }) {
  const { add, inCart } = useAdd(onAdded);
  const heroCta = useRef(null);
  const [showBar, setShowBar] = useState(false);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    if (!heroCta.current || result.kind !== "match") return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(heroCta.current);
    return () => io.disconnect();
  }, [result]);

  const askExpert = async () => {
    setAsking(true);
    const msg = expertMessage(answers, result);
    const opened = await openExpertChat(msg);
    setAsking(false);
    if (!opened) {
      try { await navigator.clipboard.writeText(msg); } catch { /* clipboard blocked — the call link still works */ }
      notify(
        <span>
          Chat didn&apos;t load — your answers are copied. Call us on{" "}
          <a href={COMPANY.phoneHref} className="font-semibold text-primary underline">{COMPANY.phone}</a>
        </span>,
        8000,
      );
    }
  };

  const share = async () => {
    const url = window.location.href;
    const title = result.kind === "match" ? `${result.hero.name} — my Find My Feed result` : "Find My Feed";
    try {
      if (navigator.share) return await navigator.share({ title, url });
      await navigator.clipboard.writeText(url);
      notify("Link copied — anyone with it sees this result.");
    } catch (e) {
      if (e?.name !== "AbortError") notify("Couldn't copy the link. You can copy it from the address bar.");
    }
  };

  const summary = describeAnswers(answers);
  const Summary = (
    <div className="mb-6 flex flex-wrap gap-1.5">
      {summary.map((s) => (
        <button
          key={s.step}
          type="button"
          onClick={() => onEdit(s.step)}
          className="group inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-[Montserrat] text-[11.5px] text-white/70 transition-colors hover:border-primary/40 hover:text-white"
          aria-label={`Change ${s.label.toLowerCase()}: ${s.value}`}
        >
          <span className="text-white/35">{s.label}</span>
          <span className="truncate font-semibold">{s.value}</span>
          <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5 shrink-0 text-white/30 group-hover:text-primary"><path d="M8.5 1.5l2 2L4 10H2V8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
        </button>
      ))}
    </div>
  );

  const FooterActions = (
    <div className="mt-10 rounded-3xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-[Montserrat] text-[13.5px] text-white/60">
          Not quite right?{" "}
          <button type="button" onClick={askExpert} disabled={asking} className="font-semibold text-primary underline-offset-4 hover:underline disabled:opacity-60">
            {asking ? "Opening chat…" : "Ask our feed expert"}
          </button>
          <span className="block text-[11.5px] text-white/35">We&apos;ll already have your answers.</span>
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={share} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2.5 font-[Montserrat] text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:flex-none">
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5"><path d="M8 10V2m0 0L5 5m3-3 3 3M3 9v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Share result
          </button>
          <button type="button" onClick={onRestart} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2.5 font-[Montserrat] text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:flex-none">
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5"><path d="M2.5 8a5.5 5.5 0 1 0 1.7-4M2.5 2.5V5H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Start over
          </button>
        </div>
      </div>
    </div>
  );

  // ── No match ───────────────────────────────────────────────────────────────
  if (result.kind === "nomatch") {
    const treat = result.treat && catalogue[result.treat.sku];
    return (
      <div>
        {Summary}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 p-6 text-center sm:p-10" style={{ background: "linear-gradient(150deg, #0d1a2d 0%, #06111a 100%)" }}>
          <div className="absolute left-0 right-0 top-0 h-[2px]" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.8) 50%, transparent)" }} />
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7"><path d="M21 12c0 4.4-4 8-9 8-1.4 0-2.8-.3-4-.8L3 20l1.3-3.6C3.5 15.2 3 13.6 3 12c0-4.4 4-8 9-8s9 3.6 9 8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
          </div>
          <h2 className="mb-3 font-[Playfair_Display] text-[26px] text-white sm:text-[32px]">{result.title}</h2>
          <p className="mx-auto mb-7 max-w-[440px] font-[Montserrat] text-[14.5px] leading-relaxed text-white/65">{result.message}</p>
          <button
            type="button"
            onClick={askExpert}
            disabled={asking}
            className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-4 font-[Montserrat] text-[12px] font-bold uppercase tracking-[0.14em] text-[#00382d] shadow-[0_0_24px_rgba(68,229,194,0.3)] transition-all hover:bg-primary/90 active:scale-[0.97] disabled:opacity-70"
          >
            {asking ? "Opening chat…" : "Ask our feed expert"}
          </button>
          <p className="mt-3 font-[Montserrat] text-[11.5px] text-white/35">Your answers go with you — no need to repeat yourself.</p>
        </div>

        {treat && (
          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
            <ProductThumb info={treat} className="h-20 w-20 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <span className="mb-1 inline-block rounded-full bg-amber-300/15 px-2 py-0.5 font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">{result.treat.label}</span>
              <p className="truncate font-[Montserrat] text-[14px] font-semibold text-white">{result.treat.name}</p>
              <PriceLine info={treat} size="sm" />
            </div>
            <AddButton info={treat} inCart={inCart(treat.sku)} onAdd={() => add(treat)} />
          </div>
        )}
        {FooterActions}
      </div>
    );
  }

  // ── Match ──────────────────────────────────────────────────────────────────
  const { hero, why, plan, routine, next } = result;
  const info = catalogue[hero.sku];
  const heroInCart = info && inCart(info.sku);
  const routineInfos = routine.map((r) => ({ ...r, info: catalogue[r.sku] })).filter((r) => r.info);
  const addAll = () => {
    if (info && !heroInCart) add(info);
    for (const r of routineInfos) if (!inCart(r.sku) && r.info.inStock !== false) add(r.info);
  };
  const nextInfo = next?.code ? Object.values(catalogue).find((c) => c.sku.startsWith(`${next.code}-`)) : null;

  return (
    <div>
      {Summary}

      {/* 1 · Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20" style={{ background: "linear-gradient(150deg, #0d1a2d 0%, #06111a 100%)" }}>
        <div className="absolute left-0 right-0 top-0 z-10 h-[2px]" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.8) 50%, transparent)" }} />
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="relative">
            <ProductThumb info={info ?? { name: hero.name }} className="aspect-[4/3] w-full sm:aspect-auto sm:h-full sm:min-h-[340px]" />
            <span className={`absolute left-3 top-3 rounded-full px-3 py-1 font-[Montserrat] text-[10.5px] font-bold uppercase tracking-[0.12em] shadow-lg ${hero.basis === "primary" ? "bg-primary text-[#00382d]" : "bg-[#0d1321] text-primary ring-1 ring-primary/40"}`}>
              {hero.badge}
            </span>
          </div>
          <div className="flex flex-col p-5 sm:p-7">
            <Eyebrow>Your match</Eyebrow>
            <h2 className="mt-3 font-[Playfair_Display] text-[28px] leading-tight text-white sm:text-[34px]">{hero.name}</h2>
            {plan.stage && <p className="mt-1.5 font-[Montserrat] text-[12px] text-white/45">{plan.stage}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 font-[Montserrat] text-[12px] font-semibold text-white">
                <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-primary"><path d="M3 5.5 8 3l5 2.5v5L8 13l-5-2.5z M3 5.5 8 8l5-2.5M8 8v5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
                {info?.pack ?? hero.sku}
              </span>
              {result.tier && <span className="font-[Montserrat] text-[11.5px] text-white/40">sized for {result.tier.label} {result.species.noun}</span>}
            </div>
            {hero.substituted && (
              <p className="mt-2 font-[Montserrat] text-[11.5px] text-amber-200/80">Your usual size is out of stock, so we&apos;ve picked the next pack up.</p>
            )}

            <div className="mt-5">
              {info ? <PriceLine info={info} /> : <p className="font-[Montserrat] text-[13px] text-white/45">Live price unavailable right now.</p>}
              {info?.inStock === false || hero.outOfStock ? (
                <p className="mt-1 font-[Montserrat] text-[12px] font-semibold text-amber-200">Out of stock</p>
              ) : info ? (
                <p className="mt-1 flex items-center gap-1.5 font-[Montserrat] text-[11.5px] text-primary/80"><span className="h-1.5 w-1.5 rounded-full bg-primary" />In stock · ships from Kerala</p>
              ) : null}
            </div>

            <div ref={heroCta} className="mt-5 flex flex-col gap-2.5 sm:mt-auto sm:pt-6">
              {info && info.inStock !== false && !hero.outOfStock ? (
                <button
                  type="button"
                  onClick={() => add(info)}
                  className={`inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 font-[Montserrat] text-[12px] font-bold uppercase tracking-[0.14em] transition-all active:scale-[0.98] ${heroInCart ? "border border-primary/40 bg-primary/10 text-primary" : "bg-primary text-[#00382d] shadow-[0_0_24px_rgba(68,229,194,0.3)] hover:bg-primary/90"}`}
                >
                  {heroInCart ? "Added · Add another" : "Add to cart"}
                </button>
              ) : (
                <button type="button" onClick={askExpert} className="inline-flex w-full items-center justify-center rounded-full border border-primary/40 px-6 py-4 font-[Montserrat] text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
                  Ask our feed expert
                </button>
              )}
              {info?.slug && (
                <Link href={`/products/${info.slug}`} className="text-center font-[Montserrat] text-[11.5px] text-white/40 underline-offset-4 hover:text-white/70 hover:underline">
                  See full product details
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 2 · Why it fits */}
        <section>
          <SectionTitle>Why it fits</SectionTitle>
          <ul className="space-y-2.5">
            {why.map((w, i) => (
              <li key={i} className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3"><path d="M2.5 6.2 5 8.5l4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span className="font-[Montserrat] text-[13.5px] leading-relaxed text-white/80">{w}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3 · Feeding plan */}
        <section>
          <SectionTitle aside={plan.forLine && <span className="font-[Montserrat] text-[11.5px] text-primary/80">{plan.forLine}</span>}>Your feeding plan</SectionTitle>
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
            {[
              { k: "How often", v: plan.often, icon: <><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" /><path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></> },
              { k: "How much", v: plan.amount, icon: <><path d="M3 7h10l-1.2 5.2a1 1 0 0 1-1 .8H5.2a1 1 0 0 1-1-.8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><circle cx="6" cy="4.5" r="1" fill="currentColor" /><circle cx="9.5" cy="3.5" r="1" fill="currentColor" /></> },
              { k: "Tip", v: plan.tip, icon: <path d="M8 2a4 4 0 0 0-2.4 7.2c.5.4.9 1 .9 1.6V12h3v-1.2c0-.6.4-1.2.9-1.6A4 4 0 0 0 8 2zM6.5 14h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /> },
            ].map((row, i) => (
              <div key={row.k} className={`flex gap-3.5 p-4 ${i ? "border-t border-white/6" : ""}`}>
                <svg viewBox="0 0 16 16" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-primary/80">{row.icon}</svg>
                <div>
                  <p className="font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">{row.k}</p>
                  <p className="mt-0.5 font-[Montserrat] text-[13.5px] text-white/85">{row.v}</p>
                </div>
              </div>
            ))}
          </div>
          <ul className="mt-3 space-y-1.5">
            {plan.notes.map((n) => (
              <li key={n} className="flex gap-2 font-[Montserrat] text-[12px] leading-relaxed text-white/45">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                {n}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 4 · Complete the routine */}
      {routineInfos.length > 0 && (
        <section className="mt-10">
          <SectionTitle
            aside={
              info && info.inStock !== false && (
                <button type="button" onClick={addAll} className="font-[Montserrat] text-[11.5px] font-semibold text-primary underline-offset-4 hover:underline">
                  Add everything
                </button>
              )
            }
          >
            Complete the routine
          </SectionTitle>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {routineInfos.map((r) => (
              <div key={r.sku} className="flex items-center gap-3.5 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                <ProductThumb info={r.info} className="h-16 w-16 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="font-[Montserrat] text-[10.5px] font-bold uppercase tracking-[0.12em] text-primary/80">{r.label}</p>
                  <p className="truncate font-[Montserrat] text-[13.5px] font-semibold text-white">{r.name} <span className="font-normal text-white/40">· {r.info.pack}</span></p>
                  <PriceLine info={r.info} size="sm" />
                </div>
                <AddButton info={r.info} inCart={inCart(r.sku)} onAdd={() => add(r.info)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5 · What's next */}
      {next && (
        <section className="mt-10">
          <SectionTitle>What&apos;s next</SectionTitle>
          <div className="flex items-center gap-4 rounded-2xl border border-dashed border-white/12 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
              {next.type === "growout" ? (
                <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4"><path d="M3 12 7 8l2.5 2.5L13 6m0 0v3m0-3h-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4"><path d="M4 6h9l-3-3M12 10H3l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-[Montserrat] text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/40">{next.type === "growout" ? "As they grow" : next.label}</p>
              <p className="mt-0.5 font-[Montserrat] text-[13.5px] text-white/85">
                {next.type === "growout" ? next.text : next.name}
              </p>
              {next.note && <p className="mt-0.5 font-[Montserrat] text-[12px] text-white/45">{next.note}</p>}
            </div>
            {nextInfo?.slug && (
              <Link href={`/products/${nextInfo.slug}`} className="shrink-0 font-[Montserrat] text-[11.5px] font-semibold text-primary underline-offset-4 hover:underline">
                View
              </Link>
            )}
          </div>
        </section>
      )}

      {/* 6 · Footer */}
      {FooterActions}

      {/* Phones: keep the buy button in reach once the hero scrolls away. */}
      {info && info.inStock !== false && !hero.outOfStock && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#06080f]/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 sm:hidden ${showBar ? "translate-y-0" : "translate-y-full"}`}
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          aria-hidden={!showBar}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-[Montserrat] text-[12.5px] font-semibold text-white">{hero.name} · {info.pack}</p>
              <p className="font-[Montserrat] text-[13px] font-bold text-primary">{formatInr(info.pricePaise)}</p>
            </div>
            <button
              type="button"
              tabIndex={showBar ? 0 : -1}
              onClick={() => add(info)}
              className="shrink-0 rounded-full bg-primary px-5 py-3 font-[Montserrat] text-[11.5px] font-bold uppercase tracking-[0.12em] text-[#00382d]"
            >
              {heroInCart ? "Add another" : "Add to cart"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddButton({ info, inCart, onAdd }) {
  if (info.inStock === false) return <span className="shrink-0 font-[Montserrat] text-[11px] text-white/35">Out of stock</span>;
  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={inCart ? `Add another ${info.name}` : `Add ${info.name}`}
      className={`shrink-0 rounded-full px-4 py-2 font-[Montserrat] text-[11px] font-bold uppercase tracking-[0.1em] transition-all active:scale-95 ${inCart ? "border border-primary/40 text-primary" : "bg-primary text-[#00382d] hover:bg-primary/90"}`}
    >
      {inCart ? "Added ✓" : "Add"}
    </button>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function FeedFinder({ catalogue, initialQuery }) {
  const [state, setState] = useState(() => initialState(initialQuery));
  const [groupHint, setGroupHint] = useState(null);
  const [direction, setDirection] = useState("forward");
  const [toast, setToast] = useState(null);
  const kept = useRef(state.answers);
  const headingRef = useRef(null);
  const firstRender = useRef(true);
  const runRef = useRef({ key: null, id: null });

  const { answers, step } = state;
  kept.current = answers;

  const notify = useCallback((message, ms = 3200) => {
    setToast({ message, id: Date.now() });
    setTimeout(() => setToast((t) => (t && Date.now() - t.id >= ms - 50 ? null : t)), ms);
  }, []);

  const go = useCallback((nextStepId, nextAnswers, { replace = false, back = false } = {}) => {
    const qs = toQuery(nextAnswers, nextStepId);
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
    const depth = (window.history.state?.ffDepth ?? 0) + (replace ? 0 : 1);
    window.history[replace ? "replaceState" : "pushState"]({ ...window.history.state, ffDepth: depth }, "", url);
    setDirection(back ? "back" : "forward");
    setGroupHint(null);
    setState({ answers: nextAnswers, step: nextStepId });
  }, []);

  // Browser Back/Forward: the URL is the source of truth, kept answers fill the gaps.
  useEffect(() => {
    const onPop = () => {
      const { answers: fromUrl, step: urlStep } = fromQuery(window.location.search);
      const merged = mergeKept(kept.current, fromUrl);
      const target = !urlStep || urlStep === "species" ? "species" : canShow(merged, urlStep) ? urlStep : nextStep(merged);
      setDirection("back");
      setGroupHint(null);
      setState({ answers: merged, step: target });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Normalise a hand-edited or stale URL to the step actually shown.
  useEffect(() => {
    const qs = toQuery(answers, step);
    if (window.location.search.replace(/^\?/, "") !== qs) {
      window.history.replaceState({ ...window.history.state, ffDepth: window.history.state?.ffDepth ?? 0 }, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    }
    // Only on mount — later changes always go through go().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Move focus and scroll with each step, so keyboard and screen-reader users
  // land on the new question rather than on a button that no longer exists.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    window.scrollTo({ top: 0, behavior: "smooth" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const result = useMemo(() => (step === "result" ? resolve(answers, catalogue) : null), [step, answers, catalogue]);

  // Every completed run is logged — no-match runs too. Once per distinct result.
  useEffect(() => {
    if (!result) return;
    const key = toQuery(answers, "result");
    if (runRef.current.key === key) return;
    runRef.current = { key, id: null };
    feedFinder
      .logRun({
        answers,
        outcome: result.kind === "match" ? "MATCH" : "NO_MATCH",
        noMatchCase: result.kind === "nomatch" ? result.case : null,
        resultSku: result.kind === "match" ? result.hero.sku : null,
        addOnSkus: result.kind === "match" ? result.routine.map((r) => r.sku) : result.treat ? [result.treat.sku] : [],
      })
      .then((run) => { if (runRef.current.key === key) runRef.current.id = run?.id ?? null; })
      .catch(() => { /* logging is best-effort */ });
  }, [result, answers]);

  const onAdded = useCallback((sku) => {
    const id = runRef.current.id;
    if (id) feedFinder.logAddToCart(id, sku).catch(() => {});
  }, []);

  // ── Answer handlers ────────────────────────────────────────────────────────
  const answer = (field, value) => {
    const nextAnswers = { ...answers, [field]: value };
    go(stepAfter(step, nextAnswers), nextAnswers);
  };

  const back = () => {
    if (step === "species") { setGroupHint(null); return; }
    const prev = previousStep(answers, step);
    if (!prev) return;
    if ((window.history.state?.ffDepth ?? 0) > 0) window.history.back();
    else go(prev, answers, { replace: true, back: true });
  };

  const restart = () => {
    runRef.current = { key: null, id: null };
    go("species", { ...EMPTY_ANSWERS });
  };

  const edit = (target) => go(target, answers);

  // ── Progress ───────────────────────────────────────────────────────────────
  const steps = visibleSteps(answers, step === "species" ? groupHint : null);
  const index = step === "result" ? steps.length : Math.max(0, steps.indexOf(step));
  const canFinish = step !== "result" && canShow(answers, "result") && index < steps.length - 1;

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-[#06080f] pb-24 pt-24 text-[#dde2f6] sm:pt-28">
        {/* Ambient glow, as on the shop's Feed Finder section */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] max-w-[160vw] -translate-x-1/2" style={{ background: "radial-gradient(ellipse, rgba(68,229,194,0.08) 0%, transparent 65%)", filter: "blur(60px)" }} />

        <div className="relative mx-auto w-full max-w-[880px] px-4 sm:px-8">
          {/* Progress */}
          <div className="mb-7 sm:mb-9">
            <div className="mb-3 flex items-center justify-between gap-3">
              {step !== "species" || groupHint ? (
                <button type="button" onClick={back} className="inline-flex items-center gap-1.5 rounded-full px-1 py-1 font-[Montserrat] text-[12px] font-semibold text-white/55 transition-colors hover:text-white">
                  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3"><path d="M10 6H2m0 0 4-4M2 6l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Back
                </button>
              ) : (
                <Eyebrow>Find My Feed</Eyebrow>
              )}
              <span className="font-[Montserrat] text-[11px] font-semibold tabular-nums text-white/40">
                {step === "result" ? "Your result" : `Question ${index + 1} of ${steps.length}`}
              </span>
            </div>
            <div
              className="flex gap-1.5"
              role="progressbar"
              aria-label="Progress"
              aria-valuemin={0}
              aria-valuemax={steps.length}
              aria-valuenow={index}
            >
              {steps.map((s, i) => (
                <span key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
                  <span className="block h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: i < index ? "100%" : i === index && step !== "result" ? "35%" : "0%" }} />
                </span>
              ))}
            </div>
          </div>

          {/* Step */}
          <div key={step} className={direction === "back" ? "ff-back" : "ff-in"}>
            {step !== "result" && (
              <div className="mb-6 sm:mb-8">
                <h1 ref={headingRef} tabIndex={-1} className="font-[Playfair_Display] text-[30px] leading-[1.1] text-white outline-none sm:text-[44px]">
                  {stepTitle(step, answers)}
                </h1>
                {step === "species" && (
                  <p className="mt-3 max-w-[520px] font-[Montserrat] text-[13.5px] leading-relaxed text-white/45 sm:text-[14.5px]">
                    A few quick taps and we&apos;ll match one exact pack — plus a feeding plan made for your fish.
                  </p>
                )}
              </div>
            )}
            {step === "result" && <h1 ref={headingRef} tabIndex={-1} className="sr-only">Your Find My Feed result</h1>}

            {step === "species" && <SpeciesStep answers={answers} groupHint={groupHint} setGroupHint={setGroupHint} onPick={(id) => answer("species", id)} />}
            {step === "size" && <SizeStep answers={answers} onPick={(v) => answer("size", v)} />}
            {step === "home" && (
              <HomeStep answers={answers} onPickHome={(v) => answer("home", v)} onConfirmMates={(v) => answer("mates", v)} />
            )}
            {step === "goal" && <GoalStep answers={answers} onPick={(v) => answer("goal", v)} />}
            {step === "count" && <CountStep answers={answers} catalogue={catalogue} onPick={(v) => answer("count", v)} />}
            {step === "result" && result && (
              <Result answers={answers} result={result} catalogue={catalogue} onEdit={edit} onRestart={restart} onAdded={onAdded} notify={notify} />
            )}

            {canFinish && (
              <div className="mt-8 text-center">
                <button type="button" onClick={() => go("result", answers)} className="font-[Montserrat] text-[12px] font-semibold text-white/45 underline-offset-4 hover:text-primary hover:underline">
                  Keep my other answers and see my result →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 sm:bottom-8">
          {toast && (
            <div key={toast.id} className="ff-in pointer-events-auto max-w-[420px] rounded-2xl border border-white/10 bg-[#0d1321] px-4 py-3 font-[Montserrat] text-[12.5px] text-white/80 shadow-2xl shadow-black/60">
              {toast.message}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
