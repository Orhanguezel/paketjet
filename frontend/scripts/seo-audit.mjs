import {JSDOM} from 'jsdom';
import {writeFileSync} from 'node:fs';
const base=process.argv[2]||'https://paketjet.com';
const output=process.argv[3]||'/tmp/paketjet-seo-audit.json';
const canonicalOrigin='https://paketjet.com';
const errors=[],pages=[],queue=[],seen=new Set(),assets=new Set();
const get=async(path)=>fetch(new URL(path,base),{signal:AbortSignal.timeout(30000)});
const sitemap=await get('/sitemap.xml');
if(!sitemap.ok)throw new Error(`sitemap ${sitemap.status}`);
const xml=new JSDOM(await sitemap.text(),{contentType:'text/xml'});
const sitemapPaths=[...xml.window.document.querySelectorAll('loc')].map(n=>new URL(n.textContent).pathname);
queue.push(...sitemapPaths,'/ilanlar?page=2','/ilanlar?from=İstanbul');
const allowed=p=>!/^\/(api|panel|admin|dashboard|giris|uye-ol|ilan-ver|sifre|ui-preview|_next|uploads|assets)/.test(p);
while(queue.length&&pages.length<200){
 const path=queue.shift();if(seen.has(path))continue;seen.add(path);
 await new Promise(resolve=>setTimeout(resolve,2500));
 const response=await get(path),html=await response.text();
 const dom=new JSDOM(html),doc=dom.window.document;
 const meta=name=>doc.querySelector(`meta[name="${name}"],meta[property="${name}"]`)?.content;
 const content=doc.body.cloneNode(true);content.querySelectorAll("script,style").forEach(n=>n.remove());const pageText=content.textContent;
 const canonical=doc.querySelector('link[rel=canonical]')?.href;
 const indexable=!/noindex/.test(`${meta('robots')} ${response.headers.get('x-robots-tag')}`);
 const row={path,status:response.status,title:doc.title,description:meta('description'),canonical,indexable,h1:doc.querySelectorAll('h1').length,ogImage:meta('og:image'),schemas:[]};
 if(!response.ok)errors.push(`${path}: HTTP ${response.status}`);
 if(row.h1!==1)errors.push(`${path}: ${row.h1} H1`);
 if(indexable&&(!canonical||!canonical.startsWith(canonicalOrigin)))errors.push(`${path}: canonical missing/invalid`);
 if(!row.title||!row.description||!row.ogImage)errors.push(`${path}: metadata incomplete`);
 if(path.includes('/ornek-ilan-')&&indexable)errors.push(`${path}: sample indexable`);
 if(path.includes('?from=')&&indexable)errors.push(`${path}: filtered results indexable`);
 if(path==='/ilanlar?page=2'&&canonical!==`${canonicalOrigin}/ilanlar?page=2`)errors.push('pagination canonical incorrect');
 if(sitemapPaths.includes(path)&&!indexable)errors.push(`${path}: noindex in sitemap`);
 for(const script of doc.querySelectorAll('script[type="application/ld+json"]')){
  try{const data=JSON.parse(script.textContent);row.schemas.push(data['@type']);if(data['@type']==='FAQPage')for(const q of data.mainEntity){if(!pageText.includes(q.name)||!pageText.includes(q.acceptedAnswer.text))errors.push(`${path}: FAQ not visible in HTML`);}}
  catch{errors.push(`${path}: invalid JSON-LD`);}
 }
 if(row.ogImage)assets.add(row.ogImage);
 for(const a of doc.querySelectorAll('a[href]')){
  const url=new URL(a.getAttribute('href'),canonicalOrigin);
  if(url.origin===canonicalOrigin&&allowed(url.pathname)){const target=url.pathname+url.search;if(!seen.has(target))queue.push(target);}
 }
 pages.push(row);dom.window.close();
}
if(queue.length)errors.push('crawl_limit_reached');
for(const asset of assets){const r=await get(new URL(asset).pathname);if(!r.ok||!r.headers.get('content-type')?.startsWith('image/'))errors.push(`share image invalid: ${asset}`);}
for(const path of ['/blog/seo-audit-missing','/rota/seo-audit-missing','/ilanlar/seo-audit-missing','/ilanlar?page=999999']){const r=await get(path);if(r.status!==404)errors.push(`${path}: expected404 got${r.status}`);}
const robots=await(await get('/robots.txt')).text();if(robots.includes('Disallow: /_next/'))errors.push('render assets blocked');if(!robots.includes('OAI-SearchBot'))errors.push('AI search policy missing');
const report={checkedAt:new Date().toISOString(),base,sitemapCount:sitemapPaths.length,pages,errors};writeFileSync(output,JSON.stringify(report,null,2));console.log(JSON.stringify({pages:pages.length,sitemap:sitemapPaths.length,errors}));if(errors.length)process.exitCode=1;
