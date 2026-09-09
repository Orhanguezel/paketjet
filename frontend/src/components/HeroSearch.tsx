'use client';
import {useState} from 'react';
import {LocationMap,type LocationSuggestion} from '@paketjet/locations';
import {useRouter} from 'next/navigation';
import {ArrowRightLeft, CalendarDays, MapPin, Search} from 'lucide-react';
import CityAutocomplete from './CityAutocomplete';
import RouteMapAnimation from './RouteMapAnimation';
import {ROUTES} from '@/config/routes';
type HeroConfig = {title?: string; subtitle?: string} | null;
export default function HeroSearch({heroConfig}: {heroConfig?: HeroConfig}) {
  const router=useRouter();
  const [from,setFrom]=useState(''), [to,setTo]=useState(''), [date,setDate]=useState('');
  const [fromPlace,setFromPlace]=useState<LocationSuggestion|null>(null),[toPlace,setToPlace]=useState<LocationSuggestion|null>(null);
  return <section className="home-hero" aria-labelledby="home-title"><div className="site-container">
    <div className="hero-composition"><div className="hero-copy">
      <h1 id="home-title">{heroConfig?.title || 'Gönderine uygun taşıyıcıyı bul.'}</h1>
      <p>{heroConfig?.subtitle || 'Güzergâhları keşfet, iletişim bilgilerine eriş ve taşıyıcıyla doğrudan görüş.'}</p>
    </div><RouteMapAnimation/></div>
    <form className="hero-search" onSubmit={e=>{e.preventDefault();const q=new URLSearchParams();if(from.trim())q.set('from',from.trim());if(to.trim())q.set('to',to.trim());if(date)q.set('date',date);router.push(`${ROUTES.ilanlar.list}${q.size?'?'+q:''}`);}}>
      <div className="search-city"><MapPin aria-hidden="true"/><CityAutocomplete label="Nereden" showMap={false} value={from} location={fromPlace} onChange={(value,place)=>{setFrom(value);setFromPlace(place??null);}} placeholder="Köy, mahalle veya adres"/></div>
      <button type="button" className="search-swap" aria-label="Kalkış ve varış adreslerini değiştir" onClick={()=>{setFrom(to);setTo(from);setFromPlace(toPlace);setToPlace(fromPlace);}}><ArrowRightLeft size={17}/></button>
      <div className="search-city"><MapPin aria-hidden="true"/><CityAutocomplete label="Nereye" showMap={false} value={to} location={toPlace} onChange={(value,place)=>{setTo(value);setToPlace(place??null);}} placeholder="Köy, mahalle veya adres"/></div>
      <div className="search-city"><CalendarDays aria-hidden="true"/><label className="min-w-0 text-sm font-semibold">Tarih<input aria-label="Tarih" type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-2 h-12 w-full min-w-0 rounded-xl border border-border-soft bg-surface px-3 text-base"/></label></div>
      <button className="primary-action search-submit"><Search size={20} aria-hidden="true"/>İlan Ara</button>
      {(fromPlace||toPlace)&&<div className="hero-location-previews">{fromPlace&&<LocationMap location={fromPlace} label="Kalkış haritasını göster"/>}{toPlace&&<LocationMap location={toPlace} label="Varış haritasını göster"/>}</div>}
    </form>
  </div></section>;
}
