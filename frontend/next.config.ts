import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.paketjet.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
});
