import Link from 'next/link';
import type { PublicIlan as Ilan } from '@/modules/ilan/ilan.type';
import { formatDate } from '@/lib/date';
import { ROUTES } from '@/config/routes';
const vehicles:Record<string,string>={car:'Otomobil',van:'Kamyonet',truck:'Kamyon',motorcycle:'Motosiklet',other:'Diğer'};
export default function IlanCard({ilan}: {ilan:Ilan;listingCreditPrice?:number|null}) {
  return <article className="listing-card grid gap-4 rounded-2xl border border-border-soft bg-surface p-6 md:grid-cols-[1.1fr_1.1fr_0.7fr_1.2fr_auto] md:items-center">
    <div className="min-w-0"><p className="mb-1 text-sm text-muted">Güzergâh</p><h3 className="flex flex-wrap items-center gap-2 text-lg font-semibold"><span className="min-w-0 break-words">{ilan.from_location?.label||ilan.from_city}</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12h16m-6-6 6 6-6 6"/></svg><span className="min-w-0 break-words">{ilan.to_location?.label||ilan.to_city}</span></h3>{(ilan.from_district||ilan.to_district)&&<p className="mt-1 text-sm text-muted">{ilan.from_district} / {ilan.to_district}</p>}</div>
    <div><p className="mb-1 text-sm text-muted">Kalkış tarihi</p><time dateTime={ilan.departure_date} className="text-sm">{formatDate(ilan.departure_date)}</time></div>
    <div><p className="mb-1 text-sm text-muted">Araç tipi</p><p className="text-sm">{vehicles[ilan.vehicle_type]??ilan.vehicle_type}</p></div>
    <div className="min-w-0"><p className="mb-1 text-sm text-muted">İlan başlığı</p><p className="line-clamp-2 text-sm">{ilan.title||`${ilan.from_city} – ${ilan.to_city} güzergâhı`}</p></div>
    <Link href={ROUTES.ilanlar.detail(ilan.slug||ilan.id)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-brand px-4 text-sm font-semibold text-brand hover:bg-brand-xlight md:border-0 md:border-l md:border-border-soft" aria-label={`${ilan.from_city} – ${ilan.to_city} ilanını incele`}>İlanı incele<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></Link>
  </article>;
}
