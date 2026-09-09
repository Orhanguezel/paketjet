'use client';
import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';
import { getSiteSettingValue } from '@/lib/site-settings';
import type { ContactSnapshot, PurchaseDeclarationInput } from '@/modules/purchases/purchases.type';
interface Props {contact:ContactSnapshot|null;error:string;isAuthenticated:boolean;isActive:boolean;listingPrice:number|null;revealing:boolean;state?:'owner'|'unavailable'|'credit'|'card'|'purchased';paymentsEnabled:boolean;onLogin:()=>void;onPay:(d:PurchaseDeclarationInput)=>void;onReveal:(d:PurchaseDeclarationInput)=>void;}
export function RevealAside({contact,error,isAuthenticated,isActive,listingPrice,revealing,state,paymentsEnabled,onLogin,onPay,onReveal}:Props){
  const id=useId();
  const [value,setValue]=useState(''),[accepted,setAccepted]=useState(false),[message,setMessage]=useState(''),[loadError,setLoadError]=useState(false),[retry,setRetry]=useState(0),[copied,setCopied]=useState(false);
  useEffect(()=>{let active=true;setLoadError(false);getSiteSettingValue<{message?:string}>('listing.content_declaration','tr').then(s=>{if(active){setMessage(s?.message?.trim()??'');setLoadError(!s?.message);}}).catch(()=>{if(active)setLoadError(true);});return()=>{active=false;};},[retry]);
  const canSubmit=Number(value)>0&&Number(value)<=99999999&&accepted&&!!message&&listingPrice!==null&&listingPrice>0;
  const declaration=():PurchaseDeclarationInput=>({estimated_value:Number(value),estimated_value_currency:'TRY',content_declared:true});
  return <aside id="contact-access" className="rounded-lg border border-border bg-surface p-6 lg:sticky lg:top-6">
    <h2 className="text-2xl font-bold">{contact?'İletişim bilgileri':'İletişim bilgilerine eriş'}</h2>
    {contact?<div className="mt-6 grid gap-4"><p className="font-medium">{contact.name||'İlan sahibi'}</p>{contact.phone&&<a className="break-all text-brand underline" href={`tel:${contact.phone.replace(/[^+0-9]/g,'')}`}>{contact.phone}</a>}{contact.email&&<a className="break-all text-brand underline" href={`mailto:${contact.email}`}>{contact.email}</a>}{contact.address&&<p className="text-muted">{contact.address}</p>}<button className="min-h-11 rounded-lg border border-border px-4 text-left" onClick={async()=>{try{await navigator.clipboard.writeText([contact.name,contact.phone,contact.email,contact.address].filter(Boolean).join('\n'));setCopied(true);}catch{setCopied(false);}}}>{copied?'Kopyalandı':'Bilgileri kopyala'}</button></div>:state==='owner'?<div className="mt-5"><p>Bu ilan sana ait.</p><Link href={ROUTES.panel.ilanlarim} className="mt-4 inline-flex text-brand">İlanlarımı yönet</Link></div>:!isActive?<p className="mt-5 text-muted">Bu ilan yeni satın almaya kapalı. Daha önce satın aldıysan hesabınla giriş yaparak iletişim bilgilerine dönebilirsin.</p>:<>
      <p className="mt-5 text-4xl font-bold text-brand">{listingPrice===null?'—':Number(listingPrice).toLocaleString('tr-TR')} {listingPrice!==null&&'TL'}</p><p className="mt-2 font-medium">İletişim erişimi ücreti</p><p className="mt-2 text-sm leading-6 text-muted">Taşıma ücreti değildir. Taşıma koşullarını taşıyıcıyla doğrudan görüşürsün.</p>
      {!isAuthenticated?<button onClick={onLogin} className="mt-6 min-h-12 w-full rounded-lg bg-action px-4 font-semibold text-white">Giriş yap</button>:<div className="mt-6 border-t border-border-soft pt-6">
        <label htmlFor={`${id}-value`} className="text-sm font-medium">Eşyanın tahmini değeri (TL)</label><input id={`${id}-value`} type="number" min="1" max="99999999" step="0.01" inputMode="decimal" value={value} onChange={e=>setValue(e.target.value)} placeholder="Örn. 5000" className="mt-2 h-12 w-full rounded-lg border border-border bg-surface px-3"/>
        {loadError?<div role="alert" className="mt-4 text-sm"><p>Beyan metni yüklenemedi.</p><button onClick={()=>setRetry(n=>n+1)} className="min-h-11 text-brand">Yeniden dene</button></div>:<label className="mt-5 flex items-start gap-3 text-sm leading-6"><input type="checkbox" checked={accepted} disabled={!message} onChange={e=>setAccepted(e.target.checked)} className="mt-1 size-5 shrink-0 accent-brand"/><span>{message||'Beyan metni yükleniyor…'}</span></label>}
        {listingPrice===null&&<p role="alert" className="mt-4 text-sm text-danger">Fiyat alınamadı. Sayfayı yenileyerek tekrar deneyin.</p>}
        {error&&<p role="alert" className="mt-4 text-sm text-danger">{error}</p>}
        {state==='card'&&!paymentsEnabled?<p className="mt-5 text-sm leading-6 text-muted">Kartla ödeme şu anda kullanılamıyor. Mevcut haklarınla işlem yapabilir veya destek alabilirsin.</p>:<button disabled={revealing||!canSubmit||!state} onClick={()=>state==='card'?onPay(declaration()):onReveal(declaration())} className="mt-6 min-h-12 w-full rounded-lg bg-action px-4 font-semibold text-white disabled:opacity-50">{revealing?'İşleniyor…':state==='credit'?'1 hak kullan · İletişimi aç':'Kartla öde · İletişimi aç'}</button>}
        <Link href={ROUTES.panel.ilanAlmaHakki} className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-brand">İlan alma hakkı paketleri</Link>
      </div>}
    </>}
  </aside>;
}
