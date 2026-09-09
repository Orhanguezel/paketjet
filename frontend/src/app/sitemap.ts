import type {MetadataRoute} from 'next';
import {BLOG_POSTS,ROUTE_GUIDES} from '@/modules/content/content.data';
const SITE_URL=process.env.NEXT_PUBLIC_SITE_URL??'https://paketjet.com';
const API_URL=process.env.API_INTERNAL_URL||process.env.NEXT_PUBLIC_API_URL||'http://127.0.0.1:8078';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const result:MetadataRoute.Sitemap=['','/ilanlar','/destek','/hakkimizda','/iletisim','/kvkk','/gizlilik-politikasi','/kullanim-kosullari','/tasima-kurallari','/blog'].map(path=>({url:`${SITE_URL}${path}`}));
 for(const post of [...BLOG_POSTS,...ROUTE_GUIDES])result.push({url:`${SITE_URL}${post.canonicalPath}`,lastModified:post.updatedAt});
 for(let page=1;page<=100;page++){
  try{
   const response=await fetch(`${API_URL}/api/ilanlar?limit=100&page=${page}`,{cache:'no-store'});
   if(!response.ok)throw new Error('sitemap_listings_unavailable');
   const body=await response.json() as {data:Array<{id:string;is_sample?:boolean;slug?:string;updated_at:string}>;total:number};
   for(const ilan of body.data.filter(ilan=>!ilan.is_sample))result.push({url:`${SITE_URL}/ilanlar/${encodeURIComponent(ilan.slug||ilan.id)}`,lastModified:ilan.updated_at});
   if(page*100>=body.total)break;
  }catch{break;}
 }
 return result;
}
