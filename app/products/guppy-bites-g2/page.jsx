"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";

// ─── SVG icons ────────────────────────────────────────────────────────────────
const IcoMicroscope = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
    <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 10v6M5 16h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M11 5l2-2 2 2-2 2-2-2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M14 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const IcoLeaf = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
    <path d="M10 17C10 17 3 13 3 7a7 7 0 0 1 14 0c0 6-7 10-7 10z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M10 17V10M10 10C10 10 7 8 7 6M10 10C10 10 13 8 13 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const IcoMapPin = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
    <path d="M10 2a5 5 0 0 1 5 5c0 3.5-5 11-5 11S5 10.5 5 7a5 5 0 0 1 5-5z" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="10" cy="7" r="1.8" fill="currentColor" opacity=".5"/>
  </svg>
);
const IcoLarva = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
    <ellipse cx="10" cy="10" rx="7" ry="4" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="4" cy="9" r="1" fill="currentColor" opacity=".5"/>
    <path d="M6 8.5 Q8 7 10 8.5 Q12 10 14 8.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    <circle cx="16.5" cy="9.5" r=".8" fill="currentColor"/>
  </svg>
);

const TRUST_ICONS = [
  { icon: <IcoMicroscope />, label: "NABL Tested" },
  { icon: <IcoLeaf />, label: "100% Natural" },
  { icon: <IcoMapPin />, label: "Made in India" },
  { icon: <IcoLarva />, label: "Insect Protein" },
];

const PACKS = [
  { size: "45g", price: "₹199", mrp: "₹249", sku: "G2-45G", badge: null },
  { size: "500g", price: "₹1,299", mrp: "₹1,599", sku: "G2-500G", badge: "Best Value" },
];

const GALLERY = [
  { type: "image", label: "Front", src: "/Bottles/Guppy/Guppy G2_Front.png" },
  { type: "video", label: "Watch", src: "/videos/brand_video.mp4", poster: "/Bottles/Guppy/Guppy G2_Front.png" },
  { type: "image", label: "Back", src: "/Bottles/Guppy/Guppy G2_Back.png" },
  { type: "image", label: "Lifestyle 1", src: "/Bottles/Guppy/Guppy 01.png" },
  { type: "image", label: "Lifestyle 2", src: "/Bottles/Guppy/Guppy 02.png" },
];

const HIGHLIGHTS = [
  { title: "40% Insect Protein", sub: "Balanced omnivore protein profile" },
  { title: "Micro Pellet Format", sub: "0.4–0.6mm — matched to guppy mouth size" },
  { title: "Omega-3 Rich Formula", sub: "Supports vivid colouration in livebearers" },
  { title: "86% Digestibility", sub: "Clean absorption, low tank waste" },
  { title: "Slow-Sinking Pellets", sub: "Mid-water feeding zone for natural behaviour" },
  { title: "Colour Enhancement", sub: "Natural carotenoids for delta & fancy guppies" },
];

const FEATURES = [
  { title: "40% Insect Protein", desc: "Guppies are omnivores — G2 balances insect protein with plant-sourced nutrients to match their natural dietary needs, without the excess fat of carnivore formulas." },
  { title: "Micro Pellet at 0.4–0.6mm", desc: "Precisely calibrated to the guppy's small terminal mouth. Prevents gulping, ensures full consumption with minimal wastage." },
  { title: "Omega-3 for Colour Development", desc: "Insect oil and fish oil provide EPA and DHA fatty acids that contribute directly to the bright fin colouration of fancy and delta guppy strains." },
  { title: "Slow-Sinking Format", desc: "Guppies feed naturally in the mid-water column. G2's density is tuned to sink slowly, keeping food in the guppy's preferred feeding zone." },
  { title: "Natural Carotenoid Boost", desc: "Paprica and natural carotenoid sources intensify the reds, oranges, and yellows in show-quality guppy strains without synthetic dyes." },
  { title: "Livebearer-Optimised", desc: "The formula also suits mollies, platies, and swordtails — any livebearer benefits from its balanced omnivore profile." },
];

