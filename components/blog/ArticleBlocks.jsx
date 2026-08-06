"use client";

import { useState } from "react";

/**
 * Rich block renderers for Knowledge Hub articles.
 *
 * The article page already rendered lead / h2 / p / pullquote / stat-block
 * inline. Those stay there; this module adds the longer-form blocks — tables,
 * callouts, FAQ, references — that would otherwise bloat that file.
 *
 * Every block takes `accent` (the article's tagColour) so a single article reads
 * as one palette rather than a set of unrelated components.
 */

/* ── Comparison table ──────────────────────────────────────────────────────
 * Horizontally scrollable on small screens rather than squashed: a six-row
 * five-column matrix cannot wrap legibly under 640px, and a scroll hint is
 * more honest than truncated text.
 */
export function ComparisonTable({ block, accent }) {
  const { headers, rows, caption, highlightColumn } = block;

  return (
    <figure className="my-10">
      <div
        className="overflow-x-auto rounded-2xl border border-white/8"
        style={{ background: "linear-gradient(135deg,#0b1828 0%,#081917 100%)" }}
      >
        <table className="w-full border-collapse text-left" style={{ minWidth: 620 }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={h}
                  scope="col"
                  className="whitespace-nowrap px-4 py-4 font-[Montserrat] text-[10.5px] font-bold uppercase tracking-[0.14em] sm:px-5"
                  style={{
                    color: i === highlightColumn ? accent : "rgba(255,255,255,0.32)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    background: i === highlightColumn ? `${accent}0a` : "transparent",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={row[0]}>
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className={`px-4 py-3.5 font-[Montserrat] text-[13px] leading-snug sm:px-5 ${
                      c === 0 ? "font-semibold text-white/70" : "text-white/50"
                    }`}
                    style={{
                      borderBottom:
                        r < rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      background: c === highlightColumn ? `${accent}0a` : "transparent",
                      color: c === highlightColumn ? "rgba(255,255,255,0.82)" : undefined,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {caption && (
        <figcaption className="mt-3 font-[Montserrat] text-[11.5px] leading-relaxed text-white/25">
          {caption}
          <span className="ml-2 sm:hidden">Scroll the table sideways to see every column.</span>
        </figcaption>
      )}
    </figure>
  );
}

/* ── Callout ───────────────────────────────────────────────────────────────
 * `brand` uses the article accent; `info` stays neutral so a page with several
 * callouts does not turn into a wall of colour.
 */
export function Callout({ block, accent }) {
  const brand = block.variant === "brand";
  const tone = brand ? accent : "#5BA8FF";

  return (
    <aside
      className="my-9 flex gap-4 rounded-2xl p-5 sm:p-6"
      style={{ background: `${tone}0a`, border: `1px solid ${tone}24` }}
    >
      <svg viewBox="0 0 20 20" fill="none" className="mt-[2px] h-5 w-5 shrink-0" style={{ color: tone }} aria-hidden="true">
        <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 6.2v.2M10 9v4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <div>
        {block.title && (
          <p className="mb-1.5 font-[Montserrat] text-[12.5px] font-bold tracking-wide" style={{ color: tone }}>
            {block.title}
          </p>
        )}
        <p className="font-[Montserrat] text-[13.5px] leading-[1.7] text-white/60">{block.text}</p>
      </div>
    </aside>
  );
}

/* ── Did you know ─────────────────────────────────────────────────────────── */
export function DidYouKnow({ block, accent }) {
  return (
    <aside
      className="relative my-10 overflow-hidden rounded-2xl p-6 sm:p-7"
      style={{
        background: "linear-gradient(135deg,#0c1828 0%,#091917 100%)",
        border: `1px solid ${accent}22`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 40% 70% at 90% 0%, ${accent}14, transparent 70%)` }}
      />
      <div className="relative flex items-center gap-2.5">
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" style={{ color: accent }} aria-hidden="true">
          <path
            d="M7.5 15.5h5M8 12.8a4.5 4.5 0 1 1 4 0v1.2a.8.8 0 0 1-.8.8h-2.4a.8.8 0 0 1-.8-.8v-1.2Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className="font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.22em]"
          style={{ color: accent }}
        >
          Did you know
        </span>
      </div>
      <p className="relative mt-3 font-[Playfair_Display] text-[17px] leading-snug text-white/85 sm:text-[19px]">
        {block.title}
      </p>
      <p className="relative mt-2.5 font-[Montserrat] text-[13.5px] leading-[1.7] text-white/55">
        {block.text}
      </p>
    </aside>
  );
}

/* ── Pros & cons ──────────────────────────────────────────────────────────── */
export function ProsCons({ block, accent }) {
  return (
    <div className="my-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {block.items.map((item) => (
        <div
          key={item.name}
          className="rounded-2xl border border-white/7 p-5"
          style={{ background: "rgba(255,255,255,0.015)" }}
        >
          <p className="mb-4 font-[Playfair_Display] text-[17px] text-white/85">{item.name}</p>

          <ul className="mb-4 space-y-2">
            {item.pros.map((pro) => (
              <li key={pro} className="flex items-start gap-2.5">
                <svg viewBox="0 0 16 16" fill="none" className="mt-[3px] h-3.5 w-3.5 shrink-0" style={{ color: accent }} aria-hidden="true">
                  <path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-[Montserrat] text-[12.5px] leading-snug text-white/60">{pro}</span>
              </li>
            ))}
          </ul>

          <ul className="space-y-2 border-t border-white/6 pt-4">
            {item.cons.map((con) => (
              <li key={con} className="flex items-start gap-2.5">
                <svg viewBox="0 0 16 16" fill="none" className="mt-[3px] h-3.5 w-3.5 shrink-0 text-white/25" aria-hidden="true">
                  <path d="M4.5 8h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span className="font-[Montserrat] text-[12.5px] leading-snug text-white/35">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ── Key takeaways ────────────────────────────────────────────────────────── */
export function Takeaways({ block, accent }) {
  return (
    <aside
      className="my-10 rounded-2xl p-6 sm:p-7"
      style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="h-px w-5" style={{ background: accent }} />
        <span
          className="font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.22em]"
          style={{ color: accent }}
        >
          {block.title}
        </span>
      </div>
      <ul className="space-y-3.5">
        {block.items.map((item, i) => (
          <li key={item} className="flex items-start gap-3.5">
            <span
              className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-[Montserrat] text-[10px] font-bold"
              style={{ background: `${accent}1c`, color: accent }}
            >
              {i + 1}
            </span>
            <span className="font-[Montserrat] text-[13.5px] leading-[1.65] text-white/62">{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ── FAQ accordion ────────────────────────────────────────────────────────── */
export function Faq({ block, accent }) {
  // First answer open: it is the question most readers arrived with, and an
  // entirely collapsed block reads as empty.
  const [open, setOpen] = useState(0);

  return (
    <div className="my-8 divide-y divide-white/6 overflow-hidden rounded-2xl border border-white/7">
      {block.items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-white/[0.02] sm:px-6"
            >
              <span className="font-[Montserrat] text-[13.5px] font-semibold leading-snug text-white/78">
                {item.q}
              </span>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="mt-[3px] h-4 w-4 shrink-0 transition-transform duration-300"
                style={{ color: accent, transform: isOpen ? "rotate(45deg)" : "none" }}
                aria-hidden="true"
              >
                <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 font-[Montserrat] text-[13px] leading-[1.75] text-white/48 sm:px-6">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── References ───────────────────────────────────────────────────────────── */
export function References({ block, accent }) {
  return (
    <ol className="my-8 space-y-4">
      {block.items.map((ref) => (
        <li key={ref.n} className="flex gap-3.5">
          <span
            className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded font-[Montserrat] text-[10px] font-bold"
            style={{ background: `${accent}14`, color: accent }}
          >
            {ref.n}
          </span>
          <p className="font-[Montserrat] text-[12.5px] leading-[1.65] text-white/40">
            {ref.text}{" "}
            {ref.href && (
              <a
                href={ref.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-2 transition-colors hover:decoration-current"
                style={{ color: accent }}
              >
                View source
              </a>
            )}
          </p>
        </li>
      ))}
    </ol>
  );
}
