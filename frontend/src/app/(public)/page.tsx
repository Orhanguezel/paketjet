import HomeAnswers from '@/components/home/HomeAnswers';
import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSearch from '@/components/HeroSearch';
import IlanCard from '@/components/IlanCard';
import { listIlans } from '@/modules/ilan/ilan.service';
import { getPageMetadata } from '@/lib/seo';
import { getSiteSettingValue } from '@/lib/site-settings';
import { ROUTES } from '@/config/routes';
import {HomePrinciples, EmptyListings, HowItWorks, CarrierInvitation} from '@/components/home/HomeSections';
import {ArrowRight} from 'lucide-react';
import { WebSiteSchema, BreadcrumbSchema } from '@/components/JsonLd';
export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {return getPageMetadata('home',{title:'Taşıyıcı ilanları ve ücretsiz güzergâh paylaşımı',description:'Taşıyıcı güzergâhlarını ara, iletişim bilgilerine eriş ve doğrudan görüş. Taşıyıcılar için ücretsiz ilan. İletişim bedeli taşıma ücretinden ayrıdır.',canonicalPath:'/',fallbackDescription:'Taşıyıcı güzergâhlarını keşfet, ilan iletişimine eriş ve taşıyıcıyla doğrudan görüş. Ücretsiz taşıyıcı ilanı oluştur.'});}
export default async function HomePage(){
  const [result,hero]=await Promise.all([listIlans({limit:4}).then(data=>({data:data.data,error:false})).catch(()=>({data:[],error:true})),getSiteSettingValue<{title?:string;subtitle?:string}>('homepage_hero_v2','tr')]);
  return <>
    <WebSiteSchema/><BreadcrumbSchema items={[{name:'Anasayfa',url:'/'}]}/>
    <HeroSearch heroConfig={hero}/><HomePrinciples/>
    <section className="home-listings"><div className="site-container"><div className="section-heading"><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Güncel ilanlar</h2><Link href={ROUTES.ilanlar.list} className="section-link">Tüm ilanları gör<ArrowRight size={18}/></Link></div>
      <div className="space-y-3">{result.error?<div role="alert" className="rounded-lg border border-border bg-surface p-6"><p>İlanlar şu anda yüklenemedi.</p><Link href={ROUTES.ilanlar.list} className="mt-3 inline-flex font-semibold text-brand">Yeniden dene</Link></div>:result.data.length?result.data.map(ilan=><IlanCard key={ilan.id} ilan={ilan}/>):<EmptyListings/>}</div>
    </div></section>
    <HowItWorks/><HomeAnswers/><CarrierInvitation/>
  </>;
}
