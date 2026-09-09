import {buildMetadata} from '@/lib/seo';
import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import IlanDetailClient from './IlanDetailClient';
import { BreadcrumbSchema } from '@/components/JsonLd';
import type { PublicIlan } from '@/modules/ilan/ilan.type';
const fetchIlan=cache(async(id:string):Promise<PublicIlan>=>{
  const response=await fetch(`${process.env.API_INTERNAL_URL||process.env.NEXT_PUBLIC_API_URL||'http://localhost:8078'}/api/ilanlar/${encodeURIComponent(id)}`,{cache:'no-store'});
  if(response.status===404)notFound();
  if(!response.ok)throw new Error('İlan yüklenemedi');
  return response.json();
});
type Props={params:Promise<{id:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {id}=await params;const ilan=await fetchIlan(id);
 const title=`${ilan.is_sample?'ÖRNEK İLAN — ':''}${ilan.from_city} → ${ilan.to_city} taşıyıcı ilanı`;
 return buildMetadata(null, {title, description:`${ilan.from_city} çıkışlı, ${ilan.to_city} varışlı taşıyıcı ilanının güzergâhını ve hareket tarihini incele. İletişim erişimi taşıma bedelinden ayrıdır.`,canonicalPath:`/ilanlar/${encodeURIComponent(ilan.slug||ilan.id)}`,robots:ilan.is_sample||ilan.status!=='active'||Date.parse(ilan.departure_date)<=Date.now()?{index:false,follow:true}:undefined});
}
export default async function IlanDetailPage({params}:Props){const {id}=await params;const ilan=await fetchIlan(id);return <><BreadcrumbSchema items={[{name:'Anasayfa',url:'/'},{name:'İlanlar',url:'/ilanlar'},{name:`${ilan.from_city} → ${ilan.to_city}`} ]}/><IlanDetailClient ilan={ilan}/></>;}
