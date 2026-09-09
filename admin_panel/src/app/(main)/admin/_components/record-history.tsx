'use client';
import {useContentRevisionsQuery,useListingHistoryQuery} from '@/integrations/hooks';
import {formatIlanPurchaseDate} from '@/integrations/shared';
export function ContentHistory({id}:{id:string}){
 const q=useContentRevisionsQuery(id);
 return <section className="space-y-3"><h3 className="font-semibold">Korunan içerik sürümleri</h3>{q.isError?<p role="alert">Sürüm geçmişi alınamadı.</p>:q.isLoading?<output>Yükleniyor…</output>:q.data?.map(row=><details key={row.id} className="rounded-md border p-3"><summary className="cursor-pointer text-sm">{formatIlanPurchaseDate(row.created_at)} · {row.id.slice(0,12)}</summary><p className="mt-2 break-all font-mono text-xs">{row.slug}@{row.id}</p><pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap break-words text-xs">{String(row.snapshot.content??'')}</pre></details>)}{q.data?.length===0&&<p className="text-sm text-muted-foreground">İlk içerik değişikliğinde önceki sürüm burada korunur.</p>}</section>;
}
export function ListingHistory({id}:{id:string}){
 const q=useListingHistoryQuery(id);
 return <section className="space-y-3"><h3 className="font-semibold">İşlem geçmişi</h3>{q.isError?<p role="alert">Geçmiş alınamadı.</p>:q.isLoading?<output>Yükleniyor…</output>:<><ul className="space-y-2 text-sm">{q.data?.events.map(row=><li key={row.id} className="rounded-md border p-3"><p>{row.previous_status??'Yeni'} → {row.status}</p><p className="break-all text-xs text-muted-foreground">{formatIlanPurchaseDate(row.created_at)} · {row.actor_id}</p></li>)}</ul>{q.data?.purchases.map(row=><p key={row.id} className="break-all text-sm">Alıcı: {row.buyer_id} · {row.status} · {formatIlanPurchaseDate(row.created_at)}</p>)}{!q.data?.events.length&&!q.data?.purchases.length&&<p className="text-sm text-muted-foreground">Bu eski kayıt için denetim olayı henüz yok.</p>}</>}</section>;
}
