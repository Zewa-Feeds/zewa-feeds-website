/**
 * Canonical origin for the site.
 *
 * This lives in its own module rather than in app/layout.jsx because client
 * components need it too (the blog route builds JSON-LD in the browser bundle).
 * Importing it from the layout dragged the whole root layout into the client
 * bundle, which broke its `metadata` export — Next.js does not allow a
 * "use client" module to export metadata.
 *
 * Override with NEXT_PUBLIC_SITE_URL at build time when the domain changes.
 * The NEXT_PUBLIC_ prefix is required: this value is read on the client.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://zewafeeds.com"
).replace(/\/$/, "");
