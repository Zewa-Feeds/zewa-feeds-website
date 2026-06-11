"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ─── Data ────────────────────────────────────────────────────────────────────

const PACKS = [
  { size: "45g", price: "₹249", mrp: "₹310", sku: "F3-45G", badge: null },
  { size: "1kg", price: "₹1,785", mrp: "₹2,200", sku: "F3-1KG", badge: "Best Value" },
];

// Video is SECOND (index 1)
const GALLERY = [
  {
    type: "image",
    label: "Front",
    src: "/Bottles/Betta/Betta F3_Front.png",
  },
  {
    type: "video",
    label: "Watch",
    src: "/videos/brand-video.mp4",
    poster: "/Bottles/Betta/Betta F3_Front.png",
  },
  {
    type: "image",
    label: "Back",
    src: "/Bottles/Betta/Betta F3_Back.png",
  },
  {
    type: "image",
    label: "Lifestyle",
    src: "/Bottles/Betta/Betta 01.png",
  },
  {
    type: "image",
    label: "Detail",
    src: "/Bottles/Betta/Betta 01_02.png",
  },
];

const HIGHLIGHTS = [
  { icon: "🧬", title: "46% Insect Protein", sub: "Highest in the Zewa range" },
  { icon: "🌿", title: "100% Natural Formula", sub: "Zero synthetic additives" },
  { icon: "🛡️", title: "Spirulina Immunity Boost", sub: "Phycocyanin compounds" },
  { icon: "🎨", title: "Natural Colour Enhancement", sub: "Paprica & carotenoids" },
  { icon: "📏", title: "0.6–0.8mm Pellet Size", sub: "Betta mouth anatomy fit" },
  { icon: "⚡", title: "88% Digestibility", sub: "Low ammonia output" },
];

const FEATURES = [
  { icon: "🧬", title: "46% Insect Protein", desc: "Highest protein concentration in the Zewa range — delivers complete amino acid profile." },
  { icon: "🌿", title: "100% Natural Formula", desc: "No synthetic additives, artificial colours, or chemical binders — clean label guarantee." },
  { icon: "🛡️", title: "Spirulina Immunity Boost", desc: "Phycocyanin compounds from spirulina actively strengthen the betta's immune response." },
  { icon: "🎨", title: "Natural Colour Enhancement", desc: "Paprica essence & natural carotenoids intensify vivid reds, blues, and metallic iridescence." },
  { icon: "📏", title: "0.6–0.8mm Betta-Specific Size", desc: "Precisely calibrated for the upturned terminal mouth anatomy of Betta splendens." },
  { icon: "⚡", title: "88% Protein Digestibility", desc: "Insect protein is metabolised near-completely, dramatically reducing ammonia output." },
  { icon: "🌊", title: "Slow-Sinking Surface Action", desc: "Pellet density suits bettas' natural surface and mid-water feeding posture." },
  { icon: "🏆", title: "Show & Breeding Grade", desc: "Formulated to the nutritional standards required by competitive betta breeders." },
];

const INGREDIENTS = [
  "Insect meal", "Spirulina", "Fish meal", "Shrimp meal", "Wheat", "Corn starch",
  "Fish oil", "Insect oil", "Paprica essence", "Moringa extract", "Garlic powder",
  "Sorbitol", "Protein hydrolysate", "Antioxidants", "Dried yeast",
  "Pyridoxine hydrochloride (Vit. B6)", "Vitamin A palmitate", "Folic acid",
  "Dicalcium carbonate", "Menadione sodium bisulphate complex (Vit. K)",
  "Biotin", "Vitamin B12", "Mineral mix", "Vitamin C", "Soya lecithin",
  "Sodium chloride",
];

const NUTRITION = [
  { nutrient: "Crude Protein (min)", value: "46%" },
  { nutrient: "Crude Fat", value: "11%" },
  { nutrient: "Crude Fibre", value: "15%" },
  { nutrient: "Phosphorus", value: "2.5%" },
  { nutrient: "Calcium", value: "2.5%" },
  { nutrient: "Moisture", value: "<5%" },
  { nutrient: "Ash", value: "12%" },
];

