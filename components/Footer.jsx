const footerData = {
  products: [
    { label: "Guppy Bites G2", href: "#" },
    { label: "Betta Bites F3", href: "#" },
    { label: "Tetra Pellets F2", href: "#" },
    { label: "Cichlid Bites C4/C5", href: "#" },
    { label: "Pleco Bites P5", href: "#" },
    { label: "Shrimp Grazers S5", href: "#" },
    { label: "Hatch'E H1/H2/H3", href: "#" },
    { label: "View all →", href: "/shop", accent: true },
  ],
  learn: [
    { label: "Knowledge Hub", href: "#" },
    { label: "Feeding Guides", href: "#" },
    { label: "Hatchery Resources", href: "#" },
    { label: "Our Science", href: "#" },
  ],
  connect: [
    { label: "Find Nearest Dealer", href: "#" },
    { label: "Become a Distributor", href: "#" },
    { label: "Download Catalogue", href: "#" },
  ],
};

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/zewa_feeds/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    color: "hover:text-[#e1306c]",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/34740037/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "hover:text-[#0077b5]",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/ZewaFeeds/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: "hover:text-[#1877f2]",
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/zewaecosystems",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.727-8.83L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "hover:text-white",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@zewafeeds",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    color: "hover:text-[#ff0000]",
  },
];

function ColHeading({ children }) {
  return (
    <h4 className="font-label-caps text-label-caps text-on-surface/40 tracking-[0.15em] mb-4">
      {children}
    </h4>
  );
}

function ColLink({ label, href, accent, muted, highlight }) {
  const base = "font-body-md text-[13px] leading-none block transition-colors duration-200 font-normal no-underline";
  let color = "text-on-surface/55 hover:text-on-surface";
  if (accent) color = "text-on-surface/40 hover:text-primary";
  if (muted) color = "text-on-surface/35 hover:text-on-surface/70";
  if (highlight === "youtube") color = "text-[#ff5900] hover:text-[#ff7733]";

  return (
    <a href={href} className={`${base} ${color}`}>
      {label}
    </a>
  );
}

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#070c18] border-t border-white/5">
      {/* Main grid */}
      <div className="max-w-[1440px] mx-auto px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr_1fr] gap-10 md:gap-10 items-start">

          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <Image
              src="/logo-transparent.png"
              alt="Zewa Feeds"
              width={120}
              height={120}
              className="h-12 w-auto object-contain brightness-0 invert opacity-90"
            />

            <p className="font-body-md text-[12px] text-on-surface/40 leading-relaxed italic">
              Advancing pet nutrition through insect protein science and functional ingredients.
            </p>

            <div className="space-y-1">
              <p className="font-body-md text-[12px] text-on-surface/30 leading-relaxed">
                17/31A TR Nair Road<br />Kuttanellur PO, Thrissur<br />Kerala — 680014
              </p>
              <a href="https://zewafeeds.com" className="font-body-md text-[12px] text-primary/70 hover:text-primary transition-colors block">
                zewafeeds.com
              </a>
            </div>

            {/* Social icons */}
            <div>
              <p className="font-label-caps text-[10px] text-on-surface/25 tracking-[0.15em] mb-2.5">FOLLOW US</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-7 h-7 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-on-surface/40 ${s.color} hover:bg-white/10 hover:border-white/20 transition-all duration-200`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <ColHeading>Products</ColHeading>
            <div className="flex flex-col gap-3">
              {footerData.products.map((item) => (
                <ColLink key={item.label} {...item} />
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <ColHeading>Learn</ColHeading>
            <div className="flex flex-col gap-3">
              {footerData.learn.map((item) => (
                <ColLink key={item.label} {...item} />
              ))}
              <div className="mt-3 pt-3 border-t border-white/5">
                <span className="font-body-md text-[13px] text-[#d4793a]">
                  Zewa Pet — Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Connect */}
          <div>
            <ColHeading>Connect</ColHeading>
            <div className="flex flex-col gap-3">
              {footerData.connect.map((item) => (
                <ColLink key={item.label} {...item} />
              ))}
              <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-3">
                <a href="mailto:info@zewafeeds.com" className="font-body-md text-[13px] text-on-surface/45 hover:text-primary transition-colors duration-200 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0 opacity-60">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
                  </svg>
                  info@zewafeeds.com
                </a>
                <a href="tel:+919496642259" className="font-body-md text-[13px] text-on-surface/45 hover:text-primary transition-colors duration-200 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0 opacity-60">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  +91 94966 42259
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1440px] mx-auto px-8 py-5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="font-label-caps text-[11px] text-on-surface/25 tracking-widest">
          © 2026 Zewa Ecosystems Pvt Ltd · All rights reserved
        </p>
        <div className="flex gap-6">
          <a href="#" className="font-label-caps text-[11px] text-on-surface/25 hover:text-on-surface/50 tracking-widest transition-colors">
            Privacy Policy
          </a>
          <span className="text-on-surface/15 text-[11px]">·</span>
          <a href="#" className="font-label-caps text-[11px] text-on-surface/25 hover:text-on-surface/50 tracking-widest transition-colors">
            Terms of Use
          </a>
        </div>
      </div>
    </footer>
  );
}