const INGREDIENTS = [
  "Insect meal", "Fish meal", "Spirulina", "Shrimp meal", "Wheat", "Corn starch",
  "Fish oil", "Insect oil", "Paprica essence", "Moringa extract", "Garlic powder",
  "Sorbitol", "Protein hydrolysate", "Antioxidants", "Dried yeast",
  "Pyridoxine hydrochloride (Vit. B6)", "Vitamin A palmitate", "Folic acid",
  "Dicalcium carbonate", "Vitamin C", "Soya lecithin", "Sodium chloride", "Mineral mix",
];

const NUTRITION = [
  { nutrient: "Crude Protein (min)", value: "40%" },
  { nutrient: "Crude Fat", value: "9%" },
  { nutrient: "Crude Fibre", value: "12%" },
  { nutrient: "Phosphorus", value: "2.1%" },
  { nutrient: "Calcium", value: "2.2%" },
  { nutrient: "Moisture", value: "<5%" },
  { nutrient: "Ash", value: "10%" },
];

const SUITABLE = [
  { name: "Fancy Guppies", desc: "Delta, ribbon, and show strains — max colour expression" },
  { name: "Endler's Livebearer", desc: "Micro-species thriving on balanced omnivore formula" },
  { name: "Molly", desc: "Balloon and sailfin varieties — mid-water feeders" },
  { name: "Platy", desc: "Hardy livebearer benefiting from high-omega diet" },
  { name: "Swordtail", desc: "Active species needing sustained energy" },
  { name: "Neon Tetra & Small Tetras", desc: "Also suitable for small schooling fish" },
];

const RELATED = [
  { name: "Betta Bites F3", tagline: "Slow-sinking carnivore formula", href: "/products/betta-bites-f3", image: "/Bottles/Betta/Betta F3_Front.png" },
  { name: "Cichlid Bites C4", tagline: "High-energy cichlid formula", href: "/products/cichlid-bites-c4", image: "/Bottles/Cichild/Cichild C4_Front.png" },
  { name: "Dried BSF Larvae 25g", tagline: "Whole larvae protein supplement", href: "/products/dried-bsf-larvae-25g", image: "/Bottles/DBSFL/DBSFL 25G.png" },
];

const TABS = ["Overview", "Features", "Ingredients", "Suitable For", "Pack Info"];
const accent = "#44e5c2";