const BETTA_VARIETIES = [
  { name: "Halfmoon", desc: "180° tail spread — most colour-sensitive variety" },
  { name: "Crowntail", desc: "Spiked rays require peak protein for fin integrity" },
  { name: "Plakat", desc: "Short-finned fighter — thrives on high-protein diet" },
  { name: "Veiltail", desc: "Classic flowing tail — benefits from carotenoid boost" },
  { name: "Double Tail", desc: "Rare bifurcated caudal — needs immunity support" },
  { name: "Giant Betta", desc: "Larger frame demands higher caloric intake" },
];

const RELATED = [
  { name: "Cichlid Bites C4", tagline: "High-energy formula for aggressive cichlids", href: "#", image: "/Bottles/Cichild/Cichild C4_Front.png" },
  { name: "DBSFL 25g", tagline: "Dried whole larvae — treat & protein supplement", href: "#", image: "/Bottles/DBSFL/DBSFL 25G.png" },
  { name: "Full Range", tagline: "All Zewa species-specific formulas", href: "/products", image: "/Bottles/All products.jpg" },
];

const TRUST_BADGES = [
  { icon: "🔬", label: "NABL Lab Tested" },
  { icon: "🌿", label: "100% Natural" },
  { icon: "🇮🇳", label: "Made in India" },
  { icon: "🪲", label: "Insect Protein" },
];

