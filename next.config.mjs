/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        // Product photos and video poster frames. next/image refuses any host not
        // listed here, so without this every CMS-uploaded image throws at runtime.
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        // Royalty-free editorial imagery for Knowledge Hub covers. Replace an
        // article's `image` with a Cloudinary URL once original photography
        // exists; nothing else needs to change.
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  /*
   * The chitin article was re-slugged to match its SEO brief
   * ("insect-chitin-prebiotic-fish-food-gut-health"). Anything already linking
   * to the old URL — bookmarks, shared links, search results — would otherwise
   * hit a 404, and the accumulated ranking signal would be thrown away.
   *
   * Permanent (308) so search engines transfer that signal to the new URL.
   */
  async redirects() {
    return [
      {
        source: "/blog/microbiome-health-insect-chitin",
        destination: "/blog/insect-chitin-prebiotic-fish-food-gut-health",
        permanent: true,
      },

      /*
       * ---- Dukaan URLs, for the zewafeeds.com cutover --------------------
       *
       * The old storefront is being replaced on the same domain, so links that
       * search results, bookmarks and social posts already hold must land
       * somewhere correct rather than on a 404.
       *
       * ONLY SLUGS THAT ACTUALLY MOVED APPEAR HERE. Five of the old product
       * URLs — betta-bites, guppy-bites, goldfish-bites, pleco-bites and
       * tetra-pellets — are the same slug on both sites, so they already
       * resolve. Writing them as redirects would point each at itself, which
       * Next.js turns into an infinite loop rather than a no-op.
       *
       * Every rule below goes straight from the old URL to its final
       * destination: no rule's destination is another rule's source, so
       * nothing chains.
       *
       * Product mappings are one-to-one and confirmed. There is deliberately
       * no catch-all for unrecognised /products/* URLs: guessing sends someone
       * to the wrong feed for the wrong fish, and a branded 404 is the honest
       * answer. app/not-found.jsx handles those.
       */
      /*
       * ---- Cichlid: one old page, two different products -----------------
       *
       * Dukaan sold cichlid feed on two pages — /products/cichlid-bites (1kg)
       * and /products/cichlid-power-bites (45g) — whose titles differ only by
       * weight. But the 1kg page carried TWO variants, and they are not the
       * same product on the new site:
       *
       *   sku_id=58928993  "C4 1Kg (0.8mm-1.2mm)"  -> cichlid-bites-c4
       *   sku_id=58928994  "C5 1Kg (1.2mm-2mm)"    -> cichlid-bites-c5
       *
       * Those ranges match the new C4 (0.8-1.4mm) and C5 (1.2-2mm) exactly, so
       * a single rule for this path would send everyone who chose the large
       * pellet — Oscars, Flowerhorns — to a feed for mid-sized fish.
       *
       * ORDER MATTERS. Next.js takes the first matching rule, so the
       * sku_id-qualified rule has to come first; the unqualified rule below it
       * then catches the bare URL and the C4 variant, which is right because
       * C4 is that page's default.
       *
       * The 45g page needs no such split: all three of its sku_ids are
       * "Pack of 1/2/3 C4", so every one of them is C4.
       */
      {
        source: "/products/cichlid-bites",
        has: [{ type: "query", key: "sku_id", value: "58928994" }],
        destination: "/products/cichlid-bites-c5",
        permanent: true,
      },
      {
        source: "/products/cichlid-bites",
        destination: "/products/cichlid-bites-c4",
        permanent: true,
      },
      {
        source: "/products/cichlid-power-bites",
        destination: "/products/cichlid-bites-c4",
        permanent: true,
      },

      /*
       * Pack-size pages. Dukaan gave each pack its own URL; the new shop has
       * one page per product with a pack selector, so every one of these
       * collapses onto the product it was a size of.
       */
      {
        source: "/products/betta-bites-1-kg",
        destination: "/products/betta-bites",
        permanent: true,
      },
      {
        source: "/products/guppy-bites-1kg",
        destination: "/products/guppy-bites",
        permanent: true,
      },
      {
        // Renamed: Dukaan's own page title already reads "Zewa Micro Pellets".
        // Only the slug still carries the old "advanced" prefix.
        source: "/products/advanced-micro-pellets",
        destination: "/products/micro-pellets",
        permanent: true,
      },
      {
        source: "/products/dried-black-soldier-fly-larvae-25g",
        destination: "/products/dried-bsf-larvae",
        permanent: true,
      },
      {
        // Two old URLs converging on one product is correct — they were the
        // 25g and 75g pages of the same larvae.
        source: "/products/dried-black-soldier-fly-larvae-75",
        destination: "/products/dried-bsf-larvae",
        permanent: true,
      },

      /*
       * Dukaan grouped by pack size. The new shop groups by species and feed
       * type, so these have no equivalent and go to the full range — the
       * nearest honest destination, and still a real listing page rather than
       * the homepage.
       */
      {
        source: "/categories/1-kg-packets",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/categories/45g-bottles",
        destination: "/products",
        permanent: true,
      },
      {
        /*
         * This one DOES have a real equivalent, so it gets the filtered view
         * rather than the whole shop. /products declares a static canonical of
         * "/products", so the filtered URL consolidates there for a crawler
         * while a customer still lands on the right list.
         */
        source: "/categories/dried-bsf-larvae",
        destination: "/products?category=Dried+BSF+Larvae",
        permanent: true,
      },
      {
        // Dukaan's top-level catch-all. The full range IS its equivalent.
        source: "/categories/fish-feed",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