export default function GuppyBitesG2() {
  const [activePack, setActivePack] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("Overview");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const pack = PACKS[activePack];
  const activeSlide = GALLERY[activeImage];

  const handleAddToCart = () => {
    addToCart({
      sku: pack.sku,
      name: "Guppy Bites G2",
      pack: pack.size,
      price: parseInt(pack.price.replace(/[^\d]/g, "")),
      image: "/Bottles/Guppy/Guppy G2_Front.png",
      accentBg: "#d4f5ed",
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Header />
      <main className="bg-[#080e1c] text-[#dde2f6] min-h-screen">

        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-4">
          <nav className="flex items-center gap-2 text-[12px] text-white/30 font-[Montserrat]">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-primary transition-colors">Products</a>
            <span>/</span>
            <span className="text-white/60">Guppy Bites G2</span>
          </nav>
        </div>

        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            <div className="flex flex-col gap-4">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#0d1a2e] to-[#091a18]">
                {activeSlide.type === "video" ? (
                  <video key={activeSlide.src} src={activeSlide.src} poster={activeSlide.poster}
                    autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <Image src={activeSlide.src} alt={activeSlide.label} fill
                    sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-10"
                    priority={activeImage === 0} />
                )}
                <div className="absolute top-0 left-0 w-32 h-32 rounded-br-full pointer-events-none" style={{ background: `${accent}10`, filter: "blur(40px)" }} />
              </div>
              <div className="flex gap-2.5">
                {GALLERY.map((item, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className="relative flex-1 aspect-square rounded-xl border overflow-hidden transition-all duration-200 border-white/8 hover:border-white/25"
                    style={{ borderColor: activeImage === i ? accent : undefined, boxShadow: activeImage === i ? `0 0 12px ${accent}30` : undefined }}>
                    {item.type === "video" ? (
                      <div className="absolute inset-0 bg-[#0a1520] flex flex-col items-center justify-center gap-1">
                        <div className="w-6 h-6 rounded-full border flex items-center justify-center"
                          style={{ borderColor: activeImage === i ? accent : "rgba(255,255,255,0.25)" }}>
                          <svg viewBox="0 0 12 12" fill="currentColor" className="w-2.5 h-2.5 ml-0.5"
                            style={{ color: activeImage === i ? accent : "rgba(255,255,255,0.5)" }}>
                            <polygon points="2,1 10,6 2,11" />
                          </svg>
                        </div>
                        <span className="text-[8px] font-bold tracking-widest font-[Montserrat]"
                          style={{ color: activeImage === i ? accent : "rgba(255,255,255,0.3)" }}>VIDEO</span>
                      </div>
                    ) : (
                      <Image src={item.src} alt={item.label} fill sizes="10vw" className="object-contain p-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:pt-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-px bg-primary" />
                <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase font-[Montserrat]">
                  Zewa Feeds · Livebearer Range
                </span>
              </div>

              <div>
                <h1 className="font-[Playfair_Display] text-[36px] sm:text-[44px] leading-[1.1] text-white mb-3">
                  Guppy Bites G2
                </h1>
                <p className="text-[15px] text-white/55 leading-relaxed font-[Montserrat] max-w-md">
                  Precision micro-nutrition for guppies and livebearers — 40% insect protein, omega-rich, slow-sinking micro pellets.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-primary text-sm">★</span>
                ))}
                <span className="text-[12px] text-white/35 font-[Montserrat] ml-1">4.8 · 163 reviews</span>
              </div>

              <div>
                <p className="text-[11px] text-white/40 tracking-[0.12em] uppercase font-[Montserrat] mb-3">Pack Size</p>
                <div className="flex gap-3">
                  {PACKS.map((pk, i) => (
                    <button key={pk.size} onClick={() => setActivePack(i)}
                      className={`relative flex-1 py-3 px-4 rounded-xl border text-[13px] font-semibold font-[Montserrat] transition-all duration-200 ${activePack === i ? "border-primary bg-primary/10 text-primary" : "border-white/12 bg-white/3 text-white/50 hover:border-white/25"}`}>
                      {pk.size}
                      {pk.badge && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-[#00382d] text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide whitespace-nowrap">
                          {pk.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="font-[Playfair_Display] text-[40px] text-primary leading-none">{pack.price}</span>
                <span className="text-[15px] text-white/30 line-through font-[Montserrat]">{pack.mrp}</span>
                <span className="text-[12px] text-emerald-400 font-semibold font-[Montserrat]">
                  {Math.round((1 - parseInt(pack.price.replace(/[^\d]/g, "")) / parseInt(pack.mrp.replace(/[^\d]/g, ""))) * 100)}% off
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-white/35 tracking-[0.12em] uppercase font-[Montserrat]">Qty</span>
                  <div className="flex items-center rounded-xl border border-white/12 overflow-hidden">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-white/50 text-[18px] hover:bg-white/8 hover:text-white transition-all select-none">−</button>
                    <span className="w-10 h-10 flex items-center justify-center text-white text-[14px] font-bold font-[Montserrat] border-x border-white/10 select-none">{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-primary text-[18px] hover:bg-primary/15 transition-all select-none">+</button>
                  </div>
                  <span className="text-[12px] text-white/25 font-[Montserrat]">
                    = ₹{(parseInt(pack.price.replace(/[^\d]/g, "")) * qty).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleAddToCart}
                    className={`flex-1 py-4 px-6 font-bold text-[13px] tracking-widest uppercase font-[Montserrat] active:scale-[0.98] transition-all rounded-sm flex items-center justify-center gap-2 ${added ? "bg-emerald-500 text-white" : "bg-primary text-[#00382d] hover:bg-primary/90"}`}>
                    {added ? (<><svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>Added!</>) : "Add to Cart"}
                  </button>
                  <button onClick={() => { handleAddToCart(); window.location.href = "/checkout"; }}
                    className="flex-1 border border-primary text-primary py-4 px-6 font-bold text-[13px] tracking-widest uppercase font-[Montserrat] hover:bg-primary hover:text-[#00382d] active:scale-[0.98] transition-all rounded-sm">
                    Buy Now
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                {TRUST_ICONS.map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-1.5 py-3 px-2 bg-white/3 border border-white/6 rounded-xl">
                    <span style={{ color: accent }} className="opacity-70">{b.icon}</span>
                    <span className="text-[10px] text-white/45 text-center leading-tight font-[Montserrat]">{b.label}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-white/20 font-[Montserrat]">SKU: {pack.sku}</p>
            </div>
          </div>
        </section>

        <div className="sticky top-20 z-30 bg-[#080e1c]/95 backdrop-blur-md border-b border-white/6">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="flex gap-0 overflow-x-auto no-scrollbar">
              {TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`shrink-0 px-5 py-4 text-[12px] font-semibold tracking-[0.1em] uppercase font-[Montserrat] border-b-2 transition-all duration-200 ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-white/35 hover:text-white/60"}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {HIGHLIGHTS.map((h) => (
                <div key={h.title} className="p-5 rounded-2xl border border-white/6 bg-white/2">
                  <p className="text-[13px] font-semibold text-white font-[Montserrat] mb-1">{h.title}</p>
                  <p className="text-[12px] text-white/35 font-[Montserrat]">{h.sub}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "Features" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex flex-col gap-2">
                  <h4 className="text-[14px] font-semibold text-primary font-[Montserrat]">{f.title}</h4>
                  <p className="text-[13px] text-white/45 font-[Montserrat] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "Ingredients" && (
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-8">
                {INGREDIENTS.map((ing) => (
                  <span key={ing} className="px-3 py-1.5 rounded-full text-[11px] font-[Montserrat] text-white/50 border border-white/8 bg-white/3">{ing}</span>
                ))}
              </div>
              <table className="w-full max-w-md text-[13px] font-[Montserrat]">
                <thead><tr className="border-b border-white/8"><th className="text-left pb-3 text-white/30 font-normal">Nutrient</th><th className="text-right pb-3 text-white/30 font-normal">Value</th></tr></thead>
                <tbody>{NUTRITION.map((n) => (<tr key={n.nutrient} className="border-b border-white/5"><td className="py-3 text-white/55">{n.nutrient}</td><td className="py-3 text-right text-primary font-semibold">{n.value}</td></tr>))}</tbody>
              </table>
            </div>
          )}
          {activeTab === "Suitable For" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
              {SUITABLE.map((s) => (
                <div key={s.name} className="p-5 rounded-2xl border border-white/6 bg-white/2">
                  <p className="text-[14px] font-semibold text-white font-[Montserrat] mb-1">{s.name}</p>
                  <p className="text-[12px] text-white/35 font-[Montserrat]">{s.desc}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "Pack Info" && (
            <div className="max-w-xl">
              <div className="flex flex-col gap-3">
                {PACKS.map((pk) => (
                  <div key={pk.size} className="flex items-center justify-between p-5 rounded-2xl border border-white/6 bg-white/2">
                    <div>
                      <p className="text-[15px] font-semibold text-white font-[Montserrat]">{pk.size}</p>
                      <p className="text-[11px] text-white/30 font-[Montserrat]">SKU: {pk.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-[Playfair_Display] text-[22px] text-primary">{pk.price}</p>
                      <p className="text-[11px] text-white/25 line-through font-[Montserrat]">{pk.mrp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pb-24">
          <div className="h-px w-full mb-12" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06) 50%, transparent)" }} />
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase font-[Montserrat] text-white/25 mb-6">You may also like</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {RELATED.map((r) => (
              <a key={r.name} href={r.href}
                className="group flex items-center gap-4 p-4 rounded-2xl border border-white/6 bg-white/2 hover:border-white/15 transition-all duration-200">
                <div className="relative w-16 h-16 shrink-0">
                  <Image src={r.image} alt={r.name} fill className="object-contain" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white font-[Montserrat] group-hover:text-primary transition-colors">{r.name}</p>
                  <p className="text-[11px] text-white/30 font-[Montserrat]">{r.tagline}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
