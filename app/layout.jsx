import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cartContext";
import { AuthProvider } from "@/lib/authContext";
import CartDrawer from "@/components/CartDrawer";
import AuthDrawer from "@/components/AuthDrawer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
  display: "swap",
});

/**
 * Production origin, used for absolute canonicals and OG URLs.
 *
 * Canonicals were inconsistent: About and blog posts declared absolute ones,
 * PDPs used relative paths that resolved to whichever domain served them, and
 * the homepage, /products and /blog declared none at all. On a domain change
 * that leaves two indexable copies of the site with no authoritative signal.
 *
 * Override with NEXT_PUBLIC_SITE_URL at build time when the domain changes.
 */
export { SITE_URL } from "@/lib/site";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Zewa Feeds | Species-Specific Insect Protein Fish Food",
    template: "%s | Zewa Feeds",
  },
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  // 137 chars. The previous copy ran to 162 and truncated in results.
  description:
    "Lab-verified insect-protein fish food from Zewa Feeds India. 88% pepsin digestibility, NABL-tested, formulated by species and life stage.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Zewa Feeds | Species-Specific Insect Protein Fish Food",
    description:
      "Lab-verified insect-protein fish food. 88% pepsin digestibility, NABL-tested, formulated by species and life stage.",
    url: SITE_URL,
    siteName: "Zewa Feeds",
    type: "website",
    locale: "en_IN",
    /*
     * No og:image was set, so every share on WhatsApp, LinkedIn or X rendered
     * without one. Points at the products banner, which is already 2880x1440
     * (2:1) and reads well at social crop.
     */
    images: [
      {
        url: "/Banner 3.png",
        width: 2880,
        height: 1440,
        alt: "Zewa Feeds insect-protein aquatic nutrition range",
      },
    ],
  },
  twitter: {
    // Was "summary", which shows a thumbnail rather than a banner.
    card: "summary_large_image",
    title: "Zewa Feeds | Species-Specific Insect Protein Fish Food",
    description:
      "Lab-verified insect-protein fish food. 88% pepsin digestibility, NABL-tested.",
    images: ["/Banner 3.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${montserrat.variable} ${playfair.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
        />
      </head>
      <body className="font-body-md text-on-surface">
        {/*
          Auth wraps cart, not the other way round: the cart is anonymous and
          never needs to know who is signed in, while account screens do read
          the cart. Nesting it this way keeps that dependency one-directional.
        */}
        <AuthProvider>
          <CartProvider>
            <CartDrawer />
            <AuthDrawer />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
