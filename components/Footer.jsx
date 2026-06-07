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
    { label: "@zewa_feeds", href: "#", muted: true },
    { label: "@zewaecosystems", href: "https://youtube.com/@zewaecosystems", highlight: "youtube" },
  ],
};

function ColHeading({ children }) {
  return (
    <h4 className="font-label-caps text-label-caps text-on-surface/40 tracking-[0.15em] mb-6">
      {children}
    </h4>
  );
}

function ColLink({ label, href, accent, muted, highlight }) {
  const base = "font-body-md text-[13px] leading-none block transition-colors duration-200";
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
      <div className="max-w-[1440px] mx-auto px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_1fr_1fr] gap-12 md:gap-8">

          {/* Brand column */}
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <div>
              <Image
                src="/logo-transparent.png"
                alt="Zewa Feeds"
                width={150}
                height={150}
                className="h-24 w-auto object-contain brightness-0 invert opacity-90"
              />
            </div>

            <p className="font-body-md text-[13px] text-on-surface/40 leading-relaxed italic max-w-[220px]">
              Advancing pet nutrition through insect protein science and functional ingredients.
            </p>

            <div className="space-y-0.5">
              <p className="font-body-md text-[13px] text-on-surface/35 leading-relaxed">
                17/31A TR Nair Road<br />
                Kuttanellur PO, Thrissur<br />
                Kerala, IN – 680014
              </p>
              <a
                href="https://zewafeeds.com"
                className="font-body-md text-[13px] text-primary/70 hover:text-primary transition-colors mt-2 block"
              >
                zewafeeds.com
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <ColHeading>Products</ColHeading>
            <div className="flex flex-col gap-3.5">
              {footerData.products.map((item) => (
                <ColLink key={item.label} {...item} />
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <ColHeading>Learn</ColHeading>
            <div className="flex flex-col gap-3.5">
              {footerData.learn.map((item) => (
                <ColLink key={item.label} {...item} />
              ))}
              {/* Pet coming soon — separate treatment */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <span className="font-body-md text-[13px] text-[#d4793a]">
                  Zewa Pet — Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Connect */}
          <div>
            <ColHeading>Connect</ColHeading>
            <div className="flex flex-col gap-3.5">
              {footerData.connect.map((item) => (
                <ColLink key={item.label} {...item} />
              ))}
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
