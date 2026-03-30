import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  // Performance optimizasyonları
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "date-fns",
    ],
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.paketjet.com" },
      { protocol: "http", hostname: "localhost" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // /uploads/* isteklerini backend'e proxy et (favicon, logo, video, vb.)
  rewrites: async () => [
    {
      source: "/uploads/:path*",
      destination: `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:8078"}/uploads/:path*`,
    },
  ],

  // Security + cache headers
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
    {
      source: "/assets/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/uploads/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800" },
      ],
    },
  ],
};

export default withSentryConfig(nextConfig, {
  silent: true,
});
