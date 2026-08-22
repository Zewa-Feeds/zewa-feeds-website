"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/content";
import { useCart } from "@/lib/cartContext";
import AccountMenu, { MobileAccountLinks } from "@/components/AccountMenu";

// ── Cart icon ─────────────────────────────────────────────────────────────────

function CartIcon({ onClick, totalItems }) {
  return (
    <button
      onClick={onClick}
      className="relative w-8 h-8 sm:w-9 sm:h-9 flex shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 hover:border-primary/50 hover:text-primary transition-all duration-200"
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-[18px] sm:h-[18px]">
        <path d="M1 1h2.5l1.6 8M5.1 9h14.4l-1.8 8H6.9L5.1 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="20.5" r="1" fill="currentColor" />
        <circle cx="17" cy="20.5" r="1" fill="currentColor" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[15px] sm:min-w-[16px] h-3.5 sm:h-4 px-0.5 rounded-full bg-primary text-[#00382d] text-[8px] sm:text-[9px] font-bold font-[Montserrat] flex items-center justify-center leading-none">
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
    if (!pathname) return false;
    const current = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
    const target = href.split("#")[0];
    if (target === "/" || target === "") return current === "/";
    return current === target || current.startsWith(`${target}/`);
  };

  const isShopPage = pathname === "/products" || pathname?.startsWith("/products/") || pathname === "/cart" || pathname === "/checkout";

  return (
    <header
      className={`fixed top-0 w-full z-50 h-20 transition-colors duration-300 ${
        scrolled ? "glass-nav" : "bg-surface/50 backdrop-blur-md"
      } shadow-2xl shadow-black/20`}
    >
      <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 h-full">

        {/* Logo + beta flag */}
        <Link href="/" className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <Image
            src="/logo-transparent.png"
            alt="Zewa Feeds"
            width={130}
            height={130}
            className="h-[46px] sm:h-[58px] md:h-[72px] w-auto object-contain brightness-0 invert"
            priority
          />
          <span
            title="This site is still being tested. Orders are live, but you may hit rough edges."
            className="rounded-full border border-[#d4793a]/40 bg-[#d4793a]/12 px-1.5 sm:px-2 py-[2px] sm:py-[3px] text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.14em] text-[#d4793a]"
          >
            Beta
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 font-button text-button transition-colors duration-200 ${
                  active
                    ? "text-primary font-bold drop-shadow-[0_0_12px_rgba(68,229,194,0.4)]"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(68,229,194,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs — uniform across all pages */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {!isShopPage ? (
            <Link href="/products" className="border border-primary text-primary px-5 py-2 font-button text-[12px] tracking-wider uppercase hover:bg-primary hover:text-on-primary active:scale-95 transition-all duration-200">
              Buy Now
            </Link>
          ) : (
            <Link href="/products" className="border border-primary/40 text-primary/80 px-5 py-2 font-button text-[12px] tracking-wider uppercase hover:border-primary hover:text-primary active:scale-95 transition-all duration-200">
              Shop All
            </Link>
          )}
          <button className="border border-primary/35 text-primary/55 px-5 py-2 font-button text-[12px] tracking-wider uppercase hover:border-primary hover:text-primary hover:bg-primary/8 active:scale-95 transition-all duration-200">
            Find a Dealer
          </button>
          <CartIcon onClick={() => setDrawerOpen(true)} totalItems={totalItems} />
          <AccountMenu />
        </div>

        {/* Mobile CTAs — uniform across all pages */}
        <div className="md:hidden flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!isShopPage && (
            <Link href="/products" className="whitespace-nowrap border border-primary text-primary px-2.5 sm:px-3 py-1.5 sm:py-2 font-button text-[10px] sm:text-[11px] uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-all duration-200">
              Buy Now
            </Link>
          )}
          <CartIcon onClick={() => setDrawerOpen(true)} totalItems={totalItems} />
          <AccountMenu />

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-white/10 shrink-0"
          >
            {mobileOpen ? (
              <svg width="18" height="18" className="sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" className="sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.label} className="border-b border-white/5 last:border-0">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between py-3.5 font-button text-[14px] transition-colors ${
                      active
                        ? "text-primary font-bold drop-shadow-[0_0_8px_rgba(68,229,194,0.3)]"
                        : "text-on-surface hover:text-primary"
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(68,229,194,0.9)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/*
            Account links in the drawer as well as the header icon.
            The icon is a 36px target competing with the cart; the drawer is
            where someone browsing on a phone actually looks for "my orders".
          */}
          <div className="border-t border-white/10 px-5 py-2">
            <MobileAccountLinks onNavigate={() => setMobileOpen(false)} />
          </div>

          <div className="border-t border-white/10 px-5 py-4">
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="block bg-primary py-3 text-center font-button text-button uppercase tracking-widest text-on-primary"
            >
              Shop All Products
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}


