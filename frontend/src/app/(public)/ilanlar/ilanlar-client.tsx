'use client';
import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import IlanCard from '@/components/IlanCard';
import CityAutocomplete from '@/components/CityAutocomplete';
import type { PublicIlan, VehicleType } from '@/modules/ilan/ilan.type';
import { ROUTES } from '@/config/routes';
type Filters={from_city:string;to_city:string;date:string;vehicle_type:VehicleType|''};
interface Props {alternativeScope?:string|null;initialIlans:PublicIlan[];initialTotal:number;initialPage:number;initialFilters:Filters;initialError?:boolean;listingCreditPrice?:number|null;}
export default function IlanlarClient({initialIlans,initialTotal,initialPage,initialFilters,initialError,alternativeScope}:Props){
  const router=useRouter(), query=useSearchParams();
  const [pending,startTransition]=useTransition();
  const [filters,setFilters]=useState(initialFilters);
  useEffect(()=>setFilters(initialFilters),[initialFilters]);
  function update(key:keyof Filters,value:string){setFilters(old=>({...old,[key]:value}));}
  function navigate(q:URLSearchParams){startTransition(()=>router.push(`${ROUTES.ilanlar.list}${q.size?'?'+q:''}`,{scroll:false}));}
  function search(e:React.FormEvent){e.preventDefault();const q=new URLSearchParams();if(filters.from_city.trim())q.set('from',filters.from_city.trim());if(filters.to_city.trim())q.set('to',filters.to_city.trim());if(filters.date)q.set('date',filters.date);if(filters.vehicle_type)q.set('vehicle',filters.vehicle_type);navigate(q);}
  function page(n:number){const q=new URLSearchParams(query);q.set('page',String(n));navigate(q);}
  const pages=Math.ceil(initialTotal/20);
  return <section className="site-container listing-page py-10 sm:py-12" aria-busy={pending}>
    <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Taşıyıcı ilanları</h1><p className="mt-3 text-lg text-muted">Güzergâhına uygun ilanı bul.</p>
    <form onSubmit={search} className="listing-search my-8 grid items-end gap-4 rounded-2xl border border-border-soft bg-surface p-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.8fr_0.8fr_auto]">
      <CityAutocomplete label="Nereden" value={filters.from_city} onChange={value=>update('from_city',value)}/><CityAutocomplete label="Nereye" value={filters.to_city} onChange={value=>update('to_city',value)}/>
      <label className="min-w-0 text-sm font-medium">Tarih<input type="date" value={filters.date} onChange={e=>update('date',e.target.value)} className="mt-2 h-12 w-full min-w-0 rounded-lg border border-border bg-surface px-3"/></label>
      <label className="min-w-0 text-sm font-medium">Araç tipi<select value={filters.vehicle_type} onChange={e=>update('vehicle_type',e.target.value)} className="mt-2 h-12 w-full rounded-lg border border-border bg-surface px-3"><option value="">Tüm araçlar</option><option value="car">Otomobil</option><option value="van">Kamyonet</option><option value="truck">Kamyon</option><option value="motorcycle">Motosiklet</option><option value="other">Diğer</option></select></label>
      <button disabled={pending} className="h-12 rounded-lg bg-action px-6 font-semibold text-white disabled:opacity-60">{pending?'Aranıyor…':'İlan Ara'}</button>
      <button type="button" onClick={()=>navigate(new URLSearchParams())} className="min-h-11 text-left text-sm font-semibold text-brand sm:col-span-2">Filtreleri temizle</button>
    </form>
    <div aria-live="polite">{initialError?<div role="alert" className="rounded-lg border border-border bg-surface p-6"><h2 className="text-lg font-semibold">İlanlar yüklenemedi</h2><p className="mt-2 text-muted">Arama koşulların korundu. Yeniden deneyebilirsin.</p><button onClick={()=>startTransition(()=>router.refresh())} className="mt-4 min-h-11 rounded-lg border border-brand px-5 text-brand">Yeniden dene</button></div>:<>{alternativeScope&&<div className="mb-6 rounded-2xl border border-brand/20 bg-brand/5 p-6"><p className="text-sm text-muted">Aradığın adreste bu koşullara uygun aktif ilan bulunamadı.</p><h2 className="mt-2 text-xl font-semibold">Aynı ildeki alternatifler</h2><p className="mt-2 font-medium text-brand">{alternativeScope}</p><p className="mt-2 text-sm text-muted">Seçtiğin tarih, araç tipi ve rota yönü korunarak il genelindeki ilanlar gösteriliyor. Kesin buluşma yerini taşıyıcıyla görüşebilirsin.</p></div>}<p className="mb-5 text-sm">{pending?'Sonuçlar güncelleniyor…':`${initialTotal} ${alternativeScope?'alternatif ilan':'ilan'} bulundu.`}</p>{initialIlans.length?<div className={`space-y-4 ${pending?'opacity-60':''}`}>{initialIlans.map(ilan=><IlanCard key={ilan.id} ilan={ilan}/>)}</div>:<div className="listing-empty rounded-2xl border border-border-soft bg-surface px-6 py-16 text-center"><h2 className="text-xl font-semibold">Bu aramada aktif ilan bulunamadı</h2><p className="mt-2 text-muted">Farklı bir tarih veya güzergâh seçebilirsin.</p><button onClick={()=>navigate(new URLSearchParams())} className="mt-5 min-h-11 rounded-lg border border-brand px-5 font-semibold text-brand">Tüm güncel ilanları göster</button></div>}</>}</div>
    {!initialError&&pages>1&&<nav aria-label="Sayfalama" className="mt-8 flex flex-wrap items-center justify-center gap-4"><button disabled={initialPage<=1||pending} onClick={()=>page(initialPage-1)} className="min-h-11 rounded-lg border border-border px-4 disabled:opacity-40">Önceki</button><span aria-current="page">{initialPage} / {pages}</span><button disabled={initialPage>=pages||pending} onClick={()=>page(initialPage+1)} className="min-h-11 rounded-lg border border-border px-4 disabled:opacity-40">Sonraki</button></nav>}
  </section>;
}
