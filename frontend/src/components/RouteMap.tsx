'use client';
import {getCityCoords} from '@/lib/city-coords';
import type {LocationValue} from '@paketjet/locations';
type Props={fromCity:string;toCity:string;fromLocation?:LocationValue|null;toLocation?:LocationValue|null;height?:number;className?:string};
export function RouteMap({fromCity,toCity,fromLocation,toLocation,height=260,className=''}:Props){
 const points=[{label:fromLocation?.label||fromCity,point:fromLocation?.lat!==undefined?fromLocation:getCityCoords(fromCity)},{label:toLocation?.label||toCity,point:toLocation?.lat!==undefined?toLocation:getCityCoords(toCity)}];
 return <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>{points.map(({label,point},index)=>{if(!point||point.lat===undefined||point.lng===undefined)return <p key={index} className="text-sm text-muted">{label}: Konum işaretlenmemiş.</p>;const {lat,lng}=point;const query=new URLSearchParams({bbox:[lng-.025,lat-.015,lng+.025,lat+.015].join(','),layer:'mapnik',marker:`${lat},${lng}`});return <figure key={index}><figcaption className="mb-2 text-sm font-medium">{index?'Varış':'Kalkış'}: {label}</figcaption><iframe title={`${index?'Varış':'Kalkış'} konumu`} src={`https://www.openstreetmap.org/export/embed.html?${query}`} className="w-full rounded-lg border border-border" style={{height}} loading="lazy" referrerPolicy="strict-origin-when-cross-origin"/></figure>;})}</div>;
}
