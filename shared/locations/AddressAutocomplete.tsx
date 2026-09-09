'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {LocationMap} from './LocationMap';
import type {LocationSuggestion,LocationValue} from './location.type';
type Props={value:string;onChange:(value:string,location?:LocationSuggestion)=>void;location?:LocationValue|null;label?:string;id?:string;placeholder?:string;required?:boolean;disabled?:boolean;endpoint?:string;maxLength?:number;showMap?:boolean};
export function AddressAutocomplete({value,onChange,location,label,id,placeholder='Köy, mahalle veya adres yazın',required,disabled,endpoint='/api/locations/search',maxLength=400,showMap=true}:Props){
 const autoId=useId(),inputId=id??autoId,root=useRef<HTMLDivElement>(null),version=useRef(0),[ready,setReady]=useState(false),[open,setOpen]=useState(false),[active,setActive]=useState(-1),[options,setOptions]=useState<LocationSuggestion[]>([]),[loading,setLoading]=useState(false),[error,setError]=useState(false),[selected,setSelected]=useState<LocationValue|null>(location??null);
 useEffect(()=>setReady(true),[]);
 useEffect(()=>{if(location?.lat!==undefined&&location.lng!==undefined)setSelected(location);else if(selected?.label!==value)setSelected(null);},[value,location,selected?.label]);
 useEffect(()=>{
  const request=++version.current;setOptions([]);setActive(-1);setError(false);setLoading(false);
  if(!open||value.trim().length<3||selected?.label===value)return;
  setLoading(true);
  const controller=new AbortController();
  const timer=setTimeout(async()=>{setLoading(true);try{const r=await fetch(`${endpoint}?q=${encodeURIComponent(value.trim())}`,{signal:controller.signal,credentials:'same-origin'});if(!r.ok)throw new Error('lookup');const body=await r.json();if(request===version.current)setOptions(body.data??[]);}catch(e){if(!controller.signal.aborted&&request===version.current)setError(true);}finally{if(request===version.current)setLoading(false);}},450);
  return()=>{clearTimeout(timer);controller.abort();};
 },[value,open,endpoint,selected?.label]);
 useEffect(()=>{const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[]);
 function select(index:number){const item=options[index];if(!item)return;version.current++;setSelected(item);onChange(item.label,item);setOpen(false);setOptions([]);setActive(-1);}
 return <div className="pj-location" ref={root}>{label&&<label htmlFor={inputId}>{label}</label>}<input id={inputId} role="combobox" aria-label={label??placeholder} aria-autocomplete="list" aria-expanded={open} aria-controls={`${inputId}-options`} aria-activedescendant={open&&active>=0?`${inputId}-${active}`:undefined} value={value} placeholder={placeholder} maxLength={maxLength} required={required} disabled={disabled||!ready} autoComplete="off" onFocus={()=>setOpen(true)} onBlur={e=>{if(!root.current?.contains(e.relatedTarget as Node))setOpen(false);}} onChange={e=>{setSelected(null);onChange(e.target.value);setOpen(true);}} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setOpen(true);setActive(n=>Math.min(n+1,options.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setActive(n=>options.length?Math.max(n-1,0):-1);}else if(e.key==='Enter'&&open&&active>=0){e.preventDefault();select(active);}else if(e.key==='Escape'){e.preventDefault();setOpen(false);} }}/>
 {open&&selected?.label!==value&&<div className="pj-location-popover"><ul role="listbox" aria-label="Adres önerileri" id={`${inputId}-options`}>{options.map((item,index)=><li key={item.id} role="option" id={`${inputId}-${index}`} aria-selected={index===active} onPointerDown={e=>e.preventDefault()} onClick={()=>select(index)}>{item.label}</li>)}</ul><p role="status">{loading?'Adresler aranıyor…':error?'Öneriler şu anda alınamıyor. Adresi yazarak devam edebilirsin.':value.trim().length<3?'En az 3 harf yazın.':!options.length?'Sonuç bulunamadı. Adresi yazarak devam edebilirsin.':null}</p><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap katkıda bulunanlar</a></div>}
 {showMap&&selected&&<LocationMap location={selected}/>}</div>;
}
