import {afterAll,expect,it} from 'bun:test';
import {getTestApp,registerUser,randomEmail,authHeaders,closeTestApp} from './setup';
import {normalizeLocation} from '@/modules/locations/service';
import {locationValueSchema} from '@/modules/locations/validation';
import {repoUpdateIlan,repoListIlans} from '@/modules/ilanlar/repository';
afterAll(closeTestApp);
const village={id:'osm-R-11562233',label:'Şirince, Selçuk, İzmir, Türkiye',city:'İzmir',district:'Selçuk',lat:37.9423518,lng:27.4328343};
it('normalizes village coordinates and rejects broken coordinate pairs',()=>{
 expect(normalizeLocation({properties:{name:'Şirince',city:'Selçuk',state:'İzmir',country:'Türkiye',osm_id:11562233,osm_type:'R'},geometry:{coordinates:[27.4328343,37.9423518]}})).toEqual(village);
 expect(locationValueSchema.safeParse({...village,lat:999}).success).toBe(false);
 expect(locationValueSchema.safeParse({label:'Şirince',lat:37}).success).toBe(false);
 expect(normalizeLocation({geometry:{coordinates:[NaN,3]}})).toBeNull();
});
it('saves, edits and finds village/free-form addresses without requiring an official city',async()=>{
 const app=await getTestApp(),{token}=await registerUser(app,{email:randomEmail(),password:'Test1234!',role:'carrier'});
 const response=await app.inject({method:'POST',url:'/api/ilanlar',headers:authHeaders(token!),payload:{from_city:'İzmir',to_city:'Özel buluşma noktası',from_location:village,to_location:{label:'Göl kenarındaki eski köprü'},from_district:'Selçuk',departure_date:new Date(Date.now()+86400000*10).toISOString(),contact_phone:'05551234567',contact_address:'Özel ev adresi'}});
 expect(response.statusCode).toBe(201);const row=response.json();expect(row.from_location).toEqual(village);
 await repoUpdateIlan(row.id,{status:'active'},true);
 const list=await repoListIlans({from_city:village.label,page:1,limit:100});expect(list.data.some(i=>i.id===row.id)).toBe(true);
 const detail=await app.inject({method:'GET',url:'/api/ilanlar/'+row.id});expect(detail.json().from_location).toEqual(village);expect(detail.json().contact_address).toBeUndefined();
 const edit=await app.inject({method:'PUT',url:'/api/ilanlar/'+row.id,headers:authHeaders(token!),payload:{from_city:'Başka köy',from_location:{label:'Başka köy, orman yolu'},contact_address:'Düzenlenmiş özel adres'}});
 expect(edit.statusCode).toBe(200);expect(edit.json().from_location.label).toBe('Başka köy, orman yolu');expect(edit.json().contact_address).toBe('Düzenlenmiş özel adres');
 const clear=await app.inject({method:'PUT',url:'/api/ilanlar/'+row.id,headers:authHeaders(token!),payload:{from_city:'Yeni nokta'}});expect(clear.statusCode).toBe(200);expect(clear.json().from_location).toBeNull();
});
it('province suggestion still finds older city-only examples and validates short search',async()=>{
 const list=await repoListIlans({from_city:'İzmir, Türkiye',page:1,limit:100});expect(list.data.some(i=>i.from_city==='İzmir'&&!i.from_location)).toBe(true);
 const app=await getTestApp();expect((await app.inject({method:'GET',url:'/api/locations/search?q=ab'})).statusCode).toBe(400);
});
it('province alternatives exclude similarly named districts and preserve date, vehicle and destination',async()=>{
 const app=await getTestApp(),{token}=await registerUser(app,{email:randomEmail(),password:'Test1234!',role:'carrier'});
 const departure=new Date(Date.now()+86400000*20).toISOString();
 async function create(from_city:string,from_district:string){
  const response=await app.inject({method:'POST',url:'/api/ilanlar',headers:authHeaders(token!),payload:{from_city,from_district,to_city:'Ankara',departure_date:departure,vehicle_type:'van',contact_phone:'05551234567'}});
  expect(response.statusCode).toBe(201);const row=response.json();await repoUpdateIlan(row.id,{status:'active'},true);return row.id;
 }
 const matching=await create('Van','İpekyolu'),unrelated=await create('Nevşehir','Van');
 const query=new URLSearchParams({from_province:'Van',to_province:'Ankara',date:departure.slice(0,10),vehicle_type:'van',limit:'100'});
 const response=await app.inject({method:'GET',url:'/api/ilanlar?'+query});expect(response.statusCode).toBe(200);
 const rows=response.json().data;expect(rows.some((r:{id:string})=>r.id===matching)).toBe(true);expect(rows.some((r:{id:string})=>r.id===unrelated)).toBe(false);
 query.set('vehicle_type','truck');const wrongVehicle=await app.inject({method:'GET',url:'/api/ilanlar?'+query});expect(wrongVehicle.json().data.some((r:{id:string})=>r.id===matching)).toBe(false);
 query.set('vehicle_type','van');query.set('to_province','İzmir');const wrongDestination=await app.inject({method:'GET',url:'/api/ilanlar?'+query});expect(wrongDestination.json().data.some((r:{id:string})=>r.id===matching)).toBe(false);
});
