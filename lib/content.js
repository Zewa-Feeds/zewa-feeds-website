// Site navigation. Page content — homepage copy and imagery, the clinical-proof
// figures, articles, the About page and letters — is CMS content; see
// lib/siteContent.js.

/*
 * "Our Science" is intentionally absent.
 *
 * It pointed at #science on the homepage, but there is no dedicated page
 * behind it yet, so it is hidden from the header until one exists. The
 * homepage section itself still renders — only the nav entry is removed.
 */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Knowledge Hub", href: "/blog" },
  { label: "About Us", href: "/about" },
];

