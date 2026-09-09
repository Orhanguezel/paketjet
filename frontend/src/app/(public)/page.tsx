import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSearch from '@/components/HeroSearch';
import IlanCard from '@/components/IlanCard';
import { listIlans } from '@/modules/ilan/ilan.service';
import { getPageMetadata } from '@/lib/seo';
import { getSiteSettingValue } from '@/lib/site-settings';
import { ROUTES } from '@/config/routes';
import { WebSiteSchema, BreadcrumbSchema } from '@/components/JsonLd';
export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {return getPageMetadata('home',{canonicalPath:'/',fallbackDescription:'Taşıyıcı güzergâhlarını keşfet, ilan iletişimine eriş ve taşıyıcıyla doğrudan görüş. Ücretsiz taşıyıcı ilanı oluştur.'});}
const steps=[['İlanı bul','Planına uygun güzergâhlardaki taşıyıcı ilanlarını kolayca keşfet.'],['İletişimi aç','Beğendiğin ilanın iletişim bilgilerine eriş. Ücret, taşıyıcının iletişim bilgilerini görmektir.'],['Taşıyıcıyla görüş','İletişim bilgilerini kullanarak taşıyıcıyla doğrudan görüş, detayları birlikte netleştir.']];
export default async function HomePage(){
  const [result,hero]=await Promise.all([listIlans({limit:4}).then(data=>({data:data.data,error:false})).catch(()=>({data:[],error:true})),getSiteSettingValue<{title?:string;subtitle?:string}>('homepage_hero_v2','tr')]);
  return <>
    <WebSiteSchema/><BreadcrumbSchema items={[{name:'Anasayfa',url:'/'}]}/>
    <HeroSearch heroConfig={hero}/>
    <section className="bg-background py-8"><div className="site-container"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Güncel ilanlar</h2><Link href={ROUTES.ilanlar.list} className="text-sm font-semibold text-brand">Tüm ilanları gör</Link></div>
      <div className="space-y-3">{result.error?<div role="alert" className="rounded-lg border border-border bg-surface p-6"><p>İlanlar şu anda yüklenemedi.</p><Link href={ROUTES.ilanlar.list} className="mt-3 inline-flex font-semibold text-brand">Yeniden dene</Link></div>:result.data.length?result.data.map(ilan=><IlanCard key={ilan.id} ilan={ilan}/>):<div className="rounded-lg border border-border bg-surface px-5 py-7 text-center"><h3 className="text-lg font-semibold">Bu tarihlerde aktif ilan bulunmuyor.</h3><p className="mt-2 text-sm leading-6 text-muted">Farklı bir tarih veya güzergâh deneyerek yeniden arama yapabilirsin.</p><Link href={ROUTES.ilanlar.list} className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-brand px-5 text-sm font-semibold text-brand">Arama kriterlerini değiştir</Link></div>}</div>
    </div></section>
    <section id="nasil-calisir" className="bg-surface py-8"><div className="site-container"><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Nasıl çalışır?</h2><p className="mt-2 text-muted">İlanı seç, iletişim bilgilerine eriş, taşıyıcıyla görüş.</p><ol className="mt-7 grid gap-7 md:grid-cols-3">{steps.map(([title,description],i)=><li key={title} className="flex items-start gap-5 md:border-r md:border-border-soft md:pr-6 md:last:border-0"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-xlight font-semibold text-brand">{i+1}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{description}</p></div></li>)}</ol></div></section>
    <section className="bg-surface pb-6"><div className="site-container"><div className="flex flex-col gap-5 rounded-lg bg-brand-xlight px-6 py-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-bold">Yolun belli mi?</h2><p className="mt-1 text-muted">Güzergâhını ücretsiz paylaş.</p></div><Link href={ROUTES.ilanVer} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-action px-6 font-semibold text-white hover:bg-brand-dark">Ücretsiz İlan Ver</Link></div></div></section>
  </>;
}
