import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

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

export const metadata = {
  title: "Zewa Feeds — Scientific Nutrition for Aquatic Vitality",
  description:
    "Your fish is built to digest insects. Most fish food feeds it soy. Premium insect-protein nutrition optimised for aquatic vitality, backed by lab-verified science.",
  openGraph: {
    title: "Zewa Feeds — Scientific Nutrition for Aquatic Vitality",
    description:
      "Premium insect-protein nutrition optimised for aquatic vitality, backed by lab-verified science.",
    type: "website",
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
      <body className="font-body-md text-on-surface">{children}</body>
    </html>
  );
}
