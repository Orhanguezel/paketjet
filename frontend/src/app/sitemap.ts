import type {MetadataRoute} from 'next';
import {BLOG_POSTS,ROUTE_GUIDES} from '@/modules/content/content.data';
import {SITE_URL} from '@/lib/seo';
import {listingSitemap} from '@/lib/sitemap-listings';
const API_URL=process.env.API_INTERNAL_URL||process.env.NEXT_PUBLIC_API_URL||'http://127.0.0.1:8078';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const pages:MetadataRoute.Sitemap=['','/ilanlar','/destek','/hakkimizda','/iletisim','/kvkk','/gizlilik-politikasi','/kullanim-kosullari','/tasima-kurallari','/blog'].map(path=>({url:`${SITE_URL}${path}`}));
 for(const post of [...BLOG_POSTS,...ROUTE_GUIDES])pages.push({url:`${SITE_URL}${post.canonicalPath}`,lastModified:post.updatedAt});
 return [...pages,...await listingSitemap(API_URL)];
}
