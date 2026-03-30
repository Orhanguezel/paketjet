import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Enterprise",
          "PerplexityBot",
          "CCBot",
          "Google-Extended",
        ],
        allow: ["/"],
        disallow: ["/api/", "/panel/", "/admin/"],
        crawlDelay: 10,
      },
      // Genel crawler'lar
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/panel/",
          "/admin/",
          "/api/",
          "/sifre-sifirla",
          "/sifremi-unuttum",
          "/giris",
          "/uye-ol",
          "/_next/",
          "/*?_rsc=",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
