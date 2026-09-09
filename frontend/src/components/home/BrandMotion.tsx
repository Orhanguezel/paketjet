'use client';
import {useEffect, useRef, useState} from 'react';
import {Pause, Play} from 'lucide-react';
import {useAmbientMotion} from './useAmbientMotion';
export default function BrandMotion() {
  const {root, running, visible, hidden, reduced, paused, setPaused} = useAmbientMotion();
  const video=useRef<HTMLVideoElement>(null);
  const [loaded,setLoaded]=useState(false),[playing,setPlaying]=useState(false),[failed,setFailed]=useState(false);
  const [manual,setManual]=useState(false);
  useEffect(()=>{if(visible&&!reduced)setLoaded(true);},[visible,reduced]);
  useEffect(()=>{
    const element=video.current;
    if(!element||!loaded)return;
    if((running||(manual&&visible&&!paused))&&!hidden)void element.play().catch(()=>setPlaying(false));
    else element.pause();
  },[running,loaded,manual,visible,paused,hidden]);
  return <div ref={root} className="brand-motion">
    <video ref={video} poster="/assets/motion/brand-poster.webp" src={loaded?'/uploads/media/hero/arkaplan.mp4':undefined} preload="none" muted loop playsInline aria-label="PaketJet marka animasyonu" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setFailed(true)}/>
    <div className="brand-motion-bar"><span>Yollar insanları buluşturur.</span>{failed?<span role="status">Animasyon şu anda oynatılamıyor.</span>:<button type="button" aria-label={playing?'Marka animasyonunu duraklat':'Marka animasyonunu oynat'} onClick={()=>{if(playing){setPaused(true);setManual(false);video.current?.pause();}else{setLoaded(true);setPaused(false);setManual(true);void video.current?.play().catch(()=>{});}}}>{playing?<Pause size={17}/>:<Play size={17}/>}<span>{playing?'Duraklat':'Oynat'}</span></button>}</div>
  </div>;
}
