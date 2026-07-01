"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { navLinks } from "@/lib/content";
import { useCart } from "@/lib/cartContext";

// ── Dropdown data ─────────────────────────────────────────────────────────────

const PRODUCT_LINKS = [
  { label: "Betta Bites F3",        href: "/products/betta-bites-f3" },
  { label: "Cichlid Bites C4",      href: "/products/cichlid-bites-c4" },
  { label: "Guppy Bites G2",        href: "/products/guppy-bites-g2" },
  { label: "Dried BSF Larvae 25g",  href: "/products/dried-bsf-larvae-25g" },
  { label: "Dried BSF Larvae 75g",  href: "/products/dried-bsf-larvae-75g" },
  { label: "View all products →",   href: "/products", accent: true },
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

// ── Products dropdown ─────────────────────────────────────────────────────────

function ProductsDropdown({ visible }) {
  return (
    <div
      className="absolute top-full left-1/2 z-[200]"
      style={{
        width: "220px",
        transform: `translateX(-50%) translateY(${visible ? "0px" : "-6px"})`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.15s ease, transform 0.15s ease",
      }}
    >
      <div className="h-3 w-full" />
      <div className="rounded-xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
        style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(8,14,26,0.97)", backdropFilter: "blur(24px)" }}>
        <div className="py-1.5">
          {PRODUCT_LINKS.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-5 py-2.5 text-[13px] font-[Montserrat] transition-colors duration-100 hover:bg-white/5"
              style={{
                color: item.accent ? "rgba(68,229,194,0.75)" : "rgba(255,255,255,0.65)",
                borderTop: item.accent ? "1px solid rgba(255,255,255,0.07)" : undefined,
                marginTop: item.accent ? "4px" : undefined,
              }}
            >
              {item.label}
            </a>
          ))}
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
                    <ProductsDropdown visible={activeMenu === "products"} />
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
