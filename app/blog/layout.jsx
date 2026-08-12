/**
 * Knowledge Hub metadata.
 *
 * The title now leads with the keywords the hub actually targets rather than
 * the internal section name — "Knowledge Hub" alone competes for nothing.
 * A canonical and a share image are declared here too: without them the index
 * had no authoritative URL and every share rendered imageless.
 */
export const metadata = {
  // `absolute` opts out of the root "%s | Zewa Feeds" template, which was
  // appending a second brand suffix to a title that already carries one.
  title: {
    absolute: "Fish Nutrition & Insect Protein Research | Zewa Knowledge Hub",
  },
  description:
    "Lab-verified articles on insect protein, fish digestibility and aquatic nutrition from the Zewa research team.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Fish Nutrition & Insect Protein Research | Zewa Knowledge Hub",
    description:
      "Lab-verified articles on insect protein, fish digestibility and aquatic nutrition from the Zewa research team.",
    url: "/blog",
    siteName: "Zewa Feeds",
    type: "website",
    locale: "en_IN",
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
    card: "summary_large_image",
    title: "Fish Nutrition & Insect Protein Research | Zewa Knowledge Hub",
    description:
      "Lab-verified articles on insect protein, fish digestibility and aquatic nutrition from the Zewa research team.",
    images: ["/Banner 3.png"],
  },
};

export default function BlogLayout({ children }) {
  return children;
}
