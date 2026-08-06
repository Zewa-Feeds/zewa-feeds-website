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
};

export default nextConfig;
