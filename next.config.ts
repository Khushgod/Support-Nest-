import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfjs-dist resolves its worker bundle relative to its on-disk location.
  // Letting Next.js bundle it breaks that resolution at runtime ("Cannot find
  // module '.next/dev/server/chunks/pdf.worker.mjs'"). Externalize it so the
  // serverless function loads the package from node_modules verbatim.
  serverExternalPackages: ["pdfjs-dist"],
};

export default nextConfig;
