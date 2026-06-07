"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { navLinks } from "@/lib/content";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            src="/logo-blue.jpg"
            alt="Zewa Feeds"
            width={52}
            height={52}
            className="h-12 w-12 object-contain rounded"
            priority
          />
        </a>

        {/* Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.active
                  ? "text-primary font-bold border-b-2 border-primary pb-1 font-button text-button"
                  : "text-on-surface-variant hover:text-on-surface transition-colors font-button text-button"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA pair */}
        <div className="hidden md:flex items-center gap-0 shrink-0">
          {/* Buy Now — primary filled */}
          <button className="bg-primary text-on-primary px-6 py-[11px] font-button text-button active:scale-95 transition-transform uppercase tracking-wider">
            Buy Now
          </button>

          {/* Divider pill with "or" */}
          <div className="flex items-center self-stretch px-0">
            <div className="w-px h-5 bg-on-surface/15" />
            <span className="text-[10px] font-bold text-on-surface/40 tracking-[0.12em] uppercase px-2.5 leading-none select-none">
              or
            </span>
            <div className="w-px h-5 bg-on-surface/15" />
          </div>

          {/* Find Dealer — ghost, clearly readable */}
          <button className="border border-on-surface/20 text-on-surface/70 px-6 py-[11px] font-button text-button hover:text-on-surface hover:border-on-surface/50 hover:bg-on-surface/5 active:scale-95 transition-all duration-200 uppercase tracking-wider">
            Find Dealer
          </button>
        </div>

        {/* Mobile: Buy Now only */}
        <button className="md:hidden bg-primary text-on-primary px-5 py-2.5 font-button text-button uppercase tracking-wider">
          Buy Now
        </button>
      </div>
    </header>
  );
}
