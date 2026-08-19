"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth, signInHref } from "@/lib/authContext";

/**
 * Account entry point in the header.
 *
 * Chrome is copied from `CartIcon` in Header.jsx on purpose — the two sit next to
 * each other, and any divergence in size, border or hover colour reads as a
 * mistake rather than a distinction.
 *
 * Signed out it is a plain link to /signin. Signed in it opens a popover, because
 * the useful actions (orders, profile, sign out) are worth one click rather than
 * a page load followed by a second click.
 */

const ICON_CHROME =
  "relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all duration-200 hover:border-primary/50 hover:text-primary";

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.8 20c.6-3.5 3.6-5.6 7.2-5.6s6.6 2.1 7.2 5.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const MENU_ITEMS = [
  { href: "/account", label: "My Account" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/addresses", label: "Addresses" },
];

export default function AccountMenu() {
  const { customer, status, isAuthenticated, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const pathname = usePathname();

  /* Close on outside click and on Escape — standard popover behaviour. */
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* A navigation should never leave the popover hanging open behind the new page. */
  useEffect(() => setOpen(false), [pathname]);

  /*
   * While the session is being determined, render the icon in its resting state
   * as a NON-interactive placeholder.
   *
   * The alternative — assuming signed out until proven otherwise — makes the
   * header visibly change on every page load for signed-in customers. Holding
   * the same shape means nothing moves; only the behaviour resolves.
   */
  if (status === "loading") {
    return (
      <div className={`${ICON_CHROME} cursor-default opacity-60`} aria-hidden="true">
        <PersonIcon />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <a
        href={signInHref(pathname)}
        aria-label="Sign in to your account"
        className={ICON_CHROME}
      >
        <PersonIcon />
      </a>
    );
  }

  const initials =
    `${customer?.firstName?.[0] ?? ""}${customer?.lastName?.[0] ?? ""}`.toUpperCase() || "A";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={`${ICON_CHROME} ${
          open ? "border-primary/50 text-primary" : ""
        } font-[Montserrat] text-[11px] font-bold`}
      >
        {/* Initials read as "this is *your* account" in a way a generic glyph does not. */}
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#090f1d]/97 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <div className="border-b border-white/8 px-4 py-3.5">
            <p className="truncate font-[Playfair_Display] text-[15px] text-white">
              {customer?.firstName} {customer?.lastName}
            </p>
            <p className="mt-0.5 truncate font-[Montserrat] text-[11px] text-white/35">
              {customer?.email}
            </p>
          </div>

          <ul className="py-1.5">
            {MENU_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  role="menuitem"
                  className="block px-4 py-2.5 font-[Montserrat] text-[12.5px] text-white/70 transition-colors hover:bg-white/[0.04] hover:text-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="border-t border-white/8 p-1.5">
            <button
              type="button"
              role="menuitem"
              /*
                Clears the session and nothing else — deliberately no navigation.
                On a product or cart page the customer stays where they were, and
                on an account page AccountShell's guard sends them home. Doing it
                here as well meant two navigations racing each other.
              */
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              className="w-full rounded-xl px-2.5 py-2.5 text-left font-[Montserrat] text-[12.5px] text-white/55 transition-colors hover:bg-red-500/[0.07] hover:text-red-400"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Account links for the mobile drawer.
 *
 * Mirrors the desktop popover. Rendered as plain rows rather than a nested
 * popover because the drawer is already a menu — a menu inside a menu is a
 * needless second interaction on a touch screen.
 */
export function MobileAccountLinks({ onNavigate }) {
  const { customer, status, isAuthenticated, signOut } = useAuth();
  const pathname = usePathname();

  /* Hold the row's height while the session resolves, so the drawer does not jump. */
  if (status === "loading") return <div className="h-[46px]" aria-hidden="true" />;

  if (!isAuthenticated) {
    return (
      <a
        href={signInHref(pathname)}
        onClick={onNavigate}
        className="flex items-center gap-3 py-3.5 font-button text-[14px] text-on-surface transition-colors hover:text-primary"
      >
        <span className="text-primary">
          <PersonIcon />
        </span>
        Sign in / Create account
      </a>
    );
  }

  return (
    <div className="flex flex-col">
      <p className="truncate pb-1 pt-3 font-[Montserrat] text-[11px] text-white/30">
        {customer?.email}
      </p>
      {MENU_ITEMS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="border-b border-white/5 py-3 font-button text-[14px] text-on-surface transition-colors last:border-0 hover:text-primary"
        >
          {item.label}
        </a>
      ))}
      <button
        type="button"
        onClick={() => {
          signOut();
          onNavigate?.();
        }}
        className="py-3 text-left font-button text-[14px] text-white/45 transition-colors hover:text-red-400"
      >
        Sign out
      </button>
    </div>
  );
}
