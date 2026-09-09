'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {TURKEY_CITIES} from '@/data/turkey-cities';
type Props={value:string;onChange:(city:string)=>void;placeholder?:string;label?:string;id?:string};
const normalize=(value:string)=>value.toLocaleLowerCase('tr-TR').replaceAll('ı','i').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
export default function CityAutocomplete({value,onChange,placeholder='İl seçin',label,id}:Props){
 const generated=useId(),inputId=id??generated,root=useRef<HTMLDivElement>(null),[open,setOpen]=useState(false),[active,setActive]=useState(-1);
 const options=TURKEY_CITIES.filter(city=>normalize(city.label).includes(normalize(value))).slice(0,12);
 useEffect(()=>{const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[]);
 function select(index:number){const city=options[index];if(city){onChange(city.value);setOpen(false);setActive(-1);}}
 return <div ref={root} className="relative min-w-0">{label&&<label htmlFor={inputId} className="mb-2 block text-sm font-medium text-foreground">{label}</label>}
 <input id={inputId} role="combobox" aria-label={label??placeholder} aria-autocomplete="list" aria-expanded={open} aria-controls={`${inputId}-cities`} aria-activedescendant={open&&active>=0?`${inputId}-option-${active}`:undefined} value={value} onChange={e=>{onChange(e.target.value);setOpen(true);setActive(-1);}} onFocus={()=>setOpen(true)} onBlur={()=>setOpen(false)} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setOpen(true);setActive(n=>Math.min(n+1,options.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setOpen(true);setActive(n=>Math.max(n-1,0));}else if(e.key==='Enter'&&open&&active>=0){e.preventDefault();select(active);}else if(e.key==='Escape'){e.preventDefault();setOpen(false);setActive(-1);}}} placeholder={placeholder} autoComplete="off" className="h-12 w-full min-w-0 rounded-lg border border-border bg-surface px-3 text-base text-foreground focus:border-brand focus:ring-2 focus:ring-brand/20"/>
 {open&&<ul id={`${inputId}-cities`} role="listbox" aria-label="Şehirler" className="absolute inset-x-0 top-full z-30 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-surface p-1 shadow-lg">{options.map((city,index)=><li key={city.value} role="option" aria-selected={index===active} id={`${inputId}-option-${index}`} onPointerDown={e=>e.preventDefault()} onClick={()=>select(index)} className={`cursor-pointer rounded-md px-3 py-3 text-base ${index===active?'bg-brand-light text-foreground':'hover:bg-bg-alt'}`}>{city.label}</li>)}{!options.length&&<li role="presentation" className="px-3 py-4 text-sm text-muted">Şehir bulunamadı.</li>}</ul>}
 </div>;
}
