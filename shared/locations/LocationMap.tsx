'use client';
import {useState} from 'react';
import type {LocationValue} from './location.type';
export function LocationMap({location,label='Haritada göster'}:{location:LocationValue;label?:string}){
 const [open,setOpen]=useState(false);
 if(!Number.isFinite(location.lat)||!Number.isFinite(location.lng))return null;
 const lat=location.lat!,lng=location.lng!,q=new URLSearchParams({bbox:[lng-.025,lat-.015,lng+.025,lat+.015].join(','),layer:'mapnik',marker:`${lat},${lng}`});
 return <details className="pj-location-map" onToggle={e=>setOpen(e.currentTarget.open)}><summary>{label}</summary>{open&&<iframe title={`${location.label} konumu`} src={`https://www.openstreetmap.org/export/embed.html?${q}`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin"/>}</details>;
}
