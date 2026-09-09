import {afterEach,describe,expect,it,vi} from 'vitest';
import {buildMetadata} from '../seo';
import {listingSitemap} from '../sitemap-listings';
import robots from '../../app/robots';
afterEach(()=>vi.unstubAllGlobals());
describe('SEO signals',()=>{
 it('keeps page overrides consistent across search and social metadata',()=>{
  const meta=buildMetadata({pageKey:'home',title:'Old title',description:'Old model'}, {title:'Yeni başlık',description:'Doğru açıklama',canonicalPath:'/blog/test',openGraph:{type:'article'}});
  expect(meta.title).toBe('Yeni başlık');expect(meta.description).toBe('Doğru açıklama');
  expect(meta.openGraph).toMatchObject({title:'Yeni başlık | PaketJet',description:'Doğru açıklama',type:'article',url:'https://paketjet.com/blog/test'});
  expect(meta.openGraph?.images).toEqual(['https://paketjet.com/opengraph-image']);
  expect(meta.twitter).toMatchObject({description:'Doğru açıklama'});expect(meta).not.toHaveProperty('canonicalPath');
 });
 it('honors explicit index false and removes duplicate brand suffixes',()=>{
  const meta=buildMetadata({pageKey:'test',title:'PaketJet | Rehber | PaketJet',robots:{index:false,follow:true}});
  expect(meta.title).toBe('Rehber');expect(meta.robots).toEqual({index:false,follow:true});
 });
 it('allows render assets and applies the same exclusions to AI search',()=>{
  const rules=robots().rules as Array<{userAgent:string|string[];disallow:string[]}>;
  expect(rules[0].disallow).not.toContain('/_next/');expect(rules[1].userAgent).toContain('OAI-SearchBot');expect(rules[1].disallow).toEqual(rules[0].disallow);
 });
 it('excludes sample listings and does not invent a modification date',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({total:2,data:[{id:'example',is_sample:true},{id:'real',slug:'real-route',updated_at:'invalid'}]})}));
  expect(await listingSitemap('https://api.test')).toEqual([{url:'https://paketjet.com/ilanlar/real-route'}]);
 });
 it('fails rather than producing a partial sitemap after an API failure',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValueOnce({ok:true,json:async()=>({total:101,data:[{id:'first'}]})}).mockResolvedValueOnce({ok:false}));
  await expect(listingSitemap('https://api.test')).rejects.toThrow('sitemap_listings_unavailable');
 });
});

describe('public branding fetch',()=>{
 it('uses a bounded shared server cache without cookies',async()=>{
  vi.stubGlobal('window',undefined);
  const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({value:'{"url":"/logo.png"}'})});vi.stubGlobal('fetch',fetcher);
  const {getSiteSettingValue}=await import('../site-settings');
  expect(await getSiteSettingValue('site_logo','*')).toEqual({url:'/logo.png'});
  expect(fetcher.mock.calls[0][1]).toMatchObject({next:{revalidate:300}});
  expect(fetcher.mock.calls[0][1]).not.toHaveProperty('credentials');expect(fetcher.mock.calls[0][1]).not.toHaveProperty('headers');
 });
});
