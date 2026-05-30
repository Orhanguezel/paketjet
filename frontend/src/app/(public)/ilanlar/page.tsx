import type { Metadata } from "next";
import { listIlans } from "@/modules/ilan/ilan.service";
import type { VehicleType } from "@/modules/ilan/ilan.type";
import { getPageMetadata } from "@/lib/seo";
import IlanlarClient from "./ilanlar-client";
import { getListingCreditPrice } from "@/modules/pricing/pricing.service";

export const revalidate = 60;

type SearchParams = Promise<{
  from?: string;
  to?: string;
  date?: string;
  vehicle?: VehicleType;
  min_kg?: string;
  page?: string;
}>;

function normalizePage(page: string | undefined) {
  const parsed = Number(page ?? "1");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("listings", {
    title: "Taşıma İlanları",
    description: "PaketJet üzerindeki aktif taşıma ilanlarını güzergah, tarih ve araç tipine göre inceleyin.",
    canonicalPath: "/ilanlar",
  });
}

import { BreadcrumbSchema } from "@/components/JsonLd";

export default async function IlanlarPage({ searchParams }: { searchParams: SearchParams }) {
  const resolved = await searchParams;
  const filters = {
    from_city: resolved.from ?? "",
    to_city: resolved.to ?? "",
    date: resolved.date ?? "",
    vehicle_type: (resolved.vehicle ?? "") as VehicleType | "",
    min_kg: resolved.min_kg ?? "",
  };
  const page = normalizePage(resolved.page);

  const [result, listingCreditPrice] = await Promise.all([
    listIlans({
      from_city: filters.from_city || undefined,
      to_city: filters.to_city || undefined,
      date: filters.date || undefined,
      vehicle_type: filters.vehicle_type || undefined,
      min_kg: filters.min_kg ? Number(filters.min_kg) : undefined,
      page,
      limit: 20,
    }).catch(() => ({ data: [], total: 0, page, limit: 20 })),
    getListingCreditPrice().catch(() => null),
  ]);

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "İlanlar" }]} />
      <IlanlarClient
        initialIlans={result.data}
        initialTotal={result.total}
        initialPage={page}
        initialFilters={filters}
        listingCreditPrice={listingCreditPrice}
      />
    </>
  );
}
