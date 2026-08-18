import Image from "next/image";
import Reveal from "./Reveal";
import { catalog } from "@/lib/api";

/**
 * Homepage range section — driven directly by the catalogue API.
 *
 * Entire Range section sits on dark ground (#06080f).
 * Products feature dark "black pillow" image wells with a soft cyan backdrop aura
 * and a subtle cyan glowing border.
 */

const ACCENTS = [
  "rgba(68,229,194,0.18)",
  "rgba(56,189,248,0.18)",
  "rgba(139,92,246,0.18)",
  "rgba(68,229,194,0.14)",
];

// Valid product images from Cloudinary & local bottle assets
const FALLBACK_PRODUCTS = [
  {
    name: "Zewa Feeds Betta Bites F3",
    slug: "betta-bites",
    badge: "HERO FORMULA",
    shortDesc: "Zewa Feeds Betta Bites (F3) deliver 46% insect protein — the highest in the Zewa range — in a 0.6–0.8 mm slow-sinking pellet built exclusively for Betta splendens.",
    proteinPct: 46,
    packs: [{ pack: "20g Bottle" }],
    images: [{ url: "https://res.cloudinary.com/lzydbena/image/upload/v1785740669/zewa/products/zzkpzeizlery8lpeas8c.jpg" }],
  },
  {
    name: "Zewa Feeds Guppy Bites G2",
    slug: "guppy-bites",
    badge: "MICRO PELLET",
    shortDesc: "Zewa Feeds Guppy Bites (G2) are precision-crafted 0.3–0.6 mm slow-sinking micro pellets with 38% insect protein.",
    proteinPct: 38,
    packs: [{ pack: "250g Pouch" }],
    images: [{ url: "https://res.cloudinary.com/lzydbena/image/upload/v1785738946/zewa/products/kvh6nfiuuqwkeq89ixj4.png" }],
  },
  {
    name: "Zewa Feeds Koi Bites K7",
    slug: "koi-bites",
    badge: "GROWTH & COLOUR",
    shortDesc: "Zewa Feeds Koi Bites (K7) are premium 4 mm floating pellets with 32% insect protein, krill meal, and proprietary probiotics.",
    proteinPct: 32,
    packs: [{ pack: "1kg Pouch" }],
    images: [{ url: "https://res.cloudinary.com/lzydbena/image/upload/v1785740602/zewa/products/r9vitexv8su2z8zzdv5v.jpg" }],
  },
];

/** API product -> the shape this section renders. */
function adapt(api, i = 0) {
  const first = (api.packs ?? [])[0];
  const rawImage = (api.images ?? [])[0]?.url;
  const imageUrl = rawImage || FALLBACK_PRODUCTS[i % FALLBACK_PRODUCTS.length].images[0].url;

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
    image: imageUrl,
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
    // API endpoint unreachable during dev
  }

  if (!products || products.length === 0) {
    products = FALLBACK_PRODUCTS;
  }

  const SECONDARY = products.slice(0, 3).map((p, i) => adapt(p, i));

  return (
    <Reveal id="products" className="bg-[#06080f]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-24 sm:pb-32">
        {/* ── Section Header ─────────────────────────────────────── */}
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

        {/* ── SECONDARY ROW ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {SECONDARY.map((p) => (
            <a
              key={p.slug ?? p.name}
              href={p.slug ? `/products/${p.slug}` : "/products"}
              className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 border border-[#44e5c2]/25 hover:border-[#44e5c2]/50 shadow-[0_0_15px_rgba(68,229,194,0.10)] hover:shadow-[0_0_25px_rgba(68,229,194,0.22)]"
              style={{ background: "linear-gradient(160deg, #0d1726 0%, #071018 100%)" }}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${p.accentColor}, transparent)` }}
              />

              {/*
                Image well — the artwork fills it edge to edge.

                Every pack shot is a 1:1 source and the well is aspect-square,
                so object-cover crops nothing; it just removes the letterbox
                gap that object-contain left around images whose own
                background (Betta blue, Koi white) is part of the artwork.
                Those gaps read as a mismatched frame rather than a bleed.

                The cyan aura sits above the image at low opacity so the well
                still picks up the section's glow — behind it, a fully opaque
                pack shot would hide it entirely.
              */}
              <div className="relative aspect-square overflow-hidden bg-[#070e19] border-b border-[#44e5c2]/15">
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover relative z-0 transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(68, 229, 194, 0.10) 0%, transparent 70%)",
                  }}
                />

                {/* Soft bottom blend overlay to transition image into dark card body */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0d1726] via-[#0d1726]/40 to-transparent z-10 pointer-events-none" />
              </div>

              {/* Text */}
              <div className="px-6 pb-7 pt-5 flex flex-col gap-2 relative z-10">
                <h3 className="font-[Playfair_Display] text-[20px] text-[#ffffff] leading-snug group-hover:text-primary transition-colors duration-200">
                  {p.name}
                </h3>
                <p className="text-[12px] text-white/45 font-[Montserrat] leading-relaxed line-clamp-2">
                  {p.tagline}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase font-[Montserrat] text-primary/70 mt-2 group-hover:text-primary group-hover:gap-2.5 transition-all duration-200">
                  Explore <ArrowIcon />
                </span>
              </div>

              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background: "linear-gradient(to right, rgba(68,229,194,0.6), transparent)" }}
              />
            </a>
          ))}
        </div>

        {/* ── BOTTOM CTA ────────────────────────────────────────── */}
        <div className="flex items-center justify-center">
          <a
            href="/products"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-primary/30 text-primary text-[11px] font-bold tracking-[0.2em] uppercase font-[Montserrat] hover:bg-primary hover:text-[#00382d] hover:border-primary transition-all duration-250 shadow-sm"
          >
            View All Formulas
            <ArrowIcon />
          </a>
        </div>
      </div>
    </Reveal>
  );
}
