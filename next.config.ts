import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Strict CSP. We allow inline styles (Tailwind v4 emits some) and inline scripts
// because Next bootstrapping injects a small inline. In production you can
// switch to a nonce-based CSP via the proxy if desired.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // pdfjs-dist resolves its worker bundle relative to its on-disk location.
  // Letting Next.js bundle it breaks that resolution at runtime ("Cannot find
  // module '.next/dev/server/chunks/pdf.worker.mjs'"). Externalize it so the
  // serverless function loads the package from node_modules verbatim.
  serverExternalPackages: ["pdfjs-dist", "bcryptjs"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
