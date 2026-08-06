import Image from "next/image";
import Reveal from "./Reveal";
import { catalog } from "@/lib/api";

/**
 * Homepage range section — driven entirely by the catalogue API.
 *
 * This used to be a hardcoded HERO plus three SECONDARY entries. They named
 * products by slugs that no longer exist ("betta-bites-f3"), so the homepage
 * advertised items that could not be bought and linked to 404s. A server
 * component can await the real catalogue directly, so there is no reason to
 * carry a second, silently-diverging copy of the product list.
 */

const ACCENTS = [
  "rgba(68,229,194,0.14)",
  "rgba(56,189,248,0.18)",
  "rgba(139,92,246,0.18)",
  "rgba(68,229,194,0.10)",
];

/** API product -> the shape this section renders. */
function adapt(api, i = 0) {
  const first = (api.packs ?? [])[0];
  return {
    name: api.name,
    slug: api.slug,
    badge: api.badge ?? null,
    tagline: api.shortDesc ?? "",
    description: api.shortDesc ?? "",
    stats: [
      api.proteinPct ? { val: `${api.proteinPct}%`, label: "Protein" } : null,
      { val: "0%", label: "Soy Filler" },
      first ? { val: first.pack, label: "Pack" } : null,
    ].filter(Boolean),
    image: (api.images ?? [])[0]?.url ?? null,
    accentColor: ACCENTS[i % ACCENTS.length],
  };
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function ProductShowcase() {
  /*
   * Server-side fetch: the markup ships already populated, so there is no
   * loading flash and no client-side JavaScript for this section.
   *
   * On failure the whole section is omitted rather than shown empty or with
   * invented products — the homepage simply skips the range block.
   */
  let products = [];
  try {
    products = await catalog.products();
  } catch {
    return null;
  }
  if (products.length === 0) return null;

  const HERO = adapt(products[0], 0);
  const SECONDARY = products.slice(1, 4).map((p, i) => adapt(p, i + 1));

  return (
    <Reveal id="products" className="bg-[#06080f]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-24 sm:pb-32">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-10 sm:mb-14">
          <div className="w-6 h-px bg-primary" />
          <span className="text-[10px] font-bold tracking-[0.28em] font-[Montserrat] uppercase text-primary">
            The Range
          </span>
        </div>

        {/* Section heading */}
        <h2 className="font-[Playfair_Display] text-[32px] sm:text-[48px] text-white leading-tight mb-12 sm:mb-16">
          Engineered{" "}
          <span className="italic text-primary">for the species.</span>
        </h2>

        {/* ── HERO CARD ─────────────────────────────────────────── */}
        <a
          href={`/products/${HERO.slug}`}
          className="group relative flex flex-col lg:flex-row items-center gap-0 rounded-2xl overflow-hidden mb-5"
          style={{ background: "linear-gradient(135deg, #0d1f2e 0%, #091914 100%)" }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 60% 70% at 30% 50%, ${HERO.accentColor}, transparent 65%)` }} />

          {/* Image — left 55% on desktop, full width on mobile */}
          <div className="relative w-full lg:w-[55%] flex items-center justify-center py-14 sm:py-20 px-10 sm:px-16"
            style={{ minHeight: "340px" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 55%, rgba(68,229,194,0.12), transparent 60%)" }} />
            {HERO.image && (
              <Image
                src={HERO.image}
                alt={HERO.name}
                width={380}
                height={380}
                priority
                className="relative z-10 object-contain max-h-[320px] w-auto transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-2"
                style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.55))" }}
              />
            )}
            {HERO.badge && (
              <span className="absolute top-6 left-6 text-[9px] font-bold px-3 py-1.5 rounded-full tracking-[0.2em] font-[Montserrat] bg-primary text-[#00382d]">
                {HERO.badge}
              </span>
            )}
          </div>

          {/* Text — right 45% */}
          <div className="relative z-10 w-full lg:w-[45%] px-8 sm:px-12 pb-14 lg:py-20">
            <p className="text-[10px] font-bold tracking-[0.22em] font-[Montserrat] uppercase text-primary/60 mb-4">
              Hero Formula
            </p>
            <h2 className="font-[Playfair_Display] text-[36px] sm:text-[48px] text-white leading-[1.05] mb-5 group-hover:text-primary transition-colors duration-300">
              {HERO.name}
            </h2>
            <p className="text-[15px] sm:text-[16px] text-white/45 font-[Montserrat] leading-relaxed mb-10 max-w-[380px]">
              {HERO.description}
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {HERO.stats.map((s) => (
                <div key={s.label} className="flex flex-col px-5 py-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(68,229,194,0.12)" }}>
                  <span className="font-[Playfair_Display] text-[22px] text-primary leading-none">{s.val}</span>
                  <span className="text-[10px] text-white/30 font-[Montserrat] mt-0.5 tracking-wide">{s.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase font-[Montserrat] text-primary group-hover:gap-3 transition-all duration-200">
              Explore Formula <ArrowIcon />
            </span>
          </div>

          {/* Bottom edge accent */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
            style={{ background: "linear-gradient(to right, rgba(68,229,194,0.7), transparent)" }} />
        </a>

        {/* ── SECONDARY ROW ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {SECONDARY.map((p) => (
            <a
              key={p.slug ?? p.name}
              href={p.slug ? `/products/${p.slug}` : "/products"}
              className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ background: "linear-gradient(160deg, #0d1726 0%, #0a1219 100%)" }}
            >
              {/* Glow */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${p.accentColor}, transparent)` }} />

              {/* Image */}
              <div className="relative flex items-center justify-center pt-10 pb-6 px-8" style={{ minHeight: "200px" }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 60%, ${p.accentColor}, transparent 65%)` }} />
                {/* Sized container so fill-mode Image has no wrapper bg */}
                <div className="relative z-10 w-[170px] h-[170px] transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain"
                      style={{ filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.5))" }}
                    />
                  )}
                </div>
                {p.badge && (
                  <span className="absolute top-4 left-4 text-[9px] font-bold px-2.5 py-1 rounded-full tracking-widest font-[Montserrat] text-white z-10"
                    style={{ background: "#00a882" }}>
                    {p.badge}
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="px-6 pb-7 flex flex-col gap-2">
                <h3 className="font-[Playfair_Display] text-[20px] text-white leading-snug group-hover:text-primary transition-colors duration-200">
                  {p.name}
                </h3>
                <p className="text-[12px] text-white/35 font-[Montserrat] leading-relaxed">
                  {p.tagline}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase font-[Montserrat] text-primary/60 mt-2 group-hover:text-primary group-hover:gap-2.5 transition-all duration-200">
                  Explore <ArrowIcon />
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background: "linear-gradient(to right, rgba(68,229,194,0.5), transparent)" }} />
            </a>
          ))}
        </div>

        {/* ── BOTTOM CTA ────────────────────────────────────────── */}
        <div className="flex items-center justify-center">
          <a
            href="/products"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-primary/30 text-primary text-[11px] font-bold tracking-[0.2em] uppercase font-[Montserrat] hover:bg-primary hover:text-[#00382d] hover:border-primary transition-all duration-250"
          >
            View All Formulas
            <ArrowIcon />
          </a>
        </div>

      </div>
    </Reveal>
  );
}
