"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { navLinks } from "@/lib/content";
import { useCart } from "@/lib/cartContext";

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
  /** Mobile drawer state. */
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems, setDrawerOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

        {/* Logo + beta flag */}
        <a href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo-transparent.png"
            alt="Zewa Feeds"
            width={130}
            height={130}
            className="h-[72px] w-auto object-contain brightness-0 invert"
            priority
          />
          <span
            title="This site is still being tested. Orders are live, but you may hit rough edges."
            className="rounded-full border border-[#d4793a]/40 bg-[#d4793a]/12 px-2 py-[3px] text-[9px] font-bold uppercase tracking-[0.14em] text-[#d4793a]"
          >
            Beta
          </span>
        </a>

        {/* Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
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
          ))}
        </nav>

        {/* Desktop CTAs */}
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

        {/* Mobile: cart, Buy Now, and the nav toggle */}
        <div className="md:hidden flex items-center gap-2">
          {showCart && (
            <CartIcon onClick={() => setDrawerOpen(true)} totalItems={totalItems} />
          )}
          {!isShopPage && (
            <a href="/products" className="border border-primary text-primary px-4 py-2 font-button text-[12px] uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-all duration-200">
              Buy Now
            </a>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-white/10"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden absolute left-0 right-0 top-20 z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-white/10 bg-surface backdrop-blur-xl shadow-2xl shadow-black/40"
        >
          <ul className="flex flex-col px-5 py-4">
            {navLinks.map((link) => (
              <li key={link.label} className="border-b border-white/5 last:border-0">
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-3.5 font-button text-[14px] transition-colors ${
                    isActive(link.href) ? "text-primary" : "text-on-surface hover:text-primary"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="border-t border-white/10 px-5 py-4">
            <a
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="block bg-primary py-3 text-center font-button text-button uppercase tracking-widest text-on-primary"
            >
              Shop All Products
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

