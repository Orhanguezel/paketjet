'use client';
import Image from 'next/image';
import {Pause, Play, Truck} from 'lucide-react';
import {useAmbientMotion} from './home/useAmbientMotion';

/** Decorative route illustration, never a live vehicle or availability map. */
export default function RouteMapAnimation() {
  const {root, running, paused, setPaused, reduced} = useAmbientMotion();
  return <div ref={root} className="route-scene" data-running={running}>
    <Image src="/assets/motion/route-landscape.webp" alt="" fill sizes="(max-width: 767px) 90vw, 50vw" className="object-contain" priority/>
    <svg viewBox="0 0 600 400" className="route-lines" aria-hidden="true">
      <path className="route-track" d="M165 132 Q248 116 302 195 T478 207 M165 132 Q133 180 136 234 Q221 262 302 195"/>
      <path className="route-flow" d="M165 132 Q248 116 302 195 T478 207 M136 234 Q221 262 302 195"/>
      {[[165,132],[302,195],[136,234],[478,207]].map(([cx,cy],i)=><g key={cx}><circle className="route-halo" cx={cx} cy={cy} r="15" style={{animationDelay:`${i*0.5}s`}}/><circle className="route-node" cx={cx} cy={cy} r="7"/></g>)}
      <g className="route-label"><text x="165" y="109">İstanbul</text><text x="310" y="176">Ankara</text><text x="136" y="267">İzmir</text></g>
    </svg>
    <div className="route-vehicle" aria-hidden="true"><Truck size={23} strokeWidth={1.6}/></div>
    <div className="route-caption"><span>Güzergâhları keşfet</span>{!reduced&&<button type="button" onClick={()=>setPaused(!paused)} aria-label={paused?'Rota animasyonunu başlat':'Rota animasyonunu duraklat'} aria-pressed={paused}>{paused?<Play size={15}/>:<Pause size={15}/>}</button>}</div>
  </div>;
}
