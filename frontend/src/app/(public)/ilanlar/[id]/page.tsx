import type { Metadata } from "next";
import IlanDetailClient from "./IlanDetailClient";
import { OfferSchema, BreadcrumbSchema } from "@/components/JsonLd";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8078";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchIlan(id: string) {
  try {
    const res = await fetch(`${API_URL}/api/ilanlar/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ilan = await fetchIlan(id);
  if (!ilan) return { title: "İlan Detayı" };

  const title = `${ilan.from_city} → ${ilan.to_city} Kargo | PaketJet`;
  const value = ilan.estimated_value ? `Beyan edilen değer: ₺${Number(ilan.estimated_value).toLocaleString("tr-TR")}. ` : "";
  const description = `${value}${ilan.from_city}'dan ${ilan.to_city}'a gönderi ilanı. İletişim bilgilerine PaketJet üzerinden erişin.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/ilanlar/${id}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function IlanDetailPage({ params }: Props) {
  const { id } = await params;
  const ilan = await fetchIlan(id);

  return (
    <>
      {ilan && (
        <>
          <OfferSchema
            title={`${ilan.from_city} → ${ilan.to_city} Kargo`}
            description={ilan.description}
            price={0}
            currency={ilan.currency ?? "TRY"}
            fromCity={ilan.from_city}
            toCity={ilan.to_city}
            url={`/ilanlar/${id}`}
          />
          <BreadcrumbSchema
            items={[
              { name: "Anasayfa", url: "/" },
              { name: "İlanlar", url: "/ilanlar" },
              { name: `${ilan.from_city} → ${ilan.to_city}` },
            ]}
          />
        </>
      )}
      <IlanDetailClient />
    </>
  );
}
