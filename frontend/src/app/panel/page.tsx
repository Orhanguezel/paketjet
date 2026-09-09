'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Contact, Ticket, Plus, MapPin } from 'lucide-react';
import { getMyIlans } from '@/modules/ilan/ilan.service';
import { getMyCredits, getMyPurchases } from '@/modules/purchases/purchases.service';
import type { Ilan } from '@/modules/ilan/ilan.type';
import type { MyPurchase } from '@/modules/purchases/purchases.type';
import { RecentListings, RecentPurchases } from './dashboard-cards';
import { ROUTES } from '@/config/routes';
export default function PanelRoot(){
  const [listings,setListings]=useState<Ilan[]|null>(null),[purchases,setPurchases]=useState<MyPurchase[]|null>(null),[balance,setBalance]=useState<number|null>(null),[errors,setErrors]=useState<string[]>([]),[loading,setLoading]=useState(true),[retry,setRetry]=useState(0);
  useEffect(()=>{let active=true;setLoading(true);Promise.allSettled([getMyIlans(),getMyPurchases(),getMyCredits()]).then(([a,b,c])=>{if(!active)return;const failed=[];if(a.status==='fulfilled')setListings(a.value);else {setListings(null);failed.push('İlanlar');}if(b.status==='fulfilled')setPurchases(b.value.data);else {setPurchases(null);failed.push('Satın almalar');}if(c.status==='fulfilled')setBalance(c.value.balance);else {setBalance(null);failed.push('Hak bakiyesi');}setErrors(failed);setLoading(false);});return()=>{active=false;};},[retry]);
  const stats=[['ilanım',listings?.length,FileText,ROUTES.panel.ilanlarim],['iletişim erişimi',purchases?.length,Contact,ROUTES.panel.satinAldiklarim],['kalan hak',balance,Ticket,ROUTES.panel.ilanAlmaHakki]] as const;
  return <div className="member-overview"><h1 className="sr-only">Genel bakış</h1>
    {!!errors.length&&<div role="alert" className="mb-5 rounded-xl border border-danger/20 bg-danger-bg p-4"><p>{errors.join(', ')} yüklenemedi.</p><button disabled={loading} onClick={()=>setRetry(n=>n+1)} className="mt-2 min-h-11 font-medium text-brand">Yeniden dene</button></div>}
    <dl className="member-summary">{stats.map(([label,value,Glyph,href])=><div key={label}><Glyph size={22} strokeWidth={1.6} aria-hidden="true"/><dt><Link href={href}>{label}</Link></dt><dd>{loading?'—':value??'Alınamadı'}</dd></div>)}</dl>
    <div className="member-content"><div className="min-w-0"><RecentListings rows={listings} loading={loading}/><section className="member-route-callout"><div className="member-route-drawing" aria-hidden="true"><MapPin size={27}/><span/><MapPin size={27}/></div><h2>Yeni bir yolculuk mu planlıyorsun?</h2><Link href={ROUTES.ilanVer} className="account-action"><Plus size={18}/>Ücretsiz ilan ver</Link></section></div><RecentPurchases rows={purchases} loading={loading}/></div>
  </div>;
}