const TABS = ["Overview", "Description", "Features", "Ingredients", "Suitable For", "Pack Info"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BettaBitesF3() {
  const [activePack, setActivePack] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("Overview");

  const pack = PACKS[activePack];
  const activeSlide = GALLERY[activeImage];

  return (
    <>
      <Header />
      <main className="bg-[#080e1c] text-[#dde2f6] min-h-screen">

        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-4">
          <nav className="flex items-center gap-2 text-[12px] text-white/30 font-[Montserrat]">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-primary transition-colors">Products</a>
            <span>/</span>
            <span className="text-white/60">Betta Bites F3</span>
          </nav>
        </div>

        {/* ── Hero: Gallery + Purchase ──────────────────────────────────── */}
        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Gallery */}
            <div className="flex flex-col gap-4">
              {/* Main viewer */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#0d1a2e] to-[#091a18]">
                {activeSlide.type === "video" ? (
                  <video
                    key={activeSlide.src}
                    src={activeSlide.src}
                    poster={activeSlide.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={activeSlide.src}
                    alt={activeSlide.label}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-10"
                    priority={activeImage === 0}
                  />
                )}
                {/* Teal ambient glow */}
                <div className="absolute top-0 left-0 w-32 h-32 rounded-br-full bg-primary/6 blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-40 h-40 rounded-tl-full bg-primary/4 blur-3xl pointer-events-none" />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2.5">
                {GALLERY.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative flex-1 aspect-square rounded-xl border overflow-hidden transition-all duration-200 ${
                      activeImage === i
                        ? "border-primary shadow-lg shadow-primary/20"
                        : "border-white/8 hover:border-white/25"
                    }`}
                  >
                    {item.type === "video" ? (
                      <div className="absolute inset-0 bg-[#0a1520] flex flex-col items-center justify-center gap-1">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${activeImage === i ? "border-primary" : "border-white/25"}`}>
                          <svg viewBox="0 0 12 12" fill="currentColor" className={`w-2.5 h-2.5 ml-0.5 ${activeImage === i ? "text-primary" : "text-white/50"}`}>
                            <polygon points="2,1 10,6 2,11" />
                          </svg>
                        </div>
                        <span className={`text-[8px] font-bold tracking-widest font-[Montserrat] ${activeImage === i ? "text-primary" : "text-white/30"}`}>VIDEO</span>
                      </div>
                    ) : (
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        sizes="10vw"
                        className="object-contain p-2"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Purchase panel */}
            <div className="flex flex-col gap-6 lg:pt-2">

              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-px bg-primary" />
                <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase font-[Montserrat]">
                  Zewa Feeds · Betta Range
                </span>
              </div>

              {/* Title + tagline */}
              <div>
                <h1 className="font-[Playfair_Display] text-[36px] sm:text-[44px] leading-[1.1] text-white mb-3">
                  Betta Bites F3
                </h1>
                <p className="text-[15px] text-white/55 leading-relaxed font-[Montserrat] max-w-md">
                  Nutrition for Vibrant, Healthy Bettas — 100% Natural Formula
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <span key={`pdp-star-${i}`} className="text-primary text-sm">★</span>
                ))}
                <span className="text-[12px] text-white/35 font-[Montserrat] ml-1">4.9 · 180+ reviews</span>
              </div>

              {/* Pack selector */}
              <div>
                <p className="text-[11px] text-white/40 tracking-[0.12em] uppercase font-[Montserrat] mb-3">Pack Size</p>
                <div className="flex gap-3">
                  {PACKS.map((p, i) => (
                    <button
                      key={p.size}
                      onClick={() => setActivePack(i)}
                      className={`relative flex-1 py-3 px-4 rounded-xl border text-[13px] font-semibold font-[Montserrat] transition-all duration-200 ${
                        activePack === i
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/12 bg-white/3 text-white/50 hover:border-white/25"
                      }`}
                    >
                      {p.size}
                      {p.badge && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-[#00382d] text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide whitespace-nowrap">
                          {p.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-[Playfair_Display] text-[40px] text-primary leading-none">
                  {pack.price}
                </span>
                <span className="text-[15px] text-white/30 line-through font-[Montserrat]">{pack.mrp}</span>
                <span className="text-[12px] text-emerald-400 font-semibold font-[Montserrat]">
                  {Math.round((1 - parseInt(pack.price.replace(/[^\d]/g, "")) / parseInt(pack.mrp.replace(/[^\d]/g, ""))) * 100)}% off
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-primary text-[#00382d] py-4 px-6 font-bold text-[13px] tracking-widest uppercase font-[Montserrat] hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 rounded-sm">
                  Add to Cart
                </button>
                <button className="flex-1 border border-primary text-primary py-4 px-6 font-bold text-[13px] tracking-widest uppercase font-[Montserrat] hover:bg-primary hover:text-[#00382d] active:scale-[0.98] transition-all duration-200 rounded-sm">
                  Buy Now
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {TRUST_BADGES.map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-1.5 py-3 px-2 bg-white/3 border border-white/6 rounded-xl">
                    <span className="text-lg">{b.icon}</span>
                    <span className="text-[10px] text-white/45 text-center leading-tight font-[Montserrat] tracking-wide">{b.label}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-white/20 font-[Montserrat]">SKU: {pack.sku}</p>
            </div>
          </div>
        </section>

        {/* ── Tab Navigation ────────────────────────────────────────────── */}
        <div className="sticky top-20 z-30 bg-[#080e1c]/95 backdrop-blur-md border-b border-white/6">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="flex gap-0 overflow-x-auto no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 px-5 py-4 text-[12px] font-semibold tracking-[0.1em] uppercase font-[Montserrat] border-b-2 transition-all duration-200 ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-white/35 hover:text-white/60"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tab Content ───────────────────────────────────────────────── */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">

          {/* OVERVIEW */}
          {activeTab === "Overview" && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-primary" />
                <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase font-[Montserrat]">Overview</span>
              </div>
              <h2 className="font-[Playfair_Display] text-[32px] sm:text-[40px] text-white mb-6 leading-tight max-w-xl">
                Engineered for the species.<br />Proven in the tank.
              </h2>
              <p className="text-[15px] text-white/55 leading-relaxed font-[Montserrat] max-w-2xl mb-14">
                Zewa Betta Bites F3 is a precision-formulated, 100% natural ornamental fish feed developed
                exclusively for <em>Betta splendens</em>. Built on an insect meal base for 88% protein
                digestibility, enriched with spirulina for immunity, and loaded with natural carotenoids
                for vivid colour expression.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.title} className="bg-white/3 border border-white/6 rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
                    <span className="text-2xl">{h.icon}</span>
                    <div>
                      <p className="text-[13px] font-semibold text-white font-[Montserrat] leading-snug mb-1">{h.title}</p>
                      <p className="text-[11px] text-white/40 font-[Montserrat] leading-snug">{h.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          {activeTab === "Description" && (
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-primary" />
                <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase font-[Montserrat]">Detailed Description</span>
              </div>
              <h2 className="font-[Playfair_Display] text-[32px] text-white mb-10 leading-tight">
                What makes F3 different?
              </h2>
              {[
                {
                  q: "Why insect protein?",
                  p: "Zewa Betta Bites F3 is built on an insect meal base — specifically Black Soldier Fly (BSF) larvae. For millions of years, aquatic species including bettas have relied on insect protein as their primary amino acid source. Insect meal achieves 88% protein digestibility, compared to 65–72% for conventional soy-based feeds. This means less waste, less ammonia, and more nutrition reaching the fish."
                },
                {
                  q: "Who is it for?",
                  p: "F3 is formulated exclusively for Betta splendens in all popular strains — Veiltail, Crowntail, Halfmoon, Double Tail, Plakat, and Giant Betta. Whether you're a hobby keeper, competitive show breeder, or commercial hatchery operator, F3 delivers consistent results across life stages."
                },
                {
                  q: "What about pellet size and feeding behaviour?",
                  p: "The 0.6–0.8mm pellet diameter is precisely calibrated for the upturned terminal mouth anatomy of Betta splendens. The slow-sinking density suits bettas' natural surface and mid-water feeding posture — preventing surface bloom and keeping your tank clean."
                },
                {
                  q: "How does colour enhancement work?",
                  p: "Natural carotenoids — including paprica essence — are incorporated at levels shown to intensify vivid reds, blues, and metallic iridescence in betta fins and body. Unlike synthetic astaxanthin, these carotenoids are metabolised more efficiently and carry no risk of colour bleaching at higher doses."
                },
                {
                  q: "What about immunity?",
                  p: "Spirulina is included at a functional dose, delivering phycocyanin compounds that actively support the betta's immune response. Combined with moringa extract (a natural anti-inflammatory) and garlic powder (natural antimicrobial), F3 provides whole-body resilience without pharmaceutical intervention."
                },
              ].map(({ q, p }) => (
                <div key={q} className="mb-8 pb-8 border-b border-white/6 last:border-0">
                  <h3 className="font-[Playfair_Display] text-[20px] text-primary mb-3">{q}</h3>
                  <p className="text-[15px] text-white/60 leading-[1.8] font-[Montserrat]">{p}</p>
                </div>
              ))}
            </div>
          )}

          {/* FEATURES */}
          {activeTab === "Features" && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-primary" />
                <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase font-[Montserrat]">Key Features</span>
              </div>
              <h2 className="font-[Playfair_Display] text-[32px] text-white mb-12 leading-tight">
                Eight reasons to switch.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {FEATURES.map((f) => (
                  <div key={f.title} className="bg-white/3 border border-white/6 rounded-2xl p-6 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-lg group-hover:bg-primary/15 transition-colors">
                      {f.icon}
                    </div>
                    <h3 className="text-[14px] font-semibold text-white font-[Montserrat] mb-2 leading-snug">{f.title}</h3>
                    <p className="text-[12px] text-white/40 font-[Montserrat] leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INGREDIENTS */}
          {activeTab === "Ingredients" && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-primary" />
                <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase font-[Montserrat]">Ingredients & Nutrition</span>
              </div>
              <h2 className="font-[Playfair_Display] text-[32px] text-white mb-12 leading-tight">
                What's inside F3.
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                <div>
                  <h3 className="text-[12px] font-bold text-white/50 tracking-[0.15em] uppercase font-[Montserrat] mb-5">
                    Declared Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {INGREDIENTS.map((ing) => (
                      <span key={ing} className="px-3 py-1.5 bg-white/4 border border-white/8 rounded-full text-[12px] text-white/60 font-[Montserrat] hover:border-primary/30 hover:text-white/80 transition-colors">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[12px] font-bold text-white/50 tracking-[0.15em] uppercase font-[Montserrat] mb-5">
                    Nutritional Analysis (Guaranteed)
                  </h3>
                  <div className="border border-white/8 rounded-2xl overflow-hidden">
                    {NUTRITION.map((row, i) => (
                      <div
                        key={row.nutrient}
                        className={`flex justify-between items-center px-5 py-3.5 ${i % 2 === 0 ? "bg-white/3" : "bg-transparent"} ${i > 0 ? "border-t border-white/5" : ""}`}
                      >
                        <span className="text-[13px] text-white/60 font-[Montserrat]">{row.nutrient}</span>
                        <span className={`text-[14px] font-bold font-[Montserrat] ${i === 0 ? "text-primary" : "text-white/80"}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] text-white/25 font-[Montserrat] leading-relaxed">
                    Values subject to change. Tested by NABL accredited laboratory.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SUITABLE FOR */}
          {activeTab === "Suitable For" && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-primary" />
                <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase font-[Montserrat]">Suitable For</span>
              </div>
              <h2 className="font-[Playfair_Display] text-[32px] text-white mb-4 leading-tight">
                All Betta splendens varieties.
              </h2>
              <p className="text-[14px] text-white/45 font-[Montserrat] mb-12 max-w-xl">
                F3 is formulated to meet the nutritional demands of every betta strain — from delicate show fish to robust fighters.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {BETTA_VARIETIES.map((v) => (
                  <div key={v.name} className="group flex flex-col overflow-hidden rounded-2xl border border-white/6 hover:border-primary/30 transition-all duration-300 bg-white/3">
                    <div className="aspect-square bg-gradient-to-br from-[#0d1a2e] to-[#091a18] flex items-center justify-center">
                      <span className="text-[11px] text-white/25 font-[Montserrat] text-center px-3 leading-snug">{v.name}</span>
                    </div>
                    <div className="p-3">
                      <p className="text-[13px] font-semibold text-white font-[Montserrat] mb-1">{v.name}</p>
                      <p className="text-[10px] text-white/35 font-[Montserrat] leading-snug">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PACK INFO */}
          {activeTab === "Pack Info" && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-primary" />
                <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase font-[Montserrat]">SKU & Pack Info</span>
              </div>
              <h2 className="font-[Playfair_Display] text-[32px] text-white mb-10 leading-tight">
                Pricing & availability.
              </h2>
              <div className="max-w-xl border border-white/8 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-4 bg-white/5 px-5 py-3 border-b border-white/8">
                  {["Pack", "MRP", "Avg. Sell Price", "SKU"].map((h) => (
                    <span key={h} className="text-[11px] font-bold text-white/40 tracking-[0.1em] uppercase font-[Montserrat]">{h}</span>
                  ))}
                </div>
                {PACKS.map((p, i) => (
                  <div key={p.sku} className={`grid grid-cols-4 px-5 py-4 ${i % 2 === 0 ? "bg-white/2" : ""} ${i > 0 ? "border-t border-white/6" : ""}`}>
                    <span className="text-[14px] font-semibold text-white font-[Montserrat]">{p.size}</span>
                    <span className="text-[14px] text-white/60 font-[Montserrat]">{p.mrp}</span>
                    <span className="text-[14px] text-primary font-semibold font-[Montserrat]">{p.price}</span>
                    <span className="text-[12px] text-white/35 font-[Montserrat] font-mono">{p.sku}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ── You May Also Like ─────────────────────────────────────────── */}
        <section className="border-t border-white/6 bg-[#0a1118]">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-primary" />
              <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase font-[Montserrat]">Also in the Range</span>
            </div>
            <h2 className="font-[Playfair_Display] text-[28px] text-white mb-10">
              You may also like.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {RELATED.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-white/6 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-[#0d1a2e] to-[#091a18] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 bg-white/3 flex flex-col gap-2">
                    <h3 className="text-[15px] font-semibold text-white font-[Montserrat] group-hover:text-primary transition-colors">{p.name}</h3>
                    <p className="text-[12px] text-white/40 font-[Montserrat] leading-relaxed">{p.tagline}</p>
                    <span className="mt-2 text-[11px] font-bold text-primary tracking-wider uppercase font-[Montserrat] border-b border-primary/30 pb-0.5 self-start">
                      View Product →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
