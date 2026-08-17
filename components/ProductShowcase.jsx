import Image from "next/image";
import Reveal from "./Reveal";
import { catalog, formatInr } from "@/lib/api";

/**
 * Homepage range section — driven directly by the catalogue API.
 *
 * Design Architecture:
 * 1. Upper Section (Heading & Spotlight Hero Product): Rich Obsidian Black background.
 * 2. Lower Section (Secondary Formulas & Range CTA): Crisp White background.
 *
 * Keeps all backend APIs and product definitions 100% intact.
 */

const ACCENTS = [
  "rgba(68,229,194,0.16)",
  "rgba(56,189,248,0.18)",
  "rgba(139,92,246,0.18)",
  "rgba(68,229,194,0.12)",
];

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">` +
      `<rect width="400" height="400" fill="#0b121e"/>` +
      `<text x="200" y="205" text-anchor="middle" fill="#3c524d"` +
      ` font-family="Montserrat,sans-serif" font-size="14">Image Coming Soon</text>` +
      `</svg>`
  );

/** API product -> the shape this section renders. */
function adapt(api, i = 0) {
  const packs = api.packs ?? [];
  const first = packs.find((p) => p.inStock !== false) ?? packs[0];
  
  const media = api.media ?? [];
  const cardImages = media
    .filter((m) => m.type !== "VIDEO")
    .map((m) => m.url);

  const image = cardImages[0] ?? (api.images ?? [])[0]?.url ?? PLACEHOLDER_IMAGE;
  const priceFormatted = first?.pricePaise ? formatInr(first.pricePaise) : null;
  const mrpFormatted = first && first.mrpPaise > first.pricePaise ? formatInr(first.mrpPaise) : null;

  return {
    name: api.name,
    slug: api.slug,
    category: api.category ? api.category.replace(/_/g, " ") : "Aquatic Formula",
    badge: api.badge ?? null,
    tagline: api.shortDesc ?? "",
    description: api.shortDesc ?? "",
    proteinPct: api.proteinPct ?? null,
    price: priceFormatted,
    mrp: mrpFormatted,
    packName: first?.pack ?? null,
    stats: [
      api.proteinPct ? { val: `${api.proteinPct}%`, label: "Protein" } : null,
      { val: "0%", label: "Soy Filler" },
      first ? { val: first.pack, label: "Pack Size" } : null,
    ].filter(Boolean),
    image,
    accentColor: ACCENTS[i % ACCENTS.length],
  };
}

