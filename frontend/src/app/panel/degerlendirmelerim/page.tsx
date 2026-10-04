'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ROUTES } from '@/config/routes';
import { getEligibleRatings, submitPurchaseRating } from '@/modules/rating/member-rating.service';
import type { EligibleRating } from '@/modules/rating/member-rating.type';

function RatingForm({ item, onSaved }: { item: EligibleRating; onSaved: () => void }) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!score || busy) return;
    setBusy(true); setError('');
    try { await submitPurchaseRating(item.purchase_id, score, comment); onSaved(); }
    catch { setError('Değerlendirme kaydedilemedi. Yeniden dene.'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="mt-4 space-y-3 border-t border-border pt-4">
    <fieldset><legend className="text-sm font-medium">İletişim deneyimini puanla</legend><div className="mt-2 flex gap-1">{[1,2,3,4,5].map(value=><button type="button" key={value} aria-label={`5 üzerinden ${value} yıldız`} aria-pressed={score===value} onClick={()=>setScore(value)} className="min-h-11 min-w-11 text-2xl text-brand">{value<=score?'★':'☆'}</button>)}</div></fieldset>
    <label className="block text-sm">Yorum (isteğe bağlı)<textarea maxLength={500} value={comment} onChange={event=>setComment(event.target.value)} className="mt-2 block min-h-24 w-full rounded-lg border border-border bg-surface p-3"/></label>
    {error&&<p role="alert" className="text-sm text-danger">{error}</p>}
    <button disabled={!score||busy} className="min-h-11 rounded-lg bg-action px-5 font-semibold text-on-dark disabled:opacity-50">{busy?'Kaydediliyor…':'Değerlendirmeyi gönder'}</button>
  </form>;
}

export default function MyRatingsPage() {
  const [rows, setRows] = useState<EligibleRating[] | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(async () => { try { setRows((await getEligibleRatings()).data); setError(''); } catch { setError('İşlemler alınamadı. Yeniden deneyebilirsin.'); } }, []);
  useEffect(() => { void load(); }, [load]);
  return <div className="space-y-6"><div><h1 className="text-3xl font-semibold">Değerlendirmelerim</h1><p className="mt-2 text-muted">İletişim erişimi açılmış işlemlerde karşı tarafı 5 yıldız üzerinden bir kez değerlendirebilirsin.</p></div>{error&&<p role="alert">{error} <button onClick={load} className="text-brand underline">Yeniden dene</button></p>}{rows===null&&!error&&<p role="status">İşlemler yükleniyor…</p>}{rows?.length===0&&<p className="rounded-lg border border-border bg-surface p-6">Henüz değerlendirilebilecek bir işlemin yok.</p>}{rows?.map(item=><article key={item.purchase_id} className="rounded-lg border border-border bg-surface p-6"><h2 className="font-semibold">{item.title}</h2><p className="mt-2 text-sm">Karşı taraf: <Link href={ROUTES.static.uye(item.member_id)} className="text-brand underline">{item.member_name}</Link></p>{item.rated?<p className="mt-4 text-sm text-muted">Bu işlem için değerlendirmen kaydedildi.</p>:<RatingForm item={item} onSaved={()=>void load()}/>}</article>)}</div>;
}
