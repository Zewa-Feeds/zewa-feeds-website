"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth, signInHref } from "@/lib/authContext";
import { EyebrowLabel, PANEL, Skeleton } from "./ui";

/**
 * Frame + guard for every signed-in account screen.
 *
 * The guard is client-side because the session is a bearer token in
 * localStorage, which no server render can see. That is safe here: this only
 * decides what to PAINT. Every byte of account data comes from endpoints that
 * verify the token themselves, so a visitor who defeats this redirect reaches a
 * shell whose panels all return 401.
 *
 * The three states are kept distinct to avoid the classic flash — during
 * "loading" a skeleton is shown rather than either the dashboard or a redirect,
 * so a signed-in customer never sees the sign-in page blink past on refresh.
 */

const NAV = [
  {
    href: "/account",
    label: "Overview",
    exact: true,
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
  {
    href: "/account/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

export default function AccountShell({ title, subtitle, children, actions }) {
  const { customer, status, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const wasAuthenticated = useRef(false);
  useEffect(() => {
    if (status === "authenticated") wasAuthenticated.current = true;
  }, [status]);

  useEffect(() => {
    if (status !== "anonymous") return;
    router.replace(wasAuthenticated.current ? "/" : signInHref(pathname));
  }, [status, pathname, router]);

  const isCurrent = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <>
      <Header />
      <main className="relative min-h-dvh overflow-x-clip bg-[#06080f] pb-24 pt-28">
        {/* Ambient mint background lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-12 h-[420px] w-[750px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[140px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 h-[300px] w-[300px] rounded-full bg-primary/[0.04] blur-[120px]"
        />

        <div className="relative mx-auto w-full max-w-[1180px] px-5 sm:px-8">
          {/* ---- Page heading ---- */}
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between border-b border-white/8 pb-6">
            <div>
              <EyebrowLabel>My Account</EyebrowLabel>
              <h1 className="mt-3 font-[Playfair_Display] text-[30px] leading-tight text-white sm:text-[38px]">
                {isLoading ? <Skeleton className="h-9 w-56" /> : title}
              </h1>
              {subtitle && !isLoading && (
                <p className="mt-2 font-[Montserrat] text-[13.5px] leading-relaxed text-white/50">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && !isLoading && <div className="shrink-0">{actions}</div>}
          </div>

          <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-8">
            {/* ---- Section nav ---- */}
            <nav
              aria-label="Account sections"
              className="-mx-5 overflow-x-auto px-5 lg:mx-0 lg:overflow-visible lg:px-0"
            >
              <ul className="flex gap-2 lg:flex-col lg:gap-1.5">
                {NAV.map((item) => {
                  const current = isCurrent(item);
                  return (
                    <li key={item.href} className="shrink-0">
                      <a
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        className={`flex items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 font-[Montserrat] text-[13px] transition-all duration-200 ${
                          current
                            ? "border border-primary/30 bg-primary/10 font-bold text-primary shadow-[0_0_20px_rgba(68,229,194,0.12)]"
                            : "border border-transparent text-white/60 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        <span className={current ? "text-primary drop-shadow-[0_0_8px_rgba(68,229,194,0.4)]" : "text-white/40"}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* ---- Section body ---- */}
            <div className="min-w-0">
              {isLoading ? (
                <div className={`${PANEL} p-6 sm:p-8`}>
                  <Skeleton className="h-6 w-44" />
                  <Skeleton className="mt-5 h-4 w-full" />
                  <Skeleton className="mt-3 h-4 w-3/4" />
                  <Skeleton className="mt-3 h-4 w-1/2" />
                </div>
              ) : isAuthenticated ? (
                children
              ) : (
                <div className={`${PANEL} p-6 sm:p-8`}>
                  <Skeleton className="h-6 w-44" />
                  <Skeleton className="mt-4 h-4 w-2/3" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/** Card wrapper for a block inside an account section. */
export function AccountCard({ title, description, actions, children, className = "" }) {
  return (
    <section className={`${PANEL} ${className}`}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
          <div>
            <h2 className="font-[Playfair_Display] text-[20px] font-medium text-white">{title}</h2>
            {description && (
              <p className="mt-1 font-[Montserrat] text-[12.5px] leading-relaxed text-white/45">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      <div className="px-6 py-6 sm:px-8">{children}</div>
    </section>
  );
}
