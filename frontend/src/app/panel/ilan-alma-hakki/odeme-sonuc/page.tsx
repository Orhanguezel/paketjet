'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { checkShopierPayment, getBankOrder, getPaymentStatus, reportBankTransfer } from '@/modules/payments/payments.service';
import { storedCheckoutUrl } from '@/lib/checkout-tab';
import type { BankOrderStatus, PaymentStatus } from '@/modules/payments/payments.type';
import { ROUTES } from '@/config/routes';

function Result() {
  const ref = useSearchParams().get('ref');
  const [payment, setPayment] = useState<PaymentStatus | null>(null);
  const [bank, setBank] = useState<BankOrderStatus | null>(null);
  const [reporting, setReporting] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [checking, setChecking] = useState(false);
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
        if (data.provider === 'bank_test' || data.provider === 'bank_transfer') {
          setBank(await getBankOrder(ref));
        } else if (['initializing','pending'].includes(data.state)) {
          const shopier = data.provider === 'shopier';
          // Shopier: 10 dk boyunca izle; webhook gecikirse 30 sn'de bir siparisi kendimiz sorgulatiriz.
          if (shopier && polls > 0 && polls % 6 === 0) await checkShopierPayment(ref).catch(() => undefined);
          if (++polls < (shopier ? 120 : 12)) timer = setTimeout(refresh,5000);
        }
      } catch { if (active) setError('Ödeme durumu alınamadı. Lütfen yeniden deneyin.'); }
    };
    void refresh();
    return () => {active = false; clearTimeout(timer);};
  }, [ref, attempt]);
  const success = payment?.state === 'completed';
  const test = payment?.provider === 'bank_test';
  const review = payment && ['review','refund_pending'].includes(payment.state);
  const failed = payment?.state === 'failed';
  const shopier = payment?.provider === 'shopier';
  const waiting = !!payment && ['initializing','pending'].includes(payment.state);
  const checkoutUrl = ref && shopier && waiting ? storedCheckoutUrl(ref) : null;
  const title = !ref ? 'Ödeme referansı bulunamadı' : error ? 'Durum kontrol edilemedi' : success ? test ? 'Test işlemin tamamlandı' : 'İşlemin tamamlandı' : review ? 'Ödemen inceleniyor' : failed ? 'Ödeme tamamlanmadı' : payment?.state === 'refunded' ? 'Ödeme iade edildi' : bank ? 'Havale talebin oluşturuldu' : shopier && waiting ? 'Ödemeni Shopier sayfasında tamamla' : 'Ödeme sonucu bekleniyor';
  const target = payment?.kind === 'listing' && payment.ilan_id ? ROUTES.ilanlar.detail(payment.ilan_id) : ROUTES.panel.ilanAlmaHakki;
  return <section className="mx-auto my-12 w-full max-w-lg rounded-xl border border-border-soft bg-surface p-6 sm:p-10" aria-live="polite">
    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
    <p className="mt-4 leading-7 text-muted">{!ref ? 'İşlem geçmişinden veya destek üzerinden ödemenizi kontrol edebilirsiniz.' : error || (success ? test ? payment.kind === 'listing' ? 'Test iletişim erişimi açıldı. Gerçek tahsilat yapılmadı.' : 'Test hakkı hesabına eklendi. Gerçek tahsilat yapılmadı.' : payment.kind === 'listing' ? 'İletişim bilgilerine artık ilan üzerinden erişebilirsin.' : 'Satın aldığın haklar hesabına eklendi.' : review ? bank ? 'Bildirimin yönetici incelemesinde. Onaydan önce hak veya iletişim açılmaz.' : 'Bu işlem için yeniden ödeme yapma. Tahsilat ve erişim durumu kontrol ediliyor; gerektiğinde iade süreci takip edilecek.' : failed ? 'Bu işlemle erişim veya hak eklenmedi. İşlem geçmişini kontrol edebilirsin.' : bank ? bank.mode==='test' ? 'Bu yalnızca test talebidir. Gerçek para gönderme. Bildirimi yaptıktan sonra yönetici test onayı beklenir.' : 'Aşağıdaki banka hesabına tam tutarı gönder. Açıklamaya işlem referansını yaz. Hak veya iletişim ancak banka hareketi doğrulandığında açılır.' : shopier && waiting ? 'Açılan Shopier sekmesinde ödemeyi bitir. Ödeme tamamlanınca bu sayfa kendiliğinden güncellenir. Shopier sekmesini kapatsan bile ödemen kaybolmaz; aşağıdan kontrol edebilirsin.' : 'Sağlayıcı bildirimi geldiğinde durum güncellenecek. Bu ekranı kapatmak ödemeyi iptal etmez.')}</p>
    {payment && <p className="mt-4 text-sm text-muted">İşlem tutarı: {Number(payment.amount).toLocaleString('tr-TR',{style:'currency',currency:'TRY'})}</p>}
    {bank && !success && !failed && <div className="mt-5 space-y-2 rounded-lg border border-border-soft p-4 text-sm"><p><strong>İşlem referansı:</strong> <span className="break-all font-mono">{ref}</span></p><p><strong>Son bildirim zamanı:</strong> {new Date(bank.expires_at).toLocaleString('tr-TR')}</p>{bank.mode==='real'&&bank.bank_details?<><p><strong>Banka:</strong> {bank.bank_details.bank_name}</p><p><strong>Alıcı:</strong> {bank.bank_details.account_name}</p><p><strong>IBAN:</strong> <span className="break-all font-mono">{bank.bank_details.iban}</span></p><p><strong>Havale açıklaması:</strong> <span className="break-all">{bank.transfer_description}</span></p></>:bank.mode==='real'?<p role="alert">Banka bilgileri şu anda gösterilemiyor. Para göndermeden destekle görüş.</p>:<p className="font-semibold">TEST İŞLEMİ · Para göndermeyin</p>}</div>}
    <div className="mt-6 flex flex-wrap gap-3">
      {bank && payment?.state==='pending' && <button disabled={reporting||bank.mode==='real'&&!bank.bank_details} className="rounded-lg bg-action px-5 py-3 font-semibold text-white disabled:opacity-50" onClick={async()=>{if(!ref)return;setReporting(true);try{await reportBankTransfer(ref);setAttempt(x=>x+1);}catch{setError('Bildirim kaydedilemedi. Yeniden deneyin.');}finally{setReporting(false);}}}>{reporting?'Gönderiliyor…':bank.mode==='test'?'Test bildirimini gönder':'Havaleyi yaptım'}</button>}
      {checkoutUrl && <a className="rounded-lg bg-action px-5 py-3 font-semibold text-white" href={checkoutUrl} target="_blank" rel="noopener noreferrer">Ödeme sayfasını aç</a>}
      {shopier && ref && (waiting || payment?.state === 'review') && <button disabled={checking} className="rounded-lg border border-border-soft px-5 py-3 font-semibold text-foreground disabled:opacity-50" onClick={async()=>{setChecking(true);try{await checkShopierPayment(ref);}catch{setError('Ödeme kontrol edilemedi. Biraz sonra yeniden dene.');}finally{setChecking(false);setAttempt(x=>x+1);}}}>{checking?'Kontrol ediliyor…':'Ödememi kontrol et'}</button>}
      {success ? <Link className="rounded-lg bg-action px-5 py-3 font-semibold text-white" href={target}>{payment.kind === 'listing' ? 'İletişim bilgilerini gör' : 'Haklarımı gör'}</Link> : ref && <button className="rounded-lg bg-action px-5 py-3 font-semibold text-white" onClick={()=>setAttempt(x=>x+1)}>Durumu yenile</button>}
      <Link className="rounded-lg border border-border-soft px-5 py-3 text-foreground" href="/destek">Destek</Link>
    </div>
  </section>;
}
export default function PaymentResultPage() { return <Suspense fallback={<p role="status">Ödeme kontrol ediliyor…</p>}><Result /></Suspense>; }
