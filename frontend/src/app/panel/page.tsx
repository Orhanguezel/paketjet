'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, ShoppingBag, Ticket, Search, Plus, UserRound, HelpCircle, ArrowUpRight } from 'lucide-react';
import { getMyIlans } from '@/modules/ilan/ilan.service';
import { getMyCredits, getMyPurchases } from '@/modules/purchases/purchases.service';
import type { Ilan } from '@/modules/ilan/ilan.type';
import type { MyPurchase } from '@/modules/purchases/purchases.type';
import { RecentListings, RecentPurchases } from './dashboard-cards';
import { ROUTES } from '@/config/routes';
export default function PanelRoot(){
  const [listings,setListings]=useState<Ilan[]|null>(null),[purchases,setPurchases]=useState<MyPurchase[]|null>(null),[balance,setBalance]=useState<number|null>(null),[errors,setErrors]=useState<string[]>([]),[loading,setLoading]=useState(true),[retry,setRetry]=useState(0);
  useEffect(()=>{let active=true;setLoading(true);Promise.allSettled([getMyIlans(),getMyPurchases(),getMyCredits()]).then(([a,b,c])=>{if(!active)return;const failed=[];if(a.status==='fulfilled')setListings(a.value);else {setListings(null);failed.push('İlanlar');}if(b.status==='fulfilled')setPurchases(b.value.data);else {setPurchases(null);failed.push('Satın almalar');}if(c.status==='fulfilled')setBalance(c.value.balance);else {setBalance(null);failed.push('Hak bakiyesi');}setErrors(failed);setLoading(false);});return()=>{active=false;};},[retry]);
  const stats=[['İlanlarım',listings?.length,FileText,ROUTES.panel.ilanlarim],['Satın aldıklarım',purchases?.length,ShoppingBag,ROUTES.panel.satinAldiklarim],['Kalan hak',balance,Ticket,ROUTES.panel.ilanAlmaHakki]] as const;
  return <div className="account-overview space-y-6"><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center"><div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Genel bakış</h1><p className="mt-3 text-muted">İlanlarını ve iletişim erişimlerini yönet.</p></div><div className="flex flex-wrap gap-3"><Link href={ROUTES.ilanlar.list} className="account-action secondary"><Search size={18}/>İlanları keşfet</Link><Link href={ROUTES.ilanVer} className="account-action"><Plus size={19}/>Ücretsiz ilan ver</Link></div></div>
    {!!errors.length&&<div role="alert" className="rounded-xl border border-danger/20 bg-danger-bg p-4"><p>{errors.join(', ')} yüklenemedi.</p><button disabled={loading} onClick={()=>setRetry(n=>n+1)} className="mt-2 min-h-11 font-medium text-brand">Yeniden dene</button></div>}
    <dl className="grid gap-4 lg:grid-cols-3">{stats.map(([label,value,Glyph,href])=><div key={label} className="account-stat"><span className="account-row-icon"><Glyph size={26} strokeWidth={1.6}/></span><div className="min-w-0 flex-1"><dt><Link href={href} className="text-sm text-muted hover:text-brand">{label}</Link></dt><dd className="mt-1 text-3xl font-bold">{loading?'—':value??'Alınamadı'}</dd></div><ArrowUpRight size={18} className="text-faint" aria-hidden="true"/></div>)}</dl>
    <div className="grid items-start gap-5 xl:grid-cols-[1.35fr_1fr]"><RecentListings rows={listings} loading={loading}/><RecentPurchases rows={purchases} loading={loading}/></div>
    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-border-soft pt-4 text-sm font-medium text-brand"><Link href={ROUTES.panel.profil} className="inline-flex min-h-11 items-center gap-2"><UserRound size={18}/>Profilini düzenle</Link><Link href={ROUTES.static.destek} className="inline-flex min-h-11 items-center gap-2"><HelpCircle size={18}/>Destek merkezi</Link></div>
  </div>;
}
