import type { Metadata } from 'next';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://paketjet.com').replace(/\/$/, '');
export const DEFAULT_DESCRIPTION = 'Taşıyıcı güzergâhlarını keşfet, iletişim bilgilerine eriş ve doğrudan görüş. Güzergâhını ücretsiz ilan ver. İletişim erişim bedeli taşıma ücretinden ayrıdır.';
const API_URL = (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8078').replace(/\/$/, '');
export interface PageSeoData {
  pageKey: string; title?: string; description?: string; keywords?: string;
  open_graph?: {type?: string; images?: string[]};
  twitter?: {card?: string; site?: string; creator?: string};
  robots?: {noindex?: boolean; index?: boolean; follow?: boolean};
  _fallback?: boolean;
}
type Overrides = Partial<Metadata> & {vars?: Record<string,string>; canonicalPath?: string; fallbackDescription?: string; publishedTime?: string; modifiedTime?: string};
export async function fetchPageSeo(pageKey: string): Promise<PageSeoData | null> {
  try {
    const res = await fetch(`${API_URL}/api/site_settings/seo/${pageKey}`, {next:{revalidate:300}, signal:AbortSignal.timeout(5000)});
    return res.ok ? res.json() : null;
  } catch {return null;}
}
const interpolate = (text: string, vars: Record<string,string>) => text.replace(/\{\{(\w+)\}\}/g, (_,key)=>vars[key]??'');
export function buildMetadata(seo: PageSeoData | null, overrides: Overrides = {}): Metadata {
  const {vars={}, canonicalPath, fallbackDescription, publishedTime, modifiedTime, ...explicit} = overrides;
  const rawTitle = explicit.title ?? (seo?.title ? interpolate(seo.title,vars) : 'Taşıyıcı ilanları');
  const title = typeof rawTitle === 'string' ? rawTitle.replace(/\s*[|—-]\s*PaketJet\s*$/i,'').replace(/^PaketJet\s*\|\s*/i,'') : rawTitle;
  const shareTitle = typeof title === 'string' ? `${title} | PaketJet` : title && 'absolute' in title ? title.absolute : 'PaketJet';
  const description = explicit.description ?? (seo?.description ? interpolate(seo.description,vars) : fallbackDescription ?? DEFAULT_DESCRIPTION);
  const url = canonicalPath ? `${SITE_URL}${canonicalPath}` : undefined;
  const images = seo?.open_graph?.images?.length ? seo.open_graph.images.map(img=>img.startsWith('/')?`${SITE_URL}${img}`:img) : [`${SITE_URL}/opengraph-image`];
  const robots = seo?.robots ? {index:!seo.robots.noindex && seo.robots.index!==false,follow:seo.robots.follow!==false} : undefined;
  return {
    ...explicit, title, description,
    ...(seo?.keywords && {keywords:seo.keywords.split(',').map(s=>s.trim()).filter(Boolean)}),
    ...(robots && {robots}), ...(explicit.robots && {robots:explicit.robots}),
    ...(url && {alternates:{...explicit.alternates,canonical:url}}),
    openGraph:{type:'website',siteName:'PaketJet',locale:'tr_TR',title:shareTitle,description,images,...(url && {url}),...(publishedTime && {publishedTime}),...(modifiedTime && {modifiedTime}),...explicit.openGraph},
    twitter:{card:'summary_large_image',title:shareTitle,description,images,...(seo?.twitter?.site && {site:seo.twitter.site}),...explicit.twitter},
  };
}
export async function getPageMetadata(pageKey: string, overrides?: Overrides): Promise<Metadata> {
  return buildMetadata(await fetchPageSeo(pageKey),overrides);
}
export function noIndexMetadata(title: string, description?: string): Metadata {
  return {title,...(description && {description}),robots:{index:false,follow:false}};
}
