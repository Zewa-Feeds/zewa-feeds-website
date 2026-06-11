"use client";

import Image from "next/image";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/zewa_feeds/",
    hoverColor: "#e1306c",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/34740037/",
    hoverColor: "#0077b5",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/ZewaFeeds/",
    hoverColor: "#1877f2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/zewaecosystems",
    hoverColor: "#ffffff",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.727-8.83L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@zewafeeds",
    hoverColor: "#ff0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

const nav = {
  Products: [
    { label: "Guppy Bites G2", href: "#" },
    { label: "Betta Bites F3", href: "#" },
    { label: "Tetra Pellets F2", href: "#" },
    { label: "Cichlid Bites C4/C5", href: "#" },
    { label: "Pleco Bites P5", href: "#" },
    { label: "Shrimp Grazers S5", href: "#" },
    { label: "Hatch'E H1/H2/H3", href: "#" },
    { label: "View all products →", href: "/shop", accent: true },
  ],
  Learn: [
    { label: "Knowledge Hub", href: "#" },
    { label: "Feeding Guides", href: "#" },
    { label: "Hatchery Resources", href: "#" },
    { label: "Our Science", href: "#" },
  ],
  Company: [
    { label: "Find Nearest Dealer", href: "#" },
    { label: "Become a Distributor", href: "#" },
    { label: "Download Catalogue", href: "#" },
    { label: "About Us", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full bg-[#060914]">

      {/* ── Main content ─────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-12 lg:gap-8">

          {/* ── Brand panel ── */}
          <div className="flex flex-col gap-7">
            <div>
              <Image
                src="/logo-transparent.png"
                alt="Zewa Feeds"
                width={110}
                height={110}
                className="h-11 w-auto object-contain brightness-0 invert opacity-90"
              />
              <p className="mt-4 text-[13px] text-white/40 leading-[1.7] max-w-[240px]">
                Premium insect-protein nutrition for aquatic species — backed by lab-verified science.
              </p>
            </div>

            {/* Contact block */}
            <div className="flex flex-col gap-2.5">
              <a href="mailto:info@zewafeeds.com" className="group flex items-center gap-2.5 text-[13px] text-white/45 hover:text-primary transition-colors duration-200">
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0 text-white/25 group-hover:text-primary transition-colors">
                  <path d="M2.5 5.5A1.5 1.5 0 014 4h12a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5v-9z" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M2.5 5.5l7.5 5.5 7.5-5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                info@zewafeeds.com
              </a>
              <a href="tel:+919496642259" className="group flex items-center gap-2.5 text-[13px] text-white/45 hover:text-primary transition-colors duration-200">
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0 text-white/25 group-hover:text-primary transition-colors">
                  <path d="M3 4.5A1.5 1.5 0 014.5 3h1.879a.5.5 0 01.471.333l1.2 3.2a.5.5 0 01-.13.542L6.48 8.416a9.045 9.045 0 004.104 4.104l1.341-1.44a.5.5 0 01.542-.13l3.2 1.2a.5.5 0 01.333.471V14.5A1.5 1.5 0 0114.5 16 11.5 11.5 0 013 4.5z" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                +91 94966 42259
              </a>
              <a href="https://zewafeeds.com" className="text-[13px] text-primary/50 hover:text-primary transition-colors duration-200">
                zewafeeds.com
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{ "--hover-color": s.hoverColor }}
                  className="w-9 h-9 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center text-white/30 hover:text-[--hover-color] hover:border-white/15 hover:bg-white/8 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Nav columns ── */}
          {Object.entries(nav).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-[11px] font-semibold text-white/50 tracking-[0.14em] uppercase mb-5">
                {heading}
              </h4>
              <ul className="flex flex-col gap-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={`text-[13.5px] leading-none transition-colors duration-150 font-normal no-underline ${
                        link.accent
                          ? "text-primary/70 hover:text-primary"
                          : "text-white/45 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                {heading === "Learn" && (
                  <li className="mt-1 pt-4 border-t border-white/6">
                    <span className="text-[13px] text-[#d4793a]">Zewa Pet — Coming Soon</span>
                  </li>
                )}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────── */}
      <div className="border-t border-white/6">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[11px] text-white/20 tracking-wide">
            © 2026 Zewa Ecosystems Pvt Ltd · All rights reserved
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-[11px] text-white/20 hover:text-white/45 transition-colors tracking-wide">Privacy Policy</a>
            <span className="text-white/10">·</span>
            <a href="#" className="text-[11px] text-white/20 hover:text-white/45 transition-colors tracking-wide">Terms of Use</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
