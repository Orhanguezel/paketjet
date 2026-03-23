// src/lib/seo.ts
// SEO helper — backend'den sayfa SEO verisini cekip Next.js Metadata objesi olusturur

import type { Metadata } from "next";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";

export interface PageSeoData {
  pageKey: string;
  title?: string;
  description?: string;
  keywords?: string;
  open_graph?: {
    type?: string;
    images?: string[];
  };
  twitter?: {
    card?: string;
    site?: string;
    creator?: string;
  };
  robots?: {
    noindex?: boolean;
    index?: boolean;
    follow?: boolean;
  };
  _fallback?: boolean;
}

/**
 * Backend'den sayfa SEO verisini cek.
 * Hata durumunda null doner (sayfa hala render olur).
 */
export async function fetchPageSeo(pageKey: string): Promise<PageSeoData | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/site_settings/seo/${pageKey}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Template degiskenleri degistir: {{from_city}} -> "Istanbul"
 */
function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

/**
 * SEO verisinden Next.js Metadata objesi olustur.
 */
export function buildMetadata(
  seo: PageSeoData | null,
  overrides?: Partial<Metadata> & { vars?: Record<string, string> },
): Metadata {
  const vars = overrides?.vars ?? {};

  const title = seo?.title ? interpolate(seo.title, vars) : undefined;
  const description = seo?.description ? interpolate(seo.description, vars) : undefined;
  const keywords = seo?.keywords ? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined;

  const robots = seo?.robots?.noindex
    ? { index: false, follow: seo.robots.follow ?? true }
    : undefined;

  const ogImages = seo?.open_graph?.images?.map((img) =>
    img.startsWith("/") ? `${SITE_URL}${img}` : img,
  );

  const meta: Metadata = {
    ...(title && { title }),
    ...(description && { description }),
    ...(keywords && { keywords }),
    ...(robots && { robots }),
    openGraph: {
      ...(title && { title }),
      ...(description && { description }),
      ...(seo?.open_graph?.type && { type: seo.open_graph.type as "website" }),
      ...(ogImages?.length && { images: ogImages }),
      siteName: "PaketJet",
    },
    twitter: {
      card: (seo?.twitter?.card as "summary_large_image") ?? "summary_large_image",
      ...(seo?.twitter?.site && { site: seo.twitter.site }),
      ...(seo?.twitter?.creator && { creator: seo.twitter.creator }),
    },
    ...overrides,
  };

  // vars'i metadata'dan temizle
  if ("vars" in meta) delete (meta as Record<string, unknown>).vars;

  return meta;
}

/**
 * Kisayol: fetchPageSeo + buildMetadata tek satirda.
 */
export async function getPageMetadata(
  pageKey: string,
  overrides?: Partial<Metadata> & { vars?: Record<string, string> },
): Promise<Metadata> {
  const seo = await fetchPageSeo(pageKey);
  return buildMetadata(seo, overrides);
}

/** noindex sayfalar icin hizli metadata */
export function noIndexMetadata(title: string): Metadata {
  return { title, robots: { index: false, follow: false } };
}
