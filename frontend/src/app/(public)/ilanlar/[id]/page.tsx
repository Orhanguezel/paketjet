import type { Metadata } from "next";
import IlanDetailClient from "./IlanDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8078";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_URL}/api/ilanlar/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return { title: "İlan Detayı" };
    const ilan = await res.json();

    const title = `${ilan.from_city} → ${ilan.to_city} | PaketJet`;
    const description = `${ilan.available_capacity_kg} kg müsait kapasite, ₺${ilan.price_per_kg}/kg — ${ilan.from_city}'dan ${ilan.to_city}'a güvenli P2P kargo taşımacılığı`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
    };
  } catch {
    return { title: "İlan Detayı" };
  }
}

export default function IlanDetailPage() {
  return <IlanDetailClient />;
}
