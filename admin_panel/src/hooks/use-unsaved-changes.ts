'use client';
import {useEffect} from 'react';
/** Warn on browser close or ordinary same-tab navigation while edits are unsaved. */
export function useUnsavedChanges(dirty:boolean){
 useEffect(()=>{
  if(!dirty)return;
  const before=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};
  const click=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const link=(event.target as Element|null)?.closest('a[href]') as HTMLAnchorElement|null;
   if(!link||link.target==='_blank'||link.hasAttribute('download')||link.href===location.href)return;
   if(!window.confirm('Kaydedilmemiş değişiklikler var. Sayfadan ayrılmak istiyor musunuz?')){event.preventDefault();event.stopPropagation();}
  };
  window.addEventListener('beforeunload',before);document.addEventListener('click',click,true);
  return()=>{window.removeEventListener('beforeunload',before);document.removeEventListener('click',click,true);};
 },[dirty]);
}
