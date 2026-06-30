"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { navLinks } from "@/lib/content";
import { useCart } from "@/lib/cartContext";

// ── Dropdown data ─────────────────────────────────────────────────────────────

const SPECIES = [
  {
    label: "Betta Fish",
    sub: "Slow-sinking micro pellets",
    href: "/products?filter=Slow+Sinking+Pellets",
    image: "/Bottles/Betta/Betta F3_Front.png",
    accent: "#44e5c2",
    glow: "rgba(68,229,194,0.15)",
  },
  {
    label: "Cichlids",
    sub: "Floating high-energy pellets",
    href: "/products?filter=Floating+Pellets",
    image: "/Bottles/Cichild/Cichild C4_Front.png",
    accent: "#38bdf8",
    glow: "rgba(56,189,248,0.15)",
  },
  {
    label: "Guppies",
    sub: "Bottom-dwelling micro feeds",
    href: "/products?filter=Bottom+Dwellers",
    image: "/Bottles/Guppy/Guppy G2_Front.png",
    accent: "#44e5c2",
    glow: "rgba(68,229,194,0.12)",
  },
  {
    label: "Hatchery",
    sub: "Fry starters & larvae feeds",
    href: "/products?filter=Hatchery+Feeds",
    image: "/Bottles/DBSFL/DBSFL 25G.png",
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.15)",
  },
];

const FORMATS = [
  { label: "Dried BSF Larvae",     sub: "Whole insect protein",  href: "/products?filter=Dried+BSF+Larvae",      dot: "#a78bfa" },
  { label: "Slow Sinking Pellets", sub: "Mid-water feeders",     href: "/products?filter=Slow+Sinking+Pellets",  dot: "#44e5c2" },
  { label: "Floating Pellets",     sub: "Surface feeders",       href: "/products?filter=Floating+Pellets",      dot: "#38bdf8" },
  { label: "1 kg Value Packs",     sub: "Breeders & hatcheries", href: "/products?filter=1kg+Packs",             dot: "#fb923c" },
];

