import Link from 'next/link';
import { ArrowRight, FileText, Contact, CalendarDays, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/date';
import type { Ilan } from '@/modules/ilan/ilan.type';
import type { MyPurchase } from '@/modules/purchases/purchases.type';
import { ROUTES } from '@/config/routes';
const labels:Record<string,string>={active:'Yayında',pending_approval:'İncelemede',paused:'Durduruldu',sold:'Satıldı',expired:'Süresi doldu',cancelled:'Kapatıldı',removed:'Arşivlendi',completed:'Tamamlandı'};
export function RecentListings({rows,loading}:{rows:Ilan[]|null;loading:boolean}) {
 return <section className="account-card"><div className="account-card-heading"><h2>Son ilanlarım</h2><Link href={ROUTES.panel.ilanlarim}>Tüm ilanlarım <ArrowRight size={15}/></Link></div>
  {loading?<p role="status" className="py-8 text-muted">İlanlar yükleniyor…</p>:rows===null?<p className="py-8 text-muted">İlan bilgisi alınamadı.</p>:rows.length?<ul className="space-y-3">{rows.slice(0,4).map(row=>{
   const state=['active','pending_approval'].includes(row.status)&&new Date(row.departure_date).getTime()<=Date.now()?'expired':row.status;
   return <li key={row.id}><Link href={ROUTES.panel.ilanlarim} className="account-listing"><span className="account-row-icon"><MapPin size={22}/></span><div className="min-w-0 flex-1"><p className="break-words font-semibold">{row.from_city} <span className="text-brand">→</span> {row.to_city}</p>{row.title&&<p className="mt-1 line-clamp-1 text-sm text-muted">{row.title}</p>}<p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><CalendarDays size={14}/>{formatDate(row.departure_date)}</p></div><Badge color={state==='active'?'success':state==='pending_approval'?'warning':'muted'}>{labels[state]||state}</Badge><ArrowRight size={17} className="shrink-0 text-muted"/></Link></li>;
  })}</ul>:<div className="account-empty"><FileText size={32}/><h3>Henüz ilan oluşturmadın.</h3><p>Ücretsiz ilan vererek güzergâhını paylaşabilirsin.</p><Link href={ROUTES.ilanVer}>İlan oluştur <ArrowRight size={16}/></Link></div>}
 </section>;
}
export function RecentPurchases({rows,loading}:{rows:MyPurchase[]|null;loading:boolean}) {
 return <section className="account-card"><div className="account-card-heading"><h2>İletişim erişimlerim</h2><Link href={ROUTES.panel.satinAldiklarim}>Tümünü gör <ArrowRight size={15}/></Link></div>
  {loading?<p role="status" className="py-8 text-muted">İletişim erişimleri yükleniyor…</p>:rows===null?<p className="py-8 text-muted">Satın alma bilgisi alınamadı.</p>:rows.length?<ul className="divide-y divide-border-soft">{rows.slice(0,4).map(row=><li key={row.id}><Link href={ROUTES.ilanlar.detail(row.ilan_id)} className="flex items-center justify-between gap-3 py-4 font-medium"><span>{row.from_city} → {row.to_city}</span><ArrowRight size={17}/></Link></li>)}</ul>:<div className="account-empty"><Contact size={32}/><h3>Henüz iletişim erişimin yok.</h3><p>Güzergâhına uygun ilanları keşfet.</p><Link href={ROUTES.ilanlar.list}>İlanları keşfet <ArrowRight size={16}/></Link></div>}
 </section>;
}
