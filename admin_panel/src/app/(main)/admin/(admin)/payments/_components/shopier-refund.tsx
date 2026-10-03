'use client';
import { useId, useState } from 'react';
import { useRefundPaymentMutation, useSyncPaymentRefundMutation } from '@/integrations/hooks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

/** Shopier kart odemesinin tam iadesi. Hak/erisim yalniz Shopier iadeyi "basarili" bildirince geri alinir. */
export default function ShopierRefund({ reference, state, hasOrder, refundRequested, onDone }: { reference: string; state: string; hasOrder: boolean; refundRequested: boolean; onDone: () => void }) {
  const id = useId();
  const [note, setNote] = useState(''), [confirmed, setConfirmed] = useState(false), [message, setMessage] = useState('');
  const [refund, refunding] = useRefundPaymentMutation(), [sync, syncing] = useSyncPaymentRefundMutation();
  const canRefund = hasOrder && !refundRequested && ['completed', 'review', 'refund_pending'].includes(state);
  if (state === 'refunded') return <p className="rounded-md border p-3 text-sm">Bu ödeme Shopier üzerinden iade edildi; hak veya iletişim erişimi geri alındı.</p>;
  return (
    <section className="space-y-3 rounded-md border p-4">
      <h3 className="font-semibold">Shopier iadesi</h3>
      {refundRequested ? (
        <>
          <p className="text-sm text-muted-foreground">İade Shopier'e iletildi. Shopier iadeyi tamamladığında durum otomatik güncellenir; beklemek istemezsen aşağıdan yenile.</p>
          <Button variant="outline" disabled={syncing.isLoading} onClick={async () => { try { const r = await sync(reference).unwrap(); setMessage(`Güncel durum: ${r.state ?? 'bilinmiyor'}`); onDone(); } catch { setMessage("İade durumu Shopier'den alınamadı. Biraz sonra yeniden deneyin."); } }}>İade durumunu yenile</Button>
        </>
      ) : canRefund ? (
        <form className="space-y-3" onSubmit={async (e) => { e.preventDefault(); try { const r = await refund({ ref: reference, note }).unwrap(); setMessage(r.state === 'refunded' ? 'İade tamamlandı.' : "İade Shopier'e iletildi; sonucu bekleniyor."); onDone(); } catch (err) { const code = (err as { data?: { error?: { message?: string } } }).data?.error?.message; setMessage(code === 'provider_rejected' ? 'Shopier iadeyi kabul etmedi. Kayıt incelemeye alındı; Shopier panelinden kontrol edin.' : 'İade başlatılamadı. Ödeme durumu değişmiş olabilir; detayı yenileyin.'); onDone(); } }}>
          <p className="text-sm text-muted-foreground">Tutarın tamamı kartına iade edilir. Hak paketiyse kullanılmamış haklar düşülür, ilan iletişimiyse erişim kapanır. Kısmi iade için Shopier panelini kullanın; kayıt incelemeye düşer.</p>
          <label htmlFor={`${id}-note`} className="block space-y-2 text-sm">Alıcıya iade notu</label><Textarea id={`${id}-note`} required minLength={5} maxLength={250} value={note} onChange={(e) => setNote(e.target.value)} />
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" required checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />Tutarın tamamını iade etmek istiyorum</label>
          <Button type="submit" variant="destructive" disabled={!confirmed || refunding.isLoading}>Shopier'den iade et</Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">Bu kayıt için iade başlatılamaz: doğrulanmış bir Shopier siparişi yok veya ödeme tamamlanmadı.</p>
      )}
      {message && <output className="block text-sm">{message}</output>}
    </section>
  );
}
