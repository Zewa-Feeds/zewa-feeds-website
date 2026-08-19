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
  {
    href: "/account",
    label: "My Account",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/account/orders",
    label: "Orders",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    href: "/account/profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    href: "/account/addresses",
    label: "Addresses",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export default function AccountMenu() {
  const { customer, status, isAuthenticated, signOut, openAuthDrawer } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const pathname = usePathname();

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

  useEffect(() => setOpen(false), [pathname]);

  if (status === "loading") {
    return (
      <div className={`${ICON_CHROME} cursor-default opacity-60`} aria-hidden="true">
        <PersonIcon />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => openAuthDrawer("signin")}
        aria-label="Sign in to your account"
        className={ICON_CHROME}
      >
        <PersonIcon />
      </button>
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
          open ? "border-primary text-primary shadow-[0_0_12px_rgba(68,229,194,0.3)] bg-primary/10" : ""
        } font-[Montserrat] text-[11px] font-bold`}
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+12px)] z-50 w-64 overflow-hidden rounded-2xl border border-white/15 bg-[#09101f] shadow-[0_24px_60px_rgba(0,0,0,0.95)]"
        >
          {/* Header info */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 bg-[#0d1627]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/20 font-[Montserrat] text-[12px] font-bold text-primary shadow-[0_0_10px_rgba(68,229,194,0.3)]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate font-[Playfair_Display] text-[15px] font-medium text-white">
                {customer?.firstName} {customer?.lastName}
              </p>
              <p className="mt-0.5 truncate font-[Montserrat] text-[11px] text-white/45">
                {customer?.email}
              </p>
            </div>
          </div>

          <ul className="py-2 px-1.5">
            {MENU_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  role="menuitem"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-[Montserrat] text-[12.5px] text-white/75 transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                >
                  <span className="text-white/40 group-hover:text-primary">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="border-t border-white/8 p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left font-[Montserrat] text-[12.5px] text-white/55 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-red-400/70" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function MobileAccountLinks({ onNavigate }) {
  const { customer, status, isAuthenticated, signOut, openAuthDrawer } = useAuth();
  const pathname = usePathname();

  if (status === "loading") return <div className="h-[46px]" aria-hidden="true" />;

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          openAuthDrawer("signin");
        }}
        className="flex w-full items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 font-button text-[14px] text-primary transition-colors hover:bg-primary/20"
      >
        <PersonIcon />
        Sign in / Create account
      </button>
    );
  }

  const initials =
    `${customer?.firstName?.[0] ?? ""}${customer?.lastName?.[0] ?? ""}`.toUpperCase() || "A";

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-3 pb-3 border-b border-white/8">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/20 font-[Montserrat] text-[11px] font-bold text-primary">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-[Playfair_Display] text-[14px] text-white">
            {customer?.firstName} {customer?.lastName}
          </p>
          <p className="truncate font-[Montserrat] text-[10.5px] text-white/40">
            {customer?.email}
          </p>
        </div>
      </div>
      {MENU_ITEMS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="flex items-center gap-3 py-2 font-button text-[13.5px] text-white/80 transition-colors hover:text-primary"
        >
          <span className="text-white/40">{item.icon}</span>
          {item.label}
        </a>
      ))}
      <button
        type="button"
        onClick={() => {
          signOut();
          onNavigate?.();
        }}
        className="flex items-center gap-3 pt-2 text-left font-button text-[13.5px] text-red-400/80 transition-colors hover:text-red-400 border-t border-white/8"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign out
      </button>
    </div>
  );
}
