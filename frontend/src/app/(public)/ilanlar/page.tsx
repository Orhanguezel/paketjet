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
    title: `Taşıyıcı ilanları: güncel güzergâh ve rotalar${page > 1 ? ` — ${page}` : ""}`,
    description: "Taşıyıcı ilanları güncel güzergâh, tarih ve araç tipine göre listelenir. Uygun rotayı seç, iletişim bilgilerine eriş ve taşıyıcıyla doğrudan görüş.",
    ogKind: "İlanlar",
    canonicalPath: page > 1 ? `/ilanlar?page=${page}` : "/ilanlar",
    ...(filtered && {robots:{index:false,follow:true}}),
  });
}

import Link from "next/link";
import { BreadcrumbSchema, ItemListSchema } from "@/components/JsonLd";
import { ROUTE_GUIDES } from "@/modules/content/content.data";
import { ROUTES } from "@/config/routes";

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
      <ItemListSchema name="Taşıyıcı ilanları" items={result.data.map((i) => ({ name: i.title || `${i.from_city} → ${i.to_city}`, url: ROUTES.ilanlar.detail(i.slug || i.id) }))} />
      <IlanlarClient
        initialError={result.error}
        alternativeScope={result.alternativeScope}
        initialIlans={result.data}
        initialTotal={result.total}
        initialPage={page}
        initialFilters={filters}
        listingCreditPrice={listingCreditPrice}
      />
      <section className="site-container pb-14 text-muted" aria-labelledby="ilanlar-nasil">
        <div className="grid gap-8 border-t border-border-soft pt-10 lg:grid-cols-3">
          <div>
            <h2 id="ilanlar-nasil" className="text-lg font-semibold text-foreground">Taşıyıcı ilanları nasıl çalışır?</h2>
            <p className="mt-3 text-sm leading-7">Bu sayfada yayındaki taşıyıcı ilanları, güncel güzergâh ve rotalar listelenir. Taşıyıcılar güzergâh, hareket tarihi, araç tipi ve boş kapasite bilgisiyle ücretsiz ilan verir. Sen rotana uygun ilanı seçer, iletişim bilgilerine erişir ve taşıma koşullarını taşıyıcıyla doğrudan görüşürsün. Yeni ilanlar yayına girmeden önce incelenir.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Ücret neyi kapsar?</h2>
            <p className="mt-3 text-sm leading-7">İlanlara göz atmak ücretsizdir. Ödediğin ücret yalnız seçtiğin ilanın iletişim bilgilerine erişim içindir; taşıma bedeli, teslim noktası ve zamanı taşıyıcıyla ayrıca kararlaştırılır.{listingCreditPrice ? ` Tek ilan için güncel erişim ücreti ${Number(listingCreditPrice).toLocaleString("tr-TR")} TL'dir.` : ""}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Popüler güzergâh rehberleri</h2>
            <ul className="mt-3 grid gap-2 text-sm">
              {ROUTE_GUIDES.map((g) => <li key={g.slug}><Link className="text-brand hover:underline" href={g.canonicalPath}>{g.title} taşıyıcı ilanları</Link></li>)}
            </ul>
            <p className="mt-3 text-sm"><Link className="text-brand hover:underline" href={ROUTES.static.blog}>Gönderici ve taşıyıcı rehberleri</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
