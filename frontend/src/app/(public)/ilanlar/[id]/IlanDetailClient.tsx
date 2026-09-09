'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/config/routes';
import type { PublicIlan } from '@/modules/ilan/ilan.type';
import { getListingCreditPrice } from '@/modules/pricing/pricing.service';
import { getListingAccess, initiateIlanPayment, purchaseIlan, type ListingAccess } from '@/modules/purchases/purchases.service';
import { getPaymentAvailability } from '@/modules/payments/payments.service';
import type { PurchaseDeclarationInput } from '@/modules/purchases/purchases.type';
import { useAuthStore } from '@/modules/auth/auth.store';
import { formatDate } from '@/lib/date';
import { RevealAside } from './RevealAside';
import PaymentModal from '@/components/PaymentModal';
const RouteMap=dynamic(()=>import('@/components/RouteMap').then(m=>m.RouteMap),{ssr:false,loading:()=> <p role="status" className="p-4 text-muted">Harita yükleniyor…</p>});
const vehicles:Record<string,string>={car:'Otomobil',van:'Kamyonet',truck:'Kamyon',motorcycle:'Motosiklet',other:'Diğer'};
export default function IlanDetailClient({ilan}:{ilan:PublicIlan}) {
  const router=useRouter(), {isAuthenticated}=useAuthStore();
  const [access,setAccess]=useState<ListingAccess|null>(null),[price,setPrice]=useState<number|null>(null),[enabled,setEnabled]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[map,setMap]=useState(false),[attempt,setAttempt]=useState(0);
  const [checkout,setCheckout]=useState<{checkoutFormContent?:string;iframeUrl?:string;conversationId:string}|null>(null);
  useEffect(()=>{let active=true;getListingCreditPrice().then(p=>{if(active)setPrice(p);}).catch(()=>{});getPaymentAvailability().then(p=>{if(active)setEnabled(p.enabled);}).catch(()=>{});return()=>{active=false;};},[attempt]);
  useEffect(()=>{setAccess(null);if(!isAuthenticated)return;let active=true;getListingAccess(ilan.id).then(a=>{if(active){setAccess(a);setError('');}}).catch(()=>{if(active)setError('Hesap durumu alınamadı. Yeniden deneyin.');});return()=>{active=false;};},[ilan.id,isAuthenticated,attempt]);
  function login(){router.push(`${ROUTES.auth.login}?next=${encodeURIComponent(ROUTES.ilanlar.detail(ilan.slug||ilan.id))}`);}
  async function purchase(d:PurchaseDeclarationInput,card:boolean){
    if(!isAuthenticated){login();return;}if(busy)return;
    setBusy(true);setError('');
    try{if(card)setCheckout(await initiateIlanPayment(ilan.id,d));else{const r=await purchaseIlan(ilan.id,d);setAccess({is_owner:false,contact:r.contact,balance:r.credit_balance,state:'purchased'});}}
    catch(e){const code=(e as {code?:string}).code;setError(code==='unavailable'?'Bu ilan artık satın alınamıyor.':code==='payments_unavailable'?'Kartla ödeme şu anda kullanılamıyor.':code==='insufficient_credit'?'Yeterli hak bulunmuyor. Haklarını kontrol et.':'İşlem tamamlanamadı. Yeniden deneyebilirsin.');if(code==='insufficient_credit')setAccess(a=>a?{...a,state:'card'}:a);}
    finally{setBusy(false);}
  }
  const status=ilan.status==='sold'?'Satıldı':ilan.status==='expired'?'Süresi doldu':ilan.status==='active'?'Aktif': 'Kapalı';
  return <section className="site-container py-8 sm:py-10">
    <nav aria-label="İçerik yolu" className="mb-8 flex flex-wrap gap-3 text-sm text-muted"><Link href={ROUTES.ilanlar.list} className="hover:text-brand">İlanlar</Link><span aria-hidden="true">/</span><span>{ilan.from_city} – {ilan.to_city}</span></nav>
    <div className="grid items-start gap-8 lg:grid-cols-[1.65fr_1fr]"><div className="min-w-0">
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{ilan.from_city} <span className="font-normal">→</span> {ilan.to_city}</h1>
      {(ilan.from_district||ilan.to_district)&&<p className="mt-3 text-muted">{ilan.from_district} / {ilan.to_district}</p>}
      <div className="my-7 flex flex-wrap gap-x-6 gap-y-3 border-b border-border-soft pb-7 text-sm"><time dateTime={ilan.departure_date}>{formatDate(ilan.departure_date)}</time><span>{vehicles[ilan.vehicle_type]??ilan.vehicle_type}</span><span>{status}</span></div>
      <h2 className="text-2xl font-semibold">Açıklama</h2><p className="mt-4 whitespace-pre-wrap break-words leading-8 text-muted">{ilan.description||'İlan sahibi ek açıklama paylaşmadı.'}</p>
      {ilan.arrival_date&&<p className="mt-5 text-sm text-muted">Planlanan varış: {formatDate(ilan.arrival_date)}</p>}
      <details className="mt-8 rounded-lg border border-border p-5" onToggle={e=>setMap(e.currentTarget.open)}><summary className="font-medium">Haritayı göster</summary>{map&&<div className="mt-4"><RouteMap fromCity={ilan.from_city} toCity={ilan.to_city} height={300}/><p className="mt-2 text-sm text-muted">Harita güzergâhı yaklaşık gösterir. Kesin buluşma yerini taşıyıcıyla görüş.</p></div>}</details>
    </div><div><RevealAside contact={access?.contact??null} error={error} isAuthenticated={isAuthenticated} isActive={ilan.status==='active'} listingPrice={price} revealing={busy} state={access?.state} paymentsEnabled={enabled} onLogin={login} onPay={d=>purchase(d,true)} onReveal={d=>purchase(d,false)}/>{(error||price===null)&&<button onClick={()=>setAttempt(n=>n+1)} className="mt-3 min-h-11 text-brand">Bilgileri yeniden yükle</button>}</div></div>
    <PaymentModal show={!!checkout} onClose={()=>{const ref=checkout?.conversationId;setCheckout(null);if(ref)router.push(`${ROUTES.panel.odemeSonuc}?ref=${encodeURIComponent(ref)}`);}} checkoutFormContent={checkout?.checkoutFormContent} iframeUrl={checkout?.iframeUrl} title="İletişim erişimi ödemesi"/>
  </section>;
}
