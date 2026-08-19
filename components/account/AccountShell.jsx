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
  { href: "/account", label: "Overview", exact: true },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

export default function AccountShell({ title, subtitle, children, actions }) {
  const { customer, status, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Was there ever a session on this page?
   *
   * It decides where "anonymous" should send someone, and the two cases want
   * opposite destinations:
   *
   *   never authenticated → a signed-out visitor followed a link here, so send
   *                         them to sign in and remember where they meant to go
   *   was authenticated   → they just signed out (or the session expired) while
   *                         standing here, so send them home
   *
   * Without the distinction, signing out from Settings bounced to
   * /signin?next=/account/settings — offering to return someone to the very
   * page they had just chosen to leave.
   *
   * This also makes the guard the ONLY thing that navigates on sign-out. When
   * the button did its own router.push('/') as well, the two raced and the
   * redirect won.
   */
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
      {/* overflow-x-clip: the decorative glow is wider than a phone viewport
          on purpose, and would otherwise add horizontal scroll. See AuthShell. */}
      <main className="relative min-h-dvh overflow-x-clip bg-[#06080f] pb-20 pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-16 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-[130px]"
        />

        <div className="relative mx-auto w-full max-w-[1180px] px-5 sm:px-8">
          {/* ---- Page heading ---- */}
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <EyebrowLabel>My Account</EyebrowLabel>
              <h1 className="mt-3.5 font-[Playfair_Display] text-[28px] leading-tight text-white sm:text-[36px]">
                {isLoading ? <Skeleton className="h-9 w-56" /> : title}
              </h1>
              {subtitle && !isLoading && (
                <p className="mt-2 font-[Montserrat] text-[13px] leading-relaxed text-white/40">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && !isLoading && <div className="shrink-0">{actions}</div>}
          </div>

          <div className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-8">
            {/* ---- Section nav ----
                Horizontally scrollable on mobile so five items never wrap into a
                stack that pushes the content itself off the first screen. */}
            <nav
              aria-label="Account sections"
              className="-mx-5 overflow-x-auto px-5 lg:mx-0 lg:overflow-visible lg:px-0"
            >
              <ul className="flex gap-2 lg:flex-col lg:gap-1">
                {NAV.map((item) => {
                  const current = isCurrent(item);
                  return (
                    <li key={item.href} className="shrink-0">
                      <a
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        className={`block whitespace-nowrap rounded-xl px-4 py-2.5 font-[Montserrat] text-[12.5px] transition-all duration-200 lg:px-4 ${
                          current
                            ? "bg-primary/10 font-semibold text-primary lg:border-l-2 lg:border-primary lg:rounded-l-none"
                            : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                        }`}
                      >
                        {item.label}
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
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="mt-4 h-4 w-full" />
                  <Skeleton className="mt-2.5 h-4 w-3/4" />
                  <Skeleton className="mt-2.5 h-4 w-1/2" />
                </div>
              ) : isAuthenticated ? (
                children
              ) : (
                /* Redirect is in flight — hold the layout rather than flashing empty. */
                <div className={`${PANEL} p-6 sm:p-8`}>
                  <Skeleton className="h-5 w-40" />
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
        <div className="flex items-start justify-between gap-4 border-b border-white/8 px-6 py-5 sm:px-8">
          <div>
            <h2 className="font-[Playfair_Display] text-[18px] text-white">{title}</h2>
            {description && (
              <p className="mt-1 font-[Montserrat] text-[12px] leading-relaxed text-white/35">
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