function ArrowIcon({ className = "w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function ProductShowcase() {
  let products = [];
  try {
    products = await catalog.products();
  } catch {
    return null;
  }
  if (!products || products.length === 0) return null;

  const HERO = adapt(products[0], 0);
  const SECONDARY = products.slice(1, 4).map((p, i) => adapt(p, i + 1));

  return (
    <Reveal id="products" className="w-full">
      {/* ── UPPER SECTION: BLACK BACKGROUND (Spotlight & Header) ─────────────────── */}
      <div className="bg-[#06080f] text-white pt-24 pb-20 sm:pb-28 relative overflow-hidden border-b border-white/5">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-cyan-500/5 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 relative z-10">
          {/* Header Block */}
          <div className="max-w-[680px] mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.25em] font-[Montserrat] uppercase">
                The Range
              </span>
            </div>

            <h2 className="font-[Playfair_Display] text-[34px] sm:text-[50px] lg:text-[56px] text-white font-bold leading-[1.1] tracking-tight mb-5">
              Engineered{" "}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#5eead4] to-cyan-300">
                for the species.
              </span>
            </h2>

            <p className="text-[15px] sm:text-[16px] text-white/50 font-[Montserrat] leading-relaxed max-w-[540px]">
              Species-targeted nutrition powered by lab-verified BSF insect protein — engineered for peak vitality, immunity, and crystal-clear water.
            </p>
          </div>

          {/* ── SPOTLIGHT HERO CARD (In Black Background) ────────────────── */}
          <a
            href={`/products/${HERO.slug}`}
            className="group relative block w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#0d1829] via-[#09121f] to-[#050912] border border-white/12 shadow-[0_30px_80px_rgba(0,0,0,0.7)] transition-all duration-500 hover:border-primary/45 hover:shadow-[0_30px_90px_rgba(68,229,194,0.12)]"
          >
            {/* Ambient inner glow */}
            <div
              className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: `radial-gradient(ellipse 70% 60% at 30% 50%, ${HERO.accentColor}, transparent 70%)`,
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[460px] relative z-10">
              {/* Left Column: Product Showcase Visual */}
              <div className="lg:col-span-6 relative flex items-center justify-center p-8 sm:p-12 bg-gradient-to-b from-[#0e1b2e]/60 to-[#070e1a]/80 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/8">
                {/* Badge Overlay */}
                <div className="absolute top-6 left-6 z-20 flex flex-wrap gap-2">
                  <span className="text-[9px] font-bold px-3.5 py-1.5 rounded-full tracking-[0.2em] uppercase font-[Montserrat] bg-primary text-[#00382d] shadow-lg shadow-primary/20">
                    {HERO.badge || "SPOTLIGHT FORMULA"}
                  </span>
                  {HERO.category && (
                    <span className="text-[9px] font-bold px-3 py-1.5 rounded-full tracking-[0.18em] uppercase font-[Montserrat] bg-white/10 text-white/70 border border-white/15 backdrop-blur-md">
                      {HERO.category}
                    </span>
                  )}
                </div>

                {/* Product Image */}
                <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[400px] lg:max-w-none flex items-center justify-center p-4">
                  {HERO.image ? (
                    <Image
                      src={HERO.image}
                      alt={HERO.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-white/30 text-xs font-[Montserrat]">No image available</div>
                  )}
                </div>
              </div>

              {/* Right Column: Specifications & Content */}
              <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold tracking-[0.22em] font-[Montserrat] uppercase text-primary/80">
                      Flagship Diets
                    </span>
                  </div>

                  <h3 className="font-[Playfair_Display] text-[32px] sm:text-[44px] text-white font-bold leading-[1.08] mb-4 group-hover:text-primary transition-colors duration-300">
                    {HERO.name}
                  </h3>

                  <p className="text-[14px] sm:text-[15px] text-white/55 font-[Montserrat] leading-relaxed mb-8 max-w-[460px]">
                    {HERO.description}
                  </p>

                  {/* Spec Pills Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {HERO.stats.map((s) => (
                      <div
                        key={s.label}
                        className="flex flex-col p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md group-hover:border-primary/30 transition-all duration-300"
                      >
                        <span className="font-[Playfair_Display] text-[20px] sm:text-[24px] font-bold text-primary leading-none mb-1">
                          {s.val}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-white/40 font-[Montserrat] tracking-wider uppercase">
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Row inside Spotlight Card */}
                <div className="flex items-center justify-between pt-4 border-t border-white/8 mt-auto">
                  {HERO.price ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-[Montserrat] text-2xl font-bold text-white">{HERO.price}</span>
                      {HERO.mrp && (
                        <span className="font-[Montserrat] text-xs text-white/40 line-through">{HERO.mrp}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] font-semibold tracking-wider font-[Montserrat] uppercase text-white/40">
                      High-Protein Diet
                    </span>
                  )}

                  <span className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-primary text-[#00382d] font-bold text-[11px] uppercase tracking-[0.18em] font-[Montserrat] group-hover:bg-[#5eead4] group-hover:shadow-[0_0_25px_rgba(68,229,194,0.35)] transition-all duration-300">
                    Explore Formula <ArrowIcon />
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom accent line animation */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
              style={{ background: "linear-gradient(to right, #44e5c2, #38bdf8, transparent)" }}
            />
          </a>
        </div>
      </div>

      {/* ── LOWER SECTION: WHITE BACKGROUND (Secondary Products & CTA) ─────────── */}
      <div className="bg-white text-slate-900 py-20 sm:py-28 relative">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16">
          {/* Sub-header for secondary products */}
          {SECONDARY.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-[0.22em] font-[Montserrat] uppercase text-[#00755f] block mb-2">
                  Comprehensive Lineup
                </span>
                <h3 className="font-[Playfair_Display] text-[28px] sm:text-[36px] text-slate-900 font-bold leading-tight">
                  More Targeted Species Formulas
                </h3>
              </div>
              <p className="text-[13px] text-slate-500 font-[Montserrat] max-w-[360px] leading-relaxed">
                Precision diets crafted with premium insect meal for vibrant coloration, healthy growth, and optimal digestibility.
              </p>
            </div>
          )}

          {/* ── SECONDARY PRODUCTS GRID (On White Background) ────────────────── */}
          {SECONDARY.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {SECONDARY.map((p) => (
                <a
                  key={p.slug ?? p.name}
                  href={p.slug ? `/products/${p.slug}` : "/products"}
                  className="group relative flex flex-col justify-between rounded-3xl bg-slate-50/70 border border-slate-200/80 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.12)] hover:border-[#00755f]/40 hover:bg-white overflow-hidden"
                >
                  <div>
                    {/* Image Well */}
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white mb-6 border border-slate-100 flex items-center justify-center p-6 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                      {p.badge && (
                        <span
                          className="absolute top-3 left-3 text-[9px] font-bold px-3 py-1 rounded-full tracking-widest font-[Montserrat] text-white z-10 shadow-sm"
                          style={{ background: "#00755f" }}
                        >
                          {p.badge}
                        </span>
                      )}
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-slate-400 text-xs font-[Montserrat]">No image</div>
                      )}
                    </div>

                    {/* Content */}
                    <span className="text-[10px] font-bold tracking-[0.18em] font-[Montserrat] text-[#00755f] uppercase mb-1.5 block">
                      {p.category}
                    </span>

                    <h4 className="font-[Playfair_Display] text-[22px] sm:text-[24px] text-slate-900 font-bold leading-snug mb-2 group-hover:text-[#00755f] transition-colors duration-200">
                      {p.name}
                    </h4>

                    <p className="text-[13px] text-slate-500 font-[Montserrat] leading-relaxed mb-6 line-clamp-2">
                      {p.tagline}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between mt-auto">
                    {p.price ? (
                      <span className="font-[Montserrat] text-base font-bold text-slate-900">{p.price}</span>
                    ) : p.proteinPct ? (
                      <span className="text-[11px] font-bold text-[#00755f] bg-[#00755f]/10 px-3 py-1 rounded-full font-[Montserrat]">
                        {p.proteinPct}% Protein
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold tracking-wider uppercase font-[Montserrat] text-slate-400">
                        Formula
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] uppercase font-[Montserrat] text-[#00755f] group-hover:gap-2.5 transition-all duration-200">
                      Explore <ArrowIcon />
                    </span>
                  </div>

                  {/* Card accent bar on hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ background: "linear-gradient(to right, #00755f, #059669, transparent)" }}
                  />
                </a>
              ))}
            </div>
          )}

          {/* ── BOTTOM VIEW ALL CTA ────────────────────────────────────────── */}
          <div className="flex items-center justify-center pt-2">
            <a
              href="/products"
              className="group inline-flex items-center gap-3 rounded-full border-2 border-[#00755f] px-9 py-4 font-[Montserrat] text-[11px] font-bold uppercase tracking-[0.2em] text-[#00755f] transition-all duration-300 hover:bg-[#00755f] hover:text-white hover:shadow-xl hover:shadow-[#00755f]/20 active:scale-95"
            >
              <span>View All Formulas</span>
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