const LEARN_MENU = [
  {
    label: "Knowledge Hub",
    sub: "Research-backed articles on aquatic nutrition",
    href: "/blog",
    accent: "#44e5c2",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M4 4h16v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M9 9h6M9 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Our Science",
    sub: "Bio-availability data & digestion benchmarks",
    href: "/#science",
    accent: "#38bdf8",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M9 3v8l-4 6h14l-4-6V3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 3h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="12" cy="17" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: "Sustainability",
    sub: "How BSF farming reduces aquaculture's footprint",
    href: "/blog/reducing-ammonia-output",
    accent: "#4ade80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M12 3C8 3 5 7 5 11c0 3 2 5.5 5 6.5V20h4v-2.5c3-1 5-3.5 5-6.5 0-4-3-8-7-8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "About Zewa",
    sub: "Our mission, team & manufacturing process",
    href: "/#about",
    accent: "#fb923c",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// ── Chevron ───────────────────────────────────────────────────────────────────

function Chevron({ open }) {
  return (
    <svg viewBox="0 0 12 12" fill="none"
      className="w-2.5 h-2.5 shrink-0 transition-transform duration-200"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Products mega menu ────────────────────────────────────────────────────────

function ProductsMega({ visible }) {
  const [hovered, setHovered] = useState(null);
  const active = hovered !== null ? SPECIES[hovered] : null;

  return (
    <div
      className="absolute top-full left-1/2 z-[200]"
      style={{
        width: "780px",
        maxWidth: "96vw",
        transform: `translateX(-50%) translateY(${visible ? "0px" : "-8px"})`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.2s ease, transform 0.2s ease",
      }}
    >
      <div className="h-3 w-full" />
      <div className="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(8,14,26,0.97)", backdropFilter: "blur(32px)" }}>

        {/* Top accent line */}
        <div className="h-[1px] w-full" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.5) 40%, rgba(68,229,194,0.5) 60%, transparent)" }} />

        <div className="grid grid-cols-[1fr_1px_200px_1px_220px]">

          {/* ── Left: species + format ── */}
          <div className="p-6">

            {/* By Species */}
            <p className="text-[9px] font-bold tracking-[0.25em] font-[Montserrat] uppercase mb-4"
              style={{ color: "rgba(68,229,194,0.5)" }}>Shop by Species</p>
            <div className="grid grid-cols-2 gap-1 mb-6">
              {SPECIES.map((s, i) => (
                <a key={s.label} href={s.href}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 overflow-hidden"
                  style={{ background: hovered === i ? `${s.glow}` : "transparent" }}>
                  {/* left accent bar on hover */}
                  <div className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full transition-all duration-150"
                    style={{ background: s.accent, opacity: hovered === i ? 1 : 0 }} />
                  <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ background: hovered === i ? `${s.glow}` : "rgba(255,255,255,0.04)", border: `1px solid ${hovered === i ? s.accent + "50" : "rgba(255,255,255,0.06)"}`, transition: "all 0.15s" }}>
                    <Image src={s.image} alt={s.label} width={28} height={28}
                      className="object-contain w-full h-full p-0.5"
                      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold font-[Montserrat] leading-none mb-0.5 transition-colors duration-150"
                      style={{ color: hovered === i ? s.accent : "rgba(255,255,255,0.8)" }}>{s.label}</p>
                    <p className="text-[10px] font-[Montserrat]" style={{ color: "rgba(255,255,255,0.28)" }}>{s.sub}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px mb-5" style={{ background: "rgba(255,255,255,0.06)" }} />

            {/* By Format */}
            <p className="text-[9px] font-bold tracking-[0.25em] font-[Montserrat] uppercase mb-3"
              style={{ color: "rgba(68,229,194,0.5)" }}>Shop by Format</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {FORMATS.map((f) => (
                <a key={f.label} href={f.href}
                  className="group flex items-center gap-2 py-1.5 transition-colors duration-150">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-150 group-hover:scale-125"
                    style={{ background: f.dot }} />
                  <span className="text-[11px] font-[Montserrat] font-medium transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = f.dot}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>
                    {f.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Divider col */}
          <div style={{ background: "rgba(255,255,255,0.06)" }} />

          {/* ── Middle: preview on hover, stat block at rest ── */}
          <div className="relative flex flex-col items-center justify-center p-5 overflow-hidden">
            {/* Ambient glow that shifts with hovered species */}
            <div className="absolute inset-0 transition-all duration-500 pointer-events-none"
              style={{ background: active ? `radial-gradient(ellipse at 50% 60%, ${active.glow}, transparent 70%)` : "radial-gradient(ellipse at 50% 60%, rgba(68,229,194,0.06), transparent 70%)" }} />

            {active ? (
              <>
                <Image src={active.image} alt={active.label} width={120} height={120}
                  className="relative z-10 object-contain max-h-[110px] w-auto transition-all duration-300"
                  style={{ filter: `drop-shadow(0 8px 24px ${active.accent}55)` }} />
                <p className="relative z-10 mt-3 text-[11px] font-semibold font-[Montserrat] text-center"
                  style={{ color: active.accent }}>{active.label}</p>
                <p className="relative z-10 text-[10px] font-[Montserrat] text-center mt-0.5"
                  style={{ color: "rgba(255,255,255,0.3)" }}>{active.sub}</p>
              </>
            ) : (
              <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                <div className="grid grid-cols-2 gap-2 w-full">
                  {[{ val: "46%", label: "Max Protein" }, { val: "88%", label: "Digestibility" }, { val: "0%", label: "Soy Fillers" }, { val: "4.2×", label: "vs Fishmeal" }].map((s) => (
                    <div key={s.label} className="flex flex-col items-center px-2 py-2.5 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(68,229,194,0.1)" }}>
                      <span className="font-[Playfair_Display] text-[18px] leading-none text-primary">{s.val}</span>
                      <span className="text-[9px] font-[Montserrat] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-[Montserrat] italic" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Hover a species to preview
                </p>
              </div>
            )}
          </div>

          {/* Divider col */}
          <div style={{ background: "rgba(255,255,255,0.06)" }} />

          {/* ── Right: featured CTA ── */}
          <div className="flex flex-col">
            <a href="/products/betta-bites-f3" className="group flex flex-col flex-1 relative overflow-hidden">
              {/* Dark image bg */}
              <div className="relative flex items-center justify-center flex-1 min-h-[160px]"
                style={{ background: "linear-gradient(160deg, #0d1f2e 0%, #091914 100%)" }}>
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 65%, rgba(68,229,194,0.18), transparent 65%)" }} />
                <Image src="/Bottles/Betta/Betta F3_Front.png" alt="Betta Bites F3" width={130} height={130}
                  className="relative z-10 object-contain max-h-[130px] w-auto transition-transform duration-500 group-hover:scale-108 group-hover:-translate-y-1"
                  style={{ filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.6))" }} />
                <span className="absolute top-3 left-3 text-[8px] font-bold px-2 py-1 rounded-full tracking-[0.18em] font-[Montserrat] bg-primary text-[#00382d]">
                  BESTSELLER
                </span>
              </div>

              {/* Text */}
              <div className="px-5 py-4 border-t border-white/6 flex flex-col gap-1.5">
                <p className="text-[9px] font-bold tracking-[0.2em] font-[Montserrat] uppercase" style={{ color: "rgba(68,229,194,0.5)" }}>Featured Formula</p>
                <p className="font-[Playfair_Display] text-[15px] text-white leading-snug group-hover:text-primary transition-colors duration-200">Betta Bites F3</p>
                <p className="text-[10px] font-[Montserrat] leading-snug" style={{ color: "rgba(255,255,255,0.28)" }}>46% insect protein · zero soy fillers</p>
                <span className="mt-1 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase font-[Montserrat] text-primary">
                  Explore
                  <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5 transition-transform duration-200 group-hover:translate-x-0.5">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </a>

            {/* View all strip */}
            <a href="/products"
              className="group flex items-center justify-center gap-2 py-3 border-t border-white/6 text-[10px] font-bold tracking-[0.18em] uppercase font-[Montserrat] transition-all duration-200 hover:bg-primary/8"
              style={{ color: "rgba(68,229,194,0.6)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#44e5c2"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(68,229,194,0.6)"}>
              View All Formulas
              <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5 transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Learn dropdown ────────────────────────────────────────────────────────────

function LearnDropdown({ visible }) {
  return (
    <div
      className="absolute top-full left-1/2 z-[200]"
      style={{
        width: "320px",
        transform: `translateX(-50%) translateY(${visible ? "0px" : "-8px"})`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.2s ease, transform 0.2s ease",
      }}
    >
      <div className="h-3 w-full" />
      <div className="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(8,14,26,0.97)", backdropFilter: "blur(32px)" }}>

        {/* Top accent line */}
        <div className="h-[1px] w-full" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.4) 50%, transparent)" }} />

        <div className="p-2">
          {LEARN_MENU.map((item) => (
            <a key={item.label} href={item.href}
              className="group flex items-start gap-4 px-4 py-3.5 rounded-xl transition-all duration-150 relative overflow-hidden"
              style={{ "--accent": item.accent }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${item.accent}10`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {/* Icon box */}
              <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ background: `${item.accent}15`, border: `1px solid ${item.accent}25`, color: item.accent }}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold font-[Montserrat] leading-none mb-1 transition-colors duration-150"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = item.accent}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.85)"}>
                  {item.label}
                </p>
                <p className="text-[11px] font-[Montserrat] leading-snug" style={{ color: "rgba(255,255,255,0.28)" }}>
                  {item.sub}
                </p>
              </div>
              <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-150 group-hover:translate-x-0.5"
                style={{ color: item.accent }}>
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mx-4 mb-3 mt-1">
          <a href="/blog"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold tracking-[0.18em] uppercase font-[Montserrat] transition-all duration-200"
            style={{ background: "rgba(68,229,194,0.08)", border: "1px solid rgba(68,229,194,0.15)", color: "rgba(68,229,194,0.7)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(68,229,194,0.14)"; e.currentTarget.style.color = "#44e5c2"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(68,229,194,0.08)"; e.currentTarget.style.color = "rgba(68,229,194,0.7)"; }}>
            Browse All Articles
            <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Cart icon ─────────────────────────────────────────────────────────────────

function CartIcon({ onClick, totalItems }) {
  return (
    <button
      onClick={onClick}
      className="relative w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:border-primary/50 hover:text-primary transition-all duration-200"
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
        <path d="M1 1h2.5l1.6 8M5.1 9h14.4l-1.8 8H6.9L5.1 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="20.5" r="1" fill="currentColor" />
        <circle cx="17" cy="20.5" r="1" fill="currentColor" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-primary text-[#00382d] text-[9px] font-bold font-[Montserrat] flex items-center justify-center leading-none">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // "products" | "learn" | null
  const pathname = usePathname();
  const { totalItems, setDrawerOpen } = useCart();
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openMenu = (name) => { clearTimeout(closeTimer.current); setActiveMenu(name); };
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setActiveMenu(null), 120); };
  const cancelClose = () => clearTimeout(closeTimer.current);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("#")[0]) && href.split("#")[0] !== "/";
  };

  const isShopPage = pathname === "/products" || pathname.startsWith("/products/") || pathname === "/cart" || pathname === "/checkout";
  const showCart = isShopPage || totalItems > 0;

  return (
    <header
      className={`fixed top-0 w-full z-50 h-20 transition-colors duration-300 ${
        scrolled ? "glass-nav" : "bg-surface/50 backdrop-blur-md"
      } shadow-2xl shadow-black/20`}
    >
      <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto px-8 h-full">

        {/* Logo */}
        <a href="/" className="shrink-0">
          <Image
            src="/logo-transparent.png"
            alt="Zewa Feeds"
            width={130}
            height={130}
            className="h-[72px] w-auto object-contain brightness-0 invert"
            priority
          />
        </a>

        {/* Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => {
            // Products — replace plain link with mega menu trigger
            if (link.label === "Products") {
              return (
                <div key="Products" className="relative"
                  onMouseEnter={() => openMenu("products")}
                  onMouseLeave={scheduleClose}>
                  <button
                    className={`flex items-center gap-1.5 font-button text-button transition-colors ${
                      isActive(link.href) ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    {link.label} <Chevron open={activeMenu === "products"} />
                  </button>
                  <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
                    <ProductsMega visible={activeMenu === "products"} />
                  </div>
                </div>
              );
            }

            // Knowledge Hub — replace with Learn dropdown trigger
            if (link.label === "Knowledge Hub") {
              return (
                <div key="Knowledge Hub" className="relative"
                  onMouseEnter={() => openMenu("learn")}
                  onMouseLeave={scheduleClose}>
                  <button
                    className={`flex items-center gap-1.5 font-button text-button transition-colors ${
                      isActive(link.href) ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    {link.label} <Chevron open={activeMenu === "learn"} />
                  </button>
                  <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
                    <LearnDropdown visible={activeMenu === "learn"} />
                  </div>
                </div>
              );
            }

            // All other links — unchanged
            return (
              <a
                key={link.label}
                href={link.href}
                className={
                  isActive(link.href)
                    ? "text-primary font-bold border-b-2 border-primary pb-1 font-button text-button"
                    : "text-on-surface-variant hover:text-on-surface transition-colors font-button text-button"
                }
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop CTAs — unchanged */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {showCart && (
            <CartIcon onClick={() => setDrawerOpen(true)} totalItems={totalItems} />
          )}
          {!isShopPage && (
            <a href="/products" className="border border-primary text-primary px-5 py-2 font-button text-[12px] tracking-wider uppercase hover:bg-primary hover:text-on-primary active:scale-95 transition-all duration-200">
              Buy Now
            </a>
          )}
          <button className="border border-primary/35 text-primary/55 px-5 py-2 font-button text-[12px] tracking-wider uppercase hover:border-primary hover:text-primary hover:bg-primary/8 active:scale-95 transition-all duration-200">
            Find a Dealer
          </button>
        </div>

        {/* Mobile CTAs — unchanged */}
        <div className="md:hidden flex items-center gap-2">
          {showCart && (
            <CartIcon onClick={() => setDrawerOpen(true)} totalItems={totalItems} />
          )}
          {!isShopPage && (
            <a href="/products" className="border border-primary text-primary px-4 py-2 font-button text-[12px] uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-all duration-200">
              Buy Now
            </a>
          )}
        </div>

      </div>
    </header>
  );
}
