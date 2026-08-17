import Image from "next/image";
import Reveal from "./Reveal";
import { catalog } from "@/lib/api";

/**
 * Homepage range section — driven entirely by the catalogue API.
 *
 * Upper section (heading & hero spotlight card) sits on dark ground (#06080f).
 * Lower section (secondary products & View All CTA) sits on white ground below.
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
    <Reveal id="products" className="bg-[#06080f]">
      {/* ── UPPER SECTION: Dark background (#06080f) - Compact Heading & Hero Card ── */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10">
        {/* Section label */}
        <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
          <div className="w-5 h-px bg-primary" />
          <span className="text-[10px] font-bold tracking-[0.24em] font-[Montserrat] uppercase text-primary">
            The Range
          </span>
        </div>

        {/* Section heading */}
        <h2 className="font-[Playfair_Display] text-[26px] sm:text-[36px] text-white leading-tight mb-6 sm:mb-8">
          Engineered{" "}
          <span className="italic text-primary">for the species.</span>
        </h2>

        {/* ── HERO SPOTLIGHT CARD (Compact) ── */}
        <a
          href={`/products/${HERO.slug}`}
          className="group relative flex flex-col lg:flex-row items-center gap-0 rounded-xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0d1f2e 0%, #091914 100%)" }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 60% 70% at 30% 50%, ${HERO.accentColor}, transparent 65%)` }}
          />

          {/* Image well — left 48% */}
          <div className="relative w-full shrink-0 self-stretch lg:w-[48%] aspect-[4/3] lg:aspect-auto lg:min-h-[260px] max-h-[320px] overflow-hidden bg-[#06080f]">
            {HERO.image && (
              <Image
                src={HERO.image}
                alt={HERO.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            {HERO.badge && (
              <span className="absolute top-4 left-4 text-[8.5px] font-bold px-2.5 py-1 rounded-full tracking-[0.18em] font-[Montserrat] bg-primary text-[#00382d]">
                {HERO.badge}
              </span>
            )}
          </div>

          {/* Text — right 52% */}
          <div className="relative z-10 w-full lg:w-[52%] px-6 sm:px-8 py-6 lg:py-8">
            <p className="text-[9.5px] font-bold tracking-[0.2em] font-[Montserrat] uppercase text-primary/60 mb-2">
              Hero Formula
            </p>
            <h2 className="font-[Playfair_Display] text-[26px] sm:text-[34px] text-white leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
              {HERO.name}
            </h2>
            <p className="text-[13px] sm:text-[14px] text-white/50 font-[Montserrat] leading-relaxed mb-6 max-w-[420px] line-clamp-2">
              {HERO.description}
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-2.5 mb-6">
              {HERO.stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col px-3.5 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(68,229,194,0.12)" }}
                >
                  <span className="font-[Playfair_Display] text-[18px] text-primary leading-none">{s.val}</span>
                  <span className="text-[9px] text-white/35 font-[Montserrat] mt-0.5 tracking-wide">{s.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] uppercase font-[Montserrat] text-primary group-hover:gap-3 transition-all duration-200">
              Explore Formula <ArrowIcon />
            </span>
          </div>

          {/* Bottom edge accent */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
            style={{ background: "linear-gradient(to right, rgba(68,229,194,0.7), transparent)" }}
          />
        </a>
      </div>

      {/* ── LOWER SECTION: White background containing Secondary Row & View All CTA ── */}
      <div className="bg-white">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-12 sm:pb-16">
          {/* Secondary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
            {SECONDARY.map((p) => (
              <a
                key={p.slug ?? p.name}
                href={p.slug ? `/products/${p.slug}` : "/products"}
                className="group relative flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md border border-slate-100"
                style={{ background: "linear-gradient(160deg, #0d1726 0%, #0a1219 100%)" }}
              >
                {/* Glow */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${p.accentColor}, transparent)` }}
                />

                {/* Image well — compact 16/10 aspect ratio */}
                <div className="relative aspect-[16/10] overflow-hidden bg-white">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {p.badge && (
                    <span
                      className="absolute top-3 left-3 text-[8.5px] font-bold px-2 py-0.5 rounded-full tracking-widest font-[Montserrat] text-white z-10"
                      style={{ background: "#00755f" }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="px-5 pb-5 pt-4 flex flex-col gap-1.5">
                  <h3 className="font-[Playfair_Display] text-[18px] text-white leading-snug group-hover:text-primary transition-colors duration-200">
                    {p.name}
                  </h3>
                  <p className="text-[11.5px] text-white/35 font-[Montserrat] leading-relaxed line-clamp-2">
                    {p.tagline}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[9.5px] font-bold tracking-[0.16em] uppercase font-[Montserrat] text-primary/60 mt-1.5 group-hover:text-primary group-hover:gap-2.5 transition-all duration-200">
                    Explore <ArrowIcon />
                  </span>
                </div>

                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: "linear-gradient(to right, rgba(68,229,194,0.5), transparent)" }}
                />
              </a>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex items-center justify-center">
            <a
              href="/products"
              className="group inline-flex items-center gap-2.5 rounded-full border border-[#00755f]/35 px-7 py-3 font-[Montserrat] text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#00755f] transition-all duration-250 hover:border-[#00755f] hover:bg-[#00755f] hover:text-white"
            >
              View All Formulas
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

