import {notFound} from "next/navigation";
import type { Metadata } from "next";
import { searchIlansWithAlternatives } from "@/modules/ilan/ilan-search.service";
import type { VehicleType } from "@/modules/ilan/ilan.type";
import { getPageMetadata } from "@/lib/seo";
import IlanlarClient from "./ilanlar-client";
import { getListingCreditPrice } from "@/modules/pricing/pricing.service";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  from?: string;
  to?: string;
  date?: string;
  vehicle?: VehicleType;
  page?: string;
}>;

function normalizePage(page: string | undefined) {
  const parsed = Number(page ?? "1");
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

export async function generateMetadata({searchParams}: {searchParams: SearchParams}): Promise<Metadata> {
  const params = await searchParams;
  const page = normalizePage(params.page);
  const filtered = !!(params.from || params.to || params.date || params.vehicle);
  return getPageMetadata("listings", {
    title: `Taşıyıcı ilanları${page > 1 ? ` — Sayfa ${page}` : ""}`,
    description: "PaketJet üzerindeki aktif taşıma ilanlarını güzergah, tarih ve araç tipine göre inceleyin.",
    canonicalPath: page > 1 ? `/ilanlar?page=${page}` : "/ilanlar",
    ...(filtered && {robots:{index:false,follow:true}}),
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
  };
  const page = normalizePage(resolved.page);

  const [result, listingCreditPrice] = await Promise.all([
    searchIlansWithAlternatives({
      from_city: filters.from_city || undefined,
      to_city: filters.to_city || undefined,
      date: filters.date || undefined,
      vehicle_type: filters.vehicle_type || undefined,
      page,
      limit: 20,
    }).then(r=>({...r,error:false})).catch(() => ({ data: [], total: 0, page, limit: 20, alternativeScope:null, error:true })),
    getListingCreditPrice().catch(() => null),
  ]);

  if (!result.error && page > Math.max(1, Math.ceil(result.total / 20))) notFound();

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Anasayfa", url: "/" }, { name: "İlanlar" }]} />
      <IlanlarClient
        initialError={result.error}
        alternativeScope={result.alternativeScope}
        initialIlans={result.data}
        initialTotal={result.total}
        initialPage={page}
        initialFilters={filters}
        listingCreditPrice={listingCreditPrice}
      />
    </>
  );
}
