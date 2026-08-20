/**
 * Test runner for the storefront.
 *
 * Only two things here are tested this way, and both earn it: the hover-video
 * hook, whose entire job is timing and cleanup that cannot be seen by looking at
 * it, and the catalogue adapters, which decide what photograph a shopper is
 * shown. The rest of the storefront is layout, and a snapshot of layout tells
 * you a component changed, not that it broke.
 *
 * jsdom rather than a browser: fake timers are the point, and no real browser is
 * needed to prove a timer was cleared.
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  /*
   * The automatic JSX runtime, explicitly.
   *
   * Next configures this in its own build; a bare vitest run does not inherit
   * that, and the classic runtime fails with "React is not defined" in files
   * that — correctly, for Next — never import React.
   */
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    include: ["{lib,app,components}/**/*.test.{js,jsx}"],
    setupFiles: ["./vitest.setup.js"],
    globals: true,
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
});
