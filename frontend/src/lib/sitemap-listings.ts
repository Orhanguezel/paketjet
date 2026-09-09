import type {MetadataRoute} from 'next';
import {SITE_URL} from './seo';
export async function listingSitemap(apiUrl: string): Promise<MetadataRoute.Sitemap> {
 const entries: MetadataRoute.Sitemap = [];
 for(let page=1;page<=100;page++){
  const response=await fetch(`${apiUrl}/api/ilanlar?limit=100&page=${page}`,{cache:'no-store',signal:AbortSignal.timeout(8000)});
  // Fail visibly rather than silently publishing an incomplete successful sitemap.
  if(!response.ok)throw new Error('sitemap_listings_unavailable');
  const body=await response.json() as {data:Array<{id:string;slug?:string;is_sample?:boolean;updated_at?:string}>;total:number};
  if(!Array.isArray(body.data)||!Number.isFinite(body.total))throw new Error('sitemap_listings_invalid');
  for(const item of body.data){
   if(item.is_sample)continue;
   const date=item.updated_at?new Date(item.updated_at):null;
   entries.push({url:`${SITE_URL}/ilanlar/${encodeURIComponent(item.slug||item.id)}`,...(date&&!Number.isNaN(date.valueOf())?{lastModified:date}: {})});
  }
  if(page*100>=body.total)return entries;
 }
 throw new Error('sitemap_listing_limit_exceeded');
}
