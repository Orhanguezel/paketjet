import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";
const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

interface IlanSitemapItem {
  id: string;
  updated_at?: string;
}

async function fetchActiveIlans(): Promise<IlanSitemapItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/ilanlar?limit=500&status=active`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data ?? []).map((i: IlanSitemapItem) => ({
      id: i.id,
      updated_at: i.updated_at,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ilans = await fetchActiveIlans();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: "2026-03-20", changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/ilanlar`, lastModified: "2026-03-20", changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/iletisim`, lastModified: "2026-03-15", changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/ilan-ver`, lastModified: "2026-03-15", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/gizlilik`, lastModified: "2026-03-15", changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/kullanim-kosullari`, lastModified: "2026-03-15", changeFrequency: "yearly", priority: 0.3 },
  ];

  const ilanPages: MetadataRoute.Sitemap = ilans.map((ilan) => ({
    url: `${SITE_URL}/ilanlar/${ilan.id}`,
    lastModified: ilan.updated_at ? new Date(ilan.updated_at) : "2026-03-20",
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...ilanPages];
}
