import type { NextConfig } from "next";

// On GitHub Pages a project site is served from /<repo>/, so we build with a
// basePath. The deploy workflow sets NEXT_PUBLIC_BASE_PATH; local dev leaves it
// empty so the app runs at "/".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Emit a fully static site (no Node server) that GitHub Pages can host.
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  // next/image optimization needs a server; disable it for static export.
  images: { unoptimized: true },
  // Produce /route/index.html files so deep links work on static hosting.
  trailingSlash: true,
};

export default nextConfig;
