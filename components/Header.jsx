"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { navLinks } from "@/lib/content";
import { useCart } from "@/lib/cartContext";
import { catalog } from "@/lib/api";

// ── Dropdown data ─────────────────────────────────────────────────────────────

/**
 * The products dropdown is loaded from the catalogue API.
 *
 * It used to be a hardcoded list, and every entry had gone stale — the slugs
 * ("betta-bites-f3", "guppy-bites-g2") no longer exist, so all five links
 * returned 404 from the site's main navigation. Only "View all products" is
 * fixed, because that route always exists.
 */
const VIEW_ALL = { label: "View all products →", href: "/products", accent: true };

const LEARN_MENU = [
  { label: "Knowledge Hub",  href: "/blog" },
  /*
   * Renamed to match its destination. It read "Sustainability" but pointed at
   * a single article, so it promised a section that does not exist.
   */
  { label: "Ammonia & Water Quality", href: "/blog/ammonia-reduction-high-absorption-diets" },
  { label: "About Zewa",    href: "/about" },
  { label: "Browse all articles →", href: "/blog", accent: true },
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

function ProductsDropdown({ visible, items }) {
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
          {[...items, VIEW_ALL].map((item, i) => (
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
          {LEARN_MENU.map((item) => (
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
  /** Mobile drawer. Separate from activeMenu, which is the desktop hover menus. */
  const [mobileOpen, setMobileOpen] = useState(false);
  /**
   * Which mobile submenu is expanded, by parent label. Null means all closed.
   *
   * Single value rather than a set, so opening one closes the other: the drawer
   * is a short panel on a phone and two open submenus push everything below the
   * fold. Both start collapsed — they used to render permanently expanded, so
   * the menu opened as a flat list of eleven links.
   */
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  /**
   * Products in the dropdown, from the catalogue API.
   *
   * Starts empty so the menu never shows a link to a product that does not
   * exist; a failed fetch simply leaves "View all products" on its own, which is
   * always valid.
   */
  const [productLinks, setProductLinks] = useState([]);
  const pathname = usePathname();
  const { totalItems, setDrawerOpen } = useCart();
  const closeTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;
    catalog
      .products()
      .then((list) => {
        if (cancelled) return;
        setProductLinks(
          list.slice(0, 6).map((p) => ({ label: p.name, href: `/products/${p.slug}` })),
        );
      })
      .catch(() => {
        /* menu falls back to "View all products" alone */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  /**
   * Dropdowns open on INTENT, not on the first pixel of hover.
   *
   * Passing over "Products" on the way to "About" used to flash the mega menu
   * open. A short dwell means the menu only appears when someone actually pauses
   * on it — and the label itself stays a link, so a click navigates immediately
   * without waiting for the menu.
   *
   * 1.5s rather than the original 2s: two seconds still read as the menu being
   * broken rather than deliberate.
   */
  const HOVER_OPEN_DELAY_MS = 1500;
  const CLOSE_DELAY_MS = 300;

  const openTimer = useRef(null);

  /** Start the dwell timer. */
  const scheduleOpen = (name) => {
    clearTimeout(closeTimer.current);
    clearTimeout(openTimer.current);
    if (activeMenu === name) return;
    openTimer.current = setTimeout(() => setActiveMenu(name), HOVER_OPEN_DELAY_MS);
  };

  /** Cancel a pending open and close after a short grace period. */
  const scheduleClose = () => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setActiveMenu(null), CLOSE_DELAY_MS);
  };

  /** Once the menu is open, moving into it must not close it. */
  const cancelClose = () => {
    clearTimeout(closeTimer.current);
    clearTimeout(openTimer.current);
  };

  /** Clicking the label navigates, so any pending menu should not appear. */
  const cancelOpen = () => {
    clearTimeout(openTimer.current);
    setActiveMenu(null);
  };

  /** Keyboard and touch users get an immediate toggle — no dwell. */
  const toggleMenu = (name) => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    setActiveMenu((current) => (current === name ? null : name));
  };

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

        {/*
          Logo + beta flag.

          The badge sits beside the wordmark rather than in a strip above the
          header: the header is a fixed 80px bar the hero is sized against, so
          a full-width band would push every page down and need offsets changed
          in several places. Here it costs no vertical space and appears on
          every page.

          `title` carries the explanation the badge itself has no room for.
        */}
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
          {navLinks.map((link) => {
            // Products — replace plain link with mega menu trigger
            if (link.label === "Products") {
              return (
                <div key="Products" className="relative pb-3 -mb-3"
                  onMouseEnter={() => scheduleOpen("products")}
                  onMouseLeave={scheduleClose}>
                  <a
                    href={link.href}
                    onClick={cancelOpen}
                    className={`flex items-center gap-1.5 font-button text-button transition-colors ${
                      isActive(link.href) ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    {link.label} <Chevron open={activeMenu === "products"} />
                  </a>
                  <ProductsDropdown visible={activeMenu === "products"} items={productLinks} />
                </div>
              );
            }

            // Knowledge Hub — replace with Learn dropdown trigger
            if (link.label === "Knowledge Hub") {
              return (
                <div key="Knowledge Hub" className="relative pb-3 -mb-3"
                  onMouseEnter={() => scheduleOpen("learn")}
                  onMouseLeave={scheduleClose}>
                  <a
                    href={link.href}
                    onClick={cancelOpen}
                    className={`flex items-center gap-1.5 font-button text-button transition-colors ${
                      isActive(link.href) ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    {link.label} <Chevron open={activeMenu === "learn"} />
                  </a>
                  <LearnDropdown visible={activeMenu === "learn"} />
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

          {/*
            The mobile nav was missing entirely — this block held only the cart
            and Buy Now, so on a phone there was no route to Products, Our
            Science, Knowledge Hub or About Us. The desktop <nav> is md:flex,
            with no small-screen equivalent.
          */}
          <button
            type="button"
            onClick={() =>
              setMobileOpen((v) => {
                // Collapse any open submenu on the way out, so reopening the
                // drawer always starts from the same clean list.
                if (v) setMobileSubmenu(null);
                return !v;
              })
            }
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

      {/*
        Mobile drawer.

        Rendered outside the flex row so it spans the full width below the bar.
        Products and Knowledge Hub have desktop dropdowns; here their children
        are flattened into indented sub-links, because a nested hover menu has
        no touch equivalent.
      */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          /*
           * z-50 and an OPAQUE background.
           *
           * The drawer had z-index:auto, so it created no stacking context above
           * the hero — the page showed straight through it and the menu read as
           * broken rather than as a panel. bg-surface/95 also let the slide
           * behind bleed through; blur alone could not carry it on a busy hero.
           */
          className="md:hidden absolute left-0 right-0 top-20 z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-white/10 bg-surface backdrop-blur-xl shadow-2xl shadow-black/40"
        >
          <ul className="flex flex-col px-5 py-4">
            {navLinks.map((link) => {
              /*
               * Which submenu, if any, hangs off this item. Products is driven
               * by the live catalogue, so it only counts as expandable once
               * those links have loaded.
               */
              const submenu =
                link.label === "Products"
                  ? productLinks
                  : link.label === "Knowledge Hub"
                  ? // Skip entries that repeat the parent. LEARN_MENU opens with
                    // "Knowledge Hub" -> /blog, identical to the parent link.
                    LEARN_MENU.filter((item) => item.href !== link.href)
                  : [];
              const expandable = submenu.length > 0;
              const expanded = mobileSubmenu === link.label;

              return (
              <li key={link.label} className="border-b border-white/5 last:border-0">
                {/*
                  The label and the toggle are SEPARATE controls. Tapping the
                  label still navigates — making the whole row a toggle would
                  strand anyone who wants the section landing page itself.
                */}
                <div className="flex items-center justify-between">
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block flex-1 py-3.5 font-button text-[14px] transition-colors ${
                      isActive(link.href) ? "text-primary" : "text-on-surface hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </a>

                  {expandable && (
                    <button
                      type="button"
                      onClick={() => setMobileSubmenu(expanded ? null : link.label)}
                      aria-expanded={expanded}
                      aria-label={`${expanded ? "Collapse" : "Expand"} ${link.label}`}
                      // -mr-2 pulls the 44px tap target back to the visual edge
                      // without shrinking it below the accessible minimum.
                      className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-on-surface-variant transition-colors hover:text-primary"
                    >
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className="h-3 w-3 transition-transform duration-200"
                        style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <path
                          d="M2 4l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {expandable && expanded && (
                  <ul className="pb-3 pl-4">
                    {submenu.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block py-2 text-[13px] transition-colors ${
                            item.accent
                              ? "text-primary/80"
                              : "text-on-surface-variant hover:text-on-surface"
                          }`}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              );
            })}
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
