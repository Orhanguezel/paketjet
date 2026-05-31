import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

async function fetchIlan(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/ilanlar/${id}`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const ilan = await fetchIlan(id);

  if (!ilan) {
    return { title: "İlan Detayı" };
  }

  return getPageMetadata("listing_detail", {
    title: `${ilan.from_city} → ${ilan.to_city} Kargo Ilani`,
    description: `${ilan.from_city} - ${ilan.to_city} arasi gönderi ilani. İletişim bilgilerine PaketJet üzerinden erişin.`,
    vars: {
      from_city: ilan.from_city ?? "",
      to_city: ilan.to_city ?? "",
    },
  });
}

export default function IlanDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
