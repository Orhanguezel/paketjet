'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getPaymentStatus } from '@/modules/payments/payments.service';
import type { PaymentStatus } from '@/modules/payments/payments.type';
import { ROUTES } from '@/config/routes';

function Result() {
  const ref = useSearchParams().get('ref');
  const [payment, setPayment] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!ref) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    let polls = 0;
    const refresh = async () => {
      try {
        const data = await getPaymentStatus(ref);
        if (!active) return;
        setPayment(data); setError('');
        if (['initializing','pending'].includes(data.state) && ++polls < 12) timer = setTimeout(refresh,5000);
      } catch { if (active) setError('Ödeme durumu alınamadı. Lütfen yeniden deneyin.'); }
    };
    void refresh();
    return () => {active = false; clearTimeout(timer);};
  }, [ref, attempt]);
  const success = payment?.state === 'completed';
  const review = payment && ['review','refund_pending'].includes(payment.state);
  const failed = payment?.state === 'failed';
  const title = !ref ? 'Ödeme referansı bulunamadı' : error ? 'Durum kontrol edilemedi' : success ? 'İşlemin tamamlandı' : review ? 'Ödemen inceleniyor' : failed ? 'Ödeme tamamlanmadı' : payment?.state === 'refunded' ? 'Ödeme iade edildi' : 'Ödeme sonucu bekleniyor';
  const target = payment?.kind === 'listing' && payment.ilan_id ? ROUTES.ilanlar.detail(payment.ilan_id) : ROUTES.panel.ilanAlmaHakki;
  return <section className="mx-auto my-12 w-full max-w-lg rounded-xl border border-border-soft bg-surface p-6 sm:p-10" aria-live="polite">
    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
    <p className="mt-4 leading-7 text-muted">{!ref ? 'İşlem geçmişinden veya destek üzerinden ödemenizi kontrol edebilirsiniz.' : error || (success ? payment.kind === 'listing' ? 'İletişim bilgilerine artık ilan üzerinden erişebilirsin.' : 'Satın aldığın haklar hesabına eklendi.' : review ? 'Bu işlem için yeniden ödeme yapma. Tahsilat ve erişim durumu kontrol ediliyor; gerektiğinde iade süreci takip edilecek.' : failed ? 'Bu işlemle erişim veya hak eklenmedi. İşlem geçmişini kontrol edebilirsin.' : 'Sağlayıcı bildirimi geldiğinde durum güncellenecek. Bu ekranı kapatmak ödemeyi iptal etmez.')}</p>
    {payment && <p className="mt-4 text-sm text-muted">İşlem tutarı: {Number(payment.amount).toLocaleString('tr-TR',{style:'currency',currency:'TRY'})}</p>}
    <div className="mt-6 flex flex-wrap gap-3">
      {success ? <Link className="rounded-lg bg-action px-5 py-3 font-semibold text-white" href={target}>{payment.kind === 'listing' ? 'İletişim bilgilerini gör' : 'Haklarımı gör'}</Link> : ref && <button className="rounded-lg bg-action px-5 py-3 font-semibold text-white" onClick={()=>setAttempt(x=>x+1)}>Durumu yenile</button>}
      <Link className="rounded-lg border border-border-soft px-5 py-3 text-foreground" href="/destek">Destek</Link>
    </div>
  </section>;
}
export default function PaymentResultPage() { return <Suspense fallback={<p role="status">Ödeme kontrol ediliyor…</p>}><Result /></Suspense>; }
