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
    ];
  },
};

export default nextConfig;
