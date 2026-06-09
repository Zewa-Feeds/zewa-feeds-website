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
            src="/logo-transparent.png"
            alt="Zewa Feeds"
            width={130}
            height={130}
            className="h-12 w-auto object-contain brightness-0 invert"
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
        <div className="hidden md:flex items-center shrink-0">
          {/* Buy Now */}
          <button className="border border-primary text-primary px-5 py-2 font-button text-[12px] tracking-wider uppercase hover:bg-primary hover:text-on-primary active:scale-95 transition-all duration-200">
            Buy Now
          </button>

          {/* or divider */}
          <span className="text-[10px] font-bold text-on-surface/30 tracking-[0.12em] uppercase px-3 select-none">
            or
          </span>

          {/* Find a Dealer */}
          <button className="border border-primary/35 text-primary/55 px-5 py-2 font-button text-[12px] tracking-wider uppercase hover:border-primary hover:text-primary hover:bg-primary/8 active:scale-95 transition-all duration-200">
            Find a Dealer
          </button>
        </div>

        {/* Mobile: Buy Now only */}
        <button className="md:hidden border border-primary text-primary px-4 py-2 font-button text-[12px] uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-all duration-200">
          Buy Now
        </button>
      </div>
    </header>
  );
}
