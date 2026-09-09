'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CityAutocomplete from './CityAutocomplete';
import { ROUTES } from '@/config/routes';
type HeroConfig = {title?: string; subtitle?: string} | null;
export default function HeroSearch({heroConfig}: {heroConfig?: HeroConfig}) {
  const router=useRouter();
  const [from,setFrom]=useState(''), [to,setTo]=useState(''), [date,setDate]=useState('');
  return <section className="bg-surface" aria-labelledby="home-title"><div className="site-container py-10 sm:py-14">
    <h1 id="home-title" className="max-w-2xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">{heroConfig?.title || 'Gönderine uygun taşıyıcıyı bul.'}</h1>
    <p className="mt-5 max-w-3xl text-lg leading-7 text-muted">{heroConfig?.subtitle || 'Güzergâhları keşfet, iletişim bilgilerine eriş ve taşıyıcıyla doğrudan görüş.'}</p>
    <form className="mt-7 grid items-end gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-[1fr_1fr_0.8fr_auto]" onSubmit={e=>{e.preventDefault();const q=new URLSearchParams();if(from.trim())q.set('from',from.trim());if(to.trim())q.set('to',to.trim());if(date)q.set('date',date);router.push(`${ROUTES.ilanlar.list}?${q}`);}}>
      <CityAutocomplete label="Nereden" value={from} onChange={setFrom} placeholder="Şehir seçin"/>
      <CityAutocomplete label="Nereye" value={to} onChange={setTo} placeholder="Şehir seçin"/>
      <label className="block min-w-0 text-sm font-medium">Tarih<input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-2 h-12 w-full min-w-0 rounded-lg border border-border bg-surface px-3 text-base"/></label>
      <button className="h-12 rounded-lg bg-action px-8 font-semibold text-white hover:bg-brand-dark">İlan Ara</button>
    </form>
  </div></section>;
}
