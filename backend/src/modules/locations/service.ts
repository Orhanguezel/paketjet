import type {LocationValue} from './validation';
type Feature={properties?:Record<string,unknown>;geometry?:{coordinates?:number[]}};
type Suggestion=LocationValue & {id:string;lat:number;lng:number};
const cache=new Map<string,{until:number;data:Suggestion[]}>(),pending=new Map<string,Promise<Suggestion[]>>();
let windowStart=Date.now(),requests=0;
const text=(v:unknown,max=128)=>typeof v==='string'?v.trim().slice(0,max):'';
export function normalizeLocation(feature:Feature):Suggestion|null{
 const p=feature.properties??{},coords=feature.geometry?.coordinates;
 if(!coords||!Number.isFinite(coords[0])||!Number.isFinite(coords[1])||Math.abs(coords[0])>180||Math.abs(coords[1])>90)return null;
 const label=[p.name,[p.street,p.housenumber].filter(Boolean).join(' '),p.district,p.city,p.state,p.country].map(v=>text(v)).filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(', ').slice(0,400);
 if(!label)return null;
 return {id:`osm-${text(p.osm_type)}-${text(String(p.osm_id))}`,label,city:text(p.state)||text(p.city)||text(p.name),district:text(p.city)||text(p.district),lat:coords[1],lng:coords[0]};
}
export async function searchLocations(query:string):Promise<Suggestion[]>{
 const key=query.toLocaleLowerCase('tr-TR'),cached=cache.get(key);
 if(cached&&cached.until>Date.now())return cached.data;
 if(pending.has(key))return pending.get(key)!;
 if(Date.now()-windowStart>60000){windowStart=Date.now();requests=0;}
 if(++requests>60)throw Object.assign(new Error('location_busy'),{statusCode:429});
 const work=(async()=>{
  const base=process.env.PHOTON_URL??'https://photon.komoot.io';
  const url=new URL('/api/',base);url.search=new URLSearchParams({q:query,limit:'8'}).toString();
  const response=await fetch(url,{headers:{'User-Agent':'PaketJet/1.0 (https://paketjet.com; info@paketjet.net)'},signal:AbortSignal.timeout(5000)});
  if(!response.ok)throw Object.assign(new Error('location_provider_unavailable'),{statusCode:503});
  const body=await response.json() as {features?:Feature[]};
  const data=(body.features??[]).map(normalizeLocation).filter((v):v is Suggestion=>!!v).filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i);
  if(cache.size>=2000)cache.delete(cache.keys().next().value!);
  cache.set(key,{until:Date.now()+3600000,data});return data;
 })();
 pending.set(key,work);try{return await work;}finally{pending.delete(key);}
}
