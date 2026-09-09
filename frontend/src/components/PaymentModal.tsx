'use client';
import { useEffect, useRef, useState } from 'react';
interface PaymentModalProps {show: boolean; onClose: () => void; checkoutFormContent?: string; iframeUrl?: string; title?: string; notice?: string;}
export default function PaymentModal({show,onClose,checkoutFormContent,iframeUrl,title='Ödeme',notice}: PaymentModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const checkout = useRef<HTMLDivElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [slow,setSlow] = useState(false);
  const [retry,setRetry] = useState(0);
  useEffect(()=>{
    const node = dialog.current;
    if (!show || !node) return;
    const previous = document.activeElement as HTMLElement | null;
    node.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return ()=>{node.close(); document.body.style.overflow=overflow; previous?.focus();};
  },[show]);
  useEffect(()=>{
    if (!show) return;
    setSlow(false);
    const timer = setTimeout(()=>setSlow(true),20000);
    timeout.current = timer;
    const container = checkout.current;
    if (container && checkoutFormContent) {
      container.innerHTML = checkoutFormContent;
      container.querySelectorAll('script').forEach(old=>{
        const script=document.createElement('script');
        if(old.src){script.src=old.src;script.async=true;}else script.textContent=old.textContent;
        script.onerror=()=>setSlow(true);
        old.replaceWith(script);
      });
    }
    return ()=>{clearTimeout(timer); if(container) container.replaceChildren();};
  },[show,checkoutFormContent,retry]);
  if (!show) return null;
  return <dialog ref={dialog} onCancel={onClose} aria-labelledby="payment-title" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-xl border border-border-soft bg-surface p-6 text-foreground backdrop:bg-black/50">
    <div className="flex items-center justify-between gap-4"><h2 id="payment-title" className="text-xl font-semibold">{title}</h2><button onClick={onClose} className="min-h-11 rounded-lg border border-border-soft px-3" aria-label="Ödeme penceresini kapat">Kapat</button></div>
    {notice && <p className="mt-4 text-sm leading-6 text-muted">{notice}</p>}
    <p className="my-4 text-sm text-muted">Pencereyi kapatmak ödemeyi iptal etmez. İşlem sonucunu hesabından kontrol et.</p>
    {slow && <div role="status" className="mb-4 rounded-lg border border-border-soft p-4"><p>Ödeme ekranı yüklenemedi veya yanıt gecikti. Ödeme yaptıysan yeniden başlatmadan işlem durumunu kontrol et.</p><button onClick={()=>setRetry(x=>x+1)} className="mt-2 font-semibold text-brand">Ekranı yeniden yükle</button></div>}
    {iframeUrl ? <iframe key={retry} src={iframeUrl} title="Kartla ödeme formu" onLoad={()=>{setSlow(false);if(timeout.current)clearTimeout(timeout.current);}} onError={()=>setSlow(true)} className="h-[65dvh] min-h-96 w-full border-0" /> : <div ref={checkout} />}
  </dialog>;
}
